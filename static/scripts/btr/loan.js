function getLoanRepaymentPopup(strUrl, frmId) {
	var buttonsOpts = {};
	buttonsOpts[btnsArray['submitBtn']] = function() {
		$(this).dialog("close");
		start_blocking(blockMsgText,this );
		goToPage(strUrl, frmId);
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		resetForm(frmId);		
		$('#debitAmtCurr').val('');		
		$('#reference').val('');
		$('#loanRepaymentDate').val('');
		$("#rateType").attr("disabled","disabled");	
		$('#rateTypeLab').removeClass('required');		
		document.getElementById('fullCheck').checked =true;
		document.getElementById('partialCheck').checked =false;
		$('#paymentamount').val(loanAmount);				
		$("#paymentDebitAccount").get(0).options.length = 1;		
		$(this).dialog("close");
	};
	$('#loanRepaymentPopup').dialog({
				autoOpen : false,
				height : 320,
				width : 520,
				modal : true,
				buttons : buttonsOpts
			});
	$('#loanRepaymentPopup').dialog("open");
}

function getLoanDrawPopup(strUrl, frmId) {
	var buttonsOpts = {};
	buttonsOpts[btnsArray['submitBtn']] = function() {
		$(this).dialog("close");
		start_blocking(blockMsgText,this );
		goToPage(strUrl, frmId);
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {		
		$('#loanDrawForm').val('');
		$('#drawLoanDate').val('');	
		$('#drawBeneCode').val('');	
		$('#drawProduct').val('');	
		$('#drawRateType').val('');	
		$('#drawReference').val('');		
		$("#drawRateType").attr("disabled","disabled");	
		$('#drawRateTypeLab').removeClass('required');
		$('#drawPaymentAmount').val('');
		$('#drawAmtCurr').val(loanAmountCurrency);
		$('#drawCurrencyCode').val(loanAmountCurrency);
		$(this).dialog("close");
	};
	$('#loanDrawPopup').dialog({
				autoOpen : false,
				height : 300,
				width : 520,
				modal : true,
				buttons : buttonsOpts				
			});
	$('#loanDrawPopup').dialog("open");
}

function handleEnableDisablePaymentRateType(){
	var combo = document.getElementById('rateType');	
		if($('#paymentAmtCurr').val() != $('#debitAmtCurr').val()){
			$("#rateType").removeAttr("disabled");
			$('#rateTypeLab').addClass('required');
				
		} else {
			$("#rateType").attr("disabled","disabled");
			$('#rateTypeLab').removeClass('required');
			combo.selectedIndex = 0;			
		}
}

jQuery.fn.dateTextBox = function() {
	return this
			.each(function() {
				$(this)
						.keydown(function(e) {
							var key = e.charCode || e.keyCode || 0;
							// allow backspace, tab, delete, arrows, numbers and
							// keypad for TAB
							return (key == 9 || key==8 || key==46);
							})
			})
};

function handleEnableDisableDrawRateType(){
	var combo = document.getElementById('drawRateType');	
		if($('#drawCurrencyCode').val() != $('#drawAmtCurr').val()){
			$("#drawRateType").removeAttr("disabled");
			$('#drawRateTypeLab').addClass('required');
				
		} else {
			$("#drawRateType").attr("disabled","disabled");
			$('#drawRateTypeLab').removeClass('required');
			combo.selectedIndex = 0;
		}
}

function resetForm(frmId){
	$("#"+frmId).find(':input').each(function() {
        switch(this.type) {
            case 'password':
            case 'select-multiple':
            case 'select-one':            
            case 'textarea':
                $(this).val('');
                break;
            case 'checkbox':            
                this.checked = false;
        }
    });	
}
function goToPage(strUrl, frmId) {
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function changeLoanAmount(checkbox){

	if(document.getElementById('fullCheck').checked  == true){
		$('#paymentamount').val(loanAmount);	
	}
	else if(document.getElementById('partialCheck').checked  == true) {
		$('#paymentamount').val('');		
	}	
}

function enableDisableLoanRepaymentLink(url)
{	
	if (String(isLoanAccount) == 'true' && CAN_EDIT =='true')
	{
		$('#btnLoanPayment').unbind('click');
		ToggleAttribute("btnLoanPayment", true, "href");
		$('#btnLoanPayment').click(function()
		{
			getLoanRepaymentPopup(url, 'loanRepaymentForm');
		});		
	}
	else
	{
		ToggleAttribute("btnLoanPayment", false, "href");
		$('#btnLoanPayment').removeAttr('onclick').click(function()
		{});
		$('#btnLoanPayment').unbind('click');
	}	
}

function enableDisableDrawLink(url)
{	
	if (String(isLoanAccount) == 'true' && CAN_EDIT =='true')
	{
		$('#btnLoanDraw').unbind('click');
		ToggleAttribute("btnLoanDraw", true, "href");
		$('#btnLoanDraw').click(function()
		{
			getLoanDrawPopup(url, 'loanDrawForm');
		});
	}
	else
	{
		ToggleAttribute("btnLoanDraw", false, "href");
		$('#btnLoanDraw').removeAttr('onclick').click(function()
		{});
		$('#btnLoanDraw').unbind('click');
	}	
}

function ToggleAttribute(obj, DoEnable, TagName) 
{
    
	obj = document.getElementById(obj);
	if (DoEnable) 
	{
		var TagValue = obj.getAttribute("back_" + TagName);
		if (TagValue != null) 
		{
			obj.setAttribute(TagName, TagValue);
			obj.removeAttribute("back_" + TagName);
		}
		var cssClass = obj.getAttribute("class");
		cssClass = cssClass.replace(" grey ", " black ");
		obj.setAttribute("class", cssClass);
	}
	else 
	{
		var TagValue = obj.getAttribute(TagName);
		if (TagValue != null)
		{
			obj.setAttribute("back_" + TagName, TagValue);
		}
		obj.removeAttribute(TagName);
		var cssClass = obj.getAttribute("class");
		cssClass = cssClass.replace(" black ", " grey ");
		obj.setAttribute("class", cssClass);
	}
}