Teams = new Meteor.Collection('teams');

Schemas = {};

Schemas.Team = new SimpleSchema({
    name: {
        type: String,
        label: "Name"
    },
    alias: {
        type: String,
        label: "Alias"
    }
});
Teams.attachSchema(Schemas.Team)
