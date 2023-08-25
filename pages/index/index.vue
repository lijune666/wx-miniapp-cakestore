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
		<view class="search" :class="temp==1?'fixsearch':''">
			<uni-search-bar class="uni-mt-10 search-bar" radius="5" placeholder="请输入要搜索的内容" clearButton="auto" cancelButton="none" @confirm="search" @input="input"/>
		</view>
		<!-- 主页面 -->
		<view class="page-bottom-items">
			<!-- 左侧栏：蛋糕主题 -->
			<view class="left-bar" :class="temp==1?'fixbar':''">
				<view v-for="(cakeClass, index) in cakeClasses" :key="index">
					<cakeclass :cakeClass="cakeClass.theme_name" :cakeIndex="index" :isActived="activeIndex===index?true:false" @cakeClicked="onClassChose"></cakeclass>
				</view>
			</view>
			<!-- 右侧：蛋糕主体 -->
			<view class="items" :class="temp==1?'fixitems':''">
				<view class="item" v-for="(cakeClass, index1) in cakeClasses" :key="index1">
					<!-- 右侧：蛋糕主题 -->
					<view class="item-title" :id="`class${index1 - 1}`">
						{{cakeClass.theme_name}}
					</view>
					<!-- 右侧：蛋糕信息 -->
					<view v-for="(obj, index2) in cakeMain" :key="index2">
						<view v-if="cakeClass.theme_id == obj.theme_id">
							<cakeitem :cakeImage="obj.item_image" :cakeTitle="obj.item_title" :cakeSubTitle="obj.item_description" :cakePrice="obj.item_price" @info-clicked="showInfo"></cakeitem>
						</view>
					</view> 
				</view>
			</view>
		</view>
		<!-- 底部弹出框：选择规格 -->
		<view class="bottom-popup" :class="{ 'show': showPopup }">
			<view class="popup-content">
			    <!-- 弹窗内容 -->
			    <view class="popup-header">{{cakeTitle}}</view>
			    <view class="popup-body">
					<image mode="aspectFill" :src="cakeImage"></image>
				</view>
				<uni-section>
					<view class="text">数量：{{numberValue}}</view>
					<uni-number-box :value="numberValue" @change="change" :min="1" :max="9"/>
				</uni-section>
				<uni-section>
					<view class="uni-px-5">
						<view class="text">规格：{{JSON.stringify(radio)}}</view>
						<uni-data-checkbox mode="tag" v-model="radio" :localdata="inch"></uni-data-checkbox>
					</view>
				</uni-section>
				<button @click="closePopup" class="close-popup">X</button>
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
				myScroll: 0,
				popupMessage: '',
				showPopup: false,
				cakeImage: '../../static/images/slideshow/slideshow_pic1.jpeg',
				cakeTitle: '伯爵红茶戚风蛋糕-生日版',
				cakeSubTitle: '原料：安佳黄油，小麦粉，草莓，干柠檬片',
				cakePrice: '£ 69.99',
				radio: 0,
				inch: [{
					text: '6寸',
					value: 0
				}, {
					text: '8寸',
					value: 1
				}, {
					text: '10寸',
					value: 2
				}],
				numberValue: 1,
				activeIndex: 0,
				classDistances: [],
				scrollTop: 0,
				searchScroll: 0,
				searchHeight: 0,
				isFunctionRunning: true,
				cornerIcon: 0,
				// 轮播图
				slidersPath: [],
				// 蛋糕主题
				cakeClasses: [],
				// 蛋糕主体
				cakeMain: [],
			};
		},
		onLoad() {	
			
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
					console.log(res.data);
				},
			});
			
			// 搜索
			uni.createSelectorQuery().select('.search').boundingClientRect(res=>{
				this.searchScroll = res.top;
				this.searchHeight = res.height;
			}).exec();
		},
		
		mounted() {
			this.computedClassDistances();
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
							}
			            });
			        }
			    }
			}
		},
		onPageScroll(position) {
			const currentPosition = position.scrollTop;
			if(currentPosition > this.searchScroll){
				this.temp= 1
			}else{
				this.temp= 0
			}
			
			if(this.isFunctionRunning) {
				for(let i = 0; i < this.classDistances.length; i++) {
					if(currentPosition > this.classDistances[i]) {
						this.activeIndex = i
					}
				}
			}
		},
		
		methods: {
			onAddCart() {
				console.log(1)
				this.cornerIcon = this.cornerIcon + this.numberValue;
			},
		    showInfo(message) {
				this.showPopup = true;
				this.popupMessage = message;
		    },
			closePopup() {
				this.showPopup = false;
			},
			input(res) {
				console.log('----input:', res)
			},
			change(value) {
				this.numberValue = value
			},
			async onClassChose(index) {
				this.activeIndex = index;

				this.isFunctionRunning = false;
				
				await uni.pageScrollTo({
					scrollTop: this.classDistances[index]+1,
					duration: 300,
				});
				
				this.isFunctionRunning = true;
			},
			computedClassDistances() {
				this.cakeClasses.map((_, index) => {
					const query = uni.createSelectorQuery().select('#class' + index);
					query.boundingClientRect(rect => {
						this.scrollTop = rect.top - this.searchHeight;
						this.classDistances.push(this.scrollTop)
					}).exec();
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
