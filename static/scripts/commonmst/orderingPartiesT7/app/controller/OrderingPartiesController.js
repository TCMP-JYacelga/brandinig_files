Ext.define('GCP.controller.OrderingPartiesController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.ux.gcp.PreferencesHandler'],
	views : ['GCP.view.ClientSetupView',
			'GCP.view.CopyByClientPopupView', 'GCP.view.HistoryPopup'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'clientSetupView',
				selector : 'clientSetupView'
			}, {
				ref : 'groupView',
				selector : 'clientSetupView groupView'
			},{
				ref:'filterView',
				selector:'filterView'	
			},{
				ref:"filterButton",
				selector : "groupView button[itemId=filterButton]"
			},{
				ref : 'clientSetupFilterView',
				selector : 'clientSetupFilterView'
			}, {
				ref : 'specificFilterPanel',
				selector : 'clientSetupView clientSetupFilterView panel[itemId="specificFilter"]'
			}, {
				ref : "corporationFilter",
				selector : 'clientSetupView clientSetupFilterView textfield[itemId="corporationFilter"]'
			}, {
				ref : "clientFilter",
				selector : 'clientSetupView clientSetupFilterView textfield[itemId="clientFilter"]'
			}, {
				ref : "orderPartyClientCodesFilterCombo",
				selector : 'clientSetupFilterView combobox[itemId=orderPartyClientCodesFltId]'
			}, {
				ref : "orderPartyClientCodesFilterAuto",
				selector : 'clientSetupFilterView AutoCompleter[itemId=orderPartyClientCodesFltId]'
			}, {
				ref : "orderPartyNameFltAuto",
				selector : 'clientSetupFilterView AutoCompleter[itemId=orderPartyNameFltId]'
			}, {
				ref : "orderPartyCodeFltAuto",
				selector : ' clientSetupFilterView AutoCompleter[itemId=orderPartyCodeFltId]'
			}, {
				ref : "statusFilter",
				selector : 'clientSetupView clientSetupFilterView combobox[itemId="statusFilter"]'
			}, {
				ref : 'withHeaderCheckbox',
				selector : 'clientSetupView clientSetupTitleView menuitem[itemId="withHeaderId"]'
			}, {
				ref : 'groupActionBar',
				selector : 'clientSetupView clientSetupGridView clientGroupActionBarView'
			}, {
				ref : 'brandingPkgListLink',
				selector : 'clientSetupView toolbar[itemId="btnActionToolBar"] button[itemId="btnBrandingPkgList"]'
			}, {
				ref : 'clientListLink',
				selector : 'clientSetupView toolbar[itemId="btnActionToolBar"] button[itemId="btnClientList"]'
			},{
				ref : 'statusFilterRef',
				selector : 'clientSetupFilterView combo[itemId="orderingStatusFilter"]'
			}],
	config : {
		selectedMst : 'client',
		clientListCount : 0,
		brandingPkgListCount : 0,
		filterData : [],
		copyByClicked : '',
	    filterApplied : 'ALL',
		sellerFilterVal : null,
		reportGridOrder : null,
		clientFilterVal:'',
		clientFilterDesc:'',
		selectedClientFilter : '',
		selectedClientFilterDesc : '',
		orderPartyName:'orderPartyName',
		orderPartyFilterName:'all',
		orderPartyCode :'orderCode',
		orderPartyFilterId:'all',
		preferenceHandler : null,
		strPageName:'orderingParty',
		isOrderPartyCode : false,
		isOrderPartyName : false,
		oldOrderPartyCode : '',
		oldOrderPartyName : '',
		firstLoad : false,
		statusPrefCode:null,
		statusPrefDesc:null
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		me.firstLoad = true;
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		if(objSaveLocalStoragePref){
			me.objLocalData = Ext.decode(objSaveLocalStoragePref);
			var filterType = me.objLocalData && me.objLocalData.d.preferences
								&& me.objLocalData.d.preferences.tempPref 
								&& me.objLocalData.d.preferences.tempPref.quickFilterJson ? me.objLocalData.d.preferences.tempPref.quickFilterJson : {};			
			me.filterData = (!Ext.isEmpty(filterType)) ? filterType : [];
			
		}
		me.clientFilterVal = $("#summaryClientFilterSpan").val(),
		me.clientFilterDesc= $("#summaryClientFilterSpan").text(), 
        me.sellerFilterVal=strSellerId;
        me.updateConfig();
		GCP.getApplication().on({
					showClientPopup : function(brandingpkg) {
						me.copyByClicked = brandingpkg;
						copybypopup = Ext.create(
								'GCP.view.CopyByClientPopupView', {
									itemId : 'copybypopup'
								});
						(copybypopup).show();
					}

				});
				$(document).on('handleClientChangeInQuickFilter',function(isSessionClientFilter) {
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.disablePreferencesButton("clearPrefMenuBtn",false);			
					me.handleClientChangeInQuickFilter(isSessionClientFilter);
		});
	$(document).on("handleAddNewParty",function(){
			me.handleClientEntryAction();
		});
	$(document).on('performReportAction', function(event, actionName) {
				me.downloadReport(actionName);
	});
	$(document).on('savePreference', function(event) {		
						me.handleSavePreferences();
	});
	$(document).on('clearPreference', function(event) {
						me.handleClearPreferences();
	});	
	$(document).on('performPageSettings', function(event) {
					me.showPageSettingPopup('PAGE');
		});
		me.control({
			'pageSettingPopUp' : {
				'applyPageSetting' : function(popup, data,strInvokedFrom) {
					me.applyPageSetting(data,strInvokedFrom);
				},
				'savePageSetting' : function(popup, data,strInvokedFrom) {
					me.savePageSetting(data,strInvokedFrom);
				},
				'restorePageSetting' : function(popup,data,strInvokedFrom) {
					me.restorePageSetting(data,strInvokedFrom);
				}
			},	
	'clientSetupView groupView' : {
				/**
				 * This is to be handled if grid model changes as per group by
				 * category. Otherewise no need to catch this event. If captured
				 * then GroupView.reconfigureGrid(gridModel) should be called
				 * with gridModel as a parameter
				 */
				'groupByChange' : function(menu, groupInfo) {
					me.doHandleGroupByChange(menu, groupInfo);
				},
				'groupTabChange' : function(groupInfo, subGroupInfo, tabPanel,
						newCard, oldCard) {
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.disablePreferencesButton("clearPrefMenuBtn",false);				
					me.doHandleGroupTabChange(groupInfo, subGroupInfo,
							tabPanel, newCard, oldCard);
				},
				'gridRender' : me.doHandleLoadGridData,
				'gridPageChange' : me.doHandleLoadGridData,
				'gridSortChange' : me.doHandleLoadGridData,
				'gridPageSizeChange' : me.doHandleLoadGridData,
				'gridColumnFilterChange' : me.doHandleLoadGridData,
				'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,
				'gridSettingClick' : function(){
					me.showPageSettingPopup('GRID');
				},
				'gridStateChange' : function(grid) {
					me.disablePreferencesButton("savePrefMenuBtn",false);
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
				//	me.clientFilterVal  = strClientId;				
				//	me.clientFilterDesc = strClientDescr;
					//me.setInfoTooltip();	
				}
				
			},
			'clientSetupFilterView combo[itemId=orderPartyClientCodesFltId]' : {
				select : function(combo, opts) {
					me.clientFilterVal = combo.getValue();
					me.clientFilterDesc = combo.getRawValue();
					me.changeFilterParams();
					me.setDataForFilter();
					me.applyFilter();
				},
				change : function(combo, newValue, oldValue, eOpts) {
					if (newValue == '' || null == newValue) {
						me.clientFilterVal = '';
						me.clientFilterDesc = '';
						me.changeFilterParams();
						me.setDataForFilter();
						me.applyFilter();
					} else {
						me.clientFilterDesc = combo.getRawValue();
					}
				}
			},
			'clientSetupFilterView  combo[itemId="orderingStatusFilter"]' : {
				'select' : function(combo,selectedRecords) {
					combo.isQuickStatusFieldChange = true;
				},
				'blur':function(combo,record){
					if(combo.isQuickStatusFieldChange)
						me.handleStatusFilterClick(combo);
				}
			},
			'clientSetupFilterView combo[itemId=clientCombo]' : {
				boxready : function(combo, width, height, eOpts) {
							if(Ext.isEmpty(me.clientFilterDesc))
								combo.setValue(combo.getStore().getAt(0));
						}
			},
			/*'clientSetupFilterView AutoCompleter[itemId="clientCodeId"]' : {
				select : function( combo, record, index )
				{
					if(record !== null)
					{
						me.clientFilterDesc = record[0].data.DESCR;
						me.clientFilterVal = record[0].data.CODE;						
						me.clientFilterDesc=record[0].data.DESCR;
						me.sellerFilterVal=record[0].data.SELLER_CODE;
					}
					//var objFilterPanel = me.getSellerClientMenuBar();
					me.applySeekFilter();
				},
				change : function( combo, record, index)
				{
					if( record == null )
					{
						me.clientFilterDesc = '';
					    me.clientFilterVal = '';
						me.clientFilterDesc = '';
						me.clientFilterVal = '';
						me.filterApplied = 'ALL';
						me.applySeekFilter();
					}
				}
			},*/
			
			'clientSetupFilterView' : {
			beforerender:function(){
					var useSettingsButton = me.getFilterView()
					.down('button[itemId="useSettingsbutton"]');
					if (!Ext.isEmpty(useSettingsButton)) {
						useSettingsButton.hide();
					}
					var createAdvanceFilterLabel = me.getFilterView()
							.down('label[itemId="createAdvanceFilterLabel"]');
					if (!Ext.isEmpty(createAdvanceFilterLabel)) {
						createAdvanceFilterLabel.hide();
					}
				},
			afterrender : function(panel, opts) {
			//me.setFilterRetainedValues();
				/*	var objDetailFilterPanel = me.getClientSetupFilterView();
					var objAutocompleterorderPartyName = objDetailFilterPanel
							.down('AutoCompleter[itemId="orderPartyNameFltId"]');
                       objAutocompleterorderPartyName.setValue(orderingPartyName);
					var objAutocompleterPartyCode = objDetailFilterPanel
							.down('AutoCompleter[itemId="orderPartyCodeFltId"]');
					objAutocompleterPartyCode.setValue(orderingPartyId);*/
				var objLocalJsonData='';
				if (objSaveLocalStoragePref) {
					objLocalJsonData = Ext.decode(objSaveLocalStoragePref);
					if (!Ext.isEmpty(objLocalJsonData.d.preferences)) {
						if (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) {
							if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.quickFilterJson)){
								me.filterData = objLocalJsonData.d.preferences.tempPref.quickFilterJson;
								me.populateTempFilter(objLocalJsonData.d.preferences.tempPref.quickFilterJson);
							}
						}
					}
				}
				me.handleClientChangeInQuickFilter();
				},
		'handleClientChange' : function(client, clientDesc) {
					if(client === 'all')
					{
						me.clientFilterVal  = '';
						me.clientFilterDesc = '';						
						me.clientFilterDesc = '';
					}
					else
					{
						me.clientFilterVal  = client;						
						me.clientFilterDesc = clientDesc;
						me.clientFilterDesc = clientDesc;
					}
					me.applySeekFilter();					
				},
		render : function(panel, opts) {
					me.setInfoTooltip();
				}
			},
			 ' clientSetupFilterView combobox[itemId=orderPartyCodeFltId]' : {
				select : function(btn, opts) {
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.disablePreferencesButton("clearPrefMenuBtn",false);	
					me.setDataForFilter();
					me.applyFilter();
					me.isOrderPartyCode = true;
				},
				change : function(combo, newValue, oldValue, eOpts) {
					me.oldOrderPartyCode = oldValue;
					if (newValue == '' || null == newValue) {
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);	
						me.setDataForFilter();
						me.applyFilter();
						me.oldOrderPartyCode = "";
						me.isOrderPartyCode = true;
					}
				},
				keyup : function(combo, e, eOpts){
					me.isOrderPartyCode = false;
				},
				blur : function(combo, record){
					if (me.isOrderPartyCode == false && me.oldOrderPartyCode != combo.getRawValue()){
						me.applySeekFilter();
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);		
					}
					me.oldOrderPartyCode = combo.getRawValue();	
				}
			},	
			 
			' clientSetupFilterView combobox[itemId=orderPartyNameFltId]' : {
				select : function(btn, opts) {
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.disablePreferencesButton("clearPrefMenuBtn",false);	
					me.setDataForFilter();
					me.applyFilter();
					me.isOrderPartyName = true;
				},
				change : function(combo, newValue, oldValue, eOpts) {
					me.oldOrderPartyName = oldValue;
					if (newValue == '' || null == newValue) {
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);	
						me.setDataForFilter();
						me.applyFilter();
						me.isOrderPartyName = true;
						me.oldOrderPartyName = "";
					}else{
						me.isOrderPartyName = false;						
					}
				},
				keyup : function(combo, e, eOpts){
					me.isOrderPartyName = false;
				},
				blur : function(combo, record){
					if (me.isOrderPartyName == false && me.oldOrderPartyName != combo.getRawValue()){
						me.applySeekFilter();
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);		
					}
					me.oldOrderPartyName = combo.getRawValue();
				}
			},
			
			'filterView button[itemId="clearSettingsButton"]' : {
				'click' : function() {
					me.handleClearSettings();
				}
			},'filterView' : {
				appliedFilterDelete : function(btn){
					me.handleAppliedFilterDelete(btn);
				}
			}

		});
	},
	handleStatusFilterClick : function(combo) {
		var me = this;
		combo.isQuickStatusFieldChange = false;
		me.statusPrefCode = combo.getSelectedValues();
		me.statusPrefDesc = combo.getRawValue();
		me.setDataForFilter();
		me.applyFilter();
	},
	doHandleGroupByChange : function(menu, groupInfo) {
		var me = this;
		/*if (me.previouGrouByCode === 'ADVFILTER') {
			me.savePrefAdvFilterCode = null;
			me.showAdvFilterCode = null;
			me.filterApplied = 'ALL';
		}
		if (groupInfo && groupInfo.groupTypeCode === 'ADVFILTER') {
			me.previouGrouByCode = groupInfo.groupTypeCode;
		} else
			me.previouGrouByCode = null;*/
	},
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) {
		var me = this;
		var objGroupView = me.getGroupView();
		var strModule = '', strUrl = null, args = null;
		groupInfo = groupInfo || {};
		subGroupInfo = subGroupInfo || {};
		// TODO : Commented the code.
		// me.handleSummaryInformationRender();
		if (groupInfo && _charCaptureGridColumnSettingAt === 'L') {
			args = {
					scope : me
				};
			strModule = subGroupInfo.groupCode;
			if (groupInfo.groupTypeCode === 'ORDPAR_OPT_STATUS') {
				strModule = subGroupInfo.groupCode;
				strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-'
					+ strModule : strModule;
			} else {
				strModule = groupInfo.groupTypeCode
			}
			me.preferenceHandler.readModulePreferences(me.strPageName,
					strModule, me.postHandleGroupTabChange, args, me, true);
		} else {
			objGroupView.reconfigureGrid(null);
		}

	},
	postHandleGroupTabChange : function(data, args) {
		var me = this;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getClientSetupView(), objPref = null, gridModel = null, intPgSize = null,showPager = true, heightOption = null;
		var colModel = null, arrCols = null;
		//if (data && data.preference) {
			//objPref = Ext.decode(data.preference);
		
		var intPageSize = me.objLocalData && me.objLocalData.d && me.objLocalData.d.preferences
			  && me.objLocalData.d.preferences.tempPref
			  && me.objLocalData.d.preferences.tempPref.pageSize
			  ? me.objLocalData.d.preferences.tempPref.pageSize
			  : '';
			var intPageNo = me.objLocalData && me.objLocalData.d && me.objLocalData.d.preferences
					&& me.objLocalData.d.preferences.tempPref
					&& me.objLocalData.d.preferences.tempPref.pageNo
					? me.objLocalData.d.preferences.tempPref.pageNo
					: 1;
			var sortState = me.objLocalData && me.objLocalData.d && me.objLocalData.d.preferences
				&& me.objLocalData.d.preferences.tempPref
				&& me.objLocalData.d.preferences.tempPref.sorter
				? me.objLocalData.d.preferences.tempPref.sorter
				: [];
			if (data && data.preference)
				objPref = Ext.JSON.decode(data.preference)
		
				if (_charCaptureGridColumnSettingAt === 'L' && objPref
					&& objPref.gridCols) {
				arrCols = objPref.gridCols || null;
				colModel = objSummaryView.getColumnModel(arrCols);
				showPager = objPref.gridSetting && !Ext.isEmpty(objPref.gridSetting.showPager) ? objPref.gridSetting.showPager : true;
				heightOption = objPref.gridSetting && !Ext.isEmpty(objPref.gridSetting.heightOption) ? objPref.gridSetting.heightOption : null;
					if (colModel) {
						gridModel = {
							columnModel : colModel,
							pageSize : intPageSize,
							pageNo : intPageNo,
							showPagerForced : showPager,
							heightOption : heightOption
							/*storeModel:{
								sortState:objPref.sortState
							}*/
						};
					}
				}
			
			if(!Ext.isEmpty(intPageSize) && !Ext.isEmpty(intPageNo)) {
				gridModel = gridModel ? gridModel : {};
				gridModel.pageSize = intPageSize;
				gridModel.pageNo = intPageNo;
				gridModel.storeModel = {sortState: sortState};
				
			}
			/*arrCols = objPref.gridCols || null;
			intPgSize = objPref.pgSize || _GridSizeTxn;
			colModel = objSummaryView.getColumnModel(arrCols);
			showPager = objPref.gridSetting
					&& !Ext.isEmpty(objPref.gridSetting.showPager)
					? objPref.gridSetting.showPager
					: true;
			heightOption = objPref.gridSetting
					&& !Ext.isEmpty(objPref.gridSetting.heightOption)
					? objPref.gridSetting.heightOption
					: null;		
			if (colModel) {
				gridModel = {
					columnModel : colModel,
					pageSize : intPgSize,
					showPagerForced : showPager,
					heightOption : heightOption,
					storeModel:{
					  sortState:objPref.sortState
                    }
				}
			}*/
		//}
		objGroupView.reconfigureGrid(gridModel);
	},
	handleSaveLocalStorage : function(){
		var me=this,arrSaveData = [], objSaveState = {},objAdvJson={},objGroupView = me.getGroupView(), grid = objGroupView.getGrid() ,subGroupInfo = null,quickFilterState = {};
		if (objGroupView)
			subGroupInfo = objGroupView.getSubGroupInfo();
		/*if(!Ext.isEmpty(me.savedFilterVal))
			objSaveState['advFilterCode'] = me.savedFilterVal;
		if(!Ext.isEmpty(me.advFilterData)){
			objAdvJson['filterBy'] = me.advFilterData;
			objSaveState['advFilterJson'] = objAdvJson;
		}*/
		//objSaveState['filterAppliedType'] = me.filterApplied;
		objSaveState['quickFilterJson'] = !Ext.isEmpty(me.filterData) ? me.filterData : {};
		objSaveState['subGroupCode'] = (subGroupInfo || {}).groupCode;
		objSaveState['pageSize'] = grid && !Ext.isEmpty(grid.getPageSize()) ? grid.getPageSize() : null;
		objSaveState['pageNo'] = grid && !Ext.isEmpty(grid.getCurrentPage()) ? grid.getCurrentPage() :  1;
		objSaveState['sorter'] = grid && !Ext.isEmpty(grid.getSortState()) ? grid.getSortState() :  [];
		
		arrSaveData.push({
			"module" : "tempPref",
			"jsonPreferences" : objSaveState
		});
		
		me.saveLocalPref(arrSaveData);
	},
	saveLocalPref : function(objSaveState){
		var me = this, args = {},strLocalPrefPageName = me.strPageName+'_TempPref';
		if (!Ext.isEmpty(objSaveState)) {
			args['tempPref'] = objSaveState;
			me.preferenceHandler.savePagePreferences(strLocalPrefPageName, objSaveState,
					me.postHandleSaveLocalPref, args, me, false);
		}
	},
	postHandleSaveLocalPref : function(data, args, isSuccess) {
		var me = this,strLocalPrefPageName = me.strPageName+'_TempPref';
		var objLocalPref = {},objTemp={},objTempPref = {}, jsonSaved ={};
		if (isSuccess === 'N') {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
		else {
			if(!Ext.isEmpty(args)){
				jsonSaved = args && args.tempPref && args.tempPref[0] && args.tempPref[0].jsonPreferences ? args.tempPref[0].jsonPreferences : {};
				objTemp['tempPref'] = jsonSaved;
				objTempPref['preferences'] = objTemp;
				objLocalPref['d'] = objTempPref;
				
				me.updateObjLocalPref(objLocalPref);
			}
		}
	},
	setValueOrderingPartyName : function(value)
	{
		var me = this;
		var clientSetupFilterView = me.getClientSetupFilterView();
		
		var orderPartyNameFltId = clientSetupFilterView.down('combobox[itemId=orderPartyNameFltId]');
		orderPartyNameFltId.setValue(value);
	},
	setValueOrderingPartyId : function(value){
		var me = this;
		var clientSetupFilterView = me.getClientSetupFilterView();
		var orderPartyCodeFltId = clientSetupFilterView.down('combobox[itemId=orderPartyCodeFltId]');
		orderPartyCodeFltId.setValue(value);
	},
	populateTempFilter : function (filterData){
					var me = this;
					var fieldName = '';
					var fieldVal = '';
					var fieldSecondVal = '';
					var operatorValue = '';
					var valueArray = '';
					var dispval = '';
					for (i = 0; i < filterData.length; i++) {
						fieldName = filterData[i].paramName;
						fieldVal = filterData[i].paramValue1;
						fieldSecondVal = filterData[i].paramValue2;
						operatorValue = filterData[i].operatorValue;
						valueArray = filterData[i].valueArray;
						dispval = filterData[i].displayValue1;
						if(fieldName == 'orderPartyName')
						{
							var ordNameComboBox = me.getOrderPartyNameFltAuto();
							ordNameComboBox.setValue(dispval);
							me.orderPartyFilterName = valueArray;
						}
						else if(fieldName == 'orderCode')
						{
							var ordIdComboBox = me.getOrderPartyCodeFltAuto();
							ordIdComboBox.setValue(fieldVal);
							me.orderPartyFilterId = valueArray;
						}
						else if(fieldName == 'clientId')
						{
							var clientSetupFilterView = me.getClientSetupFilterView();
							var clientComboBox = clientSetupFilterView.down('combobox[itemId=clientCombo]');
							var clientComboAuto = clientSetupFilterView.down('AutoCompleter[itemId=clientComboAuto]');
							if (isClientUser()) {
								if(clientComboBox)
								{
									clientComboBox.setValue(filterData[i].displayValue1);
								}
							}
							else if(clientComboAuto)
							{
								clientComboAuto.setValue(dispval);
							}
							
							//clientComboBox.setValue(fieldVal);
							me.clientFilterVal = fieldVal;
							me.clientFilterDesc = filterData[i].displayValue1;
							selectedFilterClient = fieldVal;
							selectedFilterClientDesc = filterData[i].displayValue1;
						}
					}
					
				},
	updateObjLocalPref : function (data){
		var me = this;
		objSaveLocalStoragePref = Ext.encode(data);
		me.objLocalData = Ext.decode(objSaveLocalStoragePref);
	},
	disableActions : function(canDisable) {
		if (canDisable)
			$('.canDisable').addClass('button-grey-effect');
		else
			$('.canDisable').removeClass('button-grey-effect');
	},
	doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter, filterData) {
		var me = this;
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		var arrOfParseQuickFilter = [];
		
		if(allowLocalPreference === 'Y')
			me.handleSaveLocalStorage();
			
		var intPageNo = me.objLocalData.d && me.objLocalData.d.preferences
		&& me.objLocalData.d.preferences.tempPref
		&& me.objLocalData.d.preferences.tempPref.pageNo
		? me.objLocalData.d.preferences.tempPref.pageNo
		: null, intOldPgNo = oldPgNo , intNewPgNo = newPgNo;
		
		if(!Ext.isEmpty(intPageNo) && me.firstLoad)	{
			intNewPgNo = intPageNo;
			intOldPgNo = intPageNo;
		}
		
		me.firstLoad = false;
		
		//objGroupView.handleGroupActionsVisibility(buttonMask);
		me.setDataForFilter();
		var strUrl = grid.generateUrl(url, pgSize, intNewPgNo, intOldPgNo, sorter);
		strUrl += me.getFilterUrl(subGroupInfo, groupInfo);
		
		me.disableActions(true);
		
		if(_availableClients == 1){
		var paramName = 'clientId';
				var reqJsonInQuick = me.findInQuickFilterData(me.filterData, paramName);
				if (!Ext.isEmpty(reqJsonInQuick)) {
					var arrQuickJson = me.filterData;
					me.filterData = me.removeFromQuickArrJson(me.filterData,paramName);
				}
		}
		
		if(!Ext.isEmpty(me.filterData)){
			if(!Ext.isEmpty(me.filterData) && me.filterData.length >= 1){
				arrOfParseQuickFilter = generateFilterArray(me.filterData);
			}
		}
		
		if(arrOfParseQuickFilter) {
			me.getFilterView().updateFilterInfo(arrOfParseQuickFilter);
		}
				
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
	setFilterRetainedValues : function() {
			var me = this;
		var clientSetupFilterView = me.getClientSetupFilterView();
		
		var orderPartyNameFltId = clientSetupFilterView
				.down('combobox[itemId=orderPartyNameFltId]');
		orderPartyNameFltId.setValue(orderingPartyName);

		// set Ordering Party ID Filter Value
		var orderPartyCodeFltId = clientSetupFilterView
				.down('combobox[itemId=orderPartyCodeFltId]');
		orderPartyCodeFltId.setValue(orderingPartyId);
           var clientCodesFltId ;
           var statusFilter = clientSetupFilterView
      		.down('combo[itemId=orderingStatusFilter]');
      		if(!Ext.isEmpty(me.statusPrefCode)&&!Ext.isEmpty(me.statusPrefDesc)){
      			statusFilter.store.loadRawData([{
      						"name" : me.statusPrefCode,
      						"value" : me.statusPrefDesc
      					}]
      	
      			);
      			statusFilter.setValue(me.statusPrefCode);
      			statusFilter.setRawValue(me.statusPrefDesc);
      		}     
		/* if (userType == '0') {
			clientCodesFltId = clientSetupFilterView
				.down('combobox[itemId=clientCodeId]');
			if(undefined != strClientDescr && strClientDescr != ''){		
				clientCodesFltId.store.loadRawData({
									"d" : {
										"preferences" : [{
													"CODE" : strClientId,
													"DESCR" : strClientDescr
												}]
									}
								});
	
				clientCodesFltId.suspendEvents();
				clientCodesFltId.setValue(strClientId);
				clientCodesFltId.resumeEvents();
				me.clientFilterVal = strClientId;				
				me.clientFilterDesc = strClientDescr;
			}else{
				me.clientFilterVal = 'all';					
			}
			
		} else {
			clientCodesFltId = clientSetupFilterView
				.down('combo[itemId="clientCombo"]');
			if(undefined != strClientDescr && strClientDescr != ''){	
				clientCodesFltId.setText(strClientDescr);				
				me.clientFilterVal  = strClientId;				
				me.clientFilterDesc = strClientDescr;					
			}	
			else{	
			//	clientCodesFltId.setValue(getLabel('allCompanies', 'All Companies'));
			//	me.clientFilterVal = 'all';				
			}
		} */
		me.changeFilterParams();
	},
	applySeekFilter : function()
	{
		 var me=this;
		me.changeFilterParams();
		me.setDataForFilter();
		me.applyFilter();
	},
	changeFilterParams : function() {
		var me = this;
		var clientSetupFilterView = me.getClientSetupFilterView();
		/*var clientCodesFltId = clientSetupFilterView
				.down('AutoCompleter[itemId=clientCodeId]');*/
		var clientCodesFltId = me.clientFilterVal;
		/*var sellerCombo = clientSetupFilterView
				.down('combobox[itemId=sellerFltId]');*/
		var orderPartyNameFltAuto = clientSetupFilterView
				.down('AutoCompleter[itemId=orderPartyNameFltId]');
		var orderPartyCodeFltAuto = clientSetupFilterView
				.down('AutoCompleter[itemId=orderPartyCodeFltId]');

		if (entityType==0 && !Ext.isEmpty(clientCodesFltId)) {
			clientCodesFltId.cfgExtraParams = new Array();
		}
		if (!Ext.isEmpty(orderPartyNameFltAuto)) {
			orderPartyNameFltAuto.cfgExtraParams = new Array();
		}
		if (!Ext.isEmpty(orderPartyCodeFltAuto)) {
			orderPartyCodeFltAuto.cfgExtraParams = new Array();
		}

		
			/*if (!Ext.isEmpty(orderPartyNameFltAuto) && !Ext.isEmpty(strSellerId)) {
				orderPartyNameFltAuto.cfgExtraParams.push({
							key : '$sellerId',
							value :me.sellerFilterVal
						});
			}
			if (!Ext.isEmpty(orderPartyCodeFltAuto) && !Ext.isEmpty(strSellerId)) {
				orderPartyCodeFltAuto.cfgExtraParams.push({
							key : '$sellerId',
							value : me.sellerFilterVal
						});
			}*/
		 /*else {
			if (!Ext.isEmpty(clientCodesFltId)) {
				clientCodesFltId.cfgExtraParams.push({
							key : '$sellerId',
							value : sellerFilterVal
						});
			}
			if (!Ext.isEmpty(orderPartyNameFltAuto)) {
				orderPartyNameFltAuto.cfgExtraParams.push({
							key : '$sellerId',
							value : sellerFilterVal
						});
			}
			if (!Ext.isEmpty(orderPartyCodeFltAuto)) {
				orderPartyCodeFltAuto.cfgExtraParams.push({
							key : '$sellerId',
							value : sellerFilterVal
						});
			}
		}*/
		if (!Ext.isEmpty(clientCodesFltId) &&me.clientFilterVal!= 'all' && me.clientFilterVal!= null) {
			if (!Ext.isEmpty(orderPartyNameFltAuto)) {
				orderPartyNameFltAuto.cfgExtraParams.push({
							key : '$clientId',
							value : me.clientFilterVal
						});
			}
			if (!Ext.isEmpty(orderPartyCodeFltAuto) && me.clientFilterVal!= 'all' && me.clientFilterVal!= null) {
				orderPartyCodeFltAuto.cfgExtraParams.push({
							key : '$clientId',
							value : me.clientFilterVal
						});
			}
		} /*else {
			if (!Ext.isEmpty(orderPartyNameFltAuto)) {
				orderPartyNameFltAuto.cfgExtraParams.push({
							key : '$clientId',
							value : strClientId
						});
			}
			if (!Ext.isEmpty(orderPartyCodeFltAuto)) {
				orderPartyCodeFltAuto.cfgExtraParams.push({
							key : '$clientId',
							value : strClientId
						});
			}
		}*/
	},
	handleSpecificFilter : function() {
		var me = this;
		me.getSearchTextInput().setValue('');
		// me.getStatusFilter().setValue('');
		var corporationTextfield = Ext.create('Ext.ux.gcp.AutoCompleter', {
					padding : '1 0 0 10',
					fieldCls : 'xn-form-text w12 xn-suggestion-box',
					name : 'corporationName',
					itemId : 'corporationFilter',
					cfgUrl : 'cpon/cponseek/{0}.json',
					cfgProxyMethodType : 'POST',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgSeekId : 'corporationSeek',
					cfgRootNode : 'd.filter',
					cfgDataNode1 : 'name'
				});

		var clientTextfield = Ext.create('Ext.ux.gcp.AutoCompleter', {
					padding : '1 0 0 5',
					fieldCls : 'xn-form-text w12 xn-suggestion-box',
					name : 'clientName',
					itemId : 'clientFilter',
					cfgUrl : 'cpon/cponseek/{0}.json',
					cfgProxyMethodType : 'POST',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgSeekId : 'clientSeek',
					cfgRootNode : 'd.filter',
					cfgDataNode1 : 'name'
				});

		var brandingPkgNameTextfield = Ext.create('Ext.ux.gcp.AutoCompleter', {
					padding : '1 0 0 10',
					fieldCls : 'xn-form-text w12 xn-suggestion-box',
					name : 'brandingPkgName',
					itemId : 'corporationFilter',
					cfgUrl : 'cpon/cponseek/{0}.json',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgSeekId : 'brandingPkgNameSeek',
					cfgRootNode : 'd.filter',
					cfgDataNode1 : 'name'
				});

		var filterPanel = me.getSpecificFilterPanel();
		if (!Ext.isEmpty(filterPanel)) {
			filterPanel.removeAll();
		}
		// filterPanel.columnWidth = 0.56;

	},
	// method to handle client list and branding pkg list link click
	handleGridHeader : function() {
		var me = this;
		var gridHeaderPanel = me.getGridHeader();
		var createNewPanel = me.getCreateNewToolBar();
		if (!Ext.isEmpty(gridHeaderPanel)) {
			gridHeaderPanel.removeAll();
		}
		if (!Ext.isEmpty(createNewPanel)) {
			createNewPanel.removeAll();
		}

		createNewPanel.add({
					xtype : 'button',
					border : 0,
					text : getLabel('craeteOrderingParty',
							'Create Ordering Party'),
					// cls : 'cursor_pointer',
					cls : 'cursor_pointer xn-btn ux-button-s ux_create-receiver',
					glyph : 'xf055@fontawesome',
					parent : this,
					padding : '4 0 2 0',
					itemId : 'btnCreateClient'
				});

	},
	/*Page setting handling starts here*/
	savePageSetting : function(arrPref, strInvokedFrom) {
		/* This will be get invoked from page level setting always */
		var me = this, args = {};
		if (!Ext.isEmpty(arrPref)) {
			me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
					me.postHandleSavePageSetting, args, me, false);
		}
	},
	postHandleSavePageSetting : function(data, args, isSuccess) {
		if (isSuccess === 'N')  {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
	},
		postHandleClearLocalPreference : function(data, args, isSuccess){
		var me = this, args = {},strLocalPrefPageName = me.strPageName+'_TempPref';
		if (isSuccess === 'N') {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('localerrorMsg', 'Error while clear local setting'),
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
		else if(isSuccess === 'Y') {
			objSaveLocalStoragePref = '';
			me.objLocalData = '';
		}
	},
	handleClearLocalPrefernces : function(){
		var me = this,args = {},strLocalPrefPageName = me.strPageName+'_TempPref';
		
		me.preferenceHandler.clearPagePreferences(strLocalPrefPageName, null,
				me.postHandleClearLocalPreference, args, me, false);
	},
	postHandlePageGridSetting : function(data, args, isSuccess) {
		if (isSuccess === 'Y') {
			var me = this;
			if (args && args.strInvokedFrom === 'GRID'
					&& _charCaptureGridColumnSettingAt === 'L') {
				var objGroupView = me.getGroupView(), gridModel = null;
				if (args.objPref && args.objPref.gridCols)
					gridModel = {
						columnModel : args.objPref.gridCols
					};
				// TODO : Preferences and existing column model need to be
				// merged
				objGroupView.reconfigureGrid(gridModel);
			} else
				window.location.reload();
		} else {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
	},
	applyPageSetting : function(arrPref, strInvokedFrom) {
		var me = this, args = {};
		if (!Ext.isEmpty(arrPref)) {
			if (strInvokedFrom === 'GRID'
					&& _charCaptureGridColumnSettingAt === 'L') {
				/**
				 * This handling is required for non-us market
				 */
				var groupView = me.getGroupView(), subGroupInfo = groupView
						.getSubGroupInfo()
						|| {}, objPref = {}, groupInfo = groupView
						.getGroupInfo()
						|| '{}', strModule = subGroupInfo.groupCode;
				Ext.each(arrPref || [], function(pref) {
							if (pref.module === 'ColumnSetting') {
								objPref = pref.jsonPreferences;
							}
						});
				args['strInvokedFrom'] = strInvokedFrom;
				args['objPref'] = objPref;
				strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-'
						+ strModule : strModule;
				me.preferenceHandler.saveModulePreferences(me.strPageName,
						strModule, objPref, me.postHandlePageGridSetting, args,
						me, false);
			} else {
				me.handleClearLocalPrefernces();
				me.preferenceHandler.savePagePreferences(me.strPageName,
						arrPref, me.postHandlePageGridSetting, args, me, false);
			}
		}
	},
	
	postHandleRestorePageSetting : function(data, args, isSuccess) {
		if (isSuccess === 'Y') {
			var me = this;
			if (args && args.strInvokedFrom === 'GRID'
					&& _charCaptureGridColumnSettingAt === 'L') {
				var objGroupView = me.getGroupView();
				if (objGroupView)
					objGroupView.reconfigureGrid(null);
			} else
				window.location.reload();
		} else {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
	},
	restorePageSetting : function(arrPref, strInvokedFrom) {
		var me = this;
		if (strInvokedFrom === 'GRID'
				&& _charCaptureGridColumnSettingAt === 'L') {
			var groupView = me.getGroupView(), subGroupInfo = groupView
					.getSubGroupInfo()
					|| {}, objPref = {}, groupInfo = groupView.getGroupInfo()
					|| '{}', strModule = subGroupInfo.groupCode, args = {};
			strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-'
					+ strModule : strModule;
			args['strInvokedFrom'] = strInvokedFrom;
			Ext.each(arrPref || [], function(pref) {
						if (pref.module === 'ColumnSetting') {
							pref.module = strModule;
							return false;
						}
					});
			me.preferenceHandler.clearPagePreferences(me.strPageName, arrPref,
					me.postHandleRestorePageSetting, args, me, false);
		} else{
			me.handleClearLocalPrefernces();
			me.preferenceHandler.clearPagePreferences(me.strPageName, arrPref,
					me.postHandleRestorePageSetting, null, me, false);
		}
	},
	/*postHandlePageGridSetting : function(data, args, isSuccess) {
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
	},*/
	postHandlePageGridSetting : function(data, args, isSuccess) {
		if (isSuccess === 'Y') {
			var me = this;
			if (args && args.strInvokedFrom === 'GRID'
					&& _charCaptureGridColumnSettingAt === 'L') {
				var objGroupView = me.getGroupView(), gridModel = null;
				if (args.objPref && args.objPref.gridCols)
					gridModel = {
						columnModel : args.objPref.gridCols
					};
				// TODO : Preferences and existing column model need to be
				// merged
				objGroupView.reconfigureGrid(gridModel);
			} else
				window.location.reload();
		} else {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
	},
	showPageSettingPopup : function(strInvokedFrom) {
		var me = this, objData = {}, objGroupView = me.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting;
		var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeMaster;

		me.pageSettingPopup = null;

		if (!Ext.isEmpty(objOrderingPartyPref)) {
			objPrefData = Ext.decode(objOrderingPartyPref);
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
					? objPrefData.d.preferences.ColumnSetting.gridCols
					: (ORDERING_PARTY_GENERIC_COLUMN_MODEL || '[]');

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
		objData["filterUrl"] = 'services/userfilterslist/' +me.strPageName;
		objData["rowPerPage"] = _AvailableGridSize;
		objData["groupByVal"] = objGroupByVal;
		objData["filterVal"] = objDefaultFilterVal;
		objData["gridSizeVal"] = objGridSizeVal;
		objData["rowPerPageVal"] = objRowPerPageVal;
		subGroupInfo = objGroupView.getSubGroupInfo() || {};
		strTitle = (strInvokedFrom === 'GRID' ? getLabel("columnSettings",
						"Column Settings") + ' : ' + (subGroupInfo.groupDescription||'')  : getLabel("Settings", "Settings"));
		me.pageSettingPopup = Ext.create('Ext.ux.gcp.PageSettingPopUp', {
					cfgPopUpData : objData,
					cfgGroupView : objGroupView,
					cfgDefaultColumnModel : objColumnSetting,
					cfgViewOnly : _IsEmulationMode,
					cfgGridHeight : 240,
					cfgInvokedFrom : strInvokedFrom
				});
		me.pageSettingPopup.show();
		me.pageSettingPopup.center();
	},
	/*Page setting handling ends here*/
	
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
	resetFieldInQuickFilterOnDelete : function(objData){
		var me = this,strFieldName;
		if(!Ext.isEmpty(objData))
			strFieldName = objData.paramName || objData.field;
		
		if (strFieldName ==='orderPartyName' && !Ext.isEmpty(me.getOrderPartyNameFltAuto())) {
			me.getOrderPartyNameFltAuto().setValue('');
		}
		if (strFieldName ==='orderCode' && !Ext.isEmpty(me.getOrderPartyCodeFltAuto())) {
			me.getOrderPartyCodeFltAuto().setValue('');
		}
		
		if(strFieldName === 'clientId'){
			me.clientFilterDesc='';
			me.clientFilterVal='';
			if(_availableClients > 1){
				$("#summaryClientFilterSpan").text('All Companies');
			}
			$("#summaryClientFilter").val('');
			var clientSetupFilterView = me.getClientSetupFilterView();
			if(!Ext.isEmpty(clientSetupFilterView)){		
				if(isClientUser()){
					var clientCombo = clientSetupFilterView.down('combobox[itemId=clientCombo]');
					clientCombo.setValue("");
				}else{
					clientSetupFilterView.down('AutoCompleter[itemId=clientComboAuto]').setValue("");
					selectedFilterClientDesc = "";
					selectedFilterClient = "";
				}
			}
		}
		if(strFieldName === 'requestState'){
			var statusFltId = clientSetupFilterView
			.down('combo[itemId=orderingStatusFilter]');
			statusFltId.reset();
			me.statusPrefCode = 'all';
			statusFltId.selectAllValues();
		}
	},
	/*Applied Filters handling ends here*/


	showClientList : function(btn, opts) {
		var me = this;
		me.selectedMst = 'client';
		me.handleSmartGridConfig();
	},
	
	getFilterUrl : function(subGroupInfo, groupInfo) {
		var me = this;
		var strQuickFilterUrl = '';
		var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
		? subGroupInfo.groupQuery
		: '';
		strQuickFilterUrl = me.generateUrlWithFilterParams(this);
		if (!Ext.isEmpty(strGroupQuery)) {
			if (!Ext.isEmpty(strQuickFilterUrl))
				strQuickFilterUrl += ' and ' + strGroupQuery;
			else
				strQuickFilterUrl += '&$filter=' + strGroupQuery;
		}
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
					var objArray = objValue.split(',');
					if( objArray.length >= 1 )
					{
						strTemp = strTemp + "(";
					}
					for (var i = 0; i < objArray.length; i++) {
							if(objArray[i] == 12){
								strTemp = strTemp + "((requestState eq '0' or requestState eq '1') and isSubmitted eq 'Y')";
							}
							else if(objArray[i] == 3){
								strTemp = strTemp + "(requestState eq '3' and validFlag eq 'Y')";
							}
							else if(objArray[i] == 11){
								strTemp = strTemp + "(requestState eq '3' and validFlag eq 'N')";
							}
							else if(objArray[i] == 0 || objArray[i] == 1){
								strTemp = strTemp + "(requestState eq '"+objArray[i]+"' and isSubmitted eq 'N')";
							}
							else{
								strTemp = strTemp + "(requestState eq '"+objArray[i]+"')";
							}
							if(i != (objArray.length -1)){
								strTemp = strTemp + ' or ';
							}
					
					}
					if( objArray.length >= 1 )
					{
						strTemp = strTemp + ")";
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
		this.filterData = this.getFilterQueryJson();
	},
	getFilterQueryJson : function() {

		var me = this;
		var sellerVal = null, orderPartyNameVal = null, orderPartyCodeVal = null, orderPartyClientCodeVal = null, subCategoryVal = null, jsonArray = [];
		var orderPartyCodeFltId=null;
		var orderPartyNameFltId=null;
		var clientParamName = null, clientNameOperator = null;
         var clientNamesFltId = null;
         var statusFilterVal = me.statusPrefCode;
  		var statusFilterDisc = me.statusPrefDesc;
		var clientSetupFilterView = me.getClientSetupFilterView();
		if(Ext.isEmpty(clientSetupFilterView)){
		orderPartyNameVal=orderingPartyName;
		orderPartyCodeVal=orderingPartyId;
		if(undefined != strClientDescr && strClientDescr != ''){
				me.clientFilterDesc=strClientDescr;
				}
		}
		
		/*var sellerFltId = clientSetupFilterView
				.down('combobox[itemId=sellerFltId]');
*/	else{
		orderPartyNameFltId = clientSetupFilterView
				.down('combobox[itemId=orderPartyNameFltId]');

		orderPartyCodeFltId = clientSetupFilterView
				.down('combobox[itemId=orderPartyCodeFltId]');


		}
		if (!Ext.isEmpty(orderPartyNameFltId)
				&& !Ext.isEmpty(orderPartyNameFltId.getValue())) {
			orderPartyNameVal = orderPartyNameFltId.getValue();
		}

		if (!Ext.isEmpty(orderPartyNameVal)) {
			jsonArray.push({
						paramName : me.orderPartyName,
						paramValue1 : encodeURIComponent(orderPartyNameVal.toLowerCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'lk',
						dataType : 'S',
						paramFieldLable : getLabel('orderPartyName', 'Ordering party Name'),
                        displayType : 5,
                        displayValue1 : orderPartyNameVal
					});
		}

		if (!Ext.isEmpty(orderPartyCodeFltId)
				&& !Ext.isEmpty(orderPartyCodeFltId.getValue())) {
			orderPartyCodeVal = orderPartyCodeFltId.getValue();
		}

		if (!Ext.isEmpty(orderPartyCodeVal)) {
			jsonArray.push({
						paramName : me.orderPartyCode,
						paramValue1 : encodeURIComponent(orderPartyCodeVal.toLowerCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'lk',
						dataType : 'S',
						paramFieldLable : getLabel('orderPartyId', 'Ordering Party ID'),
                        displayType : 5,
                        displayValue1 : orderPartyCodeVal
					});
		}
    
	  if (!Ext.isEmpty(me.clientFilterDesc) && !Ext.isEmpty(me.clientFilterVal) && me.clientFilterVal!= 'all' ) {
			clientParamName = 'clientId';
			clientNameOperator = 'eq';
			if (!Ext.isEmpty(me.clientFilterVal)) {
				clientCodeVal = me.clientFilterVal;
			} else {
				clientCodeVal = strClientId;
			}

			if (!Ext.isEmpty(clientCodeVal)) {
				jsonArray.push({
							paramName : clientParamName,
							paramValue1 : encodeURIComponent(clientCodeVal.replace(new RegExp("'", 'g'), "\''")),
							operatorValue : clientNameOperator,
							dataType : 'S',
						paramFieldLable : getLabel('lblcompany', 'Company Name'),
                        displayType : 5,
                        displayValue1 : me.clientFilterDesc
						});
			}
		}
		
	//Status Query
		if (statusFilterVal != null && statusFilterVal != 'All'
			&& statusFilterVal != 'all' && statusFilterVal.length >= 1) {
		statusFilterValArray = statusFilterVal.toString();

		if (statusFilterDisc != null && statusFilterDisc != 'All'
				&& statusFilterDisc != 'all'
				&& statusFilterDisc.length >= 1)
			statusFilterDiscArray = statusFilterDisc.toString();

		jsonArray.push({
					paramName : 'requestState',
					paramValue1 : statusFilterValArray,
					operatorValue : 'statusFilterOp',
					dataType : 'S',
					paramFieldLable : getLabel('status', 'Status'),
					displayType : 5,
					displayValue1 : statusFilterDiscArray
				});
		}
		return jsonArray;
	},
	applyFilter : function() {
		var me = this;
		var objGroupView = me.getGroupView();
		var groupInfo = objGroupView.getGroupInfo();
		me.refreshData();
	},
	refreshData : function() {
		var me = this;
		var objGroupView = me.getGroupView();
		var grid = objGroupView.getGrid();
		/*if (grid) {
			grid.removeAppliedSort();
			/*if (!Ext.isEmpty(me.advSortByData)) {
				appliedSortByJson = me.getSortByJsonForSmartGrid();
				grid.removeAppliedSort();
				grid.applySort(appliedSortByJson);
			} else {
				grid.removeAppliedSort();
			}
		}*/
		objGroupView.refreshData();
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
		var recHistory = record.get('history');
			if (!Ext.isEmpty(recHistory)
					&& !Ext.isEmpty(recHistory.__deferred.uri)) {
				if ('client' == me.selectedMst) {
					me.showHistory(true, Ext.htmlDecode(record.get('clientDesc')), record
									.get('history').__deferred.uri, record
									.get('identifier'));
				}
			}
	} else if (actionName === 'btnView' || actionName === 'btnEdit') {
		if (actionName === 'btnView') {
			me.submitExtForm('viewOrderingParties.form', record, rowIndex);
		} else if (actionName === 'btnEdit') {
			me.submitExtForm('editOrderingParties.form', record, rowIndex);
		}
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
		me.setFilterParameters(form);
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
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
	doHandleGroupActions : function(strAction, grid, arrSelectedRecords,
			strActionType) {
		var me = this;
		if(!Ext.isEmpty(strAction))
			var strAction = strAction;
		var strUrl = Ext.String.format('services/orderingPartyList/{0}',
				strAction);
		if (strAction === 'reject') {
			this.showRejectVerifyPopUp(strAction, strUrl, grid, arrSelectedRecords);
		} else {
			this.preHandleGroupActions(strUrl, '',grid,arrSelectedRecords);
		}
	},
	showHistory : function(isClient, clientName, url, id) {
		Ext.create('GCP.view.HistoryPopup', {
					isClient : isClient,
					historyUrl : url,
					identifier : id,
					clientName : clientName
				}).show();
		Ext.getCmp('btnOrderingPartyHistoryPopupClose').focus();
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
				/*
				 * blnRetValue = me.isRowIconVisible(store, record, jsonData,
				 * null, arrMenuItems[a].maskPosition);
				 */
				// arrMenuItems[a].setVisible(blnRetValue);
			}
		}
		menu.showAt(event.xy[0] + 5, event.xy[1] + 5);
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



	showRejectVerifyPopUp : function(strAction, strActionUrl, grid, record) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		if (strAction === 'reject') {
			fieldLbl = '<label class= "required">' +getLabel('instrumentReturnRemarkPopUpTitle',
			'Please Enter Reject Remark') + '</label>';
			titleMsg = getLabel('prfRejectRemarkPopUpFldLbl', 'Reject Remark');
		}
		var msgbox = Ext.Msg.show({
			title : titleMsg,
			msg : fieldLbl,
			buttons : Ext.Msg.OKCANCEL,
			buttonText: {
	            ok: getLabel('btnOk', 'OK'),
				cancel: getLabel('cancel', 'Cancel')
				},
			multiline : 4,
			cls : 't7-popup',
			width: 355,
			height : 270,
			bodyPadding : 0,
			fn : function(btn, text) {
				if (btn == 'ok') {
					if(text == null || text == "")
					{
						Ext.MessageBox.show({
							title : getLabel(
									'instrumentErrorPopUpTitle',
									'Error'),
							msg : getLabel(
									'Error',
									'Reject Remarks cannot be blank'),
							buttons : Ext.MessageBox.OK,
							cls : 'xn-popup message-box',
							icon : Ext.MessageBox.ERROR
						});
					} else {
					me.preHandleGroupActions(strActionUrl, text, grid, record);
				}
			}
			}
		});
		msgbox.textArea.enforceMaxLength = true;
		msgbox.textArea.inputEl.set({
					maxLength : 255,
					id : 'txtrejectRemark',
					cols :"43" ,
					rows : "4",
					cls : "x-form-field",
					style : "resize: none;"
		});
		$('#txtrejectRemark').bind('blur',function(){
			markRequired(this);
		});
		$('#txtrejectRemark').bind('focus',function(){
			removeMarkRequired(this);
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
								groupView.refreshData();
								var errorMessage = '';
								if (response.responseText != '[]') {
									var jsonData = Ext
											.decode(response.responseText);
									Ext.each(jsonData[0].errors, function(error,
													index) {
												errorMessage = errorMessage
														+ getLabel(error.code,error.errorMessage)
														+ "<br/>";
											});
									if ('' != errorMessage && null != errorMessage) {
																				//Ext.Msg.alert("Error", errorMessage);
										Ext.MessageBox.show({
											title : getLabel(
													'instrumentErrorPopUpTitle',
													'Error'),
											msg : errorMessage,
											buttons : Ext.MessageBox.OK,
											buttonText: {
									            ok: getLabel('btnOk', 'OK')
												}, 
											icon : Ext.MessageBox.ERROR
										});
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
											buttonText: {
									            ok: getLabel('btnOk', 'OK')
												}, 
											icon : Ext.MessageBox.ERROR
										});
							}
					});
		}
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
	handleClientEntryAction : function(entryType) {
		var me = this;
		 var selectedSeller=null;
		var clientSetupFilterView = me.getClientSetupFilterView();
		
		selectedSeller = me.sellerFilterVal;
		var selectedClient = null;
		
		selectedClient = me.clientFilterVal;
		var form;
		var strUrl = 'addOrderingParties.form';
		var errorMsg = null;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		if(entityType==0){
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'sellerId',
				selectedSeller));
				}
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'clientId',
				selectedClient));
		form.action = strUrl;
		me.setFilterParameters(form);
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},

	/* Function sets the filter Panel element values in JSON */
	setFilterParameters : function(form) {
		var me = this;
		var orderingPartyId = null;
		var orderingPartyName = null;
		var selectedSeller=null;
		var selectedClient=null;
		var clientDesc=null;
		var arrJsn = {};
		var clientSetupFilterView = me.getClientSetupFilterView();
	
		if(Ext.isEmpty(clientSetupFilterView)){
		  selectedSeller=filterSellerId;
		  selectedClient=filterClientId;
		  orderingPartyName=orderingPartyName;
		  orderingPartyId=orderingPartyId;
		  clientDesc=filterClientDesc;
		}else{
		var orderPartyNameFltId = clientSetupFilterView
				.down('combobox[itemId=orderPartyNameFltId]');
		var orderPartyCodeFltId = clientSetupFilterView
				.down('combobox[itemId=orderPartyCodeFltId]');
		 selectedSeller = me.sellerFilterVal;
		 selectedClient = me.clientFilterVal;
		if (!Ext.isEmpty(orderPartyNameFltId)
				&& !Ext.isEmpty(orderPartyNameFltId.getValue())) {
			orderingPartyName = orderPartyNameFltId.getValue();
		}
		if (!Ext.isEmpty(orderPartyCodeFltId)
				&& !Ext.isEmpty(orderPartyCodeFltId.getValue())) {
			orderingPartyId = orderPartyCodeFltId.getValue();
		}
		clientDesc=me.clientFilterDesc
		}
		arrJsn['sellerId'] = selectedSeller;
		arrJsn['clientId'] = selectedClient;
		arrJsn['clientDesc'] = clientDesc;
		arrJsn['orderingPartyName'] = orderingPartyName;
		arrJsn['orderingPartyId'] = orderingPartyId;
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
					target : 'imgFilterInfoGridView',
					listeners : {
						// Change content dynamically depending on which element
						// triggered the show.
						beforeshow : function(tip) {
							var  oredringPartyName= '';
							var orderingPartyId = '';
							var seller = '';
							var client='';
							var	status='';
                            var clientSetupFilterView = me.getClientSetupFilterView();
							var orderPartyNameFltId = clientSetupFilterView
				   .down('combobox[itemId=orderPartyNameFltId]');
		           var orderPartyCodeFltId = clientSetupFilterView
				                     .down('combobox[itemId=orderPartyCodeFltId]');
		           var statusFltId = clientSetupFilterView.down('combobox[itemId=orderingStatusFilter]');
						 if (!Ext.isEmpty(orderPartyNameFltId)
									&& !Ext.isEmpty(orderPartyNameFltId.getValue())) {
								oredringPartyName =orderPartyNameFltId.getValue();
							}else
								oredringPartyName = getLabel('none','None');
												
						  if (!Ext.isEmpty(orderPartyCodeFltId)
									&& !Ext.isEmpty(orderPartyCodeFltId.getValue())) {
								orderingPartyId = orderPartyCodeFltId.getValue();
							}else
								orderingPartyId = getLabel('none','None');
								if(entityType==1){
								client = (me.clientFilterDesc != '') ? me.clientFilterDesc : getLabel('allcompanies', 'All Companies');								
								}else{
								
								 // client = (me.clientFilterDesc != '') ? me.clientFilterDesc : getLabel('none','None');
									if(me.clientFilterDesc)
									{
										client = me.clientFilterDesc;
									}
									else
									client = getLabel('none','None');
																
								}
								if(!Ext.isEmpty(statusFltId) && !Ext.isEmpty(statusFltId.getValue())) 								 {
									status = statusFltId.getRawValue();
								} 
								else 
								{
									status = getLabel('all', 'ALL');								
								}
								
								tip.update(getLabel('grid.column.company', 'Company Name')
										+ ' : '
										+ client
										+ '<br/>'
										+ getLabel('oredringPartyName', 'Ordering Party Name')
										+ ' : '
										+ oredringPartyName
										+ '<br/>'
										+ getLabel('orderIngPartyId', 'Ordering Party ID')
										+ ' : '
										+ orderingPartyId
										+ '<br/>'
										+ getLabel('status','Status')
										+ ' : '
										+ status
										+ '<br/>');
						}
					}
				});
	},
	handleReportAction : function(btn, opts) {
		var me = this;
		me.downloadReport(btn.itemId);
	},
	downloadReport : function(actionName) {
		var me = this;
		var withHeaderFlag = document.getElementById("headerCheckbox").checked;
		var arrExtension = {
			downloadXls : 'xls',
			downloadCsv : 'csv',
			downloadPdf : 'pdf',
			downloadTsv : 'tsv',
			downloadBAl2 : 'bai2'
		};
		var currentPage = 1;
		var strExtension = '';
		var strUrl = '';
		var strSelect = '';
		var activeCard = '';

		strExtension = arrExtension[actionName];
		strUrl = 'services/generateOrderingPartiesReport.' + strExtension;
		strUrl += '?$skip=1';
		strUrl += this.generateFilterUrl();
		var strOrderBy = me.reportGridOrder;
		strOrderBy = decodeURIComponent(strOrderBy);
		if(!Ext.isEmpty(strOrderBy)){
			var orderIndex = strOrderBy.indexOf('orderby');
			if(orderIndex > 0){
				strOrderBy = strOrderBy.substring(orderIndex,strOrderBy.length);
				var indexOfamp = strOrderBy.indexOf('&$');
				if(indexOfamp > 0)
					strOrderBy = strOrderBy.substring(0,indexOfamp);
				strUrl += '&$'+strOrderBy;
			}				
		}		
		var objGroupView = me.getGroupView();
		var grid = objGroupView.getGrid();
		arrColumn = grid.getAllVisibleColumns();

		if (arrColumn) {
			var col = null;
			var colArray = new Array();
			for (var i = 0; i < arrColumn.length; i++) {
				col = arrColumn[i];
				if (col.dataIndex && arrDownloadReportColumn[col.dataIndex])
					colArray.push(arrDownloadReportColumn[col.dataIndex]);
			}
			if (colArray.length > 0)
				strSelect = '&$select=[' + colArray.toString() +  ']';
		}
		var count = 0, objOfSelectedGridRecord = null, objOfGridSelected = null;
		var objGroupView = me.getGroupView();
		var arrSelectedrecordsId = [];
		if (!Ext.isEmpty(objGroupView))
			grid = objGroupView.getGrid();

		if (!Ext.isEmpty(grid)) {
			var objOfRecords = grid.getSelectedRecords();
			if (!Ext.isEmpty(objOfRecords)) {
				objOfGridSelected = grid;
				objOfSelectedGridRecord = objOfRecords;
			}
		}
		if ((!Ext.isEmpty(objOfGridSelected))
				&& (!Ext.isEmpty(objOfSelectedGridRecord))) {
			for (var i = 0; i < objOfSelectedGridRecord.length; i++) {
				arrSelectedrecordsId
						.push(objOfSelectedGridRecord[i].data.identifier);
			}
		}
		strUrl = strUrl + strSelect;
		
		var  objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
		         while (arrMatches = strRegex.exec(strUrl)) {
					objParam[arrMatches[1]] = decodeURIComponent(arrMatches[2]);
				}
		strUrl = strUrl.substring(0, strUrl.indexOf('?'));
		
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		
		Object.keys(objParam).map(function(key) { 
				form.appendChild(me.createFormField('INPUT', 'HIDDEN',
						key, objParam[key]));
				});
				
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCurrent',
				currentPage));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCSVFlag',
				withHeaderFlag));
		for (var i = 0; i < arrSelectedrecordsId.length; i++) {
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'identifier', arrSelectedrecordsId[i]));
		}
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);

	},
	generateFilterUrl : function() {
		var me = this;
		var strQuickFilterUrl = '', strUrl = '';
		me.setDataForFilter();
		var groupView = me.getGroupView();
		var tabFilter = me.getFilterUrl(groupView
				.getSubGroupInfo(), groupView.getGroupInfo());

		strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
		return tabFilter;
	},
	generateUrlWithQuickFilterParams : function(me) {
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
	handleClientChangeInQuickFilter : function(isSessionClientFilter) {
		var me = this;
		me.clientFilterVal = selectedFilterClient;
		me.clientFilterDesc = selectedFilterClientDesc;// combo.getRawValue();
		quickFilterClientValSelected = me.clientFilterVal;
		quickFilterClientDescSelected = me.clientFilterDesc;
		me.filterApplied = 'Q';
		me.changeFilterParams();
		me.setDataForFilter();
		if (me.clientFilterVal === 'all') {
			me.filterApplied = 'ALL';
			me.refreshData();

		} else {
			me.applyFilter();
		}
	},
	
	handleClearSettings:function(){
		var me=this;
		var clientSetupFilterView = me.getClientSetupFilterView();
		if(!Ext.isEmpty(clientSetupFilterView)){
		  /*if(entityType==0){
				clientFilterId=clientSetupFilterView.down('AutoCompleter[itemId="clientCodeId"]');
				me.clientCode='';
				me.clientDesc='';
				clientFilterId.suspendEvents();
				clientFilterId.reset();
				clientFilterId.resumeEvents();
		}else{
			clientFilterId=clientSetupFilterView.down('combo[itemId="clientCombo"]');
			me.strClientDescription=getLabel('allCompanies', 'All companies');
			clientFilterId.setRawValue(getLabel('allCompanies', 'All companies'));	
		}*/
		var receiverNameFltId = clientSetupFilterView
				.down('combobox[itemId=orderPartyNameFltId]');

		var accountNoFltId = clientSetupFilterView
				.down('combobox[itemId=orderPartyCodeFltId]');
		if(isClientUser()){
			var clientCombo = clientSetupFilterView.down('combobox[itemId=clientCombo]');
			me.clientFilterVal = 'all';
			clientCombo.setValue(me.clientFilterVal);
		}else{
			clientSetupFilterView.down('AutoCompleter[itemId=clientComboAuto]').setValue("");
			selectedFilterClientDesc = "";
			selectedFilterClient = "";
		}
		var statusFltId = clientSetupFilterView
		.down('combo[itemId=orderingStatusFilter]');
		statusFltId.reset();
		me.statusPrefCode = 'all';
		statusFltId.selectAllValues();
		receiverNameFltId.setValue("");
		accountNoFltId.setValue("");
		me.clientFilterDesc='';
		me.clientFilterVal='';
		if(_availableClients >1){
			$("#summaryClientFilterSpan").text('All Companies');}
			$("#summaryClientFilter").val('');	
		
		me.filterData=[];
		me.refreshData();
		}
	},
	/*Preference Handling:start*/
	updateConfig : function() {
		var me = this,arrJsn=new Array();
		var statusFilterValArray = [];
		var statusFilterDiscArray = [];
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		if( !Ext.isEmpty( objOrderingPartyPref ) )
				{
					var objJsonData = Ext.decode( objOrderingPartyPref );
					var data = objJsonData.d.preferences.gridViewFilter;
					if( data != 'undefined' && !Ext.isEmpty(data))
					{
						orderingPartyName = data.quickFilter.orderingPartyNameVal;
						orderingPartyId=data.quickFilter.orderingPartyIdVal;
						me.statusPrefCode = data.quickFilter.statusVal;
						me.statusPrefDesc = data.quickFilter.statusDesc;
						if(!Ext.isEmpty(data.filterSelectedClientCode) && data.filterSelectedClientCode !='all'){
							me.clientFilterVal = data.filterSelectedClientCode;
							me.clientFilterDesc = data.filterSelectedClientDesc;
						}		
					}	
					
				}

				if (!Ext.isEmpty(orderingPartyName)) {
					arrJsn.push({
								paramName : me.orderingPartyName,
								paramValue1 : encodeURIComponent(orderingPartyName.toLowerCase().replace(new RegExp("'", 'g'), "\''")),
								operatorValue : 'lk',
								dataType : 'S'
							});
				}
				if (!Ext.isEmpty(orderingPartyId)) {
					arrJsn.push({
								paramName : me.orderingPartyCode,
								paramValue1 : encodeURIComponent(orderingPartyId.toLowerCase().replace(new RegExp("'", 'g'), "\''")),
								operatorValue : 'lk',
								dataType : 'S'
							});
				}
				if (!Ext.isEmpty(me.clientFilterDesc)&&!Ext.isEmpty(me.clientFilterVal) && me.clientFilterVal!= 'all' ) {
					clientParamName = 'clientId';
					clientNameOperator = 'eq';
					if (!Ext.isEmpty(me.clientFilterVal)) {
						clientCodeVal = me.clientFilterVal;
					} else {
						clientCodeVal = strClientId;
					}
		
					if (!Ext.isEmpty(clientCodeVal)) {
						arrJsn.push({
									paramName : clientParamName,
									paramValue1 : encodeURIComponent(clientCodeVal.replace(new RegExp("'", 'g'), "\''")),
									operatorValue : clientNameOperator,
									dataType : 'S'
								});
					}
				}
				if (me.statusPrefCode != null && me.statusPrefCode != 'All'
					&& me.statusPrefCode != 'all' && me.statusPrefCode.length >= 1) {
				statusFilterValArray = me.statusPrefCode.toString();

				if (me.statusPrefDesc != null && me.statusPrefDesc != 'All'
						&& me.statusPrefDesc != 'all'
						&& me.statusPrefDesc.length >= 1)
					statusFilterDiscArray = me.statusPrefDesc.toString();

				arrJsn.push({
							paramName : 'requestState',
							paramValue1 : statusFilterValArray,
							operatorValue : 'statusFilterOp',
							dataType : 'S',
							paramFieldLable : getLabel('status', 'Status'),
							displayType : 5,
							displayValue1 : statusFilterDiscArray
						});
				}
				if (userType == '1') {
					$("#summaryClientFilterSpan").text(me.clientFilterDesc);
					changeClientAndRefreshGrid(me.clientFilterVal,me.clientFilterDesc)
				}else if(userType=='0'){
					$("#summaryClientFilter").val(me.clientFilterDesc);
					changeClientAndRefreshGrid(me.clientFilterVal,me.clientFilterDesc)
				}
				me.filterData = arrJsn;
	},
	handleSavePreferences : function()
	{
		var me = this;
		/*if($("#savePrefMenuBtn").attr('disabled')) 
			event.preventDefault();
		else
			me.savePreferences();*/
		var arrPref = me.getPreferencesToSave(false);
			if (arrPref) {
					me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
					me.postHandleSavePreferences, null, me, true);
					}
		me.disablePreferencesButton("savePrefMenuBtn",true);
		me.disablePreferencesButton("clearPrefMenuBtn",false);		
	},
	postHandleSavePreferences : function(data, args, isSuccess) {},
	getPreferencesToSave : function(localSave) {
				var me = this;
				var groupView = me.getGroupView();
				var grid = null;
				var arrCols = null, objCol = null, arrColPref = new Array(), arrPref = [], objFilterPref = null;
				var groupInfo = null, subGroupInfo = null;
				  if(groupView){
					grid=groupView.getGrid()
					var gridState=grid.getGridState();				
					groupInfo = groupView.getGroupInfo() || '{}';
					subGroupInfo = groupView.getSubGroupInfo() || {};
					var colPrefModuleName = (subGroupInfo.groupCode === 'all') ? (groupInfo.groupTypeCode + subGroupInfo.groupCode) : subGroupInfo.groupCode;
					
							
						arrPref.push({
							"module" : "groupByPref",
							"jsonPreferences" : {
								groupCode : groupInfo.groupTypeCode,
								subGroupCode : subGroupInfo.groupCode
							}
						});
					arrPref.push({
							"module" : subGroupInfo.groupCode,
							"jsonPreferences" : {
								'gridCols' : gridState.columns,
								'pgSize' : gridState.pageSize,
								'sortState' : gridState.sortState,
								'gridSetting' : groupView.getGroupViewState().gridSetting
							}
						});
				
				}
				objFilterPref = me.getFilterPreferences();
					arrPref.push({
								"module" : "gridViewFilter",
								"jsonPreferences" : objFilterPref
							});
				return arrPref;
	},
	handleClearPreferences : function() {
		var me = this;
		me.preferenceHandler.clearPagePreferences(me.strPageName, null,
			me.postHandleClearPreferences, null, me, true);
			me.disablePreferencesButton("savePrefMenuBtn",false);
			me.disablePreferencesButton("clearPrefMenuBtn",true);	
	},
	postHandleClearPreferences : function(data, args, isSuccess) {
		var me = this;						
	},
	getFilterPreferences : function() {
		var me = this;
		var objFilterPref = {};
		var objQuickFilterPref = {};
		var orderingPartyNameVal = null, orderingPartyIdVal = null;
		var clientSetupFilterView = me.getClientSetupFilterView();
		var statusVal = null,statusDesc = null;
		if(Ext.isEmpty(clientSetupFilterView)){
			orderingPartyNameVal=orderingPartyName;
			orderingPartyIdVal=orderingPartyId;
			statusVal = me.statusPrefCode;
			statusDesc = me.statusPrefDesc;
		}else{
			var orderPartyNameFltId = clientSetupFilterView
					.down('combobox[itemId=orderPartyNameFltId]');
			var orderPartyCodeFltId = clientSetupFilterView.down('combobox[itemId=orderPartyCodeFltId]');
			var statusFltId = clientSetupFilterView.down('combo[itemId=orderingStatusFilter]');
		}
		if (!Ext.isEmpty(orderPartyNameFltId)
					&& !Ext.isEmpty(orderPartyNameFltId.getValue())) {
				receiverName = orderPartyNameFltId.getValue(), orderingPartyNameVal = receiverName
						.trim();
		}
		if (!Ext.isEmpty(orderPartyCodeFltId)
				&& !Ext.isEmpty(orderPartyCodeFltId.getValue())) {
			accountNo = orderPartyCodeFltId.getValue();
			orderingPartyIdVal = accountNo.trim();
		}
		if (!Ext.isEmpty(statusFltId)
				&& !Ext.isEmpty(statusFltId.getValue())
				&& "ALL" != statusFltId.getValue().toUpperCase()) {
			statusVal = statusFltId.getValue();
			statusDesc = statusFltId.getRawValue();
		}
		objQuickFilterPref.orderingPartyNameVal =orderingPartyNameVal;
		objQuickFilterPref.orderingPartyIdVal=orderingPartyIdVal;
		objFilterPref.filterSelectedClientCode = me.clientFilterVal;
		objFilterPref.filterSelectedClientDesc = me.clientFilterDesc;
		objQuickFilterPref.statusVal = statusVal;
		objQuickFilterPref.statusDesc = statusDesc;
		objFilterPref.quickFilter = objQuickFilterPref;
		return objFilterPref;
	},
	disablePreferencesButton: function(btnId,boolVal){
		$("#"+btnId).attr("disabled",boolVal);
		if(boolVal)
			{
				$("#"+btnId).css("color",'grey');			
				$("#"+btnId).css('cursor','default').removeAttr('href');
				$("#"+btnId).css('pointer-events','none');
			}
		else
			{
				$("#"+btnId).css("color",'#FFF');
				$("#"+btnId).css('cursor','pointer').attr('href','#');
				$("#"+btnId).css('pointer-events','all');				
			}
	}
	/*Preference Handling:end*/
	

});
function showClientPopup(brandingPkg) {
	GCP.getApplication().fireEvent('showClientPopup', brandingPkg);
}