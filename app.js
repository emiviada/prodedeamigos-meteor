if (Meteor.isClient) {
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
            }
        }
    });

    // Function to get user's name
    userFullname = function() {
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
    };
}

/*** ADMIN ***/
AdminConfig = {
    name: 'Prode de Amigos',
    roles: ['admin'],
    collections: {
        Teams: {}
    }
};
