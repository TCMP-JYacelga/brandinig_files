var objAgentAccountView = null;
var objAgentSubAccountView = null;
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
	appFolder : 'static/scripts/tpfa/agentAccountList/app',
	requires : ['GCP.view.AgentSubAccountView','GCP.view.AgentAccountView'],
	controllers : ['GCP.controller.AgentAccountMasterController'],
	launch : function() {
		objAgentAccountView = Ext.create('GCP.view.AgentAccountView', {
			renderTo : 'defineAgentAccountsDiv'
		});
		objAgentSubAccountView = Ext.create('GCP.view.AgentSubAccountView', {
			renderTo : 'defineAgentSubAccountsDiv'
		});
		
	}
});

function resizeContentPanel() {
	if (!Ext.isEmpty(objAgentAccountView)) {
		objAgentAccountView.hide();
		objAgentAccountView.show();
	}
	if (!Ext.isEmpty(objAgentSubAccountView)) {
		objAgentSubAccountView.hide();
		objAgentSubAccountView.show();
	}
}