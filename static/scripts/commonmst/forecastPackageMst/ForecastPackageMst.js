var FORECAST_PACKAGE_COLUMNS = [{
	"colId" : "clientName",
	"colHeader" : getLabel('lblcompany', 'Company Name'),
	"sortable" : true,
	"colDesc" : getLabel('lblcompany', 'Company Name'),
	"colSequence" : 1,
	"width" : 200,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "mypDescription",
	"colHeader" : getLabel('cffPackage', 'Forecast Package'),
	"sortable" : true,
	"colDesc" : getLabel('cffPackage', 'Forecast Package'),
	"colSequence" : 3,
	"width" : 170,
	"locked" : false,
	"hidden" : false,
	"hideable" : false
},{
	"colId" : "mypAllowRepetitive",
	"colHeader" : getLabel('isRecurring', 'Recurring'),
	"sortable" : true,
	"colDesc" : getLabel('isRecurring', 'Recurring'),
	"colSequence" : 5,
	"width" : 170,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "requestStateDesc",
	"colHeader" : getLabel('status', 'Status'),
	"sortable" : false,
	"colDesc" : getLabel('status', 'Status'),
	"colSequence" : 6,
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