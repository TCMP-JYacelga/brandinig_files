/**
 * @class GCP.view.PaymentQueueView
 * @extends Ext.panel.Panel
 * @author Shraddha Chauhan
 * @author Vinay Thube
 */
Ext.define('GCP.view.PaymentQueueSummaryView', {
	extend : 'Ext.panel.Panel',
	xtype : 'paymentQueueSummaryView',
	requires : ['GCP.view.PaymentQueueTitleView',
			'GCP.view.PaymentQueueActionResult',
			'GCP.view.PaymentQueueGridView', 'GCP.view.PaymentQueueFilterView'],
	autoHeight : true,
	cls : 'ux_panel-background',
	width : '100%',
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'paymentQueueTitleView',
					width : '100%'
				}, {
					xtype : 'paymentQueueFilterView',
					itemId : 'paymentQueueFilterView',
					width : '100%',
					margin : '0 0 12 0'
				}, {
					xtype : 'paymentQueueActionResult',
					itemId : 'paymentQueueActionResult',
					maxHeight : 160,
					height : 'auto',
					hidden : true,
					margin : '0 0 12 0'
				}, {
					xtype : 'paymentQueueGridView',
					itemId : 'paymentQueueBatchGrid',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});