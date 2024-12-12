var objbankReportsGridView = null;
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
	appFolder : 'static/scripts/commonmst/userCategoryT7/app',
	//	appFolder : 'app',
	requires : [ 'GCP.view.BankReportsGridView' ],
	controllers : [ 'GCP.controller.BankReportsController' ],
	launch : function() {
		objbankReportsGridView = Ext.create('GCP.view.BankReportsGridView', {
			renderTo : 'tabs-bankReports'
		});
	}
});
