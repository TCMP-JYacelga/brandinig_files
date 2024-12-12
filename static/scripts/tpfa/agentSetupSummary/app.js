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
	appFolder : 'static/scripts/tpfa/agentSetupSummary/app',
	requires : ['GCP.view.AgentSetupSummaryView'],
	controllers : ['GCP.controller.AgentSetupSummaryController'],
	launch : function() {
		objProfileView = Ext.create('GCP.view.AgentSetupSummaryView', {
					renderTo : 'agentSetupSummaryDiv'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
	}
}