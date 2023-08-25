<template>
	<view>
		<uni-swipe-action>
			<uni-swipe-action-item :right-options="option" @click="onDeleted">
				<view class="order-box">
					<label class="single-order"><checkbox color="#32c9fc" :checked="isSonChecked" @click="onSChangeChecked"/></label>
					<image mode="aspectFill" src="../../static/images/slideshow/slideshow_pic1.jpeg"></image>
					<view class="single-order-title">伯爵红茶戚风蛋糕-生日版</view>
					<view class="single-order-price">{{'£ ' + singlePrice}}</view>
					<uni-number-box class="single-order-numberbox" :value="numberValue" @change="change" :min="1" background="white" />
				</view>
			</uni-swipe-action-item>
		</uni-swipe-action>
	</view>
</template>

<script>
	export default {
		name:"cartitem",
		props: ['index', 'isAllChecked', 'singlePrice'],
		data() {
			return {
				numberValue: 1,
				option: [{
					text: '删除',
					style: {
						backgroundColor: '#F56C6C',
					},
				}],
				isSonChecked: false,
			};
		},
		// computed: {
		// 	singlePositivePrices() {
		// 		const positive = this.singlePrice * this.numberValue;
		// 		return positive.toFixed(2);
		// 	},
		// },
		watch: {
		    isAllChecked: {
		        handler(newValue) {
					this.isSonChecked = newValue;
		        }
		    },
			isSonChecked(newValue) {
				this.$emit('sonChecked', this.isSonChecked);
			},
		},
		methods: {
			change(value) {
					this.numberValue = value;
			},
			onDeleted() {
				this.$emit('indexToRemove', this.index);
			},
			onSChangeChecked() {
				if(this.isSonChecked == false) {
					this.isSonChecked = true;
				} else {
					this.isSonChecked = false;
				}
				this.$emit('sonItem', this.index);
				this.$emit('sonChecked', this.isSonChecked);
			}
		}
	}
</script>

<style lang="scss">
.order-box {
	width: 96%;
	height: 200rpx;
	border-radius: 20rpx;
	background-color: #f5f5f5;
	
	position: relative;
	.single-order {
		position: absolute;
		top: 70rpx;
		left: 20rpx;
	}
	image {
		width: 160rpx;
		height: 160rpx;
		position: absolute;
		top: 20rpx;
		left: 100rpx;
	}
	.single-order-title {
		position: absolute;
		top: 20rpx;
		left: 300rpx;
	}
	.single-order-price {
		position: absolute;
		bottom: 20rpx;
		left: 300rpx;
	}
	.single-order-numberbox {
		position: absolute;
		bottom: 20rpx;
		right: 20rpx;
	}
}
</style>