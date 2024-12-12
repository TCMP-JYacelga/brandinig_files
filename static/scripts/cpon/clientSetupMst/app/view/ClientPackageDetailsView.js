Ext.define('GCP.view.ClientPackageDetailsView', {
			extend : 'Ext.panel.Panel',
			xtype : 'packageDetails',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
			config : {
				prdCountClicked : '',
				module : null
			},
			initComponent : function() {
				var me = this;
				this.title = me.title;
				var strUrl = 'cpon/clientServiceSetup/paymentList.json';
				var productSeekUrl = 'cpon/cponParameterisedDataList/productList';
				var colModel = me.getColumns();
				
				var strUrl = '';
				if('02' == me.module)
				{
					strUrl = 'cpon/clientServiceSetup/paymentList.json';
					productSeekUrl = 'cpon/clientServiceSetup/packageProductList';
				}
				if('05' == me.module)
				{
					strUrl = 'cpon/clientServiceSetup/collectionList.json';
					productSeekUrl = 'cpon/cponParameterisedDataList/collProductList';
				}
				adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							pageSize : _GridSizeMaster,
							xtype : 'profileListView',
							itemId : 'profileListView',
							stateful : false,
							showEmptyRow : false,
							showCheckBoxColumn : false,
							rowList :_AvailableGridSize,
							padding : '0 0 3 0',
							minHeight : 0,
							columnModel : colModel,
							storeModel : {
					fields : ['packageName', 'productCatType', 'productCount',
							'accountCount', 'reportProfileId','packageId',
							'alertProfileId', 'activeFlag', 'identifier',
							'history','companyId', 'useForDataEntry', 'useForTemplate',
							'useForSI', 'useForImport','productCategoryDesc'],
					proxyUrl : strUrl,
					rootNode : 'd.accounts',
					totalRowsNode : 'd.__count'
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
							},
							checkBoxColumnRenderer : function(value, metaData,
									record, rowIndex, colIndex, store, view) {

							}

						});
				adminListView.on('cellclick', function(view, td, cellIndex, record,
						tr, rowIndex, e, eOpts) {
					if (td.className.match('x-grid-cell-col_productCount')) {
						me.prdCountClicked = record.get('packageId');
		
						if('02' == me.module)
						{
							var productDetails = Ext.create(
									'GCP.view.DetailsAssignedPopup', {
										title : getLabel('productName',
												'Product Name'),
										height : 300,
										columnName : getLabel('assignedProduct',
											'Assign Product'),
										width : 400,
										seekUrl : productSeekUrl,
										filterVal : me.prdCountClicked,
										layout : {
											type : 'vbox',
											align : 'stretch'
										}
									});
							productDetails.show();
						}
						if('05' == me.module)
						{
							var productDetails = Ext.create(
									'GCP.view.DetailsPopup', {
										title : getLabel('productName',
												'Product Name'),
										height : 300,
										columnName : getLabel('productName',
											'Product Name'),
										width : 400,
										seekUrl : productSeekUrl,
										filterVal : me.prdCountClicked,
										layout : {
											type : 'vbox',
											align : 'stretch'
										}
									});
							productDetails.show();
						}
					
					} else if (td.className.match('x-grid-cell-col_accountCount')) {
							
							me.prdCountClicked = record.get('packageId');
							var accDetails = Ext.create(
									'GCP.view.DetailsPopup', {
										title : getLabel('accountName',
										'Account Name'),
								height : 300,
								columnName : getLabel('accountName',
									'Account Name'),
								width : 400,
								seekUrl : 'cpon/cponParameterisedDataList/pkgAccountList',
								filterVal : me.prdCountClicked,
								layout : {
									type : 'vbox',
									align : 'stretch'
								}
									});
						accDetails.show();
					}
				});
				this.items = [adminListView];
				this.callParent(arguments);
			},

			getColumns : function() {
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
				var arrColsPref = null;
				if(brandingPkgType === 'N'){
					if('02' == me.module)
					{
						if(companyIdFeaturePresent == 'true')
						{
							
							arrColsPref = [{
								"colId" : "packageName",
								"colDesc" : getLabel("payMethod","Payment Package")
							}, {
								"colId" : "productCategoryDesc",
								"colDesc" : getLabel("paymentType","Type")
							}, {
								"colId" : "productCount",
								"colDesc" : getLabel("paymentproducts","Products"),
								"colType" : "number"
							}, {
								"colId" : "useForDataEntry",
								"colDesc" : getLabel("useForPayment","Uer for Payment"),
								"sort" :false
							},  {
								"colId" : "useForTemplate",
								"colDesc" : getLabel("useForTemplate","Use for Template"),
								"sort" :false
							},   {
								"colId" : "useForSI",
								"colDesc" : getLabel("useForSI","Use for Recurring Payment"),
								"sort" :false
							},  {
								"colId" : "useForImport",
								"colDesc" : getLabel("useForImport","User for Import"),
								"sort" :false
							}, {
								"colId" : "activeFlag",
								"colDesc" : getLabel("lblstatus","Status")
							}
						];
						}
						else
						{
							arrColsPref = [{
								"colId" : "packageName",
								"colDesc" : getLabel("payMethod","Payment Package")
							}, {
								"colId" : "productCategoryDesc",
								"colDesc" : getLabel("paymentType","Type")
							}, {
								"colId" : "productCount",
								"colDesc" : getLabel("paymentproducts","Products"),
								"colType" : "number"
							}, {
								"colId" : "useForDataEntry",
								"colDesc" : getLabel("useForPayment","Uer for Payment"),
								"sort" :false
							},  {
								"colId" : "useForTemplate",
								"colDesc" : getLabel("useForTemplate","Use for Template"),
								"sort" :false
							},   {
								"colId" : "useForSI",
								"colDesc" : getLabel("useForSI","Use for Recurring Payment"),
								"sort" :false
							},  {
								"colId" : "useForImport",
								"colDesc" : getLabel("useForImport","User for Import"),
								"sort" :false
							}, {
								"colId" : "activeFlag",
								"colDesc" : getLabel("lblstatus","Status")
							}];
						}
					}
					if('05' == me.module)
					{	
						arrColsPref = [{
							"colId" : "packageName",
							"colDesc" : getLabel("collMethod","Receivables Package")
						}, {
							"colId" : "productCatType",
							"colDesc" : getLabel("rcvType","Receivables Type")
						}, {
							"colId" : "productCount",
							"colDesc" : getLabel("paymentproducts","Products"),
							"colType" : "number"
						}, {
							"colId" : "activeFlag",
							"colDesc" : getLabel("lblstatus","Status")
						}];						
					}
				}
				else if(brandingPkgType === 'Y'){
					if('05' === me.module){
						arrColsPref = [{
									"colId" : "packageName",
									"colDesc" : getLabel("payMethod","Payment Package")
								}, {
									"colId" : "productCategoryDesc",
									"colDesc" : getLabel("paymentType","Type")
								}, {
									"colId" : "productCount",
									"colDesc" : getLabel("paymentproducts","Products"),
									"colType" : "number"
								}, {
									"colId" : "activeFlag",
									"colDesc" : getLabel("lblstatus","Status")
								}];
							}
							else{
						arrColsPref = [{
									"colId" : "packageName",
									"colDesc" : getLabel("payMethod","Payment Package")
								}, {
									"colId" : "productCategoryDesc",
									"colDesc" : getLabel("paymentType","Type")
								}, {
									"colId" : "productCount",
									"colDesc" : getLabel("paymentproducts","Products"),
									"colType" : "number"
								}, {
									"colId" : "useForDataEntry",
									"colDesc" : getLabel("useForPayment","Uer for Payment"),
									"sort" :false
								},  {
									"colId" : "useForTemplate",
									"colDesc" : getLabel("useForTemplate","Use for Template"),
									"sort" :false
								},   {
									"colId" : "useForSI",
									"colDesc" : getLabel("useForSI","Use for Recurring Payment"),
									"sort" :false
								},  {
									"colId" : "useForImport",
									"colDesc" : getLabel("useForImport","User for Import"),
									"sort" :false
								}, {
									"colId" : "activeFlag",
									"colDesc" : getLabel("lblstatus","Status")
								}];
							}
					}
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
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
		if(colId == 'col_activeFlag') {
		if (!Ext.isEmpty(record.get('activeFlag')) && "Y" == record.get('activeFlag'))
		{
			strRetValue = getLabel('active','Active');
		}
		else if (!Ext.isEmpty(record.get('activeFlag')) && "N" == record.get('activeFlag'))
		{
			strRetValue = getLabel('inactive','Inactive');
		}
		}else if (colId === 'col_productCount'){
			strRetValue = '<span class="activitiesLink underlined cursor_pointer">'+value+'</span>';
		}
		else if (colId === 'col_accountCount'){
			strRetValue = '<span class="activitiesLink underlined cursor_pointer">'+value+'</span>';
		}
		else if (colId === 'col_companyId') 
		{
			if (!record.get('isEmpty') && !Ext.isEmpty(record.get('productCatType')) && "ACH" == record.get('productCatType'))
			{
					if (value != null && value > 0)
						strRetValue = '<span class="underlined">' + value + '</span>';
					else
						strRetValue = '<span class="underlined">0</span>';
			}
		}
		else if(colId === 'col_useForDataEntry'){
			strRetValue = 'Y' === record.get('useForDataEntry') ? getLabel('yes', 'Yes') : getLabel('no', 'No');
		}
		else if(colId === 'col_useForTemplate'){
			strRetValue = 'Y' === record.get('useForTemplate') ? getLabel('yes', 'Yes') : getLabel('no', 'No');
		}
		else if(colId === 'col_useForSI'){
			strRetValue = 'Y' === record.get('useForSI') ? getLabel('yes', 'Yes') : getLabel('no', 'No');
		}
		else if(colId === 'col_useForImport'){
			strRetValue = 'Y' === record.get('useForImport') ? getLabel('yes', 'Yes') : getLabel('no', 'No');
		}
		else {
			strRetValue = value;
		}
		if(record.raw.isUpdated === true)
			strRetValue='<span class="color_change">'+strRetValue+'</span>';
		return strRetValue;
	},
			
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo,
			sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,
				sorter);
		strUrl = strUrl + '&id='+encodeURIComponent(parentkey);
		grid.loadGridData(strUrl, me.enableEntryButtons, null, false);
	},
	enableEntryButtons:function(){
		gridCountAfterRender++;
		enableDisableGridButtons(false);
	}
});
