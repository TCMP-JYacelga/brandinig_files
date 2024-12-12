/**
 * @class GCP.view.AdvanceStopPayEntryInGrid
 * @extends Ext.panel.Panel
 * @author Vinay.Thube
 * @author Shraddha Chauhan
 */
Ext.define('GCP.view.AdvanceStopPayEntryInGrid', {
	extend : 'Ext.panel.Panel',
	xtype : 'advanceStopPayEntryInGrid',
	itemId : 'advanceStopPayEntryInGrid',
	requires : ['Ext.ux.gcp.SmartGrid', 'Ext.form.Panel',
			'Ext.grid.plugin.RowEditing', 'Ext.ux.gcp.Override.PickerDate'],
	autoHeight : true,
	cls : 'xn-panel xn-no-rounded-border',
	collapsible : false,
	charEditable : 'N',
	isViewOnly : false,
	isEnableGridActions : true,
	strDefaultMask : '00',
	intMaskSize : 2,
	isFocusOut : false,
	intDefaultEmptyRow : 5,
	intAddEmptyRow : 2,
	selRecSeqNumber : '',
	initComponent : function() {
		var me = this, groupView = null;
		groupView = me.createGroupView();
		me.strAccountNo = '';
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
		$(document).off('refreshGridData');
		$(document).on('refreshGridData', function(event, strAccountNo) {
					me.refreshData();
				});
		$(document).off('handleAccountChange');
		$(document).on('handleAccountChange', function(event, strAccountNo) {
					isFirstFocus = false;
					enableDisableGridButton(strAccountNo);
					if(me.strAccountNo === strAccountNo)
						return ;
					groupView.reconfigureGrid(me.getGridConfig());
					me.strAccountNo = strAccountNo;
					me.handleAccountChange(strAccountNo);
				});
		$(document).off('handleSellerChange');
		$(document).on('handleSellerChange', function() {
			$('#clientId').val('');
			$('#clientDesc').val('');
			$('#account').empty();
			$('#account').val('');
			//$('#account').niceSelect();
			//$('#account').editablecombobox({emptyText : 'Select Account',dependantFieldId : null,maxLength : 40});
			//$('#account_jq').val('');
			me.strAccountNo = '';
			me.clearGridRecords();
				});
		
		
		$(document).off('handleClientChange');
		$(document).on('handleClientChange', function() {
			if( $('#clientDesc').val() === '' || $('#clientDesc').val() === '%')
			{
				$('#clientId').val('');
				$('#clientDesc').val('');
				$('#account').empty();
				$('#account').val('');
				//$('#account').niceSelect();
				//$('#account').editablecombobox({emptyText : 'Select Account',dependantFieldId : null,maxLength : 40});
				//$('#account_jq').val('');
				
				me.strAccountNo = '';
				me.clearGridRecords();
			}
		});
		$(document).off('addGridRow');
		$(document).on('addGridRow', function(event) {
			var blnResult = true;
			blnResult = me.validateTotalRow();
			if(blnResult === false){
				getAddRowValidationPopup();
			}
			else if (blnResult && me.charEditable === 'Y') {
				var grid = me.getGrid(), record = null;
				if (grid && grid.rowEditor) {
					record = grid.rowEditor.context
							&& grid.rowEditor.context.record
							? grid.rowEditor.context.record
							: null;
					isEmptyRecordExist = (record
							&& record.get('advStopPayMetaData') && Ext
							.isEmpty((record.get('advStopPayMetaData'))._detailId));
					isEmptyRecordExist = me.isEmptyRecordExist();
					if (!isEmptyRecordExist) {
						grid.rowEditor.getEditor().allowFirstFieldFocus = true;
						me.createEmptyRow();
						if(me.isEmptyRecordExist())
							me.removeSelectActionButton();
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
		var me = this, isEmptyRecordExist = false, grid = me.getGrid(), objStore = null;
		if (!Ext.isEmpty(grid)) {
			objStore = grid.getStore();
			objStore.each(function(record, idx) {
				if ((record && record.get('advStopPayMetaData') && Ext
						.isEmpty((record.get('advStopPayMetaData'))._detailId))) {
					isEmptyRecordExist = true;
					return;
				}
			});
		}
		return isEmptyRecordExist;
	},
	getRecordsCount : function(isEmpty) {
		var me = this, grid = me.getGrid(), objStore = null, intEmptyCount = 0, intSavedCount = 0, isSaved = false;
		if (!Ext.isEmpty(grid)) {
			objStore = grid.getStore();
			arrRecords = objStore.getRange() || [];
			objStore.each(function(record, idx) {
				isSaved = record
						&& record.get('advStopPayMetaData')
						&& Ext
								.isEmpty((record.get('advStopPayMetaData'))._detailId)
						? false
						: true;
				if (isSaved)
					intSavedCount++;
				else
					intEmptyCount++;;
			});
		}
		return isEmpty ? intEmptyCount : intSavedCount;
	},
	getFirstEmptyRecord : function() {
		var me = this, grid = me.getGrid(), objStore = null, objRecord = null;
		if (!Ext.isEmpty(grid)) {
			objStore = grid.getStore();
			objStore.each(function(record, idx) {
				if (!objRecord
						&& (record && record.get('advStopPayMetaData') && Ext
								.isEmpty((record.get('advStopPayMetaData'))._detailId))) {
					objRecord = record;
				}
			});
		}
		return objRecord;
	},
	createGroupView : function() {
		var me = this;
		var groupView = null, arrCols = null, grid = null;
		var gridCfg = null;
		var enableRowEditing = me.charEditable === 'Y' ? true : false;
		// gridCfg = me.createGridPreRequisites(dataObj, false);
		gridCfg = me.createGridPreRequisites();
		if (gridCfg) {
			groupView = Ext.create('Ext.ux.gcp.GroupView', {
				id : 'advStopPayGroupView',
				itemId : 'advStopPayGroupView',
				cfgGroupByUrl : 'static/scripts/payments/checkmgmtNew/data/groupBy.json?$filterscreen=groupViewFilter',
				cfgSummaryLabel : getLabel('transactions', 'Transactions'),
				cfgGroupByLabel : getLabel('groupedBy', 'Grouped By'),
				cfgGroupCode : null,
				cfgSubGroupCode : null,
				cls : 't7-grid txn-dropdown-icon',
				cfgShowFilter : false,
				cfgShowFilterInfo : false,
				cfgShowPageSize : false,
				cfgShowRefreshLink : true,
				cfgSmartGridSetting : true,
				cfgCollpasible : false,
				cfgGroupingDisabled : true,
				cfgGridModel : me.getGridConfig(),
				doValidateRecordEdit : function(record, editor, grid, context) {
					me.validateRowFields(grid);
				},
				doBeforeRecordEdit : function(record, editor, grid, context) {
					var isNewRecord = (record
							&& record.get('advStopPayMetaData') && Ext
							.isEmpty((record.get('advStopPayMetaData'))._detailId)), objField = null;
					grid.createEmptyRow = false;
					if (me.charEditable === 'N' || me.isViewOnly)
						return false;
					me.handleFieldProperties(context.grid);
					me.clearValidations(context.grid);
					me.toggleReadonlyFields(record, isEnquiryPlaced);
					me.doBindEvents(context.grid);
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
					me.doSaveRecord(record, editor, grid, true, null, false);
				},
				doRecordEditPrevious : function(prevRecord, currentRecord,
						editor, grid, preContext) {
					if (me.checkIsDirtyRecord())
						me.doSaveRecord(editor.context.record, editor, grid,
								true, prevRecord, false);
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
									if (me.getRecordsCount(false) > 0) {
										$("#account,#account_jq").attr("disabled", "disabled");
										
										// In case of Admin ob-behaf screen
										if($("#sellerId").length > 0 )
											$("#sellerId").attr("disabled", "disabled");
										
										if($("#clientDesc").length > 0 )
											$("#clientDesc").attr("disabled", "disabled");
										
									}
									else {
										$("#account,#account_jq").removeAttr("disabled", "disabled");
										
										if($("#sellerId").length > 0 )
											$("#sellerId").removeAttr("disabled", "disabled");
										
										if($("#clientDesc").length > 0 )
											$("#clientDesc").removeAttr("disabled", "disabled");	
										
										togglePlaceEnquiryButton(true);
									}

								});

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
						var objCt = ct
								.down('container[itemId="navigationContainer"]');
						if (objCt) {
							objCt.insert(0, {
								xtype : 'container',
								id : 'emptyCt',
								height : 39,
								padding : '0 0 0 20',
								listeners : {
									'render' : function() {
										if (me.isViewOnly !== true)
											$('#emptyCt')
													.prepend($('#stopPayActionCt'));

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
	getGridConfig : function(){
		var me = this,gridCfg = null, arrCols = null;
		arrCols = me.getColumnModel(me.createGridPreRequisites());
			me.defaultColumnModel = arrCols;
		gridCfg = {
					id : 'advStopPayInstrumentDetails',
					itemId : 'advStopPayInstrumentDetails',
					stateful : false,
					showEmptyRow : false,
					enableColumnAutoWidth : false,
					showCheckBoxColumn : me.isViewOnly !== true ? true : false ,
					checkBoxColumnWidth : _GridCheckBoxWidth,
					enableRowEditing : true,
					hideRowNumbererColumn : true,
					pageSize : 50,
					showPagerForced : false,
					rowList : _AvailableGridSize,
					multiSort : false,
					enableLocking : true,
					columnModel : arrCols,
					/*
					 * groupActionModel : me.isViewOnly === true ? [] : me
					 * .getActionBarItems('G'),
					 */
					// Only For 'Payment' in View Mode
					groupActionModel : me.isEnableGridActions === true ? me
							.getActionBarItems() : [],
					storeModel : {
						fields : ['checkNumber', 'amount', 'accountNumber',
								'accountName', 'sellerId','sellerDesc','ccy','clientId', 'statusCode','statusDesc','sequenceNmbr',
								'advStopPayMetaData', 'hostMessage','message','isAmountEditable','hasError'],
						proxyUrl : _mapUrl['gridUrl'],
						rootNode : 'd.advStopPayChecks',
						totalRowsNode : 'd.__count'
					},
					fnColumnRenderer : me.columnRenderer,
					defaultColumnModel : arrCols,
					fnRowIconVisibilityHandler : function(store, record,
							jsonData, itmId, maskPosition) {
						return me.isRowIconVisible(store, record, jsonData,
								itmId, maskPosition);
					}
				}
		return gridCfg; 
		
	},
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) {
		var me = this;
		var objGroupView = me.down('groupView[itemId="advStopPayGroupView"]');
		var strModule = '', strUrl = null, args = null, strFilterCode = null, gridMeta = null, gridCfg = null;
		groupInfo = groupInfo || {};
		subGroupInfo = subGroupInfo || {};
		if (groupInfo) {
			strFilterCode = subGroupInfo.groupCode;
			objGroupView.reconfigureGrid(null);
		}
	},

	getColumnModel : function(arrCols) {
		var arrAvlCols = null;
		var column = null, colError = null, colGroupAction = null, strPostFix = null;
		var me = this, arrColumns = [];
		if(!me.isViewOnly){
			colError = me.createErrorActionColumn();
			arrColumns.push(colError);
			if(!isEnquiryPlaced){
				colGroupAction = me.createGroupActionColumn();
				colGroupAction.items = colGroupAction.items || [];
				arrColumns.push(colGroupAction);
			}
		}
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
						if (editor && editor.xtype !== 'displayfield' && !editor.disabled) {
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
			if (lastField)
				lastField.requestFired = false;
			if (lastField && !lastField.isBlurBinded) {
				lastField.isBlurBinded = true;
				lastField.enableKeyEvents = true;
				/*
				 * lastField.on('keydown', function(cmp, e) { if (e &&
				 * e.getKey() == e.ENTER) { if (cmp.requestFired) e.stopEvent();
				 * else cmp.requestFired = true; } }); lastField.on('blur',
				 * function(cmp) { if (!cmp.requestFired) { cmp.requestFired =
				 * true; grid.rowEditor.completeEdit(); } });
				 */
				lastField.on('keydown', function(cmp, e) {
							if (e
									&& (e.getKey() == e.ENTER || e.getKey() == e.TAB)) {
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
	createGridPreRequisites : function(blnAllowEdit) {
		var me = this, objCheckEditor = null, objCol = null, objColAmount = null, objAmountEditor = null;
		objCheckEditor = me.createNumberField('checkNumber', '', 8)
		objCol = {
			'colId' : 'checkNumber',
			'colHeader' : '<span class="requiredLeft">' + getLabel('CheckNumber', 'CheckNumber') + '</span>',
			'hidden' : false,
			'sortable' : false,
			'hideable' : false,
			'draggable' : false,
			'resizable' : true,
			'width' : 150,
			'editor' : objCheckEditor
		};
		// TODO : Max length to be configured
		objAmountEditor = me.createAmountField('amount', '', 40, false);
		objColAmount = {
			'colId' : 'amount',
			'colHeader' : '<span class="requiredLeft">'+ getLabel('amount', 'Amount') + '</span>',
			'hidden' : false,
			'sortable' : false,
			'hideable' : false,
			'draggable' : false,
			'resizable' : true,
			'width' : 120,
			'align' : 'right',
			'minWidth' : 120,
			'editor' : objAmountEditor
		};
		var girdCols = [objCol, {
					'colId' : 'accountNumber',
					'colHeader' : '<span class="requiredLeft">' + getLabel('accountnumber', 'Account') + '</span>',
					'hidden' : false,
					'width' : 170,
					'minWidth' : 120,
					'sortable' : false,
					'hideable' : false,
					'resizable' : true,
					'draggable' : false
				}, {
					'colId' : 'accountName',
					'colHeader' : '<span class="requiredLeft">' + getLabel('accountname', 'Account Name') + '</span>',
					'hidden' : false,
					'width' : 230,
					'minWidth' : 120,
					'sortable' : false,
					'hideable' : false,
					'resizable' : true,
					'draggable' : false
				}, {
					'colId' : 'sellerDesc',
					'colHeader' : getLabel('financialInstitution', 'Financial Institution'),
					'width' : 200,
					'minWidth' : 120,
					'hidden' : false,
					'sortable' : false,
					'hideable' : false,
					'resizable' : true,
					'draggable' : false
				}, 
				objColAmount,{
					'colId' : 'statusDesc',
					'colHeader' : getLabel('status', 'Status'),
					'hidden' : false,
					'width' : 90,
					'minWidth' : 80,
					'sortable' : false,
					'hideable' : false,
					'resizable' : true,
					'draggable' : false
				}, {
					'colId' : 'hostMessage',
					'colHeader' : getLabel('hostMessage', 'Host Message') ,
					'width' : 120,
					'minWidth' : 120,
					'hidden' : false,
					'sortable' : false,
					'resizable' : true,
					'hideable' : false,
					'draggable' : false
				}]

		return girdCols;
	},
	createEmptyRow : function(intRows) {
		var me = this;
		var emptyRecord = null, record = null, isDirty = false, isEmptyRecordExist = false, intCount = !Ext
				.isEmpty(intRows) ? parseInt(intRows,10) : (!Ext
				.isEmpty(me.intAddEmptyRow) ? parseInt(me.intAddEmptyRow,10) : 1);
		var objGroupView = me.down('groupView[itemId="advStopPayGroupView"]'), objAccDtls = _mapAccounts[me.strAccountNo]
				|| {}
		emptyRecord = {
			'advStopPayMetaData' : {
				'__rightsMap' : '00',
				'_detailId' : '',
				'_buttonMask' : '11'
			},
			'isAmountEditable' : 'N',
			'checkNumber' : '',
			'amount' : '',
			'status' : '',
			'hostMessage':'',
			'accountNumber' : me.strAccountNo || '',
			'accountName' : objAccDtls.accountName || '',
			'sellerDesc' : objAccDtls.sellerDesc || '',
			'ccy' : objAccDtls.accountCcy || '',
			'clientId' :objAccDtls.clientId || ''
		};
		if (emptyRecord) {
			var grid = me.getGrid();
			var intInst = getRecordCountToBeAdded(grid.store.getCount(),
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
					// TODO : Need to check below code
					record = grid.rowEditor.context
							&& grid.rowEditor.context.record
							? grid.rowEditor.context.record
							: null;
					isDirty = grid.rowEditor.getEditor().isDirty()
							&& (record && record.get('advStopPayMetaData') && !Ext
									.isEmpty((record.get('advStopPayMetaData'))._detailId));
					isEmptyRecordExist = (record
							&& record.get('advStopPayMetaData') && Ext
							.isEmpty((record.get('advStopPayMetaData'))._detailId));
					if (isDirty) {
						grid.createEmptyRow = true;
						me.doSetDirty(grid, true);
						grid.rowEditor.completeEdit();
					} else if (!isEmptyRecordExist) {
						grid.rowEditor.cancelEdit();
						for (var i = 0; i < intCount; i++)
							grid.store.insert(0, emptyRecord);
						grid.rowEditor.startEdit(0, 0);
						if (isFirstFocus) {
							autoFocusFirstElement();
							isFirstFocus = false;
						}
						me.doSetDirty(grid, true);
						grid.getView().refresh();
					}
				}
			}
		}
	},
	doSaveRecord : function(record, editor, grid, canEdit, prevRecord, addUsing) {
		// TODO : This is to be handled
		var me = this, groupView = me.getGroupView();
		var rec = prevRecord || record;
		var jsonData = null
		var strUrl = _mapUrl['saveRecordUrl'];
		var jsonPost = null,objAdvStopDataClone=null,objAdvStopData=null,hasCheckNumber= false;
		var canAddAnother = false, metaData = null, nextRecord = null, isDirty = false, arrErors = [], hasError = false,strRecAmountVal=null,strNorAmtVal=null;

		if (!strUrl)
			return false;

		jsonPost = me.doGenerateSaveRecordJson(rec);
		if(jsonPost && jsonPost.d && jsonPost.d.advStopPayChecks
				&& jsonPost.d.advStopPayChecks && !Ext.isEmpty(jsonPost.d.advStopPayChecks.checkNumber)
				&& jsonPost.d.advStopPayChecks.checkNumber != null
				&& jsonPost.d.advStopPayChecks.checkNumber != '' )
		{
			hasCheckNumber = true;  
		}
		if(hasCheckNumber){
		if(jsonPost && jsonPost.d && jsonPost.d.advStopPayChecks){
			objAdvStopData = jsonPost.d.advStopPayChecks;
			objAdvStopDataClone = me.cloneObject(objAdvStopData);
			if(!isEmpty(objAdvStopDataClone)){
					if(objAdvStopDataClone.hasOwnProperty('isActionTaken')){
						delete objAdvStopDataClone['isActionTaken'];
					}
					if(objAdvStopDataClone.hasOwnProperty('isEmpty')){
						delete objAdvStopDataClone['isEmpty'];
					}
					if(objAdvStopDataClone.hasOwnProperty('hasError')){
						delete objAdvStopDataClone['hasError'];
					}
					if(objAdvStopDataClone.hasOwnProperty('amount')){
						strRecAmountVal = objAdvStopDataClone.amount;
						strNorAmtVal = me.getAmountNormalVal(strRecAmountVal);
						objAdvStopDataClone.amount=strNorAmtVal;
					}
				jsonPost.d.advStopPayChecks = objAdvStopDataClone;
			}
		}
		
		canAddAnother = (grid.createEmptyRow === true || Ext
				.isEmpty(jsonPost.d.advStopPayChecks.advStopPayMetaData._detailId))
				? true
				: false;

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
					if (data.d.advStopPayChecks
							&& data.d.advStopPayChecks.message
							&& data.d.advStopPayChecks.message.success)
						status = data.d.advStopPayChecks.message.success;
					if (status === 'Y') {
						doClearMessageSection();
						groupView.setLoading(false);
						me.isLoadingIndicatorOn = false;
						if (!addUsing) {
							var strStatus = data.d.advStopPayChecks.status
									|| rec.get('status');
							metaData = data.d.advStopPayChecks.advStopPayMetaData
									|| rec.get('advStopPayMetaData') || {};
							rec.beginEdit();
							rec.set({
								advStopPayMetaData : metaData,
								message : data.d.advStopPayChecks.message,
								status : strStatus,
								hasError : data.d.advStopPayChecks.message.errors
										? data.d.advStopPayChecks.message.errors.length > 0
										: false
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
						if (me.getRecordsCount(false) > 0) {
							$("#account,#account_jq").attr("disabled", "disabled");
							// In case of Admin ob-behaf screen
							if($("#sellerId").length > 0 )
								$("#sellerId").attr("disabled", "disabled");
							
							if($("#clientDesc").length > 0 )
								$("#clientDesc").attr("disabled", "disabled");
						}
						if (!isEnquiryPlaced)
							togglePlaceEnquiryButton(false);

					} else if (status === 'N') {
						groupView.setLoading(false);
						me.isLoadingIndicatorOn = false;
						if (data.d.advStopPayChecks.message) {
							var arrError = data.d.advStopPayChecks.message.errors;
							if (arrError)
								paintErrors(arrError);
							if (canEdit && grid && grid.rowEditor) {
								if (!grid.rowEditor.editing) {
									grid.rowEditor.startEdit(rec, 0);
								} else if (prevRecord) {
									grid.rowEditor.cancelEdit();
									grid.rowEditor.startEdit(rec, 0);
									me.doSetDirty(grid, true);
								}
								me.removeSelectActionButton();
							}
//							if (!Ext.isEmpty(grid.fnFocusOutCallback)) {
//								me.doHandleCallBack(grid.callBackScope);
//							}
						}
						//me.scrollToTop();
					} else if (isEmpty(status)
							&& data.d.advStopPayChecks.message.errors) {
						doClearMessageSection();
						record.beginEdit();
						record.set({
									message : data.d.advStopPayChecks.message,
									hasError : true
								});
						record.endEdit();
						record.commit();
						blockPaymentUI(false);
					}
				}
			},
			failure : function() {
				var errMsg = '';
				groupView.setLoading(false);
				me.isLoadingIndicatorOn = false;
				var arrError = [{
							'errorCode' : 'ERR',
							'errorMessage' : mapLbl['errorUnknown']
						}];
				if (arrError)
					paintErrors(arrError);
				if (canEdit && grid && grid.rowEditor) {
					if (!grid.rowEditor.editing) {
						grid.rowEditor.startEdit(rec, 0);
					} else if (prevRecord) {
						grid.rowEditor.cancelEdit();
						grid.rowEditor.startEdit(rec, 0);
						me.doSetDirty(grid, true);
					}
				}
				me.scrollToTop();
				/*
				 * Ext.MessageBox.show({ title :
				 * getLabel('instrumentErrorPopUpTitle', 'Error'), msg :
				 * getLabel('instrumentErrorPopUpMsg', 'Error while saving
				 * data..!'), buttons : Ext.MessageBox.OK, icon :
				 * Ext.MessageBox.ERROR });
				 */
			}
		});
		me.getSelectButtonVisibilityAction(record, grid);
		}
		else
		{
			if (!Ext.isEmpty(grid.fnFocusOutCallback)) {
				me.doHandleCallBack(grid.callBackScope);
			}
		}
		//groupView.handleGroupActionsVisibility(me.strDefaultMask);
	},
	getAmountNormalVal : function(strAmountVal){
		var me = this,retAmountNorVal='',obj;
		if(!Ext.isEmpty(strAmountVal)){
			obj = $('<input type="text">');
			obj.autoNumeric('init');
			obj.val(strAmountVal);
			retAmountNorVal = obj.autoNumeric('get');
			obj.remove();
		}
		return retAmountNorVal;
	},
	getAmountFormatedVal : function(strAmountVal){
		var me = this,retAmountForVal='',obj;
		if(!Ext.isEmpty(strAmountVal)){
			obj = $('<input type="text">');
			obj.autoNumeric('init');
			obj.val(strAmountVal);
			retAmountForVal = obj.val();
			obj.remove();
		}
		return retAmountForVal;
	},
	handleEditToggle : function(grid, editor, record, prevRecord, canAddAnother) {
		var me = this, nextRecord = null,editFlag = true;
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
						else
						{
							editFlag = false;
						}
					}
				}
				grid.getView().refresh();
				//remove after grid refresh
				if(editFlag)
					me.removeSelectActionButton()
				else	
					me.renderSelectActionButton();				
			}
		}
		grid.isFocusOut = false;
	},
	doGenerateSaveRecordJson : function(record) {
		var me = this, grid = me.getGrid();
		var objPostJson = {
			'd' : {
				'__metadata' : null,
				'advStopPayChecks' : null
			}
		};
		if (record) {
			objPostJson.d.__metadata = grid.store.proxy.reader.rawData.__metadata;
			objPostJson.d.advStopPayChecks = record.data;
			objPostJson.d.advStopPayChecks.batchIdentifier = strBatchRefNmbr;
			if(isEmpty(objPostJson.d.advStopPayChecks.message))
					objPostJson.d.advStopPayChecks.message = {};
		}
		return objPostJson;
	},
	createAmountField : function(fieldId, defValue, intMaxLength, isReadOnly) {
		var fieldCfg = {
			fieldCls : 'xn-valign-middle xn-form-text amountBox grid-field form-control',
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
						inputField.autoNumeric('init', {
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
			fieldCls : 'xn-valign-middle xn-form-text grid-field requiredField',
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
			allowDecimals : false,
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
		if (!Ext.isEmpty(intMaxLength)) {
			fieldCfg.maxLength = intMaxLength;
			fieldCfg.enforceMaxLength = true;
		}
		var field = Ext.create('Ext.form.field.Number', fieldCfg);
		return field;
	},
	handleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter, filterData) {
		var me = this;
		if (!Ext.isEmpty(strBatchRefNmbr)) {
			var tempUrl = _mapUrl['gridUrl'];			
			var strUrl = grid.generateUrl(tempUrl, pgSize, newPgNo, oldPgNo,
					null);
			if(!Ext.isEmpty(me.selRecSeqNumber)){
				strUrl = strUrl + '&$sequenceNmbr=' + me.selRecSeqNumber;
			}			
					
			// TODO : To be handled
			// strUrl += me.generateFilterUrl(subGroupInfo, groupInfo);
			me.getGridData(strUrl, grid);
			if(isEnquiryPlaced)
				toggleStopPayButton(true);
			if(me.isViewOnly || isEnquiryPlaced)
				me.handleAutoExpandLastColumn();
		}
	},
	handleAutoExpandLastColumn : function() {
		var me = this,objGrid=null;
		objGrid = me.getGrid();
		var arrCols = objGrid.getAllVisibleColumns(), objCol = null, arrAllCols = objGrid.columns || [], intColWidthSum = 0, intGridWidth = 2000;
		Ext.each(arrAllCols, function(col) {
					if (!Ext.isEmpty(col.flex)) {
						delete col.flex;
						col.autoSize();
					}
				});
		Ext.each(arrCols, function(col) {
					intColWidthSum += col.width;
					objCol = col;
				});
		if (objCol) {
			console.log("Is "+intColWidthSum+">"+intGridWidth);
			objCol.flex = 0.9;
			me.hide();
			me.show();
			
		}
	},
	generateFilterUrl : function(subGroupInfo, groupInfo) {
		var me = this, strUrl = '';
		// TODO : This is to be handled
		return strUrl;
	},
	loadGridData : function(strFilterUrl) {
		var me = this;
		var grid = me.getGrid();
		if (grid) {
			if (!Ext.isEmpty(strPaymentHeaderIde)) {
				var tempUrl = _mapUrl['gridLayoutDataUrl'];
				var strUrl = grid.generateUrl(tempUrl, grid.pageSize, 1, 1,
						null);
						strUrl += "&$id=" + strPaymentHeaderIde;
				me.getGridData(strUrl, grid);
			}
		}
	},
	getGridData : function(strUrl, grid) {
		var me = this, groupView = me.getGroupView();
		groupView.setLoading(true);
		me.isLoadingIndicatorOn = true;
		groupView.handleGroupActionsVisibility(me.strDefaultMask);
		me.disableActions(true);
		Ext.Ajax.request({
			url : strUrl,
			method : 'POST',			
			params : { id : !Ext.isEmpty(strBatchRefNmbr)? strBatchRefNmbr :''},			 
			success : function(response) {
				var data = Ext.decode(response.responseText), arrData = new Array();
				if (data && data.d && data.d.advStopPayChecks) {
					arrData = data.d.advStopPayChecks;
				}
				if(!isEmpty(arrData)){
					$.each(arrData, function(index, cfg) {
						var arrMsg =[];
						if(cfg && cfg.message && cfg.message.errors)
							arrMsg=cfg.message.errors;
						if(arrMsg.length >= 1)
							cfg['hasError'] = true;
						else
							cfg['hasError'] = false;
					});
					data.d.advStopPayChecks = arrData;
				}
				if(!isEmpty(arrData))
				{
					$.each(arrData, function(index, cfg) {
						if(cfg && cfg.requestState == 0)
						 cfg.statusDesc = '';
					});
				}
				grid.store.loadRawData(data);
				groupView.handleGroupActionsVisibility(me.strDefaultMask);
				if (groupView) {
					groupView.setLoading(false);
					me.isLoadingIndicatorOn = false;
					if (arrData && arrData.length === 0
							&& me.charEditable === 'Y' && !me.isViewOnly) {
						me.createEmptyRow(me.intDefaultEmptyRow);
					}
				}
				 if(!isEmpty(arrData))
				{
						$.each(arrData, function(index, cfg) {
							if(cfg && (cfg.requestState == 0 || cfg.requestState == 3 ))
								     isEnquiryPlaced = false;
							
						});
						if(!isEnquiryPlaced)
							paintActions('ADD');
				}
				if (!isEnquiryPlaced && arrData.length > 0)
					togglePlaceEnquiryButton(false)
					
			    if (arrData.length == 1 && (arrData[0].requestState === 19 || arrData[0].requestState === 10))
			    	toggleStopPayButton(false)
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
		var groupView = me.down('groupView[itemId="advStopPayGroupView"]');
		if (groupView) {
			groupView.refreshData();
		}
		var grid = me.getGrid();
		if (grid)
			grid.down('smartGridPager').togglePagerVisibility();
	},
	cloneObject : function(obj) {
		return JSON.parse(JSON.stringify(obj));
	},
	getActionBarItems : function() {
		var me = this;
		var arrAvailableActions = me.getAvailableGroupActions();
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
		var arrGroupAction = [];
		arrActions = [{
					itemId : 'discard',
					itemCls : 'grid-row-action-icon icon-edit',
					toolTip : getLabel('editRecordToolTip', 'Discard'),
					itemLabel : getLabel('editRecordToolTip', 'Discard'),
					maskPosition : 1
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
			colHeader : getLabel('actions', 'Actions') +'&nbsp;&nbsp;<i class="fa fa-info-circle" style="cursor:pointer" title="To enable below Action buttons, click on Save Records." onclick=""></i>',
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
			retValue = (record && record.get('advStopPayMetaData') && Ext
					.isEmpty((record.get('advStopPayMetaData'))._detailId));
		} else {
			var maskArray = new Array();
			var actionMask = '';
			var rightsMap = record.data.advStopPayMetaData.__rightsMap;
			var buttonMask = '';
			var bitPosition = '';
			if (!Ext.isEmpty(maskPosition)) {
				bitPosition = parseInt(maskPosition,10) - 1;
			}
			if (!Ext.isEmpty(jsonData)
					&& !Ext.isEmpty(jsonData.d.__metadata.__buttonMask))
				buttonMask = jsonData.d.__metadata.__buttonMask;
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
				&& !Ext.isEmpty(jsonData.d.__metadata.__buttonMask))
			buttonMask = jsonData.d.__metadata.__buttonMask;

		maskArray.push(buttonMask);
		for (var index = 0; index < arrSelectedRecords.length; index++) {
			objData = arrSelectedRecords[index];
			maskArray.push(objData.get('advStopPayMetaData').__rightsMap);
		}
		actionMask = doAndOperation(maskArray, me.intMaskSize);
		// actionMask = '111111111111111111';
		objGroupView.handleGroupActionsVisibility(actionMask);
		handlePageActionsVisibilty(actionMask);
	},
	handleRowIconClick : function(tableView, rowIndex, columnIndex, actionName,
			event, record) {
		var me = this;
		var strMsg = 'Errors : <br/>';
		if (actionName === 'btnError') {
			var arrError = record.data.message.errors;
			if (!me.tip) {
				me.tip = Ext.create('Ext.tip.ToolTip', {
							hideDelay : 3000,
							padding : '0 0 0 0',
							maxWidth : 800,
							minWidth : 145,
							html : ''
						});
			}
			if (arrError && arrError.length > 0) {
				Ext.each(arrError, function(err) {
							strMsg += (err.errorCode || err.code) + ' '
									+ err.errorMessage + ' <br/>';
						});
				me.tip.update(strMsg);
				me.tip.showAt([event.xy[0] + 5, event.xy[1] + 5]);
			}

		} else if (actionName === 'discard') {
			me.doHandleGroupActions(actionName, me.getGrid(), [record],
					'rowAction');
		}
	},
	getGrid : function() {
		var me = this;
		var groupView = me.down('groupView[itemId="advStopPayGroupView"]');
		var grid = null;
		if (groupView)
			grid = groupView.getGrid();
		return grid;
	},
	getGroupView : function() {
		var me = this;
		return me.down('groupView[itemId="advStopPayGroupView"]');
	},
	doHandleGroupActions : function(strAction, grid, arrSelectedRecords,
			strActionType) {
		var me = this;
		var strGrpActionUrl = _mapUrl['gridGroupActionUrl'] + '/{0}.json';
		var strUrl = Ext.String.format(strGrpActionUrl, strAction);
		me.preHandleGroupActions(strUrl, '', grid, arrSelectedRecords,
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
						identifier : records[index].data.advStopPayMetaData._detailId,
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
											'errorCode' : 'Message',
											'errorMessage' : mapLbl['unknownErr']
										});
								paintErrors(arrError);
								groupView.setLoading(false);
								me.isLoadingIndicatorOn = false;
							},
							complete : function(XMLHttpRequest, textStatus) {
								if ('error' == textStatus) {
									var arrError = new Array();
									arrError.push({
												'errorCode' : 'Message',
												'errorMessage' : mapLbl['unknownErr']
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
		var me = this,objData=null;
		var arrError = new Array();
		var groupView = me.getGroupView();
		me.refreshData();
		if(jsonData && jsonData.d && jsonData.d.instrumentActions){
			objData = jsonData.d.instrumentActions;
			Ext.each(objData,function(cfg){
				if(cfg.success === 'N'){
					if(cfg.errors){
						Ext.each(cfg.errors,function(cfg){
							arrError.push(cfg);
						});
					}
					paintErrors(arrError);
				}
			});
		}
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
	getAvailableGroupActions : function(_charActionType) {
		return ['Discard'];
	},
	getActionConfig : function(strActionName) {
		var me = this;
		var mapActionConfig = {
			'Discard' : {
				itemText : getLabel('advStopPayDiscard', 'Discard'),
				actionName : 'discard',
				itemId : 'discard',
				maskPosition : 1
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
			if(record && record.data && record.data.checkNumber == null)
				record.data.checkNumber= "";
			
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
	validateTotalRow : function() {
		var me = this, intGridRecordCount, retBln = true;
		var grid = me.getGrid();
		if (grid) {
			// TODO : This is to be handed based on system parameter master
			intGridRecordCount = grid.store.getCount()
					- me.getRecordsCount(true);
			if (intGridRecordCount >= intMaxAllowedRows) {
				retBln = false;
			} else {
				retBln = true;
			}
		}
		return retBln;
	},
	clearGridRecords : function() {
		var me = this, grid = me.getGrid(), objStore = grid
		? grid.getStore() : null;
		
		if(!Ext.isEmpty(objStore))
		{
			objStore.removeAll();
			
			var groupView = me.down('groupView[itemId="advStopPayGroupView"]');
			if (groupView) {
				groupView.refreshData();
			}
		}
	},
	handleAccountChange : function(strAccountNo) {
		var me = this, grid = me.getGrid(), objStore = grid
				? grid.getStore()
				: null, objAccDtls = _mapAccounts[strAccountNo] || {}, intSavedRecCount = me
				.getRecordsCount(false);
		if (intSavedRecCount === 0 && objStore) {
			arrRecords = objStore.getRange() || [];
			objStore.each(function(record, idx) {
				if ((record && record.get('advStopPayMetaData') && Ext
						.isEmpty((record.get('advStopPayMetaData'))._detailId))) {
					record.beginEdit();
					record.set({
								'accountNumber' : strAccountNo || '',
								'accountName' : objAccDtls.accountName || '',
								'sellerDesc' : objAccDtls.sellerDesc || '',
								'ccy' : objAccDtls.accountCcy || '',
								'clientId':objAccDtls.clientId
							});
					record.endEdit();
					record.commit();
				}
			});
		}
	},
	scrollToTop : function() {
		$("html, body").animate({
					scrollTop : 0
				}, "slow");
	},
	toggleReadonlyFields : function(objData, isEnquiryPlaced) {
		var me = this, data = objData || {}, grid, col, colEditorField;
		grid = me.getGrid();
		if (!Ext.isEmpty(grid)) {
			col = grid.down('gridcolumn[itemId="col_checkNumber"]');
			if (!Ext.isEmpty(col)) {
				colEditorField = col.getEditor();
				if (!Ext.isEmpty(colEditorField)) {
					colEditorField.setDisabled(isEnquiryPlaced);
				}
			}
		}
		if (!Ext.isEmpty(grid)) {
			col = grid.down('gridcolumn[itemId="col_amount"]');
			if (!Ext.isEmpty(col)) {
				colEditorField = col.getEditor();
				if (!Ext.isEmpty(colEditorField)) {
					/*if(objData && objData.data && objData.data.isAmountEditable && objData.data.isAmountEditable === 'N' )
						colEditorField.setDisabled(true);
					else
						colEditorField.setDisabled(false);*/
				}
			}
		}
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var me = this,obj=null,strRetValue = "";
		strRetValue = value;
		meta.tdAttr = 'title="' + strRetValue + '"';
		
		inputField = $('#col_checkNumber');
		if(colId == 'col_checkNumber' && strRetValue == '')
		{
			inputField.addClass('requiredField');
		}
		
		return strRetValue;
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
	getSelectButtonVisibilityAction : function(record,grid) {
		var me = this,nextRecord = null;
		var curIndex = grid.getRecordIndex(record);
		if (curIndex !== -1) {
			nextRecord = grid.getRecord(curIndex + 1);
			if (nextRecord) {
				// if next record exist then take action based upon isEmptyRecordExist	
				if(me.isEmptyRecordExist())
					me.removeSelectActionButton();
			}
			else
			{ // in case if current record is last editable record of Grid
				me.renderSelectActionButton();
			}
		}
	}	
});
