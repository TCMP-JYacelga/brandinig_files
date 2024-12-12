Ext.define('GCP.controller.UserMstController', {
	extend : 'Ext.app.Controller',
	requires : ['GCP.view.UserMstView'],
	views : ['GCP.view.UserMstView', 'GCP.view.UserMstTitleView',
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
				ref : 'userMstFilterView',
				selector : 'userMstView userMstFilterView'
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
			},{
				ref : 'groupView',
				selector : 'userMstGridView groupView'
			}, {
				ref : 'withHeaderCheckbox',
				selector : 'userMstTitleView menuitem[itemId="withHeaderId"]'
			}],
	config : {
		filterData : [],
		sellerFilterVal : null,
		corpFilterVal : null,
		corpFilterDesc : null,
		clientCode : '',
		clientDesc : '',
		sellerOfSelectedClient : '',
		strDefaultMask : '000000000000000000',
		reportGridOrder : null
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;

		me.control({
			'userMstView' : {
				render : function(panel, opts) {
				}
			},
			'userMstView button[itemId="addNewUserId"]' : {
				click : function(btn) {
					if(canEdit){
					me.handleAddNewUser(btn);
					}
				}
			},
			'userMstGridView' : {
				render : function(panel, opts) {
//					me.handleSmartGridLoading();
					me.setFilterRetainedValues();									
					me.setInfoTooltip();	
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
			'userMstView userMstFilterView' : {
				afterrender : function(panel, opts) {
					var objDetailFilterPanel = me.getUserNameFilterBar();
					var objAutocompleterName = objDetailFilterPanel
							.down('AutoCompleter[itemId="userNameFltId"]');
					objAutocompleterName.cfgUrl = 'services/userMstSeek/userNamesList.json';
					// objAutocompleterName.setValue( '' );
					objAutocompleterName.cfgExtraParams.push({
								key : '$filtercorporation',
								value : sessionCorporation
							});

					var objAutocompleterDesc = objDetailFilterPanel
							.down('AutoCompleter[itemId="userCategoryFltId"]');
					objAutocompleterDesc.cfgUrl = 'services/userMstSeek/userCategoryList.json';
					// objAutocompleterDesc.setValue( '' );
					objAutocompleterDesc.cfgExtraParams.push({
								key : '$filtercorporation',
								value : sessionCorporation
							});
				},				
				'handleClientChange' : function(strClientId,
							strClientDescr, strSellerId){
						me.sellerOfSelectedClient = strSellerId;
						me.clientCode = strClientId;
						me.clientDesc = strClientDescr;	
						
						me.corpFilterDesc = strClientDescr;
						me.corpFilterVal = strClientId;
						var objFilterPanel = me.getSellerClientMenuBar();
	
						var objDetailFilterPanel = me.getUserNameFilterBar();
	
						var objAutocompleterName = objDetailFilterPanel
								.down('AutoCompleter[itemId="userNameFltId"]');
						var objAutocompleterDesc = objDetailFilterPanel
								.down('AutoCompleter[itemId="userCategoryFltId"]');
	
						var objFilterPanel = me.getSellerClientMenuBar();
						var cfgArrayName = objAutocompleterName.cfgExtraParams;
						var cfgArrayDesc = objAutocompleterDesc.cfgExtraParams;
	
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
	
						objAutocompleterName.cfgUrl = 'services/userMstSeek/userNamesList.json';
						// objAutocompleterName.setValue( '' );
						objAutocompleterName.cfgExtraParams = cfgArrayName;
	
						objAutocompleterDesc.cfgUrl = 'services/userMstSeek/userCategoryList.json';
						// objAutocompleterDesc.setValue( '' );
						objAutocompleterDesc.cfgExtraParams = cfgArrayDesc;
						me.applySeekFilter();
	
					}
				},
			
			'userMstView userMstGridView toolbar[itemId=userMstGroupActionBarView]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			},
			'userMstFilterView AutoCompleter[itemId="userNameFltId"]' : {
				select : function(combo, record, index) {
					me.applySeekFilter();
				},
				change : function(combo, record, index) {
					if (record == null) {
						me.applySeekFilter();
					}
				}
			},
			'userMstFilterView AutoCompleter[itemId="userCategoryFltId"]' : {
				select : function(combo, record, index) {
					me.applySeekFilter();
				},
				change : function(combo, record, index) {
					if (record == null) {
						me.corpFilterVal = '';
						me.corpFilterDesc = '';
						me.applySeekFilter();
					}
				}
			},
			'userMstFilterView combo[itemId="userMstStatusFltId"]' : {
				select : function(combo, record, index) {
					me.applySeekFilter();
				}
			},
			'userMstTitleView button[itemId="downloadPdf"]' : {
				click : function(btn, opts) {
					me.handleReportAction(btn, opts);
				}
			},
			'userMstTitleView' : {
				performReportAction : function(btn, opts) {
					me.handleReportAction(btn, opts);
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
//		if (data && data.preference) {
//			objPref = Ext.decode(data.preference);
//			arrCols = objPref.gridCols || null;
//			intPgSize = objPref.pgSize || _GridSizeTxn;
//			colModel = objSummaryView.getColumnModel(arrCols);
//			if (colModel) {
//				gridModel = {
//					columnModel : colModel,
//					pageSize : intPgSize,
//					storeModel:{
//					  sortState:objPref.sortState
//                    }
//				}
//			}
//		}
		objGroupView.reconfigureGrid(gridModel);
	},
	handleAddNewUser : function(btn) {
		var me = this;
		
		var strCorpCode = ' ' , strCorpDesc =' ' ;
		
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
				'profileMstName', btn.name));
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
		me.getSearchTextField().setValue('');
		this.filterData = this.getFilterQueryJson();
	},
	handleGroupActions : function(strAction, grid, arrSelectedRecords,
			strActionType) {
		var me = this;
		var strUrl = Ext.String.format('services/userMst/{0}', strAction);
		if (strAction === 'reject') {
			this.showRejectVerifyPopUp(strAction, strUrl, grid,
					arrSelectedRecords, strActionType);

		} else {
			this.preHandleGroupActions(strUrl, '', grid, arrSelectedRecords,
					strActionType, strAction);
		}
	},
	showRejectVerifyPopUp : function(strAction, strUrl, grid,
					arrSelectedRecords, strActionType) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		if (strAction === 'reject') {
			titleMsg = getLabel('userRejectRemarkPopUpTitle',
					'Please Enter Reject Remark');
			fieldLbl = getLabel('userRejectRemarkPopUpFldLbl', 'Reject Remark');
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
							if(Ext.isEmpty(text))
							{
								Ext.Msg.alert("Error", "Reject Remarks cannot be blank");
							}
							else
							{
								me.preHandleGroupActions(strUrl, text, grid, arrSelectedRecords);
							}
						}
					}
				});
	},
	preHandleGroupActions : function(strUrl, remark, grid, arrSelectedRecords,
			strActionType, strAction) {

		var me = this;
		var groupView = me.getGroupView();
		if (!Ext.isEmpty(groupView)) {
			var arrayJson = new Array();
			var records = (arrSelectedRecords || []);
				for (var index = 0; index < records.length; index++) {
					arrayJson.push({
								serialNo : grid.getStore()
										.indexOf(records[index])
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
						timeout : 60000,
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							// TODO : Action Result handling to be done here
							groupView.setLoading(false);
							groupView.refreshData();
//							me.applyFilter();
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
						groupView.setLoading(false);
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
	doHandleRowActions : function(actionName, grid, record,rowIndex) {
		var me = this;
		if (actionName === 'submit' || actionName === 'accept'
				|| actionName === 'reject' || actionName === 'discard'
				|| actionName === 'enable' || actionName === 'disable')
			me.handleGroupActions(actionName, grid, [record], 'rowAction');
		else if (actionName === 'btnHistory') {
			var recHistory = record.get('history');

			if (!Ext.isEmpty(recHistory)
					&& !Ext.isEmpty(recHistory.__deferred.uri)) {
				me.showHistory(record.get('usrCode'),
						record.get('history').__deferred.uri, record
								.get('identifier'));
			}
		} else if (actionName === 'btnEdit') {
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

		form.action = strUrl;
		
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
		Ext.create('GCP.view.HistoryPopup', {
					historyUrl : url,
					usrCode : usrCode,
					identifier : id
				}).show();
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

		var userMstFilterView = me.getUserMstFilterView();
		var userNameFltId = userMstFilterView
				.down('combobox[itemId=userNameFltId]');

		var corpDesc = me.corpFilterDesc;
		var corpVal = me.corpFilterVal;

		if (!Ext.isEmpty(clientId) && !Ext.isEmpty(corpDesc)) {
			corpDesc = corpDesc.toUpperCase();
		}

		if (!Ext.isEmpty(clientId) && !Ext.isEmpty(corpVal)) {
			corpVal = corpVal.toUpperCase();
		}

		var userStatusFltId = userMstFilterView
				.down('combobox[itemId=userMstStatusFltId]');

		var userCategoryFltId = userMstFilterView
				.down('combobox[itemId=userCategoryFltId]');

		var clientId = userMstFilterView.down('combobox[itemId=clientCodeId]');

		if (!Ext.isEmpty(userNameFltId)
				&& !Ext.isEmpty(userNameFltId.getValue())) {
			userNameVal = userNameFltId.getValue().toUpperCase();
		}

		if (!Ext.isEmpty(userStatusFltId)
				&& !Ext.isEmpty(userStatusFltId.getValue())
				&& "ALL" != userStatusFltId.getValue().toUpperCase()) {
			statusVal = userStatusFltId.getValue();
		}

		if (!Ext.isEmpty(userCategoryFltId)
				&& !Ext.isEmpty(userCategoryFltId.getValue())) {
			categoryVal = userCategoryFltId.getValue();
		}

		if (!Ext.isEmpty(clientId) && !Ext.isEmpty(clientId.getValue())) {
			clientCodeVal = clientId.getValue();
		}

		if (!Ext.isEmpty(userNameVal)) {
			jsonArray.push({
						paramName : userNameFltId.name,
						paramValue1 : userNameVal.toUpperCase(),
						operatorValue : 'lk',
						dataType : 'S'
					});
		}
		if (!Ext.isEmpty(statusVal)) {
			var strInFlag = false;
			if (statusVal == 12 || statusVal == 3) {
				if (statusVal == 12) // Submitted
				{
					statusVal = new Array(0, 1);
					jsonArray.push({
								paramName : 'isSubmitted',
								paramValue1 : 'Y',
								operatorValue : 'eq',
								dataType : 'S'
							});
					strInFlag = true;
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
			} else if (statusVal == 0 || statusVal == 1) // New
			// and
			// Modified
			{
				jsonArray.push({
							paramName : 'isSubmitted',
							paramValue1 : 'N',
							operatorValue : 'eq',
							dataType : 'S'
						});
			}
			if (strInFlag) // Used for Submitted & Rejected
			// status
			{
				jsonArray.push({
							paramName : userStatusFltId.name,
							paramValue1 : statusVal,
							operatorValue : 'in',
							dataType : 'S'
						});
			} else {
				jsonArray.push({
							paramName : userStatusFltId.name,
							paramValue1 : statusVal,
							operatorValue : 'eq',
							dataType : 'S'
						});
			}
		}
		if (categoryVal != null) {
			jsonArray.push({
						paramName : userCategoryFltId.name,
						paramValue1 : categoryVal.toUpperCase(),
						operatorValue : 'lk',
						dataType : 'S'
					});
		}

		if (!Ext.isEmpty(sellerCodeVal)) {
			jsonArray.push({
						paramName : 'sellerCode',
						operatorValue : 'eq',
						paramValue1 : sellerCodeVal,
						dataType : 'S'
					});
		}

		if (!Ext.isEmpty(corpDesc) && corpDesc != null && corpVal!= 'all') {
			corpDesc = corpDesc.toUpperCase();
			jsonArray.push({
						paramName : 'corporationDesc',
						operatorValue : 'lk',
						paramValue1 : corpDesc,
						dataType : 'S'
					});
		}

		if (!Ext.isEmpty(corpVal) && corpVal != null && corpVal!= 'all') {
			jsonArray.push({
						paramName : 'corpCode',
						operatorValue : 'eq',
						paramValue1 : corpVal,
						dataType : 'S'
					});
		}

		return jsonArray;
	},
	loadSmartGrid : function(data) {
		var me = this;
		var objPref = null, arrCols = new Array(), arrColsPref = null, pgSize = null;
		var userMstGrid = null;
		if (entity_type === '0')
		{
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
							"colDesc" : "Corporation"
						}, {
							"colId" : "usrDescription",
							"colDesc" : "User Name"
						}, {
							"colId" : "usrCode",
							"colDesc" : "Login ID"
						}, {
							"colId" : "usrCategory",
							"colDesc" : "Role"
						},{
							"colId" : "requestStateDesc",
							"colDesc" : "Status"
						}]
			};
		}
		else
		{
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
								"colId" : "usrCode",
								"colDesc" : "Login ID"
							}, {
								"colId" : "usrCategory",
								"colDesc" : "Role"
							},{
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
						'identifier', '__metadata', 'corporationDesc'],
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
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		objGroupView.handleGroupActionsVisibility(buttonMask);
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl += me.getFilterUrl(subGroupInfo, groupInfo);
		me.reportGridOrder = strUrl;
		grid.loadGridData(strUrl, null, null, false);
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
		var isSubmitted = false;
		maskArray.push(buttonMask);
		for (var index = 0; index < arrSelectedRecords.length; index++) {
			objData = arrSelectedRecords[index];
			maskArray.push(objData.get('__metadata').__rightsMap);
			if (objData.raw.makerId === LOGGEDINUSER) {
				isSameUser = false;
			}
			if (objData.raw.validFlag != 'Y') {
				isDisabled = true;
			}
			if (objData.raw.isSubmitted != null
					&& objData.raw.isSubmitted == 'Y'
					&& objData.raw.requestState != 8
					&& objData.raw.requestState != 4
					&& objData.raw.requestState != 5) {
				isSubmitted = true;
			}
		}
		actionMask = doAndOperation(maskArray, 10);
		me.enableDisableGroupActions(actionMask, isSameUser, isDisabled,
				isSubmitted);
	},
	enableDisableGroupActions : function(actionMask, isSameUser, isDisabled,
			isSubmitted) {
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
								blnEnabled = blnEnabled && !isSameUser
										&& (isSubmitted != undefined && !isSubmitted);
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
					}]
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
	applySeekFilter : function() {
		var me = this;
		me.setDataForFilter();
		me.filterApplied = 'Q';
		me.applyFilter();
	},
	/* Function sets the filter Panel element values in JSON */
	setFilterParameters : function(form) {
		var me = this;
		var arrJsn = {};
		var userNameVal, statusVal, categoryVal, sellerCodeVal;
		var userMstFilterView = me.getUserMstFilterView();
		
		var userNameFltId = userMstFilterView
		.down('combobox[itemId=userNameFltId]');

		var clientId = userMstFilterView.down('combobox[itemId=clientCodeId]');
		var sellerId = userMstFilterView.down('combobox[itemId=sellerCodeID]');
		
		var corpDesc = me.corpFilterDesc;
		var corpVal = me.corpFilterVal;
		
		if (!Ext.isEmpty(clientId) && !Ext.isEmpty(corpDesc)) {
			corpDesc = corpDesc.toUpperCase();
		}
		if (!Ext.isEmpty(clientId) && !Ext.isEmpty(corpVal)) {
			corpVal = corpVal.toUpperCase();
		}
		if (!Ext.isEmpty(sellerId) && !Ext.isEmpty(sellerId.getValue())) {
			sellerCodeVal = sellerId.getValue();
		}

		var userCategoryFltId = userMstFilterView
				.down('combobox[itemId=userCategoryFltId]');
		
		if (!Ext.isEmpty(userCategoryFltId)
				&& !Ext.isEmpty(userCategoryFltId.getValue())) {
			categoryVal = userCategoryFltId.getValue();
		}
		
		if (!Ext.isEmpty(userNameFltId)
				&& !Ext.isEmpty(userNameFltId.getValue())) {
			userNameVal = userNameFltId.getValue().toUpperCase();
		}
		
		
		arrJsn['corpCode'] = corpVal;
		arrJsn['corporationDesc'] = corpDesc;
		arrJsn['sellerCode'] = sellerCodeVal;
		arrJsn['userCategory'] = categoryVal;
		arrJsn['userDescription'] = userNameVal;
		
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'filterData',
				Ext.encode(arrJsn)));
	},
	setFilterRetainedValues : function() {
		var me = this;
		var userMstFilterView = me.getUserMstFilterView();
		
		var userNameFltId = userMstFilterView
		.down('combobox[itemId=userNameFltId]');
		userNameFltId.setValue(filterUserDesc);
		var clientCodesFltId ;
		if (!isClientUser()) {
			clientCodesFltId = userMstFilterView
				.down('combobox[itemId=clientAutoCompleter]');
			if(undefined != sessionCorporationDesc && sessionCorporationDesc != ''){		
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
			}else{
				me.clientCode = 'all';			
			}
			
		} else {
			clientCodesFltId = userMstFilterView
				.down('button[itemId="clientBtn"]');
			if(undefined != sessionCorporationDesc && sessionCorporationDesc != ''){	
				clientCodesFltId.setText(sessionCorporationDesc);
				me.clientCode = sessionCorporation;	
			}	
			else{	
				clientCodesFltId.setText(getLabel('allCompanies', 'All Companies'));
				me.clientCode = 'all';
			}
		}
		
		var userCategoryFltId = userMstFilterView
		.down('combobox[itemId=userCategoryFltId]');
		userCategoryFltId.setValue(filterUserCategory);
		
		me.corpFilterDesc = filterCorpDesc;
		me.corpFilterVal = filterCorpCode;
		
		me.setDataForFilter();
		me.applyFilter();
	},

	setInfoTooltip : function() {
		var me = this;
		var infotip = Ext.create('Ext.tip.ToolTip', {
			//target : 'userMstFilterView-1027_header_hd-textEl',
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
					
					if(!Ext.isEmpty(userStatusFltId) 
							&& !Ext.isEmpty(userStatusFltId.getValue())) {
						status = userStatusFltId.getRawValue();
					} 
					else 
					{
						status = getLabel('all', 'All');								
					}
					
					if (!Ext.isEmpty(userNameFltId)
							&& !Ext.isEmpty(userNameFltId.getValue())) {
						userName =userNameFltId.getValue();
					} else {
						userName = getLabel('none','None');
					}			
					if (!Ext.isEmpty(roleFltId)
							&& !Ext.isEmpty(roleFltId.getValue())) {
						role = roleFltId.getValue();
					} else {
						role = getLabel('none','None');
					}					
					client = (me.clientDesc != '') ? me.clientDesc : getLabel('allcompanies', 'All Companies');							
				
					tip.update(getLabel('coporation', 'Corporation')
								+ ' : '
								+ client
								+ '<br/>'
								+ getLabel('userName', 'User Name')
								+ ' : '
								+ userName
								+ '<br/>'
								+ getLabel('role', 'Role')
								+ ' : '
								+ role
								+ '<br/>'
								+ getLabel('status','Status')
								+ ' : '
								+ status
								+ '<br/>'			
					);
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
		var withHeaderFlag = me.getWithHeaderCheckbox().checked;
		var arrExtension = {
			downloadXls : 'xls',
			downloadCsv : 'csv',
			downloadPdf : 'pdf',
			downloadTsv : 'tsv'
		};
		var currentPage = 1;
		var strExtension = '', strUrl = '', strSelect = '', strFilterUrl = '';
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
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'txtCurrent', currentPage));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'visColsStr', visColsStr));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'txtCSVFlag', withHeaderFlag));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	}
});