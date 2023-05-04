CREATE DATABASE AirwayAtlas;

USE AirwayAtlas;

CREATE TABLE countries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE regions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    country_id INT,
    FOREIGN KEY (country_id) REFERENCES countries(id)
);

CREATE TABLE airports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip_code VARCHAR(10),
    iata_code VARCHAR(3),
    icao_code VARCHAR(4) NOT NULL UNIQUE,
    region_id INT,
    FOREIGN KEY (region_id) REFERENCES regions(id)
);
