const  query  = require('../model/query');
let path =require('path');
let articleController = {};
//托管静态页面
let viewsPath = path.join(path.dirname(__dirname), '/views')
let fs = require('fs');
let moment  =require('moment')

articleController.article = (req,res)=> {
    res.render(`${viewsPath}/article.html`)
}

//文章数据接口
articleController.getArt = async (req, res) => {
    // 1. 接收页码和每页显示的条数
    let {
        page,
        limit,
        keyword
    } = req.query;
    // 2. 查询总记录数
let sql1 = 'select count(id) as count from article where 1 '
if (keyword) {
    sql1+=` and title like '%${keyword}%' `
}
    let result = await query(sql1)
    let {
        count
    } = result[0]
    let offset = (page - 1) * limit;
    let sql2 = `select t1.*,t2.cate_name,t3.username from article t1 
        left join category t2 on t1.cate_id = t2.cate_id 
        left join users t3 on t1.author = t3.id
        where 1 `
        // limit ${offset},${limit}
if (keyword) {
    sql2 +=` and t1.title like '%${keyword}%'`
}
sql2 += `order by t1.id desc
limit ${offset},${limit}
`
let data = await query(sql2)
data = data.map((item) => {
    let {
        add_date,
        status,
        cate_name,
        username
    } = item;
    item.statusText = status == 1 ? '审核通过' : '审核中'
    item.cate_name = cate_name || '未分类'
    item.username = username || '匿名者'
    item.add_date = moment(add_date).format('YYYY-MM-DD HH:mm:ss')
    return item;
})
// 4. 响应数据
res.json({
    count,
    data,
    code: 0,
    msg: 'sucess'
})


// const {
//     page,
//     limit,
//     keyword
// } = req.query;
// // 2. 查询总记录数
// let sql1 = `select count(id) as count from article where 1 `;
// if (keyword) {
//     sql1 += ` and title like '%${keyword}%' `
// }
// const result = await query(sql1)
// const {
//     count
// } = result[0]
// const offset = (page - 1) * limit;
// let sql2 = `select t1.*,t2.cate_name,t3.username from article t1 
//     left join category t2 on t1.cate_id = t2.cate_id 
//     left join users t3 on t1.author = t3.id 
//     where 1 `
// if (keyword) {
//     sql2 += ` and t1.title like '%${keyword}%'`;
// }
// sql2 += `order by t1.id desc
// limit ${offset},${limit}`
// let data = await query(sql2)
// data = data.map((item) => {
//     const {
//         add_date,
//         status,
//         cate_name,
//         username
//     } = item;
//     item.statusText = status == 1 ? '审核通过' : "审核中"
//     item.cate_name = cate_name || '未分类'
//     item.username = username || '匿名者'
//     item.add_date = moment(add_date).format('YYYY-mm-DD HH:MM:SS')
//     return item;
// })
// // 4. 响应数据
// res.json({
//     count,
//     data,
//     code: 0,
//     msg: "sucess"
// })
}

//删除文章
articleController.delArt = async (req, res) => {
let { id,pic } = req.body;
let succeedData = {
    code: 10000,
    message:'成功'
}
let errData = {
    code: 10001,
    message:'失败'
}
let sql = `delete from article where id=${id}`
let result = await query(sql)
if (result.affectedRows > 0) {
    let paths = path.join(path.dirname(__dirname),pic)
    fs.unlink(paths, (err) => {
        console.log(err);
    })
    res.json(succeedData)
} else {
    res.json(errData)
}
}
//添加文章
articleController.Art = async (req, res) => {
res.render('addArt.html')
}
articleController.addArt = async (req, res) => {
let author = req.session.userLogin[0].id
let { title, classify, status, content } = req.body;
let succeedData = {
    code: 10000,
    message:'成功'
}
let errData = {
    code: 10001,
    message:'失败'
}
let add_date = Date.now()
add_date = moment(add_date).format('YYYY-MM-DD HH:mm:ss')
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
    let sql = `insert into article(title,content,author ,status,pic,add_date,cate_id)values('${title}','${content}','${author}','${status}','${newName}','${add_date}',${classify})`
    await query(sql);
    res.json(succeedData)
} else {
    res.json(errData)
}
}

articleController.editArticle = async (req, res) => {
    res.render(`${viewsPath}/editArticle.html`)
}
articleController.echoArticle = async (req, res) => {
    const { id } = req.query;
    let sql = `SELECT t1.* ,t2.cate_name from article t1 LEFT JOIN  category t2 on t1.cate_id = t2.cate_id where id = ${id}`
    let result = await query(sql)
    res.json(result)
}

articleController.editArtCon = async (req, res) => {
    let {title,content,status,oldpic ,id} = req.body;
    let succeedData = {
        code: 10000,
        message:'成功'
    }
    let errData = {
        code: 10001,
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
        sql = `update article set title = '${title}',content = '${content}',status ='${status}',pic='${newName}' where id =${id}`
        let rows = await query(sql);
        const picPath = path.join(path.dirname(__dirname), oldpic);
        fs.unlink(picPath, () => { });
        if (rows.affectedRows > 0) {
            res.json(succeedData)
        } else {
            res.json(errData)
        }
    } else {
        sql = `update article set title = '${title}',content = '${content}',status ='${status}' where id =${id}`
        let rows = await query(sql);
        if (rows.affectedRows > 0) {
            res.json(succeedData)
        } else {
            res.json(errData)
        }
    }
}
module.exports = articleController;