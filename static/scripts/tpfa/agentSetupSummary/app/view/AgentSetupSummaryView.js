Ext.define('GCP.view.AgentSetupSummaryView', {
	extend : 'Ext.container.Container',
	xtype : 'agentSetupSummaryView',
	requires : ['Ext.container.Container', 'GCP.view.AgentSetupSummaryTitleView',
			'GCP.view.AgentSetupSummaryFilterView', 'GCP.view.AgentSetupSummaryGridView'],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'agentSetupSummaryTitleView',
					width : '100%',
					margin : '0 0 12 0'
				},{
					xtype : 'agentSetupSummaryFilterView',
					width : '100%',
					margin : '0 0 12 0',
					title : getLabel('filterBy', 'Filter By: ') + '&nbsp;<span id="imgFilterInfoGridView" class="largepadding icon-information"></span>'
				}, {
					xtype : 'agentSetupSummaryGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});