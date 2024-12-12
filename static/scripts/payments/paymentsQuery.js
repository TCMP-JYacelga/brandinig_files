function showHistoryForm(strUrl, index)
{	
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 400)/2;
	var strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=550,height=350";

	var frm = document.forms["frmMain"];
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "hWinHistory";
	frm.method = "POST";

	window.open ("", "hWinHistory", strAttr);
	frm.submit();
}
function filter(strUrl)
{
	var frm = document.forms["frmMain"];
	document.getElementById("viewState").value = "";
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function showViewForm(strUrl,index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function showViewDetailForm(strUrl,index)
{

	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	//if(strTxnType=='BPIQ')
	//	strUrl="viewInstrumentQryDetail.form";
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function showList(strUrl)
{
	var frm = document.forms["frmMain"];
	if(strTxnType=='BPIQ')
	{
		if (frmName=='INSTRLIST')
			strUrl='backInstQueryFilter.form';
		else
			strUrl='instrQueryInstructionList.form';
	}
	frm.action = strUrl;
	frm.target ="";
	frm.method = "POST";
	frm.submit();

}
