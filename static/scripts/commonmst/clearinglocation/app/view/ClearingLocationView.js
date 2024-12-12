Ext.define('GCP.view.ClearingLocationView',
{
	extend : 'Ext.container.Container',
	xtype : 'clearingLocationView',
	requires : [ 'Ext.container.Container',
			'GCP.view.ClearingLocationTitleView',
			'GCP.view.ClearingLocationFilterView',
			'GCP.view.ClearingLocationGridView' ],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
			xtype : 'clearingLocationTitleView',
			width : '100%',
			cls : 'ux_no-border ux_largepaddingtb'
		},{
			xtype : 'clearingLocationFilterView',
			width : '100%',
			title : getLabel('filterBy', 'Filter By: ')
					+ '<img id="imgFilterInfo" class="largepadding icon-information"/>'
		},{
			xtype : 'clearingLocationGridView',
			width : '100%'
		}];
		me.on('resize', function() {
			me.doLayout();
		});
		me.callParent(arguments);
	}
});
