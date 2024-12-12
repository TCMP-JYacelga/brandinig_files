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
	name : 'CPON',
	appFolder : 'static/scripts/cpon/clientSetupMst/bankReports/app',
	requires : [ 'CPON.view.BankReportsGridView' ],
	controllers : [ 'CPON.controller.BankReportsController' ],
	launch : function() {
		objbankReportsGridView = Ext.create('CPON.view.BankReportsGridView', {
			renderTo : 'tabs-bankreports'
		});
		bankReportTempGrid=objbankReportsGridView.down('grid[itemId="bankReportGrid"]');
	}
});

function resizeContentPanel() {
	if (!Ext.isEmpty(objbankReportsGridView)) {
		console.log("fff");
		objbankReportsGridView.hide();
		objbankReportsGridView.show();
	}
}

$(document).on('hideShowSidebar',function(event,actionName){
	resizeContentPanel();
});	
