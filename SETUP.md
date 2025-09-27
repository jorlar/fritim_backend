# Fritim Backend Setup

## Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Start development server:**
```bash
npm run dev
```

3. **Access the application:**
   - Open http://localhost:3000
   - Login with: admin@fritim.no / password123

## What's Included

This backend includes:
- ✅ User authentication system
- ✅ Database schema and models
- ✅ Login page with proper styling
- ✅ Dashboard with statistics
- ✅ API routes for authentication
- ✅ SQLite database with seeding

## Next Steps

The backend foundation is ready. You can now:
1. Implement club management interface
2. Add user management pages
3. Create event management system
4. Build marketplace management
5. Add fund management features

## Database

The system uses SQLite with these main tables:
- users (authentication and roles)
- clubs (sports club information)
- events (dugnads and activities)
- event_responses (user participation)
- equipment_listings (marketplace)
- funds (club finances)
- fund_transactions (income/expenses)

## Demo Data

The seeded database includes:
- 3 sports clubs
- Sample events and responses
- Equipment listings
- Fund data with transactions
- Multiple user accounts with different roles
