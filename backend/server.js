const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3010;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory storage for demo (replace with database in production)
let applications = [];
let nextId = 1;

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Referral Capital Application API is running' });
});

// Submit application
app.post('/api/applications', (req, res) => {
  try {
    const applicationData = req.body;
    
    // Validate required fields
    const requiredFields = [
      'loanType', 'isBusinessOwner', 'monthlySales', 'hasExistingLoans',
      'firstName', 'lastName', 'email', 'phone', 'title', 'businessName',
      'fundingAmount', 'fundingPurpose', 'industry', 'businessAddress', 'yearEstablished', 
      'numberOfEmployees', 'businessType', 'annualRevenue', 'creditScore', 'timeInBusiness', 
      'bankName', 'accountType', 'routingNumber', 'accountNumber', 'taxId', 'previousBankruptcy', 'outstandingLoans'
    ];
    
    const missingFields = requiredFields.filter(field => !applicationData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        missingFields
      });
    }
    
    // Create application object
    const application = {
      id: nextId++,
      ...applicationData,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Store application
    applications.push(application);
    
    console.log(`New application submitted: ${application.id} - ${application.businessName}`);
    
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: application.id,
      data: {
        id: application.id,
        businessName: application.businessName,
        email: application.email,
        status: application.status,
        submittedAt: application.submittedAt
      }
    });
    
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to submit application'
    });
  }
});

// Get all applications (for admin use)
app.get('/api/applications', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedApplications = applications.slice(startIndex, endIndex);
    
    res.json({
      applications: paginatedApplications,
      pagination: {
        current: page,
        limit,
        total: applications.length,
        pages: Math.ceil(applications.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch applications'
    });
  }
});

// Get specific application by ID
app.get('/api/applications/:id', (req, res) => {
  try {
    const applicationId = parseInt(req.params.id);
    const application = applications.find(app => app.id === applicationId);
    
    if (!application) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Application not found'
      });
    }
    
    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch application'
    });
  }
});

// Update application status
app.patch('/api/applications/:id/status', (req, res) => {
  try {
    const applicationId = parseInt(req.params.id);
    const { status } = req.body;
    
    const applicationIndex = applications.findIndex(app => app.id === applicationId);
    
    if (applicationIndex === -1) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Application not found'
      });
    }
    
    // Valid status values
    const validStatuses = ['pending', 'reviewing', 'approved', 'rejected', 'more-info-needed'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        message: 'Status must be one of: ' + validStatuses.join(', ')
      });
    }
    
    applications[applicationIndex].status = status;
    applications[applicationIndex].updatedAt = new Date().toISOString();
    
    res.json({
      success: true,
      message: 'Application status updated',
      data: applications[applicationIndex]
    });
    
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update application status'
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'API endpoint not found'
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Referral Capital Application API server running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 Applications endpoint: http://localhost:${PORT}/api/applications`);
});