<template>
	<view>
		<view class="box">
			<view class="portrait-box">
				<image mode="scaleToFill" :src="portrait"></image>
			</view>
			<view class="cybername">{{name}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				portrait: '../../static/images/slideshow/slideshow_pic3.jpeg',
				name: '我是天才'
			};
		}
	}
</script>

<style lang="scss">
.box {
	.portrait-box {
		position: absolute;
		top: 450rpx; 
		left: 310rpx;
		width: 150rpx;
		height: 150rpx;
		border-radius: 50%;
		overflow: hidden;
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
</style>
