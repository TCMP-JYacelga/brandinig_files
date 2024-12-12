var objAcceptanceView = null, objLineItemGridView = null, objInvoiceCreationView = null, prefHandler = null;
var objDownPaymentsView = null , objFinanceRequestView = null , objLoanDisbursalsView = null;
var objLoanSettlementDetailsView = null, objLoanOverduesDetailsView = null, objSellerSettlementDetailsView = null;
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
			appFolder : 'static/scripts/fsc/InvoiceView/app',
			requires : ['Ext.ux.gcp.PreferencesHandler', 'Ext.ux.data.PagingMemoryProxy',
					'Ext.ux.gcp.GroupView', 'GCP.view.InvoiceAcceptanceView',
					'Ext.ux.gcp.vtypes.CustomVTypes'],
			controllers : ['GCP.controller.InvoiceViewController'],
			init : function(application) {
				Ext.ux.gcp.vtypes.CustomVTypes.applyDateRange();
				prefHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
				prefHandler.init(application);
			},
			launch : function() {
				if(!Ext.isEmpty(acceptanceBean) && !(acceptanceBean === "[]")){
					objAcceptanceView = Ext.create('GCP.view.InvoiceAcceptanceView', {
							renderTo : 'poAcceptanceView'
						});
				}
				
				if(!Ext.isEmpty(invoiceLineDetails) && !(invoiceLineDetails === "[]")){
					objLineItemGridView = Ext.create('GCP.view.InvoiceLineItemsDetailsView', {
						renderTo : 'poLineItemsDetailsView'
					});
				}
				
				if(!Ext.isEmpty(invoiceReconciliationDetails)  && !(invoiceReconciliationDetails === "[]")){
					objDownPaymentsView = Ext.create('GCP.view.InvoiceReconciliationDetailsView', {
						renderTo : 'poDownPaymentsDetailsView'
					});
				}
				
				if(!Ext.isEmpty(financeBean) && !(financeBean === "[]")){
					objFinanceRequestView = Ext.create('GCP.view.InvoiceFinanceRequestDetailsView', {
						renderTo : 'poFinanceRequestDetailsView'
					});
					
				}
				
				if(!Ext.isEmpty(loanRequestBean) && !(loanRequestBean === "[]")){
					objLoanDisbursalsView = Ext.create('GCP.view.InvoiceLoanDisbursalsDetailsView', {
						renderTo : 'poLoanDisbursalsDetailsView'
					});
				}
				
				if(!Ext.isEmpty(loanSettlementBean) && !(loanSettlementBean === "[]")){
					objLoanSettlementDetailsView = Ext.create('GCP.view.InvoiceLoanSettlementDetailsView', {
						renderTo : 'poLoanSettlementDetailsView'
					});
				}
				
				if(!Ext.isEmpty(sellerSettlementBean) && !(sellerSettlementBean === "[]")){
					objSellerSettlementDetailsView = Ext.create('GCP.view.InvoiceSellerSettlementDetailsView', {
						renderTo : 'poSellerSettlementDetailsView'
					});
				}
				
				if(!Ext.isEmpty(loanOverDuesBean) && !(loanOverDuesBean === "[]")){
					objLoanOverduesDetailsView = Ext.create('GCP.view.InvoiceLoanOverduesView', {
						renderTo : 'poLoanOverduesDetailsView'
					});
				}
			}
		});	
