/**
 * 1.在函数体中，非显示或隐式地简单调用函数时，在严格模式下，函数内的 this 会被绑定到undefined上，在非严格模式下则会被绑定到全局对象window/global上
 * 2.一般使用new方法调用构造函数时，构造函数内的this会被绑定到新创建的对象上
 * 3.一般通过call/apply/bind方法显示调用函数时，函数体内的this会被绑定到指定参数的对象上
 * 4.一般通过上下文对象调用函数时，函数体内的this会绑定到该对象上
 * 5.在箭头函数中，this的指向是有外层（函数或全局）作用域来决定的
 */

// 例子1----------
const foo = {
	bar: 10,
	fn: function(){
		console.log('foo this:', this);
		console.log('this.bar:', this.bar);
	}
}
var fn1 = foo.fn;
fn1() // window undefined 执行了赋值操作，fn1是在全局作用域下执行的

//---------
const o1 = {
	text: 'o1',
	fn: function() {
		return this.text;
	}
}

const o2 = {
	text: 'o2',
	fn: function() {
		return o1.fn()
	}
}

const o3 = {
	text: 'o3',
	fn: function() {
		var fn = o1.fn; // todo 这里重新声明了一个变量和o22中字节赋值有什么不同？是否和是新声明的变量有关系，新声明的变量其实是在window下的
		return fn();
	}
}

console.log('o1.fn():', o1.fn()); // o1
console.log('o2.fn():', o2.fn()); // o1 最终是o1调用的
console.log('o3.fn():', o3.fn()); // undefined var fn = o1.fn 这里this指向window，参考例子1

//---------
// 不使用call、apply、bind，通过赋值操作改变this指向，指向调用的对象
const o11 = {
	text: 'o11',
	fn: function(){
		return this.text;
	}
}
const o22 = {
	text: 'o22',
	fn: o1.fn // 在编译阶段赋值给了o22的fn 通过o22调用this指向o22 o3的操作是因为重新声明了一个变量？？todo
}
console.log('o22.fn():', o22.fn());

//---------
// const target={};
// fn.call(target, arg1, arg2, arg3, ...)
// fn.applay(target, [arg1, arg2, ...])
// fn.bind(target, arg1, arg2, ...)() 主要bind只是返回一个新的函数，后面的使用需要用新返回的这个函数
const o111 = {
	text: 'o111',
	fn: function(){
		return this.text;
	}
}
const o222 = {
	text: 'o222'
}
console.log('o111.fn():', o111.fn()) // o111
console.log('o111.fn.apply(o222):', o111.fn.apply(o222)) // o222

//---------
// 构造函数this
function Foo(){
	this.text = 'Foo';
};
const newFoo = new Foo();
const newFoo_2 = new Foo();
console.log('newFoo newFoo_2:', newFoo.text, newFoo_2.text); // Foo Foo
newFoo.text = 'newFoo1'; 
console.log('newFoo newFoo_2:', newFoo.text, newFoo_2.text); // newFoo Foo

function Foo2(){
	this.text = 'Foo2';
	return {
		text: 'Foo2 return'
	}; // 复现复杂类型
}
function Foo3(){
	this.text = 'Foo3';
	return 1; // return 基础类型
}
const newFoo2 = new Foo2();
const newFoo3 = new Foo3();
console.log('newFoo2, newFoo3:', newFoo2.text, newFoo3.text); // newFoo2, newFoo3: Foo2 return Foo3
// 构造函数如果没有返回this指向新对象；如果返回的是对象(复杂对象)，this指向这个复杂对象；返回的是一个基础类型this仍指向构造的新对象
// 可以参考MDN对new的定义：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new
// 1.创建一个空的简单JavaScript对象（即{}）；
// 2.链接该对象（设置该对象的constructor）到另一个对象 ；
// 3.将步骤1新创建的对象作为this的上下文 ；
// 4.如果该函数没有返回对象，则返回this。
// 注意这里的第四条

//---------
// 箭头函数
// 非箭头函数写法setTimeout
function fn11(){
	this.text = 'fn11';
	setTimeout(function(){
		console.log('fn11:', this.text);
	}, 100);
};
fn11(); // undefined

// 解决办法
function fn22(){
	const _slef = this; // 保存下this
	this.text1 = 'fn22';
	setTimeout(function(){
		console.log('fn22:', _slef.text1);
	}, 100);
};
fn22(); // fn22

// 箭头函数
function fn33(){
	this.text = 'fn33';
	setTimeout(() => {
		console.log('fn33:', this.text);
	}, 200)
}
fn33(); // fn33

// 有趣的现象
function fn44(){
	this.text = 'fn44';
};
fn44(); 
// 执行了fn44后，发现fn33中的this.text值变成了fn44，这是因为fn11...fn44都是“简单调用”this指向的都是window、global；
// 其实在执行fn11是已经把text挂在到全局对象上了

//---------
// this优先级
// 通常把call、apply、bind、new的绑定情况称为显示绑定；把根据调用关系确定this绑定情况称为隐士绑定。
function foo2(a){
	console.log(this.a);
}
const obj1 = {
	a: 1,
	fn: foo2
};

const obj2 = {
	a: 2,
	fn: foo2
};

obj1.fn.call(obj2); // 2
obj2.fn.apply(obj1); // 1
// call、apply、bind、new的显示绑定优先级更高；

function foo3(a){
	this.a = a;
}

const obj3 = {};

var bar = foo3.bind(obj3);
bar(2);
console.log(obj3.a); // 2

var new_bar = new foo3();
console.log(new_bar.a); // 3
// new的绑定等级更高

// 思考：手动实现bind函数、手写clal/apply
// 参考：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind

// 最简单的方式
Function.prototype.bind = function (context, ...outerArgs) {
	return (...innerArgs) => {
		this.call(context, ...outerArgs, ...innerArgs)
	}
}

// apply手写实现很简单，思路如下：
// 1.检查调用apply的对象是否为函数
// 2.将函数作为传入的context对象的一个属性，调用该函数
// 3.不要忘了调用之后删除该属性
Function.prototype.apply = function (context, args) {
	// 检查调用```apply```的对象是否为函数
	if (typeof this !== 'function') {
	  throw new TypeError('not a function')
	}
  
	// 将函数作为传入的```context```对象的一个属性，调用该函数
	const fn = Symbol()
	context[fn] = this
	context[fn](...args)
  
	// 不要忘了调用之后删除该属性
	delete context[fn]
}

// new
function myNew (fn, ...args) {
	// 第一步，创建一个空的简单JavaScript对象（即{}）；
	let obj = {}
  
	// 第二步，原型链绑定
	fn.prototype !== null && (obj.__proto__ = fn.prototype)
  
	// 第三步，改变this指向并运行该函数
	let ret = fn.call(obj, ...args)
  
	// 第四步，如果该函数没有返回对象，则返回this
	// 别忘了 typeof null 也返回 'object' 的bug
	if ((typeof ret === 'object' || typeof ret === 'function') && ret !== null) {
	  return ret 
	}
	return obj
}