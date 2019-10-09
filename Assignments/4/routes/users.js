const express = require('express')

const router = express.Router()
const users = require('./home')

router.get('/users', (req, res) => {
    res.render('users', {pageTitle: 'Users', users: users.users })
})

module.exports = router
