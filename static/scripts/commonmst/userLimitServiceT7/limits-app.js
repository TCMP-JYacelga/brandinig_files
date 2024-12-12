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
	appFolder : 'static/scripts/commonmst/userLimitServiceT7/app',
	//appFolder : 'app',
	requires : [ 'GCP.view.LimitsPopup','GCP.view.TemplatePopup'],
	//controllers : [ 'GCP.controller.LimitServiceController' ],
	launch : function() {
		objMakerPaymentCategoryLimit = Ext.create('GCP.view.LimitsPopup',{
			itemId : 'paymentCategoryLimitPopup',
			entity_type1 : 'CATEGORY',
			title : getLabel('paymentCategoryLimits','Payment Category Limits'),
			colName : getLabel('paymentCategory','Payment Categories'),
			makerCheckerFlag:'M'
		});
		objMakerSectionCodeLimit = Ext.create('GCP.view.LimitsPopup',{
			itemId : 'objSectionCodeLimitPopup',
			entity_type1 : 'SECCODE',
			title : getLabel('secCodeLimits','Sec Code Limits'),
			colName : getLabel('secCodes','Sec Codes'),
			makerCheckerFlag:'M'
		});
		objMakerPaymentPackageLimit = Ext.create('GCP.view.LimitsPopup',{
			itemId : 'paymentPackageLimitPopup',
			entity_type1 : 'PACKAGE',
			title : getLabel('paymentMethodLimits','Payment Package Limits'),
			colName : getLabel('paymentMethod','Payment Package'),
			makerCheckerFlag:'M'
		});
		objMakerPaymentProductLimit = Ext.create('GCP.view.LimitsPopup',{
			itemId : 'paymentProductLimitPopup',
			entity_type1 : 'PRODUCT',
			title : getLabel('paymentProductLimits','Payment Product Limits'),
			colName : getLabel('paymentProducts','Payment Products'),
			makerCheckerFlag:'M'
		});
		objMakerTemplateTypeProductLimit = Ext.create('GCP.view.TemplatePopup',{
			itemId : 'templateTypeProductLimit',
			entity_type1 : 'TPL_CATEGORY',
			entity_type2 : 'TPL_TYPE',
			title : getLabel('productCategoryTemplateType','Product Category Template Type'),
			colName : getLabel('templateType','Template Type'),
			makerCheckerFlag:'M'
		});
		
		// Checker limit
		objCheckerPaymentCategoryLimit = Ext.create('GCP.view.LimitsPopup',{
			itemId : 'paymentCategoryLimitPopup',
			entity_type1 : 'CATEGORY',
			title : getLabel('paymentCategoryLimits','Payment Category Limits'),
			colName : getLabel('paymentCategory','Payment Categories'),
			makerCheckerFlag:'C'
		});
		objCheckerSectionCodeLimit = Ext.create('GCP.view.LimitsPopup',{
			itemId : 'objSectionCodeLimitPopup',
			entity_type1 : 'SECCODE',
			title : getLabel('secCodeLimits','Sec Code Limits'),
			colName : getLabel('secCodes','Sec Codes'),
			makerCheckerFlag:'C'
		});
		objCheckerPaymentPackageLimit = Ext.create('GCP.view.LimitsPopup',{
			itemId : 'paymentPackageLimitPopup',
			entity_type1 : 'PACKAGE',
			title : getLabel('paymentMethodLimits','Payment Package Limits'),
			colName : getLabel('paymentMethod','Payment Methods'),
			makerCheckerFlag:'C'
		});
		objCheckerPaymentProductLimit = Ext.create('GCP.view.LimitsPopup',{
			itemId : 'paymentProductLimitPopup',
			entity_type1 : 'PRODUCT',
			title : getLabel('paymentProductLimits','Payment Product Limits'),
			colName : getLabel('paymentProducts','Payment Products'),
			makerCheckerFlag:'C'
		});
		objCheckerTemplateTypeProductLimit = Ext.create('GCP.view.TemplatePopup',{
			itemId : 'templateTypeProductLimit',
			entity_type1 : 'TPL_CATEGORY',
			entity_type2 : 'TPL_TYPE',
			title : getLabel('paymentCategoryTemplateType','Payment Category Template Type'),
			colName : getLabel('templateType','Template Type'),
			makerCheckerFlag:'C'
		});
	}
});



// Maker Limits
function getMakerPaymentCategoryLimitPopup() {
	if (null != objMakerPaymentCategoryLimit) {
		objMakerPaymentCategoryLimit.show();
		objMakerPaymentCategoryLimit.center();
	}
}
function getMakerSectionCodeLimitPopup() {
	if (null != objMakerSectionCodeLimit) {
		objMakerSectionCodeLimit.show();
		objMakerSectionCodeLimit.center();
	}
}
function getMakerPaymentPackageLimitPopup() {
	if (null != objMakerPaymentPackageLimit) {
		objMakerPaymentPackageLimit.show();
		objMakerPaymentPackageLimit.center();
	}
}
function getMakerPaymentProductLimitPopup() {
	if (null != objMakerPaymentProductLimit) {
		objMakerPaymentProductLimit.show();
		objMakerPaymentProductLimit.center();
	}
}
function getMakerTemplateTypeLimitPopup() {
	if (null != objMakerTemplateTypeProductLimit) {
		objMakerTemplateTypeProductLimit.show();
		objMakerTemplateTypeProductLimit.center();
	}
}

// Checker Limits
function getCheckerPaymentCategoryLimitPopup() {
	if (null != objMakerPaymentCategoryLimit) {
		objCheckerPaymentCategoryLimit.show();
		objCheckerPaymentCategoryLimit.center();
	}
}
function getCheckerSectionCodeLimitPopup() {
	if (null != objMakerSectionCodeLimit) {
		objCheckerSectionCodeLimit.show();
		objCheckerSectionCodeLimit.center();
	}
}
function getCheckerPaymentPackageLimitPopup() {
	if (null != objMakerPaymentPackageLimit) {
		objCheckerPaymentPackageLimit.show();
		objCheckerPaymentPackageLimit.center();
	}
}
function getCheckerPaymentProductLimitPopup() {
	if (null != objMakerPaymentProductLimit) {
		objCheckerPaymentProductLimit.show();
		objCheckerPaymentProductLimit.center();
	}
}

function getCheckerTemplateTypeLimitPopup() {
	if (null != objCheckerTemplateTypeProductLimit) {
		objCheckerTemplateTypeProductLimit.show();
		objCheckerTemplateTypeProductLimit.center();
	}
}