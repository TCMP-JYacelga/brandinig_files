Ext.define('CPON.view.AccountDetailsPopup', {
			extend : 'Ext.window.Window',
			xtype : 'accountDetailsPopup',
			modal : true,
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
			minWidth : 470,
			minHeight : 156,
			maxHeight : 550,
			cls : 'non-xn-popup',
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
							cls : 't7-grid',
							minHeight : 40,
							maxHeight : 350,
							pageSize : 5,
							stateful : false,
							showEmptyRow : false,
							showCheckBoxColumn : false,
							//padding : '5 0 0 0',
							rowList : [ 5, 10, 15, 20, 25, 30 ],
							columnModel : [{
								colHeader : me.columnName,
								colId : 'name',
								width : 180
							},{
								colHeader : me.columnName2,
								colId : 'value',
								width : 180
							}],
							filterVal : me.filterVal,
							filterVal2 : me.filterVal2,
							storeModel : {

								fields : ['name','value'],

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

				me.bbar = [ '->',{
							xtype : 'button',
							text : getLabel('btnClose', 'Close'),
							//glyph : 'xf056@fontawesome',
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
