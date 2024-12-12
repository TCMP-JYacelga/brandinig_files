var objTradePriviligePopup = null;
Ext.Loader.setConfig({
			enabled : true,
			setPath : {
				'Ext' : 'static/js/extjs4.2.1/src',
				'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
			}
		});
Ext.application({
			name : 'GCP',
			appFolder : 'static/scripts/commonmst/userCategory/app',
			// appFolder : 'app',
			controllers : [ 'GCP.controller.PrivilegeController','GCP.controller.SubsidiaryController', 'GCP.controller.InterfaceController',
							'GCP.controller.SelectPopupController' ],
			requires : ['GCP.view.TradePriviligesPopup','Ext.util.MixedCollection','Ext.util.Filter','Ext.window.MessageBox','Ext.ux.gcp.FilterPopUpView','Ext.ux.gcp.FilterPopUpView'],
			launch : function() {
				objTradePriviligePopup = Ext.create('GCP.view.TradePriviligesPopup',
						{
							itemId : 'tradePriviligesPopup',
							fnCallback : setSelectedTradePrivilige,
							//profileId : brFeatureProfileId,
							//featureType : 'P',
							module : '02'
//							title : getLabel("brfeatureProfile", "BR Feature")
						});
			}
		});

function getTradePrivilegesPopup() {
	
	if (objTradePriviligePopup == null || objTradePriviligePopup == undefined) 
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
		objTradePriviligePopup.show();
		
	} 
	else 
	{
		objTradePriviligePopup.show();
	}
}

function setSelectedTradePrivilige(viewSerials,authSerials,editSerials) {
	document.getElementById("viewRightsSerials").value = JSON.stringify(viewSerials);
	document.getElementById("editRightsSerials").value = JSON.stringify(editSerials);
	document.getElementById("authRightsSerials").value = JSON.stringify(authSerials);
	
}

function getTradePackages(module) {
	GCP.getApplication().fireEvent('showCategoryTradePackages', module);
}
