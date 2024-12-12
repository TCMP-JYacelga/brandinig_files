Ext.define('GCP.controller.OrderingPartiesController', {
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
			}, {
				ref : 'groupView',
				selector : 'clientSetupView groupView'
			},{
				ref : 'createNewToolBar',
				selector : 'clientSetupView clientSetupGridView toolbar[itemId="btnCreateNewToolBar"]'
			}, {
				ref : 'clientSetupFilterView',
				selector : 'clientSetupView clientSetupFilterView'
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
				ref : "orderPartyClientCodesFilterCombo",
				selector : 'clientSetupView clientSetupFilterView combobox[itemId=orderPartyClientCodesFltId]'
			}, {
				ref : "orderPartyClientCodesFilterAuto",
				selector : 'clientSetupView clientSetupFilterView AutoCompleter[itemId=orderPartyClientCodesFltId]'
			}, {
				ref : "orderPartyNameFltAuto",
				selector : 'clientSetupView clientSetupFilterView AutoCompleter[itemId=orderPartyNameFltId]'
			}, {
				ref : "orderPartyCodeFltAuto",
				selector : 'clientSetupView clientSetupFilterView AutoCompleter[itemId=orderPartyCodeFltId]'
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
			}],
	config : {
		selectedMst : 'client',
		clientListCount : 0,
		clientCode : '',
		clientDesc : '',
		brandingPkgListCount : 0,
		filterData : [],
		copyByClicked : '',
	    filterApplied : 'ALL',
		sellerFilterVal : null,
		clientFilterVal : null,
		clientFilterDesc: null,
		reportGridOrder : null
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
          me.sellerFilterVal=strSellerId;
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
					me.clientFilterVal  = strClientId;				
					me.clientFilterDesc = strClientDescr;
					me.setInfoTooltip();	
				}
				
			},
			'clientSetupView clientSetupFilterView combo[itemId=orderPartyClientCodesFltId]' : {
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
			'clientSetupView clientSetupFilterView AutoCompleter[itemId="clientCodeId"]' : {
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
			},
			
			'clientSetupView clientSetupFilterView' : {
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
			 'clientSetupView clientSetupFilterView combobox[itemId=orderPartyCodeFltId]' : {
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
			'clientSetupView clientSetupFilterView combobox[itemId=orderPartyNameFltId]' : {
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
			'clientSetupView button[itemId="btnCreateParty"]' : {
				click : function() {
					me.handleClientEntryAction(true);
				}
			},
			'clientSetupTitleView' : {
				performReportAction : function(btn, opts) {
					me.handleReportAction(btn, opts);
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
		me.reportGridOrder = strUrl;
		grid.loadGridData(strUrl, null, null, false);
	},
	
	
	setFilterRetainedValues : function() {
			var me = this;
		var clientSetupFilterView = me.getClientSetupFilterView();
		// Set Seller Id Filter Value
		/*var sellerFltId = clientSetupFilterView
				.down('combobox[itemId=sellerFltId]');
		sellerFltId.setValue(strSellerId);
*/
		// set Ordering Party Name Filter Value
		var orderPartyNameFltId = clientSetupFilterView
				.down('combobox[itemId=orderPartyNameFltId]');
		orderPartyNameFltId.setValue(orderingPartyName);

		// set Ordering Party ID Filter Value
		var orderPartyCodeFltId = clientSetupFilterView
				.down('combobox[itemId=orderPartyCodeFltId]');
		orderPartyCodeFltId.setValue(orderingPartyId);
           var clientCodesFltId ;
		if (userType == '0') {
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
				.down('button[itemId="clientBtn"]');
			if(undefined != strClientDescr && strClientDescr != ''){	
				clientCodesFltId.setText(strClientDescr);				
				me.clientFilterVal  = strClientId;				
				me.clientFilterDesc = strClientDescr;					
			}	
			else{	
				clientCodesFltId.setText(getLabel('allCompanies', 'All Companies'));
				me.clientFilterVal = 'all';				
			}
		}
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
		var clientCodesFltId = clientSetupFilterView
				.down('AutoCompleter[itemId=clientCodeId]');
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

		
			if (!Ext.isEmpty(orderPartyNameFltAuto) && !Ext.isEmpty(strSellerId)) {
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
			}
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
	showClientList : function(btn, opts) {
		var me = this;
		me.selectedMst = 'client';
		me.handleSmartGridConfig();
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		me.setDataForFilter();
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + me.getFilterUrl();
		grid.loadGridData(strUrl, null);
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
	setDataForFilter : function() {
		var me = this;
		//me.getSearchTextInput().setValue('');
		this.filterData = this.getFilterQueryJson();
	},
	getFilterQueryJson : function() {
		var me = this;
		var sellerVal = null, orderPartyNameVal = null, orderPartyCodeVal = null, orderPartyClientCodeVal = null, subCategoryVal = null, jsonArray = [];
		var clientParamName = null, clientNameOperator = null;
         var clientNamesFltId = null;
		var clientSetupFilterView = me.getClientSetupFilterView();
		if(entityType==1)
			clientNamesFltId = clientSetupFilterView
					.down('button[itemId="clientBtn"]');	
		else
			clientNamesFltId = clientSetupFilterView
					.down('combobox[itemId=clientCodeId]');
		/*var sellerFltId = clientSetupFilterView
				.down('combobox[itemId=sellerFltId]');
*/
		var orderPartyNameFltId = clientSetupFilterView
				.down('combobox[itemId=orderPartyNameFltId]');

		var orderPartyCodeFltId = clientSetupFilterView
				.down('combobox[itemId=orderPartyCodeFltId]');

		/*var orderPartyClientCodesFltId = clientSetupFilterView
				.down('combobox[itemId=orderPartyClientCodesFltId]');
*/
		/*if (!Ext.isEmpty(sellerFltId) && !Ext.isEmpty(sellerFltId.getValue())) {
			sellerVal = sellerFltId.getValue();
		}*/
	/*if (entityType==0) {
			var sellerFltId = clientSetupFilterView
				.down('AutoCompleter[itemId=clientCodeId]');
				sellerVal=me.sellerFilterVal;
		}

		if (!Ext.isEmpty(sellerVal)) {
			jsonArray.push({
						paramName : 'seller',
						paramValue1 : sellerVal.toUpperCase(),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}*/

		if (!Ext.isEmpty(orderPartyNameFltId)
				&& !Ext.isEmpty(orderPartyNameFltId.getValue())) {
			orderPartyNameVal = orderPartyNameFltId.getValue();
		}

		if (!Ext.isEmpty(orderPartyNameVal)) {
			jsonArray.push({
						paramName : orderPartyNameFltId.name,
						paramValue1 : orderPartyNameVal.toLowerCase(),
						operatorValue : 'lk',
						dataType : 'S'
					});
		}

		if (!Ext.isEmpty(orderPartyCodeFltId)
				&& !Ext.isEmpty(orderPartyCodeFltId.getValue())) {
			orderPartyCodeVal = orderPartyCodeFltId.getValue();
		}

		if (!Ext.isEmpty(orderPartyCodeVal)) {
			jsonArray.push({
						paramName : orderPartyCodeFltId.name,
						paramValue1 : orderPartyCodeVal.toLowerCase(),
						operatorValue : 'lk',
						dataType : 'S'
					});
		}
    
	  if (!Ext.isEmpty(clientNamesFltId) && !Ext.isEmpty(me.clientFilterVal) && me.clientFilterVal!= 'all' ) {
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
							paramValue1 : clientCodeVal,
							operatorValue : clientNameOperator,
							dataType : 'S'
						});
			}
		}
		/*if (!Ext.isEmpty(orderPartyClientCodesFltId) && !Ext.isEmpty(orderPartyClientCodesFltId.getValue())) {
			clientParamName = 'clientId';
			clientNameOperator = 'eq';
			if (!Ext.isEmpty(me.clientCode)) {
				orderPartyClientCodeVal = me.clientCode;
			} else {
				orderPartyClientCodeVal = strClientId;
			}

			if (!Ext.isEmpty(orderPartyClientCodeVal)) {
				jsonArray.push({
							paramName : clientParamName,
							paramValue1 : orderPartyClientCodeVal,
							operatorValue : clientNameOperator,
							dataType : 'S'
						});
			}
		}*/

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
							me.preHandleGroupActions(strActionUrl, text, grid, record);
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
		/*var sellerCombo = clientSetupFilterView
				.down('combobox[itemId=sellerFltId]');*/
		selectedSeller = me.sellerFilterVal;
		var selectedClient = null;
		/*var clientCodesFltId = clientSetupFilterView
				.down('combobox[itemId=orderPartyClientCodesFltId]');*/
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
		var arrJsn = {};
		var clientSetupFilterView = me.getClientSetupFilterView();
		/*var sellerCombo = clientSetupFilterView
				.down('combobox[itemId=sellerFltId]');
		var clientCodesFltId = clientSetupFilterView
				.down('combobox[itemId=orderPartyClientCodesFltId]');*/
		var orderPartyNameFltId = clientSetupFilterView
				.down('combobox[itemId=orderPartyNameFltId]');
		var orderPartyCodeFltId = clientSetupFilterView
				.down('combobox[itemId=orderPartyCodeFltId]');
		var selectedSeller = me.sellerFilterVal;
		var selectedClient = me.clientFilterVal;;
		if (!Ext.isEmpty(orderPartyNameFltId)
				&& !Ext.isEmpty(orderPartyNameFltId.getValue())) {
			orderingPartyName = orderPartyNameFltId.getValue();
		}
		if (!Ext.isEmpty(orderPartyCodeFltId)
				&& !Ext.isEmpty(orderPartyCodeFltId.getValue())) {
			orderingPartyId = orderPartyCodeFltId.getValue();
		}
		arrJsn['sellerId'] = selectedSeller;
		arrJsn['clientId'] = selectedClient;
		arrJsn['clientDesc'] = me.clientFilterDesc;
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
                            var clientSetupFilterView = me.getClientSetupFilterView();
							var orderPartyNameFltId = clientSetupFilterView
				   .down('combobox[itemId=orderPartyNameFltId]');
		           var orderPartyCodeFltId = clientSetupFilterView
				                     .down('combobox[itemId=orderPartyCodeFltId]');
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
								
								
								tip.update(getLabel('client', 'Company Name')
										+ ' : '
										+ client
										+ '<br/>'
										+ getLabel('oredringPartyName', 'Ordering Party Name')
										+ ' : '
										+ oredringPartyName
										+ '<br/>'
										+ getLabel('orderIngPartyId', 'Ordering Party ID')
										+ ' : '
										+ orderingPartyId);
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
		strUrl = 'services/generateOrderingPartiesReport.' + strExtension;
		strUrl += '?$skip=1';
		//strUrl += this.generateFilterUrl();
		var objGroupView = me.getGroupView();
		var groupInfo = objGroupView.getGroupInfo();
		var subGroupInfo = objGroupView.getSubGroupInfo();
		strUrl += me.getFilterUrl(subGroupInfo, groupInfo);		
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

	}

});
function showClientPopup(brandingPkg) {
	GCP.getApplication().fireEvent('showClientPopup', brandingPkg);
}