<template>
	<view>
		<view class="item-inner">
			<view class="item-image">
				<image mode="aspectFill" :src="cakeImage"></image>
			</view>
			<view class="caketext">
				<view class="caketitle">{{cakeTitle}}</view>
				<view class="cakesubtitle">{{cakeSubTitle}}</view>
				<view class="cakeprice">{{cakePrice}}</view>
				<button @click="sendInfo()">选规格</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"cakeitem",
		props: ['cakeImage', 'cakeTitle', 'cakeSubTitle', 'cakePrice', 'cakeIndex'],
		data() {
			return {
				
			};
		},
		methods: {
			sendInfo() {
				this.$emit('info-clicked', this.cakeImage, this.cakeTitle, this.cakeIndex);
			}
		},
	}
</script>

<style lang="scss">
.item-inner {
	padding: 20rpx;
	height: 200rpx;
	.item-image {
		float: left;
		width: 36%;
		height: 200rpx;
		background-color: black;
		image {
			width: 100%;
			height: 100%;
		}
	}
	.caketext {
		position: relative;
		float: right;
		width: 64%;
		height: 100%;
		.caketitle {
			position: absolute;
			left: 20rpx;
			top: 0;
			overflow:hidden;//超出隐藏
			// white-space: nowrap;//超出换行
			text-overflow: ellipsis;//文字超出省略号
			-o-text-overflow:ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;//文字行数
		}
		.cakesubtitle {
			color: grey;
			font-size: 22rpx;
			position: absolute;
			left: 20rpx;
			top: 40rpx;
		}
		.cakeprice {
			position: absolute;
			left: 20rpx;
			bottom: 0;
		}
		button {
			color: white;
			background-color: #32c9fc;
			border-radius: 30rpx;
			font-size: 22rpx;
			width: 125rpx;
			height: 50rpx;
			position: absolute;
			right: 0;
			bottom: 0;
		}
	}
}

</style>