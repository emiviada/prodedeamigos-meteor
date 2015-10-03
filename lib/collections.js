Teams = new Meteor.Collection('teams');
Tournaments = new Meteor.Collection('tournaments');
FantasyTournaments = new Meteor.Collection('fantasy_tournaments');

// Define Slugs
Tournaments.friendlySlugs('name');
FantasyTournaments.friendlySlugs('name');

Schemas = {};

Schemas.Team = new SimpleSchema({
    name: {
        type: String,
        label: 'Name'
    },
    alias: {
        type: String,
        label: 'Alias'
    }
});
Teams.attachSchema(Schemas.Team)

Schemas.Tournament = new SimpleSchema({
	name: {
		type: String,
		label: 'Name'
	},
	active: {
		type: Boolean,
		label: 'Active'
	}
});
Tournaments.attachSchema(Schemas.Tournament);
