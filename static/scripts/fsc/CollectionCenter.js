function showPopup()
{
$('#popup').dialog({
	autoOpen : false,
	height : 180,
	width : 473,
	modal : true,
	buttons : {
			"OK" : function() 
			{
			  gotoBack("invoiceCenter.form","frmMain");
			}
		
	}
   });
$('#popup').dialog("open");
}
function saveCollection(strUrl, frmId)
{
	var frm = document.getElementById(frmId);
	document.getElementById('account').value = $('#creditAccount').val();
	$('#collectionAmount').removeAttr("disabled");
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function gotoBack(strUrl, frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}