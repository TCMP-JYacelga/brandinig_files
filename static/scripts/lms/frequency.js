
/*------------------------------------------------------------------------------
 * NAME   : selectDayOf(element)
 * PURPOSE: Depending upon the current value of selected frequency drop down
 *          enable the 'dayOfWeek' or 'dayOfMonth' text boxes.
 *----------------------------------------------------------------------------*/
function getRecord(json,elementId)
{	
	var myJSONObject = JSON.parse(json);
    var inputIdArray = elementId.split("|");
    for (i=0; i < inputIdArray.length; i++)
	{
    	if (document.getElementById(inputIdArray[i]) && myJSONObject.columns[i])
    	{
			if (null == myJSONObject.columns[i].value)
				myJSONObject.columns[i].value = "";
    		var type = document.getElementById(inputIdArray[i]).type;
    		if (type == 'text' || type == 'hidden')
    	    {
    			document.getElementById(inputIdArray[i]).value=myJSONObject.columns[i].value;
    		}
    		else
    	    {
    			document.getElementById(inputIdArray[i]).innerHTML=myJSONObject.columns[i].value;
    		} 
    	}
	}    
}
function selectDayOf(thisVar)
{
	var val = thisVar.options[thisVar.selectedIndex].value;
	var elmDow = document.getElementById("dayOfWeek");
	var elmDom = document.getElementById("dayOfMonth");

	if ("W" == val)
	{
		elmDow.disabled = false;
		elmDom.disabled = true;
		elmDom.value = "";
	}
	else if ( val == 'M')
	{
		elmDom.disabled = false;
		elmDow.disabled = true;
		elmDow.value = "";
	}
	return false;
}
function filter(mode)
{
	var strUrl = null; 
	var frm = document.forms["frmMain"];
	frm.target ="";
	if(mode=='AUTH')
	{
	   strUrl ="frequencyAuthList.form";
	}
	else
	{
	   strUrl ="frequencyList.form";
	}
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function showAddNewForm(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();	
}
function discardRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	frm.txtIndex.value = index;
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function showListBack(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function showViewForm(index,modeVal)
{
	var frm = document.forms["frmMain"]; 
	frm.txtIndex.value = index;
	if(modeVal == "AUTH")
	{
		strUrl = "authViewFrequency.form";
	}
	else
	{
		strUrl ="viewFrequency.form";
	}
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function saveForm(strUrl)
{
	var frm = document.forms["frmMain"]; 
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function showEditForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	frm.txtIndex.value = index;
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function enableRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	frm.txtIndex.value = index;
	frm.target ="";
	frm.action = "enableFrequency.form";
	frm.method = "POST";
	frm.submit();
}

function disableRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	frm.txtIndex.value = index;
	frm.target ="";
	frm.action = "disableFrequency.form";
	frm.method = "POST";
	frm.submit();
}
function acceptRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	frm.txtIndex.value = index;
	frm.target ="";
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}

function rejectRecord(arrData,strRemarks)
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
		frm.txtIndex.value = arrData[0];
		frm.target = "";
		frm.action = "rejectFrequency.form";
		frm.method = "POST";
		frm.submit();
	}
}

function showHistoryForm(modeVal, index)
{
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 400)/2;
	var strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=400,height=300";

	var frm = document.forms["frmMain"];
	frm.txtIndex.value = index;
	if ("AUTH" == modeVal)
		frm.action = "authFrequencyHistory.hist";
	else
		frm.action = "frequencyHistory.hist";
	frm.target = "hWinHistory";
	frm.method = "POST";

	window.open ("", "hWinHistory", strAttr);
	frm.submit();
}

function getClient1()
{
	document.getElementById("descriptionspan").innerHTML=document.getElementById('freqDesc').value;
}

function save()
{
	var frm = document.forms["frmMain"]; 
	frm.action = actionURL;
	frm.target ="";
	frm.method = "POST";
	frm.submit();
}

function disableMe()
{
}
function enableMe()
{
}

function fupper(o)
{	
	o.value=o.value.toUpperCase().replace(/([^0-9A-Z])/g,"");
}
