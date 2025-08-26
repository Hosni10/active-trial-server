const express = require('express');
const router = express.Router();
const {
  createAcademyRegistration,
  getAllAcademyRegistrations,
  getAcademyRegistrationById,
  updateAcademyRegistration,
  updatePaymentStatus,
  deleteAcademyRegistration,
  getAcademyStats,
  bulkUpdateStatus
} = require('../controllers/academyController');

// Validation middleware
const validateAcademyRegistration = (req, res, next) => {
  const {
    playerFirstName,
    playerLastName,
    dateOfBirth,
    playingPositions,
    selectedTeams,
    mobileNumber,
    email,
    academyClub,
    preferredLocations,
    paymentAmount,
    parentName,
    parentPhone,
    startDate
  } = req.body;

  const errors = [];

  // Required field validation
  if (!playerFirstName || playerFirstName.trim().length < 2) {
    errors.push('Player first name is required and must be at least 2 characters');
  }

  if (!playerLastName || playerLastName.trim().length < 2) {
    errors.push('Player last name is required and must be at least 2 characters');
  }

  if (!dateOfBirth) {
    errors.push('Date of birth is required');
  }

  if (!playingPositions || !Array.isArray(playingPositions) || playingPositions.length === 0) {
    errors.push('At least one playing position is required');
  }

  if (!selectedTeams || !Array.isArray(selectedTeams) || selectedTeams.length === 0) {
    errors.push('At least one team selection is required');
  } else if (selectedTeams.length > 2) {
    errors.push('You can select a maximum of 2 teams');
  }

  if (!mobileNumber || mobileNumber.trim().length === 0) {
    errors.push('Mobile number is required');
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Valid email address is required');
  }

  if (!academyClub || academyClub.trim().length === 0) {
    errors.push('Academy/Club is required');
  }

  if (!preferredLocations || !Array.isArray(preferredLocations) || preferredLocations.length === 0) {
    errors.push('At least one preferred location is required');
  }

  if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
    errors.push('Valid payment amount is required');
  }

  if (!parentName || parentName.trim().length === 0) {
    errors.push('Parent/Guardian name is required');
  }

  if (!parentPhone || parentPhone.trim().length === 0) {
    errors.push('Parent/Guardian phone number is required');
  }

  if (!startDate) {
    errors.push('Preferred start date is required');
  } else {
    const selectedDate = new Date(startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      errors.push('Start date cannot be in the past');
    }
  }

  // UAE Phone validation
  const uaePhoneRegex = /^(\+971|971|0)?[2-9][0-9]{8}$/;
  if (mobileNumber && !uaePhoneRegex.test(mobileNumber.replace(/\s/g, ""))) {
    errors.push('Invalid player mobile number format');
  }

  if (parentPhone && !uaePhoneRegex.test(parentPhone.replace(/\s/g, ""))) {
    errors.push('Invalid parent phone number format');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }

  next();
};

// Routes

// POST /api/academy-registrations - Create new academy registration
router.post('/', validateAcademyRegistration, createAcademyRegistration);

// GET /api/academy-registrations - Get all academy registrations (with pagination and filtering)
router.get('/', getAllAcademyRegistrations);

// GET /api/academy-registrations/stats - Get academy registration statistics
router.get('/stats', getAcademyStats);

// GET /api/academy-registrations/:id - Get single academy registration by ID
router.get('/:id', getAcademyRegistrationById);

// PUT /api/academy-registrations/:id - Update academy registration
router.put('/:id', updateAcademyRegistration);

// PATCH /api/academy-registrations/:id/payment - Update payment status
router.patch('/:id/payment', updatePaymentStatus);

// DELETE /api/academy-registrations/:id - Delete academy registration
router.delete('/:id', deleteAcademyRegistration);

// POST /api/academy-registrations/bulk-update - Bulk update status
router.post('/bulk-update', bulkUpdateStatus);

module.exports = router;
