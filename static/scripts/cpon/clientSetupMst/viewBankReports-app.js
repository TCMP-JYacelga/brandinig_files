var objClientPackageDetails = null;
var objDistributionDetails = null;
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
	requires : [ 'GCP.view.ClientBankReportDetailsView' ,'GCP.view.ClientBankReportDistributionDetailsView'],
	controllers : [],
	launch : function() {
		Ext.Ajax.timeout = 600000;
		if ($('#bankReportDetails').length) {
			objClientPackageDetails = Ext.create(
					'GCP.view.ClientBankReportDetailsView', {
						renderTo : 'bankReportDetails'
					});
			var grid = objClientPackageDetails.down('grid');
			if(grid){
				grid.on('gridStoreLoad',function(){
					if(grid.getTotalRecordCount()===0){
						$('#parentClientBankReportDiv').hide();
					}
				});
			}
			objDistributionDetails = Ext.create(
					'GCP.view.ClientBankReportDistributionDetailsView', {
						renderTo : 'bankReportDetails'
					});
			var distGrid = objDistributionDetails.down('grid');
			if(distGrid){
				grid.on('gridStoreLoad',function(){
					if(grid.getTotalRecordCount()===0){
						$('#parentClientBankReportDiv').hide();
					}
				});
			}
			
		}
	}
});
