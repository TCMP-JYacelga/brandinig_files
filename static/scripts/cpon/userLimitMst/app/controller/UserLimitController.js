Ext.define('GCP.controller.UserLimitController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.ux.gcp.PreferencesHandler'],
	views : ['GCP.view.UserLimitView', 'GCP.view.UserLimitGridView',
			'GCP.view.HistoryPopup', 'GCP.view.UserLimitActionBarView'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [
			{
				ref:'filterView',
				selector:'filterView'	
			},{
				ref : 'userLimitView',
				selector : 'userLimitView'
			},
			{
				ref : 'groupView',
				selector : 'userLimitView groupView'
			},{
				ref : 'createNewToolBar',
				selector : 'userLimitView userLimitViewGridView toolbar[itemId="btnCreateNewToolBar"]'
			}, {
				ref : 'specificFilterPanel',
				selector : 'userLimitView userLimitFilterView panel[itemId="specificFilter"]'
			}, {
				ref : 'userLimitFilterView',
				selector : 'userLimitView userLimitFilterView'
			}, {
				ref : 'sellerFilterPanel',
				selector : 'userLimitView userLimitFilterView panel[itemId="sellerFilter"]'
			}, {
				ref : 'sellerCombo',
				selector : 'userLimitView userLimitFilterView panel[itemId="sellerFilter"] combo[itemId="sellerCombo"]'
			}, {
				ref : 'userLimitGridView',
				selector : 'userLimitView userLimitGridView'
			}, {
				ref : 'userLimitSetupDtlView',
				selector : 'userLimitView userLimitGridView panel[itemId="userLimitSetupDtlView"]'
			}, {
				ref : 'gridHeader',
				selector : 'userLimitView userLimitGridView panel[itemId="userLimitSetupDtlView"] container[itemId="gridHeader"]'
			}, {
				ref : 'userLimitGrid',
				selector : 'userLimitView userLimitGridView grid[itemId="gridViewMstId"]'
			}, {
				ref : 'searchTextInput',
				selector : 'userLimitGridView textfield[itemId="searchTextField"]'
			}, {
				ref : 'matchCriteria',
				selector : 'userLimitGridView radiogroup[itemId="matchCriteria"]'
			}, {
				ref : 'grid',
				selector : 'userLimitGridView smartgrid'
			}, {
				ref : "sellerFilter",
				selector : 'userLimitView userLimitFilterView combobox[itemId="sellerFltId"]'
			}, {
				ref : "clientFilter",
				selector : 'userLimitView userLimitFilterView textfield[itemId="clientFilter"]'
			},{
				ref : "profileFilter",
				selector : 'userLimitView userLimitFilterView textfield[itemId="profileNameFltId"]'
			}, {
				ref : "statusFilter",
				selector : 'userLimitView userLimitFilterView combobox[itemId="statusFilter"]'
			},  {
				ref : 'groupActionBar',
				selector : 'userLimitView userLimitGridView userLimitBarView'
			}, {
				ref : 'clientListLink',
				selector : 'userLimitView toolbar[itemId="btnActionToolBar"] button[itemId="btnClientList"]'
			}, {
				ref : 'prfMstDtlView',
				selector : 'userLimitView userLimitGridView panel[itemId="prfMstDtlView"]'
			}],
	config : {
		selectedMst : 'client',
		clientListCount : 0,
		brandingPkgListCount : 0,
		filterData : [],
		prdCountClicked : '',
		clientId : '',
		strPageName:'userLimitMst',
		preferenceHandler : null
		},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		//me.updateConfig();
		$(document).on('performPageSettings', function(event) {
			me.showPageSettingPopup();
		});
		$(document).on('handleClientChangeInQuickFilter',function(event,isSessionClientFilter) {
			me.handleClientChangeInQuickFilter(isSessionClientFilter);
		});
		$(document).on('handleLimitProfileAdd',function(event) {
			me.handleAddNewProfileMaster();
		});
		me.control({
			'filterView button[itemId="clearSettingsButton"]' : {
				'click' : function() {
					me.handleClearSettings();
				}
			},'filterView' : {
				appliedFilterDelete : function(btn){
					me.handleAppliedFilterDelete(btn);
				}
			},
			'pageSettingPopUp' : {
				'applyPageSetting' : function(popup, data) {
					me.applyPageSetting(data);
				},
				'savePageSetting' : function(popup, data,strInvokedFrom) {
					me.savePageSetting(data,strInvokedFrom);
				},
				'restorePageSetting' : function(popup) {
					me.restorePageSetting();
				}
			},
			'userLimitView userLimitFilterView' : {
				render : function() {
					me.setInfoTooltip();
					me.handleSpecificFilter();
				}
			},
			'userLimitView userLimitFilterView combobox[itemId=sellerCombo]' : {
				select : function(btn, opts) {
					me.resetAllFilters();
					me.changeFilterParams();
				},
				change : function(btn, opts) {
					me.resetAllFilters();
					me.changeFilterParams();
				}
			},
			'userLimitView userLimitFilterView AutoCompleter[itemId=clientFilter]' : {
				select : function(combo, record,index) {
					me.resetAllFilters();
					me.clientId = record[ 0 ].data.CODE ;
					me.changeFilterParams();
				},
				change : function(combo, record,index) {
					if(combo.value == ''|| combo.value == null) {
						me.clientId = '';
						me.changeFilterParams();
					}
				}
			},
			'userLimitView userLimitFilterView button[itemId="btnFilter"]' : {
				click : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
				}
			},
			'userLimitView toolbar[itemId="btnActionToolBar"] button[itemId="btnClientList"]' : {
				click : function() {
					me.filterData = [];
					me.handleSpecificFilter();
					me.handleGridHeader();
				}
			},

			'userLimitGridView toolbar[itemId=clientGroupActionBarView_clientDtl]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			},
			'userLimitView groupView' : {
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
					//me.disablePreferencesButton("savePrefMenuBtn",false);
				},
				'toggleGridPager' : function() {
					//me.disablePreferencesButton("savePrefMenuBtn",false);
				},
				'gridRowActionClick' : function(grid, rowIndex, columnIndex,
						actionName, record) {
					me.doHandleRowActions(actionName, grid, record);
				},
				'groupActionClick' : function(actionName, isGroupAction,
						maskPosition, grid, arrSelectedRecords) {
					if (isGroupAction === true)
						me.doHandleGroupActions(actionName, grid,
								arrSelectedRecords, 'groupAction');
				},						
				'gridStoreLoad' : function(grid, store) {
						me.disableActions(false);
				},
			
				afterrender : function(panel,opts){
					//me.setFilterRetainedValues();
					//me.clientCode = strClientId;
					//me.clientDesc = strClientDescription;	
					//me.setInfoTooltip();	
				}
			}

		});
	},
	handleClearSettings:function(){
		var me=this;
		var clientSetupFilterView = me.getUserLimitFilterView();
		if(!Ext.isEmpty(clientSetupFilterView)){
		var clientFilter = me.getClientFilter();
		var profileFilter = me.getProfileFilter();
		var statusFilter = me.getStatusFilter();
		
		statusFilter.setValue('ALL');
		clientFilter.setValue("");
		profileFilter.setValue("");		
		me.clientDesc='';
		me.clientCode='';
		me.filterData=[];
		me.refreshData();
		me.changeFilterParams();
		}
	},
	handleAppliedFilterDelete : function(btn){
		var me = this;
		var objData = btn.data;
		var quickJsonData = me.filterData;
		if(!Ext.isEmpty(objData)){
			var paramName = objData.paramName || objData.field;
				reqJsonInQuick = me.findInQuickFilterData(quickJsonData,paramName);
				if (!Ext.isEmpty(reqJsonInQuick)) {
					arrQuickJson = quickJsonData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,paramName);
					me.filterData = arrQuickJson;
				}
			me.resetFieldInQuickFilterOnDelete(objData);
			me.refreshData();
			me.changeFilterParams();
		}
	},
	resetFieldInQuickFilterOnDelete : function(objData){
		var me = this,strFieldName;
		var clientSetupFilterView = me.getUserLimitFilterView();
		var clientFilter = me.getClientFilter();
		var profileFilter = me.getProfileFilter();
		var statusFilter = me.getStatusFilter();

		if(!Ext.isEmpty(objData))
			strFieldName = objData.paramName || objData.field;
		
		if ( strFieldName ==='profileName' && profileFilter ) {
			profileFilter.setValue("");
		}
		if( strFieldName === 'clientID' && clientFilter ){
			
			clientFilter.setValue("");
		}
		if (strFieldName ==='requestState' && !Ext.isEmpty(statusFilter)) {
			statusFilter.setValue('ALL');
		}
	},
	findInQuickFilterData : function(arr, key) {
		var reqJson = null;
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.paramName == key) {
				reqJson = ai;
			}
		}
		return reqJson;
	},
	removeFromQuickArrJson : function(arr, key) {
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.paramName == key) {
				arr.splice(i, 1);
			}
		}
		return arr;
	},
	updateConfig : function() {
		var me = this,arrJsn=new Array();
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		if( !Ext.isEmpty( objReceiverMstPref ) )
				{
					var objJsonData = Ext.decode( objReceiverMstPref );
					var data = objJsonData.d.preferences.gridViewFilter;
					if( data != 'undefined' && !Ext.isEmpty(data))
					{
						receiverName = data.quickFilter.receiverNameVal;
						accountNmbr=data.quickFilter.accountNoVal;
						if(!Ext.isEmpty(data.filterSelectedClientCode) && data.filterSelectedClientCode !='all'){
							me.clientCode = data.filterSelectedClientCode;
							me.clientDesc = data.filterSelectedClientDesc;
						}		
					}	
					
				}

				if (!Ext.isEmpty(receiverName)) {
					arrJsn.push({
								paramName : me.filterReceiverName,
								paramValue1 : encodeURIComponent(receiverName.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
								operatorValue : 'lk',
								dataType : 'S'
							});
				}
				if (!Ext.isEmpty(accountNmbr)) {
					arrJsn.push({
								paramName : me.filterAccountNo,
								paramValue1 : encodeURIComponent(accountNmbr.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
								operatorValue : 'lk',
								dataType : 'S'
							});
				}
				if (!Ext.isEmpty(me.clientDesc)&&!Ext.isEmpty(me.clientCode) && me.clientCode!= 'all' ) {
					clientParamName = 'clientId';
					clientNameOperator = 'eq';
					if (!Ext.isEmpty(me.clientCode)) {
						clientCodeVal = me.clientCode;
					} else {
						clientCodeVal = strClientId;
					}
		
					if (!Ext.isEmpty(clientCodeVal)) {
						arrJsn.push({
									paramName : clientParamName,
									paramValue1 : encodeURIComponent(clientCodeVal.replace(new RegExp("'", 'g'), "\''")),
									operatorValue : clientNameOperator,
									paramFieldLable : 'Client Name',
									dataType : 'S'
								});
					}
				}
				if (userType == '1') {
					$("#summaryClientFilterSpan").text(me.clientDesc);
					changeClientAndRefreshGrid(me.clientCode,me.clientDesc)
				}else if(userType=='0'){
					$("#summaryClientFilter").val(me.clientDesc);
					changeClientAndRefreshGrid(me.clientCode,me.clientDesc)
				}
				me.filterData = arrJsn;
	},
	applyPageSetting : function(arrPref) {
		var me = this;
		if (!Ext.isEmpty(arrPref)) {
			me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
					me.postHandlePageGridSetting, null, me, false);
		}
	},
	restorePageSetting : function() {
		var me = this;
			me.preferenceHandler.clearPagePreferences(me.strPageName, null,
					me.postHandlePageGridSetting, null, me, false);
	},
	savePageSetting : function(arrPref, strInvokedFrom) {
		/* This will be get invoked from page level setting always */
		var me = this, args = {};
		if (!Ext.isEmpty(arrPref)) {
			me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
					me.postHandleSavePageSetting, args, me, false);
		}
	},
	postHandlePageGridSetting : function(data, args, isSuccess) {
		if (isSuccess === 'Y') {
			window.location.reload();
		} else {
			Ext.MessageBox.show({
						title : getLabel('instrumentErrorPopUpTitle', 'Error'),
						msg : getLabel('errorMsg',
								'Error while apply/restore setting'),
						buttons : Ext.MessageBox.OK,
						cls : 't7-popup',
						icon : Ext.MessageBox.ERROR
					});
		}
	},
	doHandleGroupActions : function(strAction, grid, arrSelectedRecords,
			strActionType) {
		var me = this;
		if(!Ext.isEmpty(strAction))
			var strAction = strAction;
		var strUrl = Ext.String.format('cpon/userLimitProfileMst/{0}', strAction);
		strUrl = strUrl + ".srvc?" + csrfTokenName + "=" + csrfTokenValue;
		if (strAction === 'reject') {
			me.showRejectPopUp(strAction, strUrl, grid, arrSelectedRecords);

		} else {
			me.preHandleGroupActions(strUrl, '',grid,arrSelectedRecords);
		}
	},
	doHandleRowActions : function(actionName, objGrid, record) {
		var me = this;
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();
		var selectedRecord=grid.getSelectionModel().getSelection()[0];
		var rowIndex = grid.store.indexOf(selectedRecord);
		if (actionName === 'submit' || actionName === 'discard'
			|| actionName === 'accept' || actionName === 'reject'
			|| actionName === 'enable' || actionName === 'disable')
		me.doHandleGroupActions(actionName, grid, [record], 'rowAction');
	else if (actionName === 'btnHistory') {
		var recHistory = 'cpon/common/history.json?&$histSeekPageId=history.seek.profileLimit';
		me.showHistory(record.get('profileName'),recHistory,record.get('identifier'));
	} else if (actionName === 'btnView' || actionName === 'btnEdit') {
		if (actionName === 'btnView') {
			me.submitExtForm('userLimitViewProfileMst.form', record, rowIndex);
		} else if (actionName === 'btnEdit') {
			me.submitExtForm('userLimitEditProfileMst.form', record, rowIndex);
		}
		}
	},
	handleClientChangeInQuickFilter : function(isSessionClientFilter) {
		var me = this;
		//quickFilterClientValSelected = me.clientCode;
		me.filterApplied = 'Q';
		me.setDataForFilter();
		if (me.clientCode === 'all') {
			me.filterApplied = 'ALL';
			me.refreshData();

		} else {
			me.applyFilter();
		}
	},
	doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid,
			objRecord, intRecordIndex, selectedRecords, jsonData) {
		var me = this;
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		var blnAuthInstLevel = false;
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
		me.enableDisableGroupActions(actionMask, isSameUser, isDisabled,
				isSubmit);
	},
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) {
		var me = this;
		var objGroupView = me.getGroupView();
		var strModule = '', strUrl = null, args = null;
		groupInfo = groupInfo || {};
		subGroupInfo = subGroupInfo || {};
		objGroupView.reconfigureGrid(null);
	},
	doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter, filterData) {
		var me = this;
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		var arrOfParseQuickFilter = [] ;
		//objGroupView.handleGroupActionsVisibility(buttonMask);
		me.setDataForFilter();
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl += me.getFilterUrl(subGroupInfo, groupInfo);
		strUrl += strUrl + '&$module=C';
		var sellerCombo = me.getSellerCombo(),sellerParam;
		if (!Ext.isEmpty(sellerCombo) && !Ext.isEmpty(sellerCombo.getValue())) {
			sellerParam = sellerCombo.getValue().toUpperCase();
			strUrl = strUrl + '&$selectedseller=' + sellerParam;
		}

		if(!Ext.isEmpty(me.filterData)){
			if(!Ext.isEmpty(me.filterData) && me.filterData.length >= 1){
				arrOfParseQuickFilter = generateFilterArray(me.filterData);
			}
		}
		if(arrOfParseQuickFilter)
				me.getFilterView().updateFilterInfo(arrOfParseQuickFilter);

		me.reportGridOrder = strUrl;
		me.disableActions(true);
		grid.loadGridData(strUrl, null, null, false);
		grid.on('cellclick', function(tableView, td, cellIndex, record, tr, rowIndex, e) {
			var clickedColumn = tableView.getGridColumns()[cellIndex];
			var columnType = clickedColumn.colType;
			if(Ext.isEmpty(columnType)) {
				var containsCheckboxCss = (clickedColumn.cls.indexOf('x-column-header-checkbox') > -1)
				columnType = containsCheckboxCss ? 'checkboxColumn' : '';
			}
			me.handleGridRowClick(record, grid, columnType);
		});
	},
	resetAllFilters : function() {
		var me = this;
		var userLimitFilterView = me.getUserLimitFilterView();
		me.clientId = '' ;
		var statusFilter = userLimitFilterView
				.down('combobox[itemId=statusFilter]');
		
		if (!Ext.isEmpty(me.getProfileFilter())) {
			me.getProfileFilter().setValue('');
		}
		
		if (!Ext.isEmpty(statusFilter)) {
			statusFilter.setValue('ALL');
		}
		return;
	},
	changeFilterParams : function() {
		var me = this;
		var userLimitFilterView = me.getUserLimitFilterView();
		var sellerCombo = userLimitFilterView
				.down('combobox[itemId=sellerCombo]');
		var clientField = userLimitFilterView
		.down('AutoCompleter[itemId=clientFilter]');
		var profileNameFltAuto = userLimitFilterView
				.down('AutoCompleter[itemId=profileNameFltId]');
		
		if (!Ext.isEmpty(clientField)) {
			clientField.cfgExtraParams = new Array();
		}
		if (!Ext.isEmpty(profileNameFltAuto)) {
			profileNameFltAuto.cfgExtraParams = new Array();
		}

		if (!Ext.isEmpty(sellerCombo)) {
			if (!Ext.isEmpty(clientField)) {
				clientField.cfgExtraParams.push({
							key : '$filtercode1',
							value : sellerCombo.getValue()
						});
			}
		} else {
			if (!Ext.isEmpty(clientField)) {
				clientField.cfgExtraParams.push({
							key : '$filtercode1',
							value : strSellerId
						});
			}
		}
		
		if (!Ext.isEmpty(clientField)) {
			if (!Ext.isEmpty(profileNameFltAuto)) {
				var sellerValue = strSellerId;
				if (sellerCombo != null)
					sellerValue = sellerCombo.getValue();
				profileNameFltAuto.cfgExtraParams.push({
							key : '$sellerCode',
							value : sellerValue
						},
						{
							key : '$clientId',
							value : me.clientId
						}
				
				);
			} 
		} else {
			if (!Ext.isEmpty(profileNameFltAuto)) {
				profileNameFltAuto.cfgExtraParams.push({
							key : '$sellerCode',
							value : strSellerId
						},
						{
							key : '$clientId',
							value : me.clientId
						});
			}
		}
	},
	setFilterRetainedValues : function() {
		var me = this;
		var userLimitFilterView = me.getSpecificFilterPanel();
		// Set Seller Id Filter Value
	//	var sellerFltId = me.getSellerCombo();
	//	sellerFltId.setValue(strSellerId);

		// set Status Name Filter Value
		me.getStatusFilter().store.loadRawData({
					"d" : {
						"filter" : [{
									"name" : filterStatus,
									"value" : filterStatusDesc
								}]
					}
				});
		me.getStatusFilter().suspendEvents();
		me.getStatusFilter().setValue(filterStatus);
		me.getStatusFilter().resumeEvents();
		// Set Matrix Type Filter Value
		me.getProfileFilter().setValue(filterPayMethodName);
		me.changeFilterParams();
	},
	showPageSettingPopup : function() {
		var me = this, objData = {}, objGroupView = me.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting;
		var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeMaster;

		me.pageSettingPopup = null;

		if (!Ext.isEmpty(objReceiverMstPref)) {
			objPrefData = Ext.decode(objReceiverMstPref);
			objGeneralSetting = objPrefData && objPrefData.d.preferences
					&& objPrefData.d.preferences.GeneralSetting
					? objPrefData.d.preferences.GeneralSetting
					: null;
			objGridSetting = objPrefData && objPrefData.d.preferences
					&& objPrefData.d.preferences.GridSetting
					? objPrefData.d.preferences.GridSetting
					: null;
			/**
			 * This default column setting can be taken from
			 * preferences/gridsets/uder defined( js file)
			 */
			objColumnSetting = objPrefData && objPrefData.d.preferences
					&& objPrefData.d.preferences.ColumnSetting
					&& objPrefData.d.preferences.ColumnSetting.gridCols
					&& objPrefData.d.preferences.ColumnSetting.gridCols.length > 0 
					? objPrefData.d.preferences.ColumnSetting.gridCols
					: (USER_LIMIT_GENERIC_COLUMN_MODEL || '[]');

			if (!Ext.isEmpty(objGeneralSetting)) {
				objGroupByVal = objGeneralSetting.defaultGroupByCode;
				objDefaultFilterVal = objGeneralSetting.defaultFilterCode;
			}
			if (!Ext.isEmpty(objGridSetting)) {
				objGridSizeVal = objGridSetting.defaultGridSize;
				objRowPerPageVal = objGridSetting.defaultRowPerPage;
			}
		}

		objGroupView.cfgShowAdvancedFilterLink= false;
		objData["groupByData"] = objGroupView
				? objGroupView.cfgGroupByData
				: [];
		objData["filterUrl"] = 'services/userfilterslist/'+me.strPageName;
		objData["rowPerPage"] = _AvailableGridSize;
		objData["groupByVal"] = objGroupByVal;
		objData["filterVal"] = objDefaultFilterVal;
		objData["gridSizeVal"] = objGridSizeVal;
		objData["rowPerPageVal"] = objRowPerPageVal;

		me.pageSettingPopup = Ext.create('Ext.ux.gcp.PageSettingPopUp', {
					cfgPopUpData : objData,
					cfgGroupView : objGroupView,
					cfgDefaultColumnModel : objColumnSetting,
					cfgViewOnly : _IsEmulationMode
				});
		me.pageSettingPopup.show();
		me.pageSettingPopup.center();
	},
	handleSpecificFilter : function() {
		var me = this;
		var storeData;
		var multipleSellersAvailable = false;

		var seekUrl ;
		var seekId ;

		if(entityType == 0)
		{
			seekUrl = 'cpon/userseek/userLimitClientIdSeek.json';
			seekId = 'userLimitClientIdSeek';
		}
		else
		{
			seekUrl = 'cpon/userseek/userLimitClientIdSeekClient.json';
			seekId = 'userLimitClientIdSeekClient';
		}

		
		Ext.Ajax.request({
					url : 'services/userseek/adminSellersListCommon.json',
					method : 'POST',
					async : false,
					success : function(response) {
						var data = Ext.decode(response.responseText);
						var sellerData = data.d.preferences;
						if (!Ext.isEmpty(data)) {
							storeData = sellerData;
						}
					},
					failure : function(response) {
						// console.log("Ajax Get data Call Failed");
					}
				});

		var sellerStore = Ext.create('Ext.data.Store', {
					fields : ['CODE', 'DESCR'],
					data : storeData,
					reader : {
						type : 'json',
						root : 'preferences'
					}					
				});
		if (sellerStore.getCount() > 1) {
			multipleSellersAvailable = true;
		}

		objStore = Ext.create('Ext.data.Store', {
					fields : ["name", "value"],
					proxy : {
						type : 'ajax',
						autoLoad : true,
						url : 'cpon/productTypeList.json',
						actionMethods : {
							read : 'POST'
						},
						reader : {
							type : 'json',
							root : 'd.filter'
						}
					}
				});
		//me.getSearchTextInput().setValue('');
		//me.getStatusFilter().setValue('');
		
		var clientTextfield = Ext.create('Ext.ux.gcp.AutoCompleter', {
			width : 250,
			name : 'clientID',
			padding: '0 30 0 0',
			itemId : 'clientFilter',
			cfgUrl : seekUrl,
			cfgProxyMethodType : 'POST',
			cfgQueryParamName : '$autofilter',
			cfgRecordCount : -1,
			cfgSeekId : seekId,
			enableQueryParam:false,
			cfgDataNode1 : 'DESCRIPTION',
			cfgKeyNode : 'CODE',
			cfgExtraParams :
			[
				{
					key : '$filtercode1',
					value : me.getSellerCombo()
				}
			],
			cfgRootNode : 'd.preferences',
			listeners : {
				'select' : function(combo, record) {
					//selectedFilterClientDesc = combo.getRawValue();
					//selectedFilterClient = combo.getValue();
					me.clientId = me.getClientFilter().getValue();
					$(document).trigger("handleClientChangeInQuickFilter", false);
					//me.setDataForFilter();
					//me.applyFilter();
				},
				'change' : function(combo, record) {
					if (Ext.isEmpty(combo.getValue())) {
						//selectedFilterClientDesc = "";
						//selectedFilterClient = "";
						$(document).trigger(
								"handleClientChangeInQuickFilter",
								false);
					}
				}
			}
		});
		
		var profileTextfield = Ext.create('Ext.ux.gcp.AutoCompleter', {
			name : 'profileName',
			fitToParent : true,
			width : 250,
			padding : '0 30 0 0',
			itemId : 'profileNameFltId',
			cfgUrl : entityType == "1" ?  "cpon/userseek/{0}.json": 'cpon/cponseek/{0}.json',
			cfgProxyMethodType : 'POST',
			cfgQueryParamName : entityType == "1" ? '$autofilter' : 'qfilter',
			cfgRecordCount : -1,
			enableQueryParam:false,
			cfgSeekId : 'userLimitprofilenameseek',
			cfgRootNode : entityType == "1" ? 'd.preferences' : 'd.filter',
			cfgDataNode1 : entityType == "1" ? 'NAME' : 'name',
			listeners : {
				'select' : function(combo, record) {
					//selectedFilterClientDesc = combo.getRawValue();
					//selectedFilterClient = combo.getValue();
					me.clientId = me.getClientFilter().getValue();
					$(document).trigger("handleClientChangeInQuickFilter", false);
					//me.setDataForFilter();
					//me.applyFilter();
				},
				'change' : function(combo, record) {
					if (Ext.isEmpty(combo.getValue())) {
						//selectedFilterClientDesc = "";
						//selectedFilterClient = "";
						$(document).trigger(
								"handleClientChangeInQuickFilter",
								false);
					}
				}
			}
		});
		
		var filterPanel = me.getSpecificFilterPanel();
		var sellerPanel = me.getSellerFilterPanel();
		if (!Ext.isEmpty(filterPanel)) {
			filterPanel.removeAll();
		}
		
		filterPanel.add({
			xtype : 'panel',
			cls : 'xn-filter-toolbar ux_verylargemargin-right',
			layout : 'vbox',
			items : [ {
				xtype : 'label',
				text : getLabel('companyName', 'Company Name'),
				cls : 'frmLabel'
			},clientTextfield ]
		});

		//filterPanel.columnWidth = 0.50;

		filterPanel.add({
					xtype : 'panel',
					cls : 'xn-filter-toolbar',
					layout : 'vbox',
					items : [{
								xtype : 'label',
								text : getLabel('profilename',
										'Profile Name'),
								cls : 'frmLabel'
							}, profileTextfield]
				});
		if (!Ext.isEmpty(sellerPanel)) {
			sellerPanel.removeAll();
		}
		if(multipleSellersAvailable === true)
		{
		sellerPanel.add({
					xtype : 'label',
					text : getLabel('financialInstitution',
							'Financial Institution'),
							cls :'frmLabel'
				}, {
					xtype : 'combo',
					width : 250,
					padding: '0 30 0 0',
					editable : false,
					triggerAction : 'all',
					displayField : 'DESCR',
					filterParamName : 'sellerId',
					itemId : 'sellerCombo',
					valueField : 'CODE',
					name : 'sellerCombo',
					editable : false,
					value : strSellerId,
					store : sellerStore,
					listeners : {
						'select' : function(combo, strNewValue, strOldValue) {
							setAdminSeller(combo.getValue());
						}
					}
				});
			}
			sellerPanel.show();

	},
	handleGridHeader : function() {
		var me = this;
		var gridHeaderPanel = me.getGridHeader();
		// var createNewPanel = me.getCreateNewToolBar();

	},

	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		me.setDataForFilter();
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + me.getFilterUrl();
		var sellerCombo = me.getSellerCombo(),sellerParam;
		if (!Ext.isEmpty(sellerCombo) && !Ext.isEmpty(sellerCombo.getValue())) {
			sellerParam = sellerCombo.getValue().toUpperCase();
			strUrl = strUrl + '&$selectedseller=' + sellerParam;
		}
		strUrl += strUrl + '&$module=C';
		grid.loadGridData(strUrl, null);
	},

	getFilterUrl : function(subGroupInfo, groupInfo) {
		var me = this;
		var strQuickFilterUrl = '';
		var strUrl = '';
		var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
		? subGroupInfo.groupQuery
		: '';
		strQuickFilterUrl = me.generateUrlWithFilterParams(this);
		if (!Ext.isEmpty(strGroupQuery)) {
			if (!Ext.isEmpty(strQuickFilterUrl))
				{
				strQuickFilterUrl = '&$filter=' + strQuickFilterUrl;
				strQuickFilterUrl += ' and ' + strGroupQuery;
				}
			else
				strQuickFilterUrl += '&$filter=' + strGroupQuery;
		}
		else
		{
			if (!Ext.isEmpty(strQuickFilterUrl))
				strQuickFilterUrl = '&$filter=' + strQuickFilterUrl;
		}
		return strQuickFilterUrl;
	},

	generateUrlWithFilterParams : function(thisClass) {
		var me = this;
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
					for (var i = 0; i < objValue.length; i++) {
							if( i== 0)
							strTemp = strTemp + '(';
						    //New Submitted
							if(objValue[i] == 12){
								strTemp = strTemp + "(requestState eq 0 and isSubmitted eq 'Y')";
							}
							//Modified Submitted
							else if(objValue[i] == 14){
								strTemp = strTemp + "(requestState eq 1 and isSubmitted eq 'Y')";
							}
							else if(objValue[i] == 3){
								strTemp = strTemp + "(requestState eq 3 and validFlag eq 'Y')";
							}
							else if(objValue[i] == 11){
								strTemp = strTemp + "(requestState eq 3 and validFlag eq 'N')";
							}
							else if(objValue[i] == 13){
								strTemp = strTemp + "(((isSubmitted eq 'Y' and (requestState eq '0' or requestState eq '1' )) or (requestState eq '4') or (requestState eq '5'))and makerId ne '"+objUser+"' )";
							}
							else if(objValue[i] == 0 || objValue[i] == 1){
								strTemp = strTemp + "(requestState eq "+objValue[i]+" and isSubmitted eq 'N')";
							}
							else{
								strTemp = strTemp + "(requestState eq "+objValue[i]+")";
							}
							if(i != (objValue.length -1)){
								strTemp = strTemp + ' or ';
							}
							if(i == (objValue.length -1))
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
		//me.getSearchTextInput().setValue('');
		var clientVal = null, statusFilterVal = null, profileVal = null, jsonArray = [],statusFilterDiscArray;
		var sellerVal = null;
		var sellerParam = null;
		var userLimitFilterView = me.getSpecificFilterPanel();
		var sellerCombo = me.getSellerCombo();
		
		if (!Ext.isEmpty(sellerCombo) && !Ext.isEmpty(sellerCombo.getValue())) {
			sellerParam = sellerCombo.getValue().toUpperCase();
		}
		
		if (!Ext.isEmpty(me.getStatusFilter())
				&& !Ext.isEmpty(me.getStatusFilter().getValue())
				&& "ALL" != me.getStatusFilter().getValue()) {
			var statusArrLength = me.getStatusFilter().getStore().data.items.length;
				statusFilterVal = me.getStatusFilter().getSelectedValues();
			if (statusFilterVal != null && statusFilterVal != 'All'
				&& statusFilterVal != 'all' && statusFilterVal.length >= 1  && statusArrLength !=statusFilterVal.length)
			{
				if (me.getStatusFilter().getRawValue() != null && me.getStatusFilter().getRawValue() != 'ALL'
					&& me.getStatusFilter().getRawValue() != 'all'
					&& me.getStatusFilter().getRawValue().length >= 1)
						statusFilterDiscArray = me.getStatusFilter().getRawValue();
				jsonArray.push({
					paramName : me.getStatusFilter().filterParamName,
					paramValue1 : statusFilterVal,
					operatorValue : 'statusFilterOp',
					dataType : 'S',
					displayValue : 5,
					fieldLabel : "Status",
					displayValue1 : statusFilterDiscArray
				});
			}
		}
		if (!Ext.isEmpty(me.getClientFilter())
				&& !Ext.isEmpty(me.getClientFilter().getValue())) {
			clientVal = me.getClientFilter().getValue();
		}
		
		if (!Ext.isEmpty(me.getProfileFilter())
				&& !Ext.isEmpty(me.getProfileFilter().getValue())) {
			profileVal = me.getProfileFilter().getValue();
		}
		if (clientVal != null) {
			jsonArray.push({
						paramName : me.getClientFilter().name,
						paramValue1 : encodeURIComponent(clientVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S',
						paramFieldLable : 'Client Name',
						value1 : me.getClientFilter().getRawValue()
					});
		}
		if (profileVal != null) {
			jsonArray.push({
						paramName : me.getProfileFilter().name,
						paramValue1 : encodeURIComponent(profileVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'lk',
						dataType : 'S',
						paramFieldLable : 'Profile Name',
						value1 : me.getProfileFilter().getRawValue()
					});
		}
		if (sellerParam != null) {
			jsonArray.push({
				paramName : sellerCombo.filterParamName,
				paramValue1 : encodeURIComponent(sellerParam.replace(new RegExp("'", 'g'), "\''")),
				operatorValue : 'eq',
				dataType : 'S',
				paramFieldLable : 'Financial Institution'
			});
		}
		
		me.filterData = jsonArray;
	},
	refreshData : function() {
		var me = this;
		var objGroupView = me.getGroupView();
		var grid = objGroupView.getGrid();
		if (grid) {
			/*if (!Ext.isEmpty(me.advSortByData)) {
				appliedSortByJson = me.getSortByJsonForSmartGrid();
				grid.removeAppliedSort();
				grid.applySort(appliedSortByJson);
			} else {
				grid.removeAppliedSort();
			}*/
		}
		grid.removeAppliedSort();
		objGroupView.refreshData();
	},
	applyFilter : function() {
		var me = this;
		var objGroupView = me.getGroupView();
		var groupInfo = objGroupView.getGroupInfo();
		me.refreshData();
		/*var me = this;
		var grid = me.getGrid();
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
					store.sorters);
			strUrl = strUrl + me.getFilterUrl();
			var sellerCombo = me.getSellerCombo(),sellerParam;
			if (!Ext.isEmpty(sellerCombo) && !Ext.isEmpty(sellerCombo.getValue())) {
				sellerParam = sellerCombo.getValue().toUpperCase();
				strUrl = strUrl + '&$selectedseller=' + sellerParam;
			}
			strUrl += strUrl + '&$module=C';
			me.getGrid().setLoading(true);
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
		}*/
	},
	
	handleSmartGridConfig : function() {
		var me = this;
		var userLimitGrid = me.getUserLimitGrid();
		var objConfigMap = me.getUserLimitConfiguration();
		var arrCols = new Array();
		arrCols = me.getColumns(objConfigMap.arrColsPref,
				objConfigMap.objWidthMap, true);
		if (!Ext.isEmpty(userLimitGrid))
			userLimitGrid.destroy(true);

		// arrCols = me.getColumns(objConfigMap.arrColsPref,
		// objConfigMap.objWidthMap);
		//me.handleSmartGridLoading(arrCols, objConfigMap.storeModel);

	},
	handleSmartGridLoading : function(arrCols, storeModel) {
		var me = this;
		var pgSize = null;
		pgSize = 10;
		userLimitGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
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
					// isRowMoreMenuVisible : me.isRowMoreMenuVisible,
					handleRowMoreMenuClick : me.handleRowMoreMenuClick,

					handleRowIconClick : function(tableView, rowIndex,
							columnIndex, btn, event, record) {
						me.handleRowIconClick(tableView, rowIndex, columnIndex,
								btn, event, record);
					},

					handleMoreMenuItemClick : function(grid, rowIndex,
							cellIndex, menu, event, record) {
						var dataParams = menu.dataParams;
						me.handleRowIconClick(dataParams.view,
								dataParams.rowIndex, dataParams.columnIndex,
								menu, null, dataParams.record);
					}
				});
		
		var userLimitSetupDtlView = me.getUserLimitSetupDtlView();
		userLimitSetupDtlView.add(userLimitGrid);
		userLimitSetupDtlView.doLayout();
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
			if (!Ext.isEmpty(recHistory)
					&& !Ext.isEmpty(recHistory.__deferred.uri)) {
					me.showHistory(record.get('profileName'),
					record.get('history').__deferred.uri, record
							.get('identifier'));
				/*me.showHistory(record.get('profileName'),
						record.get('history').__deferred.uri, record
								.get('identifier'));*/
			}
		} else if (actionName === 'btnView') {
			me.submitExtForm("userLimitViewProfileMst.form", record,
					rowIndex);
		} else if (actionName === 'btnEdit') {
			me.submitExtForm("userLimitEditProfileMst.form", record,
					rowIndex);
		}
	},
	showRejectPopUp : function(strAction, strActionUrl,grid, record) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		if (strAction === 'reject') {
			fieldLbl = getLabel('prfRejectRemarkPopUpTitle',
					'Please Enter Reject Remark');
			titleMsg = getLabel('prfRejectRemarkPopUpFldLbl', 'Reject Remark');
		}
		var msgbox = Ext.Msg.show({
			title : titleMsg,
			msg : fieldLbl,
			buttons : Ext.Msg.OKCANCEL,
			multiline : 4,
			cls : 't7-popup',
			width: 355,
			height : 270,
			bodyPadding : 0,
			fn : function(btn, text) {
				if (btn == 'ok') {
					me.preHandleGroupActions(strActionUrl,text,grid,record);
				}
			}
		});
		msgbox.textArea.enforceMaxLength = true;
		msgbox.textArea.inputEl.set({
			maxLength : 255
		});
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
		//me.setFilterParameters(form);
		document.body.appendChild(form);
		form.submit();
	},

	showHistory : function(profileName, url, id) {
		Ext.create('GCP.view.HistoryPopup', {
					historyUrl : url,
					profileName : profileName,
					identifier : id
				}).show();
	},

	handleAddNewProfileMaster : function(btn) {
		var me = this;
		var strUrl = "";
		var sellerCombo = me.getSellerCombo();
		strUrl = "addUserLimitProfileMst.form";
		if (!Ext.isEmpty(strUrl)) {
			form = document.createElement('FORM');
			form.name = 'frmMain';
			form.id = 'frmMain';
			form.method = 'POST';
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					csrfTokenName, tokenValue));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'module', "C"));
			if (sellerCombo) {
				var selectedSeller = sellerCombo.getValue();
			}
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'sellerId',
					selectedSeller));
			form.action = strUrl;
			//me.setFilterParameters(form);
			document.body.appendChild(form);
			form.submit();
			document.body.removeChild(form);
		}

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
		} else if (maskPosition === 8 && retValue) {
			var validFlag = record.raw.validFlag;
			var reqState = record.raw.requestState;
			retValue = retValue && (reqState == 3 && validFlag == 'N');
		} else if (maskPosition === 9 && retValue) {
			var validFlag = record.raw.validFlag;
			var reqState = record.raw.requestState;
			retValue = retValue && (reqState == 3 && validFlag == 'Y');
		}
		return retValue;
	},

	getColumns : function(arrColsPref, objWidthMap, showGroupActionColumn) {
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
				cfgCol.menuDisabled = true;
				cfgCol.sortable = true;
				if(cfgCol.colId === 'requestStateDesc')
					cfgCol.sortable = false;
				cfgCol.draggable = false;
				cfgCol.hideable = false;
				cfgCol.resizable = false;
				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;

				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},
	createProductActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'action',
			width : 40,
			locked : true,
			items : [{
						itemId : 'btnProductView',
						itemCls : 'grid-row-action-icon icon-view',
						toolTip : getLabel('viewToolTip', 'View Record')
					}]
		};
		return objActionCol;
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
						itemLabel : getLabel('historyToolTip', 'View History'),
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
			width : 130,
			locked : true,
			items : [{
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
						text : getLabel('prfMstActionDisable', 'Disable'),
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
		me.enableDisableGroupActions(actionMask, isSameUser, isDisabled,
				isSubmit);
	},
	handleGridRowClick : function(record, grid, columnType) {
		if(columnType !== 'actioncontent' && columnType !== 'checkboxColumn') {
			var me = this;
			var columnModel = null;
			var columnAction = null;
			if (!Ext.isEmpty(grid.columnModel)) {
				columnModel = grid.columnModel;
				for (var index = 0; index < columnModel.length; index++) {
					if (columnModel[index].colId == 'actioncontent') {
						columnAction = columnModel[index].items;
						break;
					}
				}
			}
			var arrVisibleActions = [];
			var arrAvailableActions = [];
			if (!Ext.isEmpty(columnAction))
				arrAvailableActions = columnAction;
			var store = grid.getStore();
			var jsonData = store.proxy.reader.jsonData;
			if (!Ext.isEmpty(arrAvailableActions)) {
				for (var count = 0; count < arrAvailableActions.length; count++) {
					var btnIsEnabled = false;
					if (!Ext.isEmpty(grid) && !Ext.isEmpty(grid.isRowIconVisible)) {
						btnIsEnabled = grid.isRowIconVisible(store, record,
								jsonData, arrAvailableActions[count].itemId,
								arrAvailableActions[count].maskPosition);
						if (btnIsEnabled == true) {
							arrVisibleActions.push(arrAvailableActions[count]);
							btnIsEnabled = false;
						}
					}
				}
			}
			if (!Ext.isEmpty(arrVisibleActions)) {
				me.doHandleRowActions(arrVisibleActions[0].itemId, grid, record);
			}
		}
	},
	enableDisableGroupActions : function(actionMask, isSameUser, isDisabled,
			isSubmit) {
		var me = this;
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

	handleGroupActions : function(btn, record) {
		var me = this;
		var strAction = !Ext.isEmpty(btn.actionName)
				? btn.actionName
				: btn.itemId;
		var strUrl = Ext.String.format('cpon/userLimitProfileMst/{0}',
				strAction);
		if (strAction === 'reject') {
			this.showRejectVerifyPopUp(strAction, strUrl, record);

		} else {
			this.preHandleGroupActions(strUrl, '', record);
		}

	},

	showRejectVerifyPopUp : function(strAction, strActionUrl, record) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		if (strAction === 'reject') {
			fieldLbl = getLabel('prfRejectRemarkPopUpTitle',
					'Please Enter Reject Remark');
			titleMsg = getLabel('prfRejectRemarkPopUpFldLbl', 'Reject Remark');
		}
		var msgbox = Ext.Msg.show({
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
							me
									.preHandleGroupActions(strActionUrl, text,
											record);
						}
					}
				});
		msgbox.textArea.enforceMaxLength = true;
		msgbox.textArea.inputEl.set({
			maxLength : 255
		});
	},

	preHandleGroupActions : function(strUrl, remark, grid, arrSelectedRecords) {
		var me = this;
		var groupView = me.getGroupView();
		if (!Ext.isEmpty(groupView)) {
			var me = this;
			if (!Ext.isEmpty(grid)) {
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
				groupView.setLoading(true);
				Ext.Ajax.request({
							url : strUrl,
							method : 'POST',
							jsonData : Ext.encode(arrayJson),
							success : function(response) {
								// TODO : Action Result handling to be done here
								me.enableDisableGroupActions('000000000000000000');
								//grid.refreshData();
								//me.applyFilter();
								groupView.setLoading(false);
								if( response.responseText == '[]')
								{
								 groupView.refreshData();
								}
								var errorMessage = '';
								if (response.responseText != '[]') {
									var jsonData = Ext
											.decode(response.responseText);
									
									if(jsonData != null && !jsonData.d)
									{
										groupView.refreshData();
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
		}
	},

	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		if (colId === 'col_dtlCount')
		{
			strRetValue = '<span class="underlined cursor_pointer">' + value + '</span>';
		} 
		else if(colId === 'col_dlyTrfDebitLimitAmt' || colId === 'col_dlyTrfCreditLimitAmt')
		{
			strRetValue = setDigitAmtGroupFormat(value);
		}
		 else {
				strRetValue = value;
			}
		return strRetValue;
	},

	getUserLimitConfiguration : function() {
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;
		objWidthMap = {
				"clientDescription":230,
				"profileName" : 230,
				"module" : 80,
				"dtlCount" : 150,
				"dlyTrfDebitLimitAmt" : 100,
				"dlyTrfCreditLimitAmt" : 100,
				"ccyCode" : 60,
				"requestStateDesc" : 115,
				"type" : 100
			};

		arrColsPref = [
		{
			"colId" : "clientDescription",
			"colDesc" : getLabel('clientDesc','Company Name'),
			"sort" :true
		},
		{
			"colId" : "profileName",
			"colDesc" : getLabel('profileName','Profile Name'),
			"sort" :true
		}, {
			"colId" : "dlyTrfDebitLimitAmt",
			"colDesc" :  getLabel('trfDr','Transfer Debit Limit'),
			"colType" : "number",
			"sort" :true
		}, {
			"colId" : "dlyTrfCreditLimitAmt",
			"colDesc" : getLabel('trfCr','Transfer Credit Limit'),
			"colType" : "number",
			"sort" :true
		},{
			"colId" : "ccyCode",
			"colDesc" :  getLabel('ccy','Currency'),
			"sort" :true
		}, {
			"colId" : "requestStateDesc",
			"colDesc" :  getLabel('status','Status'),
			"sort" :false
		}];

		storeModel = {
				fields : ['history', 'clientDescription','profileName', 'ccyCode',
					'dlyTrfDebitLimitAmt', 'dlyTrfCreditLimitAmt',
					'moduleDesc', 'requestStateDesc', 'identifier',
					'__metadata', 'profileId','profileType'],
			proxyUrl : 'cpon/userLimitProfileMst.json',
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
	/*handleSCMProductEntryAction : function(entryType) {
		var me = this;
		var form;
		var strUrl = "addLimitProfileMst.form";
		var errorMsg = null;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'module', "C"));

		form.action = strUrl;
		me.setFilterParameters(form);
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
*/
	/* Function sets the filter Panel element values in JSON */
	setFilterParameters : function(form) {
		var me = this;
		var selectedSeller = null, profileName = null, status = null;
		var arrJsn = {};
		var userLimitFilterView = me.getSpecificFilterPanel();
		var sellerCombo = me.getSellerCombo();
		
		if (!Ext.isEmpty(me.getProfileFilter())
				&& !Ext.isEmpty(me.getProfileFilter().getValue())) {
			profileName = me.getProfileFilter().getValue();
		}
		if (sellerCombo) {
			selectedSeller = sellerCombo.getValue();
		}
		if (!Ext.isEmpty(me.getStatusFilter())
				&& !Ext.isEmpty(me.getStatusFilter().getValue())) {
			status = me.getStatusFilter().getValue();
		}
		arrJsn['sellerId'] = selectedSeller;
		arrJsn['status'] = status;
		arrJsn['statusDesc'] = me.getStatusFilter().getRawValue();
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
	disableActions : function(canDisable) {
		if (canDisable)
			$('.canDisable').addClass('button-grey-effect');
		else
			$('.canDisable').removeClass('button-grey-effect');
	},
	setInfoTooltip : function() {
		var me = this;
		var infotip = Ext.create('Ext.tip.ToolTip', {
					target : 'paymentPackageFilterView-1012_header_hd-textEl',
					listeners : {
						// Change content dynamically depending on which element
						// triggered the show.
						beforeshow : function(tip) {
							var seller = '';
							var profile = '';

							var userLimitFilterView = me
									.getSpecificFilterPanel();
							var profileId = userLimitFilterView
									.down('textfield[itemId="profileNameFltId"]');

							if (!Ext.isEmpty(me.getStatusFilter())
									&& !Ext.isEmpty(me.getStatusFilter()
											.getValue())) {
								var combo = me.getStatusFilter();
								status = combo.getRawValue()
							} else {
								status = getLabel('all', 'ALL');
							}
							
							if (!Ext.isEmpty(profileId)
									&& !Ext.isEmpty(profileId.getValue())) {
								profile = profileId.getValue();
							} else {
								profile = getLabel('none', 'None');
							}

							tip.update(getLabel("profileName", "Profile Name")
									+ ' : ' + profile + '<br/>'
									+ getLabel('status', 'Status') + ' : '
									+ status + '<br/>');

						}
					}
				});
	}

});