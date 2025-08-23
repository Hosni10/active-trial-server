const { body, validationResult } = require('express-validator');

// Validation rules for tournament registration
const validateTournamentRegistration = [
  body('playerFirstName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Player first name must be at least 2 characters long'),
  
  body('playerLastName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Player last name must be at least 2 characters long'),
  
  body('teamName')
    .trim()
    .notEmpty()
    .withMessage('Team name is required'),
  
  body('dateOfBirth')
    .isISO8601()
    .withMessage('Valid date of birth is required'),
  
  body('playingPosition')
    .isIn(['GK', 'CB', 'RB', 'LB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST'])
    .withMessage('Valid playing position is required'),
  
  body('divisionLastSeason')
    .trim()
    .notEmpty()
    .withMessage('Division competed at last season is required'),
  
  body('strengthWeakness')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Strength and weakness description must be at least 10 characters long'),
  
  body('mobileNumber')
    .trim()
    .matches(/^(\+971|971|0)?[2-9][0-9]{8}$/)
    .withMessage('Please enter a valid UAE phone number'),
  
  body('academyClub')
    .trim()
    .notEmpty()
    .withMessage('Academy/Club is required'),
  
  body('preferredLocations')
    .isArray({ min: 1 })
    .withMessage('At least one preferred location is required'),
  
  body('preferredLocations.*')
    .isIn(['active-mariah', 'saadiyat'])
    .withMessage('Valid preferred location is required'),
  
  body('trialDate')
    .notEmpty()
    .withMessage('Trial date is required'),
  
  body('trialDateLabel')
    .notEmpty()
    .withMessage('Trial date label is required')
];

// Validation rules for status update
const validateStatusUpdate = [
  body('status')
    .isIn(['pending', 'confirmed', 'cancelled'])
    .withMessage('Valid status is required')
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }
  next();
};

module.exports = {
  validateTournamentRegistration,
  validateStatusUpdate,
  handleValidationErrors
};




