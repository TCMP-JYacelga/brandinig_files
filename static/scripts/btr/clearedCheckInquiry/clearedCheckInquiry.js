var CLEARED_CHECK_COLUMN_MODEL=[				
                             				{
                            					"colId"     : "clearedCheckAccount",
                            					"colHeader" : "Account",
                            					"colDesc"	: "Account",
                            					"locked"	: false,
                            					"hidden"	: false,
                            					"hideable"	: true,
                            					"colSequence":2,
                            					width : 140
                            				},		
                            				{
                            					"colId"     : "postingDatePicker",
                            					"colHeader" : "Posting Date",
                            					"colDesc"	: "Posting Date",
                            					"locked"	: false,
                            					"hidden"	: false,
                            					"hideable"	: true,
                            					"colSequence":3,               					
                            					width : 100
                            				}]

if(filterFields.indexOf('clearedCheckAmount') !== -1)
{
	CLEARED_CHECK_COLUMN_MODEL.push({
		"colId" : "clearedCheckAmount",
		"colHeader" : "Amount",
		"colDesc"	: "Amount",
		"locked"	: false,
		"hidden"	: false,
		"hideable"	: true,
		"colSequence":3,                            					
		"colType" : "number",
		"align" : 'right',
		width : 120
	});
}
if(filterFields.indexOf('serialNmbr') !== -1)
{
	CLEARED_CHECK_COLUMN_MODEL.push({
		"colId" : "serialNmbr",
		"colHeader" : "Check No.",
		"colDesc"	: "Check No.",
		"locked"	: false,
		"hidden"	: false,
		"hideable"	: true,
		"colSequence":3,                            					
		width : 120
	});
}