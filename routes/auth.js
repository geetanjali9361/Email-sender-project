const express = require('express');
const router = express.Router();
const triggerEmail = require("../controller/emailSender")

// Route definition
router.get('/', (req, res) => {
    res.status(200).json({ message: "The server is running" });
});

router.get('/trigger-email',triggerEmail.emailService)

module.exports = router;