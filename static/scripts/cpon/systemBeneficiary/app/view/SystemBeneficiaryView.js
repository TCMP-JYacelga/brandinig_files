Ext.define('GCP.view.SystemBeneficiaryView', {
	extend : 'Ext.container.Container',
	xtype : 'systemBeneficiaryView',
	requires : ['Ext.container.Container', 'GCP.view.SystemBeneficiaryTitleView',
			'GCP.view.SystemBeneficiaryFilterView', 'GCP.view.SystemBeneficiaryGridView'],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'systemBeneficiaryTitleView',
					width : '100%'
				},{
					xtype : 'systemBeneficiaryViewFilterView',
					width : '100%',
					title : getLabel( 'filterBy', 'Filter By: ') + '<img id="imgFilterInfo" class="largepadding icon-information"/>'
				}, {
					xtype : 'systemBeneficiaryGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});