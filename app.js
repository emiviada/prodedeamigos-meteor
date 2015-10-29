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

    // Function to check which dropdown's option is selected
    UI.registerHelper('selected', function(a, b) {
        var selected = (a == b)? 'selected' : '';
        return selected;
    });
}
