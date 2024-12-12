var objAdvStopPayEntryGrid = null, prefHandler = null;
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
	appFolder : 'static/scripts/payments/checkmgmtNew/app',
	requires : ['GCP.view.AdvanceStopPayEntryInGrid',
					'Ext.ux.data.PagingMemoryProxy', 'Ext.util.TaskRunner'],
	//controllers : ['GCP.controller.advanceStopPayController'],
	launch : function() {
		doCreateAdvStopPayEntryGrid('Y', false, true);
	}
});

function resizeContentPanel() {
	if (!Ext.isEmpty(objAdvStopPayEntryGrid)) {
		objAdvStopPayEntryGrid.hide();
		objAdvStopPayEntryGrid.show();
	}
}
$(document).on('hideShowSidebar',function(event){
	resizeContentPanel();
});


function doCreateAdvStopPayEntryGrid(charEditable, isViewOnly, isEnableGroupActions,selRecSeqNumber) {
	if (Ext.isEmpty(objAdvStopPayEntryGrid)) {
		objAdvStopPayEntryGrid = Ext.create(
				'GCP.view.AdvanceStopPayEntryInGrid', {
					renderTo : 'advStopPayGridDiv',
					charEditable : charEditable,
					intDefaultEmptyRow : intDefaultEmptyRow,
					intAddEmptyRow : intAddEmptyRow,
					isViewOnly : Ext.isEmpty(isViewOnly) ? false : isViewOnly,
					isEnableGridActions : isEnableGroupActions,
					selRecSeqNumber : selRecSeqNumber
				});
	}

}