let express = require('express')
let router = express.Router()

//导入控制器
let indexController = require('../controller/controller.js')

router.get('/', indexController.index)
router.get('/login', indexController.login)

module.exports =router