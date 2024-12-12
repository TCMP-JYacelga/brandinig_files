var RECON_RULE_COLUMNS = [{
	"colId" : "clientDesc",
	"colHeader" : getLabel('lbl.reconciliation.companyname', 'Company Name'),
	"sortable" : true,
	"colDesc" : getLabel('lbl.reconciliation.companyname', 'Company Name'),
	"colSequence" : 1,
	"width" : 200,
	"locked" : false,
	"hidden" : false,
	"hideable" : false
},{
	"colId" : "ruleDescription",
	"colHeader" : getLabel('ruleDesc', 'Description'),
	"sortable" : true,
	"colDesc" :  getLabel('ruleDesc', 'Description'),
	"colSequence" : 2,
	"width" : 200,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "rulePriority",
	"colHeader" : getLabel('priority', 'Priority'),
	"sortable" : true,
	"colDesc" : getLabel('priority', 'Priority'),
	"colSequence" : 3,
	"width" : 170,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "scmMyProductDesc",
	"colHeader" : getLabel('scmProduct', 'SCF Package'),
	"sortable" : true,
	"colDesc" : getLabel('scmProduct', 'SCF Package'),
	"colSequence" : 4,
	"width" : 170,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
},{
	"colId" : "requestStateDesc",
	"colHeader" : getLabel('status', 'Status'),
	"sortable" : false,
	"colDesc" : getLabel('status', 'Status'),
	"colSequence" : 5,
	"width" : 170,
	"locked" : false,
	"hidden" : false,
	"hideable" : true,
	fnColumnRenderer : function(value, meta, record, rowIndex, colIndex, store,view, colId)
    {
               var value1 = value.replace(/\s/g,'');
               value = getLabel(value1,value)
               meta.tdAttr = 'title="' + value + '"';
               return value;
    } 
}];
var arrStatus = 	[
                 	  {
                 		"code": "0",
                 		"desc": getLabel("New","New")
                 	  },
                 	  {
                 		"code": "3",
                 		"desc": getLabel("Approved","Approved")
                 	  },
                 	  {
                 		"code": "1",
                 		"desc": getLabel("Modified","Modified")
                 	  },	  
                 	  {
                 		"code": "4",
                 		"desc": getLabel("EnableRequest","Enable Request")
                 	  },
                 	  {
                 		"code": "5",
                 		"desc": getLabel("SuspendRequest","Suspend Request")
                 	  },
                 	  {
                 		"code": "11",
                 		"desc": getLabel("Suspended","Suspended")
                 	  },
                 	  {
                 		"code": "7",
                 		"desc": getLabel("NewRejected","New Rejected")
                 	  },
                 	  {
                 		"code": "8",
                 		"desc": getLabel("ModifiedRejected","Modified Rejected")
                 	  },	  
                 	  {
                 		"code": "9",
                 		"desc": getLabel("SuspendRequestRejected","Suspend Request Rejected")
                 	  },
                 	  {
                 		"code": "10",
                 		"desc": getLabel("EnableRequestRejected","Enable Request Rejected")
                 	  },
                 	  {
                 		"code": "12",
                 		"desc": getLabel("Submitted","Submitted")
                      }
                 	];