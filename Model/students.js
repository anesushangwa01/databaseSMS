const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName: { type: String,  },
  lastName: { type: String,  },

  dateOfBirth: { type: Date,  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
  },
  phone: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Student', studentSchema);
