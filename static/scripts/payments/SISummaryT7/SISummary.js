/**
 * Sample Column Model, User should have to structured the column model in this
 * way
 */
var SI_GENERIC_COLUMN_MODEL = [{
			"colId" : "clientReference",
			"colHeader" : "Payment Reference",
			"hidden" : false
		}, {
			"colId" : "sendingAccount",
			"colHeader" : "Sending Account",
			"hidden" : true
		}, {
			"colId" : "recieverName",
			"colHeader" : getLabel("receiverName","Receiver Name"),
			"hidden" : true
		}, {
			"colId" : "amount",
			"colType" : "amount",
			"colHeader" : "Amount",
			"hidden" : false
		}, {
			"colId" : "count",
			"colHeader" : "Count",
			"hidden" : false
		}, {
			"colId" : "siNextExecutionDate",
			"colHeader" : "Next Date",
			"hidden" : false
		}, {
			"colId" : "productCategoryDesc",
			"colHeader" : "Payment Type",
			"hidden" : false
		}, {
			"colId" : "actionStatus",
			"colHeader" : "Status",
			"hidden" : false
		}, {
			"colId" : "siFrequency",
			"colHeader" : "Frequency",
			"hidden" : false
		}, {
			"colId" : "siTerminationDate",
			"colHeader" : "End Date",
			"hidden" : false
		}, {
			"colId" : "recieverAccount",
			"colHeader" : "Receiving Account",
			"hidden" : true
		}, {
			"colId" : "entryDate",
			"colHeader"  : "Entry Date"
		}, {
			"colId" : "phdnumber",
			"colHeader" : "Tracking No.",
			"hidden" : true
		}, {
			"colId" : "creditAmount",
			"colHeader" : "Credit Amount",
			"hidden" : true
		}, {
			"colId" : "debitAmount",
			"colHeader" : "Debit Amount",
			"hidden" : true
		}, {
			"colId" : "txnType",
			"colHeader" : "Type of Transaction",
			"hidden" : true
		}, {
			"colId" : "companyId",
			"colHeader" : "Company ID",
			"hidden" : true
		}, {
			"colId" : "maker",
			"colHeader" : "Entry User",
			"hidden" : true
		}, {
			"colId" : "client",
			"colHeader" : "Company Name"
			
		}, {
			"colId" : "siType",
			"colHeader" : "Type Date",
			"hidden" : true
		}, {
			"colId" : "refDay",
			"colHeader" : "Reference Day",
			"hidden" : true
		}, {
			"colId" : "sendingAccountDescription",
			"colHeader" : "Sending Account Name",
			"hidden" : true
		}, {
			"colId" : "recieverAccountName",
			"colHeader" : getLabel("receivingAcctName","Receiving Account Name"),
			"hidden" : true
		}, {
			"colId" : "anyIdTypeDesc",
			"colHeader" : "Any ID Type",
			"hidden" : true
		}, {
			"colId" : "anyIdValue",
			"colHeader" : "Any ID Value",
			"hidden" : true
		}, {
			"colId" : "receiverCode",
			"colDesc" : "Receiver Code",
			"hidden" : true
		}, {
			"colId" : "receiverShortCode",
			"colDesc" : "Receiver short Code",
			"hidden" : true
		}, {
			"colId" : "BeneBankDescription",
			"colHeader" : "Receiver Bank Name",
			"hidden" : true
		}, {
			"colId" : "BeneBranchDescription",
			"colHeader" : "Receiver Branch Name",
			"hidden" : true
		}];

var arrSortByPaymentFields = [{
			"colId" : "siTerminationDate",
			"colDesc" : getLabel("siTerminationDate", "End Date")
		}, {
			"colId" : "siEffectiveDate",
			"colDesc" : getLabel("siEffectiveDate", "Start Date")
		}, {
			"colId" : "siNextExecutionDate",
			"colDesc" :  getLabel("siNextExecutionDate", "Next Date")
		}, {
			"colId" : "productCategoryDesc",
			"colDesc" :getLabel("PaymentType","Payment Type") 
		}, /*{
			"colId" : "payType",
			"colDesc" : getLabel("payType", "Payment Type")
		}, */{
			"colId" : "recieverName",
			"colDesc" : getLabel("receiverName","Receiver Name")
		}, {
			"colId" : "amount",
			"colDesc" : getLabel("amount", "Amount")
		}, {
			"colId" : "count",
			"colDesc" :  getLabel("count", "Count")
		}, /*{
			"colId" : "actionStatus",
			"colDesc" :  getLabel("actionStatus", "Status")
		},*//* {
			"colId" : "productTypeDesc",
			"colDesc" : getLabel("PaymentPackage", "Payment Package")
		},*//*{
			"colId" : "txnDate",
			"colDesc" : getLabel("txnDate", "Effective Date")
		},*/ {
			"colId" : "sendingAccount",
			"colDesc" : getLabel("sendingAccount", "Sending Account")
		},/*{
			"colId" : "templateName",
			"colDesc" : getLabel("templateName", "Template Name")
		},*/{
			"colId" : "recieverAccount",
			"colDesc" : getLabel("receiverAccount","Receiver Account")
		}, {
			"colId" : "entryDate",
			"colDesc" :  getLabel("entryDate", "Entry Date")
		},/* {
			"colId" : "valueDate",
			"colDesc" :getLabel("valueDate", "Process Date")
		},*/ {
			"colId" : "client",
			"colDesc" :  getLabel("client", "Company Name")
		}, /*{
			"colId" : "bankProduct",
			"colDesc" : getLabel("bankProduct", "Bank Product")
		},*/ {
			"colId" : "phdnumber",
			"colDesc" :  getLabel("TrackingNo", "Tracking No.")
		}, {
			"colId" : "clientReference",
			"colDesc" : getLabel("clientReference", "Payment Reference")
		}, /*{
			"colId" : "currency",
			"colDesc" :getLabel("SendingAccountCurrency", "Sending Account + Currency") 
		}, */{
			"colId" : "creditAmount",
			"colDesc" :getLabel("creditAmount", "Credit Amount")
		}, {
			"colId" : "debitAmount",
			"colDesc" : getLabel("debitAmount", "Debit Amount")
		}, {
			"colId" : "refDay",
			"colDesc" :  getLabel("ReferenceDay","Reference Day")
		}, {
			"colId" : "siFrequency",
			"colDesc" :  getLabel("Frequency","Frequency")
		}, {
			"colId" : "companyId",
			"colDesc" : getLabel( "CompanyID","Company ID")
		}, {
			"colId" : "sendingAccountDescription",
			"colDesc" :  getLabel("Sending Account Name","Sending Account Name")
		}, {
			"colId" : "recieverAccountName",
			"colDesc" : getLabel( "ReceivingAccountName", "Receiving Account Name")
		}, /*{
			"colId" : "txnType",
			"colDesc" :  getLabel("txnType", "Type of Transaction")
		},*/ {
			"colId" : "maker",
			"colDesc" : getLabel("maker", "Entry User")
		},/* {
			"colId" : "hostMessage",
			"colDesc" :getLabel("hostMessage", "Host Message")
		},*/{
			"colId" : "anyIdTypeDesc",
			"colDesc" :  getLabel("AnyIDType","Any ID Type")
		}, {
			"colId" : "anyIdValue",
			"colDesc" : getLabel( "AnyIDValue","Any ID Value")
		}];

var arrPaymentStatus = [{
			'code' : '0',
			'desc' :getLabel("draft","Draft")
		}, {
			'code' : '101',
			'desc' :getLabel("pendingsubmit","Pending Submit")
		}, {
			'code' : '2,1',
			'desc' : getLabel("new","New")
		}, {
			'code' : '3',
			'desc' : getLabel("enabled",'Enabled')
		}, {
			'code' : '83,92',
			'desc' :  getLabel("enablerequest",'Enable Request')
		}, {
			'code' : '81,91',
			'desc' : getLabel("suspendrequest",'Suspend Request')
		}, {
			'code' : '9',
			'desc' : getLabel("pendingrepair","Pending Repair")
		}, {
			'code' : '86',
			'desc' : getLabel("suspendrequestreject",'Suspend Request Reject')
		}, {
			'code' : '87',
			'desc' :  getLabel("enablerequestreject",'Enable Request Reject')
		}, {
			'code' : '4',
			'desc' :  getLabel("newrejectedinst","New Rejected")
		}, {
			'code' : '82',
			'desc' :  getLabel("suspended",'Suspended')
		}, {
			'code' : '84',
			'desc' :getLabel("expired",'Expired')
		}];

var arrActionColumnStatus = [['0', 'Draft'], ['101', 'Pending Submit'],
		['1,2', 'New'], ['3', 'Enabled'], ['83,92', 'Enable Request'],		
		['81,91', 'Suspend Request'], ['9', 'Pending Repair'],
		['86', 'Suspend Request Reject'],
		['87', 'Enable Request Reject'], ['4', 'Rejected'],
		['82', 'Suspended'],['84', 'Expired']];
