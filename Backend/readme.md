# Next Ride Backend API

## Endpoints

### POST /users/signup

#### Description
This endpoint is used to register a new user. It validates the input data, hashes the password, creates a new user in the database, and returns an authentication token along with the user details.

#### Request
- **URL**: `/users/signup`
- **Method**: `POST`
- **Headers**: 
  - `Content-Type: application/json`
- **Body**:
  ```json
  {
    "fullname": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    "password": "yourpassword"
  }
  ```

#### Response

- **Success Response**:
  - **Code**: `201 Created`
  - **Content**:
    ```json
    {
      "token": "your_jwt_token",
      "user": {
        "_id": "user_id",
        "fullname": {
          "firstName": "John",
          "lastName": "Doe"
        },
        "email": "john.doe@example.com"
      }
    }
    ```

- **Error Response**:
  - **Code**: `400 Bad Request`
  - **Content**:
    ```json
    {
      "errors": [
        {
          "msg": "Invalid email",
          "param": "email",
          "location": "body"
        },
        {
          "msg": "First name must be between 3 and 20 characters long",
          "param": "fullname.firstName",
          "location": "body"
        },
        {
          "msg": "Last name must be between 3 and 20 characters long",
          "param": "fullname.lastName",
          "location": "body"
        },
        {
          "msg": "Password must be between 8 and 20 characters long",
          "param": "password",
          "location": "body"
        }
      ]
    }
    ```

#### Validation Rules
- `email`: Must be a valid email address.
- `fullname.firstName`: Must be between 3 and 20 characters long.
- `fullname.lastName`: Must be between 3 and 20 characters long.
- `password`: Must be between 8 and 20 characters long.

#### Example
```sh
curl -X POST http://localhost:3300/users/signup \
-H "Content-Type: application/json" \
-d '{
  "fullname": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "yourpassword"
}'
```

### POST /users/login

#### Description
This endpoint is used to log in an existing user. It validates the input data, checks the user's credentials, and returns an authentication token along with the user details.

#### Request
- **URL**: `/users/login`
- **Method**: `POST`
- **Headers**: 
  - `Content-Type: application/json`
- **Body**:
  ```json
  {
    "email": "john.doe@example.com",
    "password": "yourpassword"
  }
  ```

#### Response

- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:
    ```json
    {
      "token": "your_jwt_token",
      "user": {
        "_id": "user_id",
        "fullname": {
          "firstName": "John",
          "lastName": "Doe"
        },
        "email": "john.doe@example.com"
      }
    }
    ```

- **Error Response**:
  - **Code**: `401 Bad Request`
  - **Content**:
    ```json
    {
      "errors": [
        {
          "msg": "Invalid email",
          "param": "email",
          "location": "body"
        },
        {
          "msg": "Password must be between 8 and 20 characters long",
          "param": "password",
          "location": "body"
        }
      ]
    }
    ```
  - **Code**: `401 Unauthorized`
  - **Content**:
    ```json
    {
      "message": "Invalid email or password"
    }
    ```

#### Validation Rules
- `email`: Must be a valid email address.
- `password`: Must be between 8 and 20 characters long.

#### Example
```sh
curl -X POST http://localhost:3300/users/login \
-H "Content-Type: application/json" \
-d '{
  "email": "john.doe@example.com",
  "password": "yourpassword"
}'
```