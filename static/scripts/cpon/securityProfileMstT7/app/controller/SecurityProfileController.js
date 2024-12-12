Ext.define('GCP.controller.SecurityProfileController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.ux.gcp.PreferencesHandler','Ext.ux.gcp.PageSettingPopUp'],
	views : ['GCP.view.SecurityProfileView',
			'GCP.view.SecurityProfileGridView', 'GCP.view.HistoryPopup','GCP.view.SecurityProfileFilterView'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'securityProfileView',
				selector : 'securityProfileView'
			}, {
				ref : 'createNewToolBar',
				selector : 'securityProfileView securityProfileGridView toolbar[itemId="btnCreateNewToolBar"]'
			}, {
				ref : 'specificFilterPanel',
				selector : 'securityProfileView securityProfileFilterView panel[itemId="specificFilter"]'
			}, {
				ref : 'securityProfileFilterView',
				selector : 'securityProfileFilterView'
			}, {
				ref : 'clientSetupGridView',
				selector : 'securityProfileView securityProfileGridView'
			}, {
				ref : 'clientSetupDtlView',
				selector : 'securityProfileView securityProfileGridView panel[itemId="clientSetupDtlView"]'
			}, {
				ref : 'gridHeader',
				selector : 'securityProfileView securityProfileGridView panel[itemId="clientSetupDtlView"] panel[itemId="gridHeader"]'
			}, {
				ref : 'clientSetupGrid',
				selector : 'securityProfileView securityProfileGridView grid[itemId="gridViewMstId"]'
			}, {
				ref : 'searchTextInput',
				selector : 'securityProfileGridView textfield[itemId="searchTextField"]'
			}, {
				ref : 'matchCriteria',
				selector : 'securityProfileGridView radiogroup[itemId="matchCriteria"]'
			}, {
				ref : 'grid',
				selector : 'securityProfileGridView smartgrid'
			}, {
				ref : "corporationFilter",
				selector : 'securityProfileView securityProfileFilterView textfield[itemId="corporationFilter"]'
			}, {
				ref : "clientFilter",
				selector : 'securityProfileView securityProfileFilterView textfield[itemId="clientFilter"]'
			}, {
				ref : "statusFilter",
				selector : 'securityProfileView securityProfileFilterView combobox[itemId="statusFilter"]'
			}, {
				ref : 'groupActionBar',
				selector : 'securityProfileView securityProfileGridView securityProfileActionBarView'
			}, {
				ref : 'brandingPkgListLink',
				selector : 'securityProfileView toolbar[itemId="btnActionToolBar"] button[itemId="btnBrandingPkgList"]'
			}, {
				ref : 'clientListLink',
				selector : 'securityProfileView toolbar[itemId="btnActionToolBar"] button[itemId="btnClientList"]'
			}, {
				ref : 'clientNamesFltId',
				selector : 'securityProfileView securityProfileFilterView combo[itemId=clientNamesFltId]'
			}, {
				ref : 'securityFilterCombo',
				selector : 'securityProfileFilterView AutoCompleter[itemId=profileNameFltId]'
			},
			{
				ref : 'clientInlineBtn',
				selector : 'approvalWorkflowView approvalWorkflowFilterView button[itemId="clientBtn"]'
			},
			{
				ref : 'groupView',
				selector : 'securityProfileGridView groupView'
			},
			{
				ref:'filterView',
				selector:'filterView'	
			},{
				ref : 'statusFilterRef',
				selector : 'securityProfileFilterView combo[itemId="securityStatusFilter"]'
			}
			],
	config : {
		selectedMst : 'client',
		clientListCount : 0,
		clientCode : '',
		clientDesc : '',
		brandingPkgListCount : 0,
		filterData : [],
		copyByClicked : '',
		sellerOfSelectedClient : '',
		strDefaultMask : '000000000000000000',
		strPageName:'securityProfile',
		preferenceHandler : null,
		isProfileName : false,
		oldProfileName : '',
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
		me.clientCode = $("#summaryClientFilterSpan").val();
		me.clientDesc = $("#summaryClientFilterSpan").text();
		me.updateConfig();
		$(document).on("handleAddNewSecurityProfile",function(){
			me.handleAddNewSecurityProfile();
		});
		
		$(document).on('handleClientChangeInQuickFilter',function(isSessionClientFilter) {
			me.disablePreferencesButton("savePrefMenuBtn",false);
			me.disablePreferencesButton("clearPrefMenuBtn",false);			
			me.handleClientChangeInQuickFilter(isSessionClientFilter);
			me.changeFilterParams();
        });
		$(document).on('savePreference', function(event) {		
			me.handleSavePreferences();
		});
		$(document).on('clearPreference', function(event) {
			me.handleClearPreferences();
		});
		$(document).on('performPageSettings', function(event) {
			me.showPageSettingPopup();
		});
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

		me.control({
			'pageSettingPopUp' : {
				'applyPageSetting' : function(popup, data) {
					me.applyPageSetting(data);
				},
				'savePageSetting' : function(popup, data, strInvokedFrom) {
					me.savePageSetting(data, strInvokedFrom);
				},
				'restorePageSetting' : function(popup) {
					me.restorePageSetting();
				}
			},
			'securityProfileView securityProfileGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateClient"]' : {
				click : function() {
					me.handleClientEntryAction(true);
				}
			},
			'securityProfileFilterView' : {
				'render' : function() {
					if (!Ext.isEmpty(modelSelectedMst))
						me.selectedMst = modelSelectedMst;
					var useSettingsButton = me.getFilterView()
					.down('button[itemId="useSettingsbutton"]');
					if (!Ext.isEmpty(useSettingsButton)) {
						useSettingsButton.hide();
					}
					
					var advFilter= me.getFilterView().down('label[itemId="createAdvanceFilterLabel"]');
					if (!Ext.isEmpty(advFilter)) {
						advFilter.hide();
					}
					
					me.setInfoTooltip();
					// me.handleSpecificFilter();
				},
				/*'handleClientChange' : function(strClientId,
							strClientDescr, strSellerId){
					me.sellerOfSelectedClient = strSellerId;
					me.clientCode = strClientId;
					me.clientDesc = strClientDescr;						
					me.setDataForFilter();
					me.applyFilter();
					me.changeFilterParams();
				},*/				
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				},afterrender:function(){
					me.setFilterRetainedValues();
				}
			},
			'securityProfileView securityProfileGridView panel[itemId="clientSetupDtlView"]' : {
				render : function() {
					if (!Ext.isEmpty(modelSelectedMst))
						me.selectedMst = modelSelectedMst;
					me.handleGridHeader();
					Ext.Ajax.request({
						url : 'cpon/securityProfileMst/totalListCount.json',
						method : 'POST',
						success : function(response) {
							var data = Ext.decode(response.responseText);
							me.clientListCount = data.ClientListCount;
							me.brandingPkgListCount = data.BrandingPackageListCount;
							me.handleGridHeader();
						},
						failure : function(response) {
							// console.log("Ajax Get data Call Failed");
						}

					});

				}
			},
			'securityProfileView toolbar[itemId="btnActionToolBar"] button[itemId="btnClientList"]' : {
				click : function() {
				//	me.filterData = [];
					me.showClientList();
					me.handleSpecificFilter();
					me.handleGridHeader();
				}
			},
			'securityProfileGridView' : {
				render : function(panel) {
			//		me.handleSmartGridConfig();
				//	me.setFilterRetainedValues();   // Remove comment later
				}
			},
			'securityProfileGridView textfield[itemId="searchTextField"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'securityProfileGridView radiogroup[itemId="matchCriteria"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
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
			/*'securityProfileGridView smartgrid' : {
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
			},*/
			'securityProfileGridView groupView' : {
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
				'gridRender' : me.handleLoadGridData,
				'gridPageChange' : me.handleLoadGridData,
				'gridSortChange' : me.handleLoadGridData,
				'gridPageSizeChange' : me.handleLoadGridData,
				'gridColumnFilterChange' : me.handleLoadGridData,
				'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,
				'gridStateChange' : function(grid) {
					me.disablePreferencesButton("savePrefMenuBtn",false);
				},
				'gridRowActionClick' : function(grid, rowIndex, columnIndex,
						actionName, record) {
					me.doHandleRowActions(actionName, grid, record,rowIndex);
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
				afterrender : function(panel,opts){
					me.setDataForFilter();
				//	me.setFilterRetainedValues();
				}
			},
			'copyByClientPopupView smartgrid' : {
				render : function(grid) {
					me.handleCopuByClientLoadGrid(grid, grid.store.dataUrl,
							grid.pageSize, 1, 1, null);
				},
				gridPageChange : me.handleCopuByClientLoadGrid,
				gridSortChange : me.handleCopuByClientLoadGrid
			},
			'securityProfileGridView toolbar[itemId=securityProfileActionBarView_clientDtl]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			},
			'securityProfileFilterView AutoCompleter[itemId=profileNameFltId]' : {
				select : function(combo, opts) {
					me.setDataForFilter();
					me.applyFilter();
					me.isProfileName = true;
				},
				change : function(combo, newValue, oldValue, eOpts) {
					me.oldProfileName = oldValue;
					if (newValue == '' || null == newValue) {
						me.setDataForFilter();
						me.applyFilter();
						me.isProfileName = true;
					}
				},
				keyup : function(combo, e, eOpts){
					me.isProfileName = false;
				},
				blur : function(combo, record){
					if (me.isProfileName == false && me.oldProfileName != combo.getRawValue()){
						me.applySeekFilter();
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);		
					}
					me.oldProfileName = combo.getRawValue();
				}
			},
			'securityProfileFilterView  combo[itemId="securityStatusFilter"]' : {
				'select' : function(combo,selectedRecords) {
					combo.isQuickStatusFieldChange = true;
				},
				'blur':function(combo,record){
					if(combo.isQuickStatusFieldChange)
						me.handleStatusFilterClick(combo);
				}
			}
		});
	},
	applySeekFilter : function() {
		var me = this;
		me.setDataForFilter();
		me.filterApplied = 'Q';
		me.refreshData();
	},
	handleStatusFilterClick : function(combo) {
		var me = this;
		combo.isQuickStatusFieldChange = false;
		me.statusPrefCode = combo.getSelectedValues();
		me.statusPrefDesc = combo.getRawValue();
		me.setDataForFilter();
		me.applyFilter();
	},
	handleAddNewSecurityProfile : function() {
		var me = this;
		var strCorpCode = ' ' , strCorpDesc =' ' ;
		
		if (!Ext.isEmpty(me.clientCode) && me.clientCode != undefined && me.clientCode != 'all')
				strCorpCode = me.clientCode;
		if (!Ext.isEmpty(me.clientDesc) && me.clientDesc != undefined && me.clientDesc != getLabel('allCompanies','All Companies'))
			strCorpDesc = me.clientDesc;
		
		var strUrl = "addsecurityProfileMst.form";
		var form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'selectedSeller', me.sellerOfSelectedClient));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'selectedCorpCode', strCorpCode));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'selectedCorpDesc', strCorpDesc));
		form.action = strUrl;
		
		me.setFilterParameters(form);
		
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	 handleClientChangeInQuickFilter : function(isSessionClientFilter) {
		var me = this;
		me.clientCode = selectedFilterClient;
		me.clientDesc = selectedFilterClientDesc;// combo.getRawValue();
		quickFilterClientValSelected = me.clientCode;
		quickFilterClientDescSelected =  me.clientCode;
		me.filterApplied = 'Q';
		me.setDataForFilter();
		if (me.clientCode === 'all') {
			me.filterApplied = 'ALL';
			me.refreshData();

		} else {
			me.applyFilter();
			
		}
	},		
		handleClearSettings:function() {
		var me=this;
		var securityProfileFilterView = me.getSecurityProfileFilterView();
		/* if(!isClientUser()){
				clientFilterId=securityProfileFilterView.down('AutoCompleter[itemId="clientAutoCompleter"]');			
				me.clientCode = "";
				me.clientDesc = "";		
				clientFilterId.suspendEvents();
				clientFilterId.reset();
				clientFilterId.resumeEvents();
		}else{
			clientFilterId=securityProfileFilterView.down('combo[itemId="clientBtn"]');
			me.clientDesc=getLabel('allCompanies', 'All companies');
			me.clientCode='all';
			clientFilterId.setRawValue(getLabel('allCompanies', 'All companies'));	
		} */
		var profileNameFltId = securityProfileFilterView
				.down('AutoCompleter[itemId=profileNameFltId]');
		
		profileNameFltId.setValue("");
		profileNameFltId.reset();
		//me.filterData=[];
		if(isClientUser()) {
			if(getClientData().length !== 1) {
				var clientCombo = me.getFilterView().down("combo[itemId='clientCombo']");
				clientCombo.setValue("All Companies");
				changeClientAndRefreshGrid('all', 'All Companies');
			}
		} else {
			// $("#summaryClientFilter").val("");
			var clientAutocompleter = me.getFilterView().down("combo[itemId='clientComboAuto']");
			clientAutocompleter.setRawValue("");
			me.clientCode = "";
			me.clientDesc = "";
			me.filterData=[];
		}
		var statusFltId = me.getFilterView()
		.down('combo[itemId=securityStatusFilter]');
		statusFltId.reset();
		me.statusPrefCode = 'all';
		statusFltId.selectAllValues();
		me.refreshData();
	},
   	doHandleGroupByChange : function(menu, groupInfo) {
		var me = this;
		if (me.previouGrouByCode === 'ADVFILTER') {
			me.savePrefAdvFilterCode = null;
			me.showAdvFilterCode = null;
			me.filterApplied = 'ALL';
		}
		if (groupInfo && groupInfo.groupTypeCode === 'ADVFILTER') {
//			me.previouGrouByCode = groupInfo.groupTypeCode;
		} 
//			me.previouGrouByCode = null;
	},
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) {
		var me = this;
		var objGroupView = me.getGroupView();
		var strModule='',args=null;
		groupInfo = groupInfo || {};
		subGroupInfo = subGroupInfo || {};
		if (groupInfo && groupInfo.groupTypeCode) {
			if (groupInfo.groupTypeCode === 'SECPRFMST_OPT_STATUS') {
				strModule = subGroupInfo.groupCode;
			} else {
				strModule = groupInfo.groupTypeCode
			}
			args = {
				'module' : strModule
			};
			me.preferenceHandler.readModulePreferences(me.strPageName,
					strModule, me.postHandleGroupTabChange, args, me, true);
		} else {
			objGroupView.reconfigureGrid(null);
		}	
	},
	postHandleGroupTabChange : function(data, args) {
		var me = this;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getClientSetupGridView(), objPref = null, gridModel = null, intPgSize = null,showPager = true, heightOption = null;
		var colModel = null, arrCols = null;
		if (data && data.preference) {
			objPref = Ext.decode(data.preference);
			arrCols = objPref.gridCols || null;
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
			}
		}
		objGroupView.reconfigureGrid(gridModel);
	},
	handleSpecificFilter : function() {
		var me = this;
		me.getSearchTextInput().setValue('');
		// me.getStatusFilter().setValue('');

		// filterPanel.add();

		var filterPanel = me.getSpecificFilterPanel();
		if (!Ext.isEmpty(filterPanel)) {
			filterPanel.removeAll();
		}
		filterPanel.columnWidth = 0.56;

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

		{
			// gridHeaderPanel.setTitle(getLabel('securityProfileList',
			// 'Security Profile List')+' '+ '(' + me.clientListCount + ')');
			this.getClientSetupDtlView().setTitle(getLabel(
					'securityProfileList', 'Security Profile List')
					+ ' ' + '(' + me.clientListCount + ')');
		/*	createNewPanel.add({
						xtype : 'button',
						border : 0,
						text : getLabel('craeteSecurityProfile',
								'Create New Security Profile'),
						glyph : 'xf055@fontawesome',
						cls : 'ux_font-size14 xn-content-btn ux-button-s ',
						parent : this,
						// padding : '4 0 2 0',
						itemId : 'btnCreateClient'
					});*/
		}

	},

	showClientList : function(btn, opts) {
		var me = this;
		me.selectedMst = 'client';
		me.handleSmartGridConfig();
	},
	// loading coied by popup grid data
	handleCopuByClientLoadGrid : function(grid, url, pgSize, newPgNo, oldPgNo,
			sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		if (!Ext.isEmpty(me.copyByClicked)) {
			strUrl = strUrl + '&qfilter=' + me.copyByClicked;
		}
		grid.loadGridData(strUrl, null);
	},
	handleLoadGridData : function(groupInfo, subGroupInfo,grid, url, pgSize, newPgNo, oldPgNo, sorter,filterData) {
		var me = this;
		var arrOfParseQuickFilter = [];
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		//strUrl = strUrl + me.getFilterUrl();
		strUrl += me.getFilterUrl(subGroupInfo, groupInfo);
	//	grid.setLoading(true);
		me.disableActions(true);
		
		if(!Ext.isEmpty(me.filterData))
		{
			if(!Ext.isEmpty(me.filterData) && me.filterData.length >= 1) {
				arrOfParseQuickFilter = generateFilterArray(me.filterData);
			}
		}
		if(arrOfParseQuickFilter) {
			
			if(isClientUser() && getClientData().length === 1) {
				
				var clientCodeFilterIndex = -1;
				
				arrOfParseQuickFilter.forEach(function(appliedFilterObjItem, appliedFilterObjIndex) {
					if(appliedFilterObjItem.fieldId === "clientCode") clientCodeFilterIndex = appliedFilterObjIndex;
				});
				
				if(clientCodeFilterIndex !== -1) arrOfParseQuickFilter.splice(clientCodeFilterIndex, 1);
			}
			
			me.getFilterView().updateFilterInfo(arrOfParseQuickFilter);
		}
		
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
	getFilterUrl : function(subGroupInfo, groupInfo) {
		var me = this;
		var strQuickFilterUrl = '';
		var strUrl = '';
		var isFilterApplied = false;
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
		else{
				if (!Ext.isEmpty(strQuickFilterUrl))
					strQuickFilterUrl = '&$filter=' + strQuickFilterUrl;
			}
			
		return strQuickFilterUrl;
	},		
		
	generateUrlWithFilterParams : function(thisClass) {		
		var filterData = thisClass.filterData;
		var strFilter = '&$filter=';
		var strTemp = '';
		var strFilterParam = '';
		var isFilterApplied = false;
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
		
		return strTemp;
	
	},

	setDataForFilter : function() {
		var me = this;
		me.filterData = this.getFilterQueryJson();
	},
	getFilterQueryJson : function() {
		var me = this;
		var sellerVal = null, receiverNameVal = null, clientCodeVal = null, jsonArray = [];
		var statusFilterVal = me.statusPrefCode;
 		var statusFilterDisc = me.statusPrefDesc;
		var clientSetupFilterView = me.getSecurityProfileFilterView();
		if(Ext.isEmpty(clientSetupFilterView))
		{
			receiverNameVal = strSecPrfName;
		}
		else
		{
		var receiverNameFltId = clientSetupFilterView
				.down('AutoCompleter[itemId=profileNameFltId]');           
			if (!Ext.isEmpty(receiverNameFltId)
				&& !Ext.isEmpty(receiverNameFltId.getValue())) {
			receiverNameVal = receiverNameFltId.getValue();
			}
		}
		if (!Ext.isEmpty(me.sellerOfSelectedClient) && me.sellerOfSelectedClient != '') {
			sellerVal = me.sellerOfSelectedClient;
		}else
		{
			sellerVal = '';//strSellerId;		
		}
		
		if (!Ext.isEmpty(receiverNameVal)) {
			jsonArray.push({
						paramName : 'profileName',
						paramValue1 : encodeURIComponent(receiverNameVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'lk',
						dataType : 'S',
						paramFieldLable : getLabel('securityProfile', 'Security Profile'),
						displayType : 5,
						displayValue1 : receiverNameVal
					});
		}	
		if (!Ext.isEmpty(sellerVal)) {
			jsonArray.push({
						paramName : 'seller',
						paramValue1 : encodeURIComponent(sellerVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S',
						paramFieldLable : getLabel('financialinstitution', 'Seller'),
						displayType : 5,
						displayValue1 : sellerVal
					});
		}
		
	
			clientParamName = 'clientCode';
			clientNameOperator = 'eq';
			clientCodeVal = me.clientCode;
			if (!Ext.isEmpty(clientCodeVal) && clientCodeVal != 'all') {
				jsonArray.push({
							paramName : clientParamName,
							paramValue1 : encodeURIComponent(clientCodeVal.replace(new RegExp("'", 'g'), "\''")),
							operatorValue : clientNameOperator,
							dataType : 'S',
							paramFieldLable : getLabel('lblcompany', 'Company Name'),
							displayType : 5,
							displayValue1 : me.clientDesc
						});
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
	resetAllFilters : function() {
		var me = this;	
		if (!Ext.isEmpty(me.getClientNamesFltId())) {
			me.getClientNamesFltId().setValue('');
		}
		if (!Ext.isEmpty(me.getSecurityFilterCombo())) {
			me.getSecurityFilterCombo().setValue('');
			me.getSecurityFilterCombo().setRawValue('');
		}
		return;
	},
	changeFilterParams : function() {
		var me = this;
		var filterView = me.getSecurityProfileFilterView();		
		if(!Ext.isEmpty(filterView))
		{
				var securityProfileNameFltId = filterView
				.down('combobox[itemId=profileNameFltId]');
				if (!Ext.isEmpty(securityProfileNameFltId)) {
					securityProfileNameFltId.cfgExtraParams = new Array();
				}
				securityProfileNameFltId.cfgExtraParams.push({
								key : '$sellerId',
								value : strSellerId
							});
				if (!Ext.isEmpty(me.clientCode) && me.clientCode != 'all') {
					securityProfileNameFltId.cfgExtraParams.push({
								key : '$clientId',
								value : me.clientCode
							});
				}	
		}
	},
	applyFilter : function() {
		var me = this;
		/*var grid = me.getGrid();
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
					store.sorters);
			strUrl = strUrl + me.getFilterUrl();
			me.getGrid().setLoading(true);
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
		}*/
		var objGroupView = me.getGroupView();
		var groupInfo = objGroupView.getGroupInfo();
		me.refreshData();
	},
	refreshData : function() {
		var me = this;
		var objGroupView = me.getGroupView();
		var grid = objGroupView.getGrid();		
		objGroupView.refreshData();
	},
	/*handleSmartGridConfig : function() {
		var me = this;
		var clientGrid = me.getClientSetupGrid();
		var objConfigMap = me.getClientSetupConfiguration();
		var arrCols = new Array();
		if (!Ext.isEmpty(clientGrid))
			clientGrid.destroy(true);

		arrCols = me.getColumns(objConfigMap.arrColsPref,
				objConfigMap.objWidthMap);
		me.handleSmartGridLoading(arrCols, objConfigMap.storeModel);

	},*/

/*	handleSmartGridLoading : function(arrCols, storeModel) {
		var me = this;
		var pgSize = null;
		pgSize = 10;
		clientGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
			id : 'gridViewMstId',
			itemId : 'gridViewMstId',
			pageSize : pgSize,
			stateful : false,
			showEmptyRow : false,
			cls : 'ux_panel-transparent-background  ux_largepaddinglr ux_largepadding-bottom ux_largemargin-bottom',
			rowList : _AvailableGridSize,
			minHeight : 0,
			columnModel : arrCols,
			storeModel : storeModel,
			isRowIconVisible : me.isRowIconVisible,
			// isRowMoreMenuVisible : me.isRowMoreMenuVisible,
			handleRowMoreMenuClick : me.handleRowMoreMenuClick,

			handleRowIconClick : function(tableView, rowIndex, columnIndex,
					btn, event, record) {
				me.handleRowIconClick(tableView, rowIndex, columnIndex, btn,
						event, record);
			},

			handleMoreMenuItemClick : function(grid, rowIndex, cellIndex, menu,
					event, record) {
				var dataParams = menu.dataParams;
				me.handleRowIconClick(dataParams.view, dataParams.rowIndex,
						dataParams.columnIndex, menu, null, dataParams.record);
			}
		});

		var clntSetupDtlView = me.getClientSetupDtlView();
		clntSetupDtlView.add(clientGrid);
		clntSetupDtlView.doLayout();
	},*/

	doHandleRowActions : function(actionName, grid, record,rowIndex) {
		var me = this;
		if (actionName === 'submit' || actionName === 'accept'
				|| actionName === 'enable' || actionName === 'disable'
				|| actionName === 'reject' || actionName === 'discard')
			me.handleGroupActions(actionName, grid, [record], 'rowAction');
		else if (actionName === 'btnHistory') {
			var recHistory = record.get('history');

			if (!Ext.isEmpty(recHistory)
					&& !Ext.isEmpty(recHistory.__deferred.uri)) {
				me.showHistory(true, record.get('clientDesc'), record
								.get('history').__deferred.uri, record
								.get('identifier'));
			}

		} else if (actionName === 'btnView') {
			me.submitForm('viewsecurityProfileMst.form', record, rowIndex);
		} else if (actionName === 'btnEdit') {
			me.submitForm('editsecurityProfileMst.form', record, rowIndex);
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
		me.setFilterParameters(form);
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},

	showHistory : function(isClient, clientDesc, url, id) {
		Ext.create('GCP.view.HistoryPopup', {
					isClient : isClient,
					historyUrl : url,
					identifier : id,
					clientDesc : clientDesc
				}).show();
		Ext.getCmp('btnSecPrfHistoryPopupClose').focus();
		historyPopup.center();
	},
/*	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var maskSize = 11;
		var maskArray = new Array();
		var actionMask = '';
		var rightsMap = record.data.__metadata.__rightsMap;
		var buttonMask = '';
		var retValue = true;
		var bitPosition = '';
		if (!Ext.isEmpty(maskPosition)) {
			bitPosition = parseInt(maskPosition) - 1;
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
				cfgCol.sortable=objCol.sortable;
				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;

				cfgCol.fnColumnRenderer = me.columnRenderer;
				if ((cfgCol.colId == 'clientDesc' && userType == '0')
						|| isMultipleClientAvailable
						|| (cfgCol.colId != 'clientDesc')) {
					arrCols.push(cfgCol);
				}
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
						itemLabel : getLabel('historyToolTip', 'View History'),
						maskPosition : 4
					}]
		};
		return objActionCol;

	},
*/
/*	handleRowMoreMenuClick : function(tableView, rowIndex, columnIndex, btn,
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
*/
	doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid,
			objRecord, intRecordIndex, arrSelectedRecords, jsonData) {
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

		//var actionBar = this.getGroupActionBar();
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

	handleGroupActions : function(strAction, grid, arrSelectedRecords,
			strActionType) {
		var me = this;
		/*var strAction = !Ext.isEmpty(btn.actionName)
				? btn.actionName
				: btn.itemId;*/
		var strUrl = Ext.String
				.format('cpon/securityProfileMst/{0}.srvc', strAction);
		if (strAction === 'reject') {
			this.showRejectVerifyPopUp(strAction, strUrl,  grid,
					arrSelectedRecords, strActionType);

		} else {
			this.preHandleGroupActions(strUrl, '',  grid, arrSelectedRecords,
					strActionType, strAction);
		}

	},

	showRejectVerifyPopUp : function(strAction,strUrl, grid,
					arrSelectedRecords, strActionType) {
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
					buttonText: {
						ok: getLabel('btnOk', 'OK'),
						cancel:getLabel('btncancel', 'cancel')
					} , 
					cls:'t7-popup',
					multiline : 4,
					width: 355,
					height : 270,
					bodyPadding : 0,
					fn : function(btn, text) {
						if (btn == 'ok') {
							me
									.preHandleGroupActions(strUrl, text,grid,
											arrSelectedRecords,strActionType,strAction);
						}
					}
				});
		msgbox.textArea.enforceMaxLength = true;
		msgbox.textArea.inputEl.set({
			maxLength : 255
		});
	},

	preHandleGroupActions : function(strUrl, remark, grid, arrSelectedRecords,
			strActionType, strAction) {

		var me = this;
		var groupView = me.getGroupView();
		if (!Ext.isEmpty(groupView)) {
			var arrayJson = new Array();
			var records = (arrSelectedRecords || []);
			/*records = (!Ext.isEmpty(records) && Ext.isEmpty(record))
					? records
					: [record];*/
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
						url : strUrl+'?'+ csrfTokenName + '='+ csrfTokenValue,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) 
						{
                            var errorMessage = '';
                            var responseCount = 0;
							if (response.responseText != '[]') {
								
								var jsonData = Ext
										.decode(response.responseText);
										
								if(!Ext.isEmpty(jsonData))
						        {
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
						        		responseCount++;
						        	}
									
						           if(records.length>responseCount) groupView.refreshData();
								
								if ('' != errorMessage && null != errorMessage) {
									Ext.MessageBox.show({
										title : getLabel(
												'instrumentErrorPopUpTitle',
												'Error'),
										msg : getLabel(
												'instrumentErrorPopUpMessage',
												errorMessage),
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
								} else {	
									// TODO : Action Result handling to be done here
									groupView.refreshData();
								}
								}
							} else {	
									groupView.refreshData();
								}        
							me.enableDisableGroupActions(me.strDefaultMask);
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

/*	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";

		strRetValue = value;

		return strRetValue;
	},
*/
	getClientSetupConfiguration : function() {
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;

		objWidthMap = {
			"clientName" : 60,
			"profileName" : 100,
			"integrityCheckFlag" : 100,
			"encryptionFlag" : 65,
			"singingFlag" : 60,
			"requestStateDesc" : 100
		};

		arrColsPref = [{
					"colId" : "clientDesc",
					"colDesc" : getLabel('client', 'Company Name'),
					"sortable":true
				}, {
					"colId" : "profileName",
					"colDesc" : getLabel('securityProfile', 'Security Profile'),
					"sortable":true
				}, {
					"colId" : "integrityCheckFlag",
					"colDesc" : getLabel('integrityCheck', 'Integrity Check'),
					"sortable":true
				}, {
					"colId" : "encryptionFlag",
					"colDesc" : getLabel('encryption', 'Encryption'),
					"sortable":true
				}, {
					"colId" : "singingFlag",
					"colDesc" : getLabel('signing', 'Signing'),
					"sortable":true
				}, {
					"colId" : "requestStateDesc",
					"colDesc" : getLabel('status', 'Status'),
					"sortable":false
				}];

		storeModel = {
			fields : ['clientName', 'profileName', 'clientId', 'clientDesc',
					'integrityCheckFlag', 'encryptionFlag', 'singingFlag',
					'requestStateDesc', 'identifier', 'history', '__metadata'],
			proxyUrl : 'cpon/securityProfileMst.json',
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
	handleClientEntryAction : function(entryType) {
		var me = this;
		var form;
		var strUrl = 'addsecurityProfileMst.form';
		var brandingPkgType = null;
		var selectedClient = null;

		var clientSetupFilterView = me.getSecurityProfileFilterView();
		var selectedSeller = me.sellerOfSelectedClient;

		
		selectedClient = (me.clientCode=='all'?'':me.clientCode);

		var errorMsg = null;

		if (entryType)
			brandingPkgType = 'N';
		else
			brandingPkgType = 'Y';

		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));

		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'txtBrandingPkgType', brandingPkgType));

		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'sellerId',
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
		var securityNameVal = null;
		var arrJsn = {};
		
		var clientSetupFilterView = me.getSecurityProfileFilterView();
		
		if(Ext.isEmpty(clientSetupFilterView))
		{
			
			securityNameVal=strSecPrfName;
		}
		else
		{		
		var securityNameFltId = clientSetupFilterView
				.down('AutoCompleter[itemId=profileNameFltId]');
		//securityNameFltId.setValue(strSecPrfName);
			if (!Ext.isEmpty(securityNameFltId)
					&& !Ext.isEmpty(securityNameFltId.getValue())) {
				securityNameVal = securityNameFltId.getValue();
			}
		}
		var selectedSeller = me.sellerOfSelectedClient;
		var selectedClient = me.clientCode;
		arrJsn['sellerId'] = selectedSeller;
		arrJsn['clientId'] = selectedClient;
		arrJsn['clientDesc'] = me.clientDesc;
		arrJsn['securityPrfName'] = securityNameVal;
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'filterData',
				Ext.encode(arrJsn)));
	},
	setFilterRetainedValues : function() {
		var me = this;
		var filterView = me.getSecurityProfileFilterView();
		var securityNameFltId = filterView.down('AutoCompleter[itemId=profileNameFltId]');
		securityNameFltId.setValue(strSecPrfName);
		var statusFilter = filterView
   		.down('combo[itemId=securityStatusFilter]');
   		if(!Ext.isEmpty(me.statusPrefCode)&&!Ext.isEmpty(me.statusPrefDesc)){
   			statusFilter.store.loadRawData([{
   						"name" : me.statusPrefCode,
   						"value" : me.statusPrefDesc
   					}]
   	
   			);
   			statusFilter.setValue(me.statusPrefCode);
   			statusFilter.setRawValue(me.statusPrefDesc);
   		}
		me.changeFilterParams();
		
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
							var filterView = me.getSecurityProfileFilterView();
							var  securityProfileCombo = filterView.down('AutoCompleter[itemId=profileNameFltId]');
							var corporation = '';
							var client = '';
							var	status='';
							var securityProfile = !Ext.isEmpty(securityProfileCombo.getRawValue()) ? securityProfileCombo.getRawValue() : getLabel('none', 'None');
							var statusFltId = filterView.down('combobox[itemId=securityStatusFilter]');
							if (!Ext.isEmpty(me.getCorporationFilter())
									&& !Ext.isEmpty(me.getCorporationFilter()
											.getValue())) {
								corporation = me.getCorporationFilter()
										.getValue();
							} else {
								corporation = getLabel('none', 'None');
							}
							if(me.clientDesc)
								client = me.clientDesc;
							else
								client = getLabel('allCompanies', 'All Companies');		
							if(!Ext.isEmpty(statusFltId) && !Ext.isEmpty(statusFltId.getValue())) 								 {
								status = statusFltId.getRawValue();
							} 
							else 
							{
								status = getLabel('all', 'ALL');								
							}
							if ('client' == me.selectedMst) {
								tip.update(getLabel('client', 'Company Name')
										+ ' : '
										+ client
										+ '<br/>'
										+ getLabel('securityProfile', 'Security Profile')
										+ ' : '
										+ securityProfile
										+ '<br/>'
										+ getLabel('status','Status')
										+ ' : '
										+ status
										+ '<br/>');
							} else {
								tip.update(getLabel('client',
										'Company Name')
										+ ' : '
										+ client
										+ '<br/>'
										+ getLabel('securityProfile', 'Security Profile')
										+ ' : '
										+ securityProfile
										+ '<br/>'
										+ getLabel('status','Status')
										+ ' : '
										+ status
										+ '<br/>');
							}
						}
					}
				});
	},
	/*Preference Handling:start*/
	updateConfig : function() {
		var me = this,arrJsn=new Array();
		var statusFilterValArray = [];
		var statusFilterDiscArray = [];
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		if( !Ext.isEmpty( objSecurityProfilePref ) )
				{
					var objJsonData = Ext.decode( objSecurityProfilePref );
					var data = objJsonData.d.preferences.gridViewFilter;
					if( data != 'undefined' && !Ext.isEmpty(data))
					{
						strSecPrfName = data.quickFilter.securityNameVal;
						me.statusPrefCode = data.quickFilter.statusVal;
						me.statusPrefDesc = data.quickFilter.statusDesc;
						if(!Ext.isEmpty(data.filterSelectedClientCode) && data.filterSelectedClientCode !='all'){
							me.clientCode = data.filterSelectedClientCode;
							me.clientDesc = data.filterSelectedClientDesc;
						}		
					}	
					
				}
				
				if (!Ext.isEmpty(strSecPrfName)) {
					arrJsn.push({
								paramName : 'profileName',
								paramValue1 : encodeURIComponent(strSecPrfName.replace(new RegExp("'", 'g'), "\''")),
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
					changeClientAndRefreshGrid(me.clientCode,me.clientDesc)
				}else if(userType=='0'){
					$("#summaryClientFilter").val(me.clientFilterDesc);
					changeClientAndRefreshGrid(me.clientCode,me.clientDesc)
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
		var securityNameVal = null;
		var filterView = me.getSecurityProfileFilterView();
		var statusVal = null,statusDesc = null;
		if(Ext.isEmpty(filterView))
		{
			securityNameVal=strSecPrfName;
			statusVal = me.statusPrefCode;
			statusDesc = me.statusPrefDesc;
		}
		else
		{		
			var securityNameFltId = filterView.down('AutoCompleter[itemId=profileNameFltId]');
			if (!Ext.isEmpty(securityNameFltId)
					&& !Ext.isEmpty(securityNameFltId.getValue())) {
				securityNameVal = securityNameFltId.getValue();
			}
			var statusFltId = filterView.down('combo[itemId=securityStatusFilter]');
		}
		if (!Ext.isEmpty(statusFltId)
				&& !Ext.isEmpty(statusFltId.getValue())
				&& "ALL" != statusFltId.getValue().toUpperCase()) {
			statusVal = statusFltId.getValue();
			statusDesc = statusFltId.getRawValue();
		}
		objQuickFilterPref.statusVal = statusVal;
		objQuickFilterPref.statusDesc = statusDesc;
		objQuickFilterPref.securityNameVal =securityNameVal;
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
	
	/*Page setting handling starts here*/
	applyPageSetting : function(arrPref) {
		var me = this;
		if (!Ext.isEmpty(arrPref)) {
			me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
					me.postHandlePageGridSetting, null, me, false);
		}
	},
	savePageSetting : function(arrPref, strInvokedFrom) {
		var me = this, args = {};
		if (!Ext.isEmpty(arrPref)) {
			me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
					me.postHandleSavePageSetting, args, me, false);
		}
	},
	postHandleSavePageSetting : function(data, args, isSuccess) {
		if(isSuccess === 'N') {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
	},
	restorePageSetting : function() {
		var me = this;
			me.preferenceHandler.clearPagePreferences(me.strPageName, null,
					me.postHandlePageGridSetting, null, me, false);
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
	showPageSettingPopup : function() {
		var me = this, objData = {}, objGroupView = me.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting;
		var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeTxn;

		me.pageSettingPopup = null;

		if (!Ext.isEmpty(objSecurityProfilePref)) {
			objPrefData = Ext.decode(objSecurityProfilePref);
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
					: SECURITY_GENERIC_COLUMN_MODEL || '[]';

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
		objData["rowPerPage"] = _GridSizeMaster;
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
	/*Page setting handling ends here*/
	handleAppliedFilterDelete : function(btn){
		var me = this;
		var objData = btn.data;
		var quickJsonData = me.filterData;
		if(!Ext.isEmpty(objData)){
			var paramName = objData.paramName || objData.field;
			var arrQuickJson =null;
			var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,paramName);
			if (!Ext.isEmpty(reqJsonInQuick)) {
				arrQuickJson = quickJsonData;
				arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,paramName);
				me.filterData = arrQuickJson;
			}
			me.resetFieldOnDelete(objData);
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
	resetFieldOnDelete : function(objData){
		var me = this,strFieldName;
		if(!Ext.isEmpty(objData))
			strFieldName = objData.paramName || objData.field;
		
		if(strFieldName == 'profileName')
		{
			var appliedFilterId = me.getSecurityProfileFilterView()
			.down('AutoCompleter[itemId=profileNameFltId]');
		 	appliedFilterId.setValue("");
		 	appliedFilterId.reset();
		}
		else if(strFieldName ==='clientCode') {
			if(isClientUser()) {
				if(getClientData().length > 1) {
					var clientCombo = me.getFilterView().down("combo[itemId='clientCombo']");
					clientCombo.setValue("All Companies");
					changeClientAndRefreshGrid('all', 'All Companies');
				}
			} else {
				//$("#summaryClientFilter").val("");
				var clientAutocompleter = me.getFilterView().down("combo[itemId='clientComboAuto']");
				clientAutocompleter.setRawValue("");
				me.clientCode = "";
				me.clientDesc = "";
			}
		}
		if(strFieldName === 'requestState'){
			var statusFltId = me.getFilterView()
			.down('combo[itemId=securityStatusFilter]');
			statusFltId.reset();
			me.statusPrefCode = 'all';
			statusFltId.selectAllValues();
		}

	}
});
function showClientPopup(brandingPkg) {
	GCP.getApplication().fireEvent('showClientPopup', brandingPkg);
}