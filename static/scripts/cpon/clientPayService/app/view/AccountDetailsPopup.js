Ext.define('GCP.view.AccountDetailsPopup', {
			extend : 'Ext.window.Window',
			xtype : 'accountDetailsPopup',
			modal : true,
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
			config : {
				itemId : null,
				seekUrl : null,
				filterVal : null,
				filterVal2 : null,
				columnName : null,
				columnName2 : null
			},
			initComponent : function() {
				var me = this;
				clientListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							pageSize : 5,
							stateful : false,
							showEmptyRow : false,
							showCheckBoxColumn : false,
							padding : '5 0 0 0',
							rowList : _AvailableGridSize,
							minHeight : 150,
							columnModel : [{
								colHeader : me.columnName,
								colId : 'name',
								width : 150
							},{
								colHeader : me.columnName2,
								colId : '',
								width : 150
							}],
							filterVal : me.filterVal,
							filterVal2 : me.filterVal2,
							storeModel : {

								fields : ['name'],

								proxyUrl : '' + me.seekUrl + '.json',
								rootNode : 'd.filter',
								totalRowsNode : 'd.count'
							},
							listeners : {
								render : function(grid) {
									me.handleLoadGridData(grid,
											grid.store.dataUrl, grid.pageSize,
											1, 1, null);
								},
								gridPageChange : me.handleLoadGridData,
								gridSortChange : me.handleLoadGridData,
								gridRowSelectionChange : function(grid, record,
										recordIndex, records, jsonData) {
								}
							}
						});

				me.items = [clientListView];

				me.buttons = [{
							xtype : 'button',
							text : getLabel('cancel', 'Cancel'),
							cls : 'xn-button',
							handler : function() {
								me.close();
							}
						}];

				this.callParent(arguments);
			},
			handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = this;
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,
						sorter);
				if (!Ext.isEmpty(grid.filterVal)) {
					strUrl = strUrl + '&qfilter=' + grid.filterVal + '&qfilter2=' + grid.filterVal2;
				}
				strUrl = strUrl +  '&id=' + encodeURIComponent(parentkey);
				grid.loadGridData(strUrl, null, null, false);
			}
		});
