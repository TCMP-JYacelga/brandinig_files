var objPortalPopup = null;
Ext.Loader.setConfig({
	enabled : true,
	setPath : {
		'Ext' : 'static/js/extjs4.2.1/src',
		'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
	}
});
Ext.application({
	name : 'GCP',
	appFolder : 'static/scripts/commonmst/userCategoryT7/app',
	controllers : [ 'GCP.controller.PrivilegeController','GCP.controller.SelectPopupController' ],
	requires : ['GCP.view.ColPriviligesPopup','GCP.view.AdminPriviligesPopup','GCP.view.PayPriviligesPopup','GCP.view.SubsidiarySelectPopup', 'GCP.view.UserMstSelectPopup',
	    					'Ext.window.MessageBox','GCP.view.PortalPriviligesPopup'],
	launch : function() {
		objPortalPopup = Ext.create('GCP.view.PortalPriviligesPopup',
				{
					itemId : 'portalPriviligesPopup',
					fnCallback : setSelectedBRFeatureItems,
					module : '19'
				});
		disablelinks(false);		
	}
});

function getPortalPrivilegesPopup() {
	
	if (objPortalPopup == null || objPortalPopup == undefined)  
	{
		objPortalPopup = Ext.create('GCP.view.PortalPriviligesPopup',
				{
					itemId : 'portalPriviligesPopup',
					fnCallback : setSelectedBRFeatureItems,
					module : '19'
				});
		objPortalPopup.show();
		
	} 
	else 
	{
		objPortalPopup.show();
	}
	objPortalPopup.center();
}

function setSelectedBRFeatureItems(viewSerials,authSerials,editSerials) {
	document.getElementById("viewRightsSerials").value = JSON.stringify(viewSerials);
	document.getElementById("editRightsSerials").value = JSON.stringify(editSerials);
	document.getElementById("authRightsSerials").value = JSON.stringify(authSerials);
	
}

function getshowEstAccounts(module) {
	GCP.getApplication().fireEvent('fetchestaccounts', module);
}