Ext.define('GCP.view.FinanceSetupView', {
	extend : 'Ext.container.Container',
	xtype : 'financeSetupView',
	requires : ['Ext.container.Container', 'GCP.view.FinanceSetupTitleView',
			'GCP.view.FinanceSetupFilterView', 'GCP.view.FinanceSetupGridView'],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'financeSetupTitleView',
					width : '100%'
				}, {
					xtype : 'financeSetupFilterView',
					width : '100%',
					margin : '0 0 5 0',
					title : getLabel('filterBy', 'Filter By: ')
							+ '<img id="imgFilterInfo" class="largepadding icon-information"/>'
				}, {
					xtype : 'financeSetupGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});