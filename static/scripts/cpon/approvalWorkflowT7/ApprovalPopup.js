var isErr = false;
function openAccountAssignmentPopup(mode) {

	var modeVal = mode;
	$('#approvalAccPopup').dialog({
				autoOpen : false,
				maxHeight : 650,
				width : 500,
				modal : true,
				/*buttons : [{
							id : 'cancel',
							text : 'Cancel',
							click : function() {
								$(this).dialog("close");
								resetAccPopUp();
							}
						}, {
							id : 'save',
							text : 'Save',
							hidden : (modeVal == 'EDIT' || modeVal == 'VIEW'),
							click : function() {
								$(this).trigger('saveAccountAssignment');
								$(this).dialog("close");
							}
						}],*/
				open : function() {
					if (!$('#approverNo').is(':disabled')) {
						$('#approverNo').attr("disabled", "disabled");
					}

					accountSelect
					//Commenting to avoid duplication of accounts in list
					//if (!accountPopupPopulate) {
						populateAccountCombo('accountSelect');
						populateMatrixCombo('MatrixSelect');
						accountPopupPopulate = true;
					//}
					if ('ADD' == modeVal) {
						$("#approvalAccPopup").dialog({
									title : getLabel("addapprovalmatrixtoaccount","Add Approval Matrix To Account"),
								});

					} else if ('EDIT' == modeVal) {
						$("#approvalAccPopup").dialog({
									title : getLabel("editapprovalmatrixtoaccount","Edit Approval Matrix To Account"),
								});

					}

				}

			});
	$("#MatrixSelect").removeClass('requiredField');
	$('#approvalAccPopup').dialog("open");
	setTimeout(function() { autoFocusOnFirstElement(null, 'approvalAccPopup', true); }, 50);
}
function openPackageAssignmentPopup(mode) {
	var modeVal = mode;
	$('#approvalPkgPopup').dialog({
				autoOpen : false,
				maxHeight : 650,
				width : 500,
				modal : true,
				/*buttons : [{
							id : 'cancel',
							text : 'Cancel',
							click : function() {
								$(this).dialog("close");
								resetPkgPopUp();
							}
						}, {
							id : 'save',
							text : 'Save',
							click : function() {
								$(this).trigger('savePackageAssignment');
								$(this).dialog("close");
							}
						}],*/
				open : function() {
					if (!$('#approverNoText').is(':disabled')) {
						$('#approverNoText').attr("disabled", "disabled");
					}
					/*if (!pkgPopupPopulate) {*/
						populatePkgAccountCombo('pkgAccountSelect');
						populatePkgMatrixCombo('pkgMatrixSelect');
						pkgPopupPopulate = true;
					/*}*/
					if ('ADD' == modeVal) {
						$("#approvalPkgPopup").dialog({
								title : getLabel("addapprovalmatrixtopackage","Add Approval Matrix To Package"),
								});

					} else if ('EDIT' == modeVal) {
						$("#approvalPkgPopup").dialog({
									title : getLabel("editapprovalmatrixtopackage","Edit Approval Matrix To Package"),
								});

					}

				}

			});
	$('#approvalPkgPopup').dialog("open");
	setTimeout(function() { autoFocusOnFirstElement(null, 'approvalPkgPopup', true); }, 50);
}
function openPkgAccAssignmentPopup(mode) {

	var modeVal = mode;
	$('#approvalAccPkgPopup').dialog({
				autoOpen : false,
				maxHeight : 650,
				width : 750,
				modal : true,
				/*buttons : [{
							id : 'cancel',
							text : 'Cancel',
							click : function() {
								$(this).dialog("close");
								resetPkgAccPopUp();
							}
						}, {
							id : 'save',
							text : 'Save',
							hidden : (modeVal == 'EDIT' || modeVal == 'VIEW'),
							click : function() {
								$(this).trigger('savePkgAccAssignment');
								$(this).dialog("close");
							}
						}],*/
				open : function() {
					if (!$('#approverNoAccPkg').is(':disabled')) {
						$('#approverNoAccPkg').attr("disabled", "disabled");
					}
					if (!accountPkgPopupPopulate) {
						populatePkgAccPaymentCombo('pakageAccpaySelect');
						populatePkgMatrixCombo('pkgAccMatrixSelect');
						accountPkgPopupPopulate = true;
					}
					if ('ADD' == modeVal) {
						$("#approvalAccPkgPopup").dialog({
									title : getLabel("addapprovalmatrixtopackageaccount","Add Approval Matrix To Package Account"),
								});
					} else if ('EDIT' == modeVal) {
						$("#approvalAccPkgPopup").dialog({
									title : getLabel("editapprovalmatrixtopackageaccount","Edit Approval Matrix To Package Account"),
								});

					}

				}
			});
	$('#approvalAccPkgPopup').dialog("open");
	setTimeout(function() { autoFocusOnFirstElement(null, 'approvalAccPkgPopup', true); }, 50);

}
/* action on Account popup*/
function closeAccPopup(){
$('#approvalAccPopup').dialog("close");
resetAccPopUp();	
}
function saveAccPopup(elementId){
$(elementId).trigger('saveAccountAssignment');
if(!isErr)
	$('#approvalAccPopup').dialog("close");
}
/* action on package popup*/
function cancelPkgPopUp(){
$('#approvalPkgPopup').dialog("close");
resetPkgPopUp();
}
function savePkgPopup(elementId){
$(elementId).trigger('savePackageAssignment');
if(!isErr)
	$('#approvalPkgPopup').dialog("close");
}
/* action on package Account popup*/
function canclePkgAccPopUp(){
$('#approvalAccPkgPopup').dialog("close");
resetPkgAccPopUp();
}
function savePkgAccPopUp(elementId){
$(elementId).trigger('savePkgAccAssignment');
if(!isErr)
	$('#approvalAccPkgPopup').dialog("close");
}


function populatePkgAccPaymentCombo(elementId) {
	$.ajax({
				url : 'services/approvalWorkflow/packageCombinationList.json',
				type : 'POST',
				data:{
					id:matrixId
				},
				async : false,
				success : function(response) {
					var responseData = response;
					var data = responseData.d.accounts;
					loadPaymentPkgData(elementId, data);
				},
				failure : function() {

				}
			});
}
function loadPaymentPkgData(elementId, data) {
	var el = $("#" + elementId);
	el.empty();
	el.append($('<option />', {
		value : "",
		text : "Select"
	}));
	for (index = 0; index < data.length; index++) {
		var opt = $('<option />', {
					value : data[index].packageId,
					text : data[index].packageName
				});
		opt.appendTo(el);
	}
	makeNiceSelect(elementId,true);
}

function populatepkgAccAccountCombo(elementId, url) {
	var strUrl;
	if (!Ext.isEmpty(url)) {
		strUrl = url;
	} else {
		strUrl = 'services/approvalWorkflow/pkgAccountList.json?id='
				+ matrixId+ '&package='
				+ $('#pakageAccpaySelect').val();
	}
	 var objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
	 while (arrMatches = strRegex.exec(strUrl)) {
    	 objParam[arrMatches[1]] = arrMatches[2];
   	 }
   	 var strGeneratedUrl = strUrl.substring(0, strUrl.indexOf('?'));
     strUrl = strGeneratedUrl;
	 $.ajax({
				url : strUrl,
				type : 'POST',
				data:objParam,	
				async : false,
				success : function(response) {
					var responseData = response;
					if (responseData instanceof Array) {
						$('#accountNameSelect').val("");
						makeNiceSelect('accountNameSelect',true);
					} else {
						var data = responseData.d.accounts;
						loadpkgAccountData(elementId, data);
					}
				},
				failure : function() {

				}
			});
}
function loadpkgAccountData(elementId, data) {
	var el = $("#" + elementId);
	el.empty();
	el.append($('<option />', {
		value : "",
		text : getLabel("select","Select")
	}));
	for (index = 0; index < data.length; index++) {
		var opt = $('<option />', {
					value : data[index].accountNmbr,
					text : data[index].displayField
				});
		opt.appendTo(el);
	}
	makeNiceSelect(elementId,true);
}
function populateAccountCombo(elementId) {
	$.ajax({
				url : 'services/approvalWorkflow/accountList.json',
				type : 'POST',
				data:{
					id:matrixId
				},		
				method : 'Post',
				async : false,
				success : function(response) {
					var responseData = response;
					var data=[];
					if(!Ext.isEmpty(responseData) && !Ext.isEmpty(responseData.d) && !Ext.isEmpty(responseData.d.accounts)){
						data = responseData.d.accounts;
					}
					loadAccData(elementId, data);
				},
				failure : function() {
					console.log("Error Occured - Addition Failed");
				}
			});
}
function populateMatrixCombo(elementId) {
	$.ajax({
				url : 'services/approvalWorkflow/matrixList.json',
				type : 'POST',
				data:{
					id:matrixId
				},
				async : false,
				success : function(response) {
					var responseData = response;
					var data = responseData.matrices;
					loadMatrixData(elementId, data);
				},
				failure : function() {
					console.log("Error Occured - Addition Failed");
				}
			});
}
function populatePkgAccountCombo(elementId) {
	$.ajax({
				url : 'services/approvalWorkflow/packageList.json',
				type:'POST',
				data:{
					id:matrixId
				},
				async : false,
				success : function(response) {
					var responseData = response;
					var data = responseData.d.accounts;
					loadpkgData(elementId, data);
				},
				failure : function() {
					console.log("Error Occured - Addition Failed");
				}
			});
}
function populatePkgMatrixCombo(elementId) {
	$.ajax({
				url : 'services/approvalWorkflow/matrixList.json',
				type:'POST',
				data:{
					id:matrixId
				},
				async : false,
				success : function(response) {
					var responseData = response;
					var data = responseData.matrices;
					loadMatrixData(elementId, data);
				},
				failure : function() {
					console.log("Error Occured - Addition Failed");
				}
			});
}
function loadMatrixData(elementId, data) {
	var el = $("#" + elementId);
	el.empty();
	el.append($('<option />', {
		value : "",
		text : getLabel("select","Select")
	}));
	for (index = 0; index < data.length; index++) {
		var opt = $('<option />', {
					value : data[index].axmCode,
					text : data[index].axmName
				});
		opt.appendTo(el);
	}
	makeNiceSelect(elementId,true);
}
function loadAccData(elementId, data) {
	var el = $("#" + elementId);
	el.empty();
	el.append($('<option />', {
		value : "",
		text : getLabel("select","Select")
	}));
	for (index = 0; index < data.length; index++) {
		var opt = $('<option />', {
					value : data[index].accountNmbr,
					text : data[index].displayField
				});
		opt.appendTo(el);
	}
	makeNiceSelect(elementId,true);
}
function loadpkgData(elementId, data) {
	var el = $("#" + elementId);
	el.empty();
	el.append($('<option />', {
		value : "",
		text : getLabel("select","Select")
	}));
	for (index = 0; index < data.length; index++) {
		var opt = $('<option />', {
					value : data[index].packageId,
					text : data[index].packageName
				});

		opt.appendTo(el);
	}
	makeNiceSelect(elementId,true);
}
function resetMenuItems(elementId) {
	$("#" + elementId + "  option").remove();
	$("#" + elementId+"-niceSelect").val('Select');
	makeNiceSelect(elementId,true);
}
function setAccountApprover(elementId) {
	if ('MAKERCHECKER' == $('#MatrixSelect').val()) {
		var countfield = $('#' + elementId);
		countfield.removeAttr('disabled');
		$('#approverNoAccLbl').addClass('required');
	} else {
		var countfield = $('#approverNo');
		countfield.val('');
		countfield.attr('disabled', 'disabled');
		$('#approverNoAccLbl').removeClass('required');
	}
}
function setPkgApprover(elementId) {
	if ('MAKERCHECKER' == $('#pkgMatrixSelect').val()) {
		var countfield = $('#approverNoText');
		countfield.removeAttr('disabled');
		$('#approverNoTextLbl').addClass('required');
	} else {
		var countfield = $('#approverNoText');
		countfield.val('');
		countfield.attr('disabled', 'disabled');
		$('#approverNoTextLbl').removeClass('required');
	}
}
function setAccountPkgApprover(elementId) {
	if ('MAKERCHECKER' == $('#pkgAccMatrixSelect').val()) {
		var countfield = $('#approverNoAccPkg');
		countfield.removeAttr('disabled');
		$('#approverNoAccPkgLbl').addClass('required');
	} else {
		var countfield = $('#approverNoAccPkg');
		countfield.val('');
		countfield.attr('disabled', 'disabled');
		$('#approverNoAccPkgLbl').removeClass('required');
	}
}

function resetAccPopUp() {
	var accountComboRef = $('#accountSelect');
	var matrixComboRef = $('#MatrixSelect');;
	var approvalCountTextRef = $('#approverNo');
	accountComboRef.val("");
	accountComboRef.niceSelect('update');
	matrixComboRef.val("");
	matrixComboRef.niceSelect('update');
	approvalCountTextRef.val("");
	matrixComboRef.niceSelect('update');
	$('#identifier').val("");
	// me.loadClientsMenuToPositivePayPopUp();
	// me.loadAccountMenuToPositivePayPopUp();
}
function resetPkgAccPopUp() {
	var packageComboRef = $('#pakageAccpaySelect');
	var accountComboRef = $('#accountNameSelect');
	var matrixComboRef = $('#pkgAccMatrixSelect');
	var approvalCountTextRef = $('#approverNoAccPkg');
	packageComboRef.val("");
	packageComboRef.niceSelect('update');
	accountComboRef.val("");
	accountComboRef.niceSelect('update');
	matrixComboRef.val("");
	matrixComboRef.niceSelect('update');

	approvalCountTextRef.val("");
	$('#pkgAccidentifier').val("");
}
function resetPkgPopUp() {
	var packageComboRef = $('#pkgAccountSelect');
	var matrixComboRef = $('#pkgMatrixSelect');
	var approvalCountTextRef = $('#approverNoText');
	packageComboRef.val('');
	packageComboRef.niceSelect('update');
	matrixComboRef.val('');
	matrixComboRef.niceSelect('update');
	approvalCountTextRef.val('');
	$('#pkgidentifier').val("");
}
function setNumberOfApprovers(approverNoId, approverNoLblId, matrixSelectId) {
	var countfield = $('#' + approverNoId);
	if ('MAKERCHECKER' == $('#'+matrixSelectId).val()) {
		countfield.removeAttr('disabled');
		$('#'+approverNoLblId).addClass('required');
		countfield.bind('blur', function () { markRequired(this);});
		countfield.bind('focus', function () { removeMarkRequired(this);});
	} else {
		countfield.val('');
		countfield.attr('disabled', 'disabled');
		$('#'+approverNoLblId).removeClass('required');
		countfield.unbind('blur');
		countfield.unbind('focus');
		countfield.removeClass('requiredField');
	}
}