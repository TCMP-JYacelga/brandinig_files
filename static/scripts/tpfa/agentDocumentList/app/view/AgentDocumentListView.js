Ext.define('GCP.view.AgentDocumentListView', {
	extend : 'Ext.container.Container',
	xtype : 'agentDocumentListView',
	requires : ['Ext.container.Container', 'GCP.view.AgentDocumentListFilterView',
			'GCP.view.AgentDocumentListGridView'],
	width : '100%',
	autoHeight : true,
	// minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
			xtype : 'agentDocumentListGridView',
			width : '100%'
		}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});