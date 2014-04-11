define(["BoundingBox"], function (BoundingBox) {
	return Class.create({
		initialize: function (core, x, y, z) {
			this.core = core;

			Utils.assert(this.x === undefined, "Argument is missing in Actor::initialize");
			Utils.assert(this.y === undefined, "Argument is missing in Actor::initialize");
			Utils.assert(this.z === undefined, "Argument is missing in Actor::initialize");

			this.x = x || 0;
			this.y = y || 0;
			this.z = z || 0;

			// dimensions
			this.dx = 0;
			this.dy = 0;
			this.dz = 0

			// other properties
			this.scale = 1;
			this.ticksAlive = 0;
			this.ignoresPhysics = false;
		},

		update: function (ticks) {
			this.ticksAlive += 1;
		},

		addMesh: function () {

		},

		updateMesh: function () {

		},

		removeMesh: function () {

		},

		getBoundingBox: function () {
			return new BoundingBox(this.x - this.dx/2, this.y - this.dy/2, this.z - this.dz/2, this.dx, this.dy, this.dz);
		},

		onCollision: function (actor) {
			
		},

		handleEvent: function (event, parameters) {

		}
	});
});