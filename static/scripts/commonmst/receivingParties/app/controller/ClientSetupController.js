Ext.define('GCP.controller.ClientSetupController', {
	extend : 'Ext.app.Controller',
	requires : [],
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
				ref : 'createNewToolBar',
				selector : 'clientSetupView clientSetupGridView toolbar[itemId="btnCreateNewToolBar"]'
			}, {
				ref : 'specificFilterPanel',
				selector : 'clientSetupView clientSetupFilterView panel[itemId="specificFilter"]'
			}, {
				ref : 'clientSetupGridView',
				selector : 'clientSetupView clientSetupGridView'
			}, {
				ref : 'clientSetupFilterView',
				selector : 'clientSetupView clientSetupFilterView'
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
				ref : "statusFilter",
				selector : 'clientSetupView clientSetupFilterView combobox[itemId="statusFilter"]'
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
			},{
				ref : 'clientNamesFilterAuto',
				selector : 'clientSetupView clientSetupFilterView AutoCompleter[itemId=clientAutoCompleter]'
			}, {
				ref : 'receiverNameFilterAuto',
				selector : 'clientSetupView clientSetupFilterView AutoCompleter[itemId=receiverNameFltId]'
			}, {
				ref : 'accountNoFilterAuto',
				selector : 'clientSetupView clientSetupFilterView AutoCompleter[itemId=accountNoFltId]'
			}

	],
	config : {
		selectedMst : 'client',
		clientListCount : 0,
		clientCode : '',
		clientDesc : '',
		brandingPkgListCount : 0,
		filterData : [],
		sellerOfSelectedClient : '',
		copyByClicked : '',
		strDefaultMask : '000000000000000000',
		strGetModulePrefUrl : 'services/userpreferences/usercategory/{0}.json'
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
			/*'clientSetupView clientSetupGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateClient"]' : {
				click : function() {
					me.handleClientEntryAction(true);
				}
			},
			'clientSetupView clientSetupFilterView' : {
				render : function() {
					if (!Ext.isEmpty(modelSelectedMst))
						me.selectedMst = modelSelectedMst;
				}
			},
			'clientSetupView clientSetupGridView panel[itemId="clientSetupDtlView"]' : {
				render : function() {
					if (!Ext.isEmpty(modelSelectedMst))
						me.selectedMst = modelSelectedMst;
					me.handleGridHeader();
				}
			},
			'clientSetupView toolbar[itemId="btnActionToolBar"] button[itemId="btnBrandingPkgList"]' : {
				click : function() {
					me.filterData = [];
					me.handleSpecificFilter();
					me.handleGridHeader();
				}
			},
			'clientSetupView toolbar[itemId="btnActionToolBar"] button[itemId="btnClientList"]' : {
				click : function() {
					me.filterData = [];
					me.showClientList();
					me.handleSpecificFilter();
					me.handleGridHeader();
				}
			},

			'clientSetupGridView' : {
				render : function(panel) {
					//me.handleSmartGridConfig();
					//me.setFilterRetainedValues();	
					me.clientCode = strClientId;
					me.clientDesc = strClientDescription;	
					me.setInfoTooltip();	
				}
			},
			'clientSetupGridView textfield[itemId="searchTextField"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'clientSetupGridView radiogroup[itemId="matchCriteria"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'clientSetupGridView smartgrid' : {
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
			'clientSetupGridView toolbar[itemId=clientGroupActionBarView_clientDtl]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			},*/
			'clientSetupView clientSetupTitleView' : {
				'performReportAction' : function(btn, opts) {
					this.handleReportAction(btn, opts);
				}
			},
			'clientSetupView clientSetupFilterView' : {
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
			'clientSetupView clientSetupFilterView combobox[itemId=receiverNameFltId]' : {
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
			'clientSetupView clientSetupFilterView combobox[itemId=accountNoFltId]' : {
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
					me.clientCode = strClientId;
					me.clientDesc = strClientDescription;	
					me.setInfoTooltip();	
				}
			},
			'clientSetupView button[itemId="btnCreateClient"]' : {
				click : function() {
					me.handleClientEntryAction(true);
				}
			}
		});
	},
	
	// method to handle client list and branding pkg list link click

	showClientList : function(btn, opts) {
		var me = this;
		me.selectedMst = 'client';
		me.handleSmartGridConfig();
	},
	resetAllFilters : function() {
		var me = this;
		if(isClientUser())
			if (!Ext.isEmpty(me.getClientInlineBtn())) {
				me.getClientInlineBtn().setText(getLabel('allCompanies', 'All Companies'));
			}
		else	
			if (!Ext.isEmpty(me.getClientNamesFilterAuto())) {
				me.getClientNamesFilterAuto().setValue('');
			}
		if (!Ext.isEmpty(me.getReceiverNameFilterAuto())) {
			me.getReceiverNameFilterAuto().setValue('');
		}
		if (!Ext.isEmpty(me.getAccountNoFilterAuto())) {
			me.getAccountNoFilterAuto().setValue('');
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

	showHistory : function(isClient, clientName, url, id) {
		Ext.create('GCP.view.HistoryPopup', {
					isClient : isClient,
					historyUrl : url,
					identifier : id,
					clientName : clientName
				}).show();
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
		var strUrl = Ext.String.format('services/receiversList/{0}', strAction);
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
							me
									.preHandleGroupActions(strActionUrl, text,
											record);
						}
					}
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

	handleClientEntryAction : function(entryType) {
		var me = this;
		var selectedClient = null;
		var strUrl = 'addApprovalMatrix.form';
		var clientSetupFilterView = me.getClientSetupFilterView();
		//var sellerCombo = clientSetupFilterView
		//		.down('combobox[itemId=sellerFltId]');
		//var clientCodesFltId = clientSetupFilterView
		//		.down('combobox[itemId=clientNamesFltId]');
		var selectedSeller = (!Ext.isEmpty(me.sellerOfSelectedClient)) ? me.sellerOfSelectedClient : strSellerId;//sellerCombo.getValue();
		selectedClient = me.clientCode;//clientCodesFltId.getValue();
		var form;
		var strUrl = 'addBeneficiary.form';

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
		var accountNo = null, accountNoVal = null;
		var receiverNameVal = null;
		var arrJsn = {};
		var clientSetupFilterView = me.getClientSetupFilterView();
		var sellerCombo = clientSetupFilterView
				.down('combobox[itemId=sellerFltId]');
		var receiverNameFltId = clientSetupFilterView
				.down('combobox[itemId=receiverNameFltId]');
		var accountNoFltId = clientSetupFilterView
				.down('combobox[itemId=accountNoFltId]');
		if (!Ext.isEmpty(receiverNameFltId)
				&& !Ext.isEmpty(receiverNameFltId.getValue())) {
			receiverNameVal = receiverNameFltId.getValue();
		}
		if (!Ext.isEmpty(accountNoFltId)
				&& !Ext.isEmpty(accountNoFltId.getValue())) {
			accountNo = accountNoFltId.getValue(), accountNoVal = accountNo
					.trim();
		}
		arrJsn['sellerId'] = (!Ext.isEmpty(me.sellerOfSelectedClient)) ? me.sellerOfSelectedClient : strSellerId;;
		arrJsn['clientId'] = me.clientCode;
		arrJsn['clientDesc'] = me.clientDesc;
		arrJsn['receiverName'] = receiverNameVal;
		arrJsn['accountNmbr'] = accountNoVal;
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
							var receiverName = '';
							var accountNumber = '';
							var clientSetupFilterView = me.getClientSetupFilterView();
					
							var receiverNameFltId = clientSetupFilterView
									.down('combobox[itemId=receiverNameFltId]');
					
							var accountNoFltId = clientSetupFilterView
									.down('combobox[itemId=accountNoFltId]');
							
							if (!Ext.isEmpty(receiverNameFltId)
									&& !Ext.isEmpty(receiverNameFltId.getValue())) {
								receiverName =receiverNameFltId.getValue();
							}else
								receiverName = getLabel('none','None');
												
							if (!Ext.isEmpty(accountNoFltId)
									&& !Ext.isEmpty(accountNoFltId.getValue())) {
								accountNumber = accountNoFltId.getValue();
							}else
								accountNumber = getLabel('none','None');
								client = (me.clientDesc != '') ? me.clientDesc : getLabel('allcompanies', 'All Companies');
								tip.update(getLabel('grid.column.company', 'Company Name')
										+ ' : '
										+ client
										+ '<br/>'
										+ getLabel('receiverName', 'Receiver Name')
										+ ' : '
										+ receiverName
										+ '<br/>'
										+ getLabel('accountNumber', 'Account')
										+ ' : '
										+ accountNumber);
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
			downloadReport : 'pdf',
			downloadTsv : 'tsv',
			downloadBAl2 : 'bai2'
		};
		var currentPage = 1;
		var strExtension = '';
		var strUrl = '';
		var strSelect = '';
		var activeCard = '';

		strExtension = arrExtension[actionName];
		strUrl = 'services/generateReceiversListReport.' + strExtension;
		strUrl += '?$skip=1';
		strUrl += this.generateFilterUrl();
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
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
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
		var strModule = '', strUrl = null, args = null, strFilterCode = null;
		groupInfo = groupInfo || {};
		subGroupInfo = subGroupInfo || {};
		if (groupInfo) {
 				args = {
					scope : me
				};
				var colPrefModuleName = (subGroupInfo.groupCode === 'all') ? (groupInfo.groupTypeCode + subGroupInfo.groupCode) : subGroupInfo.groupCode;
				strModule = colPrefModuleName;
				//me.getSavedPreferences(strUrl,
				//		me.postHandleDoHandleGroupTabChange, args);
			var data = null;	
			me.postHandleDoHandleGroupTabChange(data,args);
				
			}

	},
	postHandleDoHandleGroupTabChange : function(data, args) {
		var me = args.scope;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getClientSetupView(), objPref = null, gridModel = null, intPgSize = null;
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
		//objGroupView.handleGroupActionsVisibility(buttonMask);
		me.setDataForFilter();
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl += me.getFilterUrl(subGroupInfo, groupInfo);
		grid.loadGridData(strUrl, null, null, false);
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
					me.showHistory(true, record.get('clientId'), record
									.get('history').__deferred.uri, record
									.get('identifier'));
				}
			}
	} else if (actionName === 'btnView' || actionName === 'btnEdit') {
		if (actionName === 'btnView') {
			me.submitExtForm('viewBeneficiary.form', record, rowIndex);
		} else if (actionName === 'btnEdit') {
			me.submitExtForm('editBeneficiary.form', record, rowIndex);
		}
		}
	},
	submitExtForm : function(strUrl, record, rowIndex) {
		var me = this;
		var viewState = record.data.identifier;
		console.log(viewState);
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
		var strUrl = Ext.String.format('services/receiversList/{0}', strAction);
		if (strAction === 'reject') {
			me.showRejectPopUp(strAction, strUrl, grid, arrSelectedRecords);

		} else {
			me.preHandleGroupActions(strUrl, '',grid,arrSelectedRecords);
		}
	},
	showRejectPopUp : function(strAction, strActionUrl, grid, record) {
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
							me
									.preHandleGroupActions(strActionUrl, text, grid,
											record);
						}
					}
				});
	},
	setDataForFilter : function() {
		var me = this;
		//me.getSearchTextInput().setValue('');
		this.filterData = this.getFilterQueryJson();
	},
	getFilterQueryJson : function() {
		var me = this;
		var sellerVal = null, receiverNameVal = null, accountNoVal = null, clientCodeVal = null, subCategoryVal = null, jsonArray = [];
		var clientParamName = null, clientNameOperator = null;
		var clientNamesFltId = null;
		var clientSetupFilterView = me.getClientSetupFilterView();
		var receiverNameFltId = clientSetupFilterView
				.down('combobox[itemId=receiverNameFltId]');

		var accountNoFltId = clientSetupFilterView
				.down('combobox[itemId=accountNoFltId]');
		if(isClientUser())
			clientNamesFltId = clientSetupFilterView
					.down('button[itemId="clientBtn"]');	
		else
			clientNamesFltId = clientSetupFilterView
					.down('combobox[itemId=clientAutoCompleter]');
		if (!Ext.isEmpty(receiverNameFltId)
				&& !Ext.isEmpty(receiverNameFltId.getValue())) {
			receiverName = receiverNameFltId.getValue(), receiverNameVal = receiverName
					.trim();
		}

		if (!Ext.isEmpty(receiverNameVal)) {
			jsonArray.push({
						paramName : receiverNameFltId.name,
						paramValue1 : receiverNameVal.toUpperCase(),
						operatorValue : 'lk',
						dataType : 'S'
					});
		}

		if (!Ext.isEmpty(accountNoFltId)
				&& !Ext.isEmpty(accountNoFltId.getValue())) {
			accountNo = accountNoFltId.getValue(), accountNoVal = accountNo
					.trim();
		}

		if (!Ext.isEmpty(accountNoVal)) {
			jsonArray.push({
						paramName : accountNoFltId.name,
						paramValue1 : accountNoVal.toUpperCase(),
						operatorValue : 'lk',
						dataType : 'S'
					});
		}

		if (!Ext.isEmpty(clientNamesFltId) && !Ext.isEmpty(me.clientCode) && me.clientCode!= 'all' ) {
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
							paramValue1 : clientCodeVal,
							operatorValue : clientNameOperator,
							dataType : 'S'
						});
			}
		}

		return jsonArray;
	},
	setFilterRetainedValues : function() {
		var me = this;
		var clientSetupFilterView = me.getClientSetupFilterView();
		// set Receiver Party Name Filter Value
		var receiverNameFltId = clientSetupFilterView
				.down('combobox[itemId=receiverNameFltId]');
		receiverNameFltId.setValue(receiverName);

		// set Ordering Party ID Filter Value
		var accountNoFltId = clientSetupFilterView
				.down('combobox[itemId=accountNoFltId]');
		accountNoFltId.setValue(accountNmbr);

		// Set Client Name Filter Value
		var clientCodesFltId ;
		if (userType == '0') {
			clientCodesFltId = clientSetupFilterView
				.down('combobox[itemId=clientAutoCompleter]');
			if(undefined != strClientDescription && strClientDescription != ''){		
				clientCodesFltId.store.loadRawData({
									"d" : {
										"preferences" : [{
													"CODE" : strClientId,
													"DESCR" : strClientDescription
												}]
									}
								});
	
				clientCodesFltId.suspendEvents();
				clientCodesFltId.setValue(strClientId);
				clientCodesFltId.resumeEvents();
				me.clientCode = strClientId;
			}else{
				me.clientCode = 'all';			
			}
			
		} else {
			clientCodesFltId = clientSetupFilterView
				.down('button[itemId="clientBtn"]');
			if(undefined != strClientDescription && strClientDescription != ''){	
				clientCodesFltId.setText(strClientDescription);
				me.clientCode = strClientId;	
			}	
			else{	
				clientCodesFltId.setText(getLabel('allCompanies', 'All Companies'));
				me.clientCode = 'all';
			}
		}
		me.changeFilterParams();

	},
	changeFilterParams : function() {
		var me = this;
		var clientSetupFilterView = me.getClientSetupFilterView();
		var receiverNameFltAuto = clientSetupFilterView
				.down('AutoCompleter[itemId=receiverNameFltId]');
		var accNoFltAuto = clientSetupFilterView
				.down('AutoCompleter[itemId=accountNoFltId]');
		if (!Ext.isEmpty(receiverNameFltAuto)) {
			receiverNameFltAuto.cfgExtraParams = new Array();
		}
		if (!Ext.isEmpty(accNoFltAuto)) {
			accNoFltAuto.cfgExtraParams = new Array();
		}
			if (!Ext.isEmpty(receiverNameFltAuto) && !Ext.isEmpty(strSellerId)) {
				receiverNameFltAuto.cfgExtraParams.push({
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
			if (!Ext.isEmpty(receiverNameFltAuto) && me.clientCode!= 'all' && me.clientCode!= null) {
				receiverNameFltAuto.cfgExtraParams.push({
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
		grid.removeAppliedSort();
		objGroupView.refreshData();
	}

});
function showClientPopup(brandingPkg) {
	GCP.getApplication().fireEvent('showClientPopup', brandingPkg);
}