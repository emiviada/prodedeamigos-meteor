if (Meteor.isClient) {
	// Template: tournament
	// Events
    Template.tournament.events({
		'click .nav-toggle-alt': function(e) {
            e.preventDefault();
            //get collapse content selector
            var _this = $(e.currentTarget),
                collapse_content_selector = _this.attr('href');

            //make the collapse content to be shown or hide
            var toggle_switch = _this;
            $(collapse_content_selector).slideToggle(function() {
                if (_this.css('display') == 'block') {
                    //change the button label to be 'Show'
                    toggle_switch.html('<span class="entypo-up-open"></span>');
                } else {
                    //change the button label to be 'Hide'
                    toggle_switch.html('<span class="entypo-down-open"></span>');
                }
            });

            return false;
        }
	});

    // Helpers
    Template.tournament.helpers({
        'games': function() {
            var tournamentId = this.tournamentId,
                fromDate = new Date().toLocaleString();

            return Games.find({ tournamentId: tournamentId, playDate: {$gte: new Date(fromDate)}}, {sort: {playDate: 1}});
        }
    });
}
