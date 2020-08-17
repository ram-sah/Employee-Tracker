-- insert values for department table
INSERT INTO department(name)
VALUES
  ('Sales'),
  ('Engineering'),
  ('Finance'),
  ('Legal'),
  ("Delivery");
  -- insert values for role table
INSERT INTO role(role_title, salary, department_id)
VALUES
  ('"Manager"', 110000 , 1),
  ('Salesperson', 55000 , 3),
  ('Lead Engineer', 102000, 2),
  ('Software Enginner', 85000, 1),
  ('Accountant', 105000, 3),
  ('Legal Team Lead', 100000, 4),
  ('Lawyer', 105000, 5);
  -- insert values for employee table
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
  ('Kevin', 'varga', 7, 4),
  ('Mohan', 'Sah', 1, 3),
  ('Tam', 'Bam', 2, 4),
  ('John', 'varga', 3, NULL),
  ('Dave', 'Doe', 4, 2),
  ('Jim', 'kuma', 5, 1),
  ('piter', 'Duma', 6, 3);   

Select * from department;
Select * from role;
Select * from employee;