const  query  = require('../model/query');
let path =require('path');
let loginController = {};
let md5 = require('md5')
let viewsPath = path.join(path.dirname(__dirname), '/views')
//对密码进行加密
let password_secret = '@%^%&%^ FYUBN';
//登录成功设置cookie session
loginController.formLogin =async (req, res)=> {
    let { username, password } = req.body;
    password = md5(`${password}${password_secret}`)
    let sql = `select * from users where username='${username}'and password='${password}'`;
    let rows = await query(sql)
    if (rows.length != 0) {
        req.session.userLogin = rows
        res.cookie('userLogin', JSON.stringify(rows), {
            expires: new Date(Date.now() + 72* 3600000),
        })
        res.json({
            message: '登陆成功',
            code:1
        })
    } else {
        res.json({
            message: '登录失败',
            code:0
        })
    }
}
//退出登录
loginController.userQuit = async (req, res) => {
        //1. 清除session
        req.session.destroy(function (err) {
            if (err) {
                throw err;
            }
        })
    res.json({
        code: 1,
        message:'退出登录'
    })
}
//用户密码
loginController.passwordpage = async (req, res) => {
    res.render(`${viewsPath}/passwordpage.html`)
}
//判断旧密码是否正确
loginController.ispassword = async (req, res) => {
    let { id } = req.params;
    let {password} = req.body;
    password = md5(`${password}${password_secret}`)
   let sql = `select password from users where id=${id} `
    let rows = await query(sql)
    let succeedData = {
        code: 1,
        message:'密码正确'
    }
    let errData = {
        code: 0,
        message:'密码错误'
    }
    if (rows[0].password === password) {
        res.json(succeedData)
    } else {
        res.json(errData)
    }
}
//修改密码
loginController.updpasswod = async (req, res) => {
    console.log(req.body);
    let { id }=req.params
    let { newpassword } = req.body
    newpassword = md5(`${newpassword}${password_secret}`)
    let sql = `update users set password ='${newpassword}'where id= ${id}`
    let result = await query(sql)



    let errData = {
        code: 0,
        message:'失败'
    }
    if (result.affectedRows > 0) {
        req.session.destroy(function (err) {
            if (err) {
                throw err;
            }
        })
    res.json({
        code: 1,
        message:'修改成功,重新登录'
    })
    } else {
        req.json(errData)
    }
}

module.exports = loginController;