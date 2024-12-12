function getProductInfo(strUrl, frmId, crt)
{
	document.getElementById("txtscmMyProduct").value = crt.value;
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}