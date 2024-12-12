Ext.define('GCP.view.BankBranchView', {
	extend : 'Ext.container.Container',
	xtype : 'bankBranchView',
	requires : ['Ext.container.Container', 'GCP.view.BankBranchTitleView',
			'GCP.view.BankBranchFilterView', 'GCP.view.BankBranchGridView'],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'bankBranchTitleView',
					width : '100%',
					cls : 'ux_no-border ux_largepaddingtb'
				}, {
					xtype : 'bankBranchFilterView',
					width : '100%',
				//	margin : '0 0 5 0',
					title : getLabel('filterBy', 'Filter By: ')
							+ '<img id="imgFilterInfo" class="largepadding icon-information"/>'
				}, {   
					xtype : 'bankBranchGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});