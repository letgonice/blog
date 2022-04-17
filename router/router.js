let express = require('express')
let router = express.Router()
const multer = require('multer')
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
let upload =multer({
    dest:'./uploads/'
})

//导入控制器
let controller = require('../controller/controller.js')
let loginController = require('../controller/userController.js')
let articleController =require('../controller/articleController.js')
//访问首页
router.get('/', controller.index)
//分类页
router.get('/category', controller.category)
//文章页
router.get('/article', articleController.article)
//删除文章
router.post('/delArt',articleController.delArt)
//分类渲染
router.get('/cateRender', controller.cateRender)
//分类删除
router.post('/deleteCate', controller.deleteCate)
//分类编辑
router.post('/updCate', controller.updCate)

router.post('/delline', controller.delline)
//获取到博客名
router.get('/gethead', controller.gethead)
router.get('/addcate', controller.addcate)
//分类添加
router.post('/addcatelist', controller.addcatelist)
//跳转系统设置
router.get('/gosystem', controller.gosystem)
//更改博客名字
router.post('/updblogname', upload.single('photologo'), controller.updblogname)

//访问登录页
router.get('/login', controller.login)
//用户登录验证
router.post('/formlogin', multipartMiddleware, loginController.formLogin)
router.post('/userQuit', loginController.userQuit)

//个人信息
router.get('/personal', controller.personal)
//个人密码修改
router.get('/passwordpage', loginController.passwordpage)
router.post('/updpasswod/:id', loginController.updpasswod)
router.post('/ispassword/:id',loginController.ispassword)
router.post('/updUser/:id', upload.single('photo'), controller.updUser)

//首页饼图
router.get('/cateCount', controller.cateCount)

//文章页
router.get('/getArt', articleController.getArt)
//文章添加页
router.get('/Art', articleController.Art)
//文章添加
router.post('/addArt', upload.single('photo'), articleController.addArt)
//文章编辑
router.get('/editArticle',articleController.editArticle)
router.post('/editArtCon',upload.single('photo'),articleController.editArtCon)
router.get('/echoArticle',articleController.echoArticle)

module.exports = router