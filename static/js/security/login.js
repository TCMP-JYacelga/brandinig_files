// JavaScript Document
function doLogin()
{
	var pwd, frm, salt, uid, digest,usrPwd,usrDigest;
	
	//check for lang-cookie if yes then add it to login form
	if($.cookie("lang-change")) {
		$("#userLang").val($.cookie("usr-lang"));
		$.cookie('lang-change', null);
	}
	
	frm = document.forms['loginUserForm'];
	if (!frm) return;

	uid = frm.user.value;
	pwd = frm.txtpassword.value;
	//pwd = uid+pwd;
	usrPwd = uid+pwd;
	frm.txtpassword.value = "";
	if (!isEmpty(frm.uidPassword2.value)) {
		$('#txtClearTrack').val("Y");
		frm.appendChild(createFormField('INPUT', 'HIDDEN', 'uidPassword', frm.uidPassword2.value));
		frm.submit();
	}
	if (!isEmpty(pwd) && !isEmpty(usrPwd))
	{
		SetCookie("nav-addr", "",-1);
		SetCookie("sidemenu_widgets", "",-1);
        digest = Crypto.SHA1(pwd);
        pwd = null;
		frm.password.value = digest;

		usrDigest = Crypto.SHA1(usrPwd);
		usrPwd = null;
		frm.appendChild(createFormField('INPUT', 'HIDDEN', 'uidPassword', usrDigest));

		salt = frm.salt.value;
		if (!isEmpty(salt))
		{
			frm.hashPassword.value = Crypto.SHA1(salt + "$" + digest);
		}
		frm.submit();
	}
}


function SetCookie(cookieName,cookieValue,nDays) {
 var today = new Date();
 var expire = new Date();
 if (nDays==null || nDays==0) nDays=1;
 expire.setTime(today.getTime() + 3600000*24*nDays);
 if(cookieName == "sidemenu_widgets")
	{
	 document.cookie = cookieName + "=" + cookieValue+";expires="+expire + "; path=/";
	}else
	{
	document.cookie = cookieName+"="+escape(cookieValue)
                 + ";expires="+expire.toGMTString();
	}
}


function changeCase(ctrl)
{
	if (ctrl)
		ctrl.value = ctrl.value.toUpperCase().replace(/([^0-9A-Z])/g, "");
	document.getElementById("txtpassword").removeAttribute("readonly");
}

function forgetPassword()
{
	var frm, uid;
	frm = document.forms['loginUserForm'];
	if (!frm) return;

	uid = frm.user.value;
	
	frm.action = "forgetPasswordVerify.action";
	frm.submit();
}

function pswKeyDown(e) {
    e = e || window.event;
	  if (e.keyCode == 13) {
		  doLogin();  
	  }
	  else
		  return false;
	}

// Vyom - Captcha
function reloadCaptcha(imgpath){
	img = document.getElementById("imgCaptcha");
	img.src=imgpath+"?rand_number=" + Math.random();
}
// Vyom - Captcha

/**
 * Function to check whether the supplied value is either null or zero length.
 * @param val The value to be checked
 * @return true if supplied value is either null or zero length, false otherwise
 * @author Prasad P. Khandekar
 * @date May 28, 2009
 */
function isEmpty(val) {
    if (typeof val == 'undefined') return true;
    if (null == val) return true;
    if (undefined === val) return true;
    if (typeof val == "string" && val.length <= 0) return true;
    if (typeof val == "string" && "null" == val) return true;
    return false;
};
function createFormField( element, type, name, value )
{
	var inputField;
	inputField = document.createElement( element );
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;
	return inputField;
}

function changeLanguage()
{
	$.cookie('usr-lang',  $("#usrLanguage").val());
	$.cookie('lang-change', 'Y');
	window.location.reload();
}


