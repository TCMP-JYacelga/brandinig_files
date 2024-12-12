Ext.define('GCP.controller.ClientSetupController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.ux.gcp.PreferencesHandler','Ext.ux.gcp.PageSettingPopUp'],
	views : ['GCP.view.ClientSetupView', 'GCP.view.ClientSetupGridView',
			'GCP.view.CopyByClientPopupView', 'GCP.view.HistoryPopup'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'clientSetupView',
				selector : 'clientSetupView'
			}, 
			{
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
			},{
				ref : 'createNewToolBar',
				selector : 'clientSetupView clientSetupGridView toolbar[itemId="btnCreateNewToolBar"]'
			}, {
				ref : 'specificFilterPanel',
				selector : 'clientSetupView clientSetupFilterView panel[itemId="specificFilter"]'
			}, {
				ref : 'clientSetupGridView',
				selector : 'clientSetupView clientSetupGridView'
			}, {
				ref : 'clientSetupDtlView',
				selector : 'clientSetupView clientSetupGridView panel[itemId="clientSetupDtlView"]'
			}, {
				ref : 'gridHeader',
				selector : 'clientSetupView clientSetupGridView panel[itemId="clientSetupDtlView"] container[itemId="gridHeader"]'
			}, {
				ref : 'clientSetupGrid',
				selector : 'clientSetupView clientSetupGridView grid[itemId="gridViewMstId"]'
			}, {
				ref : 'searchTextInput',
				selector : 'clientSetupGridView textfield[itemId="searchTextField"]'
			}, {
				ref : 'matchCriteria',
				selector : 'clientSetupGridView radiogroup[itemId="matchCriteria"]'
			}, {
				ref : 'grid',
				selector : 'clientSetupGridView smartgrid'
			}, {
				ref : "corporationFilter",
				selector : 'clientSetupView clientSetupFilterView textfield[itemId="corporationFilter"]'
			}, {
				ref : "clientFilter",
				selector : 'clientSetupView clientSetupFilterView textfield[itemId="clientFilter"]'
			}, {
				ref : 'groupActionBar',
				selector : 'clientSetupView clientSetupGridView clientGroupActionBarView'
			}, {
				ref : 'withHeaderCheckbox',
				selector : 'clientSetupView clientSetupTitleView menuitem[itemId="withHeaderId"]'
			}, {
				ref : 'brandingPkgListLink',
				selector : 'clientSetupView toolbar[itemId="btnActionToolBar"] button[itemId="btnBrandingPkgList"]'
			}, {
				ref : 'clientListLink',
				selector : 'clientSetupView toolbar[itemId="btnActionToolBar"] button[itemId="btnClientList"]'
			}, {
				ref : 'clientInlineBtn',
				selector : 'clientSetupView clientSetupFilterView button[itemId="clientBtn"]'
			},/*{
				ref : 'clientNamesFilterAuto',
				selector : 'clientSetupFilterView AutoCompleter[itemId=clientAutoCompleter]'
			},*/ {
				ref : 'payerCodeFilterAuto',
				selector : 'clientSetupFilterView AutoCompleter[itemId=payerCodeFltId]'
			}, {
				ref : 'payerNameFilterAuto',
				selector : 'clientSetupFilterView AutoCompleter[itemId=payerNameFltId]'
			},{
				ref : 'payerAcctFilterAuto',
				selector : 'clientSetupFilterView AutoCompleter[itemId=payerAcctFltId]'
			}

	],
	config : {
		selectedMst : 'client',
		clientListCount : 0,
		clientCode:'all',
		clientDesc: getLabel('allCompanies', 'All companies'),
		brandingPkgListCount : 0,
		filterData : [],
		sellerOfSelectedClient : '',
		copyByClicked : '',
		strDefaultMask : '000000000000000000',
		filterPayerCode:'payerCode',
		filterAccountNo :'payerName',
		filterPayerAccountNo :'payerAcctNmbr',
		filterStatusDescription : 'status',
		reportGridOrder : null,		
		strPageName:'drawerMst',
		strLocalStorageKey : 'page_drawerMst',
		preferenceHandler : null,
		pageSettingPopup : null,
		statusFilterVal : 'all',
		statusFilterDesc : 'All',
		isAccountNo : false,
		isReceiverName : false,
		isShortCode:false,
		oldAccountNo :'',
		oldReceiverName:'',
		oldShortCode:'',
		objLocalData : null
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		me.firstLoad = true;
		me.clientCode =$("#summaryClientFilterSpan").val(),
		me.clientDesc = $("#summaryClientFilterSpan").text(),
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		
		if(objSaveLocalStoragePref){
			me.objLocalData = Ext.decode(objSaveLocalStoragePref);
			objQuickPref = me.objLocalData && me.objLocalData.d.preferences
								&& me.objLocalData.d.preferences.tempPref 
								&& me.objLocalData.d.preferences.tempPref.quickFilterJson ? me.objLocalData.d.preferences.tempPref.quickFilterJson : {};
			
			me.filterData = (!Ext.isEmpty(objQuickPref)) ? objQuickPref : [];
			
		}
		
//		me.updateConfig();
		//objLocalStoragePref = me.doGetSavedState();
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
					$(document).on('handleClientChangeInQuickFilter',function(event,isSessionClientFilter) {
						me.handleClientChangeInQuickFilter(isSessionClientFilter);
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);	
		});
        $(document).on("handleAddNewUserCategory",function(){
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
		$(document).on('performPageSettings', function(event, actionName) {
			me.showPageSettingPopup('PAGE');
		});
		me.control({
			
			'clientSetupView clientSetupTitleView' : {
				'performReportAction' : function(btn, opts) {
					this.handleReportAction(btn, opts);
				}
			},
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
					me.setFilterRetainedValues();
				},
				'handleClientChange' : function(strClientCode,
							strClientDescr, strSellerId){
					me.sellerOfSelectedClient = strSellerId;
					me.clientCode = strClientCode;
					me.clientDesc = strClientDescr;	
                    var objDetailFilterPanel = me.getClientSetupFilterView();			
					me.resetAllFilters();
					me.changeFilterParams();
					me.setDataForFilter();
					me.applyFilter();
				}
			},
			'clientSetupFilterView AutoCompleter[itemId=payerCodeFltId]' : {
				select : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.disablePreferencesButton("clearPrefMenuBtn",false);	
					me.isShortCode = true;
				},
				change : function(combo, newValue, oldValue, eOpts) {
					if (newValue == '' || null == newValue) {						
						me.setDataForFilter();
						me.applyFilter();
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);
						me.isShortCode = true;
						me.oldShortCode = "";
					}
				},
				keyup : function(combo, e, eOpts){
					me.isShortCode = false;
				},
				blur : function(combo, record){
					if (me.isShortCode == false && me.oldShortCode != combo.getRawValue()){
						me.applySeekFilter();
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);	
					}
					me.oldShortCode = combo.getRawValue();	
				}
			},
			'clientSetupFilterView AutoCompleter[itemId=payerNameFltId]' : {
				select : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.disablePreferencesButton("clearPrefMenuBtn",false);	
					me.isReceiverName = true;
				},
				change : function(combo, newValue, oldValue, eOpts) {
					if (newValue == '' || null == newValue) {
						me.setDataForFilter();
						me.applyFilter();
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);	
						me.isReceiverName = true;
						me.oldReceiverName = "";
					}
				},
				keyup : function(combo, e, eOpts){
					me.isReceiverName = false;
				},
				blur : function(combo, record){
					if (me.isReceiverName == false && me.oldReceiverName != combo.getRawValue()){
						me.applySeekFilter();
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);	
					}
					me.oldReceiverName = combo.getRawValue();	
				}
			},
			'clientSetupFilterView AutoCompleter[itemId=payerAcctFltId]' : {
				select : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.disablePreferencesButton("clearPrefMenuBtn",false);	
					me.isAccountNo = true;
				},
				change : function(combo, newValue, oldValue, eOpts) {
					me.oldAccountNo = oldValue;
					if (newValue == '' || null == newValue) {
						me.setDataForFilter();
						me.applyFilter();
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);	
						me.isAccountNo = true;
						me.oldAccountNo = "";
					}
				},
				keyup : function(combo, e, eOpts){
					me.isAccountNo = false;
				},
				blur : function(combo, record){
					if (me.isAccountNo == false && me.oldAccountNo != combo.getRawValue()){
						me.applySeekFilter();
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);		
					}
					me.oldAccountNo = combo.getRawValue();
				}
			},
			'clientSetupFilterView combobox[itemId=statusFltId]' : {
				select : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.disablePreferencesButton("clearPrefMenuBtn",false);	
				},
				change : function(combo, newValue, oldValue, eOpts) {
					if (newValue == '' || null == newValue) {
						me.setDataForFilter();
						me.applyFilter();
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);	
					}
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
//					me.doHandleStateChange();
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
				'gridSettingClick' : function() {
					     me.showPageSettingPopup('GRID');
				 },
				 'render' : function(){
					 me.firstTime = true;
					 me.applyPreferences();
				 }
			},
			'clientSetupView button[itemId="btnCreateClient"]' : {
				click : function() {
					me.handleClientEntryAction(true);
				}
			},
			'filterView button[itemId="clearSettingsButton"]' : {
				'click' : function() {
					me.handleClearSettings();
				}
			},
			'filterView' : {
						'appliedFilterDelete' : function(btn) {
							me.handleAppliedFilterDelete(btn);
						}
					},
			'pageSettingPopUp' : {
				'applyPageSetting' : function(popup, data, strInvokedFrom) {
					me.applyPageSetting(data,strInvokedFrom);
				},
				'savePageSetting' : function(popup, data,
						strInvokedFrom) {
					me.savePageSetting(data, strInvokedFrom);
				},
				'restorePageSetting' : function(popup, data, strInvokedFrom) {
					me.restorePageSetting(data, strInvokedFrom);
				}
			}
		});
	},
	showClientList : function(btn, opts) {
		var me = this;
		me.selectedMst = 'client';
		me.handleSmartGridConfig();
	},
	applySeekFilter : function() {
		var me = this;
		me.setDataForFilter();
		me.filterApplied = 'Q';
		me.refreshData();
	},
	resetAllFilters : function() {
		var me = this;
		var clientSetupFilterView = me.getClientSetupFilterView();
		var payerCodeFltId = clientSetupFilterView
				.down('combobox[itemId=payerCodeFltId]');
		var payerNameFltId = clientSetupFilterView
				.down('combobox[itemId=payerNameFltId]');
		var payerAcctFltId = clientSetupFilterView
				.down('combobox[itemId=payerAcctFltId]');
		var clientFld = clientSetupFilterView
				.down('combobox[itemId=clientCombo]');
		var companyFld = clientSetupFilterView
				.down('combobox[itemId=clientAutoCompleter]');
		if (!Ext.isEmpty(payerCodeFltId.getValue())) {
			payerCodeFltId.setValue('');
		}
		if (!Ext.isEmpty(payerNameFltId.getValue())) {
			payerNameFltId.setValue('');
		}
		if (!Ext.isEmpty(payerNameFltId.getValue())) {
			payerNameFltId.setValue('');
		}
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
					var reg = new RegExp(/[\(\)]/g);
					var objValue = filterData[index].paramValue1;
					var objArray = objValue.split(',');
					if (objArray.length > 0) {
						if (objArray[0] != 'All') {
							if (isFilterApplied) {
								if (filterData[index].detailFilter
										&& filterData[index].detailFilter === 'Y') {
									strDetailUrl = strDetailUrl + ' and ';
								} else {
									strTemp = strTemp;
								}
							} else {
								isFilterApplied = true;
							}

							if (filterData[index].detailFilter
									&& filterData[index].detailFilter === 'Y') {
								strDetailUrl = strDetailUrl + '(';
							} else {
								strTemp = strTemp + '(';
							}
							for (var i = 0; i < objArray.length; i++) {
								if (filterData[index].detailFilter
										&& filterData[index].detailFilter === 'Y') {
									
										strDetailUrl = strDetailUrl
										+ filterData[index].paramName
										+ ' eq ';
										strDetailUrl = strDetailUrl + '\''
												+ objArray[i] + '\'';
										if (i != objArray.length - 1)
											strDetailUrl = strDetailUrl + ' or ';
								} else {
									if( objArray[i].length > 2 )
									{
										strTemp = strTemp + '(';
										var arrayList = objArray[i].split('.');
										for (var x = 0; x < arrayList.length; x++) {
											
											if( x == 0)
											{
												strTemp = strTemp
												+ filterData[index].paramName
												+ ' eq ';
											}
											else
											{
												strTemp = strTemp
												+ 'payerValidFlag'
												+ ' eq ';		
											}
											strTemp = strTemp + '\''
													+ arrayList[x] + '\'';
											if (x != arrayList.length - 1)
											{
												strTemp = strTemp + ' and ';
											}
											else
											{
												strTemp = strTemp + ')';
											}
										}
										
										if (i != objArray.length - 1)
										{
											strTemp = strTemp + ' or ';
										}
										
									}
									else
									{
										strTemp = strTemp
										+ filterData[index].paramName
										+ ' eq ';
										strTemp = strTemp + '\'' + objArray[i]
												+ '\'';
										if (i != objArray.length - 1)
											strTemp = strTemp + ' or ';										
											}
								}
							}
							if (filterData[index].detailFilter
									&& filterData[index].detailFilter === 'Y') {
								strDetailUrl = strDetailUrl + ')';
							} else {
								strTemp = strTemp + ')';
							}
						}
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
	showHistory : function(isClient, clientName, url, id) {
		var historyPopup=Ext.create('GCP.view.HistoryPopup', {
					isClient : isClient,
					historyUrl : url,
					identifier : id,
					clientName : clientName
				}).show();
				historyPopup.center();
				
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

	handleGroupActions : function(btn, record) {
		var me = this;
		var strAction = !Ext.isEmpty(btn.actionName)
				? btn.actionName
				: btn.itemId;
		var strUrl = Ext.String.format('services/drawerMaster/{0}.srvc?', strAction);
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
					buttonText : {
						ok:getLabel('btn_Ok','OK'),
						cancel:getLabel('btncancel', 'Cancel')
					},
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
							url : strUrl + csrfTokenName + "=" + csrfTokenValue,
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
														+ error.errorMessage
														+ "<br/>";
											});
									if ('' != errorMessage && null != errorMessage) {
										Ext.Msg.alert("Error", errorMessage);
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
		if (colId === 'col_clientType') {
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('clientType'))
						&& 'M' == record.get('clientType')) {
					strRetValue = getLabel('corporation', 'Corporation');
				} else {
					strRetValue = getLabel('subsidiary', 'Subsidiary');
				}
			}
		} else if (colId === 'col_variance') {
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('brandingPkgName'))) {
					strRetValue = Math.floor((Math.random() * 100) + 1);
				}
			}
		} else if (colId === 'col_corporationName') {
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('clientType'))
						&& 'M' == record.get('clientType')) {
					strRetValue = record.get('clientName');
				} else {
					strRetValue = value;
				}
			}
		} else if (colId === 'col_bankPercent') {
			strRetValue = Math.floor((Math.random() * 100) + 1);
		} else if (colId === 'col_clientPercent') {
			strRetValue = Math.floor((Math.random() * 100) + 1);
		} else if (colId === 'col_copyBy') {
			strRetValue = '<a class="underlined" onclick="showClientPopup(\''
					+ record.get('brandingPkgName') + '\')">' + value + '</a>';
		} else {
			strRetValue = value;
		}

		return strRetValue;
	},
	handleClientChangeInQuickFilter : function(isSessionClientFilter) {
		var me = this;
		me.clientCode = selectedFilterClient;
		me.clientDesc = selectedFilterClientDesc;// combo.getRawValue();
		quickFilterClientValSelected = me.clientCode;
		quickFilterClientDescSelected = me.clientDesc;
		me.filterApplied = 'Q';
		me.setDataForFilter();
		if (me.clientCode === 'all') {
			me.filterApplied = 'ALL';
			me.refreshData();

		} else {
			me.applyFilter();
		}
	},
	handleClientEntryAction : function(entryType) {
		var me = this;
		var selectedClient = null;
		var clientSetupFilterView = me.getClientSetupFilterView();
		//var sellerCombo = clientSetupFilterView
		//		.down('combobox[itemId=sellerFltId]');
		//var clientCodesFltId = clientSetupFilterView
		//		.down('combobox[itemId=clientNamesFltId]');
		var selectedSeller = (!Ext.isEmpty(me.sellerOfSelectedClient)) ? me.sellerOfSelectedClient : strSellerId;//sellerCombo.getValue();
		selectedClient = me.clientCode === 'all' ? '' : me.clientCode;//clientCodesFltId.getValue();
		if(Ext.isEmpty(me.clientCode))
			selectedClient='';
		var form;
		var strUrl = 'addDrawerMaster.form';
		var errorMsg = null;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		if(!Ext.isEmpty(selectedSeller))
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'sellerCode',
					selectedSeller));

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
		var matrixTypeVal = null;
		var payerName = null, payerNameVal = null,status = null, statusVal = null,payerAcct = null, payerAcctVal = null;
		var payerCodeVal = null;
		var arrJsn = {};
		var clientSetupFilterView = me.getClientSetupFilterView();
		if(Ext.isEmpty(clientSetupFilterView)){
		  
		}else{
		var sellerCombo = clientSetupFilterView
				.down('combobox[itemId=sellerFltId]');
		var payerCodeFltId = clientSetupFilterView
				.down('combobox[itemId=payerCodeFltId]');
		var payerNameFltId = clientSetupFilterView
				.down('combobox[itemId=payerNameFltId]');
		var payerAcctFltId = clientSetupFilterView
				.down('combobox[itemId=payerAcctFltId]');
		if (!Ext.isEmpty(payerCodeFltId)
				&& !Ext.isEmpty(payerCodeFltId.getValue())) {
			payerCodeVal = payerCodeFltId.getValue();
		}
		if (!Ext.isEmpty(payerNameFltId)
				&& !Ext.isEmpty(payerNameFltId.getValue())) {
			payerName = payerNameFltId.getValue(), payerNameVal = payerName
					.trim();
		}
		if (!Ext.isEmpty(payerAcctFltId)
				&& !Ext.isEmpty(payerAcctFltId.getValue())) {
			payerAcct = payerAcctFltId.getValue(), payerAcctVal = payerAcct
					.trim();
		}
		}
		arrJsn['sellerId'] = (!Ext.isEmpty(me.sellerOfSelectedClient)) ? me.sellerOfSelectedClient : strSellerId;;
		arrJsn['clientId'] = me.clientCode;
		arrJsn['clientDesc'] = me.clientDesc;
		arrJsn['payerCode'] = payerCodeVal;
		arrJsn['payerName'] = payerNameVal;
		arrJsn['payerAcct'] = payerAcctVal;
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
							var client = '';
							var payerCode = '';
							var accountNumber = '';
							var payerAcct = '';
							var clientSetupFilterView = me.getClientSetupFilterView();
					
							var payerCodeFltId = clientSetupFilterView
									.down('combobox[itemId=payerCodeFltId]');
					
							var payerNameFltId = clientSetupFilterView
									.down('combobox[itemId=payerNameFltId]');
							var payerAcctFltId = clientSetupFilterView
									.down('combobox[itemId=payerAcctFltId]');
									
							if (!Ext.isEmpty(payerCodeFltId)
									&& !Ext.isEmpty(payerCodeFltId.getValue())) {
								payerCode =payerCodeFltId.getValue();
							}else
								payerCode = getLabel('none','None');
												
							if (!Ext.isEmpty(payerNameFltId)
									&& !Ext.isEmpty(payerNameFltId.getValue())) {
								accountNumber = payerNameFltId.getValue();
							}else
								accountNumber = getLabel('none','None');
								
							if (!Ext.isEmpty(payerAcctFltId)
									&& !Ext.isEmpty(payerAcctFltId.getValue())) {
								payerAcct = payerAcctFltId.getValue();
							}else
								payerAcct = getLabel('none','None');
									
								client = (me.clientDesc != '') ? me.clientDesc : getLabel('allcompanies', 'All Companies');
								tip.update(getLabel('grid.column.company', 'Company Name')
										+ ' : '
										+ client
										+ '<br/>'
										+ getLabel('payerCode', 'Payer Code')
										+ ' : '
										+ payerCode
										+ '<br/>'
										+ getLabel('payerName', 'Debtor Reference')
										+ ' : '
										+ accountNumber
										+ '<br/>'
										+ getLabel('payerAcctNumber', 'Payer Account')
										+ ' : '
										+ payerAcct);
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
		strUrl = 'services/generateDrawerListReport.' + strExtension;
		strUrl += '?$skip=1';
		strUrl += this.generateFilterUrl();
		var strOrderBy = me.reportGridOrder;
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
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();
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
				strSelect = '&$select=[' + colArray.toString() + ']';
		}
		strUrl = strUrl + strSelect;
		
		var  objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
		         while (arrMatches = strRegex.exec(strUrl)) {
					objParam[arrMatches[1]] = arrMatches[2];
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
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);

	},
	generateFilterUrl : function() {
		var me = this;
		var strQuickFilterUrl = '', strUrl = '';
		me.setDataForFilter();
		strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
		if (!Ext.isEmpty(strQuickFilterUrl)) {
			strUrl += '&$filter=' + strQuickFilterUrl;
		}
		return strUrl;
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
		 if (groupInfo && groupInfo.groupTypeCode){
			if (groupInfo.groupTypeCode === 'RECPAR_OPT_STATUS') {
				strModule = subGroupInfo.groupCode;
			} else {
				strModule = groupInfo.groupTypeCode
			}
			args = {
				'module' : strModule
			};
			strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-'
					+ strModule : strModule;
			me.preferenceHandler.readModulePreferences(me.strPageName,
					strModule, me.postHandleGroupTabChange, args, me, true);
		}else
			me.postHandleGroupTabChange();
	},
	postHandleGroupTabChange : function(data, args) {
		var me=this;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getClientSetupView(), objPref = null, gridModel = null, intPgSize = null,showPager = true, heightOption = null;
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
		if (data && data.preference) {
			objPref = Ext.decode(data.preference);
			arrCols = objPref.gridCols || null;
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
		objGroupView.reconfigureGrid(gridModel);
	},
     	doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter, filterData) {
		var me = this;
		var buttonMask = me.strDefaultMask;
		var objGroupView = me.getGroupView();
			
		var columns=grid.columns;
				Ext.each(columns, function(col) {
		        if(col.dataIndex=="requestStateDesc"){
		        col.sortable=false;
		        }
		});
		var arrOfParseQuickFilter = [];
		me.setDataForFilter();
		
		if(allowLocalPreference === 'Y')
			me.handleSaveLocalStorage();
			
		var intPageNo = me.objLocalData && me.objLocalData.d && me.objLocalData.d.preferences
			&& me.objLocalData.d.preferences.tempPref
			&& me.objLocalData.d.preferences.tempPref.pageNo
			? me.objLocalData.d.preferences.tempPref.pageNo
			: null, intOldPgNo = oldPgNo , intNewPgNo = newPgNo;
		
		if(!Ext.isEmpty(intPageNo) && me.firstLoad)	{
			intNewPgNo = intPageNo;
			intOldPgNo = intPageNo;
		}
		
		me.firstLoad = false;
		var strUrl = grid.generateUrl(url, pgSize, intNewPgNo, intOldPgNo, sorter);
		strUrl += me.getFilterUrl(subGroupInfo, groupInfo);
		me.reportGridOrder = strUrl;
		me.disableActions(true);
		me.enableDisableGroupActions('000000000000000000');
		grid.loadGridData(strUrl, null, null, false);
		if (!Ext.isEmpty(me.filterData)) {
			if (!Ext.isEmpty(me.filterData) && me.filterData.length >= 1) {
				arrOfParseQuickFilter = generateFilterArray(me.filterData);
			}
		}
		if (arrOfParseQuickFilter) {
			me.getFilterView().updateFilterInfo(arrOfParseQuickFilter);
		}
		grid.on('cellclick', function(tableView, td, cellIndex, record, tr, rowIndex, e) {
			var clickedColumn = tableView.getGridColumns()[cellIndex];
			var columnType = clickedColumn.colType;
			if(Ext.isEmpty(columnType)) {
				var containsCheckboxCss = (clickedColumn.cls.indexOf('x-column-header-checkbox') > -1)
				columnType = containsCheckboxCss ? 'checkboxColumn' : '';
			}
			me.handleGridRowDoubleClick(record, grid, columnType);
		});
	},
	handleGridRowDoubleClick : function(record, grid, columnType) {
		var me = this;
		var columnModel = null;
		var columnAction = null;
		if(columnType !== 'actioncontent' && columnType !== 'checkboxColumn') {
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
					me.showHistory(true, record.get('clientDesc'), record
									.get('history').__deferred.uri, record
									.get('identifier'));
				}
			}
	} else if (actionName === 'btnView' || actionName === 'btnEdit') {
		if (actionName === 'btnView') {
			me.submitExtForm('viewDrawerMaster.form', record, rowIndex);
		} else if (actionName === 'btnEdit') {
			me.submitExtForm('editDrawerMaster.form', record, rowIndex);
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

		form.action = strUrl;
		me.setFilterParameters(form);
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
		var strUrl = Ext.String.format('services/drawerMaster/{0}.srvc?', strAction);
		if (strAction === 'reject') {
			me.showRejectPopUp(strAction, strUrl, grid, arrSelectedRecords);

		} else {
			me.preHandleGroupActions(strUrl, '',grid,arrSelectedRecords);
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
					buttonText : {
						ok:getLabel('btn_Ok','OK'),
						cancel:getLabel('btncancel', 'Cancel')
					},
					multiline : 4,
					cls:'t7-popup',
					width: 355,
					height : 270,
					bodyPadding : 0,
					fn : function(btn, text) {
							if (btn == 'ok') {
								if(Ext.isEmpty(text)){
									Ext.Msg.alert(getLabel('errorTitle', 'Error'), getLabel('Error', 'Reject Remarks cannot be blank'));
								}else{
								me.preHandleGroupActions(strActionUrl, text,grid,record);
							}
						}
					}
				});
		msgbox.textArea.enforceMaxLength = true;
		msgbox.textArea.inputEl.set({
			maxLength : 255
		});
	},
	setDataForFilter : function() {
		var me = this;
		//me.getSearchTextInput().setValue('');
		this.filterData = this.getFilterQueryJson();
	},
	getFilterQueryJson : function() {
		var me = this;
		var sellerVal = null, payerCodeVal = null, payerNameVal = null, payerAcctVal = null, clientCodeVal = null, subCategoryVal = null, jsonArray = [];
		var clientParamName = null, clientNameOperator = null;
		var clientNamesFltId = null;
		var clientSetupFilterView = me.getClientSetupFilterView();
		if (Ext.isEmpty(clientSetupFilterView)) {
			payerCodeVal = payerCode;
			payerNameVal = payerName;
			payerAcctVal = payerAcct;
			if (undefined != strClientDescription && strClientDescription != '') {
				me.clientDesc = strClientDescription;
			}
		} else {
			var payerCodeFltId = clientSetupFilterView
					.down('combobox[itemId=payerCodeFltId]');
			var payerNameFltId = clientSetupFilterView
					.down('combobox[itemId=payerNameFltId]');
			var payerAcctFltId = clientSetupFilterView
					.down('combobox[itemId=payerAcctFltId]');
			if (!Ext.isEmpty(payerCodeFltId)
					&& !Ext.isEmpty(payerCodeFltId.getValue())) {
				payerCode = payerCodeFltId.getValue(), payerCodeVal = payerCode
						.trim();
			}

			if (!Ext.isEmpty(payerNameFltId)
					&& !Ext.isEmpty(payerNameFltId.getValue())) {
				payerName = payerNameFltId.getValue();
				payerNameVal = payerName.trim();
			}
			if (!Ext.isEmpty(payerAcctFltId)
					&& !Ext.isEmpty(payerAcctFltId.getValue())) {
				payerAcct = payerAcctFltId.getValue();
				payerAcctVal = payerAcct.trim();
			}
			if (!Ext.isEmpty(payerCodeVal)) {
				jsonArray.push({
							paramName : me.filterPayerCode,
							paramValue1 : encodeURIComponent(payerCodeVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
							operatorValue : 'lk',
							paramFieldLable : getLabel('payerCode',
									'Payer Code'),
							dataType : 'S',
							displayType : 5,
							displayValue1 : payerCodeVal
						});
			}
			if (!Ext.isEmpty(payerNameVal)) {
				jsonArray.push({
							paramName : me.filterAccountNo,
							paramValue1 : encodeURIComponent(payerNameVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
							paramFieldLable : getLabel('payerName',
									'Payer Name'),
							operatorValue : 'lk',
							dataType : 'S',
							displayType : 5,
							displayValue1 : payerNameVal
						});
			}
			if (!Ext.isEmpty(payerAcctVal)) {
				jsonArray.push({
							paramName : me.filterPayerAccountNo,
							paramValue1 : encodeURIComponent(payerAcctVal.replace(new RegExp("'", 'g'), "\''")),
							paramFieldLable : getLabel('payerAcctNumber',
									'Payer Account'),
							operatorValue : 'lk',
							dataType : 'S',
							displayType : 5,
							displayValue1:payerAcctVal
						});
			}
			if (!Ext.isEmpty(me.clientDesc) && !Ext.isEmpty(me.clientCode)
					&& me.clientCode != 'all') {
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
								paramValue1 : encodeURIComponent(clientCodeVal.replace(new RegExp("'", 'g'), "\''")),
								operatorValue : clientNameOperator,
								paramFieldLable : getLabel('lblcompany',
										'Company Name'),
								dataType : 'S',
								displayType : 5,
								displayValue1 : me.clientDesc
							});
				}
			}
		}
		return jsonArray;
	},
	setFilterRetainedValues : function() {
		var me = this;
		var clientSetupFilterView = me.getClientSetupFilterView();
		if(!Ext.isEmpty(clientSetupFilterView)){
		// set Mandate Party Name Filter Value
		var payerCodeFltId = clientSetupFilterView
				.down('combobox[itemId=payerCodeFltId]');
		payerCodeFltId.setValue(payerCode);

		// set Ordering Party ID Filter Value
		var payerNameFltId = clientSetupFilterView
				.down('combobox[itemId=payerNameFltId]');
		payerNameFltId.setValue(payerName);
		
		var payerAcctFltId = clientSetupFilterView
				.down('combobox[itemId=payerAcctFltId]');
		payerAcctFltId.setValue(payerAcct);
		
		if (userType == '0') {
			clientCodesFltId = clientSetupFilterView
				.down('combobox[itemId=clientAutoCompleter]');
			if(!Ext.isEmpty(me.clientCode)){
				clientCodesFltId.setValue(me.clientCode);
				clientCodesFltId.setRawValue(me.clientDesc);
			} else {
				me.clientCode = 'all';
			}
		} else {
			clientCodesFltId = clientSetupFilterView
				.down('combo[itemId="clientCombo"]');
			if(!Ext.isEmpty(me.clientCode)){
				clientCodesFltId.setValue(me.clientDesc);
			} else {
				clientCodesFltId.setValue(getLabel('allCompanies', 'All Companies'));
				me.clientCode = 'all';
			}
		}
		me.changeFilterParams();
	   }

	},
	changeFilterParams : function() {
		var me = this;
		var clientSetupFilterView = me.getClientSetupFilterView();
		var payerCodeFltAuto = clientSetupFilterView
				.down('AutoCompleter[itemId=payerCodeFltId]');
		var accNoFltAuto = clientSetupFilterView
				.down('AutoCompleter[itemId=payerNameFltId]');
		var payerAcctNoFltAuto = clientSetupFilterView
				.down('AutoCompleter[itemId=payerAcctFltId]');		
		if (!Ext.isEmpty(payerCodeFltAuto)) {
			payerCodeFltAuto.cfgExtraParams = new Array();
		}
		if (!Ext.isEmpty(accNoFltAuto)) {
			accNoFltAuto.cfgExtraParams = new Array();
		}
		if (!Ext.isEmpty(payerAcctNoFltAuto)) {
			payerAcctNoFltAuto.cfgExtraParams = new Array();
		}
		
			if (!Ext.isEmpty(payerCodeFltAuto) && !Ext.isEmpty(strSellerId)) {
				payerCodeFltAuto.cfgExtraParams.push({
							key : '$sellerId',
							value : strSellerId
						});
			}
			if (!Ext.isEmpty(accNoFltAuto)  && !Ext.isEmpty(strSellerId)) {
				accNoFltAuto.cfgExtraParams.push({
							key : '$sellerId',
							value : strSellerId
						});
			}
			if (!Ext.isEmpty(payerAcctNoFltAuto)  && !Ext.isEmpty(strSellerId)) {
				payerAcctNoFltAuto.cfgExtraParams.push({
							key : '$sellerId',
							value : strSellerId
						});
			}
			if (!Ext.isEmpty(payerCodeFltAuto) && me.clientCode!= 'all' && me.clientCode!= null) {
				payerCodeFltAuto.cfgExtraParams.push({
							key : '$clientId',
							value : me.clientCode
						});
			}
			if (!Ext.isEmpty(accNoFltAuto) && me.clientCode!= 'all' && me.clientCode!= null) {
				accNoFltAuto.cfgExtraParams.push({
							key : '$clientId',
							value : me.clientCode
						});
			}
			if (!Ext.isEmpty(payerAcctNoFltAuto) && me.clientCode!= 'all' && me.clientCode!= null) {
				payerAcctNoFltAuto.cfgExtraParams.push({
							key : '$clientId',
							value : me.clientCode
						});
			}
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
		if (grid) {
			/*if (!Ext.isEmpty(me.advSortByData)) {
				appliedSortByJson = me.getSortByJsonForSmartGrid();
				grid.removeAppliedSort();
				grid.applySort(appliedSortByJson);
			} else {
				grid.removeAppliedSort();
			}*/
//			grid.removeAppliedSort();
		}
		objGroupView.refreshData();
	},
     handleClearSettings : function() {
		var me = this;
		var clientSetupFilterView = me.getClientSetupFilterView();
		if (!Ext.isEmpty(clientSetupFilterView)) {
			var payerCodeFltId = clientSetupFilterView
					.down('combobox[itemId=payerCodeFltId]');

			var payerNameFltId = clientSetupFilterView
					.down('combobox[itemId=payerNameFltId]');
			var payerAcctFltId = clientSetupFilterView
					.down('combobox[itemId=payerAcctFltId]');
			var clientFld = clientSetupFilterView
					.down('combobox[itemId=clientCombo]');
			var companyFld = clientSetupFilterView
					.down('combobox[itemId=clientAutoCompleter]');
			payerCodeFltId.setValue("");
			payerNameFltId.setValue("");
			payerAcctFltId.setValue("");
			/*if (null != companyFld)
				companyFld.setValue("");
			if (null != clientFld)
				clientFld.setValue("");*/
			if (isClientUser()) {
				me.clientCode = 'all';
				me.clientDesc = getLabel('allCompanies', 'All companies');
				clientFld.setValue(me.clientCode);
				selectedFilterClientDesc = "";
				selectedFilterClient = "";
			} else {
				companyFld.setValue("");
				me.clientCode = '';
				selectedFilterClientDesc = "";
				selectedFilterClient = "";
			}
			me.filterData = [];
			me.refreshData();
		}
	},
	/*Preference Handling:start*/
    updateConfig : function() {
		var me = this, arrJsn = new Array();
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		if (!Ext.isEmpty(objSaveLocalStoragePref)) {
			var objLocalJsonData = Ext.decode(objSaveLocalStoragePref);
			if(!Ext.isEmpty(objLocalJsonData) && (!Ext.isEmpty(objLocalJsonData.d.preferences)) && (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref))
					&& (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.quickFilterJson))){
				var data = objLocalJsonData.d.preferences.tempPref.quickFilterJson;
				for(var i = 0; i < data.length; i++){
					if(data[i].paramName === "payerCode")
						payerCode = data[i].paramValue1;
					else if(data[i].paramName === "payerName")
						payerName = data[i].displayValue1;
					else if(data[i].paramName === "payerAcctNmbr")
						payerAcct = data[i].paramValue1;
					else if (data[i].paramName === "clientId") {
						me.clientCode = data[i].paramValue1;
						me.clientDesc = data[i].displayValue1;
					}
				}
	
			}
		}
		if (userType == '1') {
			$("#summaryClientFilterSpan").text(me.clientDesc);
			changeClientAndRefreshGrid(me.clientCode, me.clientDesc)
		} else if (userType == '0') {
			$("#summaryClientFilter").val(me.clientDesc);
			changeClientAndRefreshGrid(me.clientCode, me.clientDesc)
		}
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
		var payerCodeVal = null, payerNameVal = null, payerAcctVal = null;
		var clientSetupFilterView = me.getClientSetupFilterView();
		
		if(Ext.isEmpty(clientSetupFilterView)){
			payerCodeVal=payerCode;
			payerNameVal=payerName;
			payerAcctVal=payerAcct;
		}else{
			var payerCodeFltId = clientSetupFilterView
					.down('combobox[itemId=payerCodeFltId]');
			var payerNameFltId = clientSetupFilterView.down('combobox[itemId=payerNameFltId]');
			var payerAcctFltId = clientSetupFilterView.down('combobox[itemId=payerAcctFltId]');
		}
		if (!Ext.isEmpty(payerCodeFltId)
					&& !Ext.isEmpty(payerCodeFltId.getValue())) {
				payerCode = payerCodeFltId.getValue(), payerCodeVal = payerCode
						.trim();
		}
		if (!Ext.isEmpty(payerNameFltId)
				&& !Ext.isEmpty(payerNameFltId.getValue())) {
			payerName = payerNameFltId.getValue();
			payerNameVal = payerName.trim();
		}
		if (!Ext.isEmpty(payerAcctFltId)
				&& !Ext.isEmpty(payerAcctFltId.getValue())) {
			payerAcct = payerAcctFltId.getValue();
			payerAcctVal = payerAcct.trim();
		}
		objQuickFilterPref.payerCodeVal =payerCodeVal;
		objQuickFilterPref.payerNameVal=payerNameVal;
		objQuickFilterPref.payerAcctVal=payerAcctVal;
		objFilterPref.filterSelectedClientCode = me.clientCode;
		objFilterPref.filterSelectedClientDesc = me.clientDesc;
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
	},
	/*Preference Handling:end*/
	
	disableActions : function(canDisable) {
		if (canDisable)
			$('.canDisable').addClass('button-grey-effect');
		else
			$('.canDisable').removeClass('button-grey-effect');
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
		var me = this, args = {};
		if (isSuccess === 'N') {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		} else {
			me.preferenceHandler.readPagePreferences(me.strPageName, me.update,
					args, me, false);
		}
	},
	updateobjMandateMstPref : function(data) {
		objMandateMstPref = Ext.encode(data);
	},
	applyPageSetting : function(arrPref,strInvokedFrom) {
		var me = this,args = {};
		if (!Ext.isEmpty(arrPref)) {
			
			if (strInvokedFrom === 'GRID'
					&& _charCaptureGridColumnSettingAt === 'L') {
				/**
				 * This handling is required for non-us market
				 */
				var groupView = me.getGroupView();
				var subGroupInfo = groupView.getSubGroupInfo()|| {}
				var objPref = {}
				var groupInfo = groupView.getGroupInfo()|| '{}';
				var strModule ='';
				if (groupInfo && groupInfo.groupTypeCode) {
					if (groupInfo.groupTypeCode === 'RECPAR_OPT_STATUS') {
						strModule = subGroupInfo.groupCode;
					} else {
						strModule = groupInfo.groupTypeCode
					}
				}
				strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-'
						+ strModule : strModule;
				Ext.each(arrPref || [], function(pref) {
							if (pref.module === 'ColumnSetting') {
								objPref = pref.jsonPreferences;
							}
						});
				args['strInvokedFrom'] = strInvokedFrom;
				args['objPref'] = objPref;
				me.preferenceHandler.saveModulePreferences(me.strPageName,
						strModule, objPref, me.postHandlePageGridSetting, args,
						me, false);
			} 
			else{
				me.handleClearLocalPrefernces();
			   me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
				me.postHandlePageGridSetting, null, me, false);
			}
			
		}
	},
	restorePageSetting : function(arrPref, strInvokedFrom) {
		var me = this;
		var  args = {};
		if (strInvokedFrom === 'GRID'
				&& _charCaptureGridColumnSettingAt === 'L') {
			var groupView = me.getGroupView();
			var subGroupInfo = groupView.getSubGroupInfo()|| {};
			var objPref = {};
			var groupInfo = groupView.getGroupInfo()|| '{}';
			var strModule = '';
			if (groupInfo && groupInfo.groupTypeCode) {
				      if (groupInfo.groupTypeCode === 'RECPAR_OPT_STATUS') {
						strModule = subGroupInfo.groupCode;
					} else {
						strModule = groupInfo.groupTypeCode
					}
					
			}
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
		}
		else{
			me.handleClearLocalPrefernces();
		   me.preferenceHandler.clearPagePreferences(me.strPageName,arrPref,
				me.postHandlePageGridSetting, null, me, false);
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
				window.location.reload();
			} 
			else{
			   window.location.reload();
			}
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
	postHandleRestorePageSetting : function(data, args, isSuccess) {
		if (isSuccess === 'Y') {
			var me = this;
			if (args && args.strInvokedFrom === 'GRID'
					&& _charCaptureGridColumnSettingAt === 'L') {
				var objGroupView = me.getGroupView();
				if (objGroupView)
					objGroupView.reconfigureGrid(null);
			} else{
//				me.doDeleteLocalState();
				window.location.reload();
			}
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
	doGetSavedState : function() {
		var me = this;
		return Ext.decode(me.preferenceHandler.getLocalPreferences(me.strLocalStorageKey));
	},
	doHandleStateChange : function() {
		var me = this, objState = {}, objGroupView = me.getGroupView(), grid = objGroupView.getGrid() ,subGroupInfo = null;
		if (objGroupView)
			subGroupInfo = objGroupView.getSubGroupInfo();
		objState['subGroupCode'] = (subGroupInfo || {}).groupCode;
		objLocalStoragePref = objState;
		me.preferenceHandler.setLocalPreferences(me.strLocalStorageKey,Ext.encode(objState));
	},
	showPageSettingPopup : function(strInvokedFrom) {
		var me = this, objData = {}, objGroupView = me.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting;
		var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeMaster, strTitle = null, subGroupInfo;

		me.pageSettingPopup = null;
		if (!Ext.isEmpty(objMandateMstPref)) {
			objPrefData = Ext.decode(objMandateMstPref);
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
					: (USER_CATEGORY_GENERIC_COLUMN_MODEL || '[]');
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
		objData["filterUrl"] = 'services/userfilterslist/groupViewFilter.json';
		objData["rowPerPage"] = _AvailableGridSize;
		objData["groupByVal"] = objGroupByVal;
		objData["filterVal"] = objDefaultFilterVal;
		objData["gridSizeVal"] = objGridSizeVal;
		objData["rowPerPageVal"] = objRowPerPageVal;
		subGroupInfo = objGroupView.getSubGroupInfo() || {};
		strTitle = (strInvokedFrom === 'GRID' ? getLabel("columnSettings",
				"Column Settings")
				+ ' : ' + (subGroupInfo.groupDescription || '') : getLabel(
				"Settings", "Settings"));
		me.pageSettingPopup = Ext.create('Ext.ux.gcp.PageSettingPopUp', {
					cfgPopUpData : objData,
					cfgGroupView : objGroupView,
					cfgDefaultColumnModel : objColumnSetting,
					cfgViewOnly : _IsEmulationMode,
					cfgInvokedFrom : strInvokedFrom,
					title : strTitle
				});
		me.pageSettingPopup.show();
		me.pageSettingPopup.center();
	},
	/* Page setting handling ends here */
	handleAppliedFilterDelete : function(btn) {
		var me = this;
		var objData = btn.data;
		var quickJsonData = me.filterData;
		if (!Ext.isEmpty(objData)) {
			var paramName = objData.paramName || objData.field;
			reqJsonInQuick = me.findInQuickFilterData(quickJsonData, paramName);
			if (!Ext.isEmpty(reqJsonInQuick)) {
				arrQuickJson = quickJsonData;
				arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,
						paramName);
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
	resetFieldInQuickFilterOnDelete : function(objData) {
		var me = this, strFieldName;
		var clientSetupFilterView = me.getClientSetupFilterView();
		var payerCodeFltId = clientSetupFilterView
				.down('combobox[itemId=payerCodeFltId]');
		var payerNameFltId = clientSetupFilterView
				.down('combobox[itemId=payerNameFltId]');
		var payerAcctFltId = clientSetupFilterView
				.down('combobox[itemId=payerAcctFltId]');
		if (!Ext.isEmpty(objData))
			strFieldName = objData.paramName || objData.field;
		if (strFieldName === 'payerCode'
				&& !Ext.isEmpty(payerCodeFltId.getValue())) {
			payerCodeFltId.setValue('');
		}
		if (strFieldName === 'payerName'
				&& !Ext.isEmpty(payerNameFltId.getValue())) {
			payerNameFltId.setValue('');
		}
		if (strFieldName === 'payerAcctNmbr'
				&& !Ext.isEmpty(payerAcctFltId.getValue())) {
			payerAcctFltId.setValue('');
		}
		if (strFieldName === 'clientId'){
			if (isClientUser()) {
				var clientCombo = clientSetupFilterView
						.down('combobox[itemId=clientCombo]');
				me.clientCode = 'all';
				me.clientDesc = getLabel('allCompanies', 'All companies');
				clientCombo.setValue(me.clientCode);
				selectedFilterClientDesc = "";
				selectedFilterClient = "";
			} else {
				var clientCombo = clientSetupFilterView
						.down('combobox[itemId=clientAutoCompleter]');
				clientCombo.setValue("");
				me.clientCode = '';
				selectedFilterClientDesc = "";
				selectedFilterClient = "";
			}
		}

	},
	
/* State handling at local storage starts */
	
	handleSaveLocalStorage : function(){
		var me=this,arrSaveData = [], objSaveState = {},objGroupView = me.getGroupView(), grid = objGroupView.getGrid() ,subGroupInfo = null,quickFilterState = {};
		if (objGroupView)
			subGroupInfo = objGroupView.getSubGroupInfo();
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
		}else {
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
	doDeleteLocalState : function(){
		var me = this;
		me.preferenceHandler.clearLocalPreferences(me.strLocalStorageKey);
	},
	handleClearLocalPrefernces : function(){
		var me = this,args = {},strLocalPrefPageName = me.strPageName+'_TempPref';;
		
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
	applyPreferences : function(){
		var me = this, objJsonData='', objLocalJsonData='',savedFilterCode ='';
		if (objMandateMstPref || objSaveLocalStoragePref) {
			objJsonData = Ext.decode(objMandateMstPref);
			objLocalJsonData = Ext.decode(objSaveLocalStoragePref); 
			
			if (!Ext.isEmpty(objLocalJsonData.d.preferences) && (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) && allowLocalPreference === 'Y') {
				if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.quickFilterJson)){
					me.updateConfig();
					me.setFilterRetainedValues();
				}
			}
		}
	}
});
function showClientPopup(brandingPkg) {
	GCP.getApplication().fireEvent('showClientPopup', brandingPkg);
}