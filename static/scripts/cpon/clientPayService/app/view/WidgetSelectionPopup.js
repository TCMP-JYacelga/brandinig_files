var selectedr = new Array();
Ext.define('CPON.view.WidgetSelectionPopup',
		{
			extend : 'Ext.window.Window',
			xtype : 'widgetSelectionPopup',
			requires : [ 'Ext.ux.gcp.SmartGrid', 'Ext.data.Store' ],
			width : 450,
			modal : true,
			draggable : true,
			autoScroll : true,
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
				var strUrl = 'cpon/clientServiceSetup/cponFeatures';
				var colModel = me.getColumns();
				widgetListView = Ext.create('Ext.ux.gcp.SmartGrid', {
					pageSize : 5,
					stateful : false,
					showEmptyRow : false,
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
					selectedRecordList : new Array(),
					deSelectedRecordList : new Array(),
					keyNode: 'value',
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
						gridRowSelectionChange : function(grid, record,
								recordIndex, records, jsonData) {
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

			columnRenderer : function(value, meta, record, rowIndex, colIndex,
					store, view, colId) {
				var strRetValue = "";
				if (record.raw.updated === 1 && viewmode === 'MODIFIEDVIEW')
					strRetValue = '<span class="newFieldValue">' + value
							+ '</span>';
				else if (record.raw.updated === 2
						&& viewmode === 'MODIFIEDVIEW')
					strRetValue = '<span class="modifiedFieldValue">' + value
							+ '</span>';
				else if (record.raw.updated === 3
						&& viewmode === 'MODIFIEDVIEW')
					strRetValue = '<span class="deletedFieldValue">' + value
							+ '</span>';
				else
					strRetValue = value;

				return strRetValue;
			},
			handleBeforeSelect : function(me, record, index, eOpts) {
				if (record.data.readOnly === true)
					return false;
			},
			addSelected : function(row, record, index, eopts) {
				var me = this;
				var usermstselectpopup = me.up("widgetSelectionPopup");
				var keyNode = me.keyNode;
				var alreadyPresent = usermstselectpopup.checkIfRecordExist(me.selectedRecordList,keyNode,record.data[keyNode]);
				/* Add to Grid Selection List */
				if (!alreadyPresent && (record.data['isAssigned'] == false)) {
					me.selectedRecordList.push(record.data[keyNode]);
					alreadyPresent = false;
				}
				/* Remove From De Selected List */
				usermstselectpopup.removeElementIfExist(me.deSelectedRecordList,keyNode,record.data[keyNode]);
			},

			removeDeselected : function(row, record, index, eopts) {
				var me = this;
				var usermstselectpopup = me.up("widgetSelectionPopup");
				var keyNode = me.keyNode;
				/* Remove Ellement From Grid Selection List */
				var index = -1;
				usermstselectpopup.removeElementIfExist(me.selectedRecordList,keyNode,record.data[keyNode]);
				
				var alreadyPresent = usermstselectpopup.checkIfRecordExist(me.deSelectedRecordList,keyNode,record.data[keyNode]);
				/* Add to Grid Selection List */
				if (!alreadyPresent && (record.data['isAssigned'] == true)) {
					me.deSelectedRecordList.push(record.data[keyNode]);
					alreadyPresent = false;
				}
			},
			removeElementIfExist : function(arrayList,keyNode,keyNodeValue){
				var index = -1;
				for ( var i = 0; i < arrayList.length; i++) {
					var rowRecord = arrayList[i];
					if (rowRecord === keyNodeValue) {
						index = i;
						break;
					}
				}
				if (index > -1) {
					arrayList.splice(index, 1);
				}
			},
			checkIfRecordExist : function(arrayList,keyNode,keyNodeValue){
				var isRecordPresent = false;
				for ( var i = 0; i < arrayList.length; i++) {
					var rowRecord = arrayList[i];
					if (rowRecord === keyNodeValue) {
						isRecordPresent = true;
						break;
					}
				}
				return isRecordPresent;
				
			},
			checkIfRecordIsSelected : function(grid,record){
					var me = this;
					var isRecordPresent = false;
					var keyNode = grid.keyNode;
					for ( var i = 0; i < grid.selectedRecordList.length; i++) {
						var rowRecord = grid.selectedRecordList[i];
						if (rowRecord.data[keyNode] === record.get(keyNode)) {
							isRecordPresent = true;
							break;
						}
					}
				return isRecordPresent;
			},
			getKeyNodeValueList : function(arrayList,keyNode){
				var strRecords = '';
				for ( var i = 0; i < arrayList.length; i++) {
					var rowRecord = arrayList[i];
					strRecords = strRecords + rowRecord.data[keyNode] +",";
				}
				return strRecords;
			},
			saveItems : function() {
				var me = this;
				var grid = me.down('smartgrid[itemId=widgetListViewId]');
				var records = grid.selectedRecordList;
				var blnIsUnselected = records.length < widgetListView.store
						.getTotalCount() ? true : false;
				if (!Ext.isEmpty(me.fnCallback)
						&& typeof me.fnCallback == 'function') {
					me.fnCallback(records, blnIsUnselected);
					//selectedr = [];
					me.hide();
				}
			},
			handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = this;
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,
						sorter);
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
				if (pagemode == "VERIFY") {
					strUrl = strUrl + '&assigned=Y';
				}
				grid.loadGridData(strUrl,
						me.up('widgetSelectionPopup').updateLoadSelection,
						grid, false);
			},

			handlePagingData : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = this;
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,
						sorter);
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
				if (pagemode == "VERIFY") {
					strUrl = strUrl + '&assigned=Y';
				}
				grid.loadGridData(strUrl, me.updateSelection, grid, false);

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
				var selectpopup = grid.up("widgetSelectionPopup");
				if (grid.ownerCt.lastSelectedWidgets) {
					var selectedArray = grid.ownerCt.lastSelectedWidgets;
					if (!Ext.isEmpty(selectedArray)) {
						for ( var i = 0; i < selectedArray.length; i++) {
							if(!selectpopup.isAlreadyExist(grid.selectedRecordList,selectedArray[i].value)
							&& (!selectpopup.checkIfRecordExist(grid.deSelectedRecordList,'value',selectedArray[i].value)))
								grid.selectedRecordList.push(selectedArray[i]);
						}
					}
				} else if (args.ownerCt.isAllSelected == "Y") {
					var selectedArray = responseData.d.filter;
					for ( var i = 0; i < selectedArray.length; i++) {
						if(!selectpopup.isAlreadyExist(grid.selectedRecordList,selectedArray[i].value)
						&& (!selectpopup.checkIfRecordExist(grid.deSelectedRecordList,'value',selectedArray[i].value)))
							grid.selectedRecordList.push(selectedArray[i].value);
					}
				} else {
					var selectedArray = responseData.d.selectedValues;
					for ( var i = 0; i < selectedArray.length; i++) {
						if(!selectpopup.isAlreadyExist(grid.selectedRecordList,selectedArray[i].value)
						&& (!selectpopup.checkIfRecordExist(grid.deSelectedRecordList,'value',selectedArray[i].value)))
							grid.selectedRecordList.push(selectedArray[i].value);
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
									if (grid.selectedRecordList[j] === item.data.value) {
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
			},
			updateLoadSelection : function(grid, responseData, args) {
				var me = this;
				var selectpopup = grid.up("widgetSelectionPopup");
				if (grid.ownerCt.lastSelectedWidgets) {
					var selectedArray = grid.ownerCt.lastSelectedWidgets;
					if (!Ext.isEmpty(selectedArray)) {
						for ( var i = 0; i < selectedArray.length; i++) {
							if(!selectpopup.isAlreadyExist(grid.selectedRecordList,selectedArray[i].value)
							&& (!selectpopup.checkIfRecordExist(grid.deSelectedRecordList,'value',selectedArray[i].value)))
								grid.selectedRecordList.push(selectedArray[i]);
						}
					}
				} else if (args.ownerCt.isAllSelected == "Y") {
					var selectedArray = responseData.d.filter;
					for ( var i = 0; i < selectedArray.length; i++) {
						if(!selectpopup.isAlreadyExist(grid.selectedRecordList,selectedArray[i].value)
						&& (!selectpopup.checkIfRecordExist(grid.deSelectedRecordList,'value',selectedArray[i].value)))
							grid.selectedRecordList.push(selectedArray[i].value);
					}
				} else {
					var selectedArray = responseData.d.selectedValues;
					for ( var i = 0; i < selectedArray.length; i++) {
						if(!selectpopup.isAlreadyExist(grid.selectedRecordList,selectedArray[i].value)
						&& (!selectpopup.checkIfRecordExist(grid.deSelectedRecordList,'value',selectedArray[i].value)))
							grid.selectedRecordList.push(selectedArray[i].value);
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
									if (grid.selectedRecordList[j] === item.data.value) {
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