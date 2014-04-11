define(["actors/Actor", "Sprite", "Animation"], function (Actor, Sprite, Animation) {
	return Class.create(Actor, {
		initialize: function ($super, core, x, y, z, options) {
			$super(core, x, y, z);

			this.options = options;

			// dimensions
			this.dx = 1;
			this.dy = 1;
			this.dz = 0.2;

			this.scale = {"slide": 4, "static": options.size}[options.type];

			this.dir = 1;

			this.animation = new Animation(0.4);
			for (var i = 1; i <= 3; ++i) {
				this.animation.addSprite(this.core.contentManager.getSprite("saw_" + i.toString()));
			}

			this.centerX = this.x;

			this.addMesh();
			this.updateMesh();
		},

		addMesh: function ($super) {
			$super();

			this.mesh = Utils.createPlaneMesh(this.scale, this.scale, this.core.contentManager.getShaderMaterial("atlas_default"), true);
			this.core.renderer.addMesh(this.mesh);
		},

		updateMesh: function ($super) {
			$super();

			this.animation.applyToMesh(this.mesh);
			this.mesh.position.set(this.x, this.y, this.z);
		},

		removeMesh: function ($super) {
			$super();

			this.core.renderer.removeMesh(this.mesh);

			this.core.renderer.removeLight(this.lightId);
		},

		update: function ($super, ticks) {
			$super(ticks);

			switch (this.options.type) {
				case "slide":
					this.x = Math.sin((ticks + this.options.offset * 10) * this.options.speed) * 4.5;
					break;
				case "static":
					this.x += Math.sin(ticks * this.options.speed) * 0.1;
					break;
			}

			this.animation.update(ticks);
		},

		onCollision: function ($super, actor) {
			$super();
		}
	});
});
