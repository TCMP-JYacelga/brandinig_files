var objForecastPriviligePopup = null;
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
			requires : ['GCP.view.ForecastPriviligesPopup','Ext.util.MixedCollection','Ext.util.Filter','Ext.window.MessageBox'],
			launch : function() {
				objForecastPriviligePopup = Ext.create('GCP.view.ForecastPriviligesPopup',
						{
							itemId : 'forecastPriviligesPopup',
							fnCallback : setSelectedForecastPrivilige,
							//profileId : brFeatureProfileId,
							//featureType : 'P',
							module : '02'
//							title : getLabel("brfeatureProfile", "BR Feature")
						});
			}
		});

function getForecastPrivilegesPopup() {
	
	if (objForecastPriviligePopup == null || objForecastPriviligePopup == undefined) 
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
		objForecastPriviligePopup.show();
		
	} 
	else 
	{
		objForecastPriviligePopup.show();
	}
	objForecastPriviligePopup.center();
}

function setSelectedForecastPrivilige(viewSerials,authSerials,editSerials) {
	document.getElementById("viewRightsSerials").value = JSON.stringify(viewSerials);
	document.getElementById("editRightsSerials").value = JSON.stringify(editSerials);
	document.getElementById("authRightsSerials").value = JSON.stringify(authSerials);
	
}

function getForecastPackages(module) {
	GCP.getApplication().fireEvent('showCategoryForecastPackages', module);
}

function getshowWidgtes(module) {
	GCP.getApplication().fireEvent('fetchbrwidgets', module);
}