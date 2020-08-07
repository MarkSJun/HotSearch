/*
 * @Author: 小马大哥哥
 * @Date: 2020-07-25 10:44:29
 * @LastEditTime: 2020-07-26 17:53:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \weibo\app.js
 */
const cheerio = require("cheerio");
const charset = require("superagent-charset");
const superagent = require("superagent");
const fs = require("fs");
const nodeSchedule = require("node-schedule");   // 定时任务插件
charset(superagent)
// 需要抓取的条数
let count = 20;
// 微博热搜地址
const weiboURL = "https://s.weibo.com";
const hotSearchURL = weiboURL + "/top/summary?cate=realtimehot";
// 获取微博热搜数据
function getWeiBoHotSearchList() {
    return new Promise((resolve, reject) => {
        superagent.get(hotSearchURL, (err, res) => {
            if (err) reject("request error");
            const $ = cheerio.load(res.text);
            let hotList = [];
            $("#pl_top_realtimehot table tbody tr").each(function (index) {
                if (index !== 0 && index <= count) {
                    const $td = $(this).children().eq(1);
                    const link = weiboURL + $td.find("a").attr("href");
                    const text = $td.find("a").text();
                    const hotValue = $td.find("span").text();
                    const icon = $td.find("img").attr("src")
                        ? "https:" + $td.find("img").attr("src")
                        : "";
                    hotList.push({
                        index,
                        link,
                        text,
                        hotValue,
                        icon,
                    });
                }
            });
            hotList.length ? resolve(hotList) : reject("errer");
        });
    });
}
// 百度热搜地址
const baiduURL = 'https://top.baidu.com'
const baiduHotSearchURL = baiduURL + '/buzz?b=2&c=12&fr=topcategory_c12'
// 获取百度热搜数据
function getBaiduHotSearchList() {
    return new Promise((resolve,reject) => {
        // 解决百度热搜页面编码格式 gb2312 乱码写法
        superagent.get(baiduHotSearchURL).charset("gb2312").buffer(true).end((err, res) => {
            if (err) reject("request error")
            const $ = cheerio.load(res.text);
            let hotList = [];
            $("#main .mainBody .grayborder table tbody tr").each(function (index) {
                if (index !== 0 && index <= count) {
                    const $td = $(this).children().eq(1);
                    
                    const link = $td.find("a").attr("href");
                    // const detail = $td.find("a").attr("href_top")
                    
                    const text = $td.find(".list-title").text();
                    
                    const $hotValTd = $(this).children().eq(3)
                    
                    const hotValue = $hotValTd.find("span").text();  
                    const icon = false
                        ? "https://top.bdimg.com/frontend/static/common/" + $hotValTd.find(".last span")[0].style.background
                        : "";
                    hotList.push({
                        index,
                        link,
                        text,
                        hotValue,
                        icon,
                    });
                }
            });
            hotList.length ? resolve(hotList) : reject("errer");
            
        })
    })
}

// 知乎热搜地址
const zhihuURL = 'https://tophub.today'
const zhihuHotSearchURL = zhihuURL + '/n/mproPpoq6O'
// 获取知乎热搜数据
function getZhiHuHotSearchList() {
    return new Promise((resolve, reject) => {
        superagent.get(zhihuHotSearchURL, (err, res) => {
            if (err) reject("request error");
            
            const $ = cheerio.load(res.text);
            let hotList = [];
            $("#page .c-d .Zd-p-Sc .cc-dc .cc-dc-c .jc .jc-c table tbody tr").each(function (index) {
                
                if (index >= 0 && index < count) {
                    const $td = $(this).children().eq(1);
                    const link = weiboURL + $td.find("a").attr("href");
                    const text = $td.find("a").text();
                   
                    const hotValue = $(this).children().eq(2).text();
                    const icon = false
                        ? "https:" + $td.find("img").attr("src")
                        : "";
                    hotList.push({
                        index: index + 1,
                        link,
                        text,
                        hotValue,
                        icon,
                    });
                }
            });
            hotList.length ? resolve(hotList) : reject("errer");
        });
    });
}

// 运行爬取程序
async function run() {
    let hotList = {
        "weibo_hot_list": [],
        "baidu_hot_list": [],
        "zhihu_hot_list": []
    };
    try {
        const weiboHotList = await getWeiBoHotSearchList();
        hotList.weibo_hot_list = weiboHotList;
        const baiduHotList = await getBaiduHotSearchList();
        hotList.baidu_hot_list = baiduHotList;
        const zhihuHotList = await getZhiHuHotSearchList();
        hotList.zhihu_hot_list = zhihuHotList;
        fs.writeFileSync(
            `${__dirname}/hotSearch.json`,
            JSON.stringify(hotList),
            "utf-8"
        );
    } catch (error) {
        console.error(error);
    }
}
/**
 * 定时任务插件的用法
 * (每分钟的第 30 秒定时执行一次)：
 * 
    *    *    *    *    *    *
    ┬    ┬    ┬    ┬    ┬    ┬
    │    │    │    │    │    │
    │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
    │    │    │    │    └───── month (1 - 12)
    │    │    │    └────────── day of month (1 - 31)
    │    │    └─────────────── hour (0 - 23)
    │    └──────────────────── minute (0 - 59)
    └───────────────────────── second (0 - 59, OPTIONAL)
    6 个占位符从左到右依次代表：秒、分、时、日、月、周几* 表示通配符，匹配任意。当 * 为秒时，表示任意秒都会触发，其他类推。来看一个 每小时的第20分钟20秒 定时执行的规则：
    20 20 * * * *
 */

// 使用定时任务来执行上面的请求数据，写入文件操作：
nodeSchedule.scheduleJob("30 * * * * *", async function () {
    run()
    console.log('写入成功');
});
