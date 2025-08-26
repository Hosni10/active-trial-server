const mongoose = require('mongoose');

const academyRegistrationSchema = new mongoose.Schema({
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
  
  selectedTeams: [{
    type: String,
    required: [true, 'At least one team selection is required'],
    validate: {
      validator: function(teams) {
        return teams.length > 0 && teams.length <= 2;
      },
      message: 'You must select between 1 and 2 teams'
    }
  }],

  // Contact Information
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

  // Parent/Guardian Information
  parentName: {
    type: String,
    required: [true, 'Parent/Guardian name is required'],
    trim: true
  },
  
  parentPhone: {
    type: String,
    required: [true, 'Parent/Guardian phone number is required'],
    trim: true
  },
  
  emergencyContact: {
    type: String,
    trim: true
  },

  // Start Date
  startDate: {
    type: Date,
    required: [true, 'Preferred start date is required']
  },

  // Academy Information
  registrationType: {
    type: String,
    default: 'academy',
    enum: ['academy']
  },
  
  // Status and Metadata
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'active', 'inactive'],
    default: 'pending'
  },
  
  registrationDate: {
    type: Date,
    default: Date.now
  },
  
  // Payment Information
  paymentAmount: {
    type: Number,
    required: [true, 'Registration fee is required'],
    min: [0, 'Registration fee must be non-negative']
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

  // Academy-specific status fields
  assessmentCompleted: {
    type: Boolean,
    default: false
  },
  
  assessmentDate: {
    type: Date
  },
  
  assignedCoach: {
    type: String,
    trim: true
  },
  
  assignedGroup: {
    type: String,
    trim: true
  },
  
  startDate: {
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
  },
  
  // Communication tracking
  welcomeEmailSent: {
    type: Boolean,
    default: false
  },
  
  welcomeEmailDate: {
    type: Date
  },
  
  orientationCompleted: {
    type: Boolean,
    default: false
  },
  
  orientationDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for better query performance
academyRegistrationSchema.index({ 
  playerFirstName: 1, 
  playerLastName: 1 
});
academyRegistrationSchema.index({ 
  mobileNumber: 1 
});
academyRegistrationSchema.index({ 
  email: 1 
});
academyRegistrationSchema.index({ 
  status: 1 
});
academyRegistrationSchema.index({ 
  registrationDate: -1 
});
academyRegistrationSchema.index({ 
  paymentStatus: 1 
});
academyRegistrationSchema.index({ 
  parentPhone: 1 
});

// Virtual for full name
academyRegistrationSchema.virtual('fullName').get(function() {
  return `${this.playerFirstName} ${this.playerLastName}`;
});

// Virtual for age calculation
academyRegistrationSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Virtual for age group
academyRegistrationSchema.virtual('ageGroup').get(function() {
  const age = this.age;
  if (!age) return null;
  
  if (age <= 6) return 'U6';
  if (age <= 8) return 'U8';
  if (age <= 10) return 'U10';
  if (age <= 12) return 'U12';
  if (age <= 14) return 'U14';
  if (age <= 16) return 'U16';
  if (age <= 18) return 'U18';
  return 'Senior';
});

// Ensure virtual fields are serialized
academyRegistrationSchema.set('toJSON', { virtuals: true });
academyRegistrationSchema.set('toObject', { virtuals: true });

// Pre-save middleware to validate phone numbers
academyRegistrationSchema.pre('save', function(next) {
  // UAE Phone validation for player mobile
  const uaePhoneRegex = /^(\+971|971|0)?[2-9][0-9]{8}$/;
  if (!uaePhoneRegex.test(this.mobileNumber.replace(/\s/g, ""))) {
    return next(new Error('Invalid player mobile number format'));
  }
  
  // UAE Phone validation for parent phone
  if (!uaePhoneRegex.test(this.parentPhone.replace(/\s/g, ""))) {
    return next(new Error('Invalid parent phone number format'));
  }
  
  next();
});

module.exports = mongoose.model('AcademyRegistration', academyRegistrationSchema);
