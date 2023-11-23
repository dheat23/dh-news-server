# Northcoders News API

A version of this API is hosted at https://dh-news-server.onrender.com/api

## Summary ##

This repo serves as the backend API for a news website, with functionality like getting articles and comments, posting and deleting comments, etc. See some example requests and responses in the [Usage](#usage) section.

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

## Testing ##

To run the utils and app tests (the test database is re-seeded for each test so no need to seed beforehand):
```
npm test
```
## Usage ##

This section details a few of the API endpoints with example responses. For a full list view the endpoints.json file or make a GET request to /api:

* **GET /api/articles** 
    * Serves an array of all articles
* **GET /api/comments** 
    * Serves an array of all comments
* **GET /api/articles/:article_id/comments** 
    * Serves an array of comments with the given article ID
* **POST /api//articles/:article_id/comments** 
    * Posts a new comment with the given article ID
* **DELETE /api/comments/:comment_id**
    * Deletes the comment with the given comment ID

