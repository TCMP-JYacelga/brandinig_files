Ext.define('GCP.view.ReportDefinitionView', {
	extend : 'Ext.container.Container',
	xtype : 'reportDefinitionView',
	requires : ['Ext.container.Container', 'GCP.view.ReportDefinitionTitleView',
			'GCP.view.ReportDefinitionFilterView', 'GCP.view.ReportDefinitionGridView'],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'reportDefinitionTitleView',
					width : '100%',
					cls : 'ux_no-border ux_largepaddingtb'
				}, {
					xtype : 'reportDefinitionFilterView',
					width : '100%',
					title : getLabel('filterBy', 'Filter By : ')+ '<img id="imgFilterInfo" class="largepadding icon-information"/>'							 
				}, {   
					xtype : 'reportDefinitionGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});