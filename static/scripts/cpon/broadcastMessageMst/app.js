var objBroadcastMsgView = null;
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
	appFolder : 'static/scripts/cpon/broadcastMessageMst/app',
	requires : ['GCP.view.BroadcastMessageView'],
	controllers : ['GCP.controller.BroadcastMessageController'],
	launch : function() {
		objBroadcastMsgView = Ext.create('GCP.view.BroadcastMessageView', {
					renderTo : 'broadcastMessageDiv'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objBroadcastMsgView)) {
		objBroadcastMsgView.hide();
		objBroadcastMsgView.show();
	}
}
