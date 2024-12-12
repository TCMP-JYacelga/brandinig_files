Ext.define('GCP.view.SecurityProfileView', {
	extend : 'Ext.container.Container',
	xtype : 'securityProfileView',
	requires : ['Ext.container.Container', 'GCP.view.SecurityProfileTitleView',
			'GCP.view.SecurityProfileFilterView', 'GCP.view.SecurityProfileGridView'],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'securityProfileTitleView',
					width : '100%',
					cls : 'ux_no-border ux_largepaddingtb'
				}, {
					xtype : 'securityProfileFilterView',
					width : '100%',
					title : '<span id="imgFilterInfoGridView">'+getLabel('filterBy', 'Filter By: ')+'</span>'
				}, {
					xtype : 'securityProfileGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});