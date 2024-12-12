var objClientPackageDetails = null;
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
	// appFolder : 'app',
	requires : [ 'GCP.view.ClientPackageDetailsView' ],
	controllers : [],
	launch : function() {
		Ext.Ajax.timeout = 600000;
		if ($('#packageDetails').length) {
			objClientPackageDetails = Ext.create(
					'GCP.view.ClientPackageDetailsView', {
						renderTo : 'packageDetails',
						module : '02' 
					});
			var grid = objClientPackageDetails.down('grid');
			if(grid){
				grid.on('gridStoreLoad',function(){
					if(grid.getTotalRecordCount()===0){
						$('#parentPackageDiv').hide();
					}
				});
			}
		}
	}
});
function showPackageDetails() {
	if (!Ext.isEmpty(objClientPackageDetails)) {
		objClientPackageDetails.hide();
		objClientPackageDetails.show();
	}
}
