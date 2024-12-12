cssClass = "rounded w13";
labelClass = "frmLabel popupLabel";
labelClassRequired = "frmLabel popupLabel required";
layoutMaxCols = 2;

$.widget('custom.mcautocomplete', $.ui.autocomplete, {
    _renderMenu: function(ul, items) {
        var self = this,
            thead;

        if (this.options.showHeader) {
            table = $('<div class="ui-widget-header" style="width:100%"></div>');
            $.each(this.options.columns, function(index, item) {
                table.append('<span style="padding:0 4px;float:left;width:' + item.width + ';">' + item.name + '</span>');
            });
            table.append('<div style="clear: both;"></div>');
            ul.append(table);
        }
        $.each(items, function(index, item) {
            self._renderItem(ul, item);
        });
    },
    _renderItem: function(ul, item) {
        var t = '',
            result = '';

        $.each(this.options.columns, function(index, column) {
            t += '<span style="padding:0 4px;float:left;width:' + column.width + ';">' + item[column.valueField ? column.valueField : index] + '</span>'
        });

        result = $('<li></li>').data('item.autocomplete', item).append('<a class="mcacAnchor">' + t + '<div style="clear: both;"></div></a>').appendTo(ul);
        return result;
    }
});


function changeAccount(){
	var account = $('#accountNo :selected').text();
	var ccy = account.substring(account.length -4 , account.length -1);
	$.blockUI({overlayCSS: {opacity: 0 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/images/backgrounds/busy.gif" class="middleAlign"/>&nbsp;Processing your request...</h2></div>',
		css:{ height:'32px',padding:'8px 0 0 0'}});
    $.ajax({
        url: "services/availablebalance/"+$('#accountNo :selected').val()+".json",
        data: {$data: null},
		complete: function(XMLHttpRequest, textStatus) {
			$.unblockUI();
			if ("error" == textStatus)
				alert("Unable to complete your request!");
		},
        success: function( data ) {
		$('#balSpan').remove();
		$('#balSpanBR').remove();
		$("<br>").attr({'id' : 'balSpanBR'}).appendTo('#lbl_accountNo');
        $("<span>").attr({'id' : 'balSpan'}).html(getLabel('availableBal', 'Available balance ')+ ccy + " : " + data).addClass('grey popupSmallFont inline').appendTo('#lbl_accountNo');
        } 
    });
    if(ccy != $('#txnCurrency :selected').val())
    {
    	$('#td_rateType').show();
    	$('#td_contractRefNo').show();
    }
    else
    {
    	$('#td_rateType').hide();
    	$('#td_contractRefNo').hide();
    }
}
function getpaymentsPopup(json, intialJson, myProduct, myProductDesc) {
    
    var varQuickPayDiv = $('<div id="quickPayDiv"/>');
    var headerDiv = $('<div>').attr({'id' : 'headerDiv'}).addClass('ui-section-header ui-widget-header ui-corner-all ui-helper-clearfix');
    var headerText = $('<span>').attr({'id' : 'headerText'}).html('Make a Wire | Internal Reference: 0').addClass('ui-section-title').appendTo(headerDiv);
    headerText.hide();
    headerDiv.appendTo(varQuickPayDiv);
    $('<br>').appendTo(varQuickPayDiv);
    var errorDiv = $('<div id="errorDiv"/>').addClass('ui-section-header hidden ui-widget-header red greyback').hide(500).appendTo(varQuickPayDiv);
    var tableQuickPayDiv = $('<table>');
	tableQuickPayDiv.addClass('paymentTable');
    
    generateForm(json, tableQuickPayDiv, myProduct);
    tableQuickPayDiv.appendTo(varQuickPayDiv);
    setDrCrFlag(json);

    varQuickPayDiv.appendTo('#quickpaylistform').dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:false, width:750,title : myProduct + " - " + myProductDesc,
					buttons: {"Save": {id: "btnSave", text: getLabel('btnSave', 'Save'), click:  function() {saveQuickPayment(json, intialJson, myProduct, varQuickPayDiv); return false;}},
								"Save & Submit": {id: "btnSaveSubmit", text: getLabel('btnSaveSubmit', 'Save & Submit'), click: function() {saveAndSubmitQuickPay(json, intialJson, myProduct, varQuickPayDiv); return false;}},
								Cancel: function() {$(this).dialog('close'); $.unblockUI();}}}).bind( "dialogclose", function(event, ui) {json=null; $('#quickPayDiv').empty(); $.unblockUI();}).dialog('open');
	var account = $('#accountNo :selected').text();
	var accCy = account.substring(account.length -4 , account.length -1);
	var txnCcy = $('#txnCurrency').val();
	if(accCy == txnCcy) 
	{
		$("#td_rateType").hide(1000);
		$("#td_contractRefNo").hide(1000);
	}
	else
	{
		$("#td_rateType").show(1000);
		$("#td_contractRefNo").show(1000);
		$('#contractRefNo').attr({'disabled' : 'disabled'});
	}
	
	return false;
	};
                  
function generateForm(json, quickPayDiv, myProduct)
{
	
	var elementsData =json.d;
	var newRow = $("<tr>");
	var check = false;
	for(index=0; index <elementsData.length; index++){
    	var rowOrCol = $("<td>");
		rowOrCol.addClass('paymentTd');
		rowOrCol.attr({'id' : 'td_'+elementsData[index].fieldName});
        if(elementsData[index].type == 'text')
        {        
            renderText(elementsData[index], newRow, rowOrCol);
        }
        
        else if(elementsData[index].type == 'seek')
        {        
        	renderAutoComplete(elementsData[index], newRow, rowOrCol, myProduct);
        }
		else if(elementsData[index].type == 'select')
		{
        	renderSelect(elementsData[index], newRow, rowOrCol);
		
		}
        else if(elementsData[index].type == 'date')
        {        
        	renderDateField(elementsData[index], newRow, rowOrCol);
        }
        else if(elementsData[index].type == 'amount')
        {        
        	renderAmountField(elementsData[index], newRow, rowOrCol);
        }
		if ( (index+1) % layoutMaxCols == 0) {
		  newRow.appendTo(quickPayDiv);
		  newRow = $("<tr>");
		  check = false;
		} else {
			check = true;
		}
	}
	if (check) {
		newRow.appendTo(quickPayDiv);
	}
	return false;
}


function renderText(elementJson, quickPayDiv, rowOrCol)
{
	var fieldClass = labelClass;
	if(elementJson.displayMode == 3)
	{
		fieldClass= labelClassRequired;
	}
		
	var label = $("<label>").attr({'for' : elementJson.fieldName}).addClass(fieldClass).html(elementJson.label);
	var input = $('<input>').attr({ 'type': 'text', 'id': elementJson.fieldName,  'name': elementJson.fieldName}).addClass(cssClass);
    $("<br>").appendTo(label);
    if('contractRefNo' == elementJson.fieldName)
    {
    	input.attr({"disabled" : "disabled"});
    }
    input.appendTo(label);
	label.appendTo(rowOrCol);
	rowOrCol.appendTo(quickPayDiv);
	
    if(elementJson.value !== null)
    {
        input.val(elementJson.value);
    }
	return false;
}

function renderAutoComplete(elementJson, quickPayDiv, rowOrCol, myProduct)
{
	var available = $.parseJSON((JSON.stringify(elementJson.availableValues)));
	var fieldClass = labelClass;
	if(elementJson.displayMode == 3)
	{
		fieldClass= labelClassRequired;
	}

    	var label = $("<label>").attr({'for' : elementJson.fieldName}).addClass(fieldClass).html(elementJson.label);
		var urlSeek = "services/paymentsbene/"+myProduct+".json";
		if(elementJson.fieldName == 'drawerCode')
		{
			urlSeek = "services/paymentsbene/"+myProduct+".json";
		}
		if(elementJson.fieldName == 'contractRefNo')
		{
			var buyccy = $('#txnCurrency').val();
			var account = $('#accountNo :selected').text();
			var sellccy = account.substring(account.length -4 , account.length -1);
			urlSeek = "services/contractref/" + buyccy + "/" + sellccy+".json";
		}
        var input = $('<input>').attr({'id': elementJson.fieldName,  'name': elementJson.fieldName, 'placeholder' : 'Enter Keyword or %'}).addClass(cssClass);
        var beneDesc = "";
		$("<br>").appendTo(label);
        input.appendTo(label);
        input.autocomplete(
            	{
            		minLength: 1,
            		delay: 700,
            		source: function( request, response ) {
            			$.blockUI({overlayCSS: {opacity: 0 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/images/backgrounds/busy.gif" class="middleAlign"/>&nbsp;Processing your request...</h2></div>',
            				css:{ height:'32px',padding:'8px 0 0 0'}});
            		    $.ajax({
            		        url: urlSeek,
            				complete: function(XMLHttpRequest, textStatus) {
            					$.unblockUI();
            					if ("error" == textStatus)
            						alert("Unable to complete your request!");
            				},
            		        data: {$qfilter: request.term},
            		        dataType: "json",
            		        success: function( data ) {
            		            response( $.map( data, function( item ) {
            		            	if(item.code == null || item.code.length == 0)
            		            	{
        	        		                return {
        	        		                    label: getLabel('suggestionBoxEmptyText', 'No match found.'),
        	        		                    value: ""
        	    		            	}
            		            	}
            		            	
        		                	return {
        	    		                    label: item.code + " | " + item.description,
        	    		                    description: item.description,
        	    		                    value: item.code
                		            }
            		            }));
            		        },
            		        error: function(data){
            		            response( $.map( data, function( item ) {
            		                return {
            		                    label: getLabel('suggestionBoxEmptyText', 'No match found.'),
    	    		                    description: "",
            		                    value: ""
            		                }
            		            }));
            		        }
            		    });
            		},
        		    select: function (event, ui) {
        		        
        		    	beneDesc = ui.item.description;
    		    		$('#beneDesc').remove();
    		    		$('#brBeneDesc').remove();
    		    		$('#beneDetails').remove();
        		    	if(beneDesc && beneDesc.length > 0)
        		    	{
        		    		
        		    		$("<a>").attr({'id' : 'beneDetails', 'href' : '#'}).html(getLabel('moreDetails', 'More Details')).addClass('grey popupSmallFont inline ').click(createBeneDiv).appendTo(label);
        		    		$("<br>").attr({'id' : 'brBeneDesc'}).appendTo(label);
        		    		$("<span>").attr({'id' : 'beneDesc'}).html(beneDesc).addClass('grey popupSmallFont inline').appendTo(label);
        		    	}
        		    }
            		
            	}		
            	);
    	label.appendTo(rowOrCol);
    	rowOrCol.appendTo(quickPayDiv);
    	if(elementJson.value !== null)
    {
        input.val(elementJson.value);
    }
	return false;
}

function renderRadioButton(elementJson, quickPayDiv, rowOrCol)
{
	var available = $.parseJSON((JSON.stringify(elementJson.availableValues)));
	var fieldClass = labelClass;
	if(elementJson.displayMode == 3)
	{
		fieldClass= labelClassRequired;
	}
	var label = $("<label>").attr({'for' : elementJson.fieldName}).addClass(fieldClass).html(elementJson.label);
	$('<br/>').appendTo(label);
	var inputdr =  $('<input>').attr({ 'type': 'radio', 'id': elementJson.fieldName,  'name': elementJson.fieldName, 'value' : 'D'}).addClass("popupRadioBox").appendTo(label);
    var debit = $('<span />');
	debit.html(getLabel('debit', 'Debit'));
	debit.appendTo(label);
   var  inputcr = $('<input>').attr({ 'type': 'radio', 'id': elementJson.fieldName,  'name': elementJson.fieldName, 'value' : 'C'}).addClass("popupRadioBox").appendTo(label);
    var credit = $('<span />');
	credit.html(getLabel('credit', 'Credit'));
	credit.appendTo(label);
	label.appendTo(rowOrCol);
	rowOrCol.appendTo(quickPayDiv);
    if(elementJson.value !== null)
    {
        input.val(elementJson.value);
    }
	return false;
}

function renderDateField(elementJson, quickPayDiv, rowOrCol)
{
	var fieldClass = labelClass;
	if(elementJson.displayMode == 3)
	{
		fieldClass= labelClassRequired;
	}
	var label = $("<label>").attr({'for' : elementJson.fieldName}).addClass(fieldClass).html(elementJson.label);
    $("<br>").appendTo(label);
    var input = $('<input>').attr({ 'type': 'text', 'id': elementJson.fieldName,  'name': elementJson.fieldName}).datepicker({dateFormat: elementJson.jqDateFormat, defaultDate : elementJson.applDate, appendText : elementJson.dateFormat}).datepicker('setDate', elementJson.applDate).addClass(cssClass).appendTo(label);
	label.appendTo(rowOrCol);
	rowOrCol.appendTo(quickPayDiv);
    if(elementJson.value !== null)
    {
        input.val(elementJson.value);
    }
    if('txnDate' == elementJson.fieldName)
    {
		var applDate = $.datepicker.parseDate(elementJson.jqDateFormat, elementJson.applDate);		   
		var defaultDate1 = $.datepicker.formatDate(elementJson.jqDateFormat, applDate);
    	$('#txnDate').datepicker({defaultDate: defaultDate1});
    }
 	return false;
   
}


function renderAmountField(elementJson, quickPayDiv, rowOrCol)
 {
	var fieldClass = labelClass;
	if (elementJson.displayMode == 3) {
		fieldClass = labelClassRequired;
	}
	var available = $.parseJSON((JSON.stringify(elementJson.availableValues)));
	var label = $("<label>").attr({
		'for' : elementJson.fieldName
	}).addClass(fieldClass).html(elementJson.label);
	label.appendTo(rowOrCol);
	$('<br>').appendTo(rowOrCol);
	var innerTable = $("<table>");
	innerTable.appendTo(rowOrCol);
	var innerTr = $("<tr>");
	var innerTd = $("<td>");
	innerTr.appendTo(innerTable);
	innerTd.appendTo(innerTr);
	var sel = $(' <select>').attr({
		'id' : elementJson.ccyFieldName,
		'name' : elementJson.fieldName
	}).addClass('rounded w5').change(function() {
		var account = $('#accountNo :selected').text();
		var ccy = account.substring(account.length - 4, account.length - 1);
		if (ccy != $(this).val()) {
			$('#td_rateType').show();
			$('#td_contractRefNo').show();
		} else {
			$('#td_rateType').hide();
			$('#td_contractRefNo').hide();
		}
	}).appendTo(innerTd);
	$(available).each(function() {
		sel.append($("<option>").attr('value', this.code).text(this.code));
	});
	sel.val(elementJson.defaultCcy);

	var input = $('<input>').attr({
		'type' : 'text',
		'id' : elementJson.fieldName,
		'name' : elementJson.fieldName
	}).blur(getFX).addClass('rightAlign rounded w8').ForceNumericOnly().appendTo(innerTd);
	var divDrCr = $('<div>').attr({
		'id' : 'drCrDiv'
	}).addClass('inline');
	var inputdr = $('<input>').attr({
		'type' : 'radio',
		'id' : 'drCrFlagD',
		'name' : 'drCrFlag',
		'value' : 'D'
	}).addClass('inline').change(function() {
		var labeldata = $("label[for=accountNo]").html();
		var selectedAccount = $('#accountNo :selected').val();
		if ($(this).is(':checked')) {
			labeldata = labeldata.replace(getLabel('creditAccount', 'Credit Account'), getLabel('debitAccount', 'Debit Account'));
			$("label[for=accountNo]").html(labeldata);
			$('#accountNo').val(selectedAccount);
			$('#accountNo').change(changeAccount);
		}

	}).appendTo(divDrCr);
	var debit = $('<span />');
	debit.html(getLabel('debit', 'Debit'));
	debit.appendTo(divDrCr);
	$("<br>").appendTo(divDrCr);
	var inputcr = $('<input>').attr({
		'type' : 'radio',
		'id' : 'drCrFlagC',
		'name' : 'drCrFlag',
		'value' : 'C'
	}).change(function() {
		var labeldata = $("label[for=accountNo]").html();
		var selectedAccount = $('#accountNo :selected').val();
		if ($(this).is(':checked')) {
			labeldata = labeldata.replace(getLabel('debitAccount', 'Debit Account'), getLabel('creditAccount', 'Credit Account'));
			$("label[for=accountNo]").html(labeldata);
			$('#accountNo').val(selectedAccount);
			$('#accountNo').change(changeAccount);
		}

	}).appendTo(divDrCr);
	var credit = $('<span />');
	credit.html(getLabel('credit', 'Credit'));
	credit.appendTo(divDrCr);
	innerTd = $('<td style="vertical-align:top">');
	divDrCr.appendTo(innerTd);
	innerTd.appendTo(innerTr);
	if (elementJson.value !== null) {
		input.val(elementJson.value);
	}
	rowOrCol.appendTo(quickPayDiv);
	return false;

}

function renderSelect(elementJson, quickPayDiv, rowOrCol)
{
	var available = $.parseJSON((JSON.stringify(elementJson.availableValues)));
	var fieldClass = labelClass;
	if(elementJson.displayMode == 3)
	{
		fieldClass= labelClassRequired;
	}
		var labelText = elementJson.label;
		var labelId  = 'lbl_'+elementJson.fieldName;
		
		if(elementJson.fieldName == 'accountNo')
		{
			labelText = 'Debit Account';
		}
    	var label = $("<label>").attr({'for' : elementJson.fieldName, 'id' : labelId}).addClass(fieldClass).html(labelText);
		$("<br>").appendTo(label);
        var input = $('<select>').attr({'id': elementJson.fieldName,  'name': elementJson.fieldName}).addClass(cssClass);
        input.appendTo(label);
		if(elementJson.fieldName == 'accountNo')
		{
			var refresh = $("<a>").attr({'id' : 'balRefresh', 'href' : '#'}).addClass('refresh_icon').click(changeAccount).appendTo(label);
		}
    	label.appendTo(rowOrCol);
    	rowOrCol.appendTo(quickPayDiv);
       $(available).each(function() {
        	input.append($("<option>").attr('value',this.code).text(this.description));
        });   
        if(elementJson.fieldName == 'accountNo')
        {
        	input.change(changeAccount);
        }
        
        if('rateType' == elementJson.fieldName)
        {
        	input.change(function(){
        		if($(this).val() == '1')
        		{
        			$('#contractRefNo').removeAttr("disabled");
        			$('#contractRefNo').autocomplete(
        			    	{
        			    		minLength: 1,
        			    		delay: 700,
        			    		source: function( request, response ) {
        			    			$.blockUI({overlayCSS: {opacity: 0 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/images/backgrounds/busy.gif" class="middleAlign"/>&nbsp;Processing your request...</h2></div>',
        			    				css:{ height:'32px',padding:'8px 0 0 0'}});
        			    		    $.ajax({
        			    		        url: getContractRefSeekURL(),
        			    		        data: {$qfilter: request.term},
        			    				complete: function(XMLHttpRequest, textStatus) {
        			    					$.unblockUI();
        			    					if ("error" == textStatus)
        			    						alert("Unable to complete your request!");
        			    				},
        			    		        dataType: "json",
        			    		        success: function( data ) {
        			    		            response( $.map( data, function( item ) {
        			    		            	if(item.code == null || item.code.length == 0)
        			    		            	{
        				        		                return {
        				        		                    label: getLabel('suggestionBoxEmptyText', 'No match found.'),
        				        		                    value: ""
        				    		            	}
        			    		            	}
        					                	return {
        				    		                    label: item.code + " | " + item.description,
        				    		                    value: item.code
        			        		            }
        			    		            }));
        			    		        },
        			    		        error: function(data){
        			    		            response( $.map( data, function( item ) {
        			    		                return {
        			    		                    label: getLabel('suggestionBoxEmptyText', 'No match found.'),
        			    		                    value: ""
        			    		                }
        			    		            }));
        			    		        }
        			    		    });
        			    		}
        			    	}		
        			    	);
        		}
        		if($(this).val() == '0')
        		{
        			$('#contractRefNo').attr({"disabled" : "disabled"});
        		}
        	});
        	
        	$("<a>").attr({'id' : 'btnRefreshFX', 'href' : '#'}).click(getFX).addClass('refresh_icon').appendTo(label);
	
        }
    if(elementJson.value !== null)
    {
        input.val(elementJson.value);
    }
	return false;
}



function gotoNextRow(index)
{
	if((index + 1) % layoutMaxCols == 0)
		return true;
	else 
		return false;
}


function getMyProductJson(myProduct, myProductDesc)
{
	$.blockUI();
	var url = "services/paymentspopup/"+myProduct+".json";
	$.blockUI({overlayCSS: {opacity: 0 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/images/backgrounds/busy.gif" class="middleAlign"/>&nbsp;Processing your request...</h2></div>',
		css:{ height:'32px',padding:'8px 0 0 0'}});
	$.ajax
	(
	{
	   type: "GET",
	   url: url,
		complete: function(XMLHttpRequest, textStatus) {
			$.unblockUI();
			if ("error" == textStatus)
				alert("Unable to complete your request!");
		},
	   data: null,
	   contentType: "application/json",
	   dataType: "json",
       success: function(data)
       {
          if (data!=null) 
		   { 
        		getpaymentsPopup(data, data, myProduct, myProductDesc);
		   }       	
       }
	}
	);
		$.unblockUI();

	return false;
}

function saveQuickPayment(json, intialJson, myProduct, quickPayDiv)
{
	var elementsData = json.d;
	for(index=0; index <elementsData.length; index++)
	{
		elementsData[index].value=$('#'+ elementsData[index].fieldName).val();
	}
	json.d = null;
	json.d = elementsData;
	var url = "services/quickpayment/"+myProduct+".json";
	$.blockUI({overlayCSS: {opacity: 0 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/images/backgrounds/busy.gif" class="middleAlign"/>&nbsp;Processing your request...</h2></div>',
		css:{ height:'32px',padding:'8px 0 0 0'}});
	$.ajax
	(
	{
	   type: "POST",
	   url: url + '?'+csrfTokenName+'='+tokenValue,
		complete: function(XMLHttpRequest, textStatus) {
			$.unblockUI();
			if ("error" == textStatus)
				alert("Unable to complete your request!");
		},
	   data: JSON.stringify(json),
	   contentType: "application/json",
       success: function(data)
       {
          if (data!=null) 
		   { 
				var payJson = data;
				if(payJson.d[0].message.pirNo) {
					$('#quickPayDiv').html('');
					$('#quickPayDiv').dialog('close')
					getpaymentsPopup(intialJson, intialJson, myProduct);
					$('#headerText').html("Make a Wire | Internal Reference: " + payJson.d[0].message.pirNo + " | Unique Reference: "+payJson.d[0].message.uniqueRef);
					$('#btnSave').attr({'disabled' : 'disabled'});
					$('#btnSaveSubmit').attr({'disabled' : 'disabled'});
					$('#headerText').show(500);
					$('#errorDiv').html('Payment Request Completed');
					$('#errorDiv').removeClass('hidden');
					$('#errorDiv').removeClass('red');
					$('#errorDiv').show();
				}
				else
				{
					showErrors(payJson.d[0].message.errors, quickPayDiv);
				}
		   }       	
       }
	}
	);
	return false;
}


function saveAndSubmitQuickPay(json, intialJson,  myProduct)
{
	var elementsData = json.d;
	for(index=0; index <elementsData.length; index++)
	{
		elementsData[index].value=$('#'+ elementsData[index].fieldName).val();
	}
	json.d = null;
	json.d = elementsData;
	var url = "services/quickpaymentwithsubmit/"+myProduct+".json";
	$.blockUI({overlayCSS: {opacity: 0 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/images/backgrounds/busy.gif" class="middleAlign"/>&nbsp;Processing your request...</h2></div>',
		css:{ height:'32px',padding:'8px 0 0 0'}});
	$.ajax
	(
	{
	   type: "POST",
	   url: url+ '?'+csrfTokenName+'='+tokenValue,
		complete: function(XMLHttpRequest, textStatus) {
			$.unblockUI();
			if ("error" == textStatus)
				alert("Unable to complete your request!");
		},
	   data: JSON.stringify(json),
	   contentType: "application/json",
       success: function(data)
       {
           if (data!=null) 
		   { 
				var payJson = data;
				if(payJson.d[0].message.pirNo) {
					$('#quickPayDiv').html('');
					$('#quickPayDiv').dialog('close')
					getpaymentsPopup(intialJson, intialJson, myProduct);
					$('#headerText').html("Make a Wire | Internal Reference: " + payJson.d[0].message.pirNo + " | Unique Reference: "+payJson.d[0].message.uniqueRef);
					$('#btnSave').attr({'disabled' : 'disabled'});
					$('#btnSaveSubmit').attr({'disabled' : 'disabled'});
					$('#headerText').show(500);
					$('#errorDiv').html('Payment Request Completed');
					$('#errorDiv').removeClass('hidden');
					$('#errorDiv').removeClass('red');
					$('#errorDiv').show();
				}
				else
				{
					showErrors(payJson.d[0].message.errors, quickPayDiv);
				}
		   }       	
       }
	}
	);
	return false;
}

function showErrors(errorJson, quickPayDiv)
{
    var errorDiv = $('#errorDiv');
    errorDiv.show(500);
    var errorMesssageLine = "";
    for (index=0; index < errorJson.length; index++)
    {
    	errorMesssageLine = errorMesssageLine + errorJson[index].errorMessage;
    	errorMesssageLine = errorMesssageLine + "<br/>";
    }
	errorDiv.removeClass('hidden');
    errorDiv.html(errorMesssageLine);
}

function getContractRefSeekURL()
{
	var buyccy = $('#txnCurrency').val();
	var account = $('#accountNo :selected').text();
	var sellccy = account.substring(account.length -4 , account.length -1);
	var urlSeek = "services/contractref/" + buyccy + "/" + sellccy+ ".json";
	return urlSeek;

}


function getFX()
{
	var txnAmount = $('#amount').val();
	txnAmount = parseFloat(txnAmount);
	var contractRef = $('#contractRefNo').val();
	if(!contractRef)
	{
		contractRef = "";
	}
	
	if(txnAmount && txnAmount > 0)
	{
		$('#amount').val(txnAmount.toFixed(2));
		txnAmount = parseFloat(txnAmount).toFixed(2);
		var fxRateType = $('rateType').val(); 
		var sellccy = $('#txnCurrency').val();
		var account = $('#accountNo :selected').text();
		var buyccy = account.substring(account.length -4 , account.length -1);
		if(buyccy != sellccy)
		{
			var urlSeek = "services/fxrate/" + buyccy + "/" + sellccy+".json";
			var sendData = "$rateType=" + fxRateType + "&$amount=" + txnAmount + "&$qfilter=" + contractRef;
			$.blockUI({overlayCSS: {opacity: 0 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/images/backgrounds/busy.gif" class="middleAlign"/>&nbsp;Processing your request...</h2></div>',
				css:{ height:'32px',padding:'8px 0 0 0'}});
		    $.ajax({
		        url: urlSeek,
				complete: function(XMLHttpRequest, textStatus) {
					$.unblockUI();
					if ("error" == textStatus)
						alert("Unable to complete your request!");
				},
		        data: sendData,
		        success: function( data ) {
				$('#fxSpan').remove();
		        $("<span>").attr({'id' : 'fxSpan'}).html(sellccy + " / " + buyccy + " " + data).addClass('grey inline').appendTo('#lbl_rateType');
		        }
		    });
		}
	}
}

function showRegisteredBeneficiary()
{
	
	$('#RegisteredBeneficiaryDialog').dialog( {autoOpen:false, height:'auto', width:800, title:getLabel('registerReceiverDetails', 'Registered Receiver Details'), modal:true});
	$('#dialogMode').val('1');
	$('#RegisteredBeneficiaryDialog').dialog('open');
	$('#td_beneficiary\\.drawerCode').show();
	hideRegisteredBankType($('#registereddivType').val()); 
	
}

function setDrCrFlag(json)
{
}

function createBeneDiv() {

	var beneCode = $('#drawerCode').val();
	if(beneCode)
	{
	    var receiverDetails;
		$.blockUI({overlayCSS: {opacity: 0 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/images/backgrounds/busy.gif" class="middleAlign"/>&nbsp;Processing your request...</h2></div>',
			css:{ height:'32px',padding:'8px 0 0 0'}});
		$.ajax({
	        url: "services/receiverdetail/"+beneCode+".json",
			complete: function(XMLHttpRequest, textStatus) {
				$.unblockUI();
				if ("error" == textStatus)
					alert("Unable to complete your request!");
			},
	        async: false,
	        data: null,
	        success: function( data ) {
	        	receiverDetails = data;
	        }
	    });
		var beneDiv = $("<div>").attr({
			'id' : 'registeredBenetabs-1'
		}).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom");
		var labelPersonalDetails = $("<label>").addClass("w20").attr({
			"for" : "personaldetails"
		}).appendTo(beneDiv);
		$("<b>").html(getLabel('personalDetails', 'Personal Details')).appendTo(labelPersonalDetails);
		$("<br>").appendTo(beneDiv);
		$("<hr size='1'>").appendTo(beneDiv);
		$("<br>").appendTo(beneDiv);
		var labelDrawerCode = $("<label>").addClass("frmLabel").attr({
			"for" : "beneficiary.drawerCode"
		}).html(getLabel('code', 'Code : ')).appendTo(beneDiv);
		var labelDrawerCodeVal = $("<label>").addClass(
				"codeBox w20 rounded inline_block disabled").attr({
			"id" : "lbl_beneficiary.drawerCode"
		}).html(" " + receiverDetails.drawerCode).appendTo(beneDiv);
	
		$("<br>").appendTo(beneDiv);
		var labelDrawerDesc = $("<label>").addClass("frmLabel").attr({
			"for" : "beneficiary.drawerDesc"
		}).html(getLabel('name', 'Name : ')).appendTo(beneDiv);
		$("<label>").addClass("textBox w20 rounded inline_block disabled").attr({
			"id" : "lbl_beneficiary.drawerDesc"
		}).html(" " + receiverDetails.drawerDesc).appendTo(beneDiv);
		$("<br>").appendTo(beneDiv);
		$("<label>").addClass("frmLabel").attr({
			"for" : "beneficiary.beneMobileNmbr"
		}).html(getLabel('mobileNumber', 'Mobile Number : ')).appendTo(beneDiv);
		$("<label>").addClass("numberBox w20 rounded inline_block disabled").attr({
			"id" : "lbl_beneficiary.beneMobileNmbr"
		}).html(" " + receiverDetails.beneMobileNmbr).appendTo(beneDiv);
	
		$("<br>").appendTo(beneDiv);
		$("<label>").addClass("frmLabel").attr({
			"for" : "beneficiary.beneEmailId"
		}).html(getLabel('emailId', 'E-Mail ID : ')).appendTo(beneDiv);
		$("<label>").addClass("rounded w20 rounded inline_block disabled").attr({
			"id" : "lbl_beneficiary.beneEmailId"
		}).html(" "+ receiverDetails.beneEmailId).appendTo(beneDiv);
	
		$("<br>").appendTo(beneDiv);
		$("<label>").addClass("frmLabel").attr({
			"for" : "beneficiary.beneResidentFlag"
		}).html(getLabel('residentStaus', 'Resident Status : ')).appendTo(beneDiv);
		$("<span>").addClass("rounded w20 disabled inline_block font_bold").attr({
			"id" : "lbl_beneResidentFlag"
		}).html(" " + receiverDetails.beneResidentFlag).appendTo(beneDiv);
	
		$("<br>").appendTo(beneDiv);
		$("<br>").appendTo(beneDiv);
		$("<label>").addClass("w20").attr({
			"for" : "benebankdetail"
		}).html(getLabel('receiverBankDetails', 'Receiver Bank Details')).appendTo(beneDiv);
		$("<br>").appendTo(beneDiv);
		$("<hr size='1'>").appendTo(beneDiv);
		$("<br>").appendTo(beneDiv);
	
		$("<label>").addClass("frmLabel").attr({
			"for" : "bankType"
		}).html(getLabel('bankType', 'Bank Type : ')).appendTo(beneDiv);
	
		$("<br>").appendTo(beneDiv);
		$("<label>").addClass("frmLabel").attr({
			"for" : "beneficiary.orderPartyCode"
		}).html(getLabel('bankBranchSearch', 'Bank Branch Search : ')).appendTo(beneDiv);
		$("<label>").addClass("textBox w20 rounded inline_block disabled").attr({
			"id" : "lbl_beneficiary.orderPartyCode"
		}).html("" + receiverDetails.orderPartyCode).appendTo(beneDiv);
	
		$("<br>").appendTo(beneDiv);
		$("<label>").addClass("frmLabel").attr({
			"for" : "beneficiary.beneBankCode"
		}).html(getLabel('bank', 'Bank : ')).appendTo(beneDiv);
		$("<label>").addClass("codeBox w20 rounded inline_block disabled").attr({
			"id" : "lbl_beneficiary.beneBankCode"
		}).html(" " + receiverDetails.beneBankCode).appendTo(beneDiv);
	
		$("<br>").appendTo(beneDiv);
		$("<label>").addClass("frmLabel").attr({
			"for" : "beneficiary.beneBranchCode"
		}).html(getLabel('branch', 'Branch : ')).appendTo(beneDiv);
		$("<label>").addClass("codeBox w20 rounded inline_block disabled").attr({
			"id" : "lbl_beneficiary.beneBranchCode"
		}).html(" " + receiverDetails.beneBranchCode).appendTo(beneDiv);
	
		$("<br>").appendTo(beneDiv);
		$("<label>").addClass("frmLabel").attr({
			"for" : "beneficiary.beneBankBic"
		}).html(getLabel('bic', 'BIC : ')).appendTo(beneDiv);
		$("<label>").addClass("textBox w20 rounded inline_block disabled").attr({
			"id" : "lbl_beneficiary.beneBankBic"
		}).html(" " + receiverDetails.beneBankBic).appendTo(beneDiv);
	
		$("<br>").appendTo(beneDiv);
		$("<label>").addClass("frmLabel").attr({
			"for" : "beneficiary.beneBankAddress"
		}).html(getLabel('bankAddress', 'Bank Address : ')).appendTo(beneDiv);
		$("<label>").addClass("rounded w20 topAlign inline_block disabled").attr({
			"id" : "lbl_beneficiary.beneBankAddress"
		}).html(" " + receiverDetails.beneBankAddress).appendTo(beneDiv);
		$("<br>").appendTo(beneDiv);
		$("<label>").addClass("frmLabel").attr({
			"for" : "beneficiary.beneBankCountry"
		}).html(getLabel('bankCountry', 'Bank Country : ')).appendTo(beneDiv);
		$("<label>").addClass("codeBox w20 rounded inline_block disabled").attr({
			"id" : "lbl_beneficiary.beneBankCountry"
		}).html(" " + receiverDetails.beneBankCountry).appendTo(beneDiv);
	
		$("<br>").appendTo(beneDiv);
		$("<br>").appendTo(beneDiv);
		$("<label>").addClass("w20").attr({
			"for" : "beneaccountdetail"
		}).html(getLabel('receiverAccDetails', 'Receiving Account Details')).appendTo(beneDiv);
		$("<br>").appendTo(beneDiv);
		$("<hr size='1'>").appendTo(beneDiv);
	
		$("<br>").appendTo(beneDiv);
		$("<label>").addClass("frmLabel").attr({
			"for" : "beneficiary.beneAcctNmbr"
		}).html(getLabel('account', 'Account : ')).appendTo(beneDiv);
		$("<label>").addClass("codeBox w20 rounded inline_block disabled").attr({
			"id" : "lbl_beneficiary.beneAcctNmbr"
		}).html(" "+ receiverDetails.beneAcctNmbr).appendTo(beneDiv);
	
		$("<br>").appendTo(beneDiv);
		$("<label>").addClass("frmLabel").attr({
			"for" : "beneficiary.beneAccountType"
		}).html(getLabel('accountType', 'Account Type : ')).appendTo(beneDiv);
		$("<span>").addClass("rounded w20 inline_block disabled font_bold").attr({
			"id" : "lbl_beneResidentFlag"
		}).html(" " + receiverDetails.beneAccountType).appendTo(beneDiv);
	
		$("<br>").appendTo(beneDiv);
		$("<label>").addClass("frmLabel").attr({
			"for" : "beneficiary.beneAccountCcy"
		}).html(getLabel('accountCurrency', 'Account Currency : ')).appendTo(beneDiv);
		$("<label>").addClass("codeBox w20 rounded inline_block disabled").attr({
			"id" : "lbl_beneficiary.beneAccountCcy"
		}).html(" " + receiverDetails.beneAccountCcy).appendTo(beneDiv);
	
		$("<br>").appendTo(beneDiv);
		beneDiv.dialog( {autoOpen:true, height:'auto', width:800, title:getLabel('registerReceiverDetails', 'Registered Receiver Details'), modal:true});
	}
}