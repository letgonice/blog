const  query  = require('../model/query');
let path =require('path');
const { response } = require('express');
let loginController = {};
let password_secret ='@%^%&%^ FYUBN';
loginController.formLogin =async (req, res)=> {
    let { username, password } = req.body;
    let sql = `select * from users where username='${username}'and password='${password}'`;
    let rows = await query(sql)
    if (rows.length != 0) {
        req.session.userLogin = rows
        console.log(1);
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
module.exports = loginController;