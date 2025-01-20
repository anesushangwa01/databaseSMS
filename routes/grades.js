const express = require('express');
const Grade = require('../Model/classes');  // assuming you saved the Grade model in 'grades.js'
const router = express.Router();

// Create a Grade
// POST route to create a new grade
router.post('/', async (req, res) => {
  try {
    const { name, teacher } = req.body;

    // Validate the input
    if (!name || !teacher) {
      return res.status(400).json({ message: "Name and teacher are required." });
    }

    // Check if a grade with the same name already exists
    const existingGrade = await Grade.findOne({ name });
    if (existingGrade) {
      return res.status(400).json({ message: "Grade with this name already exists." });
    }

    // Create and save the new grade
    const grade = new Grade(req.body);
    const savedGrade = await grade.save();

    res.status(201).json(savedGrade);

  } catch (err) {
    console.error("Error creating grade:", err.message);
    res.status(400).json({ message: err.message });
  }
});

// Get All Grades
router.get('/', async (req, res) => {
  try {
    const grades = await Grade.find();
    res.status(200).json(grades);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Grade by ID
router.get('/:id', async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);
    if (!grade) return res.status(404).json({ message: 'Grade not found' });
    res.json(grade);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a Grade
router.put('/:id', async (req, res) => {
  try {
    const grade = await Grade.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!grade) return res.status(404).json({ message: 'Grade not found' });
    res.json(grade);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a Grade
router.delete('/:id', async (req, res) => {
  try {
    const grade = await Grade.findByIdAndDelete(req.params.id);
    if (!grade) return res.status(404).json({ message: 'Grade not found' });
    res.json({ message: 'Grade deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
