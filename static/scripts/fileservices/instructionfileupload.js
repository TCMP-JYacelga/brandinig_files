function uploadFile(strUrl)
{	
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function showList(strUrl)
{
	window.location = strUrl;
}