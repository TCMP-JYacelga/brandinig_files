Ext.define('GCP.view.LiquidityRefTimeView', {
	extend : 'Ext.container.Container',
	xtype : 'liquidityRefTimeView',
	requires : ['Ext.container.Container', 'GCP.view.LiquidityRefTimeTitleView',
			'GCP.view.LiquidityRefTimeFilterView', 'GCP.view.LiquidityRefTimeGridView'],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'liquidityRefTimeTitleView',
					width : '100%',
					margin : '0 0 12 0'
				},{
					xtype : 'liquidityRefTimeFilterView',
					width : '100%',
					margin : '0 0 12 0',
					title : getLabel('filterBy', 'Filter By: ')
				}, {
					xtype : 'liquidityRefTimeGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});