function getAccounts(frmId)
{
	var frm = document.getElementById(frmId);
	var type = document.getElementById('type').value;
	if(type == 'IMPORT_LOAN')
	{
		frm.action = "importLoanRepayment.form";
	}
	else if(type == 'EXPORT_LOAN')
	{
		frm.action = "exportLoanRepayment.form";
	}
	else if(type == 'EXPORT_BILL')
	{
		frm.action = "exportBillLoanRepayment.form";
	}
	else
	{
		frm.action = "importBillLoanRepayment.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
	
}
function getCurrency(frmId)
{
	var frm = document.getElementById(frmId);
	var type = document.getElementById('type').value;
	if(type == 'IMPORT_LOAN')
	{
		frm.action = "importLoanRepayment.form";
	}
	else if(type == 'EXPORT_LOAN')
	{
		frm.action = "exportLoanRepayment.form";
	}
	else if(type == 'EXPORT_BILL')
	{
		frm.action = "exportBillLoanRepayment.form";
	}
	else
	{
		frm.action = "importBillLoanRepayment.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
	
}
function calDebitAmount()
{
	var rate = document.getElementById('contractRef').value;
	var debitAmount = (document.getElementById('repayAmount').value) * rate;
	document.getElementById('debitAmount').value = debitAmount;
}
function changeDebitAmount(loanCurrency,debitCurrency)
{
	if (loanCurrency == debitCurrency)
	{
		var amount = document.getElementById('repayAmount').value;
		document.getElementById('debitAmount').value = amount;
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
			var debitAmount = (document.getElementById('repayAmount').value) * rate;
			document.getElementById('debitAmount').value = debitAmount;
			}
		}
	}
}
function goBackToLoanView(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "backToViewImportBillLoanFromRepayment.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function goBackToExportLoanView(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "backToViewExportBillLoanFromRepayment.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
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
		if(null != rate)
		{
		var debitAmount = (document.getElementById('repayAmount').value) * rate;
		document.getElementById('debitAmount').value = debitAmount;
		}
	}
}
function goToPage(strUrl, frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
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
