var objProfileView = null;
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
//	appFolder : 'app',
	requires : ['GCP.view.ClientAccountDetailsView'],
	controllers : [],
	launch : function() {
		Ext.Ajax.timeout = 600000;
		if ($('#accountDetails').length) {
			if(brandingPkgType==='N'){
				objProfileView = Ext.create('GCP.view.ClientAccountDetailsView', {
						renderTo : 'accountDetails'
					
					});}
			var grid = objProfileView.down('grid');
			if(grid){
				grid.on('gridStoreLoad',function(){
					if(grid.getTotalRecordCount()===0){
						$('#parentClientAccountDiv').hide();
					}
				});
			}
		}}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView) && brandingPkgType==='N') {
		objProfileView.hide();
		objProfileView.show();
	}
}
