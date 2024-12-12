var objSelectProdPopup = null;
var objDetailGrid = null;
Ext.Loader.setConfig({
			enabled : true,
			setPath : {
				'Ext' : 'static/js/extjs4.2.1/src',
				'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
			}
		});
Ext.application({
			name : 'GCP',
			appFolder : 'static/scripts/cpon/profileMst/app',
			// appFolder : 'app',
			controllers : ['GCP.controller.PrfPmtPackageController'],
			requires : ['GCP.view.PrfPmtPackageEntryView',
					'GCP.view.PmtPkgProductSelectionPopUp'],
			launch : function() {
				if (modeVal != 'ADDHEADER'){
					objDetailGrid = Ext.create(
							'GCP.view.PrfPmtPackageEntryView', {
								renderTo : 'gridDiv'
							});
				}
				Ext.Ajax.timeout = Ext.isEmpty(requestTimeout)
							? 600000
							: parseInt(requestTimeout,10) * 1000 * 60;
					Ext.Ajax.on('requestexception', function(con, resp, op, e) {
								if (resp.status == 403) {
									// window.location='logoutUser.action';
									location.reload();
								}
							});
				

				/*
				 * objSelectProdPopup =
				 * Ext.create('GCP.view.PmtPkgProductSelectionPopUp', { itemId :
				 * 'pmtPkgProductSelectionPopUpId', title :
				 * getLabel('selectProd', 'Select Products') });
				 */
			}
		});

function resizeContentPanel() {
	if (!Ext.isEmpty(objDetailGrid)) {
		objDetailGrid.hide();
		objDetailGrid.show();
	}
}
