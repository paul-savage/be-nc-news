# Northcoders News API

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by Northcoders.

The API was built for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as Reddit) which should provide this information to the front end architecture.

The database utilised is PostgreSQL, and you may interact with it using node-postgres.

## Hosted version of the project:

A hosted version of this project may be accessed at:

https://pauls-be-nc-news.onrender.com/

Accessing:

https://pauls-be-nc-news.onrender.com/api/

Will display a summary of the accessible endpoints, their interfaces and example responses.

## How to connect to the local databases used with this repo:

This repo requires access to both test and development databases.

You need to enable access to the database names through local environment variables.

These environment variables are initialised using two files which must be created in the root folder.

To access the development database, create a file called .env.development and insert the following line:

PGDATABASE=database_name

where database_name is the name of the development database.

To access the test database, create a file called .env.test and insert the following line:

PGDATABASE=database_name

where database_name is the name of the test database.

## Minimum versions of software required:

This project was developed and tested with the following versions of Node.js and PostgreSQL:

Node.js - v21.7.1

PostgreSQL - 14.11

To clone the repository, execute the following command in a terminal window:

git clone https://github.com/paul-savage/be-nc-news.git

To install all of the npm dependencies, execute the following command:

npm install

To create the development and test databases, execute the following command:

npm run setup-dbs

To populate the development database, execute the following command:

npm run seed

(The test database is reseeded each time the tests are run, to ensure a consistent starting point).

To run the tests on the utility functions, execute the following command:

npm test utils.test.js

To run the tests on all of the endpoints, execute the following command:

npm test app.test.js
