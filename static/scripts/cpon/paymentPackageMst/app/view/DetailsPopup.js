Ext.define('GCP.view.DetailsPopup', {
	extend : 'Ext.window.Window',
	xtype : 'detailListPopupView',
	modal : true,
	requires : [ 'Ext.ux.gcp.SmartGrid', 'Ext.data.Store' ],
	config : {
		itemId : null,
		seekUrl : null,
		filterVal : null,
		columnName : null
	},
	initComponent : function() {
		var me = this;
		clientListView = Ext.create('Ext.ux.gcp.SmartGrid', {
			pageSize :5,
			showAllRecords:false,
			stateful : false,
			showEmptyRow : false,
			showCheckBoxColumn : false,
			padding : '5 0 0 0',
			rowList : [ 5, 10, 15, 20, 25, 30 ],
			minHeight : 150,
			columnModel : [ {
				colHeader : me.columnName,
				colId : 'productDescription',
				width : 330
			} ],
			filterVal : me.filterVal,
			storeModel : {

				fields : [ 'productDescription' ],

				proxyUrl : '' + me.seekUrl + '.json',
				rootNode : 'd.profileDetails',
				totalRowsNode : 'd.__count'
			},
			handleRowIconClick : function(tableView, rowIndex,
							columnIndex, btn, event, record) {
						me.handleRowIconClick(tableView, rowIndex, columnIndex,
								btn, event, record);
					},
			listeners : {
				render : function(grid) {
					me.handleLoadGridData(grid, grid.store.dataUrl,
							grid.pageSize, 1, 1, null);
				},
				gridPageChange : me.handleLoadGridData,
				gridSortChange : me.handleLoadGridData,
				gridRowSelectionChange : function(grid, record, recordIndex,
						records, jsonData) {
				}
			}
		});

		me.items = [ clientListView ];

		me.buttons = [ {
			xtype : 'button',
			text : getLabel('cancel', 'Cancel'),
			cls : 'xn-button',
			handler : function() {
				me.close();
			}
		} ];

		this.callParent(arguments);
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		var isFilterApplied = false;
		var strFilter = '&$filter=' +'package_id eq'+"'"+grid.filterVal+"'";   
		strUrl = strUrl +strFilter;
		/*if (!Ext.isEmpty(grid.filterVal)) {
			strUrl = strUrl + '&$qfilter=' + grid.filterVal;
		}*/
		//console.log(parentkey)
		//strUrl = strUrl + '&id=' + encodeURIComponent(parentkey);
		grid.loadGridData(strUrl,null);
	}
});
