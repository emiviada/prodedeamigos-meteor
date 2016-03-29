// Template: game
// onCreated
Template.game.onCreated(function() {
	var ft, ftid;

	if (Router.current().route.getName() === 'dashboard') {
		ft = Template.parentData(1);
	} else {
		ft = Template.parentData(1);
		if (!ft) {
			ft = Template.parentData(2);
		}
	}

	this.data.prediction = (this.data.prediction(ft._id))?
		this.data.prediction(ft._id) : {_id: null, goalsHome: 0, goalsAway: 0};
});

// onRendered
Template.game.onRendered(function () {
	var playDate = new Date(this.data.playDate),
		limit = new Date(playDate.getTime() - 30*60000); // Rest 30 minutes

	$(".countdown." + this.data._id).countdown(limit, function(event) {
	    $(this).text(
	        event.strftime('%-d dias %Hh %Mm %Ss')
	    );
    }).on('finish.countdown', function() {
    	var _this = $(this),
    		row = _this.closest('.row'),
    		btn = row.find('.btn'),
    		selectHome = row.find('[name="goalsHome"]'),
    		selectAway = row.find('[name="goalsAway"]');

		btn.addClass('disabled').removeClass('btn-success');
		row.addClass('expired');
		selectHome.attr('disabled', 'disabled');
		selectAway.attr('disabled', 'disabled');
    });
});

// Helpers
Template.game.helpers({
	'goalsOptions': function() {
		return [{'val': 0}, {'val': 1}, {'val': 2}, {'val': 3}, {'val': 4}, {'val': 5}, {'val': 6},
			{'val': 7}, {'val': 8}, {'val': 9}];
	},
	'mode': function() {
		return (this.prediction._id)? 'edit' : '';
	}
});

// Events
Template.game.events({
	'click .btn-success': function(e, template) {
		e.preventDefault();
		var _this = $(e.currentTarget),
			row = _this.closest('.row'),
			prediction = (_this.hasClass('edit'))? template.data.prediction : {},
			method = (_this.hasClass('edit'))? 'editPrediction' : 'createPrediction';

		if (_this.hasClass('disabled')) {
			return;
		}

		prediction.goalsHome = row.find('[name="goalsHome"]').val();
		prediction.goalsAway = row.find('[name="goalsAway"]').val();
		if (!_this.hasClass('edit')) { // New one
			var ftid = _this.closest('.games').attr('data-ftid');
			prediction.fantasyTournamentId = ftid;
			prediction.userId = Meteor.userId();
			prediction.gameId = template.data._id;
		}

		Meteor.call(method, prediction, function(error, result) {
			if (!error) {
				row.addClass('highlight');
				_this.addClass('edit');
				setTimeout(function() { row.removeClass('highlight'); }, 1000);
				ga('send', {
				  	hitType: 'event',
				  	eventCategory: 'Prediction',
				  	eventAction: 'done',
				  	eventLabel: Meteor.userId()
				});
			}
		});
	}
});
