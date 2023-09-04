/*
            -----blood bank management system database schema----- 
tables:
1.user_details
2.user_health
3.emp_details
4.blood_stocks
5.user_blood_reqs
6.user_blood_donate_reqs
7.user_password_reset_tokens
*/



CREATE DATABASE virtue_db;
USE virtue_db;

DROP TABLE IF EXISTS user_details;
DROP TABLE IF EXISTS user_health;
DROP TABLE IF EXISTS emp_details;
DROP TABLE IF EXISTS blood_stocks;
DROP TABLE IF EXISTS user_blood_reqs;
DROP TABLE IF EXISTS user_blood_donate_reqs;

/* 1.user_details*/ 

CREATE TABLE user_details (
  id INT PRIMARY KEY AUTO_INCREMENT,
  firstName VARCHAR(20),
  lastName VARCHAR(20),
  gender ENUM('Male', 'Female', 'Other'),
  bloodGroup ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
  place VARCHAR(45),
  email VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(100),
  mobile VARCHAR(15),
  profileImage VARCHAR(100),
  createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


/* 2.user_health*/

CREATE TABLE user_health (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT, 
    vitals VARCHAR(20) DEFAULT NULL,
    height INT DEFAULT NULL,
    weight INT DEFAULT NULL,
    status VARCHAR(20) DEFAULT NULL,
    donation_count INT DEFAULT 0, 
    createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_user_health_user_details` FOREIGN KEY (`user_id`) REFERENCES `user_details` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);



/* 3.emp_details*/


CREATE TABLE emp_details(
    id INT PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(20),
    lastName VARCHAR(20),
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100),
    mobile VARCHAR(15),
    createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* 4.blood_stocks*/

CREATE TABLE blood_stocks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
  unit INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_blood_group` (`blood_group`)
);

/* 5.user_blood_reqs */

CREATE TABLE user_request (
  req_id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  blood_group VARCHAR(5) NOT NULL,
  unit INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`req_id`),
  CONSTRAINT `fk_user_request_user_id` FOREIGN KEY (`user_id`) REFERENCES `user_details` (`id`) ON UPDATE CASCADE,
  UNIQUE KEY `unique_user_blood_group` (`user_id`, `blood_group`)
);


/* 6.user_blood_donate_reqs */

CREATE TABLE donation_requests (
  donation_request_id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`donation_request_id`),
  CONSTRAINT `fk_donation_request_user` FOREIGN KEY (`user_id`) REFERENCES `user_details` (`id`) ON UPDATE CASCADE,
  UNIQUE (`user_id`)
);


/* 7.user_password_reset_tokens */
CREATE TABLE user_password_reset_tokens (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  token VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_details(id) ON DELETE CASCADE ON UPDATE CASCADE
);
