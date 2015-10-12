if (Meteor.isClient) {
	// Template: editTournament
	Template.editTournament.events({
		'mousedown .delete, click .delete': function(e) {
			e.preventDefault();
            var id = this._id,
                confirm = window.confirm('Deseas eliminar este torneo?');
            if (confirm) {
                Meteor.call('removeFantasyTournament', id, function(error) {
                	if (!error) {
                		Router.go('home');
                	}
                });
            }
		}
	});
}
