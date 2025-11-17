# Recruito Setup Guide

## Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- MongoDB 7.0 or higher
- Maven 3.8 or higher
- Docker and Docker Compose (optional, for containerized deployment)

## Local Development Setup

### 1. Database Setup

MongoDB will be automatically created when the application starts. You can use Docker to run MongoDB:

```bash
docker run --name recruito-mongodb -p 27017:27017 -d mongo:7.0
```

Or install MongoDB locally and ensure it's running on `localhost:27017`.

### 2. Backend Setup

1. Navigate to the backend directory:
```bash
cd recruito-backend
```

2. Update `src/main/resources/application.properties` with your MongoDB connection string if different from defaults (default: `mongodb://localhost:27017/recruito_db`).

3. Build and run the backend:
```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

4. Access Swagger UI at: `http://localhost:8080/swagger-ui.html`

### 3. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd recruito-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional, defaults are set):
```env
REACT_APP_API_URL=http://localhost:8080/api
```

4. Start the development server:
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## Docker Deployment

### Using Docker Compose

1. From the root directory, run:
```bash
docker-compose up -d
```

This will start:
- MongoDB database on port 27017
- Backend API on port 8080
- Frontend on port 3000

2. To stop all services:
```bash
docker-compose down
```

3. To view logs:
```bash
docker-compose logs -f
```

### Individual Docker Builds

#### Backend
```bash
cd recruito-backend
docker build -t recruito-backend .
docker run -p 8080:8080 recruito-backend
```

#### Frontend
```bash
cd recruito-frontend
docker build -t recruito-frontend .
docker run -p 3000:80 recruito-frontend
```

## Default Test Credentials

After first run, you can register users through the registration page. Roles available:
- **ADMIN**: Full system access
- **RECRUITER**: Can post jobs, manage applications, schedule interviews
- **CANDIDATE**: Can apply for jobs, track applications, attend interviews

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Jobs
- `GET /api/jobs` - Get all published jobs (with pagination and filters)
- `GET /api/jobs/{id}` - Get job by ID
- `POST /api/jobs` - Create new job (Recruiter/Admin only)
- `PUT /api/jobs/{id}` - Update job (Recruiter/Admin only)
- `POST /api/jobs/{id}/publish` - Publish job (Recruiter/Admin only)
- `POST /api/jobs/{id}/close` - Close job (Recruiter/Admin only)
- `DELETE /api/jobs/{id}` - Delete job (Recruiter/Admin only)

### Applications
- `POST /api/applications` - Apply for a job (Candidate only)
- `GET /api/applications/my-applications` - Get my applications (Candidate)
- `GET /api/applications/recruiter/my-applications` - Get recruiter's applications
- `PATCH /api/applications/{id}/status` - Update application status (Recruiter/Admin only)

### Interviews
- `POST /api/interviews` - Schedule interview (Recruiter/Admin only)
- `GET /api/interviews/my-interviews` - Get my interviews
- `GET /api/interviews/recruiter/my-interviews` - Get recruiter's interviews
- `PUT /api/interviews/{id}` - Update interview
- `POST /api/interviews/{id}/complete` - Complete interview

### Chat
- `POST /api/chat/send` - Send message
- `GET /api/chat/messages?otherUserId={id}` - Get chat messages
- `GET /api/chat/unread-count` - Get unread message count

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard analytics (Recruiter/Admin only)

## WebSocket

WebSocket endpoint: `ws://localhost:8080/ws`

Subscribe to:
- `/topic/chat/{chatRoomId}` - Chat room messages
- `/queue/messages/{userId}` - Personal messages

## Troubleshooting

### Backend Issues

1. **Database Connection Error**: Ensure MongoDB is running and connection string in `application.properties` is correct.

2. **Port Already in Use**: Change the port in `application.properties`:
   ```
   server.port=8081
   ```

3. **JWT Secret Error**: Update the JWT secret in `application.properties` to a secure 32+ character string.

### Frontend Issues

1. **API Connection Error**: Ensure backend is running and `REACT_APP_API_URL` is set correctly.

2. **CORS Error**: Check that backend CORS configuration includes your frontend URL.

3. **Build Errors**: Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## Production Deployment

### Backend
- Update JWT secret to a secure random string
- Configure proper database credentials
- Set up HTTPS
- Configure email settings for notifications
- Enable production logging

### Frontend
- Build for production: `npm run build`
- Serve static files using nginx or similar
- Configure environment variables
- Set up HTTPS

## License

MIT

