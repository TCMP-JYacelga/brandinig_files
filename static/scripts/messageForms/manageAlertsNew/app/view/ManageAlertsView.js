Ext.define('GCP.view.ManageAlertsView', {
	extend : 'Ext.container.Container',
	xtype : 'manageAlertsView',
	requires : ['GCP.view.ManageAlertsGridGroupView','Ext.tab.Panel','Ext.tab.Tab'],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
	
		me.items = [
				{
					xtype : 'manageAlertsGridGroupView',
					width : 'auto'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});