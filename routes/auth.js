const express = require('express');
const {check} = require('express-validator/check')

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post('/signup', [
    check('email').isEmail().normalizeEmail().withMessage('Please enter a valid email.'), 
    check('password', 'Password should be at least 6 characters long with alphabets and numerics').isLength({min: 6}).isAlphanumeric().trim(),
    check('confirmPassword').custom((value, {req}) => {
        if(value !== req.body.password) {
            throw new Error('Passwords have to match!')
        }
        return true
    }).trim()
    ], authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset)

router.post('/reset', authController.postReset)

router.get('/reset/:token', authController.getNewPassword)

router.post('/new-password', authController.postNewPassword)

module.exports = router;