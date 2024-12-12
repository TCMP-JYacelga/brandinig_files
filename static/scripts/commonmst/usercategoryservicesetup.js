function saveAdminFeatureProfile(strUrl) {
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	
	frm.submit();
}

function goToFeaturePage(strUrl) {
	var frm = document.forms["frmMain"];
	//var viewStateField = document.getElementById("viewState");
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.appendChild(createJSFormField('INPUT', 'HIDDEN', 'NEXT', 'TRUE'));
	frm.submit();
}

function goToPage(strUrl, frmId) {
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function warnBeforeCancel(strUrl) {
	$('#warningPopup').dialog({
		autoOpen : false,
		height : 200,
		width : 420,
		modal : true,
		buttons : [{
			text:getLabel('btnOk','Ok'),
			click : function() {
				var frm = document.forms["frmMain"];
				frm.action = strUrl;
				frm.target = "";
				frm.method = "POST";
				frm.submit();
			}
		},{
			text:getLabel('btnCancel','Cancel'),
			click : function() {
				$(this).dialog("close");
			}
		}]
	});
	$('#warningPopup').dialog("open");
}
function paintUserCategoryAdminActions(userMode)
{
	var elt = null, eltCancel = null, eltSave = null, eltUpdate = null,eltNext = null,canShow = true;
	$('#userCategoryAdminActionButtonListLT,#userCategoryAdminActionButtonListLB, #userCategoryAdminActionButtonListRB, #userCategoryAdminActionButtonListRT').empty();
	var strBtnLTLB = '#userCategoryAdminActionButtonListLT,#userCategoryAdminActionButtonListLB';
	var strBtnRTRB = '#userCategoryAdminActionButtonListRT,#userCategoryAdminActionButtonListRB';

	/*if(userMode.indexOf('MODIFIEDVIEW') > -1 || userMode.indexOf('VIEW') > -1)
	{
	eltCancel = createButton('btnCancel', 'S', 'Cancel');
	eltCancel.click(function() {
		saveAdminFeatureProfile('userAdminCategoryList.form');
			});
	eltCancel.appendTo($(strBtnLTLB));
	$(strBtnLTLB).append("&nbsp;");
	
	eltSave = createButton('btnSave', 'P', 'Save');
	eltSave.click(function() {
				saveAdminFeatureProfile('saveUserCategoryAdminFeature.form');
			});
	eltSave.appendTo($(strBtnRTRB));
	$(strBtnRTRB).append("&nbsp;");
	
	eltNext = createButton('btnNext', 'P', 'Next');
	eltNext.click(function() {
		goToFeaturePage('saveUserCategoryAdminFeature.form');
	});
	eltNext.appendTo($(strBtnRTRB));
	$(strBtnRTRB).append("&nbsp;");	
	}	else
	{
		eltCancel = createButton('btnCancel', 'S', 'Cancel');
		eltCancel.click(function() {
					warnBeforeCancel('userAdminCategoryList.form');
				});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
	}*/
	if(userMode.indexOf('MODIFIEDVIEW') > -1 || userMode.indexOf('VIEW') > -1)
	{
		eltCancel = createButton('btnCancel', 'S', getLabel('btnCancel','Cancel'));
		eltCancel.click(function() {
					saveAdminFeatureProfile('userAdminCategoryList.form');
				});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
		
		if(userMode === 'ADD')
		{
			eltSave = createButton('btnSave', 'P', getLabel('btnSave','Save'));
			eltSave.click(function() {
						saveAdminFeatureProfile('saveUserCategoryAdminFeature.form');
					});
			eltSave.appendTo($(strBtnRTRB));
			$(strBtnRTRB).append("&nbsp;");
		}
		if(userMode === 'EDIT')
		{
			eltUpdate = createButton('btnUpdate', 'P',getLabel('btnUpdate','Update'));
			eltUpdate.click(function() {
						saveAdminFeatureProfile('saveUserCategoryAdminFeature.form');
					});
			eltUpdate.appendTo($(strBtnRTRB));
			$(strBtnRTRB).append("&nbsp;");
		}
		
		eltNext = createButton('btnNext', 'P',getLabel('btnNext','Next'));
		eltNext.click(function() {
			goToPage('nextOnViewUserCategoryAdminFeature.form','frmMain');
		});
		eltNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	else
	{
		eltCancel = createButton('btnCancel', 'S', getLabel('btnCancel','Cancel'));
		eltCancel.click(function() {
					warnBeforeCancel('userAdminCategoryList.form');
				});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
		
		if(userMode === 'ADD')
		{
			eltSave = createButton('btnSave', 'P',  getLabel('btnSave','Save'));
			eltSave.click(function() {
						saveAdminFeatureProfile('saveUserCategoryAdminFeature.form');
					});
			eltSave.appendTo($(strBtnRTRB));
			$(strBtnRTRB).append("&nbsp;");
		}
		if(userMode === 'EDIT')
		{
			eltUpdate = createButton('btnUpdate', 'P',getLabel('btnUpdate','Update'));
			eltUpdate.click(function() {
						saveAdminFeatureProfile('saveUserCategoryAdminFeature.form');
					});
			eltUpdate.appendTo($(strBtnRTRB));
			$(strBtnRTRB).append("&nbsp;");
		}
		eltNext = createButton('btnNext', 'P',getLabel('btnNext','Next'));
		eltNext.click(function() {
			goToFeaturePage('saveUserCategoryAdminFeature.form');
		});
		eltNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
		
}
function paintUserCategoryPayActions(userMode)
{
	var elt = null, eltCancel = null, eltSave = null, eltUpdate = null,eltNext = null;
	$('#userCategoryPayActionButtonListLT,#userCategoryPayActionButtonListLB, #userCategoryPayActionButtonListRB, #userCategoryPayActionButtonListRT').empty();
	var strBtnLTLB = '#userCategoryPayActionButtonListLT,#userCategoryPayActionButtonListLB';
	var strBtnRTRB = '#userCategoryPayActionButtonListRT,#userCategoryPayActionButtonListRB';
	
	if(userMode.indexOf('MODIFIEDVIEW') > -1 || userMode.indexOf('VIEW') > -1)
	{
		eltCancel = createButton('btnCancel', 'S', getLabel('btnCancel','Cancel'));
		eltCancel.click(function() {
					saveAdminFeatureProfile('userAdminCategoryList.form');
				});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
		
		if(userMode === 'ADD')
		{
			eltSave = createButton('btnSave', 'P', getLabel('btnSave','Save'));
			eltSave.click(function() {
						saveAdminFeatureProfile('saveUserCategoryPayFeature.form');
					});
			eltSave.appendTo($(strBtnRTRB));
			$(strBtnRTRB).append("&nbsp;");
		}
		if(userMode === 'EDIT')
		{
			eltUpdate = createButton('btnUpdate', 'P', getLabel('btnUpdate','Update'));
			eltUpdate.click(function() {
						saveAdminFeatureProfile('saveUserCategoryPayFeature.form');
					});
			eltUpdate.appendTo($(strBtnRTRB));
			$(strBtnRTRB).append("&nbsp;");
		}
		
		eltNext = createButton('btnNext', 'P', getLabel('btnNext','Next'));
		eltNext.click(function() {
			goToPage('nextOnViewUserCategoryAdminFeature.form','frmMain');
		});
		eltNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	else
	{
		eltCancel = createButton('btnCancel', 'S',getLabel('btnCancel','Cancel'));
		eltCancel.click(function() {
					warnBeforeCancel('userAdminCategoryList.form');
				});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
		
		if(userMode === 'ADD')
		{
			eltSave = createButton('btnSave', 'P', getLabel('btnSave','Save'));
			eltSave.click(function() {
						saveAdminFeatureProfile('saveUserCategoryPayFeature.form');
					});
			eltSave.appendTo($(strBtnRTRB));
			$(strBtnRTRB).append("&nbsp;");
		}
		if(userMode === 'EDIT')
		{
			eltUpdate = createButton('btnUpdate', 'P', getLabel('btnUpdate','Update'));
			eltUpdate.click(function() {
						saveAdminFeatureProfile('saveUserCategoryPayFeature.form');
					});
			eltUpdate.appendTo($(strBtnRTRB));
			$(strBtnRTRB).append("&nbsp;");
		}
		eltNext = createButton('btnNext', 'P', getLabel('btnNext','Next'));
		eltNext.click(function() {
			goToFeaturePage('saveUserCategoryPayFeature.form');
		});
		eltNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
}
function paintUserCategoryBRActions(userMode){
	var elt = null, eltCancel = null, eltSave = null, eltUpdate = null,eltNext = null;
	$('#userCategoryBRActionButtonListLT,#userCategoryBRActionButtonListLB, #userCategoryBRActionButtonListRB, #userCategoryBRActionButtonListRT').empty();
	var strBtnLTLB = '#userCategoryBRActionButtonListLT,#userCategoryBRActionButtonListLB';
	var strBtnRTRB = '#userCategoryBRActionButtonListRT,#userCategoryBRActionButtonListRB';
	
	if(userMode === 'ADD')
	{
		eltSave = createButton('btnSave', 'P', getLabel('btnSave','Save'));
		eltSave.click(function() {
					saveAdminFeatureProfile('saveUserCategoryBrFeature.form');
				});
		eltSave.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	if(userMode === 'EDIT')
	{
		eltUpdate = createButton('btnUpdate', 'P', getLabel('btnUpdate','Update'));
		eltUpdate.click(function() {
					saveAdminFeatureProfile('saveUserCategoryBrFeature.form');
				});
		eltUpdate.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	if(userMode.indexOf('MODIFIEDVIEW') > -1 || userMode.indexOf('VIEW') > -1)
	{
		eltCancel = createButton('btnCancel', 'S', getLabel('btnCancel','Cancel'));
		eltCancel.click(function() {
					saveAdminFeatureProfile('userAdminCategoryList.form');
				});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
				
		eltNext = createButton('btnNext', 'P', getLabel('btnNext','Next'));
		eltNext.click(function() {
			goToPage('nextOnViewUserCategoryAdminFeature.form','frmMain');
		});
		eltNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	else
	{
		eltCancel = createButton('btnCancel', 'S',getLabel('btnCancel','Cancel'));
		eltCancel.click(function() {
					warnBeforeCancel('userAdminCategoryList.form');
				});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");

		eltNext = createButton('btnNext', 'P', getLabel('btnNext','Next'));
		eltNext.click(function() {
			goToFeaturePage('saveUserCategoryBrFeature.form');
		});
		eltNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	
}
function paintUserCategoryPortalActions(userMode){
	var elt = null, eltCancel = null, eltSave = null, eltUpdate = null,eltNext = null;
	$('#userCategoryPortalActionButtonListLT,#userCategoryPortalActionButtonListLB, #userCategoryPortalActionButtonListRB, #userCategoryPortalActionButtonListRT').empty();
	var strBtnLTLB = '#userCategoryPortalActionButtonListLT,#userCategoryPortalActionButtonListLB';
	var strBtnRTRB = '#userCategoryPortalActionButtonListRT,#userCategoryPortalActionButtonListRB';
	
	if(userMode === 'ADD')
	{
		eltSave = createButton('btnSave', 'P',getLabel('btnSave','Save'));
		eltSave.click(function() {
					saveAdminFeatureProfile('saveUserCategoryPortalFeature.form');
				});
		eltSave.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	if(userMode === 'EDIT')
	{
		eltUpdate = createButton('btnUpdate', 'P', getLabel('btnUpdate','Update'));
		eltUpdate.click(function() {
					saveAdminFeatureProfile('saveUserCategoryPortalFeature.form');
				});
		eltUpdate.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	if(userMode.indexOf('MODIFIEDVIEW') > -1 || userMode.indexOf('VIEW') > -1)
	{
		eltCancel = createButton('btnCancel', 'S', getLabel('btnCancel','Cancel'));
		eltCancel.click(function() {
					saveAdminFeatureProfile('userAdminCategoryList.form');
				});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
				
		eltNext = createButton('btnNext', 'P', getLabel('btnNext','Next'));
		eltNext.click(function() {
			goToPage('nextOnViewUserCategoryAdminFeature.form','frmMain');
		});
		eltNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	else
	{
		eltCancel = createButton('btnCancel', 'S', getLabel('btnCancel','Cancel'));
		eltCancel.click(function() {
					warnBeforeCancel('userAdminCategoryList.form');
				});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");

		eltNext = createButton('btnNext', 'P', getLabel('btnNext','Next'));
		eltNext.click(function() {
			goToFeaturePage('saveUserCategoryPortalFeature.form');
		});
		eltNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	
}
function paintUserCategoryOtherActions(userMode)
{
	var elt = null, eltCancel = null, eltSave = null, eltUpdate = null,eltNext = null;
	$('#userCategoryOthActionButtonListLT,#userCategoryOthActionButtonListLB, #userCategoryOthActionButtonListRB, #userCategoryOthActionButtonListRT').empty();
	var strBtnLTLB = '#userCategoryOthActionButtonListLT,#userCategoryOthActionButtonListLB';
	var strBtnRTRB = '#userCategoryOthActionButtonListRT,#userCategoryOthActionButtonListRB';
	
	if(userMode === 'ADD')
	{
		eltSave = createButton('btnSave', 'P',getLabel('btnSave','Save'));
		eltSave.click(function() {
					saveClientOthersFeatureProfile();
				});
		eltSave.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	if(userMode === 'EDIT')
	{
		eltUpdate = createButton('btnUpdate', 'P', getLabel('btnUpdate','Update'));
		eltUpdate.click(function() {
					saveClientOthersFeatureProfile();
				});
		eltUpdate.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	if(userMode.indexOf('MODIFIEDVIEW') > -1 || userMode.indexOf('VIEW') > -1)
	{
		eltCancel = createButton('btnCancel', 'S', getLabel('btnCancel','Cancel'));
		eltCancel.click(function() {
					saveAdminFeatureProfile('userAdminCategoryList.form');
				});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
				
		eltNext = createButton('btnNext', 'P', getLabel('btnNext','Next'));
		eltNext.click(function() {
			goToPage('nextOnViewUserCategoryAdminFeature.form','frmMain');
		});
		eltNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	else
	{
		eltCancel = createButton('btnCancel', 'S', getLabel('btnCancel','Cancel'));
		eltCancel.click(function() {
					warnBeforeCancel('userAdminCategoryList.form');
				});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");

		eltNext = createButton('btnNext', 'P', getLabel('btnNext','Next'));
		eltNext.click(function() {
			saveAdminFeatureProfile('nextOnViewUserCategoryAdminFeature.form');
		});
		eltNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
}
function paintUserCategoryBrRepActions(userMode)
{
	var elt = null, eltCancel = null, eltSave = null, eltUpdate = null,eltNext = null;
	$('#userCategoryBRRepActionButtonListLT,#userCategoryBRRepActionButtonListLB, #userCategoryBRRepActionButtonListRB, #userCategoryBRRepActionButtonListRT').empty();
	var strBtnLTLB = '#userCategoryBRRepActionButtonListLT,#userCategoryBRRepActionButtonListLB';
	var strBtnRTRB = '#userCategoryBRRepActionButtonListRT,#userCategoryBRRepActionButtonListRB';
	
	if(userMode === 'ADD')
	{
		eltSave = createButton('btnSave', 'P', getLabel('btnSave','Save'));
		eltSave.click(function() {
					saveAdminFeatureProfile('saveUserCategoryAdminFeature.form');
				});
		eltSave.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	if(userMode === 'EDIT')
	{
		eltUpdate = createButton('btnUpdate', 'P', getLabel('btnUpdate','Update'));
		eltUpdate.click(function() {
					saveAdminFeatureProfile('saveUserCategoryAdminFeature.form');
				});
		eltUpdate.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	if(userMode.indexOf('MODIFIEDVIEW') > -1 || userMode.indexOf('VIEW') > -1)
	{
		eltCancel = createButton('btnCancel', 'S', getLabel('btnCancel','Cancel'));
		eltCancel.click(function() {
					saveAdminFeatureProfile('userAdminCategoryList.form');
				});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
				
		eltNext = createButton('btnNext', 'P', getLabel('btnNext','Next'));
		eltNext.click(function() {
			goToPage('nextOnViewUserCategoryAdminFeature.form','frmMain');
		});
		eltNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	else
	{
		eltCancel = createButton('btnCancel', 'S',getLabel('btnCancel','Cancel'));
		eltCancel.click(function() {
					warnBeforeCancel('userAdminCategoryList.form');
				});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");

		eltNext = createButton('btnNext', 'P', getLabel('btnNext','Next'));
		eltNext.click(function() {
			saveAdminFeatureProfile('nextOnViewUserCategoryAdminFeature.form');
		});
		eltNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
}
function paintUserRoleVerifyActionsList(requestState,submitFlagInDB)
{
	var elt = null, eltCancel = null, eltSubmit = null, eltClose = null;
	$('#userRoleVerifyActionButtonListLT,#userRoleVerifyActionButtonListLB, #userRoleVerifyActionButtonListRB, #userRoleVerifyActionButtonListRT').empty();
	var strBtnLTLB = '#userRoleVerifyActionButtonListLT,#userRoleVerifyActionButtonListLB';
	var strBtnRTRB = '#userRoleVerifyActionButtonListRT,#userRoleVerifyActionButtonListRB';
	if (serverMode != 'VIEW') {
		eltCancel = createButton('btnCancel', 'S', getLabel('btnCancel',
						'Cancel'));
		eltCancel.click(function() {
					goToPage('userAdminCategoryList.form', 'frmMain');
				});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
		if ((requestState == 1 || requestState == 0) && submitFlagInDB === 'N') {
			eltSubmit = createButton('btnSubmit', 'P', getLabel('btnSubmit',
							'Submit'));
			eltSubmit.click(function() {
						goToPage('submitUserCategory.form', 'frmMain');
					});
			eltSubmit.appendTo($(strBtnRTRB));
			$(strBtnRTRB).append("&nbsp;");
		} else {
			eltSubmit = createButton('btnSubmit', 'P', getLabel('btnSubmit',
							'Submit'));
			eltSubmit.appendTo($(strBtnRTRB));
			$(strBtnRTRB).append("&nbsp;");
		}
	} else {
		eltClose = createButton('btnCancel', 'S', getLabel('btnClose', 'Close'));
		eltClose.click(function() {
					goToPage('userAdminCategoryList.form', 'frmMain');
				});
		eltClose.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
	}
}
function paintUserCategoryCollActions(userMode)
{
	var elt = null, eltCancel = null, eltSave = null, eltUpdate = null,eltNext = null;
	$('#userCategoryCollActionButtonListLT,#userCategoryCollActionButtonListLB, #userCategoryCollActionButtonListRB, #userCategoryCollActionButtonListRT').empty();
	var strBtnLTLB = '#userCategoryCollActionButtonListLT,#userCategoryCollActionButtonListLB';
	var strBtnRTRB = '#userCategoryCollActionButtonListRT,#userCategoryCollActionButtonListRB';
	
	if(userMode === 'ADD')
	{
		eltSave = createButton('btnSave', 'P', 'Save');
		eltSave.click(function() {
					saveAdminFeatureProfile('saveUserCategoryCollFeature.form');
				});
		eltSave.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	if(userMode === 'EDIT')
	{
		eltUpdate = createButton('btnUpdate', 'P', getLabel('btnUpdate','Update'));
		eltUpdate.click(function() {
					saveAdminFeatureProfile('saveUserCategoryCollFeature.form');
				});
		eltUpdate.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	if(userMode.indexOf('MODIFIEDVIEW') > -1 || userMode.indexOf('VIEW') > -1)
	{
		eltCancel = createButton('btnCancel', 'S', getLabel('btnCancel','Cancel'));
		eltCancel.click(function() {
					saveAdminFeatureProfile('userAdminCategoryList.form');
				});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
				
		eltNext = createButton('btnNext', 'P', getLabel('btnNext','Next'));
		eltNext.click(function() {
			goToPage('nextOnViewUserCategoryAdminFeature.form','frmMain');
		});
		eltNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	else
	{
		eltCancel = createButton('btnCancel', 'S', getLabel('btnCancel','Cancel'));
		eltCancel.click(function() {
					warnBeforeCancel('userAdminCategoryList.form');
				});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");

		eltNext = createButton('btnNext', 'P', getLabel('btnNext','Next'));
		eltNext.click(function() {
			goToFeaturePage('saveUserCategoryCollFeature.form');
		});
		eltNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
}
function paintUserCategoryLMSActions(userMode)
{
	var elt = null, eltCancel = null, eltSave = null, eltUpdate = null,eltNext = null;
	$('#userCategoryLMSActionButtonListLT,#userCategoryCollActionButtonListLB, #userCategoryCollActionButtonListRB, #userCategoryLMSActionButtonListRT').empty();
	var strBtnLTLB = '#userCategoryLMSActionButtonListLT,#userCategoryLMSActionButtonListLB';
	var strBtnRTRB = '#userCategoryLMSActionButtonListRT,#userCategoryLMSActionButtonListRB';
	
	if(userMode === 'ADD')
	{
		eltSave = createButton('btnSave', 'P', getLabel('btnSave','Save'));
		eltSave.click(function() {
					saveAdminFeatureProfile('saveUserCategoryLiquidityFeature.form');
				});
		eltSave.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	if(userMode === 'EDIT')
	{
		eltUpdate = createButton('btnUpdate', 'P', getLabel('btnUpdate','Update'));
		eltUpdate.click(function() {
					saveAdminFeatureProfile('saveUserCategoryLiquidityFeature.form');
				});
		eltUpdate.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	
	if(userMode.indexOf('MODIFIEDVIEW') > -1 || userMode.indexOf('VIEW') > -1)
	{
		eltCancel = createButton('btnCancel', 'S', getLabel('btnCancel','Cancel'));
		eltCancel.click(function() {
					saveAdminFeatureProfile('userAdminCategoryList.form');
				});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
				
		eltNext = createButton('btnNext', 'P', getLabel('btnNext','Next'));
		eltNext.click(function() {
			goToPage('nextOnViewUserCategoryAdminFeature.form','frmMain');
		});
		eltNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	else
	{
		eltCancel = createButton('btnCancel', 'S', getLabel('btnCancel','Cancel'));
		eltCancel.click(function() {
					warnBeforeCancel('userAdminCategoryList.form');
				});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");

		eltNext = createButton('btnNext', 'P', getLabel('btnNext','Next'));
		eltNext.click(function() {
			goToFeaturePage('saveUserCategoryLiquidityFeature.form');
		});
		eltNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
}
function paintUserCategoryFSCActions(userMode)
{
	var elt = null, eltCancel = null, eltSave = null, eltUpdate = null,eltNext = null;
	$('#userCategoryFSCActionButtonListLT,#userCategoryFSCActionButtonListLB, #userCategoryFSCActionButtonListRB, #userCategoryFSCActionButtonListRT').empty();
	var strBtnLTLB = '#userCategoryFSCActionButtonListLT,#userCategoryFSCActionButtonListLB';
	var strBtnRTRB = '#userCategoryFSCActionButtonListRT,#userCategoryFSCActionButtonListRB';
	
	if(userMode === 'ADD')
	{
		eltSave = createButton('btnSave', 'P',getLabel('btnSave','Save'));
		eltSave.click(function() {
					saveAdminFeatureProfile('saveUserCategoryFSCFeature.form');
				});
		eltSave.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	if(userMode === 'EDIT')
	{
		eltUpdate = createButton('btnUpdate', 'P', getLabel('btnUpdate','Update'));
		eltUpdate.click(function() {
					saveAdminFeatureProfile('saveUserCategoryFSCFeature.form');
				});
		eltUpdate.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	if(userMode.indexOf('MODIFIEDVIEW') > -1 || userMode.indexOf('VIEW') > -1)
	{
		eltCancel = createButton('btnCancel', 'S', getLabel('btnCancel','Cancel'));
		eltCancel.click(function() {
					saveAdminFeatureProfile('userAdminCategoryList.form');
				});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
				
		eltNext = createButton('btnNext', 'P', getLabel('btnNext','Next'));
		eltNext.click(function() {
			goToPage('nextOnViewUserCategoryAdminFeature.form','frmMain');
		});
		eltNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}else{
		eltCancel = createButton('btnCancel', 'S', getLabel('btnCancel','Cancel'));
		eltCancel.click(function() {
					warnBeforeCancel('userAdminCategoryList.form');
				});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");

		eltNext = createButton('btnNext', 'P', getLabel('btnNext','Next'));
		eltNext.click(function() {
			goToFeaturePage('saveUserCategoryFSCFeature.form');
		});
		eltNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
}
function paintUserCategoryForcastActions(userMode)
{
	var elt = null, eltCancel = null, eltSave = null, eltUpdate = null,eltNext = null;
	$('#userCategoryForcastActionButtonListLT,#userCategoryForcastActionButtonListLB, #userCategoryForcatsActionButtonListRB, #userCategoryForcastActionButtonListRT').empty();
	var strBtnLTLB = '#userCategoryForcastActionButtonListLT,#userCategoryForcastActionButtonListLB';
	var strBtnRTRB = '#userCategoryForcastActionButtonListRT,#userCategoryForcastActionButtonListRB';
	
	if(userMode === 'ADD')
	{
		eltSave = createButton('btnSave', 'P',getLabel('btnSave','Save'));
		eltSave.click(function() {
					saveAdminFeatureProfile('saveUserCategoryForecastFeature.form');
				});
		eltSave.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	if(userMode === 'EDIT')
	{
		eltUpdate = createButton('btnUpdate', 'P',getLabel('btnUpdate','Update'));
		eltUpdate.click(function() {
					saveAdminFeatureProfile('saveUserCategoryForecastFeature.form');
				});
		eltUpdate.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	if(userMode.indexOf('MODIFIEDVIEW') > -1 || userMode.indexOf('VIEW') > -1)
	{
		eltCancel = createButton('btnCancel', 'S', getLabel('btnCancel','Cancel'));
		eltCancel.click(function() {
					saveAdminFeatureProfile('userAdminCategoryList.form');
				});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
				
		eltNext = createButton('btnNext', 'P', getLabel('btnNext','Next'));
		eltNext.click(function() {
			goToPage('nextOnViewUserCategoryAdminFeature.form','frmMain');
		});
		eltNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}else{
		eltCancel = createButton('btnCancel', 'S', getLabel('btnCancel','Cancel'));
		eltCancel.click(function() {
					warnBeforeCancel('userAdminCategoryList.form');
				});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");

		eltNext = createButton('btnNext', 'P', getLabel('btnNext','Next'));
		eltNext.click(function() {
			goToFeaturePage('saveUserCategoryForecastFeature.form');
		});
		eltNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
}
function paintUserCategoryTradeActions(userMode)
{
	var elt = null, eltCancel = null, eltSave = null, eltUpdate = null,eltNext = null;
	$('#userCategoryTradeActionButtonListLT,#userCategoryTradeActionButtonListLB, #userCategoryTradeActionButtonListRB, #userCategoryTradeActionButtonListRT').empty();
	var strBtnLTLB = '#userCategoryTradeActionButtonListLT,#userCategoryTradeActionButtonListLB';
	var strBtnRTRB = '#userCategoryTradeActionButtonListRT,#userCategoryTradeActionButtonListRB';
	
	if(userMode === 'ADD')
	{
		eltSave = createButton('btnSave', 'P',getLabel('btnSave','Save'));
		eltSave.click(function() {
					saveAdminFeatureProfile('saveUserCategoryTradeFeature.form');
				});
		eltSave.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	if(userMode === 'EDIT')
	{
		eltUpdate = createButton('btnUpdate', 'P',getLabel('btnUpdate','Update'));
		eltUpdate.click(function() {
					saveAdminFeatureProfile('saveUserCategoryTradeFeature.form');
				});
		eltUpdate.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	
	if(userMode.indexOf('MODIFIEDVIEW') > -1 || userMode.indexOf('VIEW') > -1)
	{
		eltCancel = createButton('btnCancel', 'S', getLabel('btnCancel','Cancel'));
		eltCancel.click(function() {
			saveAdminFeatureProfile('userAdminCategoryList.form');
		});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
				
		eltNext = createButton('btnNext', 'P', getLabel('btnNext','Next'));
		eltNext.click(function() {
			goToPage('nextOnViewUserCategoryAdminFeature.form', 'frmMain');
		});
		eltNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	else
	{
		eltCancel = createButton('btnCancel', 'S', getLabel('btnCancel','Cancel'));
		eltCancel.click(function() {
			warnBeforeCancel('userAdminCategoryList.form');
		});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");

		eltNext = createButton('btnNext', 'P', getLabel('btnNext','Next'));
		eltNext.click(function() {
			goToFeaturePage('saveUserCategoryTradeFeature.form');
		});
		eltNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
}
function paintUserCategoryLoanActions(userMode)
{
	var elt = null, eltCancel = null, eltSave = null, eltUpdate = null,eltNext = null,canShow = true;
	$('#userCategoryLoanActionButtonListLT,#userCategoryLoanActionButtonListLB, #userCategoryLoanActionButtonListRB, #userCategoryLoanActionButtonListRT').empty();
	var strBtnLTLB = '#userCategoryLoanActionButtonListLT,#userCategoryLoanActionButtonListLB';
	var strBtnRTRB = '#userCategoryLoanActionButtonListRT,#userCategoryLoanActionButtonListRB';
	
	if(userMode === 'ADD')
	{
		eltSave = createButton('btnSave', 'P', getLabel('btnSave','Save'));
		eltSave.click(function() {
			saveAdminFeatureProfile('saveUserCategoryLoansFeature.form');
				});
		eltSave.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	if(userMode === 'EDIT')
	{
		eltUpdate = createButton('btnUpdate', 'P',getLabel('btnUpdate','Update'));
		eltUpdate.click(function() {
			saveAdminFeatureProfile('saveUserCategoryLoansFeature.form');
				});
		eltUpdate.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	if(userMode.indexOf('MODIFIEDVIEW') > -1 || userMode.indexOf('VIEW') > -1)
	{
		eltCancel = createButton('btnCancel', 'S',getLabel('btnCancel','Cancel'));
		eltCancel.click(function() {
			saveAdminFeatureProfile('userAdminCategoryList.form');
		});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
				
		eltNext = createButton('btnNext', 'P', getLabel('btnNext','Next'));
		eltNext.click(function() {
			saveAdminFeatureProfile('nextOnViewUserCategoryAdminFeature.form');
		});
		eltNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	else
	{
		eltCancel = createButton('btnCancel', 'S',getLabel('btnCancel','Cancel'));
		eltCancel.click(function() {
			warnBeforeCancel('userAdminCategoryList.form');
		});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");

		eltNext = createButton('btnNext', 'P', getLabel('btnNext','Next'));
		eltNext.click(function() {
			goToFeaturePage('saveUserCategoryLoansFeature.form');
		});
		eltNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
}

function paintUserCategoryPositivePayActions(userMode)
{
	var elt = null, eltCancel = null, eltSave = null, eltUpdate = null,eltNext = null,canShow = true;
	$('#userCategoryPositivePayActionButtonListLT,#userCategoryPositivePayActionButtonListLB, #userCategoryPositivePayActionButtonListRB, #userCategoryPositivePayActionButtonListRT').empty();
	var strBtnLTLB = '#userCategoryPositivePayActionButtonListLT,#userCategoryPositivePayActionButtonListLB';
	var strBtnRTRB = '#userCategoryPositivePayActionButtonListRT,#userCategoryPositivePayActionButtonListRB';
	
	if(userMode === 'ADD')
	{
		eltSave = createButton('btnSave', 'P', getLabel('btnSave','Save'));
		eltSave.click(function() {
			saveAdminFeatureProfile('saveUserCategoryPositivePayFeature.form');
				});
		eltSave.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	if(userMode === 'EDIT')
	{
		eltUpdate = createButton('btnUpdate', 'P',getLabel('btnUpdate','Update'));
		eltUpdate.click(function() {
			saveAdminFeatureProfile('saveUserCategoryPositivePayFeature.form');
				});
		eltUpdate.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	if(userMode.indexOf('MODIFIEDVIEW') > -1 || userMode.indexOf('VIEW') > -1)
	{
		eltCancel = createButton('btnCancel', 'S',getLabel('btnCancel','Cancel'));
		eltCancel.click(function() {
			saveAdminFeatureProfile('userAdminCategoryList.form');
		});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
				
		eltNext = createButton('btnNext', 'P', getLabel('btnNext','Next'));
		eltNext.click(function() {
			saveAdminFeatureProfile('nextOnViewUserCategoryAdminFeature.form');
		});
		eltNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	else
	{
		eltCancel = createButton('btnCancel', 'S',getLabel('btnCancel','Cancel'));
		eltCancel.click(function() {
			warnBeforeCancel('userAdminCategoryList.form');
		});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");

		eltNext = createButton('btnNext', 'P', getLabel('btnNext','Next'));
		eltNext.click(function() {
			goToFeaturePage('saveUserCategoryPositivePayFeature.form');
		});
		eltNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
}

function paintUserCategoryChecksActions(userMode)
{
	var elt = null, eltCancel = null, eltSave = null, eltUpdate = null,eltNext = null,canShow = true;
	$('#userCategoryChecksActionButtonListLT,#userCategoryChecksActionButtonListLB, #userCategoryChecksActionButtonListRB, #userCategoryChecksActionButtonListRT').empty();
	var strBtnLTLB = '#userCategoryChecksActionButtonListLT,#userCategoryChecksActionButtonListLB';
	var strBtnRTRB = '#userCategoryChecksActionButtonListRT,#userCategoryChecksActionButtonListRB';
	
	if(userMode === 'ADD')
	{
		eltSave = createButton('btnSave', 'P', getLabel('btnSave','Save'));
		eltSave.click(function() {
			saveAdminFeatureProfile('saveUserCategoryCheckFeature.form');
				});
		eltSave.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	if(userMode === 'EDIT')
	{
		eltUpdate = createButton('btnUpdate', 'P',getLabel('btnUpdate','Update'));
		eltUpdate.click(function() {
			saveAdminFeatureProfile('saveUserCategoryCheckFeature.form');
				});
		eltUpdate.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	if(userMode.indexOf('MODIFIEDVIEW') > -1 || userMode.indexOf('VIEW') > -1)
	{
		eltCancel = createButton('btnCancel', 'S',getLabel('btnCancel','Cancel'));
		eltCancel.click(function() {
			saveAdminFeatureProfile('userAdminCategoryList.form');
		});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
				
		eltNext = createButton('btnNext', 'P', getLabel('btnNext','Next'));
		eltNext.click(function() {
			saveAdminFeatureProfile('nextOnViewUserCategoryAdminFeature.form');
		});
		eltNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	else
	{
		eltCancel = createButton('btnCancel', 'S',getLabel('btnCancel','Cancel'));
		eltCancel.click(function() {
			warnBeforeCancel('userAdminCategoryList.form');
		});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");

		eltNext = createButton('btnNext', 'P', getLabel('btnNext','Next'));
		eltNext.click(function() {
			goToFeaturePage('saveUserCategoryCheckFeature.form');
		});
		eltNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
}

function paintUserCategoryIncomingAchActions(userMode)
{
	var elt = null, eltCancel = null, eltSave = null, eltUpdate = null,eltNext = null,canShow = true;
	$('#userCategoryIncomingAchActionButtonListLT,#userCategoryIncomingAchActionButtonListLB, #userCategoryIncomingAchActionButtonListRB, #userCategoryIncomingAchActionButtonListRT').empty();
	var strBtnLTLB = '#userCategoryIncomingAchActionButtonListLT,#userCategoryIncomingAchActionButtonListLB';
	var strBtnRTRB = '#userCategoryIncomingAchActionButtonListRT,#userCategoryIncomingAchActionButtonListRB';
	
	if(userMode === 'ADD')
	{
		eltSave = createButton('btnSave', 'P', getLabel('btnSave','Save'));
		eltSave.click(function() {
			saveAdminFeatureProfile('saveUserCategoryIncomingAchFeature.form');
				});
		eltSave.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	if(userMode === 'EDIT')
	{
		eltUpdate = createButton('btnUpdate', 'P',getLabel('btnUpdate','Update'));
		eltUpdate.click(function() {
			saveAdminFeatureProfile('saveUserCategoryIncomingAchFeature.form');
				});
		eltUpdate.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	if(userMode.indexOf('MODIFIEDVIEW') > -1 || userMode.indexOf('VIEW') > -1)
	{
		eltCancel = createButton('btnCancel', 'S',getLabel('btnCancel','Cancel'));
		eltCancel.click(function() {
			saveAdminFeatureProfile('userAdminCategoryList.form');
		});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
				
		eltNext = createButton('btnNext', 'P', getLabel('btnNext','Next'));
		eltNext.click(function() {
			saveAdminFeatureProfile('nextOnViewUserCategoryAdminFeature.form');
		});
		eltNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	else
	{
		eltCancel = createButton('btnCancel', 'S', getLabel('btnCancel','Cancel'));
		eltCancel.click(function() {
			warnBeforeCancel('userAdminCategoryList.form');
		});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");

		eltNext = createButton('btnNext', 'P', getLabel('btnNext','Next'));
		eltNext.click(function() {
			goToFeaturePage('saveUserCategoryIncomingAchFeature.form');
		});
		eltNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
}


function paintUserCategoryDepActions(userMode)
{
	var elt = null, eltCancel = null, eltSave = null, eltUpdate = null,eltNext = null,canShow = true;
	$('#userCategoryDepositActionButtonListLT,#userCategoryDepositActionButtonListLB, #userCategoryDepositActionButtonListRB, #userCategoryDepositActionButtonListRT').empty();
	var strBtnLTLB = '#userCategoryDepositActionButtonListLT,#userCategoryDepositActionButtonListLB';
	var strBtnRTRB = '#userCategoryDepositActionButtonListRT,#userCategoryDepositActionButtonListRB';
	
	if(userMode === 'ADD')
	{
		eltSave = createButton('btnSave', 'P', getLabel('btnSave','Save'));
		eltSave.click(function() {
			saveAdminFeatureProfile('saveUserCategoryDepositsFeature.form');
				});
		eltSave.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	if(userMode === 'EDIT')
	{
		eltUpdate = createButton('btnUpdate', 'P', getLabel('btnUpdate','Update'));
		eltUpdate.click(function() {
			saveAdminFeatureProfile('saveUserCategoryDepositsFeature.form');
				});
		eltUpdate.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	if(userMode.indexOf('MODIFIEDVIEW') > -1 || userMode.indexOf('VIEW') > -1)
	{
		eltCancel = createButton('btnCancel', 'S',getLabel('btnCancel','Cancel'));
		eltCancel.click(function() {
			saveAdminFeatureProfile('userAdminCategoryList.form');
		});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
				
		eltNext = createButton('btnNext', 'P', getLabel('btnNext','Next'));
		eltNext.click(function() {
			saveAdminFeatureProfile('nextOnViewUserCategoryAdminFeature.form');
		});
		eltNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	else
	{
		eltCancel = createButton('btnCancel', 'S',getLabel('btnCancel','Cancel'));
		eltCancel.click(function() {
			warnBeforeCancel('userAdminCategoryList.form');
		});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");

		eltNext = createButton('btnNext', 'P', getLabel('btnNext','Next'));
		eltNext.click(function() {
			goToFeaturePage('saveUserCategoryDepositsFeature.form');
		});
		eltNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
}

function paintUserCategoryMobileActions(userMode)
{
	var elt = null, eltCancel = null, eltSave = null, eltUpdate = null,eltNext = null;
	$('#userCategoryMobileActionButtonListLT,#userCategoryMobileActionButtonListLB, #userCategoryMobileActionButtonListRB, #userCategoryMobileActionButtonListRT').empty();
	var strBtnLTLB = '#userCategoryMobileActionButtonListLT,#userCategoryMobileActionButtonListLB';
	var strBtnRTRB = '#userCategoryMobileActionButtonListRT,#userCategoryMobileActionButtonListRB';
	
	if(userMode === 'ADD')
	{
		eltSave = createButton('btnSave', 'P',getLabel('btnSave','Save'));
		eltSave.click(function() {
					saveAdminFeatureProfile('saveUserCategoryMobileFeature.form');
				});
		eltSave.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	if(userMode === 'EDIT')
	{
		eltUpdate = createButton('btnUpdate', 'P',getLabel('btnUpdate','Update'));
		eltUpdate.click(function() {
					saveAdminFeatureProfile('saveUserCategoryMobileFeature.form');
				});
		eltUpdate.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	
	if(userMode.indexOf('MODIFIEDVIEW') > -1 || userMode.indexOf('VIEW') > -1)
	{
		eltCancel = createButton('btnCancel', 'S', getLabel('btnCancel','Cancel'));
		eltCancel.click(function() {
			saveAdminFeatureProfile('userAdminCategoryList.form');
		});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
				
		eltNext = createButton('btnNext', 'P', getLabel('btnNext','Next'));
		eltNext.click(function() {
			goToPage('nextOnViewUserCategoryAdminFeature.form', 'frmMain');
		});
		eltNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	else
	{
		eltCancel = createButton('btnCancel', 'S', getLabel('btnCancel','Cancel'));
		eltCancel.click(function() {
			warnBeforeCancel('userAdminCategoryList.form');
		});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");

		eltNext = createButton('btnNext', 'P', getLabel('btnNext','Next'));
		eltNext.click(function() {
			goToFeaturePage('saveUserCategoryMobileFeature.form');
		});
		eltNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
}

function createButton(btnKey, charIsPrimary,btnVal) {
	var strCls = charIsPrimary === 'P'
			? 'ft-button-primary'
			: 'ft-button-light';
	var elt = null;
	elt = $('<input>').attr({
				'type' : 'button',
				'class' : 'ft-button ' + strCls,
				'id' : 'button_' + btnKey,
				'value' : btnVal
			});
	return elt;
}
function getUserRoleDetailReport(userCategoryCode,catCorporation){
	var form = document.createElement('FORM');
	var strUrl = "services/userCategoryDetailReport.pdf";
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';
	form.appendChild(createFormField('INPUT', 'HIDDEN',
			csrfTokenName, tokenValue));
	form.appendChild(createFormField('INPUT', 'HIDDEN',
			'userCategoryCode', userCategoryCode));
	form.appendChild(createFormField('INPUT', 'HIDDEN',
			'catCorporation', catCorporation));
	form.action = strUrl;
	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);
}
function createFormField(element, type, name, value) {
	var inputField;
	inputField = document.createElement(element);
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;
	return inputField;
}