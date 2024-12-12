Ext.define('GCP.view.PmtViewTxnFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'pmtViewTxnFilterView',
	requires : ['Ext.panel.Panel', 'Ext.form.Label', 'Ext.toolbar.Toolbar',
			'Ext.Img', 'Ext.button.Button', 'GCP.view.PmtAdvancedFilterPopup',
			'GCP.view.PmtTxnCreateNewAdvFilter'],
	width : '100%',
	margin : '10 0 0 0',
	collapsible : true,
	title : getLabel('filterBy', 'Filter By: ')
			+ '<img id="imgTxnFilterInfo" class="largepadding icon-information"/>',
	cls : 'xn-ribbon',
	componentCls : 'gradiant_back roundify ui-corner-all',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	config : {
		paymentTypeFilterVal : 'all',
		paymentTypeFilterDesc:'All',
		filterApplied : 'ALL',
		filterData : [],
		paymentActionFilterVal : 'all',
		advFilterCodeApplied : null,
		advFilterData : [],
		advSortByData:[],
		showAdvFilterCode : null,
		objAdvFilterPopup : null,
		filterCodeValue : null,
		savePrefAdvFilterCode : null,
		SearchOrSave:false

	},
	listeners : {
		render : function(panel) {
			this.setInfoTooltip();
			this.getAllSavedAdvFilterCode();
		},
		afterrender : function(panel) {
			this.handleProductActionsAndPaymentTypeLoading();
		}
	},

	initComponent : function() {
		var me = this;
		me.objAdvFilterPopup = Ext.create('GCP.view.PmtAdvancedFilterPopup', {
					parent : 'pmtTxnView',
					width : 710,
					height : 565,
					tapPanelWidth : 690,
					tapPanelHeight : 540,
					itemId : 'txnViewAdvancedFilter',
					filterPanel : {
						xtype : 'pmtTxnCreateNewAdvFilter',
						margin : '2 0 0 0',
						listeners : {
							handleSaveAndSearchGridAction : function() {
								me.SearchOrSave=true;
								me.handleSaveAndSearchGridAction();
							},
							closeFilterPopup : function() {
								me.closeFilterPopup();
							},
							handleSearchAction : function() {
								me.SearchOrSave=false;
								me.handleSearchGridAction();
							}
						}
					}
				});
		
		this.items = [{
			xtype : 'panel',
			layout : 'hbox',
			items : [{
				xtype : 'panel',
				cls : 'xn-filter-toolbar',
				flex : 0.5,
				layout : {
					type : 'vbox'
				},
				items : [{
							xtype : 'label',
							text : getLabel('paymentType', 'Payment Type'),
							cls : 'f13',
							flex : 1,
							padding : '6 0 0 8'
						}, {
							xtype : 'toolbar',
							padding : '6 0 0 8',
							cls : 'xn-toolbar-small',
							itemId : 'paymentTypeToolBar',
							filterParamName : 'InstrumentType',
							width : '100%',
							parent : this,
							border : false,
							componentCls : 'xn-btn-default-toolbar-small xn-custom-more-toolbar',
							items : [{
										text : getLabel('all', 'All'),
										code : 'all',
										btnDesc:'All',
										btnId : 'allPaymentType',
										parent : this,
										cls : 'f13 xn-custom-heighlight',
										handler : function(btn, opts) {
											this.parent.handlePaymentType(btn);
										}
									}],
							listeners : {
								render : function(toolbar, opts) {
									//this.parent.handlePaymentTypeLoading(toolbar);
								}
							}
						}]
			}, {
				xtype : 'panel',
				cls : 'xn-filter-toolbar',
				flex : 0.6,
				layout : {
					type : 'vbox'
				},
				items : [{
							xtype : 'label',
							text : getLabel('status', 'Status'),
							cls : 'f13',
							flex : 1,
							padding : '6 0 0 5'
						}, {
							xtype : 'toolbar',
							itemId : 'paymentActionToolBar',
							padding : '6 0 0 5',
							parent : this,
							cls : 'xn-toolbar-small',
							filterParamName : 'RequestState',
							width : '100%',
							border : false,
							componentCls : 'xn-btn-default-toolbar-small xn-custom-more-toolbar',
							items : [{
										text : getLabel('all', 'All'),
										code : 'all',
										btnId : 'allPaymentAction',
										cls : 'f13 xn-custom-heighlight',
										parent : this,
										handler : function(btn, opts) {
											this.parent.handleProductAction(btn);
										}
									}],
							listeners : {
								render : function(toolbar, opts) {
									//this.parent.handleProductActionsLoading();
								}
							}
						}]

			}, {
				xtype : 'panel',
				itemId : 'advFilterPanel',
				cls : 'xn-filter-toolbar',
				flex : 0.7,
				layout : {
					type : 'vbox'
				},
				items : [{
					xtype : 'panel',
					layout : {
						type : 'hbox'
					},
					items : [{
								xtype : 'label',
								text : getLabel('advFilters',
										'Advanced Filters'),
								cls : 'f13',
								padding : '6 0 0 6'
							}, {
								xtype : 'image',
								src : 'static/images/icons/icon_spacer.gif',
								height : 18,
								padding : '5 0 0 9'

							}, {
								xtype : 'button',
								itemId : 'newFilter',
								text : '<span class="linkblue">Create New Filter</span>',
								cls : 'xn-account-filter-btnmenu xn-small-button',
								width : 100,
								parent : this,
								margin : '7 0 0 0',
								handler : function(btn, opts) {
									this.parent.openAdvanceFilterPopup(btn);
								}
							}]
				}, {
					xtype : 'toolbar',
					itemId : 'advFilterActionToolBar',
					padding : '5 0 0 1',
					width : '100%',
					cls : 'xn-toolbar-small',
					enableOverflow : true,
					border : false,
					items : []
					}]
			}]
		}

		];
		var advanceFilterPopupRef = this.objAdvFilterPopup;
		var advFilterTabPanelRef = advanceFilterPopupRef.down('tabpanel[itemId="advancedFilterTab"]');
		advFilterTabPanelRef.setActiveTab(0);
		var firstTab = advFilterTabPanelRef.getActiveTab();
		var gridView = firstTab.down('pmtSummaryAdvFilterGridView');
		
		advFilterTabPanelRef.setActiveTab(1);
		var secondTab = advFilterTabPanelRef.getActiveTab();
		var advFilterPanel=secondTab.down('pmtTxnCreateNewAdvFilter');
		advFilterPanel.addBankProductsMenuItems();
		advFilterPanel.addSendingAccountsMenuItems();
		advFilterPanel.addColumnsToSortCombos(advFilterPanel);

		gridView.on('deleteTxnFilterEvent', function(grid, rowIndex) {
					me.deleteFilterSet(grid, rowIndex);
				});

		gridView.on('orderUpTxnEvent', function(grid, rowIndex, direction) {
					me.orderUpDown(grid, rowIndex, direction);
				});

		gridView.on('viewTxnFilterEvent', function(grid, rowIndex) {
					 me.viewFilterData(grid, rowIndex);
				});
		
		
		gridView.on('editTxnFilterEvent', function(grid, rowIndex) {
			 me.editFilterData(grid, rowIndex);
		});

		this.callParent(arguments);
	},
	tools : [{
				xtype : 'button',
				itemId : 'btnSavePreferences',
				icon : 'static/images/icons/save.gif',
				disabled : true,
				text : getLabel('saveFilter', 'Save Preferences'),
				cls : 'xn-account-filter-btnmenu',
				textAlign : 'right',
				width : 110,
				hidden : true
			}],

			editFilterData : function(grid, rowIndex) {
				var me = this;
				var advanceFilterPopupRef = me.objAdvFilterPopup;
				var advFilterPanelRef = advanceFilterPopupRef.down('pmtTxnCreateNewAdvFilter');
				var advFilterTabPanelRef = advanceFilterPopupRef.down('tabpanel[itemId="advancedFilterTab"]');
				advFilterTabPanelRef.setActiveTab(1);	
				advFilterTabPanelRef.getActiveTab().setTitle(getLabel('filterDetails','Filter Details'));
				
				var saveAndSearchButton=advFilterPanelRef.down('button[itemId="saveAndSearchBtn"]');
				if(!Ext.isEmpty(saveAndSearchButton))
					saveAndSearchButton.show();
				
				advFilterPanelRef.resetAllFields(advFilterPanelRef);
				advFilterPanelRef.enableDisableFields(advFilterPanelRef,false);
				advFilterPanelRef.removeReadOnly(advFilterPanelRef, false);
				

				var record = grid.getStore().getAt(rowIndex);
				var filterCode = record.data.filterName;

				advFilterPanelRef.down('textfield[itemId="saveFilterAs"]').setValue(filterCode);
				advFilterPanelRef.down('textfield[itemId="saveFilterAs"]').setDisabled(true);
				
				var applyAdvFilter = false;
				me.filterCodeValue = filterCode;
				me.getSavedFilterData(filterCode, this.populateSavedFilter,applyAdvFilter);

			},
	viewFilterData : function(grid, rowIndex) {
		var me = this;
		var advanceFilterPopupRef = me.objAdvFilterPopup;
		var advFilterPanelRef = advanceFilterPopupRef.down('pmtTxnCreateNewAdvFilter');
		var advFilterTabPanelRef = advanceFilterPopupRef.down('tabpanel[itemId="advancedFilterTab"]');
		var saveAndSearchButton=advFilterPanelRef.down('button[itemId="saveAndSearchBtn"]');
				if(!Ext.isEmpty(saveAndSearchButton))
					saveAndSearchButton.hide();
				
	
		advFilterTabPanelRef.setActiveTab(1);	
		advFilterTabPanelRef.getActiveTab().setTitle(getLabel('filterDetails','Filter Details'));
		
		advFilterPanelRef.resetAllFields(advFilterPanelRef);
		advFilterPanelRef.enableDisableFields(advFilterPanelRef,false);
		
		var record = grid.getStore().getAt(rowIndex);
		var filterCode = record.data.filterName;
		var applyAdvFilter = false;
		
		me.getSavedFilterData(filterCode, this.populateAndDisableSavedFilter,applyAdvFilter);
		
		
	},
	populateAndDisableSavedFilter : function(filterCode,filterData,applyAdvFilter) {
		var me = this;
		var fieldName='';
		var fieldVal='';
		var fieldSecondVal='';
		var currentFilterData='';
		var fieldType='';
		var columnId='';
		var sortByOption='';
		var buttonText='';
		var advanceFilterPopupRef = me.objAdvFilterPopup;
		var advFilterPanelViewRef = advanceFilterPopupRef.down('pmtTxnCreateNewAdvFilter');
		
		for (i = 0; i < filterData.filterBy.length; i++) {
			 fieldName = filterData.filterBy[i].field;
			 fieldVal = filterData.filterBy[i].value1;
			 fieldSecondVal = filterData.filterBy[i].value2;
			 currentFilterData=filterData.filterBy[i];
			 fieldType='';
			
			if (fieldName === 'ClientReference'
					|| fieldName === 'ReceiverAccount'
					|| fieldName === 'ReceiverName' || fieldName === 'FileName'
					|| fieldName === 'saveFilterAs' || fieldName === 'typeOfTransaction'
					|| fieldName === 'MicrNo'
					|| fieldName === 'BankProduct'
					|| fieldName === 'ProductType' || fieldName === 'AccountNo') {
				 fieldType = 'textfield';
			} else if (fieldName === 'Client' 
					|| fieldName === 'TemplateName' || fieldName === 'Channel'
					|| fieldName === 'sendingAcctName'
					 || fieldName === 'Maker' || fieldName ==='InstrumentType') {
				 fieldType = 'AutoCompleter';
			} else if (fieldName === 'Amount') {
				 fieldType = 'numberfield';
			} else{
				 fieldType = 'label';
			}

			if (fieldName === 'CreateDate'  || fieldName === 'EntryDate'  || fieldName === 'ActivationDate'){
				advFilterPanelViewRef.setSavedFilterDates(advFilterPanelViewRef,fieldName,currentFilterData,true);
			}else if (fieldName === 'SortBy' || fieldName === 'FirstThenSortBy'	|| fieldName === 'SecondThenSortBy' || fieldName === 'ThirdThenSortBy') {
				 columnId=fieldVal;
				 sortByOption=fieldSecondVal;
				 buttonText=getLabel("ascending","Ascending");
				if(sortByOption!=='asc')
				buttonText=getLabel("descending", "Descending");
				advFilterPanelViewRef.setSortByComboFields(advFilterPanelViewRef, fieldName,columnId,buttonText,true);
			}else{
				
			if(fieldName==='BankProduct'){
				advFilterPanelViewRef.checkUnCheckMenuItems(advFilterPanelViewRef,fieldName,fieldVal,true);
			}else if(fieldName==='AccountNo'){
				advFilterPanelViewRef.checkUnCheckMenuItems(advFilterPanelViewRef,fieldName,fieldVal,true);
			}
			
			var fieldObj = advFilterPanelViewRef.down('' + fieldType
					+ '[itemId="' + fieldName + '"]');

			if (!Ext.isEmpty(fieldObj)) {
				if (fieldType == "label")
					fieldObj.setText(fieldVal);
				else
					fieldObj.setValue(fieldVal);
			}
			}
		}
		advFilterPanelViewRef.down('textfield[itemId="saveFilterAs"]').setValue(filterCode);
		advFilterPanelViewRef.removeReadOnly(advFilterPanelViewRef, true);
	},
	orderUpDown : function(grid, rowIndex, direction) {
		var record = grid.getStore().getAt(rowIndex);
		var store = grid.getStore();
		if (!record) {
			return;
		}
		var index = rowIndex;

		if (direction < 0) {
			index--;
			if (index < 0) {
				return;
			}
			var beforeRecord = store.getAt(index);
			store.remove(beforeRecord);
			store.remove(record);

			store.insert(index, record);
			store.insert(index + 1, beforeRecord);
		} else {
			if (index >= grid.getStore().getCount() - 1) {
				return;
			}
			var currentRecord = record;
			store.remove(currentRecord);
			var afterRecord = store.getAt(index);
			store.remove(afterRecord);
			store.insert(index, afterRecord);
			store.insert(index + 1, currentRecord);
		}

		this.sendUpdatedOrderedJsonToDb(store);
	},
	deleteFilterSet : function(grid, rowIndex) {
		var me = this;
		var record = grid.getStore().getAt(rowIndex);
		var objFilterName = record.data.filterName;
		grid.getStore().remove(record);

		if (this.advFilterCodeApplied == record.data.filterName) {
			this.advFilterData = [];
			me.filterApplied = 'A';
			me.applyAdvancedFilter();
		}

		var store = grid.getStore();
		me.sendUpdatedOrderedJsonToDb(store);
		me.deleteFilterCodeFromDb(objFilterName);
	},
	deleteFilterCodeFromDb : function(objFilterName)
	{
		var me = this;
		if(!Ext.isEmpty(objFilterName))
		{   
			var strUrl = 'services/userfilters/pmtTxnViewFilter/{0}/remove';
			strUrl = Ext.String.format(strUrl,objFilterName);
			Ext.Ajax.request({
				url : strUrl,
				success : function(response) {
					
				},
				failure : function(response) {
//					console.log('Bad : Something went wrong with your request');
				}
			});
		}
	},
	sendUpdatedOrderedJsonToDb : function(store) {
		var me = this;
		var preferenceArray = [];
		store.each(function(rec) {
					var singleFilterSet = rec.raw;
					preferenceArray.push(singleFilterSet);
				});
		var objJson = {};
		var FiterArray = [];
		for (i = 0; i < preferenceArray.length; i++) {
			FiterArray.push(preferenceArray[i].filterName);
		}
		objJson.filters = FiterArray;
		Ext.Ajax.request({
			url : 'services/userpreferences/paymentcenter/txnViewAdvanceFilter.json',
			method : 'POST',
			async : false,
			jsonData : objJson,
			success : function(response) {
				me.updateAdvActionToolbar();
			},
			failure : function() {
				// console.log("Error Occured - Addition Failed");

			}

		});
	},
	updateAdvActionToolbar : function() {
		var me = this;
		Ext.Ajax.request({
			url : 'services/userpreferences/paymentcenter/txnViewAdvanceFilter.json',
			method : 'GET',
			success : function(response) {
				var responseData = Ext.decode(response.responseText);
				var filters = JSON.parse(responseData.preference);
				me.addAllSavedFilterCodeToView(filters.filters);
			},
			failure : function() {
				// console.log("Error Occured - Addition Failed");

			}

		});
	},
	getAllSavedAdvFilterCode : function() {
		var me = this;
		Ext.Ajax.request({
					url : 'services/userfilterslist/pmtTxnViewFilter.json',
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var arrFilters = [];
						var filterData = responseData.d.filters;
						if (filterData) {
							arrFilters = filterData;
						}
						me.addAllSavedFilterCodeToView(arrFilters);

					},
					failure : function(response) {
						// console.log('Bad : Something went wrong with your
						// request');
					}
				});
	},
	addAllSavedFilterCodeToView : function(arrFilters) {
		var me = this;
		var objToolbar = me.down('toolbar[itemId="advFilterActionToolBar"]');

		if (objToolbar.items && objToolbar.items.length > 0)
			objToolbar.removeAll();

		if (arrFilters && arrFilters.length > 0) {
			var count = arrFilters.length;
			if (count > 2)
				count = 2;
			var toolBarItems = [];
			var item;
			for (var i = 0; i < count; i++) {
				item = Ext.create('Ext.Button', {
							cls : 'cursor_pointer xn-account-filter-btnmenu',
							text : Ext.util.Format.ellipsis(arrFilters[i], 11),
							itemId : arrFilters[i],
							tooltip : arrFilters[i],
							handler : function(btn, opts) {
								me.handleFilterItemClick(btn.itemId, btn);
							}
						});
				toolBarItems.push(item);
			}
			var imgItem = Ext.create('Ext.Img', {
						src : 'static/images/icons/icon_spacer.gif',
						height : 16,
						padding : '0 3 0 3'
					});
			item = Ext.create('Ext.Button', {
						cls : 'cursor_pointer xn-account-filter-btnmenu',
						text : getLabel('moreText', 'more')
								+ '<span class="extrapadding">' + '>>'
								+ '</span>',
						itemId : 'AdvMoreBtn',
						handler : function(btn, opts) {
							me.handleMoreAdvFilterSet(btn.itemId);
						}
					});
			toolBarItems.push(imgItem);
			toolBarItems.push(item);
			objToolbar.removeAll();
			objToolbar.add(toolBarItems);
		}
	},
	handleFilterItemClick : function(filterCode, btn) {
		var me = this;
		var objToolbar = me.down('toolbar[itemId="advFilterActionToolBar"]');
		objToolbar.items.each(function(item) {
					item.removeCls('xn-custom-heighlight');
				});
		btn.addCls('xn-custom-heighlight');
		if (!Ext.isEmpty(filterCode)) {
			var applyAdvFilter = true;
			this.getSavedFilterData(filterCode, this.populateSavedFilter,
					applyAdvFilter);
		}
		me.savePrefAdvFilterCode = filterCode;
		me.showAdvFilterCode = filterCode;
	},
	populateSavedFilter : function(filterCode, filterData, applyAdvFilter) {
		var me = this;
		var fieldName='';
		var fieldVal='';
		var fieldSecondVal='';
		var currentFilterData='';
		var fieldType='';
		var columnId='';
		var sortByOption='';
		var buttonText='';
		var advanceFilterPopupRef = me.objAdvFilterPopup;
		var objCreateNewFilterPanel = advanceFilterPopupRef.down('pmtTxnCreateNewAdvFilter');

		for (i = 0; i < filterData.filterBy.length; i++) {
			 fieldName = filterData.filterBy[i].field;
			 currentFilterData=filterData.filterBy[i];
			 fieldSecondVal = filterData.filterBy[i].value2;
			 fieldVal = filterData.filterBy[i].value1;

			 fieldType='';
			if (fieldName === 'ClientReference'
				|| fieldName === 'ReceiverAccount'
				|| fieldName === 'ReceiverName' || fieldName === 'FileName'
				|| fieldName === 'saveFilterAs' || fieldName === 'typeOfTransaction'
				|| fieldName === 'MicrNo'
				|| fieldName === 'BankProduct'
				|| fieldName === 'ProductType' || fieldName === 'AccountNo') {
			 fieldType = 'textfield';
		} else if (fieldName === 'Client' 
				|| fieldName === 'TemplateName' || fieldName === 'Channel'
				|| fieldName === 'sendingAcctName'
				 || fieldName === 'Maker' || fieldName ==='InstrumentType') {
			 fieldType = 'AutoCompleter';
		} else if (fieldName === 'Amount') {
			 fieldType = 'numberfield';
		} else{
			 fieldType = 'label';
		}

			if (fieldName === 'CreateDate'  || fieldName === 'EntryDate'  || fieldName === 'ActivationDate'){
				objCreateNewFilterPanel.setSavedFilterDates(objCreateNewFilterPanel,fieldName,currentFilterData,false);
			}else if (fieldName === 'SortBy' || fieldName === 'FirstThenSortBy'	|| fieldName === 'SecondThenSortBy' || fieldName === 'ThirdThenSortBy') {
				 columnId=fieldVal;
				 sortByOption=fieldSecondVal;
				 buttonText=getLabel("ascending","Ascending");
				if(sortByOption!=='asc')
				buttonText=getLabel("descending", "Descending");
				objCreateNewFilterPanel.setSortByComboFields(objCreateNewFilterPanel, fieldName,columnId,buttonText,false);
			}else{
			if(fieldName==='BankProduct'){
				objCreateNewFilterPanel.checkUnCheckMenuItems(objCreateNewFilterPanel,fieldName,fieldVal,false);
			}else if(fieldName==='AccountNo'){
				objCreateNewFilterPanel.checkUnCheckMenuItems(objCreateNewFilterPanel,fieldName,fieldVal,false);
			}
			
			var fieldObj = objCreateNewFilterPanel.down('' + fieldType
					+ '[itemId="' + fieldName + '"]');

			if (!Ext.isEmpty(fieldObj)) {
				if (fieldType == "label")
					fieldObj.setText(fieldVal);
				else
					fieldObj.setValue(fieldVal);
			}
			}
		}

		if (applyAdvFilter) {
			me.setDataForFilter();
			me.filterApplied = 'A';
			me.applyAdvancedFilter();
		}
	},
	getSavedFilterData : function(filterCode, fnCallback, applyAdvFilter) {
		var me = this;
		var objJson;
		var strUrl = 'services/userfilters/pmtTxnViewFilter/{0}.json';
		strUrl = Ext.String.format(strUrl, filterCode);
		Ext.Ajax.request({
					url : strUrl,
					method : 'GET',
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						fnCallback.call(me,filterCode,responseData,applyAdvFilter);
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
	},
	handleMoreAdvFilterSet : function(btnId) {
		var me = this;
		if (!Ext.isEmpty(me.objAdvFilterPopup)) {
			var advanceFilterPopupRef = me.objAdvFilterPopup;
			var advFilterPanelViewRef = advanceFilterPopupRef
					.down('pmtTxnCreateNewAdvFilter');
			advFilterPanelViewRef.getForm().reset();
			var advFilterTabPanelRef = advanceFilterPopupRef
					.down('tabpanel[itemId="advancedFilterTab"]');
			advFilterTabPanelRef.setActiveTab(1);
			advFilterTabPanelRef.getActiveTab().setTitle(getLabel(
					'filterDetails', 'Filter Details'));
			advFilterTabPanelRef.setActiveTab(0);
			advanceFilterPopupRef.show();
		} else {
			// console.log("Error - occured View Init failed to create Advance
			// Popup");
		}
	},
	handleSearchGridAction : function() {
		var me = this;
		me.doAdvSearchOnly();
	},
	closeFilterPopup : function() {
		var me = this;
		var advanceFilterPopupRef = me.objAdvFilterPopup;
		var advFilterPanelViewRef = advanceFilterPopupRef
				.down('pmtTxnCreateNewAdvFilter');
		advFilterPanelViewRef.getForm().reset();
		advanceFilterPopupRef.close();
	},
	handleSaveAndSearchGridAction : function() {
		var me = this;
		var advanceFilterPopupRef = me.objAdvFilterPopup;
		var advFilterPanelViewRef = advanceFilterPopupRef.down('pmtTxnCreateNewAdvFilter');

		if (me.filterCodeValue === null) {
			var saveFilterAsValue = advFilterPanelViewRef.down('textfield[itemId="saveFilterAs"]').value;
			if (Ext.isEmpty(saveFilterAsValue)) {
				Ext.MessageBox.alert('Input', 'Enter Filter Name');
				return;
			}
			var FilterCodeVal = saveFilterAsValue;
		} else {
			var FilterCodeVal = me.filterCodeValue;
		}

		var callBack = me.postDoSaveAndSearch;

		if (Ext.isEmpty(FilterCodeVal)) {
			var errorlabel = advFilterPanelViewRef.down('label[itemId="errorLabel"]');
			errorlabel.setText(getLabel('filternameMsg','Please Enter Filter Name'));
			errorlabel.show();
		} else {
			me.postSaveFilterRequest(FilterCodeVal, callBack);
		}
	},
	postDoSaveAndSearch : function() {
		var me = this;
		me.doAdvSearchOnly();
	},
	doAdvSearchOnly : function() {
		var me = this;
		var advanceFilterPopupRef = me.objAdvFilterPopup;
		var advFilterPanelViewRef = advanceFilterPopupRef.down('pmtTxnCreateNewAdvFilter');
		var paymentTypeRef=advFilterPanelViewRef.down('AutoCompleter[itemId="InstrumentType"]');
		me.filterApplied = 'A';
		me.setDataForFilter();
		
	
		if(!Ext.isEmpty(paymentTypeRef)){
			var paymentTypeDesc=paymentTypeRef.getValue();
			me.updatePaymentTypeOnFilter(paymentTypeDesc);
		}
		me.applyAdvancedFilter();
	},
	updatePaymentTypeOnFilter:function(desc){
		var me=this;
		var paymentTypeToolBarRef = me.down('toolbar[itemId="paymentTypeToolBar"]');
		if (!Ext.isEmpty(paymentTypeToolBarRef)) {
			var tbarItems = paymentTypeToolBarRef.items.items;
			if(tbarItems.length>=1){
			for(var index=1;index<3;index++){
				var currentItem=tbarItems[index];
				if(currentItem)
				if(currentItem.btnDesc===desc){
					me.handlePaymentType(currentItem);
				}
			}
			}
			}
	},
	applyAdvancedFilter : function() {
		var me = this;
		var strUrl = me.getFilterUrl();
		var appliedSortByJson=[];
		me.parent.wrapperfilterUrl = strUrl;
		
		if(!Ext.isEmpty(me.advSortByData))
			    appliedSortByJson=me.getSortByJsonForSmartGrid();
		
		me.ownerCt.fireEvent('applyFilter',strUrl,appliedSortByJson);
		me.handleAdvanceFilterCleanUp();
	},
	getSortByJsonForSmartGrid:function(){
		var me=this;
		var jsonArray = [];
		var sortDirection='';
		var fieldId='';
		var sortOrder='';
		var sortByData=me.advSortByData;
		if(!Ext.isEmpty(sortByData)){
			for (var index = 0; index < sortByData.length; index++) {
				fieldId=sortByData[index].value1;
				sortOrder=sortByData[index].value2;
				
				if(sortOrder!='asc')
				sortDirection='DESC';
				else
				sortDirection='ASC';
				
				jsonArray.push({
						property : fieldId,
						direction : sortDirection,
						root : 'data'
					});
			}
			
		}
		return jsonArray;
	},
	handleAdvanceFilterCleanUp : function() {
		var me = this;
		var advanceFilterPopupRef = me.objAdvFilterPopup;
		var advFilterPanelViewRef = advanceFilterPopupRef.down('pmtTxnCreateNewAdvFilter');
		var searchOrSaveFlag = me.SearchOrSave;
		if (!Ext.isEmpty(searchOrSaveFlag)) {
			if (searchOrSaveFlag) {
				if (!Ext.isEmpty(advFilterPanelViewRef)) {
				advFilterPanelViewRef.resetAllFields(advFilterPanelViewRef);
			advFilterPanelViewRef.enableDisableFields(advFilterPanelViewRef,false);
			advFilterPanelViewRef.removeReadOnly(advFilterPanelViewRef,false);
				}

			}
		}
		
		if (!Ext.isEmpty(advanceFilterPopupRef))
			advanceFilterPopupRef.close();

	},
	postSaveFilterRequest : function(FilterCodeVal, fncallBack) {
		var me = this;
		var strUrl = 'services/userfilters/pmtTxnViewFilter/{0}.json';
		strUrl = Ext.String.format(strUrl, FilterCodeVal);
		var objJson;

		var advanceFilterPopupRef = me.objAdvFilterPopup;
		var advFilterPanelViewRef = advanceFilterPopupRef.down('pmtTxnCreateNewAdvFilter');
		objJson = advFilterPanelViewRef.getAdvancedFilterValueJson(FilterCodeVal, advFilterPanelViewRef);
		Ext.Ajax.request({
					url : strUrl,
					method : 'POST',
					jsonData : Ext.encode(objJson),
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var isSuccess;
						var title, strMsg, imgIcon;
						if (responseData.d.filters && responseData.d.filters.success)
							isSuccess = responseData.d.filters.success;

						if (isSuccess && isSuccess === 'N') {
							title = getLabel('instrumentSaveFilterPopupTitle','Message');
							strMsg = responseData.d.error.errorMessage;
							imgIcon = Ext.MessageBox.ERROR;
							Ext.MessageBox.show({
										title : title,
										msg : strMsg,
										width : 200,
										buttons : Ext.MessageBox.OK,
										icon : imgIcon
									});

						}

						if (FilterCodeVal && isSuccess && isSuccess === 'Y') {
							fncallBack.call(me);
							me.reloadGridRawData();
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

	},
	handleProductActionsAndPaymentTypeLoading : function() {
		var me = this;
		if(me.down('toolbar[itemId="paymentActionToolBar"]'))
		   var objActionToolBar = me.down('toolbar[itemId="paymentActionToolBar"]');
		
		if(me.down('toolbar[itemId="paymentTypeToolBar"]'))
			var objPaymentTypeToolBar = me.down('toolbar[itemId="paymentTypeToolBar"]');
		
		if (typeof strParentId != 'undefined' && !Ext.isEmpty(strParentId)) {
		var strUrl = 'services/paymentheaderinfo.json';
		Ext.Ajax.request({
						//url : 'services/actionStatus.json?$filter=PHDNumber eq \''
						//		+ strIdentifier + '\'',
						url : strUrl,
						method : "POST",
						data : {
							'$id' : strIde,
							'csrfTokenName' : tokenValue
						},
						success : function(response) {
							var objResponseData = Ext.decode(response.responseText);
							if(!Ext.isEmpty(objResponseData))
							{
								me.loadProductActions(objResponseData,objActionToolBar);
								me.loadPaymentTypes(objResponseData,objPaymentTypeToolBar);
								me.setInfoTooltip();
							}
						},
						failure : function(response) {
							// console.log('Error Occured');
						}
					});
		}
	},
	loadProductActions : function(data, toolbar) {
		var me = this;
		var objTbar = toolbar;
		var arrItem = new Array();
		if (!Ext.isEmpty(objTbar)) {
			var tbarItems = objTbar.items;

			if (!Ext.isEmpty(tbarItems)) {
				if (tbarItems.length > 0)
					tbarItems.each(function(item, index, length) {
								if (index > 0)
									objTbar.remove(item);
							});
			}
			if (data.d.paymentHeaderInfo) {
				var prodAction = data.d.paymentHeaderInfo;
					var strCls = '';
					if (me.paymentActionFilterVal !== 'all'
							&& me.paymentActionFilterVal === prodAction[i].instTypeCode) {
						if (objTbar.down('button[btnId="allPaymentAction"]'))
							objTbar.down('button[btnId="allPaymentAction"]')
									.removeCls('xn-custom-heighlight')
						strCls = 'xn-custom-heighlight';
					} else {
						if (objTbar.down('button[btnId="allPaymentAction"]'))
							objTbar.down('button[btnId="allPaymentAction"]')
									.addCls('xn-account-filter-btnmenu')
						strCls = 'xn-account-filter-btnmenu';
					}

					objTbar.add({
								text : getLabel('repair', 'Repair')+ "<span class='count-color'>("
										+ prodAction.hdrRepairInst
										+ ")</span>",
								btnId : getLabel('repair', 'Repair'),
								code : 9,
								btnDesc : getLabel('repair', 'Repair'),
								tooltip : getLabel('repair', 'Repair'),
								cls : strCls,
								handler : function(btn, opts) {
									me.handleProductAction(btn);
								}
							},{
								text : getLabel('draft', 'Draft')+ "<span class='count-color'>("
										+ prodAction.hdrDraftInst
										+ ")</span>",
								btnId : getLabel('draft', 'Draft'),
								code : 0,
								btnDesc : getLabel('draft', 'Draft'),
								tooltip : getLabel('draft', 'Draft'),
								cls : strCls,
								handler : function(btn, opts) {
									me.handleProductAction(btn);
								}
							});
					
					arrItem.push({
									text : getLabel('pendingverify', 'Pending Verify')+ "<span class='count-color'>("
										+ prodAction.hdrPendingVerify
										+ ")</span>",
									btnId : getLabel('pendingverify', 'Pending Verify'),
									code : 30,
									btnDesc : getLabel('pendingverify', 'Pending Verify'),
									handler : function(btn, opts) {
										me.handleProductAction(btn);
									}
								},{
									text : getLabel('pendingauth', 'Pending Auth')+ "<span class='count-color'>("
										+ prodAction.hdrPendingAuth
										+ ")</span>",
									btnId : getLabel('pendingauth', 'Pending Auth'),
									code : 3,
									btnDesc : getLabel('pendingauth', 'Pending Auth'),
									handler : function(btn, opts) {
										me.handleProductAction(btn);
									}
								},{
									text : getLabel('pendinghold', 'Pending Hold')+ "<span class='count-color'>("
										+ prodAction.hdrOnHold
										+ ")</span>",
									btnId : getLabel('pendinghold', 'Pending Hold'),
									code : 6,
									btnDesc : getLabel('pendinghold', 'Pending Hold'),
									handler : function(btn, opts) {
										me.handleProductAction(btn);
									}
								},{
									text : getLabel('pendingsend', 'Pending Send')+ "<span class='count-color'>("
										+ prodAction.hdrPendingSend
										+ ")</span>",
									btnId : getLabel('pendingsend', 'Pending Send'),
									code : 10,
									btnDesc : getLabel('pendingsend', 'Pending Send'),
									handler : function(btn, opts) {
										me.handleProductAction(btn);
									}
								},{
									text : getLabel('pendingmyauth', 'Pending My Auth')+ "<span class='count-color'>("
										+ prodAction.hdrPendingMyAuth
										+ ")</span>",
									btnId : getLabel('pendingmyauth', 'Pending My Auth'),
									code : 2,
									btnDesc : getLabel('pendingmyauth', 'Pending My Auth'),
									handler : function(btn, opts) {
										me.handleProductAction(btn);
									}
								},{
									text : getLabel('pendingrelease', 'Pending Release')+ "<span class='count-color'>("
										+ prodAction.hdrPendingRelease
										+ ")</span>",
									btnId : getLabel('pendingrelease', 'Pending Release'),
									code : 4,
									btnDesc : getLabel('pendingrelease', 'Pending Release'),
									handler : function(btn, opts) {
										me.handleProductAction(btn);
									}
								},{
									text : getLabel('sendtobank', 'Send To Bank')+ "<span class='count-color'>("
										+ prodAction.hdrSentToBank
										+ ")</span>",
									btnId : getLabel('sendtobank', 'Send To Bank'),
									code : 7,
									btnDesc : getLabel('sendtobank', 'Send To Bank'),
									handler : function(btn, opts) {
										me.handleProductAction(btn);
									}
								},{
									text : getLabel('rejectedinst', 'Rejected Inst')+ "<span class='count-color'>("
										+ prodAction.hdrRejectedInst
										+ ")</span>",
									btnId : getLabel('rejectedinst', 'Rejected Inst'),
									code : 5,
									btnDesc : getLabel('rejectedinst', 'Rejected Inst'),
									handler : function(btn, opts) {
										me.handleProductAction(btn);
									}
								});
					var imgItem = Ext.create('Ext.Img', {
								src : 'static/images/icons/icon_spacer.gif',
								height : 16,
								padding : '0 3 0 3'
							});
					var item = Ext.create('Ext.Button', {
								baseCls : 'more-btn-arrow',
								cls : 'cursor_pointer',
								padding : '0 0 3 0',
								text : getLabel('moreText', 'more')
										+ '<span class="extrapadding">' + '>>'
										+ '</span>',
								menu : Ext.create('Ext.menu.Menu', {
											items : arrItem
										})
							});
					objTbar.insert(4, imgItem);
					objTbar.insert(5, item);
			}
		}
	},
	openAdvanceFilterPopup : function(btn) {
		var me = this;
		var advanceFilterPopupRef = me.objAdvFilterPopup;
		if (!Ext.isEmpty(advanceFilterPopupRef)) {
			var productType = advanceFilterPopupRef.down('textfield[itemId="ProductType"]');

			var advFilterPanelViewRef = advanceFilterPopupRef.down('pmtTxnCreateNewAdvFilter');
			var advFilterTabPanelRef = advanceFilterPopupRef.down('tabpanel[itemId="advancedFilterTab"]');
			advFilterTabPanelRef.setActiveTab(1);
			advFilterTabPanelRef.getActiveTab().setTitle(getLabel('createNewFilter', 'Create New Filter'));
			me.getPreloadsOnAdvanceFilter(advFilterPanelViewRef);
			
			var saveAndSearchButton=advFilterPanelViewRef.down('button[itemId="saveAndSearchBtn"]');
			if(!Ext.isEmpty(saveAndSearchButton))
				saveAndSearchButton.show();
			
			if (!Ext.isEmpty(productType)) {
				productType.setValue(strMyProduct);
			}
			advanceFilterPopupRef.show();
		}
	},getPreloadsOnAdvanceFilter:function(advFilterPanel){
						var me=this;
						var paymentTypeDesc = me.paymentTypeFilterDesc;
						advFilterPanel.setPreloadsOnAdvanceFilter(advFilterPanel,paymentTypeDesc);
		},
	handleProductAction : function(btn) {
		var me = this;
		var productActionToolBarRef = me.down('toolbar[itemId="paymentActionToolBar"]');
		if (productActionToolBarRef)
			var productActionToolBarRef = productActionToolBarRef;

		productActionToolBarRef.items.each(function(item) {
					item.removeCls(' xn-custom-heighlight');
					item.addCls('xn-account-filter-btnmenu');
				});
		btn.addCls('xn-custom-heighlight');
		me.paymentActionFilterVal = btn.code;
		me.setDataForFilter();
		if (me.paymentTypeFilterVal === 'all') {
			me.filterApplied = 'ALL';
			var strUrl = me.getFilterUrl();
			this.parent.wrapperfilterUrl = strUrl;
			me.ownerCt.fireEvent('applyFilter', strUrl);
		} else {
			me.applyQuickFilter();
		}
	},
	setInfoTooltip : function() {
		var me = this;
		var infotip = Ext.create('Ext.tip.ToolTip', {
					target : 'imgTxnFilterInfo',
					listeners : {
						beforeshow : function(tip) {
							var paymentTypeVal = '';
							var paymentActionVal = '';

							if (me.paymentTypeFilterVal == 'all'
									&& me.filterApplied == 'ALL') {
								paymentTypeVal = 'All';
								me.showAdvFilterCode = null;
							} else {
								paymentTypeVal = me.paymentTypeFilterVal;
							}

							if (me.paymentActionFilterVal == 'all') {
								paymentActionVal = 'All';
							} else {
								paymentActionVal = me.paymentActionFilterVal;
							}
							var advfilter = me.showAdvFilterCode;
							if (advfilter == '' || advfilter == null) {
								advfilter = getLabel('none', 'None');
							}

							tip.update(getLabel('paymentType', 'Payment Type')
									+ ' : '
									+ paymentTypeVal
									+ '<br/>'
									+ getLabel('actions', 'Actions')
									+ ' : '
									+ paymentActionVal
									+ '<br/>'
									+ getLabel('advancedFilter',
											'Advanced Filter') + ':'
									+ advfilter);
						}
					}
				});
	},
	loadPaymentTypes : function(data, toolbar) {
		
		var me = this;
		var objTbar = toolbar;
		var arrItem;
		if (!Ext.isEmpty(objTbar)) {
			var tbarItems = objTbar.items;

			if (!Ext.isEmpty(tbarItems)) {
				if (tbarItems.length > 0)
					tbarItems.each(function(item, index, length) {
								if (index > 0)
									objTbar.remove(item);
							});
			}
		if (data.d.paymentHeaderInfo.instrumentType) {
			var prodType = data.d.paymentHeaderInfo.instrumentType;
			
			var countlength = '';
			if (prodType.length > 2)
				countlength = 2;
			else
				countlength = prodType.length;

			for (var i = 0; i < countlength; i++) {
				//var cnt = prodType[i].instTypeCount;

				var strCls = '';
				
				if (me.paymentTypeFilterVal !== 'all'
						&& me.paymentTypeFilterVal === prodType[i].instTypeCode) {
					if (objTbar.down('button[btnId="allPaymentType"]'))
						objTbar.down('button[btnId="allPaymentType"]')
								.removeCls('xn-custom-heighlight')
					strCls = 'xn-custom-heighlight';
				} else {
					if (objTbar.down('button[btnId="allPaymentType"]'))
						objTbar.down('button[btnId="allPaymentType"]')
								.addCls('xn-account-filter-btnmenu')
					strCls = ' xn-account-filter-btnmenu';
				}

				objTbar.add({
							text : Ext.util.Format.ellipsis(
									prodType[i].instTypeDescription, 6),
							btnId : prodType[i].instTypeDescription,
							code : prodType[i].instTypeCode,
							btnDesc : prodType[i].instTypeDescription,
							tooltip : prodType[i].instTypeDescription,
							cls : strCls,
							handler : function(btn, opts) {
								me.handlePaymentType(btn);
							}
						});
			}
			if (prodType.length > 2) {
				arrItem = new Array();
				for (var i = 2; i < prodType.length; i++) {
					//var cnt = prodType[i].instTypeCount;

					arrItem.push({
								text : prodType[i].instTypeDescription,
								btnId : prodType[i].instTypeDescription,
								code : prodType[i].instTypeCode,
								btnDesc : prodType[i].instTypeDescription,
								handler : function(btn, opts) {
									me.handlePaymentType(btn);
								}
							});
				}
				var imgItem = Ext.create('Ext.Img', {
							src : 'static/images/icons/icon_spacer.gif',
							height : 16,
							padding : '0 3 0 3'
						});
				var item = Ext.create('Ext.Button', {
							baseCls : 'more-btn-arrow',
							cls : 'cursor_pointer',
							padding : '0 0 3 0',
							text : getLabel('moreText', 'more')
									+ '<span class="extrapadding">' + '>>'
									+ '</span>',
							menu : Ext.create('Ext.menu.Menu', {
										items : arrItem
									})
						});
				objTbar.insert(4, imgItem);
				objTbar.insert(5, item);
			}
		 }
		}
	},
	handlePaymentType : function(btn) {
		var me = this;
		var paymentTypeToolBarRef = me.down('toolbar[itemId="paymentTypeToolBar"]');
		if (paymentTypeToolBarRef)
			var productTypeToolBar = paymentTypeToolBarRef;

		productTypeToolBar.items.each(function(item) {
					item.removeCls('xn-custom-heighlight');
					item.addCls('xn-account-filter-btnmenu');
				});
		btn.addCls('xn-custom-heighlight');
		me.paymentTypeFilterDesc = btn.btnDesc;
		me.paymentTypeFilterVal = btn.code;
		
		me.setDataForFilter();
		if (me.paymentTypeFilterVal === 'all') {
			me.filterApplied = 'ALL';
			var strUrl = me.getFilterUrl();
			me.parent.wrapperfilterUrl = strUrl;
			me.ownerCt.fireEvent('applyFilter', strUrl);
		} else {
			me.applyQuickFilter();
		}
	},
	applyQuickFilter : function() {
		var me = this;
		me.filterApplied = 'Q';
		var strUrl = me.getFilterUrl();
		this.parent.wrapperfilterUrl = strUrl;
		me.ownerCt.fireEvent('applyFilter', strUrl);
	},
	getFilterUrl : function() {
		var me = this;
		var strQuickFilterUrl = '', strAdvFilterUrl = '', strUrl = '',strAdvanceSortByFilterUrl='', isFilterApplied = false;
		if (me.filterApplied === 'ALL') {
			strQuickFilterUrl = me.generateUrlWithQuickFilterParams(this);
			if (!Ext.isEmpty(strQuickFilterUrl)) {
				strUrl += strQuickFilterUrl;
				isFilterApplied = true;
			}

			return strUrl;
		} else {
			strQuickFilterUrl = me.generateUrlWithQuickFilterParams(this);
			if (!Ext.isEmpty(strQuickFilterUrl)) {
				strUrl += strQuickFilterUrl;
				isFilterApplied = true;
			}
			strAdvFilterUrl = me.generateUrlWithAdvancedFilterParams(me);
			if (!Ext.isEmpty(strAdvFilterUrl)) {
				if (isFilterApplied)
					strUrl += ' and ' + strAdvFilterUrl;
				else
					strUrl += strAdvFilterUrl;
			}
			
				strAdvanceSortByFilterUrl = me.generateUrlWithAdvanceSortByOptions(me);
			
			if (!Ext.isEmpty(strAdvanceSortByFilterUrl)) {
				strUrl += '&$orderBy=' + strAdvanceSortByFilterUrl;
				isFilterApplied = true;
			}
			
			return strUrl;
		}
	},
	generateUrlWithAdvanceSortByOptions:function(me){
		var me=this;
		var sortByData = me.advSortByData;
		var isOrderByApplied = false;
		var strTemp = '';
		var strFilter='';
		var columnMappingArray=arrSortColumn;
		
		if (!Ext.isEmpty(sortByData) && sortByData.length>0) {
			for (var index = 0; index < sortByData.length; index++) {
				operator = sortByData[index].operator;
				switch (operator) {
					case 'st' :
						if (!isOrderByApplied) {
							strTemp = strTemp + '';
							isOrderByApplied = true;
						} else {
							strTemp = strTemp + ',';
						}
						var fieldName=columnMappingArray[sortByData[index].value1];
						strTemp = strTemp + fieldName + ' '+sortByData[index].value2;
						break;
				}
			}
			
			if (isOrderByApplied)
				strFilter = strTemp;
			else
				strFilter = '';
				
		}
			return strFilter;
	},
	generateUrlWithAdvancedFilterParams : function(me) {
		var me=this;
		var filterData = me.advFilterData;
		var isFilterApplied = false;
		var isOrderByApplied = false;
		var strFilter = '';
		var strTemp = '';
		var strFilterParam = '';
		var operator = '';
		var isInCondition = false;
		var advanceFilterPopupRef = me.objAdvFilterPopup;
		var advFilterPanelViewRef = advanceFilterPopupRef.down('pmtTxnCreateNewAdvFilter');
		
		if (!Ext.isEmpty(filterData)) {
			for (var index = 0; index < filterData.length; index++) {
				isInCondition = false;
				operator = filterData[index].operator;
				if (isFilterApplied	&& (operator === 'bt' || operator === 'eq' || operator === 'lk' || operator === 'gt' || operator === 'lt'))
					strTemp = strTemp + ' and ';
				switch (operator) {
					case 'bt' :
						isFilterApplied = true;
						if (filterData[index].dataType === 1) {
							strTemp = strTemp + filterData[index].field + ' '
									+ filterData[index].operator + ' '
									+ 'date\'' + filterData[index].value1
									+ '\'' + ' and ' + 'date\''
									+ filterData[index].value2 + '\'';
						} else {
							strTemp = strTemp + filterData[index].field + ' '
									+ filterData[index].operator + ' ' + '\''
									+ filterData[index].value1 + '\'' + ' and '
									+ '\'' + filterData[index].value2 + '\'';
						}
						break;
					case 'st' :
						if (!isOrderByApplied) {
							strTemp = strTemp + ' &$orderby=';
							isOrderByApplied = true;
						} else {
							strTemp = strTemp + ',';
						}
						strTemp = strTemp + filterData[index].value1 + ' '
								+ filterData[index].value2;
						break;
					case 'lk' :
						isFilterApplied = true;
						strTemp = strTemp + filterData[index].field + ' '
								+ filterData[index].operator + ' ' + '\''
								+ filterData[index].value1 + '\'';
						break;
					case 'eq' :
						isInCondition = this.isInCondition(filterData[index]);
						if (isInCondition) {
							var reg = new RegExp(/[\(\)]/g);
							var objValue = filterData[index].value1;
							objValue = objValue.replace(reg, '');
							var objArray = objValue.split(',');
							isFilterApplied = true;
							for (var i = 0; i < objArray.length; i++) {
								strTemp = strTemp + filterData[index].field
										+ ' ' + filterData[index].operator
										+ ' ' + '\'' + objArray[i] + '\'';
								if (i != objArray.length - 1)
									strTemp = strTemp + ' or '
							}
							break;
						}
					case 'gt' :
					case 'lt' :
						isFilterApplied = true;
						if (filterData[index].dataType === 1) {
							strTemp = strTemp + filterData[index].field + ' '
									+ filterData[index].operator + ' '
									+ 'date\'' + filterData[index].value1
									+ '\'';
						} else {
							strTemp = strTemp + filterData[index].field + ' '
									+ filterData[index].operator + ' ' + '\''
									+ filterData[index].value1 + '\'';
						}
						break;
					case 'in' :
						var reg = new RegExp(/[\(\)]/g);
						var objValue = filterData[index].value1;
						objValue = objValue.replace(reg, '');
						var objArray = objValue.split(',');
						
						if(objArray.length>0){
							if (objArray[0] != 'All') {
								if(isFilterApplied){
									strTemp = strTemp + ' and ';
									}else{
										isFilterApplied = true;
									}
								
								strTemp = strTemp + '(';
								for (var i = 0; i < objArray.length; i++) {
									strTemp=strTemp+filterData[index].field +' eq ';
									strTemp = strTemp+'\'' + objArray[i] + '\'';
									if (i != objArray.length - 1)
										strTemp = strTemp + ' or ';
								}
								
								strTemp= strTemp+')';
							}
						}
						break;
				}
			}
		}

		if (isFilterApplied) {
			strFilter = strFilter + strTemp;
		} else if (isOrderByApplied) {
			strFilter = strTemp;
		} else {
			strFilter = '';
		}
		return strFilter;
	},
	isInCondition : function(data) {
		var retValue = false;
		var displayType = data.displayType;
		var strValue = data.value1;
		var reg = new RegExp(/^\((\d\d*,)*\d\d*\)$/);
		if (displayType && displayType === 4 && strValue && strValue.match(reg)) {
			retValue = true;
		}
		return retValue;

	},
	generateUrlWithQuickFilterParams : function(thisClass) {
		var filterData = thisClass.filterData;
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
	setDataForFilter : function() {
		var me = this;
		if (me.filterApplied === 'Q') {
			me.filterData = me.getQuickFilterQueryJson();
		} else if (me.filterApplied === 'A') {
			this.filterData = me.getQuickFilterQueryJson();
			var advanceFilterPopupRef = me.objAdvFilterPopup;
			var advFilterPanelViewRef = advanceFilterPopupRef.down('pmtTxnCreateNewAdvFilter');
			var objJson = advFilterPanelViewRef.getAdvancedFilterQueryJson(advFilterPanelViewRef);
			me.advFilterData = objJson;
			
			var sortByData = advFilterPanelViewRef.getAdvancedFilterSortByJson(advFilterPanelViewRef);
			if(!Ext.isEmpty(sortByData) && sortByData.length>0){
			this.advSortByData=sortByData;
			}else{
			this.advSortByData=[];
			}
			
			var filterCode = advFilterPanelViewRef.down('textfield[itemId="saveFilterAs"]').value;
			me.advFilterCodeApplied = filterCode;
		}
		if (me.filterApplied === 'ALL') {
			me.filterData = me.getQuickFilterQueryJson();
		}
	},
	getQuickFilterQueryJson : function() {
		var me = this;
		var paymentActionFilterVal = me.paymentActionFilterVal;
		var paymentTypeFilterVal = me.paymentTypeFilterVal;
		var productActionToolBarRef = me
				.down('toolbar[itemId="paymentActionToolBar"]');
		var paymentTypeToolBarRef = me
				.down('toolbar[itemId="paymentTypeToolBar"]');
		var jsonArray = [];
		if (paymentActionFilterVal != null && paymentActionFilterVal != 'all') {
			jsonArray.push({
						paramName : productActionToolBarRef.filterParamName,
						paramValue1 : this.paymentActionFilterVal,
						operatorValue : 'eq',
						dataType : 'S'
					});
		}

		if (paymentTypeFilterVal != null && paymentTypeFilterVal != 'all') {
				jsonArray.push({
							paramName : paymentTypeToolBarRef.filterParamName,
							paramValue1 : paymentTypeFilterVal,
							operatorValue : 'eq',
							dataType : 'S'
						});
		}
		return jsonArray;

	},
	reloadGridRawData : function() {
		var me = this;
		var advanceFilterPopupRef = me.objAdvFilterPopup;
		var advFilterTabPanelRef = advanceFilterPopupRef.down('tabpanel[itemId="advancedFilterTab"]');
		advFilterTabPanelRef.setActiveTab(0);
		var firstTab = advFilterTabPanelRef.getActiveTab();
		var gridView = firstTab.down('pmtSummaryAdvFilterGridView');
		
		Ext.Ajax.request({
					url : 'services/userfilterslist/pmtTxnViewFilter.json',
					method : 'GET',
					success : function(response) {
						var decodedJson = Ext.decode(response.responseText);
						var arrJson = new Array();
						
						if(!Ext.isEmpty(decodedJson.d.filters))
						{
						for(i=0;i<decodedJson.d.filters.length;i++)
						{
							arrJson.push({"filterName":decodedJson.d.filters[i]});
						}
						}
						gridView.loadRawData(arrJson);
					},
					failure : function(response) {
						// console.log("Ajax Get data Call Failed");
					}

				});
	},
	refreshFilterRibbon : function(){
		var me = this;
		me.handleProductActionsAndPaymentTypeLoading();
	}
});