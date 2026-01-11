# Medexa Backend API

Express.js backend for Medexa health management application using Firebase Admin SDK.

## 🚀 Features

- **RESTful API** with Express.js and TypeScript
- **Firebase Authentication** - Secure user authentication with JWT tokens
- **Firestore Database** - NoSQL database for all app data
- **Complete CRUD Operations** for:
  - User Profiles
  - Medications
  - Appointments
  - Health Logs
- **Security** - Helmet, CORS, input validation
- **Error Handling** - Centralized error handling middleware
- **Logging** - Morgan HTTP request logging

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Firebase Admin configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth, error handling, validation
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic & Firebase operations
│   ├── types/           # TypeScript interfaces
│   └── server.ts        # Express app entry point
├── .env.example         # Environment variables template
├── package.json
└── tsconfig.json
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Firebase Admin Setup

You need to get your Firebase Admin credentials:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **medexa-c673d**
3. Go to **Project Settings** > **Service Accounts**
4. Click **Generate New Private Key**
5. Save the JSON file as `serviceAccountKey.json` in the `backend/` folder

### 3. Environment Configuration

Create a `.env` file in the `backend/` folder:

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
PORT=3000
NODE_ENV=development

# Option 1: Use service account key file (recommended)
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json

# Option 2: Or use individual environment variables
# FIREBASE_PROJECT_ID=medexa-c673d
# FIREBASE_CLIENT_EMAIL=your-client-email@medexa-c673d.iam.gserviceaccount.com
# FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# CORS origins (comma-separated for multiple origins)
CORS_ORIGIN=http://localhost:8081,exp://192.168.1.1:8081
```

### 4. Start the Server

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production build:**

```bash
npm run build
npm start
```

The server will start at `http://localhost:3000`

## 📡 API Endpoints

### Health Check

- `GET /api/health` - Check if API is running

### Profile

- `POST /api/profile` - Create/update user profile
- `GET /api/profile` - Get user profile
- `PATCH /api/profile` - Update profile fields

### Medications

- `POST /api/medications` - Add medication
- `GET /api/medications` - Get all user medications
- `GET /api/medications/:id` - Get medication by ID
- `PATCH /api/medications/:id` - Update medication
- `DELETE /api/medications/:id` - Delete medication

### Appointments

- `POST /api/appointments` - Add appointment
- `GET /api/appointments` - Get all user appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `PATCH /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Health Logs

- `POST /api/health-logs` - Add health log
- `GET /api/health-logs` - Get all user health logs (optional `?type=` query param)
- `GET /api/health-logs/:id` - Get health log by ID
- `PATCH /api/health-logs/:id` - Update health log
- `DELETE /api/health-logs/:id` - Delete health log

## 🔐 Authentication

All API endpoints (except `/` and `/api/health`) require authentication.

**Include Firebase ID token in request headers:**

```
Authorization: Bearer <firebase-id-token>
```

### How to get the token:

In your React Native app, after user signs in with Firebase Auth:

```typescript
import { auth } from '@/config/firebase';

const user = auth.currentUser;
const token = await user?.getIdToken();

// Use token in API requests
const response = await fetch('http://localhost:3000/api/profile', {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
```

## 🧪 Example API Requests

### Create Profile

```bash
POST http://localhost:3000/api/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "age": "30",
  "bloodType": "O+",
  "allergies": "Peanuts",
  "emergencyContact": "+0987654321"
}
```

### Add Medication

```bash
POST http://localhost:3000/api/medications
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Aspirin",
  "type": "Tablet",
  "dosage": "100mg",
  "duration": "10 days",
  "frequency": "Daily",
  "mealTiming": "After Breakfast",
  "notificationTimes": ["09:00", "21:00"],
  "startDate": "2026-01-04",
  "endDate": "2026-01-14"
}
```

### Get Medications

```bash
GET http://localhost:3000/api/medications
Authorization: Bearer <token>
```

## 🔧 Development

**Run with auto-reload:**

```bash
npm run dev
```

**Build TypeScript:**

```bash
npm run build
```

**Lint code:**

```bash
npm run lint
```

## 📦 Technologies

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Firebase Admin SDK** - Authentication & Firestore
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP logging
- **Compression** - Response compression
- **Dotenv** - Environment variables

## 🔒 Security Features

- JWT token verification on all protected routes
- User ownership verification (users can only access their own data)
- Helmet security headers
- CORS configuration
- Input validation
- Error message sanitization

## 📝 Notes

- The backend uses Firebase Admin SDK (server-side), which is different from the client SDK
- All timestamps are automatically managed by the services
- User IDs are extracted from authenticated Firebase tokens
- Data is organized in Firestore collections by entity type

## 🚨 Important Security Note

**Never commit these files to Git:**

- `serviceAccountKey.json`
- `.env`

They are already in `.gitignore`.
