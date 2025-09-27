# Fritim Backend - Sports Club Management System

A comprehensive web-based backend management system for the Fritim sports club mobile app.

## Features

- **User Authentication**: Secure login system with JWT tokens
- **Club Management**: Create and manage sports clubs
- **User Management**: Add users and link them to clubs
- **Event Management**: Create and manage dugnads and events
- **Marketplace Management**: Manage equipment listings
- **Fund Management**: Track club funds and transactions
- **Dashboard**: Overview of system statistics and recent activity

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Database**: SQLite with better-sqlite3
- **Authentication**: JWT tokens with bcrypt password hashing
- **UI Components**: Lucide React icons
- **Forms**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the backend directory:
```bash
cd Fritim-Backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (optional):
```bash
cp .env.example .env.local
```

4. Seed the database with initial data:
```bash
curl -X POST http://localhost:3000/api/seed
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Credentials

The seeded database includes these demo accounts:

- **Admin**: admin@fritim.no / password123
- **Club Admin**: club@fritim.no / password123  
- **Regular User**: user@fritim.no / password123

## Database Schema

### Users
- User authentication and role management
- Linked to clubs for club-specific access
- Roles: admin, club_admin, user

### Clubs
- Sports club information
- Member counts, establishment dates
- Branding (colors, logos)

### Events
- Dugnads and other club events
- Date/time/location information
- Linked to clubs and created by users

### Event Responses
- User responses to events
- Types: kommer, kan_ikke, frivillig_time, frys_betaling

### Equipment Listings
- Marketplace items for buying/selling
- Condition, pricing, categories
- Linked to sellers and clubs

### Funds
- Club fund tracking
- Monthly and yearly goals
- Transaction history

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics

### Management (to be implemented)
- `GET /api/clubs` - List clubs
- `POST /api/clubs` - Create club
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `GET /api/events` - List events
- `POST /api/events` - Create event
- `GET /api/equipment` - List equipment
- `POST /api/equipment` - Create listing
- `GET /api/funds` - List funds
- `POST /api/funds/transactions` - Add transaction

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Login page
├── lib/                   # Utilities and helpers
│   ├── auth.ts           # Authentication functions
│   ├── database.ts       # Database setup and utilities
│   └── seed.ts           # Database seeding
└── types/                 # TypeScript type definitions
    └── index.ts
```

## Development

### Adding New Features

1. Create API routes in `src/app/api/`
2. Add TypeScript types in `src/types/`
3. Create UI components in `src/app/dashboard/`
4. Update database schema in `src/lib/database.ts`

### Database Management

The database is automatically initialized when the app starts. To reset the database:

1. Delete `database.sqlite` file
2. Restart the application
3. Run the seed endpoint

### Authentication

All protected routes require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Deployment

### Production Setup

1. Set environment variables:
   - `JWT_SECRET`: Secure secret for JWT tokens
   - `DATABASE_URL`: Database connection string (for PostgreSQL in production)

2. Build the application:
```bash
npm run build
```

3. Start the production server:
```bash
npm start
```

### Database Migration

For production, consider migrating from SQLite to PostgreSQL:

1. Install PostgreSQL adapter
2. Update database connection in `src/lib/database.ts`
3. Run migrations

## Security Considerations

- Passwords are hashed with bcrypt
- JWT tokens expire after 7 days
- Input validation with Zod schemas
- SQL injection protection with prepared statements
- CORS configuration for API endpoints

## Mobile App Integration

This backend serves the Fritim mobile app with:
- User authentication and authorization
- Event and club data
- Marketplace listings
- Fund tracking
- Real-time updates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the Fritim sports club management system.
