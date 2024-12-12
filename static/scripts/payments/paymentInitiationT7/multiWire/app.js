/**
 * @author Vinay Thube
 */
var objEntryGrid = null, prefHandler = null;
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
			appFolder : 'static/scripts/payments/paymentInitiationT7/multiWire/app',
			requires : ['GCP.view.MultiWireGridEntry',
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
				loadPaymentHeaderFields(strSelectedTemplates);
			}
		});
function resizeContentPanel() {
	if (!Ext.isEmpty(objEntryGrid)) {
		objEntryGrid.hide();
		objEntryGrid.show();
	}
}
function doCreateEntryGrid(gridMetaData, charEditable, isViewOnly, strIde,
		isEnableGroupActions) {
	if (Ext.isEmpty(objEntryGrid)) {
		objEntryGrid = Ext.create('GCP.view.MultiWireGridEntry', {
					'gridMetaData' : gridMetaData,
					renderTo : 'instrumentEntryGridDiv',
					charEditable : charEditable,
					intDefaultEmptyRow : intDefaultEmptyRow,
					intAddEmptyRow : intAddEmptyRow,
					strIdentifier : strIde,
					isViewOnly : Ext.isEmpty(isViewOnly) ? false : isViewOnly,
					isEnableGridActions : isEnableGroupActions
				});
	}

}