if (Meteor.isClient) {
    // Subscriptions
    Meteor.subscribe('userData');

    // Set validator defaults
    $.validator.setDefaults({
        rules: {
            password: {
                minlength: 6
            }
        },
        messages: {
            email: {
                required: 'Este campo es requerido',
                email: 'Por favor, ingresa un email valido'
            },
            password: {
                required: 'Este campo es requerido',
                minlength: 'Por favor, ingresa al menos {0} caracteres'
            },
            confirm: {
                required: 'Este campo es requerido',
                minlength: 'Por favor, ingresa al menos {0} caracteres',
                equalTo: 'Los passwords no coindiden'
            },
            tournament: {
                required: 'Este campo es requerido'
            },
            fname: {
                required: 'Este campo es requerido',
                minlength: 'Por favor, ingresa al menos {0} caracteres'
            }
        }
    });

    // Function to get user's name
    UI.registerHelper("userFullname", function() {
        var currentUser = Meteor.user(),
            name = 'unknown';

        if (currentUser) {
            if (currentUser.profile) {
                name = currentUser.profile.name;
            } else if (currentUser.emails.length) {
                name = currentUser.emails[0].address;
            }
        }

        return name;
    });
    // Function to get user's name
    UI.registerHelper("getProfilePicture", function(userId) {
        var user = Meteor.users.findOne(userId),
            pic = '/images/empty-profile.png';

        if (user && user.services) {
            if (user.services.facebook) {
                pic = 'http://graph.facebook.com/' + user.services.facebook.id + '/picture/?type=large';
            } else if (user.services.twitter) {
                pic = user.services.twitter.profile_image_url;
            }
        }

        return pic;
    });
    // Function to check which dropdown's option is selected
    UI.registerHelper('selected', function(a, b) {
        var selected = (a == b)? 'selected' : '';
        return selected;
    });
}

/*** ADMIN ***/
AdminConfig = {
    name: 'Prode de Amigos',
    roles: ['admin'],
    collections: {
        Teams: {
            icon: 'futbol-o',
            color: 'green',
            tableColumns: [
                { label: 'Name', name: 'name' }
            ],
            routes: {
                'new': {
                    waitOn: function () { return Meteor.subscribe('images'); }
                },
                'view': {
                    waitOn: function () { return Meteor.subscribe('images'); }
                },
                'edit': {
                    waitOn: function () { return Meteor.subscribe('images'); }
                }
            }
        },
        Tournaments: {
            icon: 'trophy',
            color: 'yellow',
            tableColumns: [
                { label: 'Name', name: 'name' },
                { label: 'Active', name: 'active' }
            ],
            routes: {
                'new': {
                    waitOn: function () { return Meteor.subscribe('teams'); }
                },
                'edit': {
                    waitOn: function () { return Meteor.subscribe('teams'); }
                }
            }
        }
    }
};
