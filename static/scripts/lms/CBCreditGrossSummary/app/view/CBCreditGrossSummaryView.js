Ext.define('GCP.view.CBCreditGrossSummaryView', {
	extend : 'Ext.panel.Panel',
	xtype : 'cbCreditGrossSummaryViewType',
	requires : [ 'GCP.view.CBCreditGrossPoolGridView',
			'GCP.view.CBCreditGrossSummaryGridView' ],
	autoHeight : true,
	minHeight : 400,
	//width : '100%',
	initComponent : function() {
		var me = this;
		me.items = [

		{
			xtype : 'cbCreditGrossPoolGridViewType',
			//autoHeight : true,
			//minHeight : 50,
			parent : me
		}, {
			xtype : 'cbCreditGrossSummaryGridViewType',
			//autoHeight : true,
			//minHeight : 50,
			parent : me
		} ];
		me.on('resize', function() {
			me.doLayout();
		});
		me.callParent(arguments);
	}
});
