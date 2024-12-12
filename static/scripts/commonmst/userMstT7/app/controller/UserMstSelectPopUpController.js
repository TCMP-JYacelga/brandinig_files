Ext.define('GCP.controller.UserMstSelectPopUpController', {
	extend : 'Ext.app.Controller',
	requires : ['GCP.view.UserMstSelectPopup','Ext.ux.gcp.FilterPopUpView'],
	refs : [{
				ref : 'filterPackageView',
				selector : 'filterPopUpView[itemId=pay_package_view]'
			}, {
				ref : 'filterAccountsView',
				selector : 'filterPopUpView[itemId=pay_accounts_view]'
			},{
				ref : 'filterTemplateView',
				selector : 'filterPopUpView[itemId=pay_templates_view]'
			},{
				ref : 'filterBrAccountsView',
				selector : 'filterPopUpView[itemId=br_accounts_view]'
			},{
				ref : 'filterNotionalAgreementView',
				selector : 'filterPopUpView[itemId=notional_list_view]'
			},{
				ref : 'filterSweepAgreementView',
				selector : 'filterPopUpView[itemId=sweep_list_view]'
			},{
				ref : 'filterScmProductsView',
				selector : 'filterPopUpView[itemId=scm_products_view]'
			},{
				ref : 'filterPortalAccountsView',
				selector : 'filterPopUpView[itemId=portal_accounts_view]'
			},{
				ref : 'filterTradePackageView',
				selector : 'filterPopUpView[itemId=trade_package_view]'
			},{
				ref : 'filterForecastPackageView',
				selector : 'filterPopUpView[itemId=forecast_Package_view]'
			},{
				ref : 'filterCollAccountsView',
				selector : 'filterPopUpView[itemId=coll_accounts_view]'
			},{
				ref : 'filterCollPackageView',
				selector : 'filterPopUpView[itemId=coll_package_view]'
			},{
				ref : 'filterLmsAccountsView',
				selector : 'filterPopUpView[itemId=lms_accounts_view]'
			},{
				ref : 'filterAuthMatrixView',
				selector : 'filterPopUpView[itemId=user_authmatrix_view]'
			}],
	strUrl : '',
	saveItemsFn : null,
	serviceURLFn:null,
	init : function() {
		var me = this;
		saveItemsFn = function (popupHandler) {
            var me = popupHandler;
			var grid = me.down('smartgrid');
			var objArrayLocal = new Array();
			var checkValue=document.getElementById(me.checkboxId);
			if(me.hiddenValueField!=null && me.hiddenValuePopUpField!=null )
			{
				var objSelArray = new Array();
				var objDeselArray = new Array();
				var objSelectedRecords = grid.selectedRecordList;
				var objDeSelectedRecordList = grid.deSelectedRecordList;
				var keyNode = me.keyNode;
				var keyArray=keyNode.split(",");
				var selectedList=new Array();
				var deSelectedList=new Array();
				var iCount=0;
				var jCount=0;
				for(;iCount<objSelectedRecords.length;iCount++)
				{
				 var jsonObj={};
					for(jCount=0;jCount<keyArray.length;jCount++)
					{
						var keyVal=keyArray[jCount];
						var temp = objSelectedRecords[iCount][keyVal];
						temp=temp.replace (/,/g, "");
						 jsonObj[keyVal] =temp;
					}
					objSelArray.push(jsonObj);
				}
				iCount=0;
				jCount=0;
				for(;iCount<objDeSelectedRecordList.length;iCount++)
				{
				 var jsonObj={};
					for(jCount=0;jCount<keyArray.length;jCount++)
					{
						var keyVal=keyArray[jCount];
						var temp = objDeSelectedRecordList[iCount][keyVal];
						temp=temp.replace (/,/g, "");
						jsonObj[keyVal] =temp;
				}
				objDeselArray.push(jsonObj);
				}
				var jsonObj = {
					"selectedRecords" : objSelArray,
					"deSelectedRecords" : objDeselArray
				}
				document.getElementById(me.hiddenValueField).value = Ext
							.encode(jsonObj);
					if (null != document
							.getElementById(me.hiddenValuePopUpField)
							&& undefined != document
									.getElementById(me.hiddenValuePopUpField)) {
						document
								.getElementById(me.hiddenValuePopUpField).value = 'Y';
					}
			}
					
			if(null!=checkValue && checkValue.getAttribute('src').indexOf('/icon_unchecked')!=-1){
			var records = grid.selectedRecordList;
			var blnIsUnselected = records.length < grid.store
					.getTotalCount() ? true : false;
			
			if (me.displayCount && !Ext.isEmpty(me.fnCallback)
					&& typeof me.fnCallback == 'function') {
				me.fnCallback(records, blnIsUnselected);
				selectedr = [];
				
			}
			}
			me.hide();
         };
        serviceURLFn= function(popupHandler) {
        	/*This method will get override as per the pop up used for module e.b Category,CPOn,USer etc.*/
    		var me = popupHandler;
    		var strQuickFilterUrl = '';
    		var searchFieldVal = '';
    		if (Ext.isEmpty(me.subsidaries) && $('#allClientSelectedFlag').val() === 'Y') {
    			me.subsidaries = allCategoryClients;
    		}
    		switch (me.service) {
    			case 'packages' :
    				strQuickFilterUrl = '&categoryCode=' + me.userCategory
					+ '&userCode=' + me.userCode + '&subsidaries='
					+ me.subsidaries + '&corporationCode='
					+ me.userCorporation + '&module=' + me.module +'&service=P'  ;
    				break;
    			case 'paycollAccounts' :
    				strQuickFilterUrl = '&categoryCode=' + me.userCategory
    						+ '&userCode=' + me.userCode + '&subsidaries='
    						+ me.subsidaries + '&corporationCode='
    						+ me.userCorporation + '&module=' + me.module +'&service=A'  ;
    				break;
    			case 'notionalList' :
    				strQuickFilterUrl = '&categoryCode=' + me.userCategory
    						 + '&userCode=' + me.userCode 
    						 + '&corporationCode='+ me.userCorporation
    						 + '&sellerCode='+ me.userSeller + '&csrfTokenName='
    						 + csrfTokenValue;
    				break;
    			case 'sweepList' :
    				strQuickFilterUrl = '&categoryCode=' + me.userCategory
    					 + '&userCode=' + me.userCode
    					 + '&corporationCode='+ me.userCorporation
    					 + '&sellerCode='+ me.userSeller + '&csrfTokenName='
    					 + csrfTokenValue;
    				break;
    			case 'authMatrixList' :
    				strQuickFilterUrl = '&categoryCode=' + me.userCategory
					+ '&userCode=' + me.userCode + '&subsidaries='
					+ me.subsidaries + '&corporationCode='
					+ me.userCorporation;
    				break;
    			default :
    				strQuickFilterUrl = '&categoryCode=' + me.userCategory
    						+ '&userCode=' + me.userCode + '&subsidaries='
    						+ me.subsidaries + '&corporationCode='
    						+ me.userCorporation + '&module=' + me.module +'&service=A';
    		}

    		return strQuickFilterUrl;
    	}; 
		GCP.getApplication().on({
					showUserPackages : function(module) {
						me.showUserPackagePopup(module);
					}
				});
		GCP.getApplication().on({
					showUserPaymentAccounts : function(module) {
						me.showUserPaymentAccountsPopup(module);
					}
				});
		GCP.getApplication().on({
					showUserBRAccounts : function() {
						me.showUserBRAccountsPopup();
					}
				});
		GCP.getApplication().on({
			showUserPortalAccounts : function() {
				me.showUserPortalAccountsPopup();
			}
		});
		
		GCP.getApplication().on({
					showUserTemplates : function() {
						me.showUserTemplatePopup();
					}
				});
		GCP.getApplication().on({
					showLMSAccounts : function() {
						me.showLMSAccountsPopup();
					}
				});
		GCP.getApplication().on({
					showSCMProducts : function() {
						me.showSCMProductPopup();
					}
				});
		GCP.getApplication().on({
			showNotionalList : function() {
				me.showNotionalListPopup();
			}
		});
		
		GCP.getApplication().on({
			showSweepList : function() {
				me.showSweepListPopup();
			}
		});
		
		GCP.getApplication().on({
			showTradePackageList : function(module) {
				me.showTradePackageListPopup(module);
			}
		});
		
		GCP.getApplication().on({
			showForecastPackageList : function(module) {
				me.showForecastPackageListPopup(module);
			}
		});
		
		GCP.getApplication().on({
			showUserAuthMatrixList : function() {
				me.showUserUserAuthMatrixPopup();
			}
		});
		me.control({
			'filterPopUpView[itemId=pay_package_view] smartgrid': {
				selectionUpdated: function() {
					me.persistSelectionFromHiddenField(me.getFilterPackageView());
				},
				loadSelectionUpdated: function() {
					me.persistSelectionFromHiddenField(me.getFilterPackageView());
				}
			},
			'filterPopUpView[itemId=pay_accounts_view] smartgrid': {
				selectionUpdated: function() {
					me.persistSelectionFromHiddenField(me.getFilterAccountsView());
				},
				loadSelectionUpdated: function() {
					me.persistSelectionFromHiddenField(me.getFilterAccountsView());
				}
			},
			'filterPopUpView[itemId=pay_templates_view] smartgrid': {
				selectionUpdated: function() {
					me.persistSelectionFromHiddenField(me.getFilterTemplateView());
				},
				loadSelectionUpdated: function() {
					me.persistSelectionFromHiddenField(me.getFilterTemplateView());
				}
			},
			'filterPopUpView[itemId=br_accounts_view] smartgrid': {
				selectionUpdated: function() {
					me.persistSelectionFromHiddenField(me.getFilterBrAccountsView());
				},
				loadSelectionUpdated: function() {
					me.persistSelectionFromHiddenField(me.getFilterBrAccountsView());
				}
			},
			'filterPopUpView[itemId=notional_list_view] smartgrid': {
				selectionUpdated: function() {
					me.persistSelectionFromHiddenField(me.getFilterNotionalAgreementView());
				},
				loadSelectionUpdated: function() {
					me.persistSelectionFromHiddenField(me.getFilterNotionalAgreementView());
				}
			},
			'filterPopUpView[itemId=sweep_list_view] smartgrid': {
				selectionUpdated: function() {
					me.persistSelectionFromHiddenField(me.getFilterSweepAgreementView());
				},
				loadSelectionUpdated: function() {
					me.persistSelectionFromHiddenField(me.getFilterSweepAgreementView());
				}
			},
			'filterPopUpView[itemId=scm_products_view] smaergrid': {
				selectionUpdated: function() {
					me.persistSelectionFromHiddenField(me.getFilterScmProductsView());
				},
				loadSelectionUpdated: function() {
					me.persistSelectionFromHiddenField(me.getFilterScmProductsView());
				}
			},
			'filterPopUpView[itemId=portal_accounts_view] smartgrid': {
				selectionUpdated: function() {
					me.persistSelectionFromHiddenField(me.getFilterPortalAccountsView());
				},
				loadSelectionUpdated: function() {
					me.persistSelectionFromHiddenField(me.getFilterPortalAccountsView());
				}
			},
			'filterPopUpView[itemId=trade_package_view] smaergrid': {
				selectionUpdated: function() {
					me.persistSelectionFromHiddenField(me.getFilterTradePackageView());
				},
				loadSelectionUpdated: function() {
					me.persistSelectionFromHiddenField(me.getFilterTradePackageView());
				}
			},
			'filterPopUpView[itemId=forecast_Package_view] smartgrid': {
				selectionUpdated: function() {
					me.persistSelectionFromHiddenField(me.getFilterForecastPackageView());
				},
				loadSelectionUpdated: function() {
					me.persistSelectionFromHiddenField(me.getFilterForecastPackageView());
				}
			},
			'filterPopUpView[itemId=coll_accounts_view] smartgrid': {
				selectionUpdated: function() {
					me.persistSelectionFromHiddenField(me.getFilterCollAccountsView());
				},
				loadSelectionUpdated: function() {
					me.persistSelectionFromHiddenField(me.getFilterCollAccountsView());
				}
			},
			'filterPopUpView[itemId=coll_package_view] smartgrid': {
				selectionUpdated: function() {
					me.persistSelectionFromHiddenField(me.getFilterCollPackageView());
				},
				loadSelectionUpdated: function() {
					me.persistSelectionFromHiddenField(me.getFilterCollPackageView());
				}
			},
			'filterPopUpView[itemId=lms_accounts_view] smartgrid': {
				selectionUpdated: function() {
					me.persistSelectionFromHiddenField(me.getFilterLmsAccountsView());
				},
				loadSelectionUpdated: function() {
					me.persistSelectionFromHiddenField(me.getFilterLmsAccountsView());
				}
			},
			'filterPopUpView[itemId=user_authmatrix_view] smartgrid': {
				selectionUpdated: function() {
					me.persistSelectionFromHiddenField(me.getFilterAuthMatrixView());
				},
				loadSelectionUpdated: function() {
					me.persistSelectionFromHiddenField(me.getFilterAuthMatrixView());
				}
			}	
		});
	},
	persistSelectionFromHiddenField: function(popup) {
		var me = this;
		var hiddenFieldRef = document.getElementById(popup.hiddenValueField);
		if(!Ext.isEmpty(hiddenFieldRef.value)) {
			var smartgridObj = popup.down('smartgrid');
			var arrGridRecords = smartgridObj.getSelectionModel().getStore().data.items;
			var hiddenFieldSelectedRecords = JSON.parse(hiddenFieldRef.value).selectedRecords;
			var hiddenFieldDeSelectedRecords = JSON.parse(hiddenFieldRef.value).deSelectedRecords;
			var keyArray= popup.keyNode.split(",");
			Ext.Array.each(arrGridRecords, function(arrGridRecord){
				if(JSON.stringify(smartgridObj.deSelectedRecordList).indexOf(JSON.stringify(arrGridRecord.data)) === -1) {
					Ext.Array.each(hiddenFieldSelectedRecords, function(hiddenFieldSelectedRecord){
						var recordEqualityFlag = false;
						Ext.Array.each(keyArray, function(keyNode){
							if((arrGridRecord.data[keyNode].replace(/,/,'')) === hiddenFieldSelectedRecord[keyNode]) {
								recordEqualityFlag = true;
							} else {
								recordEqualityFlag = false;
								return false;
							}
						},me);
						if(recordEqualityFlag) {
							smartgridObj.selectRecord(arrGridRecord, true);
							return false;
						}
					},me);
				}
				if(JSON.stringify(smartgridObj.selectedRecordList).indexOf(JSON.stringify(arrGridRecord.data)) === -1) {
					Ext.Array.each(hiddenFieldDeSelectedRecords, function(hiddenFieldDeSelectedRecord){
						var recordEqualityFlag = false;
						Ext.Array.each(keyArray, function(keyNode){
							if((arrGridRecord.data[keyNode].replace(/,/,'')) === hiddenFieldDeSelectedRecord[keyNode]) {
								recordEqualityFlag = true;
							} else {
								recordEqualityFlag = false;
								return false;
							}
						},me);
						if(recordEqualityFlag) {
							smartgridObj.deSelectRecord(arrGridRecord);
							return false;
						}
					},me);
				}
			},me);
		}
	},
	getParamValues : function() {
		var me = this;
		var localSubsidaries = null;
		if (null != globalsubsidaries) {
			localSubsidaries = globalsubsidaries;
		} else {
			localSubsidaries = document.getElementById('selectedClientList').value;
		}
		var paramValues = {
			"userCategory" : userCategory,
			"userMode" : userMode,
			"userCorporation" : userCorporation,
			"userCode" : userCode,
			"userSeller" : userSeller,
			"subsidaries" : localSubsidaries
		};
		return paramValues;
	},
	setParamValuesToPopUpandRefreshGrid : function(popup) {
		var me = this;
		var paramValues = me.getParamValues();
		popup.userCategory = paramValues.userCategory;
		popup.userMode = paramValues.userMode;
		popup.userCorporation = paramValues.userCorporation;
		popup.userCode = paramValues.userCode;
		popup.subsidaries = paramValues.subsidaries;
		popup.handleSmartGridLoading();
	},
	showUserPackagePopup : function(modulePassed) {
		var me = this;
		var pckgSelectPopup = null;
		var localIsAllAssigned = $('#allPayPckgsSelectedFlag').val();
		var paramValues = me.getParamValues();
		var poplbl = null;
		var hiddenFieldFlag="";
		var hiddenFieldPopUpFlag="";
		if (modulePassed == '02') {
			pckgSelectPopup = me.getFilterPackageView();
			hiddenFieldFlag="selectedPayPckgsList";
			hiddenFieldPopUpFlag="paymentpackagesPopupSelectedFlag";
		} else if (modulePassed == '05') {
			pckgSelectPopup = me.getFilterCollPackageView();
			hiddenFieldFlag="selectedCollPckgsList";
			hiddenFieldPopUpFlag="collectionpackagesPopupSelectedFlag";
		}
		
		if (Ext.isEmpty(paramValues.userCategory)
				|| paramValues.userCategory == "NONE") {
			me.showCategorySelectionErrorMsg();
		} else {

			if (null == pckgSelectPopup) {
				if (modulePassed == '02') {
					pckgId = 'pay_package_view';
					poplbl = 'Payment Package';
				} else if (modulePassed == '05') {
					pckgId = 'coll_package_view';
					poplbl = 'Receivable Package';
				}
				pckgSelectPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
				{
					title : getLabel('selectPackage','Select Package'),
					isAllSelected : localIsAllAssigned,
					keyNode : 'entitlementName,subsidiriesList',
					itemId : pckgId,
					checkboxId:'chkAllPayPckgsSelectedFlag',
					displayCount:false,
					cls : 'xn-popup',
					width : 735,
					//maxWidth : 735,
					minHeight : 156,
					maxHeight : 550,
					draggable : false,
					resizable : false,
					floating: true,
					cfgModel : {
					     pageSize : 5,
						storeModel : {
							fields : ['isAssigned', 'entitlementName',
							'assignmentStatus', 'packageDescription',
							'clientDescription','subsidiriesList'],
					proxyUrl : 'services/catAssignedServiceDataList.json',
					rootNode : 'd.details',
					totalRowsNode : 'd.__count'
					      },
					columnModel : [{
							colId : 'packageDescription',
							colDesc : getLabel('package','Package'),
							colHeader :getLabel('package','Package'),
							width : 180,
							sortable : true
						}, {
							colId : 'clientDescription',
							colDesc : getLabel('grid.column.company','Company Name'),
							colHeader :getLabel('grid.column.company','Company Name'),
							width : 180,
							sortable : true
						},{
							colId : 'assignmentStatus',
							colDesc : getLabel('status','Status'),
							colHeader :getLabel('status','Status'),
							width : 180,
							sortable : false
						}]
					   },
					
					//cfgFilterLabel:poplbl,
					cfgAutoCompleterUrl:'catAssignedServiceDataList',
					autoCompleterEmptyText :getLabel('searchByPackage','Search By Package'),
					cfgUrl:'services/{0}.json',
					paramName:'filterName',
					dataNode:'packageDescription',
					rootNode : 'd.details',
					autoCompleterExtraParam:
						[{
							key:'categoryCode',value: paramValues.userCategory
						},{
							key:'userCode',value: paramValues.userCode
						},{
							key:'subsidaries',value: paramValues.subsidaries
						},{
							key:'corporationCode',value: paramValues.userCorporation
						},{
							key:'module',value: modulePassed
						},{
							key:'service',value: 'P'
						}],
					cfgShowFilter:true,
					subsidaries : paramValues.subsidaries,
					service : 'packages',
					userMode : paramValues.userMode,
					userCategory : paramValues.userCategory,
					userCorporation : paramValues.userCorporation,
					userCode : paramValues.userCode,
					module : modulePassed,
					hiddenValueField : hiddenFieldFlag,
					hiddenValuePopUpField :hiddenFieldPopUpFlag,
					savefnCallback :saveItemsFn,
					urlCallback :serviceURLFn
					
				});
				pckgSelectPopup.center();
				pckgSelectPopup.show();
	}
	else{
		pckgSelectPopup.lastSelectedWidgets = '';
		pckgSelectPopup.isAllSelected = localIsAllAssigned;
		pckgSelectPopup.center();
		pckgSelectPopup.show();
	}

		}
		var filterContainer = pckgSelectPopup.down('container[itemId="filterContainer"] AutoCompleter');
    	 filterContainer.focus();
	},
	showUserPaymentAccountsPopup : function(modulePassed) {
		var me = this;
		var payAccSelectPopup = null;
		var localIsAllAssigned = $('#allPayAccSelectedFlag').val();
		var paramValues = me.getParamValues();
		var pckgId = null;
		var poplbl = null;
		var hiddenFieldFlag="";
		var hiddenFieldPopUpFlag="";
		if (modulePassed == '02') {
			payAccSelectPopup = me.getFilterAccountsView();
			hiddenFieldFlag="selectedPayAccList";
			hiddenFieldPopUpFlag="paymentAccountsPopupSelectedFlag";
		} else if (modulePassed == '05') {
			payAccSelectPopup = me.getFilterCollAccountsView();
			hiddenFieldFlag="selectedCollAccList";
			hiddenFieldPopUpFlag="collectionAccountsPopupSelectedFlag";
		}

		if (Ext.isEmpty(paramValues.userCategory)
				|| paramValues.userCategory == "NONE") {
			me.showCategorySelectionErrorMsg();
		} else {

			if (null == payAccSelectPopup) {
			
				if (modulePassed == '02') {
					pckgId = 'pay_accounts_view';
					poplbl = 'Payment Accounts';
				} else if (modulePassed == '05') {
					pckgId = 'coll_accounts_view';
					poplbl = 'Receivables Accounts';
				}
				payAccSelectPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
				{
					title : getLabel('selectAccount','Select Accounts'),
					isAllSelected : localIsAllAssigned,
					keyNode : 'entitlementName,subsidiriesList',
					itemId : pckgId,
					checkboxId:'chkAllPayAccSelectedFlag',
					displayCount:false,
					cls : 'xn-popup',
					width : 735,
					//maxWidth : 735,
					minHeight : 156,
					maxHeight : 550,
					draggable : false,
					resizable : false,
					floating: true,
					cfgModel : {
					     pageSize : 5,
						 storeModel : {
							fields : ['isAssigned', 'entitlementName','accountName',
							'assignmentStatus', 'clientDescription','subsidiriesList'],
					proxyUrl : 'services/catAssignedServiceDataList.json',
					rootNode : 'd.details',
					totalRowsNode : 'd.__count'
					      },
						columnModel : [{
							colId : 'entitlementName',
							colDesc : getLabel('accountNo','Account No'),
							colHeader :getLabel('accountNo','Account No'),
							sortable : true,
							width : 140
						}, 
						{
							colId : 'accountName',
							colDesc : getLabel('accountName','Account Name'),
							colHeader :getLabel('accountName','Account Name'),
							width : 150
						},{
							colId : 'clientDescription',
							colDesc : getLabel('grid.column.company','Company Name'),
							colHeader :getLabel('grid.column.company','Company Name'),
							sortable : true,
							width : 120
						},{
							colId : 'assignmentStatus',
							colDesc : getLabel('status','Status'),
							colHeader : getLabel('status','Status'),
							sortable : false,
							width : 130
						}],
						checkBoxColumnWidth:_GridCheckBoxWidth
					   },
					
					   //cfgFilterLabel:poplbl,
					   autoCompleterEmptyText : getLabel('searchByAccNumberOrName','Search By Account No Or Name'),
					   cfgAutoCompleterUrl:'catAssignedServiceDataList',
					   cfgUrl:'services/{0}.json',
					   paramName:'filterName',
					   dataNode:'entitlementName',
					   dataNode2:'accountName',
					  delimiter:'|&nbsp&nbsp&nbsp',
					  cfgListCls:'xn-autocompleter-t7',
					   rootNode : 'd.details',
					   autoCompleterExtraParam:
							[{
								key:'categoryCode',value: paramValues.userCategory
							},{
								key:'userCode',value: paramValues.userCode
							},{
								key:'subsidaries',value: paramValues.subsidaries
							},{
								key:'corporationCode',value: paramValues.userCorporation
							},{
								key:'module',value: modulePassed
							},{
								key:'service',value: 'A'
							}],
					   cfgShowFilter:true,
					   subsidaries : paramValues.subsidaries,
					   service : 'paycollAccounts',
						userMode : paramValues.userMode,
						userCategory : paramValues.userCategory,
						userCorporation : paramValues.userCorporation,
						userCode : paramValues.userCode,
						module : modulePassed,
						hiddenValueField : hiddenFieldFlag,
						hiddenValuePopUpField :hiddenFieldPopUpFlag,
						savefnCallback :saveItemsFn,
						urlCallback :serviceURLFn
				});
				payAccSelectPopup.center();
				payAccSelectPopup.show();
			} else {
				payAccSelectPopup.lastSelectedWidgets = '';
				payAccSelectPopup.isAllSelected = localIsAllAssigned;
				payAccSelectPopup.center();
				payAccSelectPopup.show();
			}
			
			
		}
		 var filterContainer = payAccSelectPopup.down('container[itemId="filterContainer"] AutoCompleter');
    	 filterContainer.focus();
	},
	showUserBRAccountsPopup : function() {
			var me = this;
		var brAccSelectPopup = null;
		var paramValues = me.getParamValues();
		var localIsAllAssigned = $('#allBRAccSelectedFlag').val();
		var pckgId = 'br_accounts_view';
		brAccSelectPopup = me.getFilterBrAccountsView();

		if (Ext.isEmpty(paramValues.userCategory)
				|| paramValues.userCategory == "NONE") {
			me.showCategorySelectionErrorMsg();
		} else {

			if (null == brAccSelectPopup) {
			brAccSelectPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
				{
					title :getLabel('selectAccount','Select Accounts'),
					isAllSelected : localIsAllAssigned,
					keyNode : 'entitlementName,subsidiriesList',
					itemId : pckgId,
					cls : 'xn-popup',
					checkboxId:'chkAllBrAccSelectedFlag',
					displayCount:false,
					width : 735,
					//maxWidth : 735,
					minHeight : 156,
					maxHeight : 550,
					draggable : false,
					resizable : false,
					floating: true,
					cfgModel : {
					    pageSize : 5,
						storeModel : {
							fields : ['isAssigned', 'entitlementName','accountName',
							'assignmentStatus', 'clientDescription','subsidiriesList'],
						proxyUrl : 'services/catAssignedServiceDataList.json',
						rootNode : 'd.details',
						totalRowsNode : 'd.__count'
					      },
					columnModel : [{
							colId : 'entitlementName',
							colDesc : getLabel('accountNo','Account No'),
							colHeader :getLabel('accountNo','Account No'),
							width : 140,
							sortable : true
						},
						{
							colId : 'accountName',
							colDesc :getLabel('accountName','Account Name'),
							colHeader :getLabel('accountName','Account Name'),
							width : 150
						},{
							colId : 'clientDescription',
							colDesc : getLabel('grid.column.company','Company Name'),
							colHeader :getLabel('grid.column.company','Company Name'),
							width : 120,
							sortable : true
						},{
							colId : 'assignmentStatus',
							colDesc : getLabel('status','Status'),
							colHeader : getLabel('status','Status'),
							width : 130,
							sortable : false
						}],
						checkBoxColumnWidth:_GridCheckBoxWidth
					   },
					
					//cfgFilterLabel:'BR Account',
					autoCompleterEmptyText : getLabel('searchByAccNumberOrName','Search By Account No Or Name'),
					cfgAutoCompleterUrl:'catAssignedServiceDataList',
					cfgUrl:'services/{0}.json',
					paramName:'filterName',
					dataNode:'entitlementName',
					dataNode2:'accountName',
					delimiter:'|&nbsp&nbsp&nbsp',
					 cfgListCls:'xn-autocompleter-t7',
					rootNode : 'd.details',
					autoCompleterExtraParam:
						[{
							key:'categoryCode',value: paramValues.userCategory
						},{
							key:'userCode',value: paramValues.userCode
						},{
							key:'subsidaries',value: paramValues.subsidaries
						},{
							key:'corporationCode',value: paramValues.userCorporation
						},{
							key:'module',value: '01'
						},{
							key:'service',value: 'A'
						}],
					cfgShowFilter:true,
					subsidaries : paramValues.subsidaries,
					service : 'brAccounts',
					userMode : paramValues.userMode,
					userCategory : paramValues.userCategory,
					userCorporation : paramValues.userCorporation,
					userCode : paramValues.userCode,
					module : '01',
					hiddenValueField : 'selectedBRAccList',
					hiddenValuePopUpField :'brAccountsPopupSelectedFlag',
					savefnCallback :saveItemsFn,
					urlCallback :serviceURLFn
				});
			brAccSelectPopup.show();
			brAccSelectPopup.center();
	}
	else{
		brAccSelectPopup.lastSelectedWidgets = '';
		brAccSelectPopup.isAllSelected = localIsAllAssigned;
		brAccSelectPopup.show();
		brAccSelectPopup.center();
	}
		}
		var filterContainer = brAccSelectPopup.down('container[itemId="filterContainer"] AutoCompleter');
    	 filterContainer.focus();
		
	},
	
	showUserPortalAccountsPopup : function() {
		var me = this;
		var portalAccSelectPopup = null;
		var paramValues = me.getParamValues();
		var localIsAllAssigned = $('#allPortalAccSelectedFlag').val();
		var pckgId = 'portal_accounts_view';
		portalAccSelectPopup = me.getFilterPortalAccountsView();

		if (Ext.isEmpty(paramValues.userCategory)
				|| paramValues.userCategory == "NONE") {
			me.showCategorySelectionErrorMsg();
		} else {

			if (null == portalAccSelectPopup) {
			portalAccSelectPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
				{
					title : getLabel('selecteStatementAccounts','Select eStatement Accounts'),
					isAllSelected : localIsAllAssigned,
					keyNode : 'entitlementName,subsidiriesList',
					itemId : pckgId,
					checkboxId:'chkAllPortalAccSelectedFlag',
					displayCount:false,
					cls : 'xn-popup',
					width : 735,
					//maxWidth : 735,
					minHeight : 156,
					maxHeight : 550,
					draggable : false,
					resizable : false,
					floating : true,
					cfgModel : {
					    pageSize : 5,
						storeModel : {
							fields : ['isAssigned', 'entitlementName',
							'assignmentStatus', 'clientDescription','subsidiriesList'],
						proxyUrl : 'services/catAssignedServiceDataList.json',
						rootNode : 'd.details',
						totalRowsNode : 'd.__count'
					      },
					columnModel : [{
							colId : 'entitlementName',
							colDesc :getLabel('accountNo','Account No'),
							colHeader :getLabel('accountNo','Account No'),
							width : 180,
							sortable : true
						},{
							colId : 'clientDescription',
							colDesc : getLabel('grid.column.company','Company Name'),
							colHeader : getLabel('grid.column.company','Company Name'),
							width : 180,
							sortable : true
						},{
							colId : 'assignmentStatus',
							colDesc : getLabel('status','Status'),
							colHeader :getLabel('status','Status'),
							width : 180,
							sortable : false
						}]
					   },
					
					//cfgFilterLabel:'eStatement Accounts',
					autoCompleterEmptyText : 'Search By Account No Or Name',
					cfgAutoCompleterUrl:'catAssignedServiceDataList',
					cfgUrl:'services/{0}.json',
					paramName:'filterName',
					dataNode:'entitlementName',
					rootNode : 'd.details',
					autoCompleterExtraParam:
						[{
							key:'categoryCode',value: paramValues.userCategory
						},{
							key:'userCode',value: paramValues.userCode
						},{
							key:'subsidaries',value: paramValues.subsidaries
						},{
							key:'corporationCode',value: paramValues.userCorporation
						},{
							key:'module',value: '19'
						},{
							key:'service',value: 'A'
						}
						],
					cfgShowFilter:true,
					subsidaries : paramValues.subsidaries,
					service : 'portalAccounts',
					userMode : paramValues.userMode,
					userCategory : paramValues.userCategory,
					userCorporation : paramValues.userCorporation,
					userCode : paramValues.userCode,
					module :'19',
					hiddenValueField : 'selectedPortalAccList',
					hiddenValuePopUpField :'portalAccountsPopupSelectedFlag',
					savefnCallback :saveItemsFn,
					urlCallback :serviceURLFn
				});
			portalAccSelectPopup.center();
			portalAccSelectPopup.show();
	}
	else{
		portalAccSelectPopup.lastSelectedWidgets = '';
		portalAccSelectPopup.isAllSelected = localIsAllAssigned;
		portalAccSelectPopup.center();
		portalAccSelectPopup.show();
	}
		}
	},
	showUserTemplatePopup : function() {
	var me = this;
		var payTemplSelectPopup = null;
		var paramValues = me.getParamValues();
		var localIsAllAssigned = $('#allPayTemplatesSelectedFlag').val();
		
		var pckgId = 'pay_templates_view';
		payTemplSelectPopup = me.getFilterTemplateView();

		if (Ext.isEmpty(paramValues.userCategory)
				|| paramValues.userCategory == "NONE") {
			me.showCategorySelectionErrorMsg();
		} else {
			if (null == payTemplSelectPopup) {
			payTemplSelectPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
				{
					title : getLabel('selectTemplate','Select Templates'),
					isAllSelected : localIsAllAssigned,
					keyNode : 'entitlementName',
					itemId : pckgId,
					checkboxId:'chkAllPayTemplatesSelectedFlag',
					displayCount:false,
					cls : 'xn-popup',
					width : 735,
					//maxWidth : 735,
					minHeight : 156,
					maxHeight : 550,
					draggable : false,
					resizable : false,
					floating : true,
					cfgModel : {
						pageSize : 5,
						storeModel : {
					    fields : ['isAssigned', 'entitlementName',
							'assignmentStatus', 'clientDescription'],
						proxyUrl : 'services/catAssignedTemplateList.json',
						rootNode : 'd.details',
						totalRowsNode : 'd.__count'
					      },
					columnModel : [{
							colId : 'entitlementName',
							colDesc : getLabel('templateName','Template Name'),
							colHeader : getLabel('templateName','Template Name'),
							width : 180,
							sortable : true
						},{
							colId : 'clientDescription',
							colDesc : getLabel('grid.column.company','Company Name'),
							colHeader : getLabel('grid.column.company','Company Name'),
							width : 180,
							sortable : true
						},{
							colId : 'assignmentStatus',
							colDesc : getLabel('status','Status'),
							colHeader :getLabel('status','Status'),
							width : 180,
							sortable : false
						}]
					   },
					
					//cfgFilterLabel:'Payment Template',
					autoCompleterEmptyText : getLabel('searchByTemplateName','Search by Template Name'),
					cfgAutoCompleterUrl:'catAssignedTemplateList',
					cfgUrl:'services/{0}.json',
					paramName:'filterName',
					dataNode:'entitlementName',
					rootNode : 'd.details',
					autoCompleterExtraParam:
						[{
							key:'categoryCode',value: paramValues.userCategory
						},{
							key:'userCode',value: paramValues.userCode
						},{
							key:'subsidaries',value: paramValues.subsidaries
						},{
							key:'corporationCode',value: paramValues.userCorporation
						}],
					cfgShowFilter:true,
					subsidaries : paramValues.subsidaries,
					service : 'payTemplates',
					userMode : paramValues.userMode,
					userCategory : paramValues.userCategory,
					userCorporation : paramValues.userCorporation,
					userCode : paramValues.userCode,
					hiddenValueField : 'selectedPayTemplList',
					hiddenValuePopUpField :'templatePopupSelectedFlag',
					savefnCallback :saveItemsFn,
					urlCallback :serviceURLFn
				});
				payTemplSelectPopup.center();
				payTemplSelectPopup.show();
			}
			else{
				payTemplSelectPopup.lastSelectedWidgets = '';
				payTemplSelectPopup.isAllSelected = localIsAllAssigned;
				payTemplSelectPopup.center();
				payTemplSelectPopup.show();
			}
		}
		var filterContainer = payTemplSelectPopup.down('container[itemId="filterContainer"] AutoCompleter');
    	 filterContainer.focus();
		
	},
	showLMSAccountsPopup : function() {
		var me = this;
		var lmsAccountsSelectPopup = null;
		var paramValues = me.getParamValues();
		var localIsAllAssigned = null;
		var pckgId = 'lms_accounts_view';

		lmsAccountsSelectPopup = me.getFilterLmsAccountsView();
		localIsAllAssigned = $('#allLMSAccSelectedFlag').val();
		
		if (Ext.isEmpty(paramValues.userCategory)
				|| paramValues.userCategory == "NONE") {
			me.showCategorySelectionErrorMsg();
		} else {
			if (null == lmsAccountsSelectPopup) {
				lmsAccountsSelectPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
						{
							title :  getLabel('selectAccount','Select Account'),
							isAllSelected : localIsAllAssigned,
							keyNode : 'entitlementName',
							itemId : pckgId,
							checkboxId:'chkAllLMSAccSelectedFlag',
							displayCount:false,
							cls : 'xn-popup',
							width : 735,
							//maxWidth : 735,
							minHeight : 156,
							maxHeight : 550,
							draggable : false,
							resizable : false,
							floating : true,
							cfgModel : {
								pageSize : 5,
								storeModel : {
									fields : ['isAssigned', 'entitlementName',
												'assignmentStatus'],
									proxyUrl : 'services/catAssignedServiceDataList.json',
									rootNode : 'd.details',
									totalRowsNode : 'd.__count'
							      },
							columnModel : [{
								colId : 'entitlementName',
								colDesc : getLabel('accountNo','Account No'),
								colHeader :  getLabel('accountNo','Account No'),
								sortable : true,
								width : 275
							}, {
								colId : 'assignmentStatus',
								colDesc : getLabel('status','Status'),
								colHeader : getLabel('status','Status'),
								sortable : false,
								width : 275
								}]
							   },
							
							//cfgFilterLabel:'LMS Accounts',
							autoCompleterEmptyText : getLabel('searchByAccNumberOrName','Search by Account No Or Name'),
							cfgAutoCompleterUrl:'catAssignedServiceDataList',
							cfgUrl:'services/{0}.json',
							paramName:'filterName',
							dataNode:'entitlementName',
							rootNode : 'd.details',
							autoCompleterExtraParam:
								[{
									key:'categoryCode',value: paramValues.userCategory
								},{
									key:'userCode',value: paramValues.userCode
								},{
									key:'subsidaries',value: paramValues.subsidaries
								},{
									key:'corporationCode',value: paramValues.userCorporation
								},{
									key:'module',value: '04'
								},{
									key:'service',value: 'A'
								}],
							cfgShowFilter:true,
							subsidaries : paramValues.subsidaries,
							service : 'lmsAccounts',
							userMode : paramValues.userMode,
							userCategory : paramValues.userCategory,
							userCorporation : paramValues.userCorporation,
							userCode : paramValues.userCode,
							module : '04',
							hiddenValueField : 'selectedLMSAccList',
							hiddenValuePopUpField :'lmsAccountsPopupSelectedFlag',
							savefnCallback :saveItemsFn,
							urlCallback :serviceURLFn
						});
				lmsAccountsSelectPopup.center();
				lmsAccountsSelectPopup.show();
					}
					else{
						lmsAccountsSelectPopup.lastSelectedWidgets = '';
						lmsAccountsSelectPopup.isAllSelected = localIsAllAssigned;
						lmsAccountsSelectPopup.center();
						lmsAccountsSelectPopup.show();
					}
		}
	},
	showSweepListPopup : function() {
		var me = this;
		var sweepListSelectPopup = null;
		var localIsAllAssigned = null;
		var paramValues = me.getParamValues();
		var userCategory = document.getElementById('usrCategory').value;

		var pckgId = 'sweep_list_view';

		sweepListSelectPopup = me.getFilterSweepAgreementView();
		localIsAllAssigned = $('#allSweepAgreeSelectedFlag').val();
			if (null == sweepListSelectPopup) {
			sweepListSelectPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
				{
					title : getLabel('selectAgreement','Select Agreement'),
					isAllSelected : localIsAllAssigned,
					keyNode : 'entitlementName',
					itemId : pckgId,
					checkboxId:'chkAllSweepAgreeSelectedFlag',
					displayCount:false,
					cls : 'xn-popup',
					width : 735,
					//maxWidth : 735,
					minHeight : 156,
					maxHeight : 550,
					draggable : false,
					resizable : false,
					floating : true,
					cfgModel : {
					    pageSize : 5,
						storeModel : {
							fields : [ 'templateReference', 'entitlementType',
									'entitlementName', 'entitlementCode',
									'isAssigned', 'assignmentStatus' ],
							proxyUrl : 'services/catAssignedSweepList.json',
							rootNode : 'd.details',
							totalRowsNode : 'd.__count'
					      },
					columnModel : [{
							colId : 'templateReference',
							colDesc : getLabel('agreementCode','Agreement Code'),
							colHeader :getLabel('agreementCode','Agreement Code'),
							width : 180,
							sortable : true
						}, {
							colId : 'entitlementType',
							colDesc : getLabel('agreementName','Agreement Name'),
							colHeader : getLabel('agreementName','Agreement Name'),
							width : 180,
							sortable : true
						},{
							colId : 'assignmentStatus',
							colDesc : getLabel('status','Status'),
							colHeader : getLabel('status','Status'),
							width : 180,
							sortable : false
						}]
					   },
					
					//cfgFilterLabel:'Sweep Agreements',
					autoCompleterEmptyText :getLabel('searchByAgreementCode','Search by Agreement Code'),
					cfgAutoCompleterUrl:'catAssignedSweepList',
					cfgUrl:'services/{0}.json',
					paramName:'filterName',
					dataNode:'templateReference',
					rootNode : 'd.details',
					autoCompleterExtraParam:
						[{
							key:'categoryCode',value: paramValues.userCategory
						},{
							key:'userCode',value: paramValues.userCode
						},{
							key:'subsidaries',value: paramValues.subsidaries
						},{
							key:'corporationCode',value: paramValues.userCorporation
						}],
					cfgShowFilter:true,
					subsidaries : paramValues.subsidaries,
					service : 'sweepList',
					userMode : paramValues.userMode,
					userSeller:paramValues.userSeller,
					userCategory : paramValues.userCategory,
					userCorporation : paramValues.userCorporation,
					userCode : paramValues.userCode,
					hiddenValueField : 'selectedSweepList',
					hiddenValuePopUpField :'sweepAgreementPopupSelectedFlag',
					savefnCallback :saveItemsFn,
					urlCallback :serviceURLFn
				});
			sweepListSelectPopup.center();	
			sweepListSelectPopup.show();
				
			}
			else{
				sweepListSelectPopup.lastSelectedWidgets = '';
				sweepListSelectPopup.isAllSelected = localIsAllAssigned;
				sweepListSelectPopup.center();
				sweepListSelectPopup.show();
			}
			var filterContainer = sweepListSelectPopup.down('container[itemId="filterContainer"] AutoCompleter');
	    	 filterContainer.focus();
	},
	showNotionalListPopup : function() {
		var me = this;
		var notionalListSelectPopup = null;
		var localIsAllAssigned = null;
		var paramValues = me.getParamValues();
		var userCategory = document.getElementById('usrCategory').value;

		var pckgId = 'notional_list_view';

		notionalListSelectPopup = me.getFilterNotionalAgreementView();
		localIsAllAssigned = $('#allNotionalAgreeSelectedFlag').val();
			if (null == notionalListSelectPopup) {
			notionalListSelectPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
				{
					title : getLabel('selectAgreement','Select Agreement'),
					isAllSelected : localIsAllAssigned,
					keyNode : 'entitlementName',
					itemId : pckgId,
					checkboxId:'chkAllNotionalAgreeSelectedFlag',
					displayCount:false,
					cls : 'xn-popup',
					width : 735,
					//maxWidth : 735,
					minHeight : 156,
					maxHeight : 550,
					draggable : false,
					resizable : false,
					floating: true,
					cfgModel : {
					     pageSize : 5,
						storeModel : {
							fields : [ 'templateReference', 'entitlementType',
									'entitlementName', 'entitlementCode', 
									'isAssigned', 'assignmentStatus'  ],
							proxyUrl : 'services/catAssignedNotionalList.json',
							rootNode : 'd.details',
							totalRowsNode : 'd.__count'
					      },
					columnModel : [{
							colId : 'templateReference',
							colDesc : getLabel('agreementCode','Agreement Code'),
							colHeader :getLabel('agreementCode','Agreement Code'),
							width : 180,
							sortable : true
						}, {
							colId : 'entitlementType',
							colDesc : getLabel('agreementName','Agreement Name'),
							colHeader :getLabel('agreementName','Agreement Name'),
							width : 180,
							sortable : true
						},{
							colId : 'assignmentStatus',
							colDesc : getLabel('status','Status'),
							colHeader :getLabel('status','Status'),
							width : 180,
							sortable : false
						}]
					   },
					
					//cfgFilterLabel:'Notional Agreements',
					autoCompleterEmptyText : getLabel('searchByAgreementCode','Search by Agreement Code'),
					cfgAutoCompleterUrl:'catAssignedNotionalList',
					cfgUrl:'services/{0}.json',
					paramName:'filterName',
					dataNode:'templateReference',
					rootNode : 'd.details',
					autoCompleterExtraParam:
						[{
							key:'categoryCode',value: paramValues.userCategory
						},{
							key:'userCode',value: paramValues.userCode
						},{
							key:'subsidaries',value :paramValues.subsidaries
						},{
							key:'corporationCode',value: paramValues.userCorporation
						}],
					cfgShowFilter:true,
					subsidaries : paramValues.subsidaries,
					service : 'notionalList',
					userMode : paramValues.userMode,
					userSeller:paramValues.userSeller,
					userCategory : paramValues.userCategory,
					userCorporation : paramValues.userCorporation,
					userCode : paramValues.userCode,
					hiddenValueField : 'selectedNotionalList',
					hiddenValuePopUpField :'notionalAgreementPopupSelectedFlag',
					savefnCallback :saveItemsFn,
					urlCallback :serviceURLFn
				});	
					notionalListSelectPopup.show();
					notionalListSelectPopup.center();
				
			}
			else{
				notionalListSelectPopup.lastSelectedWidgets = '';
				notionalListSelectPopup.isAllSelected = localIsAllAssigned;
				notionalListSelectPopup.show();
				notionalListSelectPopup.center();
			}
			var filterContainer = notionalListSelectPopup.down('container[itemId="filterContainer"] AutoCompleter');
	    	 filterContainer.focus();
	//	}
	},
	showSCMProductPopup : function() {
		var me = this;
		var scmProductsSelectPopup = null;
		var paramValues = me.getParamValues();
		var localIsAllAssigned = null;

		var pckgId = 'scm_products_view';

		scmProductsSelectPopup = me.getFilterScmProductsView();
		localIsAllAssigned = $('#allSCMProductSelectedFlag').val();

		if (Ext.isEmpty(paramValues.userCategory)
				|| paramValues.userCategory == "NONE") {
			me.showCategorySelectionErrorMsg();
		} else {
			if (null == scmProductsSelectPopup) {
			scmProductsSelectPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
				{
					title :  getLabel('searchBySCMProduct','Select SCF Package'),
					isAllSelected : localIsAllAssigned,
					keyNode : 'entitlementName,subsidiriesList',
					itemId : pckgId,
					checkboxId:'chkAllSCMProductSelectedFlag',
					displayCount:false,
					cls : 'xn-popup',
					width : 735,
					//maxWidth : 735,
					minHeight : 156,
					maxHeight : 550,
					draggable : false,
					resizable : false,
					floating : true,
					cfgModel : {
					    pageSize : 5,
						storeModel : {
							fields : ['isAssigned', 'packageDescription',
									'assignmentStatus', 'entitlementName',
									'anchorClientDescription','subsidiriesList'],
						proxyUrl : 'services/catAssignedServiceDataList.json',
						rootNode : 'd.details',
						totalRowsNode : 'd.__count'
					      },
					columnModel : [{
							colId : 'packageDescription',
							colDesc : getLabel('scmProduct','SCF Package'),
							colHeader : getLabel('scmProduct','SCF Package'),
							width : 180,
							sortable : true
						},{
							colId : 'anchorClientDescription',
							colDesc : getLabel('anchorClient','Anchor Client'),
							colHeader : getLabel('anchorClient','Anchor Client'),
							width : 180,
							sortable : false
						}, {
							colId : 'assignmentStatus',
							colDesc : getLabel('status','Status'),
							colHeader : getLabel('status','Status'),
							width : 180,
							sortable : false
						}]
					   },
					//cfgFilterLabel:'SCM Product',
					autoCompleterEmptyText : getLabel('searchBySCMProduct','Search By SCF Package'),
					cfgAutoCompleterUrl:'catAssignedServiceDataList',
					cfgUrl:'services/{0}.json',
					paramName:'filterName',
					dataNode:'packageDescription',
					rootNode : 'd.details',
					autoCompleterExtraParam:
						[{
							key:'categoryCode',value: paramValues.userCategory
						},{
							key:'userCode',value: paramValues.userCode
						},{
							key:'subsidaries',value: paramValues.subsidaries
						},{
							key:'corporationCode',value: paramValues.userCorporation
						},{
							key:'module',value: '06'
						},{
							key:'service',value: 'P'
						}],
					cfgShowFilter:true,
					subsidaries : paramValues.subsidaries,
					service : 'packages',
					userMode : paramValues.userMode,
					userCategory : paramValues.userCategory,
					userCorporation : paramValues.userCorporation,
					userCode : paramValues.userCode,
					module : '06',
					hiddenValueField : 'selectedSCMProductList',
					hiddenValuePopUpField :'scmProductPopupSelectedFlag',
					savefnCallback :saveItemsFn,
					urlCallback :serviceURLFn
				});
				scmProductsSelectPopup.show();
				scmProductsSelectPopup.focus();
			}
			else{
				scmProductsSelectPopup.lastSelectedWidgets = '';
				scmProductsSelectPopup.isAllSelected = localIsAllAssigned;
				scmProductsSelectPopup.show();
			}
		}
	},
	showTradePackageListPopup : function(modulePassed){
		var me = this;
		var localIsAllAssigned = null;
		var tradePackageSelectPopup = null;
		var paramValues = me.getParamValues();

		var pckgId = 'trade_package_view';

		tradePackageSelectPopup = me.getFilterTradePackageView();
		localIsAllAssigned = $('#allTradePackagesSelectedFlag').val();

		if (Ext.isEmpty(paramValues.userCategory)
				|| paramValues.userCategory == "NONE") {
			me.showCategorySelectionErrorMsg();
		} else {
			if (null == tradePackageSelectPopup) {
			tradePackageSelectPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
				{
					title :  getLabel('selectTradePackage','Select Trade Package'),
					isAllSelected : localIsAllAssigned,
					keyNode : 'entitlementName,subsidiriesList',
					itemId : pckgId,
					checkboxId:'chkAllTradePackagesSelectedFlag',
					displayCount:false,
					cls : 'xn-popup',
					width : 735,
					//maxWidth : 735,
					minHeight : 156,
					maxHeight : 550,
					draggable : false,
					resizable : false,
					floating : true,
					cfgModel : {
					    pageSize : 5,
						storeModel : {
							fields : ['isAssigned', 'entitlementName',
							'assignmentStatus', 'packageDescription',
							'clientDescription','subsidiriesList'],
						proxyUrl : 'services/catAssignedServiceDataList.json',
						rootNode : 'd.details',
						totalRowsNode : 'd.__count'
					      },
					columnModel : [{
							colId : 'packageDescription',
							colDesc : getLabel('package','Package'),
							colHeader : getLabel('package','Package'),
							width : 180,
							sortable : true
						}, {
							colId : 'clientDescription',
							colDesc :  getLabel('grid.column.company','Company Name'),
							colHeader :  getLabel('grid.column.company','Company Name'),
							width : 180,
							sortable : true
						},{
							colId : 'assignmentStatus',
							colDesc : getLabel('status','Status'),
							colHeader :getLabel('status','Status'),
							width : 180,
							sortable : false
						}]
					   },
					
					//cfgFilterLabel:'Packages',
					autoCompleterEmptyText : getLabel('searchByPackage','Search By Package'),
					cfgAutoCompleterUrl:'catAssignedServiceDataList',
					cfgUrl:'services/{0}.json',
					paramName:'filterName',
					dataNode:'packageDescription',
					rootNode : 'd.details',
					autoCompleterExtraParam:
						[{
							key:'categoryCode',value: paramValues.userCategory
						},{
							key:'userCode',value: paramValues.userCode
						},{
							key:'subsidaries',value: paramValues.subsidaries
						},{
							key:'corporationCode',value: paramValues.userCorporation
						},{
							key:'module',value: modulePassed
						},{
							key:'service',value: 'P'
						}],
					cfgShowFilter:true,
					subsidaries : paramValues.subsidaries,
					service : 'packages',
					userMode : paramValues.userMode,
					userCategory : paramValues.userCategory,
					userCorporation : paramValues.userCorporation,
					userCode : paramValues.userCode,
					module : modulePassed,
					hiddenValueField : 'selectedTradePackageList',
					hiddenValuePopUpField :'tradePackagePopupSelectedFlag',
					savefnCallback :saveItemsFn,
					urlCallback :serviceURLFn
				});
				tradePackageSelectPopup.show();
				tradePackageSelectPopup.focus();
			}
			else{
				tradePackageSelectPopup.lastSelectedWidgets = '';
				tradePackageSelectPopup.isAllSelected = localIsAllAssigned;
				tradePackageSelectPopup.show();
			}
		}
	},
	showForecastPackageListPopup : function(modulePassed){
		var me = this;
		var forecastPackageSelectPopup = null;
		var paramValues = me.getParamValues();
		var localIsAllAssigned = null;

		var pckgId = 'forecast_Package_view';

		forecastPackageSelectPopup = me.getFilterForecastPackageView();
		localIsAllAssigned = $('#allForecastPackagesSelectedFlag').val();

		if (Ext.isEmpty(paramValues.userCategory)
				|| paramValues.userCategory == "NONE") {
			me.showCategorySelectionErrorMsg();
		} else {
			if (null == forecastPackageSelectPopup) {
			forecastPackageSelectPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
				{
					title : getLabel('selectForecastPackage','Select Forecast Package'),
					isAllSelected : localIsAllAssigned,
					keyNode : 'entitlementName,subsidiriesList',
					itemId : pckgId,
					checkboxId:'chkAllForecastPackagesSelectedFlag',
					displayCount:false,
					cls : 'xn-popup',
					width : 735,
					//maxWidth : 735,
					minHeight : 156,
					maxHeight : 550,
					draggable : false,
					resizable : false,
					floating : true,
					cfgModel : {
					    pageSize : 5,
						storeModel : {
							fields : ['isAssigned', 'entitlementName',
							'assignmentStatus', 'packageDescription',
							'clientDescription','subsidiriesList'],
						proxyUrl : 'services/catAssignedServiceDataList.json',
						rootNode : 'd.details',
						totalRowsNode : 'd.__count'
					      },
					columnModel : [{
							colId : 'packageDescription',
							colDesc : getLabel('package','Package'),
							colHeader : getLabel('package','Package'),
							width : 180,
							sortable : true
						},{
							colId : 'clientDescription',
							colDesc :  getLabel('grid.column.company','Company Name'),
							colHeader :  getLabel('grid.column.company','Company Name'),
							width : 180,
							sortable : true
						},{
							colId : 'assignmentStatus',
							colDesc : getLabel('status','Status'),
							colHeader : getLabel('status','Status'),
							width : 180,
							sortable : false
						}]
					   },
					
					//cfgFilterLabel:'Packages',
					autoCompleterEmptyText : getLabel('searchByPackage','Search By Package'),
					cfgAutoCompleterUrl:'catAssignedServiceDataList',
					cfgUrl:'services/{0}.json',
					paramName:'filterName',
					dataNode:'packageDescription',
					rootNode : 'd.details',
					autoCompleterExtraParam:
						[{
							key:'categoryCode',value: paramValues.userCategory
						},{
							key:'userCode',value: paramValues.userCode
						},{
							key:'subsidaries',value: paramValues.subsidaries
						},{
							key:'corporationCode',value: paramValues.userCorporation
						},{
							key:'module',value: modulePassed
						},{
							key:'service',value: 'P'
						}],
					cfgShowFilter:true,
					subsidaries : paramValues.subsidaries,
					service : 'packages',
					userMode : paramValues.userMode,
					userCategory : paramValues.userCategory,
					userCorporation : paramValues.userCorporation,
					userCode : paramValues.userCode,
					module : modulePassed,
					hiddenValueField : 'selectedForecastPackageList',
					hiddenValuePopUpField :'forecastPackagePopupSelectedFlag',
					savefnCallback :saveItemsFn,
					urlCallback :serviceURLFn
				});
				forecastPackageSelectPopup.show();
				forecastPackageSelectPopup.focus();
			}
			else{
				forecastPackageSelectPopup.lastSelectedWidgets = '';
				forecastPackageSelectPopup.isAllSelected = localIsAllAssigned;
				forecastPackageSelectPopup.show();
			}
		}
	},
	showUserUserAuthMatrixPopup : function() {
		var me = this;
		var userAuthMatrixSelectPopup = null;
		var paramValues = me.getParamValues();
		var localIsAllAssigned = null;
		var pckgId = 'user_authmatrix_view';
		
		userAuthMatrixSelectPopup = me.getFilterAuthMatrixView();
		localIsAllAssigned = $('#allUserAuthMatrixSelectedFlag').val();
		
		if (Ext.isEmpty(paramValues.userCategory)
				|| paramValues.userCategory == "NONE") {
			me.showCategorySelectionErrorMsg();
		}
		else if (Ext.isEmpty(paramValues.subsidaries)) {
			me.showSubsidiarySelectionErrorMsg();
		}
		else 
		{
			me.deleteUnassignedClientRecords('selectedUserAuthMatrixList','axmClient');
			userAuthMatrixSelectPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
				{
					title : getLabel('selectApprovalMatrix','Select Approval Matrix'),
					isAllSelected : localIsAllAssigned,
					width : 735,
					y:250,
					closeAction:'destroy',
					keyNode : 'axmCode,axmClient',
					itemId : pckgId,
					checkboxId:'chkAllUserAuthMatrixSelectedFlag',
					cls : 'xn-popup',
					listeners: {
		                 'hide': function(){
		                    this.destroy();
		                 },
		                 'resize' : function(){
		                 	this.center();
		                 }
					 },
					displayCount:false,
					draggable : false,
					resizable : false,
					floating : true,
					cfgModel : {
						pageSize : 5,
						storeModel : {
					    fields : ['axmCode', 'axmName',
							'axmClient', 'axmClientName'],
						proxyUrl : 'services/userAuthMatrixList.json',
						rootNode : 'd.details',
						totalRowsNode : 'd.__count'
					      },
					columnModel : [{
							colId : 'axmName',
							colDesc : getLabel('approvalMatrixName','Approval Matrix Name'),
							colHeader :getLabel('approvalMatrixName','Approval Matrix Name'),
							width : 275,
							sortable : true
						},{
							colId : 'axmClientName',
							colDesc : getLabel('grid.column.company','Company Name'),
							colHeader : getLabel('grid.column.company','Company Name'),
							width : 275,
							sortable : true
						}]
					   },
					autoCompleterEmptyText : getLabel('searchByMatrixName','Search By Matrix Name'),
					cfgAutoCompleterUrl:'userAuthMatrixList',
					cfgUrl:'services/{0}.json',
					paramName:'filterName',
					dataNode:'axmName',
					rootNode : 'd.details',
					autoCompleterExtraParam:
						[{
							key:'categoryCode',value: paramValues.userCategory
						},{
							key:'userCode',value: paramValues.userCode
						},{
							key:'subsidaries',value: paramValues.subsidaries
						},{
							key:'corporationCode',value: paramValues.userCorporation
						}],
					cfgShowFilter:true,
					subsidaries : paramValues.subsidaries,
					service : 'authMatrixList',
					userMode : paramValues.userMode,
					userCategory : paramValues.userCategory,
					userCorporation : paramValues.userCorporation,
					userCode : paramValues.userCode,
					hiddenValueField : 'selectedUserAuthMatrixList',
					hiddenValuePopUpField :'userAuthMatrixSelectedFlag',
					savefnCallback :saveItemsFn,
					urlCallback :serviceURLFn
				});
			userAuthMatrixSelectPopup.show();
			userAuthMatrixSelectPopup.center();
		}
	},
	showCategorySelectionErrorMsg : function() {
		Ext.Msg.show({
					title : getLabel('errorTitle','Error'),
					msg : getLabel('selectCategory','Select Category Value'),
					width : 300,
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.ERROR
				});
	},
	showSubsidiarySelectionErrorMsg : function() {
		Ext.Msg.show({
					title : getLabel('errorTitle','Error'),
					msg : getLabel('selectSubsidiay','Select Subsidiary'),
					width : 300,
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.ERROR
				});
	},
	deleteUnassignedClientRecords : function(selectedRecordId,clientKeyNode) {
		var me = this;
		var selectedRecords = document.getElementById(selectedRecordId).value;
		var arrClients =  me.getParamValues().subsidaries;
		var resultSelected = new Array();
		var resultDeSelected = new Array();
		var jsonData = {};
		if(arrClients.charAt(arrClients.length-1) == ",")
		{
			arrClients = arrClients.slice(0,-1);
		}
		arrClients = arrClients.split(",");
		
		if(!Ext.isEmpty(selectedRecords))
		{
			var savedData = null;
			 savedData = Ext.decode(selectedRecords);
			 if(!Ext.isEmpty(savedData))
			 {
				var selectedRecords = savedData["selectedRecords"];
				var deSelectedRecords = savedData["deSelectedRecords"];
				if(!Ext.isEmpty(selectedRecords))
				{
					for(var i = 0; i < selectedRecords.length; i++)
					{
						if(arrClients.indexOf(selectedRecords[i][clientKeyNode]) != -1)
						{
							resultSelected.push(selectedRecords[i]);
						}
					}
					
				}
				if(!Ext.isEmpty(deSelectedRecords))
				{
					for(var i = 0; i < deSelectedRecords.length; i++)
					{
						if(arrClients.indexOf(deSelectedRecords[i][clientKeyNode]) != -1)
						{
							resultDeSelected.push(deSelectedRecords[i]);
						}
					}
				}
				jsonData["selectedRecords"] = resultSelected;
				jsonData["deSelectedRecords"] = resultDeSelected;
				document.getElementById(selectedRecordId).value = Ext.encode(jsonData);
			 }
		}
	}
});