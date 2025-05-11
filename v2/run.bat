@REM Remove any existing containers
docker-compose down -v

@REM Build the Docker images
docker-compose up -d --build

@REM Wait for the containers to be up and running
timeout /t 10

@REM Run the client
cd client
npm run dev
cd ..