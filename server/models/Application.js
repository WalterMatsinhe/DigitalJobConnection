const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  coverLetter: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Rejected', 'Accepted'],
    default: 'Pending'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Application', applicationSchema)
