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
- MetaMask browser extension

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

## Blockchain Integration

### Smart Contract Deployment

1. The smart contract is deployed using Hardhat:
   ```
   npx hardhat run scripts/deploy.js --network localhost
   ```

2. After deployment, update the contract address in:
   - `backend/.env` (CONTRACT_ADDRESS)
   - `frontend/src/config/blockchain.ts` (defaultContractAddress)

### Project Creation on Blockchain

1. Connect MetaMask to the local network (chain ID 1337)
2. Click "Connect" in the application
3. Fill out the project creation form:
   - Project Name
   - Description
   - Department
   - Total Budget (in ETH)
   - Start Date
   - End Date
4. Submit the form to create the project on the blockchain

### Recording Expenditures

1. Projects must exist on both MongoDB and the blockchain
2. To record an expenditure:
   - Navigate to the project details
   - Click "Add New Expenditure"
   - Fill out the expenditure details
   - Submit to record on the blockchain

### Important Notes

- Projects must be created on the blockchain before recording expenditures
- The contract address must match between frontend and backend
- MetaMask must be connected to the correct network
- Only officials can create projects and record expenditures

## API Documentation

The API includes the following endpoints:

- `/api/auth` - Authentication and user management
- `/api/projects` - Project CRUD operations
- `/api/expenditures` - Expenditure tracking
- `/api/complaints` - Citizen complaint management

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