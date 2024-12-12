Ext.define('GCP.view.SearchTransactionTemplateListTabView', {
			extend : 'Ext.panel.Panel',
			xtype : 'searchTransactionTemplateListTabView',
			requires : ['GCP.view.SearchTransactionTemplateTabGridView',
					'Ext.data.Store'],
			padding : '15 0 0 0',
			layout : 'fit',
			height : 300,
			initComponent : function() {
				var me = this;
				var gridStore = me.getTemplListStore();
				this.items = [{
							xtype : 'searchTransactionTemplateTabGridView',
							style : 'overflow:auto',
							store : gridStore,
							parent : this
						}

				];

				this.callParent(arguments);
			},
			getTemplListStore : function() {
				var parent = this;
				var storeData = this.parent.templListStoreData;
				var objStore = Ext.create('Ext.data.Store', {
							fields : ['templateName','identifier'],
							data : storeData
						});
				return objStore;
			}

		});