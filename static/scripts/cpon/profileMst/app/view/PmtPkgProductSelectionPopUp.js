Ext.define('GCP.view.PmtPkgProductSelectionPopUp', {
	extend : 'Ext.window.Window',
	xtype : 'pmtPkgProductSelectionPopUp',
	requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
	width : 650,
	maxWidth : 750,
	//height : 300,
	minHeight : 156,
	maxHeight : 550,
	cls : 'non-xn-popup',
	modal : true,
	draggable : false,
	resizable : false,
	closeAction : 'destroy',
	searchVal : '',
	config : {
		fnCallback : null,
		profileId : null,
		featureType : null,
		module : null,
		title : null
	},
	listeners : {
				'resize' : function(){
					this.center();
				}
			},

	initComponent : function() {
		var me = this;
		this.title = me.title;

		var strUrl = 'cpon/pmtPmtPkgProfileProducts.json'

		var colModel = me.getColumns();

		adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
					showPager : true,					
					xtype : 'selectProductsView',
					itemId : 'selectProductsId',
					stateful : false,
					showEmptyRow : false,
					pageSize : 30,
					showCheckBoxColumn : true,
					hideRowNumbererColumn : true,
					checkBoxColumnWidth : 40,
					cls:'t7-grid',
					minHeight : 40,
					maxHeight : 390,
					scroll : 'vertical',
					width : 'auto',
					columnModel : colModel,
					storeModel : {
						fields : ['productCode', 'productDesc', 'identifier',
								'instCode'],
						proxyUrl : strUrl,
						rootNode : 'd.profileDetails',
						totalRowsNode : 'd.__count'
					},
					listeners : {
						render : function(grid) {
							me.handleLoadGridData(grid, grid.store.dataUrl,
									grid.pageSize, 1, 1, null);
						},
						gridPageChange : me.handleLoadGridData,
						gridSortChange : me.handleLoadGridData,
						gridRowSelectionChange : function(grid, record,
								recordIndex, records, jsonData) {
						}
					},
					checkBoxColumnRenderer : function(value, metaData, record,
							rowIndex, colIndex, store, view) {

					}

				});

		this.items = [{
					xtype : 'panel',
					cls:'ft-padding-bottom',
					layout : 'hbox',
					items : [{
								xtype : 'textfield',
								itemId : 'searchPrdText',
								//fieldLabel : getLabel('prdName', 'Product Name'),
								labelCls : 'frmLabel',
								fieldCls: 'textfield-input',
								height : 30,
								width : 200,
								emptyText : getLabel("packProfSearchProduct","Search by Product Code"),
								labelSeparator : '',
								labelAlign : 'left',
								listeners : {
									change : function(field, newValue) {
										field.setValue(newValue.toUpperCase());
									}
								}
							}, {
								xtype : 'button',
								text : getLabel('filter', 'Filter'),
								itemId : 'btnFilterPrd',
								cls : 'ft-button-primary',
								margin : '3 0 0 12'
							}]
				}, adminListView];
		this.bbar = [{
					xtype : 'button',
					text : getLabel('cancel', 'Cancel'),
					itemId : 'btnCancelSelectProduct',
					handler : function() {
						me.close();
					}
				},'->', {
					xtype : 'button',
					text : getLabel('btndone', 'Done'),
					itemId : 'btnOkSelectProduct'
				}];
		this.callParent(arguments);
	},

	getColumns : function() {
		arrColsPref = [{
					"colId" : "productCode",
					"colDesc" : getLabel("packProfProductcode","Product Code")
				}, {
					"colId" : "productDesc",
					"colDesc" : getLabel("packProfProductDesc","Product Desc")
				}];
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				cfgCol.width = 160;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},

	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = grid.up('pmtPkgProductSelectionPopUp');
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		var instQuery = '';		
		productCatCode = $('#paymentType').find('option:selected').val();
		
		if (productCatCode) {
			if (productCatCode == 'Mixed' || productCatCode == 'MIXED') productCatCode = "%25";
		} else {
			productCatCode = "%25";
		}
		if (!Ext.isEmpty(me.searchVal)) {
			instQuery = Ext.String.format(
					"product_code_dtl lk '{0}' ", me.searchVal);
			strUrl = strUrl + '&$filter=' + instQuery;
		}
		strUrl = strUrl + '&$prodCat=' + productCatCode +'&$parentId=' + parentRecKey ;
		grid.loadGridData(strUrl, null,null,false);
	},
	setSearchValue : function(textValue) {
		var me = this;
		me.searchVal = textValue;
	}
});