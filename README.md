# How to connect to the local databases used with this repo.

This repo requires access to both test and development databases.

You need to enable access the database names through local environment variables.

These environment variables are initialised using two files which must be created in the root folder.

To access the development database, create a file called .env.development and insert the following line:
PGDATABASE=database_name
Where database_name is the name of the development database.

To access the test database, create a file called .env.test and insert the following line:
PGDATABASE=database_name
Where database_name is the name of the test database.
