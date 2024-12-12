Ext.define('Cashweb.view.portlet.UserActionPortlet', {
			extend : 'Ext.grid.Panel',
			alias : 'widget.usr_actions',
			requires : ['Cashweb.store.UserActionStore'],
			emptyText :null,
			padding : '5 10 10 10',
			taskRunner: null,
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
			}
		});