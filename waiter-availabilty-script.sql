drop table if exists users, weekdays, shifts;

create table users
(
	id serial not null primary key,
	user_name text not null,
	full_name text not null,
	user_type text not null
);

create table weekdays
(
	id serial not null primary key,
	day_name varchar(20)
);

create table shifts
(
	id serial not null primary key,
	waiter_id int not null,
	weekday_id int not null,
	foreign key (waiter_id) references users(id),
	foreign key (weekday_id) references weekdays(id)
);

INSERT INTO weekdays
	(day_name)
values
	('Monday');
INSERT INTO weekdays
	(day_name)
values
	('Tuesday');
INSERT INTO weekdays
	(day_name)
values
	('Wednesday');
INSERT INTO weekdays
	(day_name)
values
	('Thursday');
INSERT INTO weekdays
	(day_name)
values
	('Friday');
INSERT INTO weekdays
	(day_name)
values
	('Saturday');
INSERT INTO weekdays
	(day_name)
values
	('Sunday');

