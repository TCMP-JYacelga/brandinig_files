function showAddNewForm(strAction)
{
	var strUrl;
	var frm = document.forms["frmFilter"];
	
	if ("CEDITENRICHMENTLIST" == strAction)
		strUrl = "cAddDepositEnrichment.form";
	else
		strUrl = "addDepositEnrichment.form";
	
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function showBackPage(strAction)
{
	var strUrl;
	var frm = document.forms["frmFilter"];
	
	frm.target ="";
	if ("VIEWENRICHMENTLIST" == strAction)
		strUrl = "viewDepositDetail.form";
	else if ("HVIEWENRICHMENTLIST" == strAction)
		strUrl = "headerViewDepositDetail.form";
	else if ("CVIEWENRICHMENTLIST" == strAction || "CVIEWENRICHMENT" == strAction )
		strUrl = "commonInstViewDepositDetail.form";
	else if ("CEDITENRICHMENTLIST" == strAction || "CEDITENRICHMENT" == strAction)
		strUrl = "commonInstEditDepositDetail.form";
	else
		strUrl = "editDepositDetail.form";

	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
	return true;
}

function showViewForm(strAction, index)
{
	var strUrl;
	var frm = document.forms["frmFilter"]; 
	
	frm.target ="";
	if ("CVIEW_DETAIL" == strAction)
		strUrl = "commonViewDepositEnrichment.form";
	else
		strUrl = "viewDepositEnrichment.form";
	
	document.getElementById("current_index").value = index
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function showEditForm(strAction, index)
{
	var strUrl;
	var frm = document.forms["frmFilter"]; 
	
	frm.target ="";
	if ("CEDITENRICHMENTLIST" == strAction)
		strUrl = "cEditDepositEnrichment.form";
	else
		strUrl = "editDepositEnrichment.form";
	
	document.getElementById("current_index").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function deleteRecord(strAction, ctrl, index)
{
	var strUrl;
	var frm = document.forms["frmFilter"];
	
	if ("CEDITENRICHMENTLIST" == strAction)
		strUrl = "cDeleteDepositMultiEnrich.form";
	else
		strUrl = "deleteDepositMultiEnrich.form";
	
	ctrl.className = "linkbox discardedlink";
	document.getElementById("current_index").value = index;
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}