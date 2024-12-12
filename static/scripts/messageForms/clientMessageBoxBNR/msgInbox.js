var arrObj = null;
if( entity_type == '0' || client_count > 1 )
{
 arrObj =  [
								{	"colId" : "clientDesc",
									"colHeader" : getLabel('client', 'Company Name'),
									"colDesc"	: getLabel('client', 'Company Name'),
									"locked"	: false,
									"hidden"	: false,
									"hideable"	: true,
									"colSequence": 1,
									"sortable":true,
									"width" : 200
								},
								{
									"colId" : "sentDateTxt",
									"colHeader" : getLabel('msgDtaeTime','Message Date Time'),
									"colDesc" : getLabel('msgDtaeTime','Message Date Time'),
									"locked"	: false,
									"hidden"	: false,
									"hideable"	: true,
									"colSequence":2,
									"sortable":true,
									"width" : 200
								},
								{
									"colId" : "msgFormGroupDesc",
									"colHeader" :getLabel('destGroup','Destinations Group'),
									"colDesc" :getLabel('destGroup','Destinations Group'),
									"locked"	: false,
									"hidden"	: false,
									"hideable"	: true,
									"colSequence":3,
									"sortable":true,
									"width" : 200
								},
								{
									"colId" : "subject",
									"colHeader" : getLabel('subject','Subject'),
									"colDesc" : getLabel('subject','Subject'),
									"locked"	: false,
									"hidden"	: false,
									"hideable"	: true,
									"colSequence":4,
									"sortable":true,
									"width" : 200
								},
								{
									"colId" : "trackingNo",
									"colHeader" : getLabel('ref','Reference'),
									"colDesc" : getLabel('ref','Reference'),
									"locked"	: false,
									"hidden"	: false,
									"hideable"	: true,
									"colSequence":5,
									"sortable":true,
									"width" : 200
								},
								{
									"colId" : "fromUser",
									"colHeader" : getLabel('form','From'),
									"colDesc" : getLabel('form','From'),
									"locked"	: false,
									"hidden"	: false,
									"hideable"	: true,
									"colSequence":6,
									"sortable":true,
									"width" : 200
								},
								{
									"colId" : "messageStatusDesc",
									"colHeader" : getLabel('replied','Replied'),
									"colDesc" : getLabel('replied','Replied'),
									"locked"	: false,
									"hidden"	: false,
									"hideable"	: true,
									"colSequence":7,
									"sortable":false,
									"width" : 200
								}
				];
	
}
else
{
	arrObj  =  [
								{
									"colId" : "sentDateTxt",
									"colHeader" : getLabel('msgDtaeTime','Message Date Time'),
									"colDesc" : getLabel('msgDtaeTime','Message Date Time'),
									"locked"	: false,
									"hidden"	: false,
									"hideable"	: true,
									"colSequence":1,
									"sortable":true,
									"width" : 200
								},
								{
									"colId" : "subject",
									"colHeader" : getLabel('subject','Subject'),
									"colDesc" : getLabel('subject','Subject'),
									"locked"	: false,
									"hidden"	: false,
									"hideable"	: true,
									"colSequence":2,
									"sortable":true,
									"width" : 200
								},
								{
									"colId" : "trackingNo",
									"colHeader" : getLabel('ref','Reference'),
									"colDesc" : getLabel('ref','Reference'),
									"locked"	: false,
									"hidden"	: false,
									"hideable"	: true,
									"colSequence":3,
									"sortable":true,
									"width" : 200
								},
								{
									"colId" : "fromUser",
									"colHeader" : getLabel('form','From'),
									"colDesc" : getLabel('form','From'),
									"locked"	: false,
									"hidden"	: false,
									"hideable"	: true,
									"colSequence":4,
									"sortable":true,
									"width" : 200
								},
								{
									"colId" : "messageStatusDesc",
									"colHeader" : getLabel('replied','Replied'),
									"colDesc" : getLabel('replied','Replied'),
									"locked"	: false,
									"hidden"	: false,
									"hideable"	: true,
									"colSequence":5,
									"sortable":false,
									"width" : 200
								}
								];
	
	
}
 MSGINBOX_GENERIC_COLUMN_MODEL = arrObj;