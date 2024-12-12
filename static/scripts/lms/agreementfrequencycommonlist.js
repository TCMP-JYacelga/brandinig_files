function showAdvancedFilter(fptrCallback)
{
	var dlg = $('#advanceFilter');
	dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:true, width:480,title : 'Advanced Filter',
					buttons: {"Continue": function() {$(this).dialog("close"); fptrCallback.call(null, 'showPaymentsListBatch.form');},
					Cancel: function() {$(this).dialog('close'); }}});
	dlg.dialog('open');
}

function acceptRecord(ctrl, mode, status, index, maker)
{
	var strAuthIndex = document.getElementById("updateIndex").value;
	var strActionMap = document.getElementById("actionmap").value;
	if( index.length < 2)
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
	if( aPosition >= 0)
	{
		document.getElementById( "updateIndex" ).value = strAuthIndex.replace(
				strAuthIndex.substring( aPosition, aPosition + 3 ), "" );
		mapPosition = strActionMap.indexOf( index + ":" );
		document.getElementById( "actionmap" ).value = strActionMap.replace(strActionMap.substring( mapPosition, mapPosition + 10 ), "" );
	}
	else
	{
		strCurrentAction = arrBatchInst[ status ];
		if( !strCurrentAction )
			strCurrentAction = "00000";
		document.getElementById( "actionmap" ).value = index + ":"
				+ strCurrentAction + ","
				+ document.getElementById( "actionmap" ).value;
		document.getElementById( "updateIndex" ).value = index + ","
				+ document.getElementById( "updateIndex" ).value;
	}
	if (ctrl.className.indexOf("acceptlink") > -1)
	{
		ctrl.className = "linkbox acceptedlink";
	}
	else
	{
		ctrl.className = "linkbox acceptlink";
	}
	// perform the operation of bitwise anding
	lenDelimAction = document.getElementById("actionmap").value.length;
	if( lenDelimAction > 1)
	{
		strDelimAction = document.getElementById("actionmap").value;
		strDelimAction = strDelimAction.substring(0, lenDelimAction-1);
		strArrSplitAction = strDelimAction.split(",");
		
		for( var i=0;i<strArrSplitAction.length;i++)
		{
			strArrSplitAction[i] = strArrSplitAction[i]
					.substring(strArrSplitAction[i].indexOf(":")+1);
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
		refreshButtons( maker );
	}
	else
	{
		strFinalBitmap = _strValidActions;
		document.getElementById( "bitmapval" ).value = strFinalBitmap;
		refreshButtons( maker );
	}
	refreshButtons('1');
}

function performAnd( validAction, currentAction )
{
	var strOut = "";
	var i = 0;
	if( validAction.length = currentAction.length )
	{
		for( i = 0 ; i < 5 ; i++ )
		{
			strOut = strOut
					+ ( ( validAction.charAt( i ) * 1 ) && ( currentAction
							.charAt( i ) * 1 ) );
		}
	}
	return strOut;
}

function refreshButtons( maker )
{
	var strPopultedButtons = document.getElementById( "bitmapval" ).value;
	var strActionButtons;
	// DO THE ANDING WITH SERVER BITMAP
	strActionButtons = performAnd( strPopultedButtons, _strServerBitmap );
	var i = 0;
	if( strActionButtons.length > 0 )
	{
		for( i = 0 ; i < 5 ; i++ )
		{
			switch( i )
			{
				case 0:
					if( strActionButtons.charAt( i ) * 1 == 1 &&  maker != _strUserCode)
					{
						document.getElementById( "btnAuth" ).className = "imagelink black inline button-icon icon-button-accept font_bold";
					}
					else
					{
						document.getElementById( "btnAuth" ).className = "imagelink grey inline button-icon icon-button-accept-grey font-bold";
					}
					break;
				case 1:
					if( strActionButtons.charAt(i)*1 ==1 &&  maker != _strUserCode)
					{
						document.getElementById("btnReject").className ="imagelink black button-icon icon-button-reject font_bold";
					}
					else
					{
						document.getElementById( "btnReject" ).className = "imagelink grey button-icon icon-button-reject-grey font-bold";
					}
					break;
				
				
				case 2:
					if( strActionButtons.charAt( i ) * 1 == 1 )
					{
						document.getElementById( "btnEnable" ).className = "imagelink black inline button-icon icon-button-enable font_bold";
					}
					else
					{
						document.getElementById( "btnEnable" ).className = "imagelink grey inline button-icon icon-button-enable-grey font-bold";
					}
					break;
				case 3:
					if( strActionButtons.charAt( i ) * 1 == 1 )
					{
						document.getElementById("btnDisable").className ="imagelink black inline button-icon icon-button-disable font_bold";
					}
					else
					{
						document.getElementById("btnDisable").className ="imagelink grey inline button-icon icon-button-disable-grey font-bold";
					}
					break;
				case 4:

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

function showViewPir(index)
{
	var strUrl;
	strUrl = _strViewAction;
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
    document.getElementById("txtCurrent").value =0;
	frm.action = strUrl;
	frm.method = "POST";
	frm.target = "";
	frm.submit();
}
function showHistoryForm(strUrl, index)
{	
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 400)/2;
	var strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=550,height=350";

	var frm = document.forms["frmMain"];
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "hWinHistory";
	frm.method = "POST";

	window.open ("", "hWinHistory", strAttr);
	frm.submit();
}

function showEditPirForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
        document.getElementById("txtCurrent").value = 0;
	frm.action = strUrl;
	frm.method = "POST";
	frm.target = "";
	frm.submit();
}

function deleteList(me)
{
	if (me.className.startsWith("imagelink grey"))
		return;
	var frm = document.forms["frmMain"];
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atleast One Record")
		return;
	}
	document.getElementById("txtIndex").value = document.getElementById("updateIndex").value;
	frm.target ="";
	frm.action = "undoAgreementFrequency.form";
	frm.method = "POST";
	frm.submit();
}

function deleteRecord(arrData, strRemarks)
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
		document.getElementById("txtIndex").value = arrData;
		frm.target = "";
		frm.action = "undoAgreementFrequency.form";
		frm.method = 'POST';
		frm.submit();
	}
}



function getRejectRecord(me, rejTitle, rejMsg)
{
	var temp = document.getElementById("btnReject");
	if (temp.className.startsWith("imagelink grey"))
		return;
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atleast One Record")
		return;
	}
	getRemarks(230, rejTitle, rejMsg, [document.getElementById("updateIndex").value], rejectRecord);
}

function rejectRecord(arrData, strRemarks)
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
		document.getElementById("txtIndex").value = arrData;
		frm.target = "";
		frm.action = "rejectAgreementFrequency.form";
		frm.method = 'POST';
		frm.submit();
	}
}

String.prototype.startsWith = function(str) 
{return (this.match("^"+str)==str)}

function showAddInstructionMst(strUrl)
{
	var frm = document.forms["frmMain"]; 
	$('#instructionName').val('');
	$('#frequencyName').val('');
	$('#viewState').val('');
	frm.action = strUrl;
	frm.method = "POST";
	frm.target = "";
	frm.submit();
}

function authSubmit(me)
{
	if (me.className.startsWith("imagelink grey"))
		return;
	var frm = document.forms["frmMain"];
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atleast One Record")
		return;
	}
	document.getElementById("txtIndex").value = document.getElementById("updateIndex").value;
	frm.target ="";
	frm.action = "acceptAgreementFrequency.form";
	frm.method = "POST";
	frm.submit();
}

function enableRecord(me)
{
	if (me.className.startsWith("imagelink grey"))
		return;
	var frm = document.forms["frmMain"];
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atleast One Record")
		return;
	}
	document.getElementById("txtIndex").value = document.getElementById("updateIndex").value;
	frm.target ="";
	frm.action = "enableAgreementFrequency.form";
	frm.method = "POST";
	frm.submit();

}

function disableRecord(me)
{
	if (me.className.startsWith("imagelink grey"))
		return;
	var frm = document.forms["frmMain"];
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atleast One Record")
		return;
	}
	document.getElementById("txtIndex").value = document.getElementById("updateIndex").value;
	frm.target ="";
	frm.action = "disableAgreementFrequency.form";
	frm.method = "POST";
	frm.submit();
}

function getRejectRecord(me, rejTitle, rejMsg)
{
	var temp = document.getElementById("btnReject");
	if (temp.className.startsWith("imagelink grey"))
		return;
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atleast One Record")
		return;
	}
	getRemarks(230, rejTitle, rejMsg, [document.getElementById("updateIndex").value], rejectRecord);
}

function rejectRecord(arrData, strRemarks)
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
		document.getElementById("txtIndex").value = arrData;
		frm.target = "";
		frm.action = "rejectAgreementFrequency.form";
		frm.method = 'POST';
		frm.submit();
	}
}

function deleteRecord(me)
{
	if (me.className.startsWith("imagelink grey"))
		return;
	var frm = document.forms["frmMain"];
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atleast One Record")
		return;
	}
	document.getElementById("txtIndex").value = document.getElementById("updateIndex").value;
	frm.target ="";
	frm.action = "undoAgreementFrequency.form";
	frm.method = "POST";
	frm.submit();
}

function showListBack(me,strUrl)
{
	if (me != "" && me.className.startsWith("imagelink grey"))
		return;
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();	
}
function getRecord( json, elementId, fptrCallback )
{
	var myJSONObject = JSON.parse( json );
	var inputIdArray = elementId.split( "|" );
	for( i = 0 ; i < inputIdArray.length ; i++ )
	{
		var field = inputIdArray[ i ];
		if( document.getElementById( inputIdArray[ i ] )
				&& myJSONObject.columns[ i ] )
		{
			var type = document.getElementById( inputIdArray[ i ] ).type;
			if( type == 'text' )
			{
				document.getElementById( inputIdArray[ i ] ).value = myJSONObject.columns[ i ].value;
			}
			else if( type == 'hidden' )
			{
				document.getElementById( inputIdArray[ i ] ).value = myJSONObject.columns[ i ].value;
			}
			else
			{
				document.getElementById( inputIdArray[ i ] ).innerHTML = myJSONObject.columns[ i ].value;
			}
		}
	}
	if( !isEmpty( fptrCallback ) && typeof window[ fptrCallback ] == 'function' )
		window[ fptrCallback ]( json, elementId );
}