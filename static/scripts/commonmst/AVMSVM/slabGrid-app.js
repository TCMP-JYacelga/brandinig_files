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
			appFolder : 'static/scripts/commonmst/AVMSVM/app',
			// appFolder : 'app',
			requires : ['GCP.view.SlabGridView', 'GCP.view.SlabGridView'],
			controllers : ['GCP.controller.AVMSVMController'],
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

function getLabel(key, defaultText) {
	return (avmSvmLabelsMap && !Ext.isEmpty(avmSvmLabelsMap[key]))
			? avmSvmLabelsMap[key]
			: defaultText
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
	var strUrl = "services/authMatrixDetail/getUserList.json?viewState="
			+ matrixId + "&axmFrom="
			+ getNonFormattedAmount($("#axmFromAuth").val()) + "&axmTo="
			+ getNonFormattedAmount($("#axmToAuth").val());
	$.ajax({
				url : strUrl,
				contentType : "application/json",
				type : 'POST',
				data : {},
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
		level, detailIdentifier, dtlMode, totalCount, clickedRowIndex) {
	$("#tabs").tabs({
				disabled : [0]
			});
	$("#tabs").tabs({
				selected : 1
			});
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
	approverId = detailIdentifier;
	detailMode = 'EDIT';
	// Level handling configuration
	_gblLevelCount = totalCount;
	_glbCurrentRowIndex = clickedRowIndex;
	detailApproversMode = dtlMode;
	manageLinks();
	_gblAxsUsers = axsUsers;
	manageUsers();

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
		$("#lnkNextLevel").removeClass("navigationLink");
		$("#lnkNextLevel").removeAttr("onclick");
	} else {
		$("#lnkNextLevel").addClass("navigationLink");
		$("#lnkNextLevel").attr("onclick", "javascript:saveAndNextLevel();");
	}
	if (_glbCurrentRowIndex == 1) {
		$("#lnkPrevLevel").removeClass("navigationLink");
		$("#lnkPrevLevel").removeAttr("onclick");
	} else {
		$("#lnkPrevLevel").addClass("navigationLink");
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
	var strUrl = "services/authMatrixDetail/getUserList.json?viewState="
			+ matrixId + "&axmFrom="
			+ getNonFormattedAmount($("#axmFromAuth").val()) + "&axmTo="
			+ getNonFormattedAmount($("#axmToAuth").val());
	$.ajax({
				url : strUrl,
				contentType : "application/json",
				type : 'POST',
				data : {},
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
	$("#errDivAVM").empty();
	$("#axmFrom").val(fromLimit);
	$("#axmTo").val(toLimit);
	$("#axmFrom").val(fromLimit);
	$("#axmTo").val(toLimit);
	arrRule = new Array();
	arrRule = axmRule.split(",");
	ShowRule(arrRule)
	$("#txtRule").val();
	$("#axmRule").val(axmRule);

	detailMode = dtlMode;
	detailViewStateVal = viewState;
	$('#svmDetailPopup').dialog({
				autoOpen : false,
				width : 971,
				modal : true,
				resizable : false,
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
	$("#axmFromAuth").val(fromLimit);
	$("#axmToAuth").val(toLimit);
	$("#totalLevelsDtl").val(totalLevels);
	$("#oldTotalLevels").val(totalLevels);
	$("#axsSequence").val(axsSequence);
	// arrRule = axmRule;
	detailMode = dtlMode;
	detailViewStateVal = viewState;
	$('#avmDetailPopup').dialog({
				autoOpen : false,
				//height : 440,
				width : 748,
				modal : true,
				resizable : false
			});

	$("#avmDetailPopup").dialog({
				close : function(event, ui) {
					$("#avmDetailPopup").dialog("destroy");
					slabGridListView.refreshData();
				}
			});
	$("#dtlViewState").val(viewState);
	$('#avmDetailPopup').dialog("open");

	$("#tabs").tabs({
				disabled : [1]
			});
	$("#tabs").tabs({
				selected : 0
			});
	$("#tab-1").click();
	$("#tabs").tabs("disable", 1);
	renderGrid();
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
	$("#tab-1").click();
	$("#tabs").tabs("disable", 1);
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
		Ext.Msg.alert("Error", "Group must contain two or more elements.!");
	else
	{
		if(gblnInGroup)
			gblnInGroup = false;
		
		var arrayJson = new Array();
		var records = {
			axmFrom : $("#axmFrom").val(),
			axmTo : $("#axmTo").val(),
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
		
		$("#svmDetailPopup").dialog( "widget" ).block();
		
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
						var errorMsg = "<div id='messageArea' class='errors'><span>"
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
					}
				}
				signatoryGridView.refreshData();
			},
			failure : function(data) {
				$("#svmDetailPopup").dialog( "widget" ).unblock();
				var newdiv = document.createElement('div');
				var errorMsg = "<div id='messageArea' class='errors'><span>"
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
	
	$("#avmDetailPopup").dialog( "widget" ).block();
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
				var errorMsg = "<div id='messageArea' class='errors'><span>"
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
				$("#slabLevelGridDiv").empty();
			} else {
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
			var errorMsg = "<div id='messageArea' class='errors'><span>"
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
	
	$("#avmDetailPopup").dialog( "widget" ).block();
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
				var errorMsg = "<div id='messageArea' class='errors'><span>"
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
			var errorMsg = "<div id='messageArea' class='errors'><span>"
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
		
		$("#avmDetailPopup").dialog( "widget" ).block();
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
					var errorMsg = "<div id='messageArea' class='errors'><span>"
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
					$("#slabLevelGridDiv").empty();
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
				var errorMsg = "<div id='messageArea' class='errors'><span>"
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
		Ext.Msg.alert("Error", "Group must contain two or more elements.!");
	else
	{
		if(gblnInGroup)
			gblnInGroup = false;
		var arrayJson = new Array();
		var records = {
			axmFrom : $("#axmFrom").val(),
			axmTo : $("#axmTo").val(),
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
		
		$("#svmDetailPopup").dialog( "widget" ).block();
		
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
					var errorMsg = "<div id='messageArea' class='errors'><span>"
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
				var errorMsg = "<div id='messageArea' class='errors'><span>"
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