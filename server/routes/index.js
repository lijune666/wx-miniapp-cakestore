var express = require('express');
var router = express.Router();
var connection = require('../db/sql.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* 请求轮播图图片 */
router.get('/api/slider/image', function(req, res, next) {
	const sliderArray = [];
	connection.query("select * from sliders", function(error, results, fields) {
		if(error) throw error;
		
		for(let i = 0; i < results.length; i++) {
			const sliderPathFromDB = results[i].slider_image;
			sliderArray.push(`http://localhost:3000/images/sliders/${sliderPathFromDB}`);
		}
		
		res.json(sliderArray);
	});
});

/* 请求蛋糕信息 */
router.get('/api/item/data', function(req, res, next) {
	const itemArray = [];
	connection.query("select * from items", function(error, results, fields) {
		if(error) throw error;
		
		for(let i = 0; i < results.length; i++) {
			/* 处理图片的路径*/
			const itemPathFromDB = results[i].item_image;
			results[i].item_image = `http://localhost:3000/images/items/${itemPathFromDB}`;
			
			/* 把值放进itemArray */
			itemArray.push({
				'theme_id' : results[i].theme_id,
				'item_image' : results[i].item_image,
				'item_title' : results[i].item_title,
				'item_description' : results[i].item_description,
				'item_price' : results[i].item_price,
				'theme_name' : '',
			});
		}
		
		/* 通过外键找到对应的主题 */
		// 构建 Promise 数组来保存异步查询操作
		const promiseArray = [];
		
		for(let i = 0; i < results.length; i++) {
			const themeId = results[i].theme_id;
			
			// 创建异步查询的 Promise
			const promise = new Promise(function(resolve, reject) {
				connection.query("SELECT theme_name FROM themes WHERE theme_id = ?", [themeId], function(error, themeResults, fields) {
					if(error) reject(error);
					else resolve(themeResults[0].theme_name);
				});
			});
			
			// 添加 Promise 到数组中
			promiseArray.push(promise);
		}
		
		Promise.all(promiseArray).then(themeNames => {
			// 将 theme_name 值赋给 itemArray
			themeNames.forEach((themeName, index) => {
				itemArray[index].theme_name = themeName;
			});

			res.json(itemArray);
		})
	});
});

/* 请求主题信息 */
router.get('/api/item/theme', function(req, res, next) {
	connection.query("select * from themes", function(error, results, fields) {
		if(error) throw error;
		
		/* 把值放进themeArray作为数组形式发送 */
		const themeArray = results.map(theme => ({
			theme_id: theme.theme_id,
			theme_name: theme.theme_name
		}));
		  
		res.json(themeArray);
	});
});

module.exports = router;
