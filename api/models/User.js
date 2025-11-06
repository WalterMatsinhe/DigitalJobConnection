const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'company'], default: 'user' },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', default: null },
  // Profile fields
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  headline: { type: String, default: '' },
  bio: { type: String, default: '' },
  skills: { type: [String], default: [] },
  experience: { type: String, default: '' },
  education: { type: String, default: '' },
  portfolio: { type: String, default: '' },
  avatar: { type: String, default: '/assets/Black American professionals in career.png' },
  // CV fields
  cv: { type: String, default: '' },
  cvType: { type: String, default: 'application/pdf' },
  cvName: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('User', userSchema)
