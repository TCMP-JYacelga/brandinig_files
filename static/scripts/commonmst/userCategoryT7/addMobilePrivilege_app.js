var objMobilePrivilegesPopup = null;
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
			// appFolder : 'app',
			controllers : [ 'GCP.controller.PrivilegeController','GCP.controller.SubsidiaryController', 'GCP.controller.InterfaceController',
							'GCP.controller.SelectPopupController' ],
			requires : ['GCP.view.MobilePrivilegesPopup','Ext.util.MixedCollection','Ext.util.Filter','Ext.window.MessageBox'],
			launch : function() {
				objMobilePrivilegesPopup = Ext.create('GCP.view.MobilePrivilegesPopup',
						{
							itemId : 'mobilePrivilegePopup',
							fnCallback : setSelectedMobilePrivileges,
							module : '03'
						});
			}
		});

function getMobilePrivilegesPopup() {
	
	if (objMobilePrivilegesPopup == null || objMobilePrivilegesPopup == undefined) 
	{
		objMobilePrivilegesPopup = Ext.create('GCP.view.MobilePrivilegesPopup',
				{
					itemId : 'mobilePriviligesPopup',
					fnCallback : setSelectedMobilePrivileges,
					module : '03'
				});
		objMobilePrivilegesPopup.show();
		
	} 
	else 
	{
		objMobilePrivilegesPopup.show();
	}
	objMobilePrivilegesPopup.center();
}

function setSelectedMobilePrivileges(viewSerials,authSerials,editSerials) {
	document.getElementById("viewRightsSerials").value = JSON.stringify(viewSerials);
	document.getElementById("editRightsSerials").value = JSON.stringify(editSerials);
	document.getElementById("authRightsSerials").value = JSON.stringify(authSerials);
	
}