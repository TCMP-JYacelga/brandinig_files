Ext.define('GCP.view.CollectionPkgProductSelectionPopUp', {
	extend : 'Ext.window.Window',
	xtype : 'collectionPkgProductSelectionPopUp',
	requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
	width : 450,
	minHeight : 156,
	maxHeight : 550,
	cls : 'non-xn-popup',
	modal : true,
	draggable : false,
	resizable : false,
	closeAction : 'destroy',
	autoScroll : true,
	searchVal : '',
	config : {
		fnCallback : null,
		profileId : null,
		featureType : null,
		module : null,
		title : null
	},
	listeners : {
		resize : function(){
			this.center();
		}
	},
	initComponent : function() {
		var me = this;
		this.title = me.title;

		var strUrl = 'cpon/collectionMethodProfileProducts.json'

		var colModel = me.getColumns();

		var adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
					showPager : false,
					showAllRecords : true,
					xtype : 'selectProductsView',
					itemId : 'selectProductsId',
					stateful : false,
					showEmptyRow : false,
					showCheckBoxColumn : true,
					checkBoxColumnWidth : _GridCheckBoxWidth,
					minHeight : 50,
					maxHeight : 350,
					cls : 't7-grid',
					scroll : 'vertical',
					hideRowNumbererColumn : true,
					columnModel : colModel,
					storeModel : {
						fields : ['productCode','ccyCode', 'productDesc', 'identifier',
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
								height : 30,
								width : 200,
								emptyText : getLabel("searchByProductCode","Search by Product Name"),
								labelCls : 'ux_font-size14',
								cls : 'ft-extraLargeMarginR',
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
								cls : 'ft-button-primary'
							}]
				}, adminListView];
		/*this.buttons = [{
					xtype : 'button',
					text : getLabel('done', 'done'),
					itemId : 'btnOkSelectProduct',
					glyph : 'xf058@fontawesome',
					cls : 'ux_button-background-color ux_button-padding'
				}, {
					xtype : 'button',
					text : getLabel('cancel', 'Cancel'),
					itemId : 'btnCancelSelectProduct',
					glyph : 'xf056@fontawesome',
					cls : 'ux_button-background-color ux_button-padding',
					handler : function() {
						me.close();
					}
				}];*/
		this.bbar = [{
			xtype : 'button',
			text : getLabel('cancel', 'Cancel'),
			itemId : 'btnCancelSelectProduct',
			//glyph : 'xf056@fontawesome',
			//cls : 'ux_button-background-color ux_button-padding',
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
		var arrColsPref = [{
					"colId" : "productDesc",
					"colDesc" : getLabel("collProductCode","Product Code")
				},
				{
					"colId" : "ccyCode",
					"colDesc" : getLabel("ccyCode","Currency")
				
				}];
		var arrCols = new Array(), objCol = null, cfgCol = null;
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				cfgCol.width = 120;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},

	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = grid.up('collectionPkgProductSelectionPopUp');
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		var instQuery = '';		
		productCatCode = $('#productCatType').find('option:selected').val();
		
		if (productCatCode) {
			if (productCatCode == 'Mixed' || productCatCode == 'MIXED') productCatCode = "%25";
			if (productCatCode == '%') productCatCode = "%25";
		} else {
			productCatCode = "%25";
		}
		if (!Ext.isEmpty(me.searchVal)) {
			instQuery = Ext.String.format(
					"productDescUpper lk '{0}' ", me.searchVal);
			strUrl = strUrl + '&$filter=' + instQuery;
		}
		strUrl = strUrl + '&$prodCat=' + productCatCode +'&$parentId=' + parentRecKey ;
		grid.loadGridData(strUrl, null,null,true);
	},
	setSearchValue : function(textValue) {
		var me = this;
		me.searchVal = textValue;
	}
});