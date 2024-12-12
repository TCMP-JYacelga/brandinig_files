Ext.define('GCP.view.LMSInterAccountParameterListView', {
	extend : 'Ext.panel.Panel',
	xtype : 'lmsInterAccountParameterListView',
	requires : ['Ext.ux.gcp.GridHeaderFilterView',
			'GCP.view.LMSInterAccountParameterListFilterView', 'GCP.view.LMSInterAccountParameterListGroupGridView'],
	//width : '100%',
	autoHeight : true,
	//minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'lMSInterAccountParameterListGroupGridView',
					width : 'auto',
					margin : '0 0 12 0'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});