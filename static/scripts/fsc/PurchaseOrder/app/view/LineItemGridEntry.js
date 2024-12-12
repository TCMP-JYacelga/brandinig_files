/**
 * @class GCP.view.LineItemGridEntry
 * @extends Ext.panel.Panel
 * @author Vinay Thube
 */
Ext.define('GCP.view.LineItemGridEntry', {
	extend : 'Ext.panel.Panel',
	xtype : 'lineItemGridEntry',
	itemId : 'lineItemGridEntry',
	requires : ['Ext.ux.gcp.SmartGrid', 'Ext.form.Panel',
			'Ext.grid.plugin.RowEditing', 'Ext.ux.gcp.AutoCompleter',
			'Ext.ux.gcp.Override.PickerDate'],
	autoHeight : true,
	cls : 'xn-panel xn-no-rounded-border',
	collapsible : false,
	gridMetaData : null,
	gridDefaultMetaData : null,
	gridCfg : null,
	charEditable : 'N',
	isViewOnly : false,
	isEnableGridActions : true,
	// TODO : To be removed
	// entryType : strEntryType,
	strDefaultMask : '000',
	intMaskSize : 3,
	isLoadingIndicatorOn : false,
	isFocusOut : false,
	intDefaultEmptyRow : 5,
	intAddEmptyRow : 2,
	initComponent : function() {
		var me = this, groupView = null;
		if (!Ext.isEmpty(me.gridMetaData)) {
			me.gridDefaultMetaData = me.cloneObject(me.gridMetaData);
		}
		groupView = me.createGroupView();
		$(document).on('keyup', function(e) {
					if (e.keyCode == 27) {
						var field = $(':focus');
						if (field && field.length === 0) {
							var grid = me.getGrid();
							if (grid && grid.rowEditor
									&& grid.rowEditor.editing)
								grid.rowEditor.cancelEdit();

						}
					}
				});
		$(document).off('addGridRow');
		$(document).on('addGridRow', function(event) {
			if (me.charEditable === 'Y') {
				var grid = me.getGrid(), record = null;
				if (grid && grid.rowEditor) {
					record = grid.rowEditor.context
							&& grid.rowEditor.context.record
							? grid.rowEditor.context.record
							: null;
					isEmptyRecordExist = (record && record.get('__metadata') && Ext
							.isEmpty((record.get('__metadata'))._detailId));
					isEmptyRecordExist = me.isEmptyRecordExist();
					if (!isEmptyRecordExist) {
						grid.rowEditor.getEditor().allowFirstFieldFocus = true;
						me.createEmptyRow();
					}
				}

			}

		});
		me.items = [groupView];
		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	},
	isEmptyRecordExist : function() {
		var me = this, isEmptyRecordExist = false, grid = me.getGrid(), objStore = null, arrRecords = [];
		if (!Ext.isEmpty(grid)) {
			objStore = grid.getStore();
			arrRecords = objStore.getRange() || [];
			objStore.each(function(record, idx) {
				// TODO : first condition to be removed
				if (Ext.isEmpty(record.get('__metadata'))
						|| (record && record.get('__metadata') && Ext
								.isEmpty((record.get('__metadata'))._detailId))) {
					isEmptyRecordExist = true;
					return;
				}
			});
		}
		return isEmptyRecordExist;
	},
	getFirstEmptyRecord : function() {
		var me = this, isEmptyRecordExist = false, grid = me.getGrid(), objStore = null, arrRecords = [], objRecord = null;
		if (!Ext.isEmpty(grid)) {
			objStore = grid.getStore();
			arrRecords = objStore.getRange() || [];
			objStore.each(function(record, idx) {
				// TODO : First condition to be removed
				if (!objRecord
						&& (Ext.isEmpty(record.get('__metadata')) || (record
								&& record.get('__metadata') && Ext
								.isEmpty((record.get('__metadata'))._detailId)))) {
					objRecord = record;
				}
			});
		}
		return objRecord;
	},
	getEmptyRecordCount : function() {
		var me = this, isEmptyRecordExist = false, grid = me.getGrid(), objStore = null, arrRecords = [], intCnt = 0;
		if (!Ext.isEmpty(grid)) {
			objStore = grid.getStore();
			arrRecords = objStore.getRange() || [];
			objStore.each(function(record, idx) {
						if (record
								&& record.get('__metadata')
								&& Ext
										.isEmpty((record.get('__metadata'))._detailId)) {
							intCnt++;
						}
					});
		}
		return intCnt;
	},
	createGroupView : function() {
		var me = this;
		var groupView = null, arrCols = null, grid = null;
		var gridCfg = null;
		var dataObj = me.cloneObject(me.gridMetaData);
		var enableRowEditing = me.charEditable === 'Y' ? true : false;
		gridCfg = me.createGridPreRequisites(dataObj, false);
		me.gridCfg = gridCfg;
		if (gridCfg.columnModel && gridCfg.storeFields) {
			arrCols = me.getColumnModel(gridCfg.columnModel);
			me.defaultColumnModel = arrCols;
			groupView = Ext.create('Ext.ux.gcp.GroupView', {
				id : 'gridEntryGroupView',
				itemId : 'gridEntryGroupView',
				cfgGroupByUrl : 'static/scripts/fsc/PurchaseOrder/data/groupBy.json',
				// TODO : To be added in label js
				cfgSummaryLabel : getLabel('lineItems', 'Line Items'),
				cfgGroupByLabel : getLabel('groupedBy', 'Grouped By'),
				cfgGroupCode : null,
				cfgSubGroupCode : null,
				cls : 't7-grid txn-dropdown-icon',
				cfgShowFilter : false,
				cfgShowRefreshLink : false,
				cfgSmartGridSetting : true,
				cfgCollpasible : false,
				cfgGroupingDisabled : true,
				cfgShowAdvancedFilterLink : false,
				cfgShowFilterInfo : false,
				cfgFilterModel : {},
				cfgGridModel : {
					id : 'gridEntryLineItemDetails',
					itemId : 'gridEntryLineItemDetails',
					stateful : false,
					showEmptyRow : false,
					enableColumnAutoWidth : false,
					showCheckBoxColumn : me.isEnableGridActions,
					checkBoxColumnWidth : _GridCheckBoxWidth,
					enableRowEditing : true,
					hideRowNumbererColumn : true,
					pageSize : 10,
					rowList : _AvailableGridSize,
					multiSort : false,
					enableLocking : true,
					columnModel : arrCols,
					groupActionModel : me.getActionBarItems('G') || [],
					storeModel : {
						fields : gridCfg.storeFields,
						proxyUrl : _mapUrl['gridLayoutDataUrl'],
						rootNode : 'd.transactions',
						totalRowsNode : 'd.__count'
					},
					/**
					 * @cfg {Array} groupActionModel This is used to create the
					 *      items in Action Bar
					 * 
					 * @example
					 * The example for groupActionModel as below : 
					 * 	[{
					 *	  //@requires Used while creating the action url.
					 *		actionName : 'submit',
					 *	  //@optional Used to display the icon.
					 *		itemCls : 'icon-button icon-submit',
					 *	  //@optional Defaults to true. If true , then the action will considered
					 *	            in enable/disable on row selection.
					 *		isGroupAction : false,
					 *	  //@optional Text to display
					 *		itemText : getLabel('instrumentsActionSubmit', 'Submit'),
					 *	  //@requires The position of the action in mask.
					 *		maskPosition : 5
					 *	  //@optional The position of the action in mask.
					 *		fnClickHandler : function(tableView, rowIndex, columnIndex, btn, event,
					 *						record) {
					 *		},
					 *	}, {
					 *		actionName : 'verify',
					 *		itemCls : 'icon-button icon-verify',
					 *		itemText : getLabel('instrumentsActionVerify', 'Verify'),
					 *		maskPosition : 13
					 *}]
					 */
					// groupActionModel : me.getGroupActionModel(),
					defaultColumnModel : arrCols,
					fnRowIconVisibilityHandler : function(store, record,
							jsonData, itmId, maskPosition) {
						return me.isRowIconVisible(store, record, jsonData,
								itmId, maskPosition);
					}
				},
				doValidateRecordEdit : function(record, editor, grid, context) {
					me.validateRowFields(grid);
				},
				doBeforeRecordEdit : function(record, editor, grid, context) {
					var isNewRecord = (record && record.get('__metadata') && Ext
							.isEmpty((record.get('__metadata'))._detailId)), objField = null;
					grid.createEmptyRow = false;
					if (me.charEditable === 'N' || me.isViewOnly)
						return false;
					// doClearMessageSection();
					me.handleFieldProperties(context.grid);
					me.clearValidations(context.grid);
					me.doBindEvents(context.grid);
					objField = editor.getEditor()
							.down('textfield[name="lineAmount"]');
					window.setTimeout(function() {
								if (!isNewRecord
										&& objField
										&& objField.getActionEl()
										&& !Ext
												.isEmpty(objField.getActionEl().id)) {
									$('#' + objField.getActionEl().id)
											.trigger('blur');
								}
							}, 100);
					return true;
				},
				doRecordEdit : function(record, editor, grid, context) {
					me.doSaveRecord(record, editor, grid, false, true, null,
							false);
				},
				doRecordEditPrevious : function(prevRecord, currentRecord,
						editor, grid, preContext) {
					if (me.checkIsDirtyRecord())
						me.doSaveRecord(editor.context.record, editor, grid,
								false, true, prevRecord, false);
				},
				doCancelRecordEdit : function(record, editor, grid, context) {
					if (me.isEmptyRecordExist()) {
						var rec = me.getFirstEmptyRecord();
						if (rec) {
							editor.startEdit(rec, 0);
						}
					}
					doClearMessageSection();
				},
				listeners : {
					'groupByChange' : function(menu, groupInfo) {
						// me.doHandleGroupByChange(menu, groupInfo);
					},
					'groupTabChange' : function(groupInfo, subGroupInfo,
							tabPanel, newCard, oldCard) {
						me.doHandleGroupTabChange(groupInfo, subGroupInfo,
								tabPanel, newCard, oldCard);

					},
					'gridRender' : function(groupInfo, subGroupInfo, grid, url,
							pgSize, newPgNo, oldPgNo, sorter, filterData) {
						if (isFirstFocus === true && grid.rowEditor) {
							grid.rowEditor.allowFirstFieldFocus = false;
						}
						grid.store.on('smartStoreLoad',
								function(store, records) {
									var targetRow = null;
									if (store) {
										store.each(function(record, idx) {
											targetRow = null;
											if (record.data.hasError === true)
												targetRow = Ext
														.get(grid.getView()
																.getNode(idx));
											if (targetRow)
												targetRow
														.addCls('xn-error-row');
										});
									}

								});
						/*
						 * grid.on('validateedit', function(editor, e) {
						 * me.validateRowFields(e.grid); });
						 * grid.on('beforeedit', function(editor, e) { if
						 * (me.charEditable === 'N') return false;
						 * me.handleFieldProperties(e.grid);
						 * me.clearValidations(e.grid); });
						 * grid.on('savePreviousRecord', function() { });
						 */
						me.handleLoadGridData(groupInfo, subGroupInfo, grid,
								url, pgSize, newPgNo, oldPgNo, sorter,
								filterData);
					},
					'gridPageChange' : function(groupInfo, subGroupInfo, grid,
							url, pgSize, newPgNo, oldPgNo, sorter, filterData) {
						me.handleLoadGridData(groupInfo, subGroupInfo, grid,
								url, pgSize, newPgNo, oldPgNo, sorter,
								filterData);
					},
					'gridSortChange' : function(groupInfo, subGroupInfo, grid,
							url, pgSize, newPgNo, oldPgNo, sorter, filterData) {
						me.handleLoadGridData(groupInfo, subGroupInfo, grid,
								url, pgSize, newPgNo, oldPgNo, sorter,
								filterData);
					},
					'gridPageSizeChange' : function(groupInfo, subGroupInfo,
							grid, url, pgSize, newPgNo, oldPgNo, sorter,
							filterData) {
						me.handleLoadGridData(groupInfo, subGroupInfo, grid,
								url, pgSize, newPgNo, oldPgNo, sorter,
								filterData);
					},
					'gridRowSelectionChange' : function(groupInfo,
							subGroupInfo, objGrid, objRecord, intRecordIndex,
							arrSelectedRecords, jsonData) {
						me.doHandleGridRowSelectionChange(groupInfo,
								subGroupInfo, objGrid, objRecord,
								intRecordIndex, arrSelectedRecords, jsonData);
					},
					'gridRowActionClick' : function(grid, rowIndex,
							columnIndex, actionName, record, event) {
						me.handleRowIconClick(grid, rowIndex, columnIndex,
								actionName, event, record);
					},
					'groupActionClick' : function(actionName, isGroupAction,
							maskPosition, grid, arrSelectedRecords) {
						if (isGroupAction === true)
							me.doHandleGroupActions(actionName, grid,
									arrSelectedRecords, 'groupAction');

					},
					'toggleGridPager' : function(grid, pager, blnShowPager) {
						grid.showPagerForced = blnShowPager;
						pager.showPagerForced = blnShowPager;
					},
					'gridStoreLoad' : function(grid, store) {
						me.disableActions(false);
					},
					'afterrender' : function(ct) {
						// arrItems.push({xtype : 'container', id : 'emptyCt'});
						var objCt = ct
								.down('container[itemId="navigationContainer"]');
						if (objCt) {
							objCt.insert(0, {
										xtype : 'container',
										id : 'emptyCt',
										padding : '0 0 0 20',
										listeners : {
											'render' : function() {
												// TODO : To be handled
												if (me.isViewOnly !== true)
													$('#poInstActionCt')
															.appendTo($('#emptyCt'));

											}
										}
									});
						}
					}
				}
			});
		}
		return groupView
	},
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) {
		var me = this;
		var objGroupView = me.down('groupView[itemId="gridEntryGroupView"]');
		var strModule = '', strUrl = null, args = null, strFilterCode = null, gridMeta = null, gridCfg = null;
		groupInfo = groupInfo || {};
		subGroupInfo = subGroupInfo || {};
		if (groupInfo) {
			strFilterCode = subGroupInfo.groupCode;
			if (typeof loadLineItemFieldsForGridLayout != 'undefined'
					&& typeof loadLineItemFieldsForGridLayout === 'function'
					&& strFilterCode !== 'all') {
				strUrl = Ext.String.format(_mapUrl['loadLineItemFieldsUrl'],
						strHeaderIdentifier)
				objGroupView.setLoading(true);
				me.isLoadingIndicatorOn = true;
				gridMeta = loadLineItemFieldsForGridLayout(strHeaderIdentifier,
						strUrl);
				if (gridMeta) {
					me.gridMetaData = gridMeta;
					gridCfg = me.getGroupGridModel(gridMeta);
					objGroupView.reconfigureGrid(gridCfg);
				} else {
					me.gridMetaData = me.cloneObject(me.gridDefaultMetaData);
					gridCfg = me.getGroupGridModel(me.gridMetaData);
					objGroupView.reconfigureGrid(gridCfg);
				}
			} else {
				me.gridMetaData = me.cloneObject(me.gridDefaultMetaData);
				gridCfg = me.getGroupGridModel(me.gridMetaData);
				objGroupView.reconfigureGrid(gridCfg);
			}
		}
	},

	getGroupGridModel : function(gridMeta) {
		var me = this;
		var dataObj = null, enableRowEditing = false, gridCfg = null, retCfg = null, arrCols = null;
		dataObj = me.cloneObject(gridMeta);
		enableRowEditing = me.charEditable === 'Y' ? true : false;
		gridCfg = me.createGridPreRequisites(dataObj, false);
		if (gridCfg.columnModel && gridCfg.storeFields) {
			arrCols = me.getColumnModel(gridCfg.columnModel);
			retCfg = {
				enableRowEditing : true,
				columnModel : arrCols,
				storeModel : {
					fields : gridCfg.storeFields,
					proxyUrl : Ext.String.format(_mapUrl['gridLayoutDataUrl'],
							strHeaderIdentifier),
					rootNode : 'd.transactions',
					totalRowsNode : 'd.__count'
				}
			};
		}
		return retCfg;
	},
	getColumnModel : function(jsonCols) {
		var arrAvlCols = null;
		var arrCols = new Array(), column = null, colError = null, colGroupAction = null, strPostFix = null;
		var me = this;
		var objEnrichments = null, arrEnrichFields = null, arrColumns = null, strGridColumns = null;
		if (me.gridMetaData
				&& me.gridMetaData.d
				&& me.gridMetaData.d.poEntry
				&& (me.gridMetaData.d.poEntry.txnGridColumns || me.gridMetaData.d.poEntry.txnGridColomn)) {
			strGridColumns = (me.gridMetaData.d.poEntry.txnGridColumns || me.gridMetaData.d.poEntry.txnGridColomn);
			// strGridColumns
			// ='lineCode,quantity,rate,amountCurrency,lineAmount,remarks';
			arrAvlCols = strGridColumns.split(',');
		}
		if (!Ext.isEmpty(arrAvlCols)) {
			Ext.Array.each(arrAvlCols, function(strCol, index) {
						if (!Ext.isEmpty(jsonCols[strCol])) {
							column = jsonCols[strCol];
							column.locked = false;
							column.sortable = true;
							column.hideable = false;
							column.draggable = false;
							column.minWidth = 120;
							if (Ext.isEmpty(column.fnColumnRenderer)) {
								column.fnColumnRenderer = function(value, meta,
										record, rowIndex, colIndex, store,
										view, colId) {
									meta.tdAttr = 'title="' + value + '"';
									return value;
								};
							}
							if(strCol == "lineAmount" || strCol == "rate" || strCol == "quantity")
								column.align = 'right';
								
							if (strCol == "lineAmount"){
								column.width = 200;
							}
							if (strCol == "remarks"){
								column.width = 250;
							}
							else
								column.width = 'auto';

							if (index > 3)
								column.lockable = false;
							else
								column.lockable = true;
							arrCols.push(column);
						}
					});
		}
		colError = me.createErrorActionColumn();
		colGroupAction = me.createGroupActionColumn();
		colGroupAction.items = colGroupAction.items || [];
		arrColumns = [colError, colGroupAction];
		return arrColumns.concat(arrCols || []);
	},

	validateRowFields : function(grid) {
		var me = this;
		if (grid && grid.columns) {
			Ext.each(grid.columns, function(col) {
						if (col && col.getEditor())
							me.validateField(col.getEditor());
					});
		}
	},
	validateField : function(field) {
		if (field) {
			if (field.isMandatory === true) {
				if (!Ext.isEmpty(field.getValue()))
					field.removeCls('xn-required');
				else
					field.addCls('xn-required');
			}
		}
	},
	clearValidations : function(grid) {
		var me = this;
		if (grid && grid.columns) {
			Ext.each(grid.columns, function(col) {
						if (col && col.getEditor())
							(col.getEditor()).removeCls('xn-required');
					});
		}
	},
	doBindEvents : function(grid, isDirty) {
		var me = this;
		var isFocused = false, lastField = null, editor = null;
		if (grid && grid.columns) {
			Ext.each(grid.columns, function(col) {
						editor = col && col.getEditor()
								? col.getEditor()
								: null;
						if (editor && editor.xtype !== 'displayfield') {
							if (!isFocused) {
								isFocused = true;
								// editor.focus(true);
							}
							lastField = editor;
						}
						if (me.fieldValidationBinded !== true) {
							editor.on('blur', function(obj) {
										me.validateField(obj);
									});
						}
					});
			if (me.fieldValidationBinded === true) {
				me.fieldValidationBinded = false;
			}
			lastField.requestFired = false;
			if (lastField && !lastField.isBlurBinded) {
				lastField.isBlurBinded = true;
				lastField.enableKeyEvents = true;
				lastField.on('keydown', function(cmp, e) {
							if (e && e.getKey() == e.ENTER) {
								if (cmp.requestFired)
									e.stopEvent();
								else
									cmp.requestFired = true;
							}
						});
				lastField.on('blur', function(cmp) {
					if(!verifyClicked){
							if (!cmp.requestFired) {
								cmp.requestFired = true;
								grid.rowEditor.completeEdit();

							}	
					     }
					     verifyClicked=false
						});
				
			}
		}
	},
	doSetDirty : function(grid, isDirty) {
		var me = this;
		if (grid && grid.columns) {
			Ext.each(grid.columns, function(col) {
						if (col && col.getEditor()) {
							col.getEditor().originalValue = null;
						}
					});
		}
	},
	handleFieldProperties : function(grid) {
		var me = this, field = null;
		if (grid && grid.columns) {
			Ext.each(grid.columns, function(col) {
						if (col && col.getEditor()) {
							field = col.getEditor();
							if (field) {
								if (field.xtype === 'combobox') {
									var isDisabled = (field.store.count() === 1)
											? true
											: (field.disabled === true
													? true
													: false);
									field.setDisabled(isDisabled);
								}
							}
						}
					});
		}
	},
	createGridPreRequisites : function(objData, captureDataOnly) {
		var me = this;
		var data = me.cloneObject(objData);
		// var data = me.gridMetaData;
		var storeFields = new Array(), columnModel = {}, arrFields = null, dataPmtEntry = null, dataEnrich = null, objCol = null, objEditor = null, strPostFix = '';
		var gridCfg = {}, autoCfgUrl = '', rowData = {}, objDefValue = null, strLabel = '';
		storeFields.push('__metadata');
		storeFields.push('__status');
		storeFields.push('__errors');
		storeFields.push({
					name : 'hasError',
					type : 'bool',
					defaultValue : false
				});

		if (!Ext.isEmpty(data) && data.d && data.d.poEntry) {
			if (data.d.poEntry.message && data.d.poEntry.message.errors)
				rowData['__errors'] = data.d.poEntry.message.errors;

			if (data.d.__metadata && data.d.__metadata)
				rowData['__metadata'] = data.d.__metadata;
				
			if (captureDataOnly && data.d.poEntry.__metadata
					&& !Ext.isEmpty(data.d.poEntry.__metadata._status)) {
				rowData['__status'] = data.d.poEntry.__metadata._status;
			}
			objCol = {
				colId : '__status',
				colHeader : getLabel('lineItemStatus', 'Status'),
				sortable : false,
				hideable : false,
				draggable : false
			};
			columnModel['__status'] = objCol;

			dataPmtEntry = data.d.poEntry;
			arrFields = dataPmtEntry.standardField;
			// "Standard Field" Node's field addition
			if (!Ext.isEmpty(arrFields))
				Ext.each(arrFields, function(item) {
					if (captureDataOnly) {
						objDefValue = item.value;
						if ((item.dataType === 'select' || item.dataType === 'radio')
								&& item.availableValues
								&& item.availableValues.length > 0) {
							if (item.availableValues.length === 1)
								objDefValue = item.availableValues[0].code
										? item.availableValues[0].code
										: '';
							else if (item.fieldName === 'charges') {
								objDefValue = Ext.isEmpty(item.value)
										? item.availableValues[0].code
										: '' + item.value;

							}

						} else if (item.dataType === 'checkBox') {
							objDefValue = objDefValue === 'Y' ? true : false;
						}
						rowData[item.fieldName + '_stdField'] = objDefValue;
						if (item.fieldName === 'lineAmount') {
							rowData['lineAmountFormatted_stdField'] = item.formattedValue
									|| ''
						}
					} else {
						strLabel = item.label;
						objCol = {
							colId : item.fieldName + '_stdField',
							colHeader : strLabel,
							sortable : false,
							hideable : false,
							draggable : false
						};
						if (item.dataType === 'date') {
							storeFields.push({
										name : item.fieldName + '_stdField',
										type : 'date',
										format : strExtApplicationDateFormat
									});
							objCol.fnColumnRenderer = Ext.util.Format
									.dateRenderer(strExtApplicationDateFormat);
						} else if (item.code === 'lineAmount') {
							storeFields.push({
										name : item.fieldName + '_stdField',
										type : 'float'
									});
							storeFields.push({
										name : item.fieldName
												+ 'Formatted_stdField',
										type : 'string'
									});
							objCol.colType = 'amount';
							objCol.fnColumnRenderer = function(value, meta,
									record, rowIndex, colIndex, store, view,
									colId) {
								var retValue = '';
								var obj = $('<input type="text">');
									obj.autoNumeric('init');
									obj.autoNumeric('set',value);
									strValue = obj.val();
									obj.remove();
								/*if (isNaN(value)) {
									retValue = (store.proxy.reader.rawData
											&& store.proxy.reader.rawData.d
											&& store.proxy.reader.rawData.d.transactions
											&& store.proxy.reader.rawData.d.transactions.length > 0
											&& !Ext
													.isEmpty(store.proxy.reader.rawData.d.transactions[rowIndex].amountFormatted_stdField)
											? store.proxy.reader.rawData.d.transactions[rowIndex].amountFormatted_stdField
											: '');
								} else

									retValue = strValue;
								if (record.get('lineAmountFormatted_stdField') !== '0')
									retValue = record
											.get('lineAmountFormatted_stdField');

								meta.tdAttr = 'title="' + retValue + '"';*/
								return strValue;
							};
						} else if (item.dataType === 'checkBox') {
							storeFields.push({
										name : item.fieldName + '_stdField',
										type : 'bool',
										defaultValue : false
									});
							objCol.fnColumnRenderer = function(value, meta,
									record, rowIndex, colIndex, store, view,
									colId) {
								if (value === true)
									return 'Y';
								else
									return 'N'
							};

						} else if (item.dataType === 'radio') {
							if (item.availableValues
									&& item.availableValues.length > 0) {
								storeFields.push(item.fieldName + '_stdField');
								objCol.fnColumnRenderer = function(value, meta,
										record, rowIndex, colIndex, store,
										view, colId) {
									var grid = me.getGrid();
									var col = grid.down('gridcolumn[itemId="'
											+ colId + '"]');
									var retValue = value;
									if (col && col.getEditor()) {
										var store = (col.getEditor().store)
												? col.getEditor().store
												: null;
										if (store) {
											var rec = store.findRecord('code',
													value);
											if (rec
													&& !Ext
															.isEmpty(rec.data.description))
												retValue = rec.data.description;
										}
									}
									meta.tdAttr = 'title="' + retValue + '"';
									return retValue;
								}
							} else {
								storeFields.push({
											name : item.fieldName + '_stdField',
											type : 'bool',
											defaultValue : false
										});
								objCol.fnColumnRenderer = function(value, meta,
										record, rowIndex, colIndex, store,
										view, colId) {
									if (value === true)
										return 'Y';
									else
										return 'N'
								};
							}

						} else if (item.dataType === 'select') {
							storeFields.push(item.fieldName + '_stdField');
							objCol.fnColumnRenderer = function(value, meta,
									record, rowIndex, colIndex, store, view,
									colId) {
								var grid = me.getGrid();
								// var col = grid.columns[colIndex];
								var col = grid.down('gridcolumn[itemId="'
										+ colId + '"]');
								var retValue = value;
								if (col && col.getEditor()) {
									var store = (col.getEditor().store) ? col
											.getEditor().store : null;
									if (store) {
										var rec = store.findRecord('code',
												value);
										if (rec
												&& !Ext
														.isEmpty(rec.data.description))
											retValue = rec.data.description;
									}
								}
								meta.tdAttr = 'title="' + retValue + '"';
								return retValue;
							}
						} else
							storeFields.push(item.fieldName + '_stdField');
						objEditor = me
								.getColumnEditor(item, '_stdField', false);
						// objEditor = {allowBlank : true};
						if (!Ext.isEmpty(objEditor)) {
							if (!Ext.isEmpty(item.displayMode)
									&& item.displayMode === '3') {
								// objEditor.allowBlank = true;
								objCol.colHeader = '<span class="requiredLeft">'
										+ item.label + '</span>';
								objEditor.isMandatory = true;
							}
							objEditor.on('blur', function(obj) {
										me.validateField(obj);
									});
							objCol.editor = objEditor;
						}
						columnModel[item.fieldName] = objCol;
					}
				});
		}
		if (captureDataOnly) {
			return rowData;
		} else {
			gridCfg.storeFields = storeFields;
			gridCfg.columnModel = columnModel;
			return gridCfg;
		}

	},
	createEmptyRow : function(intRows) {
		var me = this;
		var emptyRecord = null, record = null, isDirty = false, isEmptyRecordExist = false, intCount = !Ext
				.isEmpty(intRows) ? parseInt(intRows,10) : (!Ext
				.isEmpty(me.intAddEmptyRow) ? parseInt(me.intAddEmptyRow,10) : 1);
		var objGroupView = me.down('groupView[itemId="gridEntryGroupView"]');
		if (me.gridMetaData) {
			emptyRecord = {};
			var dataObj = me.cloneObject(me.gridMetaData);
			emptyRecord = me.createGridPreRequisites(dataObj, true);
		}
		if (emptyRecord) {
			var grid = me.getGrid();
			var intInst = getNoOfLineItemToBeAdded(grid.store.getCount(),
					intCount);
			if (!Ext.isEmpty(intInst))
				intCount = intInst;
			if (grid && grid.rowEditor) {
				if (!grid.rowEditor.editing && !me.isLoadingIndicatorOn) {
					for (var i = 0; i < intCount; i++)
						grid.store.insert(0, emptyRecord);
					grid.rowEditor.startEdit(0, 0);
					if (isFirstFocus) {
						autoFocusFirstElement();
						isFirstFocus = false;
					}
					me.doSetDirty(grid, true);
					grid.getView().refresh();

				} else {
					record = grid.rowEditor.context
							&& grid.rowEditor.context.record
							? grid.rowEditor.context.record
							: null;
					isDirty = grid.rowEditor.getEditor().isDirty()
							&& (record && record.get('__metadata') && !Ext
									.isEmpty((record.get('__metadata'))._detailId));
					isEmptyRecordExist = (record && record.get('__metadata') && Ext
							.isEmpty((record.get('__metadata'))._detailId));
					if (isDirty) {
						grid.createEmptyRow = true;
						me.doSetDirty(grid, true);
						grid.rowEditor.completeEdit();
					} else if (!isEmptyRecordExist) {
						grid.rowEditor.cancelEdit();
						grid.store.insert(0, emptyRecord);
						grid.rowEditor.startEdit(0, 0);
						me.doSetDirty(grid, true);
						grid.getView().refresh();
					}
				}
			}
		}
	},
	doSaveRecord : function(record, editor, grid, blnPrdCutOff, canEdit,
			prevRecord, addUsing) {
				var headerError=new Array();
		if (intHdrDirtyBit > 0)
		var result=doSavePurchaseOrderHeaderSilent();
		if(result && result.success && result.success==="FAILED"){
		var error=true;
		 if(result.errors){
		 	blockPOUI(false);
		 	var err=result.errors;
		 	for(i=0;i<err.length;i++){
	        headerError.push(err[i]);
	        }
		 }
		 else{
		                    var arrError = new Array();
							arrError.push({
										"errorCode" : "Message",
										"errorMessage" : mapLbl['unknownErr']
									});
							doHandleUnknownError();
		   }
	    }
		var me = this, groupView = me.getGroupView();
		var rec = prevRecord || record;
		var jsonData = null
		var strTxnReferenceNo = null;
		var strUrl = _mapUrl['saveLineItemUrl'];
		var jsonPost = null;
		var canAddAnother = false, metaData = null, nextRecord = null, isDirty = false, arrErors = [], hasError = false;

		if (!strUrl)
			return false;
		jsonData = me.doGenerateSaveLineItemJson(rec);
		strTxnReferenceNo = jsonData.txnReference;
		jsonPost = jsonData.jsonPost;
		canAddAnother = (grid.createEmptyRow === true || Ext
				.isEmpty(jsonPost.d.__metadata._detailId)) ? true : false;
		if (!addUsing)
			groupView.setLoading(true);
		me.isLoadingIndicatorOn = true;
		Ext.Ajax.request({
			url : strUrl,
			method : 'POST',
			jsonData : Ext.encode(jsonPost),
			success : function(response) {
				var data = Ext.decode(response.responseText);
				var status = null;
				if (data && data.d) {
					if (data.d.poEntry && data.d.poEntry.message
							&& data.d.poEntry.message.success)
						status = data.d.poEntry.message.success;
					if (status === 'SUCCESS' || status === 'SAVEWITHERROR') {
						gridError=false;
						if (status === 'SUCCESS') {
							doClearMessageSection();
						}
						if (status === 'SAVEWITHERROR') {
							if (data.d.poEntry.message.errors) {
								hasError = true;
								arrErors = data.d.poEntry.message.errors;
								// paintErrors(data.d.poEntry.message.errors);
							}

						}
						if (data.d.poEntry && data.d.__metadata
								&& data.d.__metadata._headerId)
							strHeaderIdentifier = data.d.__metadata._headerId;

						groupView.setLoading(false);
						me.isLoadingIndicatorOn = false;
						if (!addUsing) {
							//var strStatus = data.d.poEntry.__metadata._status
								//	|| rec.get('__status');
							metaData = data.d.__metadata
									|| rec.get('__metadata') || {};
							// metaData['_detailId'] =
							// data.d.__metadata._detailId;
							rec.beginEdit();
							rec.set({
										__metadata : metaData,
										__errors : arrErors,
										//__status : strStatus,
										hasError : hasError,
										lineAmountFormatted_stdField : me
												.getFormatedAmount(data)
									});
							rec.endEdit();
							rec.commit();
							me.handleEditToggle(grid, editor, record,
									prevRecord, canAddAnother);
						} else {
							// me.refreshData();
						}
						if (!Ext.isEmpty(grid.fnFocusOutCallback)) {
							me.doHandleCallBack(grid.callBackScope);
						}

					} else if (status === 'FAILED') {
						gridError=true;
						groupView.setLoading(false);
						me.isLoadingIndicatorOn = false;
						if (data.d.poEntry.message) {
							var arrError = data.d.poEntry.message.errors, errCode = null;
							if (arrError && arrError.length > 0) {
								$.each(arrError, function(index, error) {
											// strMsg = error.errorMessage;
											errCode = error.errorCode;
										});
							}
							if (arrError){
							for(i=0;i<arrError.length;i++){
							headerError.push(arrError[i]);
							}
							paintErrors(headerError);	
							}
							if (canEdit && grid && grid.rowEditor) {
								if (!grid.rowEditor.editing) {
									grid.rowEditor.startEdit(rec, 0);
								} else if (prevRecord) {
									//grid.rowEditor.cancelEdit();
									grid.rowEditor.startEdit(rec, 0);
									me.doSetDirty(grid, true);
								}
								// me.doSetDirty(grid, true);
							}
						}
					} else if (isEmpty(status) && data.d.poEntry.message.errors) {
						doClearMessageSection();
						// paintErrors(data.d.poEntry.message.errors);
						record.beginEdit();
						record.set({
									__errors : data.d.poEntry.message.errors,
									hasError : true
								});
						record.endEdit();
						record.commit();
						blockPOUI(false);
					}
				}
			},
			failure : function() {
				var errMsg = "";
				Ext.MessageBox.show({
							title : getLabel('instrumentErrorPopUpTitle',
									'Error'),
							msg : getLabel('instrumentErrorPopUpMsg',
									'Error while fetching data..!'),
							buttons : Ext.MessageBox.OK,
							buttonText: {
					            ok: getLabel('btnOk', 'OK')
								},
							icon : Ext.MessageBox.ERROR
						});
			}
		});
		groupView.handleGroupActionsVisibility(me.strDefaultMask);
	},
	getFormatedAmount : function(data) {
		var strFormattedAmount = '';
		if (data && data.d && data.d.poEntry && data.d.poEntry.standardField) {
			Ext.each(data.d.poEntry.standardField, function(item) {
						if (item.fieldName === 'lineAmount') {
							strFormattedAmount = (item.formattedValue || item.value);
							return false;
						}
					});
		}
		return strFormattedAmount;
	},
	handleEditToggle : function(grid, editor, record, prevRecord, canAddAnother) {
		var me = this, nextRecord = null;
		if (grid.isFocusOut !== true) {
			if (editor) {
				if (prevRecord) {
					editor.startEdit(record, 0);
				} else {
					var curIndex = grid.getRecordIndex(record);
					if (curIndex !== -1) {
						nextRecord = grid.getRecord(curIndex + 1);
						if (nextRecord) {
							grid.rowEditor.cancelEdit();
							editor.startEdit(nextRecord, 0);
						}
					}
				}
				grid.getView().refresh();
			}
		}
		grid.isFocusOut = false;
	},
	doGenerateSaveLineItemJson : function(record) {
		var me = this;
		var data = me.cloneObject(me.gridMetaData), recData = record.data
				|| record;
		var arrFields = null, dataPmtEntry = null, arrJsonFields = new Array(), objValue = '', strTxnReference = '', strTxnType = null;
		var retJson = {
			d : {
				poEntry : {
					standardField : []
				},
				__metadata : {}
			}
		};
		if (!Ext.isEmpty(data) && data.d && data.d.poEntry) {
			dataPmtEntry = data.d.poEntry;
			// "Standard Field" Node's field addition
			if (dataPmtEntry.standardField) {
				arrFields = dataPmtEntry.standardField;
				arrJsonFields = new Array();
				if (!Ext.isEmpty(arrFields))
					Ext.each(arrFields, function(item) {
						if (item.dataType === 'date') {
							if (recData[item.fieldName + '_stdField']) {
								arrJsonFields.push({
											fieldName : item.fieldName,
											value : Ext.Date
													.format(
															recData[item.fieldName
																	+ '_stdField'],
															strExtApplicationDateFormat)
										});
							}
						} else if (item.dataType === 'checkBox') {
							objValue = recData[item.fieldName + '_stdField'] === true
									? 'Y'
									: 'N';
							arrJsonFields.push({
										fieldName : item.fieldName,
										value : objValue
									});
						} else {
							objValue = recData[item.fieldName + '_stdField'];
							arrJsonFields.push({
										fieldName : item.fieldName,
										value : objValue
									});
						}
					});
				retJson.d.poEntry.standardField = arrJsonFields;
			}

		}
		retJson.d.__metadata = recData['__metadata'] || {};
		retJson.d.__metadata._headerId = strHeaderIdentifier;
		return {
			jsonPost : retJson,
			txnReference : strTxnReference
		};
	},
	colRendererCombo : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var me = this;
		var grid = getGrid();
		var col = grid.columns[colIndex];
		var retValue = value;
		if (col && col.getEditor()) {
			var store = (col.getEditor().store) ? col.getEditor().store : null;
			if (store) {
				var rec = store.findRecord('code', value);
				if (rec && !Ext.isEmpty(rec.data.description))
					retValue = rec.data.description;
			}
		}
		return retValue;
	},
	getColumnEditor : function(fldCfg, strPostFix, isEnrichment) {
		var me = this;
		var field = null;
		if (isEnrichment) {
		} else {
			var dataType = fldCfg.dataType, defValue = fldCfg.value, strFldName = fldCfg.fieldName
					+ strPostFix;
			var blnReadOnly = (fldCfg.readOnly === 'true') ? true : false;
			var maxLength = _mapFieldLength[fldCfg.fieldName];
			if (dataType) {
				switch (dataType) {
					case 'text' :
						field = me.createTextField(strFldName, defValue,
								maxLength, blnReadOnly);
						break;
					case 'select' :
						field = me.createComboField(strFldName, defValue,
								fldCfg.availableValues, blnReadOnly);
						break;
					case 'multiSelect' :
					case 'mask' :
						field = me.createMultiSelectComboField(strFldName,
								defValue, fldCfg.availableValues, blnReadOnly);
						break;
					case 'seek' :
						break;
					case 'date' :
						field = me.createDateField(strFldName, maxLength,
								blnReadOnly);
						break;
					case 'amount' :
						field = me.createAmountField(strFldName, defValue,
								maxLength, blnReadOnly);
						break;
					case 'number' :
						field = me.createNumberField(strFldName, defValue,
								maxLength, blnReadOnly);
						break;
					case 'radio' :
						field = me.createComboField(strFldName, defValue,
								fldCfg.availableValues, blnReadOnly);
						break;
					case 'checkBox' :
						field = me.createCheckboxField(strFldName, defValue);
						break;
				}
			}

		}
		return field;

	},
	createTextField : function(fieldId, defValue, intMaxLength, isReadOnly) {
		var fieldCfg = {
			fieldCls : 'grid-field',
			allowBlank : true,
			itemId : fieldId,
			name : fieldId,
			disabled : isReadOnly,
			focusable : true,
			value : defValue ? defValue : '',
			defValue : defValue ? defValue : ''
		};
		if (!Ext.isEmpty(intMaxLength)) {
			fieldCfg.maxLength = intMaxLength;
			fieldCfg.enforceMaxLength = true;
		}
		return Ext.create('Ext.form.TextField', fieldCfg);
	},
	createCheckboxField : function(fieldId, defValue) {
		var fieldCfg = {
			allowBlank : true,
			itemId : fieldId,
			name : fieldId,
			focusable : true,
			defValue : defValue ? defValue : 'N'
		};
		return Ext.create('Ext.form.field.Checkbox', fieldCfg);
	},
	createAmountField : function(fieldId, defValue, intMaxLength, isReadOnly) {
		var fieldCfg = {
			fieldCls : 'xn-valign-middle xn-form-text amountBox grid-field',
			allowBlank : true,
			itemId : fieldId,
			name : fieldId,
			disabled : isReadOnly,
			value : defValue ? defValue : '',
			defValue : defValue ? defValue : '',
			focusable : true,
			listeners : {
				'render' : function(cmp, e) {
					cmp.getEl().on('mousedown', function(ev) {
								ev.preventDefault();
								cmp.focus(true);

							})
				},
				'afterrender' : function(field) {
					var strId = field.getEl() && field.getEl().id ? field
							.getEl().id : null;
					var inputField = strId ? $('#' + strId + ' input') : null;
					if (inputField) {
						inputField.autoNumeric("init", {
									aSep : strGroupSeparator,
									aDec : strDecimalSeparator,
									mDec : strAmountMinFraction,
									vMin : 0,
									vmax : '99999999999.99'
								});
					}
				},
				'focus' : function(field, e, eOpts) {
					e.stopEvent();
					field.focus(true);
				}
			}
		};
		/*
		 * fieldCfg.maxLength = 11;// e.g 123456789.12 if (strLayoutType ===
		 * 'WIRESWIFTLAYOUT') fieldCfg.maxLength = 16; fieldCfg.enforceMaxLength =
		 * true;
		 */
		var field = Ext.create('Ext.form.TextField', fieldCfg);
		return field;
	},
	createNumberField : function(fieldId, defValue, intMaxLength, isReadOnly) {
		var fieldCfg = {
			fieldCls : 'xn-valign-middle xn-form-text grid-field',
			allowBlank : true,
			itemId : fieldId,
			name : fieldId,
			disabled : isReadOnly,
			hideTrigger : true,
			minValue : 0,
			value : defValue ? defValue : '',
			defValue : defValue ? defValue : '',
			focusable : true,
			allowExponential : false,
			spinUpEnabled : false,
			spinDownEnabled : false,
			/* setMinValue function has been overrided to avoid -value */
			setMinValue : function(value) {
				var allowed;
				this.minValue = Ext.Number
						.from(value, Number.NEGATIVE_INFINITY);
				this.toggleSpinners();
				// Build regexes for masking and stripping based on the
				// configured options
				if (this.disableKeyFilter !== true) {
					allowed = this.baseChars + '';

					if (this.allowExponential) {
						allowed += this.decimalSeparator + 'e+-';
					} else {
						if (this.allowDecimals) {
							allowed += this.decimalSeparator;
						}
						if (this.minValue < 0) {
							allowed += '-';
						}
					}

					allowed = Ext.String.escapeRegex(allowed);
					this.maskRe = new RegExp('[' + allowed + ']');
					if (this.autoStripChars) {
						this.stripCharsRe = new RegExp('[^' + allowed + ']',
								'gi');
					}
				}
			}
		};
		if (!Ext.isEmpty(intMaxLength))
			fieldCfg.maxLength = intMaxLength;
		var field = Ext.create('Ext.form.field.Number', fieldCfg);
		return field;
	},
	createDateField : function(fieldId, fldMaxLength, isReadOnly) {
		Ext.override('Ext.picker.Date', {
					getDayInitial : function(value) {
						return value.substr(0, 2);
					}
				});
		var field = Ext.create('Ext.form.field.Date', {
					fieldCls : 'xn-valign-middle xn-form-text grid-field',
					allowBlank : true,
					cls : 'ext-datepicker',
					itemId : fieldId,
					name : fieldId,
					focusable : true,
					triggerCls : 'ext-datepicker-trigger',
					editable : false,
					hideTrigger : false,
					showToday : false,
					// triggerCls : 'ft-datepicker',
					minValue : new Date(year, month - 1, parseInt(day,10)),
					format : strExtApplicationDateFormat
							? strExtApplicationDateFormat
							: 'd/m/Y',
					onExpand : function() {
						var strAppDate = dtApplicationDate;
						var dtFormat = strExtApplicationDateFormat;
						var date = new Date(Ext.Date
								.parse(strAppDate, dtFormat));
						var value = this.getValue();
						date = Ext.isDate(date) ? date : new Date();
						this.picker.setValue(Ext.isDate(value) ? value : date);
					}
				});
		return field;
	},
	createSuggestionBox : function(fieldId, defaultValue, urlDetails,
			isReadOnly) {
		var field = Ext.create('Ext.ux.gcp.AutoCompleter', {
					margin : '0 4 4 4',
					name : fieldId,
					itemId : fieldId,
					disabled : isReadOnly,
					fieldCls : 'grid-field',
					focusable : true,
					cfgTplCls : 'xn-autocompleter-t7',
					cfgSeekId : urlDetails.seekId,
					cfgQueryParamName : '$autofilter',
					cfgRootNode : urlDetails.rootNode,
					cfgDataNode1 : urlDetails.col1Node,
					cfgDataNode2 : urlDetails.col2Node,
					cfgDataNode3 : urlDetails.col3Node,
					cfgDataNode4 : urlDetails.col4Node,
					cfgExtraParams : urlDetails.extraParam

				});
		return field;
	},
	createComboField : function(fieldId, defaultValue, optionsValue, isReadOnly) {
		var objStore = null;
		var me=this;
		var strDisplayField, strValueField;
		if (optionsValue && optionsValue.length > 0) {
			objStore = Ext.create('Ext.data.Store', {
						fields : ['code', 'description','additionalValue1'],
						autoLoad : true,
						disabled : isReadOnly,
						data : optionsValue && optionsValue.length > 0
								? optionsValue
								: []
					});
			strDisplayField = 'description';
			strValueField = 'code';
		}
		var field = Ext.create('Ext.form.field.ComboBox', {
					displayField : strDisplayField,
					valueField : strValueField,
					itemId : fieldId,
					name : fieldId,
					editable : false,
					queryMode : 'local',
					triggerAction : 'all',
					disabled : isReadOnly,
					fieldCls : 'grid-field',
					focusable : true,
					// triggerBaseCls : 'xn-form-trigger',
					value : !Ext.isEmpty(defaultValue) ? defaultValue : '',
					defValue : !Ext.isEmpty(defaultValue) ? defaultValue : '',
					store : objStore,
					emptyText : getLabel('emptyTextForCombo', 'Select'),
				listeners : {
							'select' : function(combo, record) {
								var amountOperator=record[0].data.additionalValue1;
								if(me.isRecordInEditMode()){
								var grid=me.getGrid();
                                var rec = grid.rowEditor.context && grid.rowEditor.context.record
							? grid.rowEditor.context.record
							: null;
					    
							rec.beginEdit();
							rec.set({
										amountOperator_stdField : amountOperator
									});
							rec.endEdit();
							rec.commit();
							
							var columns=grid.columns;
							for(i=0; i < columns.length; i++)
								{
									column = columns[i];
									if(column.dataIndex === 'amountOperator_stdField'){
										column.getEditor().setValue(amountOperator);
									}
								}
							}
							
				        }
					}
				});
		return field;
	},
	createMultiSelectComboField : function(fieldId, defaultValue, optionsValue,
			isReadOnly) {
		var objStore = null;
		var strDisplayField, strValueField;
		if (optionsValue && optionsValue.length > 0) {
			objStore = Ext.create('Ext.data.Store', {
						fields : ['code', 'description'],
						autoLoad : true,
						disabled : isReadOnly,
						data : optionsValue && optionsValue.length > 0
								? optionsValue
								: []
					});
			strDisplayField = 'description';
			strValueField = 'code';
		}
		var field = Ext.create('Ext.form.field.ComboBox', {
					displayField : strDisplayField,
					valueField : strValueField,
					itemId : fieldId,
					name : fieldId,
					editable : false,
					multiSelect : true,
					queryMode : 'local',
					triggerAction : 'all',
					fieldCls : 'grid-field',
					focusable : true,
					// triggerBaseCls : 'xn-form-trigger',
					value : defaultValue ? defaultValue : '',
					defValue : defaultValue ? defaultValue : '',
					store : objStore
				});
		return field;
	},
	handleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter, filterData) {
		var me = this;
		objActionResult = {
			'order' : []
		};
		if (me.isinstrumentActionTaken === true) {
			doClearMessageSection();
			me.isinstrumentActionTaken = false;
		}
		if (!Ext.isEmpty(strHeaderIdentifier)) {
			var tempUrl = _mapUrl['gridLayoutDataUrl'];
			tempUrl = Ext.String.format(tempUrl, strHeaderIdentifier);
			if (false && !Ext.isEmpty(sorter)) {
				sorter = me.upadateSorterField(sorter);
			}
			var strUrl = grid.generateUrl(tempUrl, pgSize, newPgNo, oldPgNo,
					sorter);
			strUrl += me.generateFilterUrl(subGroupInfo, groupInfo);
			me.getGridData(strUrl, grid);
		}
	},
	upadateSorterField : function(sorterJson) {
		sorterJson.each(function(item) {
			if (!Ext.isEmpty(item.property) && !Ext.isEmpty(item.direction)) {
				var property = item.property;
				var pattern = new RegExp(/^.*()$/);
				if (pattern.test(property)) {
					var s = property.replace(pattern, property.substring(0,
									property.indexOf('_')));
					item.property = s /* && s[0].toUpperCase() + s.slice(1) */;
				}
			}
		});

		return sorterJson;
	},
	generateFilterUrl : function(subGroupInfo, groupInfo) {
		return '';
	},
	loadGridData : function(strFilterUrl) {
		var me = this;
		var grid = me.getGrid();
		if (grid) {
			if (!Ext.isEmpty(strHeaderIdentifier)) {
				var tempUrl = _mapUrl['gridLayoutDataUrl'];
				tempUrl = Ext.String.format(tempUrl, strHeaderIdentifier);
				var strUrl = grid.generateUrl(tempUrl, grid.pageSize, 1, 1,
						null);
				me.getGridData(strUrl, grid);
			}
		}
	},
	getGridData : function(strUrl, grid) {
		var me = this, strToken = '', groupView = me.getGroupView();
		groupView.setLoading(true);
		me.isLoadingIndicatorOn = true;
		groupView.handleGroupActionsVisibility(me.strDefaultMask);
		if (typeof tokenValue != 'undefined')
			strToken = tokenValue;
		me.disableActions(true);
		Ext.Ajax.request({
			url : strUrl,
			method : 'GET',
			/*
			 * params : { csrfTokenName : strToken },
			 */
			success : function(response) {
				var data = Ext.decode(response.responseText), arrData = new Array();
				if (data && data.d && data.d.transactions) {
					var arrInst = data.d.transactions;
					var instJson = null, cfgInst = null, jsonRow = null, hasError = false;
					for (var i = 0; i < arrInst.length; i++) {
						cfgInst = arrInst[i];
						instJson = {
							d : {
								poEntry : {
									standardField : cfgInst.standardField
								},
								__metadata : cfgInst.txnMetaData
							}
						}
						hasError = false;
						if (cfgInst.message
								&& cfgInst.message.success === 'SAVEWITHERROR') {
							hasError = true;
							instJson.d.poEntry.message = cfgInst.message || [];
						}
						jsonRow = me.createGridPreRequisites(instJson, true);
						if (jsonRow) {
							jsonRow.hasError = hasError;
							arrData.push(jsonRow);
						}
					}

				}
				data.d.transactions = arrData;
				if (arrData && data && data.d) {
					grid.store.loadRawData(data);
				}
				groupView.handleGroupActionsVisibility(me.strDefaultMask);
				if (groupView) {
					groupView.setLoading(false);
					me.isLoadingIndicatorOn = false;
					if (arrData && arrData.length === 0
							&& me.charEditable === 'Y' && !me.isViewOnly) {
						me.createEmptyRow(me.intDefaultEmptyRow);
					}
				}
			},
			failure : function() {
				groupView.setLoading(false);
				me.isLoadingIndicatorOn = false;
				Ext.MessageBox.show({
							title : getLabel('errorPopUpTitle', 'Error'),
							msg : getLabel('errorPopUpMsg',
									'Error while fetching data..!'),
							buttons : Ext.MessageBox.OK,
							buttonText: {
					            ok: getLabel('btnOk', 'OK')
								},
							icon : Ext.MessageBox.ERROR
						});
			}
		});
	},
	refreshData : function() {
		var me = this;
		var groupView = me.down('groupView[itemId="gridEntryGroupView"]');
		if (groupView) {
			groupView.refreshData();
		}
		var grid = me.getGrid();
		if (grid)
			grid.down('smartGridPager').togglePagerVisibility();
	},
	scrollToTop : function() {
		$("html, body").animate({
					scrollTop : 0
				}, "slow");
	},
	toggleReadonlyCss : function(field, isReadOnly) {
		if (isReadOnly === true)
			field.addClass('form-control');
		else
			field.removeClass('form-control');
	},
	cloneObject : function(obj) {
		return JSON.parse(JSON.stringify(obj));
	},
	getActionBarItems : function() {
		var me = this;
		var arrAvailableActions = me.getAvailableGroupActions('G');
		var arrItems = [], cfgAction = null;
		if (!Ext.isEmpty(arrAvailableActions)) {
			for (var count = 0; count < arrAvailableActions.length; count++) {
				cfgAction = me.getActionConfig(arrAvailableActions[count]);
				if (!Ext.isEmpty(cfgAction)) {
					/*
					 * cfgAction.itemLabel = cfgAction.itemText;
					 * cfgAction.toolTip = cfgAction.itemText;
					 */
					arrItems.push(cfgAction);
				}
			}
		}
		return arrItems;
	},
	createGroupActionColumn : function() {
		var me = this, arrTemp = null, arrActions = null, cfgAction = null;
		var arrGroupAction = me.getAvailableGroupActions('R');
		arrActions = [{
			itemId : 'btnEdit',
			itemCls : 'grid-row-action-icon icon-edit',
			toolTip : getLabel('editRecordToolTip', 'Edit Record'),
			itemLabel : getLabel('editRecordToolTip', 'Edit Record'),
			maskPosition : 16
				// fnClickHandler : editRecord
			}, {
			itemId : 'btnView',
			itemCls : 'grid-row-action-icon icon-view',
			toolTip : getLabel('viewRecordToolTip', 'View Record'),
			itemLabel : getLabel('viewRecordToolTip', 'View Record'),
			maskPosition : 15
				// fnClickHandler : viewRecord
			}]
		if (me.isViewOnly !== true/* me.isEnableGridActions */
				&& !Ext.isEmpty(arrGroupAction))
			for (var i = 0; i < arrGroupAction.length; i++) {
				cfgAction = me.getActionConfig(arrGroupAction[i]);
				if (!Ext.isEmpty(cfgAction)) {
					cfgAction.itemLabel = cfgAction.itemText;
					cfgAction.toolTip = cfgAction.itemText;
					arrActions.push(cfgAction);
				}
			}
		var objActionCol = {
			colId : 'actioncontent',
			colType : 'actioncontent',
			colHeader : getLabel('actions', 'Actions'),
			width : 108,
			align : 'left',
			locked : true,
			sortable : false,
			hideable : false,
			resizable : false,
			draggable : false,
			items : arrActions,
			visibleRowActionCount : 1
		};
		return objActionCol;
	},

	createErrorActionColumn : function() {
		var me = this;
		var colItems = [{
					itemId : 'btnError',
					itemCls : 'grid-row-action-icon icon-error',
					toolTip : getLabel('viewErrorToolTip', 'View Error'),
					itemLabel : getLabel('viewErrorToolTip', 'View Error')
				}, {
					itemId : 'btnPendingSave',
					itemCls : 'grid-row-action-icon icon-asterisk',
					toolTip : getLabel('pendingSave', 'Not Saved'),
					itemLabel : getLabel('pendingSave', 'Not Saved')
				}];
		var objActionCol = {
			colId : 'actioncontenterror',
			colType : 'actioncontent',
			width : 30,
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			disableComboStyle : true,
			items : colItems,
			// colHeader : 'Actions',
			visibleRowActionCount : 1
		};
		return objActionCol;
	},
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		// TODO : Mask logic to be handled
		var me = this;
		var retValue = true;
		if (itmId === 'btnError') {
			retValue = record.get('hasError') === true ? true : false;
		} else if (itmId === 'btnPendingSave') {
			retValue = (record && record.get('__metadata') && Ext
					.isEmpty((record.get('__metadata'))._detailId));
		} else {
			retValue = true;
			if (itmId === 'btnEdit' && me.isViewOnly === true)
				retValue = false;
		}
		return retValue;
	},
	doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid,
			objRecord, intRecordIndex, arrSelectedRecords, jsonData) {
		var me = this;
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		var maskArray = new Array(), actionMask = '', objData = null;
		/*if (!Ext.isEmpty(jsonData)
				&& !Ext.isEmpty(jsonData.d.__metadata._buttonMask))
			buttonMask = jsonData.d.__metadata._buttonMask;*/
		
		maskArray.push(buttonMask);
		for (var index = 0; index < arrSelectedRecords.length; index++) {
			objData = arrSelectedRecords[index];
			maskArray.push(objData.get('__metadata').__rightsMap);
		}
		/*actionMask = doAndOperation(maskArray, me.intMaskSize);*/
		if( arrSelectedRecords.length!=0)
		actionMask="1111111111111111";
		else
		actionMask="0000000000000000";
		objGroupView.handleGroupActionsVisibility(actionMask);
		objGroupView.handleGroupActionsVisibility(actionMask);
	},
	handleRowIconClick : function(tableView, rowIndex, columnIndex, actionName,
			event, record) {
		var me = this;
		var strMsg = 'Errors : <br/>';
		if (actionName === 'btnError') {
			var arrError = record.data.__errors;
			if (!me.tip) {
				me.tip = Ext.create('Ext.tip.ToolTip', {
							hideDelay : 3000,
							padding : '0 0 0 0',
							maxWidth : 800,
							html : ""
						});
			}
			if (arrError && arrError.length > 0) {
				Ext.each(arrError, function(err) {
							strMsg += (err.errorCode || err.code) + '&nbsp;'
									+ err.errorMessage + '<br/>';
						});
				me.tip.update(strMsg);
				me.tip.showAt([event.xy[0] + 5, event.xy[1] + 5]);
			}

		} else if (actionName === 'discard') {
			me.doHandleGroupActions(actionName, me.getGrid(), [record],
					'rowAction');
		} else {
			if (typeof handleLineItemDetailGridRowAction == 'function'){
				handleLineItemDetailGridRowAction(tableView, rowIndex,
						columnIndex, actionName, event, record);
			}
		}
	},
	getGrid : function() {
		var me = this;
		var groupView = me.down('groupView[itemId="gridEntryGroupView"]');
		var grid = null;
		if (groupView)
			grid = groupView.getGrid();
		return grid;
	},
	getGroupView : function() {
		var me = this;
		return me.down('groupView[itemId="gridEntryGroupView"]');
	},
	/**
	 * strEntity The string strEntiry can have possible values REC, ACC
	 * 
	 * @example
	 * REC : Receiver ACC : Accouont
	 */
	addRecord : function(strCode, strEntity, strDesc) {
		if (!Ext.isEmpty(strCode) && !Ext.isEmpty(strEntity)) {
			var me = this, record = null, grid = null;
			grid = me.getGrid();
			if (me.gridMetaData) {
				record = {};
				var dataObj = me.cloneObject(me.gridMetaData);
				record = me.createGridPreRequisites(dataObj, true);
			}
		}
	},
	doHandleGroupActions : function(strAction, grid, arrSelectedRecords,
			strActionType) {
		var me = this;
		var strGrpActionUrl = Ext.String.format(_mapUrl['deletepolineitem'],strHeaderIdentifier);
		me.preHandleGroupActions(strGrpActionUrl, '', grid, arrSelectedRecords,
				strActionType, strAction);

	},
	preHandleGroupActions : function(strUrl, remark, grid, arrSelectedRecords,
			strActionType, strAction) {
		var me = this;
		var groupView = me.getGroupView();
		if (!Ext.isEmpty(groupView)) {
			var me = this;
			if (!Ext.isEmpty(grid)) {
				var arrayJson = new Array();
				var records = (arrSelectedRecords || []);
				for (var index = 0; index < records.length; index++) {
					arrayJson.push({
						serialNo : grid.getStore().indexOf(records[index]) + 1,
						identifier : records[index].data.__metadata._detailId,
						userMessage : remark,
						filterValue1 : isEmpty(records[index].data.rekeyIdentifier)
								? ''
								: records[index].data.rekeyIdentifier
					});
				}
				if (arrayJson)
					arrayJson = arrayJson.sort(function(valA, valB) {
								return valA.serialNo - valB.serialNo
							});
				doClearMessageSection();
				groupView.setLoading(true);
				me.isLoadingIndicatorOn = true;
				me.isinstrumentActionTaken = true;
				Ext.Ajax.request({
							url : strUrl,
							method : 'POST',
							jsonData : Ext.encode(arrayJson),
							success : function(jsonData) {
								var jsonRes = Ext.JSON
										.decode(jsonData.responseText);
								me.postHandleGroupAction(jsonRes, grid,
										strActionType, strAction, records);
							},
							failure : function() {
								var arrError = new Array();
								arrError.push({
											"errorCode" : "Message",
											"errorMessage" : mapLbl['unknownErr']
										});
								paintErrors(arrError);
								groupView.setLoading(false);
								me.isLoadingIndicatorOn = false;
							},
							complete : function(XMLHttpRequest, textStatus) {
								if ("error" == textStatus) {
									var arrError = new Array();
									arrError.push({
												"errorCode" : "Message",
												"errorMessage" : mapLbl['unknownErr']
											});
									paintErrors(arrError);
									groupView.setLoading(false);
									me.isLoadingIndicatorOn = false;
								}
							}
						});
			}
		}
	},
	postHandleGroupAction : function(jsonData, grid, strActionType, strAction,
			records) {
		// TODO : To be handled
		var me = this;
		var groupView = me.getGroupView();
		var msg = '', errCode = '', arrActionMsg = [], actionData, record = '', row = null, intSerialNo, arrMsg;
		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d)
				&& !Ext.isEmpty(jsonData.d.instrumentActions))
			actionData = jsonData.d.instrumentActions;
		var strActionSuccess = getLabel(strAction, 'Action Successful');
		Ext.each(actionData, function(result) {
					intSerialNo = parseInt(result.serialNo,10);
					record = grid.getRecord(intSerialNo);
					row = grid.getRow(intSerialNo);
					msg = '';
					Ext.each(result.errors, function(error) {
								msg = msg + error.code + ' : '
										+ error.errorMessage;
								errCode = error.code;
							});
					if (result.success === 'N') {
						arrActionMsg.push({
									success : result.success,
									actualSerailNo : result.serialNo,
									actionTaken : 'Y',
									lastActionUrl : strAction,
									reference : Ext.isEmpty(record)
											? ''
											: record.get('clientReference')
								});
					}

				});

		if (arrActionMsg && arrActionMsg.length > 0) {
			arrMsg = (me.populateActionResult(arrActionMsg, 'N') || null);
			if (!Ext.isEmpty(arrMsg)) {
				me.paintActionResult(arrMsg);
				$("html, body").animate({
							scrollTop : 0
						}, "slow");
			}
			groupView.handleGroupActionsVisibility(me.strDefaultMask);
			groupView.setLoading(false);
			me.isLoadingIndicatorOn = false;
		} else {
			me.refreshData();
		}
	},
	populateActionResult : function(arrActionMsg, strCanClear) {
		// TODO : To be handled
		var me = this, arrResult = [];
		if (!Ext.isEmpty(objActionResult)) {
			Ext.each((arrActionMsg || []), function(cfgMsg) {
						if (!Ext.Array.contains(objActionResult.order,
								cfgMsg.actualSerailNo))
							objActionResult.order.push(cfgMsg.actualSerailNo);
						if (strCanClear !== 'Y')
							objActionResult[cfgMsg.actualSerailNo] = me
									.cloneObject(cfgMsg);
						else
							objActionResult[cfgMsg.actualSerailNo] = null;
					});

			Ext.each((objActionResult.order || []), function(key) {
						if (objActionResult[key]) {
							arrResult.push(objActionResult[key]);
						}
					});
		}
		return arrResult;
	},
	paintActionResult : function(arrError) {
		// TODO : To be handled
		var element = null, strMsg = null, strTargetDivId = 'messageArea', strErrorCode = '';
		if (arrError && arrError.length > 0) {
			$('#' + strTargetDivId).empty();
			$.each(arrError, function(index, error) {
						strMsg = error.actionMessage || '';
						intSrNo = error.actualSerailNo;
						var msg = mapLbl['warnMsg']
						if (!isEmpty(msg))
							msg += ' : ';
						$('#successMessageArea').empty();
						// element = $('<p>').text(msg + error.errorMessage);
						element = $('<p>', {
									'class' : 'col-sm-11 ',
									'id' : 'actionMsg' + intSrNo,
									'html' : strMsg
								});
						element.appendTo($('#' + strTargetDivId));
						element = $('<div>', {
									'class' : 'col-sm-1'
								});
						element.appendTo($('#' + strTargetDivId));
						$('#' + strTargetDivId + ', #messageContentDiv')
								.removeClass('hidden');

					});

		}
	},
	getAvailableGroupActions : function(_charActionType) {
		var me = this;
		var retValue = null;
		var _strLayout = (typeof strLayoutType != 'undefined' && !isEmpty(strLayoutType))
				? strLayoutType
				: 'MIXEDLAYOUT';
		var mapActions = {
			rowActions : ['Discard'],
			groupActions : ['Discard']
		};
		return _charActionType === 'G'
				? mapActions.groupActions
				: mapActions.rowActions;
	},
	getActionConfig : function(strActionName) {
		var me = this;
		var mapActionConfig = {
			'Discard' : {
				itemText : getLabel('instrumentsActionDiscard', 'Discard'),
				actionName : 'discard',
				itemId : 'discard',
				maskPosition : 9
			}
		};
		return mapActionConfig[strActionName];
	},
	isRecordInEditMode : function() {
		var me = this, grid = me.getGrid(), retValue = false;
		retValue = (grid && grid.rowEditor && grid.rowEditor.editing);
		return retValue;
	},
	doHandleRecordSaveOnFocusOut : function(fnCallBack, arrArgs, scope,
			createEmptyRow) {
		var me = this, grid = me.getGrid(), retValue = false, isDirty = false, record = null, isNewRecord = false;
		if (me.isRecordInEditMode()) {
			grid.createEmptyRow = !Ext.isEmpty(createEmptyRow)
					? createEmptyRow
					: false;
			grid.isFocusOut = true;
			grid.fnFocusOutCallback = fnCallBack;
			grid.fnFocusOutArgs = arrArgs || [];
			grid.callBackScope = scope;
			record = grid.rowEditor.context && grid.rowEditor.context.record
					? grid.rowEditor.context.record
					: null;
			isDirty = grid.rowEditor.getEditor().isDirty()/*
															 * && (record &&
															 * record.get('__metadata') &&
															 * !Ext
															 * .isEmpty((record.get('__metadata'))._detailId))
															 */;
			isDirty = createEmptyRow === true ? true : me.checkIsDirtyRecord();
			if (isDirty || gridError)
				grid.rowEditor.completeEdit();
			else {
				// grid.rowEditor.cancelEdit();
				me.doHandleCallBack(scope);
			}
		}
	},
	doHandleCallBack : function(scope) {
		var me = this, grid = me.getGrid();
		if (!Ext.isEmpty(grid.fnFocusOutCallback)) {
			Ext.callback(grid.fnFocusOutCallback, scope || '',
					grid.fnFocusOutArgs);
			grid.fnFocusOutCallback = null;
			grid.fnFocusOutArgs = null;
			grid.callBackScope = null;
		}
	},
	checkIsDirtyRecord : function() {
		var me = this, colEditor = null, grid = null, record = null, isDirty = false, date1 = null, date2 = null;
		grid = me.getGrid();
		record = grid.rowEditor.context && grid.rowEditor.context.record
				? grid.rowEditor.context.record
				: null;
		if (grid && grid.columns) {
			Ext.each(grid.columns, function(col) {
				if (col && col.getEditor())
					colEditor = col.getEditor();
				/**
				 * Date comparison in JAVA SCRIPT handled in different way
				 */
				if (!Ext.isEmpty(colEditor.itemId)
						&& Object.prototype.toString.call(colEditor.getValue()) === '[object Date]') {
					date1 = record.get(colEditor.itemId) ? record
							.get(colEditor.itemId).getTime() : null;
					date2 = colEditor.getValue() ? colEditor.getValue()
							.getTime() : null;
					if (date1 !== date2)
						isDirty = true;
				} else if (!Ext.isEmpty(colEditor.itemId)
						&& (colEditor.getValue() != record
								.get(colEditor.itemId)) &&
							(colEditor.getValue()!=null)) {
					isDirty = true;
				}
			});
		}
		return isDirty;
	},
	disableActions : function(canDisable) {
		// TODO : TO be handle
		return true;
		if (canDisable)
			$('.canDisable').addClass('button-grey-effect');
		else
			$('.canDisable').removeClass('button-grey-effect');
	}
});
