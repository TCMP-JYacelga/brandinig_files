function doUpdateUserAgreement() {

	if($('#acceptAgreementChk') && $('#acceptAgreementChk')[0] && !$('#acceptAgreementChk')[0].checked )
	{
		return;
	}	
	frm = document.forms['loginAgreementForm'];
	frm.action = 'updateUserAgreement.srvc';
	frm.method = 'POST';
	frm.appendChild(createFormField('INPUT', 'HIDDEN', csrfTokenName,
			tokenValue));
	document.body.appendChild(frm);
	frm.submit();
	document.body.removeChild(frm);
}
function gotoLoginPage() {
	var form;
	form = document.createElement('FORM');
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';
	form.action = 'loginform.action';
	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);
}
function rejectAgreement() {
	var form;
	form = document.createElement('FORM');
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';
	form.action = 'rejectUserAgreement.srvc';
	form.appendChild(createFormField('INPUT', 'HIDDEN', csrfTokenName,
			tokenValue));
	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);
}

function activateButton(element) {
	if (element && element.checked) {
		$('#acceptBtn').removeAttr('disabled');
	} else {
		$('#acceptBtn').attr('disabled',true);
	}
}
function createFormField( element, type, name, value )
{
	var inputField;
	inputField = document.createElement( element );
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;
	return inputField;
}