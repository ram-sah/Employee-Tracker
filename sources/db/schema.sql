-- Drops the employee if it exists currently --DROP DATABASE IF EXISTS employees_db;
DROP DATABASE IF EXISTS employees_db;
-- Creates the "employee" database --
CREATE database employees_db;
-- Use employee Database--
USE employees_db;
-- Creates the table "department" within employee --
CREATE TABLE department (
  -- Creates a numeric column called "id" automatically increment value as we create new rows --
  id INTEGER UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) UNIQUE NOT NULL   
);
-- Creates the table "role" within employee --
CREATE TABLE role (
  id INTEGER UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) UNIQUE NOT NULL,
  salary DECIMAL UNSIGNED NOT NULL,
  department_id INT UNSIGNED NOT NULL


);
-- Creates the table "employee" within employee --
CREATE TABLE employee (
  id INTEGER UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT UNSIGNED NOT NULL,
  manager_id INT UNSIGNED

  
);