Ext.define('CPON.view.DetailsProductPopup', {
	extend : 'Ext.window.Window',
	xtype : 'detailProductListPopupView',
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
		var colModel = me.getColumns();
		
		detailProductListView = Ext.create('Ext.ux.gcp.SmartGrid', {
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
			columnModel : colModel,
			filterVal : me.filterVal,
			filterVal2 : me.filterVal2,
			storeModel : {

				fields : [ 'packageName','activeFlag' ],

				proxyUrl : '' + me.seekUrl + '.json',
				rootNode : 'd.accounts',
				totalRowsNode : 'd.__count'
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

		me.items = [ detailProductListView ];

		me.bbar = [ '->',{
			xtype : 'button',
			text : getLabel('btnClose', 'Close'),
			handler : function() {
				me.close();
			}
		}];

		this.callParent(arguments);
	},
	getColumns : function() {
		arrColsPref = [{
					"colId" : "packageName",
					"colDesc" : getLabel('pkgName','Payment Package Name')
				},
				{
					"colId" : "activeFlag",
					"colDesc" : getLabel('productStatus','Product Status')
				}
				];
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				cfgCol.width = 200;
				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		
		return arrCols;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = value ;
		if (colId === 'col_activeFlag') {
			if(value == 'Y')
			{
				strRetValue = getLabel('active','Active');
			}
			else
			{
				strRetValue = getLabel('inactive','Inactive');
			}
		}
		return strRetValue;
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		if (!Ext.isEmpty(grid.filterVal)) {
			strUrl = strUrl + '&$filter=' + grid.filterVal;
		}
		strUrl = strUrl + '&id=' + encodeURIComponent(parentkey);
		grid.loadGridData(strUrl, null, null, false);
	}
});
