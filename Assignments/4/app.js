const express = require('express')
const bodyParser = require('body-parser')

const homeRouter = require('./routes/home').router
const userRouter = require('./routes/users')

const app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended: false}))
app.use(homeRouter)
app.use(userRouter)
app.use((req, res) => {
    res.render('404', {pageTitle: 'Error 404'})
})

app.listen(3000)
