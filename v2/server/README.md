# CyDog Server

This is the backend server for the CyDog project, a web application designed to manage dogs, users, and assignments. The server is built with Node.js, Express, and Sequelize, using PostgreSQL as the database. It supports RESTful APIs, WebSocket communication via Socket.IO, and Swagger documentation. The application is containerized using Docker and Docker Compose for easy deployment.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Setup](#setup)
  - [Environment Variables](#environment-variables)
  - [Installing Dependencies](#installing-dependencies)
- [Running the Application](#running-the-application)
  - [Using Docker Compose](#using-docker-compose)
  - [Without Docker](#without-docker)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Database Management](#database-management)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features
- **RESTful APIs**: Endpoints for authentication (`/auth`), dog management (`/dogs`), and assignments (`/assignments`).
- **WebSocket Support**: Real-time communication using Socket.IO.
- **Database**: PostgreSQL with Sequelize ORM, managing `Users`, `Dogs`, and `Assignments` tables.
- **Security**: Helmet for HTTP headers, rate-limiting, session management, and bcrypt for password hashing.
- **API Documentation**: Swagger UI available at `/api-docs`.
- **Containerization**: Dockerized with Docker Compose for consistent development and deployment.
- **Environment Configuration**: Supports `.env` for flexible configuration.

## Prerequisites
- **Node.js**: Version 18 or higher (used in Docker image `node:18-alpine`).
- **Docker**: Docker Desktop or Docker CLI installed for containerized deployment.
- **Docker Compose**: Required for orchestrating the `server` and `postgres` services.
- **Git**: To clone the repository (optional).
- **NPM**: For installing dependencies if running without Docker.

## Project Structure
```
C:\Users\מתן\Desktop\CyDog-Final-Project\v2\server\
├── .env                    # Environment variables
├── docker-compose.yml      # Docker Compose configuration
├── Dockerfile              # Docker image for the server
├── package.json            # Node.js dependencies and scripts
├── src/
│   ├── index.js            # Main server entry point
│   ├── config/
│   │   ├── db.js           # Sequelize database configuration
│   ├── models/
│   │   ├── index.js        # Model associations and exports
│   │   ├── user.js         # User model
│   │   ├── dog.js          # Dog model
│   │   ├── assignment.js   # Assignment model
│   ├── routes/
│   │   ├── auth.js         # Authentication routes
│   │   ├── dogs.js         # Dog management routes
│   │   ├── assignments.js  # Assignment routes
│   ├── socket.js           # Socket.IO configuration
│   ├── swagger.js          # Swagger API documentation setup
```

## Setup

### Environment Variables
Create a `.env` file in the project root based on the example below:

```env
NODE_ENV=development
PORT=8080
DB_HOST=postgres
DB_USER=cydog
DB_PASSWORD=password123
DB_NAME=cydog_db
DB_PORT=5432
JWT_SECRET=your_jwt_secret_key
SESSION_SECRET=your_session_secret
CORS_ORIGIN=http://localhost:3000
```

- **Instructions**:
  - Replace `your_jwt_secret_key` with a secure JWT secret (e.g., a random string like `x7b9z2k8p4m6n3q5`).
  - Replace `your_session_secret` with a secure session secret (e.g., `a1c3e5g7i9k2m4`).
  - Update `CORS_ORIGIN` to match your frontend URL (e.g., `http://localhost:3000` for local development).
  - Add `.env` to `.gitignore` to prevent exposing sensitive data.

### Installing Dependencies
If running without Docker or modifying the project, install Node.js dependencies:

```bash
npm install
```

Required packages (should be listed in `package.json`):
- `express`, `cors`, `http`, `swagger-ui-express`, `sequelize`, `pg`, `pg-hstore`, `cookie-parser`, `express-session`, `bcryptjs`, `helmet`, `express-rate-limit`, `dotenv`

## Running the Application

### Using Docker Compose
The recommended way to run the application is with Docker Compose, which sets up both the Node.js server and PostgreSQL database.

1. **Stop and Remove Existing Containers**:
   ```bash
   docker-compose down -v
   ```
   This ensures a clean slate by removing containers and volumes.

2. **Build and Start**:
   ```bash
   docker-compose up --build
   ```
   - Builds the server image from `Dockerfile`.
   - Starts the `postgres` and `server` services.
   - The server runs on `http://localhost:8080`.

3. **Expected Output**:
   - PostgreSQL:
     ```
     postgres_1  | 2025-04-13 ... LOG:  database system is ready to accept connections
     ```
   - Server:
     ```
     server_1    | Database connection established successfully.
     server_1    | Syncing User model...
     server_1    | User model synced.
     server_1    | Syncing Dog model...
     server_1    | Dog model synced.
     server_1    | Syncing Assignment model...
     server_1    | Assignment model synced.
     server_1    | Database models synchronized.
     server_1    | Server running on port 8080
     server_1    | API documentation available at http://localhost:8080/api-docs
     server_1    | Socket.io server running at http://localhost:8080
     ```

4. **Stop the Application**:
   ```bash
   docker-compose down
   ```

### Without Docker
To run locally without Docker (not recommended for production):

1. **Start PostgreSQL**:
   - Install PostgreSQL locally.
   - Create a database and user:
     ```bash
     psql -U postgres
     CREATE USER cydog WITH PASSWORD 'password123';
     CREATE DATABASE cydog_db OWNER cydog;
     ```

2. **Update `.env`**:
   - Set `DB_HOST=localhost` instead of `postgres`.

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Run the Server**:
   ```bash
   npm start
   ```

## Testing
1. **API Endpoints**:
   - Access Swagger documentation at `http://localhost:8080/api-docs`.
   - Test routes using Postman, cURL, or a similar tool:
     ```bash
     curl http://localhost:8080/auth
     curl http://localhost:8080/dogs
     curl http://localhost:8080/assignments
     ```

2. **Database Verification**:
   - Connect to the PostgreSQL container:
     ```bash
     docker exec -it server_postgres_1 psql -U cydog -d cydog_db
     ```
   - List tables:
     ```sql
     \dt
     ```
     Expected output:
     ```
     Schema |     Name      | Type  | Owner
     --------+---------------+-------+-------
     public | Assignments   | table | cydog
     public | Dogs          | table | cydog
     public | Users         | table | cydog
     ```
   - Inspect table structures:
     ```sql
     \d Users
     \d Dogs
     \d Assignments
     ```

3. **WebSocket Testing**:
   - Install a WebSocket client like `wscat`:
     ```bash
     npm install -g wscat
     ```
   - Connect to the server:
     ```bash
     wscat -c ws://localhost:8080
     ```
   - Test events defined in `src/socket.js`.

## API Documentation
- **Swagger UI**: Available at `http://localhost:8080/api-docs` when the server is running.
- **Routes**:
  - `/auth`: Authentication endpoints (register, login, logout, get current user).
  - `/dogs`: Dog management (create, read, update, delete dogs, linked to users via `userId`).
  - `/assignments`: Assignment management (create, read, update status, linked to dogs and users via `dogId` and `userId`).
- Refer to `src/swagger.js` for the OpenAPI specification.

## Database Management
- **Schema**:
  - `Users`: Stores user data (`id`, `email`, `password`, `role`, `permissions`).
  - `Dogs`: Stores dog data (`id`, `name`, `breed`, `age`, `type`, `userId`).
  - `Assignments`: Stores assignment data (`id`, `type`, `dogId`, `userId`, `status`).
  - **Foreign Keys**:
    - `Dogs.userId` references `Users(id)` with `ON DELETE CASCADE`.
    - `Assignments.userId` references `Users(id)` with `ON DELETE CASCADE`.
    - `Assignments.dogId` references `Dogs(id)` with `ON DELETE CASCADE`.

- **Development Sync**:
  - The server uses `sequelize.sync({ force: true })` in development to recreate tables on startup. This is controlled by `NODE_ENV=development` in `.env`.

- **Production Recommendation**:
  - Use Sequelize migrations for production to manage schema changes safely:
    1. Install Sequelize CLI:
       ```bash
       npm install --save-dev sequelize-cli
       ```
    2. Initialize migrations:
       ```bash
       npx sequelize-cli init
       ```
    3. Create and apply migrations for `Users`, `Dogs`, and `Assignments`.
    4. Run migrations:
       ```bash
       npx sequelize-cli db:migrate
       ```

## Troubleshooting
- **Database Connection Issues**:
  - Ensure `DB_HOST=postgres` in `.env` and `docker-compose.yml`.
  - Check PostgreSQL logs:
    ```bash
    docker logs server_postgres_1
    ```

- **Sequelize Errors** (e.g., `relation "Dogs" does not exist`):
  - Verify model sync order in `src/index.js` (`User`, `Dog`, `Assignment`).
  - Confirm table names in models (`Users`, `Dogs`, `Assignments`) and foreign key references (`Users` for `userId`, `Dogs` for `dogId`).
  - Clear volumes and restart:
    ```bash
    docker-compose down -v
    docker-compose up --build
    ```

- **CORS Issues**:
  - Ensure `CORS_ORIGIN` matches your frontend URL.
  - Test with the correct frontend port (e.g., `http://localhost:3000`).

- **Dependency Errors**:
  - Reinstall dependencies:
    ```bash
    npm install
    ```

- **Server Logs**:
  - Check server logs for detailed errors:
    ```bash
    docker logs server_server_1
    ```

## Contributing
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit changes:
   ```bash
   git commit -m "Add your feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

**Happy coding with CyDog!** 🐶