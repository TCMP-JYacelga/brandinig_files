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
	appFolder : 'static/scripts/btr/incomingWires/app',
	//appFolder : 'app',
	requires : ['GCP.view.IncomingWiresView'],
	controllers : ['GCP.controller.IncomingWiresViewController'],
	launch : function() {
		objProfileView = Ext.create('GCP.view.IncomingWiresView', {
					renderTo : 'incomingWiresDiv'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
	}
}
