// Helpers for Meteor.Users collecion
Meteor.users.helpers({
  	getFullName: function() {
        var name = 'unknown';

        if (this) {
            if (this.profile) {
                name = this.profile.name;
            } else if (this.emails.length) {
                name = this.emails[0].address;
            }
        }

        return name;
    },
    getName: function() {
        var name = null;

        if (this && this.profile) {
            name = (this.profile.name)? this.profile.name : this.profile.firstname + ' ' + this.profile.lastname;
        }

        return name;
    },
    getFirstName: function() {
        var firstname = '';

        if (this) {
            if (this.profile) {
                if (this.services.facebook) {
                    firstname = this.services.facebook.first_name;
                } else if (this.services.twitter) {
                    firstname = this.profile.name;
                } else {
                    firstname = this.profile.firstname;
                }
            }
        }

        return firstname;
    },
    getLastName: function() {
        var lastname = '';

        if (this) {
            if (this.profile) {
                if (this.services.facebook) {
                    lastname = this.services.facebook.last_name;
                } else if (this.services.twitter) {
                    lastname = this.profile.name;
                } else {
                    lastname = this.profile.lastname;
                }
            }
        }

        return lastname;
    },
    getEmailAddress: function() {
        var email = 'unknown';

        if (this) {
            if (this.profile) {
                if (this.services.facebook) {
                	email = this.services.facebook.email;
                } else if (this.emails && this.emails.length) {
                	email = this.emails[0].address;
                }
            } else if (this.emails && this.emails.length) {
                email = this.emails[0].address;
            }
        }

        return email;
    },
    getProfilePicture: function() {
        var pic = '/images/empty-profile.png';

        if (this && this.services) {
            if (this.services.facebook) {
                pic = 'http://graph.facebook.com/' + this.services.facebook.id + '/picture/?type=large';
            } else if (this.services.twitter) {
                pic = this.services.twitter.profile_image_url;
            }
        }

        if (this.profile && this.profile.picture) {
        	pic = Images.findOne(this.profile.picture);
        }

        if (typeof(pic) == 'object') {
        	pic = pic.url();
        }

        return pic;
    },
    getSupportedTeam: function() {
    	var team = {name: null, alias: null};

    	if (this.profile.supportedTeam) {
    		team = Teams.findOne({_id: this.profile.supportedTeam});
    	}

    	return team;
    },
    isFacebookUser: function() {
    	return (this.services.facebook)? true : false
    },
    isTwitterUser: function() {
    	return (this.services.twitter)? true : false
    },
    isNormalUser: function() {
    	return (!this.isFacebookUser() && !this.isTwitterUser())? true : false;
    }
});
