Meteor.startup(function () {
  	// code to run on server at startup
  	// Mailgun config
	process.env.MAIL_URL = 'smtp://postmaster%40sandbox6b83885842b74272972f9778159da9ee.mailgun.org:delfin11@smtp.mailgun.org:587';
});
