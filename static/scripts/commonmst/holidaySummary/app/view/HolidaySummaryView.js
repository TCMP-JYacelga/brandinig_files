Ext.define('GCP.view.HolidaySummaryView', {
	extend : 'Ext.container.Container',
	xtype : 'holidaySummaryView',
	requires : ['Ext.container.Container', 'GCP.view.HolidaySummaryTitleView',
			'GCP.view.HolidaySummaryFilterView', 'GCP.view.HolidaySummaryGridView'],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'holidaySummaryTitleView',
					width : '100%',
					margin : '0 0 12 0'
				},{
					xtype : 'holidaySummaryFilterView',
					width : '100%',
					margin : '0 0 12 0',
					title : getLabel('filterBy', 'Filter By: ')
					+ '<img id="imgFilterInfo" class="largepadding icon-company"/>'
				}, {
					xtype : 'holidaySummaryGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});