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
			appFolder : 'static/scripts/cpon/collectionMethodMst/app',
			//appFolder : 'app',
			controllers : [ 'GCP.controller.PrfCollectionPackageController'],
			requires : ['GCP.view.PrfCollectionPackageEntryView','GCP.view.CollectionPkgProductSelectionPopUp'],
			launch : function() {
				Ext.Ajax.timeout = Ext.isEmpty(requestTimeout)
						? 600000
						: parseInt(requestTimeout,10) * 1000 * 60;
				Ext.Ajax.on('requestexception', function(con, resp, op, e) {
							if (resp.status == 403) {
								// window.location='logoutUser.action';
								location.reload();
							}
						});
				if(modeVal!="ADDHEADER"){
				objDetailGrid = Ext.create('GCP.view.PrfCollectionPackageEntryView', {
							renderTo : 'gridDiv'
						});
			}
			}
		});
		
function resizeContentPanel() {
	if (!Ext.isEmpty(objDetailGrid)) {
		objDetailGrid.hide();
		objDetailGrid.show();
	}
}
