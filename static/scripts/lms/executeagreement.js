function navigate(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.target = "";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
 	return;

}

function undo(strUrl,index)
{
	var frm = document.forms["frmMain"];
	frm.target = "";
	document.getElementById("txtIndex").value=index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
 	return;

}
function showBack()
{
	var args = showBack.arguments;
	if (args.length > 0)
		window.location = args[0];
	else
		window.location = "welcome.jsp";
	return true;
}
function execute(me,strUrl,index)
{
	if (rrIndex.indexOf(index) >=0 )
	{
		var remIndex ="";
		var arr = rrIndex.split(',');
		for (i = 0 ;i <arr.length; i++)
		{
			if (parseInt(arr[i],10) == parseInt(index,10))
				continue;
			remIndex = remIndex+','+arr[i];

		}
		rrIndex = remIndex.substring(1);
		document.getElementById('rIndex').value=rrIndex;
		me.src="static/images/checked.gif";
		totalSize = parseInt(totalSize,10) + 1;
		return;
	}

	var frm = document.forms["frmMain"];
	document.getElementById("txtIndex").value = index;

	frm.target = "";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
 	return;

}
function save(strUrl,method)
{
	if (totalSize  <= 0)
	{
		showError(strNoRecordMsg,null);
		return false;
	}
	showAlert(strConfMessage,null,[strUrl], method);

}
function doFilter(strUrl)
{
	var intPg = 0;
	var frm = document.forms["frmMain"];
	document.getElementById("newFilter").value="new";
	try
	{
		document.getElementById("txtCurrent").value = intPg;
	}
	catch(e)
	{
		document.getElementById("txtDetail").value = intPg;
	}
	frm.target = "";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function executeAgreement(strUrl)
{
	try
	{
		document.getElementById("F11").disabled= true;
	}
	catch(e)
	{
	}
	try
	{
		document.getElementById("F9").disabled= true;
	}
	catch(e)
	{
	}
	var value = document.getElementById("saveState").value;
	if (value == null || value == '')
		return;
	var frm = document.forms["frmMain"];
	frm.target = "";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function remove(me,strUrl,index)
{
	if (rrIndex == null || rrIndex == '')
		rrIndex = index;
	else
		rrIndex = rrIndex +','+index;
	if (me.src.indexOf('unchecked') >= 0)
	{
		execute(me,strUrl,index);
		return true;
	}
	totalSize = parseInt(totalSize,10) - 1;
	me.src="static/images/unchecked.gif";
	document.getElementById("rIndex").value =rrIndex;
	return false;
}

function call(str)
{
	if(str=='F12')
	{
		if (backURL != null && backURL != '')
		{
			navigate(backURL);
		}
		else
			showBack('welcome.jsp');
	}
	else if(str=='F11')
	{
		save(saveURL,executeInstr);
	}
	else if (str=="F3")
	{

		doFilter(url);
	}
	else if (str == "F2")
	{
		navigate('execInstructionList.form');
	}
	else if (str == 'F9')
	{
		save('aexecuteInstructions.form',executeInstr);
	}
	return true;
}
// List navigation
function prevPage(strUrl, intPg)
{
	var frm = document.forms["frmMain"];
	if (isNaN(intPg) || isNaN(lastPage))
	{
		showError("Page number can accept integer only",null);
		return;
	}
	if(parseInt(intPg,10) >= parseInt(lastPage,10))
	{
		showError('Page Number cannot be greater than total number of pages!',null);
		return;
	}
	else if (parseInt(intPg,10) < 0 )
	{
		showError('Page Number should be greater than Zero!',null);
		return;

	}

	try
	{
		document.getElementById("txtCurrent").value = intPg;
	}
	catch(e)
	{
		document.getElementById("txtDetail").value = intPg;
	}
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function nextPage(strUrl, intPg)
{
	var frm = document.forms["frmMain"];
	if (isNaN(intPg) || isNaN(lastPage))
	{
		showError("Page number can accept integer only",null);
		return;
	}

	if(parseInt(intPg,10) >= parseInt(lastPage,10))
	{
		showError('Page Number cannot be greater than total number of pages!',null);
		return;
	}
	else if (parseInt(intPg,10) <= 0 )
	{
		showError('Page Number should be greater than Zero!',null);
		return;

	}
	try
	{
		document.getElementById("txtCurrent").value = intPg;
	}
	catch(e)
	{
		document.getElementById("txtDetail").value = intPg;
	}
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function goPgNmbr(strUrl, totalPages)
{
	var frm = document.forms["frmMain"];
	var pgNmbr = document.getElementById("pageNum").value;

	if (isNaN(pgNmbr) || isNaN(totalPages))
	{
		showError("Page number can accept integer only",null);
		return false;
	}

	if (parseInt(pgNmbr,10) > parseInt(totalPages,10))
	{
			showError('Page Number cannot be greater than total number of pages!',null);
			return false;
	}
	else if (parseInt(pgNmbr,10)<=0)
	{
		showError('Page Number should be greater than Zero!',null);
		return false;
	}
	else if (parseInt(pgNmbr,10) === parseInt(currPage,10))
	{
		return;
	}
	try
	{
		document.getElementById("txtCurrent").value = pgNmbr - 1;
	}
	catch(e)
	{
		document.getElementById("txtDetail").value = pgNmbr - 1;
	}
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function reject(arrData,retVal)
{
	var frm = document.forms["frmMain"];
	frm.rejectRemarks.value = retVal;
	document.getElementById("txtIndex").value = arrData[1];
	frm.action = arrData[0];
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
	frm.target="";
}

function authAgreementExecute(me)
{
	if (me.className.startsWith("imagelink grey"))
		return;
	var frm = document.forms["frmMain"];

	var selectedIndex = document.getElementById("updateIndex").value;
	if (selectedIndex == "")
	{
		alert("Select Atleast One Record")
		return;
	}
	if (selectedIndex.length < 3)
	{
		showError(strOndemandErrMsg, null);
		return false;
	}
	document.getElementById("txtIndex").value = selectedIndex;
	frm.target ="";
	frm.action = "acceptExecuteAgreementList.form";
	frm.method = "POST";
	frm.submit();
}
function rejectAgreementExecute(me, rejTitle, rejMsg)
{
	var temp = document.getElementById("btnReject");
	if (temp.className.startsWith("imagelink grey"))
		return;
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atleast One Record")
		return;
	}
	getRemarks(230, rejTitle, rejMsg, [document.getElementById("updateIndex").value], rejectInstRecord);
}

function rejectInstRecord(arrData, strRemarks)
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
		frm.action = "rejectExecuteAgreementList.form";
		frm.method = 'POST';
		frm.submit();
	}
}

function acceptRecord( ctrl, status, index )
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
				strAuthIndex.substring( aPosition, aPosition + 2 ), "" );
		mapPosition = strActionMap.indexOf( index + ":" );
		// alert('map position' + mapPosition);
		document.getElementById( "actionmap" ).value = strActionMap.replace(
				strActionMap.substring( mapPosition, mapPosition + 9 ), "" );
		//alert('Final Value' + document.getElementById("actionmap").value) ;
	}
	else
	{
		document.getElementById( "updateIndex" ).value = index + ","
				+ document.getElementById( "updateIndex" ).value;
		// alert('mode ' + mode + 'Request state ' + status);
		strCurrentAction = arrBatchInst[status];

		document.getElementById( "actionmap" ).value = index + ":"
				+ strCurrentAction + ","
				+ document.getElementById( "actionmap" ).value;
		//alert('Final Value' + document.getElementById("actionmap").value) ;
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
	// alert(mode +":"+ _strValidActions + ":" +status);
	lenDelimAction = document.getElementById( "actionmap" ).value.length;
	if( lenDelimAction > 1 )
	{
		strDelimAction = document.getElementById( "actionmap" ).value;
		strDelimAction = strDelimAction.substring( 0, lenDelimAction - 1 );
		strArrSplitAction = strDelimAction.split( "," );
		for( var i = 0 ; i < strArrSplitAction.length ; i++ )
		{
			strArrSplitAction[i] = strArrSplitAction[i]
					.substring( strArrSplitAction[i].indexOf( ":" ) + 1 );
		}
		// alert('Binaries :: ' + strArrSplitAction);

		if( strArrSplitAction.length == 1 )
		{
			strFinalBitmap = strArrSplitAction[0];
		}
		else
		{
			lenLooplen = strArrSplitAction.length - 1;
			// alert('Loop len' + lenLooplen);
			for( var j = 0 ; j < lenLooplen ; j++ )
			{
				if( j == 0 )
				{
					// alert('Anding the first');
					strFinalBitmap = performAnd( strArrSplitAction[j],
							strArrSplitAction[j + 1] );
				}
				else
				{
					// alert('Anding the Subsequent');
					strFinalBitmap = performAnd( strFinalBitmap,
							strArrSplitAction[j + 1] );
				}
			}
		}
		// alert('Final Bitmap ::: ' + strFinalBitmap);
		document.getElementById( "bitmapval" ).value = strFinalBitmap;
		refreshButtons();
	}
	else
	{
		strFinalBitmap = _strValidActions;
		document.getElementById( "bitmapval" ).value = strFinalBitmap;
		refreshButtons();
	}
}

function performAnd( validAction, currentAction )
{
	var strOut = "";
	var i = 0;
	if( validAction.length = currentAction.length )
	{
		for( i = 0 ; i < 2 ; i++ )
		{
			strOut = strOut
					+ ( ( validAction.charAt( i ) * 1 ) && ( currentAction
							.charAt( i ) * 1 ) );
		}
	}
	return strOut;
}

function refreshButtons()
{
	var strPopultedButtons = document.getElementById( "bitmapval" ).value;
	var strActionButtons;
	// DO THE ANDING WITH SERVER BITMAP
	strActionButtons = performAnd( strPopultedButtons, _strServerBitmap );
	var i = 0;
	if( strActionButtons.length > 0 )
	{
		for( i = 0 ; i < 2 ; i++ )
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
			}
		}
	}
}

function getRecord(json, elementId, fptrCallback)
{
	var myJSONObject = JSON.parse(json);
	var inputIdArray = elementId.split("|");
	for(i=0; i<inputIdArray.length; i++)
	{
		    var field = inputIdArray[i];
		    if(document.getElementById(inputIdArray[i]) && myJSONObject.columns[i])
		    {
			      var type = document.getElementById(inputIdArray[i]).type;
			      if(type=='text')
			      {
			           document.getElementById(inputIdArray[i]).value=myJSONObject.columns[i].value;
			      }
			      else if (type == 'hidden')
			      {
			           document.getElementById(inputIdArray[i]).value=myJSONObject.columns[i].value;
			      }
			      else
			      {
			           document.getElementById(inputIdArray[i]).innerHTML=myJSONObject.columns[i].value;
			      }
		    }
	 }
	if (!isEmpty(fptrCallback) && typeof window[fptrCallback] == 'function')
		window[fptrCallback](json, elementId);
}

function showListBack()
{
	var url = 'authExecuteAgreementList.form';
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = url;
	frm.method = "POST";
	frm.submit();
}