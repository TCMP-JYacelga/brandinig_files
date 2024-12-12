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
	appFolder : 'static/scripts/interfacing/interfaceMapsummary',
	//appFolder : 'app',
	requires : ['GCP.view.InterfaceMapSummaryView'],
	controllers : ['GCP.controller.InterfaceMapSummaryController'],
	launch : function() {
		objProfileView = Ext.create('GCP.view.InterfaceMapSummaryView', {
					renderTo : 'interfaceMapSummaryView'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
	}
}
