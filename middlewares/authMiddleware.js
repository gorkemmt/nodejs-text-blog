const User = require('../models/users')
const jwt = require('jsonwebtoken')

const requireAuth = (req,res,next)=> {
      const token = req.cookies.jwt

      if(token) {
            jwt.verify(token, 'gizli kelime', (err,decodedToken) => {
                  if(err) {
                        console.log(err)
                        res.redirect('/login')
                  }else {
                        console.log(decodedToken)
                        next()
                  }
            })
      }
      else {
            res.redirect('/login')
      }
      
}

const checkUser  = (req,res,next) => {
      const token = req.cookies.jwt

      if(token) {
            jwt.verify(token, 'gizli kelime', async (err,decodedToken) => {
                  console.log('deneme1')
                  if(err) {
                        console.log(err)
                        res.locals.user = null
                  }else {
                        console.log(decodedToken)
                        let user = await User.findById(decodedToken.id)
                        res.locals.user = user
                        next()
                  }

            })
      }
      else {

            console.log('deneme2')
            res.locals.user = null
            next()

      }

}


module.exports = {
      requireAuth,
      checkUser
}