SECURITY_GENERIC_COLUMN_MODEL =  [{
					"colId" : "clientDesc",
					"colHeader" : getLabel('client', 'Company Name'),
					"sortable":true,
					"width" : 200,
					"colType":"string",
					"colDesc":getLabel('client', 'Company Name'),
					"colSequence":1,
					"locked":false,
					"hidden":false,
					"hideable":true
				}, {
					"colId" : "profileName",
					"colHeader" : getLabel('securityProfile', 'Security Profile'),
					"sortable":true,
					"width" : 200,
					"colType":"string",
					"colDesc": getLabel('securityProfile', 'Security Profile'),
					"colSequence":2,
					"locked":false,
					"hidden":false,
					"hideable":true
				}, {
					"colId" : "integrityCheckFlag",
					"colHeader" : getLabel('integrityCheck', 'Integrity Check'),
					"sortable":true,
					"width" : 200,
					"colType":"string",
					"colDesc":getLabel('integrityCheck', 'Integrity Check'),
					"colSequence":3,
					"locked":false,
					"hidden":false,
					"hideable":true
				}, {
					"colId" : "encryptionFlag",
					"colHeader" : getLabel('encryption', 'Encryption'),
					"sortable":true,
					"width" : 200,
					"colType":"string",
					"colDesc":getLabel('encryption', 'Encryption'),
					"colSequence":4,
					"locked":false,
					"hidden":false,
					"hideable":true
				}, {
					"colId" : "singingFlag",
					"colHeader" : getLabel('signing', 'Signing'),
					"sortable":true,
					"width" : 200,
					"colType":"string",
					"colDesc": getLabel('signing', 'Signing'),
					"colSequence":5,
					"locked":false,
					"hidden":false,
					"hideable":true
				}, {
					"colId" : "requestStateDesc",
					"colHeader" : getLabel('status', 'Status'),
					"sortable":false,
					"width" : 500,
					"colType":"string",
					"colDesc": getLabel('status', 'Status'),
					"colSequence":6,
					"locked":false,
					"hidden":false,
					"hideable":true
				}];
	
var arrStatus = 	[
 	  {
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
      }
 	];