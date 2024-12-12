var objProductDetails = null;
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
	requires : [ 'GCP.view.ProductDetailsView' ],
	controllers : [],
	launch : function() {
		Ext.Ajax.timeout = 600000;
		if ($('#collProductView').length) {
			objProductDetails = Ext.create('GCP.view.ProductDetailsView', {
				renderTo : 'collProductView',
				module : '05'
			});
			var grid = objProductDetails.down('grid');
			if(grid){
				grid.on('gridStoreLoad',function(){
					if(grid.getTotalRecordCount()===0){
						$('#collProductDiv').hide();
					}
				});
			}
		}
	}
});
function showPackageDetails() {
	if (!Ext.isEmpty(objProductDetails)) {
		objProductDetails.hide();
		objProductDetails.show();
	}
}
