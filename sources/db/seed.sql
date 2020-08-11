INSERT INTO department
  (name)
VALUES
  ('Sales'),
  ('Engineering'),
  ('Finance'),
  ('Legal');
INSERT INTO role
  (title, salary, department_id)
VALUES
  ('Sales Lead', 65000 , 1),
  ('Salesperson', 55000 , 1),
  ('Lead Engineer', 105000, 2),
  ('Software Enginner', 85000, 2),
  ('Accountant', 105000, 3),
  ('Legal Team Lead', 125000, 4),
  ('Lawyer', 105000, 4);
INSERT INTO employee
  (first_name, last_name, role_id, manager_id)
VALUES
  ('Jay', 'Jam', 1, NULL),
  ('Tam', 'Bam', 2, 1),
  ('John', 'Lam', 3, NULL),
  ('Dave', 'kave', 4, 3),
  ('Kim', 'kery', 5, NULL),
  ('Nim', 'Nam', 6, NULL),
  ('Zin', 'Vam', 7, 6);
