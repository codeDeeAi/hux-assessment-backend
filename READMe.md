# Hux Ventures Contacts App

## Overview

Hux Ventures Contacts App is a backend server designed for managing contacts. It provides a robust API for creating, updating, retrieving, and deleting contact records. The application is built with Node.js, Express, and MongoDB, and uses JWT for authentication.

## Features

- **User Authentication**: Register and log in users with JWT-based authentication.
- **Contact Management**: API endpoints for listing, creating, updating, and deleting contacts.
- **Security**: Uses `helmet` for security headers and `express-rate-limit` for rate limiting.
- **Environment Configuration**: Managed through environment variables loaded by `dotenv`.

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/codeDeeAi/hux-assessment-backend.git
   cd hux-assessment-backend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Clone the environment example file**:

   ```bash
   cp .env.example .env
   ```

4. **Generate a JWT secret key**:

   ```bash
   npm run generate-jwt-secret
   ```

   This command will generate a new JWT secret key and display it in the terminal. Copy this key and add it to your `.env` file:

   ```plaintext
   JWT_SECRET_KEY=<your-generated-key>
   ```

5. **Set other environment variables**:

   Ensure your `.env` file includes the necessary configuration. For example:

   ```plaintext
   PORT=3000
   NODE_ENV=development
   SERVER_HOST=localhost
   JWT_SECRET_KEY=<your-generated-key>
   ```
   
6. **Link to API Documentation**:
   You can view the Api documentation here [https://documenter.getpostman.com/view/37802148/2sA3sAiTV1](https://documenter.getpostman.com/view/37802148/2sA3sAiTV1)


## Scripts

- **Start the Server in Development Mode**:

  ```bash
  npm run dev
  ```

- **Build the Project**:

  ```bash
  npm run build
  ```

- **Start the Server in Production Mode**:

  ```bash
  npm start
  ```

- **Run Tests**:

  ```bash
  npm test
  ```

- **Generate JWT Secret Key**:

  ```bash
  npm run generate-jwt-secret
  ```

## API Endpoints

### Authentication

- **Register User**: `POST /api/v1/auth/register`
- **Login**: `POST /api/v1/auth/login`
- **Logout**: `POST /api/v1/auth/logout`

### Contacts

- **List Contacts**: `GET /api/v1/contacts`
- **Create Contact**: `POST /api/v1/contacts`
- **Show Contact**: `GET /api/v1/contacts/:id`
- **Update Contact**: `PUT /api/v1/contacts/:id`
- **Delete Contact**: `DELETE /api/v1/contacts/:id`

## Error Handling

The API uses a standardized response format for success and error messages:

- **Success Response**:

  ```json
  {
    "code": <HTTP_STATUS_CODE>,
    "message": "<SUCCESS_MESSAGE>",
    "data": <RESPONSE_DATA>
  }
  ```

- **Error Response**:

  ```json
  {
    "code": <HTTP_STATUS_CODE>,
    "message": "<ERROR_MESSAGE>",
    "error": "<ERROR_DETAIL>",
    "errors": [<OPTIONAL_ERROR_ARRAY>]
  }
  ```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.