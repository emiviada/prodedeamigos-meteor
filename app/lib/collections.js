Teams = new Meteor.Collection('teams');
Tournaments = new Meteor.Collection('tournaments');
FantasyTournaments = new Meteor.Collection('fantasy_tournaments');
Games = new Meteor.Collection('games');
Predictions = new Meteor.Collection('predictions');
Invites = new Meteor.Collection('invites');
Messages = new Meteor.Collection('messages');
Images = new FS.Collection("images", {
  	stores: [new FS.Store.FileSystem("images", {})]
});

// Define Slugs
Tournaments.friendlySlugs('name');
FantasyTournaments.friendlySlugs('name');

Schemas = {};

// Team
Schemas.Team = new SimpleSchema({
    name: {
        type: String,
        label: 'Name'
    },
    alias: {
        type: String,
        label: 'Alias'
    },
    flag: {
	    type: String,
	    label: 'Flag',
	    optional: true,
	    defaultValue: 'dummyId',
	    autoform: {
	      	afFieldInput: {
		        type: 'fileUpload',
		        //type: 'cfs-file',
		        collection: 'Images',
		        label: 'Choose file',
		        previewTemplate: 'myFilePreview'
	        }
        }
    }
});
Teams.attachSchema(Schemas.Team);
Teams.helpers({
	flagImg: function() {
		return Images.findOne(this.flag);
	}
});

// Tournament
var teamOptionsKeys = [];
teamOptions = function () {
    var result = [];
    teams = Teams.find();
    teams.forEach(function (team) {
        result.push({label: team.alias, value: team._id});
        teamOptionsKeys.push(team._id);
    });
    return result;
}
Schemas.Tournament = new SimpleSchema({
	name: {
		type: String,
		label: 'Name'
	},
	active: {
		type: Boolean,
		label: 'Active'
	},
	teams: {
		type: [String],
		optional: true,
		autoform: {
			type: "select2",
			afFieldInput: {
				multiple: true,
				options: teamOptions,
	            allowedValues: teamOptionsKeys
			}
		}
	},
	"teams.$": {
		type: Schemas.Team
	}
});
Tournaments.attachSchema(Schemas.Tournament);

// Game
var tournamentOptionsKeys = [];
tournamentOptions = function () {
    var result = [];
    tournaments = Tournaments.find();
    tournaments.forEach(function (tournament) {
        result.push({label: tournament.name, value: tournament._id});
        tournamentOptionsKeys.push(tournament._id);
    });
    return result;
}
Schemas.Game = new SimpleSchema({
	tournamentId: {
		type: String,
		label: 'Tournament',
		autoform: {
			type: 'select',
			afFieldInput: {
				options: tournamentOptions,
				allowedValues: tournamentOptionsKeys
			}
		}
	},
	teamHomeId: {
		type: String,
		label: 'Team Home',
		autoform: {
			type: 'select2',
			options: teamOptions,
			allowedValues: teamOptionsKeys
		}
	},
	teamAwayId: {
		type: String,
		label: 'Team Away',
		autoform: {
			type: 'select2',
			options: teamOptions,
			allowedValues: teamOptionsKeys
		}
	},
	goalsHome: {
		type: Number,
		label: 'Goals Home',
		defaultValue: 0
	},
	goalsAway: {
		type: Number,
		label: 'Goals Away',
		defaultValue: 0
	},
	playDate: {
		type: Date,
		label: 'Play Date',
		autoform: {
		    afFieldInput: {
		        type: "bootstrap-datetimepicker"
		    }
	    }
	},
	finished: {
		type: Boolean,
		label: 'Finished'
	}
});
Games.attachSchema(Schemas.Game);
Games.helpers({
	tournament: function() {
		return Tournaments.findOne(this.tournamentId);
	},
	v: function() {
		var teamHome = Teams.findOne(this.teamHomeId),
			teamAway = Teams.findOne(this.teamAwayId);

		return teamHome.alias + ' v ' + teamAway.alias;
	},
	result: function() {
		return this.goalsHome + ' - ' + this.goalsAway;
	},
	teamHome: function() {
		return Teams.findOne(this.teamHomeId);
	},
	teamAway: function() {
		return Teams.findOne(this.teamAwayId);
	},
	prediction: function(fantasyTournamentId) {
		return Predictions.findOne({
			userId: Meteor.userId(),
			gameId: this._id,
			fantasyTournamentId: fantasyTournamentId
		});
	}
});

// FantasyTournament
memberOptions = function () {
    var result = [];
    members = Meteor.users.find();
    members.forEach(function (user) {
        result.push({label: user._id, value: user._id});
    });
    return result;
}
Schemas.FantasyTournament = new SimpleSchema({
	tournamentId: {
		type: String,
		label: 'Tournament',
		autoform: {
			readonly: true
		}
	},
	name: {
		type: String,
		label: 'Name'
	},
	pointsPerGame: {
		type: Number,
		label: 'Points per Game'
	},
	matchExact: {
		type: Boolean,
		label: 'Match Exact',
		optional: true
	},
	pointsPerExact: {
		type: Number,
		label: 'Points per Exact',
		optional: true,
	},
	ownerId: {
		type: String,
		label: 'Owner'
	},
	members: {
		type: [Object],
		optional: true,
		/*autoform: {
			type: "select2",
			afFieldInput: {
				multiple: true,
				options: memberOptions,
	            allowedValues: memberOptions
			}
		}*/
	},
	"members.$.userId": {
		type: String
	},
	"members.$.hits": {
		type: Number
	},
	"members.$.hitsExact": {
		type: Number
	},
	"members.$.points": {
		type: Number
	}
});
FantasyTournaments.attachSchema(Schemas.FantasyTournament);
FantasyTournaments.helpers({
	tournament: function() {
		return Tournaments.findOne(this.tournamentId);
	},
	owner: function() {
		return Meteor.users.findOne(this.ownerId);
	},
	notifyRemoval: function() {
		var ownerId = this.ownerId, membersIds = [], users
			ftName = this.name;

        this.members.forEach(function(m) {
            membersIds.push(m.userId);
        });
        users = Meteor.users.find({_id: {$in: membersIds}}, {fields: {'services': 1, 'emails': 1, 'profile': 1}});

        users.map(function(user) {
            if (user._id !== ownerId) {
            	Meteor.call('sendEmail',
                    user.getEmailAddress(),
                    "Prode de amigos <noreply@prodedeamigos.com>",
                    ftName + " ha sido eliminado!",
                    'tournament-removal',
                    {
                    	tournamentName: ftName
                    }
                );
            }
        });
	}
});

// Invites
Schemas.Invites = new SimpleSchema({
	fantasyTournamentId: {
		type: String,
		label: 'Fantasy Tournament',
		autoform: {
			readonly: true
		}
	},
	invitee: {
		type: String,
		label: 'Invitee'
	},
	referrerName: {
		type: String,
		label: 'Referrer'
	},
	token: {
		type: String,
		label: 'Token'
	},
	processed: {
		type: Boolean,
		label: 'Processed'
	}
});
Invites.attachSchema(Schemas.Invites);
Invites.helpers({
	fantasyTournament: function() {
		return FantasyTournaments.findOne(this.fantasyTournamentId);
	}
});

// Predictions
Predictions.helpers({
	user: function() {
		return Meteor.users.findOne(this.userId);
	},
	game: function() {
		return Games.findOne(this.gameId);
	},
	getGame: function() {
		var game = Games.findOne(this.gameId);

		if (game) {
			return game.v();
		} else {
			return this.gameId;
		}
	},
	fantasyTournament: function() {
		return FantasyTournaments.findOne(this.fantasyTournamentId);
	}
});

// Messages
Messages.helpers({
	getAuthor: function() {
		return Meteor.users.findOne({_id: this.authorId});
	}
});
