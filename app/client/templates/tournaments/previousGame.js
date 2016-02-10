// Template: previousGame

// onRendered
Template.previousGame.onRendered(function() {
	// Tooltips
    $('[data-toggle=tooltip]').tooltip();
});

// Events
Template.previousGame.events({
	'mousedown .btn-success, click .btn-success': function(e) {
		e.preventDefault();
        Modal.show('predictionsModal', {
        	'ftid': $('.games').attr('data-ftid'),
        	'gameId': $(e.currentTarget).attr('data-gameId')
        });
	}
});
