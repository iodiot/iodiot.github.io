define(["actors/EnemyActor", "actors/FireballActor", "Animation"], function (EnemyActor, FireballActor, Animation) {
	return Class.create(EnemyActor, {
		initialize: function ($super, core, x, z) {
			$super(core, x, Utils.getRandomInt(3, 10) * 0.5, z);

			// dimensions
			this.dx = 1;
			this.dy = 1;
			this.dz = 1;

			this.scale = 4;

			this.speed = Utils.getRandomInt(10, 20) * 0.01;
			this.x = -9;

			// animations
			this.animations = {};
			this.animations["twitch"] = new Animation(Utils.getRandomInt(8, 12) * 0.01);
			var firstFrame = Utils.getRandomInt(1, 4);
			for (var i = 1; i <= 4; ++i) {
				this.animations["twitch"].addSprite(this.core.contentManager.getSprite("hand_" + ((firstFrame + i) % 4 + 1).toString()));
			}

			this.animations["hit"] = new Animation(0.1, false);
			for (var i = 5; i <= 9; ++i) {
				this.animations["hit"].addSprite(this.core.contentManager.getSprite("hand_" + i.toString()));
			}
			
			this.animations["die"] = new Animation(0.3, false);
			for (var i = 5; i <= 8; ++i) {
				this.animations["die"].addSprite(this.core.contentManager.getSprite("hand_" + i.toString()));
			}

			this.currentAnimation = this.animations["twitch"];

			this.addMesh();
			this.updateMesh();
		},

		update: function ($super, ticks) {
			$super(ticks);

			if (!this.died) { 
				if (this.x < -5.5) {
					this.x += this.speed;
				}
			}

			this.currentAnimation.update(ticks);
		},

		updateMesh: function ($super) {
			$super();

			this.currentAnimation.applyToMesh(this.mesh);
		},

		onCollision: function ($super, actor) {
			$super();

			if (actor instanceof FireballActor) {
				this.currentAnimation = this.animations["die"];
				this.ignoresPhysics = true;
				this.died = true;
			}
		}
	});
});