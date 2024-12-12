Ext.define('GCP.controller.UserCategoryController', {
	extend : 'Ext.app.Controller',
	requires : ['GCP.view.CategoryListView'],
	views : ['GCP.view.CategoryListView', 'GCP.view.UserCategoryTitleView',
			'GCP.view.UserCategoryFilterView', 'GCP.view.UserCategoryGridView'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'categoryListView',
				selector : 'categoryListView'
			},{
				ref : 'groupView',
				selector : 'categoryListView groupView'
			}, {
				ref : 'searchTextField',
				selector : 'categoryListView textfield[itemId="searchTextField"]'
			}, {
				ref : 'userCategoryFilterView',
				selector : 'categoryListView userCategoryFilterView'
			}, {
				ref : 'userCategoryGridView',
				selector : 'categoryListView userCategoryGridView'
			}, {
				ref : 'userCategoryGridDtlView',
				selector : 'categoryListView userCategoryGridView panel[itemId="userCategoryGridDtlView"]'
			}, {
				ref : 'userCategoryGrid',
				selector : 'categoryListView userCategoryGridView smartgrid[itemId="userCategoryListGrid"]'
			}, {
				ref : 'matchCriteria',
				selector : 'categoryListView radiogroup[itemId="matchCriteria"]'
			},{
				ref : 'sellerClientMenuBar',
				selector : 'categoryListView userCategoryFilterView container[itemId="sellerClientMenuBar"]'
			}, {
				ref : 'sellerMenuBar',
				selector : 'categoryListView userCategoryFilterView container[itemId="sellerMenuBar"]'
			}, {
				ref : 'clientMenuBar',
				selector : 'categoryListView userCategoryFilterView container[itemId="clientMenuBar"]'
			}, {
				ref : 'nameDescStatusMenuBar',
				selector : 'categoryListView userCategoryFilterView container[itemId="nameDescStatusMenuBar"]'
			}, {
				ref : 'withHeaderCheckbox',
				selector : 'userCategoryTitleView menuitem[itemId="withHeaderId"]'
			}],
	config : {
		filterData : [],
		sellerFilterVal : null,
		corpFilterVal : null,
		corpFilterDesc : null,
		strDefaultMask : '000000000000000000',
		strGetModulePrefUrl : 'services/userpreferences/usercategory/{0}.json',
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
			'categoryListView' : {
				render : function(panel, opts) {
				}
			},
			'categoryListView groupView' : {
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
				'gridRender' : me.doHandleLoadGridData,
				'gridPageChange' : me.doHandleLoadGridData,
				'gridSortChange' : me.doHandleLoadGridData,
				'gridPageSizeChange' : me.doHandleLoadGridData,
				'gridColumnFilterChange' : me.doHandleLoadGridData,
				'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,
				'gridStateChange' : function(grid) {
					//me.toggleSavePrefrenceAction(true);
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
				afterrender : function(panel,opts){
					me.setFilterRetainedValues();
				}
			},
			
			'categoryListView button[itemId="addNewUserCategory"]' : {
				click : function(btn) {
					if(canEdit) {
					me.handleAddNewUserCategory(btn);
					}
				}
			},
			
			'categoryListView textfield[itemId="searchTextField"]' : {
				change : function(btn, opts) {
					me.searchTrasactionChange();
				}
			},
			'categoryListView radiogroup[itemId="matchCriteria"]' : {
				change : function(btn, opts) {
					me.searchTrasactionChange();
				}
			},
			
			'categoryListView userCategoryFilterView' : {
				afterrender : function(panel, opts) {
					var objDetailFilterPanel = me.getNameDescStatusMenuBar()
					var objAutocompleterName = objDetailFilterPanel
							.down('AutoCompleter[itemId="userNameFilter"]');
					objAutocompleterName.cfgUrl = 'services/userCategory/filter/catNamesList.json';
					// objAutocompleterName.setValue( '' );
					objAutocompleterName.cfgExtraParams.push({
								key : '$filtercorporation',
								value : sessionCorporation
							});

					var objAutocompleterDesc = objDetailFilterPanel
							.down('AutoCompleter[itemId="userDescriptionFilter"]');
					objAutocompleterDesc.cfgUrl = 'services/userCategory/filter/catDescList.json';
					// objAutocompleterDesc.setValue( '' );
					objAutocompleterDesc.cfgExtraParams.push({
								key : '$filtercorporation',
								value : sessionCorporation
							});
				},
				handleClientChange : function(clientCode, clientDesc, sellerCode){
					me.corpFilterVal = '';
					me.corpFilterDesc = clientDesc;
					me.corpFilterVal = clientCode;
					me.sellerFilterVal = !Ext.isEmpty(sellerCode) ? sellerCode : sessionSellerCode;
					//var objFilterPanel = me.getSellerClientMenuBar();

					var objDetailFilterPanel = me.getNameDescStatusMenuBar();

					var objAutocompleterName = objDetailFilterPanel
							.down('AutoCompleter[itemId="userNameFilter"]');
					var objAutocompleterDesc = objDetailFilterPanel
							.down('AutoCompleter[itemId="userDescriptionFilter"]');

					//var objFilterPanel = me.getSellerClientMenuBar();
					var cfgArrayName = objAutocompleterName.cfgExtraParams;
					var cfgArrayDesc = objAutocompleterDesc.cfgExtraParams;

					if (cfgArrayName) {
						$.each(cfgArrayName, function(i, v) {
							$.each(v, function(innerKey, innerValue) {
										if (innerValue == '$filtercorporation') {
											v.value = clientCode;
										}
									})
						});
					} else {
						cfgArrayName.push({
									key : '$filtercorporation',
									value : clientCode
								});
					}

					if (cfgArrayDesc) {
						$.each(cfgArrayDesc, function(i, v) {
							$.each(v, function(innerKey, innerValue) {
										if (innerValue == '$filtercorporation') {
											v.value = clientCode;
										}
									})
						});
					} else {
						cfgArrayDesc.push({
									key : '$filtercorporation',
									value : clientCode
								});
					}

					objAutocompleterName.cfgUrl = 'services/userCategory/filter/catNamesList.json';
					// objAutocompleterName.setValue( '' );
					objAutocompleterName.cfgExtraParams = cfgArrayName;

					objAutocompleterDesc.cfgUrl = 'services/userCategory/filter/catDescList.json';
					// objAutocompleterDesc.setValue( '' );
					objAutocompleterDesc.cfgExtraParams = cfgArrayDesc;
					me.applySeekFilter();

				},
				render : function(panel, opts) {
					me.setInfoTooltip();
				}
			},
			'userCategoryFilterView AutoCompleter[itemId="userNameFilter"]' : {
				select : function(combo, record, index) {
					me.applySeekFilter();
				},
				change : function(combo, record, index) {
					if (record == null) {
						me.applySeekFilter();
					}
				}
			},
			'userCategoryFilterView AutoCompleter[itemId="userDescriptionFilter"]' : {
				select : function(combo, record, index) {
					me.applySeekFilter();
				},
				change : function(combo, record, index) {
					if (record == null) {
						me.applySeekFilter();
					}
				}
			},
			'userCategoryFilterView combo[itemId="userCategoryStatusFilter"]' : {
				select : function(combo, record, index) {
					me.applySeekFilter();
				}
			},
			'userCategoryTitleView' : {
				performReportAction : function(btn, opts) {
					me.handleReportAction(btn, opts);
				}
			}
		});
	},
	setDataForFilter : function() {
		var me = this;
		me.getSearchTextField().setValue('');
		this.filterData = me.getFilterQueryJson();
	},
	handleSmartGridLoading : function() {
		var me = this;
		me.loadSmartGrid();
		/*
		 * var me = this; var grid = me.getPmtGrid(); if (Ext.isEmpty(grid)) {
		 * me.loadSmartGrid(); } else { me.handleLoadGridData(grid,
		 * grid.store.dataUrl, grid.pageSize, 1, 1, null); }
		 */
	},
	getFilterQueryJson : function() {
		var me = this;
		var userNameVal = null, statusVal = null, moduleVal = null, categoryVal = null, subCategoryVal = null, jsonArray = [], clientVal = null, sellerVal = null;

		var userCategoryFilterView = me.getUserCategoryFilterView();
		var userNameFltId = userCategoryFilterView
				.down('AutoCompleter[itemId=userNameFilter]');

		var userStatusFltId = userCategoryFilterView
				.down('combo[itemId=userCategoryStatusFilter]');

		var userDescriptionFilter = userCategoryFilterView
				.down('AutoCompleter[itemId=userDescriptionFilter]');

		var objOfCreateNewFilter = me.getSellerClientMenuBar();

		var corpDesc = me.corpFilterDesc;
		var corpVal = me.corpFilterVal;

		if (!Ext.isEmpty(userNameFltId)
				&& !Ext.isEmpty(userNameFltId.getValue())) {
			userNameVal = userNameFltId.getValue().toUpperCase();
		}

		if (!Ext.isEmpty(userStatusFltId)
				&& !Ext.isEmpty(userStatusFltId.getValue())
				&& "ALL" != userStatusFltId.getValue().toUpperCase()) {
			statusVal = userStatusFltId.getValue();
		}

		if (!Ext.isEmpty(userDescriptionFilter)
				&& !Ext.isEmpty(userDescriptionFilter.getValue())) {
			categoryVal = userDescriptionFilter.getValue().toUpperCase();
		}

		if (!Ext.isEmpty(corpDesc)) {
			corpDesc = corpDesc.toUpperCase();
		}

		if (!Ext.isEmpty(corpVal)) {
			corpVal = corpVal.toUpperCase();
		}

		if (!Ext.isEmpty(me.sellerFilterVal)) {
			sellerVal = me.sellerFilterVal;
		}

		if (!Ext.isEmpty(userNameVal)) {
			jsonArray.push({
						paramName : userNameFltId.name,
						paramValue1 : userNameVal,
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
			} else if (statusVal == 0 || statusVal == 1) // New and Modified
			{
				jsonArray.push({
							paramName : 'isSubmitted',
							paramValue1 : 'N',
							operatorValue : 'eq',
							dataType : 'S'
						});
			}
			if (strInFlag) // Used for Submitted & Rejected status
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
						paramName : userDescriptionFilter.name,
						paramValue1 : categoryVal.toUpperCase(),
						operatorValue : 'lk',
						dataType : 'S'
					});
		}
		if (!Ext.isEmpty(corpDesc) && corpDesc !== null && corpVal != 'ALL') {
			jsonArray.push({
						paramName : 'corporationDesc',
						operatorValue : 'lk',
						paramValue1 : corpDesc,
						dataType : 'S'
					});
		}

		if (!Ext.isEmpty(corpVal) && corpVal !== null && corpVal != 'ALL') {
			jsonArray.push({
						paramName : 'corporationCode',
						operatorValue : 'eq',
						paramValue1 : corpVal,
						dataType : 'S'
					});
		}
		return jsonArray;
	},
	handleMoreMenuItemClick : function(grid, rowIndex, cellIndex, menu, event,
			record) {
		var me = this;
		var dataParams = null;
		if (!Ext.isEmpty(menu.dataParams))
			dataParams = menu.dataParams;
		if (!Ext.isEmpty(dataParams))
			me.handleRowIconClick(dataParams.view, dataParams.rowIndex,
					dataParams.columnIndex, menu, null, dataParams.record);
	},

	doSubmitForm : function(strUrl, formData) {
		var me = this;
		var form = null;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtIdentifier',
				formData.viewState));
		
		me.setFilterParameters(form);
		
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	showHistory : function(usrCode, url, id) {
		Ext.create('GCP.view.HistoryPopup', {
					historyUrl : url,
					usrCode : usrCode,
					identifier : id
				}).show();
	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	showRejectPopUp : function(strAction, strActionUrl, grid, record) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		if (strAction === 'reject') {
			titleMsg = getLabel('instrumentRejectRemarkPopUpTitle',
					'Please Enter Reject Remark');
			fieldLbl = getLabel('instrumentRejectRemarkPopUpFldLbl',
					'Reject Remark');
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
								me.preHandleGroupActions(strActionUrl, text, grid, record);
							}
						}
					}
				});
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
	searchTrasactionChange : function() {
		var me = this;
		var searchValue = me.getSearchTextField().value;
		var anyMatch = me.getMatchCriteria().getValue();
		if ('anyMatch' === anyMatch.searchOnPage) {
			anyMatch = false;
		} else {
			anyMatch = true;
		}

		var grid = me.getUserCategoryGrid();
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
	applyFilter : function() {
		var me = this;
		/*var grid = me.getUserCategoryGrid();
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
					store.sorters);
			strUrl = strUrl + me.getFilterUrl();
			grid.setLoading(true);
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
		}*/
		var objGroupView = me.getGroupView();
		var groupInfo = objGroupView.getGroupInfo();
		me.refreshData();
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
	generateUrlWithFilterParams : function() {
		var me = this;
		var filterData = me.filterData;
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
	handleAddNewUserCategory : function(btn) {
		var me = this;
		var strCorpCode = ' ' , strCorpDesc =' ' ;
		
		if (!Ext.isEmpty(me.corpFilterVal) && me.corpFilterVal != undefined)
				strCorpCode = me.corpFilterVal;
		if (!Ext.isEmpty(me.corpFilterDesc) && me.corpFilterDesc != undefined)
			strCorpDesc = me.corpFilterDesc;
		
		var strUrl = "addUserAdminCategory.form";
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
		
		me.setFilterParameters(form);
		
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	/* Function sets the filter Panel element values in JSON */
	setFilterParameters : function(form) {
		var me = this;
		var arrJsn = {};
		var userNameVal, statusVal, categoryVal, sellerVal;
		var userCategoryFilterView = me.getUserCategoryFilterView();
		
		var userNameFltId = userCategoryFilterView
				.down('AutoCompleter[itemId=userNameFilter]');
	
		var userDescriptionFilter = userCategoryFilterView
				.down('AutoCompleter[itemId=userDescriptionFilter]');
		
		var objOfCreateNewFilter = me.getSellerClientMenuBar();
		var corpDesc = me.corpFilterDesc;
		var corpVal = me.corpFilterVal;

		if (!Ext.isEmpty(userNameFltId)
				&& !Ext.isEmpty(userNameFltId.getValue())) {
			    userNameVal = userNameFltId.getValue().toUpperCase();
		}
		if (!Ext.isEmpty(userDescriptionFilter)
				&& !Ext.isEmpty(userDescriptionFilter.getValue())) {
			categoryVal = userDescriptionFilter.getValue().toUpperCase();
		}
		if (!Ext.isEmpty(corpDesc)) {
			corpDesc = corpDesc.toUpperCase();
		}
		if (!Ext.isEmpty(corpVal)) {
			corpVal = corpVal.toUpperCase();
		}
		if (!Ext.isEmpty(me.sellerFilterVal)) {
			sellerVal = me.sellerFilterVal;
		}
		
		arrJsn['categoryCode'] = userNameVal;
		arrJsn['categoryDesc'] = categoryVal;
		arrJsn['corporationDesc'] = corpDesc;
		arrJsn['corporationCode'] = corpVal;
		
		arrJsn['sellerCode'] = sellerVal;
		

		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'filterData',
				Ext.encode(arrJsn)));
	},
	setFilterRetainedValues : function() {
	
		var me = this;
		var userCategoryFilterView = me.getUserCategoryFilterView();
		
		var userNameFltId = userCategoryFilterView
		.down('AutoCompleter[itemId=userNameFilter]');
		userNameFltId.setValue(filterUserName);
		
		var userDescriptionFilter = userCategoryFilterView
		.down('AutoCompleter[itemId=userDescriptionFilter]');
		userDescriptionFilter.setValue(filterCategoryVal);
		
		var objOfCreateNewFilter = me.getSellerClientMenuBar();
		var clientCodesFltId;
		if (!isClientUser()) {
			clientCodesFltId = userCategoryFilterView
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
				me.corpFilterDesc = strClientDesc;
				
			}else{
				me.clientCode = 'all';			
			}
			
		} else {
			clientCodesFltId = userCategoryFilterView
				.down('button[itemId="clientBtn"]');
			if(undefined != strClientDesc && strClientDesc != ''){	
				clientCodesFltId.setText(strClientDesc);
				me.clientCode = strClientId;
				me.corpFilterDesc = strClientDesc;				
			}	
			else{	
				clientCodesFltId.setText(getLabel('allCompanies', 'All Companies'));
				me.clientCode = 'all';
			}
		}
		me.setDataForFilter();
		//me.applyFilter();
		
	},
	setInfoTooltip : function() {
		var me = this;
		var infotip = Ext.create('Ext.tip.ToolTip', {
					target : 'imgFilterInfoGridView',
					listeners : {						
						beforeshow : function(tip) {						
							var client='';
							var	status='';
							var	desc='';
							var userNam='';							
							//me.corpFilterVal
							var filterView = me.getUserCategoryFilterView();
								if (!Ext.isEmpty(me.corpFilterDesc)) 
								{	
									client = me.corpFilterDesc;
								} 
								else 
								{
									if (!isClientUser())							
										client = getLabel('none', 'None');							
									else
										client = getLabel('allCompanies', 'All Companies');	
								}
								
								var userStatusFltId = filterView.down('combobox[itemId=userCategoryStatusFilter]');
								var description =filterView.down('combobox[itemId=userDescriptionFilter]');
								var userName =filterView.down('combobox[itemId=userNameFilter]');
								
								if(!Ext.isEmpty(userStatusFltId) && !Ext.isEmpty(userStatusFltId.getValue())) {
									status = userStatusFltId.getRawValue();
								} else {
									status = getLabel('all', 'All');								
								}
								if(!Ext.isEmpty(description) && !Ext.isEmpty(description.getValue())) {
									desc = description.getRawValue();
								} else {
									desc = getLabel('none', 'None');								
								}
								if(!Ext.isEmpty(userName) && !Ext.isEmpty(userName.getValue())) {
									userNam = userName.getRawValue();
								} else {
									userNam = getLabel('none', 'None');								
								}
								tip.update(getLabel('client', 'Client')
										+ ' : '
										+ client
										+ '<br/>'
										+ getLabel('userNam','User Name')
										+ ' : '
										+ userNam
										+ '<br/>'
										+ getLabel('desc','Description')
										+ ' : '
										+ desc
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
		var strModule = '', strUrl = null, args = null, strFilterCode = null;
		groupInfo = groupInfo || {};
		subGroupInfo = subGroupInfo || {};
		if (groupInfo) {
 				args = {
					scope : me
				};
				var colPrefModuleName = (subGroupInfo.groupCode === 'all') ? (groupInfo.groupTypeCode + subGroupInfo.groupCode) : subGroupInfo.groupCode;
				strModule = colPrefModuleName;
				strUrl = Ext.String.format(me.strGetModulePrefUrl, strModule);
				//me.getSavedPreferences(strUrl,
				//		me.postHandleDoHandleGroupTabChange, args);
			var data = null;	
			me.postHandleDoHandleGroupTabChange(data,args);
				
			}

	},
	postHandleDoHandleGroupTabChange : function(data, args) {
		var me = args.scope;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getCategoryListView(), objPref = null, gridModel = null, intPgSize = null;
		var colModel = null, arrCols = null;
		if (data && data.preference) {
			objPref = Ext.decode(data.preference);
			arrCols = objPref.gridCols || null;
			intPgSize = objPref.pgSize || _GridSizeTxn;
			colModel = objSummaryView.getColumnModel(arrCols);
			if (colModel) {
				gridModel = {
					columnModel : colModel,
					pageSize : intPgSize,
					storeModel:{
					  sortState:objPref.sortState
                    }
				}
			}
		}
		objGroupView.reconfigureGrid(gridModel);
	},
	doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
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
	doHandleRowActions : function(actionName, objGrid, record) {
		var me = this;
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();
		if (actionName === 'submit' || actionName === 'discard'
			|| actionName === 'accept' || actionName === 'reject'
			|| actionName === 'enable' || actionName === 'disable')
		me.doHandleGroupActions(actionName, grid, [record], 'rowAction');
	else if (actionName === 'btnHistory') {
		var recHistory = record.get('history');
		if (!Ext.isEmpty(recHistory)
				&& !Ext.isEmpty(recHistory.__deferred.uri)) {
			me.showHistory(record.get('categoryCode'),
					record.get('history').__deferred.uri, record
							.get('identifier'));
		}
	} else if (actionName === 'btnView' || actionName === 'btnEdit'
			|| actionName === 'btnClone'
			|| actionName === 'btnCloneTemplate') {
		//var updateIndex = rowIndex;
		
		if(actionName === 'btnEdit' && (sessionCategory == record.data.categoryCode && sessionCorporation == record.data.corporationCode)){
			Ext.MessageBox.show({
				title : 'Role Edit Error',
				msg : 'User Cannot Edit its Own Role',
				buttons : Ext.MessageBox.OK,
				icon : Ext.MessageBox.ERROR
			});
		}
		else {
			var strUrl = '', objFormData = {};
			if (actionName === 'btnView')
				strUrl = 'viewUserAdminCategory.form';
			else if (actionName === 'btnEdit')
				strUrl = 'editUserAdminCategory.form';
			else if (actionName === 'btnClone')
				strUrl = 'cloneCategory.form';
			else if (actionName === 'btnCloneTemplate')
				strUrl = 'editCategoryTemplate.form';
	
			objFormData.viewState = record.data.identifier;
	
			if (actionName === 'btnView' || actionName === 'btnEdit') {
				if (!Ext.isEmpty(strUrl)) {
					me.doSubmitForm(strUrl, objFormData);
				}
	
			} else if (actionName === 'btnClone'
					|| actionName === 'btnCloneTemplate') {
				var strActionUrl = Ext.String.format(
						'services/userCategory/{0}.json',
						(actionName === 'btnClone')
								? 'clone'
								: 'copytotemplate');
				var jsonPost = [{
							serialNo : 1,
							identifier : objFormData.viewState,
							userMessage : ''
						}];
	
				Ext.Ajax.request({
					url : strActionUrl,
					method : 'POST',
					jsonData : Ext.encode(jsonPost),
					success : function(response) {
						var data = Ext.decode(response.responseText);
						if (!Ext.isEmpty(data) && data.d
								&& data.d.instrumentActions) {
							var result = data.d.instrumentActions[0];
							if (result) {
								if (result.success === 'Y') {
									objFormData.viewState = result.identifier;
									me.doSubmitForm(strUrl, objFormData);
								} else if (result.success === 'N') {
									Ext.MessageBox.show({
												title : getLabel(
														'instrumentErrorPopUpTitle',
														'Error'),
												msg : getLabel(
														'instrumentErrMsg',
														'Unable to perform action..'),
												buttons : Ext.MessageBox.OK,
												icon : Ext.MessageBox.ERROR
											});
	
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
									msg : getLabel('instrumentErrorPopUpMsg',
											'Error while fetching data..!'),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								});
					}
				});
	
			}
			}
		
		}
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
					&& objData.raw.requestState != 7
					&& objData.raw.requestState != 4
					&& objData.raw.requestState != 5) {
				isSubmitted = true;
			}
		}
		actionMask = doAndOperation(maskArray, 10);
		me.enableDisableGroupActions(actionMask, isSameUser, isDisabled,
				isSubmitted);
		//objGroupView.handleGroupActionsVisibility(actionMask);
	},
	doHandleGroupActions : function(strAction, grid, arrSelectedRecords,
			strActionType) {
		var me = this;
		if(!Ext.isEmpty(strAction))
			var strAction = strAction;
		var strUrl = Ext.String.format('services/userCategory/{0}.json',
				strAction);
		if (strAction === 'reject') {
			me.showRejectPopUp(strAction, strUrl, grid, arrSelectedRecords);

		} else {
			me.preHandleGroupActions(strUrl, '',grid,arrSelectedRecords);
		}
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
			grid.removeAppliedSort();
		}
		objGroupView.refreshData();
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
		strUrl = 'services/userCategoryListReport.' + strExtension;
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
