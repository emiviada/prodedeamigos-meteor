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
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

/*** ADMIN ***/
AdminConfig = {
    name: 'Prode de Amigos',
    adminEmails: ['emjovi@gmail.com'],
    roles: ['admin'],
    collections: {
        Teams: {}
    }
};
