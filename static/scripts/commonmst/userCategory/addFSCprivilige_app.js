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
			requires : ['GCP.view.FSCPriviligesPopup','Ext.util.MixedCollection','Ext.util.Filter','GCP.view.FSCPriviligesPopup','GCP.view.ScmProductSelectPopup', 'Ext.window.MessageBox','Ext.ux.gcp.FilterPopUpView'],
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
				if (brCheckBoxes[i].defVal !== true)
				brCheckBoxes[i].setValue(false);
			}
		}
		objAdminPriviligePopup.show();
	}
  }

function setSelectedBRFeatureItems(viewSerials,authSerials,editSerials) {
	document.getElementById("viewRightsSerials").value = JSON.stringify(viewSerials);
	document.getElementById("editRightsSerials").value = JSON.stringify(editSerials);
	document.getElementById("authRightsSerials").value = JSON.stringify(authSerials);
	
}

function getFSCAlertPopup(module) {
	GCP.getApplication().fireEvent('fetchfscalerts', module);
}

function getFSCReportPopup(module) {
	GCP.getApplication().fireEvent('fetchfscreports', module);
}
function getSCMProducts(module) {
	GCP.getApplication().fireEvent('showcategoryscmproducts', module);
}
