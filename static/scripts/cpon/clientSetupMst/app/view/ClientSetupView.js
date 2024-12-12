Ext.define('GCP.view.ClientSetupView', {
	extend : 'Ext.container.Container',
	xtype : 'clientSetupView',
	requires : ['Ext.container.Container', 'GCP.view.ClientSetupTitleView',
			'GCP.view.ClientSetupFilterView', 'GCP.view.ClientSetupGridView'],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'clientSetupTitleView',
					width : '100%'
				}, {
					xtype : 'clientSetupFilterView',
					width : '100%',
					title : getLabel('filterBy', 'Filter By: ')
							+ '<img id="imgFilterInfo" class="largepadding icon-information"/>'
				}, {
					xtype : 'clientSetupGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});