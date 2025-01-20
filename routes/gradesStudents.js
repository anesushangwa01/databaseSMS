const express = require('express');
const Student = require('../Model/students');
const Grade = require('../Model/classes');
const router = express.Router();

// POST route to create a new student
router.post('/', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      dateOfBirth,
      address,
      phone,
      grades, 
    } = req.body;

    // Fetch grades and validate they exist
    const gradeRecords = await Grade.find({ _id: { $in: grades } });
    if (gradeRecords.length !== grades.length) {
      return res.status(400).json({ message: 'One or more grades not found' });
    }

    // Ensure all grades have the same teacher
    const teacherSet = new Set(gradeRecords.map((grade) => grade.teacher));
    if (teacherSet.size > 1) {
      return res.status(400).json({
        message: 'All grades must belong to the same teacher',
      });
    }

    // Create the student
    const student = new Student({
      firstName,
      lastName,
      email,
      dateOfBirth,
      address,
      phone,
      grades,
    });

    const savedStudent = await student.save();

    // Populate grades and return the result
    const populatedStudent = await savedStudent.populate({
      path: 'grades',
      populate: {
        path: 'subjects',
      },
    });

    res.status(201).json(populatedStudent);
  } catch (err) {
    console.error("Error creating student:", err.message);
    res.status(400).json({ message: err.message });
  }
});


// Get all data from both Student and Grade collections
router.get('/', async (req, res) => {
    try {
      // Fetch all students and populate their grades
      const students = await Student.find().populate('grades');
  
      // Fetch all grades
      const grades = await Grade.find();
  
      res.status(200).json({
        students,
        grades,
      });
    } catch (err) {
      res.status(500).json({
        message: 'An error occurred while fetching data',
        error: err.message,
      });
    }
  });



  router.put('/:id', async (req, res) => {
    try {
      const { firstName, lastName, email, grades } = req.body;
  
      // Check if the grades provided are valid
      if (grades && grades.length > 0) {
        const gradeRecords = await Grade.find({ _id: { $in: grades } });
        if (gradeRecords.length !== grades.length) {
          return res.status(400).json({ message: 'One or more grades not found' });
        }
      }
  
      // Find the student by ID
      const student = await Student.findById(req.params.id);
  
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      // Update student details
      student.firstName = firstName || student.firstName;
      student.lastName = lastName || student.lastName;
      student.email = email || student.email;
      student.grades = grades || student.grades;
  
      // Save the updated student record
      const updatedStudent = await student.save();
  
      // Populate the grades field to return the full grade details
      const populatedStudent = await updatedStudent.populate('grades').execPopulate();
  
      res.status(200).json(populatedStudent);
    } catch (err) {
      console.error("Error updating student:", err.message);
      res.status(400).json({ message: err.message });
    }
  });



  // GET route to fetch a student by their ID
router.get('/:id', async (req, res) => {
  try {
    // Find the student by ID and populate the grades
    const student = await Student.findById(req.params.id).populate('grades');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student);
  } catch (err) {
    console.error("Error fetching student:", err.message);
    res.status(400).json({ message: err.message });
  }
});

  


// Delete all data from both Student and Grade collections
router.delete('/', async (req, res) => {
  try {
    // Delete all records from the Student collection
    await Student.deleteMany({});

    // Delete all records from the Grade collection
    await Grade.deleteMany({});

    res.status(200).json({ message: 'All students and grades have been deleted' });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while deleting data', error: err.message });
  }
});


// DELETE route to remove a student by their ID
router.delete('/:id', async (req, res) => {
  try {
    // Find and delete the student by ID
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }


    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error("Error deleting student:", err.message);
    res.status(400).json({ message: err.message });
  }
});


module.exports = router;
