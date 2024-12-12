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
	appFolder : 'static/scripts/cpon/securityProfileMst/app',
	requires : ['GCP.view.SecurityProfileView'],
	controllers : ['GCP.controller.SecurityProfileController'],
	launch : function() {
		objProfileView = Ext.create('GCP.view.SecurityProfileView', {
					renderTo : 'securityProfileDiv'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
	}
}
