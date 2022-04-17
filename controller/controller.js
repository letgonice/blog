const  query  = require('../model/query');
let path =require('path');
let controller = {};
//托管静态页面
let viewsPath = path.join(path.dirname(__dirname), '/views')
let fs = require('fs');
let moment  =require('moment')
let port  =3400
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
// controller.article = (req,res)=> {
//     res.render(`${viewsPath}/article.html`)
// }
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
    let { val, id} = req.body;
    let succeedData = {
        code: 1,
        message:'成功'
    }
    let errData = {
        code: 0,
        message:'失败'
    }
    let sql
    if (req.file) {
        let { originalname, destination, filename } = req.file
        let dotIndex = originalname.lastIndexOf('.')
        let suffix = originalname.substr(dotIndex, originalname.length - 1);
        let oldName = `${destination}${filename}`;
        let newName = `${destination}${filename}${suffix}`
        fs.rename(oldName, newName, err => {
            if (err) {
                throw err;
            }
        })
        sql = `update settings set val = '${val}',blogLogo='${newName}'where id = ${id}`;
        sql2 = `select blogLogo from settings where id = ${id}`
        let result  = await query(sql2)
        // let sql = `insert into article(title,content,author ,status,pic,add_date,cate_id)values('${title}','${content}','${author}','${status}','${newName}','${add_date}',${classify})`
        let rows = await query(sql);
        let { blogLogo } = result[0]
        const picPath = path.join(path.dirname(__dirname), blogLogo);
        console.log(picPath);
        fs.unlink(picPath, () => { });
        if (rows.affectedRows > 0) {
            console.log(rows);
            res.json({
                code: 1,
                message: '成功',
                newpic:newName
            })
        } else {
            res.json(errData)
        }
        
    } else {
        sql = `update settings set val = '${val}'where id = ${id}`;
        let rows = await query(sql)

        if (rows.affectedRows > 0) {
            res.json(succeedData)
        } else {
            res.json(errData)
        }
    }

}

// 个人信息
controller.personal = async (req, res) => {
    res.render(`${viewsPath}/personal.html`)
}

//更新个人信息
controller.updUser = async (req, res) => {
    let { intro } = req.body
    let { id } = req.params
    let succeedData = {
        code: 1,
        message: '成功',
    }
    let errData = {
        code: 0,
        message:'失败'
    }
    if (!req.file) {
        let sql = `update users set intro = '${intro}' where id = ${id}`
        let rows = await query(sql)
        if (rows.affectedRows > 0) {
            let sql = `select * from users where id=${id}`
            let result = await query(sql)
            req.session.userLogin = result;
            res.cookie('userLogin', JSON.stringify(result), {
                expires: new Date(Date.now() + 1 * 3600000),
            })
            res.json(succeedData)
        } else {
            res.json(errData)
        }
    } else {
        console.log(true);
        let { originalname, destination, filename } = req.file
        let dotIndex = originalname.lastIndexOf('.')
        let suffix = originalname.substr(dotIndex, originalname.length - 1);
        let oldName = `${destination}${filename}`;
        let newName = `${destination}${filename}${suffix}`
        fs.rename(oldName, newName, err => {
            if (err) {
                throw err;
            }
        })
        let sql2 = `select pic from users where id = ${id}`
        let resultpic = await query(sql2)
        let sql = `update users set intro = '${intro}',pic='${newName}' where id = ${id}`
        let rows = await query(sql)
        if (rows.affectedRows > 0) {
            console.log(resultpic[0].pic);
            const picPath = path.join(path.dirname(__dirname), resultpic[0].pic); // 获取完整路径
            console.log(picPath);
            fs.unlink(picPath,()=>{});
            let sql = `select * from users where id=${id}`
            let result = await query(sql)
            req.session.userLogin = result;
            res.cookie('userLogin', JSON.stringify(result), {
                expires: new Date(Date.now() + 1 * 3600000),
            })
            res.json({
                code: 1,
                message: '成功',
                newName,
            })
        } else {
            res.json(errData)
        }
    }
}

controller.cateCount = async (req, res) => {
    let sql = `select count(t1.id)total,t2.cate_name from article t1 left join category t2 on t1.cate_id = t2.cate_id group by t1.cate_id`;
    let rows = await query(sql)
    res.json(rows)
}

module.exports = controller;
