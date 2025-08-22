# Atomics Trial Backend Server

This is the backend server for the Atomics Football Trial registration system.

## Features

- Tournament registration management
- Player registration with validation
- Admin dashboard with statistics
- RESTful API endpoints
- MongoDB database integration
- Input validation and sanitization
- Rate limiting and security headers

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/atomics-trial

# Client URL for CORS
CLIENT_URL=http://localhost:5173

# Optional: MongoDB Atlas URI (if using cloud database)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/atomics-trial?retryWrites=true&w=majority
```

### 3. Database Setup

Make sure you have MongoDB installed and running locally, or use MongoDB Atlas.

### 4. Start the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Tournament Registrations

- `POST /api/tournament-registrations` - Create new registration
- `GET /api/tournament-registrations` - Get all registrations (with pagination and filtering)
- `GET /api/tournament-registrations/stats` - Get statistics
- `GET /api/tournament-registrations/:id` - Get registration by ID
- `PUT /api/tournament-registrations/:id` - Update registration status
- `PATCH /api/tournament-registrations/:id` - Update registration
- `DELETE /api/tournament-registrations/:id` - Delete registration

### Query Parameters for GET /api/tournament-registrations

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search term for name, team, or phone
- `status` - Filter by status (pending, confirmed, cancelled)

### Health Check

- `GET /health` - Server health check

## Data Model

### Tournament Registration

```javascript
{
  // Player Information
  playerFirstName: String (required, min 2 chars),
  playerLastName: String (required, min 2 chars),
  teamName: String (required),
  dateOfBirth: Date (required),
  playingPosition: String (required, enum: GK, CB, RB, LB, CDM, CM, CAM, LW, RW, ST),
  divisionLastSeason: String (required),
  strengthWeakness: String (required, min 10 chars),
  mobileNumber: String (required, UAE phone format),
  academyClub: String (required),
  preferredLocations: Array (required, enum: active-mariah, saadiyat),
  trialDate: String (required),
  trialDateLabel: String (required),
  
  // Tournament Information
  tournament: String (default: "ATOMICS PRESEASON CUP"),
  cupDates: String (default: "Tuesday - Thursday 26th - 28th August"),
  timings: String (default: "5:00 PM to 9:00 PM"),
  location: String (default: "Active Sports Pitches"),
  
  // Status and Metadata
  status: String (enum: pending, confirmed, cancelled, default: pending),
  registrationDate: Date (default: now),
  
  // Additional fields
  notes: String,
  adminNotes: String
}
```

## Security Features

- CORS protection
- Helmet security headers
- Rate limiting (100 requests per 15 minutes per IP)
- Input validation and sanitization
- MongoDB injection protection

## Error Handling

The API returns consistent error responses:

```javascript
{
  "success": false,
  "message": "Error description",
  "errors": [] // For validation errors
}
```

## Success Responses

```javascript
{
  "success": true,
  "message": "Operation successful",
  "data": {} // Response data
}
```
