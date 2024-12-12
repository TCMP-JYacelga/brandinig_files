var objSummaryView = null;

Ext.Loader.setConfig({
	enabled : true,
	disableCaching : false,
	setPath : {
		'Ext' : 'static/js/extjs4.2.1/src',
		'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
	}
});

Ext.application({
	name : 'GCP',
	appFolder : 'static/scripts/fsc/loanRepaymentCenterBNR/app',
	requires : ['Ext.ux.gcp.PreferencesHandler', 'Ext.ux.gcp.GroupView',
	            'GCP.view.loanRepaymentView'],
	controllers : [ 'GCP.controller.loanRepaymentController' ],
	launch : function() {
		objSummaryView = Ext.create('GCP.view.loanRepaymentView', {
			renderTo : 'loanRepaymentSummaryDiv'
		});
	}
});