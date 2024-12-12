function getCancelConfirmPopUp(strUrl) {
    if ( $('#dirtyBitSet').val() == 'true' ){
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
        $('#cancelConfirmMsg').bind('click',function(){
            $('#confirmMsgPopup').dialog("close");
        });
        
        $('#doneConfirmMsgbutton').bind('click',function(){
            $('#confirmMsgPopup').dialog("close");
            goToPage(strUrl,'frmMain');
        });
        $('#textContent').focus();
    } else {
    	goToPage(strUrl,'frmMain');
    }
}

function goToPage(strUrl, frmId)
{
    $("input").removeAttr('disabled');
    var frm = document.getElementById(frmId);
    frm.action = strUrl;
    frm.target = "";
    frm.method = "POST";
    frm.submit();
}

function setDirtyBit()
{
    document.getElementById( "dirtyBitSet" ).value = 'true';
    $(".submit_button").removeClass("disabled");
}