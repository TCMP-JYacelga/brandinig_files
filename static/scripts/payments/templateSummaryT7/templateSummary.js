/**
 * Sample Column Model, User should have to structured the column model in this
 * way
 */
var TEMPLATE_GENERIC_COLUMN_MODEL = [{
			"colId" : "templateName",
			"colHeader" : "Template Name",
			"hidden" : false,
			"width" : 150
		}, {
			"colId" : "sendingAccount",
			"colHeader" : "Sending Account",
			"hidden" : false
		}, {
			"colId" : "recieverName",
			"colHeader" : getLabel("receiverName","Receiver Name"),
			"hidden" : false
		}, {
			"colId" : "amount",
			"colHeader" : "Amount",
			"colType" : "amount",
			"hidden" : false
		}, {
			"colId" : "count",
			"colHeader" : "Count",
			"colType" : "count",
			"hidden" : false,
			"width" : 50
		}, {
			"colId" : "actionStatus",
			"colHeader" : "Status",
			"hidden" : false
		}, {
			"colId" : "productCategoryDesc",
			"colHeader" : "Payment Type",
			"hidden" : false
		}, {
			"colId" : "productTypeDesc",
			"colHeader" : "Payment Package",
			"hidden" : false
		}, {
			"colId" : "templateStartDate",
			"colHeader" : "Start Date",
			"hidden" : false,
			"width" : 80
		}, {
			"colId" : "phdnumber",
			"colHeader" : "Tracking No.",
			"hidden" : true
		}, {
			"colId" : "creditAmount",
			"colHeader" : "Credit Amount",
			"colType" : "amount",
			"hidden" : true
		}, {
			"colId" : "debitAmount",
			"colHeader" : "Debit Amount",
			"colType" : "amount",
			"hidden" : true
		}, {
			"colId" : "recieverAccount",
			"colHeader" : getLabel("recieverAccount","Receiving Account"),
			"hidden" : true
		}, {
			"colId" : "templateType",
			"colHeader" : "Type of Template",
			"hidden" : true
		}, {
			"colId" : "maker",
			"colHeader" : "Entry User",
			"hidden" : true
		}, {
			"colId" : "client",
			"colHeader" : "Company Name",
			"hidden" : true
		}, {
			"colId" : "templateMaxUsage",
			"colHeader" : "Maximum Executions",
			"hidden" : true
		}, {
			"colId" : "templateNoOfExec",
			"colHeader" : "Completed Executions",
			"hidden" : true
		}, {
			"colId" : "templateEndDate",
			"colHeader" : "End Date",
			"hidden" : true,
			"width" : 80
		}, {
			"colId" : "companyId",
			"colHeader" : "Company ID",
			"hidden" : false
		}, {
			"colId" : "templateDescription",
			"colHeader" : "Template Description",
			"hidden" : true
		}, {
			"colId" : "cutoffTime",
			"colHeader" : "Cutoff Time",
			"hidden" : true
		}, {
			"colId" : "sendingAccountDescription",
			"colHeader" : "Sending Account Name",
			"hidden" : true
		}]

var arrSortByPaymentFields = [{
			"colId" : "sortTemplateName",
			"colDesc" : "Template Name"
		}, {
			"colId" : "sortSendingAccount",
			"colDesc" : "Sending Account"
		}, {
			"colId" : "recieverName",
			"colDesc" :getLabel("receiverName","Receiver Name")
		}, {
			"colId" : "amount",
			"colDesc" : getLabel("amount", "Amount")
		}, {
			"colId" : "count",
			"colDesc" : getLabel("count", "Count")
		}, /*{
			"colId" : "sortActionStatus",
			"colDesc" : getLabel("actionStatus", "Status")
		},*/ {
			"colId" : "productCategoryDesc",
			"colDesc" : "Payment Category"
		}, {
			"colId" : "sortProductTypeDesc",
			"colDesc" : "Payment Package"
		}, {
			"colId" : "TemplateStartDate",
			"colDesc" : "Start Date"
		}, {
			"colId" : "sortPhdnumber",
			"colDesc" : "Tracking No."
		}, {
			"colId" : "creditAmount",
			"colDesc" : "Credit Amount"
		}, {
			"colId" : "debitAmount",
			"colDesc" : "Debit Amount"
		}, {
			"colId" : "sortRecieverAccount",
			"colDesc" : "Receiving Account"
		}, {
			"colId" : "TemplateTypeDesc",
			"colDesc" : "Type of Template"
		}, {
			"colId" : "maker",
			"colDesc" : "Entry User"
		}, {
			"colId" : "sortClient",
			"colDesc" : "Company Name"
		}, {
			"colId" : "TemplateMaxExecutions",
			"colDesc" : "Maximum Executions"
		}, {
			"colId" : "templateNoOfExec",
			"colDesc" : "Completed Executions"
		}, {
			"colId" : "TemplateEndDate",
			"colDesc" : "End Date"
		}, {
			"colId" : "sortCompanyId",
			"colDesc" : "Company ID"
		}, {
			"colId" : "sortTemplateDescription",
			"colDesc" : "Template Description"
		},{
			"colId" : "sortSendingAccountDescription",
			"colDesc" : "Sending Account Name"
		}, {
			"colId" : "anyIdTypeDesc",
			"colDesc" : "Any ID Type"
		}, {
			"colId" : "anyIdValue",
			"colDesc" : "Any ID Value"
		}, {
			"colId" : "receiverCode",
			"colDesc" : "Receiver Code"
		}, {
			"colId" : "receiverShortCode",
			"colDesc" : "Receiver short Code"
		}, {
			"colId" : "BeneBankDescription",
			"colHeader" : "Receiver Bank Name",
		}, {
			"colId" : "BeneBranchDescription",
			"colHeader" : "Receiver Branch Name",
		}];

var arrPaymentStatus = [{
			'code' : '0',
			'desc' : getLabel("draft","Draft")
		}, {
			'code' : '101',
			'desc' :  getLabel("pendingsubmit","Pending Submit")
		}, {
			'code' : '1,2',
			'desc' : getLabel("new","New")
		}, {
			'code' : '4',
			'desc' : getLabel("newrejected",'New Rejected')
		}, {
			'code' : '3',
			'desc' :getLabel("enabled",'Enabled')
		}, {
			'code' : '73',
			'desc' : getLabel("modifiedrejected",'Modified Rejected')
		}, {
			'code' : '8',
			'desc' : getLabel("deleted",'Deleted')
		}, {
			'code' : '79',
			'desc' : getLabel("modifieddraft",'Modified Draft')
		}, {
			'code' : '80',
			'desc' :  getLabel("modificationpendingsubmit",'Modification Pending For Submit')
		}, {
			'code' : '81,91',
			'desc' :  getLabel("suspendrequest",'Suspend Request')
		}, {
			'code' : '82',
			'desc' : getLabel("suspended",'Suspended')
		}, {
			'code' : '83,92',
			'desc' : getLabel("enablerequest",'Enable Request')
		}, {
			'code' : '84',
			'desc' : getLabel("expired",'Expired')
		}, {
			'code' : '85',
			'desc' :  getLabel("used",'Used')
		}, {
			'code' : '86',
			'desc' : getLabel("suspendrequestreject",'Suspend Request Reject')
		}, {
			'code' : '87',
			'desc' : getLabel("enablerequestreject",'Enable Request Reject')
		}, {
			'code' : '88,89',
			'desc' :  getLabel("modified",'Modified')
		}];

var arrActionColumnStatus = [['0', 'Draft'], ['101', 'Pending Submit'],
		['1,2', 'New'], ['4', 'New Rejected'], ['3', 'Enabled'],
		['73', 'Modified Rejected'],['8', ' Deleted'],
		['79', 'Modified Draft'], ['80', 'Modification Pending For Submit'],
		['81,91', 'Suspend Request '], ['82', 'Suspended'],
		['83,92', 'Enable Request '], ['84', 'Expired'], ['85', 'Used'],
		['86', ' Suspend Request Reject'], ['87', 'Enable Request Reject'],
		['88,89', 'Modified']];
