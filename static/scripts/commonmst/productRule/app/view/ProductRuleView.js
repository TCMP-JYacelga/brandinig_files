Ext.define('GCP.view.ProductRuleView', {
	extend : 'Ext.container.Container',
	xtype : 'productRuleView',
	requires : ['Ext.container.Container', 'GCP.view.ProductRuleTitleView',
			'GCP.view.ProductRuleFilterView', 'GCP.view.ProductRuleGridView'],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'productRuleTitleView',
					width : '100%',
					cls : 'ux_no-border ux_largepaddingtb'
				}, {
					xtype : 'productRuleFilterView',
					width : '100%',
				//	margin : '0 0 5 0',
					title : getLabel('filterBy', 'Filter By: ')
							+ '<img id="imgFilterInfo" class="largepadding icon-information"/>'
				}, {   
					xtype : 'productRuleGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});