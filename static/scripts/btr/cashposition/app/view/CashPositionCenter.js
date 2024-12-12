
Ext.define('GCP.view.CashPositionCenter', {
			extend : 'Ext.panel.Panel',
			xtype : 'cashPositionCenter',
			requires : ['GCP.view.summary.CashPositionSummaryView',
					'Ext.layout.container.Card', 'Ext.tab.Panel',
					'Ext.tab.Tab', 'Ext.panel.Panel'],
			autoHeight : true,
			//width : '100%',
			//layout : 'card',
			initComponent : function() {
				var me = this;
				me.items = [{
							xtype : 'cashPositionSummaryView',
							itemId : 'cashPositionSummaryView'
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
						if (data.items[i].itemId == 'cashPositionSummaryView')
							data.items[i].hide();
						if(data.items[i].itemId == 'switchPanel')
							if(data.items[i].hidden == true)
								data.items[i].show();
					}
				} else if(index == 0){
					for(var i = 0; i < data.length; i++) {
						if (data.items[i].itemId == 'switchPanel')
							data.items[i].hide();
						else if (data.items[i].itemId == 'cashPositionSummaryView')
							data.items[i].show();
					}
				} else {}
				//me.getLayout().setActiveItem(index);
			}
		});