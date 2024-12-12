function getInvPurchasePopup(strUrl, frmId) 
{
	var buttonsOpts = {};
	buttonsOpts[btnsArray['submitBtn']] = function() {
		$(this).dialog("close");
		start_blocking(blockMsgText,this );
		goToPage(strUrl, frmId);
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		resetForm(frmId);
		$("#paymentDebitAccount").get(0).options.length = 1;
		$("#rateType").attr("disabled","disabled");	
		$('#purRateTypeLab').removeClass('required');		
		$(this).dialog("close");
	};
	$('#investmentPurchasePopup').dialog({
				autoOpen : false,
				height : 300,
				width : 630,
				modal : true,
				buttons : buttonsOpts
			});
	$('#investmentPurchasePopup').dialog("open");
}

function getInvRedeemPopup(strUrl, frmId) 
{
	var buttonsOpts = {};
	buttonsOpts[btnsArray['submitBtn']] = function() {
		$(this).dialog("close");
		start_blocking(blockMsgText,this );
		goToPage(strUrl, frmId);
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		resetForm(frmId);
		$("#paymentCreditAccount").get(0).options.length = 1;
		$("#redeemRateType").attr("disabled","disabled");	
		$('#rateTypeLab').removeClass('required');
		$(this).dialog("close");
	};
	$('#investmentRedemptionPopup').dialog({
				autoOpen : false,
				height : 360,
				width : 630,
				modal : true,
				buttons : buttonsOpts
			});
	$('#investmentRedemptionPopup').dialog("open");
}

function handleEnableDisablePaymentRateType(){
	var combo = document.getElementById('rateType');
		if('' == $('#debitAmtCurr').val()){		
			$("#rateType").attr("disabled","disabled");
			$('#purRateTypeLab').removeClass('required');
			combo.selectedIndex = 0;			
		} else if(document.getElementById("paymentAmtCurr").value != document.getElementById("debitAmtCurr").value){
			$("#rateType").removeAttr("disabled");
			$('#purRateTypeLab').addClass('required');
				
		} else {
			$("#rateType").attr("disabled","disabled");
			$('#purRateTypeLab').removeClass('required');
			combo.selectedIndex = 0;			
		}
}

function handleEnableDisableRedeemRateType(){
	var combo = document.getElementById('redeemRateType');	
		if('' == $('#creditAmtCurr').val()){		
			$("#redeemRateType").attr("disabled","disabled");
			$('#rateTypeLab').removeClass('required');
			combo.selectedIndex = 0;
		} else if(document.getElementById("paymentAmtCurr").value != document.getElementById("creditAmtCurr").value){
			$("#redeemRateType").removeAttr("disabled");
			$('#rateTypeLab').addClass('required');
				
		} else {
			$("#redeemRateType").attr("disabled","disabled");
			$('#rateTypeLab').removeClass('required');
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
			case 'textarea':
			case 'text':    
                $(this).val('');
                break;
            case 'checkbox':            
                this.checked = false;
        }
    });		
}
function goToPage(strUrl, frmId) {
	var frm = document.getElementById(frmId);
	$('.disabled').removeAttr("disabled");
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showEnrichments(frmName, intRec, accountNumber, summaryDate, accountCurrency, txnAmount, drCrFlag, accountId, sessionNumber, sequenceNmbr) {

	var d = $.datepicker.parseDate("yy-mm-dd",  summaryDate);
	var datestrInNewFormat = $.datepicker.formatDate(localeDatePickerFormat, d);


	$('#btrAccNumber').val(accountNumber);
	$('#accountDateId').val(datestrInNewFormat);
	$('#accountAmount').val(txnAmount);
	$('#accountType').val(drCrFlag);
	$('.currencyLabel').text(accountCurrency);
	
	
	$('#btrAccNumber').attr("disabled","disabled");
	$('#accountDateId').attr("disabled","disabled");
	$('#accountAmount').attr("disabled","disabled");
	$('#accountType').attr("disabled","disabled");
	$('.currencyLabel').attr("disabled","disabled");
		
	$('#accountId').val(accountId);
	$('#sessionNumber').val(sessionNumber);
	$('#sequenceNmbr').val(sequenceNmbr);
	
	var dlg = $('#divEnrichments').clone();
		
	document.getElementById('txtIndex').value = intRec;
	dlg.attr('id', 'dlgDiv');	
	
	paintEnrichments(dlg, intRec);
	dlg.dialog({autoOpen:false, height:"auto", modal:true, width:410,
				buttons: {"Cancel": function() {$(this).dialog("destroy");}, 
							"Ok": function() {var _values={};$(":input", $(this)).each(function(){_values[this.name]=$(this).val();});
												$(this).dialog("destroy");closeAndSubmit(frmName, _values);}}});
	dlg.dialog('open');
}

function closeAndSubmit(frmName, arrValues) {

	for (key in arrValues) {		
		$('#divEnrichments').children('#' + key).val(arrValues[key]);		
	}
	var frm = document.getElementById('enrichmentForm');
	frm.action = 'saveEnrichment_btrInvActivity.form';
	frm.target = "";
	frm.method = "POST";
	frm.submit();
	
}
 
function paintEnrichments(dlg, intRec) {
	var data,strId,childs;	
	data = enrich_data[intRec-1];	
	for (key in data) {			
		strId = "#enrichment" + key.substr(1);		
		dlg.children(strId).val(data[key]);
	}
}