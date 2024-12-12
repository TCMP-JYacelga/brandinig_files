Ext.define('Cashweb.controller.AccountSettingsController', {
	extend: 'Ext.app.Controller',
	refs : [],
			 init: function(application) {
			 	this.getDashboardAccounts(application);
			 },
			 getDashboardAccounts: function(application) {
			 	Ext.Ajax.request({
									url : './getUserDasboardAccounts.rest',
									success : function(response) {
										obj = Ext.decode(response.responseText);
										globalDashboardAccountsStore = Ext.create('Cashweb.store.AccountStore');
										if(!Ext.isEmpty(obj.dashboardAccounts))
											globalDashboardAccountsStore.loadData(obj.dashboardAccounts);
										globalDashboardAccountsStore.config.dashboardAccountViewstate = obj.dashboardAccountViewstate;
										application.getController('PortletController');
									},
									failure : function(response) {
										var loadingDiv = Ext.get("loadingDiv");
										if(!Ext.isEmpty(loadingDiv) || loadingDiv != null)
										{
											loadingDiv.remove();
										}
										var errorMsg = null;
										if (response.timedout) {
											errorMsg = label_map.timeoutmsg;
										} else if (response.aborted) {
											errorMsg = label_map.abortmsg;
										} else {
											errorMsg = response.statusText;
										}
										Ext.MessageBox.show({
											title : 'Error',
											msg : errorMsg,
											buttons : Ext.MessageBox.OK,
											icon : Ext.MessageBox.ERROR
										});	
									}
								});
			 }
});