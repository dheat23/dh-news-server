# Northcoders News API

A version of this API is hosted at https://dh-news-server.onrender.com/api

## Summary ##

Northcoders News API serves as the backend for a news website. The project consists of an API built using ExpressJS, which interacts with and serves content from a PostgreSQL database. The API was built using a TDD approach, with Jest and Supertest used for unit and integration testing. Husky was used for pre-commit hooks to ensure only tested code is committed. Functionality includes: 
* Getting an array of articles, with filtering and ordering queries
* Getting individual articles and patching the number of votes
* Getting an array of comments for an individual article and patching the number of votes
* Getting an array of users, or an individual user
* Getting an array of topics

See the full list of API endpoints in the [Usage](#usage) section.

## Getting Started ##

The following instructions outline how to use this repo locally.

### Prerequisites ###

* Node.js: v20.8.0
* PostgreSQL: v14.9

### Clone the Repository ###

Clone and cd into the repo: 
```
git clone https://github.com/dheat23/dh-news-server.git
cd dh-news-server
```
### Install Dependencies ###

Install the necessary dependencies: 
```
npm install
```

### Setup Databases ###

Setup and seed the dev and test databases: 
```
npm setup-dbs
npm seed
```

### Create Environment Variables ###

In order to connect to the two databases in this repo locally, you must create the necessary environment variables. Ensure you are in the root of the directory when creating the files:
```
echo 'PGDATABASE=nc_news' > .env.development
echo 'PGDATABASE=nc_news_test' > .env.test
```
### Start Server ###

To start the server locally, run:

```
npm start
```

This starts the server on port 9090, with the API interacting with the dev database; You can test the API by making requests to http://localhost:9090/ using a client like [Insomnia](https://insomnia.rest/). 
### Testing ###

To run the utils and app test suites (the test database is re-seeded for each test so no need to seed beforehand):
```
npm test
```
## Usage ##

This section lists all API endpoints. To view possible queries and the structure of request and response bodies, view the endpoints.json file or make a GET request to /api:
* **GET /api**
    * Serves a JSON representation of all available endpoints
* **GET /api/topics**
    * Serves an array of all topics
* **GET /api/articles** 
    * Serves an array of all articles
* **POST /api/articles**
    * Posts and serves a new article
* **GET /api/articles/:article_id**
    * Serves a single article with the given article_id
* **PATCH /api/articles/:article_id**
    * Patches an article's vote count and serves the updated article
* **GET /api/articles/:article_id/comments** 
    * Serves an array of all comments with the given article_id
* **POST /api//articles/:article_id/comments** 
    * Posts and serves a new comment with the given article_id
* **PATCH /api/comments/:comment_id**
    * Patches a comment's vote count and serves the updated comment
* **DELETE /api/comments/:comment_id**
    * Deletes the comment with the given comment_id
* **GET /api/users**
    * Serves an array of all users
* **GET /api/users/:username**
    * Serves a single user with the given username

## Acknowledgements

This project was created as part of the backend block of the [Northcoders](https://northcoders.com/) Software Development bootcamp. Thank you to everyone at Northcoders!