const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const studentRoutes = require('./routes/student.routes');
const studentGrades = require('./routes/grades');
const studentGradesAll = require('./routes/gradesStudents');

// Load environment variables from .env file
dotenv.config();

// Initialize express app
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Set up port from environment or default to 3000
const port = process.env.PORT || 3000;

// MongoDB connection setup
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server after successful DB connection
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit process with failure if DB connection fails
  });

// Use routes for students
app.use('/students', studentRoutes);
app.use('/class', studentGrades)
app.use('/all', studentGradesAll)

// Simple route to check if the API is running
app.get('/', (req, res) => {
  res.send('Student Management API is running');
});
