Ext.define('GCP.controller.UserMstController', {
	extend : 'Ext.app.Controller',
	requires : ['GCP.view.UserMstView'],
	views : ['GCP.view.UserMstView', 
			'GCP.view.UserMstFilterView', 'GCP.view.UserMstGridView'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'userMstView',
				selector : 'userMstView'
			}, {
				ref : 'searchTextField',
				selector : 'userMstView textfield[itemId="searchTextField"]'
			}, {
				ref : 'filterView',
				selector : 'filterView'
			}, {
				ref : "filterButton",
				selector : "groupView button[itemId=filterButton]"
			}, {
				ref : 'userMstFilterView',
				selector : 'userMstFilterView'
			}, {
				ref : 'userMstGridView',
				selector : 'userMstView userMstGridView'
			}, {
				ref : 'userMstGridDtlView',
				selector : 'userMstView userMstGridView panel[itemId="userMstGridDtlView"]'
			}, {
				ref : 'userMstGrid',
				selector : 'userMstView userMstGridView smartgrid[itemId="userMstListGrid"]'
			}, {
				ref : 'matchCriteria',
				selector : 'userMstView radiogroup[itemId="matchCriteria"]'
			}, {
				ref : 'actionBar',
				selector : 'userMstView userMstGridView userMstGroupActionBarView'
			}, {
				ref : 'sellerClientMenuBar',
				selector : 'userMstView userMstFilterView container[itemId="sellerClientMenuBar"]'
			}, {
				ref : 'sellerMenuBar',
				selector : 'userMstView userMstFilterView container[itemId="sellerMenuBar"]'
			}, {
				ref : 'clientMenuBar',
				selector : 'userMstView userMstFilterView container[itemId="clientMenuBar"]'
			}, {
				ref : 'userNameFilterBar',
				selector : 'userMstView userMstFilterView container[itemId="userNameFilterBar"]'
			}, {
				ref : 'groupView',
				selector : 'userMstGridView groupView'
			},
			 {
				ref : 'clientComboRef',
				selector : 'userMstView userMstFilterView combo[itemId="clientCombo"]'
			}, {
				ref : 'userNameFltRef',
				selector : 'userMstView userMstFilterView combo[itemId="userNameFltId"]'
			}, {
				ref : 'categoryFltRef',
				selector : 'userMstView userMstFilterView combo[itemId="userCategoryFltId"]'
			},
			{
				ref : 'statusFltRef',
				selector : 'userMstView userMstFilterView combo[itemId="statusFltId"]'
			},
			{
				ref : 'ssouserFltRef',
				selector : 'userMstView userMstFilterView combo[itemId="ssoUserIdFilterItemId"]'
			},
			{
				ref : 'loginIdFltRef',
				selector : 'userMstView userMstFilterView combo[itemId="loginIdFltId"]'
			}
			],
	config : {
		filterData : [],
		sellerFilterVal : null,
		corpFilterVal : null,
		corpFilterDesc : null,
		clientCode : '',
		clientDesc : '',
		sellerOfSelectedClient : '',
		strDefaultMask : '000000000000000000',
		reportGridOrder : null,
		strPageName:'userMst',
		preferenceHandler : null,
		userNamePrefCode:null,
		rolePrefCode:null,
		statusPrefCode:null,
		statusPrefDesc:null,
		loginIdPrefCode : null,
		isSelectUserName  : false,
		oldUserName : '',
		oldUserRole : '',
		isSelectRole : false,	
		ssoLoginIdPrefCode : null,
		isSelectSSOId : false,
		oldSSOId : '',
		isSelectLoginId : false,
		oldLoginId : '',
		objLocalData : null
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		me.firstLoad = true;
		if(objSaveLocalStoragePref){
			me.objLocalData = Ext.decode(objSaveLocalStoragePref);
			objQuickPref = me.objLocalData && me.objLocalData.d.preferences
								&& me.objLocalData.d.preferences.tempPref 
								&& me.objLocalData.d.preferences.tempPref.quickFilterJson ? me.objLocalData.d.preferences.tempPref.quickFilterJson : {};
			
			me.filterData = (!Ext.isEmpty(objQuickPref)) ? objQuickPref : [];
		}
		
//		me.updateConfig();
		$(document).on('addUser', function() {
					me.handleAddNewUser();
				});
		$(document).on('performReportAction', function(event, actionName) {
			me.downloadReport(actionName);
		});
		$(document).on("handleAddNewUserTT",function(actionName){
			me.handleAddNewUserTT();
		});
		$(document).on("handleAddNewUserTTT",function(){
			me.handleAddNewUserTTT();
		});
		$(document).on('handleClientChangeInQuickFilter',function(isSessionClientFilter) {
			me.handleClientChangeInQuickFilter(isSessionClientFilter);
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
				'applyPageSetting' : function(popup, data, strInvokedFrom) {
					me.applyPageSetting(data,strInvokedFrom);
				},
				'savePageSetting' : function(popup, data,strInvokedFrom) {
					me.savePageSetting(data,strInvokedFrom);
				},				
				'restorePageSetting' : function(popup, data, strInvokedFrom) {
					me.restorePageSetting(data, strInvokedFrom);
				}
			},			
			'userMstView' : {
				render : function(panel, opts) {
				}
			},
			'userMstView button[itemId="addNewUserId"]' : {
				click : function(btn) {
					me.handleAddNewUser(btn);
				}
			},
			'userMstGridView' : {
				render : function(panel, opts) {
					// me.handleSmartGridLoading();
					// me.setFilterRetainedValues();
					// me.setInfoTooltip();
				}
			},
			'userMstGridView groupView' : {
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
					me.doHandleGroupTabChange(groupInfo, subGroupInfo,
							tabPanel, newCard, oldCard);
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.disablePreferencesButton("clearPrefMenuBtn",false);			
				},
				'gridRender' : me.handleLoadGridData,
				'gridPageChange' : me.handleLoadGridData,
				'gridSortChange' : me.handleLoadGridData,
				'gridPageSizeChange' : me.handleLoadGridData,
				'gridColumnFilterChange' : me.handleLoadGridData,
				'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,
				'gridStateChange' : function(grid) {
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.disablePreferencesButton("clearPrefMenuBtn",false);	
				},
				'toggleGridPager' : function() {
					me.disablePreferencesButton("savePrefMenuBtn",false);
				},
				'gridRowActionClick' : function(grid, rowIndex, columnIndex,
						actionName, record) {
					me.doHandleRowActions(actionName, grid, record, rowIndex);
				},
				'groupActionClick' : function(actionName, isGroupAction,
						maskPosition, grid, arrSelectedRecords) {
					if (isGroupAction === true)
						me.handleGroupActions(actionName, grid,
								arrSelectedRecords, 'groupAction');
				},
				'gridStoreLoad' : function(grid, store) {
					me.disableActions(false);
				},
				'gridSettingClick' : function() {
					me.showPageSettingPopup('GRID');
				},
				afterrender : function(panel, opts) {
				},
				'render' : function(){
					me.applyPreferences();
				}
			},
			'userMstView textfield[itemId="searchTextField"]' : {
				change : function(btn, opts) {
					me.searchTrasactionChange();
				}
			},
			'userMstView radiogroup[itemId="matchCriteria"]' : {
				change : function(btn, opts) {
					me.searchTrasactionChange();
				}
			},
			'userMstFilterView' : {
				beforerender : function() {
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
					var objDetailFilterPanel = me.getUserMstFilterView();
					var objAutocompleterName = objDetailFilterPanel
							.down('AutoCompleter[itemId="userNameFltId"]');
					objAutocompleterName.cfgUrl = 'services/userMstSeek/userNamesList.json';
					// objAutocompleterName.setValue( '' );
					if(Ext.isEmpty(me.corpFilterVal)){
						objAutocompleterName.cfgExtraParams.push({
									key : '$filtercorporation',
									value : sessionCorporation
								});
					}else {
						objAutocompleterName.cfgExtraParams.push({
							key : '$filtercorporation',
							value : me.corpFilterVal
						});
					}

					var objAutocompleterDesc = objDetailFilterPanel
							.down('AutoCompleter[itemId="userCategoryFltId"]');
					objAutocompleterDesc.cfgUrl = 'services/userMstSeek/userCategoryList.json';
					// objAutocompleterDesc.setValue( '' );
					if(Ext.isEmpty(me.corpFilterVal)){
						objAutocompleterDesc.cfgExtraParams.push({
									key : '$filtercorporation',
									value : sessionCorporation
								});
					}else{
						objAutocompleterDesc.cfgExtraParams.push({
							key : '$filtercorporation',
							value : me.corpFilterVal
						});
					}
					
					var objAutocompleterDesc = objDetailFilterPanel
						.down('AutoCompleter[itemId="ssoUserIdFilterItemId"]');
					objAutocompleterDesc.cfgUrl = 'services/userMstSeek/clientSsoUserIdSeekAll.json';
					if(Ext.isEmpty(me.corpFilterVal)){
						objAutocompleterDesc.cfgExtraParams.push({
							key : '$filtercorporation',
							value : sessionCorporation
						});
					}else{
						objAutocompleterDesc.cfgExtraParams.push({
							key : '$filtercorporation',
							value : me.corpFilterVal
						});
					}
					
					var objAutocompleterLoginId = objDetailFilterPanel
					.down('AutoCompleter[itemId="loginIdFltId"]');
					objAutocompleterLoginId.cfgUrl = 'services/userMstSeek/loginIdList.json';
						if(Ext.isEmpty(me.corpFilterVal)){
							objAutocompleterLoginId.cfgExtraParams.push({
										key : '$filtercorporation',
										value : sessionCorporation
									});
						}else {
							objAutocompleterLoginId.cfgExtraParams.push({
								key : '$filtercorporation',
								value : me.corpFilterVal
							});
						}
				},
				'handleClientChange' : function(strClientId, strClientDescr,
						strSellerId) {
					
					me.sellerOfSelectedClient = strSellerId;
					
					if(strClientId != 'All'){
						me.clientCode = strClientId;
						selectedClient = strClientId;
						me.clientDesc = strClientDescr;						
					}else{
						me.clientCode = '';
						me.clientDesc = '';
						strClientId = '';
						strClientDescr = '';
					}

					me.corpFilterDesc = strClientDescr;
					me.corpFilterVal = strClientId;
					var objFilterPanel = me.getSellerClientMenuBar();

					var objDetailFilterPanel = me.getUserMstFilterView();

					var objAutocompleterName = objDetailFilterPanel
							.down('AutoCompleter[itemId="userNameFltId"]');
					var objAutocompleterDesc = objDetailFilterPanel
							.down('AutoCompleter[itemId="userCategoryFltId"]');
					var objAutocompleterSSODesc = objDetailFilterPanel
							.down('AutoCompleter[itemId="ssoUserIdFilterItemId"]');
					var objAutocompleterLoginId = objDetailFilterPanel
					.down('AutoCompleter[itemId="loginIdFltId"]');
					
					var objFilterPanel = me.getSellerClientMenuBar();
					var cfgArrayName = objAutocompleterName.cfgExtraParams;
					var cfgArrayDesc = objAutocompleterDesc.cfgExtraParams;
					var cfgArrayLoginId = objAutocompleterLoginId.cfgExtraParams;
					
					if (cfgArrayName) {
						$.each(cfgArrayName, function(i, v) {
							$.each(v, function(innerKey, innerValue) {
										if (innerValue == '$filtercorporation') {
											v.value = strClientId;
										}
									})
						});
					} else {
						cfgArrayName.push({
									key : '$filtercorporation',
									value : strClientId
								});
					}

					if (cfgArrayDesc) {
						$.each(cfgArrayDesc, function(i, v) {
							$.each(v, function(innerKey, innerValue) {
										if (innerValue == '$filtercorporation') {
											v.value = strClientId;
										}
									})
						});
					} else {
						cfgArrayDesc.push({
									key : '$filtercorporation',
									value : strClientId
								});
					}
					
					if (cfgArrayLoginId) {
						$.each(cfgArrayLoginId, function(i, v) {
							$.each(v, function(innerKey, innerValue) {
										if (innerValue == '$filtercorporation') {
											v.value = strClientId;
										}
									})
						});
					} else {
						cfgArrayLoginId.push({
									key : '$filtercorporation',
									value : strClientId
								});
					}

					objAutocompleterName.cfgUrl = 'services/userMstSeek/userNamesList.json';
					objAutocompleterName.setValue( '' );
					objAutocompleterName.cfgExtraParams = cfgArrayName;

					objAutocompleterDesc.cfgUrl = 'services/userMstSeek/userCategoryList.json';
					objAutocompleterDesc.setValue( '' );
					objAutocompleterDesc.cfgExtraParams = cfgArrayDesc;
					
					objAutocompleterLoginId.cfgUrl = 'services/userMstSeek/loginIdList.json';
					objAutocompleterLoginId.setValue('');
					objAutocompleterLoginId.cfgExtraParams = cfgArrayLoginId;
					
					me.applySeekFilter();

				}
			},

			'userMstView userMstGridView toolbar[itemId=userMstGroupActionBarView]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			},
			'userMstFilterView AutoCompleter[itemId="loginIdFltId"]' : {
				select : function(combo, record, index) {
					me.applySeekFilter();
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.disablePreferencesButton("clearPrefMenuBtn",false);	
					me.isSelectLoginId = true;
				},
				change : function(combo, record, index, oldVal) {
					me.oldLoginId = oldVal;
					if (record == null) {
						me.applySeekFilter();
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);	
						me.isSelectLoginId  = true;	
						me.oldLoginId = "";
					}
				},
				keyup : function(combo, e, eOpts){
					me.isSelectLoginId = false;
				},
				blur : function(combo, record){
					
					if (me.isSelectLoginId == false && me.oldLoginId != combo.getRawValue()){
						me.applySeekFilter();
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);
					}	
					me.oldLoginId = combo.getRawValue();
				}
			},
			'userMstFilterView AutoCompleter[itemId="userNameFltId"]' : {
				select : function(combo, record, index) {
					me.applySeekFilter();
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.disablePreferencesButton("clearPrefMenuBtn",false);	
					me.isSelectUserName = true;
				},
				change : function(combo, record, index, oldVal) {
					me.oldUserName = oldVal;
					if (record == null) {
						me.applySeekFilter();
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);	
						me.isSelectUserName  = true;	
						me.oldUserName = "";
					}
				},
				keyup : function(combo, e, eOpts){
					me.isSelectUserName = false;
				},
				blur : function(combo, record){
					
					if (me.isSelectUserName == false && me.oldUserName != combo.getRawValue()){
						me.applySeekFilter();
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);
					}	
					me.oldUserName = combo.getRawValue();
				}
			},
			'userMstFilterView AutoCompleter[itemId="userCategoryFltId"]' : {
				select : function(combo, record, index) {
					me.applySeekFilter();
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.disablePreferencesButton("clearPrefMenuBtn",false);	
					me.isSelectRole  = true;
				},
				change : function(combo, record, index, oldVal) {
					me.oldUserRole = oldVal;
					if (record == null) {
						me.corpFilterVal = '';
						me.corpFilterDesc = '';
						me.applySeekFilter();
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);	
						me.isSelectRole  = true;
						me.oldUserRole = "";
					}
				},
				keyup : function(combo, e, eOpts){
					me.isSelectRole = false;
				},
				blur : function(combo, record){
					if (me.isSelectRole == false  &&  me.oldUserRole != combo.getRawValue()){
					me.applySeekFilter();
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.disablePreferencesButton("clearPrefMenuBtn",false);	
					}
					me.oldUserRole = combo.getRawValue();
				}
			},
			'userMstFilterView AutoCompleter[itemId="ssoUserIdFilterItemId"]' : {
				select : function(combo, record, index) {
					me.applySeekFilter();
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.disablePreferencesButton("clearPrefMenuBtn",false);	
					me.isSelectRole  = true;
				},
				change : function(combo, record, index, oldVal) {
					me.oldSSOId = oldVal;
					if (record == null) {
						me.corpFilterVal = '';
						me.corpFilterDesc = '';
						me.applySeekFilter();
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);	
						me.isSelectSSOId  = true;
						me.oldSSOId = "";
					}
				},
				keyup : function(combo, e, eOpts){
					me.isSelectSSOId = false;
				},
				blur : function(combo, record){
					if (me.isSelectSSOId == false && !Ext.isEmpty(me.oldSSOId) &&  me.oldSSOId != combo.getRawValue()){
					me.applySeekFilter();
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.disablePreferencesButton("clearPrefMenuBtn",false);	
					}
					me.oldSSOId = combo.getRawValue();
				}
			},
			'userMstFilterView combo[itemId="statusFltId"]' : {
				select : function(combo, record, index) {
					me.applySeekFilter();
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.disablePreferencesButton("clearPrefMenuBtn",false);	
				},
				'boxready' : function(combo, width, height, eOpts) {
					if (!Ext.isEmpty(me.statusPrefCode) && 'all' != me.statusPrefCode && me.statusPrefCode != 'ALL'){
						combo.setValue(me.statusPrefCode.split(','));
						combo.selectedOptions = me.statusPrefCode.split(',');
					}
				}
			},
			/*'userMstFilterView combo[itemId=clientCombo]' : {
				select : function(btn, opts) {
					me.changeFilterParams();
					me.setDataForFilter();
					me.applyFilter();
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.disablePreferencesButton("clearPrefMenuBtn",false);	
				}
			},*/
			'filterView button[itemId="clearSettingsButton"]' : {
				'click' : function() {
					me.handleClearSettings();
				}
			},
			'filterView' : {
				appliedFilterDelete : function(btn){
					me.handleAppliedFilterDelete(btn);
				}
			},
			'userMstFilterView  combo[itemId="statusFltId"]' : {
				'select' : function(combo,selectedRecords) {
					combo.isQuickStatusFieldChange = true;
				},
				'blur':function(combo,record){
					if(combo.isQuickStatusFieldChange)
						me.handleStatusClick(combo);
				}
			}		

		});
	},
	handleStatusClick : function(combo) {
		var me = this;
		combo.isQuickStatusFieldChange = false;
		me.statusPrefCode = combo.getSelectedValues();
		me.statusPrefDesc = combo.getRawValue();
		me.setDataForFilter();
		me.applyFilter();
	},
	hideQuickFilter : function() {
		var me = this;
		if (!Ext.isEmpty(me.getFilterView())) {
			me.getFilterView().hide();
			me.getFilterButton().filterVisible = false;
			me.getFilterButton().removeCls('filter-icon-hover');
		}
	},
	doHandleGroupByChange : function(menu, groupInfo) {
		var me = this;
		if (me.previouGrouByCode === 'ADVFILTER') {
			me.savePrefAdvFilterCode = null;
			me.showAdvFilterCode = null;
			me.filterApplied = 'ALL';
		}
		if (groupInfo && groupInfo.groupTypeCode === 'ADVFILTER') {
			// me.previouGrouByCode = groupInfo.groupTypeCode;
		}
		// me.previouGrouByCode = null;
	},
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) {
		var me = this;
		var objGroupView = me.getGroupView();
		var strModule = '', strUrl = null, args = null;
		groupInfo = groupInfo || {};
		subGroupInfo = subGroupInfo || {};
		if (groupInfo && groupInfo.groupTypeCode) {
				strModule = subGroupInfo.groupCode;
			args = {
				'module' : strModule
			};
			strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-'
					+ strModule : strModule;
			me.preferenceHandler.readModulePreferences(me.strPageName,
					strModule, me.postHandleGroupTabChange, args, me, true); 
		} else {
			objGroupView.reconfigureGrid(null);
		}
	},
	postHandleGroupTabChange : function(data, args) {
		//	var me = args.scope;
		var me=this;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getUserMstGridView(), objPref = null, gridModel = null, intPgSize = null,showPager = true, heightOption = null;
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
			intPgSize = objPref.pgSize || _GridSizeMaster;
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
	handleAddNewUser : function() {
		var me = this;

		var strCorpCode = ' ', strCorpDesc = ' ';

		if (!Ext.isEmpty(me.corpFilterVal) && me.corpFilterVal != undefined)
			strCorpCode = me.corpFilterVal;
		if (!Ext.isEmpty(me.corpFilterDesc) && me.corpFilterDesc != undefined)
			strCorpDesc = me.corpFilterDesc;

		var strUrl = "addUserAdmin.form";
		var form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'selectedSeller', me.sellerFilterVal));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'selectedCorpCode', strCorpCode));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'selectedCorpDesc', strCorpDesc));
		form.action = strUrl;
		document.body.appendChild(form);

		me.setFilterParameters(form);
		form.submit();
		document.body.removeChild(form);
	},
	setDataForFilter : function() {
		var me = this;
		this.filterData = this.getFilterQueryJson();
	},
	handleGroupActions : function(strAction, grid, arrSelectedRecords,
			strActionType) {
		var me = this;
		var strUrl = Ext.String.format('services/userMst/{0}.srvc?', strAction);
		var strUrl =null;
		if((strAction ==='accept' || strAction ==='reject' || strAction ==='discard'  
			|| strAction === 'submit')){
			strUrl = Ext.String.format('services/userCommandApi/{0}.json', strAction);
		}else{	
			if((strAction ==='resetUser' || strAction ==='clearUser') && (entity_type == '0' && onBeHalfMode =='false'))
			{
				strUrl = Ext.String.format('services/userMst/{0}.srvc?', strAction+'AdminMode');	
			} else{
				strUrl = Ext.String.format('services/userMst/{0}.srvc?', strAction);
			}
		}
		if (strAction === 'reject') {
			this.showRejectVerifyPopUp(strAction, strUrl, grid,
					arrSelectedRecords, strActionType);

		} else {
			me.getGroupView().setLoading(true);
			this.preHandleGroupActions(strUrl, '', grid, arrSelectedRecords,
					strActionType, strAction);
		}
	},
	showRejectVerifyPopUp : function(strAction, strUrl, grid,
			arrSelectedRecords, strActionType) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		if (strAction === 'reject') {
			fieldLbl = getLabel('userRejectRemarkPopUpTitle',
					'Please Enter Reject Remark');
			titleMsg = getLabel('userRejectRemarkPopUpFldLbl', 'Reject Remark');
		}
		var msgbox = Ext.Msg.show({
					title : titleMsg,
					msg : fieldLbl,
					buttons : Ext.Msg.OKCANCEL,
					multiline : 4,
					cls : 't7-popup',
					width : 355,
					height : 270,
					bodyPadding : 0,
					buttonText: {
                        ok: getLabel('btnOk','Ok'),
                        cancel: getLabel('btncancel','Cancel')
                    },
					fn : function(btn, text) {
						if (btn == 'ok') {
							if(Ext.isEmpty(text))
							{
								//Ext.Msg.alert(getLabel('errorTitle', 'Error'), getLabel('rejectRestrictionErroMsg', 'Reject Remarks cannot be blank'));
				                    Ext.MessageBox.show({
										title : getLabel('errorTitle','Error'),
										msg : getLabel('rejectRestrictionErroMsg', 'Reject Remark field can not be blank'),
										buttons : Ext.MessageBox.OK,
										cls : 'ux_popup',
										icon : Ext.MessageBox.ERROR,
										buttonText: {
					                        ok: getLabel('btnOk','Ok')
					                    }
									});
							}
							else
							{
								me.preHandleGroupActions(strUrl, text, grid, arrSelectedRecords, strActionType, strAction);
							}
						}
					}
				});
		msgbox.textArea.enforceMaxLength = true;
		msgbox.textArea.inputEl.set({
			maxLength : 255
		});
	},
	applyFilter : function() {
		var me=this;
		var objGroupView = me.getGroupView();
		var groupInfo = objGroupView.getGroupInfo();
		me.refreshData();
	},
	preHandleGroupActions : function(strUrl, remark, grid, arrSelectedRecords,
			strActionType, strAction) {

		var me = this;
		var groupView = me.getGroupView();
		if (!Ext.isEmpty(groupView)) {
			var arrayJson = new Array();
			var records = (arrSelectedRecords || []);
			if((strAction ==='accept' || strAction ==='reject' || strAction ==='discard' 
				|| strAction === 'submit')){
				for (var index = 0; index < records.length; index++) {
					arrayJson.push({
								serialNo : grid.getStore().indexOf(records[index])
										+ 1,
								recordKey : records[index].data.identifier,
								userMessage : remark,
								recordDesc : records[index].data.usrCode
							});
				}
			}else{
			for (var index = 0; index < records.length; index++) {
				arrayJson.push({
							serialNo : grid.getStore().indexOf(records[index])
									+ 1,
							identifier : records[index].data.identifier,
							userMessage : remark,
							recordDesc : records[index].data.usrCode
						});
			}
			}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});

			Ext.Ajax.request({
						url : strUrl,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						timeout: 300000,// miliseconds
						success : function(response) {
							// TODO : Action Result handling to be done here
							
							// me.applyFilter();
							me.getGroupView().setLoading(false);
							var errorMessage = '';
							if( response.responseText == '[]')
							{
							 groupView.refreshData();
							}
							if (response.responseText != '[]') {
								
								var jsonData = Ext
										.decode(response.responseText);
								jsonData = jsonData.d ? jsonData.d : jsonData;		
								/*Ext.each(jsonData[0].errors, function(error,
												index) {
											errorMessage = errorMessage
													+ error.errorMessage
													+ "<br/>";
										});*/
								if(!Ext.isEmpty(jsonData))
						        {
						        	groupView.refreshData();
									
						        	for(var i =0 ; i<jsonData.length;i++ )
						        	{
						        		var arrError = jsonData[i].errors;
						        		if(!Ext.isEmpty(arrError))
						        		{
						        			for(var j =0 ; j< arrError.length; j++)
								        	{
						        				for(var j = 0 ; j< arrError.length; j++)
									        	{
							        				errorMessage = errorMessage + arrError[j].code +' : '+ arrError[j].errorMessage+"<br/>";
									        	}
								        	}
						        		}
						        		
						        	}
							        if('' != errorMessage && null != errorMessage)
							        {
							         //Ext.Msg.alert("Error",errorMessage);
							        	Ext.MessageBox.show({
											title : getLabel('errorTitle','Error'),
											msg : errorMessage,
											buttons : Ext.MessageBox.OK,
											cls : 'ux_popup',
											icon : Ext.MessageBox.ERROR
										});
							        } 
						        }	
							}
						},
						failure : function() {
							me.getGroupView().setLoading(false);
							var errMsg = "";
							Ext.MessageBox.show({
										title : getLabel('errorTitle', 'Error'),
										msg : getLabel('errorPopUpMsg',
												'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
						}
					});
		}

	},
	doHandleRowActions : function(actionName, grid, record, rowIndex) {
		var me = this;
		if (actionName === 'submit' || actionName === 'accept'
				|| actionName === 'reject' || actionName === 'discard'
				|| actionName === 'enable' || actionName === 'disable' 
				|| actionName === 'clearUser' || actionName === 'resetUser')
			me.handleGroupActions(actionName, grid, [record], 'rowAction');
		else if (actionName === 'btnHistory') {
			var user = null;
			var recHistory = record.get('history');

			if (!Ext.isEmpty(recHistory)
					&& !Ext.isEmpty(recHistory.__deferred.uri)) {
				if(CLIENTSSO && CLIENTSSO == 'Y')
				{
					user = record.get('ssoLoginId');
				}
				else
				{
					user = record.get('usrCode');
				}
				me.showHistory(user,
						record.get('history').__deferred.uri, record
								.get('identifier'));
			}
		} else if(actionName === 'btnEdit'){
			var strUrl = 'editUserManager.form';
			me.submitForm(strUrl, record, rowIndex);
		}else if(actionName === 'btnView'){
			var strUrl = 'viewUserManager.form#/Verify';
			me.submitForm(strUrl, record, rowIndex);
		}else if (actionName === 'btnEdit') {
			var strUrl = 'editUserAdmin.form';
			me.submitForm(strUrl, record, rowIndex);
		} else if (actionName === 'btnView') {
			var strUrl = 'viewUserAdmin.form';
			me.submitForm(strUrl, record, rowIndex);
		} else {

		}
	},
	submitForm : function(strUrl, record, rowIndex) {
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
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'redirectFromGrid',
				'Y'));
				
		form.action = strUrl;
		if(strUrl == 'viewUserManager.form#/Verify' || strUrl == 'editUserManager.form' ){ 
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'MODE',
				'VIEW'));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'roleId',
				record.data.usrCategory));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'corpId',
				record.data.corporationId));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'recKeyNo',
				record.data.identifier));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'userId',
				record.data.usrCode));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'screenType',
				'Y'));
		}
		if(strUrl == 'verifyUser.form' || strUrl == 'viewUserAdmin.form' ){ 
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'MODE',
				'VIEW'));
		}
		me.setFilterParameters(form);

		document.body.appendChild(form);
		form.submit();
	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	showHistory : function(usrCode, url, id) {
	var historyPopup =	Ext.create('GCP.view.HistoryPopup', {
					historyUrl : url,
					usrCode : usrCode,
					identifier : id
				}).show();
	historyPopup.center();			
	Ext.getCmp('btnUserHistoryPopupClose').focus();
	},
	handleSmartGridLoading : function() {
		var me = this;
		var grid = me.getUserMstGrid();
		if (Ext.isEmpty(grid)) {
			me.loadSmartGrid();
		} else {
			me.handleLoadGridData(grid, grid.store.dataUrl, grid.pageSize, 1,
					1, null);
		}
	},
	getFilterQueryJson : function() {
		var me = this;
		var userNameVal = null, statusVal = null, moduleVal = null, categoryVal = null, subCategoryVal = null, jsonArray = [], clientCodeVal = null, sellerCodeVal = null;
		var statusDesc = null;
		var ssoLoginIdVal = null;
		var loginIdVal = null;

		var userMstFilterView = me.getUserMstFilterView();

		if (Ext.isEmpty(userMstFilterView)) {
			userNameVal = me.userNamePrefCode;
			categoryVal = me.rolePrefCode;
			statusVal=me.statusPrefCode;
			ssoLoginIdVal=me.ssoLoginIdPrefCode;
			loginIdVal = me.loginIdPrefCode;
			
			if (undefined != filterCorpDesc && filterCorpDesc != '') {
				me.corpFilterDesc = filterCorpDesc;
			}
			if (undefined != filterCorpCode && filterCorpCode != '') {
				me.corpFilterVal = filterCorpCode;
			}
		} else {
			var userNameFltId = userMstFilterView
					.down('combobox[itemId=userNameFltId]');

			/*if (!Ext.isEmpty(clientId) && !Ext.isEmpty(corpDesc)) {
				corpDesc = corpDesc.toUpperCase();
			}

			if (!Ext.isEmpty(clientId) && !Ext.isEmpty(corpVal)) {
				corpVal = corpVal.toUpperCase();
			}*/

			var userStatusFltId = userMstFilterView.down('combobox[itemId=userMstStatusFltId]');
			var userCategoryFltId = userMstFilterView.down('combobox[itemId=userCategoryFltId]');
			var ssoUserIdFilterItemId = userMstFilterView.down('combobox[itemId=ssoUserIdFilterItemId]');
			var loginIdFilterItemId = userMstFilterView.down('combobox[itemId=loginIdFltId]');
			
			if (!Ext.isEmpty(userNameFltId)
					&& !Ext.isEmpty(userNameFltId.getValue())) {
				userNameVal = userNameFltId.getValue().toUpperCase();
			}

			if (!Ext.isEmpty(userStatusFltId)
					&& !Ext.isEmpty(userStatusFltId.getValue())
					&& "ALL" != userStatusFltId.getValue().toUpperCase()
					&& getLabel('all','All') != userStatusFltId.getValue().toUpperCase()) {
				statusVal = userStatusFltId.getValue();
				statusDesc = userStatusFltId.getRawValue();
			}

			if (!Ext.isEmpty(userCategoryFltId)
					&& !Ext.isEmpty(userCategoryFltId.getValue())) {
				categoryVal = userCategoryFltId.getValue();
			}
       
			if (!Ext.isEmpty(ssoUserIdFilterItemId)
					&& !Ext.isEmpty(ssoUserIdFilterItemId.getValue())) {
				ssoLoginIdVal = ssoUserIdFilterItemId.getValue().toUpperCase();
			}
			
			if (!Ext.isEmpty(loginIdFilterItemId)
					&& !Ext.isEmpty(loginIdFilterItemId.getValue())) {
				loginIdVal = loginIdFilterItemId.getValue().toUpperCase();
			}
			
			jsonArray=me.getQuickFilterQuery(userNameVal,categoryVal,ssoLoginIdVal,statusVal,loginIdVal,jsonArray);
			/*if (!Ext.isEmpty(clientId) && !Ext.isEmpty(clientId.getValue())) {
				clientCodeVal = clientId.getValue();
			}*/
		}
		

		if (!Ext.isEmpty(sellerCodeVal)) {
			jsonArray.push({
						paramName : 'sellerCode',
						operatorValue : 'eq',
						paramValue1 : encodeURIComponent(sellerCodeVal.replace(new RegExp("'", 'g'), "\''")),
						dataType : 'S',
						displayType : 5,
						paramFieldLable : getLabel('seller', 'Seller'),
						displayValue1 : sessionSellerCode

					});
		}
		var corpDesc = me.corpFilterDesc;
		var corpVal = me.corpFilterVal;

		if (!Ext.isEmpty(corpDesc) && corpDesc != null && corpVal != 'All') {
			corpDesc = corpDesc.toUpperCase();
			jsonArray.push({
						paramName : 'corporationDesc',
						operatorValue : 'eq',
						paramValue1 : encodeURIComponent(corpDesc.replace(new RegExp("'", 'g'), "\''")),
						dataType : 'S',
						displayType : 5,
						paramFieldLable : getLabel('corporation', 'Company Name'),
						displayValue1 : corpDesc,
						clientId : me.clientCode
					});
		}

		if (!Ext.isEmpty(corpVal) && corpVal != null && corpVal != 'all') {
			/*jsonArray.push({
						paramName : 'corpCode',
						operatorValue : 'eq',
						paramValue1 : corpVal,
						dataType : 'S',
						displayType : 5,
						paramFieldLable : getLabel('corporation', 'corporation'),
						displayValue1 : corpVal
					});
				*/
		}
		return jsonArray;
	},
	getQuickFilterQuery:function(userNameVal,categoryVal,ssoLoginIdVal,statusVal,loginIdVal,jsonArray){	
		var me=this;
		var statusFilterValArray = [];
		var statusFilterDiscArray = [];
		var statusFilterVal = me.statusPrefCode;
		var statusFilterDisc = me.statusPrefDesc;
		
		//User Name Query
		if (!Ext.isEmpty(userNameVal)) {
			userNameVal = userNameVal.replace(/AMP;/g, '');
			jsonArray.push({
						paramName : 'userDescription',
						paramValue1 : encodeURIComponent(userNameVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'lk',
						dataType : 'S',
						displayType : 5,
						paramFieldLable : getLabel('userName', 'User Name'),
						displayValue1 : userNameVal.toUpperCase()
					});
		}
		//Role Query
		if (categoryVal != null) {
			jsonArray.push({
						paramName : 'userCategory',
						paramValue1 : encodeURIComponent(categoryVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'lk',
						dataType : 'S',
						displayType : 5,
						paramFieldLable : getLabel('roleName', 'Role Name'),
						displayValue1 : categoryVal.toUpperCase()
					});
		}
		
		//SSOID query
		if (ssoLoginIdVal != null) {
			jsonArray.push({
						paramName : 'userssologinId',
						paramValue1 : encodeURIComponent(ssoLoginIdVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'lk',
						dataType : 'S',
						displayType : 5,
						paramFieldLable : getLabel('ssoUserId', 'SSO User Id'),
						displayValue1 : ssoLoginIdVal.toUpperCase()
					});
		}
		
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

		//user login id
		if (loginIdVal != null) {
			jsonArray.push({
						paramName : 'userloginId',
						paramValue1 : encodeURIComponent(loginIdVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'lk',
						dataType : 'S',
						displayType : 5,
						paramFieldLable : getLabel('userLoginId', 'Login ID'),
						displayValue1 : loginIdVal.toUpperCase()
					});
		}
		
		//Status Query
		/*if (!Ext.isEmpty(statusVal)) {
			var strInFlag = false;
			if (statusVal == 12 || statusVal == 3) {
				if (statusVal == 12) // Submitted
				{
					statusVal = new Array(0, 1);
					jsonArray.push({
								paramName : 'isSubmitted',
								paramValue1 : 'Y',
								operatorValue : 'eq',
								dataType : 'S',
								displayType : 5,
								paramFieldLable : getLabel('status', 'Status'),
								displayValue1 : statusDesc
							});
					strInFlag = true;
				} else // Valid/Authorized
				{
					jsonArray.push({
								paramName : 'validFlag',
								paramValue1 : 'Y',
								operatorValue : 'eq',
								dataType : 'S',
								displayType : 5,
								paramFieldLable : getLabel('status', 'Status'),
								displayValue1 : statusDesc
							});
				}
			} else if (statusVal == 11) // Disabled
			{
				statusVal = 3;
				jsonArray.push({
							paramName : 'validFlag',
							paramValue1 : 'N',
							operatorValue : 'eq',
							dataType : 'S',
							displayType : 5,
							paramFieldLable : getLabel('status', 'Status'),
							displayValue1 : statusDesc
						});
			} else if (statusVal == 0 || statusVal == 1) // New
			// and
			// Modified
			{
				jsonArray.push({
							paramName : 'isSubmitted',
							paramValue1 : 'N',
							operatorValue : 'eq',
							dataType : 'S',
							displayType : 5,
							paramFieldLable : getLabel('status', 'Status'),
							displayValue1 : statusDesc
						});
			}
			if (strInFlag) // Used for Submitted & Rejected
			// status
			{
				jsonArray.push({
							paramName : 'requestState',
							paramValue1 : statusVal,
							operatorValue : 'in',
							dataType : 'S',
							displayType : 5,
							paramFieldLable : getLabel('status', 'Status'),
							displayValue1 : statusDesc
						});
			} else {
				jsonArray.push({
							paramName : 'requestState',
							paramValue1 : statusVal,
							operatorValue : 'eq',
							dataType : 'S',
							displayType : 5,
							paramFieldLable : getLabel('status', 'Status'),
							displayValue1 : statusDesc
						});
			}
		}*/
		return jsonArray;
	},
	loadSmartGrid : function(data) {
		var me = this;
		var objPref = null, arrCols = new Array(), arrColsPref = null, pgSize = null;
		var userMstGrid = null;
		if (entity_type === '0') {
			var objWidthMap = {
				"corporationDesc" : 170,
				"usrDescription" : 125,
				"usrCode" : 125,
				"usrCategory" : 115,
				"requestStateDesc" : 115
			};

			objPref = {
				"pgSize" : "5",
				"gridCols" : [{
							"colId" : "corporationDesc",
							"colDesc" : "Company Name"
						}, {
							"colId" : "usrDescription",
							"colDesc" : "User Name"
						}, {
							"colId" : (autousrcode != 'PRODUCT') ?  "ssoLoginId" : "usrCode",								
							"colDesc" : (autousrcode != 'PRODUCT') ? getLabel( 'nBOL User Id', 'nBOL User ID' ) : getLabel( 'Login ID', 'Login ID' )
						}, {
							"colId" : "usrCategory",
							"colDesc" : "Role"
						}, {
							"colId" : "requestStateDesc",
							"colDesc" : "Status"
						}]
			};
		} else {
			var objWidthMap = {
				"usrDescription" : 125,
				"usrCode" : 125,
				"usrCategory" : 115,
				"requestStateDesc" : 115
			};

			objPref = {
				"pgSize" : "5",
				"gridCols" : [{
							"colId" : "usrDescription",
							"colDesc" : "User Name"
						}, {
							"colId" : (autousrcode != 'PRODUCT') ?  "ssoLoginId" : "usrCode",								
							"colDesc" : (autousrcode != 'PRODUCT') ? getLabel( 'nBOL User ID', 'nBOL User ID' ) : getLabel( 'Login ID', 'Login ID' )
						}, {
							"colId" : "usrCategory",
							"colDesc" : "Role"
						}, {
							"colId" : "requestStateDesc",
							"colDesc" : "Status"
						}]
			};
		}

		arrColsPref = objPref.gridCols;
		arrCols = me.getColumns(arrColsPref, objWidthMap);
		pgSize = !Ext.isEmpty(objPref.pgSize) ? parseInt(objPref.pgSize,10) : 100;

		userMstGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
			id : 'userMstListGrid',
			itemId : 'userMstListGrid',
			pageSize : _GridSizeMaster,
			stateful : false,
			showEmptyRow : false,
			cls : 'ux_largepaddinglr ux_paddingb ux_largemargin-bottom',
			rowList : _AvailableGridSize,
			minHeight : 100,
			columnModel : arrCols,
			storeModel : {
				fields : ['history', 'usrCode', 'usrDescription',
						'assignedClients', 'requestStateDesc', 'usrCategory','makerId','makerStamp','checkerId',
						'isSubmitted', 'usrAcross', 'usrEmailAddr',
						'identifier', '__metadata', 'corporationDesc','ssoLoginId'],
				proxyUrl : 'services/userMasterList.json',
				rootNode : 'd.userAdminList',
				totalRowsNode : 'd.__count'
			},
			isRowIconVisible : me.isRowIconVisible,
			isRowMoreMenuVisible : me.isRowMoreMenuVisible,
			handleRowMoreMenuClick : me.handleRowMoreMenuClick,
			handleRowIconClick : function(tableView, rowIndex, columnIndex,
					btn, event, record) {
				me.handleRowIconClick(tableView, rowIndex, columnIndex, btn,
						event, record);
			},
			handleRowMoreMenuItemClick : function(menu, event) {
				var dataParams = menu.ownerCt.dataParams;
				me.handleRowIconClick(dataParams.view, dataParams.rowIndex,
						dataParams.columnIndex, this, event, dataParams.record);
			},
			handleMoreMenuItemClick : function(grid, rowIndex, cellIndex, menu,
					event, record) {
				var dataParams = menu.dataParams;
				me.handleRowIconClick(dataParams.view, dataParams.rowIndex,
						dataParams.columnIndex, menu, null, dataParams.record);
			}
		});

		var userMstGridDtlView = me.getUserMstGridDtlView();
		if (!Ext.isEmpty(userMstGridDtlView)) {
			userMstGridDtlView.add(userMstGrid);
			userMstGridDtlView.doLayout();
		}
	},
	handleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter, filterData) {
		var me = this;
		var arrOfParseQuickFilter = [];
		
		if(allowLocalPreference === 'Y')
			me.handleSaveLocalStorage();
		
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		
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
		
		objGroupView.handleGroupActionsVisibility(buttonMask);
		var strUrl = grid.generateUrl(url, pgSize, intNewPgNo, intOldPgNo, sorter);
		strUrl += me.getFilterUrl(subGroupInfo, groupInfo);
		
		/*if(_availableClients == 1){
			var paramName = 'clientId';
					var reqJsonInQuick = me.findInQuickFilterData(me.filterData, paramName);
					if (!Ext.isEmpty(reqJsonInQuick)) {
						var arrQuickJson = me.filterData;
						me.filterData = me.removeFromQuickArrJson(me.filterData,paramName);
					}
			}*/
			
			if(!Ext.isEmpty(me.filterData)){
				if(!Ext.isEmpty(me.filterData) && me.filterData.length >= 1){
					arrOfParseQuickFilter = generateUserFilterArray(me.filterData);
				}
			}
			
			if(arrOfParseQuickFilter) {
				me.getFilterView().updateFilterInfo(arrOfParseQuickFilter);
			}
			
		me.reportGridOrder = strUrl;
		me.disableActions(true);
		grid.loadGridData(strUrl, null, null, false);
		onUserPageLoad();
		if(undefined != gridRowSingleClick && gridRowSingleClick == 'N')
		{
			grid.on('itemdblclick', function(dataView, record, item, rowIndex,
					eventObj) {
				me.handleGridRowClick(record, grid, '');
			});
		}
		else
		{
			grid.on('cellclick', function(tableView, td, cellIndex, record, tr, rowIndex, e) {
				var clickedColumn = tableView.getGridColumns()[cellIndex];
				var columnType = clickedColumn.colType;
				if(Ext.isEmpty(columnType)) {
					var containsCheckboxCss = (clickedColumn.cls.indexOf('x-column-header-checkbox') > -1)
					columnType = containsCheckboxCss ? 'checkboxColumn' : '';
				}
				if(columnType !== 'actioncontent' && columnType !== 'checkboxColumn') {
					me.handleGridRowClick(record, grid, columnType);
				}
			});
		}
	},
	handleGridRowClick : function(record, grid, rowIndex) {
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
			me.doHandleRowActions(arrVisibleActions[0].itemId, grid, record, rowIndex);
		}
	},
	getColumns : function(arrColsPref, objWidthMap) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		arrCols.push(me.createGroupActionColumn());
		arrCols.push(me.createActionColumn());
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				if (!Ext.isEmpty(objCol.colType))
					cfgCol.colType = objCol.colType;

				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;
				if (objCol.colId === 'amount' || objCol.colId === 'count')
					cfgCol.align = 'right';

				if (objCol.colHidden === true) {
					cfgCol.hideable = true;
					cfgCol.hidden = true;
				}

				if (objCol.colId === 'assignedClients') {
					cfgCol.sortable = false;
				}

				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var maskSize = 18;
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
		if (record.raw.makerId === LOGGEDINUSER) {
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
			var submitFlag = record.raw.isSubmitted;
			var reqState = record.raw.requestState;
			retValue = retValue
					&& (reqState == 8 || submitFlag != 'Y' || reqState == 4 || reqState == 5);
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
	isRowMoreMenuVisible : function(store, record, jsonData, itmId, menu) {
		var me = this;
		if (!Ext.isEmpty(record.get('isEmpty'))
				&& record.get('isEmpty') === true)
			return false;
		var arrMenuItems = null;
		var isMenuVisible = false;
		var blnRetValue = true;
		if (!Ext.isEmpty(menu.items) && !Ext.isEmpty(menu.items.items))
			arrMenuItems = menu.items.items;

		if (!Ext.isEmpty(arrMenuItems)) {
			for (var a = 0; a < arrMenuItems.length; a++) {
				blnRetValue = me.isRowIconVisible(store, record, jsonData,
						itmId, arrMenuItems[a].maskPosition);
				isMenuVisible = (isMenuVisible || blnRetValue) ? true : false;
			}
		}
		return isMenuVisible;
	},
	replaceCharAtIndex : function(index, character, strInput) {
		return strInput.substr(0, index) + character
				+ strInput.substr(index + 1);
	},
	doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid,
			objRecord, intRecordIndex, arrSelectedRecords, jsonData) {
		var me = this;
		var buttonMask = '000000000000';
		var maskArray = new Array(), actionMask = '', objData = null;;

		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask)) {
			buttonMask = jsonData.d.__buttonMask;
		}
		var isChecker = true;
		var isDisabled = false;
		var isSubmitted = false;
		var isUserLoggedOn = false, isUserDisabled = false;
		var arrUserLoggedOn = new Array();
		
		
		maskArray.push(buttonMask);
		for (var index = 0; index < arrSelectedRecords.length; index++) {
			objData = arrSelectedRecords[index];
			maskArray.push(objData.get('__metadata').__rightsMap);
			if (objData.raw.makerId === LOGGEDINUSER) {
				isChecker = false;
			}
			if (objData.raw.validFlag != 'Y') {
				isDisabled = true;
			}
			if(objData.raw.userDisableFlag != 'N')	
				isUserDisabled  = true;			
			if (objData.raw.usrLoggedOn == 'Y')
				arrUserLoggedOn[index] = true;
			else
				arrUserLoggedOn[index] = false;
				
			if (objData.raw.isSubmitted != null
					&& objData.raw.isSubmitted == 'Y'
					&& objData.raw.requestState != 8
					&& objData.raw.requestState != 4
					&& objData.raw.requestState != 5) {
				isSubmitted = true;
			}
		}
		isUserLoggedOn = me.getLoggedInUserStatusForGroupActions(arrUserLoggedOn);
		actionMask = doAndOperation(maskArray, 12);
		me.enableDisableGroupActions(actionMask, isChecker, isDisabled,
				isSubmitted,isUserLoggedOn,isUserDisabled );
	},
	enableDisableGroupActions : function(actionMask, isChecker, isDisabled,
			isSubmitted , isUserLoggedOn , isUserDisabled) {
		var me = this;
		var objGroupView = me.getGroupView();
		var actionBar = objGroupView
				.down('toolbar[itemId="groupActionToolBar"]');
		var blnEnabled = false, blnUnlock = false, strBitMapKey = null, arrItems = new Array();
		if((isEmpty(CLIENTSSO) || CLIENTSSO == 'N' || autousrcode != 'PRODUCT') && (isUserLoggedOn && !isUserDisabled) && !isDisabled)
			blnUnlock = true;
		if (!Ext.isEmpty(actionBar) && !Ext.isEmpty(actionBar.items.items)) {
			arrItems = actionBar.items.items;
			Ext.each(arrItems, function(item) {
						strBitMapKey = parseInt(item.maskPosition,10) - 1;
						if (strBitMapKey) {
							blnEnabled = isActionEnabled(actionMask,
									strBitMapKey);
							if (item.maskPosition === 8 && blnEnabled) {
								blnEnabled = blnEnabled && isDisabled;
							} else if (item.maskPosition === 9 && blnEnabled) {
								blnEnabled = blnEnabled && !isDisabled;
							} else if (item.maskPosition === 10 && blnEnabled) {
								blnEnabled = blnEnabled
										&& (isSubmitted != undefined && !isSubmitted);
							}
							else if( item.maskPosition === 11 && blnEnabled )  //clear
							{
								blnEnabled = blnEnabled && (isEmpty(CLIENTSSO) || CLIENTSSO == 'N' || autousrcode != 'PRODUCT') && (isUserLoggedOn && !isUserDisabled)   &&  !isDisabled ;
							}
							else if( item.maskPosition === 12 && blnEnabled )  // reset
							{	
								blnEnabled = blnEnabled && (isEmpty(CLIENTSSO) || CLIENTSSO == 'N') && !isDisabled && !blnUnlock;
							}
							item.setDisabled(!blnEnabled);
						}
					});
		}
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
						itemLabel : getLabel('historyToolTip', 'View History'),
						maskPosition : 4
					}]
		};
		return objActionCol;
	},
	createGroupActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'groupaction',
			width : 120,
			locked : true,
			items : [{
						text : getLabel('userMstActionSubmit', 'Submit'),
						itemId : 'submit',
						actionName : 'submit',
						maskPosition : 5
					}, {
						text : getLabel('userMstActionDiscard', 'Discard'),
						itemId : 'discard',
						actionName : 'discard',
						maskPosition : 10
					}, {
						text : getLabel('userMstActionApprove', 'Approve'),
						itemId : 'accept',
						actionName : 'accept',
						maskPosition : 6
					}, {
						text : getLabel('userMstActionReject', 'Reject'),
						itemId : 'reject',
						actionName : 'reject',
						maskPosition : 7
					}, {
						text : getLabel('userMstActionEnable', 'Enable'),
						itemId : 'enable',
						actionName : 'enable',
						maskPosition : 8
					}, {
						text : getLabel('userMstActionDisable', 'Disable'),
						itemId : 'disable',
						actionName : 'disable',
						maskPosition : 9
					},
					{
						itemId : 'clearUser',								
						itemLabel : getLabel( 'userMstActionClear', 'Clear User' ),
						toolTip : getLabel( 'userMstActionClear', 'Clear User' ),
						maskPosition : 11
					},
					{
						itemId : 'resetUser',								
						itemLabel : getLabel( 'userMstActionReset', 'Reset User' ),
						toolTip : getLabel( 'userMstActionReset', 'Reset User' ),
						maskPosition : 12
					}
					
					]
		};
		return objActionCol;
	},
	searchTrasactionChange : function() {
		var me = this;
		var searchValue = me.getSearchTextField().value;
		var anyMatch = me.getMatchCriteria().getValue();
		if ('anyMatch' === anyMatch.searchOnPage) {
			anyMatch = false;
		} else {
			anyMatch = true;
		}

		var grid = me.getUserMstGrid();
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
							// populate indexes
							// array, set
							// currentIndex, and
							// replace
							// wrap matched
							// string in a span
							cellHTML = cellHTML.replace(searchRegExp, function(
											m) {
										return '<span class="xn-livesearch-match">'
												+ m + '</span>';
									});
							// restore protected
							// tags
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
	refreshData : function() {
		var me = this;
		var objGroupView = me.getGroupView();
		var grid = objGroupView.getGrid();
		if (grid) {
			grid.removeAppliedSort();
		}
		objGroupView.refreshData();
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
	generateUrlWithFilterParams : function(thisClass) {
		var filterData = this.filterData;
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
					// objValue = objValue.replace(reg, '');
					var objArray = objValue.split(',');
					if (objArray.length > 0) {
						if (objArray[0] != 'All') {
							if (isFilterApplied) {
								if (filterData[index].detailFilter
										&& filterData[index].detailFilter === 'Y') {
									strDetailUrl = strDetailUrl + ' and ';
								} else {
									// strTemp = strTemp + ' and ';
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
												+ 'validFlag'
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
				case 'statusFilterOp' :
					var objValue = filterData[index].paramValue1;
					var objArray = objValue.split(',');
					for (var i = 0; i < objArray.length; i++) {
							if( i== 0)
							strTemp = strTemp + '(';
							if(objArray[i] == 12){
								strTemp = strTemp + "(requestState eq 0 and isSubmitted eq 'Y')";
							}
							else if(objArray[i] == 14){
								strTemp = strTemp + "(requestState eq 1 and isSubmitted eq 'Y')";
							}
							else if(objArray[i] == 3){
								strTemp = strTemp + "(requestState eq 3 and validFlag eq 'Y')";
							}
							else if(objArray[i] == 11){
								strTemp = strTemp + "(requestState eq 3 and validFlag eq 'N')";
							}
							else if(objArray[i] == 15){
								strTemp = strTemp + "(requestState eq 11 and validFlag eq 'Y')";
							}
							else if(objArray[i] == 16){
								strTemp = strTemp + "(requestState eq 12 and validFlag eq 'Y')";
							}
							else if(objArray[i] == 17){
								strTemp = strTemp + "(requestState eq 13 and validFlag eq 'Y')";
							}
							else if(objArray[i] == 18){
								strTemp = strTemp + "(requestState eq 14 and validFlag eq 'Y')";
							}
							else if(objArray[i] == 0 || objArray[i] == 1){
								strTemp = strTemp + "(requestState eq "+objArray[i]+" and isSubmitted eq 'N')";
							}
							else{
								strTemp = strTemp + "(requestState eq "+objArray[i]+")";
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
					if(filterData[index].paramName == 'corporationDesc' && filterData[index].clientId != '')
					{
                        	strTemp = strTemp + 'clientId' + ' '
							+ filterData[index].operatorValue + ' ' + '\''
							+ filterData[index].clientId + '\'';
					}
					else
					{
					
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
	applySeekFilter : function() {
		var me = this;
		me.setDataForFilter();
		me.filterApplied = 'Q';
		me.refreshData();
	},
	handleClearSettings : function() {
		var me = this;
		var userMstFilterView = me.getUserMstFilterView();
		
		var statusFltId = userMstFilterView
			.down('combo[itemId=statusFltId]');
		statusFltId.reset();
		me.statusPrefCode = 'all';
		statusFltId.selectAllValues();
		if(availableClient > 1){
			var clientFilter = userMstFilterView
			.down('combo[itemId=clientCombo]');
			clientFilter.setValue('');
			me.clientCode = '';
			me.clientDesc = '';
			me.corpFilterVal = null;
			me.corpFilterDesc = null;
		}
		
		var userNameFltId = userMstFilterView
				.down('AutoCompleter[itemId=userNameFltId]');
		var userCategoryFilter = userMstFilterView
				.down('AutoCompleter[itemId=userCategoryFltId]');
		var ssoUserIdFilterItemId = userMstFilterView
		.down('AutoCompleter[itemId=ssoUserIdFilterItemId]');
		var loginIdFilterItemId = userMstFilterView
		.down('AutoCompleter[itemId=loginIdFltId]');
		
		userNameFltId.setValue("");
		userCategoryFilter.setValue("");
		ssoUserIdFilterItemId.setValue("");
		loginIdFilterItemId.setValue("");
		
		if (!Ext.isEmpty(userCategoryFilter)) {
			userCategoryFilter.cfgExtraParams = [{
						key : '$filterseller',
						value : sessionSellerCode
					},{
						key : '$filtercorporation',
						value : selectedClient
					}];
		}
		
		if (!Ext.isEmpty(userNameFltId)) {
			userNameFltId.cfgExtraParams = [{
				key : '$filterseller',
				value : sessionSellerCode
			},{
				key : '$filtercorporation',
				value : selectedClient
			}];
		}

	
		me.filterData = [];
		me.refreshData();
	},
	/*Page setting handling starts here*/
	applyPageSetting : function(arrPref,strInvokedFrom) {
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
			}else{
				me.handleClearLocalPrefernces();
				me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
						me.postHandlePageGridSetting, null, me, false);
			} 
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
					me.postHandlePageGridSetting, args, me, false);
		}else{
			me.handleClearLocalPrefernces();
			me.preferenceHandler.clearPagePreferences(me.strPageName, null,
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
				// TODO : Preferences and existing column model need to be
				// merged
				objGroupView.reconfigureGrid(gridModel);
			}else{
				window.location.reload();
			}
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
	showPageSettingPopup : function(strInvokedFrom) {
		var me = this, objData = {}, objGroupView = me.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting;
		var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeMaster;

		me.pageSettingPopup = null;

		if (!Ext.isEmpty(objPreference)) {
			objPrefData = Ext.decode(objPreference);
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
					: (USER_GENERIC_COLUMN_MODEL || '[]');

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
					if(paramName == 'clientCode' )
					{
						me.clientCode = null;
						me.clientDesc = null;						
					}
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
		
		if(strFieldName ==='corporationDesc' && !Ext.isEmpty(me.getClientComboRef())){
			me.getClientComboRef().setValue('');
		}
		
		if (strFieldName ==='userDescription' && !Ext.isEmpty(me.getUserNameFltRef())) {
			me.getUserNameFltRef().setValue('');
		}
		if (strFieldName ==='userCategory' && !Ext.isEmpty(me.getCategoryFltRef())) {
			me.getCategoryFltRef().setValue('');
		}
		if (strFieldName ==='statusFltId' && !Ext.isEmpty(me.getStatusFltRef())) {
			me.getStatusFltRef().setValue('All');
		}
		
		if(strFieldName === 'requestState'){
			var objField = me.getStatusFltRef();
			if(!Ext.isEmpty(objField)){
				objField.selectAllValues();
				me.statusPrefCode = 'all';
			}
		}
		
		if(strFieldName ==='userloginId' && !Ext.isEmpty(me.getLoginIdFltRef())){
			me.getLoginIdFltRef().setValue('');
		}
		
	},
	/* Function sets the filter Panel element values in JSON */
	setFilterParameters : function(form) {
		var me = this;
		var arrJsn = {};
		var userNameVal, statusVal, categoryVal, sellerCodeVal, corpDesc, corpVal,ssoLoginIdVal;
		var userNameFltId = null;
		var clientId = null;
		var sellerId = null;
		var userMstFilterView = me.getUserMstFilterView();

		if (Ext.isEmpty(userMstFilterView)) {
			userNameVal = me.userNamePrefCode;
			categoryVal = me.rolePrefCode;
			corpDesc = me.corpFilterDesc;
			corpVal = me.corpFilterVal;
			sellerCodeVal = sessionSellerCode;
			ssoLoginIdVal = me.ssoLoginIdPrefCode;
		} else {

			userNameFltId = userMstFilterView
					.down('combobox[itemId=userNameFltId]');

			//clientId = userMstFilterView.down('combobox[itemId=clientCodeId]');
			//sellerId = userMstFilterView.down('combobox[itemId=sellerCodeID]');

			corpDesc = me.corpFilterDesc;
			corpVal = me.corpFilterVal;

			var userCategoryFltId = userMstFilterView
					.down('combobox[itemId=userCategoryFltId]');
			
			var ssoUserIdFilterItemId = userMstFilterView
			.down('combobox[itemId=ssoUserIdFilterItemId]');

			if (!Ext.isEmpty(clientId) && !Ext.isEmpty(corpDesc)) {
				corpDesc = corpDesc.toUpperCase();
			}
			if (!Ext.isEmpty(clientId) && !Ext.isEmpty(corpVal)) {
				corpVal = corpVal.toUpperCase();
			}
			if (!Ext.isEmpty(sellerId) && !Ext.isEmpty(sellerId.getValue())) {
				sellerCodeVal = sellerId.getValue();
			}

			if (!Ext.isEmpty(userCategoryFltId)
					&& !Ext.isEmpty(userCategoryFltId.getValue())) {
				categoryVal = userCategoryFltId.getValue();
			}

			if (!Ext.isEmpty(userNameFltId)
					&& !Ext.isEmpty(userNameFltId.getValue())) {
				userNameVal = userNameFltId.getValue().toUpperCase();
			}
			
			if (!Ext.isEmpty(ssoUserIdFilterItemId)
					&& !Ext.isEmpty(ssoUserIdFilterItemId.getValue())) {
				ssoLoginIdVal = ssoUserIdFilterItemId.getValue();
			}
		}

		arrJsn['corpCode'] = corpVal;
		arrJsn['corporationDesc'] = corpDesc;
		arrJsn['sellerCode'] = sellerCodeVal;
		arrJsn['userCategory'] = categoryVal;
		arrJsn['userDescription'] = userNameVal;
		arrJsn['ssoLoginId'] = ssoLoginIdVal;

		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'filterData',
				Ext.encode(arrJsn)));
	},
	changeFilterParams : function() {
		var me = this;
		var userMstFilterView = me.getUserMstFilterView();
//		var selectedClient = null;
		
		var userCategoryFltId = userMstFilterView
		.down('AutoCompleter[itemId=userCategoryFltId]');

		if (!Ext.isEmpty(me.clientCode))
			selectedClient = me.clientCode;
		
		if (!Ext.isEmpty(userCategoryFltId)) {
			userCategoryFltId.cfgExtraParams = [{
						key : '$filtercorporation',
						value : selectedClient
					},{
						key : '$filterseller',
						value : sessionSellerCode
					}];
		}
		
		var userNameFltId = userMstFilterView
		.down('AutoCompleter[itemId=userNameFltId]');
		
		if (!Ext.isEmpty(userNameFltId)) {
			userCategoryFltId.cfgExtraParams = [{
						key : '$filtercorporation',
						value : selectedClient
					},{
						key : '$filterseller',
						value : sessionSellerCode
					}];
		}
		
		var ssoUserIdFilterItemId = userMstFilterView
		.down('AutoCompleter[itemId=ssoUserIdFilterItemId]');
		
		if (!Ext.isEmpty(userNameFltId)) {
			ssoUserIdFilterItemId.cfgExtraParams = [{
						key : '$filtercorporation',
						value : selectedClient
					},{
						key : '$filterseller',
						value : sessionSellerCode
					}];
		}
		
	},
	setFilterRetainedValues : function() {
		var me = this;
		var userMstFilterView = me.getUserMstFilterView();

		var userNameFltId = userMstFilterView
				.down('combobox[itemId=userNameFltId]');
		userNameFltId.setValue(me.userNamePrefCode);
		var clientCodesFltId;
		
		if(entity_type !== '1'){
			clientCodesFltId = userMstFilterView
				.down('combobox[itemId=clientCombo]');
			if(!Ext.isEmpty(me.clientCode)){
				clientCodesFltId.setValue(me.clientCode);
				clientCodesFltId.setRawValue(me.clientDesc);
			} else {
				me.clientCode = 'all';
			}
		}
		
		/*if (!isClientUser()) {
			clientCodesFltId = userMstFilterView
					.down('combobox[itemId=clientAutoCompleter]');
			 if (undefined != sessionCorporationDesc
					&& sessionCorporationDesc != '') {
				clientCodesFltId.store.loadRawData({
							"d" : {
								"preferences" : [{
											"CODE" : sessionCorporation,
											"DESCR" : sessionCorporationDesc
										}]
							}
						});

				clientCodesFltId.suspendEvents();
				clientCodesFltId.setValue(sessionCorporation);
				clientCodesFltId.resumeEvents();
				me.clientCode = sessionCorporation;
				me.clientDesc = sessionCorporationDesc;
			} else {
				me.clientCode = 'all';
			}

		} else {
			clientCodesFltId = userMstFilterView
					.down('combo[itemId="clientBtn"]');
			if (undefined != sessionCorporationDesc
					&& sessionCorporationDesc != '') {
				clientCodesFltId.setRawValue(sessionCorporationDesc);
				me.clientCode = sessionCorporation;
			} else {
				clientCodesFltId.setRawValue(getLabel('allCompanies',
						'All Companies'));
				me.clientCode = 'all';
			}
		} */

		var userCategoryFltId = userMstFilterView
				.down('combobox[itemId=userCategoryFltId]');
		userCategoryFltId.setValue(me.rolePrefCode);
		
		var userLoginIdFltId = userMstFilterView
		.down('combobox[itemId=loginIdFltId]');
		userLoginIdFltId.setValue(me.loginIdPrefCode);

		var ssoUserIdFilterItemId = userMstFilterView
		.down('combobox[itemId=ssoUserIdFilterItemId]');
		ssoUserIdFilterItemId.setValue(me.ssoLoginIdPrefCode);
		me.setDataForFilter();
	},

	setInfoTooltip : function() {
		var me = this;
		var infotip = Ext.create('Ext.tip.ToolTip', {
					// target : 'userMstFilterView-1027_header_hd-textEl',
					target : 'imgFilterInfo',
					listeners : {
						// Change content dynamically depending on which element
						// triggered the show.
						beforeshow : function(tip) {
							var client = '';
							var userName = '';
							var role = '';
							var userMstFilterView = me.getUserMstFilterView();

							var userNameFltId = userMstFilterView
									.down('combobox[itemId=userNameFltId]');

							var roleFltId = userMstFilterView
									.down('combobox[itemId=userCategoryFltId]');
							var userStatusFltId = userMstFilterView
									.down('combobox[itemId=userMstStatusFltId]');

							if (!Ext.isEmpty(userStatusFltId)
									&& !Ext.isEmpty(userStatusFltId.getValue())) {
								status = userStatusFltId.getRawValue();
							} else {
								status = getLabel('all', 'All');
							}

							if (!Ext.isEmpty(userNameFltId)
									&& !Ext.isEmpty(userNameFltId.getValue())) {
								userName = userNameFltId.getValue();
							} else {
								userName = getLabel('none', 'None');
							}
							if (!Ext.isEmpty(roleFltId)
									&& !Ext.isEmpty(roleFltId.getValue())) {
								role = roleFltId.getValue();
							} else {
								role = getLabel('none', 'None');
							}
							client = (me.clientDesc != '')
									? me.clientDesc
									: getLabel('allcompanies', 'All Companies');

							tip.update(getLabel('coporation', 'Company Name')
									+ ' : ' + client + '<br/>'
									+ getLabel('userName', 'User Name') + ' : '
									+ userName + '<br/>'
									+ getLabel('role', 'Role') + ' : ' + role
									+ '<br/>' + getLabel('status', 'Status')
									+ ' : ' + status + '<br/>');
						}
					}
				});
	},
	
	handleClientChangeInQuickFilter : function(isSessionClientFilter) {
		var me = this;
		if (isSessionClientFilter)
			me.corpFilterVal  = selectedFilterClient;
		else
			me.corpFilterVal= isEmpty(selectedClient)
		      
					? 'all'
					: selectedClient;
		me.corpFilterDesc = selectedFilterClientDesc;
		me.filterApplied = 'Q';
		me.setDataForFilter();
		if (me.corpFilterVal == 'all') {
			me.refreshData();
		} else {
			me.applyQuickFilter();
		}
	},
	applyQuickFilter : function() {
		var me = this;
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();		
		var groupInfo = groupView.getGroupInfo() || '{}';
		var subGroupInfo = groupView.getSubGroupInfo() || {};
		me.filterApplied = 'Q';
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
					store.sorters);
			strUrl = strUrl + me.getFilterUrl(subGroupInfo, groupInfo)+'&'+csrfTokenName+'='+csrfTokenValue;
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
		}
	},
	
	handleAddNewUserTT : function(actionName) {
		var me = this;
		var strCorpCode = ' ' , strCorpDesc =' ' ;
		
		if (!Ext.isEmpty(me.corpFilterVal) && me.corpFilterVal != undefined)
				strCorpCode = me.corpFilterVal;
		if (!Ext.isEmpty(me.corpFilterDesc) && me.corpFilterDesc != undefined)
			strCorpDesc = me.corpFilterDesc;
		
		if(actionName === 'btnEdit'){
			var strUrl = "editUserManager.form";
		}
		else if(actionName === 'btnView'){
			var strUrl = "viewUserManager.form";
		}
		var form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'selectedSeller', me.sellerFilterVal));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'selectedCorpCode', strCorpCode));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'selectedCorpDesc', !isEmpty(strCorpCode) ?  strCorpDesc : ''));
		form.action = strUrl;
		
		me.setFilterParameters(form);
		
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	handleAddNewUserTTT : function() {
		var me = this;
		var strCorpCode = ' ' , strCorpDesc =' ' ;
		
		if (!Ext.isEmpty(me.corpFilterVal) && me.corpFilterVal != undefined)
				strCorpCode = me.corpFilterVal;
		if (!Ext.isEmpty(me.corpFilterDesc) && me.corpFilterDesc != undefined)
			strCorpDesc = me.corpFilterDesc;
		
		var strUrl = "addUserManager.form";
		var form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'selectedSeller', me.sellerFilterVal));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'selectedCorpCode', strCorpCode));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'selectedCorpDesc', !isEmpty(strCorpCode) ?  strCorpDesc : ''));
		form.action = strUrl;
		
		me.setFilterParameters(form);
		
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	downloadReport : function(actionName) {
		var me = this;
		var withHeaderFlag = document.getElementById('headerCheckbox').checked;
		var arrExtension = {
			downloadXls : 'xls',
			downloadCsv : 'csv',
			downloadPdf : 'pdf',
			downloadTsv : 'tsv'
		};
		var currentPage = 1;
		var strExtension = '', strUrl = '', strSelect = '', strFilterUrl = '';
		
		
		
		var grid = null, count = 0, objOfSelectedGridRecord = null, objOfGridSelected = null;
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
				arrSelectedrecordsId.push(objOfSelectedGridRecord[i].data.identifier);
			}
		}

		strExtension = arrExtension[actionName];
		strUrl = 'services/userMasterListReport.' + strExtension;
		strUrl += '?$skip=1';
		var objGroupView = me.getGroupView();
		var groupInfo = objGroupView.getGroupInfo();
		var subGroupInfo = objGroupView.getSubGroupInfo();
		strUrl += me.getFilterUrl(subGroupInfo, groupInfo);
		
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
		
		var viscols;
		var visColsStr = "";
		var grid = null;
		var objGroupView = me.getGroupView();

		if (!Ext.isEmpty(objGroupView)) {
			var colMap = new Object();
			var colArray = new Array();
			if (!Ext.isEmpty(objGroupView))
				grid = objGroupView.getGrid();
			if (!Ext.isEmpty(grid)) {
				viscols = grid.getAllVisibleColumns();
				var col = null;

				for (var j = 0; j < viscols.length; j++) {
					col = viscols[j];
					if (col.dataIndex && arrSortColumnReport[col.dataIndex]) {
						if (colMap[arrSortColumnReport[col.dataIndex]]) {
							// ; do nothing
						} else {
							colMap[arrSortColumnReport[col.dataIndex]] = 1;
							colArray.push(arrSortColumnReport[col.dataIndex]);
						}
					}
				}
			}
			if (colMap != null) {
				visColsStr = visColsStr + colArray.toString();
				strSelect = '&$select=[' + colArray.toString() + ']';
			}
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
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'txtCurrent', currentPage));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'visColsStr', visColsStr));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'txtCSVFlag', withHeaderFlag));
		for(var i=0; i<arrSelectedrecordsId.length; i++){
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'identifier',
					arrSelectedrecordsId[i]));
		}	
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	
	/*Preference Handling:start*/
	updateConfig : function() {
		var me = this,arrJsn=new Array();
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		var data = me.objLocalData.d.preferences.tempPref.quickFilterJson;
		for(var i = 0; i < data.length; i++){
			if(data[i].paramName === "userloginId")
				me.loginIdPrefCode = data[i].displayValue1;
			else if(data[i].paramName === "userDescription")
				me.userNamePrefCode= data[i].displayValue1;
			else if(data[i].paramName === "userCategory")
				me.rolePrefCode = data[i].displayValue1;
			else if(data[i].paramName === "requestState"){
				me.statusPrefCode = data[i].paramValue1;	
				me.statusPrefDesc = data[i].displayValue1;
			}
			else if(data[i].paramName === 'userssologinId')
				me.ssoLoginIdPrefCode = data[i].paramValue1;
			else if (data[i].paramName === "corporationDesc") {
				me.clientCode = data[i].clientId;
				me.clientDesc = data[i].displayValue1;
				me.corpFilterVal = me.clientCode; 
				me.corpFilterDesc = me.clientDesc; 
				selectedClient = me.clientCode; 
			}
		}
//				me.filterData = me.getQuickFilterQuery(me.userNamePrefCode,me.rolePrefCode,me.ssoLoginIdPrefCode,me.statusPrefCode,me.loginIdPrefCode,me.filterData);
	},
	handleSavePreferences : function()
	{
		var me = this;
		if($("#savePrefMenuBtn").attr('disabled')) 
			event.preventDefault();
		else{
			var arrPref = me.getPreferencesToSave(false);
			if (arrPref) {
					me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
					me.postHandleSavePreferences, null, me, true);
					}
			me.disablePreferencesButton("savePrefMenuBtn",true);
			me.disablePreferencesButton("clearPrefMenuBtn",false);
		}
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
		if($("#clearPrefMenuBtn").attr('disabled')) 
			event.preventDefault();
		else{
			me.preferenceHandler.clearPagePreferences(me.strPageName, null,
			me.postHandleClearPreferences, null, me, true);
			me.disablePreferencesButton("savePrefMenuBtn",false);
			me.disablePreferencesButton("clearPrefMenuBtn",true);	
		}	
	},
	postHandleClearPreferences : function(data, args, isSuccess) {
		var me = this;						
	},
	getFilterPreferences : function() {
		var me = this;
		var objFilterPref = {};
		var objQuickFilterPref = {};
		var userNameVal = null, statusVal = null,categoryVal=null,statusDesc=null,ssoLoginIdVal=null,loginIdVal=null;
		var userMstFilterView = me.getUserMstFilterView();
		
		if(!Ext.isEmpty(userMstFilterView)){
			var userNameFltId = userMstFilterView.down('combobox[itemId=userNameFltId]');
			var userCategoryFltId = userMstFilterView.down('combobox[itemId=userCategoryFltId]');
			var userStatusFltId = userMstFilterView.down('combobox[itemId=userMstStatusFltId]');
			var ssoUserIdFilterItemId = userMstFilterView.down('combobox[itemId=ssoUserIdFilterItemId]');
			var loginIdFilterItemId = userMstFilterView.down('combobox[itemId=loginIdFltId]');
			if (!Ext.isEmpty(userNameFltId)&& !Ext.isEmpty(userNameFltId.getValue())) {
				userNameVal = userNameFltId.getValue().toUpperCase();
			}

			if (!Ext.isEmpty(userStatusFltId)&& !Ext.isEmpty(userStatusFltId.getValue())
					&& "ALL" != userStatusFltId.getValue().toUpperCase()) {
				statusVal = userStatusFltId.getValue();
				statusDesc=userStatusFltId.getRawValue();
			}

			if (!Ext.isEmpty(userCategoryFltId)&& !Ext.isEmpty(userCategoryFltId.getValue())) {
				categoryVal = userCategoryFltId.getValue();
			}
			
			if (!Ext.isEmpty(ssoUserIdFilterItemId)&& !Ext.isEmpty(ssoUserIdFilterItemId.getValue())) {
				ssoLoginIdVal = ssoUserIdFilterItemId.getValue().toUpperCase();
			}
			
			if (!Ext.isEmpty(loginIdFilterItemId)&& !Ext.isEmpty(loginIdFilterItemId.getValue())) {
				loginIdVal = loginIdFilterItemId.getValue().toUpperCase();
			}
		}else{
			userNameVal=me.userNamePrefCode;
			roleVal=me.rolePrefCode;
			statusVal=me.statusPrefCode;	
			statusDesc=	me.statusPrefDesc;
			ssoLoginIdVal=me.ssoLoginIdPrefCode;
			loginIdVal = me.loginIdPrefCode;
		}
		objQuickFilterPref.userNameVal=userNameVal;
		objQuickFilterPref.roleVal=categoryVal;
		objQuickFilterPref.statusVal = statusVal;
		objQuickFilterPref.statusDesc=statusDesc;
		objQuickFilterPref.ssoLoginIdVal=ssoLoginIdVal;
		objQuickFilterPref.loginIdVal=loginIdVal;
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
	getLoggedInUserStatusForGroupActions : function(arrRecords) {
	var isEnabled = true, i = 0;
	for (i = 0; i < arrRecords.length; i++)
		isEnabled = isEnabled && arrRecords[i];
	return arrRecords.length > 0 ? isEnabled : false;
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
		if (objPreference || objSaveLocalStoragePref) {
			objJsonData = Ext.decode(objPreference);
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
