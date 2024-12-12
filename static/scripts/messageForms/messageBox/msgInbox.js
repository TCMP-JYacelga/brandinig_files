var arrObj = null;
if( entity_type == '0' || client_count > 1 )
{
 arrObj =  [
								{			
									"colId" : "clientDesc",
									"colHeader" : "Client",
									"sortable":true,
									"width" : 200
								},
								{
									"colId" : "sentDateTxt",
									"colHeader" : "Message Date Time",
									"sortable":true,
									"width" : 200
								},
								{
									"colId" : "subject",
									"colHeader" : "Subject",
									"sortable":true,
									"width" : 200
								},
								{
									"colId" : "trackingNo",
									"colHeader" : "Ref #",
									"sortable":true,
									"width" : 200
								},
								{
									"colId" : "fromUser",
									"colHeader" : "From",
									"sortable":true,
									"width" : 200
								},
								{
									"colId" : "messageStatus",
									"colHeader" : "Replied",
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
									"colHeader" : "Message Date Time",
									"sortable":true,
									"width" : 200
								},
								{
									"colId" : "subject",
									"colHeader" : "Subject",
									"sortable":true,
									"width" : 200
								},
								{
									"colId" : "trackingNo",
									"colHeader" : "Ref #",
									"sortable":true,
									"width" : 200
								},
								{
									"colId" : "fromUser",
									"colHeader" : "From",
									"sortable":true,
									"width" : 200
								},
								{
									"colId" : "messageStatus",
									"colHeader" : "Replied",
									"sortable":false,
									"width" : 200
								}
								];
	
	
}
 MSGINBOX_GENERIC_COLUMN_MODEL = arrObj;