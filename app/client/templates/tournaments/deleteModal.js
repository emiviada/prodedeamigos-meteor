// Template: deleteModal

// Events
Template.deleteModal.events({
	'click .btn-save': function(e) {
		var slug = Router.current().params.slug,
			currentUser = Meteor.userId(),
			ft;

        ft = FantasyTournaments.findOne({ slug: slug, ownerId: currentUser});
        if (ft) {
        	// Notify members that the tournament is being removed
        	ft.notifyRemoval();
        	Meteor.call('removeFantasyTournament', ft._id, function(error) {
	        	if (!error) {
	        		Router.go('home');
	                FlashMessages.sendInfo("El torneo ha sido eliminado exitosamente.");
	        	}
	        });
        }
        Modal.hide('deleteModal');
	}
});
