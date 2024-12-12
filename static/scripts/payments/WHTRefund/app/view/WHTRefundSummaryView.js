Ext.define('GCP.view.WHTRefundSummaryView', {
	extend : 'Ext.panel.Panel',
	xtype : 'WHTRefundSummaryView',
	requires : [ 'GCP.view.WHTRefundTitleView',
	//'GCP.view.WHTRefundActionResult',
	'GCP.view.WHTRefundGridView', 'GCP.view.WHTRefundFilterView' ],
	autoHeight : true,
	cls : 'ux_panel-background',
	width : '100%',
	initComponent : function() {
		var me = this;
		me.items = [ {
			xtype : 'WHTRefundTitleView',
			width : '100%'
		}, {
			xtype : 'WHTRefundFilterView',
			itemId : 'WHTRefundFilterView',
			width : '100%',
			margin : '0 0 12 0'
		}/*, {
							xtype : 'WHTRefundActionResult',
							itemId : 'WHTRefundActionResult',
							maxHeight : 160,
							height : 'auto',
							hidden : true,
							margin : '0 0 12 0'
						}*/, {
			xtype : 'WHTRefundGridView',
			itemId : 'WHTRefundBatchGrid',
			width : '100%'
		} ];

		me.on('resize', function() {
			me.doLayout();
		});
		me.callParent(arguments);
	}
});