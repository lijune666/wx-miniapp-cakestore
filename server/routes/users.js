var express = require('express');
var router = express.Router();
var connection = require('../db/sql.js');
var axios = require('axios');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* 通过code向微信服务器请求信息 */
router.get('/api/login/userinfo', function(req, res, next) {
	const AppID = 'wxfe7ca94d6eeff55d';
	const AppSecret = '495f125d5adc95335a522cb9415a2e73';
	const code = req.query.code;
	const wxUrl = "https://api.weixin.qq.com/sns/jscode2session?appid=" + AppID + "&secret=" + AppSecret + "&js_code=" + code + "&grant_type=authorization_code";
	
	// 发起请求
	axios.get(wxUrl).then(response => {
		// 获得openid和session_key
		const openID = response.data.openid;
		const sessionKey = response.data.session_key;
		
		// 通过openid和session_key来与用户的登录状态关联
		const queryUsers = 'SELECT * FROM users WHERE user_openid = ? AND user_sessionkey = ?';
		connection.query(queryUsers, [openID, sessionKey], function(error, results, feilds) {
			if(error) throw error;
			
			// 如果数据库中已经存在符合条件的数据，更新登录状态为1
			if (results.length > 0) {
				const updateUsers = 'UPDATE users SET user_loginstate = 1 WHERE user_openid = ? AND user_sessionkey = ?';
				connection.query(updateUsers, [openID, sessionKey], function(updateError, updateResults, updateFeilds) {
					if(updateError) throw updateError;
		
					res.json(1);
				})
			} else {
				// 不存在符合条件的数据，插入新数据
				const insertUsers = 'INSERT INTO users (user_openid, user_sessionkey, user_loginstate) VALUES (?, ?, 1)';
				connection.query(insertUsers, [openID, sessionKey], function(insertError, insertResults, insertFeilds) {
					if(insertError) throw insertError;
					
					res.json(1);
				})
			}
		});
    })
	.catch(error => {
	    res.json(error);
	});
})

module.exports = router;
