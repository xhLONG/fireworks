// 获取 canvas 上下文，并指定宽高
let ctx = document.querySelector('canvas').getContext('2d')
ctx.canvas.width = window.innerWidth
ctx.canvas.height = window.innerHeight

// 初始绽放数
const OVERLAP_NUM = 66
// 刷新速度 ms
const TIME_STEP = 16
// 烟花移动的速度与方向控制
const WALK = 0.2

// 火花数组
let sparks = []
// 烟花数组
let fireworks = []

// 初始爆炸的填充逻辑
for (let i = 0; i < OVERLAP_NUM; i++) {
	// 填充
	fireworks.push(
		// 构建随机位置
		new Firework(
			Math.random() * window.innerWidth,
			Math.random() * window.innerHeight
		)
	)
}

/**
 * 渲染函数
 */
function render() {
	// 夜幕背景色与区域
	ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

	// 烟花上升
	for (let firework of fireworks) {
		if (firework.over) {
			continue
		}
		firework.move()
		firework.draw()
	}

	// 火花下坠
	for (let spark of sparks) {
		if (spark.over) {
			continue
		}
		spark.move()
		spark.draw()
	}

	// 通过随机数来控制烟花产生速度
	if (Math.random() < 0.05) {
		fireworks.push(new Firework())
	}

	// 重复渲染
	setTimeout(render, TIME_STEP)
}

/**
 * 火花构造
 */
function Spark(x, y, color) {
	// 标记绽放点位置与色值
	this.x = x
	this.y = y
	this.color = color
	// 位置
	this.dir = Math.random() * (Math.PI * 2)
	// 执行完毕
	this.over = false
	// 火花崩裂速度
	this.speed = Math.random() * 3 + 3
	// 火花下坠的速度
	this.gravity = Math.random() + 0.1
	// 火花消失的速度
	this.countdown = this.speed * 10
	/**
	 * 火花移动方法
	 */
	this.move = function () {
		// 倒计时处理
		this.countdown--
		if (this.countdown < 0) {
			this.over = true
		}

		// 速度递减
		if (this.speed > 0) {
			this.speed -= 0.1
		}

		if (this.speed < 0) {
			return
		}

		// x、y 坐标位置
		this.x += Math.cos(this.dir + WALK) * this.speed
		this.y += Math.sin(this.dir + WALK) * this.speed
		this.y += this.gravity
		// 下坠速度加快
		this.gravity += 0.05
	}
	/**
	 * 绘制
	 */
	this.draw = function () {
		drawCircle(this.x, this.y, 3, this.color)
	}
}

/**
 * 烟花构造
 */
function Firework(x, y) {
	// 初始点
	this.x = x || Math.random() * ctx.canvas.width
	this.y = y || ctx.canvas.height
	// 绽放点
	this.burstLocation = (Math.random() * ctx.canvas.height) / 2
	// 绽放是否已完毕
	this.over = false
	// 烟花色
	this.color = randomColor()

	/**
	 * 移动的方法
	 */
	this.move = function () {
		// 横向偏移
		this.x += WALK
		// 上升与绽放
		if (this.y > this.burstLocation) {
			this.y -= 1
		} else {
			this.burst()
		}
	}

	/**
	 * 持续绘制
	 */
	this.draw = function () {
		drawCircle(this.x, this.y, 1.5, this.color)
	}
	/**
	 * 绽放方法
	 */
	this.burst = function () {
		// 标记绽放完毕
		this.over = true
		// 碎裂烟花数
		let i = Math.floor(Math.random() * 150) + 10
		// 构建碎裂对象
		while (i--) {
			sparks.push(new Spark(this.x, this.y, this.color))
		}
	}
}

/**
 * 持续绘制
 */
function drawCircle(x, y, radius, color) {
	color = color
	ctx.fillStyle = color
	ctx.fillRect(x - radius / 2, y - radius / 2, radius, radius)
}

/**
 * 生成随机色值
 */
function randomColor() {
	const r = Math.floor(Math.random() * 255)
	const g = Math.floor(Math.random() * 255)
	const b = Math.floor(Math.random() * 255)
	return `rgb(${r},${g},${b})`
}

// 开始
render()
