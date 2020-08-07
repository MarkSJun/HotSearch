/*
 * @Author: your name
 * @Date: 2020-07-26 17:30:30
 * @LastEditTime: 2020-07-26 23:28:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \weibo\app.js
 */ 
const Koa = require('koa')
const Router = require('koa-router')
const fs = require('fs')
const app = new Koa()
const router = new Router()

// 读取本地爬取的json数据文件
let hotSearchData = fs.readFileSync(`${__dirname}/hotSearch.json`).toString()

router.get('/allHotSearch', function (ctx, next) {
    ctx.set('Content-Type', 'application/json')
    ctx.set('Access-Control-Allow-Origin', '*')
    
    ctx.body = hotSearchData
    next()
  })
// JSON.parse(hotSearchData).zhihu_hot_list
router.get('/weiboHotSearch', function (ctx, next) {
    ctx.set('Content-Type', 'application/json')
    ctx.set('Access-Control-Allow-Origin', '*')
    let weibo_hot_data = JSON.parse(hotSearchData).weibo_hot_list
    ctx.body = weibo_hot_data
    next()
  })

  router.get('/zhihuHotSearch', function (ctx, next) {
    ctx.set('Content-Type', 'application/json')
    ctx.set('Access-Control-Allow-Origin', '*')
    let weibo_hot_data = JSON.parse(hotSearchData).zhihu_hot_list
    ctx.body = weibo_hot_data
    next()
  })

  router.get('/baiduHotSearch', function (ctx, next) {
    ctx.set('Content-Type', 'application/json')
    ctx.set('Access-Control-Allow-Origin', '*')
    let weibo_hot_data = JSON.parse(hotSearchData).baidu_hot_list
    ctx.body = weibo_hot_data
    next()
  })

  app
  .use(router.routes())
  .use(router.allowedMethods())
// //正常操作
// app.use(async (ctx) => {
//     let url = ctx.request.url
//     // let html = await route(url)
//     //从request中获取GET请求
//     let request =ctx.request;
//     let req_query = request.query;
//     let req_querystring = request.querystring;
//     let req_method = ctx.method
//     //从上下文中直接获取
//     let ctx_query = ctx.query;
//     let ctx_querystring = ctx.querystring;
//     if(url === '/allHotSearch' && req_method === 'GET') {
//         let allData = fs.readFileSync(`${__dirname}/hotSearch.json`).toString()
//         ctx.body = allData
//     }

//     if(url === '/baiduHot' && req_method === 'GET') {
//         let baiduHotData = fs.readFileSync(`${__dirname}/hotSearch.json`).baidu_hot_list.toString()
//         ctx.body = baiduHotData
//     }

//     if(url === '/weiboHot' && req_method === 'GET') {
//         let weiboHotData = fs.readFileSync(`${__dirname}/hotSearch.json`).weibo_hot_list.toString()
//         ctx.body = weiboHotData
//     }
//     if(url === '/zhihuHot' && req_method === 'GET') {
//         let zhihuHotData = fs.readFileSync(`${__dirname}/hotSearch.json`).zhihu_hot_list.toString()
//         ctx.body = zhihuHotData
//     }
//     if(url === '/' && req_method === 'GET') {
//         ctx.body={
//             url,
//             req_query,
//             req_querystring,
//             ctx_query,
//             ctx_querystring,
//             req_method
//         }
//     }
    
    
// })


app.listen(3001, () => {
    console.log('router is listen port 3001..')
})