const express= require('express')

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
//const dbURL ='mongodb+srv://<root>:<root1234>@nodeblog.in0gt.mongodb.net/node-blog?retryWrites=true&w=majority'
//const dbURL ='mongodb+srv://root:<root1234>@nodeblog.j0g5gpn.mongodb.net/node-blog?retryWrites=true&w=majority'
const dbURL='mongodb://root:root1234@ac-mzpy93o-shard-00-00.j0g5gpn.mongodb.net:27017,ac-mzpy93o-shard-00-01.j0g5gpn.mongodb.net:27017,ac-mzpy93o-shard-00-02.j0g5gpn.mongodb.net:27017/?ssl=true&replicaSet=atlas-f95rvw-shard-0&authSource=admin&retryWrites=true&w=majority'
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