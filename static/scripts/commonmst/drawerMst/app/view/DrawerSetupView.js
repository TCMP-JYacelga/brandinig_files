Ext.define('GCP.view.DrawerSetupView', {
	extend : 'Ext.container.Container',
	xtype : 'drawerSetupView',
	requires : ['Ext.container.Container', 'GCP.view.DrawerSetupTitleView',
			'GCP.view.DrawerSetupFilterView', 'GCP.view.DrawerSetupGridView'],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'drawerSetupTitleView',
					width : '100%',
					cls : 'ux_no-border ux_largepaddingtb'
				}, {
					xtype : 'drawerSetupFilterView',
					width : '100%',
				//	margin : '0 0 5 0',
					title : getLabel('filterBy', 'Filter By : ')
							 + '<img id="imgFilterInfo" class="icon-company">'
				}, {   
					xtype : 'drawerSetupGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});