function showBackPage(strAction, blnIsMultiSet)
{
	var strUrl;
	var frm = document.forms["frmMain"];
	
	frm.target ="";
	if (blnIsMultiSet)
	{
		if ("AUTHVIEWENRICHMENT" == strAction)
			strUrl = "";
		else if ("HVIEWENRICHMENT" == strAction)
			strUrl = "depositEnrichmentHViewList.form";
		else if ("CVIEWENRICHMENT" == strAction)
			strUrl = "depositEnrichmentCommonViewList.form";
		else if ("CEDITENRICHMENT" == strAction || "CSAVEMULTISET" == strAction || "CUPDATEMULTISET" == strAction)
			strUrl = "depositEnrichmentCommonEditList.form";
		else if ("VIEWENRICHMENT" == strAction)
			strUrl = "depositEnrichmentViewList.form";
		else
			strUrl = "depositEnrichmentEditList.form";
	}
	else
	{
		if ("AUTHVIEWENRICHMENT" == strAction)
			strUrl = "";
		else if ("HVIEWENRICHMENT" == strAction)
			strUrl = "headerViewDepositDetail.form";
		else if ("CVIEWENRICHMENT" == strAction)
			strUrl = "commonInstViewDepositDetail.form";
		else if ("CEDITENRICHMENT" == strAction || "CSAVEENRICHMENT" == strAction || "CUPDATEENRICHMENT" == strAction)
			strUrl = "commonInstEditDepositDetail.form";
		else if ("VIEWENRICHMENT" == strAction)
			strUrl = "viewDepositDetail.form";
		else if ("CADDENRICHMENT" == strAction)
			strUrl = "commonInstEditDepositDetail.form";
		else
			strUrl = "editDepositDetail.form";
	}

	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}

function setFormAction(strAction, blnIsMultiSet)
{
	var frm = document.forms["frmMain"]; 
	
	frm.target ="";
	if (blnIsMultiSet)
	{
		if (strAction == "ADDENRICHMENT" || strAction == "SAVEMULTISET")
			frm.action = "saveDepositMultiEnrich.form";
		else if (strAction == "CADDENRICHMENT" || strAction == "CSAVEMULTISET")
			frm.action = "cSaveDepositMultiEnrich.form";
		else if (strAction == "CEDITENRICHMENT" || strAction == "CUPDATEMULTISET")
			frm.action = "cUpdateDepositMultiEnrich.form";
		else
			frm.action = "updateDepositMultiEnrich.form";
	}
	else
	{
		if (strAction == "ADDENRICHMENT" || strAction == "SAVEENRICHMENT")
			frm.action = "saveDepositEnrichment.form";
		else if (strAction == "CADDENRICHMENT" || strAction == "CSAVEENRICHMENT")
			frm.action = "cSaveDepositEnrichment.form";
		else if (strAction == "CEDITENRICHMENT" || strAction == "CUPDATEENRICHMENT")
			frm.action = "cUpdateDepositEnrichment.form";
		else
			frm.action = "updateDepositEnrichment.form";
	}

	frm.method = 'POST';
	frm.submit();
}

function deleteEnrichment(strAction)
{
	var frm = document.forms["frmMain"]; 
	
	frm.target ="";
	if (strAction == "CEDITENRICHMENT")
		frm.action = "cDeleteDepositEnrichment.form";
	else
		frm.action = "deleteDepositEnrichment.form";

	frm.method = 'POST';
	frm.submit();
}
