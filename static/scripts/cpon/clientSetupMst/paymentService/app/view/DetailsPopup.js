Ext.define('CPON.view.DetailsPopup', {
	extend : 'Ext.window.Window',
	xtype : 'detailListPopupView',
	modal : true,
	requires : [ 'Ext.ux.gcp.SmartGrid', 'Ext.data.Store' ],
	minWidth : 650,
	width : 650,
	//maxWidth : 735,
	autoHeight : true,
	minHeight : 156,
	maxHeight : 550,
	draggable : false,
	resizable : false,
	cls : 'non-xn-popup',
	config : {
		itemId : null,
		seekUrl : null,
		filterVal : null,
		filterVal2 : null,
		columnName : null
	},
	listeners : {
		'resize' : function(){
			this.center();
		}
	},
	initComponent : function() {
		var me = this;
		clientListView = Ext.create('Ext.ux.gcp.SmartGrid', {
			cls : 't7-grid',
			scroll : 'vertical',
			height: 'auto',
			minHeight : 40,
			maxHeight : 400,
			pageSize : 5,
			stateful : false,
			showEmptyRow : false,
			showCheckBoxColumn : false,
			rowList : [ 5, 10, 15, 20, 25, 30 ],
			columnModel : [ {
				colHeader : me.columnName,
				colId : 'name',
				width : 268
			} ],
			filterVal : me.filterVal,
			filterVal2 : me.filterVal2,
			storeModel : {

				fields : [ 'name' ],

				proxyUrl : '' + me.seekUrl + '.json',
				rootNode : 'd.filter',
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

		me.bbar = [ '->',{
			xtype : 'button',
			text : getLabel('btnClose', 'Close'),
			handler : function() {
				me.close();
			}
		}];

		this.callParent(arguments);
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		if (!Ext.isEmpty(grid.filterVal)) {
			strUrl = strUrl + '&qfilter=' + grid.filterVal;
		}
		if (!Ext.isEmpty(grid.filterVal2)) {
			strUrl = strUrl + '&qfilter2=' + grid.filterVal2;
		}
		strUrl = strUrl + '&id=' + encodeURIComponent(parentkey);
		grid.loadGridData(strUrl, null, null, false);
	}
});
