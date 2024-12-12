var END_CLIENT_COLUMNS = [ {
	"colId" : "agentCode",
	"colHeader" : getLabel('agentID', 'SAP BP ID'),
	"sortable" : true,
	"colDesc" : getLabel('agentCode', 'Agent Code'),
	"colSequence" : 1,
	"width" : 200,
	"locked" : false,
	"hidden" : false,
	"hideable" : false
}, {
	"colId" : "clientCategory",
	"colHeader" : getLabel('endCName', 'End-Client Name'),
	"sortable" : false,
	"colDesc" : getLabel('endCName', 'End-Client Name'),
	"colSequence" : 2,
	"width" : 200,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "endClientDesc",
	"colHeader" : getLabel('subActNo', 'Sub-Account Number'),
	"sortable" : true,
	"colDesc" : getLabel('subActNo', 'Sub-Account Number'),
	"colSequence" : 3,
	"width" : 200,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "requestStateDesc",
	"colHeader" : getLabel('status', 'Status'),
	"sortable" : false,
	"colDesc" : getLabel('status', 'Status'),
	"colSequence" : 4,
	"width" : 170,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "closureRequestStateDesc",
	"colHeader" : getLabel('cStatus', 'Closure Status'),
	"sortable" : false,
	"colDesc" : getLabel('cStatus', 'Status'),
	"colSequence" : 5,
	"width" : 200,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
} ];

var arrStatus = 	[{
		"code": "0",
		"desc": "New"
	  },
	  {
		"code": "3",
		"desc": "Approved"
	  },
	  {
		"code": "1",
		"desc": "Modified"
	  },
	  {
		"code": "5",
		"desc": "Closure Requested"
	  },
	  {
		"code": "6",
		"desc": "Closure Request Accepted"
	  },
	  {
		"code": "11",
		"desc": "Closed"
	  },
	  {
		"code": "7",
		"desc": "New Rejected"
	  },
	  {
		"code": "8",
		"desc": "Modified Rejected"
	  },  
	  {
		"code": "9",
		"desc": "Closure Request Rejected"
	  },
	  {
		"code": "12",
		"desc": "Submitted"
  }];