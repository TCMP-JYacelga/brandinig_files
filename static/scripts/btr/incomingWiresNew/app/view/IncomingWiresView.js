Ext.define('GCP.view.IncomingWiresView', {
	extend : 'Ext.panel.Panel',
	xtype : 'incomingWiresView',
	requires : ['GCP.view.IncomingWiresGridGroupView','Ext.ux.gcp.GridHeaderFilterView','GCP.view.IncomingWiresFilterView'],
	//width : '100%',
	autoHeight : true,
	initComponent : function() {
		var me = this;
		me.items = [{
						xtype : 'incomingWiresGridGroupView',
						width : 'auto',
						margin : '12 0 0 0'
					}];
		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});