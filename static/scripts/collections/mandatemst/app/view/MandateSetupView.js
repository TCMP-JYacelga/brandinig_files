Ext.define('GCP.view.MandateSetupView', {
	extend : 'Ext.container.Container',
	xtype : 'mandateSetupView',
	requires : ['Ext.container.Container', 'GCP.view.MandateSetupTitleView',
			'GCP.view.MandateSetupFilterView', 'GCP.view.MandateSetupGridView'],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'mandateSetupTitleView',
					width : '100%',
					cls : 'ux_no-border ux_largepaddingtb'
				}, {
					xtype : 'mandateSetupFilterView',
					width : '100%',
				//	margin : '0 0 5 0',
					title : getLabel('filterBy', 'Filter By : ')
							 + '<img id="imgFilterInfo" class="icon-company">'
				}, {   
					xtype : 'mandateSetupGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});