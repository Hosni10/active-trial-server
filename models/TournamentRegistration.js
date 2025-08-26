const mongoose = require('mongoose');

const tournamentRegistrationSchema = new mongoose.Schema({
  // Player Information
  playerFirstName: {
    type: String,
    required: [true, 'Player first name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters']
  },
  playerLastName: {
    type: String,
    required: [true, 'Player last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters']
  },

  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },

  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['male', 'female']
  },

  playingPositions: [{
    type: String,
    required: [true, 'Playing position is required'],
    enum: ['GK', 'CB', 'RB', 'LB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST']
  }],
  divisionLastSeason: {
    type: String,
    required: [true, 'Division competed at last season is required'],
    trim: true
  },
  strengthWeakness: {
    type: String,
    required: [true, 'Strength and weakness description is required'],
    trim: true
  },
  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  academyClub: {
    type: String,
    required: [true, 'Academy/Club is required'],
    trim: true
  },
  preferredLocations: [{
    type: String,
    required: [true, 'Preferred location is required'],
    enum: ['active-mariah', 'saadiyat']
  }],
  trialDate: {
    type: String,
    required: [true, 'Trial date is required']
  },
  trialDateLabel: {
    type: String,
    required: [true, 'Trial date label is required']
  },
  
  // Tournament Information
  tournament: {
    type: String,
    default: 'ATOMICS PRESEASON CUP'
  },
  cupDates: {
    type: String,
    default: 'Tuesday - Thursday 26th - 28th August'
  },
  timings: {
    type: String,
    default: '5:00 PM to 9:00 PM'
  },
  location: {
    type: String,
    default: 'Active Sports Pitches'
  },
  
  // Status and Metadata
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  
  // Payment Information
  paymentAmount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: [0, 'Payment amount must be non-negative']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  stripePaymentIntentId: {
    type: String,
    trim: true
  },
  paymentDate: {
    type: Date
  },
  
  // Additional fields for tracking
  notes: {
    type: String,
    trim: true
  },
  adminNotes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for better query performance
tournamentRegistrationSchema.index({ 
  playerFirstName: 1, 
  playerLastName: 1 
});
tournamentRegistrationSchema.index({ 
  mobileNumber: 1 
});
tournamentRegistrationSchema.index({ 
  email: 1 
});
tournamentRegistrationSchema.index({ 
  status: 1 
});
tournamentRegistrationSchema.index({ 
  registrationDate: -1 
});

// Virtual for full name
tournamentRegistrationSchema.virtual('fullName').get(function() {
  return `${this.playerFirstName} ${this.playerLastName}`;
});

// Ensure virtual fields are serialized
tournamentRegistrationSchema.set('toJSON', { virtuals: true });
tournamentRegistrationSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('TournamentRegistration', tournamentRegistrationSchema);


