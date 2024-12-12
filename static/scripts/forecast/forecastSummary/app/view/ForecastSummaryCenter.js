/** 
 * @class GCP.view.ForecastSummaryCenter
 * @extends Ext.panel.Panel
 * @author Aditi Joshi
 */
Ext.define('GCP.view.ForecastSummaryCenter', {
			extend : 'Ext.panel.Panel',
			xtype : 'accountCenter',
			requires : ['GCP.view.accountSummary.ForecastAccountSummaryView', 'GCP.view.periodicSummary.PeriodicSummaryView', 'GCP.view.transactionSummary.TransactionSummaryView',
					'Ext.layout.container.Card', 'Ext.tab.Panel',
					'Ext.tab.Tab', 'Ext.panel.Panel'],
			autoHeight : true,
			initComponent : function() {
				var me = this;
				me.items = [{
							xtype : 'accountSummaryView',
							itemId : 'accountSummaryView'
						}, {
							xtype : 'panel',
							itemId : 'periodicSummaryView'
						}, 
						{
							xtype : 'panel',
							itemId : 'transactionSummaryView'
						}
						];
				me.on('resize', function() {
							me.doLayout();
						});
				me.callParent(arguments);
			},
			updateView : function(items) {
				var me = this;
				
				if(isPeriodOn === true )
				{
					var panel = me.down('panel[itemId="periodicSummaryView"]');
					if (panel) {
						panel.removeAll(true);
						if (items)
							panel.add(items)
					}
				}
				else if(isTxnOn === true){
					var panel = me.down('panel[itemId="transactionSummaryView"]');
					if (panel) {
						panel.removeAll(true);
						if (items)
							panel.add(items)
					}
				}
				else{
					var panel = me.down('panel[itemId="accountSummaryView"]');
					if (panel) {
						panel.removeAll(true);
						if (items)
							panel.add(items)
					}
				}
			},
			setActiveCard : function(index) {
				var me = this;
				data = me.items;
				if(index == 1){
					for(var i = 0; i < data.length; i++) {
						if (data.items[i].itemId == 'accountSummaryView')
							data.items[i].hide();
						else if (data.items[i].itemId == 'transactionSummaryView')
							data.items[i].hide();
						else if(data.items[i].itemId == 'periodicSummaryView')
								data.items[i].show();
					}
				} else if(index == 0){
					for(var i = 0; i < data.length; i++) {
						if (data.items[i].itemId == 'periodicSummaryView')
							data.items[i].hide();
						else if (data.items[i].itemId == 'transactionSummaryView')
							data.items[i].hide();
//						else if (data.items[i].itemId == 'transactionSummaryView')
//							data.items[i].hide();
						else if (data.items[i].itemId == 'accountSummaryView')
							data.items[i].show();
					}
				} 
				else if(index == 2){
					for(var i = 0; i < data.length; i++) {
						if (data.items[i].itemId == 'accountSummaryView')
							data.items[i].hide();
						else if (data.items[i].itemId == 'periodicSummaryView')
							data.items[i].hide();
						else if (data.items[i].itemId == 'transactionSummaryView')
							data.items[i].show();
					}
				}
				else {}
			}
		});