define(["actors/Actor", "Sprite", "Animation", "actors/PlayerActor"], function (Actor, Sprite, Animation, PlayerActor) {
	return Class.create(Actor, {
		initialize: function ($super, core, x, y, z) {
			$super(core, x, y, z);

			// dimensions
			this.dx = 1;
			this.dy = 1;
			this.dz = 1;

			this.scale = 2;

			this.animation = new Animation(0.2);
			for (var i = 1; i <= 4; ++i) {
				this.animation.addSprite(this.core.contentManager.getSprite("fireball_" + i.toString()));
			}

			this.centerX = this.x;

			this.addMesh();
			this.updateMesh();
		},

		addMesh: function ($super) {
			$super();

			this.mesh = Utils.createPlaneMesh(this.scale, this.scale, this.core.contentManager.getShaderMaterial("atlas_default"), true);
			this.core.renderer.addMesh(this.mesh);

			this.lightId = this.core.renderer.addLight(this.mesh.position, new THREE.Vector3(1, 0.6, 0.3));
		},

		updateMesh: function ($super) {
			$super();

			this.core.renderer.updateLightPosition(this.lightId, this.mesh.position);

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

			this.z += 0.75;
			this.x = this.centerX + Math.sin(ticks * 0.5) * 0.1;

			// this.z += Math.sin((this.ticksAlive - 30) / 10) * .2;
			// this.x -= Math.cos(this.ticksAlive / 10) * .2;
			// this.z += 0.2;			

			// this.x = this.core.getCurrentState().player.x + Math.cos(this.ticksAlive * 0.1) * 2;
			// this.z = this.core.getCurrentState().player.z - 1;
			// this.y = 2.7 + Math.abs(Math.sin(this.ticksAlive * 0.1)) * 2

			this.animation.update(ticks);

			if (this.ticksAlive > 75) {
				this.core.handleEvent("remove actor", { actor: this });   
			}

		},

		onCollision: function ($super, actor) {
			$super();

			PlayerActor = require("actors/PlayerActor");
			HandActor = require("actors/HandActor");
			if (actor instanceof PlayerActor) { return; }
			if (actor instanceof HandActor) { return; }

		//	this.core.handleEvent("remove actor", { actor: this });
		}
	});
});
