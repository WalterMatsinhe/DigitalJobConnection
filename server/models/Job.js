const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  location: {
    type: String,
    required: true
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'],
    default: 'Full-time'
  },
  sector: {
    type: String,
    default: 'IT'
  },
  salary: {
    type: String,
    default: ''
  },
  deadline: {
    type: Date,
    required: true
  },
  applications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Active', 'Closed', 'Draft'],
    default: 'Active'
  }
})

module.exports = mongoose.model('Job', jobSchema)
