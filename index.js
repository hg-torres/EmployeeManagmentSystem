const { prompt } = require('inquirer')
const mysql = require('mysql2')
require('console.table')

// Create connection with my sql and databse
const db = mysql.createConnection('mysql://root:rootroot@localhost:3306/employee_db')
db.connect(err => {
  if (err) console.log(err);
  promptUser()
});


async function promptUser() {
  await prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: ['View Deparments', 'View Roles', 'View Employees', 'Add Deparment', 'Add Role', 'Add Employee', 'Update Employee Role', 'Quit']
    }
  ])
    .then(answers => {
      
      switch (answers.choice) {
        case 'View Deparments':
          viewDeparments()
          break;
        case 'View Roles':
          viewRoles()
          break;
        case 'View Employees':
          viewEmployees()
          break;
        case 'Add Deparment':
          addDepartment()
          break;
        case 'Add Role':
          addRole()
          break;
        case 'Add Employee':
          addEmployee()
          break;
        case 'Update Employee Role':
          updateEmployeeRole()
          break;
        default:
          quit()
          break;
      }
    })
    .catch( err => console.log(err))
}



function viewDeparments() {
  db.query('SELECT * FROM department', (err, res) => {
    if (err) console.log(err)
    console.log('Viewing all Deparments:\n')
    console.table(res)
    promptUser()
  })
}

function viewRoles() {
  db.query('SELECT * FROM role', (err, res) => {
    if (err) console.log(err)
    console.log('Viewing all Roles:\n')
    console.table(res)
    promptUser()
  })
}

function viewEmployees() {
  db.query('SELECT * FROM employee', (err, res) => {
    if (err) console.log(err)
    console.log('Viewing all Employees:\n')
    console.table(res)
    promptUser()
  })
}
function addEmployee() {
  prompt([
    {
      type: 'input',
      message: "What is the employee first name?",
      name: 'first_Name'
    },
    {
      type: 'input',
      message: "What is the employee last name?",
      name: 'last_Name'
    },
    {
      type: 'input',
      message: "What is the employee's role ID?",
      name: 'role_id'
    },
    {
      type: 'input',
      message: "What is the employees's manager ID",
      name: 'manager_id'
    }
  ])
    .then(res => {
      console.log(res)
      db.query('INSERT INTO employee SET ?', res, err => {
        if (err) { console.log(err) }
        console.log('New Employee Added')
        promptUser()
      })
    })
}

function addDepartment() {
  prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of the new department?'
    }
  ])
    .then(res => {
      console.log(res)
      db.query('INSERT INTO department SET ?', res, err => {
        if (err) { console.log(err) }
        console.log('New Department Added')
        promptUser()
      })
    })
}

function addRole() {
  prompt([
    {
      type: 'input',
      message: "What is title of the role?",
      name: 'title'
    },
    {
      type: 'input',
      message: "What is the salary of the role?",
      name: 'salary'
    },
    {
      type: 'input',
      message: "What is the department ID?",
      name: 'department_id'
    }
  ])
    .then(res => {
      console.log(res)
      db.query('INSERT INTO role SET ?', res, err => {
        if (err) { console.log(err) }
        console.log('New Role Added')
        promptUser()
      })
    })
}

function quit() {
  console.log("Exiting...");
  process.exit();
}

function updateEmployeeRoles() {
  db.query('SELECT * FROM employee', (res, err) => {
    if (err) { console.log(err) }
    console.table(res)
    prompt([
      {
        type: 'input',
        message: "Which employee would you like to update? (Type in first name)",
        name: 'first_name'
      },
      {
        type: 'input',
        message: "What is the employee new role id?",
        name: 'role_id'
      }
    ])
      .then(response => {
        db.query('UPDATE employee SET ? WHERE ?', [{ role_id: response.role_id }, { first_name: response.first_name }], () => {
          if (err) { console.log(err) }
          console.log('Employee Role Updated')
          promptUser()
        })
      })
  })
}

