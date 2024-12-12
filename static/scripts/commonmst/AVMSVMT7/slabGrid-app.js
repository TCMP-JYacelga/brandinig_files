var objSlabGridView = null;
Ext.Loader.setConfig({
			enabled : true,
			setPath : {
				'Ext' : 'static/js/extjs4.2.1/src',
				'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
			}
		});
Ext.application({
			name : 'GCP',
			appFolder : 'static/scripts/commonmst/AVMSVMT7/app',
			// appFolder : 'app',
			requires : ['GCP.view.SlabGridView', 'GCP.view.SlabGridView','GCP.view.SlabGridSignatoryView'],
		//	controllers : ['GCP.controller.AVMSVMController'],
			launch : function() {
				if (entryType == 'EDIT' || entryType == 'UPDATE'
						|| entryType == 'SUBMIT'
						|| (entryType == 'SAVE_AUTH' && errorVal != 'ERROR')) {
					if (modelAxmType == '1') {
						objSlabGridView = Ext.create(
								'GCP.view.SlabGridSignatoryView', {
									renderTo : 'slabGridDiv'

								});
					} else {
						objSlabGridView = Ext.create('GCP.view.SlabGridView', {
									renderTo : 'slabGridDiv'

								});
					}
				}
			}
		});
function resizeContentPanel() {
	if (!Ext.isEmpty(objSlabGridView)
			&& ((entryType == 'EDIT' || entryType == 'UPDATE' || entryType == 'SAVE_AUTH') && errorVal != 'ERROR')) {

		objSlabGridView.hide();
		objSlabGridView.show();
	}
}

function refreshGrid(enableDisableFlag) {
	GCP.getApplication().fireEvent('detailUpdated');
}

function manageUsers() {

	if (undefined != _gblAxsUsers && _gblAxsUsers != ' ' && _gblAxsUsers != '') {
		document.getElementById('axsUser').options.length = 0;
		var strUser = _gblAxsUsers.split(",");
		for (var i = 0; i < strUser.length; i++) {
			var text = strUser[i];
			if (strUser[i] != null) {
				var value = text.substr(0, text.indexOf('/'));
				var newoption = new Option(text, value, false, false);
				document.getElementById('axsUser').options[i] = newoption;
			}
		}
	} else {
		$("#axsUser").empty();
	}
	// set the selected user list
	var strUrl = "services/authMatrixDetail/getUserList.json";
	$.ajax({
				url : strUrl,
				dataType : "json",
				type : 'POST',
				data : {
					viewState:matrixId,
					axmFrom:getNonFormattedAmount($("#axmFromAuth").val()),
					axmTo:getNonFormattedAmount($("#axmToAuth").val()),
					detailViewState : approverId ? approverId : ''
				},
				success : function(data) {
					$("#addUser").empty();
					var select = document.getElementById("addUser");

					var x;
					// select.length = 1;
					if (null != data && data.length != 0) {
						for (x in data) {
							var option = document.createElement("option");
							option.text = x;
							option.value = data[x];
							select.add(option);
						}
					}
					removeSelectedUsers();
				}
			});

}

function removeSelectedUsers() {
	var selectedCount = $("#axsUser option").length;
	for (var i = 0; i < selectedCount; i++) {
		for (var j = 0; j < $("#addUser option").length; j++) {
			if (document.getElementById('axsUser').options[i].value === document
					.getElementById('addUser').options[j].value) {
				document.getElementById('addUser').remove(j);
				break;
			}
		}
	}
}

function resetSignatoryRule() {
	intParent = 0;
	arrRule = "";
	arrAuthRule = "";
	arrRule = new Array();
	arrAuthRule = new Array();
	intGrpCount = 0;
	document.getElementById("txtRule").value = "";
	document.getElementById("axmRule").value = "";
	gblnInGroup = false;
	gintGrElementCnt = 0;
}

function showApproversPopup(fromLimit, toLimit, totalLevels, axsUsers, minReq,
		level, detailIdentifier, dtlMode, totalCount, clickedRowIndex, oldToAmnt) {
	$("#errDiv").empty();
	$("#tabs").tabs({
				disabled : [0]
			});
	$("#tabs").tabs({
				selected : 1
			});
	var titleLbl = getLabel('ApproverDefinition', 'Approval Matrix - Approver Definition'); 
	$('.lblAxmFrom').each(function(){
		var limitfrom = $(this).text();
		if(limitfrom.indexOf('(')<0)
		{
			$(this).text($(this).text()+ '(' + $('#axmCurrency').val() +')')
		}	
	});
	
	$('.lblAxmTo').each(function(){
		var limitfrom = $(this).text();
		if(limitfrom.indexOf('(')<0)
		{
			$(this).text($(this).text()+ '(' + $('#axmCurrency').val() +')')
		}	
	});
	
	$('#avmDetailPopup').dialog('option', 'title', titleLbl);
	$("#tab-1").hide();
	$("#tab-2").show();
	$("#tab1_footer").hide();
	$("#tab2_footer").show();
	$("#tab-2").click();
	$("#tabs").tabs("disable", 0);
	$("#axmFromDtl").val(fromLimit);
	$("#axmToDtl").val(toLimit);
	$("#totalLevelsDtl").val(totalLevels);
	$("#axsMinreqDtl").val(minReq);
	$("#minReqLabel").text(' ');
	$("#minReqLabel").append(numOfApproversText);
	$("#minReqLabel").append(' ' + level);
	$("#axsSequence").val(level);
	if (!Ext.isEmpty(oldToAmnt))
		$("#oldAxmTo").val(oldToAmnt)
		
	approverId = detailIdentifier;
	detailMode = 'EDIT';
	// Level handling configuration
	_gblLevelCount = totalCount;
	_glbCurrentRowIndex = clickedRowIndex;
	detailApproversMode = dtlMode;
	manageLinks();
	_gblAxsUsers = axsUsers;
	manageUsers();
	autoFocusOnFirstElement(null,'avmDetailPopup',true);
}

function saveAndNextLevel() {
	if (_glbCurrentRowIndex < _gblLevelCount) {
		_glbCurrentRowIndex++;
		submitApprovers(detailViewStateVal);
		var record = getRecordFromApproverSlabByIndex(_glbCurrentRowIndex);
		setApproverDataFromObject(record);
		manageLinks();
	}
}

function saveAndPrevLevel() {
	if (_glbCurrentRowIndex > 0) {
		_glbCurrentRowIndex--;
		submitApprovers(detailViewStateVal);
		var record = getRecordFromApproverSlabByIndex(_glbCurrentRowIndex);
		setApproverDataFromObject(record);
		manageLinks();
	}
}

function getRecordFromApproverSlabByIndex(index) {
	var record = slabListView.getStore().getAt(index - 1);
	return record;
}

function setApproverDataFromObject(record) {
	var data = record.data;
	$("#axsMinreqDtl").val(data.axsMinreq);
	$("#axsSequence").val(data.axsSequence);
	$("#minReqLabel").text(' ');
	$("#minReqLabel").append(numOfApproversText);
	$("#minReqLabel").append(' ' + data.axsSequence);

	approverId = data.viewState;
	_gblAxsUsers = data.axsUser;
	manageUsers();
}

function manageLinks() {
	if (_glbCurrentRowIndex == _gblLevelCount) {
	//	$("#lnkNextLevel").removeClass("navigationLink");
		$("#lnkNextLevel").removeAttr("onclick");
	} else {
	//	$("#lnkNextLevel").addClass("navigationLink");
		$("#lnkNextLevel").attr("onclick", "javascript:saveAndNextLevel();");
	}
	if (_glbCurrentRowIndex == 1) {
	//	$("#lnkPrevLevel").removeClass("navigationLink");
		$("#lnkPrevLevel").removeAttr("onclick");
	} else {
	//	$("#lnkPrevLevel").addClass("navigationLink");
		$("#lnkPrevLevel").attr("onclick", "javascript:saveAndPrevLevel();");
	}
}

function populateCategoryList() {
	var clientIdVal = $('#clientId').val();
	var strUrl = "services/authMatrixDetail/getCategoryListByClient.json?clientid="
			+ clientIdVal;
	$.ajax({
				url : strUrl,
				contentType : "application/json",
				type : 'POST',
				data : {},
				success : function(data) {
					$("#axmCategory").empty();
					var select = document.getElementById("axmCategory");
					var x;
					if (null != data && data.length != 0) {
						for (x in data) {
							var option = document.createElement("option");
							option.text = x;
							option.value = data[x];
							select.add(option);
						}
					}
				}
			});
}

function populateUsersList() {
	var clientIdVal = $('#clientId').val();
	var strUrl = "services/authMatrixDetail/getUserList.json";
	$.ajax({
				url : strUrl,
				type : 'POST',
				data : {
					viewState:matrixId,
					axmFrom:getNonFormattedAmount($("#axmFromAuth").val()),
					axmTo:getNonFormattedAmount($("#axmToAuth").val()),
					detailViewState : approverId ? approverId : ''
				},
				success : function(data) {
					$("#axmUser").empty();
					var select = document.getElementById("axmUser");
					var x;
					if (null != data && data.length != 0) {
						for (x in data) {
							var option = document.createElement("option");
							option.text = x;
							option.value = data[x];
							select.add(option);
						}
					}
				}
			});
}

function showSVMDetailEntryPopup(fromLimit, toLimit, axsUsers, axmRule,
		viewState, dtlMode) {
	var strFrmLimit; 
	var strToLimit;
	$("#errDivAVM").empty();
	if(fromLimit && fromLimit != "")
		strFrmLimit = setDigitAmtGroupFormat(fromLimit);
	else
		strFrmLimit = fromLimit;
	
	if( toLimit && toLimit != "")
		strToLimit = setDigitAmtGroupFormat(toLimit);
	else
		strToLimit = toLimit;	
	
	$("#axmFrom").val(strFrmLimit);
	$("#axmTo").val(strToLimit);	
	arrRule = new Array();
	if (!Ext.isEmpty(axmRule))
		arrRule = axmRule.split(",");
	
	ShowRule(arrRule);
	ShowExistingRule( arrRule );
	$("#txtRule").val();
	$("#axmRule").val(axmRule);
	$("#txtRule,#oldAxmRule").css('width','100%');
	$("#txtRule,#oldAxmRule").css('height','15%');
		
	detailMode = dtlMode;
	if(detailMode == "EDIT")
	{
		$("#oldAxmRuleDiv").removeClass('hidden');
	}
			
	detailViewStateVal = viewState;
	$("#axmToAuth").removeClass('requiredField');
	
	$('#svmDetailPopup').dialog({
				autoOpen : false,
				width : 971,
				modal : true,
				resizable : false,
				draggable : false,
				beforeClose: function( event, ui ) { gblnInGroup = false; }
			});
	//if ('ADD' == detailMode) {
		populateCategoryList();
		populateUsersList();
	//}

	$("#dtlViewState").val(viewState);
	$('#svmDetailPopup').dialog("open");

}
function showAVMDetailEntryPopup(fromLimit, toLimit, totalLevels, axsSequence,
		viewState, dtlMode) {
	$("#errDiv").empty();
	var strFromLimit;
	var strToLimit;
	
	
	$("#axmFromDtl").val(fromLimit);
	$("#oldAxmFrom").val(fromLimit);
	$("#oldAxmTo").val(toLimit);
	if ('ADD' == dtlMode) {
		$("#totalLevelsDtl").val(1);
		$("#totalLevelsAuth").val(1);
	} else {
		$("#totalLevelsDtl").val(totalLevels);
		$("#totalLevelsAuth").val(totalLevels);
	}

	$("#axmToDtl").val(toLimit);
	if(fromLimit && fromLimit != "")
		strFromLimit = setDigitAmtGroupFormat(fromLimit);
	else
		strFromLimit = fromLimit;
	$("#axmFromAuth").val(strFromLimit);
	$('#axmFromAuth').autoNumeric("init",
	{
		aSep: strGroupSeparator,
		dGroup: strAmountDigitGroup,
		aDec: strDecimalSeparator,
		mDec: strAmountMinFraction
	});
	if(toLimit && toLimit != "")
		strToLimit = setDigitAmtGroupFormat(toLimit);
	else
		strToLimit = toLimit;
	
	$("#axmToAuth").val(strToLimit);
	$('#axmToAuth').autoNumeric("init",
	{
		aSep: strGroupSeparator,
		dGroup: strAmountDigitGroup,
		aDec: strDecimalSeparator,
		mDec: strAmountMinFraction
	});
	$("#totalLevelsDtl").val(totalLevels);
	$("#oldTotalLevels").val(totalLevels);
	$("#axsSequence").val(axsSequence);
	// arrRule = axmRule;
	detailMode = dtlMode;
	detailViewStateVal = viewState;
	$("#axmToAuth").removeClass('requiredField');

	var limitfrom = $('#lblAxmFrom').text();
	if(limitfrom.indexOf('(')<0)
	{
		$('#lblAxmFrom').text($('#lblAxmFrom').text()+ '(' + $('#axmCurrency').val() +')')
	}
	var limitto = $('#lblAxmTo').text();
	if(limitto.indexOf('(')<0)
	{
		$('#lblAxmTo').text($('#lblAxmTo').text()+ '(' + $('#axmCurrency').val() +')')
	}
	$('#avmDetailPopup').dialog({
				autoOpen : false,
				//height : 440,
				width : 780,
				modal : true,
				resizable : false,
				draggable : false
			});

	$("#avmDetailPopup").dialog({
				close : function(event, ui) {
					$("#avmDetailPopup").dialog("destroy");
					slabGridListView.refreshData();
				}
			});
	$("#dtlViewState").val(viewState);
	$('#avmDetailPopup').dialog("open");
	$('#avmDetailPopup').dialog('option','position','center');

	$("#tabs").tabs({
				disabled : [1]
			});
	$("#tabs").tabs({
				selected : 0
			});
	$("#tab-1").show();
	$("#tab-1").click();
	$("#tab-2").hide();
	$("#tab1_footer").show();
	$("#tab2_footer").hide();
	$("#tabs").tabs("disable", 1);
	renderGrid();
	$('#avmDetailPopup').dialog('option','position','center');
}

function getNonFormattedAmount(value) {
	var retVal = value.replace(/[^\d\.\-\ ]/g, '');
	return retVal;
}

function showSlabDefinitionTab() {
	$("#tabs").tabs({
				disabled : [1]
			});
	$("#tabs").tabs({
				selected : 0
			});
	var titleLbl = getLabel('TierDefinition', 'Authorization Matrix - Tier Definition'); 
	$('#avmDetailPopup').dialog('option', 'title', titleLbl);
	$("#tab-1").show();
	$("#tab-1").click();
	$("#tab-2").hide();
	$("#tab1_footer").show();
	$("#tab2_footer").hide();
	$("#tabs").tabs("disable", 1);
	renderGrid();
}

function closePopupById(elementId) {
	
	if('svmDetailPopup' == elementId)
	{
		if(gblnInGroup)
		{
			gblnInGroup = false;
		}
	}
	$('#' + elementId).dialog("close");
}

function submitSignatoryMatrix(viewState) {
	
	if (gblnInGroup && gintGrElementCnt<2)
	{
				 Ext.Msg.show({
				           title:getLabel('errorTitle','Error'),
				           msg:  getLabel('signatorymatrixmsg', 'Group must contain two or more elements.!'),
				            buttonText: {
					            ok: getLabel('btnOk', 'OK')
							}  
		
				           
				      });
				 }
	else
	{
		if(gblnInGroup)
			gblnInGroup = false;
		
		var arrayJson = new Array();
		var records = {
			axmFrom : $("#axmFrom").autoNumeric('get'),
			axmTo : $("#axmTo").autoNumeric('get'),
			axmRule : $("#axmRule").val()
		};
		var strUrl = '';
		if ('ADD' == detailMode) {
			strUrl = "services/authMatrixDetail/add.json";
		} else {
			strUrl = "services/authMatrixDetail/update.json";
		}
		var jsonData = {
			identifier : detailViewStateVal,
			userMessage : records
		};
		
		$.blockUI({message:$('#loadingMsg'), timeout:1000, baseZ: 2000});
		
		$.ajax({
			url : strUrl,
			contentType : "application/json",
			type : 'POST',
			data : JSON.stringify(jsonData),
			success : function(data) {
				$("#svmDetailPopup").dialog( "widget" ).unblock();
				var errorMessage = '';
				if ('' != data && undefined != data[0]) {
					if ('N' == data[0].success && '' != data[0].errors
							&& undefined != data[0].errors) {
						var newdiv = document.createElement('div');
						var errorMsg = "<div id='messageArea' class='ft-error-message'><span>"
								+ locMessages.ERROR + "</span><ul>";
						Ext.each(data[0].errors, function(error, index) {
									errorMsg = errorMsg + "<li>"
											+ error.errorMessage + "</li>";
								});
						errorMsg = errorMsg + "</ul></div>";
						newdiv.innerHTML = errorMsg;
						var errDiv = document.getElementById('errDivAVM');
						if (null != errDiv && errDiv.childNodes[0] != null) {
							errDiv.removeChild(errDiv.childNodes[0]);
						}
						errDiv.appendChild(newdiv);
						if ('ADD' == detailMode) 
							detailMode = 'ADD';
						else if ('EDIT' == detailMode) 
							detailMode = 'EDIT';
					} else if ('Y' == data[0].success) {
						detailViewStateVal = data[0].successValue;
						$("#errDivAVM").empty();
						detailMode = 'EDIT';
						$("#oldAxmRuleDiv").removeClass('hidden');
						document.getElementById("oldAxmRule").value = $("#txtRule").val();
					}
				}
				signatoryGridView.refreshData();
			},
			failure : function(data) {
				$("#svmDetailPopup").dialog( "widget" ).unblock();
				var newdiv = document.createElement('div');
				var errorMsg = "<div id='messageArea' class='ft-error-message'><span>"
						+ locMessages.ERROR + "</span><ul>";
				errorMsg = errorMsg + "<li>Internal Error Occured</li>";
				errorMsg = errorMsg + "</ul></div>";
				newdiv.innerHTML = errorMsg;
				var errDiv = document.getElementById('errDivAVM');
				if (null != errDiv && errDiv.childNodes[0] != null) {
					errDiv.removeChild(errDiv.childNodes[0]);
				}
				errDiv.appendChild(newdiv);
			}
		});
	}
	
}

function submitAuthorizationMatrixSlab(viewState) {

	var arrayJson = new Array();

	var records = {
		axmFrom : getNonFormattedAmount($("#axmFromAuth").val()),
		axmTo : getNonFormattedAmount($("#axmToAuth").val()),
		totalLevels : $("#totalLevelsAuth").val(),
		oldAxmFrom : getNonFormattedAmount($("#oldAxmFrom").val()),
		oldAxmTo : getNonFormattedAmount($("#oldAxmTo").val()),
		oldTotalLevels : getNonFormattedAmount($("#oldTotalLevels").val()),
		oldAxmLevel : $("#oldTotalLevels").val()
	};

	var strUrl = '';
	if ('ADD' == detailMode) {
		strUrl = "services/authMatrixDetail/add.json";
	} else {
		strUrl = "services/authMatrixDetail/updateSVMSlab.json";
	}
	var jsonData = {
		identifier : detailViewStateVal,
		userMessage : records
	};
	$.blockUI({message:$('#loadingMsg'), timeout:1000, baseZ: 2000});

	$.ajax({
		url : strUrl,
		contentType : "application/json",
		type : 'POST',
		data : JSON.stringify(jsonData),
		success : function(data) {
			$("#avmDetailPopup").dialog( "widget" ).unblock();
			var errorMessage = '';
			if ('' != data && undefined != data[0].errors
					&& '' != data[0].errors) {
				var newdiv = document.createElement('div');
				var errorMsg = "<div id='messageArea' class='ft-error-message'><span>"
						+ locMessages.ERROR + "</span><ul>";
				Ext.each(data[0].errors, function(error, index) {
					errorMsg = errorMsg + "<li>" + error.errorMessage + "</li>";
				});
				errorMsg = errorMsg + "</ul></div>";
				newdiv.innerHTML = errorMsg;
				var errDiv = document.getElementById('errDiv');
				
				if (null != errDiv && errDiv.childNodes[0] != null) {
					errDiv.removeChild(errDiv.childNodes[0]);
				}
				errDiv.appendChild(newdiv);
				Ext.each(data[0].errors, function(error, index) {
					if(!(error.code === 'EXS-013' || error.code === 'EXS-031'))
						$("#slabLevelGridDiv").empty();
				});
				
			} else {
				$("#oldAxmFrom").val($("#axmFromAuth").val());
				$("#oldAxmTo").val($("#axmToAuth").val());
				$("#errDiv").empty();
				if (null != slabGridListView) {
					slabGridListView.refreshData();
				}
				renderGrid();
				detailMode = 'EDIT';
				$("#oldTotalLevels").val($("#totalLevelsAuth").val());
			}

		},
		failure : function(data) {
			$("#avmDetailPopup").dialog( "widget" ).unblock();
			var newdiv = document.createElement('div');
			var errorMsg = "<div id='messageArea' class='ft-error-message'><span>"
					+ locMessages.ERROR + "</span><ul>";
			errorMsg = errorMsg + "<li>Internal Error Occured</li>";
			errorMsg = errorMsg + "</ul></div>";
			newdiv.innerHTML = errorMsg;
			var errDiv = document.getElementById('errDiv');
			if (null != errDiv && errDiv.childNodes[0] != null) {
				errDiv.removeChild(errDiv.childNodes[0]);
			}
			errDiv.appendChild(newdiv);
		}
	});
}

function showForm(strUrl) {
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function saveAndReturnToTier(detailIdentifier) {
	submitApprovers(detailIdentifier);
	var errorMsg = $("#errDiv").text();
	if (errorMsg == null || errorMsg == '' ){
		showSlabDefinitionTab();
	}
}


function submitApprovers(detailIdentifier) {
	var frm = document.forms["frmApprover"];
	var selectedCount = document.getElementById('axsUser').length;
	var availableCount = document.getElementById('addUser').length;
	var appendList = "";
	slabListView.refreshData();
	for (var i = 0; i < selectedCount; i++) {
		appendList = appendList
				+ document.getElementById('axsUser').options[i].textContent;
		if (i < selectedCount - 1)
			appendList = appendList + ","
	}

	document.getElementById('axsUser').value = appendList;

	var arrayJson = new Array();
	var records = {
		axmFrom : getNonFormattedAmount($("#axmFromDtl").val()),
		axmTo : getNonFormattedAmount($("#axmToDtl").val()),
		totalLevels : $("#totalLevelsAuth").val(),
		axsEnabled : 'Y',
		axsUser : appendList,
		axsMinreqDtl : $("#axsMinreqDtl").val(),
		axsSequence : $("#axsSequence").val(),
		oldAxmFrom : getNonFormattedAmount($("#oldAxmFrom").val()),
		oldAxmTo : getNonFormattedAmount($("#oldAxmTo").val())
	};
	var strUrl = '';
	if ('ADD' == detailApproversMode) {
		strUrl = "services/authMatrixDetail/add.json";
	} else {
		strUrl = "services/authMatrixDetail/update.json";
	}
	var jsonData = {
		identifier : approverId,
		userMessage : records
	};
	
	$.blockUI({message:$('#loadingMsg'), timeout:1000, baseZ: 2000});

	$.ajax({
		url : strUrl,
		contentType : "application/json",
		type : 'POST',
		data : JSON.stringify(jsonData),
		success : function(data) {
			$("#avmDetailPopup").dialog( "widget" ).unblock();
			var errorMessage = '';
			if ('' != data && undefined != data[0].errors
					&& '' != data[0].errors) {
				var newdiv = document.createElement('div');
				var errorMsg = "<div id='messageArea' class='ft-error-message'><span>"
						+ locMessages.ERROR + "</span><ul>";
				Ext.each(data[0].errors, function(error, index) {
					errorMsg = errorMsg + "<li>" + error.errorMessage + "</li>";
				});
				errorMsg = errorMsg + "</ul></div>";
				newdiv.innerHTML = errorMsg;
				var errDiv = document.getElementById('errDiv');
				if (null != errDiv && errDiv.childNodes[0] != null) {
					errDiv.removeChild(errDiv.childNodes[0]);
				}
				errDiv.appendChild(newdiv);
			} else {
				if (undefined != slabListView)
					slabListView.refreshData();
				if (undefined != slabGridListView)
					slabGridListView.refreshData();
				$("#errDiv").empty();
				detailApproversMode = 'EDIT';
			}
		},
		failure : function(data) {
			$("#avmDetailPopup").dialog( "widget" ).unblock();
			var newdiv = document.createElement('div');
			var errorMsg = "<div id='messageArea' class='ft-error-message'><span>"
					+ locMessages.ERROR + "</span><ul>";
			errorMsg = errorMsg + "<li>Internal Error Occured</li>";
			errorMsg = errorMsg + "</ul></div>";
			newdiv.innerHTML = errorMsg;
			var errDiv = document.getElementById('errDiv');
			if (null != errDiv && errDiv.childNodes[0] != null) {
				errDiv.removeChild(errDiv.childNodes[0]);
			}
			errDiv.appendChild(newdiv);
		}
	});
}

function setDirtyBit() {
	dityBitSet = true;
}

function saveAndCloseAVMSlabPopup() {
	
		var arrayJson = new Array();

		var records = {
			axmFrom : getNonFormattedAmount($("#axmFromAuth").val()),
			axmTo : getNonFormattedAmount($("#axmToAuth").val()),
			totalLevels : $("#totalLevelsAuth").val(),
			oldAxmFrom : getNonFormattedAmount($("#oldAxmFrom").val()),
			oldAxmTo : getNonFormattedAmount($("#oldAxmTo").val()),
			oldTotalLevels : getNonFormattedAmount($("#oldTotalLevels").val())
		};
		var strUrl = '';
		if ('ADD' == detailMode) {
			strUrl = "services/authMatrixDetail/add.json";
		} else {
			strUrl = "services/authMatrixDetail/updateSVMSlab.json";
		}
		var jsonData = {
			identifier : detailViewStateVal,
			userMessage : records
		};
		
		$.blockUI({message:$('#loadingMsg'), timeout:1000, baseZ: 2000});
		$.ajax({
			url : strUrl,
			contentType : "application/json",
			type : 'POST',
			data : JSON.stringify(jsonData),
			success : function(data) {
				$("#avmDetailPopup").dialog( "widget" ).unblock();
				var errorMessage = '';
				if ('' != data && undefined != data[0].errors
						&& '' != data[0].errors) {
					var newdiv = document.createElement('div');
					var errorMsg = "<div id='messageArea' class='ft-error-message'><span>"
							+ locMessages.ERROR + "</span><ul>";
					Ext.each(data[0].errors, function(error, index) {
						errorMsg = errorMsg + "<li>" + error.errorMessage + "</li>";
					});
					errorMsg = errorMsg + "</ul></div>";
					newdiv.innerHTML = errorMsg;
					var errDiv = document.getElementById('errDiv');
					if (null != errDiv && errDiv.childNodes[0] != null) {
						errDiv.removeChild(errDiv.childNodes[0]);
					}
					errDiv.appendChild(newdiv);					
					Ext.each(data[0].errors, function(error, index) {
						if(!(error.code != 'EXS-013' || error.code != 'EXS-031'))
							$("#slabLevelGridDiv").empty();
					});
					
				} else {
					$("#errDiv").empty();
					if (null != slabGridListView) {
						slabGridListView.refreshData();
					}
					// renderGrid();
					closePopupById('avmDetailPopup');
				}

			},
			failure : function(data) {
				$("#avmDetailPopup").dialog( "widget" ).unblock();
				var newdiv = document.createElement('div');
				var errorMsg = "<div id='messageArea' class='ft-error-message'><span>"
						+ locMessages.ERROR + "</span><ul>";
				errorMsg = errorMsg + "<li>Internal Error Occured</li>";
				errorMsg = errorMsg + "</ul></div>";
				newdiv.innerHTML = errorMsg;
				var errDiv = document.getElementById('errDiv');
				if (null != errDiv && errDiv.childNodes[0] != null) {
					errDiv.removeChild(errDiv.childNodes[0]);
				}
				errDiv.appendChild(newdiv);
			}
		});

}

function saveAndCloseSVMPopup(viewState) {
	
	if (gblnInGroup && gintGrElementCnt<2)
	{
				 Ext.Msg.show({
				           title:getLabel('errorTitle','Error'),
				           msg:  getLabel('signatorymatrixmsg', 'Group must contain two or more elements.!'),
				            buttonText: {
					            ok: getLabel('btnOk', 'OK')
								}  
		
				           
				      });
				 }
	else
	{
		if(gblnInGroup)
			gblnInGroup = false;
		var arrayJson = new Array();
		var records = {
			axmFrom : $("#axmFrom").autoNumeric('get'),
			axmTo : $("#axmTo").autoNumeric('get'),
			axmRule : $("#axmRule").val()
		};
		var strUrl = '';
		if ('ADD' == detailMode) {
			strUrl = "services/authMatrixDetail/add.json";
		} else {
			strUrl = "services/authMatrixDetail/update.json";
		}
		var jsonData = {
			identifier : detailViewStateVal,
			userMessage : records
		};
		
		$.blockUI({message:$('#loadingMsg'), timeout:1000, baseZ: 2000});
		
		$.ajax({
			url : strUrl,
			contentType : "application/json",
			type : 'POST',
			data : JSON.stringify(jsonData),
			success : function(data) {
				$("#svmDetailPopup").dialog( "widget" ).unblock();
				var errorMessage = '';
				if ('' != data && undefined != data[0].errors
						&& '' != data[0].errors) {
					var newdiv = document.createElement('div');
					var errorMsg = "<div id='messageArea' class='ft-error-message'><span>"
							+ locMessages.ERROR + "</span><ul>";
					Ext.each(data[0].errors, function(error, index) {
						errorMsg = errorMsg + "<li>" + error.errorMessage + "</li>";
					});
					errorMsg = errorMsg + "</ul></div>";
					newdiv.innerHTML = errorMsg;
					var errDiv = document.getElementById('errDivAVM');
					if (null != errDiv && errDiv.childNodes[0] != null) {
						errDiv.removeChild(errDiv.childNodes[0]);
					}
					errDiv.appendChild(newdiv);
				} else {
					$("#errDivAVM").empty();
					closePopupById('svmDetailPopup');
				}
				signatoryGridView.refreshData();
				

			},
			failure : function(data) {
				$("#svmDetailPopup").dialog( "widget" ).unblock();
				var newdiv = document.createElement('div');
				var errorMsg = "<div id='messageArea' class='ft-error-message'><span>"
						+ locMessages.ERROR + "</span><ul>";
				errorMsg = errorMsg + "<li>Internal Error Occured</li>";
				errorMsg = errorMsg + "</ul></div>";
				newdiv.innerHTML = errorMsg;
				var errDiv = document.getElementById('errDiv');
				if (null != errDiv && errDiv.childNodes[0] != null) {
					errDiv.removeChild(errDiv.childNodes[0]);
				}
				errDiv.appendChild(newdiv);
			}
		});	
	}
}