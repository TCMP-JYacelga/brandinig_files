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