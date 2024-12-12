		var arrStatus = 	[
                         	  {
                         		"code": "0",
                         		"desc": "New"
                         	  },
                         	  {
                         		"code": "3",
                         		"desc": "Approved"
                         	  },
                         	  {
                         		"code": "1",
                         		"desc": "Modified"
                         	  },	  
                         	  {
                         		"code": "4",
                         		"desc": "Enable Request"
                         	  },
                         	  {
                         		"code": "5",
                         		"desc": "Suspend Request"
                         	  },
                         	  {
                         		"code": "11",
                         		"desc": "Suspended"
                         	  },
                         	  {
                         		"code": "7",
                         		"desc": "New Rejected"
                         	  },
                         	  {
                         		"code": "8",
                         		"desc": "Modified Rejected"
                         	  },	  
                         	  {
                         		"code": "9",
                         		"desc": "Suspend Request Rejected"
                         	  },
                         	  {
                         		"code": "10",
                         		"desc": "Enable Request Rejected"
                         	  },
                         	  {
                         		"code": "12",
                         		"desc": "Submitted"
                              }
                         	];
		function generateCatFilterArray(arrFilter) {
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
									objJson["fieldValue"] = displayValueCount+' '+getLabel('selected','Selected');
									objJson["fieldTipValue"] = getLabel('lblFltrIn','In')+' ( ' + displayValue1 + ')';
									
								}
								else{
									objJson["fieldValue"] = getLabel('lblFltrIn','In')+' ( ' + displayValue1 + ')';
									objJson["fieldTipValue"] = getLabel('lblFltrIn','In')+' ( ' + displayValue1 + ')';
								}
								break;
						}
						parsedArray.push(objJson);
					});
			return parsedArray;
		}		