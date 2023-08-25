<template>
	<view>
		<view class="cart-items">
			<view v-for="(index, i) in itemIndexs" :key="i">
				<view class="cart-box"><cartitem :singlePrice="singlePrice" :index="index" :isAllChecked="isAllChecked" @indexToRemove="onIndexToRemove" @sonChecked="onSonChecked" @sonItem="onSonItem"></cartitem></view>
			</view>
		</view>
		<view class="check">
			<view class="all-order">
				<label><checkbox color="#32c9fc" :checked="isFatherChecked" @click="onFChangeChecked" />全选</label>
			</view>
			<view class="whole-price">{{'合计：£ ' + sum}}</view>
			<button class="buy-button">结算</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				singlePrice: 69.99,
				price: 0,
				sum: 0,
				itemIndexs: [0, 1, 2, 3],
				itemIndex: 0,
				itemCheck: [],
				isSonChecked: false,
				isFatherChecked: false,
				isAllChecked: false
			}
		},
		computed: {
			itemChecked() {
				if(this.itemCheck.length == 0) {
					this.itemCheck = Array(this.itemIndexs.length).fill(false);
					return this.itemCheck;
				} else {
					
				}
				console.log(this.itemCheck)
			},
		},
		methods: {
			onIndexToRemove(index) {
				this.itemIndexs.splice(index, 1); // 从数组中移除元素
				
				// 更新数组内容，使其保持连续的数字
				for (let i = index; i < this.itemIndexs.length; i++) {
				  this.itemIndexs[i] = i;
				}
			},
			onFChangeChecked() {
				if(this.isFatherChecked == false) {
					this.isFatherChecked = true;
					this.isAllChecked = true;
				} else {
					this.isFatherChecked = false;
					this.isAllChecked = false;
				}
			},
			onSonItem(item) {
				this.itemIndex = item;
			},
			onSonChecked(checked) {
				this.isSonChecked = checked;
				this.itemChecked[this.itemIndex] = checked;
				if(this.itemChecked.every(checked => checked === true) && this.itemChecked.length == this.itemIndexs.length) {
					this.isFatherChecked = true;
				} else {
					this.isFatherChecked = false;
				}
			},
		}
	}
</script>

<style lang="scss">
.cart-items {
	width: 100%;
	padding-bottom: 100rpx;
	.cart-box {
		width: 100%;
		margin: 2%;
	}
}
.check {
	width: 100%;
	height: 100rpx;
	background-color: #f5f5f5;
	position: fixed;
	bottom: 0;
	.all-order {
		color: grey;
		position: absolute;
		top: 30rpx;
		left: 30rpx;
	}
	.whole-price {
		position: absolute;
		top: 30rpx;
		right: 250rpx;
	}
	.buy-button {
		color: white;
		background-color: #32c9fc;
		width: 200rpx;
		height: 70rpx;
		line-height: 70rpx;
		position: absolute;
		top: 15rpx;
		right: 30rpx;
		border-radius: 70rpx;
	}
}
</style>
