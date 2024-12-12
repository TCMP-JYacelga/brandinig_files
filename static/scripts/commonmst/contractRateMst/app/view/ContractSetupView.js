Ext.define('GCP.view.ContractSetupView', {
	extend : 'Ext.container.Container',
	xtype : 'contractSetupView',
	requires : ['Ext.container.Container', 'GCP.view.ContractSetupTitleView',
			'GCP.view.ContractSetupFilterView', 'GCP.view.ContractSetupGridView'],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'contractSetupTitleView',
					width : '100%',
					cls : 'ux_no-border ux_largepaddingtb'
				}, {
					xtype : 'contractSetupFilterView',
					width : '100%',
				//	margin : '0 0 5 0',
					title : getLabel('filterBy', 'Filter By : ')
							+ '<img id="imgFilterInfo" class="largepadding icon-information"/>'
				}, {   
					xtype : 'contractSetupGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});
