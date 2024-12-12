Ext.define('GCP.view.SignatureSetupView', {
	extend : 'Ext.container.Container',
	xtype : 'signatureSetupView',
	requires : ['Ext.container.Container', 'GCP.view.SignatureSetupTitleView',
			'GCP.view.SignatureSetupFilterView', 'GCP.view.SignatureSetupGridView'],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'signatureSetupTitleView',
					width : '100%',
					cls : 'ux_no-border ux_largepaddingtb'
				}, {
					xtype : 'signatureSetupFilterView',
					width : '100%',
				//	margin : '0 0 5 0',
					title : getLabel('filterBy', 'Filter By : ')
					+'<img id="imgFilterInfo" class="largepadding icon-information"/>'
				}, {   
					xtype : 'signatureSetupGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});