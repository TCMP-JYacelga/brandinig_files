var objAcceptanceView = null, objLineItemGridView = null, objInvoiceCreationView = null, prefHandler = null;
var objDownPaymentsView = null , objFinanceRequestView = null , objLoanDisbursalsView = null;
var objLoanSettlementDetailsView = null, objLoanOverduesDetailsView = null , objInvoiceReconciliationDetails = null;
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
			appFolder : 'static/scripts/fsc/POView/app',
			requires : ['Ext.ux.gcp.PreferencesHandler', 'Ext.ux.data.PagingMemoryProxy',
					'Ext.ux.gcp.GroupView', 'GCP.view.POAcceptanceView',
					'Ext.ux.gcp.vtypes.CustomVTypes'],
			controllers : ['GCP.controller.POViewController'],
			init : function(application) {
				Ext.ux.gcp.vtypes.CustomVTypes.applyDateRange();
				prefHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
				prefHandler.init(application);
			},
			launch : function() {
				if("true" === poAcceptanceDetails){
					objAcceptanceView = Ext.create('GCP.view.POAcceptanceView', {
							renderTo : 'poAcceptanceView'
						});
				}
				
				if(!Ext.isEmpty(poLineDetails) && !(poLineDetails === "[]")){
					objLineItemGridView = Ext.create('GCP.view.POLineItemsDetailsView', {
					renderTo : 'poLineItemsDetailsView'
					});
				}
				
				if(!Ext.isEmpty(downPaymentDetailsBean)  && !(downPaymentDetailsBean === "[]")){
				objDownPaymentsView = Ext.create('GCP.view.PODownPaymentsDetailsView', {
					renderTo : 'poDownPaymentsDetailsView'
				});
				}
				if(!Ext.isEmpty(financeBean) && !(financeBean === "[]")){
				objFinanceRequestView = Ext.create('GCP.view.POFinanceRequestDetailsView', {
					renderTo : 'poFinanceRequestDetailsView'
				});
				}
				if(!Ext.isEmpty(loanRequestBean) && !(loanRequestBean === "[]")){
				objLoanDisbursalsView = Ext.create('GCP.view.POLoanDisbursalsDetailsView', {
					renderTo : 'poLoanDisbursalsDetailsView'
				});
					}
				if(!Ext.isEmpty(invoiceCreationBean) && !(invoiceCreationBean === "[]")){
				objInvoiceCreationView = Ext.create('GCP.view.POInvoiceCreationDetailsView', {
							renderTo : 'pOInvoiceCreationDetailsView'
						});
					}
				if(!Ext.isEmpty(loanSettlementBean) && !(loanSettlementBean === "[]")){
				objLoanSettlementDetailsView = Ext.create('GCP.view.POLoanSettlementDetailsView', {
					renderTo : 'poLoanSettlementDetailsView'
				});
					}
				if(!Ext.isEmpty(loanOverDuesBean) && !(loanOverDuesBean === "[]")){
				objLoanOverduesDetailsView = Ext.create('GCP.view.POLoanOverduesView', {
					renderTo : 'poLoanOverduesDetailsView'
				});
				}
				if(!Ext.isEmpty(invoiceReconciliationDetails) && !(invoiceReconciliationDetails === "[]")){
					objInvoiceReconciliationDetails = Ext.create('GCP.view.POInvoiceReconciliationDetailsView', {
						renderTo : 'pOInvoiceReconciliationDetailsView'
					});
				}
			}
		});	
