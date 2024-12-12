Ext.define('GCP.view.AlertSetupView', {
	extend : 'Ext.container.Container',
	xtype : 'alertSetupView',
	requires : ['Ext.container.Container', 'GCP.view.AlertSetupTitleView',
			'GCP.view.AlertSetupFilterView', 'GCP.view.AlertSetupGridView'],
	width : '100%',
	autoHeight : true,
	initComponent : function() {
		var me = this;
		me.items = [/*{
					xtype : 'alertSetupTitleView',
					width : '100%'
				},*/ {
					xtype : 'alertSetupFilterView',
					width : '100%',
					title : getLabel('filterBy', 'Filter By: ') + '&nbsp;<span id="alertSetupFilterView-1020_header_hd-textEl" class="largepadding icon-information"></span>'
				}, {   
					xtype : 'alertSetupGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});