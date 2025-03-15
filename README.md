# Welcome to NC News!

## Introduction
NC News is a social news and discussion site (similar to Reddit) where users can post articles on various topics, comment on articles. This repository contains the backend API for the NC News application.

## Hosted version 
`https://nc-news-site.onrender.com`

## Features
- RESTful APIs with multiple endpoints
- Articles organized by topics with unique IDs
- User profiles 
- Comment functionality (post/patch/delete)
- Comment count for each article
- Query parameters for filtering and sorting
- Database with PostgreSQL

## Tech Stack
- **Node.js**
- **Express**
- **PostgreSQL**
- **Jest**
- **Supertest**

## API Endpoints

Endpoint | Method | Description                                                  

 - `/api`| GET | Serves all API endpoints
 - `/api/topics`| GET | Serves all topics
 - `/api/articles`| GET | Serves all articles
 - `/api/articles/:article_id`| GET | Serves an individual article by ID number
 - `/api/articles/:article_id/comments`| GET | Serves comments for a specific article 
 - `/api/articles/:article_id/comments`| POST | Adds a comment to a specific article
 - `/api/comments/:comment_id`| DELETE | Deletes a specific comment by ID number
 - `/api/users`| GET | Serves all users
 - `/api/users/:username`| GET | Serves a specific user



## Start here 
1. Clone this repository:
`git clone https://github.com/yourusername/NORTHCODERS-NEWS-BE.git`

2. Install node package manager:
 - `npm install`

## Setup
1. Create the following `.env` files in the root directory:

   a. `.env.test`:
   PGDATABASE=nc_news_test

   b. `.env.development`:
   PGDATABASE=nc_news

2. **Make sure your `.env` files are included in `.gitignore` to keep your database p/w hidden.**

3. Set up databases and seed with scripts below:

 - `npm run setup-dbs`
 - `npm run test-seed`

## Usage
To run the test environment: 
 - `npm run test-seed`

To run the development environment:
 - `npm run seed-dev`

The server will start on port 9090 which can be changed in listen.js

## All available scripts
The following scripts are in package.json:

Script | Description 
 - `npm start` // Starts the server 
 - `npm test` // Runs all tests 
 - `npm run test-seed` // Runs the seed tests only
 - `npm run setup-dbs` // Sets up PostgreSQL databases 
 - `npm run seed-dev` // Seeds development database 
 - `npm run prepare` // Husky setup - unable to push unless all tests pass 

## Testing
Using Jest and Supertest, unit and integration testing can be run as follows:
 - `npm test` // to run all test suites
 - `npm test` app // to run only app.js

## Project Status
This project is currently **in development**. 
Completed stages:
1. Test and development SQL databases initialized
2. Seed functions implemented
3. Connection file and listener completed
4. MCV query functions as above
5. Function testing implemented for completed functions
6. API endpoints documented

## Dependencies

dependencies: 
   - `dotenv: 16.4.7`
   - `express: 4.21.2`
   - `pg: 8.13.3`
   - `pg-format: 1.0.4`


devDependencies: 
  - `husky: 8.0.2`
  - `jest: 27.5.1`
  - `jest-extended: 2.0.0`
  - `jest-sorted: 1.0.15`
  - `nodemon: 3.1.9`
  - `supertest: 7.0.0`

## Contributors
This project was initiated as part of the Northcoders bootcamp. See GH `Contributors` for a list of all contributors.