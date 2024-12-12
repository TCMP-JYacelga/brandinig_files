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
	appFolder : 'static/scripts/fsc/LoanRepayStandingOrder/app',
	requires : ['Ext.ux.gcp.PreferencesHandler', 'Ext.ux.gcp.GroupView', 'GCP.view.LoanRepayStandingOrderView'],
	controllers : ['GCP.controller.LoanRepayStandingOrderController'],
	launch : function() {
		objSummaryView = Ext.create('GCP.view.LoanRepayStandingOrderView', {
			renderTo : 'loanRepayStandingOrderSummaryDiv'
		});
	}
});