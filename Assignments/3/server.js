const express = require('express')
const path = require('path')

const app = express()

const homeRoute = require('./routes/home')
const usersRoute = require('./routes/users')

app.use(express.static(path.join(__dirname, 'public')))
app.use(homeRoute)
app.use(usersRoute)

app.use((req, res) => {
    res.status(402).sendFile(path.join(__dirname, 'views', '404.html'))
})

app.listen(3000)