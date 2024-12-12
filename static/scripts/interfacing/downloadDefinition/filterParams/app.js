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
	appFolder : 'static/scripts/interfacing/downloadDefinition/filterParams',
	requires : ['GCP.view.FilterParamsView'],
	controllers : ['GCP.controller.FilterParamsController'],
	launch : function() {
		objProfileView = Ext.create('GCP.view.FilterParamsView', {
					renderTo : 'advanceFilterParamsDiv'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
	}
}
