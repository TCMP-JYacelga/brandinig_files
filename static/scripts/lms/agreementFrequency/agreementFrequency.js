var AGREEMENT_FREQUENCY_GENERIC_COLUMN_MODEL = [ {
							"colId" : "agreementCode",
							"colHeader" : getLabel("lbl.schedule.agreementcode","Agreement Code"),
							"locked"	: false,
							"hidden"	: false,
							"hideable"	: false
						}, {
							"colId" : "agreementName",
							"colHeader" : getLabel("lbl.schedule.agreementname","Agreement Name"),
							"locked"	: false,
							"hidden"	: false,
							"hideable"	: true
						}, {
							"colId" : "clientName",
							"colHeader" : getLabel("lbl.companyname","Company Name"),
							"locked"	: false,
							"hidden"	: false,
							"hideable"	: true
						}, {
							"colId" : "bankReferenceTimeDesc",
							"colHeader" : getLabel("lbl.schedule.reftime","Reference Time"),
							"locked"	: false,
							"hidden"	: false,
							"hideable"	: true
						}, {
							"colId" : "priority",
							"colHeader" : getLabel("lbl.schedule.priority","Priority"),
							"locked"	: false,
							"hidden"	: false,
							"hideable"	: true
						}, {
							"colId" : "agreementFreqTypeDesc",
							"colHeader" : getLabel("lbl.schedule.frequency","Frequency"),
							"locked"	: false,
							"hidden"	: false,
							"hideable"	: true
						},
						 {
							"colId" : "frequencyType",
							"colHeader" : getLabel("lbl.schedule.frequencyType","Frequency Type"),
							"locked"	: false,
							"hidden"	: false,
							"hideable"	: true
						}, {
							"colId" : "nextExecDate",
							"colHeader" : getLabel("lbl.schedule.nextdate","Next Execution Date"),
							"locked"	: false,
							"hidden"	: false,
							"hideable"	: true
						}, {
							"colId" : "requestStateDesc",
							"colHeader" : getLabel("lms.notionalMst.status","Status"),
							"locked"	: false,
							"hidden"	: false,
							"hideable"	: true
						} ];

var arrActionColumnStatus = [							
		{
		"code" : "0",
		"desc" : getLabel( 'lblNew', 'New' )
		},
		{
		"code" : "12",
		"desc" : getLabel( 'lblSubmitted', 'Submitted' )
		},
		{
		"code" : "30",
		"desc" : getLabel( 'lblPendingSend', 'Pending Send' )
		} ,
		(entityType === '1')?{
		"code" : "31",
		"desc" : getLabel( 'lblSentToBank', 'Sent to bank' )
		}: {
			"code" : "34",
			"desc" : getLabel( 'lblPendingVerify', 'Pending Verify' )
			},
		{
		"code" : "32",
		"desc" : getLabel( 'lblActive', 'Active' )
		},
		{
		"code" : "33",
		"desc" : getLabel( 'lblVerifyRejected', 'Verify Rejected' )
		},
		
		{
		"code" : "7",
		"desc" : getLabel( 'lblNewRejected', 'New Rejected' )
		},
		{
		"code" : "1",
		"desc" : getLabel( 'lblModified', 'Modified' )
		},
		{
		"code" : "8",
		"desc" : getLabel( 'lblModifiedReject', 'Modified Rejected' )
		},
		{
		"code" : "5",
		"desc" : getLabel( 'lblSuspendRequest', 'Suspend Request' )
		},
		{
		"code" : "9",
		"desc" : getLabel( 'lblSuspendReqRejected', 'Suspend Request Rejected' )
		},
		{
		"code" : "11",
		"desc" : getLabel( 'lblDisabled', 'Suspended' )
		},
		{
		"code" : "4",
		"desc" : getLabel( 'lblEnableRequest', 'Enable Request' )
		},
		{
		"code" : "10",
		"desc" : getLabel( 'lblEnableReqRejected', 'Enable Request Rejected' )
		},
		{
		"code" : "6",
		"desc" : getLabel( 'lblExpired', 'Expired' )
		},
		{
		"code" : "14",
		"desc" : getLabel( 'lblModifiedSubmitted', 'Modified Submitted' )
		},
		{
		"code" : "13",
		"desc" : getLabel( 'lblPendingApproval', 'Pending My Approval' )
		}]