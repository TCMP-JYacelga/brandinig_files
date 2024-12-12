Ext.define('GCP.controller.SystemAccountController', {
	extend : 'Ext.app.Controller',
	requires : [],
	views : ['GCP.view.SystemAccountView','GCP.view.SystemAccountGridView','GCP.view.SystemAccountFilterView','GCP.view.SystemAccountTitleView','Ext.util.Point'],
	refs: [{
		ref : 'systemAccountView',
		selector : 'systemAccountView'
	},{
		ref : 'systemAccountFilterView',
		selector : 'systemAccountFilterView'
	},{
		ref : 'systemAccountGridView',
		selector : 'systemAccountGridView'
	},{
		ref : 'systemAccountDetailView',
		selector : 'systemAccountGridView panel[itemId="systemAccountDetailView"]'
	},{
		ref : 'grid',
		selector : 'systemAccountGridView smartgrid'
	},{
		ref : 'scmProductGrid',
		selector : 'systemAccountGridView grid[itemId="gridViewMstId"]'
	},
	{
		ref : 'groupActionBar',
		selector : 'systemAccountGridView systemAccountGroupActionView'
	}],
	firstLoad: true,
	
	init : function() {
			var me = this;
			var strEntityType=null;
			me.control({
				'systemAccountFilterView' : {
					render : function() {
						me.setInfoTooltip();
						me.handleSpecificFilter();
						me.populateEntityCode();
						me.populateProductList();
					},
					beforeexpand:function(view){
						//var comboEntityCode = view.down('combobox[itemId=entityCodeCombo]');
					//	comboEntityCode.setValue(comboEntityCode.getValue());
					}
				},
				'systemAccountFilterView button[itemId="btnFilter"]' : {
					click : function(btn, opts) {
						me.setDataForFilter();
						me.applyFilter();
					}
				},
				'systemAccountGridView' : {
					render : function(panel) {
						firstTime = true;
						filterData = [];
						me.handleSmartGridConfig();
						//me.setFilterRetainedValues();
					}
				},
				'systemAccountGridView smartgrid' : {
				render : function(grid) {
					me.handleLoadGridData(grid, grid.store.dataUrl,
							grid.pageSize, 1, 1, null);
					firstTime = false;
				},
				gridPageChange : me.handleLoadGridData,
				gridSortChange : me.handleLoadGridData,
				gridRowSelectionChange : function(grid, record, recordIndex,
						records, jsonData) {
					me.enableValidActionsForGrid(grid, record, recordIndex,
							records, jsonData);
				}
			},
			'systemAccountGridView toolbar[itemId=groupActionBarItemId]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			},
			'systemAccountView button[itemId=createNewItemId]' : {
				click : function(btn, opts) {
					me.onRefreshClick();
				}
			},
			'systemAccountFilterView combobox[itemId="entityCombo"]' : {
				select : function(combo, record) {
					var objFilterPanel = me.getSystemAccountFilterView();
			        var fiCombo = objFilterPanel.down('combobox[itemId=sellerFltId]').getValue();
					strEntityType = combo.value;
			    	if(Ext.isEmpty( strEntityType )){
			    		strEntityType = 'SYSTEM';
			    	}		

					var entityCodeCombo = systemAccountFiltetrView.down('combobox[itemId=entityName]');
						entityCodeCombo.value = '';
						entityCodeCombo.setRawValue("");
						
					var accNameCombo = systemAccountFiltetrView.down('combobox[itemId=AccountName]');
						accNameCombo.value = '';
						accNameCombo.setRawValue("");						

					var objAutocompleterEntityName = objFilterPanel.down('AutoCompleter[itemId="entityName"]');
					objAutocompleterEntityName.cfgUrl = 'services/userseek/entityNameSeek.json';
					objAutocompleterEntityName.cfgSeekId = 'entityNameSeek';
					objAutocompleterEntityName.cfgRecordCount = -1;
					
						objAutocompleterEntityName.cfgExtraParams =
						[
							{
								key : '$filtercode1',
								value : fiCombo
							},
							{
								key : '$filtercode2',
								value : strEntityType
							}
						];

				//	me.populateEntityCode(combo.value);
				}
			},
			'systemAccountFilterView AutoCompleter[itemId="entityName"]' :
			{
				render : function(me1) {
						//alert(me1);
					},
				select : function( combo, record, index )
				{
					var objFilterPanel = me.getSystemAccountFilterView();
					entityTypeValue = objFilterPanel.down('combobox[itemId=entityCombo]').getValue();
			        var fiCombo = objFilterPanel.down('combobox[itemId=sellerFltId]').getValue();
					var accNameCombo = systemAccountFiltetrView.down('combobox[itemId=AccountName]');
						accNameCombo.value = '';
						accNameCombo.setRawValue("");						
					var objAutocompleterEntityName = objFilterPanel.down('AutoCompleter[itemId="entityName"]');
					objAutocompleterEntityName.cfgUrl = 'services/userseek/entityNameSeek.json';
					objAutocompleterEntityName.cfgSeekId = 'entityNameSeek';
					objAutocompleterEntityName.cfgRecordCount = -1;

					
						objAutocompleterEntityName.cfgExtraParams =
						[
							{
								key : '$filtercode1',
								value : strSellerId
							},
							{
								key : '$filtercode2',
								value : entityTypeValue
							}
						];
					var entityCodeValue = objFilterPanel.down('combobox[itemId=entityName]').getValue();
					var productCodeValue = objFilterPanel.down('combobox[itemId=productCombo]').getValue();
					var objAutocompleterAccountName = objFilterPanel.down('AutoCompleter[itemId="AccountName"]');
					objAutocompleterAccountName.cfgUrl = 'services/userseek/accountNameSeek.json';
					objAutocompleterAccountName.cfgSeekId = 'accountNameSeek';
					objAutocompleterAccountName.cfgRecordCount = -1;
					//objAutocompleterAccountName.setValue( '' );
					
					if(productCodeValue == 'Select'){
						objAutocompleterAccountName.cfgExtraParams =
						[
							{
								key : '$filtercode1',
								value : entityTypeValue
							},
							{
								key : '$filtercode2',
								value : entityCodeValue
							}
						];
					} else{					
					
						objAutocompleterAccountName.cfgExtraParams =
						[
							{
								key : '$filtercode1',
								value : entityTypeValue
							},
							{
								key : '$filtercode2',
								value : entityCodeValue
							},
							{
								key : '$filtercode3',
								value : productCodeValue
							}
						];
					}						
						
				}
				
			},	
			'systemAccountFilterView combobox[itemId="productCombo"]' : {
				select : function( combo, record, index )
				{
					var objFilterPanel = me.getSystemAccountFilterView();
					entityTypeValue = objFilterPanel.down('combobox[itemId=entityCombo]').getValue(),
					entityCodeValue = objFilterPanel.down('combobox[itemId=entityName]').getValue();
					var productCodeValue = objFilterPanel.down('combobox[itemId=productCombo]').getValue();	
					
					var objAutocompleterAccountName = objFilterPanel.down('AutoCompleter[itemId="AccountName"]');
					objAutocompleterAccountName.cfgUrl = 'services/userseek/accountNameSeek.json';
					objAutocompleterAccountName.cfgSeekId = 'accountNameSeek';
					objAutocompleterAccountName.cfgRecordCount = -1;
					//objAutocompleterAccountName.setValue( '' );
					
					if(productCodeValue == 'Select'){
						objAutocompleterAccountName.cfgExtraParams =
						[
							{
								key : '$filtercode1',
								value : entityTypeValue
							},
							{
								key : '$filtercode2',
								value : entityCodeValue
							}
						];
					} else{					
					
						objAutocompleterAccountName.cfgExtraParams =
						[
							{
								key : '$filtercode1',
								value : entityTypeValue
							},
							{
								key : '$filtercode2',
								value : entityCodeValue
							},
							{
								key : '$filtercode3',
								value : productCodeValue
							}
						];
					}					
				}					
			},				
			'systemAccountFilterView AutoCompleter[itemId="AccountName"]' :
			{
				render : function(me1) {
						//alert(me1);
					},
				select : function( combo, record, index )
				{
					var objFilterPanel = me.getSystemAccountFilterView();
					entityTypeValue = objFilterPanel.down('combobox[itemId=entityCombo]').getValue();
					entityCodeValue = objFilterPanel.down('combobox[itemId=entityName]').getValue();
					var productCodeValue = objFilterPanel.down('combobox[itemId=productCombo]').getValue();
					
			
					var objAutocompleterAccountName = objFilterPanel.down('AutoCompleter[itemId="AccountName"]');
					objAutocompleterAccountName.cfgUrl = 'services/userseek/accountNameSeek.json';
					objAutocompleterAccountName.cfgSeekId = 'accountNameSeek';
					objAutocompleterAccountName.cfgRecordCount = -1;
					//objAutocompleterAccountName.setValue( '' );
					
					if(productCodeValue == 'Select'){
						objAutocompleterAccountName.cfgExtraParams =
						[
							{
								key : '$filtercode1',
								value : entityTypeValue
							},
							{
								key : '$filtercode2',
								value : entityCodeValue
							}
						];
					} else{					
					
						objAutocompleterAccountName.cfgExtraParams =
						[
							{
								key : '$filtercode1',
								value : entityTypeValue
							},
							{
								key : '$filtercode2',
								value : entityCodeValue
							},
							{
								key : '$filtercode3',
								value : productCodeValue
							}
						];
					}
				}
				
			}			
			
			});
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		me.setDataForFilter();
		if(null != filterData && filterData.length == 0)
			return;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + me.getFilterUrl();
		//if(!Ext.isEmpty(filterData))
		//if(firstTime == false)
			grid.loadGridData(strUrl, null);
	},
	handleSpecificFilter: function() {
		var me = this;
		systemAccountFiltetrView = me.getSystemAccountFilterView(),
	    Ext.Ajax.request({
			url : 'services/systemAccountMst/entityType.json',
			method : 'POST',
			async: false,
			success : function( response )
			{
					var data = Ext.decode( response.responseText );
					if( !Ext.isEmpty( data ) ){
						var entityCombo = systemAccountFiltetrView.down('combobox[itemId=entityCombo]');
						entityCombo.value = data[2].ENTITY_TYPE;
				}
			},
			failure : function(response)
			{
			}
			});
	},
	setDataForFilter: function() {
		var me = this,
			systemAccountFiltetrView = me.getSystemAccountFilterView(),
			entityTypeValue = systemAccountFiltetrView.down('combobox[itemId=entityCombo]').getValue(),
			entityCodeValue = systemAccountFiltetrView.down('combobox[itemId=entityName]').getValue(),
			currencyValue = systemAccountFiltetrView.down('combobox[itemId=currencyCombo]').getRawValue(),
			productValue = systemAccountFiltetrView.down('combobox[itemId=productCombo]').getValue(),
			accNameValue = systemAccountFiltetrView.down('combobox[itemId=AccountName]').getValue(),
			statusValue = systemAccountFiltetrView.down('combobox[itemId=statusCombo]').getValue(),jsonArray = [];
			if(productValue == "")
				productValue = "Select";
			if(statusValue == "" || statusValue == "all")
				statusValue = "ALL";
			var actionBar = this.getGroupActionBar();
			var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
			if (!Ext.isEmpty(actionBar) && !Ext.isEmpty(actionBar.items.items)) {
				arrItems = actionBar.items.items;
				Ext.each(arrItems, function(item) {
					item.setDisabled(true);
				});
			}
			var fiCombo = systemAccountFiltetrView.down('combobox[itemId=sellerFltId]');
			var fiComboPanel = systemAccountFiltetrView.down('panel[itemId=financialInsttitutionPanel]');
			var isPending = true;
			//Code to handle Mandatory Filters
			if(fiComboPanel && fiComboPanel.isHidden() == false && firstTime == false) {
				if(fiCombo.getValue() == 'Select') {
					Ext.MessageBox.show({
						title : getLabel(
								'instrumentErrorPopUpTitle',
								'Error'),
						msg : getLabel(
								'mandatoryFilters',
								'Please select mandatory filters..!'),
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
					return;
				}
			}
			if((entityTypeValue == 'Select') && firstTime == false) {
				Ext.MessageBox.show({
					title : getLabel(
							'instrumentErrorPopUpTitle',
							'Error'),
					msg : getLabel(
							'mandatoryFilters',
							'Please select mandatory filters..!'),
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.ERROR
				});
				return;
			}

			var financialInsttitutionValue = systemAccountFiltetrView.down('combobox[itemId=sellerFltId]').getValue();
				if(financialInsttitutionValue != 'Select' && financialInsttitutionValue != '') {
						jsonArray.push({
						paramName : 'seller',
						paramValue1 : encodeURIComponent(financialInsttitutionValue.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
				}
			
			if(entityTypeValue != 'Select') {
				jsonArray.push({
					paramName : 'systemEntityType',
					paramValue1 : encodeURIComponent(entityTypeValue.replace(new RegExp("'", 'g'), "\''")),
					operatorValue : 'eq',
					dataType : 'S'
				});
			}
			if (!Ext.isEmpty(entityCodeValue)
					&& entityCodeValue != "Select") {				
				jsonArray.push({
					paramName : 'systemEntityCode',
					paramValue1 : encodeURIComponent(entityCodeValue.replace(new RegExp("'", 'g'), "\''")),
					operatorValue : 'eq',
					dataType : 'S'
				});
			}
			if(currencyValue != 'Select' && currencyValue != '') {
				jsonArray.push({
					paramName : 'ccyCode',
					paramValue1 : encodeURIComponent(currencyValue.replace(new RegExp("'", 'g'), "\''")),
					operatorValue : 'eq',
					dataType : 'S'
				});
			}
			if(statusValue != 'ALL') {
				 if(statusValue == 13)//Pending My Approval
					{
						statusValue  = new Array('5YY','4NY','0NY','1YY');
						isPending = false;
						jsonArray.push({
									paramName : 'statusFilter',
									paramValue1 : statusValue,
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
					//12:New Submitted 14:Modified Submitted
				if(statusValue == 12 || statusValue == 14) {
					statusValue = (statusValue == 12)?0:1; 
					jsonArray.push({
					paramName : 'isSubmitted',
					paramValue1 : 'Y',
					operatorValue : 'eq',
					dataType : 'S'
				});
				jsonArray.push({
					paramName : "requestState",
					paramValue1 : statusValue,
					operatorValue : 'eq',
					dataType : 'S'
				});
				/*jsonArray.push({
					paramName : "validFlag",
					paramValue1 : 'N',
					operatorValue : 'eq',
					dataType : 'S'
				});*/
				} else {
					if(statusValue == 11) {
						jsonArray.push({
							paramName : 'requestState',
							paramValue1 : 3,
							operatorValue : 'eq',
							dataType : 'S'
						});
					} else {
							jsonArray.push({
							paramName : 'requestState',
							paramValue1 : statusValue,
							operatorValue : 'eq',
							dataType : 'S'
						});
					}
				
					if(statusValue == 0 || statusValue == 1) {
							jsonArray.push({
							paramName : 'isSubmitted',
							paramValue1 : 'N',
							operatorValue : 'eq',
							dataType : 'S'
						});
					}
					if(statusValue == 11) {
						jsonArray.push({
							paramName : 'validFlag',
							paramValue1 : 'N',
							operatorValue : 'eq',
							dataType : 'S'
						});
					}
					if(statusValue == 3 ) {
						jsonArray.push({
							paramName : 'validFlag',
							paramValue1 : 'Y',
							operatorValue : 'eq',
							dataType : 'S'
						});
					}
				  }
				}
			}
			if(productValue != "Select") {
				jsonArray.push({
					paramName : "productCode",
					paramValue1 : encodeURIComponent(productValue.replace(new RegExp("'", 'g'), "\''")),
					operatorValue : 'eq',
					dataType : 'S'
				});
			}
			if (!Ext.isEmpty(accNameValue)
					&& accNameValue != "Select") {			
				jsonArray.push({
					paramName : "acctName",
					paramValue1 : encodeURIComponent(accNameValue.replace(new RegExp("'", 'g'), "\''")),
					operatorValue : 'eq',
					dataType : 'S'
				});
			}			
			/*if(statusValue == 'ALL') {
				jsonArray.push({
					paramName : 'validFlag',
					paramValue1 : 'Y',
					operatorValue : 'eq',
					dataType : 'S'
				});
			}*/
			filterData = jsonArray;
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
			if(filterData && filterData.length > 0) {
				me.getGrid().setLoading(true);
				grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
			}
		}
	},
	
	getScmProductGridConfiguration : function() {
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;
		objWidthMap = {
			"acctName" : 100,
			"glId" : 80,
			"ccyCode":80,
			"productCode":120,
			"requestStateDesc":120,
			"entityType" :120,
			"entityCode" :110
		};

		arrColsPref = [{	"colId" : "entityType",
							"colDesc" : getLabel('entityType', 'Entity Type')
						},{	"colId" : "entityDescription",
							"colDesc" : getLabel('entityCode', 'Entity Name')
						},
						{	"colId" : "acctName",
							"colDesc" : getLabel('accountName', 'Account Name')
						}, {
							"colId" : "glId",
							"colDesc" : getLabel('glId', 'GL Id')
						},{
							"colId" : "ccyCode",
							"colDesc" : getLabel('ccyCode', 'CCY')
						},{
							"colId" : "productDescription",
							"colDesc" : getLabel('productDescription', 'Product Description')
						},{
							"colId" : "requestStateDesc",
							"colDesc" : getLabel('status', 'Status')
						}];

		storeModel = {
					fields : ['__metadata','identifier', 'branchCode', 'glId','ccyCode','internalId','acctName',
							'entityType', 'entityCode', 'isSubmitted','productCode',
							'beanName', 'entityAcctDescription', 'acctBalance',
							'defaultAcctFlag', 'glAccountType', 'enabled','disabled','auditNo','validFlag','sellerId','authorised','lastRequestState','entityDescription',
							'requestState','requestStateDesc','newRecord','rejected','modified','version','recordKeyNo','isSubmitted','history','additionalAcctFlag','multipleCurrencyFlag','productDescription'],
					proxyUrl : 'services/systemAccountMst.json',
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
	
	handleSmartGridConfig : function() {
		var me = this;
		var systemAccountGrid = me.getScmProductGrid();
		var objConfigMap = me.getScmProductGridConfiguration();
		var arrCols = new Array();
		if (!Ext.isEmpty(systemAccountGrid))
			systemAccountGrid.destroy(true);

		arrCols = me.getColumns(objConfigMap.arrColsPref,
				objConfigMap.objWidthMap);
		me.handleSmartGridLoading(arrCols, objConfigMap.storeModel);
	},
	handleSmartGridLoading : function(arrCols,storeModel) {
		var me = this;
		var pgSize = null;
		pgSize = 10;
		scmProductGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
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
					rowNumbererColumnWidth : 50 ,
					isRowIconVisible : me.isRowIconVisible,
					isRowMoreMenuVisible : me.isRowMoreMenuVisible,
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

		var systemAccountDetailView = me.getSystemAccountDetailView();
		systemAccountDetailView.add(scmProductGrid);
		systemAccountDetailView.doLayout();
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
				if(objCol.colId == 'requestStateDesc')
				{
					cfgCol.locked = false;
					cfgCol.lockable = false;
					cfgCol.sortable = false;
					cfgCol.hideable = false;
					cfgCol.resizable = false;
					cfgCol.draggable = false;
					cfgCol.hidden = false;
				}
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
						toolTip : getLabel('historyToolTip', 'View History'),
						itemLabel : getLabel('historyToolTip',
								'View History'),
						maskPosition : 4
					}/*,{
						itemId : 'btnAddEdit',
						itemCls : 'grid-row-action-icon icon-add',
						itemLabel : getLabel('editAdd','Add Additional Account'),
						toolTip : getLabel('editAdd','Add Additional Account')
					}*/]
		};
		if(ACCESSNEW == "true")
		{
			objActionCol.items.push({
							itemId : 'btnAddEdit',
							itemCls : 'grid-row-action-icon icon-add',
							itemLabel : getLabel('editAdd','Add Additional Account'),
							toolTip : getLabel('editAdd','Add Additional Account')
						});
		}
		return objActionCol;
		
	},
	getFilterUrl : function() {
		var me = this;
		var strQuickFilterUrl = '';
		strQuickFilterUrl = me.generateUrlWithFilterParams(this);
		return strQuickFilterUrl;
	},
	generateUrlWithFilterParams : function(thisClass) {
		//var filterData = thisClass.filterData;
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
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var maskSize = 11;
		var maskArray = new Array();
		var actionMask = '';
		var rightsMap = record.data.__metadata.__rightsMap;
		var buttonMask = '';
		var retValue = true;
		var bitPosition = '';
		if(itmId == 'btnAddEdit')
			if(record.get('additionalAcctFlag') == 'Y' && record.get('multipleCurrencyFlag') == 'Y')
				return true;
			else
				return false;
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
		var isEnabled = false;
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
			if (objData.raw.isSubmitted == 'Y' && objData.raw.requestState == 0) {
				isSubmit = true;
			}
		}
		actionMask = doAndOperation(maskArray, 10);
		me.enableDisableGroupActions(actionMask, isSameUser, isDisabled,
				isSubmit, isEnabled);
	},
	enableDisableGroupActions : function(actionMask, isSameUser, isDisabled,isSubmit, isEnabled) {
		var actionBar = this.getGroupActionBar();
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
				me.showHistory(record.get('acctName'),record.get('history').__deferred.uri, record.get('identifier'));
			}
		} else if (actionName === 'btnView') {
			me.submitExtForm('viewSystemAccountMst.form', record, rowIndex);
		} else if (actionName === 'btnEdit') {
			me.submitExtForm('editSystemAccountMst.form', record, rowIndex);
		} else if (actionName === 'btnAddEdit') {
			me.submitExtForm('addSystemAccountMst.form', record, rowIndex);
		}
	},
	showHistory : function(productDesc, url, id) {
		Ext.create('GCP.view.HistoryPopup', {
					historyUrl : url,
					productDesc : productDesc,
					identifier : id
				}).show();
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
	setFilterParameters : function(form){
		/*
		var me = this;
		var selectedSeller = null, beneName = null, statusVal = null;
		var arrJsn = {};
		var specificFilterView = me.getSpecificFilterPanel();
		var sellerCombo = specificFilterView.down('combobox[itemId=sellerFltId]');
		if (!Ext.isEmpty(me.getClientFilter())
				&& !Ext.isEmpty(me.getClientFilter().getValue())) {
			beneName = me.getClientFilter().getValue();
		}
		if(sellerCombo){
			selectedSeller = sellerCombo.getValue();
		}
		if (!Ext.isEmpty(me.getStatusFilter())
				&& !Ext.isEmpty(me.getStatusFilter().getValue())
				&& "ALL" != me.getStatusFilter().getValue()) {
			statusVal = me.getStatusFilter().getValue();
		}
		arrJsn['sellerId'] = selectedSeller;
		arrJsn['beneName'] = beneName;
		arrJsn['status']= statusVal;
		arrJsn['statusDesc']= me.getStatusFilter().getRawValue();
		
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'filterData', Ext.encode(arrJsn)));*/
	},
	handleGroupActions : function(btn, record) {
		var me = this;
		var strAction = !Ext.isEmpty(btn.actionName)
				? btn.actionName
				: btn.itemId;
		var strUrl = Ext.String.format('services/systemAccountMst/{0}',
				strAction);
		if (strAction === 'reject') {
			this.showRejectVerifyPopUp(strAction, strUrl,record);

		} else {
			this.preHandleGroupActions(strUrl, '',record);
		}

	},
	preHandleGroupActions : function(strUrl, remark, record) {

		var me = this;
		var grid = this.getGrid();
		if (!Ext.isEmpty(grid)) {
			var arrayJson = new Array();
			var records = grid.getSelectedRecords();
			records = (!Ext.isEmpty(records) && Ext.isEmpty(record)) ? records : [record];
			for (var index = 0; index < records.length; index++) {
				arrayJson.push({
					serialNo : grid.getStore().indexOf(records[index])+ 1,
					identifier : records[index].data.identifier,
					userMessage : remark,
					recordDesc : index + 1
				});
			}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});
			strUrl = strUrl + ".srvc?"+ csrfTokenName + "=" + csrfTokenValue;
			Ext.Ajax.request({
				url : strUrl,
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
	setInfoTooltip : function() {
		var me = this;
		var infotip = Ext.create('Ext.tip.ToolTip', {
		target : 'imgFilterInfo',
		listeners : {
			// Change content dynamically depending on which element
			// triggered the show.
			beforeshow : function(tip) {
				var systemAccountFilterView = me.getSystemAccountFilterView(),
					systemAccountFiltetrView = me.getSystemAccountFilterView(),
					entityTypeValue = systemAccountFiltetrView.down('combobox[itemId=entityCombo]').getRawValue(),
					entityCodeValue = systemAccountFiltetrView.down('combobox[itemId=entityName]').getRawValue(),
					acctNameValue = systemAccountFiltetrView.down('combobox[itemId=AccountName]').getRawValue(),
					currencyValue = systemAccountFiltetrView.down('combobox[itemId=currencyCombo]').getRawValue(),
					productValue = systemAccountFiltetrView.down('combobox[itemId=productCombo]').getRawValue(),
					statusValue = systemAccountFiltetrView.down('combobox[itemId=statusCombo]').getRawValue()
				
				
				if(statusValue == 'All')
					statusValue = 'None';
				if(currencyValue == 'Select')
					currencyValue = 'None';
				if(productValue == 'Select')
					productValue = 'None';
				if(entityTypeValue == 'Select')
					entityTypeValue = 'None';
				if(entityCodeValue == 'Select')
					entityCodeValue = 'None';
				if(acctNameValue == '')
					acctNameValue = 'None';				
				/*tip.update(getLabel("systemAccountDesc","System Account Description")
						+ ' : <br>'*/
						tip.update(
						getLabel('seller', 'Seller') + ' : ' + strSellerDesc
						+ '<br>'
						+ getLabel('entityType', 'Entity Type') + ' : ' + entityTypeValue
						+ '<br>'
						+ getLabel('entityCode', 'Entity Name') + ' : ' + entityCodeValue
						+ '<br>'
						+ getLabel('currency', 'Currency') + ' : ' + currencyValue
						+ '<br>'
						+ getLabel('product', 'Product') + ' : ' + productValue
						+ '<br>'
						+ getLabel('status', 'Status') + ' : ' + statusValue
						+ '<br>'
						+ getLabel('acctName', 'Account Name') + ' : ' + acctNameValue);				
			}
		}
	});
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
							if (Ext.isEmpty(text) || text.trim().length === 0) {
			                       Ext.Msg.alert(getLabel('errorTitle', 'Error'), getLabel('Error',
			                                            'Reject Remark field can not be blank'));
			               }else{
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
	onRefreshClick : function() {
		var obj = {};
		obj.seller = strSellerId;
		obj.user = USER;
		var me = this;
		me.getSystemAccountView().setLoading(true);
		Ext.Ajax.request({
			url : 'services/systemAccountMst/refresh.srvc',
			method : 'POST',
			timeout : 600000,
			//jsonData : Ext.encode(obj),
			params : obj,
			async: true,
			success : function( response )
			{
				me.getSystemAccountView().setLoading(false);
				window.location.reload();
			},
			failure : function(response)
			{
				me.getSystemAccountView().setLoading(false);
			}
		});
	},
	
	populateProductList : function() {
		var me = this,obj = {};
	    obj.seller = strSellerId;
	    Ext.Ajax.request({
			url : 'services/systemAccountMst/product.json',
			timeout : 60000,
			params : obj,
			method : 'POST',
			async: false,
			success : function( response )
			{
				var data = Ext.decode( response.responseText );
				if( !Ext.isEmpty( data ) ){
					var objStore = Ext.create('Ext.data.Store', {
					fields : ['PRODUCT_CODE', 'PRODUCT_DESCRIPTION'],
					data : data,
					reader : {
							type : 'json'
						}
					});
					objStore.load();
				    var systemAccountFiltetrView = me.getSystemAccountFilterView();
					var productCombo = systemAccountFiltetrView.down('combobox[itemId=productCombo]');
					productCombo.store = objStore;
					productCombo.store.on('load',function(){
						if(productCombo.store.getAt(0).data.name != 'Select') {
							productCombo.store.insert(0, {
				              PRODUCT_CODE : 'Select',
				              PRODUCT_DESCRIPTION : getLabel('select', 'Select')
				             });
						}
					});
					productCombo.store.load();
				}
			},
			failure : function(response)
			{
			}
		});
	},
	
	populateEntityCode : function(entityType) {
		var me = this;
		systemAccountFiltetrView = me.getSystemAccountFilterView();
		strEntityType = systemAccountFiltetrView.down('combobox[itemId=entityCombo]').getValue();
    	if(Ext.isEmpty( strEntityType )){
    		strEntityType = 'SYSTEM';
    	}		

		var objAutocompleterEntityName = systemAccountFiltetrView.down('AutoCompleter[itemId="entityName"]');
		objAutocompleterEntityName.cfgUrl = 'services/userseek/entityNameSeek.json';
		objAutocompleterEntityName.cfgSeekId = 'entityNameSeek';
		objAutocompleterEntityName.cfgRecordCount = -1;
		
			objAutocompleterEntityName.cfgExtraParams =
			[
				{
					key : '$filtercode1',
					value : strSellerId
				},
				{
					key : '$filtercode2',
					value : strEntityType
				}
			];		
	}, 
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store, view, colId) 
	{
		var strRetValue = null;
		if (colId === 'col_entityDescription') {
			meta.tdAttr = 'title="' + value + '"';
			strRetValue = value;
		}
		else if (colId === 'col_productDescription') {
			meta.tdAttr = 'title="' + value + '"';
			strRetValue = value;
		}
		else {
			strRetValue = value;
		}
		return strRetValue;
	}
	});