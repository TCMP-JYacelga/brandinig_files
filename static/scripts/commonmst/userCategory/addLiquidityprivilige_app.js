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
			appFolder : 'static/scripts/commonmst/userCategory/app',
			// appFolder : 'app',
			controllers : [ 'GCP.controller.PrivilegeController','GCP.controller.SelectPopupController' ],
			requires : ['GCP.view.LiquidityPriviligesPopup','GCP.view.LiquidityPriviligesPopup','Ext.util.MixedCollection','Ext.util.Filter','Ext.window.MessageBox','Ext.ux.gcp.FilterPopUpView'],
			launch : function() {
				objAdminPriviligePopup = Ext.create('GCP.view.LiquidityPriviligesPopup',
						{
							itemId : 'liquidityPriviligesPopup',
							fnCallback : setSelectedBRFeatureItems,
							//profileId : brFeatureProfileId,
							//featureType : 'P',
							module : '04'
//							title : getLabel("brfeatureProfile", "BR Feature")
						});
			}
		});

function getLiquidityPrivilegesPopup() {
	
	if ($('#chkallPrivilagesSelectedFlag').attr('src') == 'static/images/icons/icon_checked.gif') {
		var brCheckBoxes = objAdminPriviligePopup.query('checkbox');
		for ( var i = 0; i < brCheckBoxes.length; i++) {
				brCheckBoxes[i].setValue(true);
		}
		objAdminPriviligePopup.show();
		
	} else {
		var brCheckBoxes = objAdminPriviligePopup.query('checkbox');
		for ( var i = 0; i < brCheckBoxes.length; i++) {

			if (brCheckBoxes[i] != undefined) {
				//if (brCheckBoxes[i].defVal !== true)
				if( brCheckBoxes[i].checked == true)
				{
					brCheckBoxes[i].setValue(true);
				}
				else
				{
					brCheckBoxes[i].setValue(false);
				}	
			}
		}
		objAdminPriviligePopup.show();
	}
  }

function setSelectedBRFeatureItems(viewSerials,authSerials,editSerials) {
	document.getElementById("viewRightsSerials").value = JSON.stringify(viewSerials);
	document.getElementById("editRightsSerials").value = JSON.stringify(editSerials);
	document.getElementById("authRightsSerials").value = JSON.stringify(authSerials);
	saveAdminFeatureProfile('saveUserCategoryLiquidityFeature.form');
}

function getLiquidityAlertPopup(module) {
	GCP.getApplication().fireEvent('fetchlmsalerts', module);
}

function getLiquidityReportPopup(module) {
	GCP.getApplication().fireEvent('fetchlmsreports', module);
}

function getLMSAccountPopup(module) {
	GCP.getApplication().fireEvent('fetchbraccounts', module);
}
