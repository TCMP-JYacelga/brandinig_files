// JavaScript Document
function doChangePassword()
{
	var pwd, frm, salt, digest,usercode,uidPwd;
	frm = document.forms['changePasswordForm'];
	if (!frm) return;
	usercode  = frm.usercode.value;
	pwd = frm.hashpassword.value;
	uidPwd = usercode+pwd;
	if (!isEmpty(pwd) && !isEmpty(uidPwd))
	{
        var digest = Crypto.SHA1(pwd);
		frm.password.value = digest;

		var newDigest = Crypto.SHA1(uidPwd);
		frm.uidPassword.value = newDigest;

        salt = frm.salt.value;
        if (!isEmpty(salt))
			frm.hashPassword.value = Crypto.SHA1(salt + "$" + digest);
	}
	pwd = frm.newPassword.value;
	pwd = usercode+pwd;
	if (!isEmpty(pwd))
	{
        var digest = Crypto.SHA1(pwd);
		frm.hashNewPassword.value = digest;
	}
	pwd = frm.confirmPassword.value;
	pwd = usercode+pwd;
	if (!isEmpty(pwd))
	{
        var digest = Crypto.SHA1(pwd);
		frm.hashConfirmPassword.value = digest;
	}
	frm.hashpassword.value = '';
	frm.submit();
}

function cancelChangePwd(session)
{
	var frm = document.forms['changePasswordForm'];
	frm.target ="";
	if(session=='')
		frm.action = "logoutUser.action";
	else
		frm.action = "showWelcome2.form";
	frm.method = 'POST';
	frm.submit();
}
function successfulChangePwd()
{	
	window.location='loginform.action';
}
function reloadCaptcha(imgpath){
	img = document.getElementById("imgCaptcha");
	img.src=imgpath+"?rand_number=" + Math.random();
}
function showUpdatePasswordPopup(){
	var _objDialog = $('#pwdChangeConfirmationPopup');
	_objDialog.dialog({
				bgiframe : true,
				autoOpen : false,
				modal : true,
				resizable : false,
				width : "320px",
				buttons : {
					"Ok" : function() {
						successfulChangePwd();
					}
				},
				close: cancelChangePwd
			});
	_objDialog.dialog('open');
	_objDialog.dialog('option','position','center');
}