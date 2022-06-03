const express = require('express');
const router = express.Router();

const { login, register, deleteAllUsers } = require('../controllers/auth');

router.post('/register', register);
router.post('/login', login);
router.delete('/delete', deleteAllUsers);

module.exports = router;
