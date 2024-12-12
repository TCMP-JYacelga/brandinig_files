var objJsonData = { "v":{}, "e":{}, "a":{} };
jQuery.fn.ForceNoSpecialSymbol = function() {
	return this.each(function() {
				$(this).keydown(function(event) {
					var key = event.charCode || event.keyCode || 0;
					// allow backspace, tab, delete, numbers
					// keypad numbers, letters ONLY
					if (window.event) { // IE
						key = event.keyCode;
					}
					if (event.which) { // Netscape/Firefox/Opera
						key = event.which;
					}
					if (event.shiftKey) {
						return false;
					}
					return (key == 8 || key == 9 || key == 46 || key == 190
							|| (key >= 37 && key <= 40)
							|| (key >= 48 && key <= 57)
							|| (key >= 96 && key <= 105) || (key >= 65 && key <= 90));
				})
			})
};
jQuery.fn.CorporationAutoComplete = function() {
	if(enityType == 1)
	{
		var seekUrl = "services/userseek/customerUserCorpSeek.json?$top=-1";
	}
	else
	{
		var seekUrl = "services/userseek/adminUserCorpSeek.json?$top=-1";
	}
    return this.each(function() {
                    $(this).autocomplete({
                                    source : function(request, response) {
                                                    $.ajax({
                                                            url : seekUrl,
                                                            dataType : "json",
                                                            data : {
                                                                            $autofilter : request.term,
                                                                            $sellerCode : userSeller
                                                            },
                                                            success : function(data) {
                                                                            var rec = data.d.preferences;
                                                                            response($.map(rec, function(item) {
                                                                                        return {
                                                                                                        label : item.DESCR,
																										value : item.CODE,
																										code  : item.CODE

                                                                                        }
                                                                        }));
                                                            }
                                            });
                                    },
                                    minLength : 1,
                                    select : function(event, ui) {
                                                    log(ui.item ? "Selected: " + ui.item.label + " -show lbl:"
                                                                                    + ui.item.lbl : "Nothing selected, input was "
                                                                                    + this.value);
                                                                                    var val = ui.item.code;
                                                                    $('#corporationId').val(ui.item.value);
																	$('#corporationDesc').val(ui.item.label);
																	setDirtyBit();
																	reloadClient();
                                                                    if (!isEmpty($('#clientID').val()) && !isEmpty($('#userID').val())){
                                                                                    $("#btnVerify").attr('disabled',false);
                                                                    }
                                    },
                                    open : function() {
                                                    $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
                                    },
                                    close : function() {
                                                    $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                                    }
                    });/*.data("autocomplete")._renderItem = function(ul, item) {

                                    var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:100px;" class="inline">'
                                                                    + item.label
                                                                    + '</ul><ul style="width:200px;font-size:0.8em;color:#06C;" class=inline>'
                                                                    + '</ul></ol></a>';                                                                       
                                    return $("<li></li>").data("item.autocomplete", item)
                                                                    .append(inner_html).appendTo(ul);
                    };*/
    });
};


function setDirtyBit()
{
	dityBitSet=true;
}

	function changename() {

	var user=$('#usrCodeInside').val();
			document.getElementById("userCodeId").value  = user.toUpperCase();
	}

function getCancelConfirmPopUp(strUrl) {
	var buttonsOpts = {};
	buttonsOpts[btnsArray['okBtn']] = function() {
		$(this).dialog("close");
		gotoPage(strUrl);
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		$(this).dialog("close");
	};
	if(dityBitSet)
	{
	$('#confirmMsgPopup').dialog({
				autoOpen : false,
				height : 250,
				width : 430,
				modal : true,
				buttons : buttonsOpts
			});
	$('#confirmMsgPopup').dialog("open");
	}
	else
	{
		gotoPage(strUrl);
	}
}

function roleChangeConfirmPopUp( mode, recKey ) {
		var buttonsOpts = {};
		$('#prevUsrCategory').val(document.getElementById('usrCategory').value);
		buttonsOpts[btnsArray['okBtn']] = function() {
			$('#prevUsrCategory').val = document.getElementById('usrCategory').value;
			showCategoryMask( mode, recKey );
			document.getElementById('usrCategory').value = $('#prevUsrCategory').val();
			//$(this).dialog("close");
		};
		buttonsOpts[btnsArray['cancelBtn']] = function() {
			setPreviousOption();
			$(this).dialog("close");
		};
		$('#roleChangeMsgPopup').dialog({
					autoOpen : false,
					height : 220,
					width : 430,
					modal : true,
					buttons : buttonsOpts,
					open: function() { 	setPreviousOption(); }
				});
		$('#roleChangeMsgPopup').dialog("open");
}

function setPreviousOption() {
    var sel = document.getElementById('usrCategory');
    var val = $('#prevUsrCategory').val();
    for(var i = 0, j = sel.options.length; i < j; ++i) {
        if(sel.options[i].innerHTML === val) {
           sel.selectedIndex = i;
           break;
        }
    }
}

function saveUser(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	$("input").removeAttr('disabled');
	if(null!=$('#defaultClient').val() && ''!=$('#defaultClient').val())
	{
		$('#clientCode').val($('#defaultClient').val());
	}
	if(!isEmpty($('#selectedRecords').val())){
		$('#selectedClientList').val($('#selectedRecords').val());
	}
	//if(null!=$('#usrDescription').val() && ''!=$('#usrDescription').val())
	//{
		//$('#usrFirstName').val($('#usrDescription').val());
		//$('#usrLastName').val($('#usrDescription').val());
	//}
	$('#userCodeId').val($('#usrCodeInside').val());
	document.getElementById("viewRightsSerials").value = JSON.stringify(objJsonData["v"]);
	document.getElementById("editRightsSerials").value = JSON.stringify(objJsonData["e"]);
	document.getElementById("authRightsSerials").value = JSON.stringify(objJsonData["a"]);	
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showCategoryMask(strAction,strRecKey)
{
	resetPopupSelections();
	var frm = document.forms["frmMain"]; 
	document.getElementById("viewRightsSerials").value = JSON.stringify(objJsonData["v"]);
	document.getElementById("editRightsSerials").value = JSON.stringify(objJsonData["e"]);
	document.getElementById("authRightsSerials").value = JSON.stringify(objJsonData["a"]);
	frm.target = "";
	if (strAction == "ADD" || strAction == "ADDCHNGCAT" || (strAction == "SAVE" && isEmpty(strRecKey) ) || (strAction=="COPYEXISTING" && ""==strRecKey))
	{
		frm.action = "changeUsrAdminCategoryAdd.form";
	}
	else if( strAction == "EDIT" || strAction == "UPDATE" || strAction == "SUBMIT" ||(strAction == "SAVE" && !isEmpty(strRecKey) ))
	{
		frm.action = "changeUsrAdminCategoryEdit.form";
	}
	frm.method = "POST";
	frm.appendChild(me.createFormField('INPUT', 'HIDDEN',
			csrfTokenName, tokenValue));
	frm.submit();

}

function showRoleDetails()
{
	var combo= $("#usrCategory");
	var selectedRole=combo.val();

	var categoryIdentifier = roles[selectedRole]
	//console.log(categoryIdentifier);
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 1000)/2;
	form = document.forms["frmMain"];
	//commented code doesnt work in MOZIILA
	/*form = document.createElement('FORM');
			form.name = 'categoryView';
			form.id = 'categoryView ';
			//form.method = 'POST';
			form.appendChild(createFormField('INPUT', 'HIDDEN',
					csrfTokenName, csrfTokenValue));
			form.appendChild(createFormField('INPUT', 'HIDDEN',
					'recordKeyNo', categoryIdentifier));
			form.appendChild(createFormField('INPUT', 'HIDDEN',
					'ROLEDETAILSVIEW_FROMUSER', "Y"));	*/
			document.getElementById("roleRecordKeyNo").value = categoryIdentifier;
			document.getElementById("ROLEDETAILSVIEW_FROMUSER").value = 'Y';

	form.action = 'verifyUserCategory.seek';
	form.target = "hWinSeek";
	form.method = "POST";
	strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=800,height=400";
	window.open ("", "hWinSeek", strAttr);
	form.submit();
	form.target = "";

}
function gotoPage(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function getUserDetails()
{
	var frm = document.forms["frmMain"];
	frm.action = "copyUserDetails.form";
	frm.target = "";
	frm.appendChild(me.createFormField('INPUT', 'HIDDEN',
			csrfTokenName, tokenValue));
	frm.method = "POST";
	frm.submit();
}
function reloadClient()
{
	var frm = document.forms["frmMain"];
	frm.action = "addUserAdmin.form";
	frm.target = "";
	frm.appendChild(me.createFormField('INPUT', 'HIDDEN',
			csrfTokenName, tokenValue));
	frm.method = "POST";
	frm.submit();
}
function populateCorporationList(obj)
{
	$(".selector").autocomplete({delay : 3000});
    $("#corporationDesc").CorporationAutoComplete();
}

// Shows tooltip on hover; useful when the field value is too long to accomodate.
jQuery.fn.showToolTip = function()
{
	return this
			.each(function() {
				var text = $(this).text();
				$(this).attr("title", text);
			})
};
function paintUserMasterActions(userMode,recordKeyNo)
{
	var elt = null, eltSubmit = null, eltCancel = null, eltSave = null, eltUpdate = null,eltBack = null,canShow = true;
	$('#userDtlActionButtonListLT,#userDtlActionButtonListRT, #userDtlActionButtonListLB, #userDtlActionButtonListRB')
			.empty();
	var strBtnLTLB = '#userDtlActionButtonListLT,#userDtlActionButtonListLB';
	var strBtnRTRB = '#userDtlActionButtonListRT,#userDtlActionButtonListRB';
	var nextUrl = "saveAndVerifyUser.form?"+csrfTokenName+"="+tokenValue;
	
	if ((recordKeyNo === null || recordKeyNo === '' ) && userMode !== 'EDITCHNGCAT') 
	{
		if(userMode ==='VIEW')
		{
			eltBack = createButton('btnBack', 'P', getLabel('btnBack','Back'));
			eltBack.click(function() {
						goToHome();
					});
			eltBack.appendTo($(strBtnRTRB));
			$(strBtnRTRB).append("&nbsp;");
		}
		else
		{
			eltSave = createButton('btnSave', 'P', getLabel('btnSave','Save'));
			eltSave.click(function() {
						saveUser("saveUserAdmin.form?"+csrfTokenName+"=" + tokenValue);
					});
			`.appendTo($(strBtnRTRB));
			$(strBtnRTRB).append("&nbsp;");

			eltSubmit = createButton('btnVerify', 'P', getLabel('btnNext','Next'));
			eltSubmit.click(function() {
				saveUser(nextUrl);
			});
			eltSubmit.appendTo($(strBtnRTRB));
			$(strBtnRTRB).append("&nbsp;");

			eltCancel = createButton('btnCancel', 'S', getLabel('btnCancel','Cancel'));
			eltCancel.click(function() {
					//	goToHome();
						warnBeforeCancel('userAdminList.form');
					});
			eltCancel.appendTo($(strBtnLTLB));
			$(strBtnLTLB).append("&nbsp;");
		}
	}
	else
	{
		if(userMode ==='VIEW')
		{
			eltBack = createButton('btnBack', 'P', getLabel('btnBack','Back'));
			eltBack.click(function() {
						goToHome();
					});
			eltBack.appendTo($(strBtnRTRB));
			$(strBtnRTRB).append("&nbsp;");
		}
		else
		{
			nextUrl = 'updateAndVerifyUser.form';
			eltUpdate = createButton('btnUpdate', 'P', getLabel('btnUpdate','Update'));
			eltUpdate.click(function() {
						saveUser('updateUserAdmin.form');
					});
			eltUpdate.appendTo($(strBtnRTRB));
			$(strBtnRTRB).append("&nbsp;");

			eltSubmit = createButton('btnVerify', 'P', getLabel('btnNext','Next'));
			eltSubmit.click(function() {
				saveUser(nextUrl);
			});
			eltSubmit.appendTo($(strBtnRTRB));
			$(strBtnRTRB).append("&nbsp;");

			eltCancel = createButton('btnCancel', 'S', getLabel('btnCancel','Cancel'));
			eltCancel.click(function() {
					//	goToHome();
						warnBeforeCancel('userAdminList.form');
					});
			eltCancel.appendTo($(strBtnLTLB));
			$(strBtnLTLB).append("&nbsp;");
			
		}
	}
}
function createButton(btnKey, charIsPrimary,btnVal) {
	var strCls = charIsPrimary === 'P'
			? 'ft-button-primary'
			: 'ft-button-secondary';
	var elt = null;

	if(btnKey == 'btnSave'){
		elt = $('<input>').attr({
			'type' : 'button',
			'tabindex' : 1,
			'class' : 'ft-button ft-margin-l ft-button-primary' ,
			'id' : 'button_' + btnKey,
			'value' : btnVal
		});
	}
	else if(btnKey == 'btnCancel'){
		elt = $('<input>').attr({
			'type' : 'button',
			'tabindex' : 1,
			'class' : 'ft-button ft-button-light',
			'id' : 'button_' + btnKey,
			'value' : btnVal
		});
	}
	else if(btnKey == 'btnVerify'){
		elt = $('<input>').attr({
			'type' : 'button',
			'tabindex' : 1,
			'class' : 'ft-button ft-margin-l ' + strCls,
			'id' : 'button_' + btnKey,
			'value' : btnVal
		});
	}else if (btnKey == 'btnUpdate'){
		elt = $('<input>').attr({
			'type' : 'button',
			'tabindex' : 1,
			'class' : 'ft-button ft-margin-l ft-button-primary',
			'id' : 'button_' + btnKey,
			'value' : btnVal
		});
	}else{
		elt = $('<input>').attr({
			'type' : 'button',
			'tabindex' : 1,
			'class' : 'ft-margin-l ft-btn-link ' + strCls,
			'id' : 'button_' + btnKey,
			'value' : btnVal
		});
	}

	return elt;
}
function goToHome()
{
	var frm = document.getElementById('frmMain');
	frm.action = 'userAdminList.form';
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function resetPopupSelections() {
	$('#selectedPayAccList').val('');
	$('#selectedPayPckgsList').val('');
	$('#selectedPayTemplList').val('');
	$('#selectedBRAccList').val('');
	$('#selectedNotionalList').val('');
	$('#selectedSweepList').val('');
	$('#selectedSCMProductList').val('');
	$('#selectedPortalAccList').val('');
	$('#selectedTradePackageList').val('');
	$('#selectedForecastPackageList').val('');
	$('#selectedCollAccList').val('');
	$('#selectedCollPckgsList').val('');
	$('#selectedLMSAccList').val('');

	$('#allBRAccSelectedFlag').val('');
}
function warnBeforeCancel(strUrl) {
	$('#confirmMsgPopup').dialog({
		autoOpen : false,
		maxHeight: 550,
		minHeight:'auto',
		width : 400,
		modal : true,
		resizable: false,
		draggable: false
		/*buttons : {
			"Ok" : function() {
				var frm = document.forms["frmMain"];
				frm.action = strUrl;
				frm.target = "";
				frm.method = "POST";
				frm.submit();
			},
			"Cancel" : function() {
				$(this).dialog("close");
			}
		}*/
	});
	$('#confirmMsgPopup').dialog("open");

	$('#cancelConfirmMsg').bind('click',function(){
		$('#confirmMsgPopup').dialog("close");
	});

	$('#doneConfirmMsgbutton').bind('click',function(){
		var frm = document.forms["frmMain"];
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	});
	$('#textContent').focus();
}
function getUserDetailReport(userCode,userCorporation){
	var form = document.createElement('FORM');
	var strUrl = "services/userMasterDetailReport.pdf";
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';
	form.appendChild(createFormField('INPUT', 'HIDDEN',
			csrfTokenName, tokenValue));
	form.appendChild(createFormField('INPUT', 'HIDDEN',
			'userCode', userCode));
	form.appendChild(createFormField('INPUT', 'HIDDEN',
			'userCorporation', userCorporation));
	form.action = strUrl;
	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);
}