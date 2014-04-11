define(["Core"], function(Core) {
	var Task = Class.create({
		initialize: function (executeTick, repeat, action) {
			this.executeTick = executeTick;
			this.repeat = repeat;
			this.action = action;
		}
	});

	return Class.create({
		initialize: function () {
			this.tasks = [];

			this.lastTick = -1;
		},

		update: function (ticks) {
			this.lastTick = ticks;

			// execute
			for (var i = 0; i < this.tasks.length; ++i) {
				var t = this.tasks[i];

				if (t.executeTick >= ticks && ticks - t.executeTick <= t.repeat) {
					t.action();
				}
			}

			this.removeExecutedTasks();
		},

		removeExecutedTasks: function() {
			// TODO: implement method
		},

		addTask: function(delay, repeat, action) {
			this.tasks.push(new Task(this.lastTick + delay, repeat, action));
		}
	});
});