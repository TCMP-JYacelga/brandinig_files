Ext.define('GCP.view.ProductDetailsView', {
	extend : 'Ext.panel.Panel',
	xtype : 'packageDetails',
	requires : [ 'Ext.ux.gcp.SmartGrid', 'Ext.data.Store' ],

	initComponent : function() {
		var me = this;
		this.title = me.title;
		var strUrl = 'cpon/clientServiceSetup/productList.json';
		var colModel = me.getColumns();
		adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
			pageSize : 5,
			xtype : 'profileListView',
			itemId : 'profileListView',
			stateful : false,
			showEmptyRow : false,
			showCheckBoxColumn : false,
			padding : '0 0 3 0',
			minHeight : 0,
			columnModel : colModel,
			storeModel : {
				fields : [ 'packageName', 'productCatType', 'productName',
						'accountCount', 'productCode', 'activeFlag',
						'identifier', 'history','packageId'],
				proxyUrl : 'cpon/clientServiceSetup/productList.json',
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
			},
			checkBoxColumnRenderer : function(value, metaData, record,
					rowIndex, colIndex, store, view) {

			}

		});
		adminListView.on('cellclick', function(view, td, cellIndex, record, tr,
				rowIndex, e, eOpts) {
			if (td.className.match('x-grid-cell-col_accountCount')) {

				me.prdCountClicked = record.get('packageId');
				var productDetails = Ext.create('GCP.view.DetailsPopup', {
					title : getLabel('accountName', 'Account Name'),
					columnName : getLabel('accountName', 'Account Name'),
					//height : 300,
					width : 400,
					seekUrl : 'cpon/cponParameterisedDataList/prdAccountList',
					filterVal : me.prdCountClicked,
					layout : {
						type : 'vbox',
						align : 'stretch'
					}
				});
				productDetails.show();
			}
		});
		this.items = [ adminListView ];
		this.callParent(arguments);
	},

	getColumns : function() {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		if (brandingPkgType === 'N') {
			var arrColsPref = [ {
				"colId" : "productName",
				"colDesc" : getLabel("productName","Product Name")
			}, {
				"colId" : "productCatType",
				"colDesc" : getLabel("catType","Type")
			}, {
				"colId" : "packageName",
				"colDesc" : getLabel("defaultpackage","Default Package")
			}, {
				"colId" : "accountCount",
				"colDesc" : getLabel("prodAccounts","Accounts")
			}, {
				"colId" : "activeFlag",
				"colDesc" : getLabel("status","Status")
			} ];
		} else if (brandingPkgType === 'Y') {
			var arrColsPref = [ {
				"colId" : "productName",
				"colDesc" : getLabel("productName","Product Name")
			}, {
				"colId" : "productCatType",
				"colDesc" : getLabel("catType","Type")
			}, {
				"colId" : "packageName",
				"colDesc" : getLabel("defaultpackage","Default Package")
			}, {
				"colId" : "activeFlag",
				"colDesc" : getLabel("status","Status")
			} ];
		}
		if (!Ext.isEmpty(arrColsPref)) {
			for ( var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}

				cfgCol.width = 120;
				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);

			}
		}
		return arrCols;
	},

	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		if (colId === 'col_accountCount') {
			strRetValue = '<span class="activitiesLink underlined">' + value
					+ '</span>';
		} else {
			strRetValue = value;
		}
		if (record.raw.isUpdated === true)
			strRetValue = '<span class="color_change">' + strRetValue
					+ '</span>';
		return strRetValue;
	},

	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + '&id=' + encodeURIComponent(parentkey);
		grid.loadGridData(strUrl, null, null, false);
	}
});
