Ext.define('GCP.view.InterestRateApplicationGridDtlView', {
	extend : 'Ext.panel.Panel',
	xtype : 'interestRateApplicationGridDtlView',
	requires : ['Ext.ux.gcp.SmartGrid','Ext.panel.Panel'],
	width : '100%',
	cls: 'ux_extralargemargin-top',
	initComponent : function() {
		var me = this;
		me.items = [{
			xtype : 'panel',
			width : '100%',
			cls : 'xn-ribbon ux_panel-transparent-background',
			collapsible: true,
			title: getLabel('transactions', 'TRANSACTIONS'),
			autoHeight : true,
			itemId : 'transactionsDtlView'
			}];
		me.callParent(arguments);
	}
});