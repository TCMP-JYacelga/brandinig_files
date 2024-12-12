var arrObj = null;
if( entityType == '0' )
{
 arrObj =  [
								{			
									"colId" : "clientDesc",
									"colHeader" : getLabel('company','Company Name'),
									"sortable":true,
									"width" : 200,
									"hidden" : false
								},
								{
									"colId" : "sentDateTxt",
									"colHeader" : getLabel('msgDtaeTime','Message Date Time'),
									"sortable":true,
									"width" : 200
								},
								{
									"colId" : "subject",
									"colHeader" : getLabel('subject','Subject'),
									"sortable":true,
									"width" : 240
								},
								{
									"colId" : "trackingNo",
									"colHeader" : getLabel('ref','Ref #'),
									"sortable":true,
									"width" : 200
								},
								{
									"colId" : "fromUser",
									"colHeader" : getLabel('form','From'),
									"sortable":true,
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
									"sortable":true,
									"width" : 200
								},
								{
									"colId" : "subject",
									"colHeader" : getLabel('subject','Subject'),
									"sortable":true,
									"width" : 200
								},
								{
									"colId" : "trackingNo",
									"colHeader" : getLabel('ref','Ref #'),
									"sortable":true,
									"width" : 200
								},
								{
									"colId" : "fromUser",
									"colHeader" : getLabel('form','From'),
									"sortable":true,
									"width" : 200
								},
								{
									"colId" : "messageStatusDesc",
									"colHeader" : getLabel('replied','Replied'),
									"sortable":false,
									"width" : 200
								}
								];
	
	
}
 MSGOUTBOX_GENERIC_COLUMN_MODEL = arrObj;
 function generateUserFilterArray(arrFilter) {
	var parsedArray = [], objJson = null, value1 = '', value2 = '', operator = '' , formattedDateVal1 = '',
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
						if (cfgFilter.dataType === 'D') {
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
					case 'eq' :
						if(cfgFilter.paramName == 'MessageDate')
						{
							value1 = Ext.util.Format.date(Ext.Date
									.parse(value1, 'Y-m-d'),
									dtFormat);
						}
						objJson["fieldValue"] = value1;
						objJson["fieldTipValue"] = value1;
					break;
					}
				parsedArray.push(objJson);
			});
	return parsedArray;
}		