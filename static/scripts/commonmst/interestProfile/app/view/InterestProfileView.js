Ext.define('GCP.view.InterestProfileView', {
	extend : 'Ext.container.Container',
	xtype : 'interestProfileView',
	requires : ['Ext.container.Container', 'GCP.view.InterestProfileTitleView',
			'GCP.view.InterestProfileFilterView', 'GCP.view.InterestProfileGridView'],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'interestProfileTitleView',
					width : '100%',
					margin : '0 0 12 0'
				},{
					xtype : 'interestProfileFilterView',
					width : '100%',
					margin : '0 0 12 0',
					title : getLabel('filterBy', 'Filter By: ')+'<img class="largepadding icon-information"></img>'
				}, {
					xtype : 'interestProfileGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});