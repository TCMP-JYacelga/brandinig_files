function getCancelConfirmPopUp(strUrl) {
	if(dityBitSet)
	{
		$('#confirmMsgPopup').dialog({
			autoOpen : false,
			maxHeight: 550,
			minHeight:'auto',
			width : 400,
			modal : true,
			resizable: false,
			draggable: false
		});
		
		$('#confirmMsgPopup').dialog("open");
		
		$('#cancelBackConfirmMsg').bind('click',function(){
			$('#confirmMsgPopup').dialog("close");
		});
		
		$('#doneBackConfirmMsgbutton').bind('click',function(){
			$('#confirmMsgPopup').dialog("close");
			gotoPage(strUrl);
		});
		
		$('#textContent').focus();
	}
	else
	{
		gotoPage(strUrl);
	}
}

function gotoPage(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function saveProfile(strUrl)
{
	var frm = document.forms["frmMain"];
	$('#profileName').attr('disabled', false);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}