function save()
{
	var frm = document.forms['frmMain'];
	frm.target ="";
	frm.action = "savePwdQuestionnaire.form";
	frm.method = 'POST';
	frm.submit();
}

function verifyQuestions()
{
	var frm = document.forms['frmMain'];
	frm.target ="";
	frm.action = "verifyPwdQuestionnaire.action";
	frm.method = 'POST';
	frm.submit();
}

function showloginpage()
{
	window.location='loginform.action';
}