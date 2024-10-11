const Admin = require('../models/adminModel');
const Assignment = require('../models/assignmentModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerAdmin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const newAdmin = new Admin({ username, password });
        await newAdmin.save();
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Admin registration failed' });
    }
};

exports.loginAdmin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: 'Login failed' });
    }
};

exports.viewAssignments = async (req, res) => {
    const adminId = req.user.id;
    try {
        const assignments = await Assignment.find({ adminId }).populate('userId', 'username');
        res.json(assignments);
    } catch (error) {
        res.status(400).json({ error: 'Failed to fetch assignments' });
    }
};

exports.acceptAssignment = async (req, res) => {
    const { id } = req.params;
    try {
        const assignment = await Assignment.findById(id);
        if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
        assignment.status = 'accepted';
        await assignment.save();
        res.json({ message: 'Assignment accepted' });
    } catch (error) {
        res.status(400).json({ error: 'Failed to accept assignment' });
    }
};

exports.rejectAssignment = async (req, res) => {
    const { id } = req.params;
    try {
        const assignment = await Assignment.findById(id);
        if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
        assignment.status = 'rejected';
        await assignment.save();
        res.json({ message: 'Assignment rejected' });
    } catch (error) {
        res.status(400).json({ error: 'Failed to reject assignment' });
    }
};
