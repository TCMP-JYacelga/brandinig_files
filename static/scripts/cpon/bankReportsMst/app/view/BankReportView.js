Ext.define('GCP.view.BankReportView', {
	extend : 'Ext.container.Container',
	xtype : 'bankReportView',
	requires : ['Ext.container.Container', 'GCP.view.BankReportTitleView',
			'GCP.view.BankReportFilterView', 'GCP.view.BankReportGridView'],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'bankReportTitleView',
					width : '100%'
				},{
					xtype : 'bankReportFilterView',
					width : '100%',
					title : getLabel('filterBy', 'Filter By: ')
							+ '<img id="imgFilterInfo" class="largepadding icon-information"/>'
				}, {
					xtype : 'bankReportGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});