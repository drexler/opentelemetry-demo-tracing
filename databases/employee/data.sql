
drop table if exists employee;

create table employee (
   id serial,
   name varchar(100),
   address varchar(100),
   ssn varchar(11), 
   marital_status boolean
);

insert into employee(name, address, ssn, marital_status) values ('Bilbo Baggins', '12 Underhill Lane', '012-34-5678', false);
insert into employee(name, address, ssn, marital_status) values ('Saruman', '34 Orthanc Heights', '123-45-6789', false);
insert into employee(name, address, ssn, marital_status) values ('Sauron', '12 Underhill Lane', '012-34-5678', false);
insert into employee(name, address, ssn, marital_status) values ('Gandalf', '12 Underhill Lane', '012-34-5678', false);
insert into employee(name, address, ssn, marital_status) values ('Azog', '12 Underhill Lane', '012-34-5678', true);
insert into employee(name, address, ssn, marital_status) values ('Darth Sidious', '9 Starkiller Base Way', '012-34-5678', true);