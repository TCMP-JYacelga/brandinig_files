Ext.define('GCP.view.StopCheckRequestPopup', {
	extend : 'Ext.window.Window',
	xtype : 'stopCheckRequestPopup',
	requires : ['GCP.view.StopCheckRequestEntry'],
	width : 500,
	height : 360,
	draggable : true,
	modal : true,		
	initComponent : function() {
		var me = this;
		var stopRequestCreate = null;
		this.title = getLabel('lblcreatestopchkreq', 'Create Stop Payment');
		stopRequestCreate = Ext.create('Ext.panel.Panel', {
			items : [{
						xtype : 'stopCheckRequestEntry'						
					}]											
		});	
		me.items = [stopRequestCreate];		
		this.callParent(arguments);
	}
});