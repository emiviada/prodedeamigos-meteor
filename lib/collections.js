Teams = new Meteor.Collection('teams');
Tournaments = new Meteor.Collection('tournaments');
FantasyTournaments = new Meteor.Collection('fantasy_tournaments');
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
Teams.attachSchema(Schemas.Team)

// Tournament
teamOptions = function () {
    var result = [];
    teams = Teams.find();
    teams.forEach(function (team) {
        result.push({label: team.alias, value: team._id});
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
	            allowedValues: teamOptions
			}
		}
	},
	"teams.$": {
		type: Schemas.Team
	}
});
Tournaments.attachSchema(Schemas.Tournament);
