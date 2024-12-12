var partOfHybridFlag = false;
var allowOntriggerCponFlag = false;
var balanceCponFlag = false;
var activityCponFlag = false;
var investmentSweepCponFlag = false;
function showList(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.appendChild(createFormField('INPUT', 'HIDDEN', csrfTokenName, csrfTokenValue));
	frm.method = "POST";
	frm.submit();	
}

function showAddNewForm(strUrl)
{
	var frm = document.forms["frmMain"];
	//alert(2);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function saveRecord(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function showHistoryForm(strUrl, index)
{
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 400)/2;
	var strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=400,height=300";

	var frm = document.forms["frmMain"];
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "hWinHistory";
	frm.method = "POST";

	window.open ("", "hWinHistory", strAttr);
	frm.submit();
	frm.target = "";
}

function showViewForm(structureType, index)
{
	var frm = document.forms["frmMain"];
	document.getElementById("updateIndex").value = index;
	var strUrl ;
	if( structureType == 101 )
	{
		strUrl = "viewAgreementMstSweep.form";
	}
	else if( structureType == 201 )
	{
		strUrl = "viewAgreementMstFlexible.form";
	}
	else if( structureType == 301 )
	{
		strUrl = "viewNotionalAgreement.form";
	}
	else if( structureType == 401 )
	{
		strUrl = "viewAgreementMstPassive.form";
	}
	else if( structureType == 501 )
	{
		strUrl = "viewAgreementMstHybrid.form";
	}
	else if( structureType == 601 )
	{
		strUrl = "viewTransactionAgreement.form";
	}
	if(strUrl != null)
	{
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}
}

function showEditForm(structureType, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("updateIndex").value = index;
	var strUrl ;
	if( structureType == 101 )
	{
		strUrl = "editAgreementMstSweep.form";
	}
	else if( structureType == 201 )
	{
		strUrl = "editAgreementMstFlexible.form";
	}
	else if( structureType == 301 )
	{
		strUrl = "editNotionalAgreement.form";
	}
	else if( structureType == 401 )
	{
		strUrl = "editAgreementMstPassive.form";
	}
	else if( structureType == 501 )
	{
		strUrl = "editAgreementMstHybrid.form";
	}
	else if( structureType == 601 )
	{
		strUrl = "editTransactionAgreement.form";
	}
	if(strUrl != null)
	{
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}
}

// Enable, Disable, Accept and Reject requests
function enableRecordList(strUrl)
{
	var frm = document.forms["frmMain"];
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record")
		return;
	}
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function disableRecordList(strUrl)
{
	var frm = document.forms["frmMain"]; 
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record")
		return;
	}
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function authRecord(me,strUrl)
{
	if (me.className.startsWith("imagelink grey"))
		return;
	var frm = document.forms["frmMain"];
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record")
		return;
	}	
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}


function getRejectRecord(me, rejTitle, rejMsg,strUrl)
{
    var temp = document.getElementById("btnReject");
	if (temp.className.startsWith("imagelink grey"))
		return;
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record")
		return;
	}
	getRemarks(230, rejTitle, rejMsg, strUrl, rejectRecord);
}

function rejectRecord(arrData, strRemarks,strUrl)
{
	var frm = document.forms["frmMain"]; 

	if (strRemarks.length > 255)
	{
		alert("Reject Remarks Length Cannot Be Greater than 255 Characters!");	
		return false;
	}
	else
	{
		frm.rejectRemarks.value = strRemarks;
		frm.target = "";
		frm.action = arrData;
		frm.method = 'POST';
		frm.submit();
	}
}

function deleteList(me,strUrl)
{
    var temp = document.getElementById("btnDiscard");
	if (temp.className.startsWith("imagelink grey"))
		return;
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record");
		return;
	} 
	deleteRecord(document.getElementById("updateIndex").value,strUrl);
}

function deleteRecord(arrData,strUrl)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = arrData;
	frm.target = "";
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}


// List navigation
function prevPage(strUrl, intPg)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtCurrent").value = intPg;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function nextPage(strUrl, intPg)
{
	document.getElementById("txtCurrent").value = intPg;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function acceptRecord( ctrl, status, index, prodCategory )
{
	var strAuthIndex = document.getElementById( "updateIndex" ).value;
	var strActionMap = document.getElementById( "actionmap" ).value;

	if( index.length < 2 )
	{
		index = '0' + index;
	}
	var aPosition = strAuthIndex.indexOf( index );
	var mapPosition;
	var strCurrentAction;
	var strDelimAction;
	var lenDelimAction;
	var strArrSplitAction;
	var strFinalBitmap = document.getElementById( "bitmapval" ).value;
	var lenLooplen;
	if( aPosition >= 0 )
	{
		document.getElementById( "updateIndex" ).value = strAuthIndex.replace(
				strAuthIndex.substring( aPosition, aPosition + 3 ), "" );
		mapPosition = strActionMap.indexOf( index + ":" );
		document.getElementById( "actionmap" ).value = strActionMap.replace(
				strActionMap.substring( mapPosition, mapPosition + 10 ), "" );
	}
	else
	{
		strCurrentAction = arrBatchAggr[ status ];
		if( !strCurrentAction )
			strCurrentAction = "000000";
		document.getElementById( "actionmap" ).value = index + ":"
				+ strCurrentAction + ","
				+ document.getElementById( "actionmap" ).value;
		document.getElementById( "updateIndex" ).value = index + ","
				+ document.getElementById( "updateIndex" ).value;

	}

	if( ctrl.className.indexOf( "acceptlink" ) > -1 )
	{
		ctrl.className = "linkbox acceptedlink";
	}
	else
	{
		ctrl.className = "linkbox acceptlink";
	}

	// perform the operation of bitwise anding
	lenDelimAction = document.getElementById( "actionmap" ).value.length;
	if( lenDelimAction > 1 )
	{
		strDelimAction = document.getElementById( "actionmap" ).value;
		strDelimAction = strDelimAction.substring( 0, lenDelimAction - 1 );
		strArrSplitAction = strDelimAction.split( "," );
		for( var i = 0 ; i < strArrSplitAction.length ; i++ )
		{
			strArrSplitAction[ i ] = strArrSplitAction[ i ]
					.substring( strArrSplitAction[ i ].indexOf( ":" ) + 1 );
		}

		if( strArrSplitAction.length == 1 )
		{
			strFinalBitmap = strArrSplitAction[ 0 ];
		}
		else
		{
			lenLooplen = strArrSplitAction.length - 1;
			for( var j = 0 ; j < lenLooplen ; j++ )
			{
				if( j == 0 )
				{
					strFinalBitmap = performAnd( strArrSplitAction[ j ],
							strArrSplitAction[ j + 1 ] );
				}
				else
				{
					strFinalBitmap = performAnd( strFinalBitmap,
							strArrSplitAction[ j + 1 ] );
				}
			}
		}
		document.getElementById( "bitmapval" ).value = strFinalBitmap;
		refreshButtons( prodCategory );
	}
	else
	{
		strFinalBitmap = _strValidActions;
		document.getElementById( "bitmapval" ).value = strFinalBitmap;
		refreshButtons( prodCategory );
	}
}

function performAnd( validAction, currentAction )
{
	var strOut = "";
	var i = 0;
	if( validAction.length = currentAction.length )
	{
		for( i = 0 ; i < 6 ; i++ )
		{
			strOut = strOut
					+ ( ( validAction.charAt( i ) * 1 ) && ( currentAction
							.charAt( i ) * 1 ) );
		}
	}
	return strOut;
}

function refreshButtons( prodCategory )
{
	var strPopultedButtons = document.getElementById( "bitmapval" ).value;
	var strActionButtons;
	// DO THE ANDING WITH SERVER BITMAP
	strActionButtons = performAnd( strPopultedButtons, _strServerBitmap );
	var i = 0;
	if( strActionButtons.length > 0 )
	{
		for( i = 0 ; i < 6 ; i++ )
		{
			switch( i )
			{
				case 0:
					if( strActionButtons.charAt( i ) * 1 == 1 )
					{
						document.getElementById( "btnAuth" ).className = "imagelink black inline button-icon icon-button-accept font_bold";
					}
					else
					{
						document.getElementById( "btnAuth" ).className = "imagelink grey inline button-icon icon-button-accept-grey font-bold";
					}
					break;

				case 1:
					if( strActionButtons.charAt( i ) * 1 == 1 )
					{
						document.getElementById( "btnReject" ).className = "imagelink black button-icon icon-button-reject font_bold";
					}
					else
					{
						document.getElementById( "btnReject" ).className = "imagelink grey button-icon icon-button-reject-grey font-bold";
					}
					break;
				case 2:
					if( prodCategory == '301' ||  prodCategory == '401')
					{
						document.getElementById( "btnExeNow" ).className = "imagelink grey button-icon icon-button-release-grey font-bold";
					}
					else
					{
						if( strActionButtons.charAt( i ) * 1 == 1 )
						{
							document.getElementById( "btnExeNow" ).className = "imagelink black button-icon icon-button-release font_bold";
						}
						else
						{
							document.getElementById( "btnExeNow" ).className = "imagelink grey button-icon icon-button-release-grey font-bold";
						}
					}

					break;
				case 3:
					if( strActionButtons.charAt( i ) * 1 == 1 )
					{
						document.getElementById( "btnEnable" ).className = "imagelink black inline button-icon icon-button-enable font_bold";
					}
					else
					{
						document.getElementById( "btnEnable" ).className = "imagelink grey inline button-icon icon-button-enable-grey font-bold";
					}
					break;
				case 4:
					if( strActionButtons.charAt( i ) * 1 == 1 )
					{
						document.getElementById( "btnDisable" ).className = "imagelink black inline button-icon icon-button-disable font_bold";
					}
					else
					{
						document.getElementById( "btnDisable" ).className = "imagelink grey inline button-icon icon-button-disable-grey font-bold";
					}
					break;
				case 5:

					if( strActionButtons.charAt( i ) * 1 == 1 )
					{
						document.getElementById( "btnDiscard" ).className = "imagelink black button-icon icon-button-discard font_bold";
					}
					else
					{
						document.getElementById( "btnDiscard" ).className = "imagelink grey button-icon icon-button-discard-grey font-bold";
					}
					break;
			}
		}
	}
}

// Details
function addDetail(strUrl)
{
	var frm = document.forms["frmMain"]; 
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function deleteDetail(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function viewDetailForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function editDetailForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function getRecord(json,elementId,fptrCallback)
{		  
	var myJSONObject = JSON.parse(json);
    var inputIdArray = elementId.split("|");
    for(i=0; i<inputIdArray.length; i++)
	{
    	var field = inputIdArray[i];
    	if(document.getElementById(inputIdArray[i]) && myJSONObject.columns[i])
    	{
			var type = document.getElementById(inputIdArray[i]).type;
			if(type=='text'){
				document.getElementById(inputIdArray[i]).value=myJSONObject.columns[i].value;}
			else if (type == 'hidden') {
				document.getElementById(inputIdArray[i]).value=myJSONObject.columns[i].value;}
			else {
				document.getElementById(inputIdArray[i]).innerHTML=myJSONObject.columns[i].value;} 
    	}
	}    
    if( !isEmpty( fptrCallback ) && typeof window[ fptrCallback ] == 'function' )
		window[ fptrCallback ]( json, elementId );
}

function showStructureTypeSelection( fptrCallback )
{
	document.getElementById( "structreTypeSelection" ).style.visibility = "visible";
	var dlg = $( '#structreTypeSelection' );
	dlg.dialog( {
		bgiframe : true,
		autoOpen : false,
		height : "auto",
		modal : true,
		resizable : true,
		width : 650,
		title : getLabel('structureType', 'Select Structure Type')
	} );
	dlg.dialog( 'open' );
}

function afterStuctTypeSelection()
{
	$( '#structreTypeSelectionView' ).appendTo( '#frmMain' );
	var structureTypeFltrDummy = document.getElementById( "structureTypeFltrDummy" );
	var clientCodeFltrDummy = document.getElementById( "clientCodeFltrDummy" );
	var clientDescFltrDummy = document.getElementById( "clientDummyDescription" );
	var strUrl ;
	document.getElementById( "structureType" ).value = structureTypeFltrDummy.value ;
	document.getElementById( "clientCode" ).value = clientCodeFltrDummy.value ;
	document.getElementById( "clientDescription" ).value = clientDescFltrDummy.value ;
	if( structureTypeFltrDummy.value == 101 )
	{
		strUrl = "addAgreementMstSweep.form";
	}
	else if( structureTypeFltrDummy.value == 201 )
	{
		strUrl = "addAgreementMstFlexible.form";
	}
	else if( structureTypeFltrDummy.value == 301 )
	{
		strUrl = "addNotionalAgreement.form";
	}
	else if( structureTypeFltrDummy.value == 401 )
	{
		strUrl = "addAgreementMstPassive.form";
	}
	else if( structureTypeFltrDummy.value == 501 )
	{
		strUrl = "addAgreementMstHybrid.form";
	}
	else if( structureTypeFltrDummy.value == 601 )
	{
		strUrl = "addTransactionAgreement.form";
	}
	if(strUrl != null)
	{
		submitUrl( strUrl );
	}
	
}

function selectAccount()
{
	var frm = document.forms[ "frmMain" ];
	var strUrl = 'saveNotionalAgreementDtl.form';
	frm.target = "";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}


function showTreeView( strUrl,record)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("viewState").value =  record.get( 'viewState' );
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function submitUrl( strUrl)
{
	var frm = document.forms["frmMain"]; 
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function deleteAgreementDetail( ctrl, index )
{
	var detailIndex = document.getElementById( "updateIndex" ).value;
	if (index.length < 2)
	{
		index = '0' + index;
	}
	if( ctrl.className.indexOf( "acceptlink" ) > -1 )
	{
		ctrl.className = "linkbox acceptedlink";
	}
	else
	{
		ctrl.className = "linkbox acceptlink";
	}
	var aPosition = detailIndex.indexOf(index);
	if (aPosition >= 0)
	{
		document.getElementById("updateIndex").value = detailIndex.replace(detailIndex.substring(aPosition, aPosition + 3),"");
	}
	else
	{
		document.getElementById("updateIndex").value = index+ ","+detailIndex ;
	}
	var removeAccountBtn = document.getElementById( "removeAccountBtn" );
	if(document.getElementById("updateIndex").value.length > 0)
	{
		removeAccountBtn.disabled = false;
	}
	else
	{
		removeAccountBtn.disabled = true;
	}
}
function showAgreementTreePopup()
{
	var agrTreeJson = document.getElementById("agreementTreeJson");
	if( agrTreeJson )
	{
		if( agrTreeJson.value != '' )
		{
			$( '#AgreementTreeDialog' ).dialog( {
				autoOpen : false,
				width : 900,
				height : 500,
				title : getLabel('treeView', 'Tree View'),
				modal : true
			} );
			$( '#dialogMode' ).val( '1' );
			$( '#AgreementTreeDialog' ).dialog( 'open' );
			drawAgreementTree();
		}
	}
}

function doExecuteNow( me, fptrCallback )
{
	var temp = document.getElementById( "btnExeNow" );
	if( temp.className.startsWith( "imagelink grey" ) )
		return;

	var frm = document.forms[ "frmMain" ];
	if( document.getElementById( "updateIndex" ).value == "" )
	{
		alert( "Select Atlease One Record" )
		return;
	}
	
	var dlg = $( '#onDemandExeFilter' );
	dlg.dialog( {
		bgiframe : true,
		autoOpen : false,
		height : "auto",
		modal : true,
		resizable : true,
		width : 480,
		title : getLabel('summaryBalance', 'Balance' ),
		buttons :[
		{
			text:getLabel('btnOk','Ok'),
			click : function() {
				$( this ).dialog( "close" );
				fptrCallback.call( null, 'executeAgreementMst.form' );
			}
		},
		{
			text:getLabel('btncancel','Cancel'),
			click : function() {
				$( this ).dialog( 'close' );
			}
		}
	]
	} );
	dlg.dialog( 'open' );
}

function submitOnDemand( strUrl )
{
	$( '#onDemandExeFilter' ).appendTo( '#frmMain' );
	$( '#onDemandExeFilter' ).hide();
	var frm = document.forms[ "frmMain" ];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function simulateAgreement(agreementId)
{
	var csrf_name = document.getElementById( csrfTokenName ).name;
	var csrf_token = document.getElementById( csrfTokenName ).value;	
	var strData = {};
	strData[ 'AGREEMENTID' ] = agreementId;
	strData[ csrf_name ] = csrf_token;
	$.ajax( {
		type : 'POST',
		data : strData,
		url : 'agreementSimulation.form',
		dataType : 'html',
		success : function( data )
		{
			var $response = $( data );
			$( '#agreementSimulation' ).html(
					$response.find( '#agreementSimulationView' ) );
			$( '#agreementSimulation' ).dialog( {
				bgiframe : true,
				autoOpen : false,
				width : "auto",
				height : "auto",
				resizable : true,
				title : getLabel('simulationAgreementExe', 'Simulation -> Agreement Execution'),
				modal : true
			} );
			$( '#dialogMode' ).val( '1' );
			$( '#agreementSimulation' ).dialog( 'open' );
		}
	} );
}

function testRunSimulation( strUrl )
{
	$( '#agreementSimulation' ).appendTo( '#frmMain' );
	$( '#agreementSimulation' ).hide();
	var frm = document.forms[ "frmMain" ];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function viewSimulationResult( errorMsg )
{
	document.getElementById( "simulationErrorMsg" ).style.visibility = "visible";
	if( errorMsg )
	{
		if( errorMsg.value != '' )
		{
			$( '#simulationErrorMsg' ).dialog( {
				autoOpen : false,
				width : 500,
				height : 100,
				title : getLabel('message', 'Message'),
				modal : true,
				resizable : true
			} );
			$( '#dialogMode' ).val( '1' );
			$( '#simulationErrorMsg' ).dialog( 'open' );
		}
	}
}

function closeSimulationPopup()
{
	$( '#agreementSimulation' ).dialog( 'close' );
}
function closeStructureTypePopup()
{
	$( '#structreTypeSelectionView' ).dialog( 'close' );
	$( '#structreTypeSelection' ).dialog( 'close' );
}
function getStructureType()
{
	
	var csrf_name = document.getElementById( "csrfTok" ).name;
	var csrf_token = document.getElementById( csrf_name ).value;
	var strData = {};
	var clientCode = document.getElementById("clientCodeFltrDummy").value;
	var clientDesc = document.getElementById("clientDummyDescription").value;
	strData[ 'CLIENTCODE' ] = clientCode;
	strData[ 'CLIENTDESC' ] = clientDesc;
	strData[ csrf_name ] = csrf_token;
	$.ajax( {
		type : 'POST',
		data : strData,
		url : 'getStructureTypeList.form',
		dataType : 'html',
		success : function( data )
		{
			var $response = $( data );
			$( '#structreTypeSelectionView' ).html(
					$response.find( '#structreTypeSelection' ) );
			$( '#structreTypeSelectionView' ).dialog( {
				bgiframe : true,
				autoOpen : false,
				height : "auto",
				modal : true,
				resizable : true,
				width : 650,
				title : getLabel('structureType', 'Select Structure Type')
			} );
			$( '#dialogMode' ).val( '1' );
			document.getElementById( "structreTypeSelection" ).style.visibility = "hidden";
			$( '#structreTypeSelection' ).dialog( 'close' );
			$( '#structreTypeSelectionView' ).dialog( 'open' );
		}
	} );
}
function setStructureTypeFltrDummy(me)
{
	document.getElementById( "structureTypeFltrDummy" ).value = me;	
}

function OnChangeWorkingBalance(index,dr_decimal)
{
	var id = document.getElementById("agreementSimulationDtlBean["+index+"].workingBalance");
	if( isNaN( parseFloat( id.value ) ) ) return false;
	id.value = parseFloat(id.value).toFixed(dr_decimal);
}
function OnChangeTxnAmount(index,dr_decimal)
{
	var id = document.getElementById("agreementSimulationMstBean.transactionAmount");
	if( isNaN( parseFloat( id.value ) ) ) return false;
	id.value = parseFloat(id.value).toFixed(dr_decimal);
}
function OnKeyPressWorkingBalance(index)
{
	var id = document.getElementById("agreementSimulationDtlBean["+index+"].workingBalance");
	if( isNaN( parseFloat( id.value ) ) && id.value != '-' )
	{
		id.value = "";
	}
	$(id).keypress(function (e) {
	     //if the letter is not digit then display error and don't type anything
	     if (e.which != 8 && e.which != 0 && e.which != 46 && e.which != 45 && (e.which < 48 || e.which > 57)) {
	        //display error message	        
	               return false;
	    }
	   });
}
function OnKeyPressTxnAmount(index)
{
	var id = document.getElementById("agreementSimulationMstBean.transactionAmount");
	if( isNaN( parseFloat( id.value ) ) && id.value != '-') 
		id.value = "";
	$(id).keypress(function (e) {
	     //if the letter is not digit then display error and don't type anything
	     if (e.which != 8 && e.which != 0 && e.which != 46 && e.which != 45 && (e.which < 48 || e.which > 57)) {
	        //display error message	        
	               return false;
	    }
	   });
}
function onChangeDebitOn(me)
{
	var transactionAmount;
	var testRun = document.getElementById( "testRun" );
	var radios = document.getElementsByName("debitOn");
	for( i = 0 ; i < radios.length ; i++ )
	{
		transactionAmount = document.getElementById( "agreementSimulationDtlBean["+i+"].transactionAmount" );
		if( me.value == i)
		{
			transactionAmount.readOnly = false;
			transactionAmount.className = 'amountBox rounded inline_block';
		}
		else
		{
			transactionAmount.readOnly = true;
			transactionAmount.className = 'amountBox rounded inline_block greyback';
			transactionAmount.value = '';
		}
	}
	testRun.disabled = false;
}
function onClickResetLiqPosition(me)
{
	var resetLiqPosition = document.getElementById( "agreementSimulationMstBean.resetLiqPosition" );
	if(me.checked == true)
	{
		resetLiqPosition.value = "Y";
	}
	else
	{
		resetLiqPosition.value = "N";
	}
}


function createCurrencyAutoCompletor()
{
	var auto1 = Ext.create( 'Ext.ux.gcp.AutoCompleter',
	{
		xtype : 'AutoCompleter',
		fieldLabel : '',
		itemId : 'currencyCodeItemId',
		fieldCls : 'xn-form-text w15 xn-suggestion-box',
		labelSeparator : '',
		cfgUrl : 'services/userseek/sweepAgreementMstCcySeek.json',
		cfgQueryParamName : '$autofilter',
		cfgRecordCount : -1,
		cfgSeekId : 'sweepAgreementMstCcySeek',
		cfgRootNode : 'd.preferences',
		cfgDataNode1 : 'DESCR',
		cfgDataNode2 : 'CODE',
		listeners :
		{
			select : function( combo, record, index )
			{
				document.getElementById( "agreementCurrency" ).value = record[ 0 ].data.CODE;
				document.getElementById( "currencyDesc" ).value = record[ 0 ].data.DESCR;
				createMasterMasterAcctNmbrAutoCompletor();
			}
		}
	} );
	auto1.render( Ext.get( 'currencyDiv' ) );
	auto1.setValue(document.getElementById( "currencyDesc" ).value);
}

function createSellerAutoCompletor()
{
	var auto1 = Ext.create( 'Ext.ux.gcp.AutoCompleter',
	{
		xtype : 'AutoCompleter',
		fieldLabel : '',
		itemId : 'sellerCodeItemId',
		fieldCls : 'xn-form-text w15 xn-suggestion-box',
		labelSeparator : '',
		cfgUrl : 'services/userseek/sweepEntitledSellerIdSeek.json',
		cfgQueryParamName : '$autofilter',
		cfgRecordCount : -1,
		cfgSeekId : 'sweepEntitledSellerIdSeek',
		cfgRootNode : 'd.preferences',
		cfgDataNode1 : 'DESCRIPTION',
		cfgDataNode2 : 'CODE',
		listeners :
		{
			select : function( combo, record, index )
			{
				document.getElementById( "sellerId" ).value = record[ 0 ].data.CODE;
				document.getElementById( "sellerDesc" ).value = record[ 0 ].data.DESCRIPTION;
				sellerCodeValue = record[ 0 ].data.CODE;
				createClientCodeAutoCompletor( sellerCodeValue );
				//getAccrualFlagValue( sellerCodeValue );
			}
		}
	} );
	auto1.setValue(document.getElementById( "sellerDesc" ).value);
	auto1.render( Ext.get( 'sellerIdDiv' ) );
}

function createClientCodeAutoCompletor( sellerCodeValue )
{
	document.getElementById( "clientCodeDiv" ).innerHTML = "";
	var auto1 = Ext.create( 'Ext.ux.gcp.AutoCompleter',
	{
		xtype : 'AutoCompleter',
		fieldLabel : '',
		itemId : 'clientCodeItemId',
		fieldCls : 'xn-form-text w15 xn-suggestion-box',
		labelSeparator : '',
		cfgUrl : 'services/userseek/sweepClientIdSeek.json',
		cfgQueryParamName : '$autofilter',
		cfgRecordCount : -1,
		cfgSeekId : 'sweepClientIdSeek',
		cfgRootNode : 'd.preferences',
		cfgDataNode1 : 'DESCRIPTION',
		cfgKeyNode : 'CODE',
		cfgExtraParams :
		[
			{
				key : '$filtercode1',
				value : sellerCodeValue
			}
		],
		listeners :
		{
			select : function( combo, record, index )
			{
				document.getElementById( "clientCode" ).value = record[ 0 ].data.CODE;
				document.getElementById( "clientDescription" ).value = record[ 0 ].data.DESCRIPTION;
				createChargeAcctAutoCompletor(sellerCodeValue);
				createMasterMasterAcctNmbrAutoCompletor();
				setCponEnforcedStructureType();
			}
		}
	} );
	auto1.setValue(document.getElementById( "clientDescription" ).value);
	auto1.render( Ext.get( 'clientCodeDiv' ) );
}

function setCponEnforcedStructureType()
{
	var strData = {};
	var strUrl = 'getCponEnforcedStructureType.srvc';
	var clientId = $('#clientCode').val();
	
	strData[ '$clientId' ] = clientId;
	strData[ csrfTokenName ] = csrfTokenValue;

	$.ajax(
	{
		cache : false,
		data : strData,
		dataType : 'json',
		async:false,
		success : function( response )
		{
			loadStructureType( response.STRUCTURE_TYPE );
			setAllowOnTriggerDependentFlags( response.STRUCTURE_TYPE );
			//loadCurrencyRestriction( response.MULTI_CURRENCY );
			loadInterAccPosition( response.INTER_ACC_POSITION_FLAG );
			loadOnDemand( response.ON_DEMAND_FLAG );
			loadPartOfHybrid( response.PART_OF_HYBRID );
			loadNoPostStructure( response.NO_LIVE_STRUCTURE );
			$('select').niceSelect('update');
		},
		error : ajaxError,
		url : strUrl,
		type : 'POST'
	} );

}

function loadNoPostStructure( noLiveFlag )
{
	//noPostStructureId
	
	if( noLiveFlag == 'T')
	{
		//$( '#noPostStructureId' ).attr( "class", "block" );
		$( '#noPostStructureElementId' ).attr( "class", "block" );
		$( '#liveDateElementId' ).attr( "class", "block" );
		$( '#liveDateLbl' ).attr( "class", "frmLabel block" );		
		//onNoPostStructureChange(document.forms[ 'frmMain' ].elements[ 'noPostStructure' ]);
	}
	else
	{
		//$( '#noPostStructureId' ).attr( "class", "hidden" );
		$( '#noPostStructureElementId' ).attr( "class", "hidden" );
		$( '#liveDateElementId' ).attr( "class", "hidden" );
		//$( '#liveDateLbl' ).attr( "class", "hidden" );
	}

	if(structureType=='501')
	{
		$('#noPostStructureDiv').removeClass('col-lg-offset-1');
		$('#noPostStructureDiv').hide();
		$( '#noPostStructure' ).val("");
		$( '#noPostStructure' ).attr("checked",false);
}
}

function setCponEnforcedPartOfHybrid()
{
	var strData = {};
	var strUrl = 'getCponEnforcedStructureType.srvc';
	var clientId = document.getElementById( "clientCode" ).value;
	
	strData[ '$clientId' ] = clientId;
	strData[ csrfTokenName ] = csrfTokenValue;

	$.ajax(
	{
		cache : false,
		data : strData,
		dataType : 'json',
		async:false,
		success : function( response )
		{
			loadPartOfHybrid( response.PART_OF_HYBRID );
			if(response && response.STRUCTURE_TYPE ){
			     setAllowOnTriggerDependentFlags( response.STRUCTURE_TYPE );
			}
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
        
        if( pageMode == 'VIEW' &&  partOfHybridFlag == 'T' )
    	{
    		   $('#partOfHybridLblDiv').show();
               $('#partOfHybridChkBox').show();
    	}
        else
        {
            $('#sweepPartOfHybrid,#flexiblePartOfHybridChkBox').show();
        }
	}
	else {
		  if( pageMode == 'VIEW'){
		 $('#partOfHybridLbl').hide();
         $('#partOfHybrid').hide();
		  }
		  else{
         $('#sweepPartOfHybrid,#flexiblePartOfHybridChkBox').hide();
		  }
	}
}
function loadOnDemand( onDemandFlag )
{
	if(document.getElementById("allowOndemand"))
	{
		if( onDemandFlag == 'T')
		{
			document.getElementById("allowOndemand").disabled = false;
			if(pageMode == "ADD")
			{
				document.getElementById("allowOndemand").checked = true;
				allowOnDemandVal = 'Y';
				document.getElementById("allowOndemand").value = 'Y';
				return;
			}
			else
			{
			if(allowOnDemandVal == 'Y')
			document.getElementById("allowOndemand").checked = true;
			else
			document.getElementById("allowOndemand").checked = false;	
			}
			
		}
		else
		{
			if( document.getElementById("allowOndemand") )
			{
				 document.getElementById("allowOndemand").checked = false;
			}
           document.getElementById("allowOndemand").disabled = true;
		}
	}
}
function loadInterAccPosition( interAccPosFlag )
{
	if(document.getElementById("manageInteraccPos"))
	{
		if( interAccPosFlag == 'T')
		{
			document.getElementById("manageInteraccPos").disabled = false;
		}
		else
		{
			document.getElementById("manageInteraccPos").disabled = true;
		}
	}
}
function loadCurrencyRestriction( multiCurrencyFlag )
{
	$( '#ccyRestriction > option' ).remove();
	eval( "document.getElementById('ccyRestriction').options[0]=" + "new Option('" + 'Select' + "','" + '' + "')" );
	
	// Single currency otion add logic	
	opt = document.createElement("option");
    document.getElementById("ccyRestriction").options.add(opt);
    opt.text = "Single-Currency";
    opt.value = "S";
    opt.selected = true;
    
   // mulit-currency option add logic depending upon flag value 
	if( multiCurrencyFlag == 'T')
	{
		opt = document.createElement("option");
        document.getElementById("ccyRestriction").options.add(opt);
        opt.text = "Multi-Currency";
        opt.value = "M";
		
	}

}
function loadStructureType( cponList )
{
	var structureTypeVal = document.getElementById('structureType').value;
	partOfHybridFlag = false;

	$( '#structureType > option' ).remove();
	if( cponList.length == 0 ||  cponList.length > 1)
	{
		eval( "document.getElementById('structureType').options[0]=" + "new Option('" + getLabel('Select','Select') + "','" + '' + "')" );
	}
	
	for( var i = 0 ; i < cponList.length ; i++ )
	{
        if( cponList[ i ].filterCode == 'SWEEP' )
        {
        	opt = document.createElement("option");
            document.getElementById("structureType").options.add(opt);
            opt.text = getLabel("Sweep","Sweep");
            opt.value = "101";
            
            if( structureTypeVal != '' && structureTypeVal == '101' )
            {
            	 opt.selected = true;
            }
            else if( pageMode == 'ADD' )
            {
            	opt.selected = true;
            }
            
        }
        else if( cponList[ i ].filterCode == 'FLEXIBLE' )
        {
        	opt = document.createElement("option");
            document.getElementById("structureType").options.add(opt);
            opt.text = getLabel("Flexible","Flexible");
            opt.value = "201";
            
            if( structureTypeVal != '' && structureTypeVal == '201' )
            {
            	 opt.selected = true;
            }
        }
        else if( cponList[ i ].filterCode == 'HYBRID' )
        {
        	opt = document.createElement("option");
            document.getElementById("structureType").options.add(opt);
            opt.text = getLabel("Hybrid","Hybrid");
            opt.value = "501";
            
            if( structureTypeVal != '' && structureTypeVal == '501' )
            {
            	 opt.selected = true;
            }
            
            partOfHybridFlag = true;
      
        }
        else if( cponList[ i ].filterCode == 'PASSIVE' )
        {

        	opt = document.createElement("option");
            document.getElementById("structureType").options.add(opt);
            opt.text = getLabel("Passive","Passive");
            opt.value = "401";
            
            if( structureTypeVal != '' && structureTypeVal == '401' )
            {
            	 opt.selected = true;
            }
        }        
	}
	
	if( partOfHybridFlag )
	{
		// Part of Hybrid checkbox will be visible only if HYBRID feature is enabled.
        $('#sweepPartOfHybrid').show();
	}
	else
	{
		// Part of Hybrid checkbox will be visible only if HYBRID feature is enabled.
        $('#sweepPartOfHybrid').hide();
	}
}


function setAllowOnTriggerDependentFlags(cponList) {
	for (var i = 0; i < cponList.length; i++) {
		if ('FLMS_000021' === cponList[i].filterCode) {
			allowOntriggerCponFlag = true;
		}
		if ('FLMS_000022' === cponList[i].filterCode) {
			balanceCponFlag = true;
		}
		if ('FLMS_000023' === cponList[i].filterCode) {
			activityCponFlag = true;
		}
		if ('INVESTMENTSWEEP' === cponList[i].filterCode) {
			investmentSweepCponFlag = true;
		}
		
	}
	if(investmentSweepCponFlag)
	{
		$('#investmentSweepDiv').removeClass('hidden');
		if(!document.getElementById("investmentSweep").checked)
		{
			$('#investmentSweep').val('N');
			$('#investmentSweep').attr('checked',false);
			$('#investmentScheme').val('');
			$('#investmentScheme').niceSelect('update');
			$('#investmentSchemeDiv').addClass('hidden');
		}
	}
	else
	{
		$('#investmentSweep').val('N');
		$('#investmentSweep').attr('checked',false);
		$('#investmentScheme').val('');
		$('#investmentScheme').niceSelect('update');
		$('#investmentSweepDiv').addClass('hidden');
		$('#investmentSchemeDiv').addClass('hidden');
	}
	if (allowOntriggerCponFlag) {
		$('#allowOnTriggerDiv').removeClass('hidden');
		//$('#allowOnTrigger').attr('checked', true);
		//$('#allowOnTrigger').val('N');
	} else {
		$('#allowOnTriggerDiv').addClass('hidden');
		//$('#allowOnTrigger').attr('checked', false);
		//$('#allowOnTrigger').val('N');
	}
	/*if (balanceCponFlag) {
		$('#balanceDiv').removeClass('hidden');
		//$('#balance').attr('checked', true);
		//$('#balance').val('Y');
	} else {
		$('#balanceDiv').addClass('hidden');
		//$('#balance').attr('checked', false);
		//$('#balance').val('N');
	}
	if (activityCponFlag) {
		$('#activityDiv').removeClass('hidden');
		//$('#activity').attr('checked', true);
		//$('#activity').val('Y');
	} else {
		$('#activityDiv').addClass('hidden');
		//$('#activity').attr('checked', false);
        //$('#activity').val('N');		
	}*/
}
function checkMasterAccount( me )
{	
	if(pageMode == 'ADD' ||  pageMode == 'EDIT')  
	{	//first time in case of draft or EDIT with no instruction	
	
		if( me.checked == true )
		{
			 $('#masterAccountNmbrDiv').show();
		}
		else
		{
			$('#masterAccountNmbrDiv').hide();
			$('#masterAccountNmbr').val("");
			$('#masterAccountId').val("");
		}
	}
	else if(pageMode == 'EDIT' && me.checked == true)
	{
		 $('#masterAccountNmbrDiv').show();
	}
	else if (pageMode == 'VIEW') 
	{
		
		if( me.checked == true )
		{
			 $('#masterAccountNmbrDiv').show();
		}
	}
	else 
	{
		$('#masterAccountNmbrDiv').hide();
	}
	
}

function setAgreementCcy( me )
{
	if( me )
	{
		if( me.value == 'M' )
		{
			$( '#agreementCurrencyDiv' ).hide();
			$( '#multiLevelFdDiv' ).hide();
			$( '#currencyDesc' ).val("");
			$( '#agreementCurrency' ).val("");
			$( '#multiLevelFd' ).val("N");
			$( '#multiLevelFd' ).attr("checked",false);
			$('#noPostStructureDiv').removeClass('col-lg-offset-1');
			$('#chargeAcctDiv').removeClass('col-lg-offset-1');
		}
		else if( me.value == 'S' )
		{
			$( '#agreementCurrencyDiv' ).show();
			$( '#multiLevelFdDiv' ).show();
			$('#noPostStructureDiv').addClass('col-lg-offset-1');
			$('#chargeAcctDiv').addClass('col-lg-offset-1');
		}
		checkMasterAccount( document.getElementById( 'multiLevelFd' ) );
	}
}

function checkAllowOndemand( me )
{
	if( me.checked == true )
	{
		$( '#partOfHybrid' ).val("N");
		$( '#partOfHybrid' ).attr("checked",false);
		$( '#allowOndemand' ).val("Y");
		$( '#allowOndemand' ).attr("checked",true);
	}
}

function checkAllowOnTrigger ( me )
{
	if( me.checked == true )
	{		
		$( '#allowOnTrigger' ).val('Y')
		if(activityCponFlag){
			$( '#activityDiv' ).removeClass('hidden');
			$( '#activity' ).val('Y');
            $( '#activity' ).attr('checked',true);
		}
		if(balanceCponFlag){
            $( '#balanceDiv' ).removeClass('hidden');
            $( '#balance' ).val('Y');
            $( '#balance' ).attr('checked',true);
        }
		
	}else{
		$( '#allowOnTrigger' ).val('N')
		$( '#allowOnTrigger' ).attr('checked',false);
		$( '#activity' ).val('N');
		$( '#activity' ).attr('checked',false);

		$( '#activityDiv' ).addClass('hidden');
		$( '#balance' ).val('N');
		$( '#balance' ).attr('checked',false);
		$( '#balanceDiv' ).addClass('hidden');
	}
}

function checkBalance ( me )
{
	if( me.checked == true )
	{
		$( '#balance' ).val('Y');
	}
	else
	{
		if(activityCponFlag){
            $( '#balance' ).val('N');
            $( '#activity' ).val('Y');
            $( '#activity' ).attr('checked',true);
            $( '#activityDiv' ).removeClass('hidden');
        }else{
        	$( '#activity' ).val('N');
            $( '#balance' ).val('Y');
            $( '#balance' ).attr('checked',true);
            $( '#balanceDiv' ).removeClass('hidden');
        }
	}
}

function checkInvestmentSweep( me )
{
	if( me == "Y" || me.checked == true )
	{
		$('#investmentSweep').val('Y');
		$('#partOfHybrid').val('N');
		$('#partOfHybrid').attr('checked',false);
		$('#partOfHybrid').attr('disabled', true);
		$('#manageInteraccPos' ).val('N');
		$('#manageInteraccPos').attr('checked',false);
		$('#manageInteraccPos').attr('disabled', true);
		$('#multiLevelFd' ).val('N');
		$('#multiLevelFd').attr('checked',false);
		$('#multiLevelFd').attr('disabled', true);
		$('#masterAccountNmbr' ).val('');
		$('#masterAccountNmbrDiv').hide();
		$('#investmentSchemeDiv').removeClass('hidden');
		$('#investmentSchemeDiv').show();
		if(me == "Y" && document.getElementById("recordKeyNo").value!="")
		{
			$('#investmentScheme').attr('disabled', true);
		}		 
	}
	else
	{
		$('#investmentSweep').val('N');
		$('#investmentSweep').attr('checked',false);
		$('#investmentScheme').val('');
		$('#investmentScheme').niceSelect('update');
		$('#investmentSchemeDiv').hide();
		$('#partOfHybrid').val('N');
		$('#partOfHybrid').attr('disabled', false);
		$('#manageInteraccPos' ).val('N');
		$('#manageInteraccPos').attr('disabled', false);
		$('#multiLevelFd' ).val('N');
		$('#multiLevelFd').attr('disabled', false);
	}
}

function checkActivity( me )
{
	if( me.checked == true )
	{
		$( '#activity' ).val('Y');
	}
	else
	{
		if(balanceCponFlag){
			$( '#activity' ).val('N');
			$( '#balance' ).val('Y');
			$( '#balance' ).attr('checked',true);
			$( '#balanceDiv' ).removeClass('hidden');
		}else{
			$( '#balance' ).val('N');
            $( '#activity' ).val('Y');
            $( '#activity' ).attr('checked',true);
            $( '#activityDiv' ).removeClass('hidden');
		}
	}
}

function checkPartOfHybrid( me )
{
	if( me.checked == true )
	{
		$( '#allowOndemand' ).val("N");
		$( '#allowOndemand' ).attr("checked",false);
		$( '#partOfHybrid' ).val("Y");
		$( '#partOfHybrid' ).attr("checked",true);
	}
}




function setDirtyBit()
{
	document.getElementById( "dirtyBit" ).value = '1';
}

function showAddNewAgreement()
{
	var frm = document.getElementById( "frmMain" );
	frm.action = "showAgreementMstEntryForm.srvc";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showAgreementSweepTree( strUrl, record, rowIndex )
{
	var strData = {};
	var viewState = record.get( 'viewState' );
	strData[ '$viewState' ] = viewState; // temporary
	strData[ csrfTokenName ] = csrfTokenValue;

	$.ajax(
	{
		cache : false,
		data : strData,
		dataType : 'json',
		success : function(data)
		{
			if(null == data.AGREEMENT_SWEEP_ERROR_JSON)
			drawAgreementSweepTree( data.AGREEMENT_SWEEP_TREE_JSON,csrfTokenName,csrfTokenValue,viewState,data.TREEVIEW_TITLE );
			else
			ajaxTreeError(data);
		},
		error : ajaxError,
		url : strUrl,
		type : 'POST'
	} );
}

function showTree( data )
{
	if(null == data.AGREEMENT_SWEEP_ERROR_JSON)
	drawAgreementSweepTree( data.AGREEMENT_SWEEP_TREE_JSON );
	else
	ajaxTreeError(data);	
}

function ajaxError()
{
	alert( "AJAX error, please contact admin!" );
}

function ajaxTreeError(data)
{
	var errMsg = "";
	//init data
	var json = JSON.parse(data.AGREEMENT_SWEEP_ERROR_JSON);
	
	Ext.MessageBox.show(
	{
		title : getLabel( 'filterPopupTitle', 'Error' ),
		msg : json.error,
		buttons : Ext.MessageBox.OK,
		icon : Ext.MessageBox.ERROR
	} );
}

function createFormField ( element, type, name, value ) {
	
	var inputField;
	inputField = document.createElement( element );
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;
	return inputField;
}

function onNoPostStructureChange(me) {
	
	if(pageMode == 'ADD' || pageMode == 'EDIT') {	//first time in case of draft or EDIT with no instruction	
		
		if(! me.checked == true )
		{
			$('#liveDateDiv').show();
			if($('#ccyRestriction').val() !== 'M' && $('#ccyRestriction').val() !== '')
			$('#chargeAcctDiv').addClass("col-lg-offset-1");
		}
		else
		{
			$('#liveDateDiv').hide();
			if( $('#ccyRestriction').val() !== 'S' && $('#ccyRestriction').val() !== '')
			$('#chargeAcctDiv').removeClass("col-lg-offset-1");
		}
		}
		else if (pageMode == 'VIEW') {
			
			if(! me.checked == true )
			{
				$('#liveDateDiv').show();
				$('#chargeAcctDiv').addClass("col-lg-offset-1");
			}
		}
		else {
			$('#liveDateDiv').hide();	
			$('#chargeAcctDiv').removeClass("col-lg-offset-1");
		}
	
}

jQuery.fn.clientCodeEntrySeekAutoComplete= function(seller) {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/userseek/AgreementFrequencyClientCodeSeek.json",
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term,										
										//$sellerCode : seller,
										$filtercode1 : seller,
										$top:-1
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {														
														label : item.DESCRIPTION,														
														bankDtl : item
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.bankDtl;
						if (data) {
							if (!isEmpty(data.DESCRIPTION))
							{
								$('#investmentSweep').val('N');
								$('#investmentSweep').attr('checked',false);
								$('#investmentScheme').val('');
								$('#investmentScheme').niceSelect('update');
								$('#clientDescription').val(data.DESCRIPTION);
								$('#clientCode').val(data.CODE);
								clientComboChanged(data.CODE);
							}
						}
					},
					change : function(event, ui){
						var value = ui.item;
						if(null === value){
							$('#investmentSweep').val('N');
							$('#investmentSweep').attr('checked',false);
							$('#investmentScheme').val('');
							$('#investmentScheme').niceSelect('update');
							$('#clientDescription').val("");
							$('#clientCode').val("");							
						}
					},
					open : function() {
						$(this).removeClass("ui-corner-all")
								.addClass("ui-corner-top");
					},
					close : function() {
						$(this).removeClass("ui-corner-top")
								.addClass("ui-corner-all");
					}
				});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:200px;">'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

function callClientSeek() {
	$('#clientDescription').clientCodeEntrySeekAutoComplete(seller);
}
function clientComboChanged(selectedClient) {
	setCponEnforcedStructureType();
	structureTypeChange();
}
jQuery.fn.agreementCurrencyAutoCompleter= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/userseek/sweepAgreementMstCcySeek.json",
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term,
										$filtercode1 : $('#clientCode').val(),
										$top:-1
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {														
														label : item.DISPLAYFIELD,														
														ccyDtl : item
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.ccyDtl;
						if (data) {
							if (!isEmpty(data.DESCR))
							{
								$('#currencyDesc').val(data.DESCR);
								$('#agreementCurrency').val(data.CODE);
								setDirtyBit();
							}
						}
					},
					change : function(event, ui){
						var value = ui.item;
						if(null === value){
							$('#currencyDesc').val("");
							$('#agreementCurrency').val("");
						}
					},
					open : function() {
						$(this).removeClass("ui-corner-all")
								.addClass("ui-corner-top");
					},
					close : function() {
						$(this).removeClass("ui-corner-top")
								.addClass("ui-corner-all");
					}
				});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:200px;">'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};
jQuery.fn.chargeAccountAutoCompleter= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/userseek/sweepChargeAccountSeek.json",
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term,
										$sellerCode: $('#sellerId').val(),
										$filtercode1: $('#clientCode').val(),
										$filtercode2: user,
										$top:-1
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {														
														value : item.CODE,
														label: item.DISPLAYFIELD,
														ccyDtl : item
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.ccyDtl;
						if (data) {
							if (!isEmpty(data.DESCRIPTION))
							{
								$('#chargeAccountNmbr').val(data.CODE);
								setDirtyBit();
							}
						}
					},
					change : function(event, ui){
						var value = ui.item;
						if(null === value){
							$('#chargeAccountNmbr').val("");
						}
					},					
					open : function() {
						$(this).removeClass("ui-corner-all")
								.addClass("ui-corner-top");
					},
					close : function() {
						$(this).removeClass("ui-corner-top")
								.addClass("ui-corner-all");
					}
				});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:200px;">'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};
jQuery.fn.masterAccountAutoCompleter= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/userseek/sweepMasterAccountSeek.json",
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term,
										$sellerCode: $('#sellerId').val(),
										$filtercode1: $('#clientCode').val(),
										$filtercode2:$('#agreementCurrency').val(),
										$filtercode3: user,
										$top:-1
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {														
														label : item.DISPLAYFIELD,
														value: item.CODE,
														ccyDtl : item
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.ccyDtl;
						if (data) {
							if (!isEmpty(data.ACCTID))
							{
								$('#masterAccountId').val(data.ACCTID);
								$('#masterAccountNmbr').val(data.CODE);
								setDirtyBit();
							}
						}
					},
					open : function() {
						$(this).removeClass("ui-corner-all")
								.addClass("ui-corner-top");
					},
					close : function() {
						$(this).removeClass("ui-corner-top")
								.addClass("ui-corner-all");
					}
				});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:200px;">'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};
function setAllDatePickers(type)
{
	$('#entryDate').datepicker({
			dateFormat : dateFormat,
			changeMonth: true,
		    changeYear: true,
			appendText : '',
			minDate: dtApplicationDate,
			defaultDate: dtApplicationDate,
			onSelect : function(selectedDate){
				var obj = $(this);
				setTimeout(function(){obj.trigger('blur');},300);
			}
			
		}).attr('readOnly',true);
	 
	 $('#liveDate').datepicker({
			dateFormat : dateFormat,
			changeMonth: true,
		    changeYear: true,
			appendText : '',
			minDate: dtApplicationDate,
			defaultDate: dtApplicationDate,
			onSelect : function(selectedDate){
				var obj = $(this);
				setTimeout(function(){obj.trigger('blur');},300);
			}
			
		}).attr('readOnly',true);
	 
	 $('#endDate').datepicker({
			dateFormat : dateFormat,
			changeMonth: true,
		    changeYear: true,
			appendText : '',
			minDate: dtApplicationDate,
			onSelect : function(selectedDate){
				var obj = $(this);
				setTimeout(function(){obj.trigger('blur');},300);
			}
			
		}).attr('readOnly',true);
	 
	 $('#startDate').datepicker({
			dateFormat : dateFormat,
			changeMonth: true,
		    changeYear: true,
			appendText : '',
			minDate: dtApplicationDate,
			defaultDate: dtApplicationDate,
			onSelect : function(selectedDate){
				var obj = $(this);
				setTimeout(function(){obj.trigger('blur');},300);
			},
			onClose : function(selectedDate){
				var obj = $(this);
				$("#origStartDate").val(selectedDate);
				setDirtyBit();
				var dtStart = $(this).datepicker('getDate');
				if (dtStart != null) {
					dtStart.setDate(dtStart.getDate());
					dtStart = dtStart ? dtStart : new Date(year, month - 1, parseInt(day,10)+1);
					$("#endDate").datepicker("option", "minDate",
								dtStart);
					}
				setTimeout(function(){obj.trigger('blur');},300);
			}
			
		}).attr('readOnly',true);
	 
	 $('#origStartDate').datepicker({
			dateFormat : dateFormat,
			changeMonth: true,
		    changeYear: true,
			appendText : '',
			maxDate: dtApplicationDate,
			defaultDate: dtApplicationDate,
			onSelect : function(selectedDate){
				var obj = $(this);
				setTimeout(function(){obj.trigger('blur');},300);
			}
			
		}).attr('readOnly',true);
		
		if (liveDateModel == null || liveDateModel == '') {
		$('#liveDate').val(dtApplicationDate);
	} else {
		$('#liveDate').val(liveDateModel);
	}

	if (startDateModel == null || startDateModel == '') {
		$('#startDate').val(dtApplicationDate);
	} else {
		$('#startDate').val(startDateModel);
	}
	if (type == 'sweep')
		if (origStartDateModel == null || origStartDateModel == '') {
			$('#origStartDate').val(dtApplicationDate);
		} else {
			$('#origStartDate').val(origStartDateModel);
		}
	if (entryDateModel == null || entryDateModel == '') {
		$('#entryDate').val(dtApplicationDate);
	} else {
		$('#entryDate').val(entryDateModel);
	}
}

function toUpperAgreementName(ctrl)
{
    if (ctrl)
    {
        ctrl.value = ctrl.value.toUpperCase().replace(/([^0-9A-Za-z ])/g, "");
    }
}

function onSellerChange(seller,type)
{
	//createClientCodeAutoCompletor( seller.value );
	document.getElementById("sellerId").value = seller.value;
	$('#clientCode').val("");
	$('#clientDescription').val("");
	$('#structureType').val("");//structutrtype
	$('#agreementCode').val("");//agreementcode
	$('#agreementName').val("");//agreemanename
		if(type == 'sweep')
		{
	$('#ccyRestriction').val("S");//currencyrestr
	$('#origStartDate').val(dtApplicationDate);//orignla strat
	$('#masterAccountNmbr').val("");//masterAccountNmbr
	$('#manageInteraccPos').val("");
	$('#multiLevelFd').val("");
		}
	$('#currencyDesc').val("");//agreemnetcurre
		if(type != 'hybrid')
	$('#chargeAccountNmbr').val("");//chargeaccnt
	
	$('#entryDate').val(entryDateModel);//entrydate
	$('#liveDate').val(liveDateModel);//livedate
	$('#startDate').val(startDateModel);//agreement strat date
	$('#endDate').val("");//end date
	$('#noPostStructure').val("");
	$('#migrated').val("");
	clientComboChanged("");
	
	
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
	if(strEntityType=='1')
	{
		//$('#clientDesc').val(strClientDesc);	
	}	
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}