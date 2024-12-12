/**
 * @class GCP.view.MultiWireGridEntry
 * @extends Ext.panel.Panel
 * @author Vinay Thube
 */
Ext.define('GCP.view.MultiWireGridEntry', {
	extend : 'Ext.panel.Panel',
	xtype : 'multiWireGridEntry',
	itemId : 'multiWireGridEntry',
	requires : ['Ext.ux.gcp.GroupView', 'Ext.form.Panel',
			'Ext.grid.plugin.RowEditing', 'Ext.ux.gcp.AutoCompleter',
			'Ext.ux.gcp.Override.PickerDate'],
	autoHeight : true,
	cls : 'xn-panel xn-no-rounded-border',
	collapsible : false,
	gridMetaData : null,
	gridDefaultMetaData : null,
	gridCfg : null,
	filterApplied : 'ALL',
	filterData : [],
	advFilterData : [],
	charEditable : 'N',
	isViewOnly : false,
	isEnableGridActions : true,
	entryType : strEntryType,
	strDefaultMask : '000000000000000000000',
	intMaskSize : 23,
	isLoadingIndicatorOn : false,
	arrDrawerFields : ['drawerCode', 'drawerDescription', 'receiverID',
			'beneficiaryBankIDType', 'beneficiaryBankIDCode',
			'beneficiaryBranchDescription', 'drawerAccountNo',
			'beneAccountType', 'beneficiaryAdhocbankFlag'],
	strHeaderAccountNo : null,
	charCaptureAccountAt : 'B',
	charCaptureTxnDateAt : 'B',
	isFocusOut : false,
	isinstrumentActionTaken : false,
	intDefaultEmptyRow : 5,
	intAddEmptyRow : 2,
	ccy : '',
	initComponent : function() {
		var me = this, groupView = null;
		if (!Ext.isEmpty(me.gridMetaData)) {
			me.gridDefaultMetaData = me.cloneObject(me.gridMetaData);
			me.charCaptureAccountAt = me.gridDefaultMetaData
					&& me.gridDefaultMetaData.d
					&& me.gridDefaultMetaData.d.paymentEntry
					&& me.gridDefaultMetaData.d.paymentEntry.paymentHeaderInfo
					&& me.gridDefaultMetaData.d.paymentEntry.paymentHeaderInfo.accountLevel
					? me.gridDefaultMetaData.d.paymentEntry.paymentHeaderInfo.accountLevel
					: 'B';
			me.charCaptureTxnDateAt = me.gridDefaultMetaData
					&& me.gridDefaultMetaData.d
					&& me.gridDefaultMetaData.d.paymentEntry
					&& me.gridDefaultMetaData.d.paymentEntry.paymentHeaderInfo
					&& me.gridDefaultMetaData.d.paymentEntry.paymentHeaderInfo.dateLevel
					? me.gridDefaultMetaData.d.paymentEntry.paymentHeaderInfo.dateLevel
					: 'B';
		}
		groupView = me.createGroupView();
		$(document).off('addGridRow');
		$(document).on('addGridRow', function(event) {
			var blnResult, blnFlag = false, canCreate = false;// doValidationForControlTotal();
			if (blnFlag)
				blnResult = me.validateTotalNumberOfInstrument();
			else
				blnResult = true;

			if (blnResult && me.charEditable === 'Y') {
				var grid = me.getGrid(), record = null;
				if (grid && grid.rowEditor) {
					record = grid.rowEditor.context
							&& grid.rowEditor.context.record
							? grid.rowEditor.context.record
							: null;
					isEmptyRecordExist = (record && record.get('__metadata') && Ext
							.isEmpty((record.get('__metadata'))._detailId));
					isEmptyRecordExist = me.isEmptyRecordExist();
					if (!isEmptyRecordExist)
						me.createEmptyRow();
					if(me.isEmptyRecordExist())
						me.removeSelectActionButton();
				}

			}

		});
		$(document).off('addRecordUsing');
		$(document).on('addRecordUsing',
				function(event, strCode, strEntity, strDescription) {
					me.addRecord(strCode, strEntity, strDescription);
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
						var strId = record && record.get('__metadata')
								? (record.get('__metadata'))._detailId
								: '';
						if (Ext.isEmpty(strId)) {
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
				if (!objRecord
						&& (record && record.get('__metadata') && Ext
								.isEmpty((record.get('__metadata'))._detailId))) {
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
				// TODO : Service integration is pending
				id : 'gridEntryGroupView',
				itemId : 'gridEntryGroupView',
				cfgGroupByUrl : 'static/scripts/payments/templateSummaryT7/data/groupBy.json?$filterscreen=groupViewFilter',
				cfgSummaryLabel : getLabel('transactions', 'Transactions'),
				cfgGroupByLabel : getLabel('groupedBy', 'Grouped By'),
				cfgGroupCode : null,
				cfgSubGroupCode : null,
				cls : 't7-grid txn-dropdown-icon',
				cfgShowFilter : false,
				cfgShowFilterInfo : false,
				cfgShowRefreshLink : false,
				cfgSmartGridSetting : true,
				cfgCollpasible : false,
				cfgGroupingDisabled : true,
				blnShowAdvancedFilter : false,
				cfgGridModel : {
					id : 'gridEntryInstrumentDetails',
					itemId : 'gridEntryInstrumentDetails',
					stateful : false,
					showEmptyRow : false,
					forceFit : true,
					enableColumnAutoWidth : false,
					showCheckBoxColumn : me.isEnableGridActions /*
																 * me.isViewOnly
																 * === false ?
																 * true : false
																 */,
					checkBoxColumnWidth : _GridCheckBoxWidth,
					enableRowEditing : true,
					hideRowNumbererColumn : true,
					pageSize : 10,
					rowList : _AvailableGridSize,
					multiSort : false,
					enableLocking : true,
					columnModel : arrCols,
					/*
					 * groupActionModel : me.isViewOnly === true ? [] : me
					 * .getActionBarItems('G'),
					 */
					// Only For 'Payment' in View Mode
					groupActionModel : me.isEnableGridActions === true
							&& strLayoutType
							&& ((strEntryType === 'PAYMENT') || (strAction && (strAction === 'ADD' || strAction === 'EDIT')))
							? me.getActionBarItems('G')
							: [],
					storeModel : {
						fields : gridCfg.storeFields,
						// proxyUrl : _mapUrl['gridLayoutDataUrl_dummy'],
						proxyUrl : _mapUrl['gridLayoutDataUrl'],
						rootNode : 'd.instruments',
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
					/**
					 * @cfg{Function} fnColumnRenderer Used as default column
					 *                renderer for all columns if
					 *                fnColumnRenderer is not passed to the
					 *                grids column model
					 */
					// fnColumnRenderer : me.columnRenderer,
					/**
					 * @cfg{Function} fnSummaryRenderer Used as default column
					 *                summary renderer for all columns if
					 *                fnSummaryRenderer is not passed to the
					 *                grids column model
					 */
					// fnSummaryRenderer : function(value, summaryData,
					// dataIndex,
					// rowIndex, colIndex, store, view, colId) {
					// },
					/**
					 * @cfg{Function} fnRowIconVisibilityHandler Used as default
					 *                icon visibility handler for all columns if
					 *                fnVisibilityHandler is not passed to the
					 *                grids "actioncontent" column's actions
					 * 
					 * @example
					 * fnRowIconVisibilityHandler : function(store, record, jsonData,
					 *		iconName, maskPosition) { 
					 * 	return true;
					 *}
					 * 
					 * @param {Ext.data.Store}
					 *            store The grid data store
					 * @param {Ext.data.Model}
					 *            record The record for current row
					 * @param {JSON}
					 *            jsonData The response json data
					 * @param {String}
					 *            iconName The name of the icon
					 * @param {Number}
					 *            maskPosition The position of the icon action
					 *            in bit mask
					 * @return{Boolean} Returns true/false
					 */
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
					var isNewRecord = Ext.isEmpty((record
							&& record.get('__metadata') && Ext.isEmpty((record
							.get('__metadata'))._detailId)));
					var arrError = [];
					if (!isNewRecord && me.isEmptyRecordExist()) {
						arrError.push({
							"errorCode" : "ERR",
							"errorMessage" : getLabel('recordEditEmptylbl',
									'Please select Template Name')
						});
						paintErrors(arrError);
						return false;
					}
					me.strHeaderAccountNo = me.getPaymentHeaderAccount();
					grid.createEmptyRow = false;
					if (me.charEditable === 'N' || me.isViewOnly)
						return false;
					var isCcyMissmatch = me.isCurrencyMissMatch(record, editor,
							grid, context);
					// doClearMessageSection();
					if (false && isCcyMissmatch) {
						arrError.push({
							"errorCode" : "WARNING",
							"errorMessage" : getLabel('recordEditWarnlbl',
									'Please edit record using Transaction Wizard..!')
						});
						paintErrors(arrError);
						return false;
					}
					me.handleFieldProperties(context.grid);
					me.clearValidations(context.grid);
					me.doBindEvents(context.grid);
					me.toggleHoldUntilDate(null, record);
					// me.isValidRoutingNo();
					if (!Ext.isEmpty(record.get('drawerRegistedFlag'))
							&& record.get('drawerRegistedFlag') === 'A') {

						me.toggleReadonlyFieldsForReceiver(null, false, false);
					} else {
						/*
						 * var isReadonly = record.get('isAdhocAllowed') ===
						 * false ? true : false;
						 */
						me.toggleReadonlyFieldsForReceiver(null, true, false);
					}
					me.doHandleCrDrValuePopulation(context.grid);
					me.doCustomValidations(record, editor, grid, context);

					return true;
				},
				doRecordEdit : function(record, editor, grid, context) {
					if (!Ext.isEmpty(record.get('drawerRegistedFlag'))
							&& record.get('drawerRegistedFlag') === 'A'
							&& record.get('isAdhocAllowed') === false) {
						me.applyReceiverValidation(record);
					}
					me.doSaveRecord(record, editor, grid, false, true, null,
							false);
				},
				doRecordEditPrevious : function(prevRecord, currentRecord,
						editor, grid, preContext) {
					if (me.checkIsDirtyRecord() && !me.isEmptyRecordExist())
						me.doSaveRecord(editor.context.record, editor, grid,
								false, true, prevRecord, false);
					me.removeSelectActionButton();					
				},
				doCancelRecordEdit : function(record, editor, grid, context) {
					if (me.isEmptyRecordExist()) {
						var rec = me.getFirstEmptyRecord();
						if (rec) {
							editor.startEdit(rec, 0);
							me.removeSelectActionButton();	
						}
					}
					else
					{
						me.renderSelectActionButton();
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
			if (typeof loadPaymentBatchInstrumentFieldsForGridLayout != 'undefined'
					&& typeof loadPaymentBatchInstrumentFieldsForGridLayout === 'function'
					&& strFilterCode !== 'all') {
				strUrl = _mapUrl['loadBatchInstrumentFieldsUrl'] + "/id.json";
				objGroupView.setLoading(true);
				me.isLoadingIndicatorOn = true;
				gridMeta = loadPaymentBatchInstrumentFieldsForGridLayout(
						strIdentifier, strUrl);
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
					// proxyUrl : _mapUrl['gridLayoutDataUrl_dummy'],
					proxyUrl : _mapUrl['gridLayoutDataUrl'],
					rootNode : 'd.instruments',
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
		var objEnrichments = null, arrEnrichFields = null, arrColumns = null, strGridColumns = null, blnAdhocAllowed = false, strDrawerRegistedFlag = 'A', colStatus = null;
		if (me.gridMetaData
				&& me.gridMetaData.d
				&& me.gridMetaData.d
				&& (me.gridMetaData.d.paymentGridColumns || me.gridMetaData.d.editableGridCols)) {
			strGridColumns = (me.gridMetaData.d.paymentGridColumns || me.gridMetaData.d.editableGridCols);
			// strGridColumns =
			// 'drCrFlag,drawerCode,receiverID,amount,accountNo,accountType,drawerBankCode,drawerBranchCode,prenote,holdUntil,referenceNo,discretionaryData';
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
					if (strCol === 'drawerCode'
							|| strCol === 'beneficiaryBankIDCode'
							|| strCol == "beneAccountType") {
						column.width = 150;
					} else
						column.width = 'auto';
					column.width = 170;
					if (index > 3)
						column.lockable = false;
					else
						column.lockable = true;
					if (strCol === '__status') {
						colStatus = column;
					} else if ((strCol === 'accountNo' || strCol === 'companyId'
							&& !Ext.isEmpty(me.charCaptureAccountAt))
							|| (strCol === 'txnDate' && !Ext
									.isEmpty(me.charCaptureTxnDateAt))) {
						arrCols.push(column);
					} else {
						arrCols.push(column);
					}
				}
			});
		}
		// Note : Enrichment won't be handled in grid entry
		if (false && me.gridMetaData && me.gridMetaData.d
				&& me.gridMetaData.d.paymentEntry
				&& me.gridMetaData.d.paymentEntry.enrichments) {
			objEnrichments = me.gridMetaData.d.paymentEntry.enrichments;

			$.each(objEnrichments, function(key, value) {
				if ((key === 'udeEnrichment' || key === 'productEnrichment'
						|| key === 'myproductEnrichment'
						|| key === 'clientEnrichment'
						|| key === 'myProductMultiSet'
						|| key === 'bankProductMultiSet'
						|| key === 'clientMultiSet'
						|| key === 'productEnrichmentStdFields'
						|| key === 'myproductEnrichmentStdFields' || key === 'clientEnrichmentStdFields')) {
					strPostFix = me.getEnrichPostFixString(key);
					arrEnrichFields = null;
					/**
					 * Commented the Multiset enrichment handling as per
					 * requirement
					 */
					if (false && key === 'myProductMultiSet'
							|| key === 'bankProductMultiSet'
							|| key === 'clientMultiSet') {
						if (value && value.length > 0) {
							arrEnrichFields = value[0].parameters || null;
						}
					} else if (key === 'udeEnrichment'
							|| key === 'productEnrichment'
							|| key === 'myproductEnrichment'
							|| key === 'clientEnrichment'
							|| key === 'productEnrichmentStdFields'
							|| key === 'myproductEnrichmentStdFields'
							|| key === 'clientEnrichmentStdFields') {
						arrEnrichFields = value.parameters;
					}
					if (arrEnrichFields) {
						me.addEnrichmentColumns(jsonCols, arrCols,
								arrEnrichFields, strPostFix);
					}
				}
			});
		}

		colError = me.createErrorActionColumn();
		colGroupAction = me.createGroupActionColumn();
		colGroupAction.items = colGroupAction.items || [];
		arrColumns = [colError, colGroupAction];
		if (colStatus)
			arrCols.push(colStatus);
		return arrColumns.concat(arrCols || []);
	},

	addEnrichmentColumns : function(jsonCols, arrCols, arrFields, strPostFix) {
		var column = null;
		for (var i = 0; i < arrFields.length; i++) {
			column = jsonCols[arrFields[i].code + '' + strPostFix];
			if (column) {
				column.locked = false;
				column.sortable = false;
				column.hideable = false;
				column.draggable = false;
				column.lockable = false;
				column.minWidth = 120;
				column.width = 'auto';
				arrCols.push(column);
			}
		}
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
	doHandleCrDrValuePopulation : function(grid) {
		var me = this, editor = null, arrValues = {
			'D' : {
				description : 'Debit',
				code : 'D'
			},
			'C' : {
				description : 'Credit',
				code : 'C'
			}
		};
		if (grid && grid.columns) {
			Ext.each(grid.columns, function(col) {
				if (col && col.getEditor()) {
					editor = col.getEditor();
					if (editor.itemId == 'drCrFlag_stdField') {
						var crDrBatchHeader = paymentResponseHeaderData
								&& paymentResponseHeaderData.d
								&& paymentResponseHeaderData.d.paymentEntry
								&& paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo
								&& paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo.hdrDrCrFlag
								? paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo.hdrDrCrFlag
								: '';
						if (!Ext.isEmpty(crDrBatchHeader)) {
							editor.store.removeAll(true);
							if (crDrBatchHeader == 'B') {
								editor.store.add([arrValues.C, arrValues.D]);
								editor.setDisabled(false);
							} else {
								editor.store.add([arrValues[crDrBatchHeader]]);
								editor.setDisabled(true);
							}
						}

					}
				}
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
							if (!cmp.requestFired) {
								cmp.requestFired = true;
								grid.rowEditor.completeEdit();

							}
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

		var _strMyProduct = '';
		if (!Ext.isEmpty(data) && !Ext.isEmpty(data.d)
				&& !Ext.isEmpty(data.d.__metadata)) {
			if (!Ext.isEmpty(data.d.__metadata._myproduct))
				_strMyProduct = data.d.__metadata._myproduct;
			if (captureDataOnly) {
				rowData['__metadata'] = data.d.__metadata;
			}
		}

		if (!Ext.isEmpty(data) && data.d && data.d.paymentEntry) {
			if (data.d.paymentEntry.message
					&& data.d.paymentEntry.message.errors)
				rowData['__errors'] = data.d.paymentEntry.message.errors;

			if (captureDataOnly
					&& data.d.paymentEntry.paymentMetaData
					&& !Ext
							.isEmpty(data.d.paymentEntry.paymentMetaData._status)) {
				rowData['__status'] = data.d.paymentEntry.paymentMetaData._status;
			}
			objCol = {
				colId : '__status',
				colHeader : getLabel('instrumentStatus', 'Status'),
				sortable : false,
				hideable : false,
				draggable : false
			};
			columnModel['__status'] = objCol;

			dataPmtEntry = data.d.paymentEntry;
			arrFields = dataPmtEntry.standardField;
			// "Standard Field" Node's field addition
			if (!Ext.isEmpty(arrFields))
				Ext.each(arrFields, function(item) {
					if (!Ext.isEmpty(item.fieldName)
							&& (item.fieldName !== 'contractRefNo'
									&& item.fieldName !== 'rateType' && item.fieldName !== 'drawerRegisteredFlag')) {
						if (captureDataOnly) {
							objDefValue = item.value;
							if ((item.dataType === 'select' || item.dataType === 'radio')
									&& item.availableValues
									&& item.availableValues.length > 0) {
								if (item.availableValues.length === 1
										&& item.fieldName !== 'templateName')
									objDefValue = item.availableValues[0].code
											? item.availableValues[0].code
											: '';
								else if (item.fieldName === 'charges') {
									objDefValue = Ext.isEmpty(item.value)
											? item.availableValues[0].code
											: '' + item.value;

								}
								rowData[item.fieldName + '_stdField_options'] = item.availableValues;

							} else if (item.dataType === 'checkBox') {
								objDefValue = objDefValue === 'Y'
										? true
										: false;
							}
							rowData[item.fieldName + '_stdField'] = objDefValue;
							if (item.fieldName === 'amount') {
								rowData['amountFormatted_stdField'] = item.formattedValue
										|| ''
							}
							rowData[item.fieldName + '_stdField_readOnly'] = item.readOnly;

						} else {
							strLabel = item.fieldName === 'txnType'
									? 'ACH Type'
									: item.label;
							if (item.fieldName === 'accountNo')
								strLabel = getLabel('sendingAccount',
										'Sending Account');
							else if (item.fieldName === 'referenceNo'
									&& strLayoutType === 'WIRELAYOUT')
								strLabel = getLabel(
										'colPaymentReference_WIRELAYOUT',
										'Payment Reference');
							else if (item.fieldName === 'referenceNo'
									&& (strLayoutType === 'ACHLAYOUT' || strLayoutType === 'ACHIATLAYOUT'))
								strLabel = getLabel(
										'colPaymentReference_ACHLAYOUT',
										'Company Entry Description');
							objCol = {
								colId : item.fieldName + '_stdField',
								colHeader : strLabel,
								sortable : false,
								hideable : false,
								draggable : false
							};
							storeFields.push(item.fieldName
									+ '_stdField_readOnly');
							if (item.dataType === 'date') {
								storeFields.push({
											name : item.fieldName + '_stdField',
											type : 'date',
											format : strExtApplicationDateFormat
										});
								objCol.fnColumnRenderer = Ext.util.Format
										.dateRenderer(strExtApplicationDateFormat);
							} else if (item.dataType === 'amount') {
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
										record, rowIndex, colIndex, store,
										view, colId) {
									if (isNaN(value)) {
										return (store.proxy.reader.rawData
												&& store.proxy.reader.rawData.d
												&& store.proxy.reader.rawData.d.instruments
												&& store.proxy.reader.rawData.d.instruments.length > 0
												&& !Ext
														.isEmpty(store.proxy.reader.rawData.d.instruments[rowIndex].amountFormatted_stdField)
												? store.proxy.reader.rawData.d.instruments[rowIndex].amountFormatted_stdField
												: '');
									} else
										return record
												.get('amountFormatted_stdField')
												|| value;
								};
							} else if (item.dataType === 'checkBox') {
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

							} else if (item.dataType === 'radio') {
								if (item.fieldName === 'templateType'
										&& me.entryType === 'TEMPLATE') {
									storeFields.push(item.fieldName
											+ '_stdField');
								} else {
									if (item.availableValues
											&& item.availableValues.length > 0) {
										storeFields.push(item.fieldName
												+ '_stdField');
										objCol.fnColumnRenderer = function(
												value, meta, record, rowIndex,
												colIndex, store, view, colId) {
											var grid = me.getGrid();
											var col = grid
													.down('gridcolumn[itemId="'
															+ colId + '"]');
											var retValue = value;
											if (col && col.getEditor()) {
												var store = (col.getEditor().store)
														? col.getEditor().store
														: null;
												if (store) {
													var rec = store.findRecord(
															'code', value);
													if (rec
															&& !Ext
																	.isEmpty(rec.data.description))
														retValue = rec.data.description;
												}
											}
											return retValue;
										}
									} else {
										storeFields.push({
											name : item.fieldName + '_stdField',
											type : 'bool',
											defaultValue : false
										});
										objCol.fnColumnRenderer = function(
												value, meta, record, rowIndex,
												colIndex, store, view, colId) {
											if (value === true)
												return 'Y';
											else
												return 'N'
										};
									}
								}

							} else if (item.dataType === 'select') {
								storeFields.push(item.fieldName + '_stdField');
								storeFields.push(item.fieldName
										+ '_stdField_options');
								objCol.fnColumnRenderer = function(value, meta,
										record, rowIndex, colIndex, store,
										view, colId) {
									var grid = me.getGrid();
									// var col = grid.columns[colIndex];
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
									return retValue;
								}
							} else
								storeFields.push(item.fieldName + '_stdField');

							if (item.fieldName !== 'bankProduct') {
								objEditor = me.getColumnEditor(item,
										'_stdField', false);
								if (item.fieldName == 'discretionaryData') {
									objEditor.maxLength = 2;
									objEditor.enforceMaxLength = true;
									objEditor.emptyText = getLabel(
											'descretionaryDataEmptyText',
											'2 Chars Max');
								}
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
									if (item.fieldName === 'txnType') {
										objEditor.on('change', function(combo,
														newValue, oldValue) {
													me.toggleHoldUntilDate(
															newValue, null);
												});
									} else if (item.fieldName === 'holdUntil') {
										var minDate = Ext.Date.parse(
												dtApplicationDate,
												strExtApplicationDateFormat);
										if (minDate)
											minDate = Ext.Date.add(minDate,
													Ext.Date.DAY, 1)
										objEditor.minValue = minDate
												|| Ext.Date.add(new Date(),
														Ext.Date.DAY, 1);
									} else if (item.fieldName === 'templateName') {
										if (item.availableValues
												&& item.availableValues.length > 10) {
											objEditor.editable = true;
											objEditor.store.removeAt(0);
										}
										objEditor.on('select', function(combo,
														newValue, oldValue) {
													me
															.doHandleTemplateChange(combo
																	.getValue());
												});
									}
									objCol.editor = objEditor;
								}
								columnModel[item.fieldName] = objCol;
							}
						}

					}

				});

			if (strLayoutType !== 'ACCTRFLAYOUT') {
				// "beneficiary.registeredBene" Node's field addition
				blnAdhocAllowed = (dataPmtEntry.beneficiary && dataPmtEntry.beneficiary.adhocBene)
						? true
						: false;
				storeFields.push({
							name : 'isAdhocAllowed',
							type : 'bool',
							defaultValue : blnAdhocAllowed
						});
				storeFields.push({
							name : 'beneficiaryAdhocbankFlag',
							type : 'bool',
							defaultValue : false
						});
				storeFields.push({
							name : 'drawerRegistedFlag',
							defaultValue : 'A'
						});
				storeFields.push({
							name : 'beneficiaryAdhocbankFlag',
							defaultValue : 'N'
						});

				strDrawerRegistedFlag = (dataPmtEntry.beneficiary && dataPmtEntry.beneficiary.drawerRegistedFlag)
						? dataPmtEntry.beneficiary.drawerRegistedFlag
						: '';

				if (!blnAdhocAllowed)
					strDrawerRegistedFlag = 'R';

				if (blnAdhocAllowed && Ext.isEmpty(strDrawerRegistedFlag))
					strDrawerRegistedFlag = 'A';

				if (strDrawerRegistedFlag === 'R')
					arrFields = (dataPmtEntry.beneficiary && dataPmtEntry.beneficiary.registeredBene)
							? dataPmtEntry.beneficiary.registeredBene
							: null;
				else
					arrFields = (dataPmtEntry.beneficiary && dataPmtEntry.beneficiary.adhocBene)
							? dataPmtEntry.beneficiary.adhocBene
							: null;
				if (!Ext.isEmpty(arrFields)) {
					Ext.each(arrFields, function(item) {
						if (item.fieldName
								&& (Ext.Array.contains(me.arrDrawerFields,
										item.fieldName))) {
							if (captureDataOnly) {
								objDefValue = item.value;
								if (item.dataType === 'select'
										&& item.availableValues
										&& item.availableValues.length > 0) {
									if (item.availableValues.length === 1)
										objDefValue = item.availableValues[0].code
												? item.availableValues[0].code
												: '';

									else if (item.fieldName === 'beneficiaryBankIDType'
											&& Ext.isEmpty(item.value)) {
										objDefValue = item.availableValues[0].code;

									}
								}
								rowData[item.fieldName + '_regBeneField'] = objDefValue;
								rowData['isAdhocAllowed'] = blnAdhocAllowed;
								rowData['drawerRegistedFlag'] = strDrawerRegistedFlag;
								if (strDrawerRegistedFlag === 'A'
										&& Ext
												.isEmpty(rowData['drawerCode_regBeneField'])) {
									rowData['drawerCode_regBeneField'] = (rowData['drawerDescription_regBeneField'] || '');
								}
								rowData[item.fieldName
										+ '_regBeneField_readOnly'] = item.readOnly;

							} else {
								objEditor = null;
								strLabel = '';
								if (item.fieldName === 'drawerCode') {
									/*
									 * strLabel =
									 * getLabel('editableGridReceiverCode',
									 * 'Receiver Code');
									 */
									strLabel = (strLayoutType === 'WIRELAYOUT' && strLayoutSubType === 'DRAWDOWN')
											? getLabel(
													'editableGridDebitPartyName',
													'Debit Party Name')
											: getLabel(
													'editableGridReceiverName',
													'Receiver Name');
								} else if (item.fieldName === 'drawerDescription')
									strLabel = (strLayoutType === 'WIRELAYOUT' && strLayoutSubType === 'DRAWDOWN')
											? getLabel(
													'editableGridDebitPartyName',
													'Debit Party Name')
											: getLabel(
													'editableGridReceiverName',
													'Receiver Name');
								else if (item.fieldName === 'receiverID')
									strLabel = getLabel(
											'editableGridReceiverID',
											'Receiver ID');
								else if (item.fieldName === 'beneficiaryBankIDCode') {
									if (strLayoutType === 'WIRELAYOUT'
											|| strLayoutType === 'ACHIATLAYOUT')
										strLabel = getLabel(
												'beneficiaryBankIDCode_WIRELAYOUT',
												'Identifier');
									else
										strLabel = getLabel(
												'beneficiaryBankIDCode',
												'Routing Number');
								} else if (item.fieldName === 'beneficiaryBranchDescription')
									strLabel = getLabel(
											'beneficiaryBranchDescription',
											'Bank Branch Name');
								else if (item.fieldName === 'beneAccountType')
									strLabel = getLabel(
											'beneficiaryAccountType',
											'Account Type');
								else
									strLabel = item.label;

								objCol = {
									colId : item.fieldName + '_regBeneField',
									colHeader : strLabel,
									sortable : false,
									hideable : false,
									draggable : false
								};
								storeFields.push(item.fieldName
										+ '_regBeneField_readOnly');
								if (item.dataType === 'select') {
									storeFields.push(item.fieldName
											+ '_regBeneField');
									objCol.fnColumnRenderer = function(value,
											meta, record, rowIndex, colIndex,
											store, view, colId) {
										var grid = me.getGrid();
										var col = grid
												.down('gridcolumn[itemId="'
														+ colId + '"]');
										var retValue = value;
										if (col && col.getEditor()) {
											var store = (col.getEditor().store)
													? col.getEditor().store
													: null;
											if (store) {
												var rec = store.findRecord(
														'code', value);
												if (rec
														&& !Ext
																.isEmpty(rec.data.description))
													retValue = rec.data.description;
											}
										}
										return retValue;
									}
								} else
									storeFields.push(item.fieldName
											+ '_regBeneField');

								if (item.fieldName === 'drawerCode'
										&& _strMyProduct) {

									item.displayMode = '3';
									autoCfgUrl = 'services/recieverseek';
									if (!Ext.isEmpty(_strMyProduct))
										autoCfgUrl += '/' + _strMyProduct;
									// TODO : To be handled through grid record
									if (!Ext
											.isEmpty($('#bankProductHdr').val())) {
										autoCfgUrl += '/'
												+ $('#bankProductHdr').val();
									}
									autoCfgUrl += '.json';
									objEditor = Ext.create(
											'Ext.ux.gcp.AutoCompleter', {
												fieldCls : 'xn-form-text xn-suggestion-box grid-field',
												name : item.fieldName
														+ '_regBeneField',
												itemId : item.fieldName
														+ '_regBeneField',
												cfgUrl : autoCfgUrl,
												cfgQueryParamName : 'qfilter',
												cfgRecordCount : -1,
												cfgTplCls : 'xn-autocompleter-t7',
												cfgSeekId : 'recieverseek',
												cfgRootNode : 'd.receivers',
												cfgDataNode1 : 'receiverCode',
												cfgDataNode2 : 'receiverName',
												focusable : true,
												cfgStoreFields : [
														'accountNumber',
														'accountType',
														'bankCode', 'bankName',
														'bankType',
														'branchCode',
														'branchName',
														'receiverCcy',
														'receiverCode',
														'receiverName']
											});
									objEditor.on('select', function(combo,
													records) {
												me.setReceiverDefValue(combo,
														records);
											});

									objEditor.on('blur', function(combo) {
												me
														.applyReceiverValidation(combo);
											});

									objEditor.on('change', function(combo,
													strCurrentValue,
													strNewValue) {
												me.resetReceiverDefValue(combo,
														strCurrentValue,
														strNewValue);
											});
									objEditor.on('afterrender',
											function(field) {
												var strId = field.getEl()
														&& field.getEl().id
														? field.getEl().id
														: null;
												var inputField = strId
														? $('#' + strId
																+ ' input')
														: null;
												if (inputField) {
													inputField
															.NoSpecialCharacters(strNoSplCharRegex);
												}
											});
									objEditor.maxLength = _mapFieldLength[item.fieldName];
									objEditor.enforceMaxLength = true;
									objCol.fnColumnRenderer = function(value,
											meta, record, rowIndex, colIndex,
											store, view, colId) {
										return record
												.get('drawerDescription_regBeneField')
												|| '';
									};

								} else if (item.fieldName === 'beneficiaryBankIDCode') {
									objEditor = Ext.create(
											'Ext.ux.gcp.AutoCompleter', {
												fieldCls : 'xn-form-text xn-suggestion-box grid-field',
												name : item.fieldName
														+ '_regBeneField',
												itemId : item.fieldName
														+ '_regBeneField',
												focusable : true,
												cfgUrl : autoCfgUrl,
												cfgQueryParamName : 'qfilter',
												cfgRecordCount : -1,
												cfgTplCls : 'xn-autocompleter-t7',
												cfgRootNode : 'd.preferences',
												cfgDataNode1 : 'ROUTINGNUMBER',
												cfgDataNode2 : 'BANKDESCRIPTION',
												msgTarget : 'none',
												cfgStoreFields : ['ADDRESS',
														'BANKCODE',
														'BANKDESCRIPTION',
														'BIC', 'BRANCHCODE',
														'BRANCHDESCRIPTION',
														'COUNTRY', 'FEDABA',
														'ROUTINGNUMBER'],
												generateUrl : function(strQuery) {
													var strUrl = 'services/userseek/drawerbank.json?$filtercode1={0}&$filtercode2={1}';
													if (!Ext.isEmpty(strQuery))
														strUrl += '&$autofilter='
																+ strQuery;
													var strParam = '', strParam2 = strPaymentCategory;
													if (!Ext
															.isEmpty(strLayoutType)
															&& (strLayoutType === 'ACHLAYOUT'))
														strParam = 'FED';
													else {
														var grid = me.getGrid();
														if (grid) {
															var col = grid
																	.down('gridcolumn[itemId="col_beneficiaryBankIDType_regBeneField"]');
															if (!Ext
																	.isEmpty(col)) {
																var editor = col
																		.getEditor();
																if (editor) {
																	strParam = editor
																			.getValue()
																			|| '';
																}
															}
														}
													}
													return Ext.String.format(
															strUrl, strParam,
															strParam2);
												}
											});
									objEditor.on('select', function(combo,
													records) {
												me.setBankBranchDetail(combo,
														records);
											});
									objEditor.on('change', function(combo,
													strCurrentValue,
													strNewValue) {
												me.resetBankBranchDetail(combo,
														strCurrentValue,
														strNewValue);
											});

									objEditor.on('blur', function(combo, e) {
												me.isValidRoutingNo(combo
														.getValue());
											});

									objEditor.maxLength = _mapFieldLength[item.fieldName];
									objEditor.enforceMaxLength = true;

								} else if (item.fieldName === 'beneficiaryBankIDType') {
									objEditor = me.getColumnEditor(item,
											'_regBeneField', false);
									objEditor.on('select', function(combo) {
												me.isValidRoutingNo(combo
														.getValue());
											});
								} else if (item.fieldName === 'receiverID') {
									objEditor = me.getColumnEditor(item,
											'_regBeneField', false);
									objEditor.on('afterrender',
											function(field) {
												var strId = field.getEl()
														&& field.getEl().id
														? field.getEl().id
														: null;
												var inputField = strId
														? $('#' + strId
																+ ' input')
														: null;
												if (inputField) {
													inputField
															.NoSpecialCharacters(strNoSplCharRegex);
												}
											});
								} else {
									// item.readOnly = 'true';
									objEditor = me.getColumnEditor(item,
											'_regBeneField', false);
								}
								if (!Ext.isEmpty(objEditor)) {
									objEditor.isMandatory = true;
									if (!Ext.isEmpty(item.displayMode)
											&& item.displayMode === '3') {
										// objEditor.allowBlank = true;
										objCol.colHeader = '<span class="requiredLeft">'
												+ strLabel + '</span>';
										objEditor.isMandatory = true;
									}
									objEditor.on('blur', function(obj) {
												me.validateField(obj);
											});
									objCol.editor = objEditor;
								}
								columnModel[item.fieldName] = objCol;
							}
						}

					});
				}
			}
			// "additionalInfo" Node's field addition
			if (dataPmtEntry.additionalInfo) {
				$.each(dataPmtEntry.additionalInfo, function(key, value) {
					arrFields = value;
					if (key === 'additionalReferenceInfo')
						strPostFix = '_addRefInfo';
					else if (key === 'bankToBankInfo')
						strPostFix = '_addBankInfo';
					else if (key === 'orderingParty')
						strPostFix = '_addOrdPartyInfo';
					if (key === 'orderingParty'
							&& value.registeredOrderingParty) {
						arrFields = value.registeredOrderingParty;
						Ext.each(arrFields, function(item) {
							if (item.fieldName
									&& (item.fieldName === 'orderingParty' || item.fieldName === 'orderingPartyDescription')) {
								if (captureDataOnly) {
									objDefValue = item.value;
									if (item.dataType === 'select'
											&& item.availableValues
											&& item.availableValues.length === 1) {
										objDefValue = item.availableValues[0].code
												? item.availableValues[0].code
												: '';

									}
									rowData[item.fieldName
											+ '_regOrderingPartyField'] = objDefValue;
								} else {
									objEditor = null;
									strLabel = '';
									strLabel = getLabel(
											'editableGridOrderingPartyName',
											'Ordering Party Name');
									/*
									 * if (item.fieldName === 'orderingParty')
									 * strLabel = getLabel(
									 * 'editableGridOrderingPartyCode',
									 * 'Ordering Party Code'); else if
									 * (item.fieldName ===
									 * 'orderingPartyDescription') strLabel =
									 * getLabel(
									 * 'editableGridOrderingPartyName',
									 * 'Ordering Party Name');
									 */

									storeFields.push(item.fieldName
											+ '_regOrderingPartyField');
									objCol = {
										colId : item.fieldName
												+ '_regOrderingPartyField',
										colHeader : strLabel,
										sortable : false,
										hideable : false,
										draggable : false
									};
									if (item.fieldName === 'orderingParty') {
										autoCfgUrl = 'services/orderingparty';
										if (!Ext.isEmpty(_strMyProduct))
											autoCfgUrl += '/' + _strMyProduct
													+ '.json';
										else
											autoCfgUrl += '.json';
										// TODO : Service JSON response should
										// be
										// modified
										objEditor = Ext.create(
												'Ext.ux.gcp.AutoCompleter', {
													fieldCls : 'xn-form-text xn-suggestion-box grid-field',
													name : item.fieldName
															+ '_regOrderingPartyField',
													itemId : item.fieldName
															+ '_regOrderingPartyField',
													cfgUrl : autoCfgUrl,
													focusable : true,
													cfgTplCls : 'xn-autocompleter-t7',
													cfgQueryParamName : 'qfilter',
													cfgRecordCount : -1,
													// cfgRootNode : '.',
													cfgKeyNode : 'code',
													cfgDataNode1 : 'description'
												});
										objEditor.on('select', function(combo,
														records) {
													me
															.setOrderingPartyDefValue(
																	combo,
																	records);
												});
										objCol.fnColumnRenderer = function(
												value, meta, record, rowIndex,
												colIndex, store, view, colId) {
											return record
													.get('orderingPartyDescription_regOrderingPartyField')
													|| '';
										};
									}
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
							}

						});

					} else {
						if (!Ext.isEmpty(arrFields))
							Ext.each(arrFields, function(item) {
								if (captureDataOnly) {
									objDefValue = item.value;
									if (item.dataType === 'select'
											&& item.availableValues
											&& item.availableValues.length === 1) {
										objDefValue = item.availableValues[0].code
												? item.availableValues[0].code
												: '';

									} else if (item.dataType === 'checkBox') {
										objDefValue = objDefValue === 'Y'
												? true
												: false;
									}
									rowData[item.fieldName + strPostFix] = objDefValue;
								} else {
									objCol = {
										colId : item.fieldName + strPostFix,
										colHeader : item.label,
										sortable : false,
										hideable : false,
										draggable : false
									};
									if (item.dataType === 'date') {
										storeFields.push({
											name : item.fieldName + strPostFix,
											type : 'date',
											format : strExtApplicationDateFormat
										});
										objCol.fnColumnRenderer = Ext.util.Format
												.dateRenderer(strExtApplicationDateFormat);
									} else if (item.dataType === 'amount') {
										storeFields.push({
													name : item.fieldName
															+ strPostFix,
													type : 'float'
												});
										objCol.colType = 'amount';
									} else if (item.dataType === 'checkBox') {
										storeFields.push({
													name : item.fieldName
															+ strPostFix,
													type : 'bool',
													defaultValue : false
												});
										objCol.fnColumnRenderer = function(
												value, meta, record, rowIndex,
												colIndex, store, view, colId) {
											if (value === true)
												return 'Y';
											else
												return 'N'
										};

									} else
										storeFields.push(item.fieldName
												+ strPostFix);

									if (item.dataType === 'select') {
										objCol.fnColumnRenderer = function(
												value, meta, record, rowIndex,
												colIndex, store, view, colId) {
											var grid = me.getGrid();
											// var col = grid.columns[colIndex];
											var col = grid
													.down('gridcolumn[itemId="'
															+ colId + '"]');
											var retValue = value;
											if (col && col.getEditor()) {
												var store = (col.getEditor().store)
														? col.getEditor().store
														: null;
												if (store) {
													var rec = store.findRecord(
															'code', value);
													if (rec
															&& !Ext
																	.isEmpty(rec.data.description))
														retValue = rec.data.description;
												}
											}
											return retValue;
										}
									}
									objEditor = me.getColumnEditor(item,
											strPostFix, false);
									if (!Ext.isEmpty(objEditor)) {
										if (!Ext.isEmpty(item.displayMode)
												&& item.displayMode === '3') {
											// objEditor.allowBlank = true;
											objCol.colHeader = '<span class=" required">'
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
				});

			}
			// "enrichments" Node's field addition
			if (dataPmtEntry.enrichments) {
				var strEnrichId = '';
				strPostFix = '';
				$.each(dataPmtEntry.enrichments, function(key, value) {
					if ((key === 'udeEnrichment' || key === 'productEnrichment'
							|| key === 'myproductEnrichment'
							|| key === 'clientEnrichment'
							|| key === 'myProductMultiSet'
							|| key === 'bankProductMultiSet'
							|| key === 'clientMultiSet'
							|| key === 'productEnrichmentStdFields'
							|| key === 'myproductEnrichmentStdFields' || key === 'clientEnrichmentStdFields')) {
						strPostFix = me.getEnrichPostFixString(key);
						arrFields = null;
						if (key === 'myProductMultiSet'
								|| key === 'bankProductMultiSet'
								|| key === 'clientMultiSet') {

							if (captureDataOnly) {
								rowData[key] = value /* JSON.stringify(value || [] ) */;
							} else {
								storeFields.push(key)
							}
							/*
							 * if (value && value.length > 0) { arrFields =
							 * value[0].parameters || null; }
							 */
						} else if (key === 'udeEnrichment'
								|| key === 'productEnrichment'
								|| key === 'myproductEnrichment'
								|| key === 'clientEnrichment'
								|| key === 'productEnrichmentStdFields'
								|| key === 'myproductEnrichmentStdFields'
								|| key === 'clientEnrichmentStdFields') {
							arrFields = value.parameters;
						}

						if (arrFields) {
							$.each(arrFields, function(index, item) {
								if (item.code) {
									strEnrichId = item.code + strPostFix;
									if (captureDataOnly) {
										objDefValue = !Ext
												.isEmpty(item.defaultValue)
												? item.defaultValue
												: item.value;
										if (item.dataType === 'select'
												&& item.lookupValues
												&& item.lookupValues.length === 1) {
											objDefValue = item.lookupValues[0].key
													? item.lookupValues[0].key
													: '';
										} else if (item.displayType === 10) {
											objDefValue = objDefValue === 'Y'
													? true
													: false;
										}
										rowData[strEnrichId] = objDefValue;
									} else {
										objCol = {
											colId : strEnrichId,
											colHeader : item.description,
											sortable : false,
											hideable : false,
											draggable : false
										};
										// If displayType is date
										if (item.displayType === 6) {
											storeFields.push({
												name : strEnrichId,
												type : 'date',
												format : strExtApplicationDateFormat
											});
											objCol.fnColumnRenderer = Ext.util.Format
													.dateRenderer(strExtApplicationDateFormat);
										} else if (item.displayType === 2
												|| item.displayType === 3) {
											// If displayType is amount or
											// number
											storeFields.push({
														name : strEnrichId,
														type : 'float'
													});
										} else if (item.displayType === 10) {
											storeFields.push({
														name : strEnrichId,
														type : 'bool',
														defaultValue : false
													});
											objCol.fnColumnRenderer = function(
													value, meta, record,
													rowIndex, colIndex, store,
													view, colId) {
												if (value === true)
													return 'Y';
												else
													return 'N'
											};
										} else
											storeFields.push(strEnrichId);

										if (item.displayType === 4
												|| item.displayType === 11) {
											// If displayType is select box
											objCol.fnColumnRenderer = function(
													value, meta, record,
													rowIndex, colIndex, store,
													view, colId) {
												var grid = me.getGrid();
												// var col =
												// grid.columns[colIndex];
												var col = grid
														.down('gridcolumn[itemId="'
																+ colId + '"]');
												var retValue = value;
												if (col && col.getEditor()) {
													var store = (col
															.getEditor().store)
															? col.getEditor().store
															: null;
													if (store) {
														var rec = store
																.findRecord(
																		'code',
																		value);
														if (rec
																&& !Ext
																		.isEmpty(rec.data.description))
															retValue = rec.data.description;
													}
												}
												return retValue;
											}
										}
										objEditor = me
												.getEnrichmentFieldTextEditor(
														strEnrichId, item);
										if (!Ext.isEmpty(objEditor)) {
											if (!Ext.isEmpty(item.mandatory)
													&& item.mandatory === true) {
												// objEditor.allowBlank = true;
												objCol.colHeader = '<span class="requiredLeft">'
														+ item.description
														+ '</span>';
												objEditor.isMandatory = true;
											}
											objEditor.on('blur', function(obj) {
														me.validateField(obj);
													});
											objCol.editor = objEditor;
										}
										// columnModel[item.code] = objCol;
										columnModel[strEnrichId] = objCol;
									}
								}
							});
						}
					}
				});
			}
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
		var emptyRecord = null, record = null, isDirty = false, isEmptyRecordExist = false, intCount = 1;
		var objGroupView = me.down('groupView[itemId="gridEntryGroupView"]');

		/*
		 * intCount = !Ext.isEmpty(intRows) ? parseInt(intRows) : (!Ext
		 * .isEmpty(me.intAddEmptyRow) ? parseInt(me.intAddEmptyRow) : 1);
		 */
		if (me.gridMetaData) {
			emptyRecord = {};
			var dataObj = me.cloneObject(me.gridMetaData);
			emptyRecord = me.createGridPreRequisites(dataObj, true);
		}
		if (emptyRecord) {
			var grid = me.getGrid();
			if (grid && grid.rowEditor) {
				if (!grid.rowEditor.editing && !me.isLoadingIndicatorOn) {
					for (var i = 0; i < intCount; i++)
						grid.store.insert(0, emptyRecord);
					grid.rowEditor.startEdit(0, 0);
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
						// grid.rowEditor.cancelEdit();
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
		var me = this, groupView = me.getGroupView();
		var rec = prevRecord || record;
		var jsonData = null
		var strTxnReferenceNo = null;
		var strUrl = _mapUrl['saveInstrumentUrl'];
		var jsonPost = null;
		var canAddAnother = false, metaData = null, nextRecord = null, isDirty = false, arrErors = [], hasError = false, hasTemplateName = false,isSaveOpDone = false;

		if (!strUrl)
			return false;
		/* NOTE : Added comment for time being. Below code will be removed */
		if (false && !addUsing) {
			isDirty = grid.rowEditor.getEditor().isDirty();
			if (rec && !isDirty) {
				canAddAnother = (grid.createEmptyRow === true) ? true : false;
				me.handleEditToggle(grid, editor, record, prevRecord,
						canAddAnother);
				return false;
			}
		}

		jsonData = me.doGenerateSavePaymentJson(rec);
		strTxnReferenceNo = jsonData.txnReference;
		jsonPost = jsonData.jsonPost;

		if (blnPrdCutOff === true) {
			jsonPost.d.paymentEntry.standardField.push({
						fieldName : 'prdCutoffFlag',
						value : 'Y'
					});
		}
		canAddAnother = (grid.createEmptyRow === true || Ext
				.isEmpty(jsonPost.d.__metadata._detailId)) ? true : false;


		if (!Ext.isEmpty(jsonPost.d.__metadata._detailId)) {
			var arrStdFields = []
			$.each(jsonPost.d.paymentEntry.standardField, function(index, cfg) {
						if (cfg.fieldName !== 'templateName') {
							arrStdFields.push(cfg);
						}
					});
			jsonPost.d.paymentEntry.standardField = arrStdFields;

		}
		$.each(jsonPost.d.paymentEntry.standardField, function(index, cfg) {
			if ((cfg.fieldName == 'templateName' && !Ext.isEmpty(cfg.value) && cfg.value !=null) ||
					!Ext.isEmpty(jsonPost.d.__metadata._detailId)) {
				hasTemplateName = true;
			}
		});		
		// execute Save service only when atleast Template Name is selected
		if(hasTemplateName)
		{
			if (!addUsing)
				groupView.setLoading(true);
			me.isLoadingIndicatorOn = true;
			
		Ext.Ajax.request({
			url : strUrl,
			method : 'POST',
			jsonData : Ext.encode(jsonPost),
			async : false,
			success : function(response) {
				var data = Ext.decode(response.responseText);
				var status = null;
				if (data && data.d) {
					if (data.d.paymentEntry && data.d.paymentEntry.message
							&& data.d.paymentEntry.message.success)
						status = data.d.paymentEntry.message.success;
					if (status === 'SUCCESS' || status === 'SAVEWITHERROR') {
							isSaveOpDone = true;
						if (status === 'SUCCESS') {
							doClearMessageSection();
						}
						if (status === 'SAVEWITHERROR') {
							if (data.d.paymentEntry.message.errors) {
								hasError = true;
								arrErors = data.d.paymentEntry.message.errors;
								// paintErrors(data.d.paymentEntry.message.errors);
							}

						}
						if (!isEmpty(data.d.paymentEntry.message.pirNo)) {
							var msgDtls = {
								'pirNo' : data.d.paymentEntry.message.pirNo,
								'uniqueRef' : data.d.paymentEntry.message.uniqueRef,
								'txnReference' : strTxnReferenceNo
							};
							// TODO : This is to be handled if needed otherwise
							// keep as is
							// paintSuccessMsg(msgDtls, 'Q');
						}

						groupView.setLoading(false);
						me.isLoadingIndicatorOn = false;
						if (!addUsing) {
							var strStatus = data.d.paymentEntry.paymentMetaData._status
									|| rec.get('__status');
							metaData = data.d.__metadata
									|| rec.get('__metadata') || {};
							// metaData['_detailId'] =
							// data.d.__metadata._detailId;
							rec.beginEdit();
							rec.set({
										__metadata : metaData,
										__errors : arrErors,
										__status : strStatus,
										hasError : hasError,
										amountFormatted_stdField : me
												.getFormatedAmount(data)
									});
							rec.endEdit();
							rec.commit();
							if (canAddAnother) {
								me.createEmptyRow();
								/*
								 * me.handleEditToggle(grid, editor, record,
								 * prevRecord, canAddAnother);
								 */
							}
						} else {
							// me.refreshData();
						}
						/*
						 * if (prevRecord) { editor.startEdit(record, 0); } else {
						 * if (canAddAnother) { me.createEmptyRow(); } else {
						 * var curIndex = grid.getRecordIndex(rec); if (curIndex
						 * !== -1) { nextRecord = grid.getRecord(curIndex + 1);
						 * if (nextRecord) { editor.startEdit(nextRecord, 0); } } } }
						 */
						// me.loadGridData('');
						// me.updatePaymentInfo(data);
						if (!Ext.isEmpty(grid.fnFocusOutCallback)) {
							me.doHandleCallBack(grid.callBackScope);
						}

					} else if (status === 'FAILED') {
						groupView.setLoading(false);
						me.isLoadingIndicatorOn = false;
						if (data.d.paymentEntry.message) {
							var arrError = data.d.paymentEntry.message.errors;
							var isProductCutOff = false;
							var strMsg = getLabel('instrumentProductCutoffMsg',
									'Cut Off time Exceeded, Do you want to Proceed ?'), errCode = null;
							if (arrError && arrError.length > 0) {
								$.each(arrError, function(index, error) {
											// strMsg = error.errorMessage;
											errCode = error.errorCode;
											if (errCode
													&& (errCode.toUpperCase()
															.indexOf("WARN") >= 0)
													|| errCode === 'GD0002') {
												isProductCutOff = true;
											}
										});
							}
							if (isProductCutOff) {
								var args = {
									record : record,
									editor : record,
									grid : grid,
									me : me
								};
								doClearMessageSection();
								var strTitle = mapLbl['warnMsg'];
								showAlert(130, 300, strTitle, strMsg,
										me.doHandleSaveWithProductCutOff, args);
							} else {
								if (arrError){
									paintErrors(arrError);
									var strStatus = data.d.paymentEntry.paymentMetaData._status
									|| rec.get('__status');
									metaData = data.d.__metadata
											|| rec.get('__metadata') || {};
									// metaData['_detailId'] =
									// data.d.__metadata._detailId;
									rec.beginEdit();
									rec.set({
												__metadata : metaData,
												__errors : arrError,
												__status : strStatus,
												hasError : hasError,
												amountFormatted_stdField : me
														.getFormatedAmount(data)
											});
										me.removeSelectActionButton();										
								}
								if (canEdit && grid && grid.rowEditor) {
									if (!grid.rowEditor.editing) {
										grid.rowEditor.startEdit(rec, 0);
									} else if (prevRecord) {
										grid.rowEditor.cancelEdit();
										// grid.rowEditor.startEdit(rec, 0);
										me.doSetDirty(grid, true);
									}
									// me.doSetDirty(grid, true);
								}
							}
						}
						if (!addUsing)
							me.toggleReadonlyFieldsForReceiver(null, rec
											.get('drawerRegistedFlag') === 'R',
									false);
						me.scrollToTop();
					} else if (isEmpty(status)
							&& data.d.paymentEntry.message.errors) {
						doClearMessageSection();
						// paintErrors(data.d.paymentEntry.message.errors);
						record.beginEdit();
						record.set({
									__errors : data.d.paymentEntry.message.errors,
									hasError : true
								});
						record.endEdit();
						record.commit();
						blockPaymentUI(false);
					}
				}
			},
			failure : function() {
				var errMsg = "";
				var arrError = new Array();
				arrError.push({
							"errorCode" : "Message",
							"errorMessage" : mapLbl['unknownErr']
						});
				paintErrors(arrError);
				groupView.setLoading(false);
			}
		});
			me.getSelectButtonVisibilityAction(record, grid,isSaveOpDone);
		groupView.handleGroupActionsVisibility(me.strDefaultMask);
		}
		else
		{
			if (!Ext.isEmpty(grid.fnFocusOutCallback)) {
				me.doHandleCallBack(grid.callBackScope);
			}
		}
		 if(isSaveOpDone) 
			groupView.refreshData(); 
	},
	getFormatedAmount : function(data) {
		var strFormattedAmount = '';
		if (data && data.d && data.d.paymentEntry
				&& data.d.paymentEntry.standardField) {
			Ext.each(data.d.paymentEntry.standardField, function(item) {
						if (item.fieldName === 'amount') {
							strFormattedAmount = (item.formattedValue || item.value);
							return false;
						}
					});
		}
		return strFormattedAmount;
	},
	updatePaymentInfo : function(jsonData) {
		var data = null, strHdrEnteredNo = 0;
		if (!jsonData) {
			data = getPaymentHeaderInfo(strIdentifier);
		} else if (jsonData && jsonData.d && jsonData.d.paymentEntry
				&& jsonData.d.paymentEntry.paymentHeaderInfo
				&& !isEmpty(jsonData.d.paymentEntry.paymentHeaderInfo)) {
			data = jsonData.d.paymentEntry;
		}
		if (data) {
			var payHeaderInfo = data.paymentHeaderInfo;
			var flagControlTotal = false;// doValidationForControlTotal();
			var strHdrEnteredAmount = '', strHdrTotalNo = '', strTotalAmount = '', strLastUpdatedTime = '', strBatchStatus = '', ctrl = null;
			// Update control total amount and number of
			// instruments
			// if control total validation is not set.
			if ((!isEmpty(payHeaderInfo.hdrTotalNo))
					&& (!isEmpty(payHeaderInfo.totalAmount))
					&& !flagControlTotal) {
				var controlField = $('#totalNoHdr');
				controlField.val(payHeaderInfo.hdrTotalNo);
				var amountField = $('#amountHdr');
				amountField.val(payHeaderInfo.totalAmount);
			}
			if (payHeaderInfo) {
				strHdrEnteredNo = payHeaderInfo.hdrEnteredNo;
				strHdrEnteredAmount = payHeaderInfo.hdrEnteredAmountFormatted;
				strHdrTotalNo = payHeaderInfo.hdrTotalNo;
				if (jQuery.isNumeric(strHdrTotalNo)
						&& jQuery.isNumeric(strHdrEnteredNo)
						&& (strHdrTotalNo - strHdrEnteredNo >= 0))
					strHdrTotalNo = strHdrTotalNo - strHdrEnteredNo;
				strTotalAmount = payHeaderInfo.balanceAmountFormatted;
				strLastUpdatedTime = payHeaderInfo.lastUpdateTime || '';
				strBatchStatus = payHeaderInfo.hdrStatus;
				if (isBatchViewMode
						&& typeof repaintPaymentDetailGroupActions != 'undefined'
						&& typeof repaintPaymentDetailGroupActions === 'function')
					repaintPaymentDetailGroupActions(payHeaderInfo);
			}
			$('#enteredInstCountHdrInfoSpan, .enteredInstCount_HdrInfo')
					.html(strHdrEnteredNo);
			$('#hdrEnteredAmountFormattedHdrInfoSpan, .hdrEnteredAmountFormatted_HdrInfo')
					.html(strHdrEnteredAmount);
			$('#totalInstCountHdrInfoSpan, .totalInstCount_HdrInfo')
					.html(strHdrTotalNo);
			$('#balanceAmountFormattedHdrInfoSpan, .balanceAmountFormatted_HdrInfo')
					.html(strTotalAmount);
			if (strIdentifier)
				$('.lastUpdateDateTimeText').html("You saved on "
						+ strLastUpdatedTime || '');
		} else {
			$('#enteredInstCountHdrInfoSpan').html(0);
			$('#enteredInstAmountHdrInfoSpan').html(0.00);
		}
		if (typeof paintPaymentHdrAdditionalInformationSection != 'undefined'
				&& typeof paintPaymentHdrAdditionalInformationSection === 'function')
			paintPaymentHdrAdditionalInformationSection('B');
		return strHdrEnteredNo;
	},
	handleEditToggle : function(grid, editor, record, prevRecord, canAddAnother) {
		var me = this, nextRecord = null;
		if(grid.isFocusOut == true)
		{
			// this code will execute, when user directly click on Verify button while Editing record in Editable Grid.
			// if error occurs and user stays on same page rather than going to verify Page.
			// this code will execute.
			me.renderSelectActionButton();
		}		
		if (grid.isFocusOut !== true) {
			if (editor) {
				if (prevRecord) {
					editor.startEdit(record, 0);
				} else {
					var curIndex = grid.getRecordIndex(record);
					if (curIndex !== -1) {
						nextRecord = grid.getRecord(curIndex + 1);
						if (nextRecord) {
							editor.startEdit(nextRecord, 0);
						}
					}
					// NOTE : Commenting the blog as of now
					if (false) {
						if (canAddAnother) {
							var blnResult;
							var blnFlag = false;// doValidationForControlTotal();
							if (blnFlag)
								blnResult = me
										.validateTotalNumberOfInstrument(false);
							else
								blnResult = true;
							if (blnResult && me.charEditable === 'Y') {
								me.createEmptyRow();
							}
						} else {
							var curIndex = grid.getRecordIndex(record);
							if (curIndex !== -1) {
								nextRecord = grid.getRecord(curIndex + 1);
								if (nextRecord) {
									editor.startEdit(nextRecord, 0);
								}
							}
						}
					}
				}
				grid.getView().refresh();
				//remove after grid refresh
				me.removeSelectActionButton();				
			}
		}
		grid.isFocusOut = false;
	},
	doHandleSaveWithProductCutOff : function(blnCanContinue, args) {
		var me = args.me;
		if (blnCanContinue === true)
			me.doSaveRecord(args.record, args.editor, args.grid, true, true,
					null, false);

	},
	doGenerateSavePaymentJson : function(record) {
		var me = this;
		var data = me.cloneObject(me.gridMetaData), recData = record.data
				|| record;
		var arrFields = null, dataPmtEntry = null, arrJsonFields = new Array(), objValue = '', strTxnReference = '', strTxnType = null;
		var retJson = {
			d : {
				paymentEntry : {
					standardField : [],
					beneficiary : {
						registeredBene : []
					}
				},
				__metadata : {}
			}
		};

		if (!Ext.isEmpty(data) && data.d && data.d.paymentEntry) {
			dataPmtEntry = data.d.paymentEntry;
			// "Standard Field" Node's field addition
			if (dataPmtEntry.standardField) {
				arrFields = dataPmtEntry.standardField;
				arrJsonFields = new Array();
				if (!Ext.isEmpty(arrFields))
					Ext.each(arrFields, function(item) {
						if (item.fieldName
								&& (item.fieldName !== 'contractRefNo'
										&& item.fieldName !== 'rateType' && item.fieldName !== 'drawerRegisteredFlag')) {
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
								if (item.fieldName === 'bankProduct')
									objValue = (me.gridMetaData
											&& me.gridMetaData.d
											&& me.gridMetaData.d.paymentEntry
											&& me.gridMetaData.d.paymentEntry.paymentHeaderInfo && me.gridMetaData.d.paymentEntry.paymentHeaderInfo.hdrBankProduct)
											? me.gridMetaData.d.paymentEntry.paymentHeaderInfo.hdrBankProduct
											: '';
								else if(item.fieldName == 'amount'){
									objValue = recData[item.fieldName+ '_stdField'];
									formattedValue = recData['amountFormatted_stdField'];
									Ext.each(recData["accountNo_stdField_options"], function(item){
										if(item.code === recData["accountNo_stdField"])
											me.ccy = item.additionalInfo.ACMCURRENCY;
										})
									arrJsonFields.push({
										fieldName : 'drawerCurrency',
										value : me.ccy
									});
								}else
									objValue = recData[item.fieldName
											+ '_stdField'];
								if (item.fieldName == 'txnType'
										&& me.entryType === 'TEMPLATE') {
									strTxnType = objValue;
								}
								arrJsonFields.push({
											fieldName : item.fieldName,
											value : objValue
										});
							}
							if (item.fieldName === 'referenceNo') {
								strTxnReference = recData[item.fieldName
										+ '_stdField'];
							}
						}

					});
				if (me.entryType === 'TEMPLATE' && !Ext.isEmpty(strTxnType)) {
					Ext.each(arrJsonFields, function(itm) {
								if (itm.fieldName === 'prenote'
										|| itm.fieldName === 'holdUntilFlag') {
									if (strTxnType == '1'
											&& itm.fieldName === 'prenote') {
										itm.value = 'Y';
									} else if (strTxnType == '3'
											&& itm.fieldName === 'holdUntilFlag') {
										itm.value = 'Y';
									} else
										itm.value = 'N';
								}
							});
				}
				retJson.d.paymentEntry.standardField = arrJsonFields;
			}

			if (strLayoutType !== 'ACCTRFLAYOUT') {
				// "beneficiary.registeredBene" Node's field addition
				if (recData['isAdhocAllowed'] === true
						&& recData['drawerRegistedFlag'] === 'A') {
					arrFields = dataPmtEntry.beneficiary.adhocBene;
					arrJsonFields = new Array();
					if (!Ext.isEmpty(arrFields))
						Ext.each(arrFields, function(item) {
									if (item.fieldName
											&& (Ext.Array.contains(
													me.arrDrawerFields,
													item.fieldName))) {
										var strValue = recData[item.fieldName
												+ '_regBeneField'];
										if (item.fieldName === 'drawerCode'
												&& !Ext.isEmpty(strValue))
											strValue = strValue.toUpperCase();
										item.value = strValue;
										arrJsonFields.push(item/*
																 * { fieldName :
																 * item.fieldName,
																 * value :
																 * strValue }
																 */);
									}

								});
					arrJsonFields.push({
								fieldName : 'beneficiaryAdhocbankFlag',
								value : recData['beneficiaryAdhocbankFlag']
							}),
							arrJsonFields.push({
								fieldName : 'drawerAccountNo',
								value : recData['drawerAccountNo_regBeneField']
							}),
							arrJsonFields.push({
								fieldName : 'drawerDescription',
								value : recData['drawerDescription_regBeneField']
							})
							
					retJson.d.paymentEntry.beneficiary.adhocBene = arrJsonFields;
					retJson.d.paymentEntry.beneficiary.drawerRegistedFlag = 'A';
				} else if ((dataPmtEntry.beneficiary && dataPmtEntry.beneficiary.registeredBene)) {
					arrFields = dataPmtEntry.beneficiary.registeredBene;
					arrJsonFields = new Array();
					if (!Ext.isEmpty(arrFields))
						Ext.each(arrFields, function(item) {
									if (item.fieldName
											&& (Ext.Array.contains(
													me.arrDrawerFields,
													item.fieldName))) {
										/*
										 * arrJsonFields.push({ fieldName :
										 * item.fieldName, value :
										 * recData[item.fieldName +
										 * '_regBeneField'] });
										 */
										item.value = recData[item.fieldName
												+ '_regBeneField'];
										arrJsonFields.push(item);
									}

								});
					retJson.d.paymentEntry.beneficiary.registeredBene = arrJsonFields;
					retJson.d.paymentEntry.beneficiary.drawerRegistedFlag = 'R';
				}
			}
			// "additionalInfo" Node's field addition
			if (dataPmtEntry.additionalInfo) {
				retJson.d.paymentEntry.additionalInfo = {};
				$.each(dataPmtEntry.additionalInfo, function(key, value) {
					strPostFix = '';
					if (key === 'additionalReferenceInfo')
						strPostFix = '_addRefInfo';
					else if (key === 'bankToBankInfo')
						strPostFix = '_addBankInfo';
					else if (key === 'orderingParty')
						strPostFix = '_addOrdPartyInfo';

					if (key === 'orderingParty') {
						if (dataPmtEntry.additionalInfo.orderingParty.registeredOrderingParty) {
							arrFields = dataPmtEntry.additionalInfo.orderingParty.registeredOrderingParty;
							arrJsonFields = new Array();
							if (!Ext.isEmpty(arrFields))
								Ext.each(arrFields, function(item) {
									if (item.fieldName
											&& (item.fieldName === 'orderingParty')) {
										arrJsonFields.push({
													fieldName : item.fieldName,
													value : recData[item.fieldName
															+ '_regOrderingPartyField']
												});
									}

								});
							retJson.d.paymentEntry.additionalInfo[key] = {
								registeredOrderingParty : arrJsonFields,
								orderingPartyRegisteredFlag : 'R'
							};
						}

					} else {
						arrFields = value;
						arrJsonFields = new Array();
						if (!Ext.isEmpty(arrFields))
							Ext.each(arrFields, function(item) {
										var cfg = item;
										if (item.dataType === 'date') {
											if (recData[item.fieldName
													+ strPostFix])
												objValue = Ext.Date
														.format(
																recData[item.fieldName
																		+ strPostFix],
																strExtApplicationDateFormat);
										} else if (item.dataType === 'checkBox') {
											objValue = recData[item.fieldName
													+ strPostFix] === true
													? 'Y'
													: 'N';
										} else {
											objValue = recData[item.fieldName
													+ strPostFix];
										}
										if (objValue) {
											cfg.value = objValue;
										}
										arrJsonFields.push(cfg);

									});
						retJson.d.paymentEntry.additionalInfo[key] = arrJsonFields;
					}
				});

			}

			// "enrichments" Node's field addition
			if (dataPmtEntry.enrichments) {
				// retJson.d.paymentEntry.enrichments = {};
				var strPostFix = '';
				var isEnrichPresent = true;
				$.each(dataPmtEntry.enrichments, function(key, value) {
					if (key === 'udeEnrichment' || key === 'productEnrichment'
							|| key === 'myproductEnrichment'
							|| key === 'clientEnrichment'
							|| key === 'myProductMultiSet'
							|| key === 'bankProductMultiSet'
							|| key === 'clientMultiSet'
							|| key === 'productEnrichmentStdFields'
							|| key === 'myproductEnrichmentStdFields'
							|| key === 'clientEnrichmentStdFields') {
						if (isEnrichPresent) {
							retJson.d.paymentEntry.enrichments = {};
							isEnrichPresent = false;
						}
						arrFields = null;
						strPostFix = me.getEnrichPostFixString(key);
						if (key === 'myProductMultiSet'
								|| key === 'bankProductMultiSet'
								|| key === 'clientMultiSet') {
							if (value && value.length > 0) {
								arrFields = value[0].parameters || null;
							}
						} else if (key === 'udeEnrichment'
								|| key === 'productEnrichment'
								|| key === 'myproductEnrichment'
								|| key === 'clientEnrichment'
								|| key === 'productEnrichmentStdFields'
								|| key === 'myproductEnrichmentStdFields'
								|| key === 'clientEnrichmentStdFields') {
							arrFields = value.parameters;
						}

						arrJsonFields = new Array();
						if (arrFields) {
							$.each(arrFields, function(index, item) {
								var cfg = item;
								if (item.displayType === 10) {
									cfg.value = !Ext.isEmpty(recData[item.code
											+ strPostFix])
											&& recData[item.code + strPostFix] === true
											? 'Y'
											: 'N';
								} else {
									cfg.value = Ext.isEmpty(recData[item.code
											+ strPostFix]) ? "" : ""
											+ recData[item.code + strPostFix];
								}
								arrJsonFields.push(cfg);
							});
						}
						if (key === 'myProductMultiSet'
								|| key === 'bankProductMultiSet'
								|| key === 'clientMultiSet') {
							retJson.d.paymentEntry.enrichments[key] = recData[key]/*
																					 * [ {
																					 * 'dirtyRow' :
																					 * false,
																					 * 'parameters' :
																					 * arrJsonFields }]
																					 */;

						} else if (arrJsonFields.length > 0) {
							retJson.d.paymentEntry.enrichments[key] = {
								parameters : arrJsonFields
							};
						}
					}
				});
			}
		}
		retJson.d.__metadata = recData['__metadata'];
		retJson.d.__metadata._headerId = strIdentifier;
		return {
			jsonPost : retJson,
			txnReference : strTxnReference
		};
	},
	getEnrichPostFixString : function(enrichType) {
		var strPostFix = '';
		switch (enrichType) {
			case 'udeEnrichment' :
				strPostFix = '_enrichUDEField';
				break;
			case 'productEnrichment' :
				strPostFix = '_enrichPRDField';
				break;
			case 'productEnrichmentStdFields' :
				strPostFix = '_enrichPRDSTDField';
				break;
			case 'myproductEnrichment' :
				strPostFix = '_enrichMYPField';
				break;
			case 'myproductEnrichmentStdFields' :
				strPostFix = '_enrichMYPSTDField';
				break;
			case 'clientEnrichment' :
				strPostFix = '_enrichCLIField';
				break;
			case 'clientEnrichmentStdFields' :
				strPostFix = '_enrichCLISTDField';
				break;
			case 'myProductMultiSet' :
				strPostFix = '_enrichMYPMSField';
				break;
			case 'bankProductMultiSet' :
				strPostFix = '_enrichBNPMSField';
				break;
			case 'clientMultiSet' :
				strPostFix = '_enrichCLIMSField';
				break;
		}
		return strPostFix;
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
						if (strFldName === 'drawerAccountNo_stdField'
								&& strLayoutType === 'ACCTRFLAYOUT') {
							field = me.createSuggestionBox(strFldName,
									defValue, {
										seekId : 'clientAccountSeek',
										rootNode : 'd.preferences',
										col1Node : 'CODE',
										col2Node : 'DESCRIPTION'
									}, blnReadOnly);

							field.generateUrl = function(strQuery) {
								var strUrl = 'services/userseek/clientAccountSeek.json?$filtercode1={0}';
								if (!Ext.isEmpty(strQuery))
									strUrl += '&$autofilter=' + strQuery;
								var strParam = '';
								return Ext.String.format(strUrl,
										me.strHeaderAccountNo);
							};
							field.on('render', function(c) {
										c.store.load()
									});
							field.forceSelection = true;
						}
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
	getEnrichmentFieldTextEditor : function(strEnrichId, item) {
		var me = this;
		var objEditor = null, displayType = 0, strValue = null;;
		if (!Ext.isEmpty(item.displayType))
			displayType = item.displayType;
		switch (displayType) {
			case 1 : // TEXTAREA
				// TODO : Not supported
				break;
			case 2 : // AMOUNTBOX
				objEditor = me.createAmountField(strEnrichId, item.value,
						item.maxLength, false);
				break;
			case 3 : // NUMBERBOX
				objEditor = me.createNumberField(strEnrichId, item.value,
						item.maxLength, false);
				break;
			case 11 :
			case 4 : // COMBOBOX
				var arrValues = new Array();
				if (item.lookupValues)
					arrValues.push({
								code : '',
								description : getLabel('emptyTextForCombo',
										'Select')
							});
				for (var i = 0; i < item.lookupValues.length; i++) {
					arrValues.push({
								code : item.lookupValues[i].key,
								description : item.lookupValues[i].value
							});
				}
				strValue = !Ext.isEmpty(item.defaultValue)
						? item.defaultValue
						: item.value;
				objEditor = me.createComboField(strEnrichId, strValue,
						arrValues, false);
				objEditor.store.on('load', function() {
							objEditor.setValue(strValue);
						});

				break;
			case 5 : // SELECTBOX
				// TODO : Not supported
				break;
			case 6 : // DATEBOX
				objEditor = me.createDateField(strEnrichId, item.maxLength,
						true);
				break;
			case 7 : // TIMEBOX
				break;
			case 8 : // SEEKBOX
				// field = createSeekBox(cfg.code,
				// cfg.code, null, cfg.maxLength,
				// 'services/recieverseek.json?&$top=-1',
				// 'd.receivers',
				// 'receiverCode', 'receiverName');
				// field.addClass('w14 ml12');
				break;
			case 10 :
				objEditor = me.createCheckboxField(strEnrichId,
						!isEmpty(item.value) ? item.value : 'Y');
				break;
			case 0 : // TEXTBOX
			default :
				objEditor = me.createTextField(strEnrichId, item.value,
						item.maxLength, false);
				break;
		}
		return objEditor;
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
			minValue : 0.00,
			hideTrigger : true,
			value : defValue ? defValue : '',
			defValue : defValue ? defValue : '',
			focusable : true,
			allowExponential : false,
			spinUpEnabled : false,
			spinDownEnabled : false,
			enableKeyEvents : true,
			handleMouseEvents : true,
			decimalPrecision : 2,
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
			},
			setValue : function(v) {
				v = typeof v == 'number' ? v : String(v).replace(
						this.decimalSeparator, ".");
				v = isNaN(v) ? '' : String(v).replace(".",
						this.decimalSeparator);
				v = isNaN(v) ? '' : this.fixPrecision(String(v).replace(".",
						this.decimalSeparator));
				var retValue = (v === 0
						? 0
						: Ext.form.NumberField.superclass.setRawValue.call(
								this, v));
				if (Ext.isEmpty(retValue))
					retValue = 0;
				this.setRawValue(retValue.toFixed(2));
				return retValue;
			},
			getCaretPosition : function() {
				var el = this.inputEl.dom;
				if (typeof(el.selectionStart) === "number") {
					return el.selectionStart;
				} else if (document.selection && el.createTextRange) {
					var range = document.selection.createRange();
					range.collapse(true);
					range.moveStart("character", -el.value.length);
					return range.text.length;
				} else {
					// throw 'getCaretPosition() not supported';
				}
			},
			listeners : {
				'keyup' : function(field, e, eOpts) {
					var strSub = null;
					var strValue = field.getRawValue();
					if ((e.keyCode === 46 || e.keyCode === 8)
							&& strValue.length > (field.maxLength
									- field.decimalPrecision - 1)
							&& strValue.indexOf('.') === -1)
						field.setValue(strValue.substr(0, (field.maxLength
										- field.decimalPrecision - 1)));
				},
				'keydown' : function(field, e, eOpts) {
					var strSub = null;
					var strValue = field.getRawValue();
					if (e.getKey() === 110 || e.getKey() === 190) {
						if (!Ext.isEmpty(strValue)) {
							if (field.getCaretPosition() === 0)
								e.stopEvent();
							else if (strValue.indexOf('.') === 0
									|| strValue.length === field.maxLength - 1)
								e.stopEvent();
							else if (strValue.indexOf('.') > -1)
								e.stopEvent();
							else {
								strSub = strValue.substr(field
												.getCaretPosition(),
										strValue.length);
								if (!Ext.isEmpty(strSub)
										&& strSub.length > field.decimalPrecision)
									e.stopEvent();
							}
						} else
							e.stopEvent();
					} else {
						if ((e.keyCode >= 48 && e.keyCode <= 57)
								|| (e.keyCode >= 96 && e.keyCode <= 105)
								|| (e.keyCode >= 35 && e.keyCode <= 40)) {

							if (strValue.indexOf('.') === -1
									&& strValue.length >= (field.maxLength
											- field.decimalPrecision - 1))
								e.stopEvent();
							else if (!Ext.isEmpty(strValue)
									&& strValue.indexOf('.') > -1
									&& ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105))) {
								strSub = strValue.substr(strValue.indexOf('.')
												+ 1, strValue.length);
								if (!Ext.isEmpty(strSub)
										&& strSub.length >= field.decimalPrecision
										&& field.getCaretPosition() > strValue
												.indexOf('.'))
									e.stopEvent();
							}

						}

					}
				},
				'render' : function(cmp, e) {
					cmp.getEl().on('mousedown', function(ev) {
								ev.preventDefault();
								cmp.focus(true);

							})
				},
				'focus' : function(field, e, eOpts) {
					e.stopEvent();
					field.focus(true);
				}
			}
		};
		fieldCfg.maxLength = 11;// e.g 123456789.12
		if (strLayoutType === 'WIRELAYOUT')
			fieldCfg.maxLength = 16;
		fieldCfg.enforceMaxLength = true;
		var field = Ext.create('Ext.form.field.Number', fieldCfg);
		return field;
	},
	createNumberField : function(fieldId, defValue, intMaxLength, isReadOnly) {
		var fieldCfg = {
			fieldCls : 'xn-valign-middle grid-field',
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
					fieldCls : 'xn-valign-middle grid-field',
					allowBlank : true,
					itemId : fieldId,
					name : fieldId,
					focusable : true,
					cls : 'ext-datepicker',
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
		var strDisplayField, strValueField;
		if (optionsValue && optionsValue.length > 0) {
			objStore = Ext.create('Ext.data.Store', {
						fields : ['code', 'description'],
						autoLoad : true,
						disabled : isReadOnly,
						data : optionsValue && optionsValue.length > 0 ? [{
							'code' : '',
							'description' : getLabel('emptyTextForCombo',
									'Select')
						}].concat(optionsValue) : []
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
					emptyText : getLabel('emptyTextForCombo', 'Select')
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
		if (!Ext.isEmpty(strIdentifier)) {
			// var tempUrl = _mapUrl['gridLayoutDataUrl_dummy'];
			var tempUrl = _mapUrl['gridLayoutDataUrl'];
			if (!Ext.isEmpty(sorter)) {
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
				var pattern = new RegExp(/^.*(_stdField|_regBeneField|_addRefInfo|_addBankInfo|_regOrderingPartyField|_enrichUDEField|_enrichPRDField|_enrichMYPField|_enrichCLIField|_enrichMYPMSField|_enrichBNPMSField|_enrichCLIMSField)$/);
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
		var me = this;
		var strQuickFilterUrl = '', strAdvancedFilterUrl = '', strUrl = '', isFilterApplied = false;
		var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
				? subGroupInfo.groupQuery
				: '';
		if (me.filterApplied === 'ALL') {
			strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
			if (!Ext.isEmpty(strQuickFilterUrl)) {
				strUrl += '&$filter=' + strQuickFilterUrl;
				isFilterApplied = true;
			}
		} else {
			strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
			if (!Ext.isEmpty(strQuickFilterUrl)) {
				strUrl += '&$filter=' + strQuickFilterUrl;
				isFilterApplied = true;
			}
			strAdvancedFilterUrl = me
					.generateUrlWithAdvancedFilterParams(isFilterApplied);
			if (!Ext.isEmpty(strAdvancedFilterUrl)) {
				if (Ext.isEmpty(strUrl)) {
					strUrl = "&$filter=";
				}
				strUrl += strAdvancedFilterUrl;
				isFilterApplied = true;
			}
		}

		if (!Ext.isEmpty(strGroupQuery)) {
			if (!Ext.isEmpty(strUrl))
				strUrl += ' and ' + strGroupQuery;
			else
				strUrl += '&$filter=' + strGroupQuery;
		}
		return strUrl;
	},
	generateUrlWithQuickFilterParams : function() {
		var me = this;
		var filterData = me.filterData;
		var isFilterApplied = false;
		var strFilter = '';
		var strTemp = '';
		var strFilterParam = '';
		for (var index = 0; index < filterData.length; index++) {
			if (isFilterApplied)
				strTemp = strTemp + ' and ';

			switch (filterData[index].operatorValue) {
				case 'bt' :

					if (filterData[index].dataType === 'D') {

						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' '
								+ 'date\'' + filterData[index].paramValue1
								+ '\'' + ' and ' + 'date\''
								+ filterData[index].paramValue2 + '\'';
					} else {
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' ' + '\''
								+ filterData[index].paramValue1 + '\''
								+ ' and ' + '\''
								+ filterData[index].paramValue2 + '\'';
					}
					break;
				default :
					// Default opertator is eq
					if (filterData[index].dataType === 'D') {

						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' '
								+ 'date\'' + filterData[index].paramValue1
								+ '\'';
					} else {

						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' ' + '\''
								+ filterData[index].paramValue1 + '\'';
					}
					break;
			}
			isFilterApplied = true;
		}
		if (isFilterApplied)
			strFilter = strFilter + strTemp;
		else
			strFilter = '';
		return strFilter;
	},
	generateUrlWithAdvancedFilterParams : function(blnFilterApplied) {
		var me = this;
		var filterData = me.advFilterData;
		var quickFilterData = me.filterData;
		var isFilterApplied = blnFilterApplied;
		var isOrderByApplied = false;
		var strFilter = '';
		var strTemp = '';
		var strFilterParam = '';
		var operator = '';
		var isInCondition = false;
		var isDuplicate = false;

		if (!Ext.isEmpty(filterData)) {
			for (var index = 0; index < filterData.length; index++) {
				isDuplicate = false;
				for (var index1 = 0; index1 < quickFilterData.length; index1++) {
					if (filterData[index].field === quickFilterData[index1].paramName)
						isDuplicate = true;
				}
				if (!isDuplicate) {
					isInCondition = false;
					operator = filterData[index].operator;
					if (isFilterApplied
							&& (operator === 'bt' || operator === 'lk'
									|| operator === 'gt' || operator === 'lt')) {
						strTemp = strTemp + ' and ';
					}

					switch (operator) {
						case 'bt' :
							isFilterApplied = true;
							if (filterData[index].dataType === 1) {
								strTemp = strTemp + filterData[index].field
										+ ' ' + filterData[index].operator
										+ ' ' + 'date\''
										+ filterData[index].value1 + '\''
										+ ' and ' + 'date\''
										+ filterData[index].value2 + '\'';
							} else {
								strTemp = strTemp + filterData[index].field
										+ ' ' + filterData[index].operator
										+ ' ' + '\'' + filterData[index].value1
										+ '\'' + ' and ' + '\''
										+ filterData[index].value2 + '\'';
							}
							break;
						case 'st' :
							if (!isOrderByApplied) {
								strTemp = strTemp + ' &$orderby=';
								isOrderByApplied = true;
								isFilterApplied = true;
							} else {
								strTemp = strTemp + ',';
							}
							strTemp = strTemp + filterData[index].value1 + ' '
									+ filterData[index].value2;
							break;
						case 'lk' :
							isFilterApplied = true;
							strTemp = strTemp + filterData[index].field + ' '
									+ filterData[index].operator + ' ' + '\''
									+ filterData[index].value1 + '\'';
							break;
						case 'eq' :
							isInCondition = me.isInCondition(filterData[index]);
							if (isInCondition) {
								var reg = new RegExp(/[\(\)]/g);
								var objValue = filterData[index].value1;
								if (objValue != 'All') {
									if (isFilterApplied) {
										strTemp = strTemp + ' and ';
									} else {
										isFilterApplied = true;
									}

									strTemp = strTemp + filterData[index].field
											+ ' ' + filterData[index].operator
											+ ' ' + '\'' + objValue + '\'';
								}
								isFilterApplied = true;
							}
							break;
						case 'gt' :
						case 'lt' :
							isFilterApplied = true;
							if (filterData[index].dataType === 1) {
								strTemp = strTemp + filterData[index].field
										+ ' ' + filterData[index].operator
										+ ' ' + 'date\''
										+ filterData[index].value1 + '\'';
							} else {
								strTemp = strTemp + filterData[index].field
										+ ' ' + filterData[index].operator
										+ ' ' + '\'' + filterData[index].value1
										+ '\'';
							}
							break;
						case 'in' :
							var reg = new RegExp(/[\(\)]/g);
							var objValue = filterData[index].value1;
							// objValue = objValue.replace(reg, '');
							var objArray = objValue.split(',');
							if (objArray.length > 0) {
								if (objArray[0] != 'All') {
									if (isFilterApplied) {
										strTemp = strTemp + ' and ';
									} else {
										isFilterApplied = true;
									}

									strTemp = strTemp + '(';
									for (var i = 0; i < objArray.length; i++) {
										strTemp = strTemp
												+ filterData[index].field
												+ ' eq ';
										strTemp = strTemp + '\'' + objArray[i]
												+ '\'';
										if (i != objArray.length - 1)
											strTemp = strTemp + ' or ';
									}
									strTemp = strTemp + ')';
								}
							}
							break;
					}
				}
			}
		}
		if (isFilterApplied) {
			strFilter = strFilter + strTemp;
		} else if (isOrderByApplied)
			strFilter = strTemp;
		else
			strFilter = '';

		return strFilter;
	},
	isInCondition : function(data) {
		var retValue = false;
		var reg = new RegExp(/^\((\d\d*,)*\d\d*\)$/);
		var displayType = data.displayType;
		var strValue = data.value1;
		if (displayType
				&& (displayType === 4 || displayType === 3 || displayType === 5
						|| displayType === 12 || displayType === 13 || displayType === 6)
				&& strValue) {
			retValue = true;
		}
		return retValue;
	},
	loadGridData : function(strFilterUrl) {
		var me = this;
		var grid = me.getGrid();
		if (grid) {
			if (!Ext.isEmpty(strIdentifier)) {
				// var tempUrl = _mapUrl['gridLayoutDataUrl_dummy'];
				var tempUrl = _mapUrl['gridLayoutDataUrl'];
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
			method : 'POST',
			params : { '$identifier' : strIdentifier },
			success : function(response) {
				var data = Ext.decode(response.responseText);
				if (data && data.d && data.d.instruments) {
					var arrInst = data.d.instruments;
					var arrData = new Array(), instJson = null, cfgInst = null, jsonRow = null, hasError = false, isPaymentInfoUpdated = false, strHdrEnteredNo = '';
					for (var i = 0; i < arrInst.length; i++) {
						cfgInst = arrInst[i];
						instJson = {
							d : {
								paymentEntry : {
									standardField : cfgInst.standardField,
									beneficiary : cfgInst.beneficiary,
									paymentFIInfo : cfgInst.paymentFIInfo,
									paymentCompanyInfo : cfgInst.paymentCompanyInfo,
									paymentHeaderInfo : cfgInst.paymentHeaderInfo,
									paymentMetaData : cfgInst.paymentMetaData
								},
								__metadata : cfgInst.paymentMetaData
							}
						}
						if (cfgInst.enrichments)
							instJson.d.paymentEntry.enrichments = cfgInst.enrichments;
						if (cfgInst.additionalInfo)
							instJson.d.paymentEntry.additionalInfo = cfgInst.additionalInfo;
						hasError = false;
						if (cfgInst.message
								&& cfgInst.message.success === 'SAVEWITHERROR') {
							hasError = true;
							instJson.d.paymentEntry.message = cfgInst.message
									|| [];
						}
						jsonRow = me.createGridPreRequisites(instJson, true);
						if (jsonRow) {
							jsonRow.hasError = hasError;
							// UNITTEST : Remove comment
							// jsonRow.hasError = true;
							arrData.push(jsonRow);
						}
						if (!isPaymentInfoUpdated) {
							strHdrEnteredNo = 0;// me.updatePaymentInfo(instJson);
							isPaymentInfoUpdated = true;
						}
					}
					if (arrInst.length <= 0)
						strHdrEnteredNo = 0;// me.updatePaymentInfo(null);

				}
				if (arrData && data && data.d) {
					data.d.instruments = arrData;
					grid.store.loadRawData(data);
				}
				groupView.handleGroupActionsVisibility(me.strDefaultMask);
				if (groupView) {
					groupView.setLoading(false);
					me.isLoadingIndicatorOn = false;
					if (arrData
							&& arrData.length === 0
							&& me.charEditable === 'Y'
							&& !me.isViewOnly
							&& (jQuery.isNumeric(strHdrEnteredNo) && jQuery
									.isNumeric(strHdrEnteredNo) <= 0)) {
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
	validateTotalNumberOfInstrument : function(blnShowPopup) {
		var me = this, intGridRecordCount, retBln = true, intEmptyRec = 0;
		var grid = me.getGrid();
		if (grid) {
			intGridRecordCount = grid.store.getCount()
					- me.getEmptyRecordCount();
			retBln = validateInstrumentCount(intGridRecordCount, blnShowPopup);
		}
		return retBln;
	},
	setReceiverDefValue : function(combo, records) {
		var me = this, data = null, grid, col, colEditorField;
		if (!Ext.isEmpty(records))
			data = records[0].data || {};
		grid = me.getGrid();
		if (grid && grid.rowEditor) {
			rowEditor = grid.rowEditor;
			record = grid.rowEditor.context && grid.rowEditor.context.record
					? grid.rowEditor.context.record
					: null;
			if (record) {
				record.set('drawerDescription_regBeneField', data.receiverName
								|| '');
				record.set('beneficiaryBankIDType_regBeneField', data.bankType
								|| '');
				record.set('beneficiaryBankIDCode_regBeneField', data.bankCode
								|| '');
				record.set('beneficiaryBranchDescription_regBeneField',
						data.branchName || '');
				record.set('drawerBranchCode_regBeneField', data.branchCode
								|| '');
				record.set('drawerAccountNo_regBeneField', data.accountNumber
								|| '');
				record.set('beneAccountType_regBeneField', data.accountType
								|| '');

				col = grid
						.down('gridcolumn[itemId="col_drawerCode_regBeneField"]');
				if (!Ext.isEmpty(col))
					colEditorField = col.getEditor();
				/*
				 * if (!Ext.isEmpty(colEditorField))
				 * colEditorField.setRawValue(data.receiverName || '');
				 */
				record.set('drawerCode_regBeneField', data.receiverCode || '');
				record.set('drawerRegistedFlag', 'R');
			}
		}
		doClearMessageSection();
		me.toggleReadonlyFieldsForReceiver(data, true, record
						.get('drawerRegistedFlag') === 'R');
	},

	resetReceiverDefValue : function(combo, strCurrentValue, strNewValue) {
		var me = this, data = null, grid, col, colEditorField, strRecValue = '';
		grid = me.getGrid();
		if (!Ext.isEmpty(grid))
			col = grid.down('gridcolumn[itemId="col_receiverID_regBeneField"]');
		if (!Ext.isEmpty(col))
			colEditorField = col.getEditor();
		strRecValue = strCurrentValue;
		if (grid && grid.rowEditor) {
			rowEditor = grid.rowEditor;
			record = grid.rowEditor.context && grid.rowEditor.context.record
					? grid.rowEditor.context.record
					: null;
			if (record) {
				var isReadonly = record.get('isAdhocAllowed') === false
						? true
						: false;
				me.toggleReadonlyFieldsForReceiver(null, isReadonly, record
								.get('drawerRegistedFlag') === 'R');
				/*
				 * if (!Ext.isEmpty(colEditorField))
				 * colEditorField.setValue('');
				 */
				record.set('drawerDescription_regBeneField', strRecValue || '');
				record.set('beneficiaryBankIDType_regBeneField', '');
				record.set('beneficiaryBankIDCode_regBeneField', '');
				record.set('beneficiaryBranchDescription_regBeneField', '');
				record.set('drawerBranchCode_regBeneField', '');
				record.set('drawerRegistedFlag', 'A');
				record.set('drawerAccountNo_regBeneField', '');
				record.set('drawerCode_regBeneField', strRecValue || '');
			}
		}
	},
	applyReceiverValidation : function() {
		var me = this, data = null, grid, col, colEditorField, strRecValue = '';
		grid = me.getGrid();
		if (grid && grid.rowEditor) {
			rowEditor = grid.rowEditor;
			record = grid.rowEditor.context && grid.rowEditor.context.record
					? grid.rowEditor.context.record
					: null;
			if (record) {
				if (record.get('isAdhocAllowed') === false
						&& record.get('drawerRegistedFlag') === 'A') {
					strRecValue = '';
					doClearMessageSection();
					var arrError = [];
					arrError.push({
								"errorCode" : "WARNING",
								"errorMessage" : getLabel(
										'advocReceiverWarnMsg',
										'Adhoc receiver not allowed!')
							});
					paintErrors(arrError);
					col = grid
							.down('gridcolumn[itemId="col_drawerCode_regBeneField"]');
					if (!Ext.isEmpty(col) && col.getEditor()) {
						colEditorField = col.getEditor();
						colEditorField.suspendEvents();
						colEditorField.setValue('');
						colEditorField.resumeEvents();
						colEditorField.focus();
					}
					record.set('drawerCode_regBeneField', '');
					record.set('drawerDescription_regBeneField', '');
				}
			}
		}
	},

	setBankBranchDetail : function(combo, records) {
		var me = this, data = null, grid, col, colEditorField;
		if (!Ext.isEmpty(records))
			data = records[0].data || {};
		grid = me.getGrid();
		if (grid && grid.rowEditor) {
			rowEditor = grid.rowEditor;
			record = grid.rowEditor.context && grid.rowEditor.context.record
					? grid.rowEditor.context.record
					: null;
			if (record) {
				record.set('beneficiaryBranchDescription_regBeneField',
						data.BRANCHDESCRIPTION || '');
				record.set('drawerBranchCode_regBeneField', data.BRANCHCODE
								|| '');
				record.set('beneficiaryAdhocbankFlag', 'N');
			}
		}
		me.toggleReadonlyFieldsForBankBranchDetail(data, true);
	},
	resetBankBranchDetail : function(combo, strCurrentValue, strNewValue) {
		var me = this, grid, col, colEditorField;
		grid = me.getGrid();
		me.toggleReadonlyFieldsForBankBranchDetail(null, false);
		if (grid && grid.rowEditor) {
			rowEditor = grid.rowEditor;
			record = grid.rowEditor.context && grid.rowEditor.context.record
					? grid.rowEditor.context.record
					: null;
			if (record) {
				record.set('beneficiaryBranchDescription_regBeneField', '');
				record.set('drawerBranchCode_regBeneField', '');
				record.set('beneficiaryAdhocbankFlag', 'Y');
			}
		}
	},

	isValidRoutingNo : function() {
		var me = this, grid, col, colEditorField;
		grid = me.getGrid();
		var strBankIdType = null, strBankID = null, strValidationFlag = null, arrError = new Array(), strLabel = '';

		col = grid
				.down('gridcolumn[itemId="col_beneficiaryBankIDType_regBeneField"]');
		if (!Ext.isEmpty(col))
			colEditorField = col.getEditor();

		strBankIdType = colEditorField
				&& !Ext.isEmpty(colEditorField.getValue()) ? colEditorField
				.getValue() : '';

		if (strLayoutType === 'ACHLAYOUT' || strLayoutType === 'MIXEDLAYOUT')
			strBankIdType = 'FED';

		colEditorField = null;
		col = grid
				.down('gridcolumn[itemId="col_beneficiaryBankIDCode_regBeneField"]');
		if (!Ext.isEmpty(col))
			colEditorField = col.getEditor();

		strBankID = colEditorField && !Ext.isEmpty(colEditorField.getValue())
				? colEditorField.getValue()
				: '';

		var maxLength, mapMaxLength = {
			'FED' : 9,
			'BIC' : 11,
			'ACH' : 6,
			'IBAN' : 34,
			'DEFAULT' : 35
		};
		maxLength = mapMaxLength[strBankIdType] || mapMaxLength['DEFAULT'];
		/*
		 * $('input[name="' + colEditorField.itemId + '"]').attr('maxlength',
		 * maxLength);
		 */
		doClearMessageSection();
		if (!isEmpty(strBankID)) {
			switch (strBankIdType) {
				case 'FED' :
					strValidationFlag = isValidFedAba(strBankID);
					if (false === strValidationFlag)
						arrError.push({
									"errorCode" : "FED",
									"errorMessage" : getLabel(
											'abaRoutingNoValidationFailed',
											'ABA Routing number validation failed')
								});

					break;
				case 'BIC' :
					strValidationFlag = isValidBIC(strBankID);
					if (false === strValidationFlag)
						arrError.push({
									"errorCode" : "BIC",
									"errorMessage" : getLabel(
											'bicRoutingNoValidationFailed',
											'BIC Routing number validation failed')
								});
					break;
				case 'ACH' :
					strValidationFlag = isValidCHIPSUID(strBankID);
					if (false === strValidationFlag)
						arrError.push({
							"errorCode" : "ACH",
							"errorMessage" : getLabel(
									'uidRoutingNoValidationFailed',
									'CHIPS UID Routing number validation failed')
						});
					break;
				default :
					break;
			}
			if (strBankID.length > (mapMaxLength[strBankIdType] || mapMaxLength['DEFAULT'])) {
				strValidationFlag = false;
				arrError = [];
				if (strLayoutType === 'WIRELAYOUT'
						|| strLayoutType === 'ACHIATLAYOUT')
					strLabel = getLabel('beneficiaryBankIDCode_WIRELAYOUT',
							'Identifier');
				else
					strLabel = getLabel('beneficiaryBankIDCode', 'Routing Number');
				arrError.push({
					"errorCode" : "ERR",
					"errorMessage" : Ext.String
							.format(
									'"{0}" field length can not be greater than {1}',
									strLabel,
									(mapMaxLength[strBankIdType] || mapMaxLength['DEFAULT']))
				});
			}
		}

		if (strValidationFlag === false) {
			paintErrors(arrError);
			colEditorField.focus(true);
			me.scrollToTop();
		} else if (strValidationFlag === true) {
			doClearMessageSection();
		}

		return strValidationFlag;
	},
	scrollToTop : function() {
		$("html, body").animate({
					scrollTop : 0
				}, "slow");
	},
	toggleReadonlyFieldsForBankBranchDetail : function(objData, isReadonly,
			canClear) {
		var me = this, data = objData || {}, grid, col, colEditorField;
		grid = me.getGrid();
		if (!Ext.isEmpty(grid)) {
			col = grid
					.down('gridcolumn[itemId="col_beneficiaryBranchDescription_regBeneField"]');
			if (!Ext.isEmpty(col)) {
				colEditorField = col.getEditor();
				if (!Ext.isEmpty(colEditorField)) {
					colEditorField.setDisabled(isReadonly);
					// me.toggleReadonlyCss(colEditorField,isReadonly);
					colEditorField.suspendEvents();
					colEditorField.setValue(data.BRANCHDESCRIPTION || '');
					colEditorField.resumeEvents();
				}
			}
			col = grid
					.down('gridcolumn[itemId="col_drawerBranchCode_regBeneField"]');
			if (!Ext.isEmpty(col)) {
				colEditorField = col.getEditor();
				if (!Ext.isEmpty(colEditorField)) {
					colEditorField.setDisabled(isReadonly);
					// me.toggleReadonlyCss(colEditorField,isReadonly);
					colEditorField.suspendEvents();
					colEditorField.setValue(data.BRANCHCODE || '');
					colEditorField.resumeEvents();
				}
			}
		}
	},

	toggleReadonlyCss : function(field, isReadOnly) {
		if (isReadOnly === true)
			field.addClass('form-control');
		else
			field.removeClass('form-control');
	},

	toggleReadonlyFieldsForReceiver : function(objData, blnReadOnly, canClear) {
		var me = this, data = objData || {}, grid, col, colEditorField, blnClear = !Ext
				.isEmpty(canClear) ? canClear : true;
		// Note : For multiwire these fields are always readonly
		var isReadonly = true;
		grid = me.getGrid();
		if (!Ext.isEmpty(grid)) {
			col = grid.down('gridcolumn[itemId="col_receiverID_regBeneField"]');
			if (!Ext.isEmpty(col)) {
				colEditorField = col.getEditor();
				if (!Ext.isEmpty(colEditorField) && blnClear)
					colEditorField.setValue(data.receiverCode || '');
			}

			col = grid
					.down('gridcolumn[itemId="col_beneficiaryBankIDType_regBeneField"]');
			if (!Ext.isEmpty(col)) {
				colEditorField = col.getEditor();
				if (!Ext.isEmpty(colEditorField)) {
					colEditorField.setDisabled(isReadonly);
					// me.toggleReadonlyCss(colEditorField,isReadonly);
					colEditorField.suspendEvents();
					if (blnClear)
						colEditorField.setValue(data.bankType || '');
					colEditorField.resumeEvents();
				}
			}

			col = grid
					.down('gridcolumn[itemId="col_beneficiaryBankIDCode_regBeneField"]');
			if (!Ext.isEmpty(col)) {
				colEditorField = col.getEditor();
				if (!Ext.isEmpty(colEditorField)) {
					colEditorField.setDisabled(isReadonly);
					// //me.toggleReadonlyCss(colEditorField,isReadonly);
					colEditorField.suspendEvents();
					if (blnClear)
						colEditorField.setValue(data.bankCode || '');
					colEditorField.resumeEvents();
				}
			}

			col = grid
					.down('gridcolumn[itemId="col_beneficiaryBranchDescription_regBeneField"]');
			if (!Ext.isEmpty(col)) {
				colEditorField = col.getEditor();
				if (!Ext.isEmpty(colEditorField)) {
					colEditorField.setDisabled(isReadonly);
					colEditorField.suspendEvents();
					if (blnClear)
						colEditorField.setValue(data.branchName || '');
					colEditorField.resumeEvents();
				}
			}
			col = grid
					.down('gridcolumn[itemId="col_drawerBranchCode_regBeneField"]');
			if (!Ext.isEmpty(col)) {
				colEditorField = col.getEditor();
				if (!Ext.isEmpty(colEditorField)) {
					colEditorField.setDisabled(isReadonly);
					colEditorField.suspendEvents();
					if (blnClear)
						colEditorField.setValue(data.branchCode || '');
					colEditorField.resumeEvents();
				}
			}
			col = grid
					.down('gridcolumn[itemId="col_drawerAccountNo_regBeneField"]');
			if (!Ext.isEmpty(col)) {
				colEditorField = col.getEditor();
				if (!Ext.isEmpty(colEditorField)) {
					colEditorField.setDisabled(isReadonly);
					colEditorField.suspendEvents();
					if (blnClear) {
						if (!Ext.isEmpty(data.accountNumber))
							colEditorField.setValue(data.accountNumber);
						else
							colEditorField.setValue('');
					}
					colEditorField.resumeEvents();
				}
			}
			col = grid
					.down('gridcolumn[itemId="col_beneAccountType_regBeneField"]');
			if (!Ext.isEmpty(col)) {
				colEditorField = col.getEditor();
				if (!Ext.isEmpty(colEditorField)) {
					colEditorField.setDisabled(isReadonly);
					colEditorField.suspendEvents();
					if (blnClear) {
						if (!Ext.isEmpty(data.accountType))
							colEditorField.setValue(data.accountType);
						else {
							colEditorField.setValue('');
							/*
							 * colEditorField.select(colEditorField.getStore()
							 * .getAt(0));
							 */
						}
					}
					colEditorField.resumeEvents();
				}
			}
		}
	},
	setOrderingPartyDefValue : function(combo, records) {
		var me = this, data = null, grid, col, colEditorField;
		if (!Ext.isEmpty(records))
			data = records[0].data || {};
		grid = me.getGrid();
		if (grid && grid.rowEditor) {
			rowEditor = grid.rowEditor;
			record = grid.rowEditor.context && grid.rowEditor.context.record
					? grid.rowEditor.context.record
					: null;
			if (record) {
				record.set('orderingPartyDescription_regOrderingPartyField',
						data.description || '');

				col = grid
						.down('gridcolumn[itemId="col_orderingParty_regOrderingPartyField"]');
				if (!Ext.isEmpty(col))
					colEditorField = col.getEditor();
				/*
				 * if (!Ext.isEmpty(colEditorField))
				 * colEditorField.setRawValue(data.receiverName || '');
				 */
				record.set('orderingParty_regOrderingPartyField', data.code
								|| '');
			}
		}
	},
	toggleHoldUntilDate : function(strValue, record) {
		var me = this, data = null, grid, col, colEditorField, strSelectedValue = null;
		grid = me.getGrid();

		strSelectedValue = !Ext.isEmpty(strValue) ? strValue : (record
				&& record.data ? record.data.txnType_stdField : '');
		if (!Ext.isEmpty(grid))
			col = grid.down('gridcolumn[itemId="col_holdUntil_stdField"]');
		if (!Ext.isEmpty(col))
			colEditorField = col.getEditor();
		if (!Ext.isEmpty(colEditorField)) {
			if (strSelectedValue === '3')
				colEditorField.setDisabled(false);
			else {
				colEditorField.setDisabled(true);
				colEditorField.setValue('');
			}
		}
	},
	isCurrencyMissMatch : function(record, editor, grid, context) {
		var me = this;
		var strBuyerCcy = me.getBuyerCcyForInstrument();
		var strSellerCcy = record.get('txnCurrency_stdField');
		var data = record.get('__metadata') || {};
		var isRecordEdit = !Ext.isEmpty(data._detailId);

		var isForexAtInst = true, retvalue = false;

		if (!isEmpty(strBuyerCcy) && !isEmpty(strSellerCcy)
				&& (strBuyerCcy != strSellerCcy) && isForexAtInst
				&& isRecordEdit)
			retvalue = true;
		return retvalue;
	},
	getBuyerCcyForInstrument : function() {
		var regExp = /\(([^)]+)\)$/;
		var matches = null, strBuyerCcy = null;
		var strAccount = $('#accountNoHdr :selected').text();
		if (strAccount) {
			matches = regExp.exec(strAccount)
			if (matches && matches[0]) {
				strBuyerCcy = matches[0].replace(/[()]/g, '');
			}
		}
		return strBuyerCcy;
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
			colHeader : me.isViewOnly === false && me.charEditable === 'Y' ?  getLabel('actions', 'Actions') +'&nbsp;&nbsp;<i class="fa fa-info-circle" style="cursor:pointer" title="To enable below Action buttons, click on Save Records." onclick=""></i>' : getLabel('actions', 'Actions'),
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
			var maskArray = new Array();
			var actionMask = '';
			var rightsMap = record.data.__metadata.__rightsMap;
			var buttonMask = '';
			var bitPosition = '';
			if (!Ext.isEmpty(maskPosition)) {
				bitPosition = parseInt(maskPosition,10) - 1;
			}
			if (!Ext.isEmpty(jsonData)
					&& !Ext.isEmpty(jsonData.d.__metadata._buttonMask))
				buttonMask = jsonData.d.__metadata._buttonMask;
			maskArray.push(buttonMask);
			maskArray.push(rightsMap);
			actionMask = doAndOperation(maskArray, me.intMaskSize);
			if (Ext.isEmpty(bitPosition))
				return retValue;
			retValue = isActionEnabled(actionMask, bitPosition);
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
		var blnAuthInstLevel = false;
		var maskArray = new Array(), actionMask = '', objData = null;
		if (!Ext.isEmpty(jsonData)
				&& !Ext.isEmpty(jsonData.d.__metadata._buttonMask))
			buttonMask = jsonData.d.__metadata._buttonMask;

		maskArray.push(buttonMask);
		for (var index = 0; index < arrSelectedRecords.length; index++) {
			objData = arrSelectedRecords[index];
			if (objData.get('authLevel') === 0
					&& objData.get('paymentType') !== 'QUICKPAY')
				blnAuthInstLevel = true;
			maskArray.push(objData.get('__metadata').__rightsMap);
		}
		if (blnAuthInstLevel) {
			buttonMask = me.replaceCharAtIndex(5, '0', buttonMask);
			maskArray.push(buttonMask);
		}
		actionMask = doAndOperation(maskArray, me.intMaskSize);
		// actionMask = '111111111111111111';
		objGroupView.handleGroupActionsVisibility(actionMask);
	},
	handleRowIconClick : function(tableView, rowIndex, columnIndex, actionName,
			event, record) {
		var me = this, grid = me.getGrid();
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

		} else if (actionName === 'submit' || actionName === 'discard'
				|| actionName === 'verify' || actionName === 'auth'
				|| actionName === 'send' || actionName === 'reject'
				|| actionName === 'hold' || actionName === 'release'
				|| actionName === 'stop' || actionName === 'StopAuth'
				|| actionName === 'reversal' || actionName === 'QuickUpdate'
				|| actionName === 'StatusUpdate') {
			me.doHandleGroupActions(actionName, me.getGrid(), [record],
					'rowAction');
			// me.updatePaymentInfo(null);
			// me.doDeleteInstrument(record, rowIndex);
		} else {
			if (typeof handleEntryGridRowAction == 'function') {
				handleEntryGridRowAction(tableView, rowIndex, columnIndex,
						actionName, event, record);
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
			if (strEntity === 'REC') {
				if (record) {
					record['drawerCode_regBeneField'] = strCode;
					record['receiverID_regBeneField'] = strCode;
					record['drawerDescription_regBeneField'] = strDesc || '';
					record['drawerRegistedFlag'] = 'R';

					me.doSaveRecord(record, null, grid, false, false, null,
							true);
				}
			} else if (strEntity === 'ACC') {
				if (record) {
					record['drawerAccountNo_stdField'] = strCode;
					me.doSaveRecord(record, null, grid, false, false, null,
							true);
				}
			}

		}
	},
	doHandleGroupActions : function(strAction, grid, arrSelectedRecords,
			strActionType) {
		var me = this;
		var strGrpActionUrl = _mapUrl['gridGroupActionUrl'] + '/{0}.json';
		var strUrl = Ext.String.format(strGrpActionUrl, strAction);
		if (strAction === 'verify' || strAction === 'reject') {
			me.showRejectVerifyPopUp(strAction, strUrl, grid,
					arrSelectedRecords, strActionType);
		} else if (strAction === 'QuickUpdate') {
			me.showQuickUpdatePopUp(strAction, strUrl, grid,
					arrSelectedRecords, strActionType);

		} else if (strAction === 'StatusUpdate') {
			me.showStatusUpdatePopUp(strAction, strUrl, grid,
					arrSelectedRecords, strActionType);

		} else {
			if (strAction === 'auth' && 'Y' === chrApprovalConfirmationAllowed
					&& strEntryType === 'PAYMENT'
					&& typeof showApprovalConfirmationTxnPopup == 'function')
				showApprovalConfirmationTxnPopup(strUrl, '', grid,
						arrSelectedRecords, strActionType, strAction);
			else
				me.preHandleGroupActions(strUrl, '', grid, arrSelectedRecords,
						strActionType, strAction);
		}

	},
	showQuickUpdatePopUp : function(strAction, strActionUrl, grid,
			arrSelectedRecords, strActionType) {
		var me = this;
		var me = this;
		_objDialog = $('#quickUpdatePopupDiv');
		$("#updateBy").val('A');
		$("#value").val('');
		$('input[name="operator"][value="I"]').attr('checked', true);
		$('#lbl_value').text(getLabel('lbl_value', 'Value'));

		// jquery autoNumeric formatting
		$('#value').autoNumeric("init", {
					aSep : strGroupSeparator,
					aDec : strDecimalSeparator,
					mDec : strAmountMinFraction,
					vMin : 0,
					vmax : '99999999999.99'
				});
		$('#value').autoNumeric('set', 0);
		// jquery autoNumeric formatting

		_objDialog.dialog({
					bgiframe : true,
					autoOpen : false,
					titleMsg : 'Quick Update',
					title : getLabel('quickUpdatePopupTitle', 'Quick Update'),
					modal : true,
					resizable : false,
					width : "415px",
					strUrl : strActionUrl,
					remark : '',
					grid : grid,
					arrSelectedRecords : arrSelectedRecords,
					strActionType : strActionType,
					strAction : strAction
				});
		_objDialog.dialog('open');
	},
	showStatusUpdatePopUp : function(strAction, strActionUrl, grid,
			arrSelectedRecords, strActionType) {
		var me = this;
		var me = this;
		_objDialog = $('#statusUpdatePopupDiv');
		$("#statusFlag").val('A');
		if (strEntryType === 'PAYMENT') {
			$('#statusFlag option[value="U"]').remove();
			$('#statusFlag option[value="P"]').remove();
		} else {
			$("#holdUntilDate").datepicker();
			var minDate = Ext.Date.parse(dtApplicationDate,
					strExtApplicationDateFormat);
			if (minDate)
				minDate = Ext.Date.add(minDate, Ext.Date.DAY, 1);
			$("#holdUntilDate").datepicker("setDate", minDate);
			$('#holdUntilDate').datepicker("option", "minDate", minDate);
		}
		_objDialog.dialog({
					bgiframe : true,
					autoOpen : false,
					titleMsg : 'Status Update',
					title : getLabel('statusUpdatePopupTitle', 'Status Update'),
					modal : true,
					resizable : false,
					width : "400px",
					strUrl : strActionUrl,
					remark : '',
					grid : grid,
					arrSelectedRecords : arrSelectedRecords,
					strActionType : strActionType,
					strAction : strAction
				});
		_objDialog.dialog('open');
	},
	showRejectVerifyPopUp : function(strAction, strActionUrl, grid,
			arrSelectedRecords, strActionType) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		if (strAction === 'verify') {
			titleMsg = getLabel('instrumentVerifyRemarkPopUpTitle',
					'Please enter verify remark');
			fieldLbl = getLabel('instrumentVerifyRemarkPopUpFldLbl',
					'Verify Remark');
		} else if (strAction === 'reject') {
			titleMsg = getLabel('instrumentReturnRemarkPopUpTitle',
					'Please Enter Return Remark');
			fieldLbl = getLabel('instrumentReturnRemarkPopUpFldLbl',
					'Return Remark');
		}
		Ext.Msg.show({
					title : titleMsg,
					msg : fieldLbl,
					buttons : Ext.Msg.OKCANCEL,
					multiline : 4,
					style : {
						height : 400
					},
					bodyPadding : 0,
					fn : function(btn, text) {
						if (btn == 'ok') {
							me.preHandleGroupActions(strActionUrl, text, grid,
									arrSelectedRecords, strActionType,
									strAction);
						}
					}
				});
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
								serialNo : grid.getStore()
										.indexOf(records[index])
										+ 1,
								identifier : records[index].data.__metadata._headerId,
								userMessage : remark
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
		var me = this;
		var groupView = me.getGroupView();
		var msg = '', strIsProductCutOff = 'N', errCode = '', arrActionMsg = [], actionData, record = '', row = null, intSerialNo, arrMsg;
		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d)
				&& !Ext.isEmpty(jsonData.d.instrumentActions))
			actionData = jsonData.d.instrumentActions;
		var strIsRollover = 'N', strIsReject = 'N', strIsDiscard = 'N';
		var strActionSuccess = getLabel(strAction, 'Action Successful');
		var warnLimit = getLabel('warningLimit', 'Warning limit exceeded!')
		Ext.each(actionData, function(result) {
			intSerialNo = parseInt(result.serialNo,10);
			record = grid.getRecord(intSerialNo);
			row = grid.getRow(intSerialNo);
			msg = '';
			strIsProductCutOff = 'N';
			strIsRollover = 'N';
			strIsReject = 'N';
			strIsDiscard = 'N';
			Ext.each(result.errors, function(error) {
						msg = msg + error.code + ' : ' + error.errorMessage;
						errCode = error.code;
						if (!Ext.isEmpty(errCode)
								&& errCode.indexOf('CUTOFF') != -1)
							strIsProductCutOff = 'Y';
					});
			/*
			 * row = grid.getRow(intSerialNo); me.handleVisualIndication(row,
			 * record, result, strIsProductCutOff, true);
			 * grid.deSelectRecord(record); row =
			 * grid.getLockedGridRow(intSerialNo);
			 * me.handleVisualIndication(row, record, result,
			 * strIsProductCutOff, false);
			 */
			if (!Ext.isEmpty(strAction)) {
				if (strAction === 'auth' || strAction === 'send'
						|| strAction === 'release') {
					if (!Ext.isEmpty(errCode)
							&& errCode.indexOf('CUTOFF') != -1
							&& errCode.indexOf('ROLLOVER') != -1) {
						strIsRollover = 'Y';
						strIsReject = 'Y';
						strIsDiscard = 'N';
					} else if (!Ext.isEmpty(errCode)
							&& errCode.indexOf('CUTOFF') != -1
							&& errCode.indexOf('DISCARD') != -1) {
						strIsReject = 'Y';
						strIsDiscard = 'N';
					}
				} else if (strAction === 'save' || strAction === 'submit') {
					if (!Ext.isEmpty(errCode)
							&& errCode.indexOf('CUTOFF') != -1
							&& errCode.indexOf('ROLLOVER ') != -1) {
						strIsRollover = 'Y';
						strIsDiscard = 'N';
					} else if (!Ext.isEmpty(errCode)
							&& errCode.indexOf('DISCARD ') != -1) {
						strIsDiscard = 'N';
					}
				}
			}
			if (result.success === 'Y' && strIsRollover === 'N'
					&& strIsReject === 'N' && strIsDiscard === 'N') {
				// console.log('Do Nothing..');
			} else
				arrActionMsg.push({
					success : result.success,
					actualSerailNo : result.serialNo,
					isProductCutOff : strIsProductCutOff,
					isRollover : strIsRollover,
					isReject : strIsReject,
					isDiscard : strIsDiscard,
					actionTaken : 'Y',
					lastActionUrl : strAction,
					reference : Ext.isEmpty(record) ? '' : record
							.get('clientReference'),
					actionMessage : strIsRollover == 'Y' || strIsReject == 'Y'
							? getLabel('instrumentProductCutoffMsg',
									'Cut Off time Exceeded, Do you want to Proceed ?')
							: msg
				});

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
	preHandleProductCutoff : function(errRecord, strUserMsg, strAction) {
		var me = this;
		if (strUserMsg != 'Y') {
			// DO NOTHING.. if user has not selected 'Y'
			me.refreshData();
			return;
		}

		var strSerialNo = errRecord.actualSerailNo;
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();
		var objGridRecord = grid.getRecord(parseInt(strSerialNo,10));
		// var strUrl = Ext.String.format(me.strBatchActionUrl,
		// errRecord.lastActionUrl);
		var strActionTaken = strAction;
		var strIdentifier = (objGridRecord.get('__metadata') || {})._detailId;
		var objJson = new Array();
		var strActionUrl = null;
		if (strActionTaken === 'Rollover') {
			strActionUrl = errRecord.lastActionUrl;
			strMsg = strUserMsg;
		} else if (strActionTaken === 'Reject') {
			strActionUrl = 'reject';
			strMsg = errRecord.actionMessage;
		} else if (strActionTaken === 'Discard') {
			strActionUrl = 'discard';
			strMsg = errRecord.actionMessage;
		}
		var strGrpActionUrl = _mapUrl['gridGroupActionUrl'] + '/{0}.json';
		var strUrl = Ext.String.format(strGrpActionUrl, strActionUrl);
		objJson.push({
					serialNo : strSerialNo,
					identifier : strIdentifier,
					userMessage : strUserMsg
				});

		Ext.Ajax.request({
					url : strUrl,
					method : 'POST',
					jsonData : Ext.encode(objJson),
					success : function(response) {
						if (response && response.responseText)
							me.postHandleProductCutoff(Ext
											.decode(response.responseText),
									strUrl, strUserMsg, strActionTaken);
					},
					failure : function() {
						var errMsg = "";
						Ext.MessageBox.show({
									title : getLabel(
											'instrumentErrorPopUpTitle',
											'Error'),
									msg : getLabel('instrumentErrorPopUpMsg',
											'Error while fetching data..!'),
									buttons : Ext.MessageBox.OK,
									cls : 't7-popup',
									icon : Ext.MessageBox.ERROR
								});
					}
				});
	},
	postHandleProductCutoff : function(objData, strLastActionUrl, strUserMsg,
			strActionTaken) {
		me = this;
		var result = null;
		if (objData && objData.d && objData.d.instrumentActions)
			result = Ext.isEmpty(objData.d.instrumentActions)
					? new Array()
					: objData.d.instrumentActions[0];
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();
		var curPage = grid.getCurrentPage();
		var pageSize = grid.getPageSize();
		var intValue = 0;
		var modelRecord;
		var msg = '', strIsProductCutOff = 'N', errCode = '', record = '';
		var actionMsg = [], arrMsg = [];
		var row = null;
		var warnLimit = getLabel('warningLimit', 'Warning limit exceeded!')
		var strActionSuccess = getLabel('instrumentActionPopUpSuccessMsg',
				'Action Successful');
		var strIsRollover = 'N', strIsReject = 'N', strIsDiscard = 'N', strCanClear = 'N';

		record = grid.getRecord(parseInt(result.serialNo,10));
		intValue = ((curPage - 1) * pageSize) + parseInt(result.serialNo,10);
		if (Ext.isEmpty(intValue))
			intValue = parseInt(result.serialNo,10);

		if (result.success === 'FX') {
			// countDownTime = 600;
			// countdown_number = countDownTime;
			// me.countdownTrigger(result.paymentFxInfo, strAction, grid,
			// records);
		} else if (result.success === 'N') {
			Ext.each(result.errors, function(error) {
						msg = msg + error.code + ' : ' + error.errorMessage
								+ '<br/>';
						errCode = error.code;
						if (!Ext.isEmpty(errCode)
								&& errCode.substr(0, 3) === 'WARN'
								|| errCode === 'GD0002')
							strIsProductCutOff = 'Y';
					});
			if (strIsProductCutOff == 'Y') {
				if (!Ext.isEmpty(strAction)) {
					if (strAction === 'auth' || strAction === 'send') {
						if (!Ext.isEmpty(errCode)
								&& errCode.substr(0, 4) === 'WARN') {
							strIsRollover = 'Y';
							strIsReject = 'Y';
							strIsDiscard = 'Y';
						} else if (!Ext.isEmpty(errCode)
								&& errCode === 'GD0002') {
							strIsReject = 'Y';
							strIsDiscard = 'Y';
						}
					} else if (strAction === 'save' || strAction === 'submit') {
						if (!Ext.isEmpty(errCode)
								&& errCode.substr(0, 4) === 'WARN') {
							strIsRollover = 'Y';
							strIsDiscard = 'Y';
						} else if (!Ext.isEmpty(errCode)
								&& errCode === 'GD0002') {
							strIsDiscard = 'Y';
						}
					}
				}
			}
			actionMsg.push({
						success : result.success,
						serialNo : intValue,
						actualSerailNo : result.serialNo,
						isProductCutOff : strIsProductCutOff,
						actionTaken : 'N',
						isRollover : strIsRollover,
						isReject : strIsReject,
						isDiscard : strIsDiscard,
						lastActionUrl : strLastActionUrl,
						reference : Ext.isEmpty(record) ? '' : record
								.get('clientReference'),
						actionMessage : result.success === 'Y'
								? strActionSuccess
								: (result.success === 'W02' ? warnLimit : msg)
					});
		} else {
			// Note : Not showing the success message
			strCanClear = 'Y';
			actionMsg.push({
						success : result.success,
						serialNo : intValue,
						actualSerailNo : result.serialNo,
						isProductCutOff : strIsProductCutOff,
						actionTaken : 'N',
						lastActionUrl : strLastActionUrl,
						reference : Ext.isEmpty(record) ? '' : record
								.get('clientReference'),
						actionMessage : strActionTaken + ' ' + strActionSuccess
					});

			record.beginEdit();
			record.set({
						__status : result.updatedStatus
								|| record.get('__status') || ''
					});
			record.endEdit();
			record.commit();

		}
		if (actionMsg && actionMsg.length > 0) {
			arrMsg = (me.populateActionResult(actionMsg, strCanClear) || null);
			if (!Ext.isEmpty(arrMsg)) {
				me.paintActionResult(arrMsg);
				$("html, body").animate({
							scrollTop : 0
						}, "slow");
			} else
				doClearMessageSection();
			groupView.handleGroupActionsVisibility(me.strDefaultMask);
			groupView.setLoading(false);
			me.isLoadingIndicatorOn = false;
		} else {
			me.refreshData();
		}
		/*
		 * row = grid.getRow(intValue); me .handleVisualIndication(row, record,
		 * result, strIsProductCutOff, true); row =
		 * grid.getLockedGridRow(intValue); me.handleVisualIndication(row,
		 * record, result, strIsProductCutOff, false);
		 */

	},
	populateActionResult : function(arrActionMsg, strCanClear) {
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
				if (error.isRollover == 'Y')
					element.append($('<div>', {
								productCutOffCounter : intSrNo,
								'id' : 'actionRollOverB_' + intSrNo,
								'class' : "icon_rollover pull-left cursor_pointer",
								'title' : "Roll Over",
								'style' : 'margin-right : 5px'
							}));
				if (error.isReject == 'Y')
					element.append($('<div>', {
								productCutOffCounter : intSrNo,
								'id' : 'actionRejectB_' + intSrNo,
								'class' : "icon_reject pull-left cursor_pointer",
								'title' : "Reject",
								'style' : 'margin-right : 5px'
							}));
				if (error.isDiscard == 'Y')
					element.append($('<div>', {
								productCutOffCounter : intSrNo,
								'id' : 'actionDiscardB_' + intSrNo,
								'class' : "icon_discard pull-left cursor_pointer",
								'title' : "Discard",
								'style' : 'margin-right : 5px'
							}));
				element.appendTo($('#' + strTargetDivId));
				$('#' + strTargetDivId + ', #messageContentDiv')
						.removeClass('hidden');

			});

		}
		$('div[id^="actionRejectB_"]').each(function() {
			$(this).unbind('click');
			$(this).bind('click', function() {
				var cnt = $(this).attr('productCutOffCounter');
				$(document).trigger("handleBatchProductCutoff",
						[objActionResult[cnt], 'Y', 'Reject']);
			});
		});
		$('div[id^="actionRollOverB_"]').each(function() {
			$(this).unbind('click');
			$(this).bind('click', function() {
				var cnt = $(this).attr('productCutOffCounter');
				$(document).trigger("handleBatchProductCutoff",
						[objActionResult[cnt], 'Y', 'Rollover']);
			});
		});
		$('div[id^="actionDiscardB_"]').each(function() {
			$(this).unbind('click');
			$(this).bind('click', function() {
				var cnt = $(this).attr('productCutOffCounter');
				$(document).trigger("handleBatchProductCutoff",
						[objActionResult[cnt], 'Y', 'Discard']);
			});
		});
	},
	getAvailableGroupActions : function(_charActionType) {
		var me = this;
		var retValue = null;
		var _strLayout = 'DEFAULT';
		var mapActions = {
			'PAYMENT' : {
				rowActions : {
					'DEFAULT' : ['Discard']
				},
				groupActions : {
					'DEFAULT' : ['Discard']
				}
			}
		};

		if (_charActionType === 'G') {
			retValue = mapActions[me.entryType].groupActions[_strLayout]
					|| mapActions[me.entryType].groupActions['MIXEDLAYOUT'];
		} else {
			retValue = mapActions[me.entryType].rowActions[_strLayout]
					|| mapActions[me.entryType].rowActions['MIXEDLAYOUT'];
		}
		return retValue;
	},
	getActionConfig : function(strActionName) {
		var me = this;
		var mapActionConfig = {
			'Submit' : {
				itemText : getLabel('instrumentsActionSubmit', 'Submit'),
				actionName : 'submit',
				itemId : 'submit',
				maskPosition : 5
			},
			'Discard' : {
				itemText : getLabel('instrumentsActionDiscard', 'Discard'),
				actionName : 'discard',
				itemId : 'discard',
				maskPosition : 9
			},
			'Verify' : {
				itemText : getLabel('instrumentsActionVerify', 'Verify'),
				actionName : 'verify',
				itemId : 'verify',
				maskPosition : 13
			},
			'Authorize' : {
				itemText : getLabel('instrumentsActionApprove', 'Approve'),
				actionName : 'auth',
				itemId : 'auth',
				maskPosition : 6
			},
			'Send' : {
				itemText : getLabel('instrumentsActionSend', 'Send'),
				actionName : 'send',
				itemId : 'send',
				maskPosition : 8
			},
			'Reject' : {
				itemText : getLabel('instrumentsActionReject', 'Reject'),
				actionName : 'reject',
				itemId : 'reject',
				maskPosition : 7
			},
			'Hold' : {
				itemText : getLabel('instrumentsActionHold', 'Hold'),
				actionName : 'hold',
				itemId : 'hold',
				maskPosition : 10
			},
			'Release' : {
				itemText : getLabel('instrumentsActionRelease', 'Release'),
				actionName : 'release',
				itemId : 'release',
				maskPosition : 11
			},
			'Stop' : {
				itemText : getLabel('instrumentsActionStop', 'Cancel'),
				actionName : 'stop',
				itemId : 'stop',
				maskPosition : 12
			},
			'Enable' : {
				itemText : getLabel('instrumentsActionEnable', 'Enable'),
				actionName : 'enable',
				itemId : 'enable',
				maskPosition : 19
			},
			'Disable' : {
				itemText : getLabel('instrumentsActionDisable', 'Disable'),
				actionName : 'disable',
				itemId : 'disable',
				maskPosition : 20
			},
			'StopAuth' : {
				itemText : getLabel('instrumentsActionStopAuthorize',
						'Approve Cancel'),
				actionName : 'StopAuth',
				itemId : 'StopAuth',
				maskPosition : 19
			},
			'Reverse' : {
				itemText : getLabel('instrumentsActionRevers', 'Reverse'),
				actionName : 'reversal',
				itemId : 'reversal',
				maskPosition : 21
			},
			'Quick Update' : {
				itemText : getLabel('instrumentsActionQuickUpdate',
						'Quick Update'),
				actionName : 'QuickUpdate',
				itemId : 'QuickUpdate',
				maskPosition : 22
			},
			'Status Update' : {
				itemText : getLabel('instrumentsActionStatusUpdate',
						'Status Update'),
				actionName : 'StatusUpdate',
				itemId : 'StatusUpdate',
				maskPosition : 23
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
			if (isDirty)
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
	getPaymentHeaderAccount : function() {
		var strAccountNo = null;
		if (paymentResponseHeaderData && paymentResponseHeaderData.d
				&& paymentResponseHeaderData.d.paymentEntry
				&& paymentResponseHeaderData.d.paymentEntry.standardField) {
			Ext.Array.each(
					paymentResponseHeaderData.d.paymentEntry.standardField,
					function(cfg, index) {
						if (cfg.fieldName === 'accountNo') {
							strAccountNo = cfg.value || null;
							return false;
						}
					});
		}
		return strAccountNo;
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
						&& (colEditor.getValue() !== record
								.get(colEditor.itemId))) {
					isDirty = true;
				}
			});
		}
		return isDirty;
	},
	disableActions : function(canDisable) {
		if (canDisable)
			$('.canDisable').addClass('button-grey-effect');
		else
			$('.canDisable').removeClass('button-grey-effect');
	},
	doHandleTemplateChange : function(strId) {
		var me = this;
		me.createTransactionUsingTemplate(strId);

	},
	createTransactionUsingTemplate : function(strTemplateIdentifier) {
		var me = this, jsonRow = {}, grid = me.getGrid(), record = null;
		var objGroupView = me.down('groupView[itemId="gridEntryGroupView"]');
		if (!isEmpty(strTemplateIdentifier)) {
			var url = _mapUrl['createInstrument'];
			objGroupView.setLoading(true);
			$.ajax({
				type : "POST",
				url : url,
				dataType : "json",
				data:
					{$identifier:strTemplateIdentifier,
					$parentId:strIdentifier},
				async : false,
				//contentType : "application/json",
				complete : function(XMLHttpRequest, textStatus) {
					if ("error" == textStatus) {
						var arrError = new Array();
						arrError.push({
									"errorCode" : "Message",
									"errorMessage" : mapLbl['unknownErr']
								});
						paintErrors(arrError);
						objGroupView.setLoading(false);
					}
				},
				success : function(data) {
					if (data != null) {
						if (data.d
								&& data.d.message
								&& (data.d.message.errors && data.d.message.success === 'FAILED')) {
							paintErrors(data.d.message.errors);
							objGroupView.setLoading(false);
						} else {
							// TODO : To be handled
							jsonRow = me.createGridPreRequisites(data || {},
									true);
							if (!Ext.isEmpty(jsonRow)) {
								grid.rowEditor.cancelEdit();
								grid.store.insert(0, jsonRow);
								record = grid.store.getAt(0);
								if (record)
									record.phantom = false;
								grid.rowEditor.startEdit(0, 0);
								// me.doSetDirty(grid, true)
							}
							objGroupView.setLoading(false);
						}
						me.removeSelectActionButton();
					}
				}
			});
		} else {
		}
	},
	doCustomValidations : function(record, editor, grid, context) {
		var isNewRecord = Ext.isEmpty((record && record.get('__metadata')
				&& record && record.get('__metadata')));
		var me = this, grid, col, colEditorField, arrOptions = [];
		grid = me.getGrid();
		if (!Ext.isEmpty(grid)) {
			col = grid.down('gridcolumn[itemId="col_templateName_stdField"]');
			if (!Ext.isEmpty(col)) {
				colEditorField = col.getEditor();
				if (!Ext.isEmpty(colEditorField)) {
					colEditorField.setDisabled(!isNewRecord);
				}
			}

			col = grid.down('gridcolumn[itemId="col_accountNo_stdField"]');
			if (!Ext.isEmpty(col)) {
				colEditorField = col.getEditor();
				if (!Ext.isEmpty(colEditorField) && colEditorField.store) {
					colEditorField.store.removeAll(true);
					arrOptions = record.get('accountNo_stdField_options');
					colEditorField.store.loadData(arrOptions || []);
				}
			}
			Ext.each(grid.columns, function(col) {
						editor = col && col.getEditor()
								? col.getEditor()
								: null;
						if (editor && editor.xtype !== 'displayfield') {
							if (!Ext.isEmpty(record.get(editor.itemId
									+ '_readOnly'))
									&& editor.itemId !== 'templateName_stdField') {
								var isDisabled = record.get(editor.itemId
										+ '_readOnly') === 'true'
										? true
										: false;
								if (isNewRecord)
									isDisabled = true;
								editor.setDisabled(isDisabled);
							}
						}
					});
		}
	},
	renderSelectActionButton : function()
	{
		$('a[name=btnMore]').each(function( index ) {
			  $(this).text('Select');
			  $(this).addClass('icon-action-dropdown cursor_pointer');
		});			
	},
	removeSelectActionButton : function()
	{
		$('a[name=btnMore]').each(function( index ) {
			  $(this).text('');
			  $(this).removeClass('icon-action-dropdown cursor_pointer');	  
		});		
	},
	getSelectButtonVisibilityAction : function(record,grid,isSaveOpDone) {
		var me = this,nextRecord = null;
		var curIndex = grid.getRecordIndex(record);
		if(isSaveOpDone)
		{
			me.renderSelectActionButton();
	}
		else
		{
			if (curIndex !== -1) {
				nextRecord = grid.getRecord(curIndex + 1);
				if (nextRecord) {
					// if next record exist then take action based upon isEmptyRecordExist	
						me.removeSelectActionButton();
				}
				else
				{ // in case if current record is last editable record of Grid
					me.renderSelectActionButton();
				}
			}			
		}
		

	}	
});
