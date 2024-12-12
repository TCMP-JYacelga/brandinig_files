// JavaScript Document
function submitForm()
{
	var frm, uid, pwd, strSalt, digest;

    frm = document.getElementById('frmLogin');
	uid = document.getElementById('user').value;
	pwd = document.getElementById('txtpassword').value;
	strSalt = document.getElementById('salt').value;
	if (!isEmpty(pwd) || !isEmpty(uid))
	{
		SetCookie("nav-addr", "",-1);
		SetCookie("sidemenu_widgets", "",-1);

        digest = Crypto.SHA1(pwd);
		if (isEmpty(strSalt)) {
            strSalt = ['','','','','','','',''].join((Math.random().toString(36) + '00000000000000000').slice(2, 18)).slice(0, 8);
            document.getElementById('salt').value = strSalt;
        }

        document.getElementById('txtpassword').value = '';
        document.getElementById('password').value = pwd;
		document.getElementById('hashPassword').value = Crypto.SHA1(strSalt + "$" + digest);
		return true;
	}
}


function SetCookie(cookieName,cookieValue,nDays) {
    var today = new Date();
    var expire = new Date();

    if (nDays == null || nDays == 0) nDays = 1;
    expire.setTime(today.getTime() + 3600000*24*nDays);
    if (cookieName == "sidemenu_widgets")
        document.cookie = cookieName + "=" + cookieValue+";expires="+expire + "; path=/";
	else
	   document.cookie = cookieName + "=" + escape(cookieValue) + ";expires=" + expire.toGMTString();
}

function changeCase(ctrl) {
	if (ctrl)
		ctrl.value = ctrl.value.toUpperCase().replace(/([^0-9A-Z])/g, "");

	document.getElementById("txtpassword").removeAttribute("readonly");
}

function pswKeyDown(e) {
    e = e || window.event;

    if (e.keyCode == 13)
	   doLogin();
	else
        return false;
}

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
}
