function showAddDepositInst(fptrCallback)
{
	var dlg = $('#addDeposit');
	dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:false, width:480,title : 'New instrument',
					buttons: {"Continue": function() {$(this).dialog("close"); fptrCallback.call(null, 'showDepositInstList.form');},
					"Cancel": function() {$(this).dialog('close'); }},
					open: function(){
						$('.ui-dialog-buttonpane').find('.ui-dialog-buttonset').addClass('nofloating centerAlign');
						$('.ui-dialog-buttonpane').find('button:contains("Cancel")').attr("title","Cancel");
			            $('.ui-dialog-buttonpane').find('button:contains("Cancel")').find('.ui-button-text').prepend('<span class="fa fa-minus-circle">&nbsp;&nbsp</span>');
			            
			            $('.ui-dialog-buttonpane').find('button:contains("Continue")').attr("title","Continue");
			            $('.ui-dialog-buttonpane').find('button:contains("Continue")').find('.ui-button-text').prepend('<span class="fa fa-play-circle">&nbsp;&nbsp</span>');
					}
	});
	dlg.dialog('open');
}

function showAdvancedFilter(fptrCallback)
{
	var dlg = $('#advanceFilterInst');
	dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:false, width:650,title : 'Advanced Filter/Sort',
					buttons: {"Continue": function() {$(this).dialog("close"); fptrCallback.call(null, 'showDepositInstList.form');},
								"Reset All": function(){resetAll()},
					"Cancel": function() {$(this).dialog('close'); }},
					open: function(){
						$('.ui-dialog-buttonpane').find('.ui-dialog-buttonset').addClass('nofloating centerAlign');
			            $('.ui-dialog-buttonpane').find('button:contains("Continue")').attr("title","Continue");
			            $('.ui-dialog-buttonpane').find('button:contains("Continue")').find('.ui-button-text').prepend('<span class="fa fa-play-circle">&nbsp;&nbsp</span>');
			            
			            $('.ui-dialog-buttonpane').find('button:contains("Cancel")').attr("title","Cancel");
			            $('.ui-dialog-buttonpane').find('button:contains("Cancel")').find('.ui-button-text').prepend('<span class="fa fa-minus-circle">&nbsp;&nbsp</span>');

			            $('.ui-dialog-buttonpane').find('button:contains("Reset All")').attr("title","Reset All");
			            $('.ui-dialog-buttonpane').find('button:contains("Reset All")').find('.ui-button-text').prepend('<span class="fa fa-repeat">&nbsp;&nbsp</span>');
					}
	});
	dlg.dialog('open');
}

function showDepositInstList(strUrl, me)
{
	$('#advanceFilter').appendTo('#frmMain');
	$('#advanceFilter').hide();
	document.getElementById("reqState").value = "ALL";
	document.getElementById("channelCode").value = "ALL";
	document.getElementById("referenceNo").value ="";
	document.getElementById("myProduct1").value ="";
	document.getElementById("bankProduct").value ="";
	document.getElementById("drawerDescription").value ="";
	document.getElementById("accountNo").value ="";
	document.getElementById("txnCurrency").value ="";
	document.getElementById("amount").value ="";
	document.getElementById("instrumentNumber").value ="";
	document.getElementById("fileName").value ="";
	if($('#collClientId').length)
		document.getElementById("clientId").value =$('#collClientId').val();	
	if($("#clientDesc").length)
	{
		if($('#clientDesc').val()== null || $('#clientDesc').val()=='')
		{
			$('#collClientId').val('');
		}
		else
		{
			if($('#collClientId').val()== null || $('#collClientId').val()=='')
			{
				$('#collClientId').val($('#clientDesc').val());
			}		
		}		
	}
	if (me.value == "7")
		showDateRange(strUrl, submitDateRange) ;
	else
	{
	    var frm = document.forms["frmMain"];
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}
}
function showDateRange(strUrl, ftrcallback) 
{ 
	$('#dateRange').appendTo('#frmMain');
	$('#dateRange').hide();
	var dlg = $('#dateRange');
	var btnsArr={};
	btnsArr[labels.okBtn]=function() {
	if (!(isEmpty(trim($('#toDate1').val())) && isEmpty(trim($('#fromDate1').val()))))
		{
			document.getElementById("fromDate").value = document.getElementById("fromDate1").value;
			document.getElementById("toDate").value = document.getElementById("toDate1").value;	
		}
	else
	{
		document.getElementById("fromDate").value = fromDate1;
		document.getElementById("toDate").value = toDate1;
	}
	$(this).dialog("close"); ftrcallback.call(null, strUrl);};
	dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:false, width:360,title : labels.dateRangeTitle,
					buttons: btnsArr});
	dlg.dialog('open');
}

function submitDateRange(strUrl) 
{
   var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function showInstQueryList(strUrl)
{
	if (!(isEmpty(trim($('#toDate').val())) && isEmpty(trim($('#fromDate').val()))))
		document.getElementById("cboDateFilter").value = 7;
	
	if ((isEmpty(trim($('#toDate').val())) || isEmpty(trim($('#fromDate').val())))
			&& $('#cboDateFilter').val() == '7')
		document.getElementById("cboDateFilter").value = 0;
	
	$('#advanceFilterInst').appendTo('#frmMain');
	$('#advanceFilterInst').hide();
	document.getElementById("txnStatus").value = 99;
    var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function toggleRecordSelection(ctrl, screenType, requestState, module, index)
{
	var blnFirst = true;
	var blnIndexCurrentStatus;

	if (module != _module)
		return false;

	blnIndexCurrentStatus = objJsonIndicesStatus[index];
	
	if (blnIndexCurrentStatus == undefined) blnIndexCurrentStatus = false;

	if (blnIndexCurrentStatus)
	{
		objJsonIndicesStatus[index] = false;
		delete objJsonPossibleActions[index];
		ctrl.className = "linkbox acceptlink";
	}
	else
	{
		objJsonIndicesStatus[index] = true;
		if (screenType == '1')
			objJsonPossibleActions[index] = arrDeposit[requestState];
		else
			objJsonPossibleActions[index] = arrDepositInst[requestState];
		if (!objJsonPossibleActions[index])
			objJsonPossibleActions[index] = "00000000";
		ctrl.className = "linkbox acceptedlink";
	}

	_strValidActionBitset = '00000000';
	for (var key in objJsonPossibleActions)
	{
		if (objJsonPossibleActions.hasOwnProperty(key))
		{
		    if (blnFirst)
		    {
		    	_strValidActionBitset = objJsonPossibleActions[key];
		    	blnFirst = false;
		    }
		    else
		    	_strValidActionBitset = performAnd(_strValidActionBitset, objJsonPossibleActions[key]);
		}
	}

	refreshButtons();
}

function performAnd(strValidActions, strCurrentIndexActions)
{
	var strReturn = "";
	var i = 0;

	if (strValidActions.length == strCurrentIndexActions.length)
	{
		for (i=0; i<8; i++)
		{
			strReturn = strReturn + (strValidActions.charAt(i) & strCurrentIndexActions.charAt(i));
		}
	}
	return strReturn;
}

function refreshButtons()
{
	
	var strActionBitset;
	// DO THE ANDING WITH SERVER BITMAP
	strActionBitset = performAnd(_strValidActionBitset, _strServerBitset);	
	var i = 0;

	if (strActionBitset.length > 0)
	{
		for (i=0; i<8; i++)
		{
			switch (i)
			{
				/*case 0: 
					if (strActionBitset.charAt(i) == 1)
						document.getElementById("btnSubmit").className ="imagelink black inline_block button-icon icon-button-relese font_bold";
					else
						document.getElementById("btnSubmit").className ="imagelink grey inline_block button-icon icon-button-release-grey font-bold";
					break;*/

				case 1: 
					if (strActionBitset.charAt(i) == 1)
						document.getElementById("btnAuth").className ="imagelink black inline_block button-icon icon-button-accept font_bold";
					else
						document.getElementById("btnAuth").className ="imagelink grey inline_block button-icon icon-button-accept-grey font-bold";
					break;					

				case 2: 
					if (strActionBitset.charAt(i) == 1)
						document.getElementById("btnReject").className ="imagelink black inline_block button-icon icon-button-reject font_bold";
					else
						document.getElementById("btnReject").className ="imagelink grey inline_block button-icon icon-button-reject-grey font-bold";
					break;

				case 3: 
					if (strActionBitset.charAt(i) == 1)
						document.getElementById("btnSend").className ="imagelink black inline_block button-icon icon-button-send font_bold";
					else
						document.getElementById("btnSend").className ="imagelink grey inline_block button-icon icon-button-send-grey font-bold";
					break;

				case 4: 
					if (strActionBitset.charAt(i) == 1)
						document.getElementById("btnDiscard").className ="imagelink black inline_block button-icon icon-button-discard font_bold";
					else
						document.getElementById("btnDiscard").className ="imagelink grey inline_block button-icon icon-button-discard-grey font-bold";
					break;

				case 5: 
					if (strActionBitset.charAt(i) == 1)
						document.getElementById("btnHold").className ="imagelink black inline_block button-icon icon-button-hold font_bold";
					else
						document.getElementById("btnHold").className ="imagelink grey inline_block button-icon icon-button-hold-grey font-bold";
					break;

				case 6: 
					if (strActionBitset.charAt(i) == 1)
						document.getElementById("btnRelease").className ="imagelink black inline_block button-icon icon-button-relese font_bold";
					else
						document.getElementById("btnRelease").className ="imagelink grey inline_block button-icon icon-button-release-grey font-bold";
					break;
			}
		}
	}	
}

function acceptRecords(ctrl)
{
	if (ctrl.className.startsWith("imagelink grey"))
		return;
	
	var frm = document.forms["frmMain"];
	if (JSON.stringify(objJsonIndicesStatus).indexOf("true") < 0)
	{
		alert("Select Atlease One Record")
		return;
	}
	document.getElementById("updateIndex").value = JSON.stringify(objJsonIndicesStatus);
	frm.target ="";
	frm.action = "acceptDepositInst.form";
	frm.method = "POST";
	frm.submit();
}

function sendRecords(ctrl)
{
	var frm = document.forms["frmMain"];
	if (ctrl.className.startsWith("imagelink grey"))
		return;
	if (JSON.stringify(objJsonIndicesStatus).indexOf("true") < 0)
	{
		alert("Select Atlease One Record");
		return;
	}
	document.getElementById("updateIndex").value = JSON.stringify(objJsonIndicesStatus);
	//document.getElementById("current_index").value = document.getElementById("updateIndex").value;
	frm.target ="";
	frm.action = "sendDepositInst.form";
	frm.method = "POST";
	frm.submit();
}

function populateData(strUrl)
{
	var frm = document.forms["frmMain"];
	document.getElementById("reqState").value = "";

	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}


function clearForm(formIdent) 
{ 
	var form, elements, i, elm; 
	form = document.getElementById ? document.getElementById(formIdent) : document.forms[formIdent]; 

	if (document.getElementsByTagName)
	{
		elements = form.getElementsByTagName('input');
		for( i=0, elm; elm=elements.item(i++); )
		{
			if (elm.getAttribute('type') == "text")
				elm.value = '';
		}
		elements = form.getElementsByTagName('select');
		for( i=0, elm; elm=elements.item(i++); )
		{
			elm.options.selectedIndex=0;
		}
	}
	
	// Actually looking through more elements here
	// but the result is the same.
	else
	{
		elements = form.elements;
		for( i=0, elm; elm=elements[i++]; )
		{
			if (elm.type == "text")
				elm.value = '';
		}
	}
}
function deleteRecords(ctrl, rejTitle, rejMsg)
{
	if (ctrl.className.startsWith("imagelink grey"))
		return;
	if (JSON.stringify(objJsonIndicesStatus).indexOf("true") < 0)
	{
		alert("Select Atleast One Record");
		return;
	}
	document.getElementById("updateIndex").value = JSON.stringify(objJsonIndicesStatus);
	getRemarks(350, rejTitle, rejMsg, document.getElementById("updateIndex").value, deleteRecord);
}

function deleteRecord(objJsonData, strRemarks)
{
	var frm = document.forms["frmMain"]; 

	if (strRemarks.length > 255 || isEmpty(strRemarks))
	{
		alert("Reject Remarks Length should be between 1 and 255 Characters!");	
		return false;
	}
	else
	{
		frm.rejectRemarks.value = strRemarks;
		//document.getElementById("current_index").value = objJsonData;
		frm.target = "";
		frm.action = "deleteDepositInstCommonList.form";
		frm.method = 'POST';
		frm.submit();
	}
}

function scrapRecord(arrData, strRemarks)
{
	var frm = document.forms["frmMain"]; 
	if (strRemarks.length > 255 || isEmpty(strRemarks))
	{
		alert("Scrap Remarks Length should be between 1 and 255 Characters!");	
		return false;
	}
	else
	{
		frm.rejectRemarks.value = strRemarks;
		//document.getElementById("txtIndex").value = arrData;
		frm.target ="";
		frm.action = "scrapDepositInstOnSend.form";
		frm.method = "POST";
		frm.submit();
	}
}

function rejectRecords(ctrl, rejTitle, rejMsg)
{
	if (ctrl.className.startsWith("imagelink grey"))
		return;
	if (JSON.stringify(objJsonIndicesStatus).indexOf("true") < 0)
	{
		alert("Select Atlease One Record");
		return;
	}
	document.getElementById("updateIndex").value = JSON.stringify(objJsonIndicesStatus);
	getRemarks(350, rejTitle, rejMsg, document.getElementById("updateIndex").value, rejectRecord);
}

function rejectRecord(objJsonData, strRemarks)
{
	var frm = document.forms["frmMain"]; 

	if (strRemarks.length > 255 || isEmpty(strRemarks))
	{
		alert("Reject Remarks Length should be between 1 and 255 Characters!");	
		return false;
	}
	else
	{
		frm.rejectRemarks.value = strRemarks;
		//document.getElementById("current_index").value = objJsonData;
		frm.target = "";
		frm.action = "rejectDepositInst.form";
		frm.method = 'POST';
		frm.submit();
	}
}

function showHistoryForm(strUrl, index)
{	
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 400)/2;
	var strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=550,height=350";

	var frm = document.forms["frmMain"];
	document.getElementById("current_index").value = index;
	frm.action = strUrl;
	frm.target = "hWinHistory";
	frm.method = "POST";

	window.open ("", "hWinHistory", strAttr);
	frm.submit();
}

function viewRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 

	document.getElementById("current_index").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.target = "";
	frm.submit();
}

function editRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 

	document.getElementById("current_index").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.target = "";
	frm.submit();
}

function showAddNewForm(strUrl,val)
{
	var frm = document.forms["frmMain"];
	strUrl = "addDepositHeader.form";
	document.getElementById("myProduct").value = val;	
	$('#advanceFilter').appendTo('#frmMain');
	
	document.getElementById("module").value ="";
	document.getElementById("referenceNo").value ="";
	document.getElementById("txnCurrency").value ="";
	document.getElementById("amount").value ="";	

	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function closeRecords(ctrl)
{
	var frm = document.forms["frmMain"];
	if (ctrl.className.startsWith("imagelink grey"))
		return;
	
	document.getElementById("updateIndex").value = JSON.stringify(objJsonIndicesStatus);
	if (document.getElementById("updateIndex").value.indexOf("true") < 0)
	{
		alert("Select Atlease One Record");
		return;
	}
	frm.target ="";
	frm.action = "closeDepositHeader.form";
	frm.method = "POST";
	frm.submit();
}

function releaseRecords(ctrl)
{
	var frm = document.forms["frmMain"];
	if (ctrl.className.startsWith("imagelink grey"))
		return;
	document.getElementById("updateIndex").value = JSON.stringify(objJsonIndicesStatus);
	if (document.getElementById("updateIndex").value.indexOf("true") < 0)
	{
		alert("Select Atlease One Record");
		return;
	}
	frm.target ="";
	frm.action = "releaseDepositInst.form";
	frm.method = "POST";
	frm.submit();
}

function downloadExcelList(ctrl)
{
	var frm = document.forms["frmMain"];
	if (ctrl.className.startsWith("imagelink grey"))
		return;
	frm.target ="";
	frm.action = "saveDepositInstListAsExcel.form";
	frm.method = "POST";
	frm.submit();
}

function toggleAllRecordsSelection()
{
	var blnFirst = true;
	var current_record_details;
	var status;
	var authLevel;
	var module;
	var ctrl = document.getElementById("imgSelectAll");
	var isSelectAction = ctrl.src.indexOf("icon_uncheckmulti") > -1;

	objJsonIndicesStatus = {};
	objJsonPossibleActions = {};

	if (isSelectAction)
		ctrl.src = "static/images/icons/icon_checkmulti.gif";
	else
		ctrl.src = "static/images/icons/icon_uncheckmulti.gif";

	_strValidActionBitset = "00000000";
	for (var index = startIndex; index <= endIndex; index++)
	{
		current_record_details = all_record_details[index];
		status = current_record_details["status"];
		authLevel = current_record_details["authlevel"];
		module = current_record_details["module"];

		if (module != _module)
			continue;

		if (!isSelectAction)
		{
			document.getElementById("select-record-" + index).className = "linkbox acceptlink";
		}
		else
		{
			document.getElementById("select-record-" + index).className = "linkbox acceptedlink";
			objJsonIndicesStatus[index] = true;

			if (authLevel == 1)
				objJsonPossibleActions[index] = arrDeposit[status];
			else
				objJsonPossibleActions[index] = arrDepositInst[status];

			if (!objJsonPossibleActions[index])
				objJsonPossibleActions[index] = "00000000";

			if (blnFirst)
			{
				blnFirst = false;
				_strValidActionBitset = objJsonPossibleActions[index];
			}
			else
				_strValidActionBitset = performAnd(_strValidActionBitset, objJsonPossibleActions[index]);
		}
	}
	refreshButtons();
}
function getHoldRecord(me, holdTitle, holdMsg)
{
	var temp = document.getElementById("btnHold");
	if (temp.className.startsWith("imagelink grey"))
		return;
	document.getElementById("updateIndex").value = JSON.stringify(objJsonIndicesStatus);
	if (document.getElementById("updateIndex").value.indexOf("true") < 0)
	{
		alert("Select Atlease One Record")
		return;
	}
	getRemarks(230, holdTitle, holdMsg, [document.getElementById("updateIndex").value], holdRecord);
}

function holdRecord(arrData, strRemarks)
{
	var frm = document.forms["frmMain"]; 
	if (strRemarks.length > 255 || isEmpty(strRemarks))
	{
		alert("Holding Remarks Length should be between 1 and 255 Characters!");	
		return false;
	}
	else
	{
		frm.rejectRemarks.value = strRemarks;
		frm.target = "";
		frm.action = "holdDepositInst.form";
		frm.method = 'POST';
		frm.submit();
	}
}
function getReleaseRecord(me, relTitle, relMsg)
{
	var temp = document.getElementById("btnRelease");
	if (temp.className.startsWith("imagelink grey"))
		return;
	document.getElementById("updateIndex").value = JSON.stringify(objJsonIndicesStatus);
	if (document.getElementById("updateIndex").value.indexOf("true") < 0)
	{
		alert("Select Atlease One Record")
		return;
	}
	getRemarks(230, relTitle, relMsg, [document.getElementById("updateIndex").value], releaseRecord);
}

function releaseRecord(arrData, strRemarks)
{
	var frm = document.forms["frmMain"]; 

	if (strRemarks.length > 255 || isEmpty(strRemarks))
	{
		alert("Releasing Remarks Length should be between 1 and 255 Characters!");	
		return false;
	}
	else
	{
		frm.rejectRemarks.value = strRemarks;
		frm.target = "";
		frm.action = "releaseDepositInst.form";
		frm.method = 'POST';
		frm.submit();
	}
}

function processDetail(blnProceed, arrData)
{
	if (!blnProceed) return;
	var frm = document.forms["frmMain"]; 
	frm.target = "";
	document.getElementById("prdCutoffFlag").value = 'Y';
	if (!isEmpty(arrData[0]))
		frm.action = arrData[0];
	frm.method = "POST";
	frm.submit();
}

function resetAll()
{
	document.getElementById("referenceNo").value = "";
	document.getElementById("myProduct1").value = "(ALL)";
	document.getElementById("collectionMethod").value = "";
	document.getElementById("bankProduct").value = "(ALL)";
	document.getElementById("drawerDescription").value = "";
	document.getElementById("txnCurrency").value = "(ALL)";
	document.getElementById("accountNo").value = "(ALL)";
	document.getElementById("amount").value = "";
	document.getElementById("instrumentNumber").value = "";
	document.getElementById("reqState").value = "ALL";
	document.getElementById("channelCode").value = "ALL";
	document.getElementById("fileName").value = "(ALL)";
	document.getElementById("fromDate").value = fromDate1;
	document.getElementById("toDate").value = toDate1;
		
	document.getElementById("sortField1").value = "NONE";
	document.getElementById("orderField1").value = "asc";
	document.getElementById("sortField2").value = "NONE";
	$('#' + "sortField2" ).attr('disabled', true);
	document.getElementById("orderField2").value = "asc";
	$('#' + "orderField2" ).attr('disabled', true);
	document.getElementById("sortField3").value = "NONE";
	$('#' + "sortField3" ).attr('disabled', true);
	document.getElementById("orderField3").value = "asc";
	$('#' + "orderField3" ).attr('disabled', true);
	document.getElementById("sortField4").value = "NONE";
	$('#' + "sortField4" ).attr('disabled', true);
	document.getElementById("orderField4").value = "asc";
	$('#' + "orderField4" ).attr('disabled', true);
}

jQuery.fn.clientCodeSeekAutoComplete= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/userseek/userclients.json",
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term,
										$top:-1
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
							if (!isEmpty(data.DESCR))
							{
								$('#clientDesc').val(data.DESCR);
								$('#collClientId').val(data.CODE);
							}
							showDepositInstList('showDepositInstList.form', this);
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

jQuery.fn.ForceAlphaNumericAndPercentOnly = function() {
	return this
			.each(function(){
				$(this)
						.keypress(function(e) 
						{
							// allows only alphabets & numbers, backspace, tab
							var keycode = e.which || e.keyCode;						
							if ((keycode >= 48 && keycode <= 57) || (keycode >= 65 && keycode <= 90) || (keycode >= 97 && keycode <= 122)
									|| keycode == 8 || keycode == 9 || keycode == 37)
								return true;

							return false;
						})
			})
};