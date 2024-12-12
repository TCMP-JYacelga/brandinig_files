Ext.define('GCP.controller.CollectionMethodController', {
	extend : 'Ext.app.Controller',
	requires : [],
	views : ['GCP.view.CollectionMethodView', 'GCP.view.CollectionMethodGridView','GCP.view.HistoryPopup','GCP.view.CollectionMethodActionBarView'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'scmProductView',
				selector : 'collectionMethodView'
			}, {
				ref : 'createNewToolBar',
				selector : 'collectionMethodView collectionMethodGridView toolbar[itemId="btnCreateNewToolBar"]'
			},{
				ref : 'specificFilterPanel',
				selector : 'collectionMethodView collectionMethodFilterView panel[itemId="specificFilter"]'
			},{
				ref : 'scmProductGridView',
				selector : 'collectionMethodView collectionMethodGridView'
			}, {
				ref : 'clientSetupDtlView',
				selector : 'collectionMethodView collectionMethodGridView panel[itemId="clientSetupDtlView"]'
			}, {
				ref : 'gridHeader',
				selector : 'collectionMethodView collectionMethodGridView panel[itemId="clientSetupDtlView"] container[itemId="gridHeader"]'
			}, {
				ref : 'scmProductGrid',
				selector : 'collectionMethodView collectionMethodGridView grid[itemId="gridViewMstId"]'
			},{
				ref : 'searchTextInput',
				selector : 'collectionMethodGridView textfield[itemId="searchTextField"]'
			}, {
				ref : 'matchCriteria',
				selector : 'collectionMethodGridView radiogroup[itemId="matchCriteria"]'
			},{
				ref : 'grid',
				selector : 'collectionMethodGridView smartgrid'
			},{
				ref : "corporationFilter",
				selector : 'collectionMethodView collectionMethodFilterView combobox[itemId="sellerFltId"]'
			},{
				ref : "clientFilter",
				selector : 'collectionMethodView collectionMethodFilterView textfield[itemId="profileNameFltId"]'
			},{
				ref : "statusFilter",
				selector : 'collectionMethodView collectionMethodFilterView combobox[itemId="statusFilter"]'
			},{
				ref : "typeFilter",
				selector : 'collectionMethodView collectionMethodFilterView combobox[itemId="profileStatusFltId"]'
			}, {
				ref : 'groupActionBar',
				selector : 'collectionMethodView collectionMethodGridView collectionMethodBarView'
			},{
				ref : 'clientListLink',
				selector : 'collectionMethodView toolbar[itemId="btnActionToolBar"] button[itemId="btnClientList"]'
			} ,{
				ref : 'prfMstDtlView',
				selector : 'collectionMethodView collectionMethodGridView panel[itemId="prfMstDtlView"]'
			},{
				ref : 'collectionMethodMstGrid',
				selector : 'collectionMethodView collectionMethodGridView grid[itemId="gridViewMstId"]'
			},{
				ref : 'sellerFilterPanel',
				selector : 'collectionMethodView collectionMethodFilterView panel[itemId="sellerFilter"]'
			}, {
				ref : 'sellerCombo',
				selector : 'collectionMethodView collectionMethodFilterView panel[itemId="sellerFilter"] combo[itemId="sellerCombo"]'
			} ],
	config : {
		selectedMst : 'client',
		clientListCount : 0,
		brandingPkgListCount : 0,
		filterData : []
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		
		me.control({
		'collectionMethodView ' : {
				changePkgProductList : function(btn, type) {
					me.handlePackageProductList(btn, type);
				},
				addAlertEvent : function(btn) {
					me.handleAddNewProfileMaster(btn);
				}
			},
			'collectionMethodView collectionMethodGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateBeneficiary"]' : {
				click : function() {
					me.handleSCMProductEntryAction(true);
				}
			},
			'collectionMethodView collectionMethodFilterView' : {
				render : function() {
					me.setInfoTooltip();
					me.handleSpecificFilter();
				}
			},
			'collectionMethodView collectionMethodFilterView button[itemId="btnFilter"]' : {
				click : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
				}
			},
			'collectionMethodView collectionMethodGridView panel[itemId="clientSetupDtlView"]' : {
				render : function() {
					me.handleGridHeader();
					
				}
			},
			'collectionMethodView toolbar[itemId="btnActionToolBar"] button[itemId="btnClientList"]' : {
				click : function() {
					me.filterData = [];
					me.handleSpecificFilter();
					me.handleGridHeader();
				}
			},

			'collectionMethodGridView' : {
				render : function(panel) {
					me.handleSmartGridConfig();
				}
			},
			'collectionMethodGridView textfield[itemId="searchTextField"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'collectionMethodGridView radiogroup[itemId="matchCriteria"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'collectionMethodGridView smartgrid' : {
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
			'collectionMethodGridView toolbar[itemId=clientGroupActionBarView_clientDtl]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			}

		});
	},
	
	handleSpecificFilter : function() {
		var me = this;
		var storeData;
		var multipleSellersAvailable = false;

		Ext.Ajax.request({
					url : 'services/userseek/adminSellersListCommon.json',
					method : 'POST',
					async : false,
					success : function(response) {
						var data = Ext.decode(response.responseText);
						var sellerData = data.d.preferences;
						if (!Ext.isEmpty(data)) {
							storeData = sellerData;
						}
					},
					failure : function(response) {
						// console.log("Ajax Get data Call Failed");
					}
				});

		var sellerStore = Ext.create('Ext.data.Store', {
					fields : ['CODE', 'DESCR'],
					data : storeData,
					reader : {
						type : 'json',
						root : 'preferences'
					}					
				});
		if (sellerStore.getCount() > 1) {
			multipleSellersAvailable = true;
		}
			objStore = Ext.create('Ext.data.Store', {
							fields : ["name", "value"],
							proxy : {
								type : 'ajax',
								autoLoad : true,
								url : 'cpon/collectionProductTypeList.json',
								actionMethods : {
									read : 'POST'
								},
								reader : {
									type : 'json',
									root : 'd.filter'
								}
							}
						});
		me.getSearchTextInput().setValue('');
		me.getStatusFilter().setValue('');
		var clientTextfield = Ext.create('Ext.ux.gcp.AutoCompleter', {
					fieldCls : 'xn-form-text xn-suggestion-box',
					name : 'packageName',
					fitToParent : true,
					width : 168,
					itemId : 'profileNameFltId',
					cfgUrl : 'cpon/cponseek/{0}.json',
					cfgProxyMethodType : 'POST',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgSeekId : 'collectionMethodProfileNameSeek',
					cfgRootNode : 'd.filter',
					cfgDataNode1 : 'name'
				});
		
		var filterPanel = me.getSpecificFilterPanel();
		var sellerPanel = me.getSellerFilterPanel();
		if (!Ext.isEmpty(filterPanel))
		{
			filterPanel.removeAll();
		}	
		
	      
			filterPanel.add( {
								xtype : 'panel',
								cls : 'xn-filter-toolbar',
								layout : 'vbox',
								flex: 0.4,
								items : [{
											xtype : 'label',
											text : getLabel('methodName', ' Receivable Package Name'),
											cls : 'frmLabel'
										}, clientTextfield]
								});
			filterPanel.add({
				xtype : 'panel',
				cls : 'xn-filter-toolbar',
				layout : 'vbox',
				flex: 0.2,
				items : [{
					xtype : 'label',
					cls : 'frmLabel',
					text : ' '
				}]
			});
			filterPanel.add( {
		                            xtype : 'panel',
									cls : 'xn-filter-toolbar',
									layout : 'vbox',
									flex: 0.4,
									items : [{
												xtype : 'label',
												cls : 'frmLabel',
												text : getLabel('type', 'Product Category')
											}, {
												xtype : 'combo',
												//columnWidth : 0.5,
												displayField : 'value',
												width : 165,
												fieldCls : 'xn-form-field inline_block',
												triggerBaseCls : 'xn-form-trigger',
												filterParamName : 'productCatType',
												itemId : 'profileStatusFltId',
												valueField : 'name',
												name : 'productCatType',
												editable : false,
												value : 'ALL',
												store : objStore
												//width : 'auto'
												//padding : '1 0 0 10',
												//width : 165
											}]
									});
					
			
//			filterPanel.columnWidth = 0.55;
			if (!Ext.isEmpty(sellerPanel)) {
				sellerPanel.removeAll();
			}
			sellerPanel.add({
						xtype : 'label',
						text : getLabel('financialInstitution',
								'Financial Institution'),
								cls :'frmLabel'
					}, {
						xtype : 'combo',
						width : 165,
						displayField : 'DESCR',
						fieldCls : 'xn-form-field inline_block',
						triggerBaseCls : 'xn-form-trigger ux_width17',
						filterParamName : 'sellerId',
						itemId : 'sellerCombo',
						valueField : 'CODE',
						name : 'sellerCombo',
						editable : false,
						value : strSellerId,
						store : sellerStore,
						listeners : {
							'select' : function(combo, strNewValue, strOldValue) {
								setAdminSeller(combo.getValue());
							}
						}
					});
				
				if (sellerStore.getCount() > 1){ 
			         sellerPanel.show();
				} 
				else
				{
				sellerPanel.hide();
				}
		
	},
	handleGridHeader : function() {
		var me = this;
		var gridHeaderPanel = me.getGridHeader();
		//var createNewPanel = me.getCreateNewToolBar();
		
	},

	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + me.getFilterUrl();
		grid.loadGridData(strUrl, null);
	},
	
	getFilterUrl : function() {
		var me = this;
		var strQuickFilterUrl = '';
		strQuickFilterUrl = me.generateUrlWithFilterParams(this);
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
		me.getSearchTextInput().setValue('');
		
		var corporationVal = null, statusVal = null, clientVal = null, jsonArray = [];
		var sellerVal = null;
		var approvalWorkflowFilterView = me.getSpecificFilterPanel();
		var moduleFltId = approvalWorkflowFilterView.down('combobox[itemId=profileStatusFltId]');
		if (!Ext.isEmpty(moduleFltId) && !Ext.isEmpty(moduleFltId.getValue())&& "ALL" != moduleFltId.getValue()) {
			sellerVal = moduleFltId.getValue();
		}
     
		if (!Ext.isEmpty(me.getClientFilter())
				&& !Ext.isEmpty(me.getClientFilter().getValue())) {
			corporationVal = me.getClientFilter().getValue();
		}

		if (!Ext.isEmpty(me.getStatusFilter())
				&& !Ext.isEmpty(me.getStatusFilter().getValue())
				&& "ALL" != me.getStatusFilter().getValue()) {
			statusVal = me.getStatusFilter().getValue();
			var isPending = true;
			  if(statusVal == 13)//Pending My Approval
					{
						statusVal  = new Array('5YN','4NN','0NY','1YY');
						isPending = false;
						jsonArray.push({
									paramName : 'statusFilter',
									paramValue1 : statusVal,
									operatorValue : 'in',
									dataType : 'S'
								} );
						jsonArray.push({
									paramName : 'user',
									paramValue1 :encodeURIComponent(USER.replace(new RegExp("'", 'g'), "\''")),
									operatorValue : 'ne',
									dataType : 'S'
								});
					}
		 if(isPending)
			{
			 if (statusVal == 12 || statusVal == 3 || statusVal == 14)
			 {
				if (statusVal == 12 || statusVal == 14) //12: New Submitted //14:Modified Submitted
				{
					statusVal = (statusVal == 12) ? 0:1;
					jsonArray.push({
								paramName : 'isSubmitted',
								paramValue1 : 'Y',
								operatorValue : 'eq',
								dataType : 'S'
							});
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
			}  
			else if (statusVal == 0 || statusVal == 1) // New and Modified
			{
				jsonArray.push({
							paramName : 'isSubmitted',
							paramValue1 : 'N',
							operatorValue : 'eq',
							dataType : 'S'
						});
			}
				jsonArray.push({
							paramName : me.getStatusFilter().filterParamName,
							paramValue1 : statusVal,
							operatorValue : 'eq',
							dataType : 'S'
						});
			}
		}

		if (!Ext.isEmpty(me.getClientFilter())
				&& !Ext.isEmpty(me.getClientFilter().getValue())) {
			clientVal = me.getClientFilter().getValue();
		}

		
		if (clientVal != null) {
			jsonArray.push({
						paramName : me.getClientFilter().name,
						paramValue1 : encodeURIComponent(clientVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'lk',
						dataType : 'S'
					});
		}
		if (!Ext.isEmpty(sellerVal)) {
			jsonArray.push({
						paramName : moduleFltId.filterParamName,
						paramValue1 : encodeURIComponent(sellerVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		var sellerComboValue = me.getSellerCombo().getValue();
		if(!Ext.isEmpty(sellerComboValue)) {
			jsonArray.push({
				paramName : me.getSellerCombo().filterParamName,
				paramValue1 : sellerComboValue,
				operatorValue : 'lk',
				dataType : 'S'
			});
		}
		me.filterData = jsonArray;
	},
	applyFilter : function() {
		var me = this;
		var grid = me.getGrid();
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
					store.sorters);
			strUrl = strUrl + me.getFilterUrl();
			me.getGrid().setLoading(true);
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
		}
	},
	handleSmartProductGridConfig : function() {
		var me = this;
		var prfMstGrid = me.getScmProductGrid();
		if (!Ext.isEmpty(prfMstGrid))
			prfMstGrid.destroy(true);
		var pgSize = 5;
		var arrColsPref = [{
					"colId" : "productDescription",
					"colDesc" : getLabel('collProducts','Products')
				}, {
					"colId" : "ccyCode",
					"colDesc" : getLabel('ccy_code','Currency')
				},{
					"colId" : "packageName",
					"colDesc" : getLabel('methodName','Receivable Method Name')
				}, {
					"colId" : "productCatType",
					"colDesc" : getLabel('collType','Product Category')
				}];

		var objWidthMap = {
			"productCode" : 115,
			"packageName" : 200,
			"productCatType" : 150
		};

		var arrCols = me.getColumns(arrColsPref, objWidthMap, false);

		prfMstGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
					id : 'gridViewMstId',
					itemId : 'gridViewMstId',
					pageSize : 10,
					autoDestroy : true,
					stateful : false,
					showEmptyRow : false,
					showCheckBoxColumn : false,
					padding : '0 10 10 10',
					rowList : [5, 10, 15, 20, 25, 30],
					minHeight : 140,
					columnModel : arrCols,
					storeModel : {
						fields : ['history', 'productDescription', 'packageName',
								'productCatType', 'useSingle','ccyCode',
								'requestStateDesc', 'identifier', '__metadata',
								'profileId'],
						proxyUrl : 'cpon/collectionProductList.json',
						rootNode : 'd.profileDetails',
						totalRowsNode : 'd.__count'
					},
					handleRowIconClick : function(tableView, rowIndex,
							columnIndex, btn, event, record) {
						me.handleRowIconClick(tableView, rowIndex, columnIndex,
								btn, event, record);
					}
				});

		var prfMstDtlView = me.getPrfMstDtlView();
		prfMstDtlView.add(prfMstGrid);
		prfMstDtlView.doLayout();
	},
	handleSmartGridConfig : function() {
		var me = this;
		var scmProductGrid = me.getScmProductGrid();
		var objConfigMap = me.getScmProductGridConfiguration();
		var arrCols = new Array();
		arrCols = me.getColumns(objConfigMap.arrColsPref,objConfigMap.objWidthMap, true);
		if (!Ext.isEmpty(scmProductGrid))
			scmProductGrid.destroy(true);

		//arrCols = me.getColumns(objConfigMap.arrColsPref,
			//	objConfigMap.objWidthMap);
		me.handleSmartGridLoading(arrCols, objConfigMap.storeModel);

	},
	handleSmartGridLoading : function(arrCols, storeModel) {
		var me = this;
		var pgSize = null;
		pgSize = 10;
		scmProductGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
					id : 'gridViewMstId',
					itemId : 'gridViewMstId',
					pageSize : pgSize,
					stateful : false,
					showEmptyRow : false,
					padding : '0 10 10 10',
					rowList : _AvailableGridSize,
					minHeight : 0,
					columnModel : arrCols,
					storeModel : storeModel,
					isRowIconVisible : me.isRowIconVisible,
//					isRowMoreMenuVisible : me.isRowMoreMenuVisible,
					handleRowMoreMenuClick : me.handleRowMoreMenuClick,

			handleRowIconClick : function(tableView, rowIndex, columnIndex,
					btn, event, record) {
				me.handleRowIconClick(tableView, rowIndex, columnIndex, btn,
						event, record);
			},

			handleMoreMenuItemClick : function(grid, rowIndex, cellIndex,
											menu, event, record) {
				var dataParams = menu.dataParams;
				me.handleRowIconClick(dataParams.view, dataParams.rowIndex,
						dataParams.columnIndex, menu, null, dataParams.record);
			}
	    });

		var clntSetupDtlView = me.getClientSetupDtlView();
		clntSetupDtlView.add(scmProductGrid);
		clntSetupDtlView.doLayout();
	},
	
	handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event,
			record) {
		var me = this;
		var actionName = btn.itemId;
		if (actionName === 'submit' || actionName === 'accept'
				|| actionName === 'enable' || actionName === 'disable'
				|| actionName === 'reject' || actionName === 'discard')
			me.handleGroupActions(btn, record);
		else if (actionName === 'btnHistory') {
			var recHistory = record.get('history');
			if (!Ext.isEmpty(recHistory)
					&& !Ext.isEmpty(recHistory.__deferred.uri)) {
				me.showHistory(record.get('history').__deferred.uri, record.get('identifier'), record.get('packageName') );
			}
		} else if (actionName === 'btnView') {
			me.submitExtForm('collectionMethodViewProfileMst.form', record, rowIndex);
		} else if (actionName === 'btnEdit') {
			me.submitExtForm('collectionMethodEditProfileMst.form', record, rowIndex);
		}else if (actionName === 'btnProductView') {
			var strUrl = Ext.String.format('viewCollectionMethodProduct.form',
					me.selectedPrfMst);
			me.submitExtForm(strUrl, record, rowIndex);
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
		document.body.appendChild(form);
		form.submit();
	},
			
	showHistory : function( url, id, packgName) {
		Ext.create('GCP.view.HistoryPopup', {
					historyUrl : url,
					packageName : packgName,
					identifier : id
				}).show();
	},

handleAddNewProfileMaster : function(btn) {
		var me = this;
		var strUrl = "";
		strUrl = "addCollectionMethodMst.form";
		if (!Ext.isEmpty(strUrl)) {
			form = document.createElement('FORM');
			form.name = 'frmMain';
			form.id = 'frmMain';
			form.method = 'POST';
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					csrfTokenName, tokenValue));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'profileMstName', btn.name));
			form.action = strUrl;
			document.body.appendChild(form);
			form.submit();
			document.body.removeChild(form);
		}

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
		}else if (maskPosition === 8 && retValue) {
			var validFlag = record.raw.validFlag;
			var reqState = record.raw.requestState;
			retValue = retValue && (reqState == 3 && validFlag == 'N');
		}
		else if (maskPosition === 9 && retValue) {
			var validFlag = record.raw.validFlag;
			var reqState = record.raw.requestState;
			retValue = retValue && (reqState == 3 && validFlag == 'Y');
		}
		return retValue;
	},

	getColumns : function(arrColsPref, objWidthMap, showGroupActionColumn) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		if (showGroupActionColumn) {
			arrCols.push(me.createGroupActionColumn());
			arrCols.push(me.createActionColumn())
		} else {
			arrCols.push(me.createProductActionColumn());

		}
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
				cfgCol.sortable=objCol.sort;
				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;

				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},
createProductActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'action',
			width : 40,
			locked : true,
			items : [{
						itemId : 'btnProductView',
						itemCls : 'grid-row-action-icon icon-view',
						toolTip : getLabel('viewToolTip', 'View Record')
					}]
		};
		return objActionCol;
	},
	createActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'action',
			width : 85,
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
						itemLabel : getLabel('historyToolTip',
								'View History'),
						toolTip : getLabel('historyToolTip',
								'View History'),		
						maskPosition : 4
					}]
		};
		return objActionCol;
		
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
			items: [{
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
						text : getLabel('prfMstActionDisable',	'Disable'),
						itemId : 'disable',
						actionName : 'disable',
						maskPosition : 9
					}]
		};
		return objActionCol;
	},
	
	enableValidActionsForGrid : function(grid, record, recordIndex,
			selectedRecords, jsonData) {
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
		me.enableDisableGroupActions(actionMask, isSameUser, isDisabled,isSubmit);
	},

	enableDisableGroupActions : function(actionMask, isSameUser, isDisabled, isSubmit) {
		var actionBar = this.getGroupActionBar();
		var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
		if (!Ext.isEmpty(actionBar) && !Ext.isEmpty(actionBar.items.items)) {
			arrItems = actionBar.items.items;
			Ext.each(arrItems, function(item) {
						strBitMapKey = parseInt(item.maskPosition,10) - 1;
						if (strBitMapKey) {
							blnEnabled = isActionEnabled(actionMask,
									strBitMapKey);
									
							if((item.maskPosition === 6 && blnEnabled)){
								blnEnabled = blnEnabled && isSameUser;
							} else  if(item.maskPosition === 7 && blnEnabled){
								blnEnabled = blnEnabled && isSameUser;
							}else if (item.maskPosition === 8 && blnEnabled) {
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
		var strUrl = Ext.String.format('cpon/collectionMethodProfileMst/{0}',
				strAction);
		strUrl = strUrl + '.srvc?';
		if (strAction === 'reject') {
			this.showRejectVerifyPopUp(strAction, strUrl,record);

		} else {
			this.preHandleGroupActions(strUrl, '',record);
		}

	},
	
	showRejectVerifyPopUp : function(strAction, strActionUrl,record) {
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
							me.preHandleGroupActions(strActionUrl, text, record);
						}
					}
				});
		msgbox.textArea.enforceMaxLength = true;
		msgbox.textArea.inputEl.set({
			maxLength : 255
		});
	},

	preHandleGroupActions : function(strUrl, remark, record) {

		var me = this;
		var grid = this.getGrid();
		if (!Ext.isEmpty(grid)) {
			var arrayJson = new Array();
			var records = grid.getSelectedRecords();
			records = (!Ext.isEmpty(records) && Ext.isEmpty(record))
					? records
					: [record];
			for (var index = 0; index < records.length; index++) {
				arrayJson.push({
							serialNo : grid.getStore().indexOf(records[index])
									+ 1,
							identifier : records[index].data.identifier,
							recordDesc : records[index].data.packageName,
							userMessage : remark
						});
			}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});

			Ext.Ajax.request({
						url : strUrl + csrfTokenName + "=" + csrfTokenValue,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							var errorMessage = '';
						    if(response.responseText != '[]')
						    {
						        var jsonData = Ext.decode(response.responseText);
						        /*Ext.each(jsonData[0].errors, function(error, index) {
						         errorMessage = errorMessage + error.errorMessage +"<br/>";
						        });
						        if('' != errorMessage && null != errorMessage)
						        {
						         Ext.Msg.alert("Error",errorMessage);
						        }*/
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
							me.enableDisableGroupActions('0000000000', true);
							grid.refreshData();
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

	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
			strRetValue = value;
		return strRetValue;
	},

	getScmProductGridConfiguration : function() {
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;
		objWidthMap = {
			"packageName" : 150,
			"productDescription" : 150,
			"dtlCount":80,
			"requestStateDesc":80
		};

		  arrColsPref = [{
							"colId" : "packageName",
							"colDesc" : getLabel('methodName','Method Name'),
							"sort":true
						},
							
						{
							"colId" : "productDescription",
							"colDesc" : getLabel('collType','Product Category'),
							"sort":true
						}, {
							"colId" : "dtlCount",
							"colDesc" : getLabel('collProducts','Products'),
							"colType" : "number",
							"sort":false
						}, {
							"colId" : "requestStateDesc",
							"colDesc" : getLabel('colStatus','Status'),
							"sort":false
						}];

				storeModel = {
					fields : ['history', 'packageName', 'dtlCount',
							'productCatType', 'requestStateDesc', 'identifier',
							'__metadata', 'profileId','ccyCode','productDescription'],
					proxyUrl : 'cpon/collectionMethodProfileMst.json',
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
	handleSCMProductEntryAction : function(entryType) {
		var me = this;
		var form;
		var strUrl = 'addSystemBeneficiarySetupMaster.form';
		var errorMsg = null;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));

		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	handlePackageProductList : function(btn, type) {
		var me = this;
		var gridViewPanel = me.getPrfMstDtlView();
		var actionToolBarContainer = gridViewPanel
				.down('panel[itemId=clientSetupDtlView]');
		var btnPkgList = gridViewPanel.down('button[itemId=btnPkgList]');
		var btnProductList = gridViewPanel
				.down('button[itemId=btnProductList]');
		if (type === 'showproduct') {
			actionToolBarContainer.hide();
			btnProductList.setText(getLabel('showAllProduct',
					'Show All Product'));
			btnProductList.addCls('font_bold');

			btnPkgList.setText('<span class="button_underline thePoniter ux_font-size14-normal">'
					+ getLabel('showAllMethodNames', 'Show All Receivable Method Names')
					+ '</span>');
			btnPkgList.removeCls('font_bold');
			me.handleSmartProductGridConfig();
		} else {
			actionToolBarContainer.show();
			btnPkgList
					.setText(getLabel('showAllMethodNames', 'Show All Receivable Method Names'));
			btnPkgList.addCls('font_bold');
			btnProductList.setText('<span class="button_underline thePoniter ux_font-size14-normal">'
					+ getLabel('showAllProduct', 'Show All Product')
					+ '</span>');
			btnProductList.removeCls('font_bold');
			me.handleSmartGridConfig();
		}
	},
	setInfoTooltip : function() {
		var me = this;
		var infotip = Ext.create('Ext.tip.ToolTip', {
					target : 'imgFilterInfo',
					listeners : {
						// Change content dynamically depending on which element
						// triggered the show.
						beforeshow : function(tip) {
							var seller = '';
							var client = '';
							
							var approvalWorkflowFilterView = me.getSpecificFilterPanel();
							var scmProductId = approvalWorkflowFilterView.down('textfield[itemId="profileNameFltId"]');
							
							if (!Ext.isEmpty(approvalWorkflowFilterView.down('combo[itemId="sellerCombo"]')) 
									&& approvalWorkflowFilterView.down('combo[itemId="sellerCombo"]') != null) {
								seller=approvalWorkflowFilterView.down('combo[itemId="sellerCombo"]').getRawValue();
							} else {
								seller = strSellerId;
							}
							
							if (!Ext.isEmpty(me.getStatusFilter()) && 
							!Ext.isEmpty(me.getStatusFilter().getValue())) {
								var combo = me.getStatusFilter();
								status = combo.getRawValue()
							} else {
								status = getLabel('all', 'ALL');
							}
							if (!Ext.isEmpty(me.getStatusFilter()) && 
							!Ext.isEmpty(me.getTypeFilter().getValue())) {
								var combo = me.getTypeFilter();
								type = combo.getRawValue()
							} else {
								type = getLabel('all', 'ALL');
							}
							
							if (!Ext.isEmpty(scmProductId)
									&& !Ext.isEmpty(scmProductId
											.getValue())) {
								client = scmProductId.getValue();
							} else {
								client = getLabel('none', 'None');
							}
							
							tip.update(
								getLabel('financialInstitution', 'Financial Institution') + ' : ' + seller+ '<br/>'
								    + getLabel("methodName","Method Name")
									+ ' : '
									+ client + '<br/>'
									+ getLabel('status', 'Status') + ' : '
									+ status +'<br/>'
									+ getLabel('type', 'Type') + ' : '
									+ type);
							
						}
					}
				});
	}

});