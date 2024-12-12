// TODO : Need to move this file to commons.
/**
 * 0:TEXTBOX, 1:TEXTAREA, 2:AMOUNTBOX, 3:NUMBERBOX, 4:COMBOBOX, 5:SELECTBOX,
 * 6:DATEBOX, 7:TIMEBOX, 8:SEEKBOX, 9:LIST_SINGLE_SELCT, 10:LIST_ALL_SELECT,
 * 11:LIST_MULTI_SELECT , 12 : CHECKBOX , 13 : READIO BUTTON
 */

/**
 * Data Type 0:String, 1:Date, 2:Numeric
 * 
 */
function generateFilterArray(arrFilter, datepickDateFormat) {
	var parsedArray = [], objJson = null, value1 = '', value2 = '', displayValue1 = '', displayValue2 = '' , operator = '' , formattedDateVal1 = '',displayValueCount = '',
	formattedDateVal2 = '', dtFormat = '';
	arrFilter = arrFilter || [];
	dtFormat = strExtApplicationDateFormat ? strExtApplicationDateFormat : "m/d/Y";
	$.each(arrFilter, function(index, cfgFilter) {
				objJson = {
					"fieldId" : cfgFilter.field || cfgFilter.paramName,
					"fieldLabel" : cfgFilter.fieldLabel || cfgFilter.paramFieldLable,
					"fieldObjData" : cfgFilter,
					"fieldIsMandatory" : cfgFilter.fieldIsMandatory || cfgFilter.paramIsMandatory || false
				};
				operator = cfgFilter.operatorValue || cfgFilter.operator;
				value1 = decodeURIComponent(cfgFilter.value1 || cfgFilter.paramValue1);
				value2 = decodeURIComponent(cfgFilter.value2 || cfgFilter.paramValue2);
				
				displayValue1 = cfgFilter.displayValue1;
				displayValue2 = cfgFilter.displayValue2;
								
				switch (operator) {
				    case 'le' : 
				    	if(cfgFilter.dataType === 1 || cfgFilter.dataType === 'D'){
				    		if ($.isEmptyObject(datepickDateFormat)) {
				    			formattedDateVal1 = Ext.util.Format.date(Ext.Date
									.parse(value1, 'Y-m-d'),
									dtFormat);
				    		} else {
								formattedDateVal1 = $.datepick.formatDate(datepickDateFormat, 
									$.datepick.parseDate('yy-mm-dd', value1));
				    		}
							objJson["fieldValue"] = formattedDateVal1 ;
							objJson["fieldTipValue"] = formattedDateVal1 ;
				    	}
				    	else if(cfgFilter.displayType === 5 && cfgFilter.dataType === 'S'){
				    		objJson["fieldValue"] = displayValue1;
							objJson["fieldTipValue"] = displayValue1;
				    	}
				    	break;
					case 'bt' :
						if( cfgFilter.displayType === 2 || cfgFilter.dataType === 2 )
						{
							objJson["fieldValue"] = getFinalFormattedAmount(displayValue1, value1) +
													' - ' + getFinalFormattedAmount(displayValue2, value2);
							objJson["fieldTipValue"] = objJson["fieldValue"];
						} else if (cfgFilter.dataType === 1 || cfgFilter.dataType === 'D') {
							
							if($.isEmptyObject(datepickDateFormat)) {
								formattedDateVal1 = Ext.util.Format.date(Ext.Date
									.parse(value1, 'Y-m-d'),
									dtFormat);
							
								formattedDateVal2 = Ext.util.Format.date(Ext.Date
										.parse(value2, 'Y-m-d'),
										dtFormat);
							} else {
								formattedDateVal1 = $.datepick.formatDate(datepickDateFormat, 
									$.datepick.parseDate('yy-mm-dd', value1));
									
								formattedDateVal2 = $.datepick.formatDate(datepickDateFormat, 
									$.datepick.parseDate('yy-mm-dd', value2));
							}
							
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
						else if(cfgFilter.displayType === 2 || cfgFilter.dataType === 2)
						{
							objJson["fieldValue"] = getLabel('equalTo','Equal to ') + getFinalFormattedAmount(displayValue1, value1);
							objJson["fieldTipValue"] = objJson["fieldValue"];
						}
						else if (cfgFilter.dataType=='D' || cfgFilter.dataType === 1){
							
							if($.isEmptyObject(datepickDateFormat)) {
								formattedDateVal1 = Ext.util.Format.date(Ext.Date
									.parse(value1, 'Y-m-d'),
									dtFormat);
							} else {
								formattedDateVal1 = $.datepick.formatDate(datepickDateFormat, 
									$.datepick.parseDate('yy-mm-dd', value1));
							}
							
							objJson["fieldValue"] = formattedDateVal1 ;
							objJson["fieldTipValue"] = formattedDateVal1;
						}
						else{
							objJson["fieldValue"] = value1;
							objJson["fieldTipValue"] = value1;
						}
						break;
					case 'gt' :
						if(cfgFilter.displayType === 2 || cfgFilter.dataType === 2)
						{
							objJson["fieldValue"] =  getLabel('greatethanOperator','Greater Than ') + getFinalFormattedAmount(displayValue1, value1);
							objJson["fieldTipValue"] = objJson["fieldValue"];
						}
						else
						{
						objJson["fieldValue"] =  getLabel('greatethanOperator','Greater Than ') + value1;
						objJson["fieldTipValue"] =  getLabel('greatethanOperator','Greater Than ') + value1;
						}
						break;
					case 'gte' :
						if(cfgFilter.displayType === 2 || cfgFilter.dataType === 2)
						{
							objJson["fieldValue"] = getLabel('greatethaneqOperator','Greater Than Equals ') + getFinalFormattedAmount(displayValue1, value1);
							objJson["fieldTipValue"] = objJson["fieldValue"];
						}
						else
						{
						objJson["fieldValue"] = getLabel('greatethaneqOperator','Greater Than Equals ') + value1;
						objJson["fieldTipValue"] = getLabel('greatethaneqOperator','Greater Than Equals ') + value1;
						}
						break;
					case 'ge' :
						if (cfgFilter.displayType === 5 && cfgFilter.dataType === 'S'){
							objJson["fieldValue"] = displayValue1;
							objJson["fieldTipValue"] = displayValue1;
						}
						break;	
					case 'lt' :
						if(cfgFilter.displayType === 2 || cfgFilter.dataType === 2)
						{
							objJson["fieldValue"] = getLabel('lessthanOperator','Less Than ') + getFinalFormattedAmount(displayValue1, value1);
							objJson["fieldTipValue"] = objJson["fieldValue"];
						}
						else
						{
						objJson["fieldValue"] = getLabel('lessthanOperator','Less Than ') + value1;
						objJson["fieldTipValue"] = getLabel('lessthanOperator','Less Than ') + value1;
						}
						break;
					case 'lte' :
						if(cfgFilter.displayType === 2 || cfgFilter.dataType === 2)
						{
							objJson["fieldValue"] = getLabel('lessthaneqOperator','Less Than Equals ') + getFinalFormattedAmount(displayValue1, value1);
							objJson["fieldTipValue"] = objJson["fieldValue"];
						}
						else
						{
						objJson["fieldValue"] = getLabel('lessthaneqOperator','Less Than Equals ') + value1;
						objJson["fieldTipValue"] = getLabel('lessthaneqOperator','Less Than Equals ') + value1;
						}
						break;
					case 'in' :
						displayValueCount = getValueDisplayCount(displayValue1);
						if(displayValueCount > 2){
							objJson["fieldValue"] = displayValueCount+' '+getLabel('selected','Selected ');
							objJson["fieldTipValue"] = getLabel('inOperator','In ')+'(' + displayValue1 + ')';
							
						}
						else{
							objJson["fieldValue"] = getLabel('inOperator','In ')+'(' + displayValue1 + ')';
							objJson["fieldTipValue"] = getLabel('inOperator','In ')+'(' + displayValue1 + ')';
						}
						break;
					case 'statusFilterOp' :
						displayValueCount = getValueDisplayCount(displayValue1);
						if(displayValueCount > 2){
							objJson["fieldValue"] = displayValueCount+' '+getLabel('selected','Selected ');
							objJson["fieldTipValue"] = getLabel('inOperator','In ')+'(' + displayValue1 + ')';
							
						}
						else{
							objJson["fieldValue"] = 'In ( ' + displayValue1 + ')';
							objJson["fieldTipValue"] = getLabel('inOperator','In ')+'(' + displayValue1 + ')';
						}
						break;
				}
				parsedArray.push(objJson);
			});
	return parsedArray;
}

function getValueDisplayCount(value){
	var arrVal, countOfSelected;
	
	if(!isEmpty(value)){
		isArray(value) ? arrVal = value : arrVal = value.split(",");
		
	if(!isEmpty(arrVal)){
		countOfSelected = arrVal.length;
	}
	}
	return countOfSelected;
}

function getFinalFormattedAmount(displayValue, actualValue)
{
	var finalValue = null;
	// check if displayValue is not empty
	if( displayValue !== null && displayValue !== '' && typeof( displayValue ) !== "undefined")
	{
		// check if displayValue is already formatted. If Yes then return the same else format the displayValue and return
		if( isNaN( displayValue ) )
		{
			// displayValue is already formatted
		finalValue = displayValue;
	}
	else
	{
			finalValue = getFormattedAmountValue( displayValue );
		}
	}
	else
	{
		finalValue = getFormattedAmountValue( actualValue );
	}
	return finalValue;
}

function getFormattedAmountValue( passedValue )
{
	var returnValue = null;
		if( typeof( strGrpSeparator ) != "undefined" 
			&& typeof( strDecSeparator ) != "undefined"
			&& typeof( strMinFraction ) != "undefined")
		{
			// Amount formatting to be done
		returnValue = $("<input>").autoNumeric("init",
			{
				aSep: strGrpSeparator,
				dGroup: (typeof( strAmountDigitGroup ) != "undefined")? strAmountDigitGroup : 3,
				aDec: strDecSeparator,
				mDec: strMinFraction
		}).autoNumeric('set', passedValue).val();
		}
		else
		{
			// autonumeric variables not found
		returnValue = passedValue;
		}
	return returnValue;
	}
