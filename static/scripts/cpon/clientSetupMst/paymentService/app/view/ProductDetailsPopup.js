Ext.define('CPON.view.ProductDetailsPopup', {
	extend : 'Ext.window.Window',
	xtype : 'productDetailsPopup',
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
			pageSize : 5,
			stateful : false,
			showEmptyRow : false,
			showCheckBoxColumn : false,
			padding : '5 0 0 0',
			rowList : [ 5, 10, 15, 20, 25, 30 ],
			minHeight : 150,
			columnModel : [ {
				colHeader : me.columnName,
				colId : 'useSingleName',
				width : 350
			} ],
			filterVal : me.filterVal,
			storeModel : {
				fields : [ 'useSingleName' ],
				proxyUrl : '' + me.seekUrl + '.json',
				rootNode : 'd.accounts',
				totalRowsNode : 'd.count'
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
			cls : 'xn-button ux_button-background-color ux_cancel-button',
			glyph : 'xf056@fontawesome',
			handler : function() {
				me.close();
			}
		} ];

		this.callParent(arguments);
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		if (!Ext.isEmpty(grid.filterVal)) {
			strUrl = strUrl + '&qfilter=' + grid.filterVal;
		}
		strUrl = strUrl + '&id=' + encodeURIComponent(parentkey);
		grid.loadGridData(strUrl, null, null, false);
	}
});
