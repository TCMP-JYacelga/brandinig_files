Ext.define('GCP.view.AgentAccountView', {
	extend : 'Ext.container.Container',
	xtype : 'agentAccountView',
	requires : ['Ext.container.Container', 	'GCP.view.AgentAccountGridView'],
	width : '100%',
	autoHeight : true,
	// minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
			xtype : 'agentAccountGridView',
			width : '100%'		
			}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});