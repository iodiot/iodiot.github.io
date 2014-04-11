define(["actors/EnemyActor", "actors/FireballActor", "Animation", "actors/BoneActor"], function (EnemyActor, FireballActor, Animation, BoneActor) {
	return Class.create(EnemyActor, {
		initialize: function ($super, core, x, z) {
			$super(core, x, 4 + Utils.getRandomInt(0, 20) * 0.1, z);

			// dimensions
			this.dx = 2;
			this.dy = 2;
			this.dz = 2;

			this.scale = 4;

			this.seed = Utils.getRandomInt(0, 1000);

			// animations
			this.animations = {};
			this.animations["move"] = new Animation(0.3);
			for (var i = 1; i <= 6; ++i) {
				this.animations["move"].addSprite(this.core.contentManager.getSprite("bat_" + i.toString()));
			}

			this.currentAnimation = this.animations["move"];

			this.centerX = this.x;

			this.addMesh();
			this.updateMesh();
		},

		update: function ($super, ticks) {
			$super(ticks);

			if (!this.died) { 
				this.z -= 0.3;
				this.x = this.centerX + Math.sin(this.seed + ticks * 0.06); 
				//this.y = 3 + Math.cos(this.seed + ticks * 0.1) * 1.5; 
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
				this.core.handleEvent("remove actor", { actor: this }); 
			}
		}
	});
});