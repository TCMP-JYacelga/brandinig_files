Ext.define('GCP.view.CopyByClientPopupView', {
			extend : 'Ext.window.Window',
			modal : true,
			xtype : 'copyByClientPopupView',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
			title : getLabel('copiedby', 'Copied By'),
			height : 300,
			width : 400,
			profileType : null,
			layout : {
				type : 'vbox',
				align : 'stretch'
			},

			initComponent : function() {
				var me = this;
				var prfType = me.profileType;				
				var strUrl = Ext.String.format('cpon/copybyseek/{0}CopyByClientSeek',
						prfType);
				clientListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							pageSize : 5,
							xtype : 'clientListView',
							stateful : false,
							showEmptyRow : false,
							showCheckBoxColumn : false,
							padding : '5 0 0 0',
							rowList : [5, 10, 15, 20, 25, 30],
							minHeight : 150,
							columnModel : [{
								colHeader : getLabel('grid.column.company',
										'Company Name'),
								colId : 'value',
								width : 330
							}],

							storeModel : {

								fields : ['value'],
								proxyUrl : strUrl,
								rootNode : 'd.filter',
								totalRowsNode : 'd.count'
							}
						});

				this.items = [clientListView];
				this.bbar = ['->', {
							xtype : 'button',
							text : getLabel('cancel', 'Cancel'),
							cls : 'xn-button',
							handler : function() {
								me.close();
							}
						}];

				this.callParent(arguments);
			}

		});
