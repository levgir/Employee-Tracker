USE employeeTracker;

INSERT INTO department (name)
VALUES ("Patrol"), ("Investigations"), ("Support Services");

INSERT INTO role (title, salary, department_id)
VALUES ("Officer", 65000, 1), ("Patrol Sergeant", 80000, 1), ("Patrol Lieutenant", 100000, 1), ("Commander", 80000, 1), ("Detective", 80000, 2), ("Investigations Sergeant", 90000, 2), ("Investigations Lieutenant", 100000, 2), ("Administration Assistant", 65000, 3), ("Crime Analyst", 75000, 3), ("Manager", 90000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Smith", 1, 2), ("Jim", "Costigan", 2, 3), ("Brad", "Qualley", 3, 4), ("Mark", "Fleecs", 4, 0), ("Alex", "Ziwak", 5, 6), ("Richard", "Seeley", 6, 7), ("Steve", "Marshall", 3, 4), ("Jayden", "James", 8, 4), ("Levi", "Giraud", 9, 10), ("Emily", "Pabst", 10, 0);
