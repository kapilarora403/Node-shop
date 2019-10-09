const express = require('express')

const router = express.Router()

const users = []

router.get('/', (req, res) => {
    res.render('home', {pageTitle: 'HomePage'})
})

router.post('/add-users', (req, res) => {
    users.push(req.body.username)
    res.redirect('/users')
})

exports.users = users
exports.router = router