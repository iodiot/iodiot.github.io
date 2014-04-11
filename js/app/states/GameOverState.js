define(["states/State", "states/ActionState"], function (State, ActionState) {
	return Class.create(State, {
		initialize: function ($super, core, parameters) {
			$super(core);

			this.ticks = 0;
			this.progress = parameters.progress || -1;
		},

		update: function ($super, ticks) {
			$super(ticks);

			this.ticks++;
		},

		render: function ($super) {
			$super();

			var width = this.core.renderer.getTextWidth("GAME OVER", 8);
			this.core.renderer.renderText("GAME OVER", Config.HalfScreenWidth - width / 2, 50, 8, new THREE.Vector3(1, 1, 1));


			var DividerText = Array(Math.abs(~~(Math.sin(this.ticks / 50) * 4)) + 2).join('^');
			width = this.core.renderer.getTextWidth(DividerText, 5);
			this.core.renderer.renderText(DividerText, Config.HalfScreenWidth - width / 2, 145, 5, new THREE.Vector3(1, 1, 1));

			var ScoreText = "You've ran " + this.progress.toString() + "m";
			width = this.core.renderer.getTextWidth(ScoreText, 5);
			this.core.renderer.renderText(ScoreText, Config.HalfScreenWidth - width / 2, 200, 5, new THREE.Vector3(1, 1, 1));
		},

		handleEvent: function ($super, event, parameters) {
			$super(event, parameters);

			if (event === "key up") {
				var key = parameters.key || -1;
				if (key === 32) {
					ActionState = require("states/ActionState");	// TODO: remove this hack (problem with circular references)
					this.core.changeState(new ActionState(this.core));
				}
			}
		}
	});
});