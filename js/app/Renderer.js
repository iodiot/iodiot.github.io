define(["Sprite"], function (Sprite) {
	return Class.create({
		initialize: function (core) {
			this.core = core;

			this.scene = new THREE.Scene();
			this.sceneOrtho = new THREE.Scene();

			this.camera = new THREE.PerspectiveCamera(70, Config.ScreenWidth / Config.ScreenHeight, 0.1, 1000);
			this.cameraOrtho = new THREE.OrthographicCamera(-Config.HalfScreenWidth, Config.HalfScreenWidth, Config.HalfScreenHeight, -Config.HalfScreenHeight, 1, 10);
			this.cameraOrtho.position.z = 1.0;

			this.renderer = new THREE.WebGLRenderer();
			this.renderer.autoClear = false;

			this.renderer.setSize(Config.ScreenWidth, Config.ScreenHeight);
			this.core.container.appendChild(this.renderer.domElement);

			this.camera.position = new THREE.Vector3(0, 5, -5);
			this.camera.lookAt(new THREE.Vector3(0, 4, 0));

			this.renderer.setClearColor(0x181b21, 1);

			// lights
			this.lightFreeSlots = [];
			this.lightPositions = [];
			this.lightColors = [];
			for (var i = 0; i < Config.MaxLights; ++i) {
				this.lightFreeSlots.push(true);
				this.lightPositions.push(new THREE.Vector3(0, 0, 0));
				this.lightColors.push(new THREE.Vector3(0, 0, 0));
			}

			// bind to shader material lights
			this.core.contentManager.getShaderMaterial("atlas_default").uniforms["lightPositions"].value = this.lightPositions;
			this.core.contentManager.getShaderMaterial("atlas_default").uniforms["lightColors"].value = this.lightColors;
		},

		addLight: function (position, color) {
			// find free light slot
			var n = -1;
			for (var i = 0; i < this.lightFreeSlots.length; ++i) {
				if (this.lightFreeSlots[i]) {
					n = i;
					break;
				}
			}

			if (n === -1) { return -1; }

			this.lightFreeSlots[n] = false;
			this.lightPositions[n] = position.clone();
			this.lightColors[n] = color.clone();

			return n;
		},

		updateLightPosition: function (lightId, position) {
			if (lightId < 0 || lightId >= Config.MaxLights) { return; }

			this.lightPositions[lightId] = position.clone();
		},

		removeLight: function (lightId) {
			if (lightId < 0 || lightId >= Config.MaxLights) { return; }

			this.lightFreeSlots[lightId] = true;
			this.lightPositions[lightId] = new THREE.Vector3(0, 0, 0);
			this.lightColors[lightId] = new THREE.Vector3(0, 0, 0);
		},

		update: function (ticks) {
		},

		render: function () {
			this.renderer.clear();
			this.renderer.render(this.scene, this.camera);
			this.renderer.clearDepth();
			this.renderer.render(this.sceneOrtho, this.cameraOrtho);

			// clear sprite meshes
			var allChildren = this.sceneOrtho.children;
			while (allChildren.length > 0) {
				var lastObject = allChildren[allChildren.length - 1];
				this.sceneOrtho.remove(lastObject);
			}
		},

		renderSprite: function (sprite, x, y, scale, tint) { 	
			var mesh = new THREE.Mesh(new THREE.PlaneGeometry(sprite.width * scale, sprite.height * scale), sprite.material);

			mesh.material.uniforms.tint = { type: "v3", value: tint };  // TODO: implement tint feature

			sprite.applyToMesh(mesh);

			// set screen position
			mesh.position.set(
				 -Config.HalfScreenWidth + x + Math.floor(sprite.width / 2) * scale - 3,    // TODO: remove magic number
				Config.HalfScreenHeight  - y - Math.floor(sprite.height / 2) * scale,
				0
			);

			this.sceneOrtho.add(mesh);
		},

		renderText: function (text, x, y, scale, tint, widthOnly) {
			var CharWidth = 7;
			var CharHeight = 11;
			var Chars = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ.,;:abcdefghijklmnopqrstuvwxyz-+*=?!/\\()[]{}^@$&%#'\"~ ";
			var CharsInRow = 10;

			 if (widthOnly === undefined) { widthOnly = false; }

			var Cursor = widthOnly ? 0 : x;
			for (var i = 0; i < text.length; ++i) {
				var n = Chars.indexOf(text[i]);
				if (n === -1) { continue; }

				if (!widthOnly) {
					var sprite = new Sprite(
						this.core.contentManager.getShaderMaterial("font"),
						(n % CharsInRow) * CharWidth, Math.floor(n / CharsInRow) * CharHeight, CharWidth, CharHeight, 70, 99
					);
				}

				// Hardcoded glyph position

				var xShift = 0;
				if ("jl".indexOf(text[i]) != -1)
					xShift = -1;

				xShift *= scale;
				Cursor += xShift;

				if (!widthOnly) {
					var yShift = 0;
					if ("j".indexOf(text[i]) != -1)
						yShift = 1;
					if ("pqy".indexOf(text[i]) != -1)
						yShift = 3;
					yShift *= scale;
					this.renderSprite(sprite, Cursor, y + yShift, scale, tint);
				}
				
				// Hardcoded glyph width
				xShift = CharWidth;
				if (".,:;!'i".indexOf(text[i]) != -1)
					xShift = 4;
				if ("()[]lj".indexOf(text[i]) != -1)
					xShift = 5;
				if ("{}&tf".indexOf(text[i]) != -1)
					xShift = 6;
				xShift -= 1;
				xShift *= scale;
				Cursor += xShift;
			}
			return Cursor + 1 * scale;
		},

		getTextWidth: function (text, scale) {
			return this.renderText(text, 0, 0, scale, 0, true)
		},

		addMesh: function (mesh) {
			this.scene.add(mesh);
		},

		removeMesh: function (mesh) {
			this.scene.remove(mesh);
		}
	});
});
