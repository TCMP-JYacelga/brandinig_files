function showList(strUrl)
{
	window.location = strUrl;
}

function downloadFile(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("current_index").value = index;
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}

function filterList(strUrl)
{
	document.getElementById("txtCurrent").value = '';
	document.getElementById("current_index").value = 0;
	var frm = document.forms["frmMain"]; 
	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}
