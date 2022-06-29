Cat Facts
=================

A fullstack application for reading cat facts 🐱

# Used stack

### Backend
- Express.js
- passport-jwt for authorization

### Frontend
- React
- react-query
- react-router-dom
- styled-components

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

## Frontend
- [x] Scaffold project and add needed libraries
- [x] Create authentication context and service
- [x] Create routing
- [x] Create homepage
- [x] Create signin
- [x] Create signout
- [x] Use react-query

### Out of scope
- [ ] Error processing (single way of handling errors, currently console.log)
- [ ] Csfr for signin/up pages
- [ ] Persist token on a browser via either local storage, cookie, etc.
- [ ] Logout (currently by refresh)
- [ ] Create custom hooks to not call use query
- [ ] Customizable backend endpoint

## License

Nest is [MIT licensed](LICENSE).
