const User = require('../models/userModel');
const Assignment = require('../models/assignmentModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const newUser = new User({ username, password });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: 'User registration failed' });
    }
};

exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: 'Login failed' });
    }
};

exports.uploadAssignment = async (req, res) => {
    const { task, adminId } = req.body;
    const userId = req.user.id;
    try {
        const assignment = new Assignment({ userId, task, adminId });
        await assignment.save();
        res.status(201).json({ message: 'Assignment uploaded' });
    } catch (error) {
        res.status(400).json({ error: 'Upload failed' });
    }
};

exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find({});
        res.json(admins);
    } catch (error) {
        res.status(400).json({ error: 'Failed to fetch admins' });
    }
};
