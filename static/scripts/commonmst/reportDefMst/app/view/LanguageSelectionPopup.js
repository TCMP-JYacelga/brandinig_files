var selectedArray = new Array();
var productCcyCode = null;
Ext.define('GCP.view.LanguageSelectionPopup', {
	extend : 'Ext.window.Window',
	xtype : 'languageSelectionPopup',
	requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store',
			'Ext.ux.gcp.AutoCompleter'],
	width : 455,
	minHeight : 156,
	maxHeight : 550,
	cls : 'non-xn-popup',
	autoHeight : true,
	modal : true,
	draggable : false,
	resizable : false,
	closeAction : 'hide',
	//autoScroll : true,
	title : getLabel('addlanguages', 'Aditional Languages'),
	config : {
		fnCallback : null,
		reportCode : null,
		parameterCode : null,
		parentKey : null,
		paramViewState : null
	},
	initComponent : function() {
		var me = this;
		var colModel = me.getColumns();

		adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
					stateful : false,
					showEmptyRow : true,
					minHeight : 40,
					maxHeight : 400,
					scroll : 'vertical',
					cls : 't7-grid',
					checkBoxColumnWidth : _GridCheckBoxWidth,
					showPager : true,
					pageSize : 5,
					rowList : [5, 10, 15, 20, 25, 30],
					itemId : 'languageListViewId',
					columnModel : colModel,
					selectedRecordList : new Array(),
					deSelectedRecordList : new Array(),
					selectedRecordsListInDB : new Array(),						
					showCheckBoxColumn : true,
					hideRowNumbererColumn : true,
					storeModel : {
						fields : ['languageCode', 'languageDesc', 'readOnly', 'reportCode','isAssigned','reportDesc','parameterDesc'],
						proxyUrl : 'services/reportParamLanguages.json',
						rootNode : 'd.details',
						totalRowsNode : 'd.__count'
					},
					selType : 'cellmodel',
					plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
								clicksToEdit : 1,
								 listeners: {
							            beforeedit: function(e, editor){
							                if (strMode == 'VIEW')
							                    return false;
							            }	
								 }
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
				
		me.items = [adminListView];
		if(strMode == 'VIEW')
		{
			me.bbar = ['->',{
				xtype : 'button',
				text :  getLabel('btnClose', 'Close'),
				//cls : 'xn-button ux_button-background-color ux_cancel-button',
				//glyph : 'xf056@fontawesome',
				handler : function() {
					me.close();
				}
			}];			
		}	
		else
		{
			me.bbar = [{
				xtype : 'button',
				text :  getLabel('cancel', 'Cancel'),
				//cls : 'xn-button ux_button-background-color ux_cancel-button',
				//glyph : 'xf056@fontawesome',
				handler : function() {
						selectedr = [];
						var storeData=adminListView.getStore().data;
						var iCount=0;
						adminListView.selectedRecordList.splice(0,adminListView.selectedRecordList.length);
						adminListView.deSelectedRecordList.splice(0,adminListView.deSelectedRecordList.length);
						adminListView.selectedRecordsListInDB.splice(0,adminListView.selectedRecordsListInDB.length);
						for(;iCount<storeData.length;iCount++)
						{
							var isAssign=storeData.items[iCount].data['isAssigned'];
							var value=storeData.items[iCount].data['languageCode'];
							if(isAssign== true)
							{
								adminListView.selectedRecordList.push(value);
								adminListView.selectedRecordsListInDB.push(value);
							}
							else
							{
								adminListView.deSelectedRecordList.push(value);
							}
							
						}
						var grid = me.down('smartgrid[itemId=languageListViewId]');
						var records = grid.selectedRecordList;
						var removedRecords = grid.deSelectedRecordList;
						var blnIsUnselected = records.length < grid.store
								.getTotalCount() ? true : false;
						if (!Ext.isEmpty(me.fnCallback)
								&& typeof me.fnCallback == 'function') {
							me.fnCallback(records,removedRecords,blnIsUnselected);
						}
						me.close();
				}
			},'->', {
				xtype : 'button',
				text :  getLabel('submit', 'Submit'),
				itemId : 'btnSubmitPackage',
				//glyph : 'xf058@fontawesome',
				//cls : 'xn-button ux_button-background-color ux_cancel-button',
				handler : function() {
 						var selectpopup = me;
						adminListView.selectedRecordsListInDB.splice(0,adminListView.selectedRecordsListInDB.length);
						var arrayData=adminListView.selectedRecordList;
						var iCount=0;
						for(;iCount<arrayData.length;iCount++)
						{
							adminListView.selectedRecordsListInDB.push(arrayData[iCount]);
						}
						me.saveItems();
				}
			}];			
		}

		me.callParent(arguments);
	},

	handleBeforeSelect : function(me, record, index, eOpts) {
				if (record.data.readOnly === true)
					return false;
			},
			
	validateLineItems : function(records, selectedArray) {
		var me = this;
		var showError = false;
		for (var index = 0; index < selectedArray.length; index++) {

			if (Ext.isEmpty(selectedArray[index].data.parameterDesc)) {
				showError = true;
				break;
			}
		}
		if (showError) {
			Ext.Msg
					.alert("Error",
							"Selected records must have all values filled or select at least one record");
		}
	},

	addSelected : function(row, record, index, eopts) {
		var me=this;
		var allreadyPresent = false;
		var languagePopup = me.up("languageSelectionPopup");
		var keyNode = me.keyNode;
		var alreadyPresent = languagePopup.checkIfRecordExist(me.selectedRecordList,record);
		/* Add to Grid Selection List */
		if (!alreadyPresent ) {
			me.selectedRecordList.push(record);
			alreadyPresent = false;
		}
		/* Remove From De Selected List */
		languagePopup.removeElementIfExist(me.deSelectedRecordList,record);
	
	},
	removeDeselected : function(row, record, index, eopts) {
		var me = this;
		var languagePopup = me.up("languageSelectionPopup");
		var keyNode = me.keyNode;
		/* Remove Ellement From Grid Selection List */
		var index = -1;
		languagePopup.removeElementIfExist(me.selectedRecordList,record);		
		var alreadyPresent = languagePopup.checkIfRecordExist(me.deSelectedRecordList,record);
		/* Add to Grid Selection List */
		if (!alreadyPresent && (record.data['isAssigned'] == true)) {
			me.deSelectedRecordList.push(record);
			alreadyPresent = false;
		}
	},
	removeElementIfExist : function(arrayList,objRecord){
		var index = -1;
		for ( var i = 0; i < arrayList.length; i++) {
			var rowRecord = arrayList[i];
			if(rowRecord.data != undefined  && objRecord.data != undefined){
				if (rowRecord.data.languageCode === objRecord.data.languageCode) {
					index = i;
					break;
				}
			}
		}
		if (index > -1) {
			arrayList.splice(index, 1);
		}
	},
	checkIfRecordExist : function(arrayList,objRecord){
		var isRecordPresent = false;		
		for ( var i = 0; i < arrayList.length; i++) {		
			var rowRecord = arrayList[i];	
			if(rowRecord!=null)
			{
				if (rowRecord.data.languageCode === objRecord.data.languageCode) {
					isRecordPresent = true;
					break;
				}
			}
		}
		return isRecordPresent;
		
	},
	getColumns : function() {
		var me = this;
		var paramDescEditor = new Ext.form.field.Text({
					value : ""
				});

		arrColsPref = [{
					"colId" : "languageCode",
					"colDesc" : getLabel('language', 'Language'),
					"sort" : false
				}, {
					"colId" : "parameterDesc",
					"colDesc" : getLabel('paramDesc', 'Parameter Description'),
					"editor" : paramDescEditor,
					"sort" : false
				}];

		objWidthMap = {
			"languageCode" : 250,
			"parameterDesc" : 290
		};

		var arrCols = new Array(), objCol = null, cfgCol = null;
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				cfgCol.editor = objCol.editor;
				if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}
				cfgCol.sortable = objCol.sort;
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
		strRetValue = value;
		return strRetValue;
	},

	saveItems : function() {
		var me = this;
		var grid = me.down('smartgrid[itemId=languageListViewId]');
		var records = grid.selectedRecordList;
		var removedRecords = grid.deSelectedRecordList;
		var blnIsUnselected = records.length < grid.store
				.getTotalCount() ? true : false;
		if (!Ext.isEmpty(me.fnCallback)
				&& typeof me.fnCallback == 'function') {
			me.fnCallback(records, removedRecords,blnIsUnselected);
			me.hide();
		}
	},	
	
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var win = me.up('languageSelectionPopup');
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		var strUrl =strUrl + Ext.String.format('&$filter={0}',win.parentKey);		
		if (!Ext.isEmpty(win.reportCode) && !Ext.isEmpty(win.parameterCode))
		{		
			var url = Ext.String.format('&$reportCode={0}&$parameterCode={1}&$paramViewState={2}',
					win.reportCode, win.parameterCode,win.paramViewState);
			strUrl = strUrl + url;
		}
		grid.loadGridData(strUrl, me.up('languageSelectionPopup').updateSelection,
				null, false);
	},

	handlePagingData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		var strUrl =strUrl + Ext.String.format('&$filter={0}',me.parentKey);
		if (!Ext.isEmpty(me.reportCode) && !Ext.isEmpty(me.parameterCode))
		{				
			var url = Ext.String.format(
					'&$reportCode={0}&$parameterCode={1}&$paramViewState={2}',
					me.reportCode, me.parameterCode,me.paramViewState);
			strUrl = strUrl + url;
		}
		grid.loadGridData(strUrl, me.updateSelection, null, false);
	},
	isAlreadyExist : function(list,item){
		var allreadyPresent = false;
		for ( var i = 0; i < list.length; i++) {
			if (list[i] === item) {
				allreadyPresent = true;
				break;
			}
		}
		return allreadyPresent;
	},	
	updateSelection : function(grid, responseData, args) {
		var me = this;	 
		var languagePopup = grid.up("languageSelectionPopup");
		if (!Ext.isEmpty(grid) && reqCount==1)
		{
			var store = grid.getStore();
			var records = store.data;			
			if (!Ext.isEmpty(records))
			{
				var items = records.items;				
				if (!Ext.isEmpty(items)) {
					for (var i = 0; i < items.length; i++) {
						var item = items[i];
							if (item.data.isAssigned===true) {
								grid.selectedRecordsListInDB.push(item);
							}
					}
				}
			}
			reqCount+=1;
		}				
		if (grid.selectedRecordsListInDB)
		{
			var selectedArray = grid.selectedRecordsListInDB;
			if (!Ext.isEmpty(selectedArray)) {
				for ( var i = 0; i < selectedArray.length; i++) {
					if(!languagePopup.isAlreadyExist(grid.selectedRecordList,selectedArray[i])
					&& (!languagePopup.checkIfRecordExist(grid.deSelectedRecordList,selectedArray[i])))
						grid.selectedRecordList.push(selectedArray[i]);
				}
			}
		}				
		
		if (!Ext.isEmpty(grid)) {
			var store = grid.getStore();
			var records = store.data;
			if (!Ext.isEmpty(records)) {
				var items = records.items;
				var selectedRecords = new Array();
				if (!Ext.isEmpty(items)) {
					for ( var i = 0; i < items.length; i++) {
						var item = items[i];
						var isInSelectedr = false;
						for ( var j = 0; j < grid.selectedRecordList.length; j++) {
							if (grid.selectedRecordList[j].data.languageCode === item.data.languageCode) {
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
		if (strMode == 'VIEW') {
			grid.getSelectionModel().setLocked(true);
		}
	}
});
