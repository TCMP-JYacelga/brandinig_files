function showList(strUrl)
{
	if(formName=="View")
	{
		strUrl="mt920RequestList.form";
	}
	window.location = strUrl;
}

function showViewForm(strUrl, index)
{
	var frm = document.forms["frmMain"];
	frm.txtIndex.value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function showEditForm(strUrl, index)
{
	var frm = document.forms["frmMain"];
	frm.txtIndex.value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function sendMt920(me, arrErrorMsg, strUrl, index )
{
	if( me.className.startsWith( "imagelink grey" ) )
		return;
	if( document.getElementById( "updateIndex" ).value == "" )
	{
		alert( "Select Atlease One Record" )
		return;
	}
	var errorMsg = getFormattedMsg( arrErrorMsg );
	requestArray	=	new Array();
	requestCount	=	0;
	showAlert(errorMsg,null,['saveMt920Request.form', index], PreSave);
	return;
}

function getFormattedMsg( arrMsg )
{

    	var returnMsg = '<span style="font-size:11;color:black;"><font style="font-weight:bold">'+ arrMsg[0]
	    		      +'</font><br/><br/><br/><input type="checkbox" name="MT941" id="MT941" value="MT941" onClick="checkMtType(this)">MT941 </input>'
	    		      +'<input type="checkbox" name="MT942" id="MT942" value="MT942" onClick="checkMtType(this)">MT942 </input>'
	    		      +'<input type="checkbox" name="MT940" id="MT940" value="MT940" onClick="checkMtType(this)">MT940 </input>'
	    		      +'<input type="checkbox" name="MT950" id="MT950" value="MT950" onClick="checkMtType(this)">MT950 </input>'
			      + '</span>' ;
	return returnMsg ;
}

function PreSave(arrData)
{
    if (requestArray.length > 0)
		showAlert('This message will generate a MT 920, For ('+requestArray + ') Are you sure you wish to proceed ?.', "MT920 Request", arrData, Save);
    else
		showError('Please select valid message type(s) !',"MT920 Request");
}

function call(str)
{
	if(str=='F3')
	{
		filter(mode,'enrichmentLevel');
	}
	if(str=='F12')
	{
		showList('welcome.jsp');
	}
}

function Save(arrData)
{
	var frm = document.forms["frmMain"];
	frm.txtIndex.value = arrData[1];
	frm.action = arrData[0];
	frm.method = "POST";
	frm.submit();
}

function checkMtType(me)
{
    var requestType = document.getElementById("requestType");
    var tempArray = new Array();
    var tempCount =	0;
    if(me.checked)
    {
	requestArray[requestCount++] =  me.value
    }
    else
    {
	 for(var i=0;i<requestArray.length;i++)
	 {
	     if ( me.value != requestArray[i] )
	      tempArray[tempCount++] =   requestArray[i];
         }
	requestArray = tempArray;
	requestCount = tempCount;
    }
    requestType.value = requestArray;
}


function acceptRecord( ctrl, index)
{

	var strAuthIndex = document.getElementById( "updateIndex" ).value;

	if( index.length < 2 )
	{
		index = '0' + index;
	}
	var aPosition = strAuthIndex.indexOf( index );

	if( aPosition >= 0 )
	{
		document.getElementById( "updateIndex" ).value = strAuthIndex.replace(
				strAuthIndex.substring( aPosition, aPosition + 3 ), "" );
	}
	else
	{
		document.getElementById( "updateIndex" ).value = index + ","
				+ document.getElementById( "updateIndex" ).value;
	}
	if(ctrl.className.indexOf( "acceptlink" ) > -1 )
	{
		document.getElementById( "btnRequest" ).className = "imagelink black inline button-icon icon-button-release font_bold";
	}
	else if(document.getElementById( "updateIndex" ).value == "")
	{
		document.getElementById( "btnRequest" ).className = "imagelink grey inline button-icon icon-button-release font_bold";
	}
	if( ctrl.className.indexOf( "acceptlink" ) > -1 )
	{
		ctrl.className = "linkbox acceptedlink";
	}
	else
	{
		ctrl.className = "linkbox acceptlink";
	}

}
