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
			});
		}
	
		res.json(itemArray);
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

/* 请求购物车信息 */
router.get('/api/order/data', function(req, res, next) {
	const orderArray = [];
	connection.query("select * from orders", function(error, results, fields) {
		if(error) throw error;
		
		for(let i = 0; i < results.length; i++) {
			/* 处理图片的路径*/
			const orderPathFromDB = results[i].order_image;
			results[i].order_image = `http://localhost:3000/images/items/${orderPathFromDB}`;
			
			/* 把值放进itemArray */
			orderArray.push({
				'order_image' : results[i].order_image,
				'order_title' : results[i].order_title,
				'order_price' : results[i].order_price,
				'order_number' : results[i].order_number,
				'order_size' : results[i].order_size,
			});
		};
			
		res.json(orderArray);
	});
});

/* 请求蛋糕信息 */
router.get('/api/search/data', function(req, res, next) {
	const searchValue = req.query.searchValue;
	if (!searchValue) {
	    // 如果 searchValue 为空，可以返回适当的响应，比如空数组
	    res.json([]);
	} else {
		const searchArray = [];
		connection.query(`select * from items where item_title like '%${searchValue}%'`, function(error, results, feilds) {
			if(error) throw error;
			
			for(let i = 0; i < results.length; i++) {
				/* 处理图片的路径*/
				const searchPathFromDB = results[i].item_image;
				results[i].item_image = `http://localhost:3000/images/items/${searchPathFromDB}`;
				
				/* 把值放进itemArray */
				searchArray.push({
					'search_image' : results[i].item_image,
					'search_title' : results[i].item_title,
					'search_description' : results[i].item_description,
					'search_price' : results[i].item_price,
				});
			};
			
			res.json(searchArray);
		})
	}
});

module.exports = router;
