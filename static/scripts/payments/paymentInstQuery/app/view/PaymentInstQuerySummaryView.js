Ext.define('GCP.view.PaymentInstQuerySummaryView',{
	extend : 'Ext.panel.Panel',
	xtype : 'paymentInstQuerySummaryView',
	requires : [ 'GCP.view.PaymentInstQueryTitleView', 'GCP.view.PaymentInstQueryFilterView',
			'GCP.view.PaymentInstQueryGridView' ],
	autoHeight : true,
	cls : 'ux_panel-background',
	width : '100%',
	initComponent : function() {
		var me = this;
		me.items = [ {
			xtype : 'paymentInstQueryTitleView',
			width : '100%'
		}, {
			xtype : 'paymentInstQueryFilterView',
			itemId : 'paymentInstQueryFilterView',
			width : '100%',
			margin : '0 0 12 0'
		}, {
			xtype : 'paymentInstQueryGridView',
			itemId : 'paymentInstQueryBatchGrid',
			width : '100%'
		} ];
		me.on('resize', function() {
			me.doLayout();
		});
		me.callParent(arguments);
	}
});