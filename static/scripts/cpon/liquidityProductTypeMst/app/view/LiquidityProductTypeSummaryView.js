Ext.define('GCP.view.LiquidityProductTypeSummaryView', {
	extend : 'Ext.container.Container',
	xtype : 'lmsProductTypeMstSummaryView',
	width : '100%',
	requires : ['GCP.view.LiquidityProductTypeMstTitleView','GCP.view.LiquidityProductTypeMstGridView','GCP.view.LiquidityProductTypeMstFilterView'],
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'liquidityProductTypeMstTitleView',
					width : '100%',
					margin : '0 0 12 0'
				},{
					xtype : 'liquidityProductTypeMstFilterView',
					width : '100%',
					title : getLabel('filterBy', 'Filter By: ')
							+ '<img id="imgFilterInfoGridView" class="largepadding icon-information"/>'
				},{
					xtype : 'liquidityProductTypeMstGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});