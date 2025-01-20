const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { 
    type: String, 
    unique: true, 
  
  },
  dateOfBirth: { type: Date },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
  },
  phone: String,
  grades: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Grade' }], // Reference to Grade
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
