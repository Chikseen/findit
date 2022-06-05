CREATE TABLE IF NOT EXISTS Users (
    ID VARCHAR(64) NOT NULL PRIMARY KEY,
    Name varchar(255),
    Provider VARCHAR(255),
    Data TEXT
);