const  query  = require('../model/query');
let path =require('path')
let controller = {};
//托管静态页面
let viewsPath = path.join(path.dirname(__dirname), '/views')
//博客首页
controller.index = (req, res) => {
    res.render(`index.html`)
}
//博客登录页
controller.login = (req, res) => {
    // res.sendFile(`${viewsPath}/login.html`)
    res.render(`login.html`)
}
controller.category = (req,res)=> {
    res.render(`category.html`)
}
controller.article = (req,res)=> {
    // res.sendFile(`${viewsPath}/category.html`)
    res.render(`${viewsPath}/article.html`)
}
//分类所有接口逻辑
controller.cateRender =async (req,res)=> {
    let sql = 'select * from category'
    let rows = await query(sql)
    // console.log(rows);
    let responseData = {
        data: rows,
        code: '0',
        message:'成功'
    }
    res.json(responseData)
}
controller.deleteCate = async (req, res) => {
    let { cate_id } =req.body;
    let sql = `delete from category where cate_id = ${cate_id}`
    let rows = await query(sql)
    console.log(rows);
    if (rows.affectedRows > 0) {
        let data = {
            code:'0',
            message: '删除成功'
        }
        res.json(data)
    } else {
        res.json({
            code:1,
            message:"删除失败"
        }) 
    }
}
controller.delline = async (req, res) => {
    console.log(req.body);
}
controller.updCate = async (req, res) => {
    console.log(req.body);
    let { cate_id,cate_name,orderBy } = req.body
    // cateDate = JSON.parse(cateDate)
    let succeedData = {
        code: 1,
        message:'成功'
    }
    let errData = {
        code: 0,
        message:'失败'
    }
    const sql = `update category set cate_name = '${cate_name}',orderBy = ${orderBy} 
    where cate_id = ${cate_id}`;
    let rows = await query(sql)
    
    if (rows.affectedRows > 0) {
        res.json(succeedData)
    } else {
        res.json(errData)
    }
}
controller.addcate = async (req, res) => {
    res.render(`${viewsPath}/addcate.html`)
}
controller.addcatelist = async (req, res) => {
    let { cate_name, orderBy } = req.body;
    // let sql = `insert into car1(name,color,intro,pic,add_time,is_sale)values
    let sql = `insert into category(cate_name,orderBy)values('${cate_name}',${orderBy})`
    let rows = await query(sql)
    console.log(rows);
    let succeedData = {
        code: 1,
        message:'成功'
    }
    let errData = {
        code: 0,
        message:'失败'
    }
    if (rows.affectedRows > 0) {
        res.json(succeedData)
    } else {
        res.json(errData)
    }
}
// 系统设置逻辑
controller.gosystem = async (req, res) => {
    res.render(`systemsetup.html`)
}
controller.gethead = async (req, res) => {
    let sql = 'select * from settings'
    let rows = await query(sql)
    res.json(rows)
}
controller.updblogname = async (req, res) => {
    let { val ,id} = req.body;
    const sql = `update settings set val = '${val}'where id = ${id}`;
    let rows = await query(sql)
    let succeedData = {
        code: 1,
        message:'成功'
    }
    let errData = {
        code: 0,
        message:'失败'
    }
    if (rows.affectedRows > 0) {
        res.json(succeedData)
    } else {
        res.json(errData)
    }
}

module.exports = controller;
