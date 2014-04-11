define(function () {
	return Class.create({
		initialize: function (speed, repeat) {
			this.sprites = [];
			this.timeLine = 0;
			this.speed = speed;
			this.repeat = repeat === undefined ? true : repeat;

			this.wasPlayedOnce = false;
		},

		addSprite: function (sprite) {
			this.sprites.push(sprite);
		},

		update: function (ticks) {
			if (this.repeat === false && this.wasPlayedOnce === true) { return; }

			this.timeLine += this.speed; 
			if (Math.floor(this.timeLine) >= this.sprites.length) {
				if (this.repeat === true) { 
					this.timeLine = 0; 
				}

				this.wasPlayedOnce = true;
			}
		},

		getCurrentFrame: function() {
		   return Math.min(this.sprites.length - 1, Math.floor(this.timeLine)); 
		},

		getCurrentSprite: function () {
			return this.sprites[this.getCurrentFrame()];
		},

		applyToMesh: function (mesh) {
			this.getCurrentSprite().applyToMesh(mesh);
		}
	});
});
