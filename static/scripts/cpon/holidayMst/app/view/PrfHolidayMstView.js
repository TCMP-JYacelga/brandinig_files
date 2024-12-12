Ext.define('GCP.view.PrfHolidayMstView', {
	extend : 'Ext.container.Container',
	xtype : 'prfHolidayMstView',
	width : '100%',
	requires : ['GCP.view.PrfHolidayMstTitleView','GCP.view.PrfHolidayMstGridView','GCP.view.PrfHolidayMstFilterView'],
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'prfHolidayTitleView',
					width : '100%',
					margin : '0 0 12 0'
				},{
					xtype : 'prfHolidayFilterView',
					width : '100%',
					margin : '0 0 12 0',
					title : getLabel('filterBy', 'Filter By: ') + '&nbsp;<span id="imgFilterInfoGridView" class="largepadding icon-information"></span>'
				},{
					xtype : 'prfHolidayMstGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});