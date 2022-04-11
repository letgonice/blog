let express = require('express')
let router = express.Router()
const multer = require('multer')
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

//导入控制器
let controller = require('../controller/controller.js')
let loginController = require('../controller/loginController.js')
//访问首页
router.get('/', controller.index)
//分类页
router.get('/category', controller.category)
//文章页
router.get('/article', controller.article)
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
router.post('/updblogname' , controller.updblogname)

//访问登录页
router.get('/login', controller.login)
//用户登录验证
router.post('/formlogin', multipartMiddleware, loginController.formLogin)
router.post('/userQuit',loginController.userQuit)
module.exports = router