const express = require('express');
const router = express.Router();
const {signUp,logIn} = require('../controllers/auth');
const {body} = require('express-validator');

router.post('/signup',
[body('email','invalid Email').isEmail(),body('password','The password should be from 8 to 40 chars').trim().isLength({min:8,max:40})]
,signUp);

router.post('/login',
[body('email','invalid Email').isEmail() ,body('password','The password should be from 8 to 40 chars').trim().isLength({min:8,max:40})]
,logIn);

module.exports = router;