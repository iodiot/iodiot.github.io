define(["Sprite"], function (Sprite) {
	return Class.create({
		initialize: function (core) {
			this.core = core;

			this.shaderMaterials = this.loadShaderMaterials();
			this.sprites = this.loadSprites("content/dungeon/atlas.json");
		},

		getShaderMaterial: function (name) {
			Utils.assert(name in this.shaderMaterials, "Can not get shader material named: " + name);

			return this.shaderMaterials[name];
		},

		getSprite: function (name) {
			Utils.assert(name in this.sprites, "Can not get sprite named: " + name);

			return this.sprites[name];
		},

		loadTexture: function (url) {
			var result = THREE.ImageUtils.loadTexture(url);

			result.minFilter = THREE.NearestFilter;
			result.magFilter = THREE.NearestFilter;

			return result;
		},

		loadShaderMaterials: function () {
			var result = {};

			// font material
			result["font"] = new THREE.ShaderMaterial({
				uniforms: {
					texture: { type: "t", value: this.loadTexture("content/font.png") }
				},
				vertexShader: Utils.loadFileAsText("shaders/sprite.vert"),
				fragmentShader: Utils.loadFileAsText("shaders/sprite.frag"),
				transparent: true
			});

			result["atlas_default"] = new THREE.ShaderMaterial({
				uniforms: {
					texture: { type: "t", value: this.loadTexture("content/dungeon/atlas.png") },
					normalMap: { type: "t", value: this.loadTexture("content/dungeon/atlas-normals.png") },
					lightPositions: { type: "v3v", value: [] },
					lightColors: { type: "v3v", value: [] }
				},
				vertexShader: Utils.loadFileAsText("shaders/default.vert"),
				fragmentShader: Utils.loadFileAsText("shaders/default.frag"),
				transparent: true
			});

			return result;
		},

		loadSprites: function (url) {
			var result = [];

			var text = Utils.loadFileAsText(url);

			var json = eval("(" + text + ')'); // TODO: unsafe

			var atlasWidth = json.width;
			var atlasHeight = json.height;

			Utils.assert(atlasWidth !== undefined, "Atlas width is not defined");
			Utils.assert(atlasHeight !== undefined, "Atlas height is not defined");

			for (var i = 0; i < json.sprites.length; ++i) {
				var sprite = json.sprites[i];

				result[sprite.name] = new Sprite(null, parseFloat(sprite.x), parseFloat(sprite.y), parseFloat(sprite.width), parseFloat(sprite.height), parseFloat(atlasWidth), parseFloat(atlasHeight));
			}

			return result;
		}
	});
});
