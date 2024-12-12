
function saveSweepDetail( strUrl )
{
	var form;
	var viewState = document.getElementById( "viewState" ).value;
	strUrl = strUrl + "?$viewState=" + encodeURIComponent( viewState ) + "&" + csrfTokenName + "="+ csrfTokenValue;
	form = document.createElement( 'FORM' );
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';	
	form.action = strUrl;
	document.body.appendChild( form );
	form.submit();
}

function setCponEnforcedPartOfHybrid()
{
	var strData = {};
	var strUrl = 'getCponEnforcedHybridStrucType.srvc';
	
	strData[ '$viewState' ] = viewState;
	strData[ csrfTokenName ] = csrfTokenValue;

	$.ajax(
	{
		cache : false,
		data : strData,
		dataType : 'json',
		success : function( response )
		{
			loadPartOfHybrid( response.PART_OF_HYBRID );
		},
		error : ajaxError,
		url : strUrl,
		type : 'POST'
	} );

}

function loadPartOfHybrid( partOfHybridFlag )
{
	if( partOfHybridFlag == 'T' )
	{
		// Part of Hybrid checkbox will be visible only if HYBRID feature is enabled.
        $('#partOfHybridLblDiv').show();
        $('#partOfHybridChkBox').show();
	}
}

function ajaxError()
{
	alert( "AJAX error, please contact admin!" );
}
function saveRecord(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function getDiscardConfirmPopUp(strUrl){
	$('#cancelDiscardConfirmMsg').bind('click',function(){
		$('#discardMsgPopup').dialog("close");
	});
	$('#doneConfirmDiscardbutton').bind('click',function(){
		$(this).dialog("close");
		discardProfile(strUrl);
	});
	$('#discardMsgPopup').dialog({
		autoOpen : false,
		maxHeight: 550,
		width : 400,
		modal : true,
		resizable: false,
		draggable: false
	});
	$('#discardMsgPopup').dialog("open");
	$('#textContent').focus();
}
function discardProfile(strUrl){
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	$("input").removeAttr('disabled');
	$("select").removeAttr('disabled');
	if(entityType=='1')
	{
		//$('#clientDesc').val(strClientDesc);	
	}	
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function gotoPage(strUrl) {
	var frm = document.forms['frmMain'];
	var viewState = document.getElementById( "viewState" ).value;
	strUrl = strUrl + "?$viewState=" + encodeURIComponent( viewState ) + "&" + csrfTokenName + "="+ csrfTokenValue;
	frm.action = strUrl;
	$('input').removeAttr('disabled');
	$('select').removeAttr('disabled');

	frm.target = '';
	frm.method = 'POST';
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}