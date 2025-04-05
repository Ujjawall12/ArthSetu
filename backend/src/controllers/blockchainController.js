const Project = require('../models/Project');
const Expenditure = require('../models/Expenditure');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const config = require('../config');
const logger = require('../utils/logger');

/**
 * Verify a project on the blockchain
 * @route POST /api/blockchain/verify/project/:id
 */
exports.verifyProject = async (req, res) => {
  try {
    // Check if blockchain is enabled
    if (!req.blockchain && !config.blockchain.enabled) {
      return res.status(400).json({
        status: 'error',
        message: 'Blockchain verification is not enabled'
      });
    }

    const { id } = req.params;
    
    // Find project by ID
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }
    
    // If blockchain data exists, fetch and verify from blockchain
    if (project.blockchainData && project.blockchainData.projectHash) {
      try {
        // Get project from blockchain
        const blockchainProject = await req.blockchain.getProject(project._id.toString());
        
        // Verify data matches
        const verificationResult = {
          verified: true,
          details: {
            id: {
              match: blockchainProject.id === project._id.toString(),
              blockchain: blockchainProject.id,
              database: project._id.toString()
            },
            name: {
              match: blockchainProject.name === project.nameEnglish,
              blockchain: blockchainProject.name,
              database: project.nameEnglish
            },
            budget: {
              match: parseFloat(blockchainProject.budget) === project.budget,
              blockchain: blockchainProject.budget,
              database: project.budget.toString()
            },
            createdBy: {
              match: true, // We can't easily compare this as it's a reference in MongoDB
              blockchain: blockchainProject.createdBy,
              database: project.createdBy.toString()
            }
          }
        };
        
        // Overall verification status
        verificationResult.verified = Object.values(verificationResult.details)
          .every(detail => detail.match);
        
        return res.status(200).json({
          status: 'success',
          data: verificationResult
        });
      } catch (error) {
        logger.error(`Blockchain verification error for project ${id}:`, error);
        return res.status(400).json({
          status: 'error',
          message: 'Failed to verify project on blockchain',
          error: error.message
        });
      }
    } else {
      return res.status(400).json({
        status: 'error',
        message: 'Project is not registered on the blockchain'
      });
    }
  } catch (error) {
    logger.error('Project verification error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to verify project',
      error: error.message
    });
  }
};

/**
 * Verify an expenditure on the blockchain
 * @route POST /api/blockchain/verify/expenditure/:id
 */
exports.verifyExpenditure = async (req, res) => {
  try {
    // Check if blockchain is enabled
    if (!req.blockchain && !config.blockchain.enabled) {
      return res.status(400).json({
        status: 'error',
        message: 'Blockchain verification is not enabled'
      });
    }

    const { id } = req.params;
    
    // Find expenditure by ID
    const expenditure = await Expenditure.findById(id);
    if (!expenditure) {
      return res.status(404).json({
        status: 'error',
        message: 'Expenditure not found'
      });
    }
    
    // If blockchain data exists, fetch and verify from blockchain
    if (expenditure.blockchainData && expenditure.blockchainData.txHash) {
      try {
        // Get expenditure from blockchain
        const blockchainExpenditure = await req.blockchain.getExpenditure(expenditure._id.toString());
        
        // Verify data matches
        const verificationResult = {
          verified: true,
          details: {
            id: {
              match: blockchainExpenditure.id === expenditure._id.toString(),
              blockchain: blockchainExpenditure.id,
              database: expenditure._id.toString()
            },
            projectId: {
              match: blockchainExpenditure.projectId === expenditure.project.toString(),
              blockchain: blockchainExpenditure.projectId,
              database: expenditure.project.toString()
            },
            amount: {
              match: parseFloat(blockchainExpenditure.amount) === expenditure.amount,
              blockchain: blockchainExpenditure.amount,
              database: expenditure.amount.toString()
            },
            category: {
              match: blockchainExpenditure.category === expenditure.category,
              blockchain: blockchainExpenditure.category,
              database: expenditure.category
            },
            description: {
              match: blockchainExpenditure.description.includes(expenditure.description.substring(0, 20)),
              blockchain: blockchainExpenditure.description,
              database: expenditure.description
            }
          }
        };
        
        // Overall verification status
        verificationResult.verified = Object.values(verificationResult.details)
          .every(detail => detail.match);
        
        // Update blockchain verification status in the database
        await Expenditure.findByIdAndUpdate(id, {
          'blockchainData.verified': verificationResult.verified,
          'blockchainData.verificationHash': blockchainExpenditure.proofHash
        });
        
        return res.status(200).json({
          status: 'success',
          data: verificationResult
        });
      } catch (error) {
        logger.error(`Blockchain verification error for expenditure ${id}:`, error);
        return res.status(400).json({
          status: 'error',
          message: 'Failed to verify expenditure on blockchain',
          error: error.message
        });
      }
    } else {
      return res.status(400).json({
        status: 'error',
        message: 'Expenditure is not registered on the blockchain'
      });
    }
  } catch (error) {
    logger.error('Expenditure verification error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to verify expenditure',
      error: error.message
    });
  }
};

/**
 * Get blockchain status and information
 * @route GET /api/blockchain/status
 */
exports.getBlockchainStatus = async (req, res) => {
  try {
    // Check if blockchain is enabled
    const isEnabled = config.blockchain.enabled;
    
    // Basic status information
    const status = {
      enabled: isEnabled,
      provider: config.blockchain.provider,
      contractAddress: config.blockchain.contractAddress,
      initialized: false
    };
    
    // If blockchain is enabled, get more information
    if (isEnabled && req.blockchain) {
      try {
        // Get latest block number to confirm connection
        const web3 = req.blockchain.web3;
        const blockNumber = await web3.eth.getBlockNumber();
        
        // Get account and balance
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        const balance = account ? await web3.eth.getBalance(account) : '0';
        
        // Add to status
        status.initialized = true;
        status.blockNumber = blockNumber;
        status.account = account;
        status.balance = web3.utils.fromWei(balance, 'ether');
        
        // Count blockchain entries
        status.statistics = {
          projectsOnBlockchain: 0,
          expendituresOnBlockchain: 0,
          complaintsOnBlockchain: 0
        };
        
        // Get counts from database
        status.statistics.projectsOnBlockchain = await Project.countDocuments({ 
          'blockchainData.projectHash': { $exists: true, $ne: null } 
        });
        
        status.statistics.expendituresOnBlockchain = await Expenditure.countDocuments({ 
          'blockchainData.txHash': { $exists: true, $ne: null } 
        });
        
        status.statistics.complaintsOnBlockchain = await Complaint.countDocuments({ 
          'blockchainData.txHash': { $exists: true, $ne: null } 
        });
        
        return res.status(200).json({
          status: 'success',
          data: status
        });
      } catch (error) {
        logger.error('Blockchain status check error:', error);
        status.error = error.message;
        status.initialized = false;
        
        return res.status(200).json({
          status: 'warning',
          message: 'Blockchain is enabled but not connected',
          data: status
        });
      }
    }
    
    return res.status(200).json({
      status: 'success',
      data: status
    });
  } catch (error) {
    logger.error('Blockchain status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get blockchain status',
      error: error.message
    });
  }
};

/**
 * Register a user's blockchain address
 * @route POST /api/blockchain/register-address
 */
exports.registerAddress = async (req, res) => {
  try {
    const { blockchainAddress } = req.body;
    
    if (!blockchainAddress) {
      return res.status(400).json({
        status: 'error',
        message: 'Blockchain address is required'
      });
    }
    
    // Validate blockchain address format (basic check for Ethereum address)
    const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(blockchainAddress);
    if (!isValidAddress) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid blockchain address format'
      });
    }
    
    // Update user's blockchain address
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { blockchainAddress },
      { new: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Blockchain address registered successfully',
      data: {
        blockchainAddress: updatedUser.blockchainAddress
      }
    });
  } catch (error) {
    logger.error('Register blockchain address error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to register blockchain address',
      error: error.message
    });
  }
}; 