Ext.define('GCP.controller.AVMSVMController', {
	extend : 'Ext.app.Controller',
	requires : ['GCP.view.SlabGridView'],
	views : ['GCP.view.AvmSvmView', 'GCP.view.AvmSvmView',
			'GCP.view.AvmSvmGridView', 'GCP.view.HistoryPopup',
			'GCP.view.SlabGridView'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'avmSvmView',
				selector : 'avmSvmView'
			},{
				ref : 'groupView',
				selector : 'avmSvmView groupView'
			}, {
				ref : 'avmSvmTitleView',
				selector : 'avmSvmView avmSvmTitleView'
			}, {
				ref : 'avmSvmFilterView',
				selector : 'avmSvmView avmSvmFilterView'
			}, {
				ref : 'avmSvmGridView',
				selector : 'avmSvmView avmSvmGridView'
			}, {
				ref : 'avmSvmGrid',
				selector : 'avmSvmView avmSvmGridView grid[itemId="gridViewMstId"]'
			}, {
				ref : 'avmSvmDtlView',
				selector : 'avmSvmView avmSvmGridView panel[itemId="avmSvmDtlView"]'
			}, {
				ref : 'gridHeader',
				selector : 'avmSvmView avmSvmGridView panel[itemId="avmSvmDtlView"] container[itemId="gridHeader"]'
			}, {
				ref : 'createNewToolBar',
				selector : 'avmSvmView toolbar[itemId="btnCreateNewToolBar"]'
			}, {
				ref : 'groupActionBar',
				selector : 'avmSvmView avmSvmGridView avmSvmGroupActionBar'
			}, {
				ref : 'searchTextInput',
				selector : 'avmSvmGridView textfield[itemId="searchTextField"]'
			}, {
				ref : 'matchCriteria',
				selector : 'avmSvmGridView radiogroup[itemId="matchCriteria"]'
			}, {
				ref : 'svmGrid',
				selector : 'slabGridSignView[id="slabGridSignView"] smartgrid'
			}, {
				ref : 'clientCodesFltCombo',
				selector : 'avmSvmView avmSvmFilterView combo[itemId=clientCodesFltId]'
			}, {
				ref : 'matrixNameFltCombo',
				selector : 'avmSvmView avmSvmFilterView AutoCompleter[itemId=matrixNameFltId]'
			}, {
				ref : 'matrixTypeToolBar',
				selector : 'avmSvmView avmSvmFilterView toolbar[itemId="matrixTypeToolBar"]'
			}, {
				ref : 'svmGrid',
				selector : 'slabGridSignView[id="slabGridSignView"] smartgrid'
			}],
	config : {
		matrixTypeVal : 'all',
		clientCode : '',
		clientDesc : '',
		filterData : [],
		copyByClicked : '',
		clientFilterVal : '',
		clientFilterDesc : '',
		selectedSeller : '',
		strDefaultMask : '000000000000000000'
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		GCP.getApplication().on({
					detailUpdated : function() {
						me.refreshGrid();
					}
				});
		me.control({
			'avmSvmView groupView' : {
				/**
				 * This is to be handled if grid model changes as per group by
				 * category. Otherewise no need to catch this event. If captured
				 * then GroupView.reconfigureGrid(gridModel) should be called
				 * with gridModel as a parameter
				 */
				'groupByChange' : function(menu, groupInfo) {
					//me.doHandleGroupByChange(menu, groupInfo);
				},
				'groupTabChange' : function(groupInfo, subGroupInfo, tabPanel,
						newCard, oldCard) {
					me.doHandleGroupTabChange(groupInfo, subGroupInfo,
							tabPanel, newCard, oldCard);
				},
				'gridRender' : me.doHandleLoadGridData,
				'gridPageChange' : me.doHandleLoadGridData,
				'gridSortChange' : me.doHandleLoadGridData,
				'gridPageSizeChange' : me.doHandleLoadGridData,
				'gridColumnFilterChange' : me.doHandleLoadGridData,
				'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,
				'gridStateChange' : function(grid) {
					//me.toggleSavePrefrenceAction(true);
				},
				'gridRowActionClick' : function(grid, rowIndex, columnIndex,
						actionName, record) {
					me.doHandleRowActions(actionName, grid, record,rowIndex);
				},
				'groupActionClick' : function(actionName, isGroupAction,
						maskPosition, grid, arrSelectedRecords) {
					if (isGroupAction === true)
						me.doHandleGroupActions(actionName, grid,
								arrSelectedRecords, 'groupAction');
				},
				afterrender : function(panel,opts){
					me.setFilterRetainedValues();
				}
			},
			'avmSvmView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateNewMatrix"]' : {
				click : function() {
					me.handleMatrixEntryAction();
				}
			},
			'avmSvmView avmSvmFilterView button[itemId="filterBtnId"]' : {
				click : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
				}
			},
			'avmSvmGridView' : {
				render : function(panel) {
				//	me.handleSmartGridConfig();
					me.setFilterRetainedValues();
				}
			},
			'avmSvmGridView radiogroup[itemId="matchCriteria"]' : {
				change : function(btn, opts) {
					console.log("match");
					me.searchOnPage();
				}
			},
			'avmSvmGridView toolbar[itemId=avmSvmGroupActionBar_Dtl]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			},
			/*'avmSvmView avmSvmGridView panel[itemId="avmSvmDtlView"]' : {
				render : function() {
					me.setInfoTooltip();
					me.handleGridHeader();
				}
			},*/
			'avmSvmView':{
				render:function(){me.handleGridHeader();}
			},
			'avmSvmView avmSvmFilterView' : {
				handleMatrixType : function(btn) {
					me.handleMatrixType(btn);
				},
				'handleClientChange' : function(client, clientDesc) {				
								me.handleClientChange(client, clientDesc);
								if(client === 'all')
								{									
									me.clientFilterVal  = '';
									me.clientFilterDesc = '';
									me.clientCode = '';
								}
								else
								{				
									me.clientFilterVal  = client;
									me.clientFilterDesc = clientDesc;
									me.clientCode = client;									
								}
								me.applySeekFilter();
							}
			},

			'avmSvmView avmSvmFilterView combobox[itemId=sellerFltId]' : {
				select : function(btn, opts) {
					me.resetAllFilters();
					me.changeFilterParams();
					me.setDataForFilter();
					me.applyFilter();
				}
			},
			'avmSvmView avmSvmFilterView combo[itemId=clientCodesFltId]' : {
				select : function(combo, records, eOpts) {
					if(userType == 0)
						me.selectedSeller = records[0].raw.SELLER_CODE;
					me.clientCode = combo.getValue();
					me.clientDesc = combo.getRawValue();
					me.changeFilterParams();
					me.setDataForFilter();
					me.applyFilter();
				},
				change : function(combo, newValue, oldValue, eOpts) {
					if (newValue == '' || null == newValue) {
						me.clientCode = '';
						me.clientDesc = '';
						me.changeFilterParams();
						me.setDataForFilter();
						me.applyFilter();
					}
				}
			},
			'avmSvmView avmSvmFilterView AutoCompleter[itemId=matrixNameFltId]' : {
				select : function(combo, opts) {
					me.setDataForFilter();
					me.applyFilter();
				},
				change : function(combo, newValue, oldValue, eOpts) {
					if (newValue == '' || null == newValue) {
						me.setDataForFilter();
						me.applyFilter();
					}
				}
			}
		});
	},
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) {
		var me = this;
		var objGroupView = me.getGroupView();
		objGroupView.reconfigureGrid(null);			

	},
	doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter, filterData) {
		
		var me = this;
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		objGroupView.handleGroupActionsVisibility(buttonMask);
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl += me.getFilterUrl(subGroupInfo, groupInfo);
		grid.loadGridData(strUrl, null, null, false);
	},
	doHandleRowActions : function(actionName, objGrid, record,rowIndex) {
		var me = this;
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();
		if (actionName === 'submit' || actionName === 'accept'
				|| actionName === 'enable' || actionName === 'disable'
				|| actionName === 'reject' || actionName === 'discard'){
			me.doHandleGroupActions(actionName, grid, [record], 'rowAction');
		}else if (actionName === 'btnHistory') {
			var recHistory = record.get('history');
			if (!Ext.isEmpty(recHistory)
					&& !Ext.isEmpty(recHistory.__deferred.uri)) {
				me.showHistory(record.get('axmName'),
						record.get('history').__deferred.uri, record
								.get('identifier'));
			}
		} else if (actionName === 'btnView') {
			me.submitExtForm('viewApprovalMatrix.form', record, rowIndex);
		} else if (actionName === 'btnEdit') {
			me.submitExtForm('editApprovalMatrix.form', record, rowIndex);
		}
	},
	doHandleGroupActions : function(strAction, grid, arrSelectedRecords,
			strActionType) {
		var me = this;
		if(!Ext.isEmpty(strAction))
			var strAction = strAction;
		var strUrl = Ext.String.format('services/authMatrixList/{0}',
				strAction);
		if (strAction === 'reject') {
			me.showRejectVerifyPopUp(strAction, strUrl,grid, arrSelectedRecords);

		} else {
			me.preHandleGroupActions(strUrl, '',grid,arrSelectedRecords);
		}
	},
	submitExtForm : function(strUrl, record, rowIndex) {
		var me = this;
		var viewState = record.data.identifier;
		var updateIndex = rowIndex;
		var form, inputField;

		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'txtRecordIndex', rowIndex));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
				viewState));

		form.action = strUrl;
		// Set Retaining Filter Parameters
		me.setFilterParameters(form);
		document.body.appendChild(form);
		form.submit();
	},
	handleClientChange : function(client, clientDesc) {
				var me = this;
			},
	resetAllFilters : function() {
		var me = this;
		if (!Ext.isEmpty(me.getClientCodesFltCombo())) {
			me.getClientCodesFltCombo().setValue('');
		}
		if (!Ext.isEmpty(me.getMatrixNameFltCombo())) {
			me.getMatrixNameFltCombo().setValue('');
			me.getMatrixNameFltCombo().setRawValue('');
		}
		if (!Ext.isEmpty(me.getMatrixTypeToolBar())) {
			me.matrixTypeVal = 'all';
			me.getMatrixTypeToolBar().items.each(function(item) {
						item.removeCls('xn-custom-heighlight');
						item.addCls('xn-account-filter-btnmenu');
					});
			var allBtn = me.getMatrixTypeToolBar()
					.down('button[btnId="allPaymentType"]');
			allBtn.addCls('xn-custom-heighlight');
		}
		return;
	},
	setFilterRetainedValues : function() {
		var me = this;
		var filterView = me.getAvmSvmFilterView();
		// set Matrix Name Filter Value
		var matrixNameFltId = filterView
				.down('combobox[itemId=matrixNameFltId]');
		matrixNameFltId.setValue(strMatrixName);

		// Set Client Name Filter Value
		var clientCodesFltId = filterView
				.down('combobox[itemId=clientCodesFltId]');
		if (userType == '0') {
			clientCodesFltId.suspendEvents();
			clientCodesFltId.setValue(filterClientDesc);
			clientCodesFltId.resumeEvents();
		} else {
			clientCodesFltId.setValue(strClientId);
			me.clientCode = strClientId;
		}

		// Set Matrix Type Filter Value
		var matrixTypeToolBar = filterView
				.down('toolbar[itemId="matrixTypeToolBar"]');
		matrixTypeToolBar.items.each(function(item) {
					item.removeCls('xn-custom-heighlight');
					item.addCls('xn-account-filter-btnmenu');

					if (item.code == filterMatrixType) {
						item.addCls('xn-custom-heighlight');
						me.matrixTypeVal = item.code;
					}

				});
		me.changeFilterParams();
	},

	/*
	 * The Function call on seller Drop down value chnages , and update seller
	 * param value of Client Auto Completer URL
	 */
	changeFilterParams : function() {
		var me = this;
		var avmSvmFilterView = me.getAvmSvmFilterView();
		var clientCodesFltId = avmSvmFilterView
				.down('combobox[itemId=clientCodesFltId]');
		var matrixNameAuto = avmSvmFilterView
				.down('AutoCompleter[itemId=matrixNameFltId]');

		if (!Ext.isEmpty(matrixNameAuto)) {
			matrixNameAuto.cfgExtraParams = new Array();
		}
		if (!Ext.isEmpty(clientCodesFltId)) {
			clientCodesFltId.cfgExtraParams = new Array();
		}

		var sellerCombo = avmSvmFilterView.down('combobox[itemId=sellerFltId]');

		if (!Ext.isEmpty(sellerCombo)) {
			clientCodesFltId.cfgExtraParams.push({
						key : '$sellerId',
						value : sellerCombo.getValue()
					});

			matrixNameAuto.cfgExtraParams.push({
						key : '$sellerId',
						value : sellerCombo.getValue()
					});
		} else {
			clientCodesFltId.cfgExtraParams.push({
						key : '$sellerId',
						value : strSellerId
					});

			matrixNameAuto.cfgExtraParams.push({
						key : '$sellerId',
						value : strSellerId
					});
		}
		if (!Ext.isEmpty(clientCodesFltId)) {
			matrixNameAuto.cfgExtraParams.push({
						key : '$clientId',
						value : me.clientCode
					});
		} else {
			matrixNameAuto.cfgExtraParams.push({
						key : '$clientId',
						value : strClientId
					});
		}
	},
	handleGridHeader : function() {
		var me = this;
	//	var gridHeaderPanel = me.getGridHeader();
		var createNewPanel = me.getCreateNewToolBar();
	/*	if (!Ext.isEmpty(gridHeaderPanel)) {
			gridHeaderPanel.removeAll();
		}*/
		if (!Ext.isEmpty(createNewPanel)) {
			createNewPanel.removeAll();
		}

		createNewPanel.add({
					xtype : 'button',
					border : 0,
					glyph : 'xf055@fontawesome',
					cls : 'ux_font-size14 xn-content-btn ux-button-s ',
					text : getLabel('createNewMatrix', 'Create New : Matrix'),
					parent : this,
					itemId : 'btnCreateNewMatrix'
				});

	},
	handleMatrixType : function(btn) {
		var me = this;
		var matrixTypeToolBarRef = me.getAvmSvmFilterView()
				.down('toolbar[itemId="matrixTypeToolBar"]');
		if (matrixTypeToolBarRef)
			var matrixTypeToolBar = matrixTypeToolBarRef;

		matrixTypeToolBar.items.each(function(item) {
					item.removeCls('xn-custom-heighlight');
					item.addCls('xn-account-filter-btnmenu');
				});
		btn.addCls('xn-custom-heighlight');
		me.matrixTypeVal = btn.code;
		me.setDataForFilter();
		me.applyFilter();
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		me.setDataForFilter();
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + me.getFilterUrl();
		grid.setLoading(true);
		grid.loadGridData(strUrl, null);
	},
	getFilterUrl : function(subGroupInfo, groupInfo) {
		var me = this;
		var strQuickFilterUrl = '';
		var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
		? subGroupInfo.groupQuery
		: '';
		strQuickFilterUrl = me.generateUrlWithFilterParams();
		if (!Ext.isEmpty(strGroupQuery)) {
			if (!Ext.isEmpty(strQuickFilterUrl))
				strQuickFilterUrl += ' and ' + strGroupQuery;
			else
				strQuickFilterUrl += '&$filter=' + strGroupQuery;
		}
		return strQuickFilterUrl;
	},
	generateUrlWithFilterParams : function() {
		var me = this;
		var filterData = me.filterData;
		var isFilterApplied = false;
		var strFilter = '&$filter=';
		var strTemp = '';
		var strFilterParam = '';
		for (var index = 0; index < filterData.length; index++) {
			if (isFilterApplied)
				strTemp = strTemp + ' and ';
			switch (filterData[index].operatorValue) {
				case 'bt' :
					strTemp = strTemp + filterData[index].paramName + ' '
							+ filterData[index].operatorValue + ' ' + '\''
							+ filterData[index].paramValue1 + '\'' + ' and '
							+ '\'' + filterData[index].paramValue2 + '\'';
					break;
				case 'in' :
					var arrId = filterData[index].paramValue1;
					if (0 != arrId.length) {
						strTemp = strTemp + '(';
						for (var count = 0; count < arrId.length; count++) {
							strTemp = strTemp + filterData[index].paramName
									+ ' eq ' + '\'' + arrId[count] + '\'';
							if (count != arrId.length - 1) {
								strTemp = strTemp + ' or ';
							}
						}
						strTemp = strTemp + ' ) ';
					}
					break;
				default :
					// Default opertator is eq
					strTemp = strTemp + filterData[index].paramName + ' '
							+ filterData[index].operatorValue + ' ' + '\''
							+ filterData[index].paramValue1 + '\'';
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
	setDataForFilter : function() {
		var me = this;
		this.filterData = this.getFilterQueryJson();
	},
	getFilterQueryJson : function() {
		var me = this;
		var sellerVal = null, matrixNameVal = null, matrixTypeVal = null, clientCodeVal = null, subCategoryVal = null, jsonArray = [];
		var clientParamName = null, clientNameOperator = null;

		var avmSvmFilterView = me.getAvmSvmFilterView();
		var sellerFltId = avmSvmFilterView.down('combobox[itemId=sellerFltId]');

		var matrixNameFltId = avmSvmFilterView
				.down('combobox[itemId=matrixNameFltId]');

		var clientCodesFltId = avmSvmFilterView
				.down('combobox[itemId=clientCodesFltId]');

		if (!Ext.isEmpty(sellerFltId) && !Ext.isEmpty(sellerFltId.getValue())
				&& "ALL" != sellerFltId.getValue()) {
			sellerVal = sellerFltId.getValue();
		}

		if (!Ext.isEmpty(sellerVal)) {
			jsonArray.push({
						paramName : sellerFltId.filterParamName,
						paramValue1 : sellerVal.toUpperCase(),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}

		if (!Ext.isEmpty(matrixNameFltId)
				&& !Ext.isEmpty(matrixNameFltId.getValue())) {
			matrixNameVal = matrixNameFltId.getValue();
		}

		if (!Ext.isEmpty(matrixNameVal)) {
			jsonArray.push({
						paramName : matrixNameFltId.name,
						paramValue1 : matrixNameVal,
						operatorValue : 'lk',
						dataType : 'S'
					});
		}

		if (!Ext.isEmpty(clientCodesFltId)
				&& !Ext.isEmpty(clientCodesFltId.getValue()) && userType == 0) {
			clientParamName = 'clientId';
			clientNameOperator = 'eq';
			if (!Ext.isEmpty(me.clientCode)) {
				clientCodeVal = me.clientCode;
			} else {
				clientCodeVal = strClientId;
			}

			if (!Ext.isEmpty(clientCodeVal)) {
				jsonArray.push({
							paramName : clientParamName,
							paramValue1 : clientCodeVal,
							operatorValue : clientNameOperator,
							dataType : 'S'
						});
			}
		}

		if (!Ext.isEmpty(me.matrixTypeVal) && "all" != me.matrixTypeVal) {
			matrixTypeVal = me.matrixTypeVal;
		}

		if (!Ext.isEmpty(matrixTypeVal)) {
			jsonArray.push({
						paramName : 'matrixType',
						paramValue1 : matrixTypeVal,
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		if (!Ext.isEmpty(me.clientFilterVal) &&  me.clientFilterVal !== null) 
		{
			jsonArray.push({
					paramName : 'clientId',
					operatorValue : 'eq',
					paramValue1 : me.clientFilterVal,
					dataType :'S'
			});
			//me.clientFilterVal = clientCodeCalue;
		}
		return jsonArray;
	},
	applyFilter : function() {
		var me=this;
		var objGroupView = me.getGroupView();
		var groupInfo = objGroupView.getGroupInfo();
		me.refreshData();
	},
	
	showHistory : function(matrixName, url, id) {
		Ext.create('GCP.view.HistoryPopup', {
					historyUrl : url,
					identifier : id,
					matrixName : matrixName
				}).show();
	},

	doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid,
			objRecord, intRecordIndex, arrSelectedRecords, jsonData) {
		var me = this;
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		var maskArray = new Array(), actionMask = '', objData = null;;

		if (!Ext.isEmpty(jsonData)
				&& !Ext.isEmpty(jsonData.d.__buttonMask))
			buttonMask = jsonData.d.__buttonMask;
			
		var isSameUser = true;
		var isDisabled = false;
		var isSubmit = false;
		maskArray.push(buttonMask);
		for (var index = 0; index < arrSelectedRecords.length; index++) {
			objData = arrSelectedRecords[index];
			maskArray.push(objData.get('__metadata').__rightsMap);
			if (objData.raw.makerId === USER) {
				isSameUser = false;
			}
			if (objData.raw.validFlag != 'Y') {
				isDisabled = true;
			}
			if (objData.raw.isSubmitted == 'Y' && objData.raw.requestState == 0) {
				isSubmit = true;
			}
		}
		actionMask = doAndOperation(maskArray, 10);
		me.enableDisableGroupActions(actionMask, isSameUser, isDisabled,
				isSubmit);
	},

	enableDisableGroupActions : function(actionMask, isSameUser, isDisabled,
			isSubmit) {
		var me=this;		
		var objGroupView = me.getGroupView();
		var actionBar = objGroupView.down('toolbar[itemId="groupActionToolBar"]');
		var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
		if (!Ext.isEmpty(actionBar) && !Ext.isEmpty(actionBar.items.items)) {
			arrItems = actionBar.items.items;
			Ext.each(arrItems, function(item) {
						strBitMapKey = parseInt(item.maskPosition,10) - 1;
						if (strBitMapKey) {
							blnEnabled = isActionEnabled(actionMask,
									strBitMapKey);

							if ((item.maskPosition === 6 && blnEnabled)) {
								blnEnabled = blnEnabled && isSameUser;
							} else if (item.maskPosition === 7 && blnEnabled) {
								blnEnabled = blnEnabled && isSameUser;
							} else if (item.maskPosition === 8 && blnEnabled) {
								blnEnabled = blnEnabled && isDisabled;
							} else if (item.maskPosition === 9 && blnEnabled) {
								blnEnabled = blnEnabled && !isDisabled;
							} else if (item.maskPosition === 10 && blnEnabled) {
								blnEnabled = blnEnabled && !isSubmit;
							}
							item.setDisabled(!blnEnabled);
						}
					});
		}
	},
	showRejectVerifyPopUp : function(strAction, strActionUrl,grid,record) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		if (strAction === 'reject') {
			titleMsg = getLabel('prfRejectRemarkPopUpTitle',
					'Please Enter Reject Remark');
			fieldLbl = getLabel('prfRejectRemarkPopUpFldLbl', 'Reject Remark');
		}
		Ext.Msg.show({
					title : titleMsg,
					msg : fieldLbl,
					buttons : Ext.Msg.OKCANCEL,
					multiline : 4,
					style : {
						height : 400
					},
					cls:'ux_popup',
					bodyPadding : 0,
					fn : function(btn, text) {
						if (btn == 'ok') {
							me.preHandleGroupActions(strActionUrl, text,grid,record);
						}
					}
				});
	},

	preHandleGroupActions : function(strUrl, remark,grid, arrSelectedRecords) {
		var me = this;
		var groupView = me.getGroupView();
		if (!Ext.isEmpty(groupView)) {
			var arrayJson = new Array();
			var records = (arrSelectedRecords || []);
			for (var index = 0; index < records.length; index++) {
				arrayJson.push({
							serialNo : grid.getStore().indexOf(records[index])
									+ 1,
							identifier : records[index].data.identifier,
							userMessage : remark
						});
			}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});

			Ext.Ajax.request({
						url : strUrl,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							var errorMessage = '';
							if (response.responseText != '[]') {
								var jsonData = Ext
										.decode(response.responseText);
								Ext.each(jsonData[0].errors, function(error,
												index) {
											errorMessage = errorMessage
													+ error.errorMessage
													+ "<br/>";
										});
								if ('' != errorMessage && null != errorMessage) {
									Ext.Msg.alert("Error", errorMessage);
								}
							}
							me.enableDisableGroupActions('0000000000', true);
						//	grid.refreshData();
							groupView.setLoading(false);
								groupView.refreshData();
						},
						failure : function() {
							var errMsg = "";
							Ext.MessageBox.show({
										title : getLabel(
												'instrumentErrorPopUpTitle',
												'Error'),
										msg : getLabel(
												'instrumentErrorPopUpMsg',
												'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
						}
					});
		}

	},	
	/**
	 * Finds all strings that matches the searched value in each grid cells.
	 * 
	 * @private
	 */
	searchOnPage : function() {
		var me = this;
		var searchValue = me.getSearchTextInput().value;
		var anyMatch = me.getMatchCriteria().getValue();
		if ('anyMatch' === anyMatch.searchOnPage) {
			anyMatch = false;
		} else {
			anyMatch = true;
		}

		var grid = me.getGrid();
		grid.view.refresh();

		// detects html tag
		var tagsRe = /<[^>]*>/gm;
		// DEL ASCII code
		var tagsProtect = '\x0f';
		// detects regexp reserved word
		var regExpProtect = /\\|\/|\+|\\|\.|\[|\]|\{|\}|\?|\$|\*|\^|\|/gm;

		if (searchValue !== null) {
			searchRegExp = new RegExp(searchValue, 'g' + (anyMatch ? '' : 'i'));

			if (!Ext.isEmpty(grid)) {
				var store = grid.store;

				store.each(function(record, idx) {
					var td = Ext.fly(grid.view.getNode(idx)).down('td'), cell, matches, cellHTML;
					while (td) {
						cell = td.down('.x-grid-cell-inner');
						matches = cell.dom.innerHTML.match(tagsRe);
						cellHTML = cell.dom.innerHTML.replace(tagsRe,
								tagsProtect);

						if (cellHTML === '&nbsp;') {
							td = td.next();
						} else {
							// populate indexes array, set currentIndex, and
							// replace
							// wrap matched string in a span
							cellHTML = cellHTML.replace(searchRegExp, function(
											m) {
										return '<span class="xn-livesearch-match">'
												+ m + '</span>';
									});
							// restore protected tags
							Ext.each(matches, function(match) {
								cellHTML = cellHTML.replace(tagsProtect, match);
							});
							// update cell html
							cell.dom.innerHTML = cellHTML;
							td = td.next();
						}
					}
				}, me);
			}
		}
	},
	handleMatrixEntryAction : function() {
		var me = this;
		var form;
		var selectedClient = null;
		var strUrl = 'addApprovalMatrix.form';
		var avmSvmFilterView = me.getAvmSvmFilterView();
		var sellerCombo = avmSvmFilterView.down('combobox[itemId=sellerFltId]');
		var clientCodesFltId = avmSvmFilterView
				.down('combobox[itemId=clientCodesFltId]');
		//var selectedSeller = sellerCombo.getValue();

		selectedClient = clientCodesFltId.getValue();

		var errorMsg = null;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'sellerId',
				me.selectedSeller));

		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'clientId',
				selectedClient));
		me.setFilterParameters(form);
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},

	/* Function sets the filter Panel element values in JSON */
	setFilterParameters : function(form) {
		var me = this;
		var matrixTypeVal = null;
		var matrixNameVal = null;
		var arrJsn = {};
		var avmSvmFilterView = me.getAvmSvmFilterView();
		var sellerCombo = avmSvmFilterView.down('combobox[itemId=sellerFltId]');
		var clientCodesFltId = avmSvmFilterView
				.down('combobox[itemId=clientCodesFltId]');
		var matrixNameFltId = avmSvmFilterView
				.down('combobox[itemId=matrixNameFltId]');
		var selectedClient = clientCodesFltId.getValue();
		if (!Ext.isEmpty(me.matrixTypeVal) && "all" != me.matrixTypeVal) {
			matrixTypeVal = me.matrixTypeVal;
		}
		if (!Ext.isEmpty(matrixNameFltId)
				&& !Ext.isEmpty(matrixNameFltId.getValue())) {
			matrixNameVal = matrixNameFltId.getValue();
		}
		arrJsn['sellerId'] = me.selectedSeller;
		arrJsn['clientId'] = selectedClient;
		arrJsn['clientDesc'] = clientCodesFltId.getRawValue();
		arrJsn['matrixType'] = matrixTypeVal;
		arrJsn['matrixName'] = matrixNameVal;
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'filterData',
				Ext.encode(arrJsn)));
	},

	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	setInfoTooltip : function() {
		var me = this;
		var infotip = Ext.create('Ext.tip.ToolTip', {
					target : 'imgFilterInfo',
					listeners : {
						// Change content dynamically depending on which element
						// triggered the show.
						beforeshow : function(tip) {
							var seller = '';
							var client = '';
							var authtype = '';
							var matrixname = '';

							var avmSvmFilterView = me.getAvmSvmFilterView();
							var sellerFltId = avmSvmFilterView
									.down('combobox[itemId=sellerFltId]');
							var matrixNameFltId = avmSvmFilterView
									.down('combobox[itemId=matrixNameFltId]');
							var clientCodesFltId = avmSvmFilterView
									.down('combobox[itemId=clientCodesFltId]');

							if (!Ext.isEmpty(matrixNameFltId)
									&& !Ext.isEmpty(matrixNameFltId.getValue())) {
								matrixname = matrixNameFltId.getValue();
							} else {
								matrixname = getLabel('none', 'None');
							}							
							if (!Ext.isEmpty(clientCodesFltId)	&& !Ext.isEmpty(me.clientFilterDesc)) {
								client = me.clientFilterDesc;							
							} else {
								client = getLabel('allCompanies', 'All Companies');		
							}
							if (!Ext.isEmpty(me.matrixTypeVal)
									&& "all" != me.matrixTypeVal) {
								if (me.matrixTypeVal == 0)
									authtype = getLabel('authorization',
											'Authorization');
								else
									authtype = getLabel('signatory',
											'Signatory');
							} else {
								authtype = getLabel('all', 'ALL');
							}

							tip.update(getLabel("matrixType","Matrix Type")
												+ ' : '	
												+ authtype+ '<br/>'
												+ getLabel("clientName",
														"Client Name")+ ' : '
												+ client+ '<br/>'
												+ getLabel("matrixName",
														"Matrix Name")
												+ ' : '
												+ matrixname);
							
							
				
						}
					}
				});
	},
	applySeekFilter : function()
	{
		var me = this;
		me.setDataForFilter();
		//me.filterApplied = 'Q';
		me.applyFilter();
	},
	applyQuickFilter : function()
	{
		var me = this;
		me.getAvmSvmGrid().refreshData();
	},
	refreshData : function() {
		var me = this;
		var objGroupView = me.getGroupView();
		var grid = objGroupView.getGrid();
		if(grid){
			grid.removeAppliedSort();
		}
		objGroupView.refreshData();
	}

});