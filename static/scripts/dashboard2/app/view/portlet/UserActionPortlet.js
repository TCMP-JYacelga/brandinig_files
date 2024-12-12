Ext.define('Cashweb.view.portlet.UserActionPortlet', {
			extend : 'Ext.grid.Panel',
			alias : 'widget.usr_actions',
			requires : ['Cashweb.store.UserActionStore'],
			emptyText :null,
			padding : '5 10 10 10',
			taskRunner: null,
			cols : 2,
			minHeight: 40,
			config : {
				hideHeaders : true,
				viewConfig : {
					stripeRows : false,
					loadMask: false
				}
			},
			initComponent : function() {
				var thisClass = this;
				thisClass.emptyText = label_map.noDataFound;
				
				this.store = new Cashweb.store.UserActionStore();
				this.columns = [{
							dataIndex : 'actionName',
							flex : 1
						}, {
							dataIndex : 'actionCount',
							align : 'right',
							flex : 1
						}];

				this.callParent();
			},
	getSettingsPanel : function() {
		var settingsPanel = Ext.create('Ext.panel.Panel',{
			getSettings : function () {	
				var me = this;
				var jsonArray = [];
				return jsonArray;
			}	
		});
		return settingsPanel;
	},
	getDataPanel : function () {
		return this;
	}
		});