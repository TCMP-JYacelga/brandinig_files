Ext.define('GCP.view.ProductDetailsView', {
	extend : 'Ext.panel.Panel',
	xtype : 'packageDetails',
	requires : [ 'Ext.ux.gcp.SmartGrid', 'Ext.data.Store' ],
	config : {
		module : null
	},
	initComponent : function() {
		var me = this;
		this.title = me.title;
		var strUrl = 'cpon/clientServiceSetup/productList.json';
		var colModel = me.getColumns();
		
		var strUrl = '';
		if('02' == me.module)
		{
			strUrl = 'cpon/clientServiceSetup/productList.json';
		}
		if('05' == me.module)
		{
			strUrl = 'cpon/clientServiceSetup/collProductList.json';
		}
		adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
			pageSize : _GridSizeMaster,
			xtype : 'profileListView',
			itemId : 'profileListView',
			stateful : false,
			showEmptyRow : false,
			showCheckBoxColumn : false,
			padding : '0 0 3 0',
			rowList : _AvailableGridSize,
			minHeight : 0,
			columnModel : colModel,
			storeModel : {
				fields : [ 'packageName', 'productCatType', 'productName','useSingleName','paymentPackageName',
						'accountCount', 'productCode', 'activeFlag','pkgCount','arrangment','creditLine',
						'identifier', 'ccyCode','history','packageId'],
				proxyUrl : strUrl,
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
			if (td.className.match('x-grid-cell-col_accountCnt')) {

				me.prdCountClicked = record.get('packageId');
				var productDetails = Ext.create('GCP.view.DetailsPopup', {
					title : getLabel('accountName', 'Account Name'),
					columnName : getLabel('accountName', 'Account Name'),
					//height : 300,
					width : 400,
					seekUrl : '02' == me.module ? 'cpon/cponParameterisedDataList/prdAccountList' : 'cpon/cponParameterisedDataList/collPrdAccountList',
					filterVal : me.prdCountClicked,
					layout : {
						type : 'vbox',
						align : 'stretch'
					}
				});
				productDetails.show();
			} else if (td.className.match('x-grid-cell-col_pkgCount')) {
				me.pkgCountClicked = record.get('productCode');
				var productDetails = Ext.create('GCP.view.DetailsPopup', {
					title : getLabel('collectionMethodName','Receivables Package Name'),
					columnName : getLabel('collectionMethodName','Receivables Package Name'),
					//height : 300,
					width : 400,
					seekUrl : 'cpon/cponParameterisedDataList/updateCollProductList',
					filterVal : me.pkgCountClicked,
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
		var arrColsPref = null;
		if (brandingPkgType === 'N') {
			var colhdrDeflt ;
			if('02' == me.module)
			{
				colhdrDeflt= getLabel("defMethodCnt","Default Payment Package");
			}
			if('05' == me.module)
			{
				colhdrDeflt= getLabel("defCollMethodCnt","Default Receivables Package");
			}			
			if('02' == me.module) {
				arrColsPref = [ {
					"colId" : "productName",
					"colDesc" : getLabel("productName","Product Name")
				},{
					"colId" : "ccyCode",
					"colDesc" : getLabel("CcyCode","Currency")
				}, {
					"colId" : "productCatType",
					"colDesc" : getLabel("catType","Type")
				}, 
				{
					"colId" : "activeFlag",
					"colDesc" : getLabel("status","Status")
				}, {
					"colId" : "packageName","colDesc" : colhdrDeflt
				} ];
			}
			if('05' == me.module) {
				arrColsPref = [ {
					"colId" : "productName",
					"colDesc" : getLabel("productName","Product Name")
				}, {
					"colId" : "ccyCode",
					"colDesc" : getLabel("CcyCode","Currency")
				},{
					"colId" : "productCatType",
					"colDesc" : getLabel("rcvType","Type")
				}, {
					"colId" : "pkgCount","colDesc" : 'Package Count'
				}, {
					"colId" : "arrangment","colDesc" : 'Arrangment'
				}, {
					"colId" : "creditLine",
					"colDesc" : getLabel("creditLines", "Credit Lines")
				}, {
					"colId" : "activeFlag",
					"colDesc" : getLabel("status","Status")
				} ];
			}
		} else if (brandingPkgType === 'Y') {
			if('02' == me.module) {
				arrColsPref = [ {
					"colId" : "productName",
					"colDesc" : getLabel("productName","Product Name")
				},  {
					"colId" : "ccyCode",
					"colDesc" : getLabel("CcyCode","Currency")
				},{
					"colId" : "productCatType",
					"colDesc" : getLabel("catType","Type")
				}, {
					"colId" : "packageName",
					"colDesc" : getLabel("defMethodCnt","Default Payment Package")
				}, {
					"colId" : "activeFlag",
					"colDesc" : getLabel("status","Status")
				} ];
			}
			if('05' == me.module) {
				arrColsPref = [ {
					"colId" : "productName",
					"colDesc" : getLabel("productName","Product Name")
				}, {
					"colId" : "ccyCode",
					"colDesc" : getLabel("CcyCode","Currency")
				}, {
					"colId" : "productCatType",
					"colDesc" : getLabel("rcvType","Type")
				}, {
					"colId" : "pkgCount","colDesc" : 'Package Count'
				}, {
					"colId" : "arrangment","colDesc" : 'Arrangment'
				}, {
					"colId" : "creditLine",
					"colDesc" : getLabel("creditLines", "Credit Lines")
				}, {
						"colId" : "activeFlag",
						"colDesc" : getLabel("status","Status")
				} ];
			}
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
				if (!Ext.isEmpty(objCol.colId)) {
					if (objCol.colId === "packageName")
						cfgCol.width = 180;
				}
				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);

			}
		}
		return arrCols;
	},

	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		if(colId == 'col_activeFlag') {
			if (!Ext.isEmpty(record.get('activeFlag')) && "Y" == record.get('activeFlag'))
			{
				strRetValue = getLabel('active','Active');
			}
			else if (!Ext.isEmpty(record.get('activeFlag')) && "N" == record.get('activeFlag'))
			{
				strRetValue = getLabel('inactive','Inactive');
			}
		} else
		if (colId === 'col_accountCnt') {
			strRetValue = '<span class="activitiesLink underlined cursor_pointer">' + record.data.accountCount
					+ '</span>';
		} else if (colId === 'col_pkgCount') {
			strRetValue = '<span class="activitiesLink underlined cursor_pointer">' + value
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
		grid.loadGridData(strUrl, me.enableEntryButtons, null, false);
	},
	enableEntryButtons:function(){
		gridCountAfterRender++;
		enableDisableGridButtons(false);
	}
});
