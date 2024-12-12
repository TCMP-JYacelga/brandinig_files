function showBackPage(strAction)
{
	var strUrl;
	var frm = document.forms["frmMain"];
	
	frm.target ="";
	if ("AUTHVIEWDENOMINATION" == strAction)
		strUrl = "";
	else if ("HVIEWDENOMINATION" == strAction)
		strUrl = "headerViewDepositDetail.form";
	else if ("CVIEWDENOMINATION" == strAction)
		strUrl = "commonInstViewDepositDetail.form";
	else if ("CEDITDENOMINATION" == strAction || "CSAVEDENOMINATION"  == strAction
			|| "CUPDATEDENOMINATION"  == strAction)
		strUrl = "commonInstEditDepositDetail.form";
	else if ("VIEWDENOMINATION" == strAction)
		strUrl = "viewDepositDetail.form";
	else
		strUrl = "editDepositDetail.form";

	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}

function setFormAction(strAction)
{
	var strUrl;
	var frm = document.forms["frmMain"]; 
	
	frm.target ="";
	if (strAction == "ADDDENOMINATION" || strAction == "SAVEDENOMINATION")
		frm.action = "saveDepositDenomination.form";
	else if (strAction == "CADDDENOMINATION" || strAction == "CSAVEDENOMINATION")
		frm.action = "cSaveDepositDenomination.form";
	else if (strAction == "CEDITDENOMINATION" || strAction == "CUPDATEDENOMINATION")
		frm.action = "cUpdateDepositDenomination.form";
	else
		frm.action = "updateDepositDenomination.form";

	frm.method = 'POST';
	frm.submit();
}

function calculate(denomValue, count, index)
{
	var grandTotal;
	var finalGrandTotal;
	var oldDenomValue;
	var oldCount;
	var totalAmount;
	var totalOldAmount;
	var typeAmount;
	var typeGrandTotal;
	var temp;

	if (isEmpty(count.value))
		count.value = 0;
	if (isEmpty(denomValue))
		denomValue = 0;

	oldDenomValue = document.getElementById("oldDenomValue_"+index).value;
	oldCount = document.getElementById("oldCount_"+index).value;
	totalAmount =  parseFloat(denomValue) * parseFloat(count.value);
	totalOldAmount =  parseFloat(oldDenomValue) * parseFloat(oldCount);
	typeAmount = document.getElementById("amount_"+index).type;
	typeGrandTotal = document.getElementById("grandtotal").type;
	
	//format to 2 decimal digits
	if (totalAmount.toFixed)
		totalAmount = totalAmount.toFixed(2);

	if (typeAmount == 'text')
	{
		document.getElementById("amount_" + index).value =  totalAmount;
	}
	else
	{
		document.getElementById("amount_" + index).innerHTML = totalAmount;
	}

	if (typeGrandTotal == 'text')
	{
		grandTotal = document.getElementById("grandtotal").value;
		if('' == grandTotal || null == grandTotal)
			grandTotal = 0;
		temp = parseFloat(totalAmount) + parseFloat(grand_total);
		grand_total = temp;
		if (temp.toFixed)
			temp = temp.toFixed(2);
		document.getElementById("grandtotal").value =  temp;
	}
	else
	{
		grandTotal = document.getElementById("grandtotal").innerHTML;
		if( '' == grandTotal || null == grandTotal)
		{
			grandTotal = 0;
			temp = parseFloat(totalAmount);
			grand_total = temp;
			if (temp.toFixed)
				temp = temp.toFixed(2);
			document.getElementById("grandtotal").innerHTML = temp;
		}
		else 
		{
			if( null == oldDenomValue || '' == oldDenomValue || 0 == oldDenomValue )
			{
				temp = parseFloat(totalAmount) + parseFloat(grand_total);
				grand_total = temp;
				if (temp.toFixed)
					temp = temp.toFixed(2);
				document.getElementById("grandtotal").innerHTML = temp;
				document.getElementById("grandtotal").value = temp;
			}
			if(denomValue == oldDenomValue) 
			{	
				finalGrandTotal = parseFloat(grand_total) - parseFloat(totalOldAmount) + parseFloat(totalAmount);
				
				temp = parseFloat(finalGrandTotal);
				grand_total = temp;
				if (temp.toFixed)
					temp = temp.toFixed(2);
				document.getElementById("grandtotal").innerHTML = temp;
				document.getElementById("grandtotal").value = temp;
			}
		}
	}
	temp = denomValue;
	if (temp.toFixed)
		temp = temp.toFixed(2);
	document.getElementById("oldDenomValue_"+index).value = temp;
	document.getElementById("oldCount_"+index).value = count.value;
}