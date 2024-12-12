var objPaymentCategoryLimit = null;
var objSectionCodeLimit = null;
var objPaymentPackageLimit = null;
var objPaymentProductLimit = null;
var objPaymentCategoryAccountLimit = null;
var objSectionCodeAccountLimit = null;
var objPaymentPackageAccountLimit = null;
var objPaymentProductAccountLimit = null;
var objReversalAccountLimit = null;
Ext.Loader.setConfig({
	enabled : true,
	disableCaching : false,
	setPath : {
		'Ext' : 'static/js/extjs4.2.1/src',
		'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
	}
});
Ext.application({
	name : 'CPON',
	appFolder : 'static/scripts/cpon/clientSetupMst/limitService/app',
	requires : [ 'CPON.view.LimitsPopup','CPON.view.AccountsLimitsPopup','CPON.view.ReversalLimitsPopup' ],
	//controllers : [ 'CPON.controller.LimitServiceController' ],
	launch : function() {
		objPaymentCategoryLimit = Ext.create('CPON.view.LimitsPopup',{
			itemId : 'paymentCategoryLimitPopup',
			entity_type1 : 'CATEGORY',
			title : getLabel('payCatLimit','Payment Category Limits'),
			colName : getLabel('payCategories','Payment Categories'),		
			listeners : {
				resize : function(){
					this.center();
				}
			}			
		});
		objSectionCodeLimit = Ext.create('CPON.view.LimitsPopup',{
			itemId : 'objSectionCodeLimitPopup',
			entity_type1 : 'SECCODE',
			title : getLabel('secCodeLimit','Sec Code Limits'),
			colName : getLabel('secCodes','Sec Codes'),	
			listeners : {
				resize : function(){
					this.center();
				}
			}				
		});
		objPaymentPackageLimit = Ext.create('CPON.view.LimitsPopup',{
			itemId : 'paymentPackageLimitPopup',
			entity_type1 : 'PACKAGE',
			title : getLabel('payMathodLimit','Payment Package Limits'),
			colName : getLabel('payMathods','Payment Methods'),		
			listeners : {
				resize : function(){
					this.center();
				}
			}			
		});
		objPaymentProductLimit = Ext.create('CPON.view.LimitsPopup',{
			itemId : 'paymentProductLimitPopup',
			entity_type1 : 'PRODUCT',
			title : getLabel('payProductLimit','Payment Product Limits'),
			colName : getLabel('payProducts','Payment Products'),			
			listeners : {
				resize : function(){
					this.center();
				}
			}			
		});
		
		objPaymentCategoryAccountLimit = Ext.create('CPON.view.AccountsLimitsPopup',{
			itemId : 'paymentCategoryLimitPopup',
			entity_type1 : 'CATEGORY',
			entity_type2 : 'ACCOUNT',
			title : getLabel('payCatAccLimit','Payment Category Account Limits'),
			colName : getLabel('payCategories','Payment Categories'),			
			listeners : {
				resize : function(){
					this.center();
				}
			}			
		});
		objSectionCodeAccountLimit = Ext.create('CPON.view.AccountsLimitsPopup',{
			itemId : 'sectionCodeAccountLimitPopup',
			entity_type1 : 'SECCODE',
			entity_type2 : 'ACCOUNT',
			title : getLabel('secCodeAccLimits','Sec Code Account Limits'),
			colName : getLabel('secCodes' , 'Sec Codes'),
			listeners : {
				resize : function(){
					this.center();
				}
			}					
		});
		objPaymentPackageAccountLimit = Ext.create('CPON.view.AccountsLimitsPopup',{
			itemId : 'paymentPackageAccountLimitPopup',
			entity_type1 : 'PACKAGE',
			entity_type2 : 'ACCOUNT',
			title : getLabel('payMethodAccLimit' , 'Payment Package Account Limits'),
			colName : getLabel('payMathods' , 'Payment Methods'),		
			listeners : {
				resize : function(){
					this.center();
				}
			}			
		});
		
		objReversalAccountLimit = Ext.create('CPON.view.ReversalLimitsPopup',{
			itemId : 'reversalAccountLimitPopup',
			entity_type1 : 'REVERSAL_ACCOUNT',
			title : getLabel('revLimits' , 'Reversal Limits'),		
			colName : getLabel('limitsAccNo' , 'Account'),				
			listeners : {
				resize : function(){
					this.center();
				}
			}			
		});
		
		objPaymentProductAccountLimit = Ext.create('CPON.view.AccountsLimitsPopup',{
			itemId : 'paymentProductAccountLimitPopup',
			entity_type1 : 'PRODUCT',
			entity_type2 : 'ACCOUNT',
			title : getLabel('payProductAccLimit' , 'Payment Product Account Limits'),
			colName : getLabel('payProducts' , 'Payment Products'),
			listeners : {
				resize : function(){
					this.center();
				}
			}			
		});
	}
});


function getPaymentCategoryLimitPopup() {
	if (null != objPaymentCategoryLimit) {
		objPaymentCategoryLimit.show();
		objPaymentCategoryLimit.center();
	}
}
function getSectionCodeLimitPopup() {
	if (null != objSectionCodeLimit) {
		objSectionCodeLimit.show();
		objSectionCodeLimit.center();
	}
}
function getPaymentPackageLimitPopup() {
	if (null != objPaymentPackageLimit) {
		objPaymentPackageLimit.show();
		objPaymentPackageLimit.center();
	}
}
function getPaymentProductLimitPopup() {
	if (null != objPaymentProductLimit) {
		objPaymentProductLimit.show();
		objPaymentProductLimit.center();
	}
}

function getPaymentCategoryAccountLimitPopup() {
	if (null != objPaymentCategoryAccountLimit) {
		objPaymentCategoryAccountLimit.accountNo = $('#acctNmbr').val();
		objPaymentCategoryAccountLimit.show();
		objPaymentCategoryAccountLimit.center();
	}
}
function getSectionCodeAccountLimitPopup() {
	if (null != objSectionCodeAccountLimit) {
		objSectionCodeAccountLimit.accountNo = $('#acctNmbr').val();
		objSectionCodeAccountLimit.show();
		objSectionCodeAccountLimit.center();
	}
}
function getPaymentPackageAccountLimitPopup() {
	if (null != objPaymentPackageAccountLimit) {
		objPaymentPackageAccountLimit.accountNo = $('#acctNmbr').val();
		objPaymentPackageAccountLimit.show();
		objPaymentPackageAccountLimit.center();
	}
}
function getPaymentProductAccountLimitPopup() {
	if (null != objPaymentProductAccountLimit) {
		objPaymentProductAccountLimit.show();
		objPaymentProductAccountLimit.center();
	}
}
function getReversalAccountLimitPopup() {
	if (null != objReversalAccountLimit) {
		objReversalAccountLimit.show();
		objReversalAccountLimit.center();
	}
}