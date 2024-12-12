function ajaxError()
{
	alert( "AJAX error, please contact admin!" );
}

function submitStatementRequest()
{
	var strUrl = 'submitLmsCmTmStatementRequest.srvc';
	var frm = document.getElementById( 'frmMain' );
	frm.action = strUrl;		
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}


function createFormField( element, type, name, value )
{
	var form = document.getElementById('frmMain');
	var formElements = form.elements;
	var inputField;

	if( null != formElements )
	{
		inputField = formElements.namedItem(name);
		if( null != inputField )
		{
			inputField.parentNode.removeChild(inputField);
		}
	}
	inputField = document.createElement( element );
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;			
			
	return inputField;
}
function showCMTMErrorMessage(errorMessage)
{
	if(errorMessage != null && errorMessage != "")
	{
		$("#cmTmErrorMessage").append(errorMessage);
		$('#cmTmErrorMessage').dialog({
			autoOpen : true,
			height : 100,
			width : 350,
			modal : true,
			buttons :[
				{
					text:getLabel('btnOk','Ok'),
					click : function() {
						$(this).dialog("close");
					}
				}
			]
		});
		$('#cmTmErrorMessage').dialog('open');
	}
}
function clearClient() {
	document.getElementById("clientId").value = null;
	document.getElementById("clientDesc").value = null;
}
function clearAgreement() {
	document.getElementById("agreementRecKey").value = null;
	document.getElementById("agreementName").value = null;
}
function clearCompanyRegId() {
	document.getElementById("companyRegId").value = null;
}
