define(function () {
	return Class.create({
		initialize: function (material, x, y, width, height, textureWidth, textureHeight) {
			this.material = material;
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.textureWidth = textureWidth;
			this.textureHeight = textureHeight;
		},

		applyToMesh: function (mesh) {
			Utils.setMeshUv(mesh, this.x, this.y, this.width, this.height, this.textureWidth, this.textureHeight);
		}
	});
});
