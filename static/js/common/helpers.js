/*global $ Math, _alertResult, document, getRemarks, isArray, isEmpty, isInteger,
limitText, showAlert, stripExtension, toUpper */

// Global Variables
var _strRemarks;
var _objDialog;
var _blnClicked = false;
var _blnSubmitted = false;
menuhidden = "false";
menuHiddenLeftMenu = "false";

/**
 * Function check whether the supplied argument is of type array.
 * @param obj the value whose data type is to be checked.
 * @return true if supplied value is of array data type, false otherwise
 * @author Prasad P. Khandekar
 * @date May 28, 2009
 */
function isArray(obj) {
	if (null === obj) {return false;}
	if (obj.constructor.toString().indexOf("Array") == -1) {
		return false;
	} else {
		return true;
	}
};

/**
 * Function to determine whether the supplied value is an integer value or not.
 * @param s the value to be checked.
 * @return true if supplied value indeed reprsents an integer, false otherwise
 * @author Prasad P. Khandekar
 * @date May 28, 2009
 */
function isInteger(s) {
	return (Math.floor(s) == s ? true : false);
};

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
    if (undefined == val) return true;
    if (typeof val == "string" && val.length <= 0) return true;
    if (typeof val == "string" && "null" == val) return true;
    return false;
};

/**
 * Function to convert the value entered in the supplied control to all uppercase.
 * @param ctrl The control whose value is to be altered.
 * @return nothing
 * @author Prasad P. Khandekar
 * @date May 28, 2009
 */
function toUpper(ctrl) {
	if (ctrl) {
		ctrl.value = ctrl.value.toUpperCase().replace(/([^0-9A-Z])/g, "");
	}
};

function toUpperWithSpace(ctrl) {
	if (ctrl) {
		ctrl.value = ctrl.value.toUpperCase();
	}
};

/**
 * Function to convert the value entered in the supplied control to all uppercase without any check
 * @param ctrl The control whose value is to be uppered.
 * @return nothing
 * @author Charan Kolhe
 * @date May 14, 2012
 */
function toUpperPlain(ctrl) {
	if (ctrl) {
		ctrl.value = ctrl.value.toUpperCase();
	}
};

/**
 * Function to convert the value entered in the supplied control to all uppercase
 * with all the spaces except the leading and trailing spaces.
 * @param ctrl The control whose value is to be altered.
 * @return nothing
 * @author Prasad P. Khandekar
 * @date May 28, 2009
 */
function toUpperWithoutLeadNTrailSpaces(ctrl) {
	if (ctrl && ctrl.value) {
		ctrl.value = ctrl.value.toUpperCase().replace(/^\s+|\s+$/g,'');
	}
	else if(ctrl && ctrl.value == undefined){
		$(ctrl.selector).val($(ctrl.selector).val().toUpperCase().replace(/^\s+|\s+$/g,''));   
	}	
	
};

/**
 * Strip out the extension from the supplied url and return the result.
 * @param strUrl the URL
 * @return the URL with extension stripped out.
 * @author Prasad P. Khandekar
 * @date May 28, 2009
 */
function stripExtension(strUrl) {
	if (isEmpty(strUrl)) {return strUrl;}
	var pos = strUrl.lastIndexOf(".");
	if (pos > -1) {return strUrl.substring(0, pos);}
	return strUrl;
};

/**
 * A generic function to limit contet of the input element to specified length.
 * @param ctrl The control for which the input is to be restricted.
 * @param intMax The maximum characters to be allowed
 * @return Nothing
 * @author Prasad P. Khandekar
 * @date March 28, 2010
 */
function limitText(ctrl, intMax) {
	var val = ctrl.value;
	if (val && val.length >= intMax) {
		ctrl.value = val.substring(0, intMax);
	} else {
		return true;
	}
	return false;
};

/**
 * The callback function of the input dialog. This function in turn will call the user defined function supplied function pointer
 * passing it the reject remarks text entered by the user.
 * @param ctrl The control in which the reject remark is entered.
 * @param fptrCallback the callback function address.
 * @param arrData the array of extra data elements to be passed to callback.
 * @return Nothing
 * @author Prasad P. Khandekar
 * @date March 28, 2009
 */
function _setRemarks(ctrl, arrData, fptrCallback) {
	if (ctrl) {_strRemarks = ctrl.value;}
	_objDialog.dialog('destroy');
	fptrCallback(arrData, _strRemarks);
};

/**
 * A generic function to display the modal dialog for inputting reject remarks.
 * @param intHeight The desired height of the dialog window
 * @param strTitle The text to be displayed in dialog's title bar.
 * @param lblTitle The title to be used for the remarks field.
 * @param fptrCallback The callback function address. This function should take two arguments the first one being an array one being
 * an array of data elements and the second one is the string argument containing reject remark text entered by user.
 * @param arrData the array of extra data elements to be passed to callback.
 * @return Nothing
 * @author Prasad P. Khandekar
 * @date March 28, 2010
 */
function getRemarks(intHeight, strTitle, lblTitle, arrData, fptrCallback) {
	var fld = document.getElementById('taRemarks');
	if (fld) {fld.value = "";}
	_objDialog = $('#rrDialog');
	$('#rrField').text(lblTitle);
	_objDialog.dialog({bgiframe:true, autoOpen:false, height:intHeight, modal:true, resizable:false, width:"320px",
					title: strTitle, open: function(){document.getElementById('taRemarks').focus();},
					buttons: {"Ok": function() {$(this).dialog("close"); _setRemarks(document.getElementById('taRemarks'), arrData, fptrCallback);},
					Cancel: function() {$(this).dialog('destroy');}}});
	_objDialog.dialog('open');
};

/**
 * Helper callback of the confirmation dialog. In turn it calls the user defined function passing it a boolean indicating which
 * button was pressed while closing the dialog.
 * @return Nothing
 * @author Prasad P. Khandekar
 * @date April 12, 2010
 */
function _alertResult(blnRet, fptrCallback, arrData) {
	_objDialog.dialog('destroy');
	fptrCallback(blnRet, arrData);
};

/**
 * A generic function to display a model message box.
 * @param intHeight The desired height of the dialog window
 * @param intWidth The width of the dialog in pixels.
 * @param strTitle The text to be displayed in dialog's title bar.
 * @param strMsg The message to be displayed.
 * @param fptrCallback The callback function.
 * @return Nothing
 * @author Prasad P. Khandekar
 * @date April 13, 2010
 */
function showAlert(intHeight, intWidth, strTitle, strMsg, fptrCallback, arrData) {
	_objDialog = $("#alertDialog");
	$("#alertMsg").text(strMsg);
	_objDialog.dialog({bgiframe:true, autoOpen:false, height:intHeight, modal:true, resizable:false, width:intWidth,draggable : false,
					title: strTitle, buttons:[ {text:getLabel('btnOk','Ok'),click: function() {$(this).dialog("close"); _alertResult(true, fptrCallback, arrData);}},
					{text:getLabel('btncancel','Cancel'),click: function() {$(this).dialog("close"); _alertResult(false, fptrCallback, arrData);}}]});
	_objDialog.dialog('open');
};

function showAlertForPDC(intHeight, intWidth, strTitle, strMsg, fptrCallback, arrData) {
	_objDialog = $("#alertDialog");
	$("#alertMsg").text(strMsg);
	_objDialog.dialog({bgiframe:true, autoOpen:false, height:intHeight, modal:true, resizable:false, width:intWidth,draggable : false,
					title: strTitle, buttons:[{text:getLabel('btncancel','Cancel'),click: function() {$(this).dialog("close"); _alertResult(false, fptrCallback, arrData);}},
					 {text:getLabel('btnDiscard','Discard'),click: function() {$(this).dialog("close"); _alertResult(true, fptrCallback, arrData);}}]});
	_objDialog.dialog('open');
};

/**
 * A function to hide/unhide more action buttons.
 * @param ctrl The hyperlink from where this script is invoked
 * @param divId The div to be shown/hidden
 * @return Nothing
 * @author Prasad P. Khandekar
 * @date August 12, 2010
 */
function showHideActions(ctrl, divId) {
	if (!ctrl || isEmpty(divId)) return;
	$("#" + divId).toggleClass('ui-helper-hidden');
	return false;
};

/**
 * A helper function to check whether the button is already clicked or the form is already submitted or not. If is already clicked
 * then shows a alert message.
 * @param pblnShowAlert Flag to control whether an alert box is displayed or not on duplicate click.
 * @param pstrMsg The duplicate click error message to be shown.
 */
function checkIfClicked(pblnShowAlert, pstrMsg) {
	if (!_blnClicked) {
		_blnClicked = true;
		return false;
	}

	if (pblnShowAlert && !isEmpty(pstrMsg))
		alert(pstrMsg);
	return true;
};

/**
 * Function to remove left and right space of the entered value.
 * @param pstr The control whose value is to be altered.
 * @return nothing
 */
function trim(pstr) {
  var tstr = new String(pstr);
  tstr = tstr.replace(/^\s*/, "");
  tstr = tstr.replace(/\s*$/, "");
  return tstr.valueOf();
};

function openMailClient(ctrl) {
	if (!ctrl) return;
	var mailto_link = "mailto://" + $(ctrl).text() + "?subject=General Enquiry";
	var win = window.open(mailto_link,'emailWindow');
	if (win && win.open && !win.closed) win.close();
};

/**
 * Function for sending the messages via contatct us panel
 */
function sendMessage() {
	$.blockUI({message: '<h2><img src="static/images/backgrounds/busy.gif" class="middleAlign"/>&nbsp;Processing your request...</h2>',
				css:{ height:'32px',padding:'8px 0 0 0'}});

	var strData = {};
	var csrfField = document.getElementById('csrfTok');
	var frm = document.getElementById('frmContact');

	strData['messageCode'] = frm.subject.options[frm.subject.selectedIndex].value;
	strData['messageText'] = frm.message.value;
	strData['viewState'] = frm.viewState.value;
	strData[csrfField.name] = csrfField.value;
	strData['current_locale'] = frm.current_locale.value;
	// Send the AJAX request.
	//$.post('sendMessage.form', strData, sendStatus, "json");
	$.ajax({
		cache: false,
		complete: function(XMLHttpRequest, textStatus) {
			$.unblockUI();
			if ("error" == textStatus)
				alert("Unable to complete your request!");
		},
		data: strData,
		dataType: 'json',
		success: sendStatus,
		url: 'sendMessage.form',
		type:'POST'
	});
};

/**
 * A callback function to display the result of send message operation.
 * @param data the JOSN return value.
 */
function sendStatus(data, textStatus, XMLHttpRequest) {
	$.unblockUI();
	if ("success" == textStatus && data.ERROR)
		alert("Unable to send the message!");
	else {
		alert("Your message has been delivered!");
		$('#message').val('');
	}
};

function start_blocking(strMsg, ctrl) {
	// Greyed out links are still clickable and this script will still get called from the click handler
	// However in such scenario we do not want the UI blocking to happen and hence we simply return.
	if (ctrl.className.startsWith("imagelink grey"))
		return;

	cursor_wait();
	var ctrlType = get_type(ctrl);
	if (ctrlType === '[object HTMLButtonElement]' || ((ctrlType === '[object HTMLInputElement]') &&
			(ctrl.type === 'button' || ctrl.type === 'submit'))) {
		ctrl.disabled = true;
	}

	$.blockUI({message: '<div id="loadingMsg"><img src="static/styles/Themes/t7-main/resources/images/T7/loading.gif" style="background-position: left center;"/><span style="vertical-align: text-top; margin-left: 5px;">' + strMsg + '</span></div>'});
};


function unblock_ui(ctrl) {
	// Greyed out links are still clickable and this script will still get called from the click handler
	// However in such scenario we do not want the UI blocking to happen and hence we simply return.
	if (ctrl.className.startsWith("imagelink grey"))
		return;

	document.body.style.cursor = 'default';
	var ctrlType = get_type(ctrl);
	if (ctrlType === '[object HTMLButtonElement]' || ((ctrlType === '[object HTMLInputElement]') &&
			(ctrl.type === 'button' || ctrl.type === 'submit'))) {
		ctrl.disabled = false;
	}

	$.unblockUI();
};


function get_type(thing) {
    if (thing === null) return "[object Null]"; // special case
    return Object.prototype.toString.call(thing);
};

// Changes the cursor to an hourglass
function cursor_wait() {
	document.body.style.cursor = 'wait';
};

function toggleSideMenu() {
	var toc, sm;

	sm = $('#sidemenu');
	if (sm.length <= 0) sm = $('#sidepanel');
	if (sm.length <= 0) return;

	log('sidemenu float ' + sm.css('float'));
	$('#container').toggleClass('sideBarCollapsed');

	toc = $('#sideMenuResizer');
	if (toc.length > 0) {
		if (toc.hasClass('icon-misc-smrcolapse')) {
			log('Collapsing side menu!');
			// we need to collapse
			toc.removeClass('icon-misc-smrcolapse');
			toc.addClass('icon-misc-smrexpand');
			sm.toggleClass('ui-helper-hidden');
			if (sm.css('float') === 'left')
				toc.css('left', '7px');
			else
				toc.css('left', $('#container').outerWidth(true) -
								(($('#container').outerWidth(true) - $('#container').outerWidth())/2) - toc.outerWidth());
		} else {
			log('Expanding side menu!');
			// We need to expand
			toc.removeClass('icon-misc-smrexpand');
			toc.addClass('icon-misc-smrcolapse');
			sm.toggleClass('ui-helper-hidden');
			if (sm.css('float') === 'left')
				toc.css('left',  sm.offset().left + sm.outerWidth());
			else
				toc.css('left', sm.position().left - toc.outerWidth());
		}
		log('Sidemenu resizer X ' + toc.css('left'));
	}
};

var DateDiff = {
    inDays: function(d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();

        return parseInt((t2-t1)/(24*3600*1000),10);
    },

    inWeeks: function(d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();

        return parseInt((t2-t1)/(24*3600*1000*7),10);
    },

    inMonths: function(d1, d2) {
        var d1Y = d1.getFullYear();
        var d2Y = d2.getFullYear();
        var d1M = d1.getMonth();
        var d2M = d2.getMonth();

        return (d2M+12*d2Y)-(d1M+12*d1Y);
    },

    inYears: function(d1, d2) {
        return d2.getFullYear()-d1.getFullYear();
    }
};

function sortBy(field, reverse, primer) {
	reverse = (reverse) ? -1 : 1;
	return function(a,b) {
		var c,d;
		c = a[field];
		d = b[field];
		if (typeof(primer) != 'undefined') {
			c = primer(a);
			d = primer(b);
		}
		if (c < d) return reverse * -1;
		if (c > d) return reverse * 1;
		return 0;
	}
};

function log(msg) {
  if (window.console && console.log && msg) {
    console.log(msg); //for firebug
  }
  //document.write(msg); //write to screen
  $("#logBox").append(msg); //log to container
};

function persistSideMenu(toc, sm) {
	/* To check status of sidemenu or sidepanel */
	var cookie = readCookie("sideMenuResizer");
	eraseCookie("sideMenuResizer");

	if (toc) {
		if ("collapsed" == cookie) {
			eraseCookie("sideMenuResizer");
			createCookie("sideMenuResizer", "collapsed", 1);
			// we need to collapse
			$(toc).removeClass('icon-misc-smcolapse');
			$(toc).addClass('icon-misc-smexpand');
			$(sm).toggleClass('ui-helper-hidden');
			toc.style.left = '7px';
			$('#container').toggleClass('sideBarCollapsed');
		}
	}
};

function isAmount(value) 
{
	if (value == null || !value.replace(",","").match(/^[-]?\d*\.?\d*$/)) return false; return true; 
}

function toggleExpandCollapseIcon(el){
	$(el).toggleClass('expandIcon collapseIcon');
	var bodyEl = $(el).parent('.smartnavHeader').next('.rightMenuBody');
	$(bodyEl).toggle();
}
	
function toggleLeftSidePanel()
	{
	var toc = document.getElementById('sideMenuResizer');
	var sidePanel = document.getElementById('leftactionmenu');
	if (toc) 
	{
		if ($(toc).hasClass('sidemenu_left_icon')) 
		{
		createCookie('sidemenu_state', 'Collapsed');
		$(toc).removeClass('sidemenu_left_icon');
		$(toc).addClass('sidemenu_right_icon');
		$(sidePanel).toggleClass('ui-helper-hidden');
		$("#content").width('96%');
		}
		else
		{
			createCookie('sidemenu_state', 'Visible');
			$(toc).removeClass('sidemenu_right_icon');
			$(toc).addClass('sidemenu_left_icon');
			$(sidePanel).toggleClass('ui-helper-hidden');
			$("#content").width('75%');
		}
			if (window.resizeContentPanel) resizeContentPanel(); 
	}
}

function toggleRightSidePanel()
	{
	var toc = document.getElementById('sideMenuResizer');
	var sidePanel = document.getElementById('rightactionmenu');
	if (toc) 
	{
		if ($(toc).hasClass('sidemenu_right_icon')) 
		{
		createCookie('sidemenu_state', 'Collapsed');
		$(toc).removeClass('sidemenu_right_icon');
		$(toc).addClass('sidemenu_left_icon');
		$(sidePanel).toggleClass('ui-helper-hidden');
		$("#content").width('96%');
		}
		else
		{
			createCookie('sidemenu_state', 'Visible');
			$(toc).removeClass('sidemenu_left_icon');
			$(toc).addClass('sidemenu_right_icon');
			$(sidePanel).toggleClass('ui-helper-hidden');
			$("#content").width('75%');
		}
			if (window.resizeContentPanel) resizeContentPanel(); 
	}
}
/* 
 * This function is used to clear local storage 
 */
function clearLocalStorage()
{
	if(localStorage)
	{
		localStorage.clear();
	}
}

function setSideMenuResizer(sidemenuState)
{
	var toc = document.getElementById('sideMenuResizer');
	if ('Collapsed' == sidemenuState)
	{
		if ($(toc).hasClass('leftfloating')) 
		{
			toggleLeftSidePanel();
		}
		else
		{
			toggleRightSidePanel();
		}
	}
}

/**
 * Helper function to redirect SSO cashin link in a new window/tab 
 */
function redirectToCashIn(url)
{
	var objBody = document.getElementById('ext-gen1019');
	var frmSSO = document.createElement('form');
	frmSSO.name = 'frmSSO';
	frmSSO.method = 'POST';
	frmSSO.action = url;
	frmSSO.target="sso_cashin";
	objBody.appendChild(frmSSO);
	frmSSO.submit();
}

/**
 * Helper function to set amount group based on language. 
 */
function setDigitAmtGroupFormat(strAmt)
{
	try
	{
		//FCM-46417 amount should not be 0.00 if the field declared as confidential
        if(strAmt && isNaN(strAmt) && strAmt.indexOf("CONFIDENTIAL") != -1)
        {
        return strAmt;
        }
		var amount = $("<input>").attr('type','hidden').autoNumeric("init", { aSep: strGrpSeparator, dGroup: strAmountDigitGroup, aDec: strDecSeparator, mDec: strMinFraction })
		.val(strAmt).autoNumeric('get');							
		//strAmt = parseFloat(amount);							
		strAmt = $("<input>").attr('type','hidden').autoNumeric("init",
				{
					aSep: strGrpSeparator,
					dGroup: strAmountDigitGroup,
					aDec: strDecSeparator,
					mDec: strMinFraction,
					vMax: 9999999999999999.99
				}).autoNumeric('set', amount).val();
	}
	catch(err)
	{		
		return strAmt;		
	}
	return strAmt;
}