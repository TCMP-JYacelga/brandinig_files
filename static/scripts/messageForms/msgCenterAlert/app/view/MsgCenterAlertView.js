Ext.define('GCP.view.MsgCenterAlertView', {
	extend : 'Ext.panel.Panel',
	xtype : 'msgCenterAlertView',
	requires : ['GCP.view.MsgCenterAlertGridView','GCP.view.MsgCenterAlertFilterView','GCP.view.MsgCenterAlertGridInformationView',
	            'GCP.view.InboxAlertTitleView', 'GCP.view.MsgCenterAlertTitleView','Ext.tab.Panel','Ext.tab.Tab'],
	width : '100%',
	autoHeight : true,
	initComponent : function() {
		var me = this;
		me.items = [{
						xtype : 'inboxAlertTitleView',
						width : '100%',
						cls : 'ux_no-border ux_largepaddingtb ux_panel-background'
					},
					{
						xtype : 'msgCenterAlertFilterView',
						width : '100%',
						title : getLabel('filterBy', 'Filter By '),
						collapsible : true,
						collapsed: filterPanelCollapsed
					}, 
					{
						xtype : 'msgCenterAlertGridInformationView'
					},
					{
						xtype : 'msgCenterAlertGridView',
						width : '100%',
						parent : me
				 }];
		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});