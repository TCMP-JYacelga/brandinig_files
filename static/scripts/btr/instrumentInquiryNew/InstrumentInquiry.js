var INQUIRY_GENERIC_COLUMN_MODEL =[];
if (entity_type === '0')
{
	INQUIRY_GENERIC_COLUMN_MODEL = [
	                                
				{
					"colId" : "clientDesc",
					"colHeader" : "Company Name",
					"width" : 120,
					"colDesc"	: "Company Name",
					"locked"	: false,
					"hideable"	: true,
					"colSequence":1,
					"hidden"	: false
				},
				{
					"colId" : "depositAccount",
					"colHeader" : "Deposit Account",					
					"width" : 140,
					"colDesc"	: "Deposit Account",
					"locked"	: false,
					"hideable"	: true,
					"colSequence":4,
					"hidden"	: false
				},					
				{
					"colId" : "debitAccount",
					"colHeader" : "Debit Account",					
					"width" : 140,
					"colDesc"	: "Debit Account",
					"locked"	: false,
					"hideable"	: true,
					"colSequence":6,
					"hidden"	: false
				},
				{
					"colId" : "postingDate",
					"colHeader" : "Posting Date",
					"width" : 100,
					"colDesc"	: "Posting Date",
					"locked"	: false,
					"hideable"	: true,
					"colSequence":7,
					"hidden"	: false
				},
				
				/*{
					"colId" : "depSeqNmbr",
					"colHeader" : "Deposit Ticket Sequence Number",					
					width :  210
				},*/					
				{
					"colId" : "rtn",
					"colHeader" : "Routing No. of Deposit Check",					
					"width" : 100,
					"colDesc"	: "Routing No. of Deposit Check",
					"locked"	: false,
					"hideable"	: true,
					"colSequence":9,
					"hidden"	: false
				},	
				{
					"colId" : "itemType",
					"colHeader" : "Item Type",					
					"width" : 100,
					"colDesc"	: "Item Type",
					"locked"	: false,
					"hideable"	: true,
					"colSequence":10,
					"hidden"	: false
				}				
				];
	
	if(filterFields.indexOf('depositTicket') !== -1)
	{
		INQUIRY_GENERIC_COLUMN_MODEL.push({
			"colId" : "depositTicketNmbr",
			"colHeader" : "Deposit Ticket No.",					
			"width" : 140,
			"colDesc"	: "Deposit Ticket No.",
			"locked"	: false,
			"hideable"	: true,
			"colSequence":3,
			"hidden"	: false
		});
	}
	if(filterFields.indexOf('serialNmbr') !== -1)
	{
		INQUIRY_GENERIC_COLUMN_MODEL.push({
			"colId" : "itemNmbr",
			"colHeader" : "Check No.",
			"width" : 120,
			"colDesc"	: "Check No.",
			"locked"	: false,
			"hideable"	: true,
			"colSequence":2,
			"hidden"	: false
		});
	}
	if(filterFields.indexOf('itemAmount') !== -1)
	{
		INQUIRY_GENERIC_COLUMN_MODEL.push({
			"colId" : "itemAmount",
			"colHeader" : "Item Amount",
			"colType" : "number",
			"align" : 'right',
			"width" : 120,
			"colDesc"	: "Item Amount",
			"locked"	: false,
			"hideable"	: true,
			"colSequence":5,
			"hidden"	: false
		});
	}
	if(filterFields.indexOf('itemSeqNmbr') !== -1)
	{
		INQUIRY_GENERIC_COLUMN_MODEL.push({
			"colId" : "itemSeqNmbr",
			"colHeader" : "Item Sequence No.",					
			"width" : 150,
			"colDesc"	: "Item Sequence No.",
			"locked"	: false,
			"hideable"	: true,
			"colSequence":11,
			"hidden"	: false
		});
	}
	if(filterFields.indexOf('lockBoxNmbr') !== -1)
	{
		INQUIRY_GENERIC_COLUMN_MODEL.push(				
				{
					"colId" : "lockBoxId",
					"colHeader" : "Lockbox No.",					
					"width" : 120,
					"colDesc"	: "Lockbox No.",
					"locked"	: false,
					"hideable"	: true,
					"colSequence":8,
					"hidden"	: false
				});
	}
}				
else
{
	INQUIRY_GENERIC_COLUMN_MODEL = [
				
				{
					"colId" : "depositAccount",
					"colHeader" : "Deposit Account",					
					"width" : 140,
					"colDesc"	: "Deposit Account",
					"locked"	: false,
					"hideable"	: true,
					"colSequence":3,
					"hidden"	: false
				},					
					{
					"colId" : "debitAccount",
					"colHeader" : "Debit Account",					
					"width" : 120,
					"colDesc"	: "Debit Account",
					"locked"	: false,
					"hideable"	: true,
					"colSequence":5,
					"hidden"	: false
				},
				{
					"colId" : "postingDate",
					"colHeader" : "Posting Date",
					"width" : 100,
					"colDesc"	: "Posting Date",
					"locked"	: false,
					"hideable"	: true,
					"colSequence":6,
					"hidden"	: false
				},
				{
					"colId" : "rtn",
					"colHeader" : "Routing No. of Deposit Check",					
					"width" : 100,
					"colDesc"	: "Routing No. of Deposit Check",
					"locked"	: false,
					"hideable"	: true,
					"colSequence":8,
					"hidden"	: false
				},	
				{
					"colId" : "itemType",
					"colHeader" : "Item Type",					
					"width" : 100,
					"colDesc"	: "Item Type",
					"locked"	: false,
					"hideable"	: true,
					"colSequence":9,
					"hidden"	: false
				}			
					];
	
	if(filterFields.indexOf('depositTicket') !== -1)
	{
		INQUIRY_GENERIC_COLUMN_MODEL.push({
			"colId" : "depositTicketNmbr",
			"colHeader" : "Deposit Ticket No.",					
			"width" : 140,
			"colDesc"	: "Deposit Ticket No.",
			"locked"	: false,
			"hideable"	: true,
			"colSequence":2,
			"hidden"	: false
		});
	}
	if(filterFields.indexOf('serialNmbr') !== -1)
	{
		INQUIRY_GENERIC_COLUMN_MODEL.push({
			"colId" : "itemNmbr",
			"colHeader" : "Check No.",
			"width" : 120,
			"colDesc"	: "Check No.",
			"locked"	: false,
			"hideable"	: true,
			"colSequence":1,
			"hidden"	: false
		});
	}
	if(filterFields.indexOf('itemAmount') !== -1)
	{
		INQUIRY_GENERIC_COLUMN_MODEL.push({
			"colId" : "itemAmount",
			"colHeader" : "Item Amount",
			"colType" : "number",
			"align" : 'right',
			"width" : 120,
			"colDesc"	: "Item Amount",
			"locked"	: false,
			"hideable"	: true,
			"colSequence":4,
			"hidden"	: false
		});
	}
	if(filterFields.indexOf('itemSeqNmbr') !== -1)
	{
		INQUIRY_GENERIC_COLUMN_MODEL.push(				
				{
			"colId" : "itemSeqNmbr",
			"colHeader" : "Item Sequence No.",					
			"width" : 100,
			"colDesc"	: "Item Sequence No.",
			"locked"	: false,
			"hideable"	: true,
			"colSequence":11,
			"hidden"	: false
		});
	}
	if(filterFields.indexOf('lockBoxNmbr') !== -1)
	{
		INQUIRY_GENERIC_COLUMN_MODEL.push(				
				{
					"colId" : "lockBoxId",
					"colHeader" : "Lockbox No.",					
					"width" : 120,
					"colDesc"	: "Lockbox No.",
					"locked"	: false,
					"hideable"	: true,
					"colSequence":7,
					"hidden"	: false
				});
	}
	
}

function generateInquiryFilterArray(arrFilter) {
	var parsedArray = [], objJson = null, value1 = '', value2 = '', displayValue1 = '', displayValue2 = '' , operator = '' , formattedDateVal1 = '',displayValueCount = '',
	formattedDateVal2 = '', dtFormat = '';
	arrFilter = arrFilter || [];
	dtFormat = strExtApplicationDateFormat ? strExtApplicationDateFormat : "m/d/Y";
	$.each(arrFilter, function(index, cfgFilter) {
				objJson = {
					"fieldId" : cfgFilter.field || cfgFilter.paramName,
					"fieldLabel" : cfgFilter.fieldLabel || cfgFilter.paramFieldLable,
					"fieldObjData" : cfgFilter
				};
				operator = cfgFilter.operatorValue || cfgFilter.operator;
				value1 = cfgFilter.value1 || cfgFilter.paramValue1;
				value2 = cfgFilter.value2 || cfgFilter.paramValue2;
				displayValue1 = cfgFilter.displayValue1;
				displayValue2 = cfgFilter.displayValue2;
				switch (operator) {
				    case 'le' : 
				    	if(cfgFilter.dataType === 1 || cfgFilter.dataType === 'D'){
				    		formattedDateVal1 = Ext.util.Format.date(Ext.Date
									.parse(value1, 'Y-m-d'),
									dtFormat);
				    		
							objJson["fieldValue"] = formattedDateVal1 ;
							objJson["fieldTipValue"] = formattedDateVal1 ;
				    	}
				    	break;
					case 'bt' :
						if (cfgFilter.dataType === 2) {
							objJson["fieldValue"] = value1 + ' - '
									+ value2;
							objJson["fieldTipValue"] = value1 + ' - ' + value2;
						} else if (cfgFilter.dataType === 1 || cfgFilter.dataType === 'D') {
							formattedDateVal1 = Ext.util.Format.date(Ext.Date
									.parse(value1, 'Y-m-d'),
									dtFormat);
							
							formattedDateVal2 = Ext.util.Format.date(Ext.Date
									.parse(value2, 'Y-m-d'),
									dtFormat);
							
							objJson["fieldValue"] = formattedDateVal1 + ' - '
									+ formattedDateVal2;
							objJson["fieldTipValue"] = formattedDateVal1 + ' - '
							+ formattedDateVal2;
						}
						break;
					case 'st' :
						// TODO : Sorting handling to be done
						break;
					case 'lk' :
					case 'eq' :
						if (cfgFilter.displayType === 5 ||cfgFilter.displayType === 8 || cfgFilter.displayType === 12 || cfgFilter.displayType === 13){
							objJson["fieldValue"] = displayValue1;
							objJson["fieldTipValue"] = displayValue1;
						}
						else if(cfgFilter.displayType === 2 || cfgFilter.dataType === 2){
							objJson["fieldValue"] = ' = ' + value1;
							objJson["fieldTipValue"] = ' = ' + value1;
						}
						else if (cfgFilter.dataType=='D'){
							formattedDateVal1 = Ext.util.Format.date(Ext.Date
									.parse(value1, 'Y-m-d'),
									dtFormat);
							objJson["fieldValue"] = formattedDateVal1 ;
							objJson["fieldTipValue"] = formattedDateVal1;
						}
						else{
							objJson["fieldValue"] = value1;
							objJson["fieldTipValue"] = value1;
						}
						break;
					case 'gt' :
						objJson["fieldValue"] = ' > ' + value1;
						objJson["fieldTipValue"] = ' > ' + value1;
						break;
					case 'gte' :
						objJson["fieldValue"] = ' >= ' + value1;
						objJson["fieldTipValue"] = ' >= ' + value1;
						break;
					case 'lt' :
						objJson["fieldValue"] = ' < ' + value1;
						objJson["fieldTipValue"] = ' < ' + value1;
						break;
					case 'lte' :
						objJson["fieldValue"] = ' <= ' + value1;
						objJson["fieldTipValue"] = ' <= ' + value1;
						break;
					case 'in' :
						displayValueCount = getValueDisplayCount(displayValue1);
						if(displayValueCount > 2){
							objJson["fieldValue"] = displayValueCount+' Selected';
							objJson["fieldTipValue"] = 'In ( ' + displayValue1 + ')';
							
						}
						else{
							objJson["fieldValue"] = 'In ( ' + displayValue1 + ')';
							objJson["fieldTipValue"] = 'In ( ' + displayValue1 + ')';
						}
						break;
					case 'statusFilterOp' :
						displayValueCount = getValueDisplayCount(displayValue1);
						if(displayValueCount > 2){
							objJson["fieldValue"] = displayValueCount+' Selected';
							objJson["fieldTipValue"] = 'In ( ' + displayValue1 + ')';
							
						}
						else{
							objJson["fieldValue"] = 'In ( ' + displayValue1 + ')';
							objJson["fieldTipValue"] = 'In ( ' + displayValue1 + ')';
						}
						break;
				}
				parsedArray.push(objJson);
			});
	return parsedArray;
}