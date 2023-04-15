CREATE DATABASE apprifas;
USE apprifas;

CREATE TABLE usuarios(
	idUsuario varchar(38) primary key,
	nombreUsuario varchar(20) unique not null,
	password varchar(255) not null,
	fechaCreacion datetime not null default current_timestamp()
);