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
	appFolder : 'static/scripts/commonmst/typeCodeCategory/app',
	requires : ['GCP.view.TypeCodeCategoryMstView'],
	controllers : ['GCP.controller.TypeCodeCategoryMstController'],
	init : function(application) {
				
			},
	launch : function() {
		objProfileView = Ext.create('GCP.view.TypeCodeCategoryMstView', {
					renderTo : 'typeCodeCategorysDiv'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
	}
}
