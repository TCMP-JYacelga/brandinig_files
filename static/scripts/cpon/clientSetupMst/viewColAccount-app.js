var objAccountDetails = null;
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
	requires : [ 'GCP.view.AccountView' ],
	controllers : [],
	launch : function() {
		Ext.Ajax.timeout = 600000;
		if ($('#collAccountView').length) {
			if (brandingPkgType === 'N') {
				objAccountDetails = Ext.create('GCP.view.AccountView', {
					renderTo : 'collAccountView',
					module : '05'
				});
				var grid = objAccountDetails.down('grid');
				if(grid){
					grid.on('gridStoreLoad',function(){
						if(grid.getTotalRecordCount()===0){
							$('#collParentAccountDiv').hide();
						}
					});
				}
			}
		}
	}
});
function showAccountView() {
	if (!Ext.isEmpty(objAccountDetails) && brandingPkgType === 'N') {
		objAccountDetails.hide();
		objAccountDetails.show();
	}
}
