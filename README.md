Cat Facts
=================

A fullstack application for reading cat facts 🐱

# Start the application

## Pre-requirements

1. [Docker](https://www.docker.com/) (in a version capable of command `docker compose` instead of `docker-compose`)
2. [Node V16](https://nodejs.org/en/)

## Starting the application

Start with installing the dependencies

`npm install`

### Infrastructure

Before application run, infrastructure has to be turned on.

`npm run start:infrastructure`

To remove infrastructure and clean its resources

`npm run stop:infrastructure`

### Application

Following script will build shared library and start:
1. Frontend on [http://localhost:3001](http://localhost:3001) 
2. Backend on [http://localhost:3000](http://localhost:3001)

`npm start`

Frontend communicates with the backend by a proxy to bypass CORS.

### Shutting down

To shut down the application and clear resources, just stop the script and clean the infrastructure with: 

`npm run stop:infrastructure`

## Quick instruction on the application

In order to see Cat Facts on the page, go to either Signup or Signin page (buttons in the upper left corner).

Type your credentials and either sign in (if you have already an account) or Sign up with new credentials. This will move you back to the homepage, now filled with cat facts 🐱.

# Used stack

### Backend
- Express.js
- sequelize
- passport-jwt
- MySQL on Docker

### Frontend
- React
- react-query
- react-router-dom
- styled-components

> - (Additional) monorepository for sharing resources between the frontend and the backend

# Todo List

## Backend
- [x] Scaffold project
- [x] add eslint and prettier
- [x] create user resource
- [x] implement jwt signup
- [x] add `fetch_data` resource
- [x] use passport for jwt verification
- [x] add business logic errors
- [x] add dto validation
- [x] add database connection
- [x] add monorepo to share dtos between the frontend and the backend

### Out of scope
- [ ] add controllers-class pattern
- [ ] add class-validator
- [ ] add dotenv for SECRET and etc.
- [ ] add redis for allowed tokens repository
- [ ] add webpack for building
- [ ] e2e

## Frontend
- [x] Scaffold project and add needed libraries
- [x] Create authentication context and service
- [x] Create routing
- [x] Create homepage
- [x] Create signin page
- [x] Create signout page
- [x] Use react-query for backend calls

### Out of scope
- [ ] Error processing (single way of handling errors, currently console.log)
- [ ] Csfr for signin/up pages
- [ ] Persist token on a browser via either local storage, cookie, etc.
- [ ] Logout (currently by refresh)
- [ ] Create custom hooks to not call use query
- [ ] Customizable backend endpoint
- [ ] e2e

## License

Nest is [MIT licensed](LICENSE).
