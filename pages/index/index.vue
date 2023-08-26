<template>
	<view> 
		<!-- 轮播图 -->
		<view class="slideshow">
			<swiper class="swiper" circular indicator-dots autoplay interval="4000" duration="500">
				<view v-for="(item, i) in slidersPath" :key="i">
					<swiper-item >
						<image mode="aspectFill" :wx:if="item" :src="item"></image>
					</swiper-item>
				</view>
			</swiper>
		</view>
		<!-- 搜索框 -->
		<view class="search" :class="temp==1?'fixsearch':'unfixsearch'">
			<view class="search-bar" @click="onToSearchPage">请输入要搜索的内容</view>
			<image class="search-icon" src="../../static/images/searchicon.png" @click="onToSearchPage"></image>
		</view>
		<!-- 主页面 -->
		<view class="page-bottom-items">
			<!-- 左侧栏：蛋糕主题 -->
			<view class="left-bar" :class="temp==1?'fixbar':''">
				<view v-for="(cakeClass, index) in cakeClasses" :key="index">
					<cakeclass :cakeClass="cakeClass.theme_name" :classIndex="index" :isActived="activeIndex===index?true:false" @onClassClick="onClassChose"></cakeclass>
				</view>
			</view>
			<!-- 右侧：蛋糕主体 -->
			<view class="items" :class="temp==1?'fixitems':''">
				<view class="item" v-for="(cakeClass, index1) in cakeClasses" :key="index1">
					<!-- 右侧：蛋糕主题 -->
					<view class="item-title" :id="`class${index1}`">
						{{cakeClass.theme_name}}
					</view>
					<!-- 右侧：蛋糕信息 -->
					<view v-for="(obj, index2) in cakeMain" :key="index2">
						<view v-if="cakeClass.theme_id == obj.theme_id">
							<cakeitem :cakeImage="obj.item_image" :cakeTitle="obj.item_title" :cakeSubTitle="obj.item_description" :cakePrice="'£ ' + obj.item_price" :cakeIndex="index2" @info-clicked="onShowInfo"></cakeitem>
						</view>
					</view> 
				</view>
			</view>
		</view>
		<!-- 底部弹出框：选择规格 -->
		<view class="bottom-popup" :class="{ 'show': showPopup }">
			<view class="popup-content">
			    <!-- 弹窗内容 -->
			    <view class="popup-header">{{popupTitle}}</view>
			    <view class="popup-body">
					<image mode="aspectFill" :src="popupImage"></image>
				</view>
				<view style="margin: 20rpx 0;">数量：</view>
					<uni-number-box :value="numberValue" @change="change" :min="1" :max="9"/>
				<view style="margin: 20rpx 0;">规格：</view>
				<view class="sizes">
					<view class="size-box" v-for="(size, i) in sigleCakeSizeName" :key="i">
						<view class="single-size" :class="sizeTemp==i?'single-size-checked':''" @click="onChangeSizeClass(size, i)">{{size}}</view>
					</view>
				</view>
				<button @click="onClosePopup" class="close-popup">X</button>
				<button class="add-cart" @click="onAddCart">加入购物车</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 控制添加滑动到一定距离增加和删除固定样式
				temp: 0,
				
				cornerIcon: 0,
				
				// 轮播图
				slidersPath: [],
				// 蛋糕主题
				cakeClasses: [],
				// 蛋糕主体
				cakeMain: [],
				// 计算每个主题距离整个文档顶部的距离
				classDistances: [],
				// 当前点击的主题下标，用于修改选中和未选中的样式
				activeIndex: 0,
				// 控制位，搭配async和await来保证在点击主题滑动结束时不触发页面滑动的监控
				isFunctionRunning: true,
				// 底部弹出框
				showPopup: false,
				popupImage: '',
				popupTitle: '',
				numberValue: 1,  // 数量选择
				// 蛋糕规格
				singleCakeSizeIndex: [],  // 单个蛋糕包含的规格
				cakeSizeIndex: [],  // 所有规格
				sigleCakeSizeName: [],
				sizeTemp: 0, // 被点击时修改样式
				choseSize: '',
				// 页面卷去的高度
				currentScrollTop: 0,
				// 搜索
				searchScroll: 0,  // 搜索框距离文档顶部的距离
				searchHeight: 0,  // 搜索框的高度
			};
		},
		created() {
			// 轮播图
			uni.request({
				url: 'http://localhost:3000/api/slider/image',
				success: (res) => {
					this.slidersPath = res.data;
				},
			});
			
			// 蛋糕主题
			uni.request({
				url: 'http://localhost:3000/api/item/theme',
				success: (res) => {
					this.cakeClasses = res.data;
				},
			});
			
			// 蛋糕主体
			uni.request({
				url: 'http://localhost:3000/api/item/data',
				success: (res) => {
					this.cakeMain = res.data;
				},
			});
			
			// 搜索
			uni.createSelectorQuery().select('.search').boundingClientRect(res=>{
				this.searchScroll = res.top;
				this.searchHeight = res.height;
			}).exec();
			
			// 获取登录状态
			// 设置超时，与上一次登录时间相比，超过了一定时间登录状态被置为0，并且要传回数据库
			wx.getStorage({
				key: "loginstate",
				success: (res) => {
					console.log(res.data)
				}
			});
		},
		
		mounted() {
			// 需要等到渲染完毕再计算每个主题的距离，方便点击后屏幕滚动到对应的位置
			this.computedClassDistances();
		},
		
		// uniapp的生命周期函数之一，监听页面滑动，从而在滑到对应主题时，左侧栏显示对应的主题
		onPageScroll(position) {
			// 左边栏和搜索框的固定
			const currentPosition = position.scrollTop;
			if(currentPosition > this.searchScroll){
				this.temp= 1
			}else{
				this.temp= 0
			}
			
			// 如果页面滑动距离超过主题最下面，则修改对应主题的下标，增加class和撤销class
			if(this.isFunctionRunning) {
				for(let i = 0; i < this.classDistances.length; i++) {
					if(currentPosition > this.classDistances[i]) {
						this.activeIndex = i
					}
				}
			}
		},
		
		watch: {
			cornerIcon(newVal, oldVal) {
			    if (newVal !== oldVal) {
			        if (newVal <= 0) {
						uni.removeTabBarBadge({
							index: 1,
							success: function() {
								console.log('红点移除成功');
							}
						});
			        } else {
						uni.setTabBarBadge({
							index: 1,
							text: newVal.toString(),
							success: function() {
								console.log('红点显示成功');
							},
			            });
			        }
			    }
			}
		},
		
		methods: {
			// 计算每个主题的距离
			computedClassDistances() {
				this.cakeClasses.map((_, index) => {
					const query = uni.createSelectorQuery().select('#class' + index);
					query.boundingClientRect(rect => {
						this.currentScrollTop = rect.top - this.searchHeight;
						this.classDistances.push(this.currentScrollTop)
					}).exec();
				});
			},
			
			// 点击主题滑到对应的部分
			async onClassChose(index) {
				this.activeIndex = index;
			
				this.isFunctionRunning = false;
				
				await uni.pageScrollTo({
					scrollTop: this.classDistances[index]+1,
					duration: 300,
				});
				
				// 延长一秒，防止变为true太快导致页面滑动还没停止就开启监听了，这样最下面没有超过视窗顶的对应主题无法被选中
				setTimeout(() => {
					this.isFunctionRunning = true;
				}, 100); 
			},
			
			// 获得底部弹窗的的图片和标题
			onShowInfo(img, tte, i) {
				this.showPopup = true;
				this.popupImage = img;
				this.popupTitle = tte;
				// 获得点击的对应蛋糕包含的所有规格
				this.singleCakeSizeIndex = this.cakeMain[i].size_ids.split(",");
				// 请求数据库中的规格
				uni.request({
					url: 'http://localhost:3000/api/item/size',
					success: (res) => {
						this.cakeSizeIndex = res.data;
						this.sigleCakeSizeName = this.singleCakeSizeIndex.map(key => this.cakeSizeIndex[key]);
						this.choseSize = this.sigleCakeSizeName[0];
					}
				})
			},

			// 点击+或-触发获得数量选择器的值
			change(value) {
				this.numberValue = value
			},
			
			// 改变选中的规格样式
			onChangeSizeClass(size, index) {
				this.sizeTemp = index;
				this.choseSize = size;
			},
			
			// 关闭底部弹窗
			onClosePopup() {
				this.showPopup = false;
			},
			
			// 加入购物车
			onAddCart() {
				// 显示角标（需要修改，应该读数据库里的数量）
				this.cornerIcon = this.cornerIcon + this.numberValue;
			},
		    
			// 点击搜索框跳转到搜索页面
			onToSearchPage() {
				// 跳转到搜索页面
				uni.navigateTo({
					url: '../search/search',
				});
			},
		}
	}
</script>

<style lang="scss">
.fixsearch {
	position: fixed;
	width: 100%;
	top: 0;
	left: 0;
	z-index: 1;
}
	
.unfixsearch {
	position: relative;
}

.fixbar {
	position: fixed;
	top: 114rpx;
	left: 0;
}

.fixitems {
	position: relative;
	top: 114rpx;
}
	
.slideshow {
	width: 100%;
	.swiper {
		height: 400rpx;
		image {
			width: 100%;
		}
	}
}

.search {
	background-color: white;
	height: 110rpx;
	.search-bar {
		width: 85%;
		height: 60rpx;
		line-height: 60rpx;
		position: absolute;
		top: 50%;
		left: 30rpx;
		transform: translateY(-50%);
		font-size: 22rpx;
		border-radius: 10rpx;
		background-color: #f6f6f6;
		color: #b3b3b3;
		text-align: center;
	}
	.search-icon {
		position: absolute;
		top: 50%;
		right: 30rpx;
		transform: translateY(-50%);
		width: 45rpx;
		height: 45rpx;
	}
}

.page-bottom-items {
	height: 936rpx;
	.left-bar {
		float: left;
		width: 20%;
		height: 1441rpx;
		background-color: #f3f3f3;
	}
	.items {
		float: right;
		width: 80%;
		.item-title {
			margin-left: 20rpx;
		}
	}
}

.bottom-popup {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	background-color: #fff;
	height: 900rpx;
	transform: translateY(100%);
	transition: transform 0.3s ease-out;
	.popup-content {
		padding: 20px;
		.popup-header {
			font-size: 18px;
			font-weight: bold;
			margin-bottom: 10px;
		}
		.popup-body {
			font-size: 14px;
			image {
				width: 200rpx;
				height: 200rpx;
			}
		}
		.sizes { 
			display: flex;
			flex-wrap: wrap;
			.size-box {
				height: 80rpx;
				flex-basis: 25%;
				display: flex; 
				align-items: center; 
				.single-size {
					width: 140rpx;
					height: 60rpx;
					line-height: 60rpx;
					font-size: 26rpx;
					text-align: center;
					border: 1rpx solid #bbbbbb;
					border-radius: 10rpx;
					margin-left: 0; 
				}
				.single-size-checked {
					color: #32c9fc;
					border: 1rpx solid #32c9fc;
					background-color: rgba(50, 201, 252, 0.1);
				}
			}
		}
		.close-popup::after {
			border: none;
			background-color: none;
		}
		.close-popup:active {
			color: #32c9fc;
		}
		.close-popup {
			width: 100rpx;
			height: 70rpx;
			position: absolute;
			top: 0;
			right: 0;
			-webkit-tap-highlight-color: transparent;
			color: #000000;
			background-color: #fff;
			color: gray;
		}
		.add-cart {
			color: white;
			background-color: #32c9fc;
			border-radius: 30rpx;
			font-size: 22rpx;
			width: 200rpx;
			height: 50rpx;
			position: relative;
			top: 50rpx;
		}
	}
}
.show {
	transform: translateY(0);
}
</style>
