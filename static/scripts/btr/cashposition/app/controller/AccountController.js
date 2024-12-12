Ext.define('GCP.controller.AccountController', {
	extend : 'Ext.app.Controller',
	requires : ['GCP.view.account.AccountView', 'GCP.view.CashPositionCenter','Ext.ux.gcp.DateUtil',
			'Ext.ux.gcp.PreferencesHandler', 'Ext.ux.gcp.PageSettingPopUp'],
	refs : [{
				ref : 'cashPositionCenter',
				selector : 'cashPositionCenter'
			}, {
				ref : 'accountView',
				selector : 'accountView'
			},{
				ref : 'accountGenericFilterView',
				selector : 'filterView'
			},{
				ref : 'groupView',
				selector : 'accountView groupView'
			},{
				ref : 'accountfilterView',
				selector : 'accountFilterView'
			},{
				ref : 'accountCombo',
				selector : 'accountFilterView combobox[itemId="ActAccountCombo"]'
			},
			{
				ref : 'txnCombo',
				selector : 'accountFilterView combobox[itemId="ActTransactionCombo"]'
			}, {
				ref : 'activityGrid',
				selector : 'accountActivityView smartgrid[itemId="activityGrid"]'
			},{
				ref : 'pageSettingPopUp',
				selector : 'pageSettingPopUp[itemId="pageSettingPopUpAccount"]'
			}],
	config : {
	filterData:{},
	accountFilter:'ALL',
	accountFilterDesc : null,
	txnCategory:null,
	txnCategoryDesc : null,
	categoryDesc : null,
	navigatedTxnCategory:null,
	strPageName : 'cashPositionAccount',
	strReadSummaryInfoUrl : 'services/cashPositionsummary/summarytypecodes',
	preferenceHandler:null,
	objAccountGridPref : null,
	strServiceParam:null,
	objFilterPref:null,
	prfAcccountFilter:null,
	reportGridOrder:null,
	pageSettingPopup : null,
	objLocalData : null,
	firstLoad : false
	},
	init : function() {
		var me = this;
    	me.firstLoad = true;
    	me.upDateAccountConfig();
    	if(objSavedLocalAccntPref && isSaveLocalPreference){
				me.objLocalData = Ext.decode(objSavedLocalAccntPref);
				var filterType = me.objLocalData && me.objLocalData.d.preferences
									&& me.objLocalData.d.preferences.tempPref 
									&& me.objLocalData.d.preferences.tempPref.filterAppliedType ? me.objLocalData.d.preferences.tempPref.filterAppliedType : {};
				me.filterApplied = "Q";
				if(!Ext.isEmpty(me.objLocalData.d.preferences.tempPref) && !Ext.isEmpty(me.objLocalData.d.preferences.tempPref.quickFilterJson))
					me.filterData = me.objLocalData.d.preferences.tempPref.quickFilterJson;
			}
		GCP.getApplication().on({
			
			'showAccount' : function(record, strSummaryType, filterData,calledFromAccountSection) {
				if(typeof summaryFilterPanel !='undefined'){
					summaryFilterPanel.destroy();
				}
				isAccountViewOn = true;
				istransactionViewOn = false;
				calledFromAccount=calledFromAccountSection;
				$('#brsummraytitle').html(getLabel('accountSummaryTitle1', 'Account / Cash Position Summary / Account View'));
				me.filterPref();
				var container = me.getCashPositionCenter();
				var strSummarySubLbl = getLabel('cpSummary', 'Cash Position Summary');
				if (!Ext.isEmpty(container)) {
					var activityView = Ext.create(
							'GCP.view.account.AccountView', {
								gridModel : me.getGridModel(),
                                filterData:filterData
							});
					container.updateView(activityView);
					container.setActiveCard(1);
					objSummaryView=activityView;
				 var strSummaryLbl = getLabel('cpaccount', 'Account View');
				$("ul.ft-extra-nav").html('<li id="accActivityLink"><a href="#" id="cpsummary">' + strSummarySubLbl + '</a> > ' + strSummaryLbl+ '</li>');
				$(document).on('performBackAccountActivity', function(event) {
						me.doHandleBackAction(me,record, strSummaryType, filterData,calledFromAccountSection);
					});
				$('#cpsummarybackdiv').show();
			}			
	  },
	  'accountSavePreference' : function() {
				me.handleSavePreferences();
			},
		'accountClearPreference' : function() {
				me.handleClearPreferences();
		}
     });
	 $(document).on('performPageSettingsAccount', function(event) 
				{
						me.showPageSettingPopup('PAGE');
				});
	 $(document).on('handleClientChangeInQuickFilter',
				function(isSessionClientFilter) 
				{
					me.handleClientChangeInQuickFilter(isSessionClientFilter);
				});
		me.control({
			'ribbonView[itemId="summaryCarousal"]' : {
						expand : function(panel) {
							console.log('creating caousals');
							 me.handleSummaryInformationRender();				
							panel.doLayout();
						}	
					},
		    'accountView':{
			'render' : function(panel){
			/*  $('#summaryCarousal').empty();
			     me.handleSummaryInformationRender(panel);*/
					   var jsonArray = [];
				       me.filterData=panel.filterData;
			  	       me.txnCategory=me.filterData.txncatType;
			  	       me.categoryDesc=me.filterData.txnCategoryDesc;
			  	       me.txnCategory=me.filterData.txncatType;
			  			if (me.txnCategory != null && me.txnCategory != 'ALL' ) {
			  				jsonArray.push({
			  							paramName : 'categoryId',
			  							paramValue1 : encodeURIComponent(me.txnCategory.replace(new RegExp("'", 'g'), "\''")),
			  							operatorValue : 'eq',
			  							dataType : 'S',
			  							displayType : 5,
			  							paramFieldLable :getLabel('lblsavedTransaction','Transaction Category'),
			  							displayValue1 : me.categoryDesc
			  						});
			  			}
			  			me.filterData=jsonArray;
			           me.navigatedTxnCategory=me.filterData.txncatType;
			           if(me.accountFilter=="ALL"){
			          		 me.accountFilter= me.filterData.accountFilter; 
			           }
				}
			},
		    'accountView groupView' : {
			//	'render' : me.handleLoadGridData,
				'groupTabChange' : function(groupInfo, subGroupInfo,
							tabPanel, newCard, oldCard) {		
						me.doHandleGroupTabChange(groupInfo, subGroupInfo,
								tabPanel, newCard, oldCard);
					me.disablePreferencesButton("savePrefMenuBtn", false);
					me.disablePreferencesButton("clearPrefMenuBtn", false);	

					},
				'gridPageChange' : me.handleLoadGridData,
				'gridSortChange' : me.handleLoadGridData,
				'gridRender' : me.handleLoadGridData,
				'gridPageSizeChange': me.handleLoadGridData,
				'gridRowActionClick' : function(grid, rowIndex, columnIndex,
						actionName, record) {
					me.doHandleRowIconClick(grid, rowIndex, columnIndex,
							actionName, record);
				},
				'gridStateChange' : function(grid) {
					me.disablePreferencesButton("savePrefMenuBtn", false);
					me.disablePreferencesButton("clearPrefMenuBtn", false);	
					//me.toggleSavePrefrenceAction(true);
				},
				'render' : function() {
					me.applyPreferences();
				},
				'gridSettingClick' : function(){
					me.showPageSettingPopup('GRID');
				}
			},
			'accountFilterView':{
					beforerender:function(){
						accountFilterpanel=me.getAccountGenericFilterView();
					   var useSettingsButton = me.getAccountGenericFilterView()
							.down('button[itemId="useSettingsbutton"]');
							if (!Ext.isEmpty(useSettingsButton)) {
								useSettingsButton.hide();
							}
							var createAdvanceFilterLabel = me.getAccountGenericFilterView()
									.down('label[itemId="createAdvanceFilterLabel"]');
							if (!Ext.isEmpty(createAdvanceFilterLabel)) {
								createAdvanceFilterLabel.hide();
							}
					  }
					/* render:function(cmp){
					 	var accountCombo=me.getAccountCombo();
	   					var txnCombo=me.getTxnCombo();
					 	if(me.accountFilter=="ALL" || typeof me.accountFilter=='undefined'){	
		                 accountCombo.setValue("ALL");
					    }else{
					    	 accountCombo.setValue(me.accountFilter);
					    }
					 if( me.txnCategory!="ALL"){
					    txnCombo.setValue(me.txnCategory)
					 }
				}*/
			},
			'accountView groupView smartgrid' : 
			{
				'cellclick' : me.handleGridRowClick
			},
			'accountFilterView combobox[itemId="ActAccountCombo"]':{
			'select':function(combo, selectedRecords){
			     /*me.setDataForFilter();
				 me.applyFilter();
				 me.disablePreferencesButton("savePrefMenuBtn", false);
			     me.disablePreferencesButton("clearPrefMenuBtn", false);*/	
				combo.isAccAccountFieldChange = true;

			  },
				'blur' : function(combo, record) {
					if (combo.isAccAccountFieldChange)
						me.handleAccAccountClick(combo);
				},
				'boxready' : function(combo, width, height, eOpts) {
					if (!Ext.isEmpty(me.accountFilter) && 'all' != me.accountFilter){
						combo.setValue((decodeURIComponent(me.accountFilter)).split(',').map(Number));
						combo.selectedOptions = (decodeURIComponent(me.accountFilter)).split(',');
					}	
				}
			  
			},
			'accountFilterView combobox[itemId="ActTransactionCombo"]':{
				'select':function(combo, selectedRecords){
				    /* me.setDataForFilter();
					 me.applyFilter();
					 me.disablePreferencesButton("savePrefMenuBtn", false);
				     me.disablePreferencesButton("clearPrefMenuBtn", false);*/	
					combo.isAccTxnCategoryFieldChange = true;
				 },
					'blur' : function(combo, record) {
						if (combo.isAccTxnCategoryFieldChange)
							me.handleAccTxnCategoryClick(combo);
					},
					'boxready' : function(combo, width, height, eOpts ) {
						var values = me.txnCategory.split(',');
						combo.setValue(values);
					}
			  },
			 'filterView button[itemId="clearSettingsButton"]' : {
				'click' : function() {
					me.handleClearSettings();
				}
			},
			 'filterView' : 
			 {
				appliedFilterDelete : function(btn)
				{
					if(isAccountViewOn)
					{
						me.handleAppliedFilterDelete(btn);
					}
				}
			},
			'pageSettingPopUp[itemId="pageSettingPopUpAccount"]' : {
				'applyPageSetting' : function(popup, data,strInvokedFrom) {
					me.applyPageSetting(data,strInvokedFrom);
				},
				'savePageSetting' : function(popup, data,strInvokedFrom) {
					me.savePageSetting(data,strInvokedFrom);
				},
				'restorePageSetting' : function(popup,data,strInvokedFrom) {
					me.restorePageSetting(data,strInvokedFrom);
				}
			}
		});
	},	
	
	applyPreferences : function(){
		var me = this, objJsonData='', objLocalJsonData='';
		var fieldName = '';
		var fieldVal = '';
		var fieldSecondVal = '';
		var operatorValue = '';
		var valueArray = '';
			var objLocalJsonData='';
							if (!Ext.isEmpty(objSavedLocalAccntPref)) {
								objLocalJsonData = Ext.decode(objSavedLocalAccntPref);
								if (!Ext.isEmpty(objLocalJsonData.d.preferences)) {
									if (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) {
										if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.quickFilterJson)){
											var localPref = objLocalJsonData.d.preferences.tempPref.quickFilterJson;
											for (i = 0; i < localPref.length; i++) {
												fieldName = localPref[i].paramName;
												fieldVal = localPref[i].paramValue1;
												fieldSecondVal = localPref[i].paramValue2;
												operatorValue = localPref[i].operatorValue;
												displayValue = localPref[i].displayValue1;
												if (fieldName === 'accountId') {
													var jsonArray = me.filterData;
														jsonArray.push({
																paramName : 'accountId',
																paramValue1 : fieldVal,
																operatorValue : 'eq',
																dataType : 'S',
																displayType : 5,
																paramFieldLable : getLabel('labelSavedAccount','Account'),
																displayValue1 : displayValue
															});
															me.filterData=jsonArray;
												}
											}
										}
									}
								}
							}
		if (!Ext.isEmpty(objSavedLocalAccntPref)) {
			objLocalJsonData = Ext.decode(objSavedLocalAccntPref);
			if(!Ext.isEmpty(objLocalJsonData) && !Ext.isEmpty(me.filterData)){
				var txncategoryJson = me.findInQuickFilterData(me.filterData, 'categoryId');
				var accountFilterJson = me.findInQuickFilterData(me.filterData, 'accountId');
				if(!Ext.isEmpty(txncategoryJson))
					me.txncategory = txncategoryJson.paramValue1;
				if(!Ext.isEmpty(accountFilterJson))
					me.accountFilter = accountFilterJson.paramValue1;
			}
		}
	},
	upDateAccountConfig : function() {
		var me = this;
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
	},
 filterPref : function() {
		var me = this;
			if (objAccountGroupByPref) {
			        var objJsonData = Ext.decode(objAccountGroupByPref);
			        me.objAccountGridPref = objJsonData.d.preferences.gridCols;
			         me.objFilterPref = objJsonData.d.preferences.filterPref;
			         if( me.objFilterPref){
			         	 //me.txnCategory= me.objFilterPref.txnCategory
			         	 //me.accountFilter= me.objFilterPref.accountFilter;
			         	 //me.prfAcccountFilter=me.accountFilter;
			         }
		         }
			
		
},
	handleAccAccountClick : function(combo) {
		var me = this;
		combo.isAccAccountFieldChange = false;
		if (combo.isAllSelected()) {
			me.accountFilter = 'All';
		}else{
			me.accountFilter = combo.getSelectedValues();			
		}
		me.accountFilterDesc = combo.getRawValue();
		me.setDataForFilter();
		me.applyFilter();		
	},
	handleAccTxnCategoryClick : function(combo) {
		var me = this;
		combo.isAccTxnCategoryFieldChange = false;	
		if (combo.isAllSelected()) {
			me.txncategory = 'All';
		}else{
			me.txncategory = combo.getSelectedValues();
		}		
		me.txncategoryDesc = combo.getRawValue();
		me.setDataForFilter();
		me.applyFilter();
	},	
	handleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter) {
		var me = this;
		var activityView = me.getAccountView();
		var intPageNo = me.objLocalData && me.objLocalData.d && me.objLocalData.d.preferences
				&& me.objLocalData.d.preferences.tempPref
				&& me.objLocalData.d.preferences.tempPref.pageNo
				? me.objLocalData.d.preferences.tempPref.pageNo
				: null, intOldPgNo = oldPgNo , intNewPgNo = newPgNo;
				
		if(!Ext.isEmpty(intPageNo) && me.firstLoad)	{
			intNewPgNo = intPageNo;
			intOldPgNo = intPageNo;
		}
		me.firstLoad = false;
		var strUrl = grid.generateUrl(url, pgSize, intNewPgNo, intOldPgNo, sorter);
	    strUrl += this.generateFilterUrl(groupInfo, subGroupInfo);
		if (activityView)
			activityView.setLoading(true);
		
		var arrOfParseQuickFilter = [], arrOfParseAdvFilter = [], arrOfFilteredApplied = [];
		if (!Ext.isEmpty(me.filterData)) {
			if (!Ext.isEmpty(me.filterData) && me.filterData.length >= 1) 
			{
				var quickJsonData = me.filterData;
				var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,'Seller');
				if (!Ext.isEmpty(reqJsonInQuick)) 
				{
					arrQuickJson = quickJsonData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,'Seller');
					quickJsonData = arrQuickJson;
				}
				arrOfParseQuickFilter = generateFilterArray(quickJsonData);
			}
		}
		me.advFilterData = [];
		if (!Ext.isEmpty(me.advFilterData)) 
		{ 
			if (!Ext.isEmpty(me.advFilterData) && me.advFilterData.length >= 1) {				
				arrOfParseAdvFilter = generateFilterArray(me.advFilterData);
			}
		}

		if (arrOfParseQuickFilter && arrOfParseAdvFilter) 
		{
			arrOfFilteredApplied = arrOfParseQuickFilter.concat(arrOfParseAdvFilter);
			if ( arrOfFilteredApplied )
				me.getAccountGenericFilterView().updateFilterInfo(arrOfFilteredApplied);
		}
		me.reportGridOrder = strUrl;	
		grid.loadGridData(strUrl, null,
				null, false, me);
				
		if (isSaveLocalPreference)
			me.handleSaveLocalStorage();
	},
  generateFilterUrl : function(groupInfo, subGroupInfo) {
		var me = this;
		var strUrl;
		if(!Ext.isEmpty(me.txnCategory) && me.txnCategory != 'ALL'){
		  strUrl = '&$txnCatType=' + me.txnCategory;
		}
		if(typeof strUrl!='undefined' ){
		   strUrl += '&$summaryType=' + 'I';
		}else{
			 strUrl = '&$summaryType=' + 'I';
		}
		if(!Ext.isEmpty(me.accountFilter) && me.accountFilter!='ALL'){
		  strUrl +='&$accountFilter='+  me.accountFilter+'&';
		}
		else{
		strUrl +='&$accountFilter='+ 'ALL&';
		}
		
		if (subGroupInfo && !Ext.isEmpty(subGroupInfo.groupQuery)) {
			strUrl += subGroupInfo.groupQuery;
		}
		else
		{
		
				strUrl += '&$filterOn=&$filterValue=';
		}
		return strUrl;
	},
getGridModel : function() {
		var me = this;
		var gridCols = null;
		var gridModel = null;
		var model=null;
		if (typeof me.objAccountGridPref != 'undefined'
				&& !Ext.isEmpty(me.objAccountGridPref)
				&& 'null' !== me.objAccountGridPref)
			gridModel = me.objAccountGridPref;
	else{
			model=me.getModel();
			gridModel = gridModel || {
			"pgSize" : 10,
			"gridCols" : model
		};
		}
		
		
		return gridModel;
	},
getModel:function(){
	var gridModel = null;
		gridModel=[{
							"colId" : "summaryDate",
							"colHeader" : getLabel('date', 'Date'),
						    width : 150

						}, {
							"colId" : "accountNumber",
							"colHeader" : getLabel('account', 'Account'),
							width : 130
							
						}, {
							"colId" : "accountName",
							"colHeader" : getLabel('accountName','Account Name'),
							width : 150
							
						}, {
							"colId" : "accountType",
							"colHeader" : getLabel('accountType', 'Account Type'),
							width : 130
							
						},
						{
							"colId":'creditCount',
							"colHeader":getLabel('creditCount', 'Credit Count'),
							width:100,
							align:'right'
							
						},
						{
							"colId":'credit',
							"colHeader":getLabel('totalCredit', 'Total Credit'),
							width:80,
							align:'right'
							
						},{
							"colId":'debitCount',
							"colHeader": getLabel('debitcount', 'Debit Count'),
							width:80,
							align:'right'
							
						},{
							"colId":'debit',
							"colHeader":getLabel('totalDebit', 'Total Debit'),
							width:80,
							align:'right'
						
						}]
			return gridModel
	},
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) {
		var me=this;		
		var objGroupView = me.getGroupView();		
		var strModule = '', strUrl = null, args = null;
		groupInfo = groupInfo || {};
		subGroupInfo = subGroupInfo || {};
		// TODO : Commented the code.
		me.handleSummaryInformationRender();
		if (groupInfo && groupInfo.groupTypeCode) {
			if (groupInfo.groupTypeCode === 'CASHACCOUNT_OPT_ACCTYP') {
				strModule = subGroupInfo.groupCode;
			} else {
				strModule = groupInfo.groupTypeCode
			}
			args = {
				'module' : strModule
			};
			me.preferenceHandler.readModulePreferences(me.strPageName,
					strModule, me.postDoHandleGroupTabChange, args, me, true);
		} else {
			objGroupView.reconfigureGrid(null);
		}
	},
	postDoHandleGroupTabChange : function(data, args, isSuccess) {
		var me=this;		
		var arrSortState=new Array(),objPref = null, gridModel = null, intPgSize = null,showPager = true, heightOption = null;
		var colModel = null, arrCols = null;
		var objGroupView = me.getGroupView();	
		var objAccountView=me.getAccountView();
		var objLocalJsonData = '';
		if (objSavedLocalAccntPref)
					objLocalJsonData = Ext.decode(objSavedLocalAccntPref);
						
		var intPageSize = objLocalJsonData.d && objLocalJsonData.d.preferences
				&& objLocalJsonData.d.preferences.tempPref
				&& objLocalJsonData.d.preferences.tempPref.pageSize
				? objLocalJsonData.d.preferences.tempPref.pageSize
				: '';
		var intPageNo =objLocalJsonData &&objLocalJsonData.d &&objLocalJsonData.d.preferences
						&&objLocalJsonData.d.preferences.tempPref
						&&objLocalJsonData.d.preferences.tempPref.pageNo
						?objLocalJsonData.d.preferences.tempPref.pageNo
						: 1;
		var sortState =objLocalJsonData &&objLocalJsonData.d &&objLocalJsonData.d.preferences
					&&objLocalJsonData.d.preferences.tempPref
					&&objLocalJsonData.d.preferences.tempPref.sorter
					?objLocalJsonData.d.preferences.tempPref.sorter
					: [];
		if (data && data.preference) {
			objPref = Ext.decode(data.preference);
			arrCols = objPref.gridCols || null;
			intPgSize = intPageSize || objPref.pgSize || _GridSizeTxn;
			colModel = objAccountView.getDefaultColumnModel(arrCols);
			showPager = objPref.gridSetting
					&& !Ext.isEmpty(objPref.gridSetting.showPager)
					? objPref.gridSetting.showPager
					: true;
			heightOption = objPref.gridSetting
					&& !Ext.isEmpty(objPref.gridSetting.heightOption)
					? objPref.gridSetting.heightOption
					: null;		
			if (colModel) {
				gridModel = {
					columnModel : colModel,
					pageSize : intPgSize,
					showPagerForced : showPager,
					heightOption : heightOption,
					storeModel:{
					  sortState: sortState || objPref.sortState
                    },
                     pageNo : intPageNo
				}
			}
		}
		if(!Ext.isEmpty(intPageSize) && !Ext.isEmpty(intPageNo)) {
			gridModel = gridModel ? gridModel : {};
			gridModel.pageSize = intPageSize;
			gridModel.pageNo = intPageNo;
			gridModel.storeModel = {sortState: sortState};
			
		}
		objGroupView.reconfigureGrid(gridModel);
	},
	doHandleRowIconClick : function(grid, rowIndex, columnIndex, actionName,
			record) {
		var me = this;
		var strEventName = null;
		var recId = record.raw.identifier;
		var strActivityType = 'ALL';
	    strEventName = 'showTranscation';
	    strGridDetailTabSelected = strEventName;
		var filterData=me.updateFilterConfig(record,me);
		
		if (strEventName) {
			var group = me.getGroupView();
			if (!Ext.isEmpty(group))
			{
				var filterButton = group.down('button[itemId="filterButton"]');
				if (filterButton) {					
					if (filterButton.filterVisible) {
						filterButton.panel.hide();
						filterButton.filterVisible = false;
						filterButton.removeCls('filter-icon-hover');
					}
				}
			}			
			GCP.getApplication().fireEvent(strEventName, record,
						 strActivityType,filterData,true);


		}
	},
	updateFilterConfig:function(record,me){
	var me=this;
	filterData={};
	filterData.txncatType=me.navigatedTxnCategory;
	filterData.accountID=record.raw.accountID;
	filterData.accountNumber=record.raw.accountNumber;
	filterData.txncatType=me.txnCategory;
	filterData.txnCategoryDesc= me.categoryDesc;
	return filterData;
	},
	handleSummaryInformationRender : function() {
		var me = this;
		//summary not rendering properly incase of it is collapsed from other screen.
		var typeCodeUrl = me.generateTypeCodeUrl();
		me.populateSummaryInformationView(typeCodeUrl, false);
	},
	generateTypeCodeUrl : function() {
		var me = this;
		var typeCodeUrl = me.strReadSummaryInfoUrl;


		//typeCodeUrl += '?&$accountID=' + me.accountFilter;
		
		return typeCodeUrl;

	},
	populateSummaryInformationView : function(strUrl, updateFlag) {
    var me = this;
		Ext.Ajax.request({
					url : strUrl,
					method : 'POST',
					success : function(response) {
						var data = Ext.decode(response.responseText);
						if (!Ext.isEmpty(data)) {
							summaryData = data.d.summary;
							$('#summaryCarousalAccountTargetDiv').carousel({
								 data : summaryData,
								 titleNode : "txnDescription",
								 //contentNode:"typeCodeAmount",
								 contentRenderer: function(value) {
										return  value.currenySymbol + " " + Ext.util.Format.number(value.typeCodeAmount , '0,000.00') ;	
									},	
								 transactionNode:'txnCount'	
								});
						}
					},
					failure : function(response) {
						
					}
				});                        		
	},
	doHandleBackAction : function(btn,record, strSummaryType, filterData,calledFromAccountSection) {
		var me = this;
			if (!Ext.isEmpty(me.getAccountfilterView()) && !Ext.isEmpty(me.getAccountfilterView().up('filterView'))) 
			{
						me.getAccountfilterView().up('filterView').destroy();
			}
         GCP.getApplication().fireEvent('showAccount',record, strSummaryType, filterData,calledFromAccountSection);	
	},
	setDataForFilter:function()
	{
		var me=this;
		var accountFilterView=me.getAccountfilterView();
		if(!Ext.isEmpty(accountFilterView))
		{
			var accountCombo = me.getAccountCombo();
			var txnCombo = me.getTxnCombo();
			if(accountCombo.isAllSelected()){
				me.accountFilter = 'All';
			}else{
				me.accountFilter = accountCombo.getValue();				
			}
		    if(txnCombo.isAllSelected()){
				me.txnCategory = 'ALL';
				//txnCombo.setValue(me.navigatedTxnCategory);
				//me.txnCategory= me.navigatedTxnCategory;
			}else{
				me.txnCategory = txnCombo.getRawValue();
			}
		 /* if(me.txnCategory === "ALL")
		  {
			txnCombo.setValue(me.navigatedTxnCategory);
			me.txnCategory= me.navigatedTxnCategory;
		  }*/
				  var arrQuickJson = {};
				me.advFilterData = {};
				me.filterData = {};
				me.filterData = me.getQuickFilterQueryJson();
				var objJson = (!Ext.isEmpty(filterData) ? filterData.filterBy : getAdvancedFilterQueryJson());
				var reqJson = null;
				if (!Ext.isEmpty(objJson)) 
				{
					reqJson = me.findInAdvFilterData(objJson, "Client");
				}
				if (!Ext.isEmpty(reqJson)) 
				{
					arrQuickJson = me.filterData;
					arrQuickJson = me
							.removeFromQuickArrJson(arrQuickJson, "Client");
					me.filterData = arrQuickJson;
				}
				if (!Ext.isEmpty(objJson)) 
				{
					reqJson = me.findInAdvFilterData(objJson, "TransactionCategory");
				}
				if (!Ext.isEmpty(reqJson)) 
				{
					arrQuickJson = me.filterData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,"TransactionCategory");
					me.filterData = arrQuickJson;
				}
				if (!Ext.isEmpty(objJson)) 
				{
					reqJson = me.findInAdvFilterData(objJson, "Account");
				}
				if (!Ext.isEmpty(reqJson)) 
				{
					arrQuickJson = me.filterData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "Account");
					me.filterData = arrQuickJson;
				}
				me.advFilterData = objJson;

				var sortByData = getAdvancedFilterSortByJson();
				if (!Ext.isEmpty(sortByData) && sortByData.length > 0) {
					me.advSortByData = sortByData;
				} else {
					me.advSortByData = [];
				}

				var filterCode = $("input[type='text'][id='savedFilterAs']").val();
				if(!Ext.isEmpty(filterCode))
					me.advFilterCodeApplied = filterCode;
		}
	},
	applyFilter : function() {
	    var me = this;
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
	handleClearSettings:function(){
		var me=this;
		var accountFilterView=me.getAccountfilterView();
		if(!Ext.isEmpty(accountFilterView))
		{
			var accountCombo = me.getAccountCombo();
			var txnCombo = me.getTxnCombo();
			 me.txnCategory = "";
			 txnCombo.setValue("ALL");
			 me.accountFilter = "ALL";
			accountCombo.selectAllValues();
		    txnCombo.selectAllValues();
			 me.filterData = [];
			 //resetAllFields();
			 me.setDataForFilter();
			 me.refreshData();
		}
	},
	handleSavePreferences : function() {
		var me = this;
		if ($("#savePrefMenuBtn").attr('disabled'))
			event.preventDefault();
		else{
			var arrPref = me.getPreferencesToSave(false);
			if (arrPref) {
				me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
						me.postHandleSavePreferences, null, me, true);
			}
		}
	},
	getPreferencesToSave : function(localSave) {
		var me = this;
		var arrPref = [], objFilterPref = null, grid = null, gridState = null;
		var infoPanelCollapsed = false, graphPanelCollapsed = false;
		var groupInfo = null, subGroupInfo = null;
		// Summary Information Panel

		
		objFilterPref = me.getFilterPreferences();
		var groupView = me.getGroupView();
		if(groupView){
		var state = groupView.getGroupViewState();
		groupInfo = groupView.getGroupInfo() || '{}';
		subGroupInfo = groupView.getSubGroupInfo() || {};
	
			arrPref.push({
		               "module" : "groupByPref",
					    "jsonPreferences" : {
									groupCode : groupInfo.groupTypeCode,
									subGroupCode : subGroupInfo.groupCode
								}
					});
		arrPref.push({
					"module" : subGroupInfo.groupCode,
						"jsonPreferences" : {
						'gridCols' : state.grid.columns,
						'pgSize' : state.grid.pageSize,
						'sortState':state.grid.sortState,
						'gridSetting' : state.gridSetting 
						}
					});
		/*arrPref.push({
						"module" : "filterPref",
						"jsonPreferences" : objFilterPref
					});	*/	
		}
		return arrPref;
	},
	getFilterPreferences : function() {
		var me = this;
		var objFilterPref = {};
		//objFilterPref.txnCategory = me.txnCategory;
		objFilterPref.accountFilter = me.accountFilter;
		return objFilterPref;
	},
	postHandleSavePreferences : function(data, args, isSuccess) {
		var me = this;
		if (isSuccess === 'N') {
				me.disablePreferencesButton("savePrefMenuBtn", false);	
				me.disablePreferencesButton("clearPrefMenuBtn", true);	
		} else {
			me.disablePreferencesButton("clearPrefMenuBtn", false);	
			me.disablePreferencesButton("savePrefMenuBtn", true);	
		}
	},
	disablePreferencesButton : function(btnId, boolVal) {
		$("#" + btnId).attr("disabled", boolVal);
		if (boolVal)
			$("#" + btnId).css("color", 'grey');
		else
			$("#" + btnId).css("color", '#FFF');
	},
	handleClearPreferences : function() {
		var me = this;
		if ($("#clearPrefMenuBtn").attr('disabled'))
			event.preventDefault();
		else{
		me.preferenceHandler.clearPagePreferences(me.strPageName, null,
				me.postHandleClearPreferences, null, me, true);
		}		
	},
	postHandleClearPreferences : function(data, args, isSuccess) {
		var me = this;
		if (isSuccess === 'Y') {
			me.disablePreferencesButton("savePrefMenuBtn", false);	
			me.disablePreferencesButton("clearPrefMenuBtn", true);	
		} else {
			me.disablePreferencesButton("clearPrefMenuBtn", false);	
			me.disablePreferencesButton("savePrefMenuBtn", true);	
		}
	},
	downloadReportAccnt : function(actionName) {
		var me = this;
		var withHeaderFlag = document.getElementById("headerCheckbox").checked;
		var arrExtension = {
			downloadXls : 'xls',
			downloadCsv : 'csv',
			downloadReport : 'pdf',
			downloadTsv : 'tsv',
			downloadBAl2 : 'bai2',
			downloadMt940 : 'mt940',
			downloadqbook : 'quickbooks',
			downloadquicken : 'quicken'
		};
		var currentPage = 1;
		var strExtension = '';
		var strUrl = '';
		var strSelect = '';
		var activeCard = '';
		var args=null;
		var strModule = '';
		var visColsStr = "";
		strExtension = arrExtension[actionName];
		strUrl = 'services/cashPositionAccount/generateReport.' + strExtension;
		strUrl += '?$skip=1';
		
		var objGroupView = me.getGroupView();
		//var groupInfo = objGroupView.getGroupInfo() || '{}';	TODO
		//var subGroupInfo = objGroupView.getSubGroupInfo() || {}; TODO
		var groupInfo = '{}';	
		var subGroupInfo = {};
		strUrl += me.generateFilterUrl(groupInfo, subGroupInfo);
		
		var strOrderBy = me.reportGridOrder;
		if (!Ext.isEmpty(strOrderBy)) {
			var orderIndex = strOrderBy.indexOf('orderby');
			if (orderIndex > 0) {
				strOrderBy = strOrderBy.substring(orderIndex,
						strOrderBy.length);
				var indexOfamp = strOrderBy.indexOf('&$');
				if (indexOfamp > 0)
					strOrderBy = strOrderBy.substring(0, indexOfamp);
				strUrl += '&$' + strOrderBy;
			}
		}
		
		if (!Ext.isEmpty(objGroupView)) {
			colMap = new Object();
			colArray = new Array();

			grid = objGroupView.getGrid();

			if (!Ext.isEmpty(grid)) {
				viscols = grid.getAllVisibleColumns();

				for (var j = 0; j < viscols.length; j++) {
					col = viscols[j];
					if (col.dataIndex && arrDownloadAccountReportColumn[col.dataIndex]) {
						if (colMap[arrDownloadAccountReportColumn[col.dataIndex]]) {
							// ; do nothing
						} else {
							colMap[arrDownloadAccountReportColumn[col.dataIndex]] = 1;
							colArray
									.push(arrDownloadAccountReportColumn[col.dataIndex]);

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
		
		var  objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
			while (arrMatches = strRegex.exec(strUrl)) {
					objParam[arrMatches[1]] = arrMatches[2];
		   }
		strUrl = strUrl.substring(0, strUrl.indexOf('?'));	
		
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		
		Object.keys(objParam).map(function(key) { 
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					key, objParam[key]));
		});
					
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
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	removeFromQuickArrJson : function(arr, key) {
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.paramName == key) {
				arr.splice(i, 1);
			}
		}
		return arr;
	},
	removeFromAdvanceArrJson : function(arr,key){
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.field == key) {
				arr.splice(i, 1);
			}
		}
		return arr;
	},
	findInAdvFilterData : function(arr, key) {
		var reqJson = null;
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.field == key) {
				reqJson = ai;
			}
		}
		return reqJson;
	},
	findInQuickFilterData : function(arr, key) {
		var reqJson = null;
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.paramName == key) {
				reqJson = ai;
			}
		}
		return reqJson;
	},
	getQuickFilterQueryJson : function() {
		var me = this;
		var accountFilterView = me.getAccountfilterView();
			var accountCombo = me.getAccountCombo();
			var txnCombo = me.getTxnCombo();
			if(accountCombo.isAllSelected()){
				me.accountFilter = 'ALL';
			}else{
				me.accountFilter = accountCombo.getValue();				
			}
			
			if(txnCombo.isAllSelected()){
				me.txnCategory = 'ALL';
			}else{
				me.txnCategory = txnCombo.getValue();
			}
			me.accountFilterDesc = accountCombo.getRawValue();
			me.txnCategoryDesc = txnCombo.getRawValue();
			
		 /* if(me.txnCategory === "ALL")
		  {
			txnCombo.setValue(me.navigatedTxnCategory);
			me.txnCategory= me.navigatedTxnCategory;
		  }*/

		var statusFilterDiscArray = [];
		var statusFilterDisc = me.statusFilterDesc;
		var entryDateValArray = [];
		var txncategory = me.txnCategory;
		var accountFilter = me.accountFilter;
		var clientFilterVal = me.clientFilterVal;
		var clientFilterDesc = me.clientFilterDesc;
		var txncategoryDesc = me.txnCategoryDesc;
		var accountFilterDesc = me.accountFilterDesc;
		
		var jsonArray = [];
		if (!Ext.isEmpty(clientFilterVal) && clientFilterVal != 'ALL') {
			jsonArray.push({
						paramName : 'Client',
						paramValue1 : encodeURIComponent(clientFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S',
						displayType : 5,
						paramFieldLable : getLabel('lblcompany', 'Company Name'),
						displayValue1 : clientFilterVal
					});
		}
		if (!Ext.isEmpty(accountFilter) && accountFilter != 'ALL') {
			jsonArray.push({
						paramName : 'accountId',
						paramValue1 : encodeURIComponent(accountFilter.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S',
						displayType : 5,
						paramFieldLable : getLabel('labelSavedAccount','Account'),
						displayValue1 : accountFilterDesc
					});
		}
		if (!Ext.isEmpty(txncategory) && txncategory != null && txncategory != 'ALL') {
			jsonArray.push({
						paramName : 'categoryId',
						paramValue1 : encodeURIComponent(txncategory.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S',
						displayType : 5,
						paramFieldLable :getLabel('lblsavedTransaction','Transaction Category'),
						displayValue1 : txncategoryDesc
					});
		}

		return jsonArray;
	},
	handleClientChangeInQuickFilter : function(isSessionClientFilter) 
	{
		var me = this;
		if (isSessionClientFilter)
			me.clientFilterVal = selectedFilterClient;
		else
			me.clientFilterVal = isEmpty(selectedClient)? 'all': selectedClient;
			
		me.clientFilterDesc = selectedClientDesc;
		quickFilterClientValSelected = me.clientFilterVal;
		quickFilterClientDescSelected = me.clientFilterDesc;
		me.filterApplied = 'Q';
		me.setDataForFilter();
		if (me.clientFilterVal === 'all') 
		{
			me.showAdvFilterCode = null;
			me.filterApplied = 'ALL';
			me.refreshData();

		} 
		else 
		{
			me.applyQuickFilter();
		}
	},
	handleAppliedFilterDelete : function(btn)
	{
		var me = this;
		var objData = btn.data;
		var quickJsonData = me.filterData;
		if(!Ext.isEmpty(objData))
		{
			var paramName = objData.paramName || objData.field;
			var reqJsonInAdv = null;
			var arrAdvJson =null;
			var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,paramName);
			if (!Ext.isEmpty(reqJsonInQuick)) 
			{
				arrQuickJson = quickJsonData;
				arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,paramName);
				me.filterData = arrQuickJson;
			}
			me.resetFieldInAdvAndQuickOnDelete(objData);
			me.refreshData();
		}
	},
	resetFieldInAdvAndQuickOnDelete : function(objData){
		var me = this,strFieldName;
		if(!Ext.isEmpty(objData))
			strFieldName = objData.paramName || objData.field;
		var accountFilter = me.accountFilter;
		
		if(strFieldName ==='accountId')
		{
		var accountComboBox = me.getAccountfilterView().down('combo[itemId="ActAccountCombo"]');
			me.accountFilter = 'ALL';
			//accountComboBox.setValue(me.accountFilter);
			accountComboBox.selectAllValues();

		}
		else if(strFieldName ==='categoryId')
		{
			var cateGoryComboBox = me.getAccountfilterView().down('combo[itemId="ActTransactionCombo"]');
			me.txnCategory = '';
			cateGoryComboBox.setValue(me.txnCategory);
			cateGoryComboBox.selectAllValues();
		}
		else if(strFieldName ==='Client')
		{			
			if(isClientUser())
			{
				var clientComboBox = me.getAccountfilterView().down('combo[itemId="clientCombo"]');
				me.clientFilterVal = 'ALL';
				selectedFilterClientDesc = "";
				selectedFilterClient = "";
				selectedClientDesc = "";
				clientComboBox.setValue(me.clientFilterVal);
			} 
			else 
			{
				var clientComboBox = me.getAccountfilterView().down('combo[itemId="clientAuto]');
				clientComboBox.reset();
				me.clientFilterVal = '';
				selectedFilterClientDesc = "";
				selectedFilterClient = "";
			}
		}
	},savePageSetting : function(arrPref, strInvokedFrom) { 
		/* This will be get invoked from page level setting always */
		var me = this, args = {};
		if (!Ext.isEmpty(arrPref)) {
			me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
					me.postHandleSavePageSetting, args, me, false);
		}
	},
	postHandleSavePageSetting : function(data, args, isSuccess) {
		if (isSuccess === 'N')  {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
		else
		{
			var me = this;
			me.preferenceHandler.readPagePreferences(me.strPageName,
						me.postDoHandleReadPagePrefNew, null, me, true);
		}
	},
	applyPageSetting : function(arrPref, strInvokedFrom) {
		var me = this, args = {};
		if (!Ext.isEmpty(arrPref)) {
			if (strInvokedFrom === 'GRID' && _charCaptureGridColumnSettingAt === 'L') 
			{
				/**
				 * This handling is required for non-us market
				 */
				var groupView = me.getGroupView(), 
				subGroupInfo = groupView.getSubGroupInfo()|| {}, 
				objPref = {},
				groupInfo = groupView.getGroupInfo()|| '{}', 
				strModule = subGroupInfo.groupCode;
				Ext.each(arrPref || [], function(pref) 
						{
							if (pref.module === 'ColumnSetting') 
							{
								objPref = pref.jsonPreferences;
							}
						});
				args['strInvokedFrom'] = strInvokedFrom;
				args['objPref'] = objPref;
				strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-' + strModule : strModule;
				me.preferenceHandler.saveModulePreferences(me.strPageName,
						strModule, objPref, me.postHandlePageGridSetting, args,
						me, false);
			} 
			else {
				me.handleClearLocalPrefernces();
				me.preferenceHandler.savePagePreferences(me.strPageName,
						arrPref, me.postHandlePageGridSetting, args, me, false);
			}
		}
	},
restorePageSetting : function(arrPref, strInvokedFrom) { 
		//For US, NON US market		
		var me = this;
		if (strInvokedFrom === 'GRID' && _charCaptureGridColumnSettingAt === 'L') 
				{
					var groupView = me.getGroupView(), subGroupInfo = groupView.getSubGroupInfo()
					|| {}, objPref = {}, groupInfo = groupView.getGroupInfo()
					|| '{}', strModule = subGroupInfo.groupCode, args = {};

			strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-'+ strModule : strModule;
			args['strInvokedFrom'] = strInvokedFrom;
			Ext.each(arrPref || [], function(pref) 
			{
				if (pref.module === 'ColumnSetting') 
				{
					pref.module = strModule;
					return false;
				}
			});
			me.preferenceHandler.clearPagePreferences(me.strPageName,
			arrPref,me.postHandleRestorePageSetting, args, me, false);
		} 
		else{
			me.handleClearLocalPrefernces();
			me.preferenceHandler.clearPagePreferences(me.strPageName, arrPref,
					me.postHandleRestorePageSetting, null, me, false);
		}
	},
	postHandlePageGridSetting : function(data, args, isSuccess) {
		if (isSuccess === 'Y') 
		{
			var me = this;
			var objGroupView = me.getGroupView();			
			var gridModel = null, objData = null;
			if (args && args.strInvokedFrom === 'GRID' && _charCaptureGridColumnSettingAt === 'L') 
			{
				var objGroupView = me.getGroupView(), gridModel = null;
				if (args.objPref && args.objPref.gridCols)
					gridModel = 
					{
						columnModel : args.objPref.gridCols
					}
				objGroupView.reconfigureGrid(gridModel);
			}
			else{
				me.preferenceHandler.readPagePreferences(me.strPageName,
						me.postDoHandleReadPagePrefNew, null, me, true);

				if (objGroupView)
					objGroupView.destroy(true);
				if (me.getAccountView()) {
					objGroupView =me.getAccountView().createGroupView();
					me.getAccountView().add(objGroupView);	
				}
			}
		} 
		else 
		{
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
	},
	postHandleRestorePageSetting : function(data, args, isSuccess) {
		if (isSuccess === 'Y') 
		{
			var me = this;
			var objGroupView = me.getGroupView();
			if (args && args.strInvokedFrom === 'GRID'&& _charCaptureGridColumnSettingAt === 'L') 
			{
				
				if (objGroupView)
					objGroupView.reconfigureGrid(null);
			} 
			else
			{
				//window.location.reload();
				me.preferenceHandler.readPagePreferences(me.strPageName,
						me.postDoHandleReadPagePrefNew, null, me, true);

				if (objGroupView)
					objGroupView.destroy(true);
				if (me.getAccountView()) {
					objGroupView =me.getAccountView().createGroupView();
					me.getAccountView().add(objGroupView);	
				}
			}
		} 
		else 
		{
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
	},
	showPageSettingPopup : function(strInvokedFrom) 
	{
		var me = this, objData = {}, objGroupView =  me.getGroupView(), 
		objPrefData, objGeneralSetting, objGridSetting, objColumnSetting;
		var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '',
		objRowPerPageVal = _GridSizeTxn, strTitle = null, subGroupInfo;
		me.pageSettingPopup = null;
		
		if (!Ext.isEmpty(objAccountGroupByPref))
		{
			//Replace as per screen saved preferences
			objPrefData = Ext.decode(objAccountGroupByPref); //Replace as per screen saved preferences
			
			objGeneralSetting = objPrefData && objPrefData.d.preferences &&
			objPrefData.d.preferences.GeneralSetting ? objPrefData.d.preferences.GeneralSetting : null;
			
			objGridSetting = objPrefData && objPrefData.d.preferences && 
			objPrefData.d.preferences.GridSetting ? objPrefData.d.preferences.GridSetting : null;
			/**
			 * This default column setting can be taken from
			 * preferences/gridsets/under defined( js file)
			 */
			objColumnSetting = objPrefData && objPrefData.d.preferences && objPrefData.d.preferences.ColumnSetting
					&& objPrefData.d.preferences.ColumnSetting.gridCols ? objPrefData.d.preferences.ColumnSetting.gridCols
					: (CASH_POSITION_GENERIC_ACCOUNT_COLUMN_MODEL || '[]'); 
// For Dynamic profile will change column model as per grid set profile define at filter view js file
 					
			if (!Ext.isEmpty(objGeneralSetting)) 
			{
				objGroupByVal = objGeneralSetting.defaultGroupByCode;
				objDefaultFilterVal = objGeneralSetting.defaultFilterCode;
			}
			if (!Ext.isEmpty(objGridSetting)) 
			{
				objGridSizeVal = objGridSetting.defaultGridSize;
				objRowPerPageVal = objGridSetting.defaultRowPerPage;
			}
		}

		objData["groupByData"] = objGroupView? objGroupView.cfgGroupByData : [];
		objData["filterUrl"] = 'services/userfilterslist/'+me.strPageName;
		objData["rowPerPage"] = _AvailableGridSize;
		objData["groupByVal"] = objGroupByVal;
		objData["filterVal"] = objDefaultFilterVal;
		objData["gridSizeVal"] = objGridSizeVal;
		objData["rowPerPageVal"] = objRowPerPageVal;
		subGroupInfo = objGroupView.getSubGroupInfo() || {};
		strTitle = (strInvokedFrom === 'GRID' ? getLabel("columnSettings","Column Settings") 
				+ ' : ' + (subGroupInfo.groupDescription||'')  : getLabel("Settings", "Settings"));
		
		me.pageSettingPopup = Ext.create('Ext.ux.gcp.PageSettingPopUp', {
					cfgPopUpData : objData,
					cfgGroupView : objGroupView,
					cfgDefaultColumnModel : objColumnSetting,
					cfgViewOnly : _IsEmulationMode,
					cfgInvokedFrom : strInvokedFrom,
					title : strTitle,
					itemId :"pageSettingPopUpAccount"
				});
		me.pageSettingPopup.show();
		me.pageSettingPopup.center();
	},
	
	/* State handling at local storage starts */
	handleSaveLocalStorage : function(){
		var me=this,arrSaveData = [], objSaveState = {},objGroupView = me.getGroupView(), grid = objGroupView.getGrid() ,subGroupInfo = null,quickFilterState = {};
		if (objGroupView)
			subGroupInfo = objGroupView.getSubGroupInfo();
		objSaveState['filterAppliedType'] = "Q";
		objSaveState['quickFilterJson'] = !Ext.isEmpty(me.filterData) ? me.filterData : {};
		objSaveState['subGroupCode'] = (subGroupInfo || {}).groupCode;
		objSaveState['pageSize'] = grid && !Ext.isEmpty(grid.getPageSize()) ? grid.getPageSize() : null;
		objSaveState['pageNo'] = grid && !Ext.isEmpty(grid.getCurrentPage()) ? grid.getCurrentPage() :  1;
		objSaveState['sorter'] = grid && !Ext.isEmpty(grid.getSortState()) ? grid.getSortState() :  [];
		
		
		arrSaveData.push({
			"module" : "tempPref",
			"jsonPreferences" : objSaveState
		});
		
		me.saveLocalPref(arrSaveData);
	},
	saveLocalPref : function(arrSaveData){
		var me = this, args = {},strLocalPrefPageName = me.strPageName+'_TempPref';
		if (!Ext.isEmpty(arrSaveData)) {
			args['tempPref'] = arrSaveData;
			me.preferenceHandler.savePagePreferences(strLocalPrefPageName, arrSaveData,
					me.postHandleSaveLocalPref, args, me, false);
		}
	},
	postHandleSaveLocalPref : function(data, args, isSuccess) {
		var me = this, strLocalPrefPageName = me.strPageName+'_TempPref';
		var objLocalPref = {},objTemp={},objTempPref = {}, jsonSaved ={};
		if (isSuccess === 'N') {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
		else {
			if(!Ext.isEmpty(args)){
				jsonSaved = args && args.tempPref && args.tempPref[0] && args.tempPref[0].jsonPreferences ? args.tempPref[0].jsonPreferences : {};
				objTemp['tempPref'] = jsonSaved;
				objTempPref['preferences'] = objTemp;
				objLocalPref['d'] = objTempPref;
				
				me.updateObjLocalPref(objLocalPref);
			}
		}
	},
	postDoHandleReadPagePrefNew : function(data, args, isSuccess) {
		var me = this;
		if (isSuccess === 'Y') {
			if (!Ext.isEmpty(data)) {				
				objAccountGroupByPref = Ext.encode(data);
			}
		}
	},
	updateObjLocalPref : function (data){
		var me = this;
		objSavedLocalAccntPref = Ext.encode(data);
		me.objLocalData = Ext.decode(objSavedLocalAccntPref);
	},
	handleGridRowClick : function( view, td, cellIndex, record, tr, rowIndex, e, eOpts ) {
		var me = this;
		var clickedColumn = view.getGridColumns()[cellIndex];
		var columnType = clickedColumn.colType;
		if(columnType !== 'actioncontent' && columnType !== 'checkboxColumn') {
		var objGroupView = me.getGroupView();
		var grid = objGroupView.getGrid();
			var columnModel = null;
			var columnAction = null;
			if (!Ext.isEmpty(grid.columnModel)) {
				columnModel = grid.columnModel;
				for (var index = 0; index < columnModel.length; index++) {
					if (columnModel[index].colId == 'actioncontent') {
						columnAction = columnModel[index].items;
						break;
					}
				}
			}
			var arrVisibleActions = [];
			var arrAvailableActions = [];
			if (!Ext.isEmpty(columnAction))
				arrAvailableActions = columnAction;
			var store = grid.getStore();
			var jsonData = store.proxy.reader.jsonData;
			if (!Ext.isEmpty(arrAvailableActions)) {
				for (var count = 0; count < arrAvailableActions.length; count++) {
					var btnIsEnabled = false;
					if (!Ext.isEmpty(grid) && !Ext.isEmpty(grid.isRowIconVisible)) {
						btnIsEnabled = grid.isRowIconVisible(store, record,
								jsonData, arrAvailableActions[count].itemId,
								arrAvailableActions[count].maskPosition);
						if (btnIsEnabled == true) {
							arrVisibleActions.push(arrAvailableActions[count]);
							btnIsEnabled = false;
						}
					}
				}
			}
			if (!Ext.isEmpty(arrVisibleActions)) {
				me.doHandleRowIconClick(grid, null, null, arrVisibleActions[0].itemId,  record);
			}
		} 
		else{}
	},
	handleClearLocalPrefernces : function(){
		var me = this,args = {},strLocalPrefPageName = me.strPageName+'_TempPref';;
		
		me.preferenceHandler.clearPagePreferences(strLocalPrefPageName, null,
				me.postHandleClearLocalPreference, args, me, false);
	},
	postHandleClearLocalPreference : function(data, args, isSuccess){
		var me = this, args = {},strLocalPrefPageName = me.strPageName+'_TempPref';
		if (isSuccess === 'N') {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('localerrorMsg', 'Error while clear local setting'),
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
		else if(isSuccess === 'Y') {
			objSavedLocalAccntPref = '';
			me.objLocalData = '';
			var accountFilterView=me.getAccountfilterView();
		if(!Ext.isEmpty(accountFilterView))
		{
			var accountCombo = me.getAccountCombo();
			var txnCombo = me.getTxnCombo();
			 me.txnCategory = "";
			 txnCombo.setValue("ALL");
			 me.accountFilter = "ALL";
			accountCombo.selectAllValues();
		    txnCombo.selectAllValues();
			 me.filterData = [];
		}
		}
	}
});