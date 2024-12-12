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
	appFolder : 'static/scripts/cpon/counterParty/app',
	requires : ['GCP.view.CounterPartyView'],
	controllers : ['GCP.controller.CounterPartyController'],
	launch : function() {
		objProfileView = Ext.create('GCP.view.CounterPartyView', {
					renderTo : 'counterPartySetupDiv'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
	}
}
