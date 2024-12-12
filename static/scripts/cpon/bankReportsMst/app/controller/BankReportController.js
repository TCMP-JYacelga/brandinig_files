Ext.define('GCP.controller.BankReportController', {
	extend : 'Ext.app.Controller',
	requires : [],
	views : ['GCP.view.BankReportView', 'GCP.view.BankReportGridView','GCP.view.HistoryPopup'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'scmProductView',
				selector : 'bankReportView'
			}, {
				ref : 'createNewToolBar',
				selector : 'bankReportView bankReportGridView toolbar[itemId="btnCreateNewToolBar"]'
			},{
				ref : 'specificFilterPanel',
				selector : 'bankReportView bankReportFilterView panel[itemId="specificFilter"]'
			},{
				ref : 'sellerPanel',
				selector : 'bankReportView bankReportFilterView panel[itemId="specificFilter"] panel[itemId="sellerPanel"]'
			},{
				ref : 'benePanel',
				selector : 'bankReportView bankReportFilterView panel[itemId="specificFilter"] panel[itemId="benePanel"]'
			},{
				ref : 'scmProductGridView',
				selector : 'bankReportView bankReportGridView'
			}, {
				ref : 'clientSetupDtlView',
				selector : 'bankReportView bankReportGridView panel[itemId="clientSetupDtlView"]'
			}, {
				ref : 'gridHeader',
				selector : 'bankReportView bankReportGridView panel[itemId="clientSetupDtlView"] container[itemId="gridHeader"]'
			}, {
				ref : 'scmProductGrid',
				selector : 'bankReportView bankReportGridView grid[itemId="gridViewMstId"]'
			},{
				ref : 'searchTextInput',
				selector : 'bankReportGridView textfield[itemId="searchTextField"]'
			}, {
				ref : 'matchCriteria',
				selector : 'bankReportGridView radiogroup[itemId="matchCriteria"]'
			},{
				ref : 'grid',
				selector : 'bankReportGridView smartgrid'
			},{
				ref : "corporationFilter",
				selector : 'bankReportView bankReportFilterView combobox[itemId="sellerFltId"]'
			},{
				ref : "clientFilter",
				selector : 'bankReportView bankReportFilterView textfield[itemId="profileNameFltId"]'
			},{
				ref : "statusFilter",
				selector : 'bankReportView bankReportFilterView combobox[itemId="statusFilter"]'
			}, {
				ref : 'groupActionBar',
				selector : 'bankReportView bankReportGridView bankReportActionBarView'
			},{
				ref : 'clientListLink',
				selector : 'bankReportView toolbar[itemId="btnActionToolBar"] button[itemId="btnClientList"]'
			}  ],
	config : {
		selectedMst : 'client',
		clientListCount : 0,
		brandingPkgListCount : 0,
		filterData : []
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		
		me.control({
			'bankReportView bankReportGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateBeneficiary"]' : {
				click : function() {
					me.handleCreateBankReportAction(true);
				}
			},
			'bankReportView bankReportFilterView' : {
				render : function() {
					me.setInfoTooltip();
					me.handleSpecificFilter();
				}
			},
			'bankReportView bankReportFilterView button[itemId="btnFilter"]' : {
				click : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
				}
			},
			'bankReportView bankReportGridView panel[itemId="clientSetupDtlView"]' : {
				render : function() {
					me.handleGridHeader();
					
				}
			},
			'bankReportView toolbar[itemId="btnActionToolBar"] button[itemId="btnClientList"]' : {
				click : function() {
					me.filterData = [];
					me.handleSpecificFilter();
					me.handleGridHeader();
				}
			},

			'bankReportGridView' : {
				render : function(panel) {
					me.handleSmartGridConfig();
					me.setFilterRetainedValues();
				}
			},
			'bankReportGridView textfield[itemId="searchTextField"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'bankReportGridView radiogroup[itemId="matchCriteria"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'bankReportGridView smartgrid' : {
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
			'bankReportGridView toolbar[itemId=clientGroupActionBarView_clientDtl]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			},
			'bankReportView bankReportFilterView combobox[itemId="sellerFltId"]' : {
				select : function(btn, opts) {
					me.resetAllFilters();
				},
				change : function(combo, newValue, oldValue, eOpts) {
					me.getClientFilter().cfgExtraParams = [{
													key : '$sellerCode',
													value : newValue
												}];
				}
			}

		});
	},
	
	setFilterRetainedValues : function(){
		var me = this;
		var filterView = me.getSpecificFilterPanel();
		var statusFilter = me.getStatusFilter();
		// Set Seller Id Filter Value
		var sellerFltId = filterView.down('combobox[itemId=sellerFltId]');
		sellerFltId.setValue(strSellerId);
		
		// set Bene Name Filter Value
		me.getClientFilter().setValue(filterBeneName);
		
		// Set Status Filter Value
		statusFilter.store.loadRawData([{
											"name" : filterStatus,
											"value" : filterStatusDesc
										}]);
		statusFilter.suspendEvents();
		statusFilter.setValue(filterStatus);
		statusFilter.resumeEvents();
		
				
	},
	handleSpecificFilter : function() {
		var me = this;
		var storeData;
		var multipleSellersAvailable = false;
		Ext.Ajax.request(
				{
					url : 'services/userseek/adminSellersListCommon.json',
					method : 'POST',
					async: false,
					success : function( response )
					{
						var data = Ext.decode( response.responseText );
						var sellerData = data.filterList;
						if( data && data.d && data.d.preferences){
							storeData = data.d.preferences;
						}
					},
					failure : function(response)
					{
						// console.log("Ajax Get data Call Failed");
					}
		});
		var objStore = Ext.create('Ext.data.Store', {
					fields : ['CODE', 'DESCR'],
					data : storeData,
					reader : {
						type : 'json'
					}
					});
		objStore.load();

		me.getSearchTextInput().setValue('');
		me.getStatusFilter().setValue('');
		var clientTextfield = Ext.create('Ext.ux.gcp.AutoCompleter', {
					padding : '1 0 0 0',
					fieldCls : 'xn-form-text xn-suggestion-box',
					width : 165,
					name : 'bankReportDesc',
					itemId : 'profileNameFltId',
					cfgUrl : 'cpon/cponseek/{0}.json',
					cfgProxyMethodType : 'POST',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgSeekId : 'bankReportDescSeek',
					cfgRootNode : 'd.filter',
					cfgDataNode1 : 'name'
				});
		clientTextfield.cfgExtraParams = [{
					key : '$sellerCode',
					value : strSellerId
				}];
		var filterPanel = me.getSpecificFilterPanel();
		var sellerPanel = me.getSellerPanel();
		var benePanel = me.getBenePanel();
		if (!Ext.isEmpty(sellerPanel))
		{
			sellerPanel.removeAll();
		}
		sellerPanel.add({
							xtype : 'label',
							text : getLabel('financialinstitution', 'Financial Institution'),
							cls : 'frmLabel',
							padding : '1 5 0 10'
						}, {
							xtype : 'combo',
							padding : '1 5 0 0',
							columnWidth : 0.5,
							displayField : 'DESCR',
							fieldCls : 'xn-form-field inline_block',
							triggerBaseCls : 'xn-form-trigger',
							filterParamName : 'sellerId',
							itemId : 'sellerFltId',
							valueField : 'CODE',
							name : 'sellerCombo',
							editable : false,
							value :  strSellerId,
							store : objStore,
							listeners : {
								'select' : function(combo, strNewValue, strOldValue) {
										setAdminSeller(combo.getValue());
										me.fireEvent('handleChangeFilter', combo, strNewValue, strOldValue);
								        }
								  } 
						});
		if (!Ext.isEmpty(benePanel))
		{
			benePanel.removeAll();
		}				
		benePanel.add({
							xtype : 'label',
							text : getLabel('reportDesc', 'Bank Report Name'),
							cls : 'frmLabel',
							padding : '4 0 0 6'
						}, clientTextfield
					);
		filterPanel.columnWidth = 0.45;
	      sellerPanel.show();
		
	},
	resetAllFilters : function() {
		var me = this;
		if (!Ext.isEmpty(me.getClientFilter())) {
			me.getClientFilter().setValue('');
		}
		return;
	},
	handleGridHeader : function() {
		var me = this;
		var gridHeaderPanel = me.getGridHeader();
		if(ACCESSNEW){
		var createNewPanel = me.getCreateNewToolBar();
		if (!Ext.isEmpty(createNewPanel))
		{
			createNewPanel.removeAll();
		}
		createNewPanel.add(
			{
							xtype : 'button',
							border : 0,
							text : getLabel('createBeneficiary', 'Create New Bank Report'),
							cls : 'ux_button-background-color ux_button-padding',
							glyph : 'xf055@fontawesome',
							parent : this,
							padding : '4 0 2 0',
							itemId : 'btnCreateBeneficiary'
						}
		);
		}
	},

	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		me.setDataForFilter();
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + me.getFilterUrl();
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
		
		var corporationVal = null, statusVal = null, clientVal = null, jsonArray = [];
		var sellerVal = null;
		var approvalWorkflowFilterView = me.getSpecificFilterPanel();
		var sellerFltId = approvalWorkflowFilterView.down('combobox[itemId=sellerFltId]');
		var isPending =true;
		if (!Ext.isEmpty(sellerFltId) && !Ext.isEmpty(sellerFltId.getValue())) {
			sellerVal = sellerFltId.getValue();
		}

		if (!Ext.isEmpty(me.getClientFilter())
				&& !Ext.isEmpty(me.getClientFilter().getValue())) {
			corporationVal = me.getClientFilter().getValue();
		}

		if (!Ext.isEmpty(me.getStatusFilter())
				&& !Ext.isEmpty(me.getStatusFilter().getValue())
				&& "ALL" != me.getStatusFilter().getValue()) {
			statusVal = me.getStatusFilter().getValue();
			if (statusVal == 13)//Pending My Approval
			{
				statusVal  = new Array('5YN','4NN','0NY','1YY');
				             isPending = false;
				             jsonArray.push({
					 			paramName : 'statusFilter',
								paramValue1 : statusVal,
								operatorValue : 'in',
								dataType : 'S'
					});
				              jsonArray.push({
								paramName : 'user',
								paramValue1 :encodeURIComponent(USER.replace(new RegExp("'", 'g'), "\''")),
								operatorValue : 'ne',
								dataType : 'S'
					});
				
			}
			if (isPending)
			{
			 if (statusVal == 12 || statusVal == 3 || statusVal == 14) {
				if (statusVal == 12 || statusVal == 14) //New Submitted , 14: Modified Submitted
				{
					statusVal = (statusVal == 12)?0:1;
					jsonArray.push({
								paramName : 'isSubmitted',
								paramValue1 : 'Y',
								operatorValue : 'eq',
								dataType : 'S'
							});
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
					jsonArray.push({
								paramName : me.getStatusFilter().filterParamName,
								paramValue1 : statusVal,
								operatorValue : 'eq',
								dataType : 'S'
							});
			}	
		}

		if (!Ext.isEmpty(me.getClientFilter())
				&& !Ext.isEmpty(me.getClientFilter().getValue())) {
			clientVal = me.getClientFilter().getValue();
		}

		
		if (clientVal != null) {
			jsonArray.push({
						paramName : me.getClientFilter().name,
						paramValue1 : encodeURIComponent(clientVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'lk',
						dataType : 'S'
					});
		}
		if (!Ext.isEmpty(sellerVal)) {
			jsonArray.push({
						paramName : sellerFltId.filterParamName,
					    paramValue1 : encodeURIComponent(sellerVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
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
		var bankReportGrid = me.getScmProductGrid();
		var objConfigMap = me.getScmProductGridConfiguration();
		var arrCols = new Array();
		if (!Ext.isEmpty(bankReportGrid))
			bankReportGrid.destroy(true);

		arrCols = me.getColumns(objConfigMap.arrColsPref,
				objConfigMap.objWidthMap);
		me.handleSmartGridLoading(arrCols, objConfigMap.storeModel);

	},

	handleSmartGridLoading : function(arrCols, storeModel) {
		var me = this;
		var pgSize = null;
		pgSize = 10;
		scmProductGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
					id : 'gridViewMstId',
					itemId : 'gridViewMstId',
					pageSize : pgSize,
					stateful : false,
					showEmptyRow : false,
					padding : '5 10 10 10',
					rowList : _AvailableGridSize,
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

		var clntSetupDtlView = me.getClientSetupDtlView();
		clntSetupDtlView.add(scmProductGrid);
		clntSetupDtlView.doLayout();
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
				me.showHistory(record.get('bankReportDesc'),record.get('history').__deferred.uri, record.get('identifier'));
			}
		} else if (actionName === 'btnView') {
			me.submitExtForm('viewBankReportMst.form', record, rowIndex);
		} else if (actionName === 'btnEdit') {
			me.submitExtForm('editBankReportMst.form', record, rowIndex);
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
		me.setFilterParameters(form);
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
			width : 85,
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
						itemLabel : getLabel('historyToolTip','View History'),
						toolTip : getLabel('historyToolTip','View History'),
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
		var isEnabled = false;
		var isSubmit = false;
		maskArray.push(buttonMask);
		for (var index = 0; index < selectedRecords.length; index++) {
			objData = selectedRecords[index];
			maskArray.push(objData.get('__metadata').__rightsMap);
			if (objData.raw.makerId === USER) {
				isSameUser = false;
			}
			if (objData.raw.requestState == 3 && objData.raw.validFlag != 'Y') {
				isDisabled = true;
			} else if (objData.raw.requestState == 3
					&& objData.raw.validFlag == 'Y') {
				isEnabled = true;
			}
			if (objData.raw.isSubmitted == 'Y' && objData.raw.requestState == 0) {
				isSubmit = true;
			}
		}
		if (isDisabled && isEnabled) {
			isDisabled = isEnabled = false;
		}
		actionMask = doAndOperation(maskArray, 10);
		me.enableDisableGroupActions(actionMask, isSameUser, isDisabled,
				isSubmit, isEnabled);
	},

	enableDisableGroupActions : function(actionMask, isSameUser, isDisabled,
			isSubmit, isEnabled) {
		var actionBar = this.getGroupActionBar();
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
								blnEnabled = blnEnabled && isEnabled;
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
		var strUrl = Ext.String.format('cpon/bankReportMst/{0}',
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
			fieldLbl = getLabel('prfRejectRemarkPopUpTitle',
					'Please Enter Reject Remark');
			titleMsg = getLabel('prfRejectRemarkPopUpFldLbl', 'Reject Remark');
		}
		var msgbox  = Ext.Msg.show({
					title : titleMsg,
					msg : fieldLbl,
					buttons : Ext.Msg.OKCANCEL,
					multiline : 4,
					cls:'t7-popup',
					width: 355,
					height : 270,
					bodyPadding : 0,
					fn : function(btn, text) {
						if (btn == 'ok') {
							me.preHandleGroupActions(strActionUrl, text, record);
						}
					}
				});
		msgbox.textArea.enforceMaxLength = true;
		msgbox.textArea.inputEl.set({
			maxLength : 255
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
							userMessage : remark,
							recordDesc : records[index].data.bankReportCode
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
							if(!Ext.isEmpty(response.responseText))
					       	{
					       		var errorMessage = '';
						        var jsonData = Ext.decode(response.responseText);
						        if(!Ext.isEmpty(jsonData))
						        {
						        	for(var i =0 ; i<jsonData.length;i++ )
						        	{
						        		var arrError = jsonData[i].errors;
						        		if(!Ext.isEmpty(arrError))
						        		{
						        			for(var j =0 ; j< arrError.length; j++)
								        	{
							        			errorMessage = errorMessage + arrError[j].code +' : '+ arrError[j].errorMessage+"<br/>";
								        	}
						        		}
						        		
						        	}
							        if('' != errorMessage && null != errorMessage)
							        {
							         //Ext.Msg.alert("Error",errorMessage);
							        	Ext.MessageBox.show({
											title : getLabel('instrumentErrorPopUpTitle','Error'),
											msg : errorMessage,
											buttons : Ext.MessageBox.OK,
											cls : 'ux_popup',
											icon : Ext.MessageBox.ERROR
										});
							        } 
						        }
					       	}
							me.enableDisableGroupActions('0000000000', true);
							grid.refreshData();
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
		if (colId = 'fileFormat') {
		if (!record.get('isEmpty')) {
			if (!Ext.isEmpty(record.get('fileFormat')) && 'A' == value) {
				strRetValue = getLabel('assci', 'ASCII');
			} else if (!Ext.isEmpty(record.get('fileFormat'))
					&& 'B' == value) {
				strRetValue = getLabel('binary', 'Binary');
			} else if (!Ext.isEmpty(record.get('fileFormat'))
					&& 'N' == value) {
				strRetValue = getLabel('asciilinefeed', 'ASCII No Line Feed');
			} else {
				strRetValue = value;
			}
		}

	}
	return strRetValue;
	},

	getScmProductGridConfiguration : function() {
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;
		objWidthMap = {
			"bankReportCode" : 150,
			"bankReportDesc" : 200,
			"fileFormat":130,
			"requestStateDesc":100
		};

		arrColsPref = [{	"colId" : "bankReportCode",
							"colDesc" : getLabel('bankReportCode', 'Bank Report Code')
						}, {
							"colId" : "bankReportDesc",
							"colDesc" : getLabel('bankReportDesc' , 'Bank Report Name')
						},{
							"colId" : "fileFormat",
							"colDesc" : getLabel('fileFormat', 'File Format')
						},{
							"colId" : "requestStateDesc",
							"colDesc" : getLabel('requestStateDesc' , 'Status')
						}];

		storeModel = {
					fields : ['identifier', 'profileId', 'bankReportCode','fileFormat','bankReportDesc','distributionMethod',
							'beanName', 'beneName', 'primaryKey','history',
							'requestStateDesc', 'parentRecordKey', 'version',
							'recordKeyNo', 'masterRecordkeyNo', '__metadata'],
					proxyUrl : 'cpon/bankReportMst.json',
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
	handleCreateBankReportAction : function(entryType) {
		var me = this;
		var form;
		var sellerCombo = me.getCorporationFilter();
		if(sellerCombo){
			var selectedSeller = sellerCombo.getValue();
		}
		var strUrl = 'addBankReportMst.form';
		var errorMsg = null;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'sellerId', selectedSeller));

		form.action = strUrl;
		me.setFilterParameters(form);
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	
	/* Function sets the filter Panel element values in JSON */
	setFilterParameters : function(form){
		var me = this;
		var selectedSeller = null, beneName = null, statusVal = null;
		var arrJsn = {};
		var specificFilterView = me.getSpecificFilterPanel();
		var sellerCombo = specificFilterView.down('combobox[itemId=sellerFltId]');
		if (!Ext.isEmpty(me.getClientFilter())
				&& !Ext.isEmpty(me.getClientFilter().getValue())) {
			beneName = me.getClientFilter().getValue();
		}
		if(sellerCombo){
			selectedSeller = sellerCombo.getValue();
		}
		if (!Ext.isEmpty(me.getStatusFilter())
				&& !Ext.isEmpty(me.getStatusFilter().getValue())
				&& "ALL" != me.getStatusFilter().getValue()) {
			statusVal = me.getStatusFilter().getValue();
		}
		arrJsn['sellerId'] = selectedSeller;
		arrJsn['beneName'] = beneName;
		arrJsn['status']= statusVal;
		arrJsn['statusDesc']= me.getStatusFilter().getRawValue();
		
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'filterData', Ext.encode(arrJsn)));
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
							var sellerVal = null;
							
							var approvalWorkflowFilterView = me.getSpecificFilterPanel();
							var scmProductId = approvalWorkflowFilterView.down('textfield[itemId="profileNameFltId"]');
							var sellerFltId = approvalWorkflowFilterView.down('combobox[itemId=sellerFltId]');
							
							if (!Ext.isEmpty(me.getStatusFilter()) && 
							!Ext.isEmpty(me.getStatusFilter().getValue())) {
								var combo = me.getStatusFilter();
								status = combo.getRawValue()
							} else {
								status = getLabel('all', 'ALL');
							}
							
							if (!Ext.isEmpty(scmProductId)
									&& !Ext.isEmpty(scmProductId
											.getValue())) {
								client = scmProductId.getValue();
							} else {
								client = getLabel('none', 'None');
							}
							
							
							if (!Ext.isEmpty(sellerFltId) && !Ext.isEmpty(sellerFltId.getRawValue())) {
								sellerVal = sellerFltId.getRawValue();
							}
							
							if (Ext.isEmpty(sellerVal))
							{
								tip.update(getLabel("bankReportDesc","Bank Report Name")
										+ ' : '
										+ client + '<br/>'
										+ getLabel('status', 'Status') + ' : '
										+ status);	
							}
							else {
								tip.update(getLabel( "financialinstitution", "Financial Institution" ) + ' : ' + sellerVal + '<br/>'
										+ getLabel("bankReportDesc","Bank Report Name")
										+ ' : '
										+ client + '<br/>'
										+ getLabel('status', 'Status') + ' : '
										+ status);	
							}
							
							
							
						}
					}
				});
	}

});