var objLineItemEntryGrid = null, prefHandler = null;
var filterView = null;
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
			appFolder : 'static/scripts/fsc/InvoiceCenter/app',
			requires : ['GCP.view.LineItemGridEntry',
					'Ext.ux.data.PagingMemoryProxy', 'Ext.util.TaskRunner'],
			launch : function() {
				Ext.Ajax.timeout = Ext.isEmpty(requestTimeout)
						? 600000
						: parseInt(requestTimeout,10) * 1000 * 60;

				Ext.Ajax.on('requestexception', function(con, resp, op, e) {
							if (resp.status == 403) {
								// window.location='logoutUser.action';
								// location.reload();
							}
						});
				if (!Ext.isEmpty(isBatchEditMode) && isBatchEditMode === true) {
					readHeaderForEdit(strPaymentHeaderIde, strIdentifier);
				} else if (!Ext.isEmpty(isBatchViewMode)
						&& isBatchViewMode === true) {
					readHeaderForView(strPaymentHeaderIde, strIdentifier);
				} else if (!Ext.isEmpty(isBatchEditMode)
						&& isBatchEditMode === false) {
					loadHeaderFields(strMyProduct);
				}
			}
		});
function resizeContentPanel() {
	if (!Ext.isEmpty(objLineItemEntryGrid)) {
		objLineItemEntryGrid.hide();
		objLineItemEntryGrid.show();
	}
}
function doCreateLineItemEntryGrid(gridMetaData, charEditable, isViewOnly,
		strIde, isEnableGroupActions) {
	if (Ext.isEmpty(objLineItemEntryGrid)) {
		objLineItemEntryGrid = Ext.create('GCP.view.LineItemGridEntry', {
					'gridMetaData' : gridMetaData,
					renderTo : 'lineItemEntryGridDiv',
					charEditable : charEditable,
					intDefaultEmptyRow : intDefaultEmptyRow,
					intAddEmptyRow : intAddEmptyRow,
					strIdentifier : strIde,
					isViewOnly : Ext.isEmpty(isViewOnly) ? false : isViewOnly,
					isEnableGridActions : isEnableGroupActions
				});
	}

}