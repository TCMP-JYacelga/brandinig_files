function addBankAdminCategoryRole()
{
	var frm = document.getElementById( "frmMain" );
	frm.action = "addBankAdminCategoryRole.srvc";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}//showBankAdminCategoryAddNew

function callRoleSelection()
{
	document.getElementById( "sourceCategoryRecKey" ).value = '';
	if( document.getElementById( "roleSelect" ).checked )
	{
		// New Role
		//document.getElementById( "sourceLabel" ).style = "visibility:hidden";
		$( '#roleSelect2' ).attr( "class", "hidden" );
		$( '#roleSelect3' ).attr( "class", "hidden" );
		$( '#roleSelect4' ).attr( "class", "hidden" );
		//$( '#sourceLabel' ).attr( "class", "hidden" );
		$( '#sourceRoleDiv' ).attr( "class", "hidden" );
	}
	else
	{
		// copy from existing
		//document.getElementById( "sourceLabel" ).style = "visibility:visible";
		$( '#roleSelect2' ).attr( "class", "block" );
		$( '#roleSelect3' ).attr( "class", "block" );
		$( '#roleSelect4' ).attr( "class", "block" );
		//$( '#sourceLabel' ).attr( "class", "block" );
		$( '#sourceRoleDiv' ).attr( "class", "block" );
	}
}//callRoleSelection

function saveOrUpdateBankAdminCategoryRole()
{
	var frm = document.getElementById( "frmMain" );
	var strUrl = null;
	if( pageMode == 'ADD' )
	{
		strUrl = 'saveBankAdminCategoryRole.srvc';
	}
	else
	{
		strUrl = 'updateBankAdminCategoryRole.srvc';
	}
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}//saveOrUpdateBankAdminCategoryRole

function saveOrUpdateNextBankAdminCategoryRole()
{
	var frm = document.getElementById( "frmMain" );
	var strUrl = null;
	if( pageMode == 'ADD' )
	{
		strUrl = 'saveAndNextBankAdminCategoryRole.srvc';
	}
	else
	{
		strUrl = 'updateAndNextBankAdminCategoryRole.srvc';
	}
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}//saveOrUpdateNextBankAdminCategoryRole

function updateBankAdminCategoryPermissions()
{
	var frm = document.getElementById( "frmMain" );
	var strUrl = 'updateBankAdminCategoryPermissions.srvc';
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}//updateBankAdminCategoryPermissions

function submitBankAdminCategory()
{
	var frm = document.getElementById( "frmMain" );
	var strUrl = 'submitBankAdminCategory.srvc';
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}//submitBankAdminCategory

function editBankAdminCategoryRole( recordViewState )
{
	var frm = document.getElementById( "frmMain" );
	var strUrl = null;
	frm.appendChild(createFormField('INPUT', 'HIDDEN',
			'$viewState', recordViewState));
	frm.appendChild(createFormField('INPUT', 'HIDDEN',
			csrfTokenName, csrfTokenValue));
	strUrl = 'editBankAdminCategoryRole.srvc';
	strUrl = strUrl ;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}//editBankAdminCategoryRole

function viewBankAdminCategoryRole( recordViewState )
{
	var frm = document.getElementById( "frmMain" );
	var strUrl = null;
	frm.appendChild(createFormField('INPUT', 'HIDDEN',
			'$viewState', recordViewState));
	frm.appendChild(createFormField('INPUT', 'HIDDEN',
			csrfTokenName, csrfTokenValue));
	strUrl = 'viewBankAdminCategoryRole.srvc';
	strUrl = strUrl ;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}//viewBankAdminCategoryRole

function toggleServicesCheckBox( imgElement, moduleCode )
{
	var innerArrCode = null;
	if( imgElement.src.indexOf( "icon_unchecked.gif" ) > -1 )
	{
		imgElement.src = "static/images/icons/icon_checked.gif";
		for( var i = 0 ; i < moduleCodeMaskArrVar.length - 1 ; i++ )
		{
			innerArrCode = moduleCodeMaskArrVar[ i ].split( "|" );
			if( innerArrCode[ 0 ] == moduleCode )
			{
				moduleCodeMaskArrVar[ i ] = moduleCode + "|1";
			}
		}
		callInnerAdminSaveItems( moduleCode, null, true );
		callInnerOnBehalfSaveItems( moduleCode, null, true );
	}
	else
	{
		imgElement.src = "static/images/icons/icon_unchecked.gif";

		for( var i = 0 ; i < moduleCodeMaskArrVar.length ; i++ )
		{
			innerArrCode = moduleCodeMaskArrVar[ i ].split( "|" );
			if( innerArrCode[ 0 ] == moduleCode )
			{
				moduleCodeMaskArrVar[ i ] = moduleCode + "|0";
			}
		}
		callInnerAdminSaveItems( moduleCode, null, false );
		callInnerOnBehalfSaveItems( moduleCode, null, false );
	}
	document.getElementById( "moduleCodeMask" ).value = moduleCodeMaskArrVar;
}//toggleServicesCheckBox

function chkServicesCheckBoxes()
{
	var innerArrCodeDummy = null;
	var innerArrCode = null;
	var servicesImgId = null;
	// dummy array is always from rightsmaster and module mst
	for( var i = 0 ; i < moduleCodeMaskArrDummyVar.length - 1 ; i++ )
	{
		servicesImgId = document.getElementById( servicesImgIdArrVar[ i ] );
		innerArrCodeDummy = moduleCodeMaskArrDummyVar[ i ].split( "|" );

		// this is from saved record
		for( var j = 0 ; j < moduleCodeMaskArrVar.length - 1 ; j++ )
		{
			innerArrCode = moduleCodeMaskArrVar[ j ].split( "|" );
			if( innerArrCode[ 0 ] == innerArrCodeDummy[ 0 ] )
			{
				moduleCodeMaskArrDummyVar[ i ] = moduleCodeMaskArrVar[ j ];
				break;
			}
		}
		innerArrCodeDummy = moduleCodeMaskArrDummyVar[ i ].split( "|" );

		if( innerArrCodeDummy[ 1 ] == 0 )
		{
			if( pageMode == 'EDIT' )
			{
				servicesImgId.src = "static/images/icons/icon_unchecked.gif";
			}
			else
			{
				servicesImgId.src = "static/images/icons/icon_unchecked_grey.gif";
			}
		}
		else
		{
			if( pageMode == 'EDIT' )
			{
				servicesImgId.src = "static/images/icons/icon_checked.gif";
			}
			else
			{
				servicesImgId.src = "static/images/icons/icon_checked_grey.gif";
			}
		}
	}//for
	moduleCodeMaskArrVar = moduleCodeMaskArrDummyVar;
}//chkServicesCheckBoxes

function toggleAccessTypeCheckBox( imgElement, accessTypeCode )
{
	var innerArrCode = null;
	if( imgElement.src.indexOf( "icon_unchecked.gif" ) > -1 )
	{
		imgElement.src = "static/images/icons/icon_checked.gif";
		for( var i = 0 ; i < accessTypeCodeMaskArrVar.length - 1 ; i++ )
		{
			innerArrCode = accessTypeCodeMaskArrVar[ i ].split( "|" );
			if( innerArrCode[ 0 ] == accessTypeCode )
			{
				accessTypeCodeMaskArrVar[ i ] = accessTypeCode + "|1";
			}
		}
		callInnerAdminSaveItems( null, accessTypeCode, true );
		callInnerOnBehalfSaveItems( null, accessTypeCode, true );
	}
	else
	{
		imgElement.src = "static/images/icons/icon_unchecked.gif";

		for( var i = 0 ; i < accessTypeCodeMaskArrVar.length ; i++ )
		{
			innerArrCode = accessTypeCodeMaskArrVar[ i ].split( "|" );
			if( innerArrCode[ 0 ] == accessTypeCode )
			{
				accessTypeCodeMaskArrVar[ i ] = accessTypeCode + "|0";
			}
		}
		callInnerAdminSaveItems( null, accessTypeCode, false );
		callInnerOnBehalfSaveItems( null, accessTypeCode, false );
	}
	document.getElementById( "accessTypeCodeMask" ).value = accessTypeCodeMaskArrVar;
}//toggleAccessTypeCheckBox

function chkAccessTypeCheckBoxes()
{
	var innerArrCodeDummy = null;
	var innerArrCode = null;
	var accessTypeImgId = null;

	// dummy array is always from rightsmaster and module mst
	for( var i = 0 ; i < accessTypeCodeMaskArrDummyVar.length - 1 ; i++ )
	{
		accessTypeImgId = document.getElementById( accessTypeImgIdArrVar[ i ] );
		innerArrCodeDummy = accessTypeCodeMaskArrDummyVar[ i ].split( "|" );

		// this is from saved record
		for( var j = 0 ; j < accessTypeCodeMaskArrVar.length - 1 ; j++ )
		{
			innerArrCode = accessTypeCodeMaskArrVar[ j ].split( "|" );
			if( innerArrCode[ 0 ] == innerArrCodeDummy[ 0 ] )
			{
				accessTypeCodeMaskArrDummyVar[ i ] = accessTypeCodeMaskArrVar[ j ];
				break;
			}
		}
		innerArrCodeDummy = accessTypeCodeMaskArrDummyVar[ i ].split( "|" );

		if( innerArrCode[ 1 ] == 0 )
		{
			if( pageMode == 'EDIT' )
			{
				accessTypeImgId.src = "static/images/icons/icon_unchecked.gif";
			}
			else
			{
				accessTypeImgId.src = "static/images/icons/icon_unchecked_grey.gif";
			}
		}
		else
		{
			if( pageMode == 'EDIT' )
			{
				accessTypeImgId.src = "static/images/icons/icon_checked.gif";
			}
			else
			{
				accessTypeImgId.src = "static/images/icons/icon_checked_grey.gif";
			}
		}
	}//for
	accessTypeCodeMaskArrVar = accessTypeCodeMaskArrDummyVar;

}//chkServicesCheckBoxes

function showConfirmPopup( tabId )
{
	globalTabId = tabId;
	var recordKeNo = document.getElementById( 'txtRecordKeyNo' ).value;
	document.getElementById( "confirmPopup" ).style.visibility = "visible";
	if(  recordKeNo == null || recordKeNo == '' )
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
			/*open: function(event, ui) {
		        $("button").blur();
		    }*/
		} );
		dlg.dialog( 'open' );
		/*$('#confirmPopup').bind('click',function(){
			$( '#confirmPopup' ).dialog( "close" );
		});
		
		$('#doneConfirmMsg').bind('click',function(){
			goToTab();
		});*/
		$('#textContent').focus();
	}
	else if( (recordKeNo != null || recordKeNo != '') && $( '#dirtyBit' ).val() == "1" ){
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
			/*open: function(event, ui) {
		        $("button").blur();
		    },
		    buttons : {
				"Yes" : function() {
					goToTab();
				},
				"No" : function() {
					closeConfirmPopup();
				}
			}*/
		} );
		dlg.dialog( 'open' );
		/*$('#confirmPopup').bind('click',function(){
			$( '#confirmPopup' ).dialog( "close" );
		});
		
		$('#doneConfirmMsg').bind('click',function(){
			goToTab();
		});*/
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

function closeConfirmNextPopup()
{
	$( '#confirmNextPopup' ).dialog( 'close' );
}//closeConfirmNextPopup

function goToHome( strUrl )
{
	var frm = document.getElementById( 'frmMain' );
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}//goToHome

function goToTab()
{
	if( globalTabId == 'tab_1' )
	{
		if( pageMode == 'EDIT' || pageMode == 'verifySubmit' )
		{
			editBankAdminCategoryRole( document.getElementById( "viewState" ).value );
		}
		else
		{
			viewBankAdminCategoryRole( document.getElementById( "viewState" ).value );
		}
	}
	else if( globalTabId == 'tab_2' )
	{
		if( pageMode == 'EDIT' || pageMode == 'verifySubmit' )
		{
			goToHome( 'editBankAdminCategoryPerm.srvc' );
		}
		else
		{
			showNextTab( 'viewBankAdminCategoryPerm.srvc' );
		}
	}
	else if( globalTabId == 'tab_3' )
	{
		if( pageMode == 'EDIT' )
		{
			goToHome( 'editBankAdminCategoryVerSub.srvc' );
		}
	}
}//goToTab

function goToNextpage()
{
	var frm = document.getElementById( 'frmMain' );
	frm.action = globalStrUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}//goToNextpage

function showNextTab( strUrl )
{
	globalStrUrl = strUrl;
	var recordKeNo = document.getElementById( 'txtRecordKeyNo' ).value
	document.getElementById( "confirmNextPopup" ).style.visibility = "visible";
	if( $( '#dirtyBit' ).val() == "1" || recordKeNo == null || recordKeNo == '' )
	{
		saveOrUpdateNextBankAdminCategoryRole();
	}
	else
	{
		goToHome( strUrl );
	}
}//showNextTab

function setDirtyBit()
{
	var dirtyBit = document.getElementById( "dirtyBit" ).value = '1';
}//setDirtyBit

function warnBeforeCancel(strUrl) {
	var dirtyBit = $('#dirtyBit').val();
	if('1' == dirtyBit) {
	$('#confirmMsgPopup').dialog({
		autoOpen : false,
		maxHeight: 550,
		minHeight:'auto',
		width : 400,
		modal : true,
		resizable: false,
		draggable: false
		/*buttons : {
			"Ok" : function() {
				var frm = document.forms["frmMain"];
				frm.action = strUrl;
				frm.target = "";
				frm.method = "POST";
				frm.submit();
			},
			"Cancel" : function() {
				$(this).dialog("close");
			}
		}*/
	});
	$('#confirmMsgPopup').dialog("open");
	
	$('#cancelConfirmMsgbtn').bind('click',function(){
		$('#confirmMsgPopup').dialog("close");
	});
	
	$('#doneConfirmMsgbtn').bind('click',function(){
		var frm = document.forms["frmMain"];
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	});
	$('#textContent').focus();
	}
	else {
		var frm = document.forms["frmMain"];
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}
}

function showNextPerTab( strUrl )
{	
	
		goToHome( strUrl );
		
	
}//showNextPerTab

function getAdminRoleDetailReport(srcRoleName){
	var form = document.createElement('FORM');
	var strUrl = "services/adminRoleDetailReport.pdf";
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';
	form.appendChild(createFormField('INPUT', 'HIDDEN',
			csrfTokenName, tokenValue));
	form.appendChild(createFormField('INPUT', 'HIDDEN',
			'roleName', srcRoleName));
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

function getAdminPrevilegeOldNewDiffLst(){
       var objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
       var strPrevilegeListUrl = 'getAdminPrevilegeOldNewDiffLst.srvc?';
       strPrevilegeListUrl = strPrevilegeListUrl + "$accessType=B";
       strPrevilegeListUrl = strPrevilegeListUrl + "&" + "$moduleCode=ALL";
       strPrevilegeListUrl = strPrevilegeListUrl + "&" + "$menuMode=CW";
       strPrevilegeListUrl = strPrevilegeListUrl + "&" + "$accessTypeCode=ALL";
       strPrevilegeListUrl = strPrevilegeListUrl + "&" + "$viewState=" +  viewState ;
       strPrevilegeListUrl = strPrevilegeListUrl + "&" + csrfTokenName + "=" + csrfTokenValue;
       while (arrMatches = strRegex.exec(strPrevilegeListUrl)) {
           objParam[arrMatches[1]] = arrMatches[2];
       }
       var strGeneratedUrl = strPrevilegeListUrl.substring(0, strPrevilegeListUrl.indexOf('?'));
           strPrevilegeListUrl = strGeneratedUrl;
       Ext.Ajax.request(
            {
                url : strPrevilegeListUrl,
                method : 'POST',
                async : false,
                params:objParam,
                success : function( response )
                {
                    adminPrivilegeOldNewValueList = Ext.JSON.decode( response.responseText );
					if(Object.keys(adminPrivilegeOldNewValueList).length != 0)
                    {
						var listOfLinks = adminPrivilegeOldNewValueList['priviligeLinks'];
						if(listOfLinks.length != 0)
						{
							for(var i =0 ; i<listOfLinks.length;i++)
							{
								if(listOfLinks[i] == 'onBehalfChanged')
								{
									$("#onBehalfLink").addClass("modifiedFieldValue");
								}
							    if(listOfLinks[i] == 'adminChanged')
								{
									$("#adminLink").addClass("modifiedFieldValue");
								}
							}
						}
					}
                },
                failure : function()
                {
                    var errMsg = "";
                    Ext.MessageBox.show(
                    {
                        title : getLabel( 'instrumentErrorPopUpTitle', 'Error' ),
                        msg : getLabel( 'instrumentErrorPopUpMsg', 'Error while fetching data..!' ),
                        buttons : Ext.MessageBox.OK,
                        icon : Ext.MessageBox.ERROR
                    } );
                }
            } );
   }
   
  function getReportPrevilegeOldNewDiffLst(){
       var objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
       var strUrl = 'getReportPrevilegeOldNewDiffLst.srvc?';
       strUrl = strUrl + "$moduleCode=02";
       strUrl = strUrl + "&" + "$viewState=" +  viewState ;
       strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue;
       while (arrMatches = strRegex.exec(strUrl)) {
            objParam[arrMatches[1]] = arrMatches[2];
       }
       var strGeneratedUrl = strUrl.substring(0, strUrl.indexOf('?'));
       strUrl = strGeneratedUrl;
       Ext.Ajax.request(
            {
                url : strUrl,
                method : 'POST',
                async : false,
                params:objParam,
                success : function(response)
                {
                    reportPrevilegeOldNewDiffLst = Ext.JSON.decode(response.responseText);
					if(Object.keys(reportPrevilegeOldNewDiffLst).length != 0)
                    {
					  $("#reportPopupLink").addClass("modifiedFieldValue");
                    }
                },
                failure : function()
                {
                    var errMsg = "";
                    Ext.MessageBox.show(
                    {
                        title : getLabel( 'instrumentErrorPopUpTitle', 'Error' ),
                        msg : getLabel( 'instrumentErrorPopUpMsg', 'Error while fetching data..!' ),
                        buttons : Ext.MessageBox.OK,
                        icon : Ext.MessageBox.ERROR
                    } );
                }
            } );
   }
   
 function getInterfacePrevilegeOldNewDiffLst(){
       var objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
       var strUrl = 'getInterfacePrevilegeOldNewDiffLst.srvc?';
       strUrl = strUrl + "$moduleCode=02";
       strUrl = strUrl + "&" + "$viewState=" +  viewState ;
       strUrl = strUrl + "&" + "$categoryType=BANK" ;
       strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue;
       while (arrMatches = strRegex.exec(strUrl)) {
            objParam[arrMatches[1]] = arrMatches[2];
       }
       var strGeneratedUrl = strUrl.substring(0, strUrl.indexOf('?'));
       strUrl = strGeneratedUrl;
       Ext.Ajax.request(
            {
                url : strUrl,
                method : 'POST',
                async : false,
                params:objParam,
                success : function(response)
                {
                    interfacePrevilegeOldNewDiffLst = Ext.JSON.decode(response.responseText);
				    if(Object.keys(interfacePrevilegeOldNewDiffLst).length != 0)
                    {
						 $("#interfacePopupLink").addClass("modifiedFieldValue");
		            }
                },
                failure : function()
                {
                    var errMsg = "";
                    Ext.MessageBox.show(
                    {
                        title : getLabel( 'instrumentErrorPopUpTitle', 'Error' ),
                        msg : getLabel( 'instrumentErrorPopUpMsg', 'Error while fetching data..!' ),
                        buttons : Ext.MessageBox.OK,
                        icon : Ext.MessageBox.ERROR
                    } );
                }
            } );
   }
   
