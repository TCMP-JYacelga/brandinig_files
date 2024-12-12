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
	appFolder : 'static/scripts/cpon/profileMst/app',
	requires : ['GCP.view.PrfMstView'],
	controllers : ['GCP.controller.PrfMstController'],
	launch : function() {
		objProfileView = Ext.create('GCP.view.PrfMstView', {
					renderTo : 'profileDiv'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
	}
}
