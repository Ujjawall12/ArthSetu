# Government Expenditure Tracking System

A blockchain-based system for transparent tracking of government project expenditures.

## Project Structure

```
.
├── backend/             # Backend API and blockchain integration
│   ├── config/          # Configuration files
│   ├── logs/            # Application logs
│   ├── scripts/         # Utility scripts 
│   ├── src/             # Source code
│   │   ├── blockchain/  # Blockchain integration
│   │   ├── controllers/ # API controllers
│   │   ├── middleware/  # Express middleware
│   │   ├── models/      # Database models
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   └── utils/       # Utility functions
│   ├── uploads/         # File uploads directory
│   ├── .env             # Environment variables
│   └── package.json     # Dependencies and scripts
└── frontend/            # React frontend application
    ├── public/          # Static assets
    ├── src/             # Source code
    │   ├── components/  # React components
    │   ├── pages/       # Page components
    │   ├── services/    # API services
    │   └── utils/       # Utility functions
    └── package.json     # Dependencies and scripts
```

## Features

- Authentication for citizens and government officials
- Project creation and management
- Expenditure tracking with blockchain verification
- Complaint submission and resolution system
- Transparency in government spending

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Blockchain**: Ethereum, Solidity
- **Authentication**: JWT

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- MongoDB
- Ethereum node (or Ganache for local development)

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Copy the sample environment file to create your own:
   ```
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration

5. Deploy the smart contract to the blockchain:
   ```
   npm run deploy-contract
   ```

6. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Access the application at http://localhost:5173 (or the port shown in the console)

## API Documentation

The API includes the following endpoints:

- `/api/auth` - Authentication and user management
- `/api/projects` - Project CRUD operations
- `/api/expenditures` - Expenditure tracking
- `/api/complaints` - Citizen complaint management

## Blockchain Integration

The system uses a smart contract to ensure transparency and immutability:

- Projects and expenditures are recorded on the blockchain
- Verification of expenditures is tracked on-chain
- Citizen complaints and resolutions are recorded for accountability

## Running in Production

For production deployment:

1. Build the frontend:
   ```
   cd frontend
   npm run build
   ```

2. Start the backend in production mode:
   ```
   cd backend
   npm start
   ```

## License

MIT 