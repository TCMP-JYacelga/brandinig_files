Ext.define('GCP.view.MsgCenterAlertView', {
	extend : 'Ext.panel.Panel',
	xtype : 'msgCenterAlertView',
	requires : ['GCP.view.MsgCenterAlertGroupView', 'Ext.tab.Panel','Ext.tab.Tab'],	
	autoHeight : true,
	initComponent : function() {
		var me = this;
		me.items = [{
						xtype : 'msgCenterAlertGroupView',
						width : 'auto'
					}];
		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});