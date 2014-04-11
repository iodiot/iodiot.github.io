require(["Core"], function (Core) {
	var core = new Core();

	var onKeyDown = function(e) {
		e.preventDefault();
		if (core.keyState[e.keyCode || e.which]) return;

		core.keyState[e.keyCode || e.which] = true;
		core.handleEvent("key down", {key: e.keyCode});
	};

	var onKeyUp = function(e) {
		core.keyState[e.keyCode || e.which] = false;

		core.handleEvent("key up", {key: e.keyCode});
	};

	document.addEventListener("keydown", onKeyDown, true);
	document.addEventListener("keyup", onKeyUp, true);

	var ticks = 0;

	var tick = function() {
		requestAnimationFrame(tick);

		core.tick(ticks);

		ticks += 1;
	};

	tick();
});