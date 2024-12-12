var LOAN_REPAY_STANDING_ORDER_COLUMNS = [ {
	"colId" : "scmProductName",
	"colHeader" : getLabel('scmProduct', 'SCF Package'),
	"sortable" : true,
	"colDesc" : getLabel('scmProduct', 'SCF Package'),
	"colSequence" : 1,
	"width" : 170,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "startDate",
	"colHeader" : getLabel('startAndEndDate', 'Duration'),
	"sortable" : true,
	"colDesc" : getLabel('startAndEndDate', 'Duration'),
	"colSequence" : 2,
	"width" : 170,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
},{
	"colId" : "requestStateDesc",
	"colHeader" : getLabel('status', 'Status'),
	"sortable" : false,
	"colDesc" : getLabel('status', 'Status'),
	"colSequence" : 3,
	"width" : 170,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "validity",
	"colHeader" : getLabel('validity', 'Validity'),
	"sortable" : false,
	"colDesc" : getLabel('validity', 'Validity'),
	"colSequence" : 4,
	"width" : 170,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "clientDesc",
	"colHeader" : getLabel('lblcompany', 'Company Name'),
	"sortable" : true,
	"colDesc" : getLabel('lblcompany', 'Company Name'),
	"colSequence" : 5,
	"width" : 200,
	"locked" : false,
	"hidden" : true,
	"hideable" : true
}];
var arrStatus = 	[
	{
		"code": "0",
		"desc":  getLabel('New', 'New')
	},
	{
		"code": "3",
		"desc":  getLabel('Approved', 'Approved')

	},
	{
		"code": "1",
		"desc":  getLabel('Modified', 'Modified')

	},	  
	{
		"code": "4",
		"desc":  getLabel('EnableRequest', 'Enable Request')

	},
	{
		"code": "5",
		"desc":  getLabel('SuspendRequest', 'Suspend Request')

	},
	{
		"code": "11",
		"desc":  getLabel('Suspended', 'Suspended')

	},
	{
		"code": "7",
		"desc":  getLabel('NewRejected', 'NewRejected')

	},
	{
		"code": "8",
		"desc":  getLabel('ModifiedRejected', 'Modified Rejected')

	},	  
	{
		"code": "9",
		"desc":  getLabel('SuspendRequestRejected', 'Suspend Request Rejected')

	},
	{
		"code": "10",
		"desc":  getLabel('EnableRequestRejected', 'Enable Request Rejected')

	},
	{
		"code": "12",
		"desc":  getLabel('Submitted', 'Submitted')

	}
	];