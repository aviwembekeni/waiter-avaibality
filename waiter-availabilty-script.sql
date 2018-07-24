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

INSERT INTO users
	(user_name, full_name, user_type)
VALUES
	('johnwick', 'John Wick', 'waiter');

INSERT INTO users
	(user_name, full_name, user_type)
VALUES
	('johndoe', 'John Doe', 'waiter');

INSERT INTO users
	(user_name, full_name, user_type)
VALUES
	('aviwembekeni', 'Aviwe Mbekeni', 'admin');

INSERT INTO shifts
	(waiter_id, weekday_id)
VALUES
	(1, 1);

INSERT INTO shifts
	(waiter_id, weekday_id)
VALUES
	(1, 2);

INSERT INTO shifts
	(waiter_id, weekday_id)
VALUES
	(1, 3);

INSERT INTO shifts
	(waiter_id, weekday_id)
VALUES
	(2, 3);

INSERT INTO shifts
	(waiter_id, weekday_id)
VALUES
	(2, 4);

INSERT INTO shifts
	(waiter_id, weekday_id)
VALUES
	(2, 5);

INSERT INTO shifts
	(waiter_id, weekday_id)
VALUES
	(3, 5);

INSERT INTO shifts
	(waiter_id, weekday_id)
VALUES
	(3, 6);

INSERT INTO shifts
	(waiter_id, weekday_id)
VALUES
	(3, 7);