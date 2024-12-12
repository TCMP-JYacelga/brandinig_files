Ext.define('GCP.controller.ContractSetupController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.util.Point'],
	views : ['GCP.view.ContractSetupView','GCP.view.ContractSetupFilterView','GCP.view.ContractSetupGridView','GCP.view.ContractGroupActionBarView','GCP.view.HistoryPopup'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'alertSetupView',
				selector : 'contractSetupView'
			}, {
				ref : 'createNewToolBar',
				selector : 'contractSetupView contractSetupGridView toolbar[itemId="btnCreateNewToolBar"]'
			},{
				ref : 'specificFilterPanel',
				selector : 'contractSetupView contractSetupFilterView panel[itemId="specificFilter"]'
			},{
				ref : 'moduleFilterPanel',
				selector : 'contractSetupView contractSetupFilterView panel[itemId="moduleFilter"]'
			},{
				ref : 'alertSetupGridView',
				selector : 'contractSetupView contractSetupGridView'
			}, {
				ref : 'alertSetupDtlView',
				selector : 'contractSetupView contractSetupGridView panel[itemId="clientSetupDtlView"]'
			},{
				ref : 'gridHeader',
				selector : 'contractSetupView contractSetupGridView panel[itemId="clientSetupDtlView"] container[itemId="gridHeader"]'
			}, {
				ref : 'alertSetupGrid',
				selector : 'contractSetupView contractSetupGridView grid[itemId="gridViewMstId"]'
			},{
				ref : 'searchTextInput',
				selector : 'contractSetupGridView textfield[itemId="searchTextField"]'
			}, {
				ref : 'matchCriteria',
				selector : 'contractSetupGridView radiogroup[itemId="matchCriteria"]'
			},{
				ref : 'grid',
				selector : 'contractSetupGridView smartgrid'
			},{
				ref : "clientFilter",
				selector : 'contractSetupView contractSetupFilterView textfield[itemId="clientNameFltId"]'
			},{
				ref : "contractFilter",
				selector : 'contractSetupView contractSetupFilterView textfield[itemId="contractNameFltId"]'
			},{
				ref : "buyCurrencyFilter",
				selector : 'contractSetupView contractSetupFilterView textfield[itemId="buyCurrencyFltId"]'
			},{
				ref : "sellCurrencyFilter",
				selector :'contractSetupView contractSetupFilterView textfield[itemId="sellCurrencyFltId"]'
			},{
				ref : "teplateNameFilter",
				selector : 'contractSetupView contractSetupFilterView textfield[itemId="templateNameFltId"]'
			},{
				ref : "financialComboFilter",
				selector : 'contractSetupView contractSetupFilterView combobox[itemId="sellerFltId"]'
			},{
				ref : "statusFilter",
				selector : 'contractSetupView contractSetupFilterView combobox[itemId="statusFilter"]'
			}, {
				ref : 'groupActionBar',
				selector : 'contractSetupView contractSetupGridView contractGroupActionBarView'
			},{
				ref : 'clientListLink',
				selector : 'contractSetupView toolbar[itemId="btnActionToolBar"] button[itemId="btnClientList"]'
			},
			{
				ref : 'screenTitleLabel',
				selector : 'contractSetupView contractSetupTitleView label[itemId="pageTitle"]'
			}],
	config : {
						moduleTypeVal : 'All',
						moduleTypeDesc : 'all',
						//statusTypeVal : 'all',
						subscriptionTypeVal : 'all',
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
			'contractSetupView contractSetupGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateAlert"]' : {
				click : function() {
					//me.handleAlertEntryAction(true);
	                 me.handleContractEntryAction(true);
				}
			},
			'contractSetupView contractSetupGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateBrandingPkg"]' : {
				click : function() {
					me.handleClientEntryAction(false);
				}
			},
			'contractSetupView contractSetupFilterView' : {
				render : function() {
					me.setInfoTooltip();
					me.handleSpecificFilter();
					//me.displayModules();
				},
	
					/*handleModuleType : function(btn) {
				    me.handleModuleType(btn);
					},*/
				/*handleStatusType : function(btn) {
			      	me.handleStatusType(btn);
										},*/
		      	handleSubscriptionType : function(btn) {
				     me.handleSubscriptionType(btn);
				}
			},
			'contractSetupView contractSetupFilterView button[itemId="btnFilter"]' : {
				click : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
				}
			},
			
		     handleModuleType : function(btn) {
											me.handleModuleType(btn);
										},
			'contractSetupView contractSetupGridView panel[itemId="clientSetupDtlView"]' : {
				render : function() {
		
					me.handleGridHeader();
					
				}
			},
			'contractSetupView toolbar[itemId="btnActionToolBar"] button[itemId="btnBrandingPkgList"]' : {
				click : function() {
					me.filterData = [];
					//me.showBrandingPkgList();
					me.handleSpecificFilter();
					me.handleGridHeader();
				}
			},
			'contractSetupView toolbar[itemId="btnActionToolBar"] button[itemId="btnClientList"]' : {
				click : function() {
					me.filterData = [];
					me.showClientList();
					me.handleSpecificFilter();
					me.handleGridHeader();
				}
			},

			'contractSetupGridView' : {
				render : function(panel) {
					me.handleSmartGridConfig();
				}
			},
			'contractSetupGridView textfield[itemId="searchTextField"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'contractSetupGridView radiogroup[itemId="matchCriteria"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			
			'contractSetupGridView smartgrid' : {
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
			'contractSetupGridView toolbar[itemId=AlertGroupActionBarView_subcriptionDtl]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			}
		});
	},
	
	handleSpecificFilter : function() {
		var me = this;
	    var objStore = Ext.create('Ext.data.Store', {
					fields : ["DESCR", "CODE"],
					proxy : {
						type : 'ajax',
						url : 'services/userseek/adminSellersListCommon.json',
						actionMethods : {
							create : "POST",
							read : "POST",
							update : "POST",
							destroy : "POST"
						},
						noCache:false,
						reader : {
							type : 'json',
							root : 'd.preferences'
						}
					},
					autoLoad: false
				});
	
		var filterPanel = me.getSpecificFilterPanel();
		if (!Ext.isEmpty(filterPanel))
		{
			filterPanel.removeAll();
		}	
	       
			filterPanel.add( {
		                            xtype : 'panel',
									cls : 'xn-filter-toolbar',
									layout : 'vbox',
									columnWidth : 0.80,
									
									items : [{
												xtype : 'label',
												cls : 'f20 ux_font-size14 ux_normalmargin-bottom',
												text : getLabel('seller', 'Seller'),
												padding : '1 5 0 10'
											}, {
												xtype : 'combo',
												padding : '1 5 0 5',
												displayField : 'DESCR',
												fieldCls : 'xn-form-field inline_block ux_font-size14-normal',
												triggerBaseCls : 'xn-form-trigger',
												filterParamName : 'contractSeller',
												itemId : 'sellerFltId',
												valueField : 'CODE',
												name : 'sellerCombo',
												editable : false,
												//value : strSellerId,
												store : objStore,
												minWidth : 200,
												value : strSellerId,
												listeners : 
												{
													'render' : function(combo, record) {
														combo.setValue(strSellerId);	
														combo.store.load();
													},
													'select' : function(combo, strNewValue, strOldValue) {
														setAdminSeller(combo.getValue());
														me.fireEvent('handleChangeFilter', combo, strNewValue, strOldValue);
												        }
												}
											}]
									});
		
		
		
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
							text : getLabel('createNewContract', 'Create New Contract Rate'),
							cls : 'cursor_pointer ux_button-background ux_button-padding ux_button-background-color ux_button-s',
							glyph:'xf055@fontawesome',
							parent : this,
							padding : '4 0 2 0',
							itemId : 'btnCreateAlert'
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
				case 'statusFilterOp' :
					var objValue = filterData[index].paramValue1;
					var objUser = filterData[index].makerUser;
					var objArray = objValue.split(',');
					for (var i = 0; i < objArray.length; i++) {
							if( i== 0)
							strTemp = strTemp + '(';
							if(objArray[i] == 12){
								strTemp = strTemp + "(FxRequestState eq 0 and FxIsSubmitted eq 'Y')";
							}
							else if(objArray[i] == 14){
								strTemp = strTemp + "(FxRequestState eq 1 and FxIsSubmitted eq 'Y')";
							}
							else if(objArray[i] == 3){
								strTemp = strTemp + "(FxRequestState eq 3 and FxValidFlag eq 'Y')";
							}
							else if(objArray[i] == 11){
								strTemp = strTemp + "(FxRequestState eq 3 and FxValidFlag eq 'N')";
							}
							else if(objArray[i] == 13){
								strTemp = strTemp + "(((FxIsSubmitted eq 'Y' and (FxRequestState eq '0' or FxRequestState eq '1' )) or (FxRequestState eq '4') or (FxRequestState eq '5'))and FxMakerId ne '"+objUser+"' )";
							}
							else if(objArray[i] == 0 || objArray[i] == 1){
								strTemp = strTemp + "(FxRequestState eq "+objArray[i]+" and FxIsSubmitted eq 'N')";
							}
							else{
								strTemp = strTemp + "(FxRequestState eq "+objArray[i]+")";
							}
							if(i != (objArray.length -1)){
								strTemp = strTemp + ' or ';
							}
							if(i == (objArray.length -1))
							strTemp = strTemp + ')';
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
		
		var clientValue = null,contractValue = null,buyCurrency = null,sellCurrency = null,statusVal = null, clientVal = null, jsonArray = [];
		var sellerVal = null;
		var messageValue=null;
	     var module = null, type = null;

						/*if (!Ext.isEmpty(me.moduleTypeVal)
								&& "all" != me.moduleTypeVal) {
							module = me.moduleTypeVal;
						}
						if (!Ext.isEmpty(module)) {
							jsonArray.push({
								paramName : 'eventmodule',
								paramValue1 : module,
								operatorValue : 'eq',
								dataType : 'S'
							});
						}*/
						/*if (!Ext.isEmpty(me.subscriptionTypeVal)
								&& "all" != me.subscriptionTypeVal) {
							type = me.subscriptionTypeVal;
						}
						if (!Ext.isEmpty(type)) {
							jsonArray.push({
								paramName : 'subscriptiontype',
								paramValue1 : type,
								operatorValue : 'eq',
								dataType : 'S'
							});
						}*/
		var approvalWorkflowFilterView = me.getSpecificFilterPanel();
		var sellerFltId = approvalWorkflowFilterView.down('combobox[itemId=sellerFltId]');
		if (!Ext.isEmpty(sellerFltId) && !Ext.isEmpty(sellerFltId.getValue())) {
			sellerVal = sellerFltId.getValue();
		}

		if (!Ext.isEmpty(sellerVal)) {
			jsonArray.push({
						paramName : sellerFltId.filterParamName,
						paramValue1 : encodeURIComponent(sellerVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		if (!Ext.isEmpty(me.getClientFilter())
				&& !Ext.isEmpty(me.getClientFilter().getValue())) {
			clientValue = me.getClientFilter().getValue();
		}
		if (clientValue != null) {
			jsonArray.push({
						paramName : me.getClientFilter().name,
						paramValue1 : encodeURIComponent(clientValue.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'lk',
						dataType : 'S'
					});
		}
		if (!Ext.isEmpty(me.getContractFilter())
				&& !Ext.isEmpty(me.getContractFilter().getValue())) {
			contractValue = me.getContractFilter().getValue();
		}
		if (contractValue != null) {
			jsonArray.push({
						paramName : me.getContractFilter().name,
						paramValue1 : encodeURIComponent(contractValue.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'lk',
						dataType : 'S'
					});
		}
		if (!Ext.isEmpty(me.getBuyCurrencyFilter())
				&& !Ext.isEmpty(me.getBuyCurrencyFilter().getValue())) {
			buyCurrency = me.getBuyCurrencyFilter().getValue();
		}
		if (buyCurrency != null) {
			jsonArray.push({
						paramName : me.getBuyCurrencyFilter().name,
						paramValue1 : encodeURIComponent(buyCurrency.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'lk',
						dataType : 'S'
					});
		}
		if (!Ext.isEmpty(me.getSellCurrencyFilter())
				&& !Ext.isEmpty(me.getSellCurrencyFilter().getValue())) {
			sellCurrency = me.getSellCurrencyFilter().getValue();
		}
		if (sellCurrency != null) {
			jsonArray.push({
						paramName : me.getSellCurrencyFilter().name,
						paramValue1 : encodeURIComponent(sellCurrency.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'lk',
						dataType : 'S'
					});
		}
		if (!Ext.isEmpty(me.getStatusFilter())
				&& !Ext.isEmpty(me.getStatusFilter().getValue())) {
			statusVal = me.getStatusFilter().getValue();
		}
		if (!Ext.isEmpty(statusVal) && "ALL" != statusVal) {
			jsonArray.push({
						paramName : me.getStatusFilter().filterParamName,
						paramValue1 : encodeURIComponent(statusVal.replace(new RegExp("'", 'g'), "\''")),
						makerUser : encodeURIComponent(USER.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'statusFilterOp',
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
		var alertGrid = me.getAlertSetupGrid();
		var objConfigMap = me.getScmProductGridConfiguration();
		var arrCols = new Array();
		if (!Ext.isEmpty(alertGrid))
			alertGrid.destroy(true);

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
					padding : '0 10 10 10',
					rowList : _AvailableGridSize,
					minHeight : 0,
					columnModel : arrCols,
					storeModel : storeModel,
					isRowIconVisible : me.isRowIconVisible,
					//isRowMoreMenuVisible : me.isRowMoreMenuVisible,
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

		var clntSetupDtlView = me.getAlertSetupDtlView();
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
				me.showHistory(record.get('contractName'),record.get('history').__deferred.uri, record.get('identifier'));
			}
		} else if (actionName === 'btnView') {
			me.submitExtForm('viewFxContractMaster.form', record, rowIndex);
		} else if (actionName === 'btnEdit') {
			me.submitExtForm('editFxContractMaster.form', record, rowIndex);
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
					clientName : product,
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
			for (var i = 0; i < arrColsPref.length; i++) 
			{
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				cfgCol.lockable = true;
				cfgCol.draggable = true;
				if(objCol.colId == 'Status')
				{
					cfgCol.locked = false;
					cfgCol.lockable = false;
					cfgCol.sortable = false;
					cfgCol.hideable = false;
					cfgCol.hidden = false;
				}
				
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

	createActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'action',
			width : 80,
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			resizable : false,
			draggable : false,
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
						toolTip : getLabel('historyToolTip',
						'View History'),
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
			lockable : false,
			sortable : false,
			hideable : false,
			resizable : false,
			draggable : false,
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
		var strUrl = Ext.String.format('cpon/fxContractMaster/{0}.srvc?',
				strAction);
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
			  fieldLbl = getLabel('prfRejectRemarkPopUpTitle', 'Please Enter Reject Remark');
			  titleMsg = getLabel('prfRejectRemarkPopUpFldLbl', 'Reject Remark');
		  }
		  var prompt=Ext.Msg.show({
		     title : titleMsg,
		     msg : fieldLbl,
		     buttons : Ext.Msg.OKCANCEL,
		     multiline: true,
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
		  	prompt.textArea.enforceMaxLength = true;
		    prompt.textArea.inputEl.set({
		                   maxLength: 255
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
							recordDesc: records[index].data.contractName
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
							var errorMessage = '';
							if(response.responseText != '[]')
						       {
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
			strRetValue = value;
		return strRetValue;
	},

	getScmProductGridConfiguration : function() {
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;
		objWidthMap = {
			"clientDesc" : 200,
			"contractName" : 180,
			"buyCurrency" : 100,
			"sellCurrency" : 100,
			"requestStateDesc" : 100		};

		arrColsPref = [{	
							"colId" : "clientDesc",
							"colDesc" : getLabel("companyName","Company Name")
						}, {
							"colId" : "contractName",
							"colDesc" : getLabel("contractName","Contract Name")
						}, {
							"colId" : "buyCurrency",
							"colDesc" : getLabel("buyCurrency","Buy Currency")
						}, {	
							"colId" : "sellCurrency",
							"colDesc" : getLabel("sellCurrency","Sell Currency")
						},  {
							"colId" : "requestStateDesc",
							"colDesc" : getLabel('status','Status'),
							"sort" : false
						}];

		storeModel = {
					fields : ['clientDesc','contractName', 'sellCurrency', 'buyCurrency',
							 'beanName', 'primaryKey','history','identifier',
							'requestStateDesc', 'parentRecordKey', 'version',
							'recordKeyNo', 'masterRecordkeyNo', '__metadata','contractReference','contractRate','clientId'],
					   proxyUrl : 'cpon/fxContractMaster.json',
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
	handleContractEntryAction : function(entryType) {
		var me = this;
		var form;
		var strUrl = 'addFxContractMaster.form';
		var errorMsg = null;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));

		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
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
							var sellerVal = '';
							var clientName = '';
							var contractName='';
							var buyCurrency='';
							var sellCurrency='';
							
							var approvalWorkflowFilterView = me.getSpecificFilterPanel();
							//var eventId = approvalWorkflowFilterView.down('textfield[itemId="profileNameFltId"]');
							var sellerFltId = approvalWorkflowFilterView.down('combobox[itemId=sellerFltId]');
		                       if (!Ext.isEmpty(sellerFltId) && !Ext.isEmpty(sellerFltId.getValue())) {
			                      sellerVal = sellerFltId.getValue();
		                       }
							   if (!Ext.isEmpty(me.getClientFilter())
			                   	&& !Ext.isEmpty(me.getClientFilter().getValue())) {
			                      clientName = me.getClientFilter().getValue();
		                            }else {
								clientName = getLabel('none', 'None');
							}
							if (!Ext.isEmpty(me.getContractFilter())
			                     	&& !Ext.isEmpty(me.getContractFilter().getValue())) {
			                           contractName = me.getContractFilter().getValue();
		                         }else {
								contractName = getLabel('none', 'None');
							}
								 if (!Ext.isEmpty(me.getBuyCurrencyFilter())
			                     	&& !Ext.isEmpty(me.getBuyCurrencyFilter().getValue())) {
			                            buyCurrency = me.getBuyCurrencyFilter().getValue();
	                                 	}else {
								buyCurrency = getLabel('none', 'None');
							}
							if (!Ext.isEmpty(me.getSellCurrencyFilter())
				                      && !Ext.isEmpty(me.getSellCurrencyFilter().getValue())) {
			                              sellCurrency = me.getSellCurrencyFilter().getValue();
		                          }else {
								sellCurrency = getLabel('none', 'None');
							}
							
							tip.update(getLabel("seller","Seller")
									+ ' : '
									+ sellerVal + '<br/>'
									+getLabel('clientName', 'Client Name') + ' : '
									+clientName+'<br>'
									+ getLabel('contractName', 'Contract Name') + ' : '
									+ contractName+ '<br/>'
									+ getLabel('buyCurrency', 'Buy Currency') + ' : '
									+ buyCurrency+'<br/>'
									+ getLabel('sellCurrency', 'Sell Currency') + ' : '
									+ sellCurrency);
							
						}
					}
				});
	}

});
