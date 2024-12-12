
var arrColsPref = null;

if( isSiTabSelected == 'Y' )
{
	arrColsPref =
	[
		{
			"colId" : "requestReference",
			"colHeader" : getLabel( 'reference', 'Reference' ),
			"sortable":true,
			 "width" : 200
		},
		{
			"colId" : "obligorID",
			"colHeader" : getLabel( 'obligorNumber', 'Obligor Id' ),
			"sortable":true,
			"width" : 200
		},
		{
			"colId" : "obligationID",
			"colHeader" : getLabel( 'obligationNumber', 'Obligation Id' ),
			"sortable":true,
			"width" : 200
		},
		{
			"colId" : "accountName",
			"colHeader" : getLabel( 'accountName', 'Account Name' ),
			"sortable":true,
			"width" : 200
		},
		{
			"colId" : "requestedAmnt",
			"colHeader" : getLabel( 'requestedAmnt', 'Amount' ),
			"colType" : "number",
			"sortable":true,
			"width" : 200
		},
		{
			"colId" : "effectiveDate",
			"colHeader" : getLabel( 'effectiveDate', 'Effective Date' ),
			"sortable":true,
			"width" : 200
		},
		{
			"colId" : "paymentTypeDesc",
			"colHeader" : getLabel( 'paymentTypeDesc', 'Type' ),
			"sortable":true,
			"width" : 200
		},
		{
			"colId" : "siRequestStatusDesc",
			"colHeader" : getLabel( 'statusDesc', 'Status' ),
			"sortable":false,
			"width" : 200
		}
	];
}
else
{
	arrColsPref =
	[
		{
			"colId" : "requestReference",
			"colHeader" : getLabel( 'reference', 'Reference' ),
			"sortable":true,
			"width" : 200
		},
		{
			"colId" : "obligorID",
			"colHeader" : getLabel( 'obligorID', 'Obligor Id' ),
			"sortable":true,
			"width" : 200
		},
		{
			"colId" : "obligationID",
			"colHeader" : getLabel( 'obligationID', 'Obligation Id' ),
			"sortable":true,
			"width" : 200
		},
		{
			"colId" : "accountName",
			"colHeader" : getLabel( 'accountName', 'Account Name' ),
			"sortable":true,
			"width" : 200
		},
		{
			"colId" : "requestedAmnt",
			"colHeader" : getLabel( 'requestedAmnt', 'Amount' ),
			"colType" : "number",
			"sortable":true,
			"width" : 200
		},
		{
			"colId" : "requestDate",
			"colHeader" : getLabel( 'requestDate', 'Request Date' ),
			"sortable":true,
			"width" : 200
		},
		{
			"colId" : "paymentTypeDesc",
			"colHeader" : getLabel( 'paymentTypeDesc', 'Type' ),
			"sortable":true,
			"width" : 200
		},
		{
			"colId" : "requestStatusDesc",
			"colHeader" : getLabel( 'statusDesc', 'Status' ),
			"sortable":false,
			"width" : 200
		},
		{
			"colId" : "hostResponseMsg",
			"colHeader" : getLabel( 'hostResponseMsg', 'Host Message' ),
			"sortable":true,
			"width" : 200
		}
	];
}				

LOANCENTER_GENERIC_COLUMN_MODEL = arrColsPref;