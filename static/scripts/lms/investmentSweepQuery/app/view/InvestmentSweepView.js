Ext.define('GCP.view.InvestmentSweepView', {
	extend : 'Ext.panel.Panel',
	xtype : 'investmentSweepView',
	requires : [ 'GCP.view.InvestmentSweepGroupView' ],
	width : '100%',
	autoHeight : true,
	initComponent : function()
	{
		var me = this;
		me.items = [ {
			xtype : 'investmentSweepGroupView',
			width : 'auto',
			margin : '0 0 12 0'
		} ];
		me.on('resize', function()
		{
			me.doLayout();
		});
		me.callParent(arguments);
	}

});
