
function showSysDownloadParam(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("current_index").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function showSysDownloadPregenerated(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("current_index").value = index;
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}
