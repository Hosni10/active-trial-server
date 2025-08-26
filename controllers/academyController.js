const AcademyRegistration = require('../models/AcademyRegistration');

// Create new academy registration
const createAcademyRegistration = async (req, res) => {
  try {
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
      emergencyContact,
      startDate
    } = req.body;

    // Check if player already exists
    const existingPlayer = await AcademyRegistration.findOne({
      $or: [
        { email: email.toLowerCase() },
        { mobileNumber: mobileNumber },
        { 
          playerFirstName: playerFirstName,
          playerLastName: playerLastName,
          dateOfBirth: dateOfBirth
        }
      ]
    });

    if (existingPlayer) {
      return res.status(400).json({
        success: false,
        message: 'A registration with this information already exists. Please contact us if you need assistance.'
      });
    }

    // Create new academy registration
    const academyRegistration = new AcademyRegistration({
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
      emergencyContact,
      startDate,
      registrationType: 'academy'
    });

    await academyRegistration.save();

    console.log('Academy registration created:', academyRegistration._id);

    res.status(201).json({
      success: true,
      message: 'Academy registration submitted successfully',
      data: academyRegistration
    });

  } catch (error) {
    console.error('Error creating academy registration:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while creating academy registration'
    });
  }
};

// Get all academy registrations (with pagination and filtering)
const getAllAcademyRegistrations = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      paymentStatus,
      search,
      sortBy = 'registrationDate',
      sortOrder = 'desc'
    } = req.query;

    const query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by payment status
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { playerFirstName: { $regex: search, $options: 'i' } },
        { playerLastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobileNumber: { $regex: search, $options: 'i' } },
        { parentName: { $regex: search, $options: 'i' } },
        { parentPhone: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    const registrations = await AcademyRegistration.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await AcademyRegistration.countDocuments(query);

    res.json({
      success: true,
      data: registrations,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching academy registrations:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching academy registrations'
    });
  }
};

// Get single academy registration by ID
const getAcademyRegistrationById = async (req, res) => {
  try {
    const { id } = req.params;

    const registration = await AcademyRegistration.findById(id).select('-__v');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Academy registration not found'
      });
    }

    res.json({
      success: true,
      data: registration
    });

  } catch (error) {
    console.error('Error fetching academy registration:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid registration ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching academy registration'
    });
  }
};

// Update academy registration
const updateAcademyRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.registrationDate;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const registration = await AcademyRegistration.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Academy registration not found'
      });
    }

    res.json({
      success: true,
      message: 'Academy registration updated successfully',
      data: registration
    });

  } catch (error) {
    console.error('Error updating academy registration:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid registration ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while updating academy registration'
    });
  }
};

// Update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, stripePaymentIntentId } = req.body;

    const updateData = {
      paymentStatus,
      paymentDate: paymentStatus === 'completed' ? new Date() : null
    };

    if (stripePaymentIntentId) {
      updateData.stripePaymentIntentId = stripePaymentIntentId;
    }

    const registration = await AcademyRegistration.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Academy registration not found'
      });
    }

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: registration
    });

  } catch (error) {
    console.error('Error updating payment status:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid registration ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while updating payment status'
    });
  }
};

// Delete academy registration
const deleteAcademyRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    const registration = await AcademyRegistration.findByIdAndDelete(id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Academy registration not found'
      });
    }

    res.json({
      success: true,
      message: 'Academy registration deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting academy registration:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid registration ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while deleting academy registration'
    });
  }
};

// Get academy registration statistics
const getAcademyStats = async (req, res) => {
  try {
    const stats = await AcademyRegistration.aggregate([
      {
        $group: {
          _id: null,
          totalRegistrations: { $sum: 1 },
          pendingRegistrations: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          approvedRegistrations: {
            $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
          },
          activeRegistrations: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          pendingPayments: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'pending'] }, 1, 0] }
          },
          completedPayments: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'completed'] }, 1, 0] }
          },
          totalRevenue: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'completed'] }, '$paymentAmount', 0] }
          }
        }
      }
    ]);

    // Get age group distribution
    const ageGroupStats = await AcademyRegistration.aggregate([
      {
        $group: {
          _id: '$ageGroup',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Get location distribution
    const locationStats = await AcademyRegistration.aggregate([
      {
        $unwind: '$preferredLocations'
      },
      {
        $group: {
          _id: '$preferredLocations',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalRegistrations: 0,
          pendingRegistrations: 0,
          approvedRegistrations: 0,
          activeRegistrations: 0,
          pendingPayments: 0,
          completedPayments: 0,
          totalRevenue: 0
        },
        ageGroupDistribution: ageGroupStats,
        locationDistribution: locationStats
      }
    });

  } catch (error) {
    console.error('Error fetching academy statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching academy statistics'
    });
  }
};

// Bulk operations
const bulkUpdateStatus = async (req, res) => {
  try {
    const { registrationIds, status, adminNotes } = req.body;

    if (!registrationIds || !Array.isArray(registrationIds) || registrationIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Registration IDs array is required'
      });
    }

    const updateData = { status };
    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }

    const result = await AcademyRegistration.updateMany(
      { _id: { $in: registrationIds } },
      updateData
    );

    res.json({
      success: true,
      message: `Successfully updated ${result.modifiedCount} registrations`,
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Error performing bulk update:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while performing bulk update'
    });
  }
};

module.exports = {
  createAcademyRegistration,
  getAllAcademyRegistrations,
  getAcademyRegistrationById,
  updateAcademyRegistration,
  updatePaymentStatus,
  deleteAcademyRegistration,
  getAcademyStats,
  bulkUpdateStatus
};
