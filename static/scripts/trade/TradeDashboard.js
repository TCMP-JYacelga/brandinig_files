function getProductInfo(strUrl, frmId, crt)
{
	document.getElementById("txtLCMyProduct").value = crt.value;
	document.getElementById("txtRecordIndex").value = crt.selectedIndex;
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}