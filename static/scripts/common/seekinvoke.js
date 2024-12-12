function getHelp(elementId, seekId, strUrl, inputId, callerId, seekUrl, maxColumns, fptrCallback)
{
	var strValue;
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
			/*
			 * Element does not exist in the form so actual value is passed from model.
			 * e.g. product:${model.bankProduct}.
			 */
			else
			{
				if (strValue == null)
					strValue = '';
				strValue = strValue + '"' + json[0] + '":"' + json[1] + '",';
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
	document.getElementById("seekUrl").value = seekUrl;
	if (document.getElementById("callback"))
		document.getElementById("callback").value = fptrCallback;
	if(document.getElementById("maxColumns"))
		document.getElementById("maxColumns").value = maxColumns;
	frm.action = strUrl;
	frm.target = "hWinSeek";
	frm.method = "POST";

	strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=400,height=350";
	window.open ("", "hWinSeek", strAttr);
	frm.submit();
	frm.target = "";
}
function getProcessHelp(elementId, seekId, strUrl, inputId, callerId, seekUrl, maxColumns, fptrCallback,selectedSeller,selectedClient,listValueType)
{
	var strValue;
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
	document.getElementById("code").value = document.getElementById(parentElementArray[0]).value;
	document.getElementById("description").value = document.getElementById(parentElementArray[1]).value;
	document.getElementById("formName").value = seekId;
	document.getElementById("callerId").value = callerId;
	document.getElementById("seekInputs").value = myJSON;
	document.getElementById("seekUrl").value = seekUrl;
	if (document.getElementById("callback"))
		document.getElementById("callback").value = fptrCallback;
	if(document.getElementById("maxColumns"))
		document.getElementById("maxColumns").value = maxColumns;
	if(document.getElementById("selectedSellerCode"))
		document.getElementById("selectedSellerCode").value = selectedSeller;
	if(document.getElementById("selectedClientCode"))
		document.getElementById("selectedClientCode").value = selectedClient;
	console.log($('#listValueType').val());
	if($('#frmMain #listValueType').length < 1)
	{
		frm.appendChild(createFormField('INPUT', 'HIDDEN',
			'listValueType', listValueType));
	}
	frm.action = strUrl;
	frm.target = "hWinSeek";
	frm.method = "POST";
	
	strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=400,height=350";
	window.open ("", "hWinSeek", strAttr);
	frm.submit();
	frm.target = "";
}

function getHelpSeek(elementId, seekId, strUrl, inputId, callerId, seekUrl, maxColumns, fptrCallback, frmId )
{
	var strValue;
	var count = 0;
	var strAttr;
	var frm = document.getElementById(frmId);
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
			if (document.getElementById( json[1]))
			{
				for(j=0; j < json.length; j++)
				{
					if (document.getElementById(json[j]) == null)
					{
						if (strValue == null || strValue == undefined)
						{
							strValue = '"' + json[j] + '"' + ':' ;
						}
						else	
						{
							strValue = strValue + '"' + json[j] + '"' + ':' ;
						}
					}	
					else
					{
						strValue = strValue + '"' + json[j] + '",'  ;
					}
				}
			}
			/*
			 * Element does not exist in the form so actual value is passed from model.
			 * e.g. product:${model.bankProduct}.
			 */
			else
			{
			if(strValue == null || strValue == undefined)
			{
				strValue = "";
			}
				strValue = strValue + '"' + json[0] + '":"' + json[1] + '",';
			}
		}
		index = strValue.lastIndexOf(',');
		strValue = strValue.substring(0, index);
		myJSON='{ ' + strValue + '}';
	}
	document.getElementById("rep_parentElementId").value = elementId;
	document.getElementById("rep_code").value = document.getElementById(parentElementArray[0]).value;
	document.getElementById("rep_formName").value = seekId;
	document.getElementById("rep_callerId").value = callerId;
	document.getElementById("rep_seekInputs").value = myJSON;
	document.getElementById("rep_seekUrl").value = seekUrl;
	if (document.getElementById("rep_callback"))
		document.getElementById("rep_callback").value = fptrCallback;
	if(document.getElementById("rep_maxColumns"))
		document.getElementById("rep_maxColumns").value = maxColumns;
	frm.action = strUrl;
	frm.target = "hWinSeek";
	frm.method = "POST";

	strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=400,height=350";
	window.open ("", "hWinSeek", strAttr);
	frm.submit();
	frm.target = "";
}

function getHelpForFormId(elementId, seekId, strUrl, inputId, callerId, seekUrl, maxColumns, fptrCallback,frmId)
{
	var strValue;
	var count = 0;
	var strAttr;
	var frm = document.getElementById(frmId);
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
			if (frm.elements[ json[1]])
			{
				for(j=0; j < json.length; j++)
				{
					if (frm.elements[json[j]] == null)
					{
						if (strValue == null)
							strValue = '"' + json[j] + '"' + ':' ;
						else	
							strValue = strValue + '"' + json[j] + '"' + ':' ;
					}	
					else
					{
						strValue = strValue + '"' + frm.elements[json[j]].value + '",'  ;
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
	
	frm.elements["parentElementIdSeek"].value = elementId;
	frm.elements["formNameSeek"].value = seekId;
	frm.elements["callerIdSeek"].value = callerId;
	frm.elements["seekInputsSeek"].value = myJSON;
	frm.elements["seekUrlSeek"].value = seekUrl;
	if (frm.elements["callbackSeek"])
		frm.elements["callbackSeek"].value = fptrCallback;
	if(frm.elements["maxColumnsSeek"])
		frm.elements["maxColumnsSeek"].value = maxColumns;
	frm.action = strUrl;
	frm.target = "hWinSeek";
	frm.method = "POST";

	strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=400,height=370";
	window.open ("", "hWinSeek", strAttr);
	frm.submit();
	frm.target = "";
}

function getHelpQuickSeek(elementId, seekId, strUrl, inputId, callerId, seekUrl, maxColumns, fptrCallback)
{
	var strValue;
	var count = 0;
	var strAttr;
	var frm = document.getElementById('quickPayPopUpForm');
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
			if (document.getElementById( json[1]))
			{
				for(j=0; j < json.length; j++)
				{
					if (document.getElementById(json[j]) == null)
					{
						if (strValue == null || strValue == undefined)
						{
							strValue = '"' + json[j] + '"' + ':' ;
						}
						else	
						{
							strValue = strValue + '"' + json[j] + '"' + ':' ;
						}
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
			if(strValue == null || strValue == undefined)
			{
				strValue = "";
			}
				strValue = strValue + '"' + json[0] + '":"' + json[1] + '",';
			}
		}
		index = strValue.lastIndexOf(',');
		strValue = strValue.substring(0, index);
		myJSON='{ ' + strValue + '}';
	}
	document.getElementById("quickpay_parentElementId").value = elementId;
	document.getElementById("quickpay_code").value = document.getElementById(parentElementArray[0]).value;
	document.getElementById("quickpay_formName").value = seekId;
	document.getElementById("quickpay_callerId").value = callerId;
	document.getElementById("quickpay_seekInputs").value = myJSON;
	document.getElementById("quickpay_seekUrl").value = seekUrl;
	if (document.getElementById("quickpay_callback"))
		document.getElementById("quickpay_callback").value = fptrCallback;
	if(document.getElementById("quickpay_maxColumns"))
		document.getElementById("quickpay_maxColumns").value = maxColumns;
	frm.action = strUrl;
	frm.target = "hWinSeek";
	frm.method = "POST";

	strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=400,height=350";
	window.open ("", "hWinSeek", strAttr);
	frm.submit();
	frm.target = "";
}

 function createFormField(element, type, name, value) {
	var inputField;
	inputField = document.createElement(element);
	inputField.type = type;
	inputField.name = name;
	inputField.id = name;
	inputField.value = value;
	return inputField;
}