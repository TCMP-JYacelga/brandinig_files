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
	appFolder : 'static/scripts/commonmst/liquidityReferenceTime/app',
	requires : ['GCP.view.LiquidityRefTimeView'],
	controllers : ['GCP.controller.LiquidityReferenceTimeMstController'],
	launch : function() {
		objProfileView = Ext.create('GCP.view.LiquidityRefTimeView', {
					renderTo : 'liquidityRefTimeMstView'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
	}
}
