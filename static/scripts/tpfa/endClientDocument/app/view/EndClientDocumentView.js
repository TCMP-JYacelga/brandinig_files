Ext.define('GCP.view.EndClientDocumentView', {
	extend : 'Ext.container.Container',
	xtype : 'endClientDocumentView',
	requires : ['Ext.container.Container', 'GCP.view.EndClientDocumentFilterView',
			'GCP.view.EndClientDocumentGridView'],
	width : '100%',
	autoHeight : true,
	// minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
			xtype : 'endClientDocumentGridView',
			width : '100%'
		}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});