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
	autoHeight : true,
	//minHeight : 600,
	initComponent : function() {
		var me = this; 
		var pnl = new Ext.Panel({
		    items: (function(){
		        var items = [];
		        if (pageMode != 'View') {
		            items.push(
		            	/*{
				        	xtype : 'label',
							margin : '7 0 3 0',
							text : getLabel( 'createNew', 'Create : ' )
				        },*/
		            	{
		            	xtype : 'button',
						itemId : 'addFilterParamsbtn',
						name : 'Band',
						margin : '7 0 5 0',
						text : '<span class="buttom_underlined thePointer">' + getLabel( 'addFilterParamsLbl', 'Add FilterParameter' )
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
						 pnl
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