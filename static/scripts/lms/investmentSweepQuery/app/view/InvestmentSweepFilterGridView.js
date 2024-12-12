Ext.define('GCP.view.InvestmentSweepFilterGridView', {
	extend : 'Ext.panel.Panel',
	requires : [ 'Ext.ux.gcp.SmartGrid' ],
	xtype : 'investmentSweepFilterGridViewType',
	bodyPadding : '12 4 2 2',
	autoHeight : true,
	parent : null,
	initComponent : function()
	{
		var me = this;

		this.items = [ {
			xtype : 'panel',
			title : getLabel('lblAgreementSummaryChange', 'Summary'),
			itemId : 'positionSummaryViewItemId',
			items : [ {
				xtype : 'container',
				layout : 'hbox',
				items : []
			} ]
		} ]
		this.callParent(arguments);
	}
});
