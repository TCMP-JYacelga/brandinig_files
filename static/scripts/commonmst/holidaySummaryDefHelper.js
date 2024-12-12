function showNextTab(strUrl)
{
	globalStrUrl = strUrl ;
	var recordKeNo = document.getElementById('txtRecordKeyNo').value
	document.getElementById( "confirmNextPopup" ).style.visibility = "visible";
	if($('#dirtyBit').val()=="1" || recordKeNo == null ||  recordKeNo == '')
	{
		var dlg = $( '#confirmNextPopup' );
		dlg.dialog( {
			autoOpen : false,
			height : "auto",
			modal : true,
			width : 420,
			title : 'Message'
		} );
		dlg.dialog( 'open' );
	}
	else
	{
		goToHome(strUrl);
	}
}



function goToHome(strUrl)
{
	var frm = document.getElementById( 'frmMain' );
	frm.action = strUrl;	
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function updateAndSubmitHoliday(strUrl)
{
	var frm = document.getElementById( 'frmMain' );
	frm.action = strUrl +'?viewState='+viewState;	
	enableFileldsToSave();
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}


function enableFileldsToSave()
{
	$("#frmMain").find('input').addClass("enabled");
	$("#frmMain").find('input').attr("disabled",false);
	$("#frmMain").find('select').addClass("enabled");
	$("#frmMain").find('select').attr("disabled",false);
}

function setDirtyBit()
{
       document.getElementById( "dirtyBit" ).value = '1';
}//setDirtyBit

function warnBeforeCancel(strUrl) {
	
	if($('#dirtyBit').val()=="1")
	{
       $('#confirmMsgPopup').dialog({
              autoOpen : false,
              height : 200,
              width : 420,
              modal : true,
              buttons : {
                     "Yes" : function() {
                           var frm = document.forms["frmMain"];
                           frm.action = strUrl;
                           frm.target = "";
                           frm.method = "POST";
                           frm.submit();
                     },
                     "No" : function() {
                           $(this).dialog("close");
                     }
              }
       });
       $('#confirmMsgPopup').dialog("open");
	}
	else {
		goToHome(strUrl);
	}
}
