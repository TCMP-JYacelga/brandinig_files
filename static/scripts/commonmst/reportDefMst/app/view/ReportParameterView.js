Ext.define('GCP.view.ReportParameterView', {
	extend : 'Ext.container.Container',
	xtype : 'reportParameterView',
	requires : ['Ext.container.Container',
			 'GCP.view.ReportParameterGridView'],
	width : '100%',
	autoHeight : true,
	minHeight : 100,
	initComponent : function() {
		var me = this;
		me.items = [{   
					xtype : 'reportParameterGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});