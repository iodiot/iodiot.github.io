define(function () {
	return Class.create({
		initialize: function (x, y, z, dx, dy, dz) {
			this.x = x;
			this.y = y;
			this.z = z;
			this.dx = dx;
			this.dy = dy;
			this.dz = dz;
		},
		
		intersects: function (other) {
			return !(this.x + this.dx <= other.x || other.x + other.dx <= this.x 
							|| this.y + this.dy <= other.y || other.y + other.dy <= this.y
							|| this.z + this.dz <= other.z || other.z + other.dz <= this.z);
		}
	});
});
