# Base Node Project

> ### Project base to create an API with Node.js, Express and MongoDB. The code supports authentication and logging. You can follow us on: [Mr NJIFANDA](http://www.njifanda.com)

This repo is functionality complete — PRs and issues welcome!

----------

# Getting started

## Installation

Clone the repository

    git clone https://github.com/mrnjifanda/base-nodejs.git

Switch to the repo folder

    cd base-nodejs

Install all the dependencies using composer

    npm install

Copy the example env file and make the required configuration changes in the .env file

    cp .env.example .env

Start the local development server

    npm start

You can now access the server at <http://localhost:3000> if port is 3000

----------

# Code overview

## Dependencies

-

## Folders

- `config` - Contains all the application configuration files
- `public` - Contains all public assets
- `routes` - Contains all the api routes defined in routes.js file
- `src` - Contains all the api controllers, models and services
- `src` - Contains all the api helpers, interceptors, middlewares and validations

## Environment variables

- `.env` - Environment variables can be set in this file

----------

| **Required**  | **Key**   |
|-------------- |---------- |
| Yes           | Node.js   |
| Yes           | Npm       |
| Optional      | MongoDB   |

----------

# Future updates

- Sending emails
- Upload files

----------

# Contributions

We are open to contributions from all developers, Contact us on email contact@njifanda.com.
