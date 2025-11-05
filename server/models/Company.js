const mongoose = require('mongoose')

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  companyName: { type: String, required: true },
  industry: { type: String, default: '' },
  website: { type: String, default: '' },
  description: { type: String, default: '' },
  logo: { type: String, default: '' },
  location: { type: String, default: '' },
  // Additional profile fields
  phone: { type: String, default: '' },
  headline: { type: String, default: '' },
  bio: { type: String, default: '' },
  employees: { type: Number, default: 0 },
  foundedYear: { type: Number, default: null },
  social: {
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    facebook: { type: String, default: '' }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Company', companySchema)
