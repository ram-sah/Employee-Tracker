USE employees_db;
SELECT department.id, first_name, last_name, role_id, manager_id, role_title,
salary from department
LEFT JOIN role on department.id = role.department_id
LEFT JOIN employee on role.id = employee.role_id;


USE employees_db;
SELECT E.id, E.first_name, E.last_name, role_title, dt.name, salary, E.manager_id, m.first_name
FROM department dt 
left join role on dt.id = role.department_id 
left join employee E on role.id = E.role_id 
left join employee m on m.id = E.manager_id
ORDER BY E.id ASC

