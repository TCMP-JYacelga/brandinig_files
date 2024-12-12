Ext.define('GCP.view.EODCenterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'eodCenterView',
	requires : ['GCP.view.EODCenterGridView',
	            'GCP.view.EODCenterTitleView','Ext.tab.Panel','Ext.tab.Tab'],
	width : '100%',
	autoHeight : true,
	cls : 'ux_panel-background',
	//minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [
					{
					xtype : 'eodCenterTitleView',
					width : '100%',
					margin : '0 0 0 0',
					padding : '10 0 10 0',
					cls : 'ux_no-border'
					},
					
					{
						xtype : 'eodCenterGridView',
						width : '100%',
						padding : '12 0 0 0',
						parent : me
				 }];
		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});