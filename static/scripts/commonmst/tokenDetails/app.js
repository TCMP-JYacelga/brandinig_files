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
	appFolder : 'static/scripts/commonmst/tokenDetails/app',
	requires : ['GCP.view.TokenDetailView'],
	controllers : ['GCP.controller.TokenDetailController'],
	launch : function() {
		objProfileView = Ext.create('GCP.view.TokenDetailView', {
					renderTo : 'tokenDetailDiv'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
	}
}
