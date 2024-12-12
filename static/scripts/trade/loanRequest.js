jQuery.fn.clientCodeSeekAutoComplete= function(strUrl) {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/userseek/userclients.json",
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term,
										$top:-1
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {														
														label : item.DESCR,														
														bankDtl : item
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.bankDtl;
						if (data) {
							if (!isEmpty(data.DESCR))
							{
								$('#txtLCMyClientDesc').val(data.DESCR);
								$('#txtLCMyClientCode').val(data.CODE);
								goToPage(strUrl,'frmMain');
							}
						}
					},
					open : function() {
						$(this).removeClass("ui-corner-all")
								.addClass("ui-corner-top");
					},
					close : function() {
						$(this).removeClass("ui-corner-top")
								.addClass("ui-corner-all");
					}
				});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:200px;">'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

function getAccounts(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "newLoanRequestFromImportBill.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function setDirtyBit()
{
	document.getElementById("dirtyBit").value = "1";	
}
function getCurrency(frmId)
{
	var frm = document.getElementById(frmId);
	$('.disabled').removeAttr("disabled");
	var type = document.getElementById('type').value;
	if(type == 'IMPORT_LOAN')
	{
		frm.action = "newImportLoan.form";
	}
	else if(type == 'EXPORT_LOAN')
	{
		frm.action = "newExportLoan.form";
	}
	else if(type == 'EXPORT_BILL')
	{
		frm.action = "newLoanRequestFromExportBill.form";
	}
	else
	{
		frm.action = "newLoanRequestFromImportBill.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function goBackToBillView(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "lcBillDetails_view4.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function messagePopup() 
{
	$('#messagePopup').dialog( {
		autoOpen : true,
		height : 150,
		width : 350,
		modal : true,
		buttons : {
				"OK" : function() {
					$(this).dialog('close');
				}
		}
	});
	$('#messagePopup').dialog('open');
}
function changeOFRate(ctrl)
{
	if(null == ctrl)
		return;
	if(ctrl.value == "CONTRACT_RATE")
	{
		$('#contractLabel').attr('class','frmLabel required');
		$("#contractRef").removeAttr("disabled");
		calDebitAmount();
	}
	else
	{
		$('#contractLabel').attr('class','frmLabel');
		$("#contractRef").attr("disabled","disabled");
		
		var rate = document.getElementById('cardRate').value;
		if(null != rate && null != document.getElementById('debitAmount'))
		{
			var debitAmount = (document.getElementById('loanAmount').value) * rate;
			document.getElementById('debitAmount').value = debitAmount;
		}
	}
}
function addLoanRequestData(frmId)
{
	var frm = document.getElementById(frmId);
	$('.disabled').removeAttr("disabled");	
	frm.action = "saveImportBillLoanRequest.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function goToBack(strUrl, frmId)
{
	if($('#dirtyBit').val()=="1")
	{	
		getConfirmationPopup(frmId, strUrl);
	}	
	else
    {
		var frm = document.getElementById(frmId);
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();	
    }		
}
function addExportLoanReqData(frmId)
{
	var frm = document.getElementById(frmId);
	$('.disabled').removeAttr("disabled");
	frm.action = "saveExportBillLoanRequest.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function addExpLoanReqData(frmId)
{
	var frm = document.getElementById(frmId);
	$('.disabled').removeAttr("disabled");
	frm.action = "saveExportLoan.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function addImpLoanReqData(frmId)
{
	var frm = document.getElementById(frmId);
	$('.disabled').removeAttr("disabled");
	frm.action = "saveImportLoan.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function addAndSubmitExpLoan(frmId)
{
	var frm = document.getElementById(frmId);
	$('.disabled').removeAttr("disabled");
	frm.action = "submitOnAddExportLoan.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function addAndSubmitImpLoan(frmId)
{
	var frm = document.getElementById(frmId);
	$('.disabled').removeAttr("disabled");
	frm.action = "submitOnAddImportLoan.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function updateExpLoan(frmId)
{
	var frm = document.getElementById(frmId);
	$('.disabled').removeAttr("disabled");
	frm.action = "updateExportLoan.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function updateImpLoan(frmId)
{
	var frm = document.getElementById(frmId);
	$('.disabled').removeAttr("disabled");
	frm.action = "updateImportLoan.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function updateAndSubmitExpLoan(frmId)
{
	var frm = document.getElementById(frmId);
	$('.disabled').removeAttr("disabled");
	frm.action = "submitOnUpdateExportLoan.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function updateAndSubmitImpLoan(frmId)
{
	var frm = document.getElementById(frmId);
	$('.disabled').removeAttr("disabled");
	frm.action = "submitOnUpdateImportLoan.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function verifyLC(strUrl, frmId)
{
	var frm = document.getElementById(frmId);
	$('.disabled').removeAttr("disabled");
	if($('#lcInternalRef').length)
	{	
		$('#lcInternalRef').attr("disabled",true);
	}	
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function selectLC(strUrl, frmId)
{
	var frm = document.getElementById(frmId);
	$('.disabled').removeAttr("disabled");
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function verifyBill(strUrl, frmId)
{
	var frm = document.getElementById(frmId);
	$('.disabled').removeAttr("disabled");
	if($('#billInternalRef').length)
	{	
		$('#billInternalRef').attr("disabled",true);
	}
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function selectBill(strUrl, frmId)
{
	var frm = document.getElementById(frmId);
	$('.disabled').removeAttr("disabled");
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function verifyImportBill(strUrl, frmId)
{
	var frm = document.getElementById(frmId);
	$('.disabled').removeAttr("disabled");
	if($('#billInternalRef').length)
	{	
		$('#billInternalRef').attr("disabled",true);
	}
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function selectImportBill(strUrl, frmId)
{
	var frm = document.getElementById(frmId);
	$('.disabled').removeAttr("disabled");
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function calDebitAmount()
{
	var rate = document.getElementById('contractRef').value;
	var debitAmount = (document.getElementById('loanAmount').value) * rate;
	if (null != document.getElementById('debitAmount'))
	{	
		document.getElementById('debitAmount').value = debitAmount;
	}	
}
function changeDebitAmount(billCurrency,lcCurrency,debitCurrency)
{
	var loanCurrency;
	
	if(null != billCurrency && '' != billCurrency)
	{
		loanCurrency = billCurrency;
	}
	else if (null != lcCurrency && '' != lcCurrency)
	{
		loanCurrency = lcCurrency;
	}
	else
	{
		loanCurrency = document.getElementById('currency').value;
	}
	
	if (loanCurrency == debitCurrency)
	{
		var debitAmount = document.getElementById('loanAmount').value;
		if (null != document.getElementById('debitAmount'))
		{	
			document.getElementById('debitAmount').value = debitAmount;
		}	
	}
	else
	{
		var rateType = document.getElementById('rateType').value;
		if(rateType == "CONTRACT_RATE")
		{
			calDebitAmount();
		}
		else
		{
			var rate = document.getElementById('cardRate').value;
			if(null != rate)
			{
			var debitAmount = (document.getElementById('loanAmount').value) * rate;
			if (null != document.getElementById('debitAmount'))
			{	
				document.getElementById('debitAmount').value = debitAmount;
			}	
			}
		}
	}
}
function getConfirmationPopup(frmId, strUrl)
{
	$('#confirmPopup').dialog( {
		autoOpen : false,
		height : 200,
		width : 420,
		modal : true,
		buttons : {
				"Yes" : function() {
					var frm = document.getElementById(frmId);
					frm.action = strUrl;
					frm.target = "";
					frm.method = "POST";
					frm.submit();
					},
				"No" : function() {
					$(this).dialog("close");
					}
		}
	});
	$('#confirmPopup').dialog("open");
}
function goToPage(strUrl, frmId)
{
	var frm = document.getElementById(frmId);
	$('.disabled').removeAttr("disabled");
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

jQuery.fn.ForceAlphaNumericAndPercentOnly = function() {
	return this
			.each(function(){
				$(this)
						.keypress(function(e) 
						{
							// allows only alphabets & numbers, backspace, tab
							var keycode = e.which || e.keyCode;						
							if ((keycode >= 48 && keycode <= 57) || (keycode >= 65 && keycode <= 90) || (keycode >= 97 && keycode <= 122)
									|| keycode == 8 || keycode == 9 || keycode == 37)
								return true;

							return false;
						})
			})
};