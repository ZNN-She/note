// 相关概念：预编译、执行、作用域、作用域连、执行上下文、调用栈

// ---------------
// 预编译变量提升
function foo(){
	console.log(bar);
	var bar = 2;
}

// 等价
function foo(){
	var bae;
	console.log(bar);
	bar = 2;
}

// ----------------
var a = 1; // 分配内存
console.log(a); // 读写内存
a = null; // 释放内存，变量a没有值了，这时a只是一段代码而已，没有对应的存储值
a = 2; // 从新分配内存

// 内存泄漏
// 函数内部引用了外部变量，在函数运行之后，函数内部仍然保持着引用，导致外部变量无法释放
function fn1(){
	var b = 1;
	function fn2(){
		console.log(b);
		debugger;
	};
	return fn2;
}
var fn2 = fn1();
fn2();

// dom元素没有释放
const dom = document.getElementById('test');
dom.innerText = 'test';
dom.parentNode.removeChild(dom);
// 但是dom对象还在
dom = null; // 释放内存

const dom = document.getElementById('test');
dom.addEventListener('click', function(){});
dom.innerHTML = ''; //事件引用还在 不会被回收

// ------
// 闭包经典问题，for循环
for(var i = 0; i < 10; i++){
	function fn1(){
		// 模拟一步或大量计算
		setTimeout(function(){
			console.log(i);
		})
	};
	fn1();
}
// 结果全是10

for(var i = 0; i < 10; i++){
	// 听过闭包保存当前参数
	(function(data){
		// 模拟一步或大量计算
		setTimeout(function(){
			console.log(data);
		})
	})(i)
}

// 内存可以在浏览器控制台查看相关信息