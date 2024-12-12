/**
 * @class bankAdminCategoryPrivilege_app
 * @author Nilesh Shinde
 */

var objAdminPrivilegePopup = null;
var objOnBehalfPrivilegePopup = null;
var objReportPrivilegePopup = null;
var userMessageMstSelectPopup = null;
var fieldJson = [];
var fieldsJson = [];
var accessType01 = {};
var accessType02 = {};
var accessType03 = {};
var accessType04 = {};
var accessType05 = {};
var accessType06 = {};

Ext.Loader.setConfig(
{
	enabled : true,
	setPath :
	{
		'Ext' : 'static/js/extjs4.2.1/src',
		'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
	}
} );

Ext.application(
{
	name : 'GCP',
	appFolder : 'static/scripts/commonmst/bankAdminUser/app',
	requires :
	[
		'GCP.view.SellerLevelPrivilegePopup', 'Ext.util.MixedCollection', 'Ext.util.Filter'
	],
	launch: function() {	
		if(openPrivilegePopup == 'Y')
			getSellerPrivilegePopup();
    }
} );

function getSellerPrivilegePopup()
{
	if (!Ext.isEmpty(objAdminPrivilegePopup)) {
	    objAdminPrivilegePopup.destroy();
	  };
	  objAdminPrivilegePopup = Ext.create( 'GCP.view.SellerLevelPrivilegePopup',
		{
			itemId : 'sellerLevelPrivilegePopupItemId',
			fnCallback : setSelectedAdminFeatureItems
		} );		
	
		objAdminPrivilegePopup.show();	
		objAdminPrivilegePopup.center();
}
function setSelectedAdminFeatureItems(accessType01, accessType02, accessType03,accessType04,accessType05,accessType06)
{
		fieldsJson.forEach( function (arrayItem)
		{
			arrayItem.accessType01 = (accessType01[arrayItem.sellerCode]) ? "Y" : "N";
			arrayItem.accessType02 = (accessType02[arrayItem.sellerCode]) ? "Y" : "N";
			arrayItem.accessType03 = (accessType03[arrayItem.sellerCode]) ? "Y" : "N";
			arrayItem.accessType04 = (accessType04[arrayItem.sellerCode]) ? "Y" : "N";
			arrayItem.accessType05 = (accessType05[arrayItem.sellerCode]) ? "Y" : "N";
			arrayItem.accessType06 = (accessType06[arrayItem.sellerCode]) ? "Y" : "N";
		});
		document.getElementById( "selectedSellerPrivileges" ).value = JSON.stringify( fieldsJson );
		setDirtyBit();
}