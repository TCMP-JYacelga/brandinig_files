function changeCase(ctrl) {
	if (ctrl)
		ctrl.value = ctrl.value.toUpperCase().replace(/([^0-9A-Z])/g, "");
	document.getElementById("txtpassword").removeAttribute("readonly");
}

function SetCookie(cookieName, cookieValue, nDays) {
	var today = new Date();
	var expire = new Date();
	if (nDays == null || nDays == 0)
		nDays = 1;
	expire.setTime(today.getTime() + 3600000 * 24 * nDays);
	if (cookieName == "sidemenu_widgets") {
		document.cookie = cookieName + "=" + cookieValue + ";expires=" + expire
				+ "; path=/";
	} else {
		document.cookie = cookieName + "=" + escape(cookieValue) + ";expires="
				+ expire.toGMTString();
	}
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function pswKeyDown(e) {
	e = e || window.event;
	if (e.keyCode == 13) {
		doLogin();
	} else
		return false;
}

function doNext() {
	if ($('#txtUser').val() != '') {
		$.ajax({
			type : "POST",
			url : 'generateAuthToken.signin',
			data : {
				userId : $('#txtUser').val()
			},
			async : false,
			datatype : "json",
			success : function(data) {
				emptyErrorSection();
				postNextRenderUI(data);
			},
			error : function(err) {
				console.log(err);
			}
		});

	}
	else
	{
	    var frm = document.forms['loginUserForm'];
		validateField(frm.user,loginErrorMap['userRequired'])
	}
}
function postNextRenderUI(data) {
	data = JSON.parse(data);
	if (data && data.authToken) {
		$('#authToken').val(data.authToken);
		$('#otpRequired').val(data.otpRequired);
		$('#userSection').toggle('slide', {
			direction : "left"
		}, function() {
			$('#pwdSection').toggle('slide', {
				direction : "right"
			});
		});
		$('#pwdSection').removeClass('');
		$('#btnLogin').unbind('click');
		if ($('#otpRequired').val() == 'Y') {
			$('#btnLogin').bind("click", function() {
				showVerify();
			});
		} else {
			$('#btnLogin').bind("click", function() {
				if ($('#txtpassword').val() != '') 
				{
					doLogin();
					emptyErrorSection();
				}
				else
				{
					//renderError('passwordRequired');
				    var frm = document.forms['loginUserForm'];
				    validatePasswordField(frm.txtpassword,loginErrorMap['passwordRequired']);
				}

			});
		}
		$('#txtpassword').val('');
		$('#txtpassword').focus();
	}
}

function showVerify() {
	if ($('#txtpassword').val() != '') {
		$('#pwdSection').toggle('slide', {
			direction : "left"
		}, function() {
			$('#OtpSection').toggle('slide', {
				direction : "right"
			});
		});
		$('#OtpSection').removeClass('');
		$('#otp').val('');
		$('#otp').focus();
	}
}

function verifyOTP() {

	if ($('#otp').val() != '') 
	{
		doLogin();
		emptyErrorSection();
	}
	else
	{
		renderError('otpRequired','Please enter Verification code');
	}
}

/* Following method to submit login form */
function doLogin() {
	
	var pwd, digest, salt;
	frm = document.forms['loginUserForm'];
	if (!frm)
		return;
	SetCookie("nav-addr", "", -1);
	SetCookie("sidemenu_widgets", "", -1);
	frm.password.value = $('#txtpassword').val();
	pwd = $('#txtpassword').val();
	digest = Crypto.SHA1(pwd);
	pwd = null;
	salt = frm.salt.value
	frm.hashPassword.value = salt + "$" + digest;
	frm.action = 'authorizeUser.signin';
	frm.submit();
}
function forgetPassword()
{
	var frm, uid;
	frm = document.forms['loginUserForm'];
	if (!frm) return;
	uid = frm.user.value;
	removeErrDiv(frm.user);
	if (!isEmpty(uid))
	{
		frm.action = "forgetPasswordVerify.action";
		frm.submit();
	}
	else
	{
	    validateField(frm.user,loginErrorMap['strPlaceHolder']);
	}
}

function disableF5(e)
{ 
	if ((e.which || e.keyCode) == 116) 
		e.preventDefault(); 
}

function renderError(labelCode, labelMsg)
{
	var errorContainer = $('#errorList');
	errorContainer.empty();
	var errorMsg = '';
	errorMsg+=getLabel(labelCode,labelMsg);
	errorContainer.append(errorMsg);	
}
function getLabel(key, defaultText) {
	return (loginErrorMap && loginErrorMap[key])
			? loginErrorMap[key]
			: defaultText
}
function emptyErrorSection()
{
	   var errorContainer = $('#errorList');
	    errorContainer.empty();	
}

function setUserLang()
{
   let userLang = $('#userLang').val();
   document.cookie = "userLang="+userLang;	
}

function changeLanguage()
{
	if($("#userLang").val() !== "") {
		$.cookie('usr-lang',  $("#userLang").val());
		$.cookie('lang-change', 'Y');
		window.location.reload();
	}	
}

function validateField(field,errorMsg)
{
    if (isEmpty(field.value))
    {
        $('#'+field.id).parent().parent().find('.error-div').remove();
        let errorDiv = document.createElement('div');
        if( $("#userLang").val()=="AR_BH")
        {
        errorDiv.setAttribute('class', 'error-div-rtl');
        }
        else
        {
        errorDiv.setAttribute('class', 'error-div');
        }
        errorDiv.innerHTML= errorMsg.trim();
        $('#'+field.id).parent().parent().append(errorDiv);
        $('#'+field.id).addClass('error-border');
        $('#'+field.id).parent().parent().addClass('error-background');  
    }
    else
    {
        removeErrDiv(field);
    }
}
function removeErrDiv(field)
{
    $('#'+field.id).parent().parent().find('.error-div').remove();
    $('#'+field.id).parent().parent().removeClass('error-background');
    $('#'+field.id).removeClass('error-border');
}

function removeErrDivForPassword(field)
{
    $('#'+field.id).parent().find('.error-div').remove();
    document.getElementById(field.id).style.backgroundColor='';
    $('#'+field.id).removeClass('error-border');
}

function validatePasswordField(field,errorMsg)
{
	if (isEmpty(field.value))
    {
		$('#'+field.id).parent().find('.error-div').remove();
		let errorDiv = document.createElement('div');
         if( $("#userLang").val()=="AR_BH")
        {
        	errorDiv.setAttribute('class', 'error-div-rtl');
        }
        else
        {
       	 errorDiv.setAttribute('class', 'error-div');
        }

        errorDiv.innerHTML= errorMsg.trim();
        $('#'+field.id).parent().append(errorDiv);
        $('#'+field.id).addClass('error-border');
        document.getElementById(field.id).style.backgroundColor='#FDEBF1';  
    }
	else
	{
		$('#'+field.id).parent().find('.error-div').remove();
		document.getElementById(field.id).style.backgroundColor=''; 
	    $('#'+field.id).removeClass('error-border');
		
	}
}

function viewPassword(field)
{
    if(field.id=="btn_visible_off") 
    {
        $('#btn_visible').show();
        $('#btn_visible_off').hide();
        $('#txtpassword').attr("type", "password");
    }
    else
    {
        $('#btn_visible_off').show();
        $('#btn_visible').hide();
        $('#txtpassword').attr("type", "text");
    }
}
function changebg(fieldId)
{
    $('#'+fieldId).css("background-size", "0 100%,100% 100%");
    $('#'+fieldId).css("background-image","");
    $('#'+fieldId).css("transition-duration", "");
}
function changebgonfocus(fieldId)
{
    $('#'+fieldId).css("background-image",
                    "linear-gradient(0deg,#694ED6 2px,rgba(193,55,162,0) 0),linear-gradient(0deg,rgba(0,0,0,.26) 1px,transparent 0)");
    $('#'+fieldId).css("transition-duration", ".3s");
    $('#'+fieldId).css("background-size", "");

}