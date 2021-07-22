console.log('1');
new Promise((resolve, reject) => {
	console.log('2');
	resolve();
}).then(() => {
	console.log('3');
	return new Promise((resolve, reject) => {
		console.log('4');
		resolve();
	})
}).then(() => {
	console.log('5');
})
console.log('6');
// 126345


console.log(1);
new Promise((resolve, reject) => {
	console.log('2');
	setTimeout(() => {
		console.log(3)
	}, 0)
	resolve();
}).then(() => {
	console.log('4');
	setTimeout(() => {
		console.log(5)
	}, 0)
	return new Promise((resolve, reject) => {
		console.log('6');
		setTimeout(() => {
			console.log(7)
		}, 0)
		resolve();
	})
}).then(() => {
	console.log('8');
})
console.log(9);
// 129468357

// 先微任务在泓任务
// 微任务Promise.then、MutationObserve、process.nextTick(node.js)