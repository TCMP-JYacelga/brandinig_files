Ext.define('GCP.view.FxSpreadSetupView', {
	extend : 'Ext.container.Container',
	xtype : 'fxSpreadSetupView',
	requires : ['Ext.container.Container', 'GCP.view.FxSpreadSetupTitleView',
			'GCP.view.FxSpreadSetupFilterView', 'GCP.view.FxSpreadSetupGridView'],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'fxSpreadSetupTitleView',
					width : '100%',
					cls : 'ux_no-border ux_largepaddingtb'
				}, {
					xtype : 'fxSpreadSetupFilterView',
					width : '100%',
				//	margin : '0 0 5 0',
					title : getLabel('filterBy', 'Filter By : ')+ '<img id="imgFilterInfo" class="largepadding icon-information"/>'
				}, {   
					xtype : 'fxSpreadSetupGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});