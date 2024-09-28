CREATE DATABASE IF NOT EXISTS VivoTest;

USE VivoTest;

create table product (
	id varchar(255) not null,
	parent_id varchar(255),
	product_name varchar(255),
	product_type ENUM(
		'MOBILE',
		'LANDLINE',
		'INTERNET',
		'IPTV',
		'BUNDLE',
		'VALUE_ADDED_SERVICE'
	) NOT NULL,
	primary key (id)
);

create table users (
	id varchar(255) not null,
	city varchar(255),
	email varchar(255),
	name varchar(255),
	phone varchar(255),
	state varchar(255),
	primary key (id)
);

create table productdescription (
	id varchar(255) not null,
	text varchar(255),
	url varchar(255),
	category enum ('DATES', 'GENERAL', 'PROMOTION'),
	primary key (id)
);

create table userproduct (
	product_id varchar(255) not null,
	user_id varchar(255) not null,
	value float(23),
	end_date datetime(6),
	start_date datetime(6),
	description varchar(255),
	recurring_period varchar(255),
	type varchar(255),
	status enum (
		'ACTIVATING',
		'ACTIVE',
		'CANCELLED',
		'INACTIVE',
		'SUSPENDED'
	),
	primary key (product_id, user_id),
	FOREIGN KEY (user_id) REFERENCES users(id),
	FOREIGN KEY (product_id) REFERENCES product(id)
);
