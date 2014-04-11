define(["actors/EnemyActor", "Animation", "actors/FireballActor", "actors/BoneActor"], function (EnemyActor, Animation, FireballActor, BoneActor) {
	return Class.create(EnemyActor, {
		initialize: function ($super, core, x, z) {
			$super(core, x, 2.5, z);

			// dimensions
			this.dx = 2;
			this.dy = 4;
			this.dz = 2;

			this.scale = 7;
			this.lift = 2.5;

			// animations
			this.animations = {};
			this.animations["move"] = new Animation(0.1);
			for (var i = 1; i <= 4; ++i) {
				this.animations["move"].addSprite(this.core.contentManager.getSprite("skeleton_walk_" + i.toString()));
			}
			this.animations["move"].addSprite(this.core.contentManager.getSprite("skeleton_walk_3"));
			this.animations["move"].addSprite(this.core.contentManager.getSprite("skeleton_walk_2"));

			this.animations["die"] = new Animation(0.25, false);
			for (var i = 1; i <= 7; ++i) {
				this.animations["die"].addSprite(this.core.contentManager.getSprite("skeleton_die_" + i.toString()));
			}

			this.currentAnimation = this.animations["move"];

			this.addMesh();
			this.updateMesh();
		},

		update: function ($super, ticks) {
			$super(ticks);

			if (!this.died) { 
				this.z -= 0.1; 
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

				for (var i = 0; i < Utils.getRandomInt(2, 4); ++i) {
					this.core.handleEvent("add actor", { actor: new BoneActor(this.core, this.x, this.z + Utils.getRandomInt(-10, 10) * 0.1) });
				}
			}
		}

	});
});