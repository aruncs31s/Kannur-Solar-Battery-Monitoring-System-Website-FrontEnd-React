# ESPSMF

ESP Solar Monitor Framework - Backend API for monitoring solar battery systems using ESP devices.

## Features

- User authentication with JWT
- ESP device management
- Voltage reading monitoring
- RESTful API with CORS support

## Tech Stack

- **Language**: Go
- **Framework**: Gin
- **Database**: MySQL
- **ORM**: GORM
- **Authentication**: JWT

## Getting Started

### Prerequisites

- Go 1.19+
- MySQL 8.0+
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/aruncs31s/espsmf.git
cd espsmf
```

2. Install dependencies:
```bash
go mod tidy
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=3306
DB_NAME=volt_meter
JWT_SECRET=your_jwt_secret_key
PORT=8080
```

4. Run the application:
```bash
go run ./cmd/main.go
```

The server will start on `http://localhost:8080`.

## API Documentation

### Authentication

#### Login
Authenticate user and receive JWT token.

**Endpoint:** `POST /api/v1/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (401 Unauthorized):**
```json
{
  "error": "invalid credentials"
}
```

#### Logout
Logout user (stateless - client should discard token).

**Endpoint:** `POST /api/v1/auth/logout`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "message": "logged out"
}
```

#### Validate Token
Validate JWT token.

**Endpoint:** `GET /api/v1/auth/validate?token=<jwt_token>`

**Response (200 OK):**
```json
{
  "valid": true
}
```

**Response (401 Unauthorized):**
```json
{
  "error": "invalid token"
}
```

### Users

#### Create User
Create a new user account.

**Endpoint:** `POST /api/v1/users/`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response (500 Internal Server Error):**
```json
{
  "error": "user creation failed"
}
```

#### Get User by ID
Retrieve user information by ID.

**Endpoint:** `GET /api/v1/users/{id}`

**Response (200 OK):**
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response (404 Not Found):**
```json
{
  "error": "user not found"
}
```

### ESP Devices

#### Create ESP Device
Register a new ESP device.

**Endpoint:** `POST /api/v1/esp/devices`

**Request Body:**
```json
{
  "name": "ESP001",
  "mac": "AA:BB:CC:DD:EE:FF",
  "installed_location": "Roof Panel 1",
  "status": "active",
  "installed_by": "John Doe"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "ESP001",
  "mac": "AA:BB:CC:DD:EE:FF",
  "installed_location": "Roof Panel 1",
  "status": "active",
  "installed_by": "John Doe",
  "created_at": 1640995200,
  "updated_at": 1640995200
}
```

#### Get All ESP Devices
Retrieve all registered ESP devices.

**Endpoint:** `GET /api/v1/esp/devices`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "ESP001",
    "mac": "AA:BB:CC:DD:EE:FF",
    "installed_location": "Roof Panel 1",
    "status": "active",
    "installed_by": "John Doe",
    "created_at": 1640995200,
    "updated_at": 1640995200
  }
]
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at BIGINT,
  updated_at BIGINT,
  created_by BIGINT,
  updated_by BIGINT
);
```

### ESPs Table
```sql
CREATE TABLE esps (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  mac VARCHAR(17) UNIQUE NOT NULL,
  installed_location VARCHAR(255),
  status VARCHAR(50) NOT NULL,
  installed_by VARCHAR(100),
  created_at BIGINT,
  updated_at BIGINT,
  created_by BIGINT,
  updated_by BIGINT
);
```

### Voltage Readings Table
```sql
CREATE TABLE voltage_readings (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  esp_id BIGINT NOT NULL,
  voltage FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (esp_id) REFERENCES esps(id)
);
```

## Development

### Project Structure
```
├── cmd/
│   └── main.go                 # Application entry point
├── application/
│   ├── config/                 # Database configuration
│   ├── dto/                    # Data transfer objects
│   ├── handler/                # HTTP handlers
│   ├── initializer/            # Database initialization
│   ├── middleware/             # HTTP middleware
│   ├── routes/                 # Route definitions
│   └── service/                # Business logic
├── domain/
│   ├── interfaces/             # Interface definitions
│   ├── model/                  # Database models
│   └── repository/             # Data access layer
└── utils/                      # Utility functions
```

### Running Tests
```bash
go test ./...
```

### Building for Production
```bash
go build -o bin/espsmf ./cmd/main.go
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
