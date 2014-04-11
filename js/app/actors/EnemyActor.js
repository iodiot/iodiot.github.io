define(["actors/Actor"], function (Actor) {
	return Class.create(Actor, {
		initialize: function ($super, core, x, y, z) {
			$super(core, x, y, z);

			this.died = false;
		},

		addMesh: function ($super) {
			$super();

			this.mesh = Utils.createPlaneMesh(this.scale, this.scale, this.core.contentManager.getShaderMaterial("atlas_default"), true);
			this.core.renderer.addMesh(this.mesh);
		},

		updateMesh: function ($super) {
			$super();

			this.mesh.position.set(this.x, this.y, this.z);
		},

		removeMesh: function ($super) {
			$super();

			this.core.renderer.removeMesh(this.mesh);
		}
	});
 });