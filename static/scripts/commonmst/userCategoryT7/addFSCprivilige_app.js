var objAdminPriviligePopup = null;
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
			controllers : [ 'GCP.controller.PrivilegeController','GCP.controller.SelectPopupController' ],
			requires : ['GCP.view.FSCPriviligesPopup','Ext.util.MixedCollection','Ext.util.Filter','GCP.view.FSCPriviligesPopup', 'GCP.view.UserMstSelectPopup','GCP.view.ScmProductSelectPopup', 'Ext.window.MessageBox'],
			launch : function() {
				objAdminPriviligePopup = Ext.create('GCP.view.FSCPriviligesPopup',
						{
							itemId : 'fscPriviligesPopup',
							fnCallback : setSelectedBRFeatureItems,
							//profileId : brFeatureProfileId,
							//featureType : 'P',
							module : '06'
//							title : getLabel("brfeatureProfile", "BR Feature")
						});
			}
		});

function getFSCPrivilegesPopup() {
	
	if (objAdminPriviligePopup == null || objAdminPriviligePopup == undefined) 
	{
		objAdminPriviligePopup = Ext.create('GCP.view.ForecastPriviligesPopup',
				{
					itemId : 'fscPriviligesPopup',
					fnCallback : setSelectedBRFeatureItems,
					//profileId : brFeatureProfileId,
					//featureType : 'P',
					module : '06'
//					title : getLabel("brfeatureProfile", "BR Feature")
				});
		objAdminPriviligePopup.show();
		
	}
	else
	{
		objAdminPriviligePopup.show();
	}
	objAdminPriviligePopup.center();
  }

function setSelectedBRFeatureItems(viewSerials,authSerials,editSerials) {
	document.getElementById("viewRightsSerials").value = JSON.stringify(viewSerials);
	document.getElementById("editRightsSerials").value = JSON.stringify(editSerials);
	document.getElementById("authRightsSerials").value = JSON.stringify(authSerials);
	
}

function getFSCAlertPopup(module) {
	//GCP.getApplication().fireEvent('fetchfscalerts', module);
	GCP.getApplication().fireEvent('fetchbralerts', module);
}

function getFSCReportPopup(module) {
	//GCP.getApplication().fireEvent('fetchfscreports', module);
		GCP.getApplication().fireEvent('fetchbrreports', module);
}
function getshowWidgtes(module) {
	GCP.getApplication().fireEvent('fetchbrwidgets', module);
}
function getSCMProducts(module) {
	GCP.getApplication().fireEvent('showcategoryscmproducts', module);
}
