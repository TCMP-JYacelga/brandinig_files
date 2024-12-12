Ext.define('GCP.view.ClientPackageDetailsView', {
			extend : 'Ext.panel.Panel',
			xtype : 'packageDetails',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
			config : {
				prdCountClicked : ''
			},
			initComponent : function() {
				var me = this;
				this.title = me.title;
				var strUrl = 'cpon/clientServiceSetup/paymentList.json';
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
					fields : ['packageName', 'productCatType', 'productCount',
							'accountCount', 'reportProfileId','packageId',
							'alertProfileId', 'activeFlag', 'identifier',
							'history','companyId'],
					proxyUrl : 'cpon/clientServiceSetup/paymentList.json',
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
						var productDetails = Ext.create(
								'GCP.view.DetailsPopup', {
									title : getLabel('productName',
											'Product Name'),
									height : 300,
									columnName : getLabel('productName',
										'Product Name'),
									width : 400,
									seekUrl : 'cpon/cponParameterisedDataList/productList',
									filterVal : me.prdCountClicked,
									layout : {
										type : 'vbox',
										align : 'stretch'
									}
								});
						productDetails.show();
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
				if(brandingPkgType === 'N'){
				var arrColsPref = [{
								"colId" : "packageName",
								"colDesc" : getLabel("payMethod","Payment Method")
							}, {
								"colId" : "productCatType",
								"colDesc" : getLabel("paymentType","Type")
							}, {
								"colId" : "productCount",
								"colDesc" : getLabel("paymentproducts","Products"),
								"colType" : "number"
							}, {
								"colId" : "accountCount",
								"colDesc" : getLabel("paymentaccounts","Accounts"),
								"colType" : "number"
							},{
								"colId" : "companyId",
								"colDesc" : getLabel("companyid","Company ID"),
								"colType" : "number"
							}, {
								"colId" : "activeFlag",
								"colDesc" : getLabel("lblstatus","Status")
						}];}
				else if(brandingPkgType === 'Y'){
				var arrColsPref = [{
							"colId" : "packageName",
							"colDesc" : getLabel("payMethod","Payment Method")
						}, {
							"colId" : "productCatType",
							"colDesc" : getLabel("paymentType","Type")
						}, {
							"colId" : "productCount",
							"colDesc" : getLabel("paymentproducts","Products"),
							"colType" : "number"
						}, {
							"colId" : "activeFlag",
							"colDesc" : getLabel("lblstatus","Status")
						}];}		
						
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
		if (colId === 'col_productCount'){
			strRetValue = '<span class="activitiesLink underlined">'+value+'</span>';
		}
		else if (colId === 'col_accountCount'){
			strRetValue = '<span class="activitiesLink underlined">'+value+'</span>';
		}
		else if (colId === 'col_companyId') 
		{
			if (!record.get('isEmpty') && !Ext.isEmpty(record.get('productCatType')) && "ACH" == record.get('productCatType'))
			{
					if (value != null && value > 0)
						strRetValue = '<span class="underlined">' + value + '</span>'
								+ '<span class="smallpadding_lr text_skyblue">..'
								+ getLabel('edit', 'Edit') + '</span>';
					else
						strRetValue = '<span class="underlined">0</span>'
								+ '<span class="smallpadding_lr red">..'
								+ getLabel('select', 'Select') + '</span>';
			}
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
				grid.loadGridData(strUrl, null, null, false);
			}
		});
