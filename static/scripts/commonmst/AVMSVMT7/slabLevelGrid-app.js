var objApprovalLevelView = null;

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
	requires : [ 'GCP.view.SlabLevelGridView' ],
	launch : function() {
		objApprovalLevelView = null;
	}

});
function resizeContentPanel() {
	if (!Ext.isEmpty(objApprovalLevelView)
			&& (entryType == 'EDIT'
					|| (entryType == 'SAVE_DETAIL' && errorVal != 'ERROR')
					|| entryType == 'UPDATE' || entryType == 'UPDATE_DETAIL')) {
		objApprovalLevelView.hide();
		objApprovalLevelView.show();
	}
}

function renderGrid() {
	if (entryType == 'EDIT'  || entryType == 'SAVE_AUTH'|| entryType == 'SUBMIT'
			|| (entryType == 'SAVE_DETAIL' && errorVal != 'ERROR')
			|| entryType == 'UPDATE' || entryType == 'UPDATE_DETAIL') {
		objApprovalLevelView = null;
		$("#slabLevelGridDiv").empty();
		var axmFromVal = document.getElementById('axmFromAuth').value;
		var axmToVal = document.getElementById('axmToAuth').value;
		var totalLevelsAuth = document.getElementById('totalLevelsAuth').value;
		if (null != axmFromVal && axmFromVal.length != 0 && null != axmToVal
				&& 0 != totalLevelsAuth) {
			objApprovalLevelView = Ext.create('GCP.view.SlabLevelGridView', {
				renderTo : 'slabLevelGridDiv'
			});
		}
	}
}
