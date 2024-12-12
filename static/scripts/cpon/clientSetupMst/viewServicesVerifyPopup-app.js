var objAdminWidgets = null;
var objAdminActions = null;
var objAdminfeatures = null;
var objAdminMessages = null;
var objBrFeatures = null;
var objBrWidgets = null;
var objBrCPC = null;
var objBrIDayAccounts = null;
var objBrPDayAccounts = null;
var objBrAccounts = null;
var objPaymentFeatures = null;
var objTradeFeatures = null;
var objCollectionFeatures = null;
var objFSCFeatures = null;
var objPaymentWidgets = null;
var objPositivePayWidgets = null;
var objPaymentLinks = null;
var objCollectionWidgets = null;
var objCollectionLinks = null;
var objCompanyIdList = null;
var objFSCLinks = null;
var objFSCWidgets = null;
var objLMSLinks = null;
var objLMSWidgets = null;
var objLiquidityfeatures = null;
var objForecastWidgets = null;
var objForecastWidgets = null;
var objForecastFeatures = null;
var objTradeWidgets = null;
var objTradeLinks = null;
var objDepositWidgets = null;
var objLoanWidgets = null;
var objCheckWidgets = null;
var saveItemsFn=null;
var serviceURLFn=null;

/*lms view*/
var objLmsSweepCurrency=null;
var objLmsSweepAccount=null;
var objLmsPoolCurrency=null;
var objLmsPoolAccount=null;
var objLineCodesPopup = null;
Ext.Loader.setConfig({
	enabled : true,
	disableCaching : false,
	setPath : {
		'Ext' : 'static/js/extjs4.2.1/src',
		'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
	}
});

Ext.Loader.setPath('GCPView', 'static/scripts/cpon/common');

Ext.application({
	name : 'GCP',
	appFolder : 'static/scripts/cpon/clientSetupMst/app',
	// appFolder : 'app',
	requires : [ 'GCP.view.BRFeaturePopup','Ext.ux.gcp.FilterPopUpView', 'GCPView.view.ForecastFeatuesPopup'],
	launch : function() {
		Ext.Ajax.timeout = 600000;
		serviceURLFn = function (popup) {
            var strUrl="";
            if(popup.featureType === 'C' || popup.featureType === 'A' ){
            	strUrl = '&featureType=' + popup.featureType + '&module='
				+ popup.module + '&profileId=' + popup.profileId + '&productId=' + popup.productId + '&id=' + encodeURIComponent(parentkey);
            }
            else{
            strUrl = '&featureType=' + popup.featureType + '&module='
					+ popup.module + '&profileId=' + popup.profileId + '&id=' + encodeURIComponent(parentkey);
            }
           return strUrl;
          };
          saveItemsFn= function(popup) {
        	  popup.hide();
			};
		objAdminWidgets = getComponent('03',adminFeatureProfileId,'adminWFeaturePopup','W',getLabel('widgetsName','Widget Name'),getLabel('widgetsName','Widget Name'),getLabel('Widgets','Widgets'),getLabel('lbl.serachbywidget','Search by Widget Name'));
		objAdminActions = getComponent('03',adminFeatureProfileId,'adminAFeaturePopup','L',getLabel('actionLinkNm','Action Links Name'),getLabel('actionLinkNm','Action Links Name'),getLabel('actionlinks','Action Links'),getLabel('searchByName', 'Search By Action Link Name'));
	
		objAdminfeatures = Ext.create('GCP.view.ViewPermissionsFeaturePopup', {
			title : getLabel('adminAdvanceOptions', 'Admin Advance Options'),
			height : 300,
			width : 400,
			seekUrl : 'cpon/clientServiceSetup/cponPermissionFeatures',
			featureType : 'P',
			profileId : adminFeatureProfileId,
			module : '03',
			columnName : getLabel('adminFeature', 'Admin Feature')
		});

		objAdminMessages = getComponent('03',adminFeatureProfileId,'adminMFeaturePopup','M',getLabel('adminMessageName','Message Name'),getLabel('adminMessageName','Message Name'),getLabel('adminMessage','Message'),getLabel('searchByMsgname', 'Search By Message Name')); 
		
		objBrWidgets =  getComponent('01',brFeatureProfileId,'brWFeaturePopup','W',getLabel('widgetsName','Widget Name'),getLabel('widgetsName','Widget Name'),getLabel('Widgets','Widgets'),getLabel('lbl.serachbywidget','Search by Widget Name'));
		
		objCPCWidgets =  getComponent('01',brFeatureProfileId,'brTFeaturePopup','T',getLabel('typeCodeCategory', 'Type Code Category'),getLabel('typeCodeCategory', 'Type Code Category'),getLabel('category', 'Category'),getLabel('lbl.serachbytypeCode','Search by Type Code Category'));
		
		objBrLinks = getComponent('01',brFeatureProfileId,'brAFeaturePopup','L',getLabel('actionLinkNm','Action Links Name'),getLabel('actionLinkNm','Action Links Name'),getLabel('actionlinks','Action Links'),getLabel('searchByName', 'Search By Action Link Name'));

		objForecastWidgets =  getComponent('10',forecastFeatureProfileId,'widgetSelectionPopup','W',getLabel('widgetsName','Widget Name'),getLabel('widgetsName','Widget Name'),getLabel('Widgets','Widgets'),getLabel('lbl.serachbywidget','Search by Widget Name'));
		
		objForecastLinks =  getComponent('10',forecastFeatureProfileId,'actionSelectionPopup','L',getLabel('actionLinkNm','Action Links Name'),getLabel('actionLinkNm','Action Links Name'),getLabel('actionlinks','Action Links'),getLabel('searchByName', 'Search By Action Link Name')); 
		
		objTradeWidgets =  getComponent('09',tradeFeatureProfileId,'widgetTSelectionPopup','W',getLabel('widgetsName','Widget Name'),getLabel('widgetsName','Widget Name'),getLabel('Widgets','Widgets'),getLabel('lbl.serachbywidget','Search by Widget Name'));
		
		objTradeLinks =  getComponent('09',tradeFeatureProfileId,'actionTSelectionPopup','L',getLabel('actionLinkNm','Action Links Name'),getLabel('actionLinkNm','Action Links Name'),getLabel('actionlinks','Action Links'),getLabel('searchByName', 'Search By Action Link Name')); 
		
		objBrAccounts =  getComponent('01',brFeatureProfileId,'brAccountFeaturePopup','BA',getLabel('brfeatureAccount','BR Feature Account'),getLabel('brfeatureAccount','BR Feature Account'),getLabel('accounts','Accounts'));
		
		objDepositWidgets = getComponent('16',depositFeatureProfileId,'widgetDSelectionPopup','W',getLabel('widgetsName','Widget Name'),getLabel('widgetsName','Widget Name'),getLabel('Widgets','Widgets'),getLabel('lbl.serachbywidget','Search by Widget Name'));
		
		objLoanWidgets = getComponent('07',loanFeatureProfileId,'widgetLSelectionPopup','W',getLabel('widgetsName','Widget Name'),getLabel('widgetsName','Widget Name'),getLabel('Widgets','Widgets'),getLabel('lbl.serachbywidget','Search by Widget Name'));
		
		objCheckWidgets = getComponent('14',checkFeatureProfileId,'widgetCSelectionPopup','W',getLabel('widgetsName','Widget Name'),getLabel('widgetsName','Widget Name'),getLabel('Widgets','Widgets'),getLabel('lbl.serachbywidget','Search by Widget Name'));
		
		/*lms popup*/
	    objLmsSweepCurrency = getLmsCurrencyComponent('04',liquidityFeatureProfileId,'lmsCurrencyFeaturePopup','C',getLabel('currencies','Currency'),getLabel('currencies','Currency'),getLabel('currencies','Currency'),getLabel('lbl.serachbyCurrency','Search by Currency Name'),LmsSweepFeatureProductId);
		
		objLmsSweepAccount=getLmsAccountComponent('04',liquidityFeatureProfileId,'lmsAccountFeaturePopup','A',getLabel('AccountTypes','Account Types'),getLabel('AccountTypes','Account Types'),getLabel('AccountTypes','Account Types'),getLabel('lbl.serachbyAccount','Search by Account Name'),LmsSweepFeatureProductId);
		
		objLmsPoolCurrency = getLmsCurrencyComponent('04',liquidityFeatureProfileId,'lmsPoolCurrencyFeaturePopup','C',getLabel('currencies','Currency'),getLabel('currencies','Currency'),getLabel('currencies','Currency'),getLabel('lbl.serachbyCurrency','Search by Currency Name'),LmsPoolFeatureProductId);
		
		objLmsPoolAccount=getLmsAccountComponent('04',liquidityFeatureProfileId,'lmsPoolAccountFeaturePopup','A',getLabel('AccountTypes','Account Types'),getLabel('AccountTypes','Account Types'),getLabel('AccountTypes','Account Types'),getLabel('lbl.serachbyAccount','Search by Account Name'),LmsPoolFeatureProductId);
		
		/*end*/
		
		objTradeFeatures = Ext.create('GCP.view.TradeFeaturePopup', {
			itemId : 'tradeFeaturePopup',
			profileId : tradeFeatureProfileId,
			featureType : 'P',
			module : '09',
			title : getLabel('tradeAdvanceOptions', 'Trade Advance Options')
		});
		
		objCollectionFeatures = Ext.create('GCP.view.CollectionFeaturePopup', {
			itemId : 'colFeaturePopup',
			profileId : colFeatureProfileId,
			featureType : 'P',
			module : '05',
			title : getLabel('collectionAdvanceOptions', 'Receivables Advance Options')
		});
		
		objFSCFeatures = Ext.create('GCP.view.FSCFeaturePopup', {
			itemId : 'fscFeaturePopup',
			profileId : fscFeatureProfileId,
			featureType : 'P',
			module : '06',
			title : getLabel('FSCAdvanceOptions', 'SCF Advance Options')
		});

		objPaymentWidgets = getComponent('02',payFeatureProfileId,'payWFeaturePopup','W',getLabel('widgetsName','Widget Name'),getLabel('widgetsName','Widget Name'),getLabel('Widgets','Widgets'),getLabel('lbl.serachbywidget','Search by Widget Name'));
		
		objPositivePayWidgets = getComponent('13',positivePayProfileId,'positivePayWFeaturePopup','W',getLabel('widgetsName','Widget Name'),getLabel('widgetsName','Widget Name'),getLabel('Widgets','Widgets'),getLabel('lbl.serachbywidget','Search by Widget Name'));
		
		objPaymentLinks = getComponent('02',payFeatureProfileId,'payAFeaturePopup','L',getLabel('actionLinkNm','Action Links Name'),getLabel('actionLinkNm','Action Links Name'),getLabel('actionlinks','Action Links'),getLabel('searchByName', 'Search By Action Link Name'));

		objCollectionWidgets = getComponent('05',colFeatureProfileId,'colWFeaturePopup','W',getLabel('widgetsName','Widget Name'),getLabel('widgetsName','Widget Name'),getLabel('widgetsName','Widget Name'),getLabel('lbl.serachbywidget','Search by Widget Name'));
		
		objCollectionLinks = getComponent('05',colFeatureProfileId,'colAFeaturePopup','L',getLabel('actionLinkNm','Action Links Name'),getLabel('actionLinkNm','Action Links Name'),getLabel('actionlinks','Action Links'),getLabel('searchByName', 'Search By Action Link Name'));

		objLiquidityfeatures = Ext.create('GCP.view.ViewLiquidityFeaturePopup', {
			title : getLabel('liquidityAdvanceOptions', 'Liquidity Advance Options'),
			seekUrl : 'cpon/clientServiceSetup/cponPermissionFeatures',
			featureType : 'P',
			profileId : liquidityFeatureProfileId,
			module : '04',
			columnName : getLabel('liquidityFeature', 'Liquidity Feature')
		});
		
		objCompanyIdList = Ext.create('GCP.view.CompanyVerifyPopup');

	}
});

function getComponent(module,profileId,itemId,featureType,colDesc,ColHeader,title,filterLbl)
{
	var component = Ext.create('Ext.ux.gcp.FilterPopUpView', {
		title : title,
		keyNode : 'value',
		itemId : itemId,
		checkboxId:'chkAllWidgetsSelectedFlag',
		displayCount:false,
		profileId :profileId,
		featureType:featureType,
		responseNode :'filter',
		cls : 'non-xn-popup',
		width : 480,
		minHeight : 156,
		maxHeight : 550,
		draggable : false,
		resizable : false,
		autoHeight : false,
		cfgModel : {
		     pageSize : 5,
			storeModel : {
				fields : ['name', 'value','isAssigned','readOnly'],
		proxyUrl : 'cpon/clientServiceSetup/cponFeatures',
		rootNode : 'd.filter',
		totalRowsNode : 'd.count'
		      },
		columnModel : [{
							colDesc : colDesc,
							colId : 'name',
							colHeader : ColHeader,
							width : 330
						}]
		   },
		cfgShowFilter:true,
		autoCompleterEmptyText : filterLbl,
		   cfgAutoCompleterUrl:'cponFeatures',
			cfgUrl:'cpon/clientServiceSetup/{0}',
			paramName:'filterName',
			dataNode:'name',
			rootNode : 'd.filter',
			autoCompleterExtraParam:
				[{
					key:'featureType',value:featureType
				},{
					key:'module',value: module
				},{
					key:'profileId',value: profileId
				},{
					key:'id',value: encodeURIComponent(parentkey)
				}],
		module : module,
		userMode: pagemode,
		savefnCallback :saveItemsFn,
		urlCallback :serviceURLFn,
		listeners : {
			beforeshow : function(t) {
				var br_grid_Container = component.down('container[itemId="gridContainer"]');
				br_grid_Container.maxHeight = 390;
			},
			resize : function(){
				this.center();
			}
		}
	
	});
	return component;
}

function showAdminWidgets(param) {
	if (!Ext.isEmpty(objAdminWidgets)) {
			objAdminWidgets.show();
			objAdminWidgets.center();
	}
}

function showAdminActions(param) {
	if (!Ext.isEmpty(objAdminActions)) {
			objAdminActions.show();
			objAdminActions.center();
	}
}

function showAdminfeatures(param) {
	if (!Ext.isEmpty(objAdminfeatures)) {
		objAdminfeatures.isAllSelected = param;
		objAdminfeatures.show();
		objAdminfeatures.center();
	}
}

function showLiquidityFeatures(param) {
	if(Ext.isEmpty(objLiquidityfeatures)) {
		objLiquidityfeatures = Ext.create('GCP.view.ViewLiquidityFeaturePopup', {
			profileId : liquidityFeatureProfileId,
			viewmode : 'VERIFY'
		});
	}
	if (!Ext.isEmpty(objLiquidityfeatures)) {
		//objLiquidityfeatures.isAllSelected = param;
			objLiquidityfeatures.show();
			objLiquidityfeatures.center();
	}
}

function showAdminMessages(param) {
	if (!Ext.isEmpty(objAdminMessages)) {
			objAdminMessages.show();
			objAdminMessages.center();
	}
}

function showBrFeatures(param) {
	if(Ext.isEmpty(objBrFeatures)) {
		objBrFeatures = Ext.create('GCP.view.BRFeaturePopup', {
			itemId : 'brFeaturePopup',
			featureType : 'P',
			profileId : brFeatureProfileId,
			module : '01'
		});
	}
	if (!Ext.isEmpty(objBrFeatures)) {
		objBrFeatures.isAllSelected = param;
		objBrFeatures.show();
		objBrFeatures.center();
	}
}

function showBrWidgets(param) {
	if (!Ext.isEmpty(objBrWidgets)) {
			objBrWidgets.show();
			objBrWidgets.center();
	}
}

function showBrCPC(param) {
	if (!Ext.isEmpty(objCPCWidgets)) {
			objCPCWidgets.show();
			objCPCWidgets.center();
	}
}

function showBrLinks(param) {
	if (!Ext.isEmpty(objBrLinks)) {
			objBrLinks.show();
			objBrLinks.center();
	}
}


function showForecastWidgets(param) {
	if (!Ext.isEmpty(objForecastWidgets)) {
			objForecastWidgets.show();
			objForecastWidgets.center();
	}
}

function showForecastLinks(param) {
	if (!Ext.isEmpty(objForecastLinks)) {
			objForecastLinks.show();
			objForecastLinks.center();
	}
}

function showForecastFeatures() {
	if(Ext.isEmpty(objForecastFeatures)) {
		objForecastFeatures = Ext.create('GCPView.view.ForecastFeatuesPopup', {
			profileId : forecastFeatureProfileId,
			viewmode : 'VERIFY'
		});
	}
	if (!Ext.isEmpty(objForecastFeatures)) {
		objForecastFeatures.show();
		objForecastFeatures.center();
	}
}

function showTradeWidgets(param) {
	if (!Ext.isEmpty(objTradeWidgets)) {
			objTradeWidgets.show();
			objTradeWidgets.center();
			
	}
}

function showTradeLinks(param) {
	if (!Ext.isEmpty(objTradeLinks)) {
			objTradeLinks.show();
			objTradeLinks.center();
		}
}

function showDepositWidgets(param) {
	if (!Ext.isEmpty(objDepositWidgets)) {
		objDepositWidgets.show();
		objDepositWidgets.center();
	}
}

function showCheckWidgets(param) {
	if (!Ext.isEmpty(objCheckWidgets)) {
		objCheckWidgets.show();
		objCheckWidgets.center();
	}
}

function showLoanWidgets(param) {
	if (!Ext.isEmpty(objLoanWidgets)) {
		objLoanWidgets.show();
		objLoanWidgets.center();
	}
}

function showFSCWidgets(param) {
	if (!Ext.isEmpty(objFSCWidgets)) {
			objFSCWidgets.show();
			objFSCWidgets.center();
	}
	else
	{
		objFSCWidgets = getComponent('06',fscFeatureProfileId,'fscWFeaturePopup','W',getLabel('widgetsName','Widget Name'),getLabel('widgetsName','Widget Name'),getLabel('Widgets','Widgets'),getLabel('lbl.serachbywidget','Search by Widget Name'));
		objFSCWidgets.show();
		objFSCWidgets.center();
	}
}

function showFSCLinks(param) {
		 
	if (!Ext.isEmpty(objFSCLinks)) {
			objFSCLinks.show();
	}
	else
	{
		objFSCLinks = getComponent('06',fscFeatureProfileId,'fscAFeaturePopup','L',getLabel('actionLinkNm','Action Links Name'),getLabel('actionLinkNm','Action Links Name'),getLabel('actionlinks','Action Links'),getLabel('searchByName', 'Search By Action Link Name'));
		objFSCLinks.show();
	}
	objFSCLinks.center();
}
function showBrIDayAccounts(param) {
	if (!Ext.isEmpty(objBrIDayAccounts)) {
			objBrIDayAccounts.show();
	}
}

function showBrAccounts(param) {
	if (!Ext.isEmpty(objBrAccounts)) {
			objBrAccounts.show();
		}
}

function showBrPDayAccounts(param) {
	if (!Ext.isEmpty(objBrPDayAccounts)) {
		if (param == 'N') {
			objBrPDayAccounts.show();
		} else {
			objBrPDayAccounts.setAssigned('Y');
			objBrPDayAccounts.show();
		}
	}
}

function showPaymentFeatures(param) {
	if(Ext.isEmpty(objPaymentFeatures)) {
		objPaymentFeatures = Ext.create('GCP.view.PayFeaturePopup', {
			itemId : 'payFeaturePopup',
			profileId : payFeatureProfileId,
			featureType : 'P',
			module : '02',
			title : getLabel('payAdvanceOptions', 'Payment Advance Options')
		});
	}
	if (!Ext.isEmpty(objPaymentFeatures)) {
		if (param == 'N') {
			objPaymentFeatures.show();
		} else {
			if ('Y' === param) {
				objPaymentFeatures.isAllSelected = 'Y';
			}
			objPaymentFeatures.show();
		}
		if(isPaymentTemplateApplicable == "Y")
		{
			var payCheckBoxes = objPaymentFeatures.query('panel');
			for ( var i = 0; i < payCheckBoxes.length; i++) 
			{
				if(payCheckBoxes[i].id == "templatesSection")
				{
					payCheckBoxes[i].show();
				}
			}
		}
		else
		{
			var payCheckBoxes = objPaymentFeatures.query('panel');
			for ( var i = 0; i < payCheckBoxes.length; i++) 
			{
				if(payCheckBoxes[i].id == "templatesSection")
				{
					payCheckBoxes[i].hide();
				}
			}
		}
		if(isPaymentTemplateApprovalApplicable == "Y")
		{
			var payCheckBoxes = objPaymentFeatures.query('panel');
			for ( var i = 0; i < payCheckBoxes.length; i++) 
			{
				if(payCheckBoxes[i].id == "templatesApprovalSection")
				{
					payCheckBoxes[i].show();
				}
			}
		}
		else
		{
			var payCheckBoxes = objPaymentFeatures.query('panel');
			for ( var i = 0; i < payCheckBoxes.length; i++) 
			{
				if(payCheckBoxes[i].id == "templatesApprovalSection")
				{
					payCheckBoxes[i].hide();
				}
			}
		}
	}
}

function showTradeFeatures(param) {
	if (!Ext.isEmpty(objTradeFeatures)) {
		if (param == 'N') {
			objTradeFeatures.show();
		} else {
			if ('Y' === param) {
				objTradeFeatures.isAllSelected = 'Y';
			}
			objTradeFeatures.show();
		}
		objTradeFeatures.center();
	}
}
	

function showCollectionFeatures(param) {
	if (!Ext.isEmpty(objCollectionFeatures)) {
		if (param == 'N') {
			objCollectionFeatures.show();
		} else {
			if ('Y' === param) {
				objCollectionFeatures.isAllSelected = 'Y';
			}
			objCollectionFeatures.show();
		}
		objCollectionFeatures.center();
	}
}

function showFSCFeatures(param) {
	if (!Ext.isEmpty(objFSCFeatures)) {
		if (param == 'N') {
			objFSCFeatures.show();
		} else {
			if ('Y' === param) {
				objFSCFeatures.isAllSelected = 'Y';
			}
			objFSCFeatures.show();
		}
		objFSCFeatures.center();
	}
}

function showPaymentWidgets(param) {
	if (!Ext.isEmpty(objPaymentWidgets)) {
			objPaymentWidgets.show();
			objPaymentWidgets.center();
	}
}

function showPositivePayWidgets(param){
	if (!Ext.isEmpty(objPositivePayWidgets)) {
		objPositivePayWidgets.show();
		objPositivePayWidgets.center();
	}
}

function showPaymentLinks(param) {
	if (!Ext.isEmpty(objPaymentLinks)) {
			objPaymentLinks.show();
			objPaymentLinks.center();
	}
}

function showCollectionWidgets(param) {
	if (!Ext.isEmpty(objCollectionWidgets)) {
			objCollectionWidgets.show();
			objCollectionWidgets.center();
	}
}

function showCollectionLinks(param) {
	if (!Ext.isEmpty(objCollectionLinks)) {
			objCollectionLinks.show();
			objCollectionLinks.center();
	}
}

function showCompanyIdList(param) {
	if (!Ext.isEmpty(objCompanyIdList)) {
			objCompanyIdList.show();
			objCompanyIdList.center();
	}
}
function showLMSWidgets(param) {
	
	if (!Ext.isEmpty(objLMSWidgets)) {
			objLMSWidgets.show();
			objLMSWidgets.center();
	}
	else
	{
		objLMSWidgets =  getComponent('04',lmsFeatureProfileId,'lmsWFeaturePopup','W',getLabel('widgetsName','Widget Name'),getLabel('widgetsName','Widget Name'),getLabel('Widgets','Widgets'),getLabel('lbl.serachbywidget','Search by Widget Name'));
		objLMSWidgets.show();
		objLMSWidgets.center();
	}
}

function showLMSLinks(param) {
		 
	if (!Ext.isEmpty(objLMSLinks)) {
			objLMSLinks.show();
	}
	else
	{
		objLMSLinks = getComponent('04',lmsFeatureProfileId,'lmsAFeaturePopup','L',getLabel('actionLinkNm','Action Links Name'),getLabel('actionLinkNm','Action Links Name'),getLabel('actionlinks','Action Links'),getLabel('searchByName', 'Search By Action Link Name'));
		objLMSLinks.show();
	}
	objLMSLinks.center();
}


/*lmsPopup*/
function getSelectCurrenciesPopup(param) {
	
	if (!Ext.isEmpty(objLmsSweepCurrency)) {
			objLmsSweepCurrency.show();
			objLmsSweepCurrency.center();
	}
	else
	{
		objLmsSweepCurrency =   getLmsCurrencyComponent('04',liquidityFeatureProfileId,'lmsCurrencyFeaturePopup','C',getLabel('currencies','Currency'),getLabel('currencies','Currency'),getLabel('currencies','currency'),getLabel('lbl.serachbyCurrency','Search by Currency Name'),LmsFeatureProductId);
		objLmsSweepCurrency.show();
		objLmsSweepCurrency.center();
	}
}
function getAccountTypePopup(param){
if (!Ext.isEmpty(objLmsSweepAccount)) {
			objLmsSweepAccount.show();
			objLmsSweepAccount.center();
	}
	else
	{
		objLmsSweepAccount =  getLmsAccountComponent('04',liquidityFeatureProfileId,'lmsAccountFeaturePopup','A',getLabel('AccountTypes','Account Types'),getLabel('AccountTypes','Account Types'),getLabel('AccountTypes','Account Types'),getLabel('lbl.serachbyAccount','Search by Account Name'),LmsFeatureProductId);
		objLmsSweepAccount.show();
		objLmsSweepAccount.center();
	}
}
function getPoolSelectCurrenciesPopup(param) {
	
	if (!Ext.isEmpty(objLmsPoolCurrency)) {
			objLmsPoolCurrency.show();
			objLmsPoolCurrency.center();
	}
	else
	{
		objLmsPoolCurrency =   getLmsCurrencyComponent('04',liquidityFeatureProfileId,'lmsCurrencyFeaturePopup','C',getLabel('currencies','Currency'),getLabel('currencies','Currency'),getLabel('currencies','Currency'),getLabel('lbl.serachbyCurrency','Search by Currency Name'),LmsPoolFeatureProductId);
		objLmsPoolCurrency.show();
		objLmsPoolCurrency.center();
	}
}
function getPoolAccountTypePopup(param){
if (!Ext.isEmpty(objLmsPoolAccount)) {
			objLmsPoolAccount.show();
			objLmsPoolAccount.center();
	}
	else
	{
		objLmsPoolAccount =  getLmsAccountComponent('04',liquidityFeatureProfileId,'lmsAccountFeaturePopup','A',getLabel('AccountTypes','Account Types'),getLabel('AccountTypes','Account Types'),getLabel('AccountTypes','Account Types'),getLabel('lbl.serachbyAccount','Search by Account Name'),LmsPoolFeatureProductId);
		objLmsPoolAccount.show();
		objLmsPoolAccount.center();
	}
}
function getLmsCurrencyComponent(module,profileId,itemId,featureType,colDesc,ColHeader,title,filterLbl,productId)
{
	var component = Ext.create('Ext.ux.gcp.FilterPopUpView', {
		title : title,
		keyNode : 'name',
		itemId : itemId,
		checkboxId:'chkAllWidgetsSelectedFlag',
		displayCount:false,
		profileId :profileId,
		productId : productId,
		featureType:featureType,
		responseNode :'filter',
		cls : 'non-xn-popup',
		width : 480,
		minHeight : 156,
		maxHeight : 550,
		draggable : false,
		resizable : false,
		autoHeight : false,
		cfgModel : {
		     pageSize : 5,
			storeModel : {
				fields : ['name', 'value','isAssigned','readOnly'],
		proxyUrl : 'cpon/clientServiceSetup/cponFeatures',
		rootNode : 'd.filter',
		totalRowsNode : 'd.count'
		      },
		columnModel : [{
									colDesc : getLabel('ccycode', 'Currency Code'),
									colId : 'name',
									colHeader : getLabel('ccycode', 'Currency Code'),
									sortable : false,
									width : 90
						},{
							        colDesc : getLabel('ccyName', 'Currency Name'),
									colId : 'value',
									colHeader : getLabel('ccyName', 'Currency Name'),
									sortable : false,
									width : 200
						}]
		   },
		cfgShowFilter:true,
		autoCompleterEmptyText : filterLbl,
		   cfgAutoCompleterUrl:'cponFeatures',
			cfgUrl:'cpon/clientServiceSetup/{0}',
			paramName:'filterName',
			dataNode:'name',
			rootNode : 'd.filter',
			autoCompleterExtraParam:
				[{
					key:'featureType',value:featureType
				},{
					key:'module',value: module
				},{
					key:'profileId',value: profileId
				},{
					key:'id',value: encodeURIComponent(parentkey)
				}],
		module : module,
		userMode: pagemode,
		savefnCallback :saveItemsFn,
		urlCallback :serviceURLFn,
		listeners : {
			beforeshow : function(t) {
				var br_grid_Container = component.down('container[itemId="gridContainer"]');
				br_grid_Container.maxHeight = 390;
			},
			resize : function(){
				this.center();
			}
		}
	
	});
	return component;
}
function getLmsAccountComponent(module,profileId,itemId,featureType,colDesc,ColHeader,title,filterLbl,productId)
{

	var component = Ext.create('Ext.ux.gcp.FilterPopUpView', {
		title : title,
		keyNode : 'name',
		itemId : itemId,
		checkboxId:'chkAllWidgetsSelectedFlag',
		displayCount:false,
		profileId :profileId,
		productId : productId,
		featureType:featureType,
		responseNode :'filter',
		cls : 'non-xn-popup',
		width : 480,
		minHeight : 156,
		maxHeight : 550,
		draggable : false,
		resizable : false,
		autoHeight : false,
		cfgModel : {
		     pageSize : 5,
			storeModel : {
				fields : ['name', 'value','isAssigned','readOnly'],
		proxyUrl : 'cpon/clientServiceSetup/cponFeatures',
		rootNode : 'd.filter',
		totalRowsNode : 'd.count'
		      },
		columnModel : [{
										colDesc : getLabel('accountType','Account Type'),
										colId : 'value',
										colHeader : getLabel('accountType','Account Type'),
										width : 330
					}]
		   },
		cfgShowFilter:true,
		autoCompleterEmptyText : filterLbl,
		   cfgAutoCompleterUrl:'cponFeatures',
			cfgUrl:'cpon/clientServiceSetup/{0}',
			paramName:'filterName',
			dataNode:'name',
			rootNode : 'd.filter',
			autoCompleterExtraParam:
				[{
					key:'featureType',value:featureType
				},{
					key:'module',value: module
				},{
					key:'profileId',value: profileId
				},{
					key:'id',value: encodeURIComponent(parentkey)
				}],
		module : module,
		userMode: pagemode,
		savefnCallback :saveItemsFn,
		urlCallback :serviceURLFn,
		listeners : {
			beforeshow : function(t) {
				var br_grid_Container = component.down('container[itemId="gridContainer"]');
				br_grid_Container.maxHeight = 390;
			},
			resize : function(){
				this.center();
			}
		}
	
	});
	return component;
}
function setSelectedLineItems(records, blnIsUnselected) {
	var selectedLineItems = "";
	for ( var i = 0; i < records.length; i++) {
		var val = records[i];
		if (!Ext.isEmpty(val) && !Ext.isEmpty(val.data))
		{
			selectedLineItems = selectedLineItems + val.data.featureId + ':' + val.data.value;
			if (i < records.length - 1) {
				selectedLineItems = selectedLineItems + ',';
			}
		}
	}
	if (blnIsUnselected == true) {
		//$('#allLineCodeSelectedFlag').val('N');
		//$('#chkAllLineCodesSelectedFlag').attr('src',
			//	'static/images/icons/icon_unchecked.gif');
	}
	var lineCodeCount = '(' + records.length + ')';
	$("#lineItemCnt").text(lineCodeCount);
	selectedLineItemsList = selectedLineItems;
	
	popupLineItemsSelectedValue = 'Y';
}

function getLineCodesPopup() {
	objLineCodesPopup =  Ext.create('GCP.view.LineCodesPopup', {
			itemId : 'collectionLineCodesPopup',
			fnCallback : setSelectedLineItems,
			profileId : colFeatureProfileId,
			featureType : 'LI',
			module : '05'
		});

		objLineCodesPopup.show();
}