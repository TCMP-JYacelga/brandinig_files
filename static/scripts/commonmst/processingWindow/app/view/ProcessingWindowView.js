Ext.define('GCP.view.ProcessingWindowView', {
	extend : 'Ext.container.Container',
	xtype : 'processingWindowView',
	requires : ['Ext.container.Container', 'GCP.view.ProcessingWindowTitleView',
			'GCP.view.ProcessingWindowFilterView', 'GCP.view.ProcessingWindowGridView'],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'processingWindowTitleView',
					width : '100%'
				}, {
					xtype : 'processingWindowFilterView',
					width : '100%',
					title : getLabel('filterBy', 'Filter By: ')
					+ '<img id="imgFilterInfo" class="largepadding icon-information"/>'
					
				}, {
					xtype : 'processingWindowGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});