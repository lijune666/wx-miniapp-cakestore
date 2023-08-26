<template>
	<view>
		<!-- 搜索框 -->
		<view>
			<uni-search-bar class="uni-mt-10" focus="true" radius="5" v-model="searchValue" cancelButton="none" @confirm="onSearch"/>
		</view>
		
		<!-- 被搜索出来的产品 -->
		<view v-for="(item, index) in searchData" :key="index">
			<searchitem :searchImage="item.search_image" :searchTitle="item.search_title" :searchDescription="item.search_description" :searchPrice="item.search_price" :searchIndex="index" :sizeIds="item.size_ids" @info-clicked="onShowInfo"></searchitem>
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
				searchValue: '',
				searchData: [],
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
			onShowInfo(img, tte, i, sizeids) {
				this.showPopup = true;
				this.popupImage = img;
				this.popupTitle = tte;
				// 获得点击的对应蛋糕包含的所有规格
				this.singleCakeSizeIndex = sizeids.split(",");
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
			
			// 关闭底部弹窗
			onClosePopup() {
				this.showPopup = false;
			},
			
			// 改变选中的规格样式
			onChangeSizeClass(size, index) {
				this.sizeTemp = index;
				this.choseSize = size;
			}
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
