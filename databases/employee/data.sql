
drop table if exists employee;

create extension if not exists "uuid-ossp";

create table employee (
   id uuid primary key default uuid_generate_v4 (),
   name varchar(100),
   address varchar(100),
   ssn varchar(11), 
   marital_status boolean
);

insert into employee(id, name, address, ssn, marital_status) values ('f34656d4-2b7a-4a26-952d-12e0e56624d8','Darkseid', '12 Apokolips Heights', '012-34-5678', false);
insert into employee(id, name, address, ssn, marital_status) values ('54d2176f-72ac-4d3f-b51c-3335af2eb4cc','Thanos', '34 Titan Boulevard', '123-45-6789', false);
insert into employee(id, name, address, ssn, marital_status) values ('e31ed5a2-85b3-47ab-bccb-25bb96f3feb7', 'Sauron', '1 Mordor Gardens', '012-34-5678', false);
insert into employee(id, name, address, ssn, marital_status) values ('185907ee-5989-41dc-98ee-6c5bd4f92340','Goldilocks', '1122 Old Bear Road', '012-34-5678', false);
insert into employee(id, name, address, ssn, marital_status) values ('ed8f1274-7a2f-45d1-86da-0bdf3e4e0055', 'Azog', '12 Gundabad Crags ', '012-34-5678', true);
insert into employee(id, name, address, ssn, marital_status) values ('dc0ca5c5-2239-42ec-8860-c367a78a6b63', 'Darth Sidious', '9 Starkiller Base', '012-34-5678', true);