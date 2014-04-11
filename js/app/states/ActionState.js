define(["states/State", "actors/Actor", "ActorFactory", "actors/PlayerActor", "states/GameOverState", "actors/SkeletonActor", "actors/BatActor", "actors/HandActor", "actors/SlimeActor", "actors/TorchActor", "actors/SawActor"], 
	function (State, Actor, ActorFactory, PlayerActor, GameOverState, SkeletonActor, BatActor, HandActor, SlimeActor, TorchActor, SawActor) {
	var CorridorSegment = function (core, n) {
		var material = core.contentManager.getShaderMaterial("atlas_default");

		// floor
		var floor = Utils.createPlaneMesh(Config.CorridorWidth, Config.CorridorWidth, material);
		floor.rotation.set(-Math.PI/2, 0, Math.PI);
		core.contentManager.getSprite("floor").applyToMesh(floor);
		floor.position.set(0, 0, n * Config.CorridorWidth);
		core.renderer.addMesh(floor);

		// ceiling
		var ceiling = Utils.createPlaneMesh(Config.CorridorWidth, Config.CorridorWidth, material);  
		ceiling.rotation.set(Math.PI/2, 0, 0);
		core.contentManager.getSprite("ceiling").applyToMesh(ceiling);
		ceiling.position.set(0, Config.CorridorHeight, n * Config.CorridorWidth);
		core.renderer.addMesh(ceiling);

		// left wall
		var leftWall = Utils.createPlaneMesh(Config.CorridorWidth, Config.CorridorWidth/2, material);
		leftWall.rotation.set(0, -Math.PI/2, 0);
		core.contentManager.getSprite("wall_" + Utils.getRandomInt(1, 1).toString()).applyToMesh(leftWall);
		leftWall.position.set(Config.CorridorWidth/2, Config.CorridorWidth/4, n * Config.CorridorWidth);
		core.renderer.addMesh(leftWall);

		// right wall
		var rightWall = Utils.createPlaneMesh(Config.CorridorWidth, Config.CorridorWidth/2, material);
		rightWall.rotation.set(0, Math.PI/2, 0);
		core.contentManager.getSprite("wall_" + Utils.getRandomInt(1, 1).toString()).applyToMesh(rightWall);
		rightWall.position.set(-Config.CorridorWidth/2, Config.CorridorWidth/4, n * Config.CorridorWidth);
		core.renderer.addMesh(rightWall);

		return {    
			getFloor: function () { return floor; },
			
			getCeiling: function () { return ceiling; },
			
			getLeftWall: function () { return leftWall; },
			
			getRightWall: function () { return rightWall; },
			
			shiftMeshes: function (steps) {
				var d = steps * Config.CorridorWidth; 

				this.getFloor().position.z += d;
				this.getCeiling().position.z += d;
				this.getLeftWall().position.z += d;
				this.getRightWall().position.z += d;
			},

			dispose: function () {
				core.renderer.removeMesh(this.getFloor());
				core.renderer.removeMesh(this.getCeiling());
				core.renderer.removeMesh(this.getLeftWall());
				core.renderer.removeMesh(this.getRightWall());
			}
		};
	};

	return Class.create(State, {
		initialize: function($super, core) {
			$super(core);

			this.actors = [];

			this.player = new PlayerActor(this.core);
			this.actors.push(this.player);

			this.actorsToAdd = [];
			this.actorsToRemove = [];

			this.progress = 0;

			this.currentCorridor = [];
			this.nextCorridor = [];

			this.buildCorridor();
		},

		buildCorridor: function() {
			for (var i = 0; i < 10; ++i) {
				var section = new CorridorSegment(this.core, i);
				if (i < 5) {
					this.currentCorridor.push(section);
				} else { 
					this.nextCorridor.push(section);
				}
			}
		},

		checkCollisions: function(actor) {
			for (var i = 0; i < this.actors.length; ++i) {
				var other = this.actors[i];

				if (actor !== other && !other.ignoresPhysics && actor.getBoundingBox().intersects(other.getBoundingBox())) {
					actor.onCollision(other);
					other.onCollision(actor);
				}
		}
		},

		removeOffScreenActors: function() {
			var newActors = [];

			for (var i = 0; i < this.actors.length; ++i) {
				if (this.player.z - this.actors[i].z > 5) {
					this.core.handleEvent("remove actor", { actor: this.actors[i] });
				}
			}
		},

		processActors: function (ticks) {
			if (ticks % 100 === 0) {
				this.removeOffScreenActors();
			}

			// add new actors
			for (var i = 0; i < this.actorsToAdd.length; ++i) {
				this.actors.push(this.actorsToAdd[i]);
			}
			this.actorsToAdd.length = 0;

			// remove old actors
			for (var i = 0; i < this.actorsToRemove.length; ++i) {
				var n = this.actors.indexOf(this.actorsToRemove[i]);
				if (n > -1) { 
					this.actors[n].removeMesh(); 
					this.actors.splice(n, 1); 
				}
			}
			this.actorsToRemove.length = 0;

			// update actors
			for (var i = 0; i < this.actors.length; ++i) {
				this.actors[i].update(ticks);
			}

			// check collisions
			for (var i = 0; i < this.actors.length; ++i) {
				if (!this.actors[i].ignoresPhysics) { 
					this.checkCollisions(this.actors[i]);
				}
			}

			// update meshes
			this.player.updateMesh();
			for (var i = 0; i < this.actors.length; ++i) {
				this.actors[i].updateMesh();
			}
		},

		update: function($super, ticks) {
			$super(ticks);

			this.processActors(ticks);

			if (ticks % 50 === 0) {
				this.progress += 5;
			}

			if (this.player.z - this.nextCorridor[0].getFloor().position.z > 5) {
				for (var i = 0; i < this.currentCorridor.length; ++i) {
					this.currentCorridor[i].shiftMeshes(this.nextCorridor.length + this.currentCorridor.length);
				}

				var t = this.currentCorridor;
				this.currentCorridor = this.nextCorridor;
				this.nextCorridor = t;
			}

			// =============================

			if (true) { // Release behavior

				// Add torches
				if (ticks % 101 == 0) {
					this.core.handleEvent("add actor", { actor: new TorchActor(this.core, (ticks % 2 == 0) ? 6.8 : -6.8, 5, this.player.z + 70) });
				} 

				// Add a flock of bats
				if (Utils.getRandomInt(0, 500) === 0) {
					for (var i = 0; i < Utils.getRandomInt(4,10); i++) {
						this.core.handleEvent("add actor", { actor: new BatActor(this.core, Utils.getRandomInt(-5, 5), this.player.z + 80 + i * 3) });
					}
				} 

				// Add a skeleton
				if (Utils.getRandomInt(0, 50) === 0) {
					this.core.handleEvent("add actor", { actor: new SkeletonActor(this.core, Utils.getRandomInt(-5, 5), this.player.z + Utils.getRandomInt(80, 85)) });
				} 

				// Add a slime
				if (Utils.getRandomInt(0, 150) === 0) {
					this.core.handleEvent("add actor", { actor: new SlimeActor(this.core, Utils.getRandomInt(-5, 5), this.player.z + 80) });
				} 

				// Add a forest of hands
				if (Utils.getRandomInt(0, 700) === 0) {
				   var distance = Utils.getRandomInt(80, 100); 
				   for (var i = 0; i < Utils.getRandomInt(0,10); i++) {
						this.core.handleEvent("add actor", { actor: new HandActor(this.core, 0, this.player.z + distance + i * 2) });
				   }
				} 

				// Saw wave trap
				if (Utils.getRandomInt(0, 700) === 0) {
					for (var i = 0; i < 5; i++) {
						this.core.handleEvent("add actor", { 
							actor: new SawActor(this.core, 0, 0, this.player.z + 80 + i * 4.5, 
								{type: "slide", size: 4, speed: 0.05, offset: -i}
							) 
						});
					}
				} 	

				// Saw zigzag trap
				if (Utils.getRandomInt(0, 700) === 0) {
					for (var i = 0; i < 4; i++) {
						this.core.handleEvent("add actor", { 
							actor: new SawActor(this.core, -5 + i * 3.5, 0, this.player.z + 80, 
								{type: "static", size: 4, speed: 0}
							) 
						});
					}
				} 

				// Saw fence trap
				if (Utils.getRandomInt(0, 700) === 0) {
					for (var i = 0; i < 4; i++) {
						this.core.handleEvent("add actor", { 
							actor: new SawActor(this.core, (i % 2 == 0) ? 7 : -7, 0, this.player.z + 120 + i * 10, 
								{type: "static", size: 12, speed: 0.05}
							) 
						});
					}
				} 	

			} else { // Debug behavior

				// Add torches
				if (ticks % 101 == 0) {
					this.core.handleEvent("add actor", { actor: new TorchActor(this.core, (ticks % 2 == 0) ? 6.8 : -6.8, 5, this.player.z + 70) });
				} 

				if (ticks % 300 == 0) {
					for (var i = 0; i < 5; i++) {
						this.core.handleEvent("add actor", { 
							actor: new SawActor(this.core, 0, 0, this.player.z + 80 + i * 4.5, 
								{type: "slide", size: 4, speed: 0.05, offset: -i}
							) 
						});
					}
				} 	

				if (ticks % 300 == 0) {
					for (var i = 0; i < 4; i++) {
						this.core.handleEvent("add actor", { 
							actor: new SawActor(this.core, -5 + i * 3.5, 0, this.player.z + 80, 
								{type: "static", size: 4, speed: 0}
							) 
						});
					}
				} 

				if (ticks % 300 == 0) {
					for (var i = 0; i < 4; i++) {
						this.core.handleEvent("add actor", { 
							actor: new SawActor(this.core, (i % 2 == 0) ? 7 : -7, 0, this.player.z + 120 + i * 10, 
								{type: "static", size: 12, speed: 0.05}
							) 
						});
					}
				} 	
		
			}


			// =============================

			// set camera
			this.core.renderer.camera.position.z = this.player.z - 5.3;
			this.core.renderer.camera.position.x = this.player.x * 0.4;
			this.core.renderer.camera.rotation.z = Math.PI + this.player.x * 0.005;
			this.core.renderer.camera.position.y = this.player.y + 2.5 - (this.player.y - 2.5) * 0.3;
		},

		render: function($super) {
			$super();

			// progress
			this.core.renderer.renderText(this.progress.toString() + "m", 10, 10, 5, new THREE.Vector3(1, 1, 1));
		},

		dispose: function($super) {
			// dispose actors
			for (var i = 0; i < this.actors.length; ++i) {
				this.actors[i].removeMesh();
			}
			this.actors.length = 0;

			// dispose corridor sections
			for (var i = 0; i < this.currentCorridor.length; ++i) {
				this.currentCorridor[i].dispose();
			}
			this.currentCorridor.length = 0;

			for (var i = 0; i < this.nextCorridor.length; ++i) {
				this.nextCorridor[i].dispose();
			}    
			this.nextCorridor.length = 0;
		},

		handleEvent: function (event, parameters) {
			for (var i = 0; i < this.actors.length; ++i) {
				this.actors[i].handleEvent(event, parameters);
			}

			if (event === "game over") {
				this.core.changeState(new GameOverState(this.core, { progress: this.progress }));
			}

			if (event === "add actor") {
				this.actorsToAdd.push(parameters.actor);
			}

			if (event === "remove actor") {
				this.actorsToRemove.push(parameters.actor);
			}
		}
	});
});