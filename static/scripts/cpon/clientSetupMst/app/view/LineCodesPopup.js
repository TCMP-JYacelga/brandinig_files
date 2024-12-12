var selectedArray = new Array();
var productCcyCode = null;
Ext.define('GCP.view.LineCodesPopup', {
	extend : 'Ext.window.Window',
	xtype : 'lineCodesPopup',
	requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store',
			'Ext.ux.gcp.AutoCompleter'],
	width : 600,
	minHeight : 156,
	maxHeight : 550,
	overflowX : 'hidden',
	autoHeight : true,
	modal : true,
	resizable : false,
	draggable : false,
	cls : 'non-xn-popup',
	closeAction : 'hide',
	autoScroll : true,
	title : getLabel('creditLine', 'Credit Line'),
	config : {
		fnCallback : null,
		profileId : null,
		featureType : null,
		module : null
	},
	listeners : {
		resize : function(){
			this.center();
		}
	},
	initComponent : function() {
		var me = this;
		var colModel = me.getColumns();
		var cancelButton, submitButton;
		var buttonArray = new Array();
   clearNameLink = Ext.create('Ext.Component',{
					layout : 'hbox',
					itemId : 'clearNameLink',
					hidden : true,
					cls : 'clearlink-a cursor_pointer page-content-font ft-padding-l',
					html: '<a>Clear</a>',
					listeners: {
						'click': function() {
							var filterContainer = me.down('[itemId="nameFilter"]');
							filterContainer.setValue("");
							var selected = me.down('component[itemId="clearNameLink"]');
							selected.hide();
						},
						element: 'el',
						delegate: 'a'
					}
				});
				
				clearCurrLink = Ext.create('Ext.Component',{
					layout : 'hbox',
					itemId : 'clearCurrLink',
					hidden : true,
					cls : 'clearlink-a cursor_pointer page-content-font ft-padding-l ',
					html: '<a>Clear</a>',
					listeners: {
						'click': function() {
							var filterContainer = me.down('[itemId="currFilter"]');
							filterContainer.setValue("");
							var selected = me.down('component[itemId="clearCurrLink"]');
							selected.hide();
						},
						element: 'el',
						delegate: 'a'
					}
				});
				nameFilterfield = Ext.create('Ext.ux.gcp.AutoCompleter', {
					fieldCls : 'xn-form-text xn-suggestion-box popup-searchBox',
					itemId : 'nameFilter',
					fieldLabel : getLabel('creditLine', 'Credit Line Name'),
					labelAlign : 'top',
					emptyText : getLabel('searchByCreditName','Search by Name'),
					cfgUrl : 'cpon/cponseek/{0}.json',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgSeekId :'creditNameSeek',
					cfgRootNode : 'd.filter',
					cfgDataNode1 : 'name',
					enableQueryParam:false,
					cfgProxyMethodType : 'POST',
					fitToParent : true,
					listeners : {
								'select':function(){ 
								 me.searchName();
									var selected = me.down('component[itemId="clearNameLink"]');
          								  selected.show();									
								 },
								   'change':function(){
									 var filterContainer = me.down('[itemId="nameFilter"]');
								   if(Ext.isEmpty(filterContainer.getValue())){
										var selected = me.down('component[itemId="clearNameLink"]');
										selected.hide();
											me.searchName();
									  
									  }
								 }
							 }
				});				
				currFilterfield = Ext.create('Ext.ux.gcp.AutoCompleter', {
					margin : '0 0 0 30',
					fieldCls : 'xn-form-text popup-searchBox xn-suggestion-box',
					fieldLabel : getLabel('ccyName', 'Currency'),
					emptyText : getLabel('searchByCurrency','Search by Currency'),
					labelAlign : 'top',
					cfgUrl : 'cpon/cponseek/{0}.json',
					itemId : 'currFilter',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgSeekId:'creditCurrencySeek',
					cfgRootNode : 'd.filter',
					cfgDataNode1 : 'name',
					enableQueryParam:false,
					cfgKeyNode : 'value',
					cfgProxyMethodType : 'POST',
					listeners : {
						'select':function(){ 
							me.searchName();
							var selected = me.down('component[itemId="clearCurrLink"]');
  								  selected.show();									
						 },
						   'change':function(){
							 var filterContainer = me.down('[itemId="currFilter"]');
						   if(Ext.isEmpty(filterContainer.getValue())){
								var selected = me.down('component[itemId="clearCurrLink"]');
								selected.hide();
							  me.searchName();
							  }
						 }
					 }
				});				
		adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
					stateful : false,
					showEmptyRow :false,
					width : 'auto',
					cls : 't7-grid',
					height : 'auto',
					minHeight : 'auto',
					showPager : true,
					pageSize : 5,
					columnModel : colModel,
					hideRowNumbererColumn : true,
					checkBoxColumnWidth : _GridCheckBoxWidth,
					storeModel : {
						fields : ['name', 'value', 'readOnly', 'featureId','configurableFlag',
								'updated', 'featureSubsetCode', 'isAssigned',
								'profileId','lineTenor','utilizedLineAmnt','unutilizedLineAmnt'],
						proxyUrl : 'cpon/clientServiceSetup/cponFeatures',
						rootNode : 'd.filter',
						totalRowsNode : 'd.count'
					},
					selType : 'cellmodel',
					plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
								clicksToEdit : 1
							})],
					listeners : {
						render : function(grid) {
							me.handlePagingData(grid, grid.store.dataUrl,
									grid.pageSize, 1, 1, null);
						},
						select : me.addSelected,
						deselect : me.removeDeselected,
						beforeselect : me.handleBeforeSelect,
						beforedeselect : me.handleBeforeSelect,
						gridPageChange : me.handleLoadGridData,
						gridSortChange : me.handlePagingData,
						gridRowSelectionChange : function(grid, record,
								recordIndex, records, jsonData) {
						}
					},
					checkBoxColumnRenderer : function(value, metaData, record,
							rowIndex, colIndex, store, view) {

					}

				});

		adminListView.on('cellclick', function(view, td, cellIndex, record,
						tr, rowIndex, e, eOpts) {	
						var ccyCode = record.data.productCcyCode;	
							var grid = adminListView;
							var selectedRecords = grid.getSelectionModel().getSelection();
						
//							var col = grid.down('gridcolumn[itemId="'
//										+ "col_defaultClientLimitCode" + '"]');
//							if (col && col.getEditor()) {
//									var store = (col.getEditor().store)
//											? col.getEditor().store
//											: null;
//									if (store) {
//									store.removeFilter();
//									
//										store.filter([
//											{property: "featureType", value: ccyCode}
//										]);
//									}
//								}	
				});	
				
		me.items = [{
						xtype : 'container',
						layout : 'column',
						cls : 'ft-padding-bottom',
						items : [nameFilterfield,clearNameLink,currFilterfield,clearCurrLink
						]
					},adminListView];

		cancelButton = Ext.create('Ext.button.Button', {
					xtype : 'button',
					text :  getLabel('cancel', 'Cancel'),
					//cls : 'xn-button ux_button-background-color ux_cancel-button',
					//glyph : 'xf056@fontawesome',
					handler : function() {
						 var filterContainer = me.down('[itemId="nameFilter"]');
							filterContainer.setValue("");
							var filterCurr = me.down('[itemId="currFilter"]');
							filterCurr.setValue("");
						me.close();
					}
				});
		submitButton = Ext.create('Ext.button.Button', {
					xtype : 'button',
					text :  getLabel('submit', 'Submit'),
					itemId : 'btnSubmitPackage',
					//margin: '0 0 0 10',
					//glyph : 'xf058@fontawesome',
					//cls : 'xn-button ux_button-background-color ux_cancel-button',
					handler : function() {
						 var filterContainer = me.down('[itemId="nameFilter"]');
							filterContainer.setValue("");
							var filterCurr = me.down('[itemId="currFilter"]');
							filterCurr.setValue("");
						if (!Ext.isEmpty(adminListView.getSelectedRecords())) {
							me.validateLineItems(adminListView
											.getSelectedRecords(),
									selectedArray);

							var records = adminListView.getSelectedRecords();
							if (!Ext.isEmpty(me.fnCallback)
									&& typeof me.fnCallback == 'function') {
								me.fnCallback(selectedArray, true);
								selectedr = [];
								me.close();
							}
						} else {
							popupLineItemsSelectedValue = 'Y';
							me.close();
						}
					}
				});
		if (viewmode == 'VIEW' || viewmode == "MODIFIEDVIEW"
				|| pagemode == "VERIFY") {
			buttonArray.push('->');
			buttonArray.push(cancelButton);
		} else {
			buttonArray.push(cancelButton);
			buttonArray.push('->');
			buttonArray.push(submitButton);
		}
		me.bbar = buttonArray;
		me.callParent(arguments);
	},

	handleBeforeSelect : function(me, record, index, eOpts) {
				if (record.data.readOnly === true)
					return false;
			},
	searchName : function() {
					adminListView.refreshData();
				},
	validateLineItems : function(records, selectedArray) {
		var me = this;
		var showError = false;
		for (var index = 0; index < selectedArray.length; index++) {

			if (Ext.isEmpty(selectedArray[index].data.value)) {
				showError = true;
				break;
			}
		}
		if (showError) {
			Ext.Msg
					.alert("Error",
							"Selected records must have all values filled or select at least one record");
			showError=false;				
		}
	},

	addSelected : function(row, record, index, eopts) {
		var allreadyPresent = false;
		var index;
		for (var i = 0; i < selectedArray.length; i++) {
			if (selectedArray[i].data.featureId === record.data.featureId) {
				allreadyPresent = true;
				index = i;
				break;
			}
		}
		if (!allreadyPresent) {
			selectedArray.push(record);
			allreadyPresent = false;
		} else {
			selectedArray.splice(index, 1, selectedArray[i]);
		}

	},

	removeDeselected : function(row, record, index, eopts) {
		var index = -1;
		for (var i = 0; i < selectedArray.length; i++) {
			if (selectedArray[i].data.featureId === record.data.featureId) {
				index = i;
				break;
			}
		}
		if (index > -1) {
			selectedArray.splice(index, 1);
		}
	},

	getColumns : function() {
		var me = this;
		var lineAmountEditor = new Ext.form.field.Number({
			itemId:'editor',
			value : "999999.99",
			maxLength : 17,
			hideTrigger : true,
			enforceMaxLength : true,
			disabled :((viewmode == ("VIEW" || "MODIFIEDVIEW" || "VERIFY")) || (pagemode == "VERIFY")) ? true : false
		});

		arrColsPref = [{
					"colId" : "name",
					"colDesc" : getLabel('name', 'Name'),
					"sortable" : false
				},{
					"colId" : "lineTenor",
					"colDesc" : getLabel('tenor', 'Tenor'),
					"sortable" : false
				}, {
					"colId" : "featureSubsetCode",
					"colDesc" : getLabel('CCyCode', 'Currency'),
					"sortable" : false

				}, {
					"colId" : "value",
					"colDesc" : getLabel('totalAmount', 'Total Amount'),
					"sortable" : false
				}, {
					"colId" : "utilizedLineAmnt",
					"colDesc" : getLabel('utilizedLineLimit', 'Total Utilized Limit'),
					"sortable" : false
				},{
					"colId" : "unutilizedLineAmnt",
					"colDesc" : getLabel('unUtilizedLineLimit', 'Available Limit'),
					"sortable" : false
				}];

	objWidthMap = {
		"configurableFlag" : 100,
			"name" : 150,
			"featureSubsetCode" : 90,
			"value" : 150,
			"utilizedLineAmnt" : 150,
			"unutilizedLineAmnt" : 150
		};

		var arrCols = new Array(), objCol = null, cfgCol = null;
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				cfgCol.editor = objCol.editor;
				cfgCol.sortable = objCol.sortable;
				if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}

				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;
				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		for (var i = 0; i < selectedArray.length; i++) {

			if (record.data.featureId === selectedArray[i].data.featureId) {

				if (colId === "col_value") {
					if (selectedArray[i].data.value > 0)
						value = setDigitAmtGroupFormat(selectedArray[i].data.value);
				}
				else if (colId === "col_utilizedLineAmnt") {
					if (selectedArray[i].data.utilizedLineAmnt > 0)
						value = setDigitAmtGroupFormat(selectedArray[i].data.utilizedLineAmnt);
				}
				else if (colId === "col_unutilizedLineAmnt") {
					if (selectedArray[i].data.unutilizedLineAmnt > 0)
						value = setDigitAmtGroupFormat(selectedArray[i].data.unutilizedLineAmnt);
				}
			}
		}

		if (record.raw.updated === 1 && viewmode === 'MODIFIEDVIEW')
			strRetValue = '<span class="newFieldValue">' + value + '</span>';
		else if (record.raw.updated === 2 && viewmode === 'MODIFIEDVIEW')
			strRetValue = '<span class="modifiedFieldValue">' + value + '</span>';
		else if (record.raw.updated === 3 && viewmode === 'MODIFIEDVIEW')
			strRetValue = '<span class="deletedFieldValue">' + value + '</span>';
		else
			strRetValue = value;
		return strRetValue;
	},

	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
			var strTemp = '';
		var strFilter = '&filter=';
		var strValue = '';
		var columnFilter='&columnFilter='
		var win = me.up('lineCodesPopup');
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + '&id=' + encodeURIComponent(parentkey);
		if (!Ext.isEmpty(win.profileId)) {
			var url = Ext.String.format(
					'&featureType={0}&module={1}&profileId={2}',
					win.featureType, win.module, win.profileId);
			strUrl = strUrl + url;
		} else {
			var url = Ext.String.format('&featureType={0}&module={1}',
					win.featureType, win.module);
			strUrl = strUrl + url;
		}
		/*if (pagemode == "VERIFY") {
			strUrl = strUrl + '&assigned=Y';
		}*/

		 var filterName=win.down('[itemId="nameFilter"]');
			var filterCurr=win.down('[itemId="currFilter"]');
			if(!Ext.isEmpty(filterName.getValue()))
			{
			strTemp =strTemp + 'Name' ;
			strValue=strValue + filterName.getValue();
			strTemp=strTemp +"-";
			strValue=strValue+"-";
			}
		    if(!Ext.isEmpty(filterCurr.getValue()))
			{
			strTemp = strTemp + 'Currency' ;
			strValue=strValue +filterCurr.getValue();
			strTemp = strTemp + "-" ;
			strValue=strValue+"-";
			}
			
			if(!Ext.isEmpty(strValue))
			{
               strFilter= strFilter + strValue;			
			}
			if(!Ext.isEmpty(strValue))
			{
               columnFilter= columnFilter + strTemp;			
			}
			if(!Ext.isEmpty(strFilter))
			{
			 strUrl=strUrl+strFilter+ columnFilter;
			}
		grid.loadGridData(strUrl, me.up('lineCodesPopup').updateSelection,
				null, false);
	},

	handlePagingData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + '&id=' + encodeURIComponent(parentkey);
		if (!Ext.isEmpty(me.profileId)) {
			var url = Ext.String.format(
					'&featureType={0}&module={1}&profileId={2}',
					me.featureType, me.module, me.profileId);
			strUrl = strUrl + url;
		} else {
			var url = Ext.String.format('&featureType={0}&module={1}',
					me.featureType, me.module);
			strUrl = strUrl + url;
		}

		grid.loadGridData(strUrl, me.updateSelection, null, false);
	},
	updateSelection : function(grid, responseData, args) {
		var me = this;
		var selectedRecords = new Array();
     if (grid.getSelectionModel().isLocked()) {
			grid.getSelectionModel().setLocked(false);
		}
		if (!Ext.isEmpty(grid)) {
			var store = grid.getStore();
			var records = store.data;
			if (!Ext.isEmpty(records)) {
				var items = records.items;
				if (!Ext.isEmpty(items)) {
					for (var i = 0; i < items.length; i++) {
						var item = items[i];
						var isInSelectedr = false;
               
						for (var j = 0; j < selectedArray.length; j++) {
							if (selectedArray[j].data.featureId === item.data.featureId) {
								isInSelectedr = true;
								break;
							}
						}
						var assignedList = responseData.d.selectedValues;
						for (var j = 0; j < assignedList.length; j++) {
							if (assignedList[j].featureId === item.data.featureId) {
								isInSelectedr = true;
								break;
							}
						}

						if (isInSelectedr) {
							selectedRecords.push(item);
						}
					}
				}

				if (selectedRecords.length > 0) {
					grid.suspendEvent('beforeselect');
					grid.getSelectionModel().select(selectedRecords);
					grid.resumeEvent('beforeselect');
				}
			}
		}
		if (viewmode == 'VIEW' || viewmode == "MODIFIEDVIEW"
				|| pagemode == "VERIFY") {
			grid.getSelectionModel().setLocked(true);
		}
	}
});
