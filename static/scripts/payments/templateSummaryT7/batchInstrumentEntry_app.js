/**
 * @class GCP.view.BatchInstrumentEntryInGridLayout
 * @extends Ext.panel.Panel
 * @author Vinay Thube
 */
var objInstrumentEntryGrid = null, prefHandler = null;
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
			appFolder : 'static/scripts/payments/templateSummaryT7/app',
			requires : ['GCP.view.BatchInstrumentEntryInGridLayout',
					'Ext.ux.data.PagingMemoryProxy', 'Ext.util.TaskRunner'],
			controllers : ['GCP.controller.PaymentInitiationController'],
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
					readPaymentHeaderForEdit(strPaymentHeaderIde, strIdentifier, false);
				}

				if (!Ext.isEmpty(isBatchViewMode) && isBatchViewMode === true) {
					readPaymentHeaderForView(strPaymentHeaderIde, strIdentifier);
					if (pollForFileUpload === true)
						doHandleFileUploadStatus(isBatchViewMode);
				} else if (!(!Ext.isEmpty(isTemplate) && isTemplate === true)
						&& !Ext.isEmpty(isBatchEditMode)
						&& isBatchEditMode === false) {
					loadPaymentHeaderFields(strMyProduct);
				}

				if (!Ext.isEmpty(isTemplate) && isTemplate === true) {
					createBatchPaymentUsingTemplate(strTemplateIdentifier);
				}

				if (pollForFileUpload === true) {
					// Start polling for status.
					this.pollingTask.start();
				}
			},
			pollingTask : {
				start : function() {
					this.runner.start(this);
				},
				stop : function() {
					this.runner.stop(this);
				},
				runner : new Ext.util.TaskRunner(),
				pollingCount : 0,
				run : function() {
					if (this.pollingCount > 10) {
						this.stop();
					} else {
						if (pollForFileUpload === true)
							doHandleFileUploadStatus(isBatchViewMode);
						this.pollingCount = this.pollingCount + 1;
					}
				},
				interval : 1000 * 5 // 5 seconds
			}
		});
function resizeContentPanel() {
	if (!Ext.isEmpty(objInstrumentEntryGrid)) {
		objInstrumentEntryGrid.hide();
		objInstrumentEntryGrid.show();
	}
	if (!Ext.isEmpty(auditGrid)) {
		auditGrid.doLayout();
	}
}
$(document).on('hideShowSidebar', function(event, actionName) {
			resizeContentPanel();
		});
function doCreateInstrumentEntryGrid(gridMetaData, charEditable, isViewOnly,
		strIde, isEnableGroupActions,isEnableRowAction) {
	if (Ext.isEmpty(objInstrumentEntryGrid)) {
		objInstrumentEntryGrid = Ext.create(
				'GCP.view.BatchInstrumentEntryInGridLayout', {
					id:'InGridLayout1',
					'gridMetaData' : gridMetaData,
					renderTo : 'instrumentEntryGridDiv',
					charEditable : charEditable,
					intDefaultEmptyRow : intDefaultEmptyRow,
					intAddEmptyRow : intAddEmptyRow,
					strIdentifier : strIde,
					isViewOnly : Ext.isEmpty(isViewOnly) ? false : isViewOnly,
					isEnableGridActions : isEnableGroupActions,
					isEnableRowAction : Ext.isEmpty(isEnableRowAction) ? true : isEnableRowAction
				});
	}

}