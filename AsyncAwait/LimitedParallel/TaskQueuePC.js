export class TaskQueuePC {
	constructor(concurrency) {
		this.taskQueue = [];
		this.consumerQueue = [];

		// spawn consumers
		for (let i = 0; i < concurrency; i++) {
			this.consumer();
		}
	}

	async consumer() {
		while (true) {
			try {
				const task = await this.getNextTask(); //(1)
				await task(); //(2)
			} catch (err) {
				console.error(err);
			}
		}
	}

	getNextTask() {
		return new Promise((resolve) => {
			//Al ser una nuevea promise, necesita resolver para avanzar en (1), mientras se queda en "sleep".
			if (this.taskQueue.length !== 0) {
				return resolve(this.taskQueue.shift());
			}

			this.consumerQueue.push(resolve);
		});
	}

	runTask(task) {
		return new Promise((resolve, reject) => {
			const taskWrapper = () => {
				const taskPromise = task();
				taskPromise.then(resolve, reject);
				return taskPromise;
			};

			if (this.consumerQueue.length !== 0) {
				// there is a sleeping consumer available, use it to run our task
				const consumer = this.consumerQueue.shift();
				consumer(taskWrapper); //Sacamos el resolver de la promesa y la ejecutamos para que pueda seguir en (2) y resumir el loop infinito
			} else {
				// all consumers are busy, enqueue the task
				this.taskQueue.push(taskWrapper);
			}
		});
	}
}
