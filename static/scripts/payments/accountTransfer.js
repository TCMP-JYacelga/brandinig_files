	labelClass = "frmLabel popupLabel";
	labelClassRequired = "frmLabel popupLabel required";
	spanClass = "w20 inline_block";


	
	function generateAccountTransfer(json) 
	{
	    var varAccountXferFrm = $('#frmMain');
	    var errorDiv = $('<div id="errorDiv"/>').addClass('ui-section-header hidden ui-widget-header red greyback').hide(500).appendTo(varAccountXferFrm);
		$('<br>').appendTo(varAccountXferFrm);
		renderTextBox('Reference', 'reference', varAccountXferFrm);
		$('<br>').appendTo(varAccountXferFrm);
		$('<label>').html('Sending Account').addClass('frmLabel popupLabel required').appendTo(varAccountXferFrm);
	    renderSelectOption('Sending Account', 'sendingAccount', varAccountXferFrm, json.sendingAccount, null);
		$('<br>').appendTo(varAccountXferFrm);
	    $('#sendingAccount').change(function() {
			var selText = $('#sendingAccount :selected').text();
			var selVal = $('#sendingAccount :selected').val();
			$('#receivingAccount').find('option').remove();
			$('#receivingAccount').append($("<option>").attr('value','').text('Select '+'Receiving Account'));
			if(selVal != '')
			{
				$(json.receivingAccount).each(function() {
					var matchFlag = false;
					if(this.filterCode == selVal && this.filterValue == selText)				
					{
						matchFlag = true;
					}
					if(!matchFlag)
					{
						$('#receivingAccount').append($("<option>").attr('value',this.filterCode).text(this.filterValue));
					}
				});   
			}
		
		});
	    renderTextBox('Amount', 'amount', varAccountXferFrm);
		$('<br>').appendTo(varAccountXferFrm);
		$('<label>').html('Receiving Account').addClass('frmLabel popupLabel required').appendTo(varAccountXferFrm);
	    renderSelectOption('Receiving Account', 'receivingAccount', varAccountXferFrm, json.receivingAccount, null);
		$('<br>').appendTo(varAccountXferFrm);
		renderHiddenField('productType', varAccountXferFrm, json.productType);
		renderHiddenField('txnCcy', varAccountXferFrm, json.paymentCcy);
		renderHiddenField('bankProduct', varAccountXferFrm, json.bankProduct);
		renderHiddenField('renderJson', varAccountXferFrm, JSON.stringify(json));
		renderHiddenField('maxInst', varAccountXferFrm, json.maxInst);
	    var errorDiv = $('<div id="errorDiv"/>').addClass('ui-section-header hidden ui-widget-header red greyback').hide(500).appendTo(varAccountXferFrm);
		
	};
	                  
	function generateAccountTransfer1X(json) 
	{
	    var varAccountXferFrm = $('#frmMain');
	    var headerDiv = $('#headerDiv');
	    var errorDiv = $('<div id="errorDiv"/>').addClass('ui-section-header hidden ui-widget-header red greyback').hide(500).appendTo(varAccountXferFrm);
		$('<br>').appendTo(varAccountXferFrm);
	    renderBankProduct(json, varAccountXferFrm);
	    renderTextBox('Reference', 'reference', varAccountXferFrm , null, labelClassRequired, true);
	    renderSelectOption('Sending Account', 'sendingAccount', varAccountXferFrm, json.sendingAccount, labelClassRequired, true);
	    renderTextBox('Amount', 'amount', varAccountXferFrm , null, labelClassRequired, true);
//	    renderSelectOption('Receiving Account', 'receivingAccount', varAccountXferFrm, json.receivingAccount, null);
		var defaultRows = 3;
		if(json.maxInst < 3)
		{
			defaultRows = json.maxInst;
		}
	    renderTable(defaultRows, 2, varAccountXferFrm, json.receivingAccount);
		renderHiddenField('productType', varAccountXferFrm, json.productType);
		renderHiddenField('renderJson', varAccountXferFrm, JSON.stringify(json));
		renderHiddenField('txnCcy', varAccountXferFrm, json.paymentCcy);
		renderHiddenField('bankProduct', varAccountXferFrm, json.bankProduct);
		$('#btnAdd').click(function(){
			var tableRec = $('#instTable');
			var rowCount =  $('#instTable tr').length;
			var index = rowCount-1;
			if(rowCount <= json.maxInst)
			{
				var tRow  =  $('<tr>');
				var tData  = $('<td>');
				renderSelectOption('', 'receivingAcct['+index + ']', tData, json.receivingAccount, null, 'w20', 'frmLabel');
				tData.appendTo(tRow);
				tData  =$('<td>');
				renderTextBox('', 'receivingAmount['+ index + ']', tData, 'frmLabel');
				tData.appendTo(tRow);
				$('<br>').appendTo(tRow);
				tRow.appendTo(tableRec);		
			}
		});
		 //$("#receivingAccount option[value='"+ selected_val +"']").remove();
		renderHiddenField('maxInst', varAccountXferFrm, json.maxInst);
	    var errorDiv = $('<div id="errorDiv"/>').addClass('ui-section-header hidden ui-widget-header red greyback').hide(500).appendTo(varAccountXferFrm);
	};

	function generateAccountTransferX1(json) 
	{
	    var varAccountXferFrm = $('#frmMain');
	    var errorDiv = $('<div id="errorDiv"/>').addClass('ui-section-header hidden ui-widget-header red greyback').hide(500).appendTo(varAccountXferFrm);
		$('<br>').appendTo(varAccountXferFrm);
		var defaultRows = 3;
		if(json.maxInst < 3)
		{
			defaultRows = json.maxInst;
		}
	    renderTable(defaultRows, 2, varAccountXferFrm, json.receivingAccount);
	    renderBankProduct(json, varAccountXferFrm);
	    renderTextBox('Reference', 'reference', varAccountXferFrm , null, labelClassRequired, true);
	    renderSelectOption('Receiving Account', 'sendingAccount', varAccountXferFrm, json.sendingAccount, labelClassRequired, true);
	    renderTextBox('Amount', 'amount', varAccountXferFrm , null, labelClassRequired, true);
//	    renderSelectOption('Receiving Account', 'receivingAccount', varAccountXferFrm, json.receivingAccount, null);
		renderHiddenField('productType', varAccountXferFrm, json.productType);
		renderHiddenField('renderJson', varAccountXferFrm, JSON.stringify(json));
		renderHiddenField('txnCcy', varAccountXferFrm, json.paymentCcy);
		renderHiddenField('bankProduct', varAccountXferFrm, json.bankProduct);
		$('#btnAdd').click(function(){
			var tableRec = $('#instTable');
			var rowCount =  $('#instTable tr').length;
			var index = rowCount-1;
			if(rowCount <= json.maxInst)
			{
				var tRow  =  $('<tr>');
				var tData  = $('<td>');
				renderSelectOption('', 'receivingAcct['+index + ']', tData, json.receivingAccount, null, 'w20', 'frmLabel');
				tData.appendTo(tRow);
				tData  =$('<td>');
				renderTextBox('', 'receivingAmount['+ index + ']', tData, 'frmLabel');
				tData.appendTo(tRow);
				$('<br>').appendTo(tRow);
				tRow.appendTo(tableRec);		
			}
		});
		 //$("#receivingAccount option[value='"+ selected_val +"']").remove();
		renderHiddenField('maxInst', varAccountXferFrm, json.maxInst);
	};
	
	function renderBankProduct(json, varAccountXferFrm)
	{
		var label = $("<label>").attr({'for' : 'bankProduct'}).addClass(labelClass).html('Payment Product');
		//var labelSpan = $("<span>").addClass(lblClass).html(labelText).appendTo(label);
		var input = $('<input>').attr({ 'type': 'text', 'id': 'bankProduct',  'name': 'bankProduct', 'disabled' : 'disabled'}).addClass("textBox w10 rounded").val(json.bankProduct);
		label.appendTo(varAccountXferFrm);
	    input.appendTo(varAccountXferFrm);
	    $('<br>').appendTo(varAccountXferFrm);
		return false;
	}

	function renderTextBox(labelText, inputId, varAccountXferFrm, val, lblClass, isBr)
	{
		var fieldClass = labelClass;
		var labelId  = 'lbl_'+inputId;
	
		var label = $("<label>").attr({'for' : inputId}).addClass('frmLabel popupLabel required').html(labelText);
		//var labelSpan = $("<span>").addClass(lblClass).html(labelText).appendTo(label);
		var input = $('<input>').attr({ 'type': 'text', 'id': inputId,  'name': inputId}).addClass("textBox w20 rounded");
		label.appendTo(varAccountXferFrm);
	    input.appendTo(varAccountXferFrm);
	    if(isBr)
	    	$('<br>').appendTo(varAccountXferFrm);
		return false;
	}
	
	function renderHiddenField(inputId, varAccountXferFrm, val)
	{
	
		var input = $('<input>').attr({ 'type': 'hidden', 'id': inputId,  'name': inputId});
	    input.appendTo(varAccountXferFrm);
	    if(val)
	    {
	        input.val(val);
	    }
		return false;
	}
	
	function renderSelectOption(labelText, inputId, varAccountXferFrm, listVal, lblClass, isBr)
	{
		var fieldClass = labelClass;
		var labelId  = 'lbl_'+inputId;
		var label = $("<label>").attr({'for' : inputId, 'id' : labelId}).addClass(lblClass).html(labelText);
		//var labelSpan = $("<span>").addClass(spnClass).html(labelText).appendTo(label);
	    var input = $('<select>').attr({'id': inputId,  'name': inputId}).addClass("comboBox roundedCombo w20");
	    if(isBr)
	    	label.appendTo(varAccountXferFrm);
 	    input.appendTo(varAccountXferFrm);
		input.append($("<option>").attr('value','').text('Select '+labelText));
		$(listVal).each(function() {
			input.append($("<option>").attr('value',this.filterCode).text(this.filterValue));
		});   
	    if(isBr)
	    	$('<br>').appendTo(varAccountXferFrm);
	   	return false;
	}

	function renderTable(rows, cols, varAccountXferFrm, listVal)
	{
		$('<br>').appendTo(varAccountXferFrm);
	    var tableRec = $('<table id=instTable>');
	    tableRec.addClass('ui-tabs-panel ui-widget-content ui-corner-bottom currency');
	    tableRec.addClass('paymentTable');
		var tRow  = $('<tr>');
		var tData  =$('<td>');
		var labelBlank = $("<label>").addClass(labelClassRequired).html('');
		var labelAccount = $("<label>").addClass('w20').html('Account');
		var labelAmount = $("<label>").addClass('w20').html('Amount');
		labelBlank.appendTo(tData);
		labelAccount.appendTo(tData);
		tData.appendTo(tRow);
		tData  =$('<td>');
		labelBlank.appendTo(tData);
		labelAmount.appendTo(tData);
		tData.appendTo(tRow);
		$('<br>').appendTo(tRow);
		tRow.appendTo(tableRec);
		for(i=0; i< rows; i++)
		{
			tRow  = $('<tr>');
			tData  =$('<td>');
			renderSelectOption('', 'receivingAcct['+i + ']', tData, listVal, null, 'w20', 'frmLabel');
			tData.appendTo(tRow);
			tData  =$('<td>');
			renderTextBox('', 'receivingAmount['+i + ']', tData, 'frmLabel');
			tData.appendTo(tRow);
			$('<br>').appendTo(tRow);
			tRow.appendTo(tableRec);

		}
		

		
	    $('#sendingAccount').change(function() {
			var selText = $('#sendingAccount :selected').text();
			var selVal = $('#sendingAccount :selected').val();
			for(i=0; i< rows; i++)
			{
				$('#receivingAcct['+i + ']').find('option').remove();
				$('#receivingAcct['+i + ']').append($("<option>").attr('value','').text('Select'));
				if(selVal != '')
				{
					$(listVal).each(function() {
						var matchFlag = false;
						if(this.filterCode == selVal && this.filterValue == selText)				
						{
							matchFlag = true;
						}
						if(!matchFlag)
						{
							$('receivingAcct['+i + ']').append($("<option>").attr('value',this.filterCode).text(this.filterValue));
						}
					});   
				}
			}
		
		});

		for(i=0; i< rows; i++)
		{
		$('#receivingAmount\\['+i+'\\]').attr({'disabled' : 'true'});
		$('#receivingAcct['+i + ']').change(function(){
		if($('#receivingAcct['+i + ']').val() != '')
			{
				$('#receivingAmount\\['+i+'\\]').removeAttr('disabled');
			}
			else
			{
				$('#receivingAmount\\['+i+'\\]').attr({'disabled' : 'true'});
			}
		});
		}
		
		tableRec.appendTo(varAccountXferFrm);
		$('<br>').appendTo(varAccountXferFrm);
	   	return false;
	}
	/*function renderRadioButton(elementJson, quickPayDiv, rowOrCol)
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
		debit.html('Debit');
		debit.appendTo(label);
	   var  inputcr = $('<input>').attr({ 'type': 'radio', 'id': elementJson.fieldName,  'name': elementJson.fieldName, 'value' : 'C'}).addClass("popupRadioBox").appendTo(label);
	    var credit = $('<span />');
		credit.html('Credit');
		credit.appendTo(label);
		label.appendTo(rowOrCol);
		rowOrCol.appendTo(quickPayDiv);
	    if(elementJson.value !== null)
	    {
	        input.val(elementJson.value);
	    }
		return false;
	}*/
	
	function submitPayment(mode)
	{
	    var frm = document.getElementById('frmMain');
	    var headerDiv = $('#headerDiv');
	    var varAccountXferFrm = $('#frmMain');
		var accountTxnBean = new Object();
		$("#"+csrfTokenName).appendTo(varAccountXferFrm);
		item = {};
		item.reference = $('#reference').val();
		item.sendingAccount = $('#sendingAccount').val();
		item.amount = $('#amount').val();
		item.receivingAccount = $('#receivingAccount').val();
		item.productType = $('#productType').val();
		item.layout = $('#renderJson').val();
		var maxInst = $('#maxInst').val();
		item.receivingAcct = [];
		item.receivingAmount = [];
		for (i = 0; i< maxInst; i++)
		{
			item.receivingAcct[i] = $('#receivingAcct\\['+i + '\\]').val();
			item.receivingAmount[i] = $('#receivingAmount\\['+i + '\\]').val();
		}
		var url = "services/accounttransfer/one2one.json";
		if(mode == '1X')
			url = "services/accounttransfer/one2many.json";
		else if(mode == 'X1')
		url = "services/accounttransfer/many2one.json";
		$.blockUI({message: '<h2><img src="static/images/backgrounds/busy.gif" class="middleAlign"/>&nbsp;Processing your request...</h2>',
			css:{ height:'32px',padding:'8px 0 0 0'}});
		$.ajax({
				url: url,
				type: 'POST',
				contentType: "application/json",
				data: JSON.stringify(item),
				complete: function(XMLHttpRequest, textStatus) {
					$.unblockUI();
					if ("error" == textStatus)
						alert("Unable to complete your request!");
				},
				success: function( data ) {
					if(data.lstErrors)
					{
						showErrors(data.lstErrors, varAccountXferFrm);
					}
					else
					{
						var errorDiv = $('#errorDiv');
						errorDiv.hide();
						$('#headerDiv').html('Payment Reference: '+ data.phdNumber + ' | Unique Reference : ' + data.uniqNumber);
						$('#headerDiv').show();
					}
				}
			});

	}
	
	function updatePayment()
	{
	var frm = document.forms["frmMain"]; 
		$("#"+csrfTokenName).appendTo(frm);
		frm.action = 'one2manyupdate.form';
		frm.method = 'POST';
		frm.target = "";
		frm.submit();
	}
	
	function goBack()
	{
	var frm = document.forms["frmMain"]; 
		$("#"+csrfTokenName).appendTo(frm);
		$('#amount').val('');
		frm.action = 'showPaymentsListBatch.form';
		frm.method = 'POST';
		frm.target = "";
		frm.submit();
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
