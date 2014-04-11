define(["uis/Ui"], function(Ui) {
	return Class.create(Ui, {
		initialize: function ($super, core) {
	 		$super(core);
		},

		update: function ($super, ticks) {
			$super(ticks);
		},

		render: function ($super) {
			$super();
		}
	});
});