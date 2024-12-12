Ext.define('GCP.controller.MandateSetupController', {
	extend : 'Ext.app.Controller',
	requires : [],
	views : ['GCP.view.MandateSetupView','GCP.view.MandateSetupFilterView','GCP.view.MandateSetupGridView','GCP.view.MandateGroupActionBarView','GCP.view.HistoryPopup'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'alertSetupView',
				selector : 'mandateSetupView'
			}, {
				ref : 'createNewToolBar',
				selector : 'mandateSetupView mandateSetupGridView toolbar[itemId="btnCreateNewToolBar"]'
			},{
				ref : 'specificFilterPanel',
				selector : 'mandateSetupView mandateSetupFilterView panel[itemId="specificFilter"]'
			},{
				ref : 'moduleFilterPanel',
				selector : 'mandateSetupView mandateSetupFilterView panel[itemId="moduleFilter"]'
			},{
				ref : 'alertSetupGridView',
				selector : 'mandateSetupView mandateSetupGridView'
			}, {
				ref : 'alertSetupDtlView',
				selector : 'mandateSetupView mandateSetupGridView panel[itemId="clientSetupDtlView"]'
			},{
				ref : 'mandateSetupFilterView',
				selector : 'mandateSetupView mandateSetupFilterView'
			},{
				ref : 'moduleTypeToolBar',
				selector : 'mandateSetupView mandateSetupFilterView toolbar[itemId="moduleTypeToolBar"]'
				},{
				ref : 'gridHeader',
				selector : 'mandateSetupView mandateSetupGridView panel[itemId="clientSetupDtlView"] container[itemId="gridHeader"]'
			}, {
				ref : 'alertSetupGrid',
				selector : 'mandateSetupView mandateSetupGridView grid[itemId="gridViewMstId"]'
			},{
				ref : 'searchTextInput',
				selector : 'mandateSetupGridView textfield[itemId="searchTextField"]'
			}, {
				ref : 'matchCriteria',
				selector : 'mandateSetupGridView radiogroup[itemId="matchCriteria"]'
			},{
				ref : 'grid',
				selector : 'mandateSetupGridView smartgrid'
			},{
				ref : "clientFilter",
				selector : 'mandateSetupView mandateSetupFilterView textfield[itemId="clientNameFltId"]'
			},{
				ref : "mandateFilter",
				selector : 'mandateSetupView mandateSetupFilterView textfield[itemId="mandateNameFltId"]'
			},{
				ref : "moduleComboFilter",
				selector : 'mandateSetupView mandateSetupFilterView combobox[itemId="moduleFltId"]'
			},{
				ref : "statusFilter",
				selector : 'mandateSetupView mandateSetupFilterView combobox[itemId="statusFilter"]'
			}, {
				ref : 'clientInlineBtn',
				selector : 'mandateSetupView mandateSetupFilterView button[itemId="clientBtn"]'
			},{
				ref : 'clientNamesFilterAuto',
				selector : 'mandateSetupView mandateSetupFilterView AutoCompleter[itemId=clientAutoCompleter]'
			}, {
				ref : 'mandateNameFilterAuto',
				selector : 'mandateSetupView mandateSetupFilterView AutoCompleter[itemId=mandateNameFltId]'
			}, {
				ref : 'groupActionBar',
				selector : 'mandateSetupView mandateSetupGridView mandateGroupActionBarView'
			},{
				ref : 'clientListLink',
				selector : 'mandateSetupView toolbar[itemId="btnActionToolBar"] button[itemId="btnClientList"]'
			},
			{
				ref : 'screenTitleLabel',
				selector : 'mandateSetupView mandateSetupTitleView label[itemId="pageTitle"]'
			},{
				ref : 'subscriptionTypeToolBar',
			   selector : 'mandateSetupView mandateSetupFilterView toolbar[itemId="subscriptionTypeToolBar"]'
			}],
	config : {
	
						filterData : [],
						sellerOfSelectedClient : '',
						clientCode : '',
						clientDesc : ''						
		},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		
		me.control({
			'mandateSetupView mandateSetupGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateAlert"]' : {
				click : function() {
					//me.handleAlertEntryAction(true);
	                 me.handleContractEntryAction(true);
				}
			},
			'mandateSetupView mandateSetupGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateBrandingPkg"]' : {
				click : function() {
					me.handleClientEntryAction(false);
				}
			},
			'mandateSetupView mandateSetupFilterView' : {
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
				},
				'handleClientChange' : function(strClientCode,
							strClientDescr, strSellerId){
					me.sellerOfSelectedClient = strSellerId;
					me.clientCode = strClientCode;
					me.clientDesc = strClientDescr;					
					me.resetAllFilters();
					me.changeFilterParams();
					me.setDataForFilter();
					me.applyFilter();
				}
			},			
		     handleModuleType : function(btn) {
											me.handleModuleType(btn);
										},
			'mandateSetupView mandateSetupGridView panel[itemId="clientSetupDtlView"]' : {
				render : function() {
		
					me.handleGridHeader();
					
				}
			},
			'mandateSetupView toolbar[itemId="btnActionToolBar"] button[itemId="btnBrandingPkgList"]' : {
				click : function() {
					me.filterData = [];
					//me.showBrandingPkgList();
					me.handleSpecificFilter();
					me.handleGridHeader();
				}
			},
			'mandateSetupView toolbar[itemId="btnActionToolBar"] button[itemId="btnClientList"]' : {
				click : function() {
					me.filterData = [];
					me.showClientList();
					me.handleSpecificFilter();
					me.handleGridHeader();
				}
			},
			
			'mandateSetupView mandateSetupFilterView combobox[itemId=mandateNameFltId]' : {
				select : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
				},
				change : function(combo, newValue, oldValue, eOpts) {
					if (newValue == '' || null == newValue) {
						me.setDataForFilter();
						me.applyFilter();
					}
				}
			},			

			'mandateSetupGridView' : {
				render : function(panel) {
					me.handleSmartGridConfig();
				}
			},
			'mandateSetupGridView textfield[itemId="searchTextField"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'mandateSetupGridView radiogroup[itemId="matchCriteria"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			
			'mandateSetupGridView smartgrid' : {
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
			'mandateSetupGridView toolbar[itemId=AlertGroupActionBarView_subcriptionDtl]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			}
		});
	},
	
	changeFilterParams : function() {
		var me = this;
		var mandateSetupFilterView = me.getMandateSetupFilterView();
		var mandateNameFltAuto = mandateSetupFilterView
				.down('AutoCompleter[itemId=mandateNameFltId]');
			if (!Ext.isEmpty(mandateNameFltAuto)) {
				mandateNameFltAuto.cfgExtraParams = new Array();
			}
			if (!Ext.isEmpty(mandateNameFltAuto) && !Ext.isEmpty(strSellerId)) {
				mandateNameFltAuto.cfgExtraParams.push({
							key : '$sellerId',
							value : strSellerId
						});
			}
			if (!Ext.isEmpty(mandateNameFltAuto) && me.clientCode!= 'all' && me.clientCode!= null) {
				mandateNameFltAuto.cfgExtraParams.push({
							key : '$clientId',
							value : me.clientCode
						});
			}
	},	
	
	resetAllFilters : function() {
		var me = this;
		if(isClientUser())
			if (!Ext.isEmpty(me.getClientInlineBtn())) {
				//me.getClientInlineBtn().setText(getLabel('allCompanies', 'All Companies'));
			}
		else	
			if (!Ext.isEmpty(me.getClientNamesFilterAuto())) {
				me.getClientNamesFilterAuto().setValue('');
			}
		if (!Ext.isEmpty(me.getMandateNameFilterAuto())) {
			me.getMandateNameFilterAuto().setValue('');
		}
	},	
	
	handleSpecificFilter : function() {
		var me = this;
	    var objStore = Ext.create('Ext.data.Store', {
					fields : ['sellerCode', 'description'],
					proxy : {
						type : 'ajax',
						url : 'services/sellerList.json'
					},
					autoLoad: false
				});
	
		var filterPanel = me.getSpecificFilterPanel();
		if (!Ext.isEmpty(filterPanel))
		{
			filterPanel.removeAll();
		}	
	},
	handleGridHeader : function() {
		var me = this;
		var gridHeaderPanel = me.getGridHeader();
		var createNewPanel = me.getCreateNewToolBar();
		if (!Ext.isEmpty(createNewPanel))
		{
			createNewPanel.removeAll();
		}
		createNewPanel.add(
			{
							xtype : 'button',
							border : 0,
							text : getLabel('createMandate', 'Create New Mandate'),
							glyph : 'xf055@fontawesome',
							cls : 'ux_font-size14 xn-content-btn ux-button-s ',
							parent : this,
						//	padding : '4 0 2 0',
							itemId : 'btnCreateAlert'
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
		var sellerVal = null, receiverNameVal = null, clientCodeVal = null, subCategoryVal = null, jsonArray = [];
		var clientParamName = null, clientNameOperator = null;
		var clientNamesFltId = null;
		var mandateSetupFilterView = me.getMandateSetupFilterView();
		var mandateNameFltId = mandateSetupFilterView
				.down('combobox[itemId=mandateNameFltId]');

		if(isClientUser())
			clientNamesFltId = mandateSetupFilterView
					.down('button[itemId="clientBtn"]');	
		else
			clientNamesFltId = mandateSetupFilterView
					.down('combobox[itemId=clientAutoCompleter]');
		if (!Ext.isEmpty(mandateNameFltId)
				&& !Ext.isEmpty(mandateNameFltId.getValue())) {
			receiverName = mandateNameFltId.getValue(), receiverNameVal = receiverName
					.trim();
		}

		if (!Ext.isEmpty(receiverNameVal)) {
			jsonArray.push({
						paramName : 'mandateName',
						paramValue1 : receiverNameVal.toUpperCase(),
						operatorValue : 'lk',
						dataType : 'S'
					});
		}

		if (!Ext.isEmpty(clientNamesFltId) && !Ext.isEmpty(me.clientCode) && me.clientCode!= 'all' ) {
			clientParamName = 'drawerClientName';
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
				//	padding : '5 0 0 0',
					cls:'ux_panel-transparent-background  ux_largepaddinglr ux_largepadding-bottom ux_largemargin-bottom',
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
				me.showHistory(record.get('clientDesc'),record.get('history').__deferred.uri, record.get('identifier'));
			}
		} else if (actionName === 'btnView') {
			me.submitExtForm('viewMandate.form', record, rowIndex);
		} else if (actionName === 'btnEdit') {
			me.submitExtForm('editMandate.form', record, rowIndex);
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
		} 
		else if (maskPosition === 2 && retValue) 
		{
			var reqState = record.raw.requestState;
			var submitFlag = record.raw.isSubmitted;
			var validFlag = record.raw.validFlag;
			var editMode = record.raw.editMode;
			var DisplMandateDescription = record.raw.displMandateDescription;
//			alert("madn desc: " + DisplMandateDescription + "edit mode: "+editMode + " Entity type: "+strEntityTYpe);
			var isEditAppl;
			if(editMode == '' || editMode == 'undefined')
			{
				isEditAppl = true;
			}
			else if(editMode == 'B' && strEntityTYpe == '1')
			{
				isEditAppl = false;
			}
			else if(editMode == 'C' && strEntityTYpe == '0')
			{
				isEditAppl = false;
			}
			else if(editMode == 'X')
			{
				isEditAppl = false;
			}
			else
			{
				isEditAppl = true;
			}
			var isDisabled = (reqState === 3 && validFlag == 'N');
			var isSubmitModified = (reqState === 1 && submitFlag == 'Y');
			retValue = retValue && (!isDisabled) && (!isSubmitModified) && (isEditAppl);
		} 
		else if (maskPosition === 10 && retValue) {
			var reqState = record.raw.requestState;
			var submitFlag = record.raw.isSubmitted;
			var submitResult = (reqState === 0 && submitFlag == 'Y');
			retValue = retValue && (!submitResult);
		}
		else if (maskPosition === 8 && retValue) {
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
		var strUrl = Ext.String.format('cpon/mandateMaster/{0}.srvc?',
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
			"clientDesc" : 150,
			"displMandateDescription" : 150,	
			"displDebtorReference" : 150,	
			"requestStateDesc" : 90		};

		arrColsPref = [{	
							"colId" : "clientDesc",
							"colDesc" : "Company Name"
						}, {
							"colId" : "displMandateDescription",
							"colDesc" : "Mandate Name"
						}, {
							"colId" : "displDebtorReference",
							"colDesc" : "Mandate Debtor Reference"
						}, {
							"colId" : "requestStateDesc",
							"colDesc" : "Status"
						}];

		storeModel = {
					fields : ['clientDesc','displMandateDescription', 'displDebtorReference', 'drawerId',
							 'beanName', 'primaryKey','history','identifier',
							'requestStateDesc', 'parentRecordKey', 'version',
							'recordKeyNo', 'masterRecordkeyNo', '__metadata'],
					   proxyUrl : 'cpon/mandateMaster.json',
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
		var strUrl = 'addMandate.form';
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
	/* Function sets the filter Panel element values in JSON */
	setFilterParameters : function(form) {
		var me = this;
		var drawerNameVal = null;
		var arrJsn = {};
		var mandateSetupFilterView = me.getMandateSetupFilterView();
		var mandateNameFltId = mandateSetupFilterView
				.down('combobox[itemId=mandateNameFltId]');
		if (!Ext.isEmpty(mandateNameFltId)
				&& !Ext.isEmpty(mandateNameFltId.getValue())) {
			drawerNameVal = mandateNameFltId.getValue();
		}
		arrJsn['sellerId'] = (!Ext.isEmpty(me.sellerOfSelectedClient)) ? me.sellerOfSelectedClient : strSellerId;
		arrJsn['clientId'] = me.clientCode;
		arrJsn['clientDesc'] = me.clientDesc;
		arrJsn['drawerName'] = drawerNameVal;
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
							var clientValue = '';
							var drawerValue='';
							var drawerName = '';
							var mandateSetupFilterView = me.getMandateSetupFilterView();
							
							var mandateNameFltId = mandateSetupFilterView
									.down('combobox[itemId=mandateNameFltId]');
							
							if (!Ext.isEmpty(mandateNameFltId)
									&& !Ext.isEmpty(mandateNameFltId.getValue())) {
								drawerName =mandateNameFltId.getValue();
							}else
								drawerName = getLabel('none','None');							
							
							client = (me.clientDesc != '') ? me.clientDesc : getLabel('allcompanies', 'All Companies');
							
							tip.update(getLabel('drawerName', 'Drawer Name') + ' : '
									+ drawerName+ '<br/>'
									+ getLabel('grid.column.company', 'Company Name') + ' : '
									+ client);
							
						}
					}
				});
	}

});
