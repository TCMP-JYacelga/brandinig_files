var selectedArray = new Array();
var deselectedArray = new Array();

Ext.define('GCP.view.PaymentPkgPopupView', {
	extend : 'Ext.window.Window',
	xtype : 'paymentPkgPopupView',
	requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store',
			'Ext.ux.gcp.AutoCompleter'],
	width : 650,
	maxWidth : 735,
	minHeight : 156,
	maxHeight : 550,
	autoHeight : true,
	modal : true,
	draggable : false,
	resizable : false,
	autoScroll : true,
	cls : 'non-xn-popup',
	// title : getLabel('packageName','Package Name'),
	config : {
		filterVal : null,
		packageId : null,
		id : null,
		mode : null,
		srvcCode : null
	},
	listeners : {
		'resize' : function(){
			this.center();
		}
	},
	initComponent : function() {
		var me = this;
		var colModel = me.getColumns();
		var strAvlblPkgUrl = null;
		var parent = this.up('paymentPkgPopupView');
		var pkgId;
		if (parent)
			pkgId = parent.packageId;
		else
			pkgId = me.packageId;
		if ('02' == me.srvcCode) {
			strAvlblPkgUrl = 'cpon/clientPayment/availableAssignedPackages.json';
		}
		else if ('05' == me.srvcCode) {
			strAvlblPkgUrl = 'cpon/clientCollection/availableCollPackages.json';
		}
		
		adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
					stateful : false,
					showEmptyRow : false,
					//padding : '5 0 0 0',
					rowList : [5, 10, 15, 20, 25, 30],
					minHeight : 40,
					maxHeight : 400,
					scroll : 'vertical',
					cls : 't7-grid',
					pageSize : 5,
					columnModel : colModel,
					hideRowNumbererColumn : false,
					showCheckBoxColumn : false,
					storeModel : {
						fields : ['packageDesc', 'identifier', 'isAssigned',
								'packageId', 'allowAllPayAcctsFlag'],
						proxyUrl : strAvlblPkgUrl,
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
						gridRowSelectionChange : function(grid, record,
								recordIndex, records, jsonData) {
						},
						select : me.addSelected,
						deselect : me.removeDeselected,
						beforeselect : me.handleBeforeSelect,
						beforedeselect : me.handleBeforeSelect
					}
				});

			me.items = [ adminListView];

		/*var submitButton = Ext.create('Ext.button.Button', {
					text : getLabel('submit', 'Submit'),
					itemId : 'btnSubmitPackage',
					glyph : 'xf058@fontawesome',
					margin : '0 0 0 10',
					cls : 'xn-button ux_button-background-color ux_cancel-button',
					handler : function() {
						this.fireEvent("assignPackages", selectedArray,
								deselectedArray, me.id);
					}
				});

		var cancelButton = Ext.create('Ext.button.Button', {
					text : getLabel('cancel', 'Cancel'),
					glyph : 'xf056@fontawesome',
					cls : 'xn-button ux_button-background-color ux_cancel-button',
					handler : function() {
						me.close();

					}
				});

		var btnArr = [];

		btnArr.push(cancelButton);

		if ((viewmode != "VIEW" && viewmode != "MODIFIEDVIEW")) {
			btnArr.push(submitButton);
		}

		me.buttons = btnArr;*/
		
			me.bbar=[{
				xtype : 'button',
				text : getLabel('cancel', 'Cancel'),
				handler : function() {
					me.close();
				}
			}];
	
		me.callParent(arguments);
	},

	searchPackages : function() {
		adminListView.refreshData();
	},

	getColumns : function() {
		var colLbl;
		var me = this;
		if ('02' == me.srvcCode) {
			colLbl = getLabel('packageName', 'Package Name');
		} else if ('05' == me.srvcCode) {
			colLbl = getLabel('collectionMethodName','Receivables Method Name');
		}
		arrColsPref = [{
					"colId" : "packageDesc",
					"colDesc" : colLbl
				}];

		objWidthMap = {
			"packageDesc" : 517
		};
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
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

				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;
				// cfgCol.fnColumnRenderer = me.defaultColumnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},
	// defaultColumnRenderer : function(value, meta, record, rowIndex, colIndex,
	// store, view, colId) {
	// var strRetValue = value;
	// if (!Ext.isEmpty(record) && !Ext.isEmpty(record.raw)
	// && !Ext.isEmpty(record.raw.updated)) {
	// if (record.raw.updated === 1 && viewmode === 'MODIFIEDVIEW')
	// strRetValue = '<span class="newFieldValue">' + strRetValue
	// + '</span>';
	// else if (record.raw.updated === 2 && viewmode === 'MODIFIEDVIEW')
	// strRetValue = '<span class="modifiedFieldValue">' + strRetValue
	// + '</span>';
	// else if (record.raw.updated === 3 && viewmode === 'MODIFIEDVIEW')
	// strRetValue = '<span class="deletedFieldValue">' + strRetValue
	// + '</span>';
	// }
	// return strRetValue;
	// },
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var parent = this.up('paymentPkgPopupView');
		var pkgId;
		if (parent)
			pkgId = parent.packageId;
		else
			pkgId = me.packageId;
		if(Ext.isEmpty(me.mode))
			me.mode = parent.mode;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + '&id=' + encodeURIComponent(parentkey);
		strUrl = strUrl + '&$select=' + pkgId;
		if('02'===me.srvcCode)
			strUrl = strUrl + '&$filter=module eq \'' + me.srvcCode + '\'';
		strUrl = strUrl + '&$callFrom=' + me.mode;
		// Not in scope as of now
		// if (!Ext.isEmpty(viewmode)) {
		// strUrl = strUrl + '&$viewmode='+ viewmode;
		// }

		if (parent)
			grid.loadGridData(strUrl, parent.updateSelection, grid, false);
		else
			grid.loadGridData(strUrl, me.updateSelection, grid, false);

	},
	addSelected : function(row, record, index, eopts) {
		var allreadyPresent = false;
		var index;
		for (var i = 0; i < selectedArray.length; i++) {
			if (selectedArray[i].data.packageId === record.data.packageId) {
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
			if (selectedArray[i].data.packageId === record.data.packageId) {
				deselectedArray.push(record);
				index = i;
				break;
			}
		}
		if (index > -1) {
			selectedArray.splice(index, 1);
		}
	},
	handleBeforeSelect : function(me, record, index, eOpts) {
		 if (!Ext.isEmpty(record.data.allowAllPayAcctsFlag)
					&& record.data.allowAllPayAcctsFlag === "Y")//record.data.readOnly === true)
		 return false;
	},

	updateSelection : function(grid, responseData, args) {

		var me = this;
		var selectAll = args.selectAllCheckBox;
		if (!Ext.isEmpty(grid)) {

			var store = grid.getStore();
			var records = store.data;
			if (!Ext.isEmpty(records)) {
				var items = records.items;
				if (!Ext.isEmpty(items)) {
					var selectedRecords = new Array();
					for (var i = 0; i < items.length; i++) {
						var item = items[i];
						if (item.data.isAssigned === true) {
							selectedRecords.push(item)
						}
					}

					var isInSelectedr = false;
					var assignedList = responseData.d.accounts;
					for (var j = 0; j < assignedList.length; j++) {
						if (assignedList[j].packageId === item.data.packageId
								&& assignedList[j].isAssigned === true) {
							isInSelectedr = true;
							break;
						}
					}

					for (var j = 0; j < selectedArray.length; j++) {
						if (selectedArray[j].data.packageId === item.data.packageId) {
							isInSelectedr = true;
							break;
						}
					}

					if (isInSelectedr) {
						// selectedRecords.push(item);
					}

					if (selectedRecords.length > 0) {
						grid.suspendEvent('beforeselect');
						grid.getSelectionModel().setLocked(false);
						grid.getSelectionModel().select(selectedRecords);
						grid.resumeEvent('beforeselect');
					}
				}
			}
		}

			grid.getSelectionModel().setLocked(true);
	}

});
