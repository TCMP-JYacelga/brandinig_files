var APPR_WRKFLOW_GENERIC_COLUMN_MODEL=[{
					"colId" : "rClientDesc",
					"colHeader" : getLabel('client', 'Company Name'),
					"colDesc"	: getLabel('client', 'Company Name'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":1,
					 width : 180
				}, {
					"colId" : "axmName",
					"colHeader" : getLabel('defaultMatrix', 'Default Matrix'),
					"colDesc"	: getLabel('defaultMatrix', 'Default Matrix'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":2,
					 width : 180
				}, {
					"colId" : "requestStateDesc",
					"colHeader" : getLabel('status', 'Status'),
					"colDesc"	: getLabel('status', 'Status'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":3,
					"sortable": false,
					 width : 180
				}]

var arrWorkFlowStatus = 	[
                       	  {
                       		"code": "0",
                       		"desc":getLabel("new" ,"New")
                       	  },
                       	  {
                       		"code": "3",
                       		"desc": getLabel("approved" ,"Approved")
                       	  },
                       	  {
                       		"code": "1",
                       		"desc": getLabel("modified" ,"Modified")
                       	  },	  
                       	  {
                       		"code": "4",
                       		"desc": getLabel("enablerequest" ,"Enable Request")
                       	  },
                       	  {
                       		"code": "5",
                       		"desc":  getLabel("suspendrequest" ,"Suspend Request")
                       	  },
                       	  {
                       		"code": "3.N",
                       		"desc": getLabel("suspended" ,"Suspended")
                       	  },
                       	  {
                       		"code": "7",
                       		"desc": getLabel("newrejected" ,"New Rejected")
                       	  },
                       	  {
                       		"code": "8",
                       		"desc": getLabel("modifiedrejected" ,"Modified Rejected")
                       	  },	  
                       	  {
                       		"code": "9",
                       		"desc": getLabel("suspendrequestrejected" ,"Suspend Request Rejected")
                       	  },
                       	  {
                       		"code": "10",
                       		"desc": getLabel("enablerequestrejected" ,"Enable Request Rejected")
                       	  }
                       	];