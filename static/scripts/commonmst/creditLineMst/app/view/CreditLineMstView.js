Ext.define('GCP.view.CreditLineMstView',
{
	extend : 'Ext.container.Container',
	xtype : 'creditLineMstView',
	requires : [ 'Ext.container.Container',	'GCP.view.CreditLineMstTitleView',
			'GCP.view.CreditLineMstFilterView','GCP.view.CreditLineMstGridView' ],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
			xtype : 'creditLineMstTitleView',
			width : '100%',
			cls : 'ux_no-border ux_largepaddingtb'
		},{
			xtype : 'creditLineMstFilterView',
			width : '100%',
			title : getLabel('filterBy', 'Filter By: ') + '<img id="imgFilterInfo" class="largepadding icon-information"/>'
		},{
			xtype : 'creditLineMstGridView',
			width : '100%'
		}];
		me.on('resize', function() {
			me.doLayout();
		});
		me.callParent(arguments);
	}
});
