Ext.define('GCP.view.BankPrinterMstView',
{
	extend : 'Ext.container.Container',
	xtype : 'bankPrinterMstView',
	requires : [ 'Ext.container.Container',
			'GCP.view.BankPrinterMstTitleView',
			'GCP.view.BankPrinterMstFilterView',
			'GCP.view.BankPrinterMstGridView' ],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
			xtype : 'bankPrinterMstTitleView',
			width : '100%',
			cls : 'ux_no-border ux_largepaddingtb'
		},{
			xtype : 'bankPrinterMstFilterView',
			width : '100%',
			title : getLabel('filterBy', 'Filter By: ')
					+ '<img id="imgFilterInfo" class="largepadding icon-information"/>'
		},{
			xtype : 'bankPrinterMstGridView',
			width : '100%'
		}];
		me.on('resize', function() {
			me.doLayout();
		});
		me.callParent(arguments);
	}
});
