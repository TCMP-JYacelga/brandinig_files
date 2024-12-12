var objClientFSCPackageDetails = null;
Ext.Loader.setConfig({
	enabled : true,
	disableCaching : false,
	setPath : {
		'Ext' : 'static/js/extjs4.2.1/src',
		'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
	}
});
Ext.application({
	name : 'GCP',
	appFolder : 'static/scripts/cpon/clientSetupMst/app',
	requires : [ 'GCP.view.ClientFSCPackageDetailsView' ],
	controllers : [],
	launch : function() {
		Ext.Ajax.timeout = 600000;
		if ($('#fscPackageDetails').length) {
			objClientFSCPackageDetails = Ext.create(
					'GCP.view.ClientFSCPackageDetailsView', {
						renderTo : 'fscPackageDetails'
					});
			var grid = objClientFSCPackageDetails.down('grid');
			if(grid){
				grid.on('gridStoreLoad',function(){
					if(grid.getTotalRecordCount()===0){
						$('#fscPackageDiv').hide();
					}
				});
			}
		}
	}
});
function showFSCPackageDetails() {
	if (!Ext.isEmpty(objClientFSCPackageDetails)) {
		objClientFSCPackageDetails.hide();
		objClientFSCPackageDetails.show();
	}
}
