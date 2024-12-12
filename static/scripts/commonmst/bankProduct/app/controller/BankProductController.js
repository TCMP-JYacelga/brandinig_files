Ext.define('GCP.controller.BankProductController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.ux.gcp.SmartGrid'],
	views : ['GCP.view.BankProductView', 'GCP.view.BankProductGridView', 'GCP.view.BankProductFilterView', 'GCP.view.BankProductActionBarView', 'GCP.view.HistoryPopup','Ext.util.Point'],
	refs : [{
		ref : 'bankProductView',
		selector : 'bankProductView'
	}, {
		ref : 'bankProductGridView',
		selector : 'bankProductView bankProductGridView'
	}, {
		ref : 'bankProductDtlView',
		selector : 'bankProductView bankProductGridView panel[itemId="bankProductDtlView"]'
	}, {
		ref : 'bankProductGrid',
		selector : 'bankProductView bankProductGridView grid[itemId="gridViewMstId"]'
	},{
		ref : 'createNewToolBar',
		selector : 'bankProductView bankProductGridView toolbar[itemId="btnCreateNewToolBar"]'
	},{
		ref : 'gridHeader',
		selector : 'bankProductView bankProductGridView panel[itemId="bankProductDtlView"] container[itemId="gridHeader"]'
	},{
		ref : 'bankProductFilterView',
		selector : 'bankProductView bankProductFilterView'
	},{
		ref : 'statusFilterPanel',
		selector : 'bankProductView bankProductFilterView panel[itemId="statusFilterPanel"]'
	},{
		ref : 'productFilter',
		selector : 'bankProductView bankProductFilterView textfield[itemId="product"]'
	},{
		ref : 'actionBar',
		selector : 'bankProductView bankProductGridView bankProductBarView'
	},{
		ref : "corporationFilter",
		selector : 'bankProductView bankProductFilterView combobox[itemId="sellerFltId"]'
	}],
	
	config :{
		filterData : [],
		sellerOfSelectedClient : '',
		prodFilterDesc : '',
		statusFilter : ''
	},
	
	init : function() {
		var me = this;
		me.control({
			'bankProductGridView' : {
				render : function(panel) {
					me.handleSmartGridConfig();
				}
			},
			'bankProductGridView smartgrid' : {
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
			'bankProductView bankProductGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateClient"]' : {
				click : function() {
					me.handleClientEntryAction(true);
				}
			},
			'bankProductView bankProductGridView panel[itemId="bankProductDtlView"]' : {
				render : function() {
					me.handleGridHeader();
				}
			},
			
			'bankProductView bankProductFilterView' : {
				'handleChangeFilter': function(combo, strNewValue, strOldValue){
					me.applySeekFilter();
				},
				render : function(panel, opts) {
					me.setInfoTooltip();
				}
			},
			
			'bankProductView bankProductFilterView button[itemId="btnFilter"]' : {
				click : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
				}
			},
				
			'bankProductView bankProductGridView toolbar[itemId=clientGroupActionBarView_clientDtl]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			}
		});
	},
	applyFilter : function() {
		var me = this;
		var grid = me.getBankProductGrid();
		grid.refreshData();
	},
	applySeekFilter : function() {
		var me = this;
		me.setDataForFilter();
		//me.applyFilter();
	},
	setDataForFilter : function() {
		var me = this;
		this.filterData = this.getFilterQueryJson();
	},
	handleSmartGridConfig : function() {
		var me = this;
		var bankProductGrid = me.getBankProductGrid();
		var objConfigMap = me.getBankProductGridConfiguration();
		var arrCols = new Array();
		arrCols = me.getColumns(objConfigMap.arrColsPref,
				objConfigMap.objWidthMap, true);
		if (!Ext.isEmpty(bankProductGrid))
			bankProductGrid.destroy(true);

		 arrCols = me.getColumns(objConfigMap.arrColsPref,
		 objConfigMap.objWidthMap);
		me.handleSmartGridLoading(arrCols, objConfigMap.storeModel);

	},setInfoTooltip : function() {
		var me = this;
		var infotip = Ext.create('Ext.tip.ToolTip', {
					target : 'bankProductFilterView-1013_header_hd-textEl',
					listeners : {						
						beforeshow : function(tip) {						
							var seller='';
							var	status='';
							var bankPDesc='';
							var bankProductFilterView = me.getBankProductFilterView();
							var bankProductStatus =bankProductFilterView.down('combobox[itemId=statusFilter]');
							var bankProductDesc =bankProductFilterView.down('combobox[itemId=product]');
							    if (!Ext.isEmpty(bankProductFilterView.down('combobox[itemId=sellerFltId]')) && bankProductFilterView.down('combobox[itemId=sellerFltId]') != null) {
									seller=bankProductFilterView.down('combobox[itemId=sellerFltId]').getRawValue();
								} else {
									seller = strSellerId;
								}
								if(!Ext.isEmpty(bankProductStatus) && !Ext.isEmpty(bankProductStatus.getValue())) {
									status = bankProductStatus.getRawValue();
								} else {
									status = getLabel('all', 'All');								
								}
								if(!Ext.isEmpty(bankProductDesc) && !Ext.isEmpty(bankProductDesc.getValue())) {
									bankPDesc = bankProductDesc.getRawValue();
								} else {
									bankPDesc = getLabel('none', 'None');								
								}								
								tip.update(getLabel('fi', 'Financial Institution')
										+ ' : '
										+ seller
										+ '<br/>'
										+ getLabel('product','Product')
										+ ' : '
										+ bankPDesc										
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
	getBankProductGridConfiguration : function() {
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;
		objWidthMap = {
			"productCode":100,	
			"productDesc" : 350,
			"currencies" : 100,
			"cutOffTime" : 100,
			"status" : 100
		};

		arrColsPref = 
				[{
					"colId" : "productCode",
					"colDesc" : getLabel('productCode','Product Code'),
					"sort":true
				},{
					"colId" : "productDesc",
					"colDesc" : getLabel('productName','Product Name'),
					"sort":true
				}, {
					"colId" : "currencies",
					"colDesc" :  getLabel('currencies','Currencies'),
					"sort":true
				}, {
					"colId" : "cutOffTime",
					"colDesc" : getLabel('cutOffTime','Cut Off Time'),
					"sort":true
				}, {
					"colId" : "requestStateDesc",
					"colDesc" : getLabel('status','Status'),
					"sort":false
				}];

		storeModel = {
			fields : ['productCode','productDesc', 'currencies', 'cutOffTime', 'requestStateDesc',
					'__metadata', 'profileId','identifier','history', 'maker_id', 'checker_id', 'reject_remarks'],
			proxyUrl : 'services/bankProductMaster.json',
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
	handleSmartGridLoading : function(arrCols, storeModel) {
		var me = this;
		var pgSize = null;
		pgSize = 10;
		bankProductGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
			id : 'gridViewMstId',
			itemId : 'gridViewMstId',
			pageSize : pgSize,
			stateful : false,
			showEmptyRow : false,
			padding : '5 10 10 10',
			rowList : _AvailableGridSize,
			minHeight : 0,
			columnModel : arrCols,
			storeModel : storeModel,
			isRowIconVisible : me.isRowIconVisible,
			//isRowMoreMenuVisible : me.isRowMoreMenuVisible,
			handleRowMoreMenuClick : me.handleRowMoreMenuClick,

			handleRowIconClick : function(tableView, rowIndex,
					columnIndex, btn, event, record) {
				me.handleRowIconClick(tableView, rowIndex, columnIndex,
					btn, event, record);
			},

			 handleMoreMenuItemClick : function(grid, rowIndex,
					 cellIndex, menu, event, record) {
				 var dataParams = menu.dataParams;
					 me.handleRowIconClick(dataParams.view,
						 dataParams.rowIndex, dataParams.columnIndex,
						 menu, null, dataParams.record);
			 }
		});
		var bankProductDtlView = me.getBankProductDtlView();
		bankProductDtlView.add(bankProductGrid);
		bankProductDtlView.doLayout();
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		me.setDataForFilter();
		
		var buttonMask = '00000000000';
		me.enableDisableGroupActions(buttonMask,'N','N','N');
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + me.getFilterUrl();
		grid.loadGridData(strUrl, null);
	},
	getColumns : function(arrColsPref, objWidthMap, showGroupActionColumn) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		arrCols.push(me.createGroupActionColumn());
		arrCols.push(me.createActionColumn());
		
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.draggable = true;
				cfgCol.colId = objCol.colId;
				
				if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}
				cfgCol.sortable = objCol.sort;
				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;

				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},
	getFilterUrl : function() {
		var me = this;
		var strQuickFilterUrl = '';
		strQuickFilterUrl = me.generateUrlWithFilterParams(this);
		return strQuickFilterUrl;
	},
	handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event,
			record) {
		var me = this;
		var actionName = btn.itemId;
		if (actionName === 'submit' || actionName === 'accept' || actionName === 'enable' || actionName === 'disable'
				|| actionName === 'reject' || actionName === 'discard')
			me.handleGroupActions(btn, record);
		else if (actionName === 'btnHistory') {
			var recHistory = record.get('history');
			if (!Ext.isEmpty(recHistory)
					&& !Ext.isEmpty(recHistory.__deferred.uri)) {
				me.showHistory(record.get('productDesc'),
						record.get('history').__deferred.uri, record
								.get('identifier'));
			}
		}
		else if (actionName === 'btnView') {
			me.submitForm('viewBankProductMaster.form', record, rowIndex);
		} else if (actionName === 'btnEdit'){
			me.submitForm('editBankProductMaster.form', record, rowIndex);
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
	createActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'action',
			width : 85,
			locked : true,
			sortable: false,
			lockable: false,
			draggable : true,
			items : [{
						itemId : 'btnEdit',
						itemCls : 'grid-row-action-icon icon-edit',
						toolTip : getLabel('editToolTip','Edit'),
						maskPosition : 2
					}, {
						itemId : 'btnView',
						itemCls : 'grid-row-action-icon icon-view',
						toolTip :  getLabel('viewToolTip','View Record'),
						maskPosition : 3
					},{
						itemId : 'btnHistory',
						itemCls : 'grid-row-action-icon icon-history',
						itemLabel : getLabel('historyToolTip','View History'),
						toolTip : getLabel('historyToolTip','View History'),
						maskPosition : 4
					}]
		};
		return objActionCol;

	},
	enableValidActionsForGrid : function(grid, record, recordIndex,
			selectedRecords, jsonData) {
		var me = this;
		var buttonMask = '0000000000';
		var maskArray = new Array(), actionMask = '', objData = null;

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
	createGroupActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'groupaction',
			width : 150,
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			resizable : false,
			draggable : false,
			items: [{
						text : getLabel('submit', 'Submit'),
						itemId : 'submit',
						actionName : 'submit',
						maskPosition : 5
					},{
						text : getLabel('approve', 'Approve'),
						itemId : 'accept',
						actionName : 'accept',
						maskPosition : 6
					},{
						text : getLabel('reject', 'Reject'),
						itemId : 'reject',
						actionName : 'reject',
						maskPosition : 7
					},{
						text : getLabel('discard', 'Discard'),
						itemId : 'discard',
						actionName : 'discard',
						maskPosition : 10
					},{
						text : getLabel('enable', 'Enable'),
						itemId : 'enable',
						actionName : 'enable',
						maskPosition : 8
					}, {
						text : getLabel('disable', 'Disable'),
						itemId : 'disable',
						actionName : 'disable',
						maskPosition : 9
					}]
		};
		return objActionCol;
	},
	enableDisableGroupActions : function(actionMask, isSameUser, isDisabled, isSubmit) {
		var actionBar = this.getActionBar();
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
		me.setFilterParameters(form, record);
		document.body.appendChild(form);
		form.submit();
	},
	handleClientEntryAction : function(entryType) {
		var me = this;
		var form;
		var sellerCombo = me.getCorporationFilter();
		if(sellerCombo){
			var selectedSeller = sellerCombo.getValue();
		}
		var strUrl = 'addBankProductMaster.form';
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
	handleGridHeader : function() {
		var me = this;
		var gridHeaderPanel = me.getGridHeader();
		var createNewPanel;
		if(ACCESSNEW){
			createNewPanel = me.getCreateNewToolBar();
			if (!Ext.isEmpty(gridHeaderPanel))
			{
				gridHeaderPanel.removeAll();
			}
			if (!Ext.isEmpty(createNewPanel))
			{
				createNewPanel.removeAll();
			}		
			createNewPanel.add({
				xtype : 'button',
				border : 0,
				text : getLabel('createNewProduct', 'Payment Product'),
				cls : 'cursor_pointer ux_button-background ux_button-padding ux_button-background-color ux_button-s',
				glyph:'xf055@fontawesome',
				parent : this,
				itemId : 'btnCreateClient'
			});
		}
	},
	getFilterQueryJson : function() {
		var me = this;
		var productVal = null, statusVal = null, moduleVal = null, categoryVal = null, subCategoryVal = null, jsonArray = [], clientCodeVal = null, sellerCodeVal = null;

		var bankProductFilterView = me.getBankProductFilterView();
		var productFltId = bankProductFilterView
				.down('combobox[itemId=product]');
		var seller = bankProductFilterView.down('combobox[itemId=sellerFltId]');
		var productDesc = me.prodFilterDesc;

		var statusFltId = bankProductFilterView
				.down('combobox[itemId=statusFilter]');
        var isPending = true;
		if (!Ext.isEmpty(productFltId)
				&& !Ext.isEmpty(productFltId.getValue())) {
			productVal = productFltId.getValue().toUpperCase();
		}
		
		if (!Ext.isEmpty(seller)
				&& !Ext.isEmpty(seller.getValue())) {
			sellerCodeVal = seller.getValue().toUpperCase();
		}
		jsonArray.push({
			paramName : 'sellerCode',
			operatorValue : 'eq',
			paramValue1 : encodeURIComponent(sellerCodeVal.replace(new RegExp("'", 'g'), "\''")),
			dataType : 'S'
		});
		
		if (!Ext.isEmpty(statusFltId)
				&& !Ext.isEmpty(statusFltId.getValue())
				&& "ALL" != statusFltId.getValue().toUpperCase()&& getLabel('all','ALL').toUpperCase()!= statusFltId.getValue().toUpperCase()) {
			statusVal = statusFltId.getValue();
		}

		if (!Ext.isEmpty(statusVal)) {
			
			if (statusVal == 13)//Pending My Approval
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
			if (statusVal == 12 || statusVal == 3 || statusVal == 14) {
				if (statusVal == 12 || statusVal == 14) // 12: New Submitted , 14: Modified Submitted
				{
					statusVal = (statusVal == 12)?0:1;
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
					jsonArray.push({
								paramName : statusFltId.name,
								paramValue1 : statusVal,
								operatorValue : 'eq',
								dataType : 'S'
							});
				
			}	
		}
		if (!Ext.isEmpty(productVal) && productVal != null) {
			productVal = productVal.toUpperCase();
			jsonArray.push({
						paramName : 'product_description',
						operatorValue : 'lk',
						paramValue1 : encodeURIComponent(productVal.replace(new RegExp("'", 'g'), "\''")),
						dataType : 'S'
					});
		}

		return jsonArray;
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
	handleGroupActions : function(btn, record) {
		var me = this;
		var strAction = !Ext.isEmpty(btn.actionName)
		? btn.actionName
		: btn.itemId;
		var strUrl = Ext.String.format('services/bankProductMaster/{0}', strAction);
		strUrl = strUrl + ".srvc?";
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
			fieldLbl = getLabel('bankRejectRemarkPopUpTitle', 'Please Enter Reject Remark');
			titleMsg = getLabel('bankRejectRemarkPopUpFldLbl', 'Reject Remark');
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
					if(Ext.isEmpty(text))
					{
						Ext.Msg.alert(getLabel( 'errorTitle', 'Error' ), getLabel( 'rejectEmptyErrorMsg', 'Reject Remarks cannot be blank' ));
					}
					else
					{
						me.preHandleGroupActions(strActionUrl, text, record);
					}
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
		var gridView = me.getBankProductGrid();
		if (!Ext.isEmpty(gridView)) {
			var arrayJson = new Array();
			var records = gridView.getSelectedRecords();
			records = (!Ext.isEmpty(records) && Ext.isEmpty(record))
			? records
			: [record];
				for (var index = 0; index < records.length; index++) {
					arrayJson.push({
								serialNo : gridView.getStore()
										.indexOf(records[index])
										+ 1,
								identifier : records[index].data.identifier,
								userMessage : remark,
								recordDesc : records[index].data.productDesc
							});
				}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});
			gridView.setLoading(true);
			strUrl = strUrl + csrfTokenName + "=" + csrfTokenValue;
			Ext.Ajax.request({
				url : strUrl,
				method : 'POST',
				timeout : 60000,
				jsonData : Ext.encode(arrayJson),
				success : function(response) {
					// TODO : Action Result handling to be done here
					gridView.setLoading(false);
					gridView.refreshData();
//							me.applyFilter();
					var errorMessage = '';
					if(!Ext.isEmpty(response.responseText))
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
				gridView.setLoading(false);
					var errMsg = "";
					Ext.MessageBox.show({
								title : getLabel('errorTitle', 'Error'),
								msg : getLabel('errorPopUpMsg', 'Error while fetching data..!'),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							});
				}
			});
		}
	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	showHistory : function(productDesc, url, id) {
		Ext.create('GCP.view.HistoryPopup', {
					historyUrl : url +"?"+ csrfTokenName + "=" + csrfTokenValue,
					productDesc : productDesc,
					identifier : id
				}).show();
	},
	setFilterParameters : function(form, record){
		var me = this;
		var selectedSeller = null, productName = null, statusVal = null;
		var arrJsn = {};
		var specificFilterView = me.getBankProductFilterView();
		var sellerCombo = specificFilterView.down('combobox[itemId=sellerFltId]');
		var product = record.data["identifier"];
		var status = specificFilterView.down('combobox[itemId=statusFilter]');
		if (!Ext.isEmpty(product)) {
			productName = product;
		}
		if(sellerCombo){
			selectedSeller = sellerCombo.getValue();
		}
		if (!Ext.isEmpty(status)
				&& !Ext.isEmpty(status.getValue())
				&& "ALL" != status.getValue()) {
			statusVal = status.getValue();
		}
		arrJsn['sellerId'] = selectedSeller;
		arrJsn['productDesc'] = productName;
		arrJsn['status']= statusVal;
		arrJsn['statusDesc']= status.getRawValue();
		
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'filterData', Ext.encode(arrJsn)));
	}
});