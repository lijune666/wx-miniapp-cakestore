<template>
	<view>
		<view :class="{'cake-class-box': true, 'cake-class-box-chose': isActived}" @click="ontemp">{{cakeClass}}</view>
	</view>
</template>

<script>
	export default {
		name:"cakeclass",
		props: ['cakeClass', 'cakeIndex', 'isActived'],
		data() {
			return {
				
			};
		},
		methods: {
			ontemp() {
				this.$emit('cakeClicked', this.$props.cakeIndex);
			}
		}
	}
</script>

<style lang="scss">
.cake-class-box {
	height: 100rpx;
	text-align: center;
	line-height: 100rpx;
}
.cake-class-box-chose {
	background-color: white;
	color: #32c9fc;
}
</style>