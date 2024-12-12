var objOthersView = null;
var objLoanPriviligePopup = null;
var objInvestmentPriviligePopup = null;
var objDepositPriviligePopup = null;
var objbankReportsGridView = null;
var objBrPriviligePopup = null;
var objAdminPriviligePopup = null;
var objPayPriviligePopup = null;
var objColPriviligePopup = null;
var objPortalPriviligePopup = null;
var objLMSPriviligePopup = null;
var objTradePriviligePopup = null;
var objForecastPriviligePopup = null;
var objPositivePayPriviligePopup = null;
var objCheckPriviligePopup = null;
var objIncomingAchPriviligePopup =  null;

var objPPGranularPrivPriviligePopup =null;
var objChecksGranularPrivPriviligePopup =null;
var objLoanGranularPrivPriviligePopup =null;
var objReversalPayGranularPrivPriviligePopup =null;
var objSIGranularPrivPriviligePopup =null;
var objPayGranularPrivPriviligePopup =null;
var objTemplatesGranularPrivPriviligePopup =null;

Ext.Loader.setConfig({
	enabled : true,
	disableCaching : false,
	setPath : {
		'Ext' : 'static/js/extjs4.2.1/src',
		'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
	}
});
Ext.application({
	name : 'GCP',
	appFolder : 'static/scripts/commonmst/userCategory/app',
	//	appFolder : 'app',
	requires : [ 'GCP.view.OthersView', 'GCP.view.BankReportsGridView', 'Ext.window.MessageBox','GCP.view.BankReportsGridView','GCP.view.OthersView','GCP.view.AdminPriviligesPopup','Ext.util.MixedCollection','Ext.util.Filter','GCP.view.PayPriviligesPopup','GCP.view.ColPriviligesPopup','Ext.form.field.Checkbox','GCP.view.BRPriviligesPopup' ,'GCP.view.PortalPriviligesPopup',
	'GCP.view.TradePriviligesPopup','GCP.view.ForecastPriviligesPopup','GCP.view.LoanPriviligesPopup','GCP.view.DepositPriviligesPopup','GCP.view.InvestmentPriviligesPopup','GCP.view.PositivePayPriviligesPopup','GCP.view.CheckPriviligesPopup','Ext.ux.gcp.FilterPopUpView',
	  'GCP.view.ReversalPayGranularPriviligesPopup','GCP.view.PaymentGranularPriviligesPopup','GCP.view.SIGranularPriviligesPopup','GCP.view.TemplatesGranularPriviligesPopup','GCP.view.PositivePayGranularPriviligesPopup','GCP.view.CheckGranularPriviligesPopup','GCP.view.LoanGranularPriviligesPopup'],
	controllers : [ 'GCP.controller.OthersController','GCP.controller.PrivilegeController','GCP.controller.SubsidiaryController', 'GCP.controller.BankReportsController', 'GCP.controller.SelectPopupController',
					'GCP.controller.LoansController','GCP.controller.DepositController','GCP.controller.InvestmentController','GCP.controller.PositivePayController','GCP.controller.CheckController','GCP.controller.IncomingAchController',
					'GCP.controller.PaymentGranularPermissionsController','GCP.controller.GranularPositivePayController' ,'GCP.controller.CheckGranularPrivilegePayController','GCP.controller.LoanGranularPrivilegeController'],
	launch : function() {
		/*if (otherServiceEnable == true)
		{
			objOthersView = Ext.create('GCP.view.OthersView', {
			//renderTo : 'tabs-others',
			fnCallback : setOthersOptions
		});
		}*/
		
		if (loanServiceEnable == true)
		{
			objLoanPriviligePopup = Ext.create('GCP.view.LoanPriviligesPopup',
						{
							itemId : 'loanPriviligesPopup',
							fnCallback : setLoansOptions,
							module : '07'
						});
						
						
		    if(isLoanGrnularEnable== true){
		    
		   objLoanGranularPrivPriviligePopup = Ext.create('GCP.view.LoanGranularPriviligesPopup',
						{
							itemId : 'LoanGranularPriviligesPopup',
							//fnCallback : setLoanGranularOptions,
							module : '07'
						});
		    	
		    	
		    }
						
		}
		
		if (positivePayServiceEnable == true)
		{
			objPositivePayPriviligePopup = Ext.create('GCP.view.PositivePayPriviligesPopup',
						{
							itemId : 'positivePayPriviligesPopup',
							fnCallback : setPositivePayOptions,
							module : '13'
						});
						
			 if(isPPGrnularEnable == true){
			 objPPGranularPrivPriviligePopup = Ext.create('GCP.view.PositivePayGranularPriviligesPopup',
						{
							itemId : 'positivePayGranularPriviligesPopup',
							//fnCallback : setPositivePayGranularOptions,
							module : '13'
						});
			 
			 }
						
						
		}
		if (incomingAchServiceEnable == true)
					{
						objIncomingAchPriviligePopup = Ext.create('GCP.view.IncomingAchPriviligesPopup',
									{
										itemId : 'IncomingAchPriviligesPopup',
										fnCallback : setIncomingAchOptions,
										module : '11'
									});
					}
		if (checkServiceEnable == true)
		{
			objCheckPriviligePopup = Ext.create('GCP.view.CheckPriviligesPopup',
						{
							itemId : 'checkPriviligesPopup',
							fnCallback : setCheckOptions,
							module : '14'
						});
						
						
			 if(isChecksGrnularEnable == true){
			 	objChecksGranularPrivPriviligePopup = Ext.create('GCP.view.CheckGranularPriviligesPopup',
						{
							itemId : 'checkGranularPriviligesPopup',
							//fnCallback : setChecksGranularOptions,
							module : '14'
						});
			 
			 
			 }			
		}
		
		if (investmentServiceEnable == true)
		{
			objInvestmentPriviligePopup = Ext.create('GCP.view.InvestmentPriviligesPopup',
						{
							itemId : 'investmentPriviligesPopup',
							fnCallback : setLoansOptions,
							module : '08'
						});
		}
		
		if (depositServiceEnable == true)
		{
			objDepositPriviligePopup = Ext.create('GCP.view.DepositPriviligesPopup',
						{
							itemId : 'depositPriviligesPopup',
							fnCallback : setDepositsOptions,
							module : '16'
						});
		}
		
		if (bankReportServiceEnable == true)
		{
			objbankReportsGridView = Ext.create('GCP.view.BankReportsGridView', {
			renderTo : 'tabs-bankReports'
				
		});
			var store = objbankReportsGridView.down('grid').getStore();
			store.on('load',function(){
				if(store.getCount()===0){
					$('#divBankReports').hide();
				}
			})
		}
		
		if (brServiceEnable == true)
		{
			objBrPriviligePopup = Ext.create('GCP.view.BRPriviligesPopup',
						{
							itemId : 'bRPriviligesPopup',
							fnCallback : setSelectedBRFeatureItems,
							//profileId : brFeatureProfileId,
							//featureType : 'P',
							module : '01'
//							title : getLabel("brfeatureProfile", "BR Feature")
						});
		}
		
		if (adminServiceEnable == true)
		{
			objAdminPriviligePopup = Ext.create('GCP.view.AdminPriviligesPopup',
						{
							itemId : 'adminPriviligesPopup',
							fnCallback : setSelectedBRFeatureItems,
							//profileId : brFeatureProfileId,
							//featureType : 'P',
							module : '01'
//							title : getLabel("brfeatureProfile", "BR Feature")
						});
		}
		
		if (payServiceEnable == true)
		{
			objPayPriviligePopup = Ext.create('GCP.view.PayPriviligesPopup',
						{
							itemId : 'payPriviligesPopup',
							fnCallback : setSelectedBRFeatureItems,
							//profileId : brFeatureProfileId,
							//featureType : 'P',
							module : '02'
//							title : getLabel("brfeatureProfile", "BR Feature")
						});	
						
						
			if(isPaymentGrnularEnable == true){
			objReversalPayGranularPrivPriviligePopup = Ext.create('GCP.view.ReversalPayGranularPriviligesPopup',
						{
							itemId : 'reversalPayGranularPriviligesPopup',
							//fnCallback : setReversalPayGranularOptions,
							module : '02'
						});
						
			objSIGranularPrivPriviligePopup = Ext.create('GCP.view.SIGranularPriviligesPopup',
						{
							itemId : 'siGranularPriviligesPopup',
							//fnCallback : setSIGranularOptions,
							module : '02'
						});
						
						objPayGranularPrivPriviligePopup = Ext.create('GCP.view.PaymentGranularPriviligesPopup',
						{
							itemId : 'paymentGranularPriviligesPopup',
							//fnCallback : setPayGranularOptions,
							module : '02'
						});
						
							objTemplatesGranularPrivPriviligePopup = Ext.create('GCP.view.TemplatesGranularPriviligesPopup',
						{
							itemId : 'templatesGranularPriviligesPopup',
							//fnCallback : setTemplatesGranularOptions,
							module : '02'
						});
			
			
			}			
		}
		if (colServiceEnable == true)
		{
			objColPriviligePopup = Ext.create('GCP.view.ColPriviligesPopup',
						{
							itemId : 'colPriviligesPopup',
							fnCallback : setSelectedBRFeatureItems,
							//profileId : brFeatureProfileId,
							//featureType : 'P',
							module : '05'
//							title : getLabel("brfeatureProfile", "BR Feature")
						});		
		}
		if (portalServiceEnable == true)
		{
			objPortalPriviligePopup = Ext.create('GCP.view.PortalPriviligesPopup',
						{
							itemId : 'portalPriviligesPopup',
							fnCallback : setSelectedBRFeatureItems,
							module : '19'
						});		
		}
		if (lmsServiceEnable == true)
		{
			objLMSPriviligePopup = Ext.create('GCP.view.LiquidityPriviligesPopup',
						{
							itemId : 'lmsPriviligesPopup',
							fnCallback : setSelectedBRFeatureItems,
							module : '04'
						});		
		}
		if (fscServiceEnable == true)
		{
			objFSCPriviligePopup = Ext.create('GCP.view.FSCPriviligesPopup',
						{
							itemId : 'fscPriviligesPopup',
							fnCallback : setSelectedBRFeatureItems,
							module : '06'
						});		
		}
		if(tradeServiceEnable == true)
		{
			objTradePriviligePopup = Ext.create('GCP.view.TradePriviligesPopup',
				{
					itemId : 'tradePriviligesPopup',
					fnCallback : setSelectedTradePrivilige,
					//profileId : brFeatureProfileId,
					//featureType : 'P',
					module : '09'
//					title : getLabel("brfeatureProfile", "BR Feature")
				});
		}
		if(forecastServiceEnable == true)
		{
			objForecastPriviligePopup = Ext.create('GCP.view.ForecastPriviligesPopup',
				{
					itemId : 'forecastPriviligesPopup',
					fnCallback : setSelectedForecastPrivilige,
					//profileId : brFeatureProfileId,
					//featureType : 'P',
					module : '10'
//					title : getLabel("brfeatureProfile", "BR Feature")
				});
		}		
	}
});

function getFSCPrivilegesPopup() {
	if($('#chkallPrivilagesSelectedFlag').attr('src')=='static/images/icons/icon_checked.gif')
  {
   var brCheckBoxes = objLMSPriviligePopup.query('checkboxgroup');
   for(var i = 0; i<10; i++ ){
    var cBox = brCheckBoxes[i].query('checkbox');
    for(var j=0; j<cBox.length;j++){
     cBox[j].setValue(true);      
    } 
   }
   objFSCPriviligePopup.show();
  }
  else
  {
     if (null != objFSCPriviligePopup) {
		objFSCPriviligePopup.show();
	}
  }
}
function getLiquidityPrivilegesPopup() {
	if($('#chkallPrivilagesSelectedFlag').attr('src')=='static/images/icons/icon_checked.gif')
  {
   var brCheckBoxes = objLMSPriviligePopup.query('checkboxgroup');
   for(var i = 0; i<10; i++ ){
    var cBox = brCheckBoxes[i].query('checkbox');
    for(var j=0; j<cBox.length;j++){
     cBox[j].setValue(true);      
    } 
   }
   objLMSPriviligePopup.show();
  }
  else
  {
     if (null != objLMSPriviligePopup) {
		objLMSPriviligePopup.show();
	}
  }
}

function getPayPrivilegesPopup() {
	if($('#chkallPrivilagesSelectedFlag').attr('src')=='static/images/icons/icon_checked.gif')
  {
   var brCheckBoxes = objPayPriviligePopup.query('checkboxgroup');
   for(var i = 0; i<10; i++ ){
    var cBox = brCheckBoxes[i].query('checkbox');
    for(var j=0; j<cBox.length;j++){
     cBox[j].setValue(true);      
    } 
   }
   objPayPriviligePopup.show();
  }
  else
  {
     if (null != objPayPriviligePopup) {
		objPayPriviligePopup.show();
	}
  }
}

function getColPrivilegesPopup() {
	if($('#chkallPrivilagesSelectedFlag').attr('src')=='static/images/icons/icon_checked.gif')
  {
   var brCheckBoxes = objColPriviligePopup.query('checkboxgroup');
   for(var i = 0; i<10; i++ ){
    var cBox = brCheckBoxes[i].query('checkbox');
    for(var j=0; j<cBox.length;j++){
     cBox[j].setValue(true);      
    } 
   }
   objColPriviligePopup.show();
  }
  else
  {
     if (null != objColPriviligePopup) {
		objColPriviligePopup.show();
	}
  }
}

function getPortalPrivilegesPopup() {
	if($('#chkallPrivilagesSelectedFlag').attr('src')=='static/images/icons/icon_checked.gif')
  {
   var brCheckBoxes = objPortalPriviligePopup.query('checkboxgroup');
   for(var i = 0; i<10; i++ ){
    var cBox = brCheckBoxes[i].query('checkbox');
    for(var j=0; j<cBox.length;j++){
     cBox[j].setValue(true);      
    } 
   }
   objPortalPriviligePopup.show();
  }
  else
  {
     if (null != objPortalPriviligePopup) {
    	 objPortalPriviligePopup.show();
	}
  }
}

function getAdminPrivilegesPopup() {
	if($('#chkallPrivilagesSelectedFlag').attr('src')=='static/images/icons/icon_checked.gif')
  {
   var brCheckBoxes = objAdminPriviligePopup.query('checkboxgroup');
   for(var i = 0; i<10; i++ ){
    var cBox = brCheckBoxes[i].query('checkbox');
    for(var j=0; j<cBox.length;j++){
     cBox[j].setValue(true);      
    } 
   }
   objAdminPriviligePopup.show();
  }
  else
  {
     if (null != objAdminPriviligePopup) {
		objAdminPriviligePopup.show();
	}
  }
}
function getIncomingAchPrivilegesPopup() {
	if($('#chkallPrivilagesSelectedFlag').attr('src')=='static/images/icons/icon_checked.gif')
	  {
			var brCheckBoxes = objIncomingAchPriviligePopup.query('checkboxgroup');
			for(var i = 0; i<10; i++ ){
		    var cBox = brCheckBoxes[i].query('checkbox');
		    for(var j=0; j<cBox.length;j++){
		     cBox[j].setValue(true);      
		   } 
		   }
		   objIncomingAchPriviligePopup.show();
		  }
		  else
		  {
		     if (null != objIncomingAchPriviligePopup) {
		    	 objIncomingAchPriviligePopup.show();
			}
		  }
	}
function getLoanPrivilegesPopup() {

     if (null != objLoanPriviligePopup) {
		objLoanPriviligePopup.show();
	}
  
}

function getPositivePayPrivilegesPopup() {

    if (null != objPositivePayPriviligePopup) {
		objPositivePayPriviligePopup.show();
	}
 
}
function getCheckPrivilegesPopup() {

    if (null != objCheckPriviligePopup) {
		objCheckPriviligePopup.show();
	}
 
}
function getInvestmentPrivilegesPopup() {

     if (null != objInvestmentPriviligePopup) {
		objInvestmentPriviligePopup.show();
	}
  
}


function getDepositPrivilegesPopup() {

     if (null != objDepositPriviligePopup) {
		objDepositPriviligePopup.show();
	}
  
}


function getTemplatesGranularPrivilegesPopup() {

 if (null != objTemplatesGranularPrivPriviligePopup) {
		objTemplatesGranularPrivPriviligePopup.show();
	}

}

function getPaymentCenterGranularPrivilegesPopup() {
 if (null != objPayGranularPrivPriviligePopup) {
		objPayGranularPrivPriviligePopup.show();
	}

}

function getSIGranularPrivilegesPopup() {

 if (null != objSIGranularPrivPriviligePopup) {
		objSIGranularPrivPriviligePopup.show();
	}
}

function getReversalPayGranularPrivilegesPopup() {
 if (null != objReversalPayGranularPrivPriviligePopup) {
		objReversalPayGranularPrivPriviligePopup.show();
	}
}

function getLoansGranularPrivilegesPopup() {
 if (null != objLoanGranularPrivPriviligePopup) {
		objLoanGranularPrivPriviligePopup.show();
	}
}

function getChecksGranularPrivilegesPopup() {
 if (null != objChecksGranularPrivPriviligePopup) {
		objChecksGranularPrivPriviligePopup.show();
	}
}

function getPPGranularPrivilegesPopup() {
 if (null != objPPGranularPrivPriviligePopup) {
		objPPGranularPrivPriviligePopup.show();
	}
}

function saveClientOthersFeatureProfile(){
	objOthersView.saveItems();
}

function setOthersOptions(viewSerials,authSerials,editSerials) {
	document.getElementById("viewRightsSerials").value = JSON.stringify(viewSerials);
	document.getElementById("editRightsSerials").value = JSON.stringify(editSerials);
	document.getElementById("authRightsSerials").value = JSON.stringify(authSerials);
	saveAdminFeatureProfile('saveUserCategoryOthersFeature.form');
}

function setLoansOptions(viewSerials,authSerials,editSerials) {
	document.getElementById("viewRightsSerials").value = JSON.stringify(viewSerials);
	document.getElementById("editRightsSerials").value = JSON.stringify(editSerials);
	document.getElementById("authRightsSerials").value = JSON.stringify(authSerials);
}

function setDepositsOptions(viewSerials,authSerials,editSerials) {
	document.getElementById("viewRightsSerials").value = JSON.stringify(viewSerials);
	document.getElementById("editRightsSerials").value = JSON.stringify(editSerials);
	document.getElementById("authRightsSerials").value = JSON.stringify(authSerials);
}
function setPositivePayOptions(viewSerials,authSerials,editSerials) {
	document.getElementById("viewRightsSerials").value = JSON.stringify(viewSerials);
	document.getElementById("editRightsSerials").value = JSON.stringify(editSerials);
	document.getElementById("authRightsSerials").value = JSON.stringify(authSerials);
}
function setCheckOptions(viewSerials,authSerials,editSerials) {
	document.getElementById("viewRightsSerials").value = JSON.stringify(viewSerials);
	document.getElementById("editRightsSerials").value = JSON.stringify(editSerials);
	document.getElementById("authRightsSerials").value = JSON.stringify(authSerials);
}
function setIncomingAchOptions(viewSerials,authSerials,editSerials) {
		document.getElementById("viewRightsSerials").value = JSON.stringify(viewSerials);
		document.getElementById("editRightsSerials").value = JSON.stringify(editSerials);
		document.getElementById("authRightsSerials").value = JSON.stringify(authSerials);
}		
function getBrPrivilegesPopup() {
	if($('#chkallPrivilagesSelectedFlag').attr('src')=='static/images/icons/icon_checked.gif')
  {
   var brCheckBoxes = objBrPriviligePopup.query('checkboxgroup');
   for(var i = 0; i<10; i++ ){
    var cBox = brCheckBoxes[i].query('checkbox');
    for(var j=0; j<cBox.length;j++){
     cBox[j].setValue(true);      
    } 
   }
   objBrPriviligePopup.show();
  }
  else
  {
     if (null != objBrPriviligePopup) {
		objBrPriviligePopup.show();
	}
  }
}

function getTradePrivilegesPopup() {
	if($('#chkallPrivilagesSelectedFlag').attr('src')=='static/images/icons/icon_checked.gif')
  {
   var brCheckBoxes = objTradePriviligePopup.query('checkboxgroup');
   for(var i = 0; i<10; i++ ){
    var cBox = brCheckBoxes[i].query('checkbox');
    for(var j=0; j<cBox.length;j++){
     cBox[j].setValue(true);      
    } 
   }
   objTradePriviligePopup.show();
  }
  else
  {
     if (null != objTradePriviligePopup) {
		objTradePriviligePopup.show();
	}
  }
}

function getTradePackages(module) {
	GCP.getApplication().fireEvent('showCategoryTradePackages', module);
}

function getForecastPrivilegesPopup() {
	if($('#chkallPrivilagesSelectedFlag').attr('src')=='static/images/icons/icon_checked.gif')
  {
   var brCheckBoxes = objForecastPriviligePopup.query('checkboxgroup');
   for(var i = 0; i<10; i++ ){
    var cBox = brCheckBoxes[i].query('checkbox');
    for(var j=0; j<cBox.length;j++){
     cBox[j].setValue(true);      
    } 
   }
   objForecastPriviligePopup.show();
  }
  else
  {
     if (null != objForecastPriviligePopup) {
		objForecastPriviligePopup.show();
	}
  }
}

function getForecastPackages(module) {
	GCP.getApplication().fireEvent('showCategoryForecastPackages', module);
}

function setSelectedBRFeatureItems(viewSerials,authSerials,editSerials) {
	document.getElementById("viewRightsSerials").value = JSON.stringify(viewSerials);
	document.getElementById("editRightsSerials").value = JSON.stringify(editSerials);
	document.getElementById("authRightsSerials").value = JSON.stringify(authSerials);
	
}

function setSelectedTradePrivilige(viewSerials,authSerials,editSerials) {
	document.getElementById("viewRightsSerials").value = JSON.stringify(viewSerials);
	document.getElementById("editRightsSerials").value = JSON.stringify(editSerials);
	document.getElementById("authRightsSerials").value = JSON.stringify(authSerials);
	
}
function setSelectedForecastPrivilige(viewSerials,authSerials,editSerials) {
	document.getElementById("viewRightsSerials").value = JSON.stringify(viewSerials);
	document.getElementById("editRightsSerials").value = JSON.stringify(editSerials);
	document.getElementById("authRightsSerials").value = JSON.stringify(authSerials);
	
}

function getSelectActionLinkPopup(userCategory,sellerCode,corporation) {
	GCP.getApplication().fireEvent('showcategorysubsidiary',userCategory, sellerCode,corporation);
}

function getInterfacePopup(module) {
	GCP.getApplication().fireEvent('showcategoryinterface', module);
}

function getMessageTypePopup() {
	GCP.getApplication().fireEvent('showcategorymessagetype');
}

function getAlertPopup(module) {
	GCP.getApplication().fireEvent('showcategoryalert', module);
}

function getReportPopup(module) {
	GCP.getApplication().fireEvent('showcategoryreport', module);
}

function getPrivilegesPopup() {
} 
function getPaymentPackages(module) {
	GCP.getApplication().fireEvent('showcategorypackages', module);
}
function getCollectionPackages(module) {
	GCP.getApplication().fireEvent('showcategorycolpackages', module);
}
function getCompanyIds(module) {
	GCP.getApplication().fireEvent('showcompnayids', module);
}
function getshowtemplates(module) {
	GCP.getApplication().fireEvent('showtemplates', module);
}
function getshowAccounts(module) {
	GCP.getApplication().fireEvent('fetchbraccounts', module);
}
function getshowWidgtes(module) {
	GCP.getApplication().fireEvent('fetchbrwidgets', module);
}
function getBrAlertPopup(module) {
	GCP.getApplication().fireEvent('fetchbralerts', module);
}

function getBrAccountPopup(module) {
	GCP.getApplication().fireEvent('fetchbraccounts', module);
}

function getBrReportPopup(module) {
	GCP.getApplication().fireEvent('fetchbrreports', module);
}

function getLiquidityAlertPopup(module) {
	GCP.getApplication().fireEvent('fetchlmsalerts', module);
}
function getLiquidityReportPopup(module) {
	GCP.getApplication().fireEvent('fetchlmsreports', module);
}

function getFSCAlertPopup(module) {
	GCP.getApplication().fireEvent('fetchfscalerts', module);
}
function getFSCReportPopup(module) {
	GCP.getApplication().fireEvent('fetchfscreports', module);
}
function getSCMProducts(module) {
	GCP.getApplication().fireEvent('showcategoryscmproducts', module);
}
