var objMakerPaymentCategoryLimit = null;
var objMakerSectionCodeLimit = null;
var objMakerPaymentPackageLimit = null;
var objMakerPaymentProductLimit = null;
var objMakerTemplateTypeProductLimit = null;
var objCheckerPaymentCategoryLimit = null;
var objCheckerSectionCodeLimit = null;
var objCheckerPaymentPackageLimit = null;
var objCheckerPaymentProductLimit = null;
var objCheckerTemplateTypeProductLimit = null;
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
	appFolder : 'static/scripts/commonmst/limitService/app',
	//appFolder : 'app',
	requires : [ 'GCP.view.LimitsPopup'],
	//controllers : [ 'GCP.controller.LimitServiceController' ],
	launch : function() {
		objMakerPaymentCategoryLimit = Ext.create('GCP.view.LimitsPopup',{
			itemId : 'paymentCategoryLimitPopup',
			entity_type1 : 'CATEGORY',
			title : 'Payment Category Limits',
			colName : 'Payment Categories',
			makerCheckerFlag:'M'
		});
		objMakerSectionCodeLimit = Ext.create('GCP.view.LimitsPopup',{
			itemId : 'objSectionCodeLimitPopup',
			entity_type1 : 'SECCODE',
			title : 'Sec Code Limits',
			colName : 'Sec Codes',
			makerCheckerFlag:'M'
		});
		objMakerPaymentPackageLimit = Ext.create('GCP.view.LimitsPopup',{
			itemId : 'paymentPackageLimitPopup',
			entity_type1 : 'PACKAGE',
			title : 'Payment Package Limits',
			colName : 'Payment Methods',
			makerCheckerFlag:'M'
		});
		objMakerPaymentProductLimit = Ext.create('GCP.view.LimitsPopup',{
			itemId : 'paymentProductLimitPopup',
			entity_type1 : 'PRODUCT',
			title : 'Payment Product Limits',
			colName : 'Payment Products',
			makerCheckerFlag:'M'
		});
		objMakerTemplateTypeProductLimit = Ext.create('GCP.view.LimitsPopup',{
			itemId : 'templateTypeProductLimit',
			entity_type1 : 'TEMPLATE_TYPE',
			title : 'Product Category Template Type',
			colName : 'Template Type',
			makerCheckerFlag:'M'
		});
		
		// Checker limit
		objCheckerPaymentCategoryLimit = Ext.create('GCP.view.LimitsPopup',{
			itemId : 'paymentCategoryLimitPopup',
			entity_type1 : 'CATEGORY',
			title : 'Payment Category Limits',
			colName : 'Payment Categories',
			makerCheckerFlag:'C'
		});
		objCheckerSectionCodeLimit = Ext.create('GCP.view.LimitsPopup',{
			itemId : 'objSectionCodeLimitPopup',
			entity_type1 : 'SECCODE',
			title : 'Sec Code Limits',
			colName : 'Sec Codes',
			makerCheckerFlag:'C'
		});
		objCheckerPaymentPackageLimit = Ext.create('GCP.view.LimitsPopup',{
			itemId : 'paymentPackageLimitPopup',
			entity_type1 : 'PACKAGE',
			title : 'Payment Package Limits',
			colName : 'Payment Methods',
			makerCheckerFlag:'C'
		});
		objCheckerPaymentProductLimit = Ext.create('GCP.view.LimitsPopup',{
			itemId : 'paymentProductLimitPopup',
			entity_type1 : 'PRODUCT',
			title : 'Payment Product Limits',
			colName : 'Payment Products',
			makerCheckerFlag:'C'
		});
		objCheckerTemplateTypeProductLimit = Ext.create('GCP.view.LimitsPopup',{
			itemId : 'templateTypeProductLimit',
			entity_type1 : 'TEMPLATE_TYPE',
			title : 'Product Category Template Type',
			colName : 'Template Type',
			makerCheckerFlag:'C'
		});
	}
});



// Maker Limits
function getMakerPaymentCategoryLimitPopup() {
	if (null != objMakerPaymentCategoryLimit) {
		objMakerPaymentCategoryLimit.show();
	}
}
function getMakerSectionCodeLimitPopup() {
	if (null != objMakerSectionCodeLimit) {
		objMakerSectionCodeLimit.show();
	}
}
function getMakerPaymentPackageLimitPopup() {
	if (null != objMakerPaymentPackageLimit) {
		objMakerPaymentPackageLimit.show();
	}
}
function getMakerPaymentProductLimitPopup() {
	if (null != objMakerPaymentProductLimit) {
		objMakerPaymentProductLimit.show();
	}
}
function getMakerTemplateTypeLimitPopup() {
	if (null != objMakerTemplateTypeProductLimit) {
		objMakerTemplateTypeProductLimit.show();
	}
}

// Checker Limits
function getCheckerPaymentCategoryLimitPopup() {
	if (null != objMakerPaymentCategoryLimit) {
		objCheckerPaymentCategoryLimit.show();
	}
}
function getCheckerSectionCodeLimitPopup() {
	if (null != objMakerSectionCodeLimit) {
		objCheckerSectionCodeLimit.show();
	}
}
function getCheckerPaymentPackageLimitPopup() {
	if (null != objMakerPaymentPackageLimit) {
		objCheckerPaymentPackageLimit.show();
	}
}
function getCheckerPaymentProductLimitPopup() {
	if (null != objMakerPaymentProductLimit) {
		objCheckerPaymentProductLimit.show();
	}
}

function getCheckerTemplateTypeLimitPopup() {
	if (null != objCheckerTemplateTypeProductLimit) {
		objCheckerTemplateTypeProductLimit.show();
	}
}