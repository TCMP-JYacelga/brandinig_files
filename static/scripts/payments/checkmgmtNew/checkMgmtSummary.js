var radioClickFlag = false;
var newRecid ;
var showPopup ;
var isCancelStopPayReq = 0;
var objDefaultGridViewPref = [{
			"pgSize" : 10,
			"columns" : [
							{				
								"colId" : "reference",
								"colHeader" : getLabel("reference","Reference")
							},
							{
								"colId" : "description",
								"colHeader" : getLabel("description","Request Type")
							},
							{
								"colId" : "checkNo",
								"colHeader" : getLabel("checkNo1","Check No.")
							},
							{
								"colId" : "amount",
								"colHeader" : getLabel("amount","Amount")
							},
							{
								"colId" : "account",
								"colHeader" : getLabel("account","Account")
							},
							{
								"colId" : "entryDate",
								"colHeader" : getLabel("entryDate"," Request Date")
							},
							{
								"colId" : "reason",
								"colHeader" : getLabel("reason","Reason")
							},
							{
								"colId" : "requestStateDesc",
								"colHeader" : getLabel("requestStateDesc","Status")
							}]
		}];
var CHECKS_GENERIC_COLUMN_MODEL=[{
					"colId" : "account",
					"colHeader" : getLabel('accountNumber', 'Account'),
					"colDesc"	: getLabel('accountNumber', 'Account'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":1,
					 "width" : 130
				}, {
					"colId" : "accountName",
					"colHeader" : getLabel('accountName','Account Name'),
					"colDesc"	: getLabel('accountName','Account Name'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":2,
					 "width" : 130
				}, {
					"colId" : "checkNo",
					"colHeader" : getLabel('instNmbr','Check No.'),
					"colDesc"	: getLabel('instNmbr','Check No.'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":3,
					 "width" : 110
				},{
					"colId" : "description",
					"colHeader" : getLabel('lblDescription','Request Type'),
					"colDesc"	: getLabel('lblDescription','Request Type'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":4,
					 "width" : 100
				},{
					"colId" : "reason",
					"colHeader" : getLabel('lblReason','Reason'),
					"colDesc"	: getLabel('lblReason','Reason'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":5,
					 "width" : 100
				},{
					"colId" : "requestStateDesc",
					"colHeader" : getLabel('lblStatus','Status'),
					"colDesc"	: getLabel('lblStatus','Status'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":6,
					 "width" : 150
				},{
					"colId" : "entryDate",
					"colHeader" : getLabel('lblEntryDate','Request Date'),
					"colDesc"	: getLabel('lblEntryDate','Request Date'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":7,
					 "width" : 100
				},{
					"colId" : "amount",
					"colHeader" : getLabel('lblAmount','Amount'),
					"colDesc"	: getLabel('lblAmount','Amount'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":8,
					 "width" : 100
				},{
					"colId" : "requestNmbr",
					"colHeader" : getLabel('lblTracking#','Tracking No.'),
					"colDesc"	: getLabel('lblTracking#','Tracking No.'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":9,
					 "width" : 150
				},{
					"colId" : "hostMessage",
					"colHeader" : getLabel('hostMessage','Host Message'),
					"colDesc"	: getLabel('hostMessage','Host Message'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":10,
					 "width" : 200
				},{
					"colId" : "reference",
					"colHeader" : getLabel('lblReference','Reference'),
					"colDesc"	: getLabel('lblReference','Reference'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":11,
					 "width" : 120
				},{
					"colId" : "clientDescription",
					"colHeader" : getLabel('clientDescription','Company Name'),
					"colDesc"	: getLabel('clientDescription','Company Name'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":12,
					 "width" : 200
				},{
					"colId" : "checkDate",
					"colHeader" : getLabel('lblIssueDate','Issue Date'),
					"colDesc"	: getLabel('lblIssueDate','Issue Date'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":13,
					 "width" : 100
				}]
var APPROVAL_CONFIRMATION_COLUMN_MODEL = [{
			"colId" : "account",
			"colHeader" : getLabel("account", "Account"),
			"width" : 130
		}, {
			"colId" : "accountName",
			"colHeader" : getLabel("accountName", "Account Name"),
			"width" : 200
		}, {
			"colId" : "checkNo",
			"colHeader" : getLabel("instNmbr", "Check No."),
			"width" : 100
		}, {
			"colId" : "description",
			"colHeader" : getLabel("description", "Request Type"),
			"width" : 120
		}, {
			"colId" : "reason",
			"colHeader" : getLabel("reason", "Reason"),
			"width" : 120
		}, {
			"colId" : "entryDate",
			"colHeader" : getLabel("entryDate", " Request Date"),
			"width" : 120
		}, {
			"colId" : "amount",
			"colHeader" : getLabel("amount", "Amount"),
			"colType" : "amount",
			"width" : 120
		}, {
			"colId" : "reference",
			"colHeader" : getLabel("reference", "Reference"),
			"width" : 120
		}, {
			"colId" : "clientDescription",
			"colHeader" : getLabel('clientDescription', 'Company Name'),
			"width" : 250
		}];
function windowScroll()
{
    var location = '<c:out value="${txtWindowYOffset}" />';
    if(null != location && location != '')
    {
        window.scrollTo(0, location);
    }
}
function showNextTab(strUrl)
{
	/*var frm = document.getElementById('frmMain');
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit(); */
	$("#entryForm").find('input').addClass("disabled");
	$("#entryForm").find('input').attr("disabled",true);
	$("#entryForm").find('select').addClass("disabled");
	$("#entryForm").find('select').attr("disabled",true);

	$("#stopPayEntrySav2").find("#submitBtn").attr("class","block");
	$("#stopPayEntrySav2").find("#nextBtn").attr("class","hidden");
	$("#stopPayEntrySav1").find("#submitBtn").attr("class","block");
	$("#stopPayEntrySav1").find("#nextBtn").attr("class","hidden");
	
	$('#tab_e').find('a').removeClass('active');
	$("#tab_v").find('a').addClass('active');
}
function blockConfirmPopup(tabId,SCREENTYPE)
{
	document.getElementById('tabId').value = tabId;
	document.getElementById('SCREENTYPE').value = SCREENTYPE;
	var recordKeNo = document.getElementById('crumbsRecordKeyNo').value
	goToTab();
}
function goToTab()
{
	blockUI();
	var tabId = document.getElementById('tabId').value;
	document.getElementById('PAGEMODE').value = 'ADD';
	var strUrl = null ;
	var frm = document.getElementById("frmMain");
	frm.target = "";
	frm.method = "POST";
	
	if($('#requestSubType').val() === '1')
	{
		var element1 = document.createElement("INPUT");         
	    element1.name="REQUESTSUBTYPE"
	    element1.value = "NONSYSTEM";
	    element1.type = 'hidden'
	    frm.appendChild(element1);
	    
	}	
	else
	{
		var element1 = document.createElement("INPUT");         
	    element1.name="REQUESTSUBTYPE"
	    element1.value = "SYSTEM";
	    element1.type = 'hidden'
	    frm.appendChild(element1);
	}
	
	// Enter details page
    if(tabId == 'tab_e')
	{
		strUrl = 'showStopPayRequestForm.srvc';
		$('#tab_v').find('a').removeClass('active');
		$('#tab_e').find('a').addClass('active');
		$('input[id="singleChk1"]').removeAttr('disabled');
		$('input[id="singleChk2"]').removeAttr('disabled');
	}
	//verify & submit page
	else if(tabId == 'tab_v')
	{
		strUrl = 'showStopPayRequestForm.srvc';
		$('#tab_e').find('a').removeClass('active');
		$('#tab_v').find('a').addClass('active');
	}
	frm.action = strUrl;
	frm.submit();
}
function getSellerAccounts(sellerCode,accountId)
{
	 var strData = {};
	var opt ;
	var clientId = null;
	var objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g; 
	var strUrl = 'getAccounts.srvc?'+ csrfTokenName + "=" + csrfTokenValue +"&$sellerCode="+ sellerCode.value;
	clientId  = $('#clientId').val();	
	if(clientId != null && clientId != "")
	 strUrl = strUrl +"&$clientCode="+ clientId;
	 
	if(screenType != null)
	{
		if($('#requestSubType').val() === '1')
			strUrl = strUrl +"&$screenType=CancelStopPay";
		else
			strUrl = strUrl +"&$screenType="+ screenType;
	}
	
	while (arrMatches = strRegex.exec(strUrl)) {
					objParam[arrMatches[1]] = arrMatches[2];
				}
		strUrl = strUrl.substring(0, strUrl.indexOf('?'));
	
	if( sellerCode.value != "")
	{
		$.ajax(
			{
			    url: strUrl,
			    type: "POST",
			    context: this,
			    error: function () {},
			    dataType: 'json',
			     data: objParam ,
			    success : function (response) 
			    {
			    	$('#account').empty();
			    	// in case of Radio button click, make accountId null to reset account dropdown and set it to Select value 
			    	if(radioClickFlag)
			    	{
			    		accountId = null;
			    	}
//						if(accountId === null || accountId === "")
//						{
							opt = document.createElement("option");
							document.getElementById("account").options.add(opt);
							opt.text = 'Select';
							opt.value ='';
//						}
		    		for( var i = 0 ; i < response.length ; i++ )
		            {
		             	opt = document.createElement("option");
		                document.getElementById("account").options.add(opt);
		             	opt.text = response[i].DESCRIPTION.replace(/amp;/g, '');
		                opt.value =response[i].CODE;
						if( opt.value == accountId ) {
							opt.selected = true;
							
							// following code to again set currency to hidden parameter.
							var str =  opt.text;
							var account = str.slice( 0, str.indexOf("|") ).trim();
							var accountName = str.slice( str.indexOf("|") + 1, str.lastIndexOf("|") ).trim();
							var ccy = str.substring(str.lastIndexOf("|") + 1).trim();
							$('#account').val(account);
							$('#accountName').val(accountName);
							$('#ccy').val(ccy);
							//$('#account').editablecombobox('refresh');
							//$('#account').niceSelect('update');
						}
		            }
		    		//$('#account').editablecombobox('refresh');
//		    		$('#account').niceSelect('update');
//		    		$('#account-niceSelect')
//		    		.bind('blur', function () { markRequired(this);});
//		    		$('#account-niceSelect')
//		    		.bind('focus', function () { removeMarkRequired(this);});
		    		makeNiceSelect('account');
			    }
			});
	}
	
}
function resetValues()
{
    var checkdate = new Date(year, month - 1, day);	
	var dateTypeVar = $.datepicker.formatDate(singleDateFormat, checkdate);
	
	getSellerAccounts(document.forms['frmMain'].elements['sellerId'],selAccount);
	$("#checkNmbrFrom").val('');
	$("#checkNmbrTo").val('');
	$("#amount").val('');
	$("#payee").val('');   
	if ( $('#singleChkRadio').is(':checked')) {		
		$("#checkDate").val(dateTypeVar);
}
	
	if ( $('#multiChkRadio').is(':checked')) {	
		$("#checkDate").val('');
	}

}
function disableAmount(singleChk,isClickedFlag)
{
	radioClickFlag = isClickedFlag;
	if(singleChk == 'Y')
	{
		$("#amount").show();
		$("#lblAmount").show();
		$("#payee").show();
		$("#lblPayee").show();
		$("#checkDate").show();
		$("#lblCheckDate").show();
		$('#dticon').removeClass('hidden');
		//$('#checkNmbrTo').val('');
		//$("#checkNmbrTo").addClass("disabled");
		//document.getElementById('checkNmbrTo').readOnly = true;
		$("#checkNmbrTo").hide();
		$("#lblCheckTo").hide();
		$("#lblCheckNmbrFrom").text("Check No.");
		
		$("#amount").removeClass("disabled");
		document.getElementById('amount').readOnly = false;
		$("#checkDate").removeClass("disabled");
		$('#checkDate').attr('disabled', false);
		//document.getElementById('checkDate').readOnly = false;
		$("#payee").removeClass("disabled");
		document.getElementById('payee').readOnly = false;
		$('#lblCheckTo').attr('class','frmLabel');
		// following code to reset account if already selected.
		$('#account').val('');
		$('#accountName').val('');
		$('#ccy').val('');
	}
	else
	{
		$("#amount").hide();
		$("#lblAmount").hide();
		$("#payee").hide();
		$("#lblPayee").hide();
		$("#checkDate").hide();
		$("#lblCheckDate").hide();
		$('#dticon').addClass('hidden');
		$("#checkNmbrTo").show();
		$("#lblCheckTo").show();
		$("#checkNmbrTo").removeClass("disabled");
		//$('#checkNmbrTo').val('');
		document.getElementById('checkNmbrTo').readOnly = false;
		$('#lblCheckTo').attr('class','frmLabel required');
		$("#lblCheckNmbrFrom").text("Check No. From");
		// following code to reset account if already selected.
		$('#account').val('');
		$('#accountName').val('');
		$('#ccy').val('');
	}
	$('#account').niceSelect('update');
}
function setCurrency(sel)
{
	var str =  sel.options[sel.selectedIndex].text;
	var account = str.slice( 0, str.indexOf("|") ).trim();
	var accountName = str.slice( str.indexOf("|") + 1, str.lastIndexOf("|") ).trim();
	var ccy = str.substring(str.lastIndexOf("|") + 1).trim();
	$('#account').val(account);
	$('#account').niceSelect('update');
	$('#accountName').val(accountName);
	$('#ccy').val(ccy);
}
$("#entryForm").find('input').attr("disabled","disabled");
$("#entryForm").find('select').attr("disabled","disabled");

jQuery.fn.sellersClientSeekAutoComplete= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						if (userType == "0") {
					        clientSeekUrl = 'adminCheckMgtCorporationSeek';
					    } else {
					        clientSeekUrl = 'clientCheckMgtCorporationSeek';
					    }
						$.ajax({
									url: 'services/userseek/' + clientSeekUrl + '.json',
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term
									},
									success : function(data) {
										var rec = data.d.preferences;
										
										response($.map(rec, function(item) {
													return {	
														
														label : item.DESCR,														
														bankDtl : item
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.bankDtl;
						if (data) {
							if (!isEmpty(data.CODE))
							{
								$('#clientId').val(data.CODE);
								$('#clientDesc').val(data.DESCR);
								getSellerAccounts(document.forms['frmMain'].elements['sellerId'],$('#clientId').val());
							}
						}
						
					},
					open : function() {
						$(this).removeClass("ui-corner-all")
								.addClass("ui-corner-top");
					},
					close : function() {
						$(this).removeClass("ui-corner-top")
								.addClass("ui-corner-all");
					}
				});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:200px;">'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};
function paintCheckActionButtions(mode,screenType)
{
	var elt = null, eltCancel = null, eltSubmit = null, eltNext = null, eltSubmitAndAdd, eltBack;
	$('#checkActionButtonListLT,#checkActionButtonListRT, #checkActionButtonListLB, #checkActionButtonListRB')
			.empty();
	var strBtnLTLB = '#checkActionButtonListLT,#checkActionButtonListLB';
	var strBtnRTRB = '#checkActionButtonListRT,#checkActionButtonListRB';
	
	var canShow = true;
	if (mode === 'ADD' && screenType=='StopPay' && blnVerifyStopPayFlag=='true')
	{
		
		eltNext = createButton('btnNext', 'P', 'Next');
		eltNext.click(function() {
					blockUI();
					document.getElementById('SCREENTYPE').value = screenType;
					var frm = document.getElementById('frmMain');
					var objAmount = document.getElementById("amount");
					var blnAutoNumeric = true;
					// jquery autoNumeric formatting
					blnAutoNumeric = isAutoNumericApplied("amount");
					if (blnAutoNumeric)
						objAmount.value = $("#amount").autoNumeric('get');
					else
						objAmount.value = $("#amount").val();
					// jquery autoNumeric formatting
					frm.action = "validateForm.srvc";
					frm.method = "POST";
					frm.submit();
					document.getElementById('PAGEMODE').value = 'VIEW';
					showNextTab('showStopPayRequestForm.srvc');
				});
		eltNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
		
		eltCancel = createButton('btnCancel', 'S', 'Cancel');
		eltCancel.click(function() {
					goToHome();
				});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
	}
	else
	{
		eltSubmit = createButton('btnSubmit', 'P', 'Submit');
		if(screenType=='StopPay')
		{				
			eltSubmitAndAdd = createButton('btnSubmitAndAdd', 'P', 'Submit and Add');
			eltSubmitAndAdd.click(function() {
				blockUI();
				var frm = document.getElementById('frmMain');
				var objAmount = document.getElementById("amount");
				var blnAutoNumeric = true;
				frm.action = "submitAndAddNewStopRequest.srvc";
				// jquery autoNumeric formatting
				blnAutoNumeric = isAutoNumericApplied("amount");
				if (blnAutoNumeric)
					objAmount.value = $("#amount").autoNumeric('get');
				else
					objAmount.value = $("#amount").val();
				// jquery autoNumeric formatting
				$('input[id="singleChk1"]').attr("disabled",false);
				$('input[id="singleChk2"]').attr("disabled",false);
				frm.method = "POST";
				frm.submit();
			});
			eltSubmitAndAdd.appendTo($(strBtnRTRB));	
			$(strBtnRTRB).append("&nbsp;");
		}	
		eltSubmit.click(function() {
			blockUI();
			var frm = document.getElementById('frmMain');
			var objAmount = document.getElementById("amount");
			var blnAutoNumeric = true;
			if(screenType == "StopPay")
			{
				frm.action = "addStopRequest.srvc";
			}
			else if(screenType == "ChkInq")
			{
				frm.action = "addChkInquiryRequest.srvc";
			}
			// jquery autoNumeric formatting
			blnAutoNumeric = isAutoNumericApplied("amount");
			if (blnAutoNumeric)
				objAmount.value = $("#amount").autoNumeric('get');
			else
				objAmount.value = $("#amount").val();
			// jquery autoNumeric formatting
			$('input[id="singleChk1"]').attr("disabled",false);
			$('input[id="singleChk2"]').attr("disabled",false);
			frm.method = "POST";
			frm.submit();
		});
		eltSubmit.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
		
		if (blnVerifyStopPayFlag == 'true' && screenType=='StopPay') 
			{
			eltBack = createButton('btnBack', 'S', 'Back');
			eltBack.click(function() {
				blockConfirmPopup('tab_e', screenType);
			});
			eltBack.appendTo($(strBtnLTLB));
			$(strBtnLTLB).append("&nbsp;");
		}
	}
	
}
function createButton(btnKey, charIsPrimary,btnVal) {
	var strCls = charIsPrimary === 'P'
			? 'ft-button-primary'
			: 'ft-button-secondary';
	var elt = null;
	elt = $('<input>').attr({
				'type' : 'button',
				'class' : 'ft-button ft-button-lg ' + strCls,
				'id' : 'button_' + btnKey,
				'value' : btnVal
			});
	return elt;
}

//confirmation popup function before cancel
function warnBeforeCancel(strUrl){
	$('#confirmMsgPopup').dialog({
		autoOpen : false,
		height : 200,
		width : 420,
		modal : true,
		buttons :[
			{
				text:getLabel('btnOk','Ok'),
				click : function() {
					goToHome();
				}
			},
			{
				text:getLabel('btncancel','Cancel'),
				click : function() {
					$(this).dialog("close");
				}
			}
		]
	});
	$('#confirmMsgPopup').dialog("open");
}
//--------------------------------------------
function goToHome()
{
	blockUI();
	var frm = document.getElementById('frmMain');
	frm.action = 'checkManagement.srvc';		
	frm.target = "";
	frm.method = "POST";
	frm.submit(); 
}

function isAutoNumericApplied(strId) {
	var isAutoNumericApplied = false;
	$.each(($('#'+strId).data('events')||[]), function(i, event) {
				if (isAutoNumericApplied === true)
					return false;
				$.each(event, function(i, eventHandler) {
							if (eventHandler.namespace === 'autoNumeric')
								isAutoNumericApplied = true;
							return false;
						});
			});
	return isAutoNumericApplied;
}
var advFilterStatusArray = new Array();
/*advFilterStatusArray.push({
			"key" : "",
			"value" : "All"
		});*/
advFilterStatusArray.push({
			"key" : "0",
			"value" : "Pending Approval"
		});
advFilterStatusArray.push({
			"key" : "0.A",
			"value" : "Pending My Approval"
		});

advFilterStatusArray.push({
			"key" : "12",
			"value" : "Deleted"
		});

advFilterStatusArray.push({
			"key" : "16",
			"value" : "Stopped"
});
advFilterStatusArray.push({
			"key" : "3",
			"value" : "Awaiting Response"
		});
advFilterStatusArray.push({
			"key" : "4",
			"value" : "Rejected"
		});
advFilterStatusArray.push({
			"key" : "5",
			"value" : "Cancelled"
		});
advFilterStatusArray.push({
			"key" : "6",
			"value" : "Partial Response"
		});
advFilterStatusArray.push({
			"key" : "7",
			"value" : "Failed"
		});
advFilterStatusArray.push({
			"key" : "8",
			"value" : "Processed"
		});

advFilterStatusArray.push({
			"key" : "10",
			"value" : "Outstanding"
});
/*
advFilterStatusArray.push({
			"key" : "11",
			"value" : "Warehoused"
});
advFilterStatusArray.push({
			"key" : "12",
			"value" : "Unknown"
});
*/
/*advFilterStatusArray.push({
			"key" : "9",
			"value" : "Paid"
});*/
/*
advFilterStatusArray.push({
			"key" : "14",
			"value" : "Processed (Unpaid)"
});
*/
/*advFilterStatusArray.push({
			"key" : "13,14,17",
			"value" : "Processed (See Details)"
});*/
var amtOperatorsArray = new Array();
amtOperatorsArray.push({
			"key" : "eq",
			"value" : "Equal To"
		});
amtOperatorsArray.push({
			"key" : "gt",
			"value" : "Greater Than"
		});
amtOperatorsArray.push({
			"key" : "lt",
			"value" : "Less Than"
		});
/**
 * Approval Confirmation Section Starts Here
 */
var approvalConfGrid = null;
var objArgs = null;
function showApprovalConfirmationPopup(arrSelectedRecords, arrColumnModel,
		storeFields, objDataArgs) {
	var grid;
	$("#approvalConfirmationPopupDiv").dialog({
		bgiframe : true,
		resizable : false,
		draggable : false,
		modal : true,
		width :  "800px",
		title : getLabel('checkManagementApproval', 'Check Management Approval'),
		dialogClass : 'approvalConfirmationPopupSelector highZIndex',
		open : function(event, ui) {
			objArgs = objDataArgs;
			approvalConfGrid = null;
			$('#approvalConfirmationGrid').empty();
			approvalConfGrid = createApprovalConfirmationGrid(
					arrSelectedRecords, arrColumnModel, storeFields);
			
			$("#approvalConfirmationPopupDiv").dialog("option", "position", { my : "center", at : "center", of : window });
		},
		close : function(event, ui) {
		}
	});

}
function closeApprovalConfirmationPopup() {
	approvalConfGrid = null;
	$('#approvalConfirmationPopupDiv').dialog('close');
}

function approveSelectedRecords() {
	$(document).trigger("approvalConfirmed", [objArgs]);
	closeApprovalConfirmationPopup();
}
function createSelectRecordsGridStore(arrSelectedRecords, storeFields) {
	var i = 0;
	var gridJson = {};
	var gridObjectJson = {};
	var arrRecords = [];
	for (i = 0; i < arrSelectedRecords.length; i++) {
		arrRecords.push(arrSelectedRecords[i].data);
	}
	if (arrRecords && arrRecords.length > 0) {
		gridJson['selectedRecords'] = arrRecords;
		gridJson['totalRows'] = arrRecords.length;
		gridJson['SUCCESS'] = true;
	}
	gridObjectJson['d'] = gridJson;

	var myStore = Ext.create('Ext.data.Store', {
				storeId : 'selectedRecordsStore',
				fields : storeFields,
				proxy : {
					type : 'pagingmemory',
					data : gridObjectJson,
					reader : {
						type : 'json',
						root : 'd.selectedRecords',
						totalProperty : 'totalRows',
						successProperty : 'SUCCESS'

					}
				}
			});
	myStore.load();
	return myStore;
}

function getColumns(arrColumnModel) {
	var arrColsPref = arrColumnModel;
	var arrCols = [], objCol = null, cfgCol = null;
	if (!Ext.isEmpty(arrColsPref)) {
		for (var i = 0; i < arrColsPref.length; i++) {
			objCol = arrColsPref[i];
			cfgCol = {};
			cfgCol.dataIndex = objCol.colId;
			cfgCol.text = objCol.colHeader;
			cfgCol.width = objCol.width;
			cfgCol.colType = objCol.colType;
			cfgCol.resizable = true;
			cfgCol.hideable = false;
			cfgCol.draggable = false;
			cfgCol.sortable = false;
			cfgCol.flex = objCol.flex;
			cfgCol.renderer = function(value, metadata,record) {
                    return setTooltip(value, metadata,record);
            }
			if (!Ext.isEmpty(objCol.colType) && cfgCol.colType === "amount") {
				cfgCol.align = 'right';
			}
			cfgCol.renderer = function(val, meta, rec, rowIndex, colIndex, store) {
                meta.tdAttr = 'title="' + val + '"';
                return val;
        }
			arrCols.push(cfgCol);
		}
	}
	return arrCols;
}

function setTooltip(value, metaData, record){
        //metaData.attr='ext:qtip="' + value + '"';
        metaData.tdAttr = 'title="' + value + '"';
        return value;
    }
function createApprovalConfirmationGrid(arrSelectedRecords, arrColumnModel,
		storeFields) {
	var store = createSelectRecordsGridStore(arrSelectedRecords, storeFields);
	var grid = Ext.create('Ext.grid.Panel', {
				store : store,
				width : 1250,
				overflowY : false,
				columns : getColumns(arrColumnModel),
				renderTo : 'approvalConfirmationGrid'
			});

	return grid;
}
/**
 * Approval Confirmation Section Ends Here
 */
function validateForm()
{
	if (pageMode === 'ADD' && screenType=='StopPay' && ( blnVerifyStopPayFlag=='true' || blnVerifyCancelStopPayFlag == 'true' ))
	{
			blockUI();
			document.getElementById('SCREENTYPE').value = screenType;
			var frm = document.getElementById('frmMain');
			var objAmount = document.getElementById("amount");
			var blnAutoNumeric = true;
			// jquery autoNumeric formatting
			blnAutoNumeric = isAutoNumericApplied("amount");
			if (blnAutoNumeric)
				objAmount.value = $("#amount").autoNumeric('get');
			else
				objAmount.value = $("#amount").val();
			// jquery autoNumeric formatting
			frm.action = "validateForm.srvc";
			frm.method = "POST";
			frm.submit();
			document.getElementById('PAGEMODE').value = 'VIEW';
			showNextTab('showStopPayRequestForm.srvc');
	}
}
function submitAndAddForm()
{		
	blockUI();	
	var frm = document.getElementById('frmMain');
	document.getElementById('SCREENTYPE').value = screenType;
	var objAmount = document.getElementById("amount");
	var blnAutoNumeric = true;
	frm.action = "submitAndAddNewStopRequest.srvc";
	// jquery autoNumeric formatting
	blnAutoNumeric = isAutoNumericApplied("amount");
	if (blnAutoNumeric)
		objAmount.value = $("#amount").autoNumeric('get');
	else
		objAmount.value = $("#amount").val();
	// jquery autoNumeric formatting
	$('input[id="singleChk1"]').attr("disabled",false);
	$('input[id="singleChk2"]').attr("disabled",false);
	if(screenType == "StopPay")
	{
		var objJson = {};
		objJson.amount = document.forms[ 'frmMain' ].elements[ 'amount' ].value;
		objJson.requestSubType = document.forms[ 'frmMain' ].elements[ 'requestSubType' ].value;
		objJson.reference = document.forms[ 'frmMain' ].elements[ 'reference' ].value;
		objJson.account = document.forms[ 'frmMain' ].elements[ 'account' ].value;
		objJson.checkNmbrFrom = document.forms[ 'frmMain' ].elements[ 'checkNmbrFrom' ].value;
		objJson.checkNmbrTo = document.forms[ 'frmMain' ].elements[ 'checkNmbrTo' ].value;
		var checkDate = new Date(document.forms[ 'frmMain' ].elements[ 'checkDate' ].value);
		objJson.checkDate = checkDate;
		objJson.ccy = document.forms[ 'frmMain' ].elements[ 'ccy' ].value;
	/*	objJson.entryDate = new Date(document.forms[ 'frmMain' ].elements[ 'entryDate' ].value);
	*/	objJson.payee = document.forms[ 'frmMain' ].elements[ 'payee' ].value;
		objJson.reason = document.forms[ 'frmMain' ].elements[ 'reason' ].value;
		objJson.phoneNmbr =document.forms[ 'frmMain' ].elements[ 'phoneNmbr' ].value;
		objJson.replacementChk =document.forms[ 'frmMain' ].elements[ 'replacementCheck' ].value;
		objJson.contactPerson =document.forms[ 'frmMain' ].elements[ 'contactPerson' ].value;
		objJson.expirationDate =document.forms[ 'frmMain' ].elements[ 'expirationDate' ].value;
		isCancelStopPayReq = objJson.requestSubType;
		var strurl = 'submitAndAddNewStopRequest.srvc?'+ csrfTokenName + "=" + csrfTokenValue;
	
		$.ajax(
				{
				    url: strurl,
				    type: "POST",
				    context: this,
				    contentType: "application/json",
				    error: function () {},
				    dataType: 'json',
				    data: JSON.stringify(objJson) ,
				    success : function (response) 
				    {
				    	if(response.d)
						{
				    		if (response.d.instrumentActions
								&& response.d.instrumentActions[0].success)
				    		{
									isSuccess = response.d.instrumentActions[0].success;
								if (isSuccess && isSuccess === 'N') {
									title = getLabel('instrumentSaveFilterPopupTitle', 'Message');
									var errorMsg = '';
									var errorsList = response.d.instrumentActions[0].errors;
									$.each(errorsList, function(i, eventHandler) {
										errorMsg += eventHandler.errorMessage + '<br>'; 
										
									});
									showStopPayErrorMessage(errorMsg);
		
								} else {
									 newRecid = response.d.instrumentActions[0].updatedStatusCode;
									 showPopup = response.d.instrumentActions[0].showPopup;
									 
									//if (newRecid != null  ) {
									//	callRealTimeresponse('responseData','newRec/accept.srvc', newRecid);
								//	}
								//	$('#payDownPopup').dialog("close");
									 //goToPage('submitAddStopPay.srvc','frmMain');
									 goToPage('showStopPayRequestForm.srvc','frmMain');
								}
								
	
							}
						}
				    }
				});
		}
		else
		{
			frm.method = "POST";
			frm.submit();	
		}
}
	

function submitForm()
{
	blockUI();
	var frm = document.getElementById('frmMain');
	document.getElementById('SCREENTYPE').value = screenType;
	var objAmount = document.getElementById("amount");
	var blnAutoNumeric = true;
	if(screenType == "StopPay")
	{
		frm.action = "addStopRequest.srvc";
	}
	else if(screenType == "ChkInq")
	{
		frm.action = "addChkInquiryRequest.srvc";
	}
	// jquery autoNumeric formatting
	blnAutoNumeric = isAutoNumericApplied("amount");
	if (blnAutoNumeric)
		objAmount.value = $("#amount").autoNumeric('get');
	else
		objAmount.value = $("#amount").val();
	// jquery autoNumeric formatting
	$('input[id="singleChk1"]').attr("disabled",false);
	$('input[id="singleChk2"]').attr("disabled",false);
	if(screenType == "StopPay")
	{
		var objJson = {};
		objJson.amount = document.forms[ 'frmMain' ].elements[ 'amount' ].value;
		objJson.requestSubType = document.forms[ 'frmMain' ].elements[ 'requestSubType' ].value;
		objJson.reference = document.forms[ 'frmMain' ].elements[ 'reference' ].value;
		objJson.account = document.forms[ 'frmMain' ].elements[ 'account' ].value;
		objJson.checkNmbrFrom = document.forms[ 'frmMain' ].elements[ 'checkNmbrFrom' ].value;
		objJson.checkNmbrTo = document.forms[ 'frmMain' ].elements[ 'checkNmbrTo' ].value;
		var checkDate = new Date(document.forms[ 'frmMain' ].elements[ 'checkDate' ].value);
		objJson.checkDate = checkDate;
		objJson.ccy = document.forms[ 'frmMain' ].elements[ 'ccy' ].value;
	/*	objJson.entryDate = new Date(document.forms[ 'frmMain' ].elements[ 'entryDate' ].value);
	*/	objJson.payee = document.forms[ 'frmMain' ].elements[ 'payee' ].value;
		objJson.reason = document.forms[ 'frmMain' ].elements[ 'reason' ].value;
		objJson.phoneNmbr =document.forms[ 'frmMain' ].elements[ 'phoneNmbr' ].value;
		objJson.replacementChk =document.forms[ 'frmMain' ].elements[ 'replacementCheck' ].value;
		objJson.contactPerson =document.forms[ 'frmMain' ].elements[ 'contactPerson' ].value;
		objJson.expirationDate =document.forms[ 'frmMain' ].elements[ 'expirationDate' ].value;
		objJson.singleChk = $("input[name='singleChk']:checked").val();
		objJson.clientId = document.forms[ 'frmMain' ].elements[ 'clientId' ].value;
		var strurl = 'addStopRequest.srvc?'+ csrfTokenName + "=" + csrfTokenValue;
	
		$.ajax(
				{
				    url: strurl,
				    type: "POST",
				    context: this,
				    contentType: "application/json",
				    error: function () {},
				    dataType: 'json',
				    data: JSON.stringify(objJson) ,
				    success : function (response) 
				    {
				    	if(response.d)
						{
				    		if (response.d.instrumentActions
								&& response.d.instrumentActions[0].success)
				    		{
									isSuccess = response.d.instrumentActions[0].success;
								if (isSuccess && isSuccess === 'N') {
									title = getLabel('instrumentSaveFilterPopupTitle', 'Message');
									var errorMsg = '';
									var errorsList = response.d.instrumentActions[0].errors;
									/*Ext.each(errorsList, function(error, index) {
													errorMsg+=error.errorMessage + '<br>';
											});*/
									$.each(errorsList, function(i, eventHandler) {
										errorMsg += eventHandler.errorMessage + '<br>'; 
										
									});
									unblockUI();
									showStopPayErrorMessage(errorMsg);
		
								} else {
									 newRecid = response.d.instrumentActions[0].updatedStatusCode;
									 showPopup = response.d.instrumentActions[0].showPopup;
									 
									 goToPage('submitStopPay.srvc','frmMain');
								}
								
	
							}
						}
				    }
				});
		}
		else
		{
			frm.method = "POST";
			frm.submit();	
		}
			
}
function createFrmField(element, type, name, value) {
	var inputField;
	inputField = document.createElement(element);
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;
	return inputField;
}
function goToPage(strUrl, frmId) {
	var frm = document.getElementById(frmId), strValue = null;
	
	//strValue = charAllowedPayment === 'S' ? 'createPay' : ((strPaymentType === 'QUICKPAY' || strPaymentType === 'QUICKPAYSTI') ? 'single' : 'multi');
	if(strUrl == 'submitStopPay.srvc')
	{
	frm.appendChild(createFrmField('INPUT', 'HIDDEN', 'newRecid',
			newRecid));
	frm.appendChild(createFrmField('INPUT', 'HIDDEN', 'showPopup',showPopup));
	}
	else
		{
		//frm.appendChild(createFrmField('INPUT', 'HIDDEN', 'PAGEMODE', "ADD"));
		document.getElementById('PAGEMODE').value = 'ADD';
		frm.appendChild(createFrmField('INPUT', 'HIDDEN', 'SCREENTYPE', screenType));
		frm.appendChild(createFrmField('INPUT', 'HIDDEN', 'NEXTDAY', "Y"));
		frm.appendChild(createFrmField('INPUT', 'HIDDEN', 'SUBMITADD', "Y"));
		if(isCancelStopPayReq == 1)
		{
			frm.appendChild(createFrmField('INPUT', 'HIDDEN', 'REQUESTSUBTYPE', "NONSYSTEM"));
		}
		else
		{
			frm.appendChild(createFrmField('INPUT', 'HIDDEN', 'REQUESTSUBTYPE', "SYSTEM"));
		}
		}
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function replacement(clientId) {
	$.ajax({
				type : 'POST',
				url : 'services/chkReplacement.json?$clientId='+ clientId,
				success : function(data) {
					
					if(data.d.result == 'Y')
						{
						 $('#replacementDiv').removeClass("hidden");
						}
					else
						{
						$('#replacementDiv').addClass("hidden");
						}
				}
				
			});
}
function showStopPayErrorMessage(errMessage)
{
	$( '#messageArea').empty();
	$('#messageArea').append("<span class='ft-bold-font'>ERROR : </span>");
	$( '#messageArea').append("<ul><li>"+ errMessage +"</ul></li>");
	$( '#messageArea' ).removeClass( 'ui-helper-hidden' );
	if ($('#account').val() == '')
		{
			$('#account').addClass('requiredField');
			$('#account-niceSelect').addClass('requiredField');
		}
	
	if ($('#checkNmbrFrom').val() == '')
	$('#checkNmbrFrom').addClass('requiredField');
	if ($('#reason').val() == '')
		{
			$('#reason-niceSelect').addClass('requiredField');
			$('#reason').addClass('requiredField');
		}
	
	if ($('#checkNmbrTo').val() == '')
	$('#checkNmbrTo').addClass('requiredField');
	if ($('#clientId').val() == '')
	$('#clientId').addClass('requiredField');
}
