<template>
	<view>
		<uni-swipe-action>
			<uni-swipe-action-item :right-options="option" @click="onDeleted">
				<view class="search-box">
					<image mode="aspectFill" :src="searchImage"></image>
					<view class="search-title">{{searchTitle}}</view>
					<view class="search-description">{{searchDescription}}</view>
					<view class="search-price">{{'£ ' + searchPrice}}</view>
					<button class="search-size" @click="sendInfo()">选规格</button>
				</view>
			</uni-swipe-action-item>
		</uni-swipe-action>
	</view>
</template>

<script>
	export default {
		name:"searchitem",
		props: ['searchImage', 'searchTitle', 'searchDescription', 'searchPrice', 'searchIndex', 'sizeIds'],
		data() {
			return {

			};
		},
		methods: {
			sendInfo() {
				this.$emit('info-clicked', this.searchImage, this.searchTitle, this.searchIndex, this.sizeIds);
			}
		}
	}
</script>

<style lang="scss">
.search-box {
	width: 96%;
	height: 200rpx;
	margin: 1% 2%;
	border-radius: 20rpx;
	background-color: #f9f9f9;
	position: relative;
	
	
	image {
		width: 160rpx;
		height: 160rpx;
		position: absolute;
		top: 20rpx;
		left: 20rpx;
	}
	.search-title {
		position: absolute;
		top: 20rpx;
		left: 220rpx;
	}
	.search-description {
		position: absolute;
		top: 60rpx;
		left: 220rpx;
		color: grey;
		font-size: 22rpx;
	}
	.search-price {
		position: absolute;
		bottom: 20rpx;
		left: 220rpx;
	}
	.search-size {
		position: absolute;
		bottom: 20rpx;
		right: 20rpx;
		color: white;
		background-color: #32c9fc;
		border-radius: 30rpx;
		font-size: 22rpx;
		width: 125rpx;
		height: 50rpx;
	}
}
</style>