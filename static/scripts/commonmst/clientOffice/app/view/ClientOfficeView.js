Ext.define('GCP.view.ClientOfficeView', {
	extend : 'Ext.container.Container',
	xtype : 'clientOfficeView',
	requires : ['Ext.container.Container', 'GCP.view.ClientOfficeTitleView',
			'GCP.view.ClientOfficeFilterView', 'GCP.view.ClientOfficeGridView'],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'clientOfficeTitleView',
					width : '100%',
					cls : 'ux_no-border ux_largepaddingtb'
				}, {
					xtype : 'clientOfficeFilterView',
					width : '100%',
				//	margin : '0 0 5 0',
					title : getLabel('filterBy', 'Filter By: ')
							+ '<img id="imgFilterInfo" class="largepadding icon-information"/>'
				}, {   
					xtype : 'clientOfficeGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});