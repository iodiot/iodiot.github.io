define(["actors/Actor", "actors/FireballActor", "Animation"], function (Actor, FireballActor, Animation) {
return Class.create(Actor, {
		initialize: function ($super, core) {
			$super(core, 0, 1.5, 0);

			// dimensions
			this.dx = 1;
			this.dy = 2;
			this.dz = 1;

			this.scale = 3;
			this.vx = 0.0;

			this.vy = 0;

			// animation
			this.animations = {};
			this.animations["run"] = new Animation(0.25);
			for (var i = 1; i <= 4; ++i) {
					this.animations["run"].addSprite(this.core.contentManager.getSprite("player_run_" + i.toString()));
			}
			this.animations["run"].addSprite(this.core.contentManager.getSprite("player_run_3"));
			this.animations["run"].addSprite(this.core.contentManager.getSprite("player_run_2"));

			this.animations["jump"] = new Animation(0, false);
			this.animations["jump"].addSprite(this.core.contentManager.getSprite("player_jump"));

			this.currentAnimation = this.animations["run"];

			this.addMesh();
			this.updateMesh();
		},

		update: function ($super, ticks) {
			$super(ticks);

			this.z += 0.3;

			this.y += this.vy;
			this.y = Math.max(this.y, 1.5);
			if (this.isJumping()) {
				this.vy -= 0.01;
			} else {
				this.vy = 0;
				this.currentAnimation = this.animations["run"];
			}

			this.processInput();
			this.currentAnimation.update(ticks);
		},

		addMesh: function ($super) {
			$super();

			this.mesh = Utils.createPlaneMesh(this.scale, this.scale, this.core.contentManager.getShaderMaterial("atlas_default"), true);
			this.core.renderer.addMesh(this.mesh);
		},

		updateMesh: function ($super) {
			$super();

			this.currentAnimation.applyToMesh(this.mesh);

			Utils.moveMesh(this.mesh, this.x, this.y, this.z);
		},

		removeMesh: function ($super) {
			this.core.renderer.removeMesh(this.mesh);
		},

		isJumping: function () {
			return this.y > 1.5;
		},

		processInput: function () {
			var speed = 0.4;
			var acc = 0.1;
			var fric = 0.7;

			// left
			if (this.core.keyState[37]) {
				this.vx += acc;
			}

			// right
			if (this.core.keyState[39]) {
				this.vx -= acc;
			}

			this.vx *= fric;
			this.vx = Math.max(this.vx, -speed);
			this.vx = Math.min(this.vx, speed);
			
			this.x += this.vx;
			this.x = Math.max(this.x, -5.0);
			this.x = Math.min(this.x, 5.0);
		},

		onCollision: function ($super, actor) {
			$super(actor);

			if (actor instanceof FireballActor) { return; }
		},

		handleEvent: function ($super, event, parameters) {
			$super(event, parameters);

			if (event === "key down") {
				if (parameters.key === 'Z'.charCodeAt(0)) {
					this.core.handleEvent("add actor", { actor: new FireballActor(this.core, this.x, this.y + 0.5, this.z + 1) });
				}

				if (parameters.key === 'X'.charCodeAt(0) && !this.isJumping()) {
					this.vy = 0.27;
					this.currentAnimation = this.animations["jump"];
				}
			}
		}
	});
});