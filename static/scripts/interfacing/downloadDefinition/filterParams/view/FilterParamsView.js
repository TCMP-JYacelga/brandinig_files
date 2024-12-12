/**
 * @class GCP.view.FilterParamsView
 * @extends Ext.panel.Panel
 * @author Vaidehi
 */
Ext.define('GCP.view.FilterParamsView', {
	extend : 'Ext.panel.Panel',
	xtype : 'filterParamsView',
	requires : ['GCP.view.FilterParamsGridView'],
	width : '100%',
	componentCls : 'ux_panel-background',
	autoHeight : true,
	initComponent : function() {
		var me = this; 
		var pnl = new Ext.Panel({
			cls : 'ux_extralargepadding-bottom',
		    items: (function(){
		        var items = [];
		        if (pageMode != 'View') {
		            items.push(
		            	{
				        	xtype : 'label',
							text : getLabel( 'createNew', 'Create : ' ),
							margin : '7 0 3 0',
							cls : 'ux_font-size14-normal ux_line-height24'
				        },
		            	{
		            	xtype : 'button',
						itemId : 'addFilterParamsbtn',
						name : 'Band',
						text : '<span class="button_underlined thePointer ux_line-height24">' + getLabel( 'createNew', 'Create : ' )
							+ '</span>',
						cls : 'xn-account-filter-btnmenu'
		            });
		        }
		        return items;
		    })()
		});
		me.items = [
		            {
						xtype : 'panel',
						layout :
						{
							type : 'hbox'
						},
						items :
						[
						// pnl
						]
					},
					{
						xtype : 'filterParamsGridView',
						width : '100%',
						parent : me
					}];
		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});