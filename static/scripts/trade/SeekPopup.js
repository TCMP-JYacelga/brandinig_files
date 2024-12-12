function getHelp(elementId,codeElementId, seekId, strUrl, inputId, callerId, seekUrl, maxColumns)
{
	var strValue = "";
	var count = 0;
	var strAttr;
	var frm = document.forms["frmMain"];
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 400)/2;
	var parentElementArray = elementId.split("|");
	var myJSON = '{}';

	if(inputId != "")
	{
		var inputIdArray = inputId.split("|");	
		var json;
		var index;
		for (i=0; i < inputIdArray.length; i++)
		{
			json = inputIdArray[i].split(":");
			/*
			 * Element exist in the form
			 * e.g. product:bankProduct, here bankProduct exist as an element in
			 * the html form.
			 */
			if (document.getElementById(json[1]))
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
			/*
			 * Element does not exist in the form so actual value is passed from model.
			 * e.g. product:${model.bankProduct}.
			 */
			else
			{
				strValue = strValue + '"' + json[0] + '":"' + json[1] + '",';
			}
		}
		index = strValue.lastIndexOf(',');
		strValue = strValue.substring(0, index);
		myJSON='{ ' + strValue + '}';
	}
	document.getElementById("parentElementId").value = elementId;
	document.getElementById("codeElementId").value = codeElementId;
	document.getElementById("code").value = document.getElementById(parentElementArray[0]).value;
	document.getElementById("formName").value = seekId;
	document.getElementById("callerId").value = callerId;
	document.getElementById("seekInputs").value = myJSON;
	document.getElementById("seekUrl").value = seekUrl;
	if(document.getElementById("maxColumns"))
		document.getElementById("maxColumns").value = maxColumns;
	frm.action = strUrl;
	frm.target = "hWinSeek";
	frm.method = "POST";

	strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=400,height=430";
	window.open ("", "hWinSeek", strAttr);
	frm.submit();
	frm.target = "";
}

function seekFirstPage(totPages, seekUrl)
{
     var frm = document.forms["frmSeek"]; 
     var url = seekUrl + "_seek_first.seek";
     frm.action = url;
     frm.method = "POST";
     frm.submit();
}                              

function navigateTo(index, totPages, seekUrl)
{
     var frm = document.forms["frmSeek"]; 
	 if (index == 1)
	    frm.action = seekUrl + "_seek_next.seek";
	 else 
	    frm.action = seekUrl + "_seek_previous.seek";
     frm.method = "POST";
     frm.submit();
}                              

function seekLastPage(totPages, seekUrl)
{
      var frm = document.forms["frmSeek"]; 
      frm.action = seekUrl + "_seek_last.seek";
      frm.method = "POST";
      frm.submit();
}

function selectRecord(json,code, elementId,codeElementId)
{		  
	window.opener.getRecord(json,code,elementId,codeElementId);
	window.close();
}

function selectCreditInvoiceRef(json,code, elementId,codeElementId,outstandingAmtId,outstandingAmt)
{		  
	window.opener.getCreditInvoiceRef(json,code,elementId,codeElementId,outstandingAmtId,outstandingAmt);
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

function selectBankBranchRecord(json, elementId )
{		  
	window.opener.getBankBranchRecord(json,elementId);
	window.close();
}

function getRecord(json,code,elementId,codeElementId)
{		  
    document.getElementById(elementId).value=json;    
	document.getElementById(codeElementId).value=code;
}
function getCreditInvoiceRef(json,code,elementId,codeElementId,outstandingAmtId,outstandingAmt)
{		  
    document.getElementById(elementId).value=json;    
	document.getElementById(codeElementId).value=code;
	document.getElementById(outstandingAmtId).value=outstandingAmt;    
}
function goToPage(strUrl, frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function selectAddTermRecord(json,code, elementId,codeElementId)
{		  
	window.opener.getAddTermRecord(json,code,elementId,codeElementId);
	window.close();
}

function getAddTermRecord(json,code,elementId,codeElementId)
{
	json = json+"\n";
	json = json.replace(/~/g,"\n");
	json = document.getElementById(codeElementId).value + json;
    document.getElementById(elementId).value=code;    
	document.getElementById(codeElementId).value=json;
}