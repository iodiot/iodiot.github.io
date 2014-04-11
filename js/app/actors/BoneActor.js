define(["actors/Actor", "Animation"], function (Actor, Animation) {
	return Class.create(Actor, {
		initialize: function ($super, core, x, z) {
			$super(core, x, 2 + Utils.getRandomInt(-2, 1) * 0.5, z);

			this.ignoresPhysics = true;
			this.scale = Utils.getRandomInt(11, 15) * 0.1;

			// set velocity components
			this.vx = Utils.getRandomInt(-5, 5) * 0.03;
			this.vz = Utils.getRandomInt(-5, 5) * 0.025;
			this.vy = Utils.getRandomInt(1, 2) * 0.07;

			this.animation = new Animation(Utils.getRandomInt(2, 5) * 0.1);
			var firstFrame = Utils.getRandomInt(1, 5);
			for (var i = 0; i <= 4; ++i) {
				this.animation.addSprite(this.core.contentManager.getSprite("bone_" + ((firstFrame + (this.vx >= 0 ? i : 4 - i)) % 5 + 1).toString()))
			}

			this.addMesh();
			this.updateMesh();
		},

		update: function ($super, ticks) {
			$super(ticks);

			if (this.y > 0) { 
				this.animation.update(ticks);

				// add velocity
				this.x += this.vx;
				this.y += this.vy;
				this.z += this.vz; 

				// add gravity
				this.vy -= 0.005;	

				if (this.vy > Config.CorridorHeight - 1) {
					this.vy *= -1;
				}

				if (Math.abs(this.x) > Config.CorridorWidth/2 - 1) { 
					this.vx *= -1;
				}
			}
		},

		addMesh: function () {
			this.mesh = Utils.createPlaneMesh(this.scale, this.scale, this.core.contentManager.getShaderMaterial("atlas_default"), true);
			this.core.renderer.addMesh(this.mesh);
		},

		updateMesh: function () {
			this.animation.applyToMesh(this.mesh);
			this.mesh.position.set(this.x, this.y + 0.5, this.z);
		},

		removeMesh: function () {
			this.core.renderer.removeMesh(this.mesh);
		}
	});
});