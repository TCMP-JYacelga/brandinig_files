Ext
	.define(
		'GCP.controller.LMSInterAccountParameterListController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'GCP.view.LMSInterAccountParameterListGroupGridView','Ext.ux.gcp.PageSettingPopUp'
			],
			views :
			[
				'GCP.view.LMSInterAccountParameterListView', 
				'GCP.view.HistoryPopup'
			],
			/**
			 * Array of configs to build up references to views on page.
			 */
			refs :
			[ 	{
					ref : 'pageSettingPopUp',
					selector : 'pageSettingPopUp'
				},
				{
					ref : 'lmsInterAccountParameterListView',
					selector : 'lmsInterAccountParameterListView'
				},
				{
					ref : 'lMSInterAccountParameterListGroupGridView',
					selector : 'lmsInterAccountParameterListView lMSInterAccountParameterListGroupGridView'
				},
				{
					ref : 'groupView',
					selector : 'lMSInterAccountParameterListGroupGridView groupView'
				},
				{
					ref : "sellerFilter",
					selector : 'lmsInterAccountParameterListView lmsInterAccountParameterListFilterView combobox[itemId="entitledSellerIdItemId"]'
				},
				{
					ref : "clientFilter",
					selector : 'lmsInterAccountParameterListView lmsInterAccountParameterListFilterView AutoCompleter[itemId="clientCodeItemId"]'
				},
				/*Quick Filter starts...*/
				{
					ref:'filterView',
					selector:'filterView'	
				},{
					ref:"filterButton",
					selector : "groupView button[itemId=filterButton]"
				},{
					ref:'lmsInterAccountParameterListFilterView',
					selector:'lmsInterAccountParameterListFilterView'
				},{
					ref : 'clientCodeIdCombo',
					selector : 'lmsInterAccountParameterListFilterView combo[itemId="clientCodeId"]'
				},{
					ref : 'agreementCodeItemIdAuto',
					selector : 'lmsInterAccountParameterListFilterView AutoCompleter[itemId=agreementCodeItemId]'
				}, {
					ref : 'fromAccountItemIdAuto',
					selector : 'lmsInterAccountParameterListFilterView AutoCompleter[itemId=fromAccountItemId]'
				},{
					ref : 'toAccountItemIdAuto',
					selector : 'lmsInterAccountParameterListFilterView AutoCompleter[itemId=toAccountItemId]'
				}
				/*Quick Filter ends...*/
			],
			config :
			{
				filterData : [],
				strDefaultMask : '000000000',
				clientFilterVal : 'all',
				clientFilterDesc : getLabel('allCompanies', 'All companies'),
				sellerFilterVal : strSellerId,
				sellerFilterDesc : '',
				fromAccFilterVal : '',
				fromAccFilterDesc : '',
				toAccFilterVal : '',
				toAccFilterDesc : '',
				strPageName : 'lmsIntAccParam',
				agreementCodeValue : '',
				objLocalData : [],
				firstLoad : false
				
			},
			init : function()
			{
				var me = this;
				me.firstLoad = true;
				me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
				$(document).on('performPageSettings', function(event) {
					me.showPageSettingPopup('PAGE');
				});
				me
					.control(
					{
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
						'lMSInterAccountParameterListGroupGridView groupView' : {
							'groupByChange' : function(menu, groupInfo) {
								//me.doHandleGroupByChange(menu, groupInfo);
							},
							'groupTabChange' : function(groupInfo, subGroupInfo, tabPanel,
									newCard, oldCard) {
								me.doHandleGroupTabChange(groupInfo, subGroupInfo,
										tabPanel, newCard, oldCard);								
							},
							'gridRender' : function(groupInfo, subGroupInfo, grid, url, pgSize,
										newPgNo, oldPgNo, sorter, filterData) {
									me.doHandleLoadGridData(groupInfo, subGroupInfo, grid, url, pgSize,
										newPgNo, oldPgNo, sorter, filterData);
							},
							'gridPageChange' : me.doHandleLoadGridData,
							'gridSortChange' : me.doHandleLoadGridData,
							'gridPageSizeChange' : me.doHandleLoadGridData,
							'gridColumnFilterChange' : me.doHandleLoadGridData,
							'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,
							'gridStateChange' : function(grid) {
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
								isGridLoaded = true;
								disableGridButtons(false);
							},
							'gridSettingClick' : function(){
								me.showPageSettingPopup('GRID');
							}
						},
						'lmsInterAccountParameterListView lmsInterAccountParameterListGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateLMSInterAccountParameterList"]' :
						{
							click : function()
							{
								me.handleLMSInterAccountParameterListEntryAction( true );
							}
						},
						'lmsInterAccountParameterListView lmsInterAccountParameterListFilterView' :
						{
							render : function()
							{
								me.setInfoTooltip();
								me.handleSpecificFilter();
							},
							afterrender : function()
							{
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
							}
						},
						'filterView' : {
							appliedFilterDelete : function(btn){
								me.handleAppliedFilterDelete(btn);
							}
						},
						'filterView button[itemId="clearSettingsButton"]' : {
							'click' : function() {
								me.handleClearSettings();
							}
						},
						'lmsInterAccountParameterListView lmsInterAccountParameterListFilterView combobox[itemId="entitledSellerIdItemId"]' :
						{
							select : function( combo, record, index )
							{
								var objFilterPanel = me.getLmsInterAccountParameterListFilterView();
								var objAutocompleter = objFilterPanel
									.down( 'AutoCompleter[itemId="clientCodeItemId"]' );
								strSellerId = record[ 0 ].data.sellerCode;
								objAutocompleter.cfgExtraParams = entity_type == '1' ? [{
									key : '$filtercode1',
									value : strUserCode
								}] :[{
									key : '$filtercode1',
									value : strSellerId
								}]
								me.resetAgreementCode(objFilterPanel, strSellerId, null);
								me.handleSellerFilter(combo ,combo.getValue());
								me.setDataForFilter();
								me.applyFilter();
							},
							'render':function(combo, record, index ) {
							//if(combo.isHidden() != false)
							//{
								me.sellerFilterDesc = combo.getRawValue();
								me.sellerFilterVal = combo.getValue();
								//me.resetAgreementCode(objFilterPanel, combo.getValue(), null);
								me.setDataForFilter();
								me.applyFilter();
							//}
							}
						},
						'lmsInterAccountParameterListFilterView AutoCompleter[itemId="clientCodeItemId"]' :
						{
							select : function( combo, record, index )
							{
								strClientId = combo.getValue();
								var objFilterPanel = me.getLmsInterAccountParameterListFilterView();
								me.resetAgreementCode(objFilterPanel,strSellerId,strClientId);
								me.clientFilterDesc = combo.getDisplayValue();
								me.clientFilterVal = combo.getValue();
								me.refreshData();
							},
							change : function(combo, record, index ){
								if(combo.value == ''|| combo.value == null)
								{
									strClientId = combo.value;
									var objFilterPanel = me.getLmsInterAccountParameterListFilterView();
									me.resetAgreementCode(objFilterPanel,strSellerId,null);
									me.agreementCodeValue = '';
									me.clientFilterDesc = '';
									me.clientFilterVal = '';
									me.refreshData();
								}
							},
							boxready : function(combo, width, height, eOpts){
								if (!Ext.isEmpty(me.clientFilterDesc) && me.clientFilterDesc != 'all'){
									combo.setValue(me.clientFilterDesc);
								}
							}
						},
						'lmsInterAccountParameterListFilterView combo[itemId="clientCodeId"]' :
						{
							select : function( combo, record, index )
							{
								//if (combo.getValue() !== "all") {
									var objFilterPanel = me.getLmsInterAccountParameterListFilterView();
									me.resetAgreementCode(objFilterPanel,strSellerId,combo.getValue());
									objFilterPanel.cfgExtraParams = [ {
										key : '$filtercode1',
										value : strSellerId
									}, {
										key : '$filtercode2',
										value : record[0].data.CODE
									}
									];
									me.refreshData();
								//}
							},
							change : function(combo, record, index ){
								if (Ext.isEmpty(combo.getRawValue()) || combo.getValue() === "all") {
										var objFilterPanel = me.getLmsInterAccountParameterListFilterView();
										me.resetAgreementCode(objFilterPanel,strSellerId,null);
										me.agreementCodeValue = '';
										me.clientFilterDesc = '';
										me.clientFilterVal = '';
										me.refreshData();
								}
							},
						},
						'lmsInterAccountParameterListFilterView AutoCompleter[itemId="fromAccountItemId"]' :
						{
							select : function( combo, record, index )
							{
								me.fromAccFilterDesc = combo.getRawValue();
								me.fromAccFilterVal  = combo.getValue();
								me.setDataForFilter();
								me.applyFilter();
							},
							'change':function(combo, record, index ){
								if(combo.getRawValue()=="")
								{
									me.fromAccFilterDesc = '';
									me.fromAccFilterVal  = '';
									me.setDataForFilter();
									me.applyFilter();
								}
							}
						},
						'lmsInterAccountParameterListFilterView AutoCompleter[itemId="toAccountItemId"]' :
						{
							select : function( combo, record, index )
							{
								me.toAccFilterDesc = combo.getRawValue();
								me.toAccFilterVal  = combo.getValue();
								me.setDataForFilter();
								me.applyFilter();
							},
							'change':function(combo, record, index ){
								if(combo.getRawValue()=="")
								{
									me.toAccFilterDesc = '';
									me.toAccFilterVal  = '';
									me.setDataForFilter();
									me.applyFilter();
								}
							}
						},
						
						'lmsInterAccountParameterListFilterView AutoCompleter[itemId="agreementCodeItemId"]' :
						{
							select : function( combo, record, index )
							{
								me.agreementCodeValue = record[ 0 ].data.RECKEY;
								var objFilterPanel = me.getLmsInterAccountParameterListFilterView();
								var objAutocompleter = objFilterPanel
									.down( 'AutoCompleter[itemId="fromAccountItemId"]' );
								objAutocompleter.cfgExtraParams =
								[
									{
										key : '$filtercode2',
										value : strSellerId
									},
									{
										key : '$filtercode3',
										value : strClientId
									},
									{
										key : '$filtercode4',
										value : me.agreementCodeValue
									}
								];
								objAutocompleter.setValue( '' );
								me.fromAccFilterDesc = '';
								me.fromAccFilterVal  = '';
								objAutocompleter = null;
								objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="toAccountItemId"]' );
								objAutocompleter.cfgExtraParams =
								[
									{
										key : '$filtercode2',
										value : strSellerId
									},
									{
										key : '$filtercode3',
										value : strClientId
									},
									{
										key : '$filtercode4',
										value : me.agreementCodeValue
									}
								];
								objAutocompleter.setValue( '' );
								me.toAccFilterDesc = '';
								me.toAccFilterVal  = '';
								me.setDataForFilter();
								me.applyFilter();

							},
							'change':function(combo, record, index ){
								if(combo.getRawValue()=="")
								{
									me.agreementCodeValue = '';
									var objFilterPanel = me.getLmsInterAccountParameterListFilterView();
									var objAutocompleter = objFilterPanel
										.down( 'AutoCompleter[itemId="fromAccountItemId"]' );
									objAutocompleter.cfgExtraParams =
									[
										{
											key : '$filtercode2',
											value : strSellerId
										},
										{
											key : '$filtercode3',
											value : strClientId
										},
										{
											key : '$filtercode4',
											value : me.agreementCodeValue
										}
									];
									objAutocompleter.setValue( '' );
									me.fromAccFilterDesc = '';
									me.fromAccFilterVal  = '';
									objAutocompleter = null;
									objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="toAccountItemId"]' );
									objAutocompleter.cfgExtraParams =
									[
										{
											key : '$filtercode2',
											value : strSellerId
										},
										{
											key : '$filtercode3',
											value : strClientId
										},
										{
											key : '$filtercode4',
											value : me.agreementCodeValue
										}
									];
									objAutocompleter.setValue( '' );
									me.toAccFilterDesc = '';
									me.toAccFilterVal  = '';
									me.setDataForFilter();
									me.applyFilter();

								}
							}
						}
					} );
			},

			resetAgreementCode : function(objFilterPanel,sellerId,clientId)
			{
				var objAutocompleter = objFilterPanel
					.down( 'AutoCompleter[itemId="agreementCodeItemId"]' );
				var jsonArray = [];
				jsonArray.push({key : '$filtercode1',value : sellerId});
				if( clientId !== undefined && (clientId !== null && clientId !== '' && clientId !== 'all') )				
					jsonArray.push({key : '$filtercode2', value : clientId});
				objAutocompleter.cfgExtraParams = jsonArray;
				objAutocompleter.setValue( '' );
			},
			handleSpecificFilter : function()
			{
			},
			handleGridHeader : function()
			{

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
						if(fieldName == 'sellerId')
						{
							me.sellerFilterVal = fieldVal;
							var sellerValue = me.getLmsInterAccountParameterListFilterView().down('combo[itemId="entitledSellerIdItemId"]');
							if(!Ext.isEmpty(me.sellerFilterVal))
							{
								sellerValue.setValue(me.sellerFilterVal);
							}
						}
						if(fieldName == 'clientCode')
						{
							var clientComboAuto = me.getLmsInterAccountParameterListFilterView().down('AutoCompleter[itemId="clientCodeItemId"]');
							var clientComboBox = me.getLmsInterAccountParameterListFilterView().down('combo[itemId="clientCombo]');
							me.clientFilterDesc = dispval;
							me.clientFilterVal = fieldVal;
							if(!Ext.isEmpty(me.clientFilterDesc))
							{
								if(!Ext.isEmpty(clientComboAuto))
								{
									clientComboAuto.setValue(me.clientFilterDesc);
								}
								if(!Ext.isEmpty(clientComboBox))
								{
									clientComboBox.setValue(me.clientFilterDesc);
								}
							}
						}
						else if(fieldName == 'agreementCode')
						{
							me.agreementCodeValue = dispval;
							agreementCodeFilter = me.getLmsInterAccountParameterListFilterView().down('combobox[itemId=agreementCodeItemId]');
							if(!Ext.isEmpty(me.agreementCodeValue)){
								
									agreementCodeFilter.setValue(me.agreementCodeValue);
							}
						}
						else if(fieldName == 'fromAccountId')
						{
							me.fromAccFilterVal = filterData[i].paramValue1;
							me.fromAccFilterDesc = dispval;
							participatingAcc = me.getLmsInterAccountParameterListFilterView().down('combobox[itemId=fromAccountItemId]');
							if(!Ext.isEmpty(me.fromAccFilterVal)){
									participatingAcc.setValue(me.fromAccFilterDesc);
								}
						}
						else if(fieldName == 'toAccountId')
						{
							me.toAccFilterVal = filterData[i].paramValue1; 
							me.toAccFilterDesc = dispval;
							contraAcc = me.getLmsInterAccountParameterListFilterView().down('combobox[itemId=toAccountItemId]');
							if(!Ext.isEmpty(me.toAccFilterVal)){
									contraAcc.setValue(me.toAccFilterVal);
									contraAcc.setRawValue(me.toAccFilterDesc);
								}
						}
					}
					
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

			doHandleLoadGridData : function( groupInfo, subGroupInfo, grid, url, pgSize,
						newPgNo, oldPgNo, sorter, filterData)
			{
				var me = this;
				var objGroupView = me.getGroupView();
				var buttonMask = me.strDefaultMask;
				me.setDataForFilter();
				var arrOfParseQuickFilter = [], arrOfFilteredApplied = [];
				
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
				
				if (!$('#actionResultDiv').hasClass('ui-helper-hidden')) {
					$('#actionResultDiv').addClass('ui-helper-hidden');
					if ($('#actionResultInfoDiv').children('.row').length > 0) {
						$('#actionResultInfoDiv').children('.row').remove();
					}
				}
				objActionResult = {
					'order' : []
				};
				objGroupView.handleGroupActionsVisibility(buttonMask);
				var strUrl = grid.generateUrl(url, pgSize, intNewPgNo, intOldPgNo, sorter);
				strUrl += me.getFilterUrl(subGroupInfo, groupInfo)+'&'+csrfTokenName+'='+csrfTokenValue;
				me.disableActions(true);
				//strUrl += '&' + csrfTokenName + '=' + csrfTokenValue;
				//me.enableDisableGroupActions( '000000000');
				if(!Ext.isEmpty(me.filterData)){
					if(!Ext.isEmpty(me.filterData) && me.filterData.length >= 1){
						if(multipleSellersAvailable == true  && entity_type === '0'){
							arrOfParseQuickFilter = generateFilterArray(me.filterData);
						}
						else{
								var quickJsonData = me.filterData;
								var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,'sellerCode');
								if (!Ext.isEmpty(reqJsonInQuick)) {
									arrQuickJson = quickJsonData;
									arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,'sellerCode');
									quickJsonData = arrQuickJson;
								}
								arrOfParseQuickFilter = generateFilterArray(quickJsonData);
							}
					}
				}
				//Hide seller code
				if(entity_type === '0'){
					arrOfParseQuickFilter = arrOfParseQuickFilter.filter(function(e){
						return !(e.hasOwnProperty('fieldId') && e['fieldId'] === 'sellerId');
					});
				}
				if (arrOfParseQuickFilter) {
					arrOfFilteredApplied = arrOfParseQuickFilter;
					
					if (arrOfFilteredApplied)
						me.getFilterView().updateFilterInfo(arrOfFilteredApplied);
				}
				var columns=grid.columns;
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

			getFilterUrl : function()
			{
				var me = this;
				var strQuickFilterUrl = '';
				strQuickFilterUrl = me.generateUrlWithFilterParams( this );
				strQuickFilterUrl += '&' + csrfTokenName + '=' + csrfTokenValue;
				return strQuickFilterUrl;
			},

			generateUrlWithFilterParams : function( thisClass )
			{
				var filterData = thisClass.filterData;
				var isFilterApplied = false;
				var strFilter = '&$filter=';
				var strTemp = '';
				var strFilterParam = '';
				for( var index = 0 ; index < filterData.length ; index++ )
				{
					if( isFilterApplied )
						strTemp = strTemp + ' and ';
					switch( filterData[ index ].operatorValue )
					{
						case 'bt':
							strTemp = strTemp + filterData[ index ].paramName + ' ' + filterData[ index ].operatorValue
								+ ' ' + '\'' + filterData[ index ].paramValue1 + '\'' + ' and ' + '\''
								+ filterData[ index ].paramValue2 + '\'';
							break;
						case 'in':
							var arrId = filterData[ index ].paramValue1;
							if( 0 != arrId.length )
							{
								strTemp = strTemp + '(';
								for( var count = 0 ; count < arrId.length ; count++ )
								{
									strTemp = strTemp + filterData[ index ].paramName + ' eq ' + '\'' + arrId[ count ]
										+ '\'';
									if( count != arrId.length - 1 )
									{
										strTemp = strTemp + ' or ';
									}
								}
								strTemp = strTemp + ' ) ';
							}
							break;
						default:
							// Default opertator is eq
							strTemp = strTemp + filterData[ index ].paramName + ' ' + filterData[ index ].operatorValue
								+ ' ' + '\'' + filterData[ index ].paramValue1 + '\'';
							break;
					}
					isFilterApplied = true;
				}
				if( isFilterApplied )
					strFilter = strFilter + strTemp;
				else
					strFilter = '';
				return strFilter;
			},

			setDataForFilter : function()
			{
				var me = this;
				var jsonArray = [];
				var sellerValue = null;
				var clientValue = null;
				var agreementCodeFilter = null;
				var agreementCodeValue = null;
				
				var fromAccountFilter = null;
				var fromAccountValue = null;
				
				var toAccountFilter = null;
				var toAccountValue = null;				
				var lmsInterAccountParameterListFilterView = me.getLmsInterAccountParameterListFilterView();
				
				/*var sellerFilter = lmsInterAccountParameterListFilterView
				.down('combobox[itemId=entitledSellerIdItemId]');
				if( !Ext.isEmpty( sellerFilter ) && !Ext.isEmpty( sellerFilter.getValue() )
						&& "ALL" != sellerFilter.getValue() )
					{
						sellerValue = strSellerId;
					}*/
			
				var clientFilter = lmsInterAccountParameterListFilterView
				.down('combobox[itemId=clientCodeItemId]');
				/*if( !Ext.isEmpty( clientFilter ) && !Ext.isEmpty( clientFilter.getValue() )
					&& "ALL" != clientFilter.getValue() )
				{
					clientValue = clientFilter.getValue();
					me.clientFilterVal = clientFilter.getValue();
					me.clientFilterDesc = clientFilter.getRawValue();
				}*/
				
				/*var clientAutoFilter = lmsInterAccountParameterListFilterView
				.down('combobox[itemId=clientCodeItemId]');
				if( !Ext.isEmpty( clientAutoFilter ) && !Ext.isEmpty( clientAutoFilter.getValue() )
					&& "ALL" != clientAutoFilter.getValue() )
				{
					clientValue = clientAutoFilter.getValue();
					me.clientFilterVal = clientAutoFilter.getValue();
					me.clientFilterDesc = clientAutoFilter.getRawValue();
				}*/
				//
				if(entity_type === '0'){
					if (me.sellerFilterVal != 'all') {
						jsonArray.push({
							paramName : 'sellerId',
							paramValue1 : me.sellerFilterVal,
							operatorValue : 'eq',
							dataType : 'S',
							displayType : 5,
							displayValue1 : me.sellerFilterDesc,
							paramFieldLable : getLabel('lbl.companyFI', 'Financial Institution')
						});
					} else {
						jsonArray.push({
							paramName : 'sellerId',
							paramValue1 : strSellerId,
							operatorValue : 'eq',
							dataType : 'S',
							displayType : 5,
							displayValue1 : me.sellerFilterDesc,
							paramFieldLable : getLabel('financialInstitution', 'Financial Institution')
						});
					}
				}
				//
				if( !Ext.isEmpty( me.clientFilterVal && me.clientFilterDesc ) && (me.clientFilterVal != 'all' && me.clientFilterDesc != 'ALL'))
				{
					jsonArray.push(
					{
						paramName : clientFilter.filterParamName,
						paramValue1 : encodeURIComponent(me.clientFilterVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S',
						paramFieldLable :  getLabel('lbl.companyname', 'Company Name'),
						displayType : 5,
						displayValue1 : me.clientFilterDesc
					} );
				}
				
				//agreementCodeFilter = me.getAgreementCodeFilter();
				agreementCodeFilter = lmsInterAccountParameterListFilterView.down('combobox[itemId=agreementCodeItemId]');
				if( !Ext.isEmpty( agreementCodeFilter ) && !Ext.isEmpty( agreementCodeFilter.getValue() )
					&& "ALL" != agreementCodeFilter.getValue() )
				{
					agreementCodeValue = agreementCodeFilter.getValue();
					
				}		
				
				if( !Ext.isEmpty( agreementCodeValue ) )
				{
					jsonArray.push(
					{
						paramName : agreementCodeFilter.filterParamName,
						paramValue1 : encodeURIComponent(agreementCodeValue.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'lk',
						dataType : 'S',
						paramFieldLable : getLabel('agreementcode', 'Agreement Code'),
						displayType : 5,
						displayValue1 : agreementCodeValue
					} );
				}
				
				//fromAccountFilter = me.getFromAccountFilter();
				fromAccountFilter = lmsInterAccountParameterListFilterView.down('combobox[itemId=fromAccountItemId]');
				
				if( !Ext.isEmpty( me.fromAccFilterVal ) && !Ext.isEmpty(me.fromAccFilterDesc) )
				{
					jsonArray.push(
					{
						paramName : fromAccountFilter.filterParamName,
						paramValue1 : encodeURIComponent(me.fromAccFilterVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'lk',
						dataType : 'S',
						paramFieldLable : getLabel('fromAccnt', 'Participating Account'),
						displayType : 5,
						displayValue1 : me.fromAccFilterDesc
					} );
				}
				
				//toAccountFilter = me.getToAccountFilter();
				toAccountFilter = lmsInterAccountParameterListFilterView.down('combobox[itemId=toAccountItemId]');
			
				if( !Ext.isEmpty( me.toAccFilterVal ) && !Ext.isEmpty( me.toAccFilterDesc ))
				{
					jsonArray.push(
					{
						paramName : toAccountFilter.filterParamName,
						paramValue1 : encodeURIComponent(me.toAccFilterVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'lk',
						dataType : 'S',
						paramFieldLable : getLabel('toAccnt', 'Contra Account'),
						displayType : 5,
						displayValue1 : me.toAccFilterDesc
					} );
				}
				
				me.filterData = jsonArray;
			},
			applyFilter : function()
			{
				var me = this;
				/*var grid = me.getGrid();
				if( !Ext.isEmpty( grid ) )
				{
					var strDataUrl = grid.store.dataUrl;
					var store = grid.store;
					var strUrl = grid.generateUrl( strDataUrl, grid.pageSize, 1, 1, store.sorters );
					strUrl = strUrl + me.getFilterUrl();
					me.enableDisableGroupActions( '000000000');
					grid.setLoading(true);
					grid.loadGridData( strUrl, me.handleAfterGridDataLoad, null );
				}*/
				var objGroupView = me.getGroupView();
				var groupInfo = objGroupView.getGroupInfo();
				me.refreshData();
			},
			submitExtForm : function( strUrl, record, rowIndex )
			{
				var me = this;
				var viewState = record.data.viewState;
				var updateIndex = rowIndex;
				var form, inputField;

				form = document.createElement( 'FORM' );
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, tokenValue ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'txtRecordIndex', rowIndex ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'viewState', viewState ) );

				form.action = strUrl;
				document.body.appendChild( form );
				form.submit();
			},

			showHistory : function( product, url, id )
			{
				Ext.create( 'GCP.view.HistoryPopup',
				{
					productName : product,
					historyUrl : url,
					identifier : id
				} ).show();
			},
			handleSellerFilter : function(combo,selectedValue )
			{
				var me = this;
				me.sellerFilterVal = selectedValue;
				me.sellerFilterDesc = combo.getRawValue();
				me.refreshData();
			},
			isRowIconVisible : function( store, record, jsonData, itmId, maskPosition )
			{
				var maskSize = 9;
				var maskArray = new Array();
				var actionMask = '';
				var rightsMap = record.data.__metadata.__rightsMap;
				var specialEditStatus = record.data.specialEditStatus;
				var buttonMask = '';
				var retValue = true;
				var bitPosition = '';
				if( !Ext.isEmpty( maskPosition ) )
				{
					bitPosition = parseInt( maskPosition,10 ) - 1;
					maskSize = maskSize;
				}
				if( !Ext.isEmpty( jsonData ) && !Ext.isEmpty( jsonData.d.__buttonMask ) )
					buttonMask = jsonData.d.__buttonMask;
				maskArray.push( buttonMask );
				maskArray.push( rightsMap );
				actionMask = doAndOperation( maskArray, maskSize );
				var isSameUser = true;
				if( record.raw.makerId === USER )
				{
					isSameUser = false;
				}
				var reqState = record.raw.requestState;
				var submitFlag = record.raw.isSubmitted;
				var validFlag = record.raw.validFlag;

				if( Ext.isEmpty( bitPosition ) )
					return retValue;
				retValue = isActionEnabled( actionMask, bitPosition );
				if( ( maskPosition === 2 && retValue ) )
				{
					retValue = retValue && isSameUser;
				}
				else if( maskPosition === 3 && retValue )
				{
					retValue = retValue && isSameUser;
				}
				else if( maskPosition === 8 && retValue ) 
				{
					retValue = true;
				}
				return retValue;
			},

			enableDisableGroupActions : function( actionMask, isSameUser, isEnabled, isDisabled, isSubmit )
			{
				var me = this;
				var objGroupView = me.getGroupView();
				var actionBar = objGroupView.down('toolbar[itemId="groupActionToolBar"]');
				var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
				if( !Ext.isEmpty( actionBar ) && !Ext.isEmpty( actionBar.items.items ) )
				{
					arrItems = actionBar.items.items;
					Ext.each( arrItems, function( item )
					{
						strBitMapKey = parseInt( item.maskPosition,10 ) - 1;
						if( strBitMapKey || strBitMapKey == 0 )
						{
							blnEnabled = isActionEnabled( actionMask, strBitMapKey );

							if( ( item.maskPosition === 2 && blnEnabled ) )
							{
								blnEnabled = blnEnabled && isSameUser;
							}
							else if( item.maskPosition === 3 && blnEnabled )
							{
								blnEnabled = blnEnabled && isSameUser;
							}
							/*
							else if (item.maskPosition === 8 && blnEnabled) 
							{
								blnEnabled = blnEnabled && isEnabled;
							}
							else if (item.maskPosition === 9 && blnEnabled)
							{
								blnEnabled = blnEnabled && isDisabled;
							}
							else if (item.maskPosition === 10 && blnEnabled)
							{
								blnEnabled = blnEnabled && !isSubmit;
							}*/
							item.setDisabled( !blnEnabled );
						}
					} );
				}
			},

			handleGroupActions : function( btn, record )
			{
				var me = this;
				var strAction = !Ext.isEmpty( btn.actionName ) ? btn.actionName : btn.itemId;
				var strUrl = Ext.String.format( 'lmsLMSInterAccountParameterListMst/{0}.srvc', strAction );
				if( strAction === 'reject' )
				{
					this.showRejectVerifyPopUp( strAction, strUrl, record );

				}
				else
				{
					this.preHandleGroupActions( strUrl, '', record );
				}

			},
			showRejectVerifyPopUp : function( strAction, strActionUrl, record )
			{
				var me = this;
				var titleMsg = '', fieldLbl = '';
				if( strAction === 'reject' )
				{
					fieldLbl = getLabel( 'prfRejectRemarkPopUpTitle', 'Please Enter Reject Remark' );
					titleMsg = getLabel( 'prfRejectRemarkPopUpFldLbl', 'Reject Remark' );
				}
				var msgbox = Ext.Msg.show(
				{
					title : titleMsg,
					msg : fieldLbl,
					buttons : Ext.Msg.OKCANCEL,
					multiline : 4,
					cls : 't7-popup',
					width: 355,
					height : 270,
					bodyPadding : 0,
					fn : function( btn, text )
					{
						if(text.length >255) {
							Ext.Msg.alert('Error', getLabel('rejectRestrictionError', 'Reject remark should be less than 255 characters'));
							return false;
						}
						if( btn == 'ok' )
						{
							me.preHandleGroupActions( strActionUrl, text, record );
						}
					}
				} );
				msgbox.textArea.enforceMaxLength = true;
				msgbox.textArea.inputEl.set({
					maxLength : 255
				});
			},
			preHandleGroupActions : function(strUrl, remark, arrSelectedRecords) {
				var me = this;
				var groupView = me.getGroupView();
				if( !Ext.isEmpty( groupView ) )
				{
					var grid = groupView.getGrid();
					if (!Ext.isEmpty(grid)) {
						var arrayJson = new Array();
						var records = (arrSelectedRecords || []);
						for( var index = 0 ; index < records.length ; index++ )
						{
							arrayJson.push(
							{
								serialNo : grid.getStore().indexOf( records[ index ] ) + 1,
								identifier : records[ index ].data.identifier,
								userMessage : remark
							} );
						}
						if( arrayJson )
							arrayJson = arrayJson.sort( function( valA, valB )
							{
								return valA.serialNo - valB.serialNo
							} );
						groupView.setLoading(true);
						Ext.Ajax.request(
						{
							url :  strUrl+'?'+csrfTokenName+'='+csrfTokenValue,
							method : 'POST',
							jsonData : Ext.encode( arrayJson ),
							success : function( response )
							{
								me.enableDisableGroupActions( '0000000000', true );
								groupView.setLoading(false);
								groupView.refreshData();
								var errorMessage = '';
								if( response.responseText != '[]' )
								{
									var jsonData = Ext.decode( response.responseText );
									Ext.each( jsonData[ 0 ].errors, function( error, index )
									{
										errorMessage = errorMessage + error.code + ' : ' + error.errorMessage + "<br/>";
									} );
									if ('' != errorMessage && null != errorMessage) {
										var msgBox = new Ext.window.MessageBox();
										msgBox.autoShow=true;
										msgBox.autoScroll=true;
										msgBox.overflowY='auto';
										msgBox.show({
											title : getLabel('errorTitle', 'Error'),
										    msg : errorMessage,
										    buttons : Ext.MessageBox.OK,
										    cls : 'ux_popup',
											icon : Ext.MessageBox.ERROR,
											autoScroll: true,
											scope: this
										});
									}
								}
							},
							failure : function()
							{
								var errMsg = "";
								Ext.MessageBox.show(
								{
									title : getLabel( 'instrumentErrorPopUpTitle', 'Error' ),
									msg : getLabel( 'instrumentErrorPopUpMsg', 'Error while fetching data..!' ),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								} );
							}
						} );
					}
				}
			},
			columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
			{
				var strRetValue = "";
				strRetValue = value;
				return strRetValue;
			},
			getLMSInterAccountParameterListGridConfiguration : function()
			{
				var me = this;
				var objConfigMap = null;
				var objWidthMap = null;
				var arrColsPref = null;
				var storeModel = null;
				objWidthMap =
				{
					"agreementName" : 155,
					"fromAccount" : 130,
					"fromAccountDesc" : 150,
					"toAccount" : 130,
					"toAccountDesc" : 200,
					"requestStateDesc" : 200
				};

				arrColsPref =
				[
					{
						"colId" : "agreementName",
						"colDesc" : getLabel('agreementName', 'Agreement Name')
					},
					{
						"colId" : "agreementCode",
						"colDesc" : getLabel( 'agreementCode', 'Agreement Code' )
					},
					{
						"colId" : "fromAccount",
						"colDesc" : getLabel('fromAccount', 'Participating Account')
					},
					{
						"colId" : "fromAccountDesc",
						"colDesc" : getLabel('fromDescription', 'Participating Description')
					},
					{
						"colId" : "toAccount",
						"colDesc" : getLabel('toAcc', 'Contra Account')
					},
					{
						"colId" : "toAccountDesc",
						"colDesc" : getLabel('toAccDesc', 'Contra Account Description')
					},
					{
						"colId" : "requestStateDesc",
						"colDesc" : getLabel('status', 'Status')
					}
				];

				storeModel =
				{
					fields :
					[
						'agreementName', 'agreementCode','fromAccount', 'fromAccountDesc', 'toAccount', 'toAccountDesc',
						'requestStateDesc', 'identifier', 'history', '__metadata', 'viewState'
					],
					proxyUrl : 'lmsLMSInterAccountParameterListMst.srvc',
					rootNode : 'd.profile',
					totalRowsNode : 'd.__count'
				};

				objConfigMap =
				{
					"objWidthMap" : objWidthMap,
					"arrColsPref" : arrColsPref,
					"storeModel" : storeModel
				};
				return objConfigMap;
			},
			/**
			 * Finds all strings that matches the searched value in each grid
			 * cells.
			 * 
			 * @private
			 */
			searchOnPage : function()
			{
				var me = this;
				//var searchValue = me.getSearchTextInput().value;
				var anyMatch = me.getMatchCriteria().getValue();
				if( 'anyMatch' === anyMatch.searchOnPage )
				{
					anyMatch = false;
				}
				else
				{
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

				if( searchValue !== null )
				{
					searchRegExp = new RegExp( searchValue, 'g' + ( anyMatch ? '' : 'i' ) );

					if( !Ext.isEmpty( grid ) )
					{
						var store = grid.store;

						store.each( function( record, idx )
						{
							var td = Ext.fly( grid.view.getNode( idx ) ).down( 'td' ), cell, matches, cellHTML;
							while( td )
							{
								cell = td.down( '.x-grid-cell-inner' );
								matches = cell.dom.innerHTML.match( tagsRe );
								cellHTML = cell.dom.innerHTML.replace( tagsRe, tagsProtect );

								if( cellHTML === '&nbsp;' )
								{
									td = td.next();
								}
								else
								{
									// populate indexes array, set currentIndex, and
									// replace
									// wrap matched string in a span
									cellHTML = cellHTML.replace( searchRegExp, function( m )
									{
										return '<span class="xn-livesearch-match">' + m + '</span>';
									} );
									// restore protected tags
									Ext.each( matches, function( match )
									{
										cellHTML = cellHTML.replace( tagsProtect, match );
									} );
									// update cell html
									cell.dom.innerHTML = cellHTML;
									td = td.next();
								}
							}
						}, me );
					}
				}
			},
			handleLMSInterAccountParameterListEntryAction : function( entryType )
			{
				var me = this;
				var form;
				var strUrl = 'showLMSInterAccountParameterListMst.srvc';
				var errorMsg = null;
				form = document.createElement( 'FORM' );
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, tokenValue ) );

				form.action = strUrl;
				document.body.appendChild( form );
				form.submit();
				document.body.removeChild( form );
			},
			createFormField : function( element, type, name, value )
			{
				var inputField;
				inputField = document.createElement( element );
				inputField.type = type;
				inputField.name = name;
				inputField.value = value;
				return inputField;
			},
			setInfoTooltip : function()
			{
				var me = this;
				var infotip = Ext.create( 'Ext.tip.ToolTip',
					{
						target : 'imgFilterInfo',
						listeners :
						{
							// Change content dynamically depending on which element
							// triggered the show.
							beforeshow : function( tip )
							{
								var agreementCodeFilter = null;
								var agreementCodeValue = null;
								
								var fromAccountFilter = null;
								var fromAccountValue = null;
								
								var toAccountFilter = null;
								var toAccountValue = null;	
								
								var clientFilterValue = null;
								
								
								var clientFilter = me.getClientFilter();
								if( !Ext.isEmpty( clientFilter ) && !Ext.isEmpty( clientFilter.getValue() ) )
								{
									clientFilterValue = clientFilter.getValue();
								}
								else
								{
									clientFilterValue = getLabel( 'all', 'ALL' );
								}


								var agreementCodeFilter = me.getAgreementCodeFilter();
								if( !Ext.isEmpty( agreementCodeFilter ) && !Ext.isEmpty( agreementCodeFilter.getValue() ) )
								{
									agreementCodeValue = agreementCodeFilter.getValue();
								}
								else
								{
									agreementCodeValue = getLabel( 'all', 'ALL' );
								}

								var fromAccountFilter = me.getFromAccountFilter();
								if( !Ext.isEmpty( fromAccountFilter ) && !Ext.isEmpty( fromAccountFilter.getValue() ) )
								{
									fromAccountValue = fromAccountFilter.getValue();
								}
								else
								{
									fromAccountValue = getLabel( 'all', 'ALL' );
								}
								

								var toAccountFilter = me.getToAccountFilter();
								if( !Ext.isEmpty( toAccountFilter ) && !Ext.isEmpty( toAccountFilter.getValue() ) )
								{
									toAccountValue = toAccountFilter.getValue();
								}
								else
								{
									toAccountValue = getLabel( 'all', 'ALL' );
								}
								
								tip.update( 
									getLabel( "client", "Client")  + ' : ' + clientFilterValue + '<br/>'
									+ getLabel( "agreementCode", "Agreement Code" ) + ' : ' + agreementCodeValue + '<br/>'
									+ getLabel( "fromAccount", "Participating Account" ) + ' : ' + fromAccountValue + '<br/>'
									+ getLabel( "toAccount", "Contra Account" ) + ' : ' + toAccountValue);
							}
						}
					} );
			},
			showSpecialEditWindow : function( record, rowIndex )
			{
				var me = this;
				var win;
				var refresh = true;
				var form = Ext.widget( 'form',
					{
						layout :
						{
							type : 'vbox',
							align : 'stretch'
						},
						border : false,
						bodyPadding : 10,
						parent : this,
						//standardSubmit : true,
						fieldDefaults :
						{
							labelAlign : 'top',
							labelWidth : 100,
							labelStyle : 'font-weight:bold'
						},
						url : 'lmsLMSInterAccountParameterListMst/specialedit.srvc',
						headers :
						{
							'Content-Type' : 'application/javascript'
						},
						items :
						[
							{
								xtype : 'hidden',
								name : csrfTokenName,
								value : csrfTokenValue
							},
							{
								xtype : 'hidden',
							//	name : rowIndex,
								name : 'rowIndex',
								value : rowIndex
							},
							{
								xtype : 'hidden',
								name : 'viewState',
								value : record.get( 'viewState' )
							},
							{
								xtype : 'hidden',
								itemId : 'identifier',
								name : 'identifier',
								value : record.get( 'identifier' )
							},
							{
								xtype : 'hidden',
								itemId : 'profileCode',
								name : 'profileCode',
								value : record.get( 'profileCode' )
							},
							{
								xtype : 'datefield',
								name : 'effectiveDate',
								itemId : 'effectiveDate',
								format : 'Y-m-d H:i:s',
								fieldLabel : getLabel('chgEffectiveForm', 'Change Effective From'),
								editable : false,
								maxValue : record.get( 'sellerAppDate' ),
								allowBlank : true
							},
							{
								xtype : 'textareafield',
								name : 'specialEditRemarks',
								fieldLabel : getLabel('splEditRemark', 'Special Edit Remarks'),
								labelAlign : 'top',
								flex : 1,
								margins : '0',
								allowBlank : true
							}
						],

						buttons :
						[
							{
								text : getLabel('cancel', 'Cancel'),
								handler : function()
								{
									this.up( 'form' ).getForm().reset();
									this.up( 'window' ).hide();
								}
							},
							{
								text : getLabel('proceed', 'Proceed'),
								handler : function()
								{
									var form = this.up( 'form' ).getForm();
									//TODO : This should not be hard coded index. It should be  iterated.
									var rowIndex = form.getValues().rowIndex;
									form
										.submit(
										{
											success : function( form, action )
											{
												var data = Ext.JSON.decode( action.response.responseText );
												if( null != data && null != data.d && null != data.d.profile )
												{
													if( data.d.profile.length > 0 )
													{
														var rowData = Ext.getCmp( 'gridViewMstId' ).store
															.getAt( rowIndex ).data;
														rowData.viewState = data.d.profile[ 0 ].viewState;
														rowData.identifier = data.d.profile[ 0 ].identifier;
													}
												}
											},
											failure : function( form, action )
											{
												var data = Ext.JSON.decode( action.response.responseText );

												if( null != data && null != data.d && null != data.d.profile )
												{
													if( data.d.profile.length > 0 )
													{
														var rowData = Ext.getCmp( 'gridViewMstId' ).store
															.getAt( rowIndex ).data;
														rowData.viewState = data.d.profile[ 0 ].viewState;
														rowData.identifier = data.d.profile[ 0 ].identifier;
														var form, inputField;

														form = document.createElement( 'FORM' );
														form.name = 'frmMain';
														form.id = 'frmMain';
														form.method = 'POST';
														form.appendChild( me.createFormField( 'INPUT', 'HIDDEN',
															csrfTokenName, csrfTokenValue ) );
														form.appendChild( me.createFormField( 'INPUT', 'HIDDEN',
															'txtRecordIndex', rowIndex ) );
														form.appendChild( me.createFormField( 'INPUT', 'HIDDEN',
															'viewState', data.d.profile[ 0 ].viewState ) );

														form.action = 'lmsEditLMSInterAccountParameterListMst.srvc';
														document.body.appendChild( form );
														form.submit();
													}
												}
											}
										} );
									this.up( 'window' ).hide();
								}
							}
						]
					} );

				win = Ext.widget( 'window',
				{
					title : getLabel('specialEdit', 'Special Edit'),
					closeAction : 'hide',
					width : 300,
					height : 300,
					layout : 'fit',
					resizable : false,
					modal : true,
					items : form,
					parent : this
				} );
				win.show();
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
				//grid.removeAppliedSort();
				objGroupView.refreshData();
			},
			/**
			 * This method will be used to create the Grid Model based on Group By
			 * parameter. You can pass Grid Model to reconfigureGrid method. If you
			 * passed null then the default Grid Model will used.
			 */
			doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
					newCard, oldCard) {
				var me = this;
				var objGroupView = me.getGroupView();
				var strModule = '', strUrl = null, args = null, strFilterCode = null;
				groupInfo = groupInfo || {};
				subGroupInfo = subGroupInfo || {};
				// TODO : Need to refactor for non us market
				if (groupInfo && _charCaptureGridColumnSettingAt === 'L') {
					args = {
						scope : me
					};
					strModule = subGroupInfo.groupCode
					strModule = strModule === 'all'? groupInfo.groupTypeCode+'-'+strModule : strModule;
					me.preferenceHandler.readModulePreferences(me.strPageName,strModule,me.postHandleDoHandleGroupTabChange, null, me, false);

				} else 
				me.postHandleDoHandleGroupTabChange();

			},
			postHandleDoHandleGroupTabChange : function(data, args) {
				var me = args ? args.scope : this;
				me.handleReconfigureGrid(data);
			},
			handleReconfigureGrid : function(data) {
				var me = this;
				var objGroupView = me.getGroupView();
				var objSummaryView = me.getLMSInterAccountParameterListGroupGridView(), gridModel = null, objData = null;
				me.objLocalData = Ext.decode(objSaveLocalStoragePref);
				var colModel = null, arrCols = null;
				
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
					objData = Ext.JSON.decode(data.preference)
				if (_charCaptureGridColumnSettingAt === 'L' && objData
						&& objData.gridCols) {
					arrCols = objData.gridCols;
					colModel = arrCols;//objSummaryView.getColumnModel(arrCols);
					showPager = objData.gridSetting && !Ext.isEmpty(objData.gridSetting.showPager) ? objData.gridSetting.showPager : true;
					heightOption = objData.gridSetting && !Ext.isEmpty(objData.gridSetting.heightOption) ? objData.gridSetting.heightOption : null;
					if (colModel) {
						gridModel = {
							columnModel : colModel,
							pageSize : intPageSize,
							pageNo : intPageNo,
							showPagerForced : showPager,
							heightOption : heightOption
						}
					}
				}
				if(!Ext.isEmpty(intPageSize) && !Ext.isEmpty(intPageNo)) {
					gridModel = gridModel ? gridModel : {};
					gridModel.pageSize = intPageSize;
					gridModel.pageNo = intPageNo;
					gridModel.storeModel = {sortState: sortState};
				}
				// TODO : Preferences and existing column model need to be merged
				objGroupView.reconfigureGrid(gridModel);
			},
			doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid,
					objRecord, intRecordIndex, arrSelectedRecords, jsonData) {
				var me = this;
				var objGroupView = me.getGroupView();
				var buttonMask = me.strDefaultMask;
				var blnAuthInstLevel = false;
				var maskArray = new Array(), actionMask = '', objData = null;;

				if (!Ext.isEmpty(jsonData)
						&& !Ext.isEmpty(jsonData.d.__buttonMask))
					buttonMask = jsonData.d.__buttonMask;
				var isSameUser = true;
				var isDisabled = false;
				var isSubmit = false;
				var isEnabled = false;
				maskArray.push(buttonMask);
				for (var index = 0; index < arrSelectedRecords.length; index++) {
					objData = arrSelectedRecords[index];
					maskArray.push(objData.get('__metadata').__rightsMap);
					if( objData.raw.makerId === USER )
					{
						isSameUser = false;
					}
					if( objData.raw.validFlag != 'Y' )
					{
						isEnabled = true;
					}

					if( objData.raw.validFlag == 'Y' )
					{
						isDisabled = true;
					}

					if (objData.raw.isSubmitted == 'Y'
						&& objData.raw.requestState != 8
						&& objData.raw.requestState != 4
						&& objData.raw.requestState != 5) {
						isSubmit = true;
					}
				}
				if( isEnabled && isDisabled )
				{
					isEnabled = false;
					isDisabled = false;
				}
				actionMask = doAndOperation(maskArray, 10);
				objGroupView.handleGroupActionsVisibility(actionMask);
				me.enableDisableGroupActions( actionMask, isSameUser, isEnabled, isDisabled, isSubmit );
			},
			doHandleRowActions : function(actionName, objGrid, record) {
				var me = this;
				var groupView = me.getGroupView();
				var grid = groupView.getGrid();
				var selectedRecord = grid.getSelectionModel().getSelection()[0];
				var rowIndex = grid.store.indexOf(selectedRecord);
				if( actionName === 'submit' || actionName === 'accept' || actionName === 'enable'
					|| actionName === 'disable' || actionName === 'reject' || actionName === 'discard' )
					me.doHandleGroupActions(actionName, grid, [record], 'rowAction');
				else if( actionName === 'btnHistory' )
				{
					var recHistory = record.get( 'history' );
					if( !Ext.isEmpty( recHistory ) && !Ext.isEmpty( recHistory.__deferred.uri ) )
					{
						me.showHistory( record.get( 'profileName' ), record.get( 'history' ).__deferred.uri, record
							.get( 'identifier' ) );
					}
				}
				else if( actionName === 'btnView' )
				{
					me.submitExtForm( 'viewLMSInterAccountParameterListMst.srvc', record, rowIndex );
				}
				else if( actionName === 'btnEdit' )
				{
					me.submitExtForm( 'lmsEditLMSInterAccountParameterListMst.srvc', record, rowIndex );
				}
				else if( actionName === 'btnSpecialEdit' )
				{
					me.showSpecialEditWindow( record, rowIndex );
				}
			},
			doHandleGroupActions : function(strAction, grid, arrSelectedRecords,
							strActionType) {
				var me = this;
				var strUrl = Ext.String.format( 'lmsLMSInterAccountParameterListMst/{0}.srvc', strAction );
				if( strAction === 'reject' )
				{
					this.showRejectVerifyPopUp( strAction, strUrl, arrSelectedRecords );
				}
				else
				{
					this.preHandleGroupActions(strUrl, '', arrSelectedRecords);
				}
			},
			/*Page setting handling starts here*/
			showPageSettingPopup : function(strInvokedFrom) {
				var me = this, objData = {}, objGroupView = me.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting;
				var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeTxn,strTitle = null;

				me.pageSettingPopup = null;

				if (!Ext.isEmpty(objLMSInterAccParamtPref)) {
					objPrefData = Ext.decode(objLMSInterAccParamtPref);
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
							: (LMS_GENERIC_COLUMN_MODEL || '[]');

					if (!Ext.isEmpty(objGeneralSetting)) {
						objGroupByVal = objGeneralSetting.defaultGroupByCode;
						objDefaultFilterVal = objGeneralSetting.defaultFilterCode;
					}
					if (!Ext.isEmpty(objGridSetting)) {
						objGridSizeVal = objGridSetting.defaultGridSize;
						objRowPerPageVal = objGridSetting.defaultRowPerPage;
					}
				}

				objData["groupByData"] = objGroupView
						? objGroupView.cfgGroupByData
						: [];
				objData["filterUrl"] = 'services/userfilterslist/lmsIntAccParamFilter';
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
							cfgInvokedFrom : strInvokedFrom
						});
				me.pageSettingPopup.show();
				me.pageSettingPopup.center();
			},
			handleClearLocalPrefernces : function(){
				var me = this,args = {},strLocalPrefPageName = me.strPageName+'_TempPref';				
				me.preferenceHandler.clearPagePreferences(strLocalPrefPageName, null,
						me.postHandleClearLocalPreference, args, me, false);
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
			postHandlePageGridSetting : function(data, args, isSuccess) {
				if (isSuccess === 'Y') {
					var me = this;
					if (args && args.strInvokedFrom === 'GRID'
							&& _charCaptureGridColumnSettingAt === 'L') {
						var objGroupView = me.getGroupView(), gridModel = null;
						if (args.objPref && args.objPref.gridCols)
							gridModel = {
								columnModel : args.objPref.gridCols
							}
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
				} else
				{
					me.handleClearLocalPrefernces();
					me.preferenceHandler.clearPagePreferences(me.strPageName, arrPref,
							me.postHandleRestorePageSetting, null, me, false);
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
			handleClearSettings:function(){
				var me=this;
				var lmsInterAccountParameterListFilterView = me.getLmsInterAccountParameterListFilterView();
				if(entity_type === '0'){
					var clientComboBox = me.getLmsInterAccountParameterListFilterView()
							.down('AutoCompleter[itemId="clientCodeItemId"]');
					me.clientFilterDesc = 'all';
					me.clientFilterVal = 'all';
					if(!Ext.isEmpty(clientComboBox))
						clientComboBox.setValue('');
				} else if(entity_type === '1') {
					var clientComboBox = me.getLmsInterAccountParameterListFilterView()
							.down('combo[itemId="clientCombo]');
					if(!Ext.isEmpty(clientComboBox))
						clientComboBox.reset();
					me.clientFilterDesc = 'all';
					me.clientFilterVal = 'all';
				}
				
				if(multipleSellersAvailable == true  && entity_type === '0'){
					var sellercomboObj = me.getLmsInterAccountParameterListFilterView()
						.down('combo[itemId="clientCodeItemId]');
					if(!Ext.isEmpty(sellercomboObj))
						sellercomboObj.setValue('');
					me.sellerFilterVal = 'all';
					me.sellerFilterDesc = 'all';
				}
				if(!Ext.isEmpty(lmsInterAccountParameterListFilterView)){
				var agreementCodeFltId = lmsInterAccountParameterListFilterView
						.down('combobox[itemId=agreementCodeItemId]');

				var fromAccountNoFltId = lmsInterAccountParameterListFilterView
						.down('combobox[itemId=fromAccountItemId]');
				
				var toAccountNoFltId = lmsInterAccountParameterListFilterView
						.down('combobox[itemId=toAccountItemId]');
				
				/*if(isClientUser()){
					var clientCombo = lmsInterAccountParameterListFilterView.down('combobox[itemId=clientCombo]');
					me.clientFilterVal = '';
					me.clientFilterDesc = 'all';
					clientCombo.setValue(me.clientFilterDesc);
				}else{*/
					lmsInterAccountParameterListFilterView.down('AutoCompleter[itemId=clientCodeItemId]').setValue("");
					selectedFilterClientDesc = "";
					selectedFilterClient = "";
				//}
				agreementCodeFltId.setValue("");
				fromAccountNoFltId.setValue("");
				toAccountNoFltId.setValue("");	
				
				
				me.clientFilterDesc='';
				me.clientFilterVal='';
				me.fromAccFilterVal = '';
				me.fromAccFilterDesc = '';
				me.toAccFilterVal = '';
				me.toAccFilterDesc = '';
				if(_availableClients>1)
					$("#summaryClientFilterSpan").text('All Companies');
				$("#summaryClientFilter").val('');		
				me.filterData=[];
				me.refreshData();
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
				var lmsInterAccountParameterListFilterView = me.getLmsInterAccountParameterListFilterView();
				if(!Ext.isEmpty(objData))
					strFieldName = objData.paramName || objData.field;
				
				if(strFieldName === 'sellerId'){
					if(multipleSellersAvailable == true  && entity_type === '0'){
						var sellercomboObj = me.getLmsInterAccountParameterListFilterView()
							.down('combo[itemId="entitledSellerIdItemId]');
						if(!Ext.isEmpty(sellercomboObj))
							sellercomboObj.setValue('');
						me.sellerFilterVal = 'all';
						me.sellerFilterDesc = 'all';
					}
				}
				if (strFieldName ==='agreementCode' && !Ext.isEmpty(me.getAgreementCodeItemIdAuto())) {
					me.getAgreementCodeItemIdAuto().setValue('');
				}
				if (strFieldName ==='fromAccountId' && !Ext.isEmpty(me.getFromAccountItemIdAuto())) {
					me.getFromAccountItemIdAuto().setValue('');
					me.fromAccFilterVal = '';
					me.fromAccFilterDesc = '';
				}
				if (strFieldName ==='toAccountId' && !Ext.isEmpty(me.getToAccountItemIdAuto())) {
					me.getToAccountItemIdAuto().setValue('');
					me.toAccFilterVal = '';
					me.toAccFilterDesc = '';
				}
				if(strFieldName === 'clientCode'){			
					/*if(isClientUser()){
						var clientCombo = lmsInterAccountParameterListFilterView.down('combobox[itemId=clientCombo]');
						clientCombo.setValue("");
						me.clientFilterVal = "";
						me.clientFilterDesc = "";	
					}else{*/
						lmsInterAccountParameterListFilterView.down('AutoCompleter[itemId=clientCodeItemId]').setValue("");
						selectedFilterClientDesc = "";
						selectedFilterClient = "";
						me.clientFilterVal = '';
						me.clientFilterDesc = '';
					//}
				}
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
				} else {
				}
			}			
		} );
