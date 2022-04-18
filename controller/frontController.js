let query = require('../model/query.js')
const FrontController = {};

FrontController.cate = async (req, res) => {
    let sql = 'select cate_name,cate_id from category'
    let result = await query(sql)
    res.json(result)
}

FrontController.loadArticle =async (req, res) => {
    let {page,pagesize} =req.query
    let sql = `select t1.*,t2.cate_name ,t3.username from  article t1 LEFT JOIN category 
    t2 ON t1.cate_id =t2.cate_id LEFT JOIN users t3 on t1.author = t3.id
    where status =1
    LIMIT ${page},${pagesize}`;
    let result = await query(sql);
    res.json(result)
}
FrontController.loadCate =async (req, res) => {
    let {page,pagesize,cate_id} =req.query
    console.log(req.query);
    let sql = `SELECT t1.*,t2.cate_name from article t1 LEFT JOIN category t2 on t1.cate_id = t2.cate_id where t1.cate_id =${cate_id} 
    limit ${page},${pagesize}`
    let result = await query(sql);
    res.json(result)
}


FrontController.articleContent = async (req, res) => {
    console.log(req.query);
    const {
        id
    } = req.query;
    const sql = `select t1.*,t2.cate_name from article t1 left join category t2 on t1.cate_id = t2.cate_id where t1.id = ${id}`
    const result = await query(sql);
    console.log(result);
    res.json(result)
}

module.exports = FrontController;