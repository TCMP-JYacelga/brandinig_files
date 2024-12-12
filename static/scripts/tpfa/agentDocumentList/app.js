var objAgentDocumentListView = null;
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
	appFolder : 'static/scripts/tpfa/agentDocumentList/app',
	requires : ['GCP.view.AgentDocumentListView'],
	controllers : ['GCP.controller.AgentDocumentListController'],
	launch : function() {
		objAgentDocumentListView = Ext.create('GCP.view.AgentDocumentListView', {
			renderTo : 'agentDocumentListDiv'
		});
		
	}
});

function resizeContentPanel() {
	if (!Ext.isEmpty(objAgentDocumentListView)) {
		objAgentDocumentListView.hide();
		objAgentDocumentListView.show();
	}
}