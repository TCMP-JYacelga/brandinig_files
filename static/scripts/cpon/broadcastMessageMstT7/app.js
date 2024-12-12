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
	appFolder : 'static/scripts/cpon/broadcastMessageMstT7/app',
	requires : ['GCP.view.BroadcastMessageView'],
	controllers : ['GCP.controller.BroadcastMessageController'],
	launch : function() {
		objBroadcastMsgView = Ext.create('GCP.view.BroadcastMessageView', {
					renderTo : 'broadcastMessageDiv'
				});
	}
});
function resizeContentPanel() {
	if( !Ext.isEmpty( objBroadcastMsgView ) )
	{
		objBroadcastMsgView.hide();
		objBroadcastMsgView.show();
		var filterButton=objBroadcastMsgView.down('button[itemId="filterButton"]');
		if(!Ext.isEmpty(filterButton)&&filterButton.panel)
			filterButton.panel.setFilterWidth();
	}
	
	if (!Ext.isEmpty(objBroadcastMsgView)) {
		objBroadcastMsgView.hide();
		objBroadcastMsgView.show();
	}
}
