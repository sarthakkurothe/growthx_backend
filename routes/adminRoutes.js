// routes/adminRoutes.js
const express = require('express');
const { registerAdmin, loginAdmin, viewAssignments, acceptAssignment, rejectAssignment } = require('../controllers/adminController');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/assignments', authMiddleware, viewAssignments);
router.post('/assignments/:id/accept', authMiddleware, acceptAssignment);
router.post('/assignments/:id/reject', authMiddleware, rejectAssignment);

module.exports = router;

