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

### GET /users/profile

#### Description
This endpoint is used to get the profile of the authenticated user.

#### Request
- **URL**: `/users/profile`
- **Method**: `GET`
- **Headers**: 
  - `Authorization: Bearer <token>`

#### Response

- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:
    ```json
    {
      "_id": "user_id",
      "fullname": {
        "firstName": "John",
        "lastName": "Doe"
      },
      "email": "john.doe@example.com"
    }
    ```

- **Error Response**:
  - **Code**: `401 Unauthorized`
  - **Content**:
    ```json
    {
      "message": "Unauthorized"
    }
    ```

#### Example
```sh
curl -X GET http://localhost:3300/users/profile \
-H "Authorization: Bearer your_jwt_token"
```

### GET /users/logout

#### Description
This endpoint is used to log out the authenticated user. It clears the authentication token and blacklists it.

#### Request
- **URL**: `/users/logout`
- **Method**: `GET`
- **Headers**: 
  - `Authorization: Bearer <token>`

#### Response

- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:
    ```json
    {
      "message": "Logged out successfully"
    }
    ```

- **Error Response**:
  - **Code**: `401 Unauthorized`
  - **Content**:
    ```json
    {
      "message": "Unauthorized"
    }
    ```

#### Example
```sh
curl -X GET http://localhost:3300/users/logout \
-H "Authorization: Bearer your_jwt_token"
```

### POST /captains/signup

#### Description
This endpoint is used to register a new captain. It validates the input data, hashes the password, creates a new captain in the database, and returns an authentication token along with the captain details.

#### Request
- **URL**: `/captains/signup`
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
    "password": "yourpassword",
    "vehicleColor": "red",
    "vehicleNumber": "ABC123",
    "capacity": 4,
    "vehicleType": "car",
    "location": {
      "longitude": 12.34,
      "latitude": 56.78
    }
  }
  ```

#### Response

- **Success Response**:
  - **Code**: `201 Created`
  - **Content**:
    ```json
    {
      "token": "your_jwt_token",
      "captain": {
        "_id": "captain_id",
        "fullname": {
          "firstName": "John",
          "lastName": "Doe"
        },
        "email": "john.doe@example.com",
        "vehicleColor": "red",
        "vehicleNumber": "ABC123",
        "capacity": 4,
        "vehicleType": "car",
        "location": {
          "longitude": 12.34,
          "latitude": 56.78
        }
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
        },
        {
          "msg": "Capacity must be at least 1",
          "param": "capacity",
          "location": "body"
        },
        {
          "msg": "Vehicle color is required",
          "param": "vehicleColor",
          "location": "body"
        },
        {
          "msg": "Vehicle number is required",
          "param": "vehicleNumber",
          "location": "body"
        },
        {
          "msg": "Longitude must be a valid number",
          "param": "location.longitude",
          "location": "body"
        },
        {
          "msg": "Latitude must be a valid number",
          "param": "location.latitude",
          "location": "body"
        },
        {
          "msg": "Vehicle type must be Car, Bike or Auto",
          "param": "vehicleType",
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
- `capacity`: Must be at least 1.
- `vehicleColor`: Must not be empty.
- `vehicleNumber`: Must not be empty.
- `location.longitude`: Must be a valid number.
- `location.latitude`: Must be a valid number.
- `vehicleType`: Must be one of `car`, `bike`, or `auto`.

#### Example
```sh
curl -X POST http://localhost:3300/captains/signup \
-H "Content-Type: application/json" \
-d '{
  "fullname": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "yourpassword",
  "vehicleColor": "red",
  "vehicleNumber": "ABC123",
  "capacity": 4,
  "vehicleType": "car",
  "location": {
    "longitude": 12.34,
    "latitude": 56.78
  }
}'
```