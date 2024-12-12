var CASH_POSITION_GENERIC_COLUMN_MODEL = [{
							"colId" : "txnCategoryDesc",
							"colHeader" : getLabel("lbltxnCategoryDesc","Txn Category"),
						     width : 200,
						     "hideable"	: false
							  
						}, {
							"colId" : "creditCount",
							"colHeader" : getLabel("lblcreditCount","Credit Count"),
							width : 150,
							align:'right'
							
						}, {
							"colId" : "totalCreditAmount",
							"colHeader" : getLabel("lbltotalCreditAmount","Total Credits"),
							width : 150,
							align:'right'
							
						}, {
							"colId" : "debitCount",
							"colHeader" : getLabel("lbldebitCount","Debit Count"),
							width : 150,
							align:'right'
							
						},{
							"colId":"totalDebitAmount",
							"colHeader":getLabel("lbltotalDebitAmount","Total Debits"),
							 width:150,
							 align:'right'
							
						}];
var CASH_POSITION_GENERIC_ACCOUNT_COLUMN_MODEL = [
						{
							"colId" : "summaryDate",
							"colHeader" : getLabel('date', 'Date'),
							 "hideable"	: false,
						    width : 150
						}, {
							"colId" : "accountNumber",
							"colHeader" : getLabel('account', 'Account'),
							"colType" : "number",
							 "hideable"	: false,
							width : 130
							
						}, {
							"colId" : "accountName",
							"colHeader" : getLabel('accountName','Account Name'),
							"hideable"	: false,
							width : 150
							
						}, {
							"colId" : "accountType",
							"colHeader" : getLabel('accountType', 'Account Type'),
							width : 130							
						},
						{
							"colId":'creditCount',
							"colHeader":getLabel('creditCount', 'Credit Count'),
							width:100,
							"colType" : "number",
							"align":'right'
						},
						{
							"colId":'credit',
							"colHeader":getLabel('totalCredit', 'Total Credit'),
							width:80,
							"colType" : "number",
							"align":'right'
							
						},{
							"colId":'debitCount',
							"colHeader": getLabel('debitcount', 'Debit Count'),
							width:80,
							"colType" : "number",
							"align":'right'
						},{
							"colId":'debit',
							"colHeader":getLabel('totalDebit', 'Total Debit'),
							width:80,
							"colType" : "number",
							"align":'right'
						
						}];
						
						
var CASH_POSITION_GENERIC_TXN_COLUMN_MODEL = [{
					"colId" : "accountNumber",
					"colHeader" : getLabel('account', 'Account'),
					"colType" : "number",
					 "hideable"	: false,
					align:'right'

				}, {
					"colId" : "accountName",
					"colHeader" : getLabel('accName', 'Account Name'),
					 "hideable"	: false

				}, {
					"colId" : "transactionDate",
					"colHeader" : getLabel('positionDate', 'Posting Date'),
					 width : 150,
					 "hideable"	: false

				}, {
					"colId" : "accountType",
					"colHeader" : getLabel('accType', 'Account Type'),
					 width:160

				},  {
					"colId" : "typeCode",
					"colHeader" : getLabel('typeCode', 'Type Code'),
					align : 'right',
					"colType" : "number",
					width:60

				}, {
					"colId" : "typeCodeDesc",
					"colHeader" : getLabel('typeDesc', 'Type Description'),
					width : 150,
					 "hideable"	: false

				}, {
					"colId" : "customerReference",
					"colHeader" : getLabel('custRef', 'Customer Ref'),
					"colType" : "number",
					align:'right',
					 "hideable"	: false

				}, {
					"colId" : "bankReference",
					"colHeader" : getLabel('bankRef', 'Bank Ref'),
					"colType" : "number",
					align:'right',
					width:100

				}, {
					"colId" : "textField",
					"colHeader" : getLabel('text', 'Text'),
					width:180

				}, {
					"colId" : "noteText",
					"colHeader" : getLabel('notes', 'Notes')

				}, {
					"colId" : "credit",
					"colHeader" : getLabel('credit', 'Credit'), 
					"colType" : "number",
					 "hideable"	: false,
					align:'right'

				}, {
					"colId" : "debit",
					"colHeader" : getLabel('debit', 'Debit'),
					"colType" : "number",
					 "hideable"	: false,
					align:'right'
					
				}];

function getLabel(key, defaultText) 
{
	return (btrLabelsMap && btrLabelsMap[key]) ? btrLabelsMap[key] : defaultText
}
var mapService = {
		'SUBFAC0101' : 'BR_STDVIEW_SUBFAC_SAVING',
		'SUBFAC0102' : 'BR_STDVIEW_SUBFAC_CURRENT',
		'SUBFAC0103' : 'BR_STDVIEW_SUBFAC_CRDCARD',
		'SUBFAC0104' : 'BR_STDVIEW_SUBFAC_CALL',
		'SUBFAC0105' : 'BR_STDVIEW_SUBFAC_ESCROW',
		'SUBFAC0106' : 'BR_STDVIEW_SUBFAC_COLLECTION',
		'SUBFAC0107' : 'BR_STDVIEW_SUBFAC_MONEY',
		'SUBFAC0108' : 'BR_STDVIEW_SUBFAC_CHECKING',
		'SUBFAC0301' : 'BR_STDVIEW_SUBFAC_LOAN',
		'SUBFAC0303' : 'BR_STDVIEW_SUBFAC_TERMLOAN',
		'SUBFAC0404' : 'BR_STDVIEW_SUBFAC_TERMDEPOSITS',
		'SUBFAC0405' : 'BR_STDVIEW_SUBFAC_DEPOSIT',
		'SUBFAC0406' : 'BR_STDVIEW_SUBFAC_CERTIFICATEDEPOSITS',
		'SUBFAC0801' : 'BR_STDVIEW_SUBFAC_FUND',
		'CURRENCY' : 'BR_STDVIEW_CURRENCY',
		'BANK' : 'BR_STDVIEW_BANK',
		'GROUP' : 'BR_STDVIEW_GROUP',
		'TXNCAT' : 'BR_GRIDVIEW_GENERIC',
		'GENERIC' : 'BR_GRIDVIEW_GENERIC',
		'SUMMARYRIBBON' : 'BR_SUMMARY_RIBBON',
		'SERVICE_ACTIVITY' : 'BR_ACTIVITY',
		'SERVICE_HISTORY' : 'BR_HISTORY',
		'BR_STD_SUMM_GRID' : 'BR_STD_SUMM_GRID',
		'BR_GRIDVIEW_GENERIC' : 'BR_GRIDVIEW_GENERIC',
		'BR_STD_ACT_GRID' : 'BR_STD_ACT_GRID',
		'BR_STD_ACT_RIBBON' : 'BR_STD_ACT_RIBBON',
		'BR_STD_BAL_GRID' : 'BR_STD_BAL_GRID',
		'BR_STD_BAL_RIBBON' : 'BR_STD_BAL_RIBBON',
		'BR_RIBBON_GENERIC' : 'BR_RIBBON_GENERIC',
		'loanSubFacility' : 'SUBFAC0306',
		'BR_TXN_SRC_GRID' : 'BR_TXN_SRC_GRID'
};
var arrDownloadSummaryReportColumn = {
		'txnCategoryDesc' : 'txnCategoryDesc',
		'creditCount' : 'creditCount',
		'totalCreditAmount' : 'totalCreditAmount',
		'debitCount' : 'debitCount',
		'totalDebitAmount' : 'totalDebitAmount'
};
var arrDownloadAccountReportColumn = {
		'summaryDate' : 'date',
		'accountNumber' : 'accountNumber',
		'accountName' : 'accountName',
		'accountType' : 'accountType',
		'transactionCategory' : 'transactionCategory',
		'creditCount' : 'creditCount',
		'credit' : 'credit',
		'debitCount' : 'debitCount',
		'debit' : 'debit',
		'availableBalance' : 'availableBalance',
		'ledgerBalance' : 'ledgerBalance'			
};
var arrDownloadTxnReportColumn = {
		'accountNumber' : 'accountNumber',
		'accountName' : 'accountName',
		'transactionDate' : 'transactionDate',
		'accountType' : 'accountType',
		'transactionCategory' : 'transactionCategory',
		'typeCode' : 'typeCode',
		'typeCodeDesc' : 'typeCodeDesc',
		'customerReference' : 'customerReference',
		'bankReference' : 'bankReference',
		'textField' : 'textField',
		'noteText' : 'noteText',
		'credit' : 'credit',
		'debit' : 'debit'	
};