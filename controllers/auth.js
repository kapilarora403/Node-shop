const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const User = require('../models/user');
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const {validationResult} = require('express-validator')

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: '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'
  }
}))



exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: req.flash('error')
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: req.flash('error'),
    oldInputs: {email: "", password: "", confirmPassword: "", name: ""}
    
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  User.findOne({email: email})
    .then(user => {
      if(!user) {
        
        req.flash('error', 'Invalid email or password')
        return res.redirect('/login')
      }
      bcrypt.compare(password, user.password).then(doMatch => {
        if(doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save(err => {
              console.log(err);
              res.redirect('/')
            });
        }
        req.flash('error', 'Invalid email or password')
        res.redirect('/login')
      })
      
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const name = req.body.name
  const email = req.body.email
  const password = req.body.password
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInputs: {email: email, password: password, confirmPassword: req.body.confirmPassword, name: name}
      
    });
  }
  User.findOne({email: email}).then(userDoc => {
    if(userDoc) {
      req.flash('error', 'User with the provided email-id already exists.')
      return res.redirect('/signup')
    }
    return bcrypt.hash(password, 12).then(hashedPass => {
      const user = new User({
        email: email,
        name: name,
        password: hashedPass,
        cart: { items: [] }
      })
      return user.save()
    })
    .then(result => {
      res.redirect('/login')
      return transporter.sendMail({
        to: email,
        from: 'shop@node.com',
        subject: 'Welcome mail',
        html: '<h1>Hey! You successfully signed up. </h1>'
      })
      
  }).catch(err => console.log(err))
  }).catch(err => console.log(err))
  
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: req.flash('error')
  })
}

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if(err) {
      req.flash('error', err)
      return res.render('/reset')
    }

    const token = buffer.toString('hex')
    User.findOne({email: req.body.email}).then(user => {
      if(!user) {
        req.flash('error', 'No user exists with the provided email')
        return res.redirect('/reset')
      }
      user.resetToken = token
      user.resetTokenExpiration = Date.now() + 3600000
      return user.save()

    }).then(result => {

        res.redirect('/')
        transporter.sendMail({
        to: req.body.email,
        from: 'shop@node.com',
        subject: 'Password reset',
        html: `
          <p>You requested a password reset</p>
          <p>Click this <a href="http://localhost:2100/reset/${token}">link</a> to set a new password.</p>
        `
      })

    })

  })
}

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token
  User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}}).then(user => {
      res.render('auth/new-password', {
      path: '/new-password',
      pageTitle: 'Update password',
      errorMessage: req.flash('error'),
      userId: user._id.toString(),
      passwordToken: token
    })
  }).catch(err => console.log(err))
  
}

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password
  const userId = req.body.userId
  const passwordToken = req.body.passwordToken
  let resetUser

  User.findOne({resetToken: passwordToken, resetTokenExpiration: {$gt: Date.now()}, _id: userId}).then(user => {
    resetUser = user
    return bcrypt.hash(newPassword, 12)
  }).then(hashedPass => {
    resetUser.password = hashedPass
    resetUser.resetToken = null
    resetUser.resetTokenExpiration = undefined
    return resetUser.save()
  }).then(result => {
    res.redirect('/login')
  }).catch(err => console.log(err))
}
