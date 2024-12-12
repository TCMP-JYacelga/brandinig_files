var objSlabLevelGridView = null;
Ext.Loader.setConfig({
	enabled : true,
	setPath : {
		'Ext' : 'static/js/extjs4.2.1/src',
		'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
	}
});
Ext.application({
	name : 'GCP',
	appFolder : 'static/scripts/commonmst/AVMSVMT7/app',
	// appFolder : 'app',
	requires : [ 'GCP.view.SlabLevelGridReadOnlyView' ],
	launch : function() {
		objSlabLevelGridView = null;
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objSlabLevelGridView)) {
		objSlabLevelGridView.hide();
		objSlabLevelGridView.show();
	}
}

function renderGrid() {

	objSlabLevelGridView = null;
	$("#slabLevelGridDiv").empty();

	objSlabLevelGridView = Ext.create('GCP.view.SlabLevelGridReadOnlyView', {
		renderTo : 'slabLevelGridDiv'
	});
}
