ADMIN_BROADCAST_COLUMN_MODEL =  [
						{
							"colId" : "messageName",
							"colHeader" : getLabel('messageName','Message Name'),
							"width" : 130
						}, {
							"colId" : "isUrgent",
							"colHeader" :getLabel('urgent','Urgent') 
						}, {
							"colId" : "displayLevel",
							"colHeader" : getLabel('dispLevel','Display Level')
						},  {
							"colId" : "textorHtmlDesc",
							"colHeader" : getLabel('msgBody','Message Body')
						},{
							"colId" : "startDateTime",
							"colHeader" : getLabel('startDate','Start Date Time'),
							"width" : 130
						}, {
							"colId" : "endDateTime",
							"colHeader" : getLabel('endDate','End Date Time'),
							"width" : 130
						}, {
							"colId" : "requestStateDesc",
							"colHeader" : getLabel('status','Status'),
								"sortable" : false
						}
						];
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
									.parse(value1, 'm-d-Y'),
									dtFormat);
				    		
							objJson["fieldValue"] = formattedDateVal1 ;
							objJson["fieldTipValue"] = formattedDateVal1 ;
				    	}
				    	break;
					case 'bt' :
						if (cfgFilter.dataType === 'D') {
							formattedDateVal1 = Ext.util.Format.date(Ext.Date
									.parse(value1, 'm-d-Y'),
									dtFormat);
							
							formattedDateVal2 = Ext.util.Format.date(Ext.Date
									.parse(value2, 'm-d-Y'),
									dtFormat);
							
							objJson["fieldValue"] = formattedDateVal1 + ' - '
									+ formattedDateVal2;
							objJson["fieldTipValue"] = formattedDateVal1 + ' - '
							+ formattedDateVal2;
						}
						break;
					case 'lk' :
					    objJson["fieldValue"] = value1;
						objJson["fieldTipValue"] = value1;
					break;
					case 'eq' :
					
						objJson["fieldValue"] = value1;
						objJson["fieldTipValue"] = value1;
					break;
					}
				parsedArray.push(objJson);
			});
	return parsedArray;
}			