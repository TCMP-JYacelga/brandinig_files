function showList(strUrl)
{
	window.location = strUrl;
}
function save(arrData)
{
	var frm = document.forms["frmMain"];
	frm.txtIndex.value = arrData[1];
	frm.action = arrData[0];
	frm.method = "POST";
	frm.target = "";	
	frm.submit();
}
