var express = require('express')
var router = express.Router()

const FrontController = require('../controller/frontController.js')

router.get('/loadArticle', FrontController.loadArticle)

router.get('/cate', FrontController.cate)

router.get('/loadCate',FrontController.loadCate)
router.get('/articleContent', FrontController.articleContent)

module.exports = router