export class TaskQueue {
	constructor(concurrency) {
		this.concurrency = concurrency;
		this.running = 0;
		this.queue = [];
	}

	pushTask(task) {
		this.queue.push(task);
		process.nextTick(this.next.bind(this)); //we use bind here because otherwise will lose context in process.nextTick
		return this;
	}

	next() {
		while (this.running < this.concurrency && this.queue.length) {
			//This execute after the queue is completed and release all stack of tasks
			const task = this.queue.shift();
			task(() => {
				this.running--;
				process.nextTick(this.next.bind(this));
			});
			this.running++;
		}
	}
}
