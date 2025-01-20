const express = require('express');
const Student = require('../Model/students');
const router = express.Router();

// // Create a Student
// // POST route to create a new student
// router.post('/', async (req, res) => {
//   try {
//     const { email } = req.body;

//     // Check if a student with the same email already exists
//     const existingStudent = await Student.findOne({ email });
//     if (existingStudent) {
//       return res.status(400).json({ message: 'Student with this email already exists' });
//     }

//     // Create a new student if email is unique
//     const student = new Student(req.body);
//     const savedStudent = await student.save();
//     res.status(201).json(savedStudent);

//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });


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
      grades, // Array of grade IDs
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


// Get All Students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Student by ID
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a Student
router.put('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a Student
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
