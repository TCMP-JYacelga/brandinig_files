/**
 * @class GCP.view.AccountCenter
 * @extends Ext.panel.Panel
 * @author Vinay Thube
 */
Ext.define('GCP.view.AccountCenter', {
			extend : 'Ext.panel.Panel',
			xtype : 'accountCenter',
			requires : ['GCP.view.summary.AccountSummaryView',
					'Ext.layout.container.Card', 'Ext.tab.Panel',
					'Ext.tab.Tab', 'Ext.panel.Panel'],
			autoHeight : true,
			//width : '100%',
			//layout : 'card',
			initComponent : function() {
				var me = this;
				me.items = [{
							xtype : 'accountSummaryView',
							itemId : 'accountSummaryView'
						}, {
							xtype : 'panel',
							itemId : 'switchPanel'
						}];
				me.on('resize', function() {
							me.doLayout();
						});
				me.callParent(arguments);
			},
			updateView : function(items) {
				var me = this;
				var panel = me.down('panel[itemId="switchPanel"]');
				if (panel) {
					panel.removeAll(true);
					if (items)
						panel.add(items)
				}
			},
			setActiveCard : function(index) {
				var me = this;
				data = me.items;
				if(index == 1){
					for(var i = 0; i < data.length; i++) {
						if (data.items[i].itemId == 'accountSummaryView')
							data.items[i].hide();
						if(data.items[i].itemId == 'switchPanel')
							if(data.items[i].hidden == true)
								data.items[i].show();
					}
				} else if(index == 0){
					for(var i = 0; i < data.length; i++) {
						if (data.items[i].itemId == 'switchPanel')
							data.items[i].hide();
						else if (data.items[i].itemId == 'accountSummaryView')
							data.items[i].show();
					}
				} else {}
				//me.getLayout().setActiveItem(index);
			}
		});