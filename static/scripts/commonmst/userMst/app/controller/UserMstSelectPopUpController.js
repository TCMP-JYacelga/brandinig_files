Ext.define('GCP.controller.UserMstSelectPopUpController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.ux.gcp.FilterPopUpView'],
	refs : [
			{
				ref : 'filterPackageView',
				selector : 'filterPopUpView[itemId=pay_package_view]'
			}, {
				ref : 'filterAccountsView',
				selector : 'filterPopUpView[itemId=pay_accounts_view]'
			},
			{
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
					
			if(checkValue.getAttribute('src').indexOf('/icon_unchecked')!=-1){
			var records = grid.selectedRecordList;
			console.log(records);
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
		
		me.control({});
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
					title : 'Select Package',
					isAllSelected : localIsAllAssigned,
					keyNode : 'entitlementName,subsidiriesList',
					itemId : pckgId,
					checkboxId:'chkAllPayPckgsSelectedFlag',
					displayCount:false,
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
							colDesc : 'Package',
							colHeader : 'Package',
							sortable : true
						}, {
							colId : 'assignmentStatus',
							colDesc : 'Status',
							colHeader : 'Status',
							sortable : false
						}, {
							colId : 'clientDescription',
							colDesc : 'Company Name',
							colHeader : 'Company Name',
							sortable : true
						}]
					   },
					
					cfgFilterLabel:poplbl,
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
					hiddenValueField : hiddenFieldFlag,
					hiddenValuePopUpField :hiddenFieldPopUpFlag,
					savefnCallback :saveItemsFn,
					urlCallback :serviceURLFn
					
				});
		pckgSelectPopup.show();
	}
	else{
		pckgSelectPopup.lastSelectedWidgets = '';
		pckgSelectPopup.isAllSelected = localIsAllAssigned;
		pckgSelectPopup.show();
	}

		}
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
					title :  'Select Accounts',
					isAllSelected : localIsAllAssigned,
					keyNode : 'entitlementName,subsidiriesList',
					itemId : pckgId,
					checkboxId:'chkAllPayAccSelectedFlag',
					displayCount:false,
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
							colDesc : 'Account No',
							colHeader : 'Account No',
							sortable : true
						}, 
						{
							colId : 'accountName',
							colDesc : 'Account Name',
							colHeader : 'Account Name'
						},
						{
							colId : 'assignmentStatus',
							colDesc : 'Status',
							colHeader : 'Status',
							sortable : false
						}, {
							colId : 'clientDescription',
							colDesc : 'Company Name',
							colHeader : 'Company Name',
							sortable : true
						}]
					   },
					
					   cfgFilterLabel:poplbl,
					   cfgAutoCompleterUrl:'catAssignedServiceDataList',
					   cfgUrl:'services/{0}.json',
					   paramName:'filterName',
					   dataNode:'entitlementName',
					   dataNode2:'accountName',
					   delimiter:'| ',
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
				payAccSelectPopup.show();
			} else {
				payAccSelectPopup.lastSelectedWidgets = '';
				payAccSelectPopup.isAllSelected = localIsAllAssigned;
				payAccSelectPopup.show();
			}
			
			
		}
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
					title :  'Select Accounts',
					isAllSelected : localIsAllAssigned,
					keyNode : 'entitlementName,subsidiriesList',
					itemId : pckgId,
					checkboxId:'chkAllBrAccSelectedFlag',
					displayCount:false,
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
							colDesc : 'Account No',
							colHeader : 'Account No',
							sortable : true
						},
						{
							colId : 'accountName',
							colDesc : 'Account Name',
							colHeader : 'Account Name'
						},
						{
							colId : 'assignmentStatus',
							colDesc : 'Status',
							colHeader : 'Status',
							sortable : false
						}, {
							colId : 'clientDescription',
							colDesc : 'Company Name',
							colHeader : 'Company Name',
							sortable : true
						}]
					   },
					
					cfgFilterLabel:'BR Account',
					cfgAutoCompleterUrl:'catAssignedServiceDataList',
					cfgUrl:'services/{0}.json',
					paramName:'filterName',
					dataNode:'entitlementName',
					dataNode2:'accountName',
					delimiter:' |',
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
	}
	else{
		brAccSelectPopup.lastSelectedWidgets = '';
		brAccSelectPopup.isAllSelected = localIsAllAssigned;
		brAccSelectPopup.show();
	}
		}
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
					title : 'Select eStatement Accounts',
					isAllSelected : localIsAllAssigned,
					keyNode : 'entitlementName,subsidiriesList',
					itemId : pckgId,
					checkboxId:'chkAllPortalAccSelectedFlag',
					displayCount:false,
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
							colDesc : 'Account No',
							colHeader : 'Account No',
							sortable : true
						}, {
							colId : 'assignmentStatus',
							colDesc : 'Status',
							colHeader : 'Status',
							sortable : false
						}, {
							colId : 'clientDescription',
							colDesc : 'Company Name',
							colHeader : 'Company Name',
							sortable : true
						}]
					   },
					
					cfgFilterLabel:'eStatement Accounts',
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
		portalAccSelectPopup.show();
	}
	else{
		portalAccSelectPopup.lastSelectedWidgets = '';
		portalAccSelectPopup.isAllSelected = localIsAllAssigned;
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
					title : 'Select Templates',
					isAllSelected : localIsAllAssigned,
					keyNode : 'entitlementName',
					itemId : pckgId,
					checkboxId:'chkAllPayTemplatesSelectedFlag',
					displayCount:false,
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
							colDesc : 'Template Name',
							colHeader : 'Template Name',
							sortable : true
						}, {
							colId : 'assignmentStatus',
							colDesc : 'Status',
							colHeader : 'Status',
							sortable : false
						}, {
							colId : 'clientDescription',
							colDesc : 'Company Name',
							colHeader : 'Company Name',
							sortable : true
						}]
					   },
					
					cfgFilterLabel:'Payment Template',
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
				payTemplSelectPopup.show();
			}
			else{
				payTemplSelectPopup.lastSelectedWidgets = '';
				payTemplSelectPopup.isAllSelected = localIsAllAssigned;
				payTemplSelectPopup.show();
			}
		}
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
							title :  'Select Account',
							isAllSelected : localIsAllAssigned,
							keyNode : 'entitlementName',
							itemId : pckgId,
							checkboxId:'chkAllLMSAccSelectedFlag',
							displayCount:false,
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
								colDesc : 'Account No',
								colHeader : 'Account No',
								sortable : true
							}, {
								colId : 'assignmentStatus',
								colDesc : 'Status',
								colHeader : 'Status',
								sortable : false
								}]
							   },
							
							cfgFilterLabel:'LMS Accounts',
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
				lmsAccountsSelectPopup.show();
					}
					else{
						lmsAccountsSelectPopup.lastSelectedWidgets = '';
						lmsAccountsSelectPopup.isAllSelected = localIsAllAssigned;
						lmsAccountsSelectPopup.show();
					}
		}
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
					title :  'Select Agreements',
					isAllSelected : localIsAllAssigned,
					keyNode : 'entitlementName',
					itemId : pckgId,
					checkboxId:'chkAllNotionalAgreeSelectedFlag',
					displayCount:false,
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
							colDesc : 'Agreement Code',
							colHeader : 'Agreement Code',
							sortable : true,
							width : 120
						}, {
							colId : 'entitlementType',
							colDesc : 'Agreement Name',
							colHeader : 'Agreement Name',
							sortable : true,
							width : 150
						},{
							colId : 'assignmentStatus',
							colDesc : 'Status',
							colHeader : 'Status',
							sortable : false
						}]
					   },
					
					cfgFilterLabel:'Notional Agreements',
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
					userCategory : paramValues.userCategory,
					userCorporation : paramValues.userCorporation,
					userCode : paramValues.userCode,
					hiddenValueField : 'selectedNotionalList',
					hiddenValuePopUpField :'notionalAgreementPopupSelectedFlag',
					savefnCallback :saveItemsFn,
					urlCallback :serviceURLFn
				});
				notionalListSelectPopup.show();
			}
			else{
				notionalListSelectPopup.lastSelectedWidgets = '';
				notionalListSelectPopup.isAllSelected = localIsAllAssigned;
				notionalListSelectPopup.show();
			}
	//	}
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
					title :  'Select Agreements',
					isAllSelected : localIsAllAssigned,
					keyNode : 'entitlementName',
					itemId : pckgId,
					checkboxId:'chkAllSweepAgreeSelectedFlag',
					displayCount:false,
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
							colDesc : 'Agreement Code',
							colHeader : 'Agreement Code',
							sortable : true,
							width : 120
						}, {
							colId : 'entitlementType',
							colDesc : 'Agreement Name',
							colHeader : 'Agreement Name',
							sortable : true,
							width : 150
						},{
							colId : 'assignmentStatus',
							colDesc : 'Status',
							colHeader : 'Status',
							sortable : false
						}]
					   },
					
					cfgFilterLabel:'Sweep Agreements',
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
					userCategory : paramValues.userCategory,
					userCorporation : paramValues.userCorporation,
					userCode : paramValues.userCode,
					hiddenValueField : 'selectedSweepList',
					hiddenValuePopUpField :'sweepAgreementPopupSelectedFlag',
					savefnCallback :saveItemsFn,
					urlCallback :serviceURLFn
				});
				sweepListSelectPopup.show();
			}
			else{
				sweepListSelectPopup.lastSelectedWidgets = '';
				sweepListSelectPopup.isAllSelected = localIsAllAssigned;
				sweepListSelectPopup.show();
			}
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
					title :  'Select SCM Product',
					isAllSelected : localIsAllAssigned,
					keyNode : 'entitlementName,subsidiriesList',
					itemId : pckgId,
					checkboxId:'chkAllSCMProductSelectedFlag',
					displayCount:false,
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
							colDesc : 'SCM Product',
							colHeader : 'SCM Product',
							sortable : true
						},{
							colId : 'anchorClientDescription',
							colDesc : 'Anchor Client',
							colHeader : 'Anchor Client',
							sortable : false
						}, {
							colId : 'assignmentStatus',
							colDesc : 'Status',
							colHeader : 'Status',
							sortable : false
						}]
					   },
					
					cfgFilterLabel:'SCM Product',
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
					title : getLabel('selectTradePackage','Select Trade Package'),
					isAllSelected : localIsAllAssigned,
					keyNode : 'entitlementName,subsidiriesList',
					itemId : pckgId,
					checkboxId:'chkAllTradePackagesSelectedFlag',
					displayCount:false,
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
							sortable : true
						}, {
							colId : 'assignmentStatus',
							colDesc : getLabel('status','Status'),
							colHeader : getLabel('status','Status'),
							sortable : false
						}, {
							colId : 'clientDescription',
							colDesc : getLabel('grid.column.company','Company Name'),
							colHeader : getLabel('grid.column.company','Company Name'),
							sortable : true
						}]
					   },
					
					cfgFilterLabel:'Packages',
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
							sortable : true
						}, {
							colId : 'assignmentStatus',
							colDesc : getLabel('status','Status'),
							colHeader : getLabel('status','Status'),
							sortable : false
						}, {
							colId : 'clientDescription',
							colDesc : getLabel('clientName','Company Name'),
							colHeader : getLabel('clientName','Company Name'),
							sortable : true
						}]
					   },
					
					cfgFilterLabel:getLabel('package','Packages'),
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
			}
			else{
				forecastPackageSelectPopup.lastSelectedWidgets = '';
				forecastPackageSelectPopup.isAllSelected = localIsAllAssigned;
				forecastPackageSelectPopup.show();
			}
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
	}
});