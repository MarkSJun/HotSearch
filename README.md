# HotSearch

node.js 实现定时爬取微博、百度、知乎热搜数据

// 启动步骤
`npm install`

`node hotSearchApp.js ` // 启动爬虫程序，每到30秒的时候就会抓取一下数据，重新写入到hotSearch.json文件里

// 启动web 服务
`node app.js`    // 本程序用了koa框架 简单写了一个读取本地json文件数据，返回给指定接口

// 获取微博、百度、知乎热搜数据接口地址
http://localhost:3001/allHotSearch         // 获取微博、百度、知乎热搜数据

http://localhost:3001/weiboHotSearch   // 获取微博热搜数据
http://localhost:3001/zhihuHotSearch    // 获取知乎热搜数据
http://localhost:3001/baiduHotSearch   // 获取百度热搜数据
