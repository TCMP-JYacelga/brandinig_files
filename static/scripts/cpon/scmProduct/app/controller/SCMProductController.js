Ext.define('GCP.controller.SCMProductController', {
	extend : 'Ext.app.Controller',
	requires : [],
	views : ['GCP.view.SCMProductView', 'GCP.view.SCMProductGridView','GCP.view.HistoryPopup'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'scmProductView',
				selector : 'scmProductView'
			}, {
				ref : 'createNewToolBar',
				selector : 'scmProductView scmProductGridView toolbar[itemId="btnCreateNewToolBar"]'
			},{
				ref : 'specificFilterPanel',
				selector : 'scmProductView scmProductFilterView panel[itemId="specificFilter"]'
			},{
				ref : 'scmProductGridView',
				selector : 'scmProductView scmProductGridView'
			}, {
				ref : 'clientSetupDtlView',
				selector : 'scmProductView scmProductGridView panel[itemId="clientSetupDtlView"]'
			}, {
				ref : 'gridHeader',
				selector : 'scmProductView scmProductGridView panel[itemId="clientSetupDtlView"] container[itemId="gridHeader"]'
			}, {
				ref : 'scmProductGrid',
				selector : 'scmProductView scmProductGridView grid[itemId="gridViewMstId"]'
			},{
				ref : 'searchTextInput',
				selector : 'scmProductGridView textfield[itemId="searchTextField"]'
			}, {
				ref : 'matchCriteria',
				selector : 'scmProductGridView radiogroup[itemId="matchCriteria"]'
			},{
				ref : 'grid',
				selector : 'scmProductGridView smartgrid'
			},{
				ref : "corporationFilter",
				selector : 'scmProductView scmProductFilterView combobox[itemId="sellerFltId"]'
			},{
				ref : "clientFilter",
				selector : 'scmProductView scmProductFilterView textfield[itemId="clientFilter"]'
			},{
				ref : "statusFilter",
				selector : 'scmProductView scmProductFilterView combobox[itemId="statusFilter"]'
			}, {
				ref : 'groupActionBar',
				selector : 'scmProductView scmProductGridView scmProductActionBarView'
			},{
				ref : 'clientListLink',
				selector : 'scmProductView toolbar[itemId="btnActionToolBar"] button[itemId="btnClientList"]'
			}  ],
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
			'scmProductView scmProductGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateSCMProduct"]' : {
				click : function() {
					me.handleSCMProductEntryAction(true);
				}
			},
			'scmProductView scmProductFilterView' : {
				render : function() {
					me.setInfoTooltip();
					me.handleSpecificFilter();
				}
			},
			'scmProductView scmProductFilterView button[itemId="btnFilter"]' : {
				click : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
				}
			},
			'scmProductView scmProductGridView panel[itemId="clientSetupDtlView"]' : {
				render : function() {
					me.handleGridHeader();
					
				}
			},
			'scmProductView toolbar[itemId="btnActionToolBar"] button[itemId="btnClientList"]' : {
				click : function() {
					me.filterData = [];
					me.handleSpecificFilter();
					me.handleGridHeader();
				}
			},

			'scmProductGridView' : {
				render : function(panel) {
					me.handleSmartGridConfig();
				}
			},
			'scmProductGridView textfield[itemId="searchTextField"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'scmProductGridView radiogroup[itemId="matchCriteria"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'scmProductGridView smartgrid' : {
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
			'scmProductGridView toolbar[itemId=clientGroupActionBarView_clientDtl]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			}

		});
	},
	
	handleSpecificFilter : function() {
		var me = this;
		me.getSearchTextInput().setValue('');
		me.getStatusFilter().setValue('');
		var storeData = null;
		
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
			
		var objStore = Ext.create('Ext.data.Store', {
					fields : ['CODE', 'DESCR'],
					data : storeData,
					reader : {
						type : 'json',
						root : 'preferences'
					}					
				});
		
		var clientTextfield = Ext.create('Ext.ux.gcp.AutoCompleter', {
					padding : '1 0 0 5',
					fieldCls : 'xn-form-text  xn-suggestion-box',
					name : 'productDescription',
					width : 165,
					itemId : 'clientFilter',
					cfgUrl : 'cpon/cponseek/{0}.json',
					cfgProxyMethodType : 'POST',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgSeekId : 'scmproductseek',
					cfgRootNode : 'd.filter',
					cfgDataNode1 : 'name'
				});
		
		var filterPanel = me.getSpecificFilterPanel();
		if (!Ext.isEmpty(filterPanel))
		{
			filterPanel.removeAll();
		}
		
			filterPanel.add({
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						columnWidth : 0.5,
						layout : 'vbox',
						items : [{
									xtype : 'label',
									text : getLabel('seller',
											'Seller'),
									cls : 'f13 ux_font-size14',
									hidden:(objStore.getCount()>1)?false:true,
									padding : '4 0 0 6'
								},{
									xtype : 'combo',
									padding : '1 5 1 5',
									width : 165,
									displayField : 'DESCR',
									fieldCls : 'xn-form-field inline_block',
									triggerBaseCls : 'xn-form-trigger',
									filterParamName : 'sellerId',
									itemId : 'sellerFltId',
									valueField : 'CODE',
									name : 'sellerCombo',
									editable : false,
									value : strSellerId,
									store : objStore,
									hidden:(objStore.getCount()>1)?false:true,
									listeners : {
										'select' : function(combo, strNewValue, strOldValue) {
												setAdminSeller(combo.getValue());
										}
									}
								}]
					}, {
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						layout : 'vbox',
						columnWidth : 0.5,
						items : [{
									xtype : 'label',
									text : getLabel('scmProduct', 'SCF Package'),
									cls : 'f13 ux_font-size14',
									padding : '4 0 0 6'
								}, clientTextfield]
						});
						filterPanel.columnWidth = 0.45;
		
		
	},
	handleGridHeader : function() {
		var me = this;
		var gridHeaderPanel = me.getGridHeader();
		if(ACCESSNEW){
		var createNewPanel = me.getCreateNewToolBar();
		if (!Ext.isEmpty(createNewPanel))
		{
			createNewPanel.removeAll();
		}
		createNewPanel.add(
			{
							xtype : 'button',
							border : 0,
							glyph : 'xf055@fontawesome',
							text : getLabel('createSCMProduct', 'Create New SCF Package'),
							cls : 'cursor_pointer  xn-btn ux-button-s ux_button-padding',
							parent : this,
							padding : '4 0 2 0',
							itemId : 'btnCreateSCMProduct'
						}
		);
		}
	},

	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
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
		var sellerFltId = approvalWorkflowFilterView.down('combobox[itemId=sellerFltId]');
		if (!Ext.isEmpty(sellerFltId) && !Ext.isEmpty(sellerFltId.getValue())
				&& "ALL" != sellerFltId.getValue()) {
			sellerVal = sellerFltId.getValue();
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
			 if(statusVal  == 13)//13:Pending My Approval
			 {
				 statusVal  = new Array('5YN','4NN','0NY','1YY');
				 isPending = false;
		         jsonArray.push({
		             paramName : 'statusFilter',
				     paramValue1 : statusVal,
				     operatorValue : 'in',
					  dataType : 'S'
					});
				jsonArray.push({
				     paramName : 'user',
					 paramValue1 :encodeURIComponent(USER.replace(new RegExp("'", 'g'), "\''")),
					 operatorValue : 'ne',
					 dataType : 'S'
					});
			}
			if(isPending)
			{
			if (statusVal == 12 || statusVal == 3 || statusVal == 14) {
				if (statusVal == 12 || statusVal == 14) //12:New Submitted 14:Modified Submitted
				{
					statusVal = (statusVal == 12 )? 0 : 1;
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

		if (!Ext.isEmpty(corporationVal)) {
			jsonArray.push({
						paramName : 'productDescription',
						paramValue1 : encodeURIComponent(corporationVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'lk',
						dataType : 'S'
					});
		}
		
		if (clientVal != null) {
			jsonArray.push({
						paramName : me.getClientFilter().name,
						paramValue1 : encodeURIComponent(clientVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'lk',
						dataType : 'S'
					});
		}
		if (!Ext.isEmpty(sellerVal)) {
			jsonArray.push({
						paramName : sellerFltId.filterParamName,
						paramValue1 : encodeURIComponent(sellerVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
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
	handleSmartGridConfig : function() {
		var me = this;
		var scmProductGrid = me.getScmProductGrid();
		var objConfigMap = me.getScmProductGridConfiguration();
		var arrCols = new Array();
		if (!Ext.isEmpty(scmProductGrid))
			scmProductGrid.destroy(true);

		arrCols = me.getColumns(objConfigMap.arrColsPref,
				objConfigMap.objWidthMap);
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
			if (!Ext.isEmpty(recHistory)&& !Ext.isEmpty(recHistory.__deferred.uri)) {
				me.showHistory(record.get('productDescription'),record.get('history').__deferred.uri, record.get('identifier'));
			}
		} else if (actionName === 'btnView') {
			me.submitExtForm('viewScmProductMaster.form', record, rowIndex);
		} else if (actionName === 'btnEdit') {
			me.submitExtForm('editScmProductMaster.form', record, rowIndex);
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
			
	showHistory : function(product ,url, id) {
		Ext.create('GCP.view.HistoryPopup', {
					productName : product,
					historyUrl : url,
					identifier : id
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

				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;

				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
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
			width : 135,
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			resizable : false,
			draggable : false,
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
		var strUrl = Ext.String.format('cpon/scmProductMaster/{0}.srvc?',
				strAction);
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
							userMessage : remark,
							recordDesc : records[index].data.productDescription
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
							// TODO : Action Result handling to be done here
							me.enableDisableGroupActions('0000000000', true);
							grid.refreshData();
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
			"productDescription" : 300,
			"requestStateDesc" : 230
		};

		arrColsPref = [{
					"colId" : "productDescription",
					"colDesc" : getLabel('scmProduct', 'SCF Package')
				}, {
					"colId" : "requestStateDesc",
					"colDesc" : getLabel('status', 'Status')
				}];

		storeModel = {
			fields : ['productDescription',	'requestStateDesc', 
					'identifier','history','__metadata'],
			proxyUrl : 'cpon/scmProductMaster.json',
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
		var strUrl = 'addScmProductMaster.form';
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
							var sellerFltId = approvalWorkflowFilterView.down('combobox[itemId=sellerFltId]');
							var scmProductId = approvalWorkflowFilterView.down('textfield[itemId="clientFilter"]');

							if (!Ext.isEmpty(sellerFltId)
									&& !Ext.isEmpty(sellerFltId
											.getValue())) {
								seller = sellerFltId.getValue();
							} else {
								seller = getLabel('all', 'ALL');
							}
							if (!Ext.isEmpty(me.getStatusFilter()) && 
							!Ext.isEmpty(me.getStatusFilter().getValue())) {
								var combo = me.getStatusFilter();
								status = combo.getRawValue()
							} else {
								status = getLabel('all', 'ALL');
							}
							
							if (!Ext.isEmpty(scmProductId)
									&& !Ext.isEmpty(scmProductId
											.getValue())) {
								client = scmProductId.getValue();
							} else {
								client = getLabel('none', 'None');
							}
							
							tip.update(getLabel("seller","Seller")
									+ ' : '
									+ seller
									+ '<br/>'
									+ getLabel("scmProduct","Scm Product")
									+ ' : '
									+ client + '<br/>'
									+ getLabel('status', 'Status') + ' : '
									+ status);
							
						}
					}
				});
	}

});