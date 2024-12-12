Ext.define('GCP.controller.LiquidityReferenceTimeMstController', {
	extend : 'Ext.app.Controller',
	requires : [],
	views : ['GCP.view.LiquidityRefTimeView', 'GCP.view.LiquidityRefTimeGridView','GCP.view.HistoryPopup','GCP.view.AddLiquidityRefTimePopup'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'liquidityRefTimeView',
				selector : 'liquidityRefTimeView'
			}, {
				ref : 'createNewToolBar',
				selector : 'liquidityRefTimeView liquidityRefTimeGridView toolbar[itemId="btnCreateNewToolBar"]'
			},{
				ref : 'specificFilterPanel',
				selector : 'liquidityRefTimeView liquidityRefTimeFilterView panel[itemId="specificFilter"]'
			},{
				ref : 'liquidityRefTimeGridView',
				selector : 'liquidityRefTimeView liquidityRefTimeGridView'
			}, {
				ref : 'liquidityRefTimeDtlView',
				selector : 'liquidityRefTimeView liquidityRefTimeGridView panel[itemId="liquidityRefTimeDtlView"]'
			}, {
				ref : 'gridHeader',
				selector : 'liquidityRefTimeView liquidityRefTimeGridView panel[itemId="liquidityRefTimeDtlView"] container[itemId="gridHeader"]'
			}, {
				ref : 'liquidityRefTimeGrid',
				selector : 'liquidityRefTimeView liquidityRefTimeGridView grid[itemId="gridViewMstId"]'
			},{
				ref : 'searchTextInput',
				selector : 'liquidityRefTimeGridView textfield[itemId="searchTextField"]'
			}, {
				ref : 'matchCriteria',
				selector : 'liquidityRefTimeGridView radiogroup[itemId="matchCriteria"]'
			},{
				ref : 'grid',
				selector : 'liquidityRefTimeGridView smartgrid'
			},{
				ref : "sellerCombo",
				selector : 'liquidityRefTimeView liquidityRefTimeFilterView combobox[itemId="sellerFltId"]'
			},{
				ref : "statusFilter",
				selector : 'liquidityRefTimeView liquidityRefTimeFilterView combobox[itemId="statusFilter"]'
			}, {
				ref : 'groupActionBar',
				selector : 'liquidityRefTimeView liquidityRefTimeGridView liquidityRefTimeActionBarView'
			},
				{
				ref : 'profileNameField',
				selector : 'liquidityRefTimeView liquidityRefTimeFilterView AutoCompleter[itemId=profileName]'
			},{
				ref : 'addLiquidityRefTimePopup',
				selector : 'addLiquidityRefTimePopup'
			},{
				ref : 'refTimeHoursCombo',
				selector : 'addLiquidityRefTimePopup combo[itemId="refTimeHoursCombo"]'
			},{
				ref : 'refMinCombo',
				selector : 'addLiquidityRefTimePopup combo[itemId="refMinCombo"]'
			},{
				ref : 'refSecCombo',
				selector : 'addLiquidityRefTimePopup combo[itemId="refSecCombo"]'
			},{
				ref : 'freqNameField',
				selector : 'addLiquidityRefTimePopup textfield[itemId="freqNameField"]'
			}
			],
	config : {
		filterData : []
	},
	init : function() {
		var me = this;
		
		me.control({
			'liquidityRefTimeView liquidityRefTimeGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateLiquidityRefTimeProfile"]' : {
				click : function() {
					me.handleLiquidityReferenceTimeEntryAction(true);
				}
			},
			'liquidityRefTimeView liquidityRefTimeFilterView' : {
				render : function() {
					me.setInfoTooltip();
					me.handleSpecificFilter();
				}
			},
			'liquidityRefTimeView liquidityRefTimeFilterView button[itemId="btnFilter"]' : {
				click : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
				}
			},
			'liquidityRefTimeView liquidityRefTimeGridView panel[itemId="liquidityRefTimeDtlView"]' : {
				render : function() {
					me.handleGridHeader();
					
				}
			},
			'liquidityRefTimeView toolbar[itemId="btnActionToolBar"] button[itemId="btnClientList"]' : {
				click : function() {
					me.filterData = [];
					me.handleSpecificFilter();
					me.handleGridHeader();
				}
			},

			'liquidityRefTimeGridView' : {
				render : function(panel) {
					me.handleSmartGridConfig();
				}
			},
			'liquidityRefTimeGridView textfield[itemId="searchTextField"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'liquidityRefTimeGridView radiogroup[itemId="matchCriteria"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'liquidityRefTimeGridView smartgrid' : {
				render : function(grid) {
					me.handleLoadGridData(grid, grid.store.dataUrl,
							grid.pageSize, 1, 1, null);
				},
				gridPageChange : me.handleLoadGridData,
				gridSortChange : me.handleLoadGridData,
				gridRowSelectionChange : function(grid, record, recordIndex,
						records, jsonData) {
					me.enableValidActionsForGrid(grid, record, recordIndex,
							records, jsonData);
				}
			},
			'liquidityRefTimeGridView toolbar[itemId=groupActionBarView]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			},
			'addLiquidityRefTimePopup button[itemId="btnSubmitRefTime"]' : {
				submitUpdateReferenceTime : function(identifier, mode) {
					//console.log("in");
					me.submitUpdateReferenceTime(identifier, mode);
				}
			}

		});
	},
	
	handleSpecificFilter : function() {
		var me = this;
		me.getSearchTextInput().setValue('');
		me.getStatusFilter().setValue('');
		var objStore = Ext.create('Ext.data.Store', {
					fields : ['value','name'],
					proxy : {
						type : 'ajax',
						autoLoad : true,
						url : 'services/interestProfileMasterSeek/sellerList.json',
						reader : {
							type : 'json',
							root : 'filterList'
						}								
					}
				});
		
		var profileNameAutoField = Ext.create('Ext.ux.gcp.AutoCompleter', {
					padding : '1 0 0 5',
					fieldCls : 'xn-form-text w14 xn-suggestion-box',
					name : 'profileName',
					itemId : 'profileName',
					cfgUrl : 'cpon/cponseek/{0}.json',
					cfgProxyMethodType : 'POST',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgSeekId : 'frequencynameseek',
					cfgRootNode : 'd.filter',
					cfgDataNode1 : 'name'
				});
		
		var filterPanel = me.getSpecificFilterPanel();
		if (!Ext.isEmpty(filterPanel))
		{
			filterPanel.removeAll();
		}
		
			filterPanel.add({
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						layout : 'vbox',
						flex : 1,
						items : [{
									xtype : 'label',
									text : getLabel('seller',
											'Seller'),
									cls : 'f13 ux_font-size14',
									padding : '4 0 0 6'
								},{
									xtype : 'combo',
									padding : '1 5 1 5',
									width : 163,
									displayField : 'name',
									fieldCls : 'xn-form-field inline_block',
									triggerBaseCls : 'xn-form-trigger',
									filterParamName : 'sellerId',
									itemId : 'sellerFltId',
									valueField : 'value',
									name : 'sellerCombo',
									editable : false,
									store : objStore,
									value : strSellerId
								}]
					}, {
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						layout : 'vbox',
						flex : 1,
						items : [{
									xtype : 'label',
									text : getLabel('frequencyName','Frequency Name'),
									cls : 'f13 ux_font-size14',
									padding : '4 0 0 6'
								}, profileNameAutoField]
						});
					//	filterPanel.columnWidth = 0.45;
					
		
		
	},
	handleGridHeader : function() {
		var me = this;
		var gridHeaderPanel = me.getGridHeader();
		var createNewPanel = me.getCreateNewToolBar();
		if (!Ext.isEmpty(createNewPanel))
		{
			createNewPanel.removeAll();
		}
/*createNewPanel.add(
							{
							xtype : 'label',
							text : getLabel('createNew','Create New'),
							cls : 'f13'
							}
							);*/
		createNewPanel.add(
			{
							
							xtype : 'button',
							border : 0,
							glyph : 'xf055@fontawesome',
							//text : getLabel('createNew','Create New'),
							text : getLabel('', 'Creare New Reference Time'),
							cls : 'cursor_pointer xn-btn ux-button-s ux_button-padding',
							parent : this,
							padding : '4 0 2 0',
							itemId : 'btnCreateLiquidityRefTimeProfile'
						}
		);
	},

	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		grid.loadGridData(strUrl, null);
	},
	
	getFilterUrl : function() {
		var me = this;
		var strQuickFilterUrl = '';
		strQuickFilterUrl = me.generateUrlWithFilterParams(this);
		return strQuickFilterUrl;
	},
	
	generateUrlWithFilterParams : function(thisClass) {
		var filterData = thisClass.filterData;
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
		me.getSearchTextInput().setValue('');
		var profileName = null, statusVal = null,jsonArray = [];
		var sellerVal = null;
		
		var sellerFltId = me.getSellerCombo();
		if (!Ext.isEmpty(sellerFltId) && !Ext.isEmpty(sellerFltId.getValue())
				&& "ALL" != sellerFltId.getValue()) {
			sellerVal = sellerFltId.getValue();
		}
		
		var profileNameFieldRef=me.getProfileNameField();
		if (!Ext.isEmpty(profileNameFieldRef)){
			if(!Ext.isEmpty(profileNameFieldRef.getValue())){
			profileName = profileNameFieldRef.getValue();
			}
		}
		
		if (!Ext.isEmpty(me.getStatusFilter())
				&& !Ext.isEmpty(me.getStatusFilter().getValue())
				&& "ALL" != me.getStatusFilter().getValue()) {
			statusVal = me.getStatusFilter().getValue();
			
			var strInFlag = false;
			if (statusVal == 12 || statusVal == 3) {
				if (statusVal == 12) // Submitted
				{
					statusVal = new Array(0, 1);
					jsonArray.push({
								paramName : 'isSubmitted',
								paramValue1 : 'Y',
								operatorValue : 'eq',
								dataType : 'S'
							});
					strInFlag = true;
				} else // Valid/Authorized
				{
					jsonArray.push({
								paramName : 'validFlag',
								paramValue1 : 'Y',
								operatorValue : 'eq',
								dataType : 'S'
							});
				}
			} else if (statusVal == 11) // Disabled
			{
				statusVal = 3;
				jsonArray.push({
							paramName : 'validFlag',
							paramValue1 : 'N',
							operatorValue : 'eq',
							dataType : 'S'
						});
			}  
			else if (statusVal == 0 || statusVal == 1) // New and Modified
			{
				jsonArray.push({
							paramName : 'isSubmitted',
							paramValue1 : 'N',
							operatorValue : 'eq',
							dataType : 'S'
						});
			}
			if (strInFlag) // Used for Submitted & Rejected status
			{
				jsonArray.push({
							paramName : me.getStatusFilter().filterParamName,
							paramValue1 : statusVal,
							operatorValue : 'in',
							dataType : 'S'
						});
			} else {
				jsonArray.push({
							paramName : me.getStatusFilter().filterParamName,
							paramValue1 : statusVal,
							operatorValue : 'eq',
							dataType : 'S'
						});
			}
		}

		if (!Ext.isEmpty(profileName)) {
			jsonArray.push({
						paramName : 'frequencyName',
						paramValue1 : profileName,
						operatorValue : 'lk',
						dataType : 'S'
					});
		}
		
		if (!Ext.isEmpty(sellerVal)) {
			jsonArray.push({
						paramName : sellerFltId.filterParamName,
						paramValue1 : sellerVal.toUpperCase(),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		me.filterData = jsonArray;
	},
	applyFilter : function() {
		var me = this;
		var grid = me.getGrid();
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
					store.sorters);
			strUrl = strUrl + me.getFilterUrl();
			me.getGrid().setLoading(true);
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
		}
	},
	handleSmartGridConfig : function() {
		var me = this;
		var liquidityRefTimeGrid = me.getLiquidityRefTimeGrid();
		var objConfigMap = me.getLiquidityRefTimeGridConfiguration();
		var arrCols = new Array();
		if (!Ext.isEmpty(liquidityRefTimeGrid))
			liquidityRefTimeGrid.destroy(true);

		arrCols = me.getColumns(objConfigMap.arrColsPref,
				objConfigMap.objWidthMap);
		me.handleSmartGridLoading(arrCols, objConfigMap.storeModel);

	},

	handleSmartGridLoading : function(arrCols, storeModel) {
		var me = this;
		var pgSize = null;
		pgSize = 10;
		var liquidityRefTimeGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
					id : 'gridViewMstId',
					itemId : 'gridViewMstId',
					pageSize : pgSize,
					stateful : false,
					showEmptyRow : false,
					padding : '0 10 10 10',
					rowList : [5, 10, 15, 20, 25, 30],
					minHeight : 0,
					columnModel : arrCols,
					storeModel : storeModel,
					isRowIconVisible : me.isRowIconVisible,
//					isRowMoreMenuVisible : me.isRowMoreMenuVisible,
					handleRowMoreMenuClick : me.handleRowMoreMenuClick,

			handleRowIconClick : function(tableView, rowIndex, columnIndex,
					btn, event, record) {
				me.handleRowIconClick(tableView, rowIndex, columnIndex, btn,
						event, record);
			},

			handleMoreMenuItemClick : function(grid, rowIndex, cellIndex,
											menu, event, record) {
				var dataParams = menu.dataParams;
				me.handleRowIconClick(dataParams.view, dataParams.rowIndex,
						dataParams.columnIndex, menu, null, dataParams.record);
			}
	    });

		var liquidityRefTimeDtlView = me.getLiquidityRefTimeDtlView();
		liquidityRefTimeDtlView.add(liquidityRefTimeGrid);
		liquidityRefTimeDtlView.doLayout();
	},
	
	handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event,
			record) {
		var me = this;
		var actionName = btn.itemId;
		if (actionName === 'submit' || actionName === 'accept'
				|| actionName === 'enable' || actionName === 'disable'
				|| actionName === 'reject' || actionName === 'discard')
			me.handleGroupActions(btn, record);
		else if (actionName === 'btnHistory') {
			var recHistory = record.get('history');
			if (!Ext.isEmpty(recHistory)&& !Ext.isEmpty(recHistory.__deferred.uri)) {
				me.showHistory(record.get('profileName'),record.get('history').__deferred.uri, record.get('identifier'));
			}
		} else if (actionName === 'btnView') {
			me.showAddLiquidityReferenceTimePopup('VIEW',rowIndex);
		} else if (actionName === 'btnEdit') {
			me.showAddLiquidityReferenceTimePopup('EDIT',rowIndex);
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
		document.body.appendChild(form);
		form.submit();
	},
			
	showHistory : function(product ,url, id) {
		Ext.create('GCP.view.HistoryPopup', {
					productName : product,
					historyUrl : url,
					identifier : id
				}).show();
	},
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var maskSize = 11;
		var maskArray = new Array();
		var actionMask = '';
		var rightsMap = record.data.__metadata.__rightsMap;
		var buttonMask = '';
		var retValue = true;
		var bitPosition = '';
		if (!Ext.isEmpty(maskPosition)) {
			bitPosition = parseInt(maskPosition,10) - 1;
			maskSize = maskSize;
		}
		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask))
			buttonMask = jsonData.d.__buttonMask;
		maskArray.push(buttonMask);
		maskArray.push(rightsMap);
		actionMask = doAndOperation(maskArray, maskSize);
		var isSameUser = true;
		if (record.raw.makerId === USER) {
			isSameUser = false;
		}
		if (Ext.isEmpty(bitPosition))
			return retValue;
		retValue = isActionEnabled(actionMask, bitPosition);
		if ((maskPosition === 6 && retValue)) {
			retValue = retValue && isSameUser;
		} else if (maskPosition === 7 && retValue) {
			retValue = retValue && isSameUser;
		} else if (maskPosition === 2 && retValue) {
			var reqState = record.raw.requestState;
			var submitFlag = record.raw.isSubmitted;
			var validFlag = record.raw.validFlag;
			var isDisabled = (reqState === 3 && validFlag == 'N');
			var isSubmitModified = (reqState === 1 && submitFlag == 'Y');
			retValue = retValue && (!isDisabled) && (!isSubmitModified);
		} else if (maskPosition === 10 && retValue) {
			var reqState = record.raw.requestState;
			var submitFlag = record.raw.isSubmitted;
			var submitResult = (reqState === 0 && submitFlag == 'Y');
			retValue = retValue && (!submitResult);
		}else if (maskPosition === 8 && retValue) {
			var validFlag = record.raw.validFlag;
			var reqState = record.raw.requestState;
			retValue = retValue && (reqState == 3 && validFlag == 'N');
		}
		else if (maskPosition === 9 && retValue) {
			var validFlag = record.raw.validFlag;
			var reqState = record.raw.requestState;
			retValue = retValue && (reqState == 3 && validFlag == 'Y');
		}
		return retValue;
	},

	getColumns : function(arrColsPref, objWidthMap) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		arrCols.push(me.createGroupActionColumn());
		arrCols.push(me.createActionColumn())
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
					cfgCol.sortable = objCol.sortable;
				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;

				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},

	createActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'action',
			width : 80,
			locked : true,
			items : [{
						itemId : 'btnEdit',
						itemCls : 'grid-row-action-icon icon-edit',
						toolTip : getLabel('editToolTip', 'Edit'),
						maskPosition : 2
					}, {
						itemId : 'btnView',
						itemCls : 'grid-row-action-icon icon-view',
						toolTip : getLabel('viewToolTip', 'View Record'),
						maskPosition : 3
					}, {
						itemId : 'btnHistory',
						itemCls : 'grid-row-action-icon icon-history',
						itemLabel : getLabel('historyToolTip',
								'View History'),
						maskPosition : 4
					}]
		};
		return objActionCol;
		
	},
	
	handleRowMoreMenuClick : function(tableView, rowIndex, columnIndex, btn,
			event, record) {
		var me = this;
		var menu = btn.menu;
		var arrMenuItems = null;
		var blnRetValue = true;
		var store = tableView.store;
		var jsonData = store.proxy.reader.jsonData;

		btn.menu.dataParams = {
			'record' : record,
			'rowIndex' : rowIndex,
			'columnIndex' : columnIndex,
			'view' : tableView
		};
		if (!Ext.isEmpty(menu.items) && !Ext.isEmpty(menu.items.items))
			arrMenuItems = menu.items.items;
		if (!Ext.isEmpty(arrMenuItems)) {
			for (var a = 0; a < arrMenuItems.length; a++) {
				blnRetValue = me.isRowIconVisible(store, record, jsonData,
						null, arrMenuItems[a].maskPosition);
				arrMenuItems[a].setVisible(blnRetValue);
			}
		}
		menu.showAt(event.xy[0] + 5, event.xy[1] + 5);
	},

	createGroupActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'groupaction',
			width : 120,
			locked : true,
			items: [{
						text : getLabel('prfMstActionSubmit', 'Submit'),
						itemId : 'submit',
						actionName : 'submit',
						maskPosition : 5
					}, {
						text : getLabel('prfMstActionDiscard', 'Discard'),
						itemId : 'discard',
						actionName : 'discard',
						maskPosition : 10
					}, {
						text : getLabel('prfMstActionApprove', 'Approve'),
						itemId : 'accept',
						actionName : 'accept',
						maskPosition : 6
					}, {
						text : getLabel('prfMstActionReject', 'Reject'),
						itemId : 'reject',
						actionName : 'reject',
						maskPosition : 7
					}, {
						text : getLabel('prfMstActionEnable', 'Enable'),
						itemId : 'enable',
						actionName : 'enable',
						maskPosition : 8
					}, {
						text : getLabel('prfMstActionDisable',	'Disable'),
						itemId : 'disable',
						actionName : 'disable',
						maskPosition : 9
					}]
		};
		return objActionCol;
	},
	
	enableValidActionsForGrid : function(grid, record, recordIndex,
			selectedRecords, jsonData) {
		var me = this;
		var buttonMask = '0000000000';
		var maskArray = new Array(), actionMask = '', objData = null;;

		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask)) {
			buttonMask = jsonData.d.__buttonMask;
		}
		var isSameUser = true;
		var isDisabled = false;
		var isSubmit = false;
		maskArray.push(buttonMask);
		for (var index = 0; index < selectedRecords.length; index++) {
			objData = selectedRecords[index];
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
		me.enableDisableGroupActions(actionMask, isSameUser, isDisabled,isSubmit);
	},

	enableDisableGroupActions : function(actionMask, isSameUser, isDisabled, isSubmit) {
		var actionBar = this.getGroupActionBar();
		var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
		if (!Ext.isEmpty(actionBar) && !Ext.isEmpty(actionBar.items.items)) {
			arrItems = actionBar.items.items;
			Ext.each(arrItems, function(item) {
						strBitMapKey = parseInt(item.maskPosition,10) - 1;
						if (strBitMapKey) {
							blnEnabled = isActionEnabled(actionMask,
									strBitMapKey);
									
							if((item.maskPosition === 6 && blnEnabled)){
								blnEnabled = blnEnabled && isSameUser;
							} else  if(item.maskPosition === 7 && blnEnabled){
								blnEnabled = blnEnabled && isSameUser;
							}else if (item.maskPosition === 8 && blnEnabled) {
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

	handleGroupActions : function(btn, record) {
		var me = this;
		var strAction = !Ext.isEmpty(btn.actionName)
				? btn.actionName
				: btn.itemId;
		var strUrl = Ext.String.format('cpon/liquidityReferenceTimeMst/{0}',
				strAction);
		strUrl = strUrl + '.srvc?';
		if (strAction === 'reject') {
			this.showRejectVerifyPopUp(strAction, strUrl,record);

		} else {
			this.preHandleGroupActions(strUrl, '',record);
		}

	},
	showRejectVerifyPopUp : function(strAction, strActionUrl,record) {
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
					bodyPadding : 0,
					fn : function(btn, text) {
						if (btn == 'ok') {
							me.preHandleGroupActions(strActionUrl, text, record);
						}
					}
				});
	},
	preHandleGroupActions : function(strUrl, remark, record) {
		var me = this;
		var grid = this.getGrid();
		if (!Ext.isEmpty(grid)) {
			var arrayJson = new Array();
			var records = grid.getSelectedRecords();
			records = (!Ext.isEmpty(records) && Ext.isEmpty(record))
					? records
					: [record];
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
				url : strUrl + csrfTokenName + "=" + csrfTokenValue,
				method : 'POST',
				jsonData : Ext.encode(arrayJson),
				success : function(response) {
					// TODO : Action Result handling to be done here
					me.enableDisableGroupActions('0000000000', true);
					grid.refreshData();
					var errorMessage = '';
					if (response.responseText != '[]') {
						var jsonData = Ext
								.decode(response.responseText);
						Ext
								.each(
										jsonData[0].errors,
										function(error,
												index) {
											errorMessage = errorMessage + error.code +' : '
													 + error.errorMessage
													+ "<br/>";
										});
						if ('' != errorMessage
								&& null != errorMessage) {
							Ext.Msg.alert("Error",
									errorMessage);
						}
					}
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
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
			strRetValue = value;
		return strRetValue;
	},
	getLiquidityRefTimeGridConfiguration : function() {
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;
		objWidthMap = {
			"frequencyInstrDesc" : 350,
			"cutOffTime" : 300,
			"requestStateDesc" : 219
		};

		arrColsPref = [{
					"colId" : "frequencyInstrDesc",
					"colDesc" : "Frequency  Name",
					"sortable":true
				},
				{
					"colId" : "cutOffTime",
					"colDesc" : "Reference Time (HHMISS Format)",
					"sortable":true
				},
				{
					"colId" : "requestStateDesc",
					"colDesc" : "Status",
					"sortable":false
				}];

		storeModel = {
			fields : ['frequencyCode','frequencyInstrDesc','cutOffTime','isSubmitted','requestStateDesc', 
					'identifier','history','__metadata'],
			proxyUrl : 'cpon/liquidityReferenceTimeMst.json',
			rootNode : 'd.profile',
			totalRowsNode : 'd.__count'
		};

		
		objConfigMap = {
			"objWidthMap" : objWidthMap,
			"arrColsPref" : arrColsPref,
			"storeModel" : storeModel
		};
		return objConfigMap;
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
	handleLiquidityReferenceTimeEntryAction : function(entryType) {
		var me = this;
		me.showAddLiquidityReferenceTimePopup('ADD','');
	},
	
	showAddLiquidityReferenceTimePopup : function(docmode, rowIndex) {
		var me = this;
		var grid = me.getLiquidityRefTimeGrid();
		var id = '';
		
		
		
		if('ADD'===docmode)
			{
				addLiquidityRefTimePopup = Ext.create('GCP.view.AddLiquidityRefTimePopup', {
				identifier : id, mode : docmode
			});
			}
		 if('EDIT'===docmode)
			{
			var record = grid.getStore().getAt(rowIndex);
			id = record.data.identifier;
			
			addLiquidityRefTimePopup = Ext.create('GCP.view.AddLiquidityRefTimePopup', {
				identifier : id, mode : docmode
			});
			
			this.getFreqNameField().setValue(record.data.frequencyInstrDesc);
			
			var refTime = record.data.cutOffTime ;			
			//var split = refTime.split(':');

			var hours = refTime.substring( 0, 2 );
			var min = refTime.substring( 2, 4 );
			var sec  = refTime.substring( 4, 6 );
			
			this.getRefTimeHoursCombo().setValue(hours);
			this.getRefMinCombo().setValue(min);
			this.getRefSecCombo().setValue(sec);
			
			
			}
		 if('VIEW'===docmode)
			{
			var record = grid.getStore().getAt(rowIndex);
			id = record.data.identifier;
			
			addLiquidityRefTimePopup = Ext.create('GCP.view.AddLiquidityRefTimePopup', {
				identifier : id, mode : docmode
			});
			
			this.getFreqNameField().setValue(record.data.frequencyInstrDesc);
			this.getFreqNameField().setDisabled(true);
			
			var refTime = record.data.cutOffTime ;
			//var split = refTime.split(':');

			var hours = refTime.substring( 0, 2 );
			var min = refTime.substring( 2, 4 );
			var sec  = refTime.substring( 4, 6 );
			
			this.getRefTimeHoursCombo().setValue(hours);
			this.getRefTimeHoursCombo().setDisabled(true);
			this.getRefMinCombo().setValue(min);
			this.getRefMinCombo().setDisabled(true);
			this.getRefSecCombo().setValue(sec);
			this.getRefSecCombo().setDisabled(true);
			
			
			
			}
		
		
		(addLiquidityRefTimePopup).show();
	},
	
	submitUpdateReferenceTime : function(identifier, mode) {
		var me = this;
		var arrayJson = new Array();
		var grid = me.getLiquidityRefTimeGrid();
		var refTime = '';
		
		if(!Ext.isEmpty(this.getRefTimeHoursCombo().getValue()) && !Ext.isEmpty(this.getRefMinCombo().getValue())
				&& !Ext.isEmpty(this.getRefSecCombo().getValue()))
			
		 refTime = this.getRefTimeHoursCombo().getValue() + this.getRefMinCombo().getValue() + this.getRefSecCombo().getValue() ;
			
		//console.log(refTime);
	
		
		

		var strUrl = '';
		var jsonData = '';
		if('ADD' === mode)
		{
			strUrl =  'cpon/liquidityReferenceTimeMst/addRefTimeMst.json';
			var records =  {
					frequencyName: this.getFreqNameField().getValue(),
					referenceTime : refTime
				};		
			
			jsonData = { userMessage : records	}; 
			
		}
		if('EDIT' === mode)
		{
			strUrl =  'cpon/liquidityReferenceTimeMst/updateRefTimeMst.json';
			arrayJson.push({
				serialNo : 0,
				identifier : identifier,
				userMessage : null,
				frequencyName: this.getFreqNameField().getValue(),
				referenceTime : refTime
			});
			
			jsonData = Ext.encode(arrayJson);
		}
		//console.log(strUrl);
		Ext.Ajax.request({
					url : strUrl,
					method : 'POST',
					jsonData : jsonData,
					success : function(response) {
						me.getAddLiquidityRefTimePopup().close();
						var mstGrid = me.getLiquidityRefTimeGrid();
						mstGrid.refreshData();
						var errorMessage = '';
						if (response.responseText != '[]') {
							var jsonData = Ext
									.decode(response.responseText);
							Ext
									.each(
											jsonData[0].errors,
											function(error,
													index) {
												errorMessage = errorMessage + error.code +' : '
														 + error.errorMessage
														+ "<br/>";
											});
							if ('' != errorMessage
									&& null != errorMessage) {
								Ext.Msg.alert("Error",
										errorMessage);
							}
						}
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
									icon : Ext.MessageBox.ERROR
								});
					}
				});

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
					target : 'liquidityRefTimeFilterView-1018_header_hd-textEl',
					listeners : {
						// Change content dynamically depending on which element
						// triggered the show.
						beforeshow : function(tip) {
							var seller = '';
							var profileName = '';
							var status='';
							
							
							var sellerFltId = me.getSellerCombo();
							if (!Ext.isEmpty(sellerFltId)
									&& !Ext.isEmpty(sellerFltId
											.getValue())) {
								seller = sellerFltId.getValue();
							} else {
								seller = getLabel('all', 'ALL');
							}
							
							
							var profileNameRef=me.getProfileNameField();
							if (!Ext.isEmpty(profileNameRef) && !Ext.isEmpty(profileNameRef.getValue())) {
								profileName = profileNameRef.getValue();
							} else {
								profileName = getLabel('none', 'None');
							}
							
							if (!Ext.isEmpty(me.getStatusFilter()) && 
							!Ext.isEmpty(me.getStatusFilter().getValue())) {
								var combo = me.getStatusFilter();
								status = combo.getRawValue()
							} else {
								status = getLabel('all', 'ALL');
							}
							
							tip.update(getLabel("seller","Seller")
									+ ' : '
									+ seller
									+ '<br/>'
									+ getLabel("frequencyName","Frequency Name")
									+ ' : '
									+ profileName + '<br/>'
									+ getLabel('status', 'Status') + ' : '
									+ status);
							
						}
					}
				});
	}

});
