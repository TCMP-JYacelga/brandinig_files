var objPaymentCategoryLimit = null;
var objSectionCodeLimit = null;
var objPaymentPackageLimit = null;
var objPaymentProductLimit = null;
var objPaymentCategoryAccountLimit = null;
var objSectionCodeAccountLimit = null;
var objPaymentPackageAccountLimit = null;
var objPaymentProductAccountLimit = null;
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
	appFolder : 'static/scripts/cpon/limitService/app',
	//appFolder : 'app',
	requires : [ 'GCP.view.LimitsPopup','GCP.view.AccountsLimitsPopup' ],
	//controllers : [ 'GCP.controller.LimitServiceController' ],
	launch : function() {
		objPaymentCategoryLimit = Ext.create('GCP.view.LimitsPopup',{
			itemId : 'paymentCategoryLimitPopup',
			entity_type1 : 'CATEGORY',
			title : 'Payment Category Limits',
			colName : 'Payment Categories'		
		});
		objSectionCodeLimit = Ext.create('GCP.view.LimitsPopup',{
			itemId : 'objSectionCodeLimitPopup',
			entity_type1 : 'SECCODE',
			title : 'Sec Code Limits',
			colName : 'Sec Codes'		
		});
		objPaymentPackageLimit = Ext.create('GCP.view.LimitsPopup',{
			itemId : 'paymentPackageLimitPopup',
			entity_type1 : 'PACKAGE',
			title : 'Payment Package Limits',
			colName : 'Payment Packages'		
		});
		objPaymentProductLimit = Ext.create('GCP.view.LimitsPopup',{
			itemId : 'paymentProductLimitPopup',
			entity_type1 : 'PRODUCT',
			title : 'Payment Product Limits',
			colName : 'Payment Products'		
		});
		
		objPaymentCategoryAccountLimit = Ext.create('GCP.view.AccountsLimitsPopup',{
			itemId : 'paymentCategoryLimitPopup',
			entity_type1 : 'CATEGORY',
			entity_type2 : 'ACCOUNT',
			title : 'Payment Category Account Limits',
			colName : 'Payment Categories'		
		});
		objSectionCodeAccountLimit = Ext.create('GCP.view.AccountsLimitsPopup',{
			itemId : 'sectionCodeAccountLimitPopup',
			entity_type1 : 'SECCODE',
			entity_type2 : 'ACCOUNT',
			title : 'Sec Code Account Limits',
			colName : 'Sec Codes'		
		});
		objPaymentPackageAccountLimit = Ext.create('GCP.view.AccountsLimitsPopup',{
			itemId : 'paymentPackageAccountLimitPopup',
			entity_type1 : 'PACKAGE',
			entity_type2 : 'ACCOUNT',
			title : 'Payment Package Account Limits',
			colName : 'Payment Packages'		
		});
		objPaymentProductAccountLimit = Ext.create('GCP.view.AccountsLimitsPopup',{
			itemId : 'paymentProductAccountLimitPopup',
			entity_type1 : 'PRODUCT',
			entity_type2 : 'ACCOUNT',
			title : 'Payment Product Account Limits',
			colName : 'Payment Products'		
		});
	}
});


function getPaymentCategoryLimitPopup() {
	if (null != objPaymentCategoryLimit) {
		objPaymentCategoryLimit.show();
	}
}
function getSectionCodeLimitPopup() {
	if (null != objSectionCodeLimit) {
		objSectionCodeLimit.show();
	}
}
function getPaymentPackageLimitPopup() {
	if (null != objPaymentPackageLimit) {
		objPaymentPackageLimit.show();
	}
}
function getPaymentProductLimitPopup() {
	if (null != objPaymentProductLimit) {
		objPaymentProductLimit.show();
	}
}

function getPaymentCategoryAccountLimitPopup() {
	if (null != objPaymentCategoryAccountLimit) {
		objPaymentCategoryAccountLimit.show();
	}
}
function getSectionCodeAccountLimitPopup() {
	if (null != objSectionCodeAccountLimit) {
		objSectionCodeAccountLimit.show();
	}
}
function getPaymentPackageAccountLimitPopup() {
	if (null != objPaymentPackageAccountLimit) {
		objPaymentPackageAccountLimit.show();
	}
}
function getPaymentProductAccountLimitPopup() {
	if (null != objPaymentProductAccountLimit) {
		objPaymentProductAccountLimit.show();
	}
}