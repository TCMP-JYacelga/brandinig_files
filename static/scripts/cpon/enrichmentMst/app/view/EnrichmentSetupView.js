Ext.define('GCP.view.EnrichmentSetupView', {
	extend : 'Ext.container.Container',
	xtype : 'enrichmentSetupView',
	requires : ['Ext.container.Container', 'GCP.view.EnrichmentSetupTitleView',
			'GCP.view.EnrichmentSetupFilterView', 'GCP.view.EnrichmentSetupGridView'],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'enrichmentSetupTitleView',
					width : '100%',
					cls : 'ux_no-border ux_largepaddingtb'
				}, {
					xtype : 'enrichmentSetupFilterView',
					width : '100%',
				//	margin : '0 0 5 0',
						title : getLabel('filterBy', 'Filter By : ')
					+'<img id="imgFilterInfo" class="largepadding icon-information"/>'
				}, {   
					xtype : 'enrichmentSetupGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});