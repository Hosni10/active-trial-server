const express = require('express');
const router = express.Router();
const {
  createRegistration,
  getRegistrations,
  getRegistrationById,
  updateRegistrationStatus,
  updateRegistration,
  deleteRegistration,
  getStats
} = require('../controllers/tournamentController');

const {
  validateTournamentRegistration,
  validateStatusUpdate,
  handleValidationErrors
} = require('../middleware/validation');

// POST /api/tournament-registrations - Create new registration
router.post('/', validateTournamentRegistration, handleValidationErrors, createRegistration);

// GET /api/tournament-registrations - Get all registrations with pagination and filtering
router.get('/', getRegistrations);

// GET /api/tournament-registrations/stats - Get statistics
router.get('/stats', getStats);

// GET /api/tournament-registrations/:id - Get registration by ID
router.get('/:id', getRegistrationById);

// PUT /api/tournament-registrations/:id - Update registration status
router.put('/:id', validateStatusUpdate, handleValidationErrors, updateRegistrationStatus);

// PATCH /api/tournament-registrations/:id - Update registration (full update)
router.patch('/:id', validateTournamentRegistration, handleValidationErrors, updateRegistration);

// DELETE /api/tournament-registrations/:id - Delete registration
router.delete('/:id', deleteRegistration);

module.exports = router;




