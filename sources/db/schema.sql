-- Drops the employee if it exists currently --DROP DATABASE IF EXISTS employees_db;
DROP DATABASE IF EXISTS employees_db;
-- Creates the "employee" database --
CREATE database employees_db;
-- Use employee Database--
USE employees_db;
-- Creates the table "department" within employee --
CREATE TABLE department (
  -- Creates a numeric column called "id" automatically increment value as we create new rows --
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);
-- Creates the table "role" within employee --
CREATE TABLE role (
  id INTEGER AUTO_INCREMENT  NOT null PRIMARY KEY,
  role_title VARCHAR(30) NOT NULL,
  salary DECIMAL (10,2) NOT NULL,
  department_id INT
  -- foreign key(department_id) references department(id) ON DELETE CASCADE

);
-- Creates the table "employee" within employee --
CREATE TABLE employee (
  id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT default null
  -- foreign key(role_id) references role(id) ON DELETE CASCADE 
  -- foreign key(manager_id) references employee(id) ON DELETE CASCADE
);