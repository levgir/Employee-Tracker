DROP DATABASE IF EXISTS employeeTracker;
CREATE database employeeTracker;

USE employeeTracker;

CREATE TABLE department (
  id INT NOT NULL auto_increment,
  name VARCHAR(30),
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL auto_increment,
  title VARCHAR(30),
  salary decimal(15,2),
  department_id INT (5),
  PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INT NOT NULL auto_increment,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT (5),
  manager_id INT (5) NULL,
  PRIMARY KEY (id)
);