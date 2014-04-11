define(["Renderer", "ContentManager", "TaskManager", "states/ActionState"], function (Renderer, ContentManager, TaskManager, ActionState) {
	var Event = function (name, parameters) {
		return {
			getName: function () { return name; },
			getParameters: function () { return parameters; }
		};
	};

	return new Class.create({
		initialize: function () {
			// stats
			this.container = document.createElement("div");
			document.body.appendChild(this.container);
			this.stats = new Stats();
			this.stats.domElement.style.position = "absolute";
			this.stats.domElement.style.top = '0px';
			this.stats.domElement.style.left = '610px';
			this.container.appendChild(this.stats.domElement);

			// create managers
			this.taskManager = new TaskManager(this);
			this.contentManager = new ContentManager(this);

			this.renderer = new Renderer(this);

			this.keyState = {};

			this.states = [];            
			this.changeState(new ActionState(this));

			this.events = [];
		},

		pushState: function (state) {
			this.states.push(state);
		},

		popState: function () {
			this.states.pop().dispose();
		},

		changeState: function (state) {
			while (this.states.length > 0) {
				this.states.pop().dispose();
			}

			this.pushState(state);
		},

		getCurrentState: function () {
			return (this.states.length > 0) ? this.states[this.states.length - 1] : null;
		},

		tick: function (ticks) {
			var state = this.getCurrentState();
			if (state !== null) {
				state.update(ticks);
				state.render();
			}

			// update managers
			this.taskManager.update(ticks);
		
			this.renderer.update(ticks);
			this.renderer.render();

			// after all
			this.handleEvents();

			this.stats.update();
		},

		handleEvent: function (name, parameters) {
			this.events.push(new Event(name, parameters));
		},

		handleEvents: function () {
			var state = this.getCurrentState();
			if (state !== null) {
				for (var i = 0; i < this.events.length; ++i) {
					state.handleEvent(this.events[i].getName(), this.events[i].getParameters());
				}
			}
			this.events.length = 0;
		}
	});
});