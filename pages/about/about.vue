<template>
	<view>
		<!-- 登录/注册点击位置 -->
		<view class="box">
			<view class="portrait-box">
				<image mode="scaleToFill" :src="portrait" @click="showModal"></image>
			</view>
			<view class="cybername" @click="showModal">{{selfname}}</view>
		</view>
		
		<!-- 弹窗 -->
		<view v-if="isModalVisible" class="modal-overlay">
			<view style="margin: 20rpx; text-align: center; font-size: 30rpx; font-weight: 700;">登录/注册</view>
			<view style="margin: 20rpx; color: #b3b3b3; text-align: center;">请求获取你的昵称、头像</view>
			<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
				<image class="avatar" :src="avatarUrl"></image>
			</button> 
			<input id="nickInput" v-model="nickname" type="nickname" class="weui-input" placeholder="请输入昵称"/>
			<view class="button-box">
				<button class="login-reject" @click="hideModal">拒绝</button>
				<button class="login-resolve" @click="submitModal" style="color: white; background-color: #32c9fc; border: 1rpx solid #32c9fc;">允许</button>
			</view>
		</view>
		
		<!-- 遮罩层 -->
		<view v-if="isModalVisible" class="page-overlay"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isModalVisible: false,
				portrait: '../../static/images/weixintouxiang.jpeg',
				avatarUrl: '../../static/images/weixintouxiang.jpeg',
				selfname: '点击这里登录/注册',
				nickname: '',
				userInfo: {},
				loginState: 0,
			};
		},
		onLoad() {
			// 获取登录状态
			wx.getStorage({
				key: 'loginstate',
				success: (res) => {
					this.loginState = res.data;
					wx.getStorage({
						key: 'imageandname',
						success: (res) => {
							this.portrait = res.data[0];
							this.selfname = res.data[1];
						}
					})
				}
			});
		},
		methods: {
			// 展示登录/注册弹窗
			showModal() {
				if(this.loginState == 1) {
					this.avatarUrl = this.portrait;
					this.nickname = this.selfname;
				}
				this.isModalVisible = true;
				uni.hideTabBar();				
			},
			
			// 获取微信头像
			onChooseAvatar(e) {
				this.avatarUrl = e.detail.avatarUrl;
			},
			
			// 关闭登录/注册弹窗
			hideModal() {
				this.isModalVisible = false;
				uni.showTabBar();
			},  
			
			// 允许获得头像和昵称，并且登录
			submitModal() {    
				// 拿到用户的openid
				uni.login({
					success: (res) => {  
						// 通过code在开发者服务器中向微信服务器请求openid
						if(res.code) {
							uni.request({
								url: 'http://localhost:3000/users/api/login/userinfo',
								data: {
									code: res.code
								},
								success: (res) => {
									this.loginState = res.data;
									
									//将这个状态放入localStorage中
									wx.setStorageSync('loginstate', this.loginState);
									
									// 前提是获得了返回的登录状态，才能运行下面的代码
									this.portrait = this.avatarUrl;
									uni.createSelectorQuery()
										.select('#nickInput')
										.fields({ properties: ['value'] })
										.exec((res) => {
											this.selfname = res[0].value;
											this.isModalVisible = false;
											uni.showTabBar();
										    // 每次都可能修改，所以每次都重新存
										    wx.setStorage({
											    key: 'imageandname',
											    data: [this.portrait, this.selfname],
										    })	
									});
								}
							});
						}
					},
					fail: (res) => {
						console.log('登录失败！' + res);
					}
				})
			},
		}
	}
</script>

<style lang="scss">
.page-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: -1;
}
	
.box {
	.portrait-box {
		position: absolute;
		top: 450rpx; 
		left: 310rpx;
		width: 150rpx;
		height: 150rpx;
		overflow: hidden;
		border-radius: 10rpx;
		image {
			width: 100%;
			height: 100%;
		}
	}
	.cybername {
		text-align: center; 
		margin-top: 640rpx; 
	}
}
.modal-overlay {
	position: absolute;
	top: calc(50% - 250rpx);
	left: calc(50% - 250rpx);
	width: 500rpx;
	height: 500rpx;
	border-radius: 20rpx;
	background-color: white;
	animation: fadeInOut 0.3s ease-in-out;
	.avatar-wrapper {
		margin-top: 20rpx;
		margin-bottom: 20rpx;
		width: 100px; 
		height: 100px; 
		border: none; 
		background-color: transparent; 
		padding: 0; 
		.avatar {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
	.weui-input {
		margin-top: 20rpx;
		margin-bottom: 20rpx;
		position: relative;
		left: 20rpx;
		width: 80%;
		height: 50rpx;
		font-size: 26rpx;
		margin-left: 20rpx;
		border: 1px solid #e4e1e7;
		border-radius: 10rpx;
		padding: 0 10rpx;
	}	
	.button-box {
		display: flex;
		align-items: center;
		justify-content: space-between; /* 可根据需要调整对齐方式 */
		button {
			width: 35%;
			height: 70rpx;
			line-height: 70rpx;
			font-size: 26rpx;
		}
	}
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
