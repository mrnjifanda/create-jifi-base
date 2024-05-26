# Base Node Project

 [![GitHub stars](https://img.shields.io/github/stars/mrnjifanda/create-jifi-base.svg)](https://github.com/mrnjifanda/create-jifi-base/stargazers) [![GitHub license](https://img.shields.io/github/license/mrnjifanda/create-jifi-base.svg)](https://raw.githubusercontent.com/mrnjifanda/create-jifi-base/main/LICENSE.txt)

> ### Project base to create an API with Node.js, Express and MongoDB. The code supports authentication and logging. You can follow us on: [Mr NJIFANDA](http://www.njifanda.com)

This repo is functionality complete — PRs and issues welcome!

----------

# Getting started

## Installation

Clone the repository

    git clone https://github.com/mrnjifanda/create-jifi-base.git

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

## CLI

### `npm run g [TYPE] [NAME]`
Examples:
- `npm run g controller index` This command will generate an index.controller.js file in the controllers folder. We can replace `controlle` with `c`
- `npm run g service index` This command will generate an index.service.js file in the services folder. We can replace `service` with `s`
- `npm run g model index` This command will generate an index.model.js file in the models folder. We can replace `model` with `m`
- `npm run g resource index` This command will generate an index.model.js, index.service.js and index.controller.js file in each of the respective folders. We can replace `resource` with `r`

## Dependencies

-

## Folders

- `config` - Contains all the application configuration files
- `public` - Contains all public assets
- `routes` - Contains all the api routes defined in routes.js file
- `src` - Contains all the api controllers, models and services
- `utils` - Contains all the api helpers, interceptors, middlewares and validations

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

- Upload files

----------

# Contributions

We are open to contributions from all developers, Contact us on email contact@njifanda.com.
