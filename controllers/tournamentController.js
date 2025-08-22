const TournamentRegistration = require('../models/TournamentRegistration');

// Create new tournament registration
const createRegistration = async (req, res) => {
  try {
    const registration = new TournamentRegistration(req.body);
    await registration.save();

    res.status(201).json({
      success: true,
      message: 'Tournament registration created successfully',
      data: registration
    });
  } catch (error) {
    console.error('Error creating registration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create tournament registration',
      error: error.message
    });
  }
};

// Get all registrations with pagination and filtering
const getRegistrations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status || '';

    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    
    if (search) {
      query.$or = [
        { playerFirstName: { $regex: search, $options: 'i' } },
        { playerLastName: { $regex: search, $options: 'i' } },
        { teamName: { $regex: search, $options: 'i' } },
        { mobileNumber: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { academyClub: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      query.status = status;
    }

    // Execute query
    const registrations = await TournamentRegistration.find(query)
      .sort({ registrationDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await TournamentRegistration.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: registrations,
      pagination: {
        currentPage: page,
        totalPages,
        totalRegistrations: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registrations',
      error: error.message
    });
  }
};

// Get registration by ID
const getRegistrationById = async (req, res) => {
  try {
    const registration = await TournamentRegistration.findById(req.params.id);
    
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    res.json({
      success: true,
      data: registration
    });
  } catch (error) {
    console.error('Error fetching registration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registration',
      error: error.message
    });
  }
};

// Update registration status
const updateRegistrationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const registration = await TournamentRegistration.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    res.json({
      success: true,
      message: 'Registration status updated successfully',
      data: registration
    });
  } catch (error) {
    console.error('Error updating registration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update registration',
      error: error.message
    });
  }
};

// Update registration
const updateRegistration = async (req, res) => {
  try {
    const registration = await TournamentRegistration.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    res.json({
      success: true,
      message: 'Registration updated successfully',
      data: registration
    });
  } catch (error) {
    console.error('Error updating registration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update registration',
      error: error.message
    });
  }
};

// Delete registration
const deleteRegistration = async (req, res) => {
  try {
    const registration = await TournamentRegistration.findByIdAndDelete(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    res.json({
      success: true,
      message: 'Registration deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting registration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete registration',
      error: error.message
    });
  }
};

// Get statistics
const getStats = async (req, res) => {
  try {
    const [
      totalRegistrations,
      pendingRegistrations,
      confirmedRegistrations,
      cancelledRegistrations,
      registrationsByDate
    ] = await Promise.all([
      TournamentRegistration.countDocuments(),
      TournamentRegistration.countDocuments({ status: 'pending' }),
      TournamentRegistration.countDocuments({ status: 'confirmed' }),
      TournamentRegistration.countDocuments({ status: 'cancelled' }),
      TournamentRegistration.aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$registrationDate" }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: -1 } },
        { $limit: 7 }
      ])
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalRegistrations,
          pendingRegistrations,
          confirmedRegistrations,
          cancelledRegistrations
        },
        recentRegistrations: registrationsByDate
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};

module.exports = {
  createRegistration,
  getRegistrations,
  getRegistrationById,
  updateRegistrationStatus,
  updateRegistration,
  deleteRegistration,
  getStats
};


