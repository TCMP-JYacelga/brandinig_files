var selectedr = new Array();
Ext.define('GCP.view.ValueSelectionPopup', {
	extend : 'Ext.window.Window',
	xtype : 'valueSelectionPopup',
	requires : [ 'Ext.ux.gcp.SmartGrid', 'Ext.data.Store' ],
	width : 450,
	modal : true,
	draggable : false,
	autoScroll : true,
	closeAction : 'destroy',
	config : {
		fnCallback : null,
		profileId : null,
		featureType : null,
		module : null,
		title : null,
		columnName : null
	},

	initComponent : function() {
		var me = this;
		this.title = me.title;
		var strUrl = 'services/getDataProviderList.json';
		var colModel = me.getColumns();
		widgetListView = Ext.create('Ext.ux.gcp.SmartGrid', {
			pageSize : 5,
			stateful : false,
			showEmptyRow : false,
			showPager : true,
			padding : '5 0 0 0',
			rowList : [ 5, 10, 15, 20, 25, 30 ],
			minHeight : 150,
			xtype : 'widgetListView',
			itemId : 'widgetListViewId',
			profileId : me.profileId,
			featureType : me.featureType,
			module : me.module,
			showCheckBoxColumn : true,
			columnModel : colModel,
			storeModel : {
				fields : [ 'name', 'value', 'isAssigned', 'readOnly' ],
				proxyUrl : strUrl,
				rootNode : 'd.filter',
				totalRowsNode : 'd.count'
			},
			listeners : {
				render : function(grid) {
					me.handlePagingData(grid, grid.store.dataUrl,
							grid.pageSize, 1, 1, null);
				},
				beforeselect : me.handleBeforeSelect,
				beforedeselect : me.handleBeforeSelect,
				select : me.addSelected,
				deselect : me.removeDeselected,
				gridPageChange : me.handleLoadGridData,
				gridSortChange : me.handlePagingData,
				gridRowSelectionChange : function(grid, record, recordIndex,
						records, jsonData) {

				}
			}

		});

		this.items = [ widgetListView ];
		this.buttons = [ {
			xtype : 'button',
			text : getLabel('btnOk', 'Ok'),
			cls : 'xn-button',
			handler : function() {
				me.saveItems();
			}
		}, {
			xtype : 'button',
			text : getLabel('cancel', 'Cancel'),
			cls : 'xn-button',
			handler : function() {
				selectedr = [];
				me.close();
			}
		} ];
		this.callParent(arguments);
	},
	getColumns : function() {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		var arrColsPref = [ {
			colDesc : me.columnName,
			colId : 'name',
			width : 330
		} ];
		if (!Ext.isEmpty(arrColsPref)) {
			for ( var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				cfgCol.width = objCol.width;
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
	handleBeforeSelect : function(me, record, index, eOpts) {
		if (record.data.readOnly === true)
			return false;
	},
	addSelected : function(row, record, index, eopts) {
		var allreadyPresent = false;
		for ( var i = 0; i < selectedr.length; i++) {
			if (selectedr[i] === record.data.value) {
				allreadyPresent = true;
				break;
			}
		}
		if (!allreadyPresent) {

			selectedr.push(record.data.value);
			record.raw.isAssigned = true;
			allreadyPresent = false;
		}
	},

	removeDeselected : function(row, record, index, eopts) {
		var index = -1;
		for ( var i = 0; i < selectedr.length; i++) {
			if (selectedr[i] === record.data.value) {
				index = i;
				break;
			}
		}
		if (index > -1) {
			selectedr.splice(index, 1);
		}
		var selectedArray = this.ownerCt.selectedValues;
		// selectedArray = selectedArray.split(",");
		var selectedArrayIndex = -1;
		for ( var i = 0; i < selectedArray.length; i++) {
			if (selectedArray[i] === record.data.value) {
				selectedArrayIndex = i;
				break;
			}
		}
		if (selectedArrayIndex > -1) {
			selectedArray.splice(selectedArrayIndex, 1);
		}
		this.ownerCt.selectedValues = selectedArray.toString();
	},
	saveItems : function() {
		var me = this;
		var records = selectedr;

		var blnIsUnselected = selectedr.length < widgetListView.store
				.getTotalCount() ? true : false;
		if (!Ext.isEmpty(me.fnCallback) && typeof me.fnCallback == 'function') {
			me.fnCallback(records, blnIsUnselected, me.index);
			selectedr = [];
			me.close();
		}
	},

	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + '&$derivationClass=' + grid.ownerCt.derivationClass;
		grid.loadGridData(strUrl,
				me.up('valueSelectionPopup').updateLoadSelection, grid, false);
	},

	handlePagingData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + '&$derivationClass=' + me.derivationClass;
		grid.loadGridData(strUrl, me.updateSelection, grid, false);

	},

	checkIfAlreadyContains : function(arrayList, key) {
		for (i = 0; i < arrayList.length; i++) {
			if (arrayList[i] === key) {
				return true;
			}
		}
		return false;
	},

	updateSelection : function(grid, responseData, args) {
		if (!Ext.isEmpty(responseData.d.errors))
		{
			Ext.Msg.alert("Error",getLabel(responseData.d.errors,'Internal Error ocurred.'));
		}
		else{
		var me = this;
		if (grid.ownerCt.selectedValues) {
			var selectedArray = grid.ownerCt.selectedValues;
			// selectedArray = selectedArray.split(",");
			if (!Ext.isEmpty(selectedArray)) {
				for ( var i = 0; i < selectedArray.length; i++) {
					if (!grid.ownerCt.checkIfAlreadyContains(selectedr,
							selectedArray[i]))
						selectedr.push(selectedArray[i]);
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
						for ( var j = 0; j < selectedr.length; j++) {
							if (selectedr[j] === item.data.value) {
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
		if (pagemode == 'VIEW' || pagemode == "MODIFIEDVIEW"
				|| pagemode == "VERIFY") {
			grid.getSelectionModel().setLocked(true);
		}}
	},
	updateLoadSelection : function(grid, responseData, args) {
		var me = this;
		var selectedArray = grid.ownerCt.selectedValues;
		if (!Ext.isEmpty(selectedArray)) {
			for ( var i = 0; i < selectedArray.length; i++) {
				if (!grid.ownerCt.checkIfAlreadyContains(selectedr,
						selectedArray[i]))
					selectedr.push(selectedArray[i]);
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
						for ( var j = 0; j < selectedr.length; j++) {
							if (selectedr[j] === item.data.value) {
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
		if (pagemode == 'VIEW' || pagemode == "MODIFIEDVIEW"
				|| pagemode == "VERIFY") {
			grid.getSelectionModel().setLocked(true);
		}
	}
});
