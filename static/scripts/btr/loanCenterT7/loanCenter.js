
var arrColsPref = null;

if( isSiTabSelected == 'Y' )
{
	arrColsPref =
	[
		{
			"colId" : "requestReference",
			"colHeader" : getLabel( 'reference', 'Request Reference' ),
			"hidden" : false,
			"locked"	: false,
			"hideable"	: true,
			"colSequence":1			
		},
		{
			"colId" : "obligorID",
			"colHeader" : getLabel( 'obligorNumber', 'Obligor ID' ),
			"hidden" : false,
			"locked"	: false,
			"hideable"	: true,
			"colSequence":2	
		},
		{
			"colId" : "obligationID",
			"colHeader" : getLabel( 'obligationNumber', 'Obligation ID' ),
			"hidden" : false,
			"locked"	: false,
			"hideable"	: true,
			"colSequence":3	
		},
		{
			"colId" : "accountName",
			"colHeader" : getLabel( 'accountName', 'Account Name' ),
			"hidden" : false,
			"locked"	: false,
			"hideable"	: true,
			"colSequence":4	
		},
		{
			"colId" : "requestedAmnt",
			"colHeader" : getLabel( 'requestedAmnt', 'Loan Balance' ),
			"colType" : "number",
			"hidden" : false,
			"locked"	: false,
			"hideable"	: true,
			"colSequence":5	
		},
		{
			"colId" : "requestDate",
			"colHeader" : getLabel( 'requestDate', 'Request Date' ),
			"hidden" : false,
			"locked"	: false,
			"hideable"	: true,
			"colSequence":6	
		},
		{
			"colId" : "siNextExecDate",
			"colHeader" : getLabel( 'siNextExecDate', 'Next Execution Date' ),
			"hidden" : false,
			"locked"	: false,
			"hideable"	: true,
			"colSequence":7	
		},
		{
			"colId" : "paymentTypeDesc",
			"colHeader" : getLabel( 'paymentTypeDesc', 'Type' ),
			"hidden" : false,
			"locked"	: false,
			"hideable"	: true,
			"colSequence":8	
		},
		{
			"colId" : "siRequestStatusDesc",
			"colHeader" : getLabel( 'statusDesc', 'Status' ),
			"sortable" : false,
			"hidden" : false,
			"locked"	: false,
			"hideable"	: true,
			"colSequence":9	
		}
	];
}
else
{
	arrColsPref =
	[
		{
			"colId" : "requestReference",
			"colHeader" : getLabel( 'reference', 'Request Reference' ),
			"hidden" : false,
			"locked"	: false,
			"hideable"	: true,
			"colSequence":1	
		},
		{
			"colId" : "obligorID",
			"colHeader" : getLabel( 'obligorID', 'Obligor ID' ),
			"hidden" : false,
			"locked"	: false,
			"hideable"	: true,
			"colSequence":2	
		},
		{
			"colId" : "obligationID",
			"colHeader" : getLabel( 'obligationID', 'Obligation ID' ),
			"hidden" : false,
			"locked"	: false,
			"hideable"	: true,
			"colSequence":3	
		},
		{
			"colId" : "accountName",
			"colHeader" : getLabel( 'accountName', 'Account Name' ),
			"hidden" : false,
			"locked"	: false,
			"hideable"	: true,
			"colSequence":4	
		},
		{
			"colId" : "requestedAmnt",
			"colHeader" : getLabel( 'requestedAmnt', 'Loan Balance' ),
			"colType" : "number",
			"hidden" : false,
			"locked"	: false,
			"hideable"	: true,
			"colSequence":5
		},
		{
			"colId" : "trackingNo",
			"colHeader" : getLabel('lblTracking','Tracking No.'),
			"hidden" : false,
			"locked"	: false,
			"hideable"	: true,
			"colSequence":6	
		},
		{
			"colId" : "requestDate",
			"colHeader" : getLabel( 'requestDate', 'Request Date' ),
			"hidden" : false,
			"locked"	: false,
			"hideable"	: true,
			"colSequence":6	
		},
		{
			"colId" : "effectiveDate",
			"colHeader" : getLabel( 'effectiveDate', 'Effective Date' ),
			"hidden" : false,
			"locked"	: false,
			"hideable"	: true,
			"colSequence":7	
		},
		{
			"colId" : "paymentTypeDesc",
			"colHeader" : getLabel( 'paymentTypeDesc', 'Loan Payment Type' ),
			"hidden" : false,
			"locked"	: false,
			"hideable"	: true,
			"colSequence":8	
		},
		{
			"colId" : "requestStatusDesc",
			"colHeader" : getLabel( 'statusDesc', 'Status' ),
			"sortable" : false,
			"hidden" : false,
			"locked"	: false,
			"hideable"	: true,
			"colSequence":9	
		},
		{
			"colId" : "hostResponseMsg",
			"colHeader" : getLabel( 'hostResponseMessage', 'Host Message' ),
			"hidden" : false,
			"locked"	: false,
			"hideable"	: true,
			"colSequence":10
		}
	];
}
var LOANCENTER_GENERIC_COLUMN_MODEL = arrColsPref;

var arrStatusFilter=null;
if( isSiTabSelected == 'Y' )
		{
		   arrStatusFilter=[{
						"key" : "0.N",
						"value" : getLabel( 'lblAuth', 'Pending Approval' )
					},
					{
						"key" : "0.N.A",
						"value" : getLabel( 'lblMyAuth', 'Pending My Approval' )
					},
					{
						"key" : "1.Y",
						"value" : getLabel( 'lblModified', 'Modified' )
					},
					{
						"key" : "2.N",
						"value" : getLabel( 'lblDiscarded', 'Discarded' )
					},
					{
						"key" : "3.Y",
						"value" : getLabel( 'lblActive', 'Active' )
					},
					{
						"key" : "3.N",
						"value" : getLabel( 'lblActive', 'Suspended' )
					},
					{
						"key" : "4.N",
						"value" : getLabel( 'lblEnableRequest', 'Enable Request' )
					},
					{
						"key" : "5.Y",
						"value" : getLabel( 'lblDisableRequest', 'Suspend Request' )
					},
					{
						"key" : "7.N",
						"value" : getLabel( 'lblNewRejected', 'New Rejected' )
					},
					{
						"key" : "8.Y",
						"value" : getLabel( 'lblModifyRejected', 'Modify Rejected' )
					},
					{
						"key" : "9.Y",
						"value" : getLabel( 'lblDisableReqRejected', 'Suspend Request Rejected' )
					},
					{
						"key" : "9.N",
						"value" : getLabel( 'lblEnableReqRejected', 'Enable Request Rejected' )
					},
					{
						"key" : "84.Y",
						"value" : getLabel( 'lblExpired', 'Expired' )
					},
				]
		}else{
			arrStatusFilter=[{
						"key" : "0.P",
						"value" : getLabel( 'lblAuth', 'Pending Approval' )
					},
					{
						"key" : "0.A",
						"value" : getLabel( 'lblMyAuth', 'Pending My Approval' )
					},
					{
						"key" : "1",
						"value" : getLabel( 'lblModified', 'Modified' )
					},
					{
						"key" : "2",
						"value" : getLabel( 'lblDiscarded', 'Discarded' )
					},
					{
						"key" : "3",
						"value" : getLabel( 'lblPending', 'Awaiting Response' )
					},
					{
						"key" : "4",
						"value" : getLabel( 'lblRejected', 'Rejected' )
					},
					{
						"key" : "5",
						"value" : getLabel( 'lblHostSubmitted', 'Host - Submitted' )
					},
					{
						"key" : "6",
						"value" : getLabel( 'lblHostFailed', 'Host - Failed' )
					},
					{
						"key" : "7",
						"value" : getLabel( 'lblHostRejected', 'Host - Rejected' )
					},
					{
						"key" : "8",
						"value" : getLabel( 'lblHostProcessed', 'Processed' )
					},
					{
						"key" : "11",
						"value" : getLabel( 'lblHostProcessed', 'WareHoused' )
					}
				]
		}
var APPROVAL_CONFIRMATION_COLUMN_MODEL = isSiTabSelected === 'Y' ?

[{
			"colId" : "requestReference",
			"colHeader" : getLabel('lblrequestReference', 'Request Reference'),
			"sortable" : false,
			"draggable" : false,
			"hideable"	: true
		}, {
			"colId" : "obligorID",
			"colHeader" : getLabel('lblobligorID', 'Obligor ID'),
			"sortable" : false,
			"draggable" : false,
			"hideable"	: true
		}, {
			"colId" : "obligationID",
			"colHeader" : getLabel('lblObligationId', 'Obligation ID'),
			"sortable" : false,
			"draggable" : false,
			"hideable"	: true
		}, {
			"colId" : "accountName",
			"colHeader" : getLabel('lblAccountName', 'Account Name'),
			"sortable" : false,
			"draggable" : false,
			"hideable"	: true
		}, {
			"colId" : "requestedAmnt",
			"colHeader" : getLabel('lblamount', 'Loan Balance'),
			"sortable" : false,
			"draggable" : false,
			"hideable"	: true
		}, {
			"colId" : "requestDate",
			"colHeader" : getLabel('requestDate', 'Request Date'),
			"sortable" : false,
			"draggable" : false,
			"hideable"	: true
		}, {
			"colId" : "paymentTypeDesc",
			"colHeader" : getLabel('lbltype', 'Loan Payment Type'),
			"sortable" : false,
			"draggable" : false,
			"hideable"	: true
		}] : [{
			"colId" : "requestReference",
			"colHeader" : getLabel('lblrequestReference', 'Request Reference'),
			"sortable" : false,
			"draggable" : false,
			"hideable"	: true
		}, {
			"colId" : "obligorID",
			"colHeader" : getLabel('lblobligorID', 'Obligor ID'),
			"sortable" : false,
			"draggable" : false,
			"hideable"	: true
		}, {
			"colId" : "obligationID",
			"colHeader" : getLabel('lblObligationId', 'Obligation ID'),
			"sortable" : false,
			"draggable" : false,
			"hideable"	: true
		}, {
			"colId" : "accountName",
			"colHeader" : getLabel('lblAccountName', 'Account Name'),
			"sortable" : false,
			"draggable" : false,
			"hideable"	: true
		}, {
			"colId" : "requestedAmnt",
			"colHeader" : getLabel('lblamount', 'Loan Balance'),
			"colType" : "amount",
			"sortable" : false,
			"draggable" : false,
			"hideable"	: true
		}, {
			"colId" : "effectiveDate",
			"colHeader" : getLabel('lblEffectiveDate', 'Effective Date'),
			"sortable" : false,
			"draggable" : false,
			"hideable"	: true
		}, {
			"colId" : "paymentTypeDesc",
			"colHeader" : getLabel('lbltype', 'Loan Payment Type'),
			"sortable" : false,
			"draggable" : false,
			"hideable"	: true
		}, {
			"colId" : "hostResponseMsg",
			"colHeader" : getLabel('lblhostMessage', 'Host Message'),
			"sortable" : false,
			"draggable" : false,
			"hideable"	: true
		}];
