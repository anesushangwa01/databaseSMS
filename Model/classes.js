const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  credits: { type: Number, required: true }
});

const gradeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  teacher: { type: String, required: true },
  subjects: [subjectSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Grade = mongoose.model('Grade', gradeSchema);

module.exports = Grade;
