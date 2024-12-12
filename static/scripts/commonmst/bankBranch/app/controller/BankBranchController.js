Ext.define('GCP.controller.BankBranchController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.util.Point'],
	views : ['GCP.view.BankBranchView','GCP.view.BankBranchFilterView','GCP.view.BankBranchGridView','GCP.view.BankBranchActionBarView','GCP.view.HistoryPopup'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'bankView',
				selector : 'bankBranchView'
			},{
				ref : 'createNewToolBar',
				selector : 'bankBranchView bankBranchGridView toolbar[itemId="btnCreateNewToolBar"]'
			},{
				ref : 'bankBranchFilterView',
				selector : 'bankBranchView bankBranchFilterView'
			},{
				ref : 'gridHeader',
				selector : 'bankBranchView bankBranchGridView panel[itemId="clientSetupDtlView"] container[itemId="gridHeader"]'
			}, {
				ref : 'bankGridView',
				selector : 'bankBranchView bankBranchGridView grid[itemId="gridViewMstId"]'
			}, {
				ref : 'bankGrtidDtlView',
				selector : 'bankBranchView bankBranchGridView panel[itemId="clientSetupDtlView"]'
			},{
				ref : 'grid',
				selector : 'bankBranchGridView smartgrid'
			}, {
				ref : 'groupActionBar',
				selector : 'bankBranchView bankBranchGridView bankBranchActionBarView'
			},{
				ref : 'specificFilterPanel',
				selector : 'bankBranchView bankBranchFilterView panel container[itemId="specificFilter"]'
			},
			{
				ref : "bankFilter",
				selector : 'bankBranchView bankBranchFilterView textfield[itemId="bankFilter"]'
			},{
				ref : "branchFilter",
				selector : 'bankBranchView bankBranchFilterView textfield[itemId="branchFilter"]'
			},{
				ref : "sellerCombo",
				selector : 'bankBranchView bankBranchFilterView combobox[itemId="sellerCombo"]'
			},
			{
				ref : "statusFilter",
				selector : 'bankBranchView bankBranchFilterView combobox[itemId="statusFilter"]'
			},
			{
				ref : "bankIdentifierId",
				selector : 'bankBranchView bankBranchFilterView textfield[itemId="bankIdentifierId"]'
			},
			{
				ref : "bankIdentifierTypeId",
				selector : 'bankBranchView bankBranchFilterView combobox[itemId="bankIdentifierTypeId"]'
			},
			{
				ref : 'grid',
				selector : 'bankBranchGridView smartgrid'
			}
			],
	config : {
	
					filterData : [],
					bankNameSelected : false,
					branchNameSelected : false
		},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		me.control({
			'bankBranchView bankBranchGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateBranch"]' : {
				click : function() {
					//me.handleAlertEntryAction(true);
	                 me.handleBankEntryAction(true);
				}
			},
			
			
			'bankBranchView bankBranchFilterView' : {
			    render : function() {
			
					me.setInfoTooltip();
					me.handleSpecificFilter();
					me.setDataForFilter();
					me.applyFilter();
				}
			},			
			
			'bankBranchView bankBranchGridView panel[itemId="clientSetupDtlView"]' : {
				render : function() {
		
					me.handleGridHeader();
					
				}
			},
			
			
			'bankBranchGridView' : {
				render : function(panel) {
					me.handleSmartGridConfig();
				}
			},
			
			'bankBranchGridView smartgrid' : {
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
			'bankBranchGridView toolbar[itemId=AlertGroupActionBarView_subcriptionDtl]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			},
			'bankBranchView bankBranchFilterView button[itemId="btnFilter"]' : {
				click : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
				}
			}
		});
	},
	
	handleSpecificFilter : function() {
		var me = this;
		var storeData;
		var storeIdTypeData;
		
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
		var comboStore = Ext.create('Ext.data.Store', {
			fields : ['CODE', 'DESCR'],
			data : storeData,
			reader : {
				type : 'json',
				root : 'preferences'
			}
		});		
		
		var bankTextField = Ext.create('Ext.ux.gcp.AutoCompleter', {
					fieldCls : 'xn-form-text w165 xn-suggestion-box ux_font-size14-normal',
					cls:'ux_font-size14-normal',
					name : 'bankName',
					itemId : 'bankFilter',
					cfgUrl : 'cpon/bankBranchMst/bankNameSeek.json',
					cfgProxyMethodType : 'POST',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					//cfgSeekId : 'bankNameSeek.json',
					enableQueryParam:false,
					//cfgRootNode : 'd.filter',
					cfgDataNode1 : 'DRAWEE_BANK_DESCRIPTION',
					cfgKeyNode:'DRAWEE_BANK_CODE',
					matchFieldWidth:true,
					listeners:{
						'select' : function(combo, record) {
							var newValue = combo.getValue();
							me.setBankToBranchAutoCompleterUrl(newValue);
							me.bankNameSelected = true;
						},
						'change' : function(combo, record) {
							var branchNameAutoCompleter = me.getBranchFilter();
							branchNameAutoCompleter.reset();
						     var newValue = combo.getValue();
						     if(Ext.isEmpty(newValue)){
							 	me.clearBankToBranchAutoCompleterUrl();
						     }
						     me.bankNameSelected = false;
						}
					}
				});
		
		var branchTextField = Ext.create('Ext.ux.gcp.AutoCompleter', {
					fieldCls : 'xn-form-text w165 xn-suggestion-box ux_font-size14-normal',
					cls:'ux_font-size14-normal',
					name : 'branchName',
					itemId : 'branchFilter',
					cfgUrl : 'cpon/bankBranchMst/branchNameSeek.json',
					cfgProxyMethodType : 'POST',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					matchFieldWidth:true,
					//cfgSeekId : 'branchNameSeek',
					enableQueryParam:false,
					//cfgRootNode : 'd.filter',
					cfgDataNode1 : 'DRAWEE_BRANCH_DESCRIPTION',
					cfgKeyNode:'DRAWEE_BRANCH_CODE',
					listeners:{
						'select' : function(combo, record) {
							me.branchNameSelected = true;
						},
						'change' : function(combo, record) {
						     me.branchNameSelected = false;
						}
					}
				});
		
		if (!Ext.isEmpty(arrStatusFilterLst)) {
			arrStatusFilterLst.push({
									name : 'all',
									value : getLabel('all','ALL')
								});	
			}
		
		var statusStore = Ext.create('Ext.data.Store', {
					fields : ["name", "value"],
					data : arrStatusFilterLst
					/*proxy : {
						type : 'ajax',
						autoLoad : true,
						url : 'cpon/statusList.json',
						actionMethods : {
							read : 'POST'
						},
						reader : {
							type : 'json',
							root : 'd.filter'
						},
						noCache: false
					}*/
				});
				Ext.Ajax.request({
					url : 'cpon/bankBranchMst/bankIdentifierType.json',
					method : 'POST',
					async : false,
					success : function(response) {
						var data = Ext.decode(response.responseText);
						var idTypesData = data;
						if (!Ext.isEmpty(data)) {
							storeIdTypeData = idTypesData;
						}
						
						if (!Ext.isEmpty(storeIdTypeData) && storeIdTypeData.length > 1) {
						storeIdTypeData.push({
												BANK_ID_DESC : getLabel('all','ALL'),
												COLUMN_NAME : getLabel('all','ALL')
											});
						}
					},
					failure : function(response) {
						// console.log("Ajax Get data Call Failed");
					}
				});
				var objStore = Ext.create('Ext.data.Store', {
					fields : ['BANK_ID_DESC', 'COLUMN_NAME'],
					data : storeIdTypeData,
					reader : {
						type : 'json',
						root : 'preferences'
					}
				});
	
	var sellerComboField = Ext.create('Ext.form.field.ComboBox', {
			displayField : 'DESCR',
			fieldCls : 'xn-form-field inline_block ux_font-size14-normal ',
			triggerBaseCls : 'xn-form-trigger',
			filterParamName : 'sellerCode',
			itemId : 'sellerCombo',
			valueField : 'CODE',
			name : 'sellerCode',
			editable : false,
			store : comboStore,
			value : strSellerId,
			width : 'auto',
			cls:'w165',
			listeners : {
				'render' : function(combo, record) {
					//combo.setValue(strSellerId);	
					combo.store.load();
					var bankNameAutoCompleter = me.getBankFilter();
					bankNameAutoCompleter.reset();
					bankNameAutoCompleter.cfgExtraParams = [{
								key : '$filtercode1',
								value : strSellerId
							}];
					
					var branchNameAutoCompleter = me.getBranchFilter();
					branchNameAutoCompleter.reset();
					branchNameAutoCompleter.cfgExtraParams = [{
								key : '$filtercode1',
								value : strSellerId
							}];					
					
				},
				'change' : function(combo, record) {
					strSellerId=combo.getValue();
					setAdminSeller(strSellerId);
					me.setSellerToBankAutoCompleterUrl();

					var branchNameAutoCompleter = me.getBranchFilter();
					branchNameAutoCompleter.reset();
					branchNameAutoCompleter.cfgExtraParams = [{
								key : '$filtercode1',
								value : strSellerId
							}];							
				}
			}
		});	
				
		var filterPanel = me.getSpecificFilterPanel();
		if (!Ext.isEmpty(filterPanel))
		{
			filterPanel.removeAll();
		}
		
		filterPanel.doLayout();

			filterPanel.add({
							   xtype : 'container',
							   columnWidth : 0.3,
							   padding : '5px',
					           hidden : true,
					           itemId : 'sellerFilter',
					           items: [{
										xtype : 'label',
										cls : 'f20 ux_font-size14 ux_normalmargin-bottom',
										itemId : 'labelSeller',
										text : getLabel('seller', 'Financial Institution')
										 //cls : 'xn-custom-button cursor_pointer',
							          }, sellerComboField]
		    		},{
							   xtype : 'container',
							   columnWidth : 0.3,
							   padding : '5px',
						items : [{
									xtype : 'label',
									text : getLabel('bankName',
											'Bank Name'),
									cls : 'f13 ux_font-size14  ux_normalmargin-bottom'
								}, bankTextField]
					}, {
							   xtype : 'container',
							   columnWidth : 0.3,
							   padding : '5px',
						 flex : 1,
						items : [{
									xtype : 'label',
									text : getLabel('branchName', 'Branch Name'),
									cls : 'f13 ux_font-size14  ux_normalmargin-bottom'
								}, branchTextField]
					   },{
							   xtype : 'container',
							   columnWidth : 0.3,
							   padding : '5px',
//							columnWidth : 0.4,
							itemId: 'statusFilterPanel',
							items : [{
										xtype : 'label',
										text : getLabel('status', 'Status'),
										cls : 'f13 ux_font-size14 ux_normalmargin-bottom'
									}, {
										xtype : 'combobox',
										fieldCls : 'xn-form-field inline_block',
										triggerBaseCls : 'xn-form-trigger',
										width : 165,
										itemId : 'statusFilter',
										filterParamName : 'bankRequestState',
										store : statusStore,
										valueField : 'name',
										displayField : 'value',
										editable : false,
										value : 'all'//getLabel('all','ALL')
	
									}]

					},{
					xtype : 'panel',
					padding : '5px',
					columnWidth : 0.3,
					layout : 'vbox',
					items : [{
								xtype : 'label',
								text : getLabel('bankIdentifierType', 'Bank Identifier Type'),
								cls : 'frmLabel'
							}, {
								xtype : 'combo',
								displayField : 'value',
								fieldCls : 'xn-form-field inline_block',
								triggerBaseCls : 'xn-form-trigger',
								filterParamName : 'bankIdentifierType',
								itemId : 'bankIdentifierTypeId',
								valueField : 'COLUMN_NAME',
								displayField : 'BANK_ID_DESC',
								name : 'bankIdentifierType',
								editable : false,
								value : storeIdTypeData.length > 1 ? getLabel('all', 'ALL') : storeIdTypeData[0].BANK_ID_DESC,
								store : objStore,
							 	width : 165,
								listeners : {
						 	'select' : function(combo, record) {
								if('ALL' == combo.getRawValue().toUpperCase())
								{
									me.getBankIdentifierId().setRawValue(getLabel('all', 'ALL'));
									me.getBankIdentifierId().setValue(getLabel('all', 'ALL'));
									var selected = me.getBankBranchFilterView().down('panel[itemId="bankIdentifierIdPanel"]');
									selected.hide();
								}
								else
								{	
									var selected = me.getBankBranchFilterView().down('panel[itemId="bankIdentifierIdPanel"]');
									selected.show();
								}
							 }
							}
						}]
				}, {
					xtype : 'panel',
					columnWidth : 0.3,
					padding : '5px',
					itemId : 'bankIdentifierIdPanel',
					hidden : true,
					layout : 'vbox',
					items : [{
								xtype : 'label',
								text : getLabel('bankIdentifier', 'Identifier'),
								cls : 'frmLabel'
							}, {
								xtype : 'textfield',
								displayField : 'value',
								fieldCls : 'inline_block',
								triggerBaseCls : 'xn-form-trigger',
								filterParamName : 'bankIdentifier',
								itemId : 'bankIdentifierId',
								name : 'bankIdentifier',
								editable : false,
								value : 'ALL',
							 	width : 165,
								height : 25
						}]
				},{
							   xtype : 'container',
							  
							   padding : '5px',
//						columnWidth : 0.1,
						itemId: 'buttonFilter',
						items : [{
									xtype : 'panel',
									layout : 'hbox',									
									padding : '20 0 1 5',
									items : [{
												xtype : 'button',
												itemId : 'btnFilter',
												text : getLabel('search',
														'Search'),
												cls : 'ux_button-padding ux_button-background ux_button-background-color'
											}]
								}]
					});
						
			sellerComboField.store.on('load',function(store){
				if(store.getCount()===1)
				{
					filterPanel.down('container[itemId="sellerFilter"]').hide();
				}					
				else
				{	
					filterPanel.down('container[itemId="sellerFilter"]').show();
				}
				});
	},

setSellerToBankAutoCompleterUrl : function() {
		var me = this;
		var bankNameAutoCompleter = me.getBankFilter();
		bankNameAutoCompleter.reset();
		bankNameAutoCompleter.cfgExtraParams = [{
					key : '$filtercode1',
					value : strSellerId
				}];
	},
setBankToBranchAutoCompleterUrl : function(value) {
		var me = this;
		var sellerCombo = me.getSellerCombo();
		var sellerValue=sellerCombo.getValue();
		var BranchNameAutoCompleter = me.getBranchFilter();
		BranchNameAutoCompleter.cfgExtraParams = [{
					key : '$filtercode1',
					value : sellerValue
				    },{key : '$filtercode2',
					  value : value
				}];
},
clearBankToBranchAutoCompleterUrl : function() {
		var me = this;
		var sellerCombo = me.getSellerCombo();
		var sellerValue=sellerCombo.getValue();
		var BranchNameAutoCompleter = me.getBranchFilter();
		BranchNameAutoCompleter.cfgExtraParams = [{
					key : '$filtercode1',
					value : sellerValue
				    }];
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
							text : getLabel('bankBranchMessageTemp', 'Create New Bank Branch'),
							cls : 'cursor_pointer ux_button-background ux_button-padding ux_button-background-color ux_button-s',
						    glyph:'xf055@fontawesome',
							parent : this,
						//	padding : '4 0 2 0',
							itemId : 'btnCreateBranch'
						}
		);
		}
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
		
		var sellerVal = null, bankNameVal = null, bankNameRawVal = null, branchNameVal = null, branchNameRawVal = null , statusVal=null, jsonArray = [], bankIdType=null,bankId=null;
		var bankSetupFilterView = me.getBankBranchFilterView();
		var isPending = true;
		if(!Ext.isEmpty(bankSetupFilterView)){
			var bankNameFilterId=me.getBankFilter();
			var branchNameFilterId=me.getBranchFilter();
			var bankIdentifierType = me.getBankIdentifierTypeId();
			var bankIdentifier = me.getBankIdentifierId();
			var sllerComboFilterId=me.getSellerCombo();
			
			if(!Ext.isEmpty(bankNameFilterId)){
				if(me.bankNameSelected == true){
					bankNameVal=bankNameFilterId.getValue();
				}else{
					bankNameRawVal = bankNameFilterId.getValue();
				}
			}
			if(!Ext.isEmpty(branchNameFilterId)){
				if(me.branchNameSelected){
					branchNameVal=branchNameFilterId.getValue();
				}else{
					branchNameRawVal=branchNameFilterId.getValue();
				}
			}
			if(!Ext.isEmpty(bankIdentifierType)){
					bankIdType=bankIdentifierType.getValue();
			}
			if(!Ext.isEmpty(bankIdentifier)){
				bankId=bankIdentifier.getValue();
			}
			if(!Ext.isEmpty(sllerComboFilterId)){
				sellerVal=sllerComboFilterId.getValue();
			}
			
			if (!Ext.isEmpty(bankNameVal)) {
			jsonArray.push({
						paramName : 'bankNameCode',
						paramValue1 : encodeURIComponent(bankNameVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		if (!Ext.isEmpty(branchNameVal)) {
			jsonArray.push({
						paramName : 'branchNameCode',
						paramValue1 : encodeURIComponent(branchNameVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		
			jsonArray.push({
						paramName : 'sellerCode',
						paramValue1 : encodeURIComponent(sellerVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});


	}
		if (!Ext.isEmpty(me.getStatusFilter())
				&& !Ext.isEmpty(me.getStatusFilter().getValue())
				&& ('all' != me.getStatusFilter().getValue().toLowerCase())) {
						
			statusVal = me.getStatusFilter().getValue();
			if( statusVal == 13)//Pending My Approval
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
			 if (isPending)
			{
			    if (statusVal == 12 || statusVal == 3 || statusVal == 14) {
				if (statusVal == 12 || statusVal == 14) //12:New  Submitted //14:Modified Submitted
				{
					statusVal = (statusVal == 12) ? 0:1;
					jsonArray.push({
								paramName : 'branchIsSubmitted',
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
							paramName : 'branchIsSubmitted',
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
		if (!Ext.isEmpty(bankNameRawVal)) {
			jsonArray.push({
						paramName : 'bankNameDesc',
						paramValue1 : encodeURIComponent(bankNameRawVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'lk',
						dataType : 'S'
					});
		}
		if (!Ext.isEmpty(branchNameRawVal)) {
			jsonArray.push({
						paramName : 'branchNameDesc',
						paramValue1 : encodeURIComponent(branchNameRawVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'lk',
						dataType : 'S'
					});
		}
		if (!Ext.isEmpty(bankIdType) && 'ALL' != bankIdType.toUpperCase()) {
			jsonArray.push({
						paramName : 'bankIdType',
						paramValue1 : encodeURIComponent(bankIdType.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
					if (!Ext.isEmpty(bankId)) {
						jsonArray.push({
									paramName : 'bankId',
									paramValue1 : 'ALL' != bankId ? encodeURIComponent(bankId.replace(new RegExp("'", 'g'), "\''")) : encodeURIComponent('%'),
									operatorValue : 'lk',
									dataType : 'S'
								});
					}
					else
					{
						jsonArray.push({
									paramName : 'bankId',
									paramValue1 : encodeURIComponent('%'),
									operatorValue : 'lk',
									dataType : 'S'
								});
					}
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
		var bankGrid = me.getBankGridView();
		var objConfigMap = me.getScmProductGridConfiguration();
		var arrCols = new Array();
		if (!Ext.isEmpty(bankGrid))
			bankGrid.destroy(true);

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
				//	padding : '5 0 0 0',
					cls : 'ux_largepaddinglr ux_paddingb ux_largemargin-bottom',
					rowList : _AvailableGridSize,
					minHeight : 0,
					columnModel : arrCols,
					storeModel : storeModel,
					isRowIconVisible : me.isRowIconVisible,
					//isRowMoreMenuVisible : me.isRowMoreMenuVisible,
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

		var clntSetupDtlView = me.getBankGrtidDtlView();
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
				me.showHistory(record.get('draweeBankName'),record.get('history').__deferred.uri, record.get('identifier'));
			}
		} else if (actionName === 'btnView') {
			me.submitExtForm('viewBankBranchMst.form', record, rowIndex);
		} else if (actionName === 'btnEdit') {
			me.submitExtForm('editBankBranchMst.form', record, rowIndex);
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
		me.setFilterParameters(form);
		document.body.appendChild(form);
		form.submit();
	},
			
	showHistory : function(product ,url, id) {
		Ext.create('GCP.view.HistoryPopup', {
					clientName : product,
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
				cfgCol.lockable = true;
				cfgCol.draggable = true;
				cfgCol.locked = false;
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
						toolTip : getLabel('editToolTip', 'Edit Record'),
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
						text : getLabel('actionSubmit', 'Submit'),
						itemId : 'submit',
						actionName : 'submit',
						maskPosition : 5
					}, {
						text : getLabel('actionDiscard', 'Discard'),
						itemId : 'discard',
						actionName : 'discard',
						maskPosition : 10
					}, {
						text : getLabel('actionApprove', 'Approve'),
						itemId : 'accept',
						actionName : 'accept',
						maskPosition : 6
					}, {
						text : getLabel('actionReject', 'Reject'),
						itemId : 'reject',
						actionName : 'reject',
						maskPosition : 7
					}, {
						text : getLabel('actionEnable', 'Enable'),
						itemId : 'enable',
						actionName : 'enable',
						maskPosition : 8
					}, {
						text : getLabel('actionDisable',	'Disable'),
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
		var strUrl = Ext.String.format('cpon/bankBranchMst/{0}',
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
                            if (Ext.isEmpty(text)) {
                                 Ext.Msg.alert(getLabel('errorTitle', 'Error'), getLabel('rejectEmptyErrorMsg',
                                    'Reject Remarks cannot be blank'));
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
							recordDesc: records[index].data.draweeBranchDescription
						});
			}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});
			
			grid.setLoading(true);

			Ext.Ajax.request({
						url : strUrl + csrfTokenName + "=" + csrfTokenValue,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							// TODO : Action Result handling to be done here
							grid.setLoading(false);
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
							grid.setLoading(false);
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
			"draweeBankName" : 220,
			"draweeBranchDescription" : 200,	
			"requestStateDesc" : 160,
			"countryName" : 200
			};

		arrColsPref = [{	
							"colId" : "draweeBankName",
							"colDesc" : getLabel("bank","Bank")
							
						}, {
							"colId" : "draweeBranchDescription",
							"colDesc" :getLabel("branch","Branch") 
							
						},
						{
							"colId" : "countryName",
							"colDesc" : getLabel("country","Country")	
						},{
							"colId" : "requestStateDesc",
							"colDesc" : getLabel("status","Status")
						}
						];

		storeModel = {
					fields : ['draweeBankCode','country', 'draweeBranchCode', 'countryName','draweeBankName','draweeBranchDescription',
							 'beanName', 'primaryKey','history','identifier','makerId','sellerId','state','validFlag','city',
							'requestStateDesc', 'parentRecordKey', 'version','isSubmitted',
							'recordKeyNo', 'masterRecordkeyNo', '__metadata'],
					   proxyUrl : 'cpon/bankBranchMst.json',
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
	handleBankEntryAction : function(entryType) {
		var me = this;
		var form;
		var strUrl = 'addBankBranchMst.form';
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
	/* Function sets the filter Panel element values in JSON */
	setFilterParameters : function(form) {
		var me = this;
		var drawerNameVal = null;
		var arrJsn = {};
		var bankBranchFilterView = me.getBankBranchFilterView();
		/*var drawerNameFltId = bankBranchFilterView
				.down('combobox[itemId=drawerNameFltId]');
		if (!Ext.isEmpty(drawerNameFltId)
				&& !Ext.isEmpty(drawerNameFltId.getValue())) {
			drawerNameVal = drawerNameFltId.getValue();
		}*/
		arrJsn['sellerId'] =  strSellerId;
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
					target : 'imgFilterInfo',
					listeners : {
						// Change content dynamically depending on which element
						// triggered the show.
						beforeshow : function(tip) {
							
							var seller = '';
							var bankValue='';
							var branchName = '';
							var statusVal = '';
							var bankIdType = '';
							var bankId = '';
							var branchSetupFilterView = me.getBankBranchFilterView();
							
	                        var bankNameFilter=me.getBankFilter()
							
							var branchNameFilter=me.getBranchFilter();
							var bankIdentifierType = me.getBankIdentifierTypeId();
							var bankIdentifier = me.getBankIdentifierId();
							if (!Ext.isEmpty(branchSetupFilterView.down('combo[itemId="sellerCombo"]')) 
									&& branchSetupFilterView.down('combo[itemId="sellerCombo"]') != null) {
								seller=branchSetupFilterView.down('combo[itemId="sellerCombo"]').getRawValue();
							} else {
								seller = strSellerId;
							}
							
							if (!Ext.isEmpty(bankNameFilter)
									&& !Ext.isEmpty(bankNameFilter.getValue())) {
								bankValue =bankNameFilter.getRawValue();
							}else
								bankValue = getLabel('none','None');							
							
							if (!Ext.isEmpty(branchNameFilter)
									&& !Ext.isEmpty(branchNameFilter.getValue())) {
								branchName =branchNameFilter.getRawValue();
							}else
								branchName = getLabel('none','None');
                        	if (!Ext.isEmpty(me.getStatusFilter()) && 
							!Ext.isEmpty(me.getStatusFilter().getValue())){
								statusVal = me.getStatusFilter().getRawValue();					 								
							}
							if ('All' == statusVal)
								statusVal ='ALL';	
							
							if(!Ext.isEmpty(bankIdentifierType))
							{
								bankIdType=bankIdentifierType.getRawValue();	;
							}
						if(!Ext.isEmpty(bankIdentifier) && !Ext.isEmpty(bankIdentifier.getValue()))
						{
							bankId=bankIdentifier.getValue();
						}else
							bankId = getLabel('none','None');
						
							tip.update(
								getLabel('financialInstitution', 'Financial Institution') + ' : ' + seller+ '<br/>'
								    + getLabel('status', 'Status') + ' : '
									+ statusVal	+ '<br/>'
								    +  getLabel('bankName', 'Bank Name') + ' : '
									+ bankValue+ '<br/>'
									+ getLabel('branchName', 'Branch Name') + ' : '
									+ branchName+ '<br/>'
									+ getLabel('bankIdentifierType', 'Bank Identifier Type') + ' : '
									+ bankIdType+ '<br/>'
									+ getLabel('bankIdentifier', 'Identifier') + ' : '
									+ bankId)
						}
					}
				});
	}
});
