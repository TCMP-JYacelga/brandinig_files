/**
 * @class GCP.view.PrfMstView
 * @extends Ext.panel.Panel
 * @author Ashwini Pawar
 */
Ext.define('GCP.view.DepositInquiryView', {
	extend : 'Ext.panel.Panel',
	xtype : 'depositInquiryView',
	requires : ['GCP.view.DepositInquiryGroupView'],
	width : 'auto',
	autoHeight : true,
//	cls : 'ux_panel-background',
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'depositInquiryGroupView',
					width : 'auto',
					margin : '0 0 12 0'
				}];
		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});