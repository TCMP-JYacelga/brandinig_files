Ext.define('GCP.view.LotClosureSummaryView', {
	extend : 'Ext.panel.Panel',
	xtype : 'LotClosureSummaryView',
	requires : [ 'GCP.view.LotClosureTitleView',
	'GCP.view.LotClosureGridView', 'GCP.view.LotClosureFilterView' ],
	autoHeight : true,
	cls : 'ux_panel-background',
	width : '100%',
	initComponent : function() {
		var me = this;
		me.items = [ {
			xtype : 'LotClosureTitleView',
			width : '100%'
		}, {
			xtype : 'LotClosureFilterView',
			itemId : 'LotClosureFilterView',
			width : '100%',
			margin : '0 0 12 0'
		}, {
			xtype : 'LotClosureGridView',
			itemId : 'LotClosureBatchGrid',
			width : '100%'
		} ];

		me.on('resize', function() {
			me.doLayout();
		});
		me.callParent(arguments);
	}
});