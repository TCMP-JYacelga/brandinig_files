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
	appFolder : 'static/scripts/btr/investmentCenter/app',
	//appFolder : 'app',
	requires : ['GCP.view.InvestmentCenterView'],
	controllers : ['GCP.controller.InvestmentCenterController'],
	launch : function() {
		objProfileView = Ext.create('GCP.view.InvestmentCenterView', {
					renderTo : 'investmentCenterDiv'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
	}
}