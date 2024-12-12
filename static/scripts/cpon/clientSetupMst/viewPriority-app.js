var objPriorityViewDetails = null;
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
	requires : [ 'GCP.view.PriorityRuleView' ],
	controllers : [],
	launch : function() {
		Ext.Ajax.timeout = 600000;
		if ($('#priorityView').length) {
			objPriorityViewDetails = Ext.create('GCP.view.PriorityRuleView', {
				renderTo : 'priorityView'
			});
			var grid = objPriorityViewDetails.down('grid');
			if(grid){
				grid.on('gridStoreLoad',function(){
					if(grid.getTotalRecordCount()===0){
						$('#parentPriorityDiv').hide();
					}
				});
			}
		}
	}
});
function showPriorityRuleView() {
	if (!Ext.isEmpty(objPriorityViewDetails) && brandingPkgType === 'N') {
		objPriorityViewDetails.hide();
		objPriorityViewDetails.show();
	}
}
