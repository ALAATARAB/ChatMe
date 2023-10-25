const express = require('express');
const router = express.Router();
const {getMessagesBetween} = require('../controllers/messages');


router.get('/:userId',getMessagesBetween);


module.exports = router;