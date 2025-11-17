# Recruito - Recruitment Management System

A full-stack recruitment management application built with Java Spring Boot and React.

## Tech Stack

### Backend
- Java 17+
- Spring Boot 3.x
- Spring Security
- Spring Data MongoDB
- MongoDB
- WebSocket (STOMP)
- JWT Authentication
- Maven

### Frontend
- React 18+
- Redux Toolkit
- React Router
- Material UI
- Axios
- WebSocket Client (stompjs)

## Project Structure

```
Recruito/
├── recruito-backend/     # Spring Boot backend
├── recruito-frontend/    # React frontend
└── README.md
```

## Features

- 🔐 JWT Authentication (Admin, Recruiter, Candidate roles)
- 📋 Job Posting & Management
- 👥 Candidate Application Management
- 📅 Interview Scheduling
- 💬 Real-time Chat (WebSocket)
- 📊 Analytics Dashboard

## Getting Started

See [SETUP.md](SETUP.md) for detailed setup instructions.

### Quick Start with Docker

```bash
docker-compose up -d
```

This will start all services:
- MongoDB on port 27017
- Backend API on port 8080
- Frontend on port 3000

### Manual Setup

#### Prerequisites
- Java 17+
- Node.js 18+
- MongoDB 7.0+
- Maven 3.8+

#### Backend Setup

```bash
cd recruito-backend
mvn clean install
mvn spring-boot:run
```

Backend runs on: `http://localhost:8080`

#### Frontend Setup

```bash
cd recruito-frontend
npm install
npm start
```

Frontend runs on: `http://localhost:3000`

## API Documentation

Once the backend is running, access Swagger UI at:
`http://localhost:8080/swagger-ui.html`

## Features Overview

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Recruiter, Candidate)
- Secure password hashing with BCrypt

### Job Management
- Create, read, update, delete jobs
- Job status workflow (Draft → Published → Closed)
- Advanced search and filtering
- Pagination support

### Application Management
- Candidates can apply for jobs
- Recruiters can manage applications
- Status tracking: Applied → Shortlisted → Interview → Hired/Rejected

### Interview Scheduling
- Schedule interviews with candidates
- Calendar view of interviews
- Interview notes and completion tracking

### Real-time Chat
- WebSocket-based messaging
- Chat rooms for candidate-recruiter communication
- Read receipts and unread message counts

### Analytics Dashboard
- Total jobs, applications, and interviews
- Conversion rates
- Applications by status (pie chart)
- Interviews by month (bar chart)

## Project Structure

```
Recruito/
├── recruito-backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/recruito/
│   │   │   │   ├── config/          # Configuration classes
│   │   │   │   ├── controller/      # REST controllers
│   │   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   ├── model/           # Entity models
│   │   │   │   ├── repository/      # JPA repositories
│   │   │   │   ├── security/        # Security configuration
│   │   │   │   └── service/         # Business logic
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
├── recruito-frontend/
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   ├── pages/                   # Page components
│   │   ├── redux/                   # Redux store and slices
│   │   ├── services/                # API services
│   │   └── App.tsx
│   └── package.json
├── docker-compose.yml
└── README.md
```

## License

MIT

