var ADMIN_COLUMNS = [{
	"colId" : "agentCode",
	"colHeader" : getLabel('agentID', 'Agent Code'),
	"sortable" : true,
	"colDesc" : getLabel('agentCode', 'Agent Code'),
	"colSequence" : 1,
	"width" : 200,
	"locked" : false,
	"hidden" : false,
	"hideable" : false
},{
	"colId" : "feeProfileName",
	"colHeader" : getLabel('adName', 'Admin Fee Profile Name'),
	"sortable" : true,
	"colDesc" : getLabel('adName', 'Admin Fee Profile Name'),
	"colSequence" : 2,
	"width" : 200,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "defaultProfile",
	"colHeader" : getLabel('defProf', 'Default profile'),
	"sortable" : true,
	"colDesc" : getLabel('defProf', 'Default profile'),
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
}];

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
                 		"code": "4",
                 		"desc": "Enable Request"
                 	  },
                 	  {
                 		"code": "5",
                 		"desc": "Suspend Request"
                 	  },
                 	  {
                 		"code": "11",
                 		"desc": "Suspended"
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
                 		"desc": "Suspend Request Rejected"
                 	  },
                 	  {
                 		"code": "10",
                 		"desc": "Enable Request Rejected"
                 	  },
                 	  {
                 		"code": "12",
                 		"desc": "Submitted"
                      }];