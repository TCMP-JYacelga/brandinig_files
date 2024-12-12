Ext.define('GCP.view.TaxRateMstSummaryView', {
	extend : 'Ext.container.Container',
	xtype : 'taxRateMstSummaryView',
	requires : ['Ext.container.Container', 'GCP.view.TaxRateMstTitleView',
			'GCP.view.TaxRateMstFilterView', 'GCP.view.TaxRateMstGridView'],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'taxRateMstTitleView',
					width : '100%',
					margin : '0 0 5 0'
				},{
					xtype : 'taxRateMstFilterView',
					width : '100%',
					margin : '0 0 5 0',
					title : getLabel('filterBy', 'Filter By: ')
							+ '<img id="imgFilterInfo" class="largepadding icon-information"/>'
				}, {
					xtype : 'taxRateMstGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});