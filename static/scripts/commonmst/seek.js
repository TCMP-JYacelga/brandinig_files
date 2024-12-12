function getHelp(elementId, seekId, strUrl, inputId, callerId, maxColumns)
{
	var strValue;
	var count = 0;
	var strAttr;
	var frm = document.forms["frmMain"];
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 400)/2;
	var parentElementArray = elementId.split("|");

	if(inputId != "")
	{
		var inputIdArray = inputId.split("|");	
		var myJSON = {};
		var json;
		var index;
		for (i=0; i < inputIdArray.length; i++)
		{
			json = inputIdArray[i].split(":");
			if (document.getElementById( json[1]))
			{
				for(j=0; j < json.length; j++)
				{
					if (document.getElementById(json[j]) == null)
					{
						if (strValue == null)
							strValue = '"' + json[j] + '"' + ':' ;
						else	
							strValue = strValue + '"' + json[j] + '"' + ':' ;
					}	
					else
					{
						strValue = strValue + '"' + document.getElementById( json[j] ).value + '",'  ;
					}
				}
			}
		}
		index = strValue.lastIndexOf(',');
		strValue = strValue.substring(0, index);
		myJSON='{ ' + strValue + '}';
	}
	document.getElementById("parentElementId").value = elementId;
	document.getElementById("code").value = document.getElementById(parentElementArray[0]).value;
	document.getElementById("formName").value = seekId;
	document.getElementById("callerId").value = callerId;
	document.getElementById("seekInputs").value = myJSON;
	
	if(document.getElementById("maxColumns"))
		document.getElementById("maxColumns").value = maxColumns;
	frm.action = strUrl;
	frm.target = "hWinSeek";
	frm.method = "POST";

	strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=350,height=350";
	window.open ("", "hWinSeek", strAttr);
	frm.submit();
	frm.target = "";
}

function seekFirstPage(totPages, callerId)
{
     var frm = document.forms["frmSeek"]; 
     var url = callerId + "_seek_first.seek";
     frm.action = url;
     frm.method = "POST";
     frm.submit();
}                              

function navigateTo(index, totPages, callerId)
{
     var frm = document.forms["frmSeek"]; 
	 if (index == 1)
	    frm.action = callerId + "_seek_next.seek";
	 else 
	    frm.action = callerId + "_seek_previous.seek";
     frm.method = "POST";
     frm.submit();
}                              

function seekLastPage(totPages, callerId)
{
      var frm = document.forms["frmSeek"]; 
      frm.action = callerId + "_seek_last.seek";
      frm.method = "POST";
      frm.submit();
}

function selectRecord(json, elementId)
{		  
	var myJSONObject = JSON.parse(json);	
    var inputIdArray = elementId.split("|");
    var frm = window.opener.document.forms["frmMain"];

    for (i=0; i < inputIdArray.length; i++)
	{
    	if (window.opener.document.getElementById(inputIdArray[i]) && myJSONObject.columns[i])
    	{
			if (null == myJSONObject.columns[i].value)
				myJSONObject.columns[i].value = "";

    		var type = window.opener.document.getElementById(inputIdArray[i]).type;
    		if (type == 'text')
    			window.opener.document.getElementById(inputIdArray[i]).value=myJSONObject.columns[i].value;
    		else
    			window.opener.document.getElementById(inputIdArray[i]).innerHTML=myJSONObject.columns[i].value; 
    	}
	}    
    frm.target = "";
    window.close();
}
		
function doOrderBy(index, sortDirection)
{
    var frm = document.forms["frmSeek"]; 

    if (sortDirection == 0)
      document.getElementById("sortDirection").value = "1";
    else
      document.getElementById("sortDirection").value = "0";

    document.getElementById("orderBy").value = index;
    frm.method = "POST";
    frm.submit();
}

function selectRecordBankBranch(json,elementId)
{		  
	var myJSONObject = JSON.parse(json);
    var inputIdArray = elementId.split("|");
    for(i=0; i<inputIdArray.length; i++)
	{
    	var field = inputIdArray[i];
    	if(window.opener.document.getElementById(inputIdArray[i]) && myJSONObject.columns[i])
    	{
    	var type = window.opener.document.getElementById(inputIdArray[i]).type;
    	if(type=='text'){
    	 window.opener.document.getElementById(inputIdArray[i+1]).value=myJSONObject.columns[i].value;}
    	else {
    	 window.opener.document.getElementById(inputIdArray[i+1]).innerHTML=myJSONObject.columns[i].value;} 
	}
	}    
    window.close();
}              