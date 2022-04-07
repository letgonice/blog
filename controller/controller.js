
let path =require('path')
let controller = {};
let viewsPath = path.join(path.dirname(__dirname), '/views')
//博客首页
controller.index = (req, res) => {
    res.sendFile(`${viewsPath}/index.html`)
}
//博客登录页
controller.login = (req, res) => {
    res.sendFile(`${viewsPath}/login.html`)
}
module.exports = controller;
