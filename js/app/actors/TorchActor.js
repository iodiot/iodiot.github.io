define(["actors/Actor", "Sprite", "Animation"], function (Actor, Sprite, Animation) {
	return Class.create(Actor, {
		initialize: function ($super, core, x, y, z) {
			$super(core, x, y, z);

			// dimensions
			this.dx = 1;
			this.dy = 1;
			this.dz = 1;

			this.lightPos = new THREE.Vector3(this.x, this.y - 1, this.z);

			this.scale = 0.15;

			this.animation = new Animation(0.2);
			for (var i = 1; i <= 7; ++i) {
				this.animation.addSprite(this.core.contentManager.getSprite("fire_" + i.toString()));
			}

			this.centerX = this.x;

			this.addMesh();
			this.updateMesh();
		},

		addMesh: function ($super) {
			$super();

			this.mesh = Utils.createPlaneMesh(8 * this.scale, 18 * this.scale, this.core.contentManager.getShaderMaterial("atlas_default"), true);
			this.core.renderer.addMesh(this.mesh);

			this.lightId = this.core.renderer.addLight(this.lightPos, new THREE.Vector3(0.8, 0.4, 0.1));
		},

		updateMesh: function ($super) {
			$super();

			this.lightPos.x += Math.sin(this.ticksAlive * 0.4) * 0.3; 
			this.lightPos.y += Math.sin(this.ticksAlive * 0.3) * 0.2; 
			this.lightPos.z += Math.cos(this.ticksAlive * 0.2) * 0.1; 
			this.core.renderer.updateLightPosition(this.lightId, this.lightPos);

			if (this.core.renderer.lightColors[this.lightId] != undefined) {
				this.core.renderer.lightColors[this.lightId].x += Math.sin(this.ticksAlive * 0.5) * 0.1;
				this.core.renderer.lightColors[this.lightId].y += Math.sin(this.ticksAlive * 0.5) * 0.05; 
			}

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

			this.animation.update(ticks);

		}
	});
});
