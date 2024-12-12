/**
 * @class GCP.view.PaymentSummaryTitleView
 * @extends Ext.panel.Panel
 * @author Vinay Thube
 */
Ext.define('GCP.view.PaymentSummaryTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'paymentSummaryTitleView',
	requires : [],
	width : '100%',
	baseCls : 'page-heading-bottom-border',
	defaults : {
		style : {
			padding : '0 0 0 0'
		}
	},
	layout : {
		type : 'hbox'
	},
	initComponent : function() {

		this.items = [{
					xtype : 'label',
					text : getLabel('templates', 'Templates'),
					cls : 'page-heading',
					padding : '0 0 0 10'
				}, {
					xtype : 'toolbar',
					flex : 1,
					items : []
				}

		];

		this.callParent(arguments);
	}

});