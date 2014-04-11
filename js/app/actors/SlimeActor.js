define(["actors/EnemyActor", "actors/FireballActor", "Animation", "actors/PlayerActor"], function (EnemyActor, FireballActor, Animation, PlayerActor) {
	return Class.create(EnemyActor, {
		initialize: function ($super, core, x, z, state) {
			$super(core, x, 5.65, z);

			// dimensions
			this.dx = 1;
			this.dy = 1;
			this.dz = 1;

			this.SlimeActor = require("actors/SlimeActor");

			this.is = {
				Idle: 0,
				Drop: 1,
				Ball: 2,
				Droplet: 3,
				Small: 4
			};
			this.state = (state === undefined) ? this.is.Idle : state;

			this.scale = 4;
			if (this.state == this.is.Ball) {
				this.y = 3.0;
				this.vy = -0.1;
				this.gravity = .02;
				this.bouncedOnce = false;
			}
			if (this.state == this.is.Droplet) {
				this.y = 4.7;
				this.scale = 2;
				this.vy = Utils.getRandomInt(15, 20) * 0.01;
				this.gravity = .015;
			}
			this.dropped = false;

			// animations
			this.animations = {};
			
			this.animations[this.is.Idle] = new Animation(0.15);
			this.animations[this.is.Idle].addSprite(this.core.contentManager.getSprite("slime_1"));
			this.animations[this.is.Idle].addSprite(this.core.contentManager.getSprite("slime_1"));
			this.animations[this.is.Idle].addSprite(this.core.contentManager.getSprite("slime_2"));
			this.animations[this.is.Idle].addSprite(this.core.contentManager.getSprite("slime_3"));
			this.animations[this.is.Idle].addSprite(this.core.contentManager.getSprite("slime_3"));
			this.animations[this.is.Idle].addSprite(this.core.contentManager.getSprite("slime_2"));
			
			this.animations[this.is.Drop] = new Animation(0.15, false);
			for (var i = 1; i <= 4; ++i) {
				this.animations[this.is.Drop].addSprite(this.core.contentManager.getSprite("slime_drop_" + i.toString()));
			}

			this.animations[this.is.Small] = new Animation(0.1);
			for (var i = 1; i <= 2; ++i) {
				this.animations[this.is.Small].addSprite(this.core.contentManager.getSprite("slime_small_" + i.toString()));
			}

			this.animations[this.is.Ball] = new Animation(0.1);
			for (var i = 1; i <= 2; ++i) {
				this.animations[this.is.Ball].addSprite(this.core.contentManager.getSprite("slime_ball_" + i.toString()));
			}

			this.animations[this.is.Droplet] = new Animation(0.1);
			for (var i = 1; i <= 2; ++i) {
				this.animations[this.is.Droplet].addSprite(this.core.contentManager.getSprite("slime_ball_small_" + i.toString()));
			}

			this.centerX = this.x;

			this.addMesh();
			//this.updateMesh();
		},

		update: function ($super, ticks) {
			$super(ticks);

			if (this.died) { return; }
			this.currentAnimation = this.animations[this.state];

			switch (this.state) {
			case this.is.Idle:
				this.z -= 0.2;
				var distanceToPlayer = this.z - this.core.getCurrentState().player.z;
				if (distanceToPlayer < 25 && distanceToPlayer > 9) {
					if (Utils.getRandomInt(0, 50) == 0) //Debug
						this.state = this.is.Drop;
				}
				break;
			case this.is.Drop:
				if ((this.currentAnimation.getCurrentFrame() === 2) && !this.dropped)  {
					this.core.handleEvent("add actor", { actor: new this.SlimeActor(this.core, this.x, this.z, this.is.Droplet) });
					this.core.handleEvent("add actor", { actor: new this.SlimeActor(this.core, this.x, this.z, this.is.Ball) });
					this.dropped = true;
				}
				if (this.currentAnimation.wasPlayedOnce) {
					this.state = this.is.Small;
				}
				break;
			case this.is.Ball: 
				if (this.bouncedOnce) {
					this.z -= 0.15;
				} else {
					this.z -= 0.05;
				}
				this.y += this.vy;
				this.vy -= this.gravity;
				if (this.y <= 0.28) {
					this.bouncedOnce = true;
					this.y = 0.28;
					this.vy *= -0.8;
				}
				break;
			case this.is.Droplet:
				this.y += this.vy;
				this.vy -= this.gravity;
				if (this.y <= 0.2) {
					this.y = 0.2;
					this.vy *= -0.3;
				}
				break;
			}

			this.currentAnimation.update(ticks);
		},

		updateMesh: function ($super) {
			$super();

			this.currentAnimation.applyToMesh(this.mesh);
		},

		onCollision: function ($super, actor) {
			$super();

			if (actor instanceof PlayerActor) {
				
			}

			if (this.died) { return; }
			if (this.state == this.is.Idle || this.state == this.is.Ball || this.state == this.is.Drop)
			if (actor instanceof FireballActor) {
				this.died = true;
				this.core.handleEvent("add actor", { actor: new this.SlimeActor(this.core, this.x, this.z, this.is.Droplet) });
				this.core.handleEvent("remove actor", { actor: this }); 
			}
		}
	});
});