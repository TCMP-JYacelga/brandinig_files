// JavaScript Document
function doChangePassword()
{
	var pwd, frm, usercode;
	frm = document.forms['changeRDCPasswordForm'];
	if (!frm) return;
	usercode  = frm.usercode.value;

	pwd = frm.newPassword.value;
	pwd = usercode+pwd;
	if (!isEmpty(pwd))
	{
        var digest = Crypto.SHA1(pwd);
		frm.hashNewPassword.value = digest;
	}
	frm.submit();
}

function cancelChangePwd()
{
	var frm = document.forms['changeRDCPasswordForm'];
	frm.target ="";
	frm.action = "showWelcome2.form";
	frm.method = 'POST';
	frm.submit();
}
function reloadCaptcha(imgpath){
	img = document.getElementById("imgCaptcha");
	img.src=imgpath+"?rand_number=" + Math.random();
}