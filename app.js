let express = require('express')
let app = express()
let path = require('path')
//用来获取cookie的值
const cookieParser = require('cookie-parser')
let cors =require('cors')
//此模块可以操作session和cookie
const session = require('express-session')
let router = require('./router/router.js')
let apiRouter = require('./router/apiRouter.js')
const artTemplate = require('art-template');
const express_template = require('express-art-template');
app.use(cors())
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.set('views', __dirname + '/views/');
app.engine('html', express_template);
app.set('view engine', 'html');
app.use('/assets', express.static(path.join(__dirname, 'assets')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use(cookieParser())
//初始化session
app.use(session({
  name:'SESSIONID',
  secret:'%#%￥#……%￥',//对session会话进行一个加密，必填
  cookie:{  
    path:'/',
    secure:false,//默认false,true只很对https
    maxAge:3600000*72,//设置有效期，60000是毫秒值
  }
}));

app.use('/api', apiRouter, (req, res) => {
  console.log('呜呜呜呜');
})

app.use((req, res,next) => {
  let reqPath = req.path.toLowerCase();
  let loginRouter = ['/login', '/formlogin']
  if (loginRouter.includes(reqPath)) {
    next()
  }else {
    if (req.session.userLogin) {
      next()
    } else {
      res.redirect('/login')
    }
  }
})

app.use(router)



app.listen(3400,() => {
    console.log('listen to 3400');
})