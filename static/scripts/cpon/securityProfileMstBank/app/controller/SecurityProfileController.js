Ext.define('GCP.controller.SecurityProfileController', {
	extend : 'Ext.app.Controller',
	requires : [],
	views : ['GCP.view.SecurityProfileView',
			'GCP.view.SecurityProfileGridView', 'GCP.view.HistoryPopup'],
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
				selector : 'securityProfileView securityProfileFilterView'
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
				selector : 'securityProfileView securityProfileFilterView AutoCompleter[itemId=profileNameFltId]'
			},
			{
				ref : 'clientInlineBtn',
				selector : 'approvalWorkflowView approvalWorkflowFilterView button[itemId="clientBtn"]'
			},
			{
				ref : 'groupView',
				selector : 'securityProfileGridView groupView'
			}],
	config : {
		selectedMst : 'client',
		clientListCount : 0,
		clientCode :  $("#summaryClientFilterSpan").val(),
		clientDesc : $("#summaryClientFilterSpan").text(),
		brandingPkgListCount : 0,
		filterData : [],
		copyByClicked : '',
		sellerOfSelectedClient : '',
		strDefaultMask : '000000000000000000'
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;

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
			'securityProfileView securityProfileGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateClient"]' : {
				click : function() {
					me.handleClientEntryAction(true);
				}
			},
			'securityProfileView securityProfileFilterView' : {
				'render' : function() {
					if (!Ext.isEmpty(modelSelectedMst))
						me.selectedMst = modelSelectedMst;
					me.setInfoTooltip();
					me.setDataForFilter();
					me.applyFilter();
					// me.handleSpecificFilter();
				},				
				'handleClientChange' : function(strClientId,
							strClientDescr, strSellerId){
					me.sellerOfSelectedClient = strSellerId;
					me.clientCode = strClientId;
					me.clientDesc = strClientDescr;						
					me.setDataForFilter();
					me.applyFilter();
					me.changeFilterParams();
				},				
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			},
			'securityProfileView securityProfileFilterView button[itemId="btnFilter"]' : {
				click : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
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
					me.filterData = [];
					me.showClientList();
					me.handleSpecificFilter();
					me.handleGridHeader();
				}
			},
			'securityProfileGridView' : {
				render : function(panel) {
				//	me.handleSmartGridConfig();
					me.setFilterRetainedValues();
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
			'securityProfileView securityProfileFilterView AutoCompleter[itemId=profileNameFltId]' : {
				select : function(combo, opts) {
					me.setDataForFilter();
				}
			}
		});
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
		var strModule = '', strUrl = null, args = null, strFilterCode = null;
		groupInfo = groupInfo || {};
		subGroupInfo = subGroupInfo || {};
		if (groupInfo) {
			if (groupInfo.groupTypeCode === 'ADVFILTER') {

			} else {
				args = {
					scope : me
				};
				strModule = subGroupInfo.groupCode;
				me.postHandleDoHandleGroupTabChange(null,args);
			}
		}

	},
	postHandleDoHandleGroupTabChange : function(data, args) {
		var me = args.scope;
		var objGroupView = me.getGroupView();
		var objPref = null, gridModel = null, intPgSize = null;
		var colModel = null, arrCols = null;
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
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		me.setDataForFilter();
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		//strUrl = strUrl + me.getFilterUrl();
		strUrl += me.getFilterUrl(subGroupInfo, groupInfo);
	//	grid.setLoading(true);
		grid.loadGridData(strUrl, null, null, false);
	},
getFilterUrl : function(subGroupInfo, groupInfo) {
		var me = this;
		var strQuickFilterUrl = '' , strQuickFilterUrlF = '';
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
									strTemp = strTemp
											+ filterData[index].paramName
											+ ' eq ';
									strTemp = strTemp + '\'' + objArray[i]
											+ '\'';
									if (i != objArray.length - 1)
										strTemp = strTemp + ' or ';

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
					var objUser = filterData[index].makerUser;
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
							else if(objArray[i] == 13){
								strTemp = strTemp + "(((isSubmitted eq 'Y' and (requestState eq '0' or requestState eq '1' )) or (requestState eq '4') or (requestState eq '5'))and makerId ne '"+objUser+"' )";
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
		var sellerVal = null, sellerFilterVal = null, receiverNameVal = null, clientCodeVal = null, jsonArray = [];
		var clientSetupFilterView = me.getSecurityProfileFilterView();
		var receiverNameFltId = clientSetupFilterView
				.down('AutoCompleter[itemId=profileNameFltId]');
		var sellerFltId = clientSetupFilterView.down('combobox[itemId=sellerIdItemId]');
		if (!Ext.isEmpty(me.sellerOfSelectedClient) && me.sellerOfSelectedClient != '') {
			sellerVal = me.sellerOfSelectedClient;
		}else
		{
			sellerVal = '';//strSellerId;		
		}

		if (!Ext.isEmpty(sellerVal)) {
			jsonArray.push({
						paramName : 'seller',
						paramValue1 : 'OWNER,'+ sellerVal.toUpperCase(),
						operatorValue : 'in',
						dataType : 'S'
					});
		}

		if (!Ext.isEmpty(receiverNameFltId)
				&& !Ext.isEmpty(receiverNameFltId.getValue())) {
			receiverNameVal = receiverNameFltId.getValue();
		}
		if (!Ext.isEmpty(sellerFltId)
				&& !Ext.isEmpty(sellerFltId.getValue())) {
			sellerFilterVal = sellerFltId.getValue();
		}
		
		if (userType == '0')
		{
			jsonArray.push({
				paramName : sellerFltId.name,
				paramValue1 : 'OWNER,'+ sellerFilterVal,
				operatorValue : 'in',
				dataType : 'S'
			});
				
		}
		
		if (!Ext.isEmpty(receiverNameVal)) {
			jsonArray.push({
						paramName : receiverNameFltId.name,
						paramValue1 : encodeURIComponent(receiverNameVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'lk',
						dataType : 'S'
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
		var clientSetupFilterView = me.getSecurityProfileFilterView();
		var securityProfileNameFltId = clientSetupFilterView
				.down('combobox[itemId=profileNameFltId]');
		if (!Ext.isEmpty(securityProfileNameFltId)) {
			securityProfileNameFltId.cfgExtraParams = new Array();
		}
		securityProfileNameFltId.cfgExtraParams.push({
						key : '$sellerId',
						value : strSellerId
					});
		if (me.clientCode != '' && me.clientCode != 'all') {
			securityProfileNameFltId.cfgExtraParams.push({
						key : '$clientId',
						value : me.clientCode

					});
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
				me.showHistory(true, record.get('profileName'), record
								.get('history').__deferred.uri, record
								.get('identifier'));
			}

		} else if (actionName === 'btnView') {
			me.submitForm('viewBankSecurityProfileMst.form', record, rowIndex);
		} else if (actionName === 'btnEdit') {
			me.submitForm('editBankSecurityProfileMst.form', record, rowIndex);
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

	showHistory : function(isClient, clientName, url, id) {
		Ext.create('GCP.view.HistoryPopup', {
					isClient : isClient,
					historyUrl : url,
					identifier : id,
					clientName : clientName
				}).show();
	},
	
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
				.format('cpon/bankSecurityProfileMst/{0}.srvc', strAction);
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
					multiline : 4,
					cls:'t7-popup',
					width: 355,
					height : 270,
					bodyPadding : 0,
					fn : function(btn, text) {
						if (btn == 'ok') {
        				   	if (Ext.isEmpty(text)) {
                               Ext.Msg.alert(getLabel('errorTitle', 'Error'), getLabel('rejectEmptyErrorMsg',
                                        'Reject Remarks cannot be blank'));
                           }else{
                              me.preHandleGroupActions(strUrl, text,grid,
                                                arrSelectedRecords,strActionType,strAction);
                           }
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
							userMessage : remark,
							recordDesc : records[index].data.profileName
						});
			}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});

			Ext.Ajax.request({
						url : strUrl + '?' + csrfTokenName + '=' + csrfTokenValue,
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
								me.enableDisableGroupActions( '0000000000', false, false, false );
								groupView.refreshData();
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
	},*/

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
					"colDesc" : "Client",
					"sortable":true
				}, {
					"colId" : "profileName",
					"colDesc" : "Security Profile",
					"sortable":true
				}, {
					"colId" : "integrityCheckFlag",
					"colDesc" : "Integrity Check",
					"sortable":true
				}, {
					"colId" : "encryptionFlag",
					"colDesc" : "Encryption",
					"sortable":true
				}, {
					"colId" : "singingFlag",
					"colDesc" : "Signing",
					"sortable":true
				}, {
					"colId" : "requestStateDesc",
					"colDesc" : "Status",
					"sortable":false
				}];

		storeModel = {
			fields : ['clientName', 'profileName', 'clientId', 'clientDesc',
					'integrityCheckFlag', 'encryptionFlag', 'singingFlag',
					'requestStateDesc', 'identifier', 'history', '__metadata'],
			proxyUrl : 'cpon/bankSecurityProfileMst.json',
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
		var strUrl = 'addBankSecurityProfileMst.form';
		var brandingPkgType = null;
		var selectedClient = null;

		var clientSetupFilterView = me.getSecurityProfileFilterView();
		var selectedSeller = me.sellerOfSelectedClient;

		selectedClient = me.clientCode;

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
		var sellerVal = null;
		var arrJsn = {};
		
		var clientSetupFilterView = me.getSecurityProfileFilterView();
		var sellerFltId = clientSetupFilterView
				.down('combobox[itemId=sellerIdItemId]');

		var securityNameFltId = clientSetupFilterView
				.down('AutoCompleter[itemId=profileNameFltId]');

		var clientNamesFltId = clientSetupFilterView
				.down('combobox[itemId=clientNamesFltId]');

		
		var selectedSeller = me.sellerOfSelectedClient;
		var selectedClient = me.clientCode;
		if (!Ext.isEmpty(securityNameFltId)
				&& !Ext.isEmpty(securityNameFltId.getValue())) {
			securityNameVal = securityNameFltId.getValue();
		}
		if (!Ext.isEmpty(sellerFltId)
				&& !Ext.isEmpty(sellerFltId.getValue())) {
			sellerVal = sellerFltId.getValue();
		}
		arrJsn['sellerId'] = sellerVal;
		arrJsn['clientId'] = selectedClient;
		arrJsn['clientDesc'] = me.clientDesc;
		arrJsn['securityPrfName'] = securityNameVal;
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'filterData',
				Ext.encode(arrJsn)));
	},
	setFilterRetainedValues : function() {
		var me = this;
		var clientSetupFilterView = me.getSecurityProfileFilterView();
		// set Matrix Name Filter Value
		var securityNameFltId = clientSetupFilterView
				.down('AutoCompleter[itemId=profileNameFltId]');
		securityNameFltId.setValue(strSecPrfName);

		// Set Client Name Filter Value
		var clientCodesFltId ;
		if (userType == '0') {
			clientCodesFltId = clientSetupFilterView
				.down('combobox[itemId=clientAutoCompleter]');
			if(undefined != strClientDesc && strClientDesc != ''){		
				clientCodesFltId.store.loadRawData({
									"d" : {
										"preferences" : [{
													"CODE" : strClientId,
													"DESCR" : strClientDesc
												}]
									}
								});
	
				clientCodesFltId.suspendEvents();
				clientCodesFltId.setValue(strClientId);
				clientCodesFltId.resumeEvents();
				me.clientCode = strClientId;
				me.clientDesc = strClientDesc;
			}else{
				me.clientCode = 'all';			
			}
			
		} else {
			clientCodesFltId = clientSetupFilterView
				.down('button[itemId="clientBtn"]');
			if(undefined != strClientDesc && strClientDesc != ''){	
				clientCodesFltId.setText(strClientDesc);
				me.clientCode = strClientId;
				me.clientDesc = strClientDesc;
			}	
			else{	
				clientCodesFltId.setText(getLabel('allCompanies', 'All Companies'));
				me.clientCode = 'all';
			}
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
					target : 'imgFilterInfo',
					listeners : {
						// Change content dynamically depending on which element
						// triggered the show.
						beforeshow : function(tip) {
						    var filterView = me.getSecurityProfileFilterView();
							var  securityProfileCombo = filterView.down('AutoCompleter[itemId=profileNameFltId]');
							var  securityProfile = !Ext.isEmpty(securityProfileCombo.getRawValue()) ? securityProfileCombo.getRawValue() : getLabel('none', 'None');
							var sellerFltId = filterView.down('combobox[itemId=sellerIdItemId]');
							var seller = sellerFltId.getRawValue();
			                tip.update(getLabel('financialInstitution', 'Financial Institution')
										+ ' : '
										+ seller
										+ '<br/>'
										+ getLabel('securityProfile', 'Security Profile')
										+ ' : '
										+ securityProfile);
							
						}
					}
				});
	}

});
function showClientPopup(brandingPkg) {
	GCP.getApplication().fireEvent('showClientPopup', brandingPkg);
}