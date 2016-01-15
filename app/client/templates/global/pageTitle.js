// Template: pageTitle
// Helpers
Template.pageTitle.helpers({
	'title': function() {
		var breadcrumb = Breadcrumb.getAll();
		return breadcrumb[breadcrumb.length-1].title;
	}
});
