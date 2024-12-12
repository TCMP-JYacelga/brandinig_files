function selectDateDataType(reportParamElePrefix, index, thisElement)
{
	var currIndex = parseInt(index,10);
	var field2_parent = $('#'+reportParamElePrefix+(currIndex+1)+"\\.value").parent();
	var field3_parent =	$('#'+reportParamElePrefix+(currIndex+2)+"\\.value").parent();
	if($(thisElement).val() == 'DATE_RANGE')
	{
		$('#'+reportParamElePrefix+(currIndex+1)+"\\.value").datepicker('setDate', null);
		$('#'+reportParamElePrefix+(currIndex+2)+"\\.value").datepicker('setDate', null);
		$('#div'+reportParamElePrefix+(currIndex+1)+"\\.value").showElement();
		$('#div'+reportParamElePrefix+(currIndex+2)+"\\.value").showElement();
		$('#'+reportParamElePrefix+(currIndex+2)+"\\.value").removeClass( "hidden" );
		$('#icon'+reportParamElePrefix+(currIndex+2)+"\\.value").removeClass( "hidden" );
		$('#'+reportParamElePrefix+(currIndex+1)+"\\.value").removeClass( "hidden" );
		$('#icon'+reportParamElePrefix+(currIndex+1)+"\\.value").removeClass( "hidden" );
		$('#'+reportParamElePrefix+(currIndex+1)+"\\.dateFrom").removeClass( "hidden" );
		$('#'+reportParamElePrefix+(currIndex+2)+"\\.dateTo").removeClass( "hidden" );
		$('#'+reportParamElePrefix+(currIndex+1)+"\\.dateThis").addClass( "hidden" );
		$('#'+reportParamElePrefix+(currIndex+1)+"\\.value")
			.datepicker("option", "onSelect", function(selected){
				//var dt = new Date(selected);
				var dt = $.datepicker.parseDate(strApplicationDateFormat, selected);
	            dt.setDate(dt.getDate() + 1);
	            $('#'+reportParamElePrefix+(currIndex+2)+"\\.value").datepicker("option", "minDate", dt);
	            $(this).focus();
			});
		$('#'+reportParamElePrefix+(currIndex+2)+"\\.value")
			.datepicker("option", "onSelect", function(selected){
				//var dt = new Date(selected);
				var dt = $.datepicker.parseDate(strApplicationDateFormat, selected);
	            dt.setDate(dt.getDate() - 1);
	            $('#'+reportParamElePrefix+(currIndex+1)+"\\.value").datepicker("option", "maxDate", dt);
	            $(this).focus();
		});
		$('#frmDate'+(currIndex+1)).removeClass( "hidden" );
		$('#toDate'+(currIndex+2)).removeClass( "hidden" );
		
	}
	else if($(thisElement).val() == 'AS_OF_DATE' || $(thisElement).val() == 'LESS_THAN_EQUAL' || $(thisElement).val() == 'GREATER_THAN_EQUAL' || $(thisElement).val() == 'LESS_THAN' || $(thisElement).val() == 'GREATER_THAN' || $(thisElement).val() == 'EQUAL' || $(thisElement).val() == 'NOT_EQUAL_TO')
	{
		$('#'+reportParamElePrefix+(currIndex+1)+"\\.value").datepicker( "option", "minDate", null);
		$('#'+reportParamElePrefix+(currIndex+1)+"\\.value").datepicker( "option", "maxDate", null);
		$('#'+reportParamElePrefix+(currIndex+2)+"\\.value").datepicker( "option", "minDate", null);
		$('#'+reportParamElePrefix+(currIndex+2)+"\\.value").datepicker( "option", "maxDate", null);
		$('#'+reportParamElePrefix+(currIndex+1)+"\\.value").datepicker('setDate', null);
		$('#'+reportParamElePrefix+(currIndex+2)+"\\.value").datepicker('setDate', null);
		$('#div'+reportParamElePrefix+(currIndex+1)+"\\.value").showElement();
		$('#div'+reportParamElePrefix+(currIndex+2)+"\\.value").hideElement();
		$('#'+reportParamElePrefix+(currIndex+1)+"\\.value").removeClass( "hidden" );
		$('#icon'+reportParamElePrefix+(currIndex+1)+"\\.value").removeClass( "hidden" );
		$('#'+reportParamElePrefix+(currIndex+1)+"\\.dateFrom").addClass( "hidden" );
		$('#'+reportParamElePrefix+(currIndex+1)+"\\.dateThis").removeClass( "hidden" );
		$('#'+reportParamElePrefix+(currIndex+2)+"\\.dateTo").addClass( "hidden" );
		$('#'+reportParamElePrefix+(currIndex+2)+"\\.value").addClass( "hidden" );
		$('#'+reportParamElePrefix+(currIndex+1)+"\\.value")
		.datepicker("option", "onSelect", function(selected){
			//var dt = new Date(selected);
			var dt = $.datepicker.parseDate(strApplicationDateFormat, selected);
            dt.setDate(dt.getDate() + 1);
            $('#'+reportParamElePrefix+(currIndex+2)+"\\.value").datepicker("option", "minDate", dt);
            $(this).focus();
		});
		$('#frmDate'+(currIndex+1)).addClass( "hidden" );
		$('#toDate'+(currIndex+2)).addClass( "hidden" );
				
	}
	else
	{
		$('#div'+reportParamElePrefix+(currIndex+1)+"\\.value").hideElement();
		$('#div'+reportParamElePrefix+(currIndex+2)+"\\.value").hideElement();
		$('#'+reportParamElePrefix+(currIndex+2)+"\\.value").addClass( "hidden" );
		$('#'+reportParamElePrefix+(currIndex+1)+"\\.value").addClass( "hidden" );
		$('#'+reportParamElePrefix+(currIndex+1)+"\\.dateFrom").addClass( "hidden" );
		$('#'+reportParamElePrefix+(currIndex+2)+"\\.dateTo").addClass( "hidden" );
		$('#'+reportParamElePrefix+(currIndex+1)+"\\.dateThis").addClass( "hidden" );
		$('#frmDate'+(currIndex+1)).addClass( "hidden" );
		$('#toDate'+(currIndex+2)).addClass( "hidden" );
	}
}

function selectDecimalDataType(reportParamElePrefix, index, thisElement)
{
	var currIndex = parseInt(index,10);
	var field2_parent = $('#'+reportParamElePrefix+(currIndex+1)+"\\.value").parent();
	var field3_parent =	$('#'+reportParamElePrefix+(currIndex+2)+"\\.value").parent();
	if($(thisElement).val() == 'BETWEEN')
	{
		$('#'+reportParamElePrefix+(currIndex+1)+"\\.value").val('');
		$('#'+reportParamElePrefix+(currIndex+2)+"\\.value").val('');
		$('#'+reportParamElePrefix+(currIndex+1)+"\\.value").showElement();
		$('#'+reportParamElePrefix+(currIndex+2)+"\\.value").showElement();
		$('#'+reportParamElePrefix+(currIndex+1)+"\\.amtFrom").removeClass( "hidden" );
		$('#'+reportParamElePrefix+(currIndex+2)+"\\.amtTo").removeClass( "hidden" );
		$('#'+reportParamElePrefix+(currIndex+1)+"\\.amtThis").addClass( "hidden" );
		//$('.amountFrom').text('From Amount');
	//	$('.amountTo').text('To Amount');
	}
	else if($(thisElement).val() != null && $(thisElement).val() != '')
	{
		$('#'+reportParamElePrefix+(currIndex+1)+"\\.value").val('');
		$('#'+reportParamElePrefix+(currIndex+2)+"\\.value").val('');
		$('#'+reportParamElePrefix+(currIndex+1)+"\\.value").showElement();
		$('#'+reportParamElePrefix+(currIndex+2)+"\\.value").hideElement();
		$('#'+reportParamElePrefix+(currIndex+2)+"\\.value").val('');
		$('#'+reportParamElePrefix+(currIndex+1)+"\\.amtFrom").addClass( "hidden" );
		$('#'+reportParamElePrefix+(currIndex+1)+"\\.amtThis").removeClass( "hidden" );
		$('#'+reportParamElePrefix+(currIndex+2)+"\\.amtTo").addClass( "hidden" );
		//$('.amountFrom').text('This Amount');
		//$('.amountTo').text('');
	}
	else
	{
		$('#'+reportParamElePrefix+(currIndex+1)+"\\.value").hideElement();
		$('#'+reportParamElePrefix+(currIndex+2)+"\\.value").hideElement();
		$('#'+reportParamElePrefix+(currIndex+1)+"\\.value").val('');
		$('#'+reportParamElePrefix+(currIndex+2)+"\\.value").val('');
		$('#'+reportParamElePrefix+(currIndex+1)+"\\.amtFrom").addClass( "hidden" );
		$('#'+reportParamElePrefix+(currIndex+2)+"\\.amtTo").addClass( "hidden" );
		$('#'+reportParamElePrefix+(currIndex+1)+"\\.amtThis").addClass( "hidden" );
		//$('.amountFrom').text('');
	//	$('.amountTo').text('');
	}
}

function selectTextDataType(reportParamElePrefix, index, thisElement, origParameterCode)
{
	var currIndex = parseInt(index,10);
	var field2_parent = $('#'+reportParamElePrefix+(currIndex+1)+"\\.value").parent();
	var field3_parent =	$('#'+reportParamElePrefix+(currIndex+2)+"\\.value").parent();
	if($(thisElement).val() == 'STARTWITH' || $(thisElement).val() == 'ENDWITH' || $(thisElement).val() == 'CONTAINS' || $(thisElement).val() == 'EQUALS')
	{	
		$('#'+reportParamElePrefix+(currIndex+1)+"\\.value").showElement();
		$('#'+reportParamElePrefix+(currIndex+1)+"lbldiv").showElement();
		var defVal = $('#'+reportParamElePrefix+(currIndex+1)+"\\.value")[0].defaultValue;
		$('#'+reportParamElePrefix+(currIndex+1)+"\\.value").val(getLabel(defVal,defVal));
	}
	else
	{
		$('#'+reportParamElePrefix+(currIndex+1)+"\\.value").hideElement();
		$('#'+reportParamElePrefix+(currIndex+1)+"lbldiv").hideElement();
		$('#'+reportParamElePrefix+(currIndex+1)+"\\.value").val('');
	}
	if(origParameterCode== "P_FILE_NAME")
	{	
		$('#'+reportParamElePrefix+(currIndex+1)+"\\.value").removeClass('w14_8').css("width",'27em');
		//to show tooltip
		$('#'+reportParamElePrefix+(currIndex+1)+"\\.value").mouseover(function(){
			$(this).attr("title",$(this).val());
		});
	}
}

function selectNumberDataType(reportParamElePrefix, index, thisElement,listOfValueType, origParameterCode)
{
	
}

function createInputField(element, type, id, name, value) 
{
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.id = id;
		inputField.value = value;
		var att = document.createAttribute("class");        // Create a "class" attribute
		att.value = "w14_8";            
		inputField.setAttributeNode(att);               
		return inputField;
}

function createDateField(element, type, id, name, value) 
{
	var inputField = createInputField(element, type, id, name, value);
	// Add Date related option
	return inputField;
}

function createDateOperator(id, name, value) 
{
		var inputField;
		inputField = document.createElement("select");
		inputField.name = name;
		inputField.id = id;
		inputField.value = value;
		var att = document.createAttribute("class");        // Create a "class" attribute
		att.value = "w14_8 rounded";            
		inputField.setAttributeNode(att); 

		// Adds The Option to Date Operator
		var i = 0;
		for(i = 0; i < dateOperators.length; i++)
		{
			var option = document.createElement("option");
			option.value = dateOperators[i];
			option.text = getReportLabel('lbl.operator.'+dateOperators[i], dateOperators[i]);
			inputField.add(option);
		}
		return inputField;
}

function createAmountOperator(id, name, value) 
{
		var inputField;
		inputField = document.createElement("select");
		inputField.name = name;
		inputField.id = id;
		inputField.value = value;
		var att = document.createAttribute("class");        // Create a "class" attribute
		att.value = "w14_8 rounded";           
		inputField.setAttributeNode(att); 

		// Adds The Option to Date Operator
		var i = 0;
		for(i = 0; i < amountOperators.length; i++)
		{
			var option = document.createElement("option");
			option.text = getReportLabel('lbl.operator.'+amountOperators[i], amountOperators[i]);
			option.value = amountOperators[i];
			inputField.add(option);
		}
		return inputField;
}
function createTextDataTypeOperator(id, name, value) 
{
		var inputField;
		inputField = document.createElement("select");
		inputField.name = name;
		inputField.id = id;
		inputField.value = value;
		var att = document.createAttribute("class");        // Create a "class" attribute
		att.value = "w14_8 rounded";            
		inputField.setAttributeNode(att); 

		// Adds The Option to Date Operator
		var i = 0;
		var txtOperators = "IN, ALL";
		var arrOpeartors = txtOperators.split(",");
		for(i = 0; i < arrOpeartors.length; i++)
		{
			var option = document.createElement("option");
			option.text = arrOpeartors[i];
			option.value = arrOpeartors[i];
			inputField.add(option);
		}
		return inputField;
}

function createNumberOperator(id, name, value) 
{
		/*var inputField;
		inputField = document.createElement("select");
		inputField.name = name;
		inputField.id = id;
		inputField.value = value;
		var att = document.createAttribute("class");        // Create a "class" attribute
		att.value = "w14_8 rounded";            
		inputField.setAttributeNode(att); 

		// Adds The Option to Date Operator
		var i = 0;
		for(i = 0; i < dateOperators.length; i++)
		{
			var option = document.createElement("option");
			option.value = dateOperators[i];
			option.text = getReportLabel('lbl.operator.'+dateOperators[i], dateOperators[i]);
			inputField.add(option);
		}
		return inputField;
		*/
		var inputElelement = createInputField('input', 'text', id, name, value);
		inputElelement.setAttribute("disabled","disabled");
		return inputElelement;
}

function sortMultiSelectOptions(options)
{
	var arr = options.map(function(_, o) { return { t: $(o).text(), v: o.value }; }).get();
    arr.sort(function(o1, o2) { return o1.t > o2.t ? 1 : o1.t < o2.t ? -1 : 0; });
    options.each(function(i, o) {
      o.value = arr[i].v;
      $(o).text(arr[i].t);
    });
}

jQuery.fn.applyDatePicker = function()
{
	$(this).datepicker({dateFormat: strApplicationDateFormat,minDate: new Date(year, month-1, day)}).attr( 'readOnly' , 'true' );
}
jQuery.fn.hideElement = function() {
	$(this).addClass("hidden");
	//$(this).hide();
}
jQuery.fn.showElement = function() {
	$(this).removeClass("hidden");
	//$(this).hide();
}
jQuery.fn.enableChildElements = function()
{
	$(this).children().each(function() {
		var name = $(this).attr("name");
		var id = $(this).attr("id");
		name = name.replace("disable_", "");
		id = id.replace("disable_", "");
		$(this).attr("name", name);
		$(this).attr("id", id);
	});
}
jQuery.fn.disableChildElements = function()
{
	$(this).children().each(function() {
		var name = $(this).attr("name");
		var id = $(this).attr("id");
		$(this).attr("name", "disable_"+name);
		$(this).attr("id", "disable_"+id);
	});
}

jQuery.fn.ForceNumericOnlyWithColon = function() {
	return this
			.each(function() {
				$(this)
						.keydown(function(event) {
							var keynum;
							var keychar;
							if (window.event) { // IE
								keynum = event.keyCode;
							}
							if (event.which) { // Netscape/Firefox/Opera
								keynum = event.which;
							}
							if (event.shiftKey)
							{
								if(keynum == 186)
								{
									if($(this).val().indexOf(":")==-1)
										return true;
								}
							  return false;
							}
							if ((keynum == 8
									|| keynum == 9
									|| keynum == 27
									|| keynum == 46
									||
									// Allow: Ctrl+A
									(keynum == 65 && event.ctrlKey === true)
									||
									// Allow: home, end, left, right
									(keynum >= 35 && keynum <= 40) || (keynum >= 96 && keynum <= 105))) {
								if (((keynum >= 48 && keynum <= 57) || (keynum >= 96 && keynum <= 105))
										&& (this.value.indexOf('.') != -1 && (this.value
												.substring(this.value
														.indexOf('.'))).length > 5))
									return false;
								return true;
							} else if (keynum == 110 || keynum == 190) {
								var checkdot = this.value;
								var i = 0;
								for (i = 0; i < checkdot.length; i++) {
									if (checkdot[i] == '.')
										return false;
								}
								if (checkdot.length == 0)
									this.value = '0';
								return true;
							} else {
								// Ensure that it is a number and stop
								// the keypress
								if (event.shiftKey
										|| (keynum < 48 || keynum > 57)
										&& (keynum < 96 || keynum > 105)) {
									event.preventDefault();
								}
							}

							keychar = String.fromCharCode(keynum);

							return !isNaN(keychar);
							})
			})
};