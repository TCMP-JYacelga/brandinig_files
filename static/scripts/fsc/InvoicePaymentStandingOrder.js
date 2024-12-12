function setDirtyBit()
{
document.getElementById("dirtyBit").value = "1";	
}
function getProWorkflw(scmProduct,strUrl,frmId)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtScmProduct").value = scmProduct;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function goToBack(frmId, strUrl)
{
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}