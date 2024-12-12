var objOthersView = null;
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
	appFolder : 'static/scripts/commonmst/userCategory/app',
	//	appFolder : 'app',
	requires : [ 'GCP.view.OthersView' ],
	controllers : [ 'GCP.controller.OthersController' ],
	launch : function() {
		objOthersView = Ext.create('GCP.view.OthersView', {
			renderTo : 'tabs-others',
			fnCallback : setOthersOptions
		});
	}
});

function saveClientOthersFeatureProfile(){
	objOthersView.saveItems();
}

function setOthersOptions(viewSerials,authSerials,editSerials) {
	document.getElementById("viewRightsSerials").value = JSON.stringify(viewSerials);
	document.getElementById("editRightsSerials").value = JSON.stringify(editSerials);
	document.getElementById("authRightsSerials").value = JSON.stringify(authSerials);
	saveAdminFeatureProfile('saveUserCategoryOthersFeature.form');
}

