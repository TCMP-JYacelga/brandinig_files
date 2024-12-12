Ext.define('GCP.view.AgentSubAccountView', {
	extend : 'Ext.container.Container',
	xtype : 'agentSubAccountView',
	requires : ['Ext.container.Container', 'GCP.view.AgentSubAccountFilterView',
			'GCP.view.AgentSubAccountGridView'],
	width : '100%',
	autoHeight : true,
	// minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
			xtype : 'agentSubAccountGridView',
			width : '100%'
		}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});