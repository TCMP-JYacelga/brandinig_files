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
	appFolder : 'static/scripts/commonmst/typeCodeSummary/app',
	requires : ['GCP.view.TypeCodeMstView'],
	controllers : ['GCP.controller.TypeCodeMstController'],
	init : function(application) {
				
			},
	launch : function() {
		objProfileView = Ext.create('GCP.view.TypeCodeMstView', {
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
