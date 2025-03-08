****Run the following SQL script in your MySQL server*********

  CREATE DATABASE IF NOT EXISTS users_management;
  USE users_management;
  
  CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nom VARCHAR(255) NOT NULL,
      prenom VARCHAR(255) NOT NULL,
      cin VARCHAR(20) NOT NULL UNIQUE,
      date_naissance DATE NOT NULL,
      lieu_naissance VARCHAR(255) NOT NULL,
      sexe VARCHAR(10) NOT NULL,
      adresse VARCHAR(255) NOT NULL,
      nationalite VARCHAR(100) NOT NULL,
      date_expiration DATE NOT NULL,
      cin_document VARCHAR(255) NOT NULL
  );

  To run this app: 
    1) cd backend 
        python server.py
    2) cd frontend 
        npm start
  
