Ext.define('GCP.view.EventSetupView', {
	extend : 'Ext.container.Container',
	xtype : 'eventSetupView',
	requires : ['Ext.container.Container', 'GCP.view.EventSetupTitleView',
			'GCP.view.EventSetupFilterView', 'GCP.view.EventSetupGridView'],
	width : '100%',
	autoHeight : true,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'eventSetupTitleView',
					width : '100%'
				}, {
					xtype : 'eventSetupFilterView',
					width : '100%',
					title : getLabel('filterBy', 'Filter By: ') + '&nbsp;<span id="eventSetupFilterView-1020_header_hd-textEl" class="largepadding icon-information"></span>'
				}, {   
					xtype : 'eventSetupGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});