/**
 * @class GCP.view.AccountCenter
 * @extends Ext.panel.Panel
 * @author Shraddha Chauhan
 */
Ext.define('GCP.view.UserActivityCenter', {
			extend : 'Ext.panel.Panel',
			xtype : 'userActivityCenter',
			requires : ['GCP.view.UserActivityView','GCP.view.eventLog.EventLogView',
					'Ext.layout.container.Card', 'Ext.tab.Panel',
					'Ext.tab.Tab', 'Ext.panel.Panel'],
			autoHeight : true,
			width : '100%',
			layout : 'card',
			cls : 'ux_panel-background',
			activeItem: 0,
			initComponent : function() {
				var me = this;
				me.items = [{
							xtype : 'userActivityView',
							itemId : 'userActivityView'
						}, {
							xtype : 'eventLogView',
							itemId : 'eventLogView'
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
			setActiveCard : function(screenName) {
				var me = this;
				if(screenName == 'useractivity')
					me.getLayout().setActiveItem(0);
				else
					me.getLayout().setActiveItem(1);
			}
		});