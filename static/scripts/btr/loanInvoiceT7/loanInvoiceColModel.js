LOAN_INVOICE_GENERIC_COLUMN_MODEL =  [
					{
						"colId" : "invoiceNumber",
						"colHeader" : getLabel( 'invoiceNumber', 'Invoice No.' )
					},
					{
						"colId" : "clientId",
						"colHeader" : getLabel( 'obligorNumber', 'Obligor ID' )
					},
					{
						"colId" : "accountName",
						"colHeader" : getLabel( 'accountName', 'Account Name' )
					},
					{
						"colId" : "clientDesc",
						"colHeader" : getLabel( 'ObligationId', 'Obligation ID' )
					},
					{
						"colId" : "dueDate",
						"colHeader" : getLabel( 'paymentDue', 'Payment Due Date' )
					},
					{
						"colId" : "amountDueDesc",
						"colHeader" : getLabel( 'principalDueAmount', 'Principal Due Amount' ),
						"colType" : "number"
					},
					{
						"colId" : "feeDueDesc",
						"colHeader" : getLabel( 'feesDueAmount', 'Fees Due Amount' ),
						"colType" : "number"
					},
					{
						"colId" : "interestDueDesc",
						"colHeader" : getLabel( 'interestDueAmount', 'Interest Due Amount' ),
						"colType" : "number"
					},
					{
						"colId" : "paidAmount",
						"colHeader" : getLabel( 'totalInvoiceDue', 'Total Invoice Due' ),
						"colType" : "number"
					},
					{
						"colId" : "loanStatus",
						"colHeader" : getLabel( 'status', 'Status' ),
						"sortable" : false
					}
				];
				
var arrLoanInvoiceStatus=[{
						"key" : "3",
						"value" : "Outstanding"
					},
					{
						"key" : "5",
						"value" : "Paid"
					},
					{
						"key" : "7",
						"value" : "Overdue"
					},
					{
						"key" : "6",
						"value" : "Partial Paid"
					},
					{
						"key" : "2",
						"value" : "Rejected"
					}];
APPROVAL_CONFIRMATION_COLUMN_MODEL = [{
			"colId" : "invoiceNumber",
			"colHeader" : getLabel('invoiceNumber', 'Invoice No.'),
			"width" : 180
		}, {
			"colId" : "clientId",
			"colHeader" : getLabel('obligorNumber', 'Obligor ID'),
			"width" : 180
		}, {
			"colId" : "clientDesc",
			"colHeader" : getLabel('ObligationId', 'Obligation ID'),
			"width" : 180
		}, {
			"colId" : "dueDate",
			"colHeader" : getLabel('paymentDue', 'Payment Due Date'),
			"width" : 150
		}, {
			"colId" : "amountDueDesc",
			"colHeader" : getLabel('obligationPaymentDue',
					'Obligation Payment Due'),
			"colType" : "amount",
			"width" : 200
		}, {
			"colId" : "paidAmount",
			"colHeader" : getLabel('totalInvoiceDue', 'Total Invoice Due'),
			"colType" : "amount",
			"width" : 200
		}];					