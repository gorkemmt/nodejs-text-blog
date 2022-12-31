const express= require('express')
require('dotenv').config()

const morgan = require('morgan')
const mongoose = require('mongoose')
const adminRoutes = require('./routes/adminRoutes')
const blogRoutes = require('./routes/blogRoutes')
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser')

const {requireAuth} = require('./middlewares/authMiddleware.js')
const {checkUser} = require('./middlewares/authMiddleware.js')
const app = express()

// Veritabanı işlemleri

const dbURL=process.env.MONGO_KEY
mongoose.connect(dbURL, { useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true})
      .then((result)=> app.listen(3000))
      .catch((err)=> console.log(err))

app.set('view engine','ejs')


// Middleware kullanımı
app.use(express.static('public'))
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


app.get('*',checkUser)
app.get('/',(req,res)=> {
      res.redirect('/blog')
})

app.use('/',authRoutes)
app.use('/blog',blogRoutes)
app.use('/admin',requireAuth,adminRoutes)


app.get('/about',(req,res)=> {

      res.render('about',{title:'Hakkında Sayfası'})
})

app.get('/about-us',(req,res) => { 

      res.redirect('/about')
})


app.use((req,res)=> {
      res.status(404).render('404',{title:'404 Sayfa Bulunamadı'})
})