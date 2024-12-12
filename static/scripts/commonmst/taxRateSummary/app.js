var objProfileView = null;
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
	appFolder : 'static/scripts/commonmst/taxRateSummary/app',
	requires : ['GCP.view.TaxRateMstSummaryView'],
	controllers : ['GCP.controller.TaxRateMstController'],
	launch : function() {
		objProfileView = Ext.create('GCP.view.TaxRateMstSummaryView', {
					renderTo : 'taxRateMstDiv'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
	}
}
