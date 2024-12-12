/**
 * @class GCP.view.DispBankProdClrLocView
 * @extends Ext.container.Container
 * @author Vivek Bhurke
 */
Ext.define('GCP.view.DispBankProdClrLocView',
{
	extend : 'Ext.container.Container',
	xtype : 'dispBankProdClrLocView',
	requires : [ 'Ext.container.Container',
			'GCP.view.DispBankProdClrLocTitleView',
			'GCP.view.DispBankProdClrLocFilterView',
			'GCP.view.DispBankProdClrLocGridView' ],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
			xtype : 'dispBankProdClrLocTitleView',
			width : '100%',
			cls : 'ux_no-border ux_largepaddingtb'
		},{
			xtype : 'dispBankProdClrLocFilterView',
			width : '100%',
			title : getLabel('filterBy', 'Filter By: ')
					+ '<img id="imgFilterInfo" class="largepadding icon-information"/>'
		},{
			xtype : 'dispBankProdClrLocGridView',
			width : '100%'
		}];
		me.on('resize', function() {
			me.doLayout();
		});
		me.callParent(arguments);
	}
});
