<template>
	<view>
		<!-- 搜索框 -->
		<view>
			<uni-search-bar class="uni-mt-10" focus="true" radius="5" v-model="searchValue" cancelButton="none" @confirm="onSearch"/>
		</view>
		
		<!-- 被搜索出来的产品 -->
		<view v-for="(item, index) in searchData" :key="index">
			<searchitem :searchImage="item.search_image" :searchTitle="item.search_title" :searchDescription="item.search_description" :searchPrice="item.search_price" @info-clicked="onShowInfo"></searchitem>
		</view>
		
		<!-- 底部弹出框：选择规格 -->
		<view class="bottom-popup" :class="{ 'show': showPopup }">
			<view class="popup-content">
			    <!-- 弹窗内容 -->
			    <view class="popup-header">{{popupTitle}}</view>
			    <view class="popup-body">
					<image mode="aspectFill" :src="popupImage"></image>
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
				searchValue: '',
				searchData: [],
				showPopup: false,
				popupImage: '',
				popupTitle: '',
				numberValue: 1,  // 数量选择
				radio: 0,   // 选择哪一规格
				
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
			};
		},
		watch: {
			searchValue() {
				uni.request({
					url: 'http://localhost:3000/api/search/data',
					data: {
					    searchValue: this.searchValue
					},
					success: (res) => {
						this.searchData = res.data;
					},
				});
			}
		},
		methods: {
			onSearch() {
				uni.request({
					url: 'http://localhost:3000/api/search/data',
					data: {
					    searchValue: this.searchValue
					},
					success: (res) => {
						this.searchData = res.data;
					},
				});
			},
			
			// 获得底部弹窗的的图片和标题
			onShowInfo(img, tte) {
				this.showPopup = true;
				this.popupImage = img;
				this.popupTitle = tte;
			},
			
			// 点击+或-触发获得数量选择器的值
			change(value) {
				this.numberValue = value
			},
			
			// 关闭底部弹窗
			onClosePopup() {
				this.showPopup = false;
			},
		}
	}
</script>

<style lang="scss">
.bottom-popup {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	background-color: #fff;
	height: 800rpx;
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
