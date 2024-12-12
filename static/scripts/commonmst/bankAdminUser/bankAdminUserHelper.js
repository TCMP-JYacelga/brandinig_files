var globalStrUrl = null ;
function getCancelConfirmPopUp(strUrl) {
	if ( $('#dirtyBit').val() == '1' ) {
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
		$('#cancelConfirmMsgbtn').bind('click',function(){
			$('#confirmMsgPopup').dialog("close");
		});
		
		$('#doneConfirmMsgbtn').bind('click',function(){
			$('#confirmMsgPopup').dialog("close");
			goToHome(strUrl);
		});
		$('#textContent').focus();
	} else {
		goToHome(strUrl);
	}
}
function showBankAdminUserAddRole()
{
	var frm = document.getElementById( "frmMain" );
	frm.action = "showBankAdminUserAdd.srvc";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function goToHome( strUrl )
{
	var frm = document.getElementById( 'frmMain' );
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function saveUser( isPopup )
{ 
	$( "#frmMain" ).find( 'input' ).addClass( "enabled" );
	$( "#frmMain" ).find( 'input' ).attr( "disabled", false );
	$( "#frmMain" ).find( 'select' ).addClass( "enabled" );
	$( "#frmMain" ).find( 'select' ).attr( "disabled", false );
	var strUrl = null ;
	if( pageMode == 'ADD' )
	{
		strUrl = 'saveBankAdminUser.srvc';
	}
	else
	{
		strUrl = 'updateBankAdminUser.srvc';
	}
	var frm = document.getElementById( 'frmMain' );
	if(isPopup == 'Y')
		document.getElementById( 'fiprivclick' ).value = 'Y';
		
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function saveAndNext(url)
{ 
	$( "#frmMain" ).find( 'input' ).addClass( "enabled" );
	$( "#frmMain" ).find( 'input' ).attr( "disabled", false );
	$( "#frmMain" ).find( 'select' ).addClass( "enabled" );
	$( "#frmMain" ).find( 'select' ).attr( "disabled", false );
	var frm = document.getElementById( 'frmMain' );
	frm.action = url;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function onChangeCreateUserFlag( me )
{	
	if(null != me && me.id == "createUserFlag1")
	{
	document.getElementById( 'srcUserNameLbl' ).style.visibility = "hidden";
	document.getElementById( 'srcUserNameDiv' ).style.visibility = "hidden";
	document.getElementById( 'srcUserName' ).value = -1;
	document.getElementById( 'createUserFlag1' ).checked = true;
	document.getElementById( 'createUserFlag2' ).checked = false;
	document.getElementById( 'usrCategory' ).disabled = false;

	}
	else
	{
	document.getElementById( 'srcUserNameLbl' ).style.visibility = "visible";
	document.getElementById( 'srcUserNameDiv' ).style.visibility = "visible";	
	document.getElementById( 'createUserFlag1' ).checked = false;
	document.getElementById( 'createUserFlag2' ).checked = true;
	document.getElementById( 'usrCategory' ).disabled = true;
	
	
	}
}
function getSourceUserList()
{
	var strData = {};
	var strUrl = 'getSourceUserList.srvc';
	var sellerId = document.getElementById( "sellerId" ).value;
	
	strData[ '$sellerId' ] = sellerId;
	strData[ csrfTokenName ] = csrfTokenValue;
	$.ajax(
	{
		url : strUrl,
		type : 'POST',
		data : strData,
		async: false,
		contentType: 'application/json',
		dataType : 'json',
		success : function( response )
		{
			loadSourceUserList( response.userList );
		},
		error : ajaxError
	} );
}
function loadSourceUserList(userList)
{
	$( '#srcUserName' ).empty();
	$( '#srcUserName' ).append( $( "<option></option>" ).attr( "value", -1 ).text( "Select" ) );
	$.each( userList, function( key, val )
	{
		$( '#srcUserName' ).append( $( "<option></option>" ).attr( "value", val.filterCode ).text( val.filterValue ) );
	} );
}
function ajaxError()
{
	alert( "AJAX error, please contact admin!" );
}
function editBankAdminUser( recordViewState )
{
	var frm = document.getElementById( "frmMain" );
	var strUrl = null;
	var viewState = document.getElementById( "viewState" );
	viewState.value= recordViewState;
	strUrl = 'editBankAdminUser.srvc';
	strUrl = strUrl;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function viewBankAdminUser( recordViewState )
{
	var frm = document.getElementById( "frmMain" );
	var strUrl = null;
	var viewState = document.getElementById( "viewState" );
	viewState.value= recordViewState;
	strUrl = 'viewBankAdminUser.srvc';
	strUrl = strUrl ;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function setDirtyBit()
{
	document.getElementById( "dirtyBit" ).value = '1';
}
function showConfirmPopup( strUrl )
{
	globalStrUrl = strUrl;
	document.getElementById( "confirmPopup" ).style.visibility = "visible";
	if( $( '#dirtyBit' ).val() == "1" || pageMode == 'ADD' )
	{
		var dlg = $( '#confirmPopup' );
		dlg.dialog(
		{
				autoOpen : false,
				maxHeight: 550,
				minHeight:'auto',
				width : 400,
				modal : true,
				resizable: false,
				draggable: false
		} );
		dlg.dialog( 'open' );
		$('#confirmPopup').dialog("open");
		$('#cancelConfirmMsg').bind('click',function(){
			closeConfirmPopup();
		});
		
		$('#doneConfirmMsgbutton').bind('click',function(){
			goToTab();
		});
		$('#textContent').focus();
	}
	else
	{
		goToTab();
	}
}//showConfirmPopup

function closeConfirmPopup()
{
	$( '#confirmPopup' ).dialog( "close" );
}//closeConfirmPopup

function doSaveAndNext(url){
	if( $( '#dirtyBit' ).val() == "1" || pageMode == 'ADD' )
	{
		saveAndNext(url);
	}
	else{
		globalStrUrl = 'verifyBankAdminUser.srvc';
		goToTab();
	}
}
function goToTab()
{
	var strUrl = null;
	var frm = document.getElementById( "frmMain" );
	frm.target = "";
	frm.method = "POST";
	if(globalStrUrl == 'verifyBankAdminUser.srvc')
	{
		strUrl = globalStrUrl ;
	}
	if(globalStrUrl == 'saveAndVerifyBankAdminUser.srvc')
	{
		strUrl = globalStrUrl ;
	}
	if(globalStrUrl == 'updateAndVerifyBankAdminUser.srvc')
	{
		strUrl = globalStrUrl ;
	}
	else if(globalStrUrl == 'editBankAdminUser.srvc')
	{
		strUrl = 'editBankAdminUser.srvc';
		strUrl = strUrl + "?" + "$viewState=" + encodeURIComponent( viewState ) + '&' + csrfTokenName + '='
			+ csrfTokenValue;
	}
	else if(globalStrUrl == 'viewBankAdminUser.srvc')
	{
		strUrl = 'viewBankAdminUser.srvc';
		strUrl = strUrl + "?" + "$viewState=" + encodeURIComponent( viewState ) + '&' + csrfTokenName + '='
			+ csrfTokenValue;
	}
	frm.action = strUrl;
	frm.submit();
}//goToTab

function goToNextpage()
{
	var frm = document.getElementById( 'frmMain' );
	frm.action = globalStrUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}//goToNextpage
function warnBeforeCancel(strUrl) {
	
	if( $( '#dirtyBit' ).val() == "1" ) {
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
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
	
}
}

function restSelectOption()
{
	document.getElementById( 'usrCategory' ).value=-1;
	document.getElementById( 'srcUserName' ).value=-1;	
}

function getAdminUserDetailReport(userCode){
	var form = document.createElement('FORM');
	var strUrl = "services/adminUserMasterDetailReport.pdf";
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';
	form.appendChild(createFormField('INPUT', 'HIDDEN',
			csrfTokenName, tokenValue));
	form.appendChild(createFormField('INPUT', 'HIDDEN',
			'userCode', userCode));
	form.action = strUrl;
	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);
}
function createFormField(element, type, name, value) {
	var inputField;
	inputField = document.createElement(element);
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;
	return inputField;
}

function showRoleDetails()
{
	var combo= $("#usrCategory");
	var selectedRole=combo.val();
	if(null != selectedRole && '-1' != selectedRole && ''!= selectedRole)
	{
		var categoryIdentifier = roles[selectedRole]
		var intTop  = (screen.availHeight - 800)/2;
		var intLeft = (screen.availWidth - 1100)/2;
		form = document.forms["frmMain"];
		document.getElementById("roleRecordKeyNo").value = categoryIdentifier;		
		form.action = 'viewBankAdminUserCategoryDetails.popup';
		form.target = "hWinSeek";
		form.method = "POST";
		strAttr = "dependent=yes,scrollbars=yes,";
		strAttr = strAttr + "left=" + intLeft + ",";
		strAttr = strAttr + "top=" + intTop + ",";
		strAttr = strAttr + "width=1050,height=800";
		window.open ("", "hWinSeek", strAttr);
		form.submit();
		form.target = "";
	}
}

function handleRoleDetailLink() 
{
	var selectedRole= $("#usrCategory").val();
	if(null == selectedRole || '-1' == selectedRole || ''== selectedRole)
	{
		$('#roleDtlDiv').hide();
	}
	else
	{
		$('#roleDtlDiv').show();
	}
}
function toggleRiskManager(element) {
	var imageList = $(element).find('IMG');
	var value = $("#riskManagerFlag").val();
	if ("N" === value) {
		imageList[0].src = "static/images/icons/icon_checked.gif";
		$("#riskManagerFlag").val("Y");
		$("#limitDetails").addClass("button_underline thePointer");
		$('#limitDetails').attr("onclick", "javascript:showLimitDetailsPopup();");
		$('#limitDetails').attr("tabindex", 1);
	} else {
		imageList[0].src = "static/images/icons/icon_unchecked.gif";
		$("#riskManagerFlag").val("N");
		$("#limitDetails").removeClass("button_underline thePointer");
		$('#limitDetails').attr("onclick", "");
	}
}

function toggleAccountManager(element) {
	var imageList = $(element).find('IMG');
	var value = $("#accountManager").val();
	if ("N" === value) {
		imageList[0].src = "static/images/icons/icon_checked.gif";
		$("#accountManager").val("Y");
	} else {
		imageList[0].src = "static/images/icons/icon_unchecked.gif";
		$("#accountManager").val("N");
	}
}

function paintError(errorDiv,errorMsgDiv,errorMsg) {
	$(errorDiv).removeClass('ui-helper-hidden');
	element = $('<li class="error-msg-color">').text(errorMsg);
	element.appendTo(errorMsgDiv);
}

function verifyData() {
	var paintErMsg = false;
	$('#limitDetailsErrorMessageDiv').empty();
	if(isEmpty($( "#totalAuthLimitAmnt" ).val())){
		paintError('#limitDetailsErrorDiv','#limitDetailsErrorMessageDiv','Please Enter Daily Approval Limit');
		paintErMsg = true;
	}
	if(isEmpty($( "#ccyCode" ).val())){
		paintError('#limitDetailsErrorDiv','#limitDetailsErrorMessageDiv','Please Enter Currency');
		paintErMsg = true;
	}
	return paintErMsg;
}

function showLimitDetailsPopup() {
	var hidden_riskManagerCode, hidden_totalAuthLimitAmnt, hidden_limitUtilisedAmnt, hidden_ccyCode, usrCode, button_name;
	var dialog_buttons = {};
	
	hidden_riskManagerCode = document.getElementById( 'hidden_riskManagerCode' ).value;
	hidden_totalAuthLimitAmnt = document.getElementById( 'hidden_totalAuthLimitAmnt' ).value;
	hidden_limitUtilisedAmnt = document.getElementById( 'hidden_limitUtilisedAmnt' ).value;
	hidden_ccyCode = document.getElementById( 'hidden_ccyCode' ).value;
	
	if ( isEmpty(hidden_riskManagerCode) ) {
		usrCode = document.getElementById( 'loginId' ).value;
		$( "#riskManagerCode" ).val( usrCode );
	} else {
		$( "#riskManagerCode" ).val( hidden_riskManagerCode );
	}
	$( "#totalAuthLimitAmnt" ).val( hidden_totalAuthLimitAmnt );
	if ( isEmpty(hidden_limitUtilisedAmnt) ) {
		$( "#limitUtilisedAmnt" ).val( '0.00' );
	} else {
		$( "#limitUtilisedAmnt" ).val( hidden_limitUtilisedAmnt );
	}
	$( "#ccyCode" ).val( hidden_ccyCode );
	$( "#limitDetailsErrorDiv" ).addClass('ui-helper-hidden');
	
	if ( isEmpty(riskManagerCode) ) {
		button_name = 'Save';
	} else {
		button_name = 'Update'
	}
	dialog_buttons[button_name] = function() {
		var riskManagerCode, totalAuthLimitAmnt, limitUtilisedAmnt, ccyCode;
		var verify = verifyData();
		if (!verify) {
			riskManagerCode = document.getElementById( 'riskManagerCode' ).value;
			totalAuthLimitAmnt = document.getElementById( 'totalAuthLimitAmnt' ).value;
			limitUtilisedAmnt = document.getElementById( 'limitUtilisedAmnt' ).value;
			ccyCode = document.getElementById( 'ccyCode' ).value;
			
			$( "#hidden_riskManagerCode" ).val( riskManagerCode );
			$( "#hidden_totalAuthLimitAmnt" ).val( totalAuthLimitAmnt );
			$( "#hidden_limitUtilisedAmnt" ).val( limitUtilisedAmnt );
			$( "#hidden_ccyCode" ).val( ccyCode );
			$( this ).dialog( "close" );
		}
	}
	dialog_buttons['Cancel'] = function() {
		$( this ).dialog( "close" );
	}
	$( '#limitDetailsPopup' ).dialog(
	{
		autoOpen : false,
		height : 'auto',
		width : 550,
		modal : true,
		title : 'Risk Manager Limit Details',
		buttons : dialog_buttons
	} );
	$( '#limitDetailsPopup' ).dialog( "open" );
}//showLimitDetailsPopup

function showLimitDetailsViewPopup() {
	var hidden_riskManagerCode, hidden_totalAuthLimitAmnt, hidden_limitUtilisedAmnt, hidden_ccyCode;
	
	hidden_riskManagerCode = document.getElementById( 'hidden_riskManagerCode' ).value;
	hidden_totalAuthLimitAmnt = document.getElementById( 'hidden_totalAuthLimitAmnt' ).value;
	hidden_limitUtilisedAmnt = document.getElementById( 'hidden_limitUtilisedAmnt' ).value;
	hidden_ccyCode = document.getElementById( 'hidden_ccyCode' ).value;
	
	$( "#riskManagerCode" ).val( hidden_riskManagerCode );
	$( "#totalAuthLimitAmnt" ).val( hidden_totalAuthLimitAmnt );
	$( "#limitUtilisedAmnt" ).val( hidden_limitUtilisedAmnt );
	$( "#ccyCode" ).val( hidden_ccyCode );
	
	$( '#limitDetailsViewPopup' ).dialog(
	{
		autoOpen : false,
		height : 'auto',
		width : 550,
		modal : true,
		title : 'Risk Manager Limit Details',
		buttons :
		{
			"Cancel" : function()
			{
				$( this ).dialog( "close" );
			}
		}
	} );
	$( '#limitDetailsViewPopup' ).dialog( "open" );
}//showLimitDetailsViewPopup

jQuery.fn.validateZipcode = function() {
	return this
			.each(function() {
				$(this)
						.keydown(
								function(e) {
									var key = e.charCode || e.keyCode || 0;
									// allow backspace, tab, delete, numbers
									// keypad numbers, letters ONLY
									if (event.which) { // Netscape/Firefox/Opera
										keynum = event.which;
									}
									if (event.shiftKey || event.ctrlKey) {
										return false;
									}
									return (key == 8 || key == 9 || key == 46
											|| key == 190 || key == 189 || key == 32
											|| (key >= 37 && key <= 40)
											|| (key >= 48 && key <= 57)
											|| (key >= 96 && key <= 105) || (key >= 65 && key <= 90));
								})
			})
};


function toggleSuperUser(element) {
	var imageList = $(element).find('IMG');
	var value = $("#usrSuperUser").val();
	if ("N" === value) {
		imageList[0].src = "static/images/icons/icon_checked.gif";
		$("#usrSuperUser").val("Y");
	} else {
		imageList[0].src = "static/images/icons/icon_unchecked.gif";
		$("#usrSuperUser").val("N");
	}
}
function showChanges(strUrl,viewMode)
{
	var frm = document.getElementById( "frmMain" );
	frm.appendChild(createFormField('INPUT', 'HIDDEN','VIEW_MODE', viewMode));
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}