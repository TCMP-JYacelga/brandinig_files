/*START*/
function switchMode() {
	var frm = document.forms["frmSwitchUser"];
	var valid = false;
	if ($('#emulation').val() == 'Y') {
		frm.action = 'switchUser.form';
		if ($('#clientID').val() != '' && $('#userID').val() != '') {
			valid = true;
		}
	} else if ($('#admin').val() == 'Y') {
		valid = true;
		preSwitchMode();
		frm.action = 'switchOldUser.form';
	} else if ($('#onbehalf').val() == 'Y') {
		valid = true;
		preSwitchMode();
		frm.action = 'switchClientOnBehalf.form';
	}
	if (valid === true) {
		frm.target = "";
		frm.method = "POST";
		frm.appendChild(createFormField('INPUT', 'HIDDEN',csrfTokenName, csrfTokenValue));
		frm.submit();
	}
}

function setAdminSeller(_strSellerId) {
	if(_strSellerId != null) {
		$.ajax({
			type : "POST",
			url : 'switchAdminSeller.srvc?'+'_sellerId=' +_strSellerId,
			async : false,
			success : function(data) { 
				//var ref = data;
				if(data != null && data.d != null && data.d.REFERER_URL != null)
				{
					var frm = document.createElement('FORM');
					frm.action = data.d.REFERER_URL;
					frm.target = "";
					frm.method = "POST";
					frm.appendChild(createFormField('INPUT', 'HIDDEN',csrfTokenName, csrfTokenValue));
					document.body.appendChild(frm);
					frm.submit();
				}								
			}
		});		
	}
}

function onClickOnBehalf() {
	$('#searchButton').hide();
	$('#onbehalf').attr('checked', true);
	$('#onbehalf').val('Y');
	$('#admin').attr('checked', false);
	$('#admin').val('N');
	$('#emulation').attr('checked', false);
	$('#emulation').val('N');
	$('#emulate').hide();
	$('#changeSubsidary').show();
	//$("#modeDialog").dialog("option", "width", 300);
	//$("#modeDialog").dialog("option", "maxWidth", 300);
}

function onClickEmulation() {
	$('#searchButton').show();
	$('#btnSubmit').attr('disabled', true);
	$('#emulate').show();
	$('#emulation').attr('checked', true);
	$('#emulation').val('Y');
	$('#admin').attr('checked', false);
	$('#admin').val('N');
	$('#onbehalf').attr('checked', false);
	$('#onbehalf').val('N');
	$('#changeSubsidary').hide();
	//$("#modeDialog").dialog("option", "width", 300);
	//$("#modeDialog").dialog("option", "maxWidth", 300);
}

function onClickAdmin() {
	$('#searchButton').show();
	$('#admin').attr('checked', true);
	$('#admin').val('Y');
	$('#emulate').hide();
	$('#emulation').attr('checked', false);
	$('#emulation').val('N');
	$('#onbehalf').attr('checked', false);
	$('#onbehalf').val('N');
	$('#changeSubsidary').hide();
	$("#btnSubmit").attr('disabled', false);
	//$("#modeDialog").dialog("option", "maxWidth", 300);
	//$("#modeDialog").dialog("option", "width", 300);
}

jQuery.fn.ClientAutoComplete = function() {
	return this.each(function() {
		$(this).autocomplete({
			source : function(request, response) {
				$.ajax({
					url : "services/userseek/USER_EMULATION_CLIENT.json?$top=-1",
					dataType : "json",
					data : {
						$autofilter : request.term,
						$filtercode1 : $('#recordKey').val()
					},
					success : function(data) {
						var rec = data.d.preferences;
						$("#modeDialog").dialog("option", "width", 300);
						$("#modeDialog").dialog("option", "maxWidth", 300);
						response($.map(rec, function(item) {
									return {
										label : item.CLIENT_DESCRIPTION,
										// value : item.CLIENT_CODE,
										code : item.RECORD_KEY_NMBR
									}
								}));
					}
				});
			},
			minLength : 1,
			select : function(event, ui) {
				$("#modeDialog").dialog("option", "width", 300);
				$("#modeDialog").dialog("option", "maxWidth", 300);
				log(ui.item ? "Selected: " + ui.item.label + " -show lbl:"
						+ ui.item.lbl : "Nothing selected, input was "
						+ this.code);
				var val = ui.item.code;
				$('#recordKey').val(val);
				if (!isEmpty($('#clientID').val())
						&& !isEmpty($('#userID').val())) {
					$("#btnSubmit").attr('disabled', false);
				}
			},
			open : function() {
				$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
			},
			close : function() {
				$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
			}
		});/*.data("autocomplete")._renderItem = function(ul, item) {
			$(ul).addClass('ft-scrollable-autocompleter');
			var inner_html = '<a><ol class="t7-autocompleter"><ul>' + item.code
					+ '</ul><ul>' + '    ' + item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

jQuery.fn.UserAutoComplete = function() {
	return this.each(function() {
		$(this).autocomplete({
			source : function(request, response) {
				$.blockUI({
					overlayCSS : {
						opacity : 0
					},
					baseZ : 2000,
					message : '<div style="z-index: 1, position: absolute"><h2><img src="static/images/backgrounds/busy.gif" class="middleAlign"/>&nbsp;Processing your request...</h2></div>',
					css : {
						height : '32px',
						padding : '8px 0 0 0'
					}
				});
				$.ajax({
							url : clientSSO == "Y" ? "services/userseek/USER_EMULATION_SSO.json?$top=-1" : "services/userseek/USER_EMULATION.json?$top=-1",
							complete : function(XMLHttpRequest, textStatus) {
								$.unblockUI();
								if ("error" == textStatus)
									alert("Unable to complete your request!");
							},
							dataType : "json",
							data : {
								$autofilter : request.term,
								$filtercode1 : $('#recordKey').val()
							},
							success : function(data) {
								$("#modeDialog").dialog("option", "width", 300);
								$("#modeDialog").dialog("option", "maxWidth",
										300);
								var rec = data.d.preferences;
								response($.map(rec, function(item) {
											/*
											 * if(item.code == null ||
											 * item.code.length == 0) { return {
											 * label: "No match found", value: "" } }
											 */
											return {
												label : item.USER_CODE.concat( " | ", item.USER_DESCRIPTION),
												value : item.USER_CODE
											}
										}));
							},
							error : function(data) {
								response($.map(data, function(item) {
											return {
												label : "No match found",
												description : "",
												value : ""
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
				$('#userID').val(ui.item.value);
				if (!isEmpty($('#clientID').val())
						&& !isEmpty($('#userID').val())) {
					switchMode();
				}
			},
			open : function() {
				$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
			},
			close : function() {
				$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
			}
		});/*.data("autocomplete")._renderItem = function(ul, item) {
			$(ul).addClass('ft-scrollable-autocompleter');
			var inner_html = '<a><ol class="t7-autocompleter"><ul title= "'+item.value +' '+item.label +'">'
					+ item.value + '</ul><ul>' + '    ' + item.label
					+ '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

function showMode() {
	$('#modeDialog').dialog({
				autoOpen : false,
				minWidth : 250,
				title : changeMode,
				minHeight : 100,
				modal : true,
				draggable : false,
				resizable : false,
				position : 'center',
				open : function() {
					$('#admin').attr("checked", false);
					$('#onbehalf').attr("checked", false);
					$('#emulation').attr("checked", false);
				},
				close : function() {
					$('#clientID').val('');
					$('#userID').val('');
					$('#emulate').hide();
				}
			});
	$('#dialogMode').val('1');
	$('#modeDialog').dialog('open');

	var frm = document.forms["frmSwitchUser"];
	frm.target = "";
}
/*END:*/

jQuery.download = function(url, data, method) {
	// url and data options required
	if (url && data) {
		// data can be string of parameters or array/object
		data = typeof data == 'string' ? data : jQuery.param(data[0]);
		// split params into form inputs
		var inputs = '';
		jQuery.each(data.split('&'), function() {
					var pair = this.split('=');
					inputs += '<input type="hidden" name="' + pair[0]
							+ '" value="' + pair[1] + '" />';
				});
		// send request
		jQuery('<form action="' + url + '" method="' + (method || 'post')
				+ '">' + inputs + '</form>').appendTo('body').submit().remove();
	};
	$.unblockUI();
};

function gotoPage(str) {
	var frm = document.forms['menuForm'];

	if (!frm)
		frm = document.forms['changePasswordForm'];
	if (frm == null)
		frm = document.forms['frmMain'];

	frm.method = "POST";
	frm.action = str;
	frm.submit();
};

function gotoQuickLink(str) {
	createCookie('menubar_index', 'URL:' + str);
	var frm = document.forms['quicklink'];
	frm.method = "POST";
	frm.action = str;
	frm.submit();
};

function addQuickmenu() {
	frm = document.forms['frmMain'];
	frm.method = "POST";
	frm.action = "addQuickLink.form";
	frm.submit();
};

function delQuickmenu() {
	frm = document.forms['frmMain'];
	frm.method = "POST";
	frm.action = "deleteQuickLink.form";
	frm.submit();
};

function showHelp(path) {
	MadCap.OpenHelp(path, null, null,null );
};

function onMenuItemSelect(strUrl, strMenu) {
	eraseCookie("module");
	eraseCookie("menubar_index");
	createCookie('menubar_index', strMenu);
	var module_name = ".json";
	if (strUrl.indexOf(module_name) == -1) {
		var frm = document.forms['frmMenu'];
		if (frm) {
			frm.method = 'POST';
			frm.action = strUrl;
			frm.submit();
		} else {
			window.location.href = strUrl;
		}
	} else {
		$.ajax({
			url : "services/" + strUrl,
			contentType : "application/json",
			type : 'POST',
			data : {},
			success : function(data) {
				var urlParam = data["urlParameters"];
				if ((urlParam != undefined)
						|| (urlParam != null && urlParam != '')) {
					var win = window
							.open(
									urlParam,
									"Title",
									"toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=780, height=500, top="
											+ (screen.height - 400)
											+ ", left="
											+ (screen.width - 840));
				}
			}
		});
	}
};

function onModuleSelect(strMenu) {
	eraseCookie("module");
	eraseCookie("menubar_index");
	var strUrl = getUrlMapping(strMenu);
	if (null != strUrl) {
		createCookie('module', strMenu);
		window.location.href = strUrl;
	}
};

function onHomeClick() {
	eraseCookie("module");
	eraseCookie("menubar_index");
	createCookie('module', 'Home');
	return true;
}

function getUrlMapping(strMenu) {
	// NOTE: Remove this static mapping and add dynamic mapping.
	var url;
	switch (strMenu) {
		case "Home" :
			url = "showWelcome.form";
			break;
		default :
			url = null;
	}
	return url;
};

function highlightMenu() {
	var isUrl, re, ckBar, strId;
	re = /onMenuItemSelect\(\'(\w+\.\w+)\'\,(?:\s|%20)\'(\w+\.(?:\d+\.?)+)+\'\)\;/g;
	ckBar = readCookie('menubar_index');
	if (ckBar != null && ckBar.length > 0) {
		isUrl = ckBar.indexOf('URL:') == 0;
		ckBar = ckBar.substring(ckBar.indexOf(':') + 1);
		$('ul#cmsmenu li a').each(function(idx, elm) {
					var hRef, m;
					hRef = elm.getAttribute('onclick');
					m = re.exec(hRef);
					if (m != null) {
						log(ckBar + ', ' + m[1] + ', ' + m[2]);
						if ((isUrl && ckBar == m[1]) || (ckBar == m[2])) {
							strId = m[2];
							return false;
						}
					}
				});
		log(strId);
		if (strId != null) {
			var arr = strId.split('.');
			$('#mbar_' + arr[0]).toggleClass('current');
			$('#' + arr[0] + '.' + arr[1]).toggleClass('currentItem');
		}
	}
};

function gotoReportsView(str) {
	var frm = document.forms['favReportList'];
	frm.method = "POST";
	frm.action = str;
	frm.submit();
};

/*Action List popup handling: start*/
function saveActionList() {
	var result = saveActionPref('saveActionList.rest');
	if (result == "error") {
		removeErrorForActionList();
		showErrorforActionList(errorFail);
	} else {
	}
}

function cancelActionList() {
	$('#actionListPopUpDiv').dialog("close");
}

function paintactionListItemsToPopup() {

	var childCountPerRow = 0, updatedValues, rowDiv;
	var isSelectedActionAbsent = (actionListNewSelected == undefined)
			|| (Object.keys(actionListNewSelected).length == 1 && selectedAryListMap[0].length == 1)
	var isUnSelectedActionAbsent = (actionListNewUnselected == undefined)
			|| (Object.keys(actionListNewUnselected).length == 1 && unselectedAryListMap[0].length == 1)
	if (isSelectedActionAbsent && isUnSelectedActionAbsent) {

	} else if (!isSelectedActionAbsent && !isUnSelectedActionAbsent) {
		updatedValues = createActionListCenterArea(Object
						.keys(actionListNewSelected).length,
				selectedAryListMap, true, childCountPerRow, rowDiv);
		createActionListCenterArea(Object.keys(actionListNewUnselected).length,
				unselectedAryListMap, false, updatedValues.childCountPerRow,
				updatedValues.rowDiv);
		createActionListBadges(Object.keys(actionListNewSelected).length,
				selectedAryListMap);
	} else if (!isSelectedActionAbsent) {
		updatedValues = createActionListCenterArea(Object
						.keys(actionListNewSelected).length,
				selectedAryListMap, true, childCountPerRow, rowDiv);
		createActionListBadges(Object.keys(actionListNewSelected).length,
				selectedAryListMap);
	} else {
		createActionListCenterArea(Object.keys(actionListNewUnselected).length,
				unselectedAryListMap, false, childCountPerRow, rowDiv);
		createActionListBadges(Object.keys(actionListNewSelected).length,
				selectedAryListMap);
	}
}

function createActionListCenterArea(recordsLength, recordsMap, isChecked,
		childCountPerRow, rowDiv) {
	var actionListMainDiv = $('#actionListContentDiv');
	for (var i = 0; i < recordsLength; i++) {
		if (childCountPerRow % 3 == 0) {
			rowDiv = document.createElement("div");
			rowDiv.setAttribute('class', 'form-group');
			actionListMainDiv.append(rowDiv);
		}
		var actionListRecord = recordsMap[i];
		var checkboxElement = $('<input/>').attr({
					type : 'checkbox',
					checked : isChecked,
					tabindex: '1',
					checkboxValue : actionListRecord[0],
					onClick : 'addSelectedActionList(this);',
					checkboxText : actionListRecord[1]
				});
		var colDiv = $('<div>').attr({
					'class' : 'col-sm-4 form-group'
				}).appendTo(rowDiv);
		var labelElement;
		if (actionListRecord[1].length > 21) {
			labelElement = $('<label>').attr({
						'title' : actionListRecord[1],
						'class' : 'checkbox-inline'
					}).append(checkboxElement).append(actionListRecord[1]);
		} else {
			labelElement = $('<label>').attr({
						'class' : 'checkbox-inline'
					}).append(checkboxElement).append(actionListRecord[1]);
		}
		childCountPerRow++;
		labelElement.appendTo(colDiv);
	}
	return {
		rowDiv : rowDiv,
		childCountPerRow : childCountPerRow
	};
}

function createActionListBadges(recordsLength, recordsMap) {
	var badgeList = $('#actionListBadges');
	badgeList.empty();
	var ul = document.createElement("ul");
	ul.setAttribute('class', 'js-badge-container pull-left list-unstyled');

	for (var i = 0; i < actionListNewSelected.length; i++) {
		var actionListRecord = recordsMap[i];
		if (actionListRecord != "") {
			var text = actionListNewSelected[i].substr(actionListNewSelected[0]
					.indexOf("=")
					+ 1);
			var li = document.createElement("li");
			var a = document.createElement("a");
			a.setAttribute('href', '#');
			a
					.setAttribute('class',
							'badges truncate-text');
			a.setAttribute('role', 'button');
			a.setAttribute('tabindex', '1');
			a.setAttribute('value', actionListRecord[0]);
			a.setAttribute('onClick', 'actionListBadgeClicked($(this),false)');
			var iEl = document.createElement("i");
			iEl.setAttribute('class', 'fa fa-times-circle');
			a.appendChild(iEl);
			var span = document.createElement("span");
			span.setAttribute('class', 't-filter-text');
			span.setAttribute('title', actionListRecord[1]);
			span.innerHTML += actionListRecord[1];
			a.appendChild(span);

			li.appendChild(a);
			ul.appendChild(li);
		}

	}
	badgeList.append(ul);
	var numOfBadges;
	if (actionListNewSelected.length == 1 && actionListNewSelected == "")
		numOfBadges = 0;
	else
		numOfBadges = actionListNewSelected.length;
	createGhostBadges(numOfBadges, badgeList);
	var button = document.createElement("button");
	button.setAttribute('class', 'clear-all-links');
	button.setAttribute('type', 'button');
	button.setAttribute('name', 'button');
	button.setAttribute('onClick', 'clearAllActionListLinks()');
	button.innerHTML += "Clear All Links";
	badgeList.append(button);
}

function clearAllActionListLinks() {
	var badgeList = $('#actionListBadges');
	var selectedCheckBoxes = $('#actionListContentDiv')
			.find('input[type=checkbox]:checked').each(function() {
						this.click();
					});
	badgeList.empty();
	createGhostBadges(0, badgeList);
	var button = document.createElement("button");
	button.setAttribute('class', 'clear-all-links');
	button.setAttribute('type', 'button');
	button.setAttribute('name', 'button');
	button.setAttribute('onClick', 'clearAllActionListLinks()');
	button.innerHTML += "Clear All Links";
	badgeList.append(button);
}

function addSelectedActionList(checkedElement) {
	var checkedCheckboxCount = 0;
	$("#actionListContentDiv input:checkbox:checked").each(function() {
				checkedCheckboxCount++;
			});
	if (checkedCheckboxCount > 5)
		checkedElement.checked = false;

	if (checkedElement.checked == true)
		addBadgeInActionListBadges(checkedElement, checkedCheckboxCount);
	else if (checkedElement.checked == false)
		removeBadgeFromActionListBadges(checkedElement, checkedCheckboxCount);
}

function removeBadgeFromActionListBadges(element, count) {
	var checkboxText = element.getAttribute('checkboxText');
	var checkboxValue = element.getAttribute('checkboxValue');
	var elementAreadyExists = $("[title='" + checkboxText + "']");

	if (elementAreadyExists.length != 0)
		actionListBadgeClicked(elementAreadyExists.parent(), true);
}

function addBadgeInActionListBadges(element, count) {
	var badgeList = $('#actionListBadges');
	var hasUl = badgeList.has('ul').length ? "Yes" : "No";
	if (hasUl == "No") {
		badgeList.empty();
		var ul = document.createElement("ul");
		ul.setAttribute('class', 'js-badge-container pull-left list-unstyled');
		badgeList.append(ul);
	}
	var badgeListElements = $('#actionListBadges ul');
	var checkboxText = element.getAttribute('checkboxText');
	var checkboxValue = element.getAttribute('checkboxValue');
	var elementAreadyExists = $("[title='" + checkboxText + "']");

	if (elementAreadyExists.length == 0) {
		var li = document.createElement("li");
		var a = document.createElement("a");
		a.setAttribute('href', '#');
		a.setAttribute('class', 'badges truncate-text');
		a.setAttribute('role', 'button');
		a.setAttribute('value', checkboxValue);
		a.setAttribute('tabindex', '1');
		a.setAttribute('onClick', 'actionListBadgeClicked($(this),false)');
		// li.appendChild(a);
		var iEl = document.createElement("i");
		iEl.setAttribute('class', 'fa fa-times-circle');
		// li.appendChild(iEl);
		a.appendChild(iEl);
		var span = document.createElement("span");
		span.setAttribute('class', 't-filter-text');
		span.setAttribute('title', checkboxText);
		span.innerHTML += checkboxText;
		// iEl.appendChild(span);
		a.appendChild(span);
		li.appendChild(a);

		badgeListElements.append(li);
		badgeListElements.nextAll().remove();

		var numOfBadges = count;
		createGhostBadges(numOfBadges, badgeList);
		var button = document.createElement("button");
		button.setAttribute('class',
				'clear-all-links');
		button.setAttribute('type', 'button');
		button.setAttribute('name', 'button');
		button.setAttribute('onClick', 'clearAllActionListLinks()');
		button.innerHTML += "Clear All Links";
		badgeList.append(button);
	}
}

function actionListBadgeClicked(clickedElement, onCheckboxClick) {
	var badgeList = $('#actionListBadges');
	var badgeListSpan = $('#actionListBadges > span');
	var selectedElementValue = clickedElement.attr('value');

	if (onCheckboxClick == false) {
		$("[checkboxValue=" + selectedElementValue + "]")
				.prop('checked', false).triggerHandler('click');
	} else if (onCheckboxClick == true) {
		var el = badgeList.find(clickedElement);
		el.parent().remove();

		if (badgeListSpan.length == 0) {
			var span = document.createElement("span");
			span
					.setAttribute('class',
							'js-ghost-badges badges-ghost-container');
			var div = document.createElement("div");
			div.setAttribute('class', 'badges-ghost');
			span.appendChild(div);
			badgeList.append(span);
		} else {
			var div = document.createElement("div");
			div.setAttribute('class', 'badges-ghost');
			badgeListSpan.append(div);
		}
	}
}

function removeErrorForActionList() {
	var errorMsgDiv = $("#actionListErrorMsg");
	errorMsgDiv.empty();
}

function showErrorforActionList(msg) {
	var errorDiv = $('#actionListErrorDiv');
	errorDiv.removeClass("hide");
	var errDivMsg = $('#actionListErrorMsg');
	errDivMsg.text(msg);
}

function saveActionPref(strUrl) {
	var strActionData = {};
	var checkedCheckboxCount = 0; // index=0;
	var arrItems = [];
	$("#actionListContentDiv input:checkbox:checked").each(function() {
				arrItems[checkedCheckboxCount++] = $(this).attr('value');
			});
	var myJSONText = JSON.stringify(arrItems);
	var actionListNew;
	strActionData[csrfTokenName] = csrfTokenValue;
	strActionData["selectedItems"] = myJSONText;
	var result = '';
	$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
	$.ajax({
				type : 'POST',
				async : false,
				data : strActionData,
				url : strUrl,
				success : function(data) {
					actionListNew = data.ACTION_LIST;
					actionListNewSelected = data.selectedActionListForPopUp;
					actionListNewUnselected = data.unselectedActionListForPopUp;
					result = "success";
				},
				error : function() {
					result = "error";
				}
			});
	return result;
}

function getActionListData() {
	var strActionData = {};
	var checkedCheckboxCount = 0;
	var arrItems = [];
	$("#actionListContentDiv input:checkbox:checked").each(function() {
				arrItems[checkedCheckboxCount++] = $(this)
						.attr('checkboxValue');
			});
	var myJSONText = JSON.stringify(arrItems);
	return myJSONText;
}

function createNewActionListDiv(actionList, actionListNewUnselected) {
	var list = document.getElementById("divEnclosingActionList");
	while (list.childNodes[0] != null) {
		list.removeChild(list.childNodes[0]);
	}

	var newdiv = document.createElement('ol');
	var selectHTML = "";
	selectHTML = '<ol id="actionListLinksDivision">';
	if (actionListNewUnselected == undefined) {
		selectHTML += '<div><span class="naFavdata">' + noData
				+ ' </span> </div>';
	} else if (actionList != undefined && actionList.length > 0) {
		for (i = 0; i < actionList.length; i = i + 1) {
			selectHTML += '<li>'
					+ '<a href="#" class="actionlink" onclick="gotoActionView(\''
					+ actionList[i].actionLinkUrl + '\')">'
					+ actionList[i].actionLinkName + '</a>' + '</li>';
		}
	} else {
		selectHTML += '<div><span class="naFavdata">' + noActions
				+ '</span> </div>'
	}
	selectHTML += "</ol>";
	newdiv.innerHTML = selectHTML;
	document.getElementById("divEnclosingActionList").appendChild(newdiv);
}
/*Action List popup handling: end*/
/*Side Panel Message Form:Start*/
function gotoMessageFormsPopUpView() {
	var buttonsMessageFormsPopUpOpts = {};
	buttonsMessageFormsPopUpOpts[btnsMsgFormsRightMenuArray['submitPopUpBtn']] = function() {
		var result = saveMessageFormsPref('saveMessageFormsPref.rest');
		if (result == "error") {
			var errDiv = document.getElementById('errorDivMessageForms');
			if (errDiv.childNodes[0] != null) {
				errDiv.removeChild(errDiv.childNodes[0]);
			}

			var newdiv = document.createElement('div')
			newdiv.innerHTML = "<div id='messageArea' class='errors'><span>"
					+ msgError + " </span>" + "<ul><li>" + msgerrorFail
					+ " </li></ul></div><br/>";
			errDiv.appendChild(newdiv);
		} else {
			$(this).dialog("close");
		}
	};
	buttonsMessageFormsPopUpOpts[btnsMsgFormsRightMenuArray['cancelPopUpBtn']] = function() {
		$(this).dialog("close");
	};
	$('#messageFormsRightMenuFormPopUp').dialog({
				title : "Message Forms",
				autoOpen : false,
				maxHeight : 550,
				minHeight : 156,
				width : 735,
				resizable : false,
				draggable : false,
				modal : true,
				open : function() {
					paintMessageFormSidePanelPopup();
				},
				close : function() {
					userPreferenceCancelForMessageForms();
				}
			});
	$('#messageFormsRightMenuFormPopUp').dialog("open");
}

function paintMessageFormQuickLinksSettingPopupTab() {
	var strUrl = "services/getMessageGroupsList.json?$client=" + strClient;
	$.ajax({
				url : strUrl,
				type : 'POST',
				success : function(data) {
					selectedMessageFormsFromService.length = 0;
					selectedMessageFormsFromService = selectedMessageTypesInSidePanelArray.slice();
					populateMessageCategoryInQuickLinksSettingPopup(data);
					populateMessageFormsBadges(data);
				}
			});
}

function populateMessageCategoryInQuickLinksSettingPopup(response) {

	if (!jQuery.isEmptyObject(response)) {
		var data = response;
		data.sort(function(a, b) {
					if (a.filterValue < b.filterValue)
						return -1;
					if (a.filterValue > b.filterValue)
						return 1;
					return 0;
				});
		var length = data.length;
		var list = $("#chooseMsgCategoryFromSidePanel");
		list.empty();
		var horizontalDiv = document.createElement("div");
		//horizontalDiv.setAttribute('class', 'row');
		horizontalDiv.setAttribute('style',
				'display:inline-flex; display:-ms-flexbox; overflow: hidden;');
		list.append(horizontalDiv);
		for (var i = 0; i < data.length; i++) {
			var headerData = data[i];
			var selectdFormGroup = headerData.filterCode;
			var verticalDiv = document.createElement("div");
			if (i == 0)
				verticalDiv.setAttribute('class',
						'quicklinks-column no-left-border word-wrap');
			else
				verticalDiv.setAttribute('class', 'quicklinks-column');
			verticalDiv.setAttribute('style', 'padding:5px');
			var h4 = document.createElement("h4");
			h4.textContent = headerData.filterValue;
			verticalDiv.appendChild(h4);
			horizontalDiv.appendChild(verticalDiv);
			populateMessageFormsCheckBoxes(verticalDiv, selectdFormGroup);
		}
	} /*else {
		if (jQuery.isEmptyObject(data)) {
			var errorMsg = getLabel('noClientDataError',
					'No Data Available for the moment.');
		}
	}*/
}

function populateMessageFormsBadges(response) {
	if (!jQuery.isEmptyObject(response)) {
		var data = response;
		data.sort(function(a, b) {
					if (a.filterValue < b.filterValue)
						return -1;
					if (a.filterValue > b.filterValue)
						return 1;
					return 0;
				});
		var badgeList = $("#messageFormBadges");
		badgeList.empty();
		var ul = document.createElement("ul");
		ul.setAttribute('class', 'js-badge-container pull-left list-unstyled');
		for (var i = 0; i < data.length; i++) {
			var headerData = data[i];
			var selectdFormGroup = headerData.filterCode;
			createMessageFormBagesList(selectdFormGroup, ul);
		}
		badgeList.append(ul);

		var numOfBadges = selectedMessageFormsFromService.length;
		createGhostBadges(numOfBadges, badgeList);
		var button = document.createElement("button");
		button.setAttribute('class',
				'clear-all-links');
		button.setAttribute('type', 'button');
		button.setAttribute('name', 'button');
		button.setAttribute('onClick', 'clearAllMessageFormLinks()');
		button.innerHTML += "Clear All Links";
		badgeList.append(button);
	} /*else {
		if (jQuery.isEmptyObject(data)) {
			var errorMsg = getLabel('noClientDataError',
					'No Data Available for the moment.');
		}
	}*/
}

function clearAllMessageFormLinks() {
	var badgeList = $('#messageFormBadges');
	var selectedCheckBoxes = $('#chooseMsgCategoryFromSidePanel')
			.find('input[type=checkbox]:checked').each(function() {
						this.click();
					});

	badgeList.empty();
	createGhostBadges(0, badgeList);
	var button = document.createElement("button");
	button.setAttribute('class', 'clear-all-links');
	button.setAttribute('type', 'button');
	button.setAttribute('name', 'button');
	button.setAttribute('onClick', 'clearAllMessageFormLinks()');
	button.innerHTML += "Clear All Links";
	badgeList.append(button);
}

function createGhostBadges(numOfBadgesPresent, badgeList) {
	if (numOfBadgesPresent < 5) {
		var ghostBadgesToCreate = 5 - numOfBadgesPresent;
		var span = document.createElement("span");
		span.setAttribute('class', 'js-ghost-badges badges-ghost-container');
		for (var i = 0; i < ghostBadgesToCreate; i++) {
			var div = document.createElement("div");
			div.setAttribute('class', 'badges-ghost');
			span.appendChild(div);
		}
		badgeList.append(span);
	}
}

function createQuickPayGhostBadges(numOfBadgesPresent, badgeList) {
	if (numOfBadgesPresent < 5) {
		var ghostBadgesToCreate = 5 - numOfBadgesPresent;
		var span = document.createElement("span");
		span.setAttribute('class', 'js-ghost-badges badges-ghost-container');
		for (var i = 0; i < ghostBadgesToCreate; i++) {
			var div = document.createElement("div");
			div.setAttribute('class', 'badges-ghost');
			span.appendChild(div);
		}
		badgeList.append(span);
	}
}

function createMessageFormBagesList(selectdFormGroup, ul) {
	var data = fetchMessageTypeListSidePanel(selectdFormGroup);
	if (data && data.d && !jQuery.isEmptyObject(data.d.messageFormMst)) {
		var dataArray = data.d.messageFormMst;
		dataArray.sort(function(a, b) {
					if (a.formName < b.formName)
						return -1;
					if (a.formName > b.formName)
						return 1;
					return 0;
				});
		var isMessageTypePresent = false;

		for (var i = 0; i < dataArray.length; i++) {
			isMessageTypePresent = ($.inArray(dataArray[i].recordKeyNo,
					selectedMessageFormsFromService) != -1 ? true : false);
			if (isMessageTypePresent) {
				var li = document.createElement("li");
				var a = document.createElement("a");
				a.setAttribute('href', '#');
				a.setAttribute('class',
						'badges truncate-text');
				a.setAttribute('role', 'button');
				a.setAttribute('tabindex', '1');
				a.setAttribute('value', dataArray[i].recordKeyNo);
				a.setAttribute('onClick',
						'messageFormBadgeClicked($(this),false)');
				var iEl = document.createElement("i");
				iEl.setAttribute('class', 'fa fa-times-circle');
				a.appendChild(iEl);
				var span = document.createElement("span");
				span.setAttribute('class', 't-filter-text');
				span.setAttribute('title', dataArray[i].formName);
				span.innerHTML += dataArray[i].formName;
				a.appendChild(span);
				li.appendChild(a);
				ul.appendChild(li);
			}
		}
	}
}

function populateMessageFormsCheckBoxes(verticalDiv, selectdFormGroup) {
	var data = fetchMessageTypeListSidePanel(selectdFormGroup);
	if (data && data.d && !jQuery.isEmptyObject(data.d.messageFormMst)) {
		var dataArray = data.d.messageFormMst;
		dataArray.sort(function(a, b) {
					if (a.formName < b.formName)
						return -1;
					if (a.formName > b.formName)
						return 1;
					return 0;
				});

		var isMessageTypePresent = false;
		var ul = document.createElement('ul');
		ul.setAttribute('class', 'list-unstyled');
		verticalDiv.appendChild(ul);

		for (var i = 0; i < dataArray.length; i++) {
			isMessageTypePresent = ($.inArray(dataArray[i].recordKeyNo,
					selectedMessageFormsFromService) != -1 ? true : false);
			var li = document.createElement("li");
			var checkBoxDiv = document.createElement("div");
			checkBoxDiv.setAttribute('class', 'checkbox');
			li.appendChild(checkBoxDiv);
			var label = document.createElement("label");
			checkBoxDiv.appendChild(label);
			var input = document.createElement("input");
			input.setAttribute('type', 'checkbox');
			input.setAttribute('name', selectdFormGroup);
			if (isMessageTypePresent)
				input.setAttribute('checked', isMessageTypePresent);
			input.setAttribute('formRecordKey', dataArray[i].recordKeyNo);
			input.setAttribute('formName', dataArray[i].formName);
			input.setAttribute('tabindex', '1');
			input.setAttribute('onClick',
					'messageFormChildRadioClickSidePanel($(this))');
			label.appendChild(input);
			label.setAttribute('class', 'checkbox-inline');
			label.innerHTML += dataArray[i].formName;
			ul.appendChild(li);
		}
	}
}

function populateMessageTypeInSidePanelPopup(selectdFormGroup) {
	var data = fetchMessageTypeListSidePanel(selectdFormGroup);
	var centreDiv = $("#chooseMsgTypeFromSidePanel");
	centreDiv.empty();
	if (data && data.d && !jQuery.isEmptyObject(data.d.messageFormMst)) {
		var dataArray = data.d.messageFormMst;
		dataArray.sort(function(a, b) {
					if (a.formName < b.formName)
						return -1;
					if (a.formName > b.formName)
						return 1;
					return 0;
				});

		var rowDiv;
		var childCountPerRow = 0;
		var isMessageTypePresent = false;
		for (var i = 0; i < dataArray.length; i++) {
			if (childCountPerRow % 3 == 0) {
				rowDiv = document.createElement("div");
				rowDiv.setAttribute('class', 'row form-group');
				centreDiv.append(rowDiv);
			}
			isMessageTypePresent = ($.inArray(dataArray[i].recordKeyNo,
					selectedMessageFormsFromService) != -1 ? true : false);
			var ctrl = $('<input/>').attr({
						type : 'checkbox',
						name : selectdFormGroup,
						checked : isMessageTypePresent,
						formRecordKey : dataArray[i].recordKeyNo,
						tabindex : '1',
						onClick : "messageFormChildRadioClickSidePanel($(this))"
					});
			var colDiv = $('<div>').attr({
						'class' : 'col-sm-4'
					}).appendTo(rowDiv);
			if (dataArray[i].formName.length > 21) {
				$('<label>').attr({
							'title' : dataArray[i].formName,
							'class' : 'checkbox-inline truncate-text'
						}).append(ctrl).append(dataArray[i].formName)
						.appendTo(colDiv);
			} else {
				$('<label>').attr({
							'class' : 'checkbox-inline'
						}).append(ctrl).append(dataArray[i].formName)
						.appendTo(colDiv);
			}
			childCountPerRow++;
		}
	}
}

function fetchMessageTypeListSidePanel(selectedFormGroup) {
	var strUrl = 'getMessageFormList.srvc?' + csrfTokenName + "="
			+ csrfTokenValue + "&$formGroup=" + selectedFormGroup + "&$client="
			+ strClient + "&$seller=" + sessionSellerCode
			+ "&$screen=dashboardMessageForm";
	var responseData = null;
	$.ajax({
				url : strUrl,
				type : 'POST',
				async : false,
				data : {
					$category : selectedFormGroup
				},
				success : function(data) {
					responseData = data;
				}
			});
	return responseData;
}

function messageFormChildRadioClickSidePanel(selectedElement) {

	var isChecked = selectedElement.prop("checked");
	var selectedElementRecordNo = selectedElement.attr("formRecordKey");
	var isPresentSelectedMessageType = ($.inArray(selectedElementRecordNo,
			selectedMessageFormsFromService) != -1 ? true : false)
	if (isChecked) {
		if (selectedMessageFormsFromService.length >= 5) {
			selectedElement.attr("checked", false)
		} else {
			selectedMessageFormsFromService.push(selectedElementRecordNo);
			addBadgeInMessageFormsBadges(selectedElement,
					selectedMessageFormsFromService);
		}
	} else {
		if (isPresentSelectedMessageType) {
			selectedMessageFormsFromService.splice($.inArray(
							selectedElementRecordNo,
							selectedMessageFormsFromService), 1);
			removeBadgeFromMessageFormBadges(selectedElement);
		}
	}
}

function removeBadgeFromMessageFormBadges(element) {
	var formRecordKey = element.attr('formrecordkey');
	var formName = element.attr('formName');
	var elementAreadyExists = $("[title='" + formName + "']");

	if (elementAreadyExists.length != 0)
		messageFormBadgeClicked(elementAreadyExists.parent(), true);
}

function addBadgeInMessageFormsBadges(element, dataArray) {
	var badgeList = $('#messageFormBadges');
	var formRecordKey = element.attr('formrecordkey');
	var formName = element.attr('formName');
	var elementAreadyExists = $('[title="' + formName + '"]');
	var hasUl = badgeList.has('ul').length ? "Yes" : "No";
	if (hasUl == "No") {
		badgeList.empty();
		var ul = document.createElement("ul");
		ul.setAttribute('class', 'js-badge-container pull-left list-unstyled');
		badgeList.append(ul);
	}

	if (elementAreadyExists.length == 0) {
		var li = document.createElement("li");
		var a = document.createElement("a");
		a.setAttribute('href', '#');
		a.setAttribute('class', 'badges truncate-text');
		a.setAttribute('role', 'button');
		a.setAttribute('value', formRecordKey);
		a.setAttribute('tabindex', '1');
		a.setAttribute('onClick', 'messageFormBadgeClicked($(this),false)');
		var iEl = document.createElement("i");
		iEl.setAttribute('class', 'fa fa-times-circle');
		a.appendChild(iEl);
		var span = document.createElement("span");
		span.setAttribute('class', 't-filter-text');
		span.setAttribute('title', formName);
		span.innerHTML += formName;
		a.appendChild(span);
		li.appendChild(a);
		$('#messageFormBadges ul').append(li);
		$('#messageFormBadges ul').nextAll().remove();
		var numOfBadges = dataArray.length;
		createGhostBadges(numOfBadges, badgeList);
		var button = document.createElement("button");
		button.setAttribute('class',
				'clear-all-links');
		button.setAttribute('type', 'button');
		button.setAttribute('name', 'button');
		button.setAttribute('onClick', 'clearAllMessageFormLinks()');
		button.innerHTML += "Clear All Links";
		badgeList.append(button);
	}
}

function messageFormBadgeClicked(element, onCheckboxClick) {
	var badgeList = $('#messageFormBadges');
	var badgeListSpan = $('#messageFormBadges > span');
	var selectedElementRecordNo = element.attr('value');
	if (onCheckboxClick == false) {
		$("[formrecordkey=" + selectedElementRecordNo + "]").prop('checked',
				false).triggerHandler('click');
	} else if (onCheckboxClick == true) {
		var el = badgeList.find(element);
		el.parent().remove();
		if (badgeListSpan.length == 0) {
			var span = document.createElement("span");
			span
					.setAttribute('class',
							'js-ghost-badges badges-ghost-container');
			var div = document.createElement("div");
			div.setAttribute('class', 'badges-ghost');
			span.appendChild(div);
			badgeList.append(span);
		} else {
			var div = document.createElement("div");
			div.setAttribute('class', 'badges-ghost');
			badgeListSpan.append(div);
		}
	}
}

function saveMessageFormsPref(strUrl) {
	var strMessageFormData = {};
	var myJSONText = JSON.stringify(selectedMessageFormsFromService);
	strMessageFormData[csrfTokenName] = csrfTokenValue;
	strMessageFormData["selectedItems"] = myJSONText;
	var result = '';
	$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
	$.ajax({
				type : 'POST',
				async : false,
				data : strMessageFormData,
				url : strUrl,
				success : function(data) {
					messageFormListNew = data.MESSAGEFORMS_FAV_LIST;
					result = "success";
				},
				error : function() {
					result = "error";
				}
			});
	return result;
}

function getMessageFormData() {
	var strMessageFormData = {};
	var myJSONText = JSON.stringify(selectedMessageFormsFromService);
	strMessageFormData["selectedItems"] = myJSONText;
	return strMessageFormData;
}

function cancelMessageFormSidePanelPopup() {
	$('#messageFormsRightMenuFormPopUp').dialog("close");
}
function saveMessageFormSidePanelPopup() {
	var result = saveMessageFormsPref('saveMessageFormsPref.rest');
	if (result == "error") {
		var errDiv = document.getElementById('errorDivMessageForms');
		if (errDiv.childNodes[0] != null) {
			errDiv.removeChild(errDiv.childNodes[0]);
		}

		var newdiv = document.createElement('div')
		newdiv.innerHTML = "<div id='messageArea' class='errors'><span>"
				+ msgError + " </span>" + "<ul><li>" + msgerrorFail
				+ " </li></ul></div><br/>";
		errDiv.appendChild(newdiv);
	} else {
		// $("#messageFormsRightMenuFormPopUp").dialog("close");
		$("#editQuickLinksPopup").dialog("close");
	}
}
/* Side panel message form handling:End */

function gotoQuickPayProductsPopUpView(mypProduct, mypDescription) {
	var buttonsActionListPopUpOpts = {};
	var strurl = "saveQuickPayProducts.rest";
	buttonsActionListPopUpOpts[btnsActionListPopUpArray['cancelPopUpBtn']] = function() {
		$(this).dialog("close");
	};
	buttonsActionListPopUpOpts[btnsActionListPopUpArray['submitPopUpBtn']] = function() {
		saveQuickPay(mypProduct, mypDescription, strurl);

	};
	$('#quickPayProductsPopUp').dialog({
				autoOpen : false,
				title : mypDescription,
				height : 425,
				width : 785,
				modal : true,
				buttons : buttonsActionListPopUpOpts,
				resizable : false,
				close : function() {
					$('#qpFXRate').val('');
					$('#qpClnt').val('');
					clearQuickPay();
				}

			});

	document.getElementById('qpProduct').value = mypProduct;
	removeErrorBoxForAction('qpAmount');
	var strDrCrFlag = $('#qpDrCrFlag').val();
	var strTxnCurrency = $('#qpTxnCurrency').val();
	var strRepData = {};
	strRepData['mypProduct'] = mypProduct;
	strRepData['mypDescription'] = mypDescription;
	strRepData['strDrCrFlag'] = strDrCrFlag;
	strRepData['strTxnCurrency'] = strTxnCurrency;
	strRepData[csrfTokenName] = csrfTokenValue;
	$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
	$.ajax({
		type : 'POST',
		data : strRepData,
		url : "showPopUpForQuickPayProducts.rest",
		async : false,
		success : function(data) {
			document.getElementById('qpMypBankBeneFlag').value = data.mypBankBeneFlag;
			document.getElementById('qpRestrictedBene').value = data.restrictedBene;
			populateCurrencyList(data.VALIDCURRENCIES, data.txnCurrency,
					data.mypProduct);
			addParameterValues(mypProduct);

			$('#quickPayProductsPopUp').dialog("open");
		},
		error : function() {
		}
	});

};

function saveQuickPay(mypProduct, mypDescription, strurl) {
	var strRepData = {};
	strRepData['strAccCurrency'] = $('#qpFromACMCurr').val();
	strRepData['strTxnCurrency'] = $('#qpTxnCurrency').val();
	strRepData['strAmount'] = $('#qpAmount').val();
	strRepData['strDrCrFlag'] = $('#qpDrCrFlag').val();
	strRepData['strAccountNo'] = $('#qpAccountNo').val();
	strRepData['strDrawer'] = $('#drawerCodeQuickPay').val();
	strRepData['strRecordRefNo'] = $('#qpRecordRefNo').val();
	strRepData['strRateType'] = $('#qpRateType').val();
	strRepData['strContractRefNo'] = $('#qpContractRefNo').val();
	strRepData['strValueDate'] = $('#qpValueDate').val();
	strRepData['strBankProduct'] = $('#qpBankProduct').val();
	strRepData['strMypProduct'] = $('#qpProduct').val();
	strRepData['bdFxRate'] = $('#qpFXRate').val();
	strRepData['strMypDescription'] = mypDescription;
	strRepData['strDetailRecordKey'] = $('#qpDetailRecordKey').val();
	strRepData['strParentRecordKey'] = $('#qpParentRecordKey').val();

	strRepData[csrfTokenName] = csrfTokenValue;
	$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
	$.ajax({
				type : 'POST',
				data : strRepData,
				url : strurl,
				async : false,
				success : function(data) {
					if (data.errorValueList != undefined
							&& data.errorValueList != null
							&& data.errorValueList.length != 0) {
						showErrorQuickPay(data.errorValueList);
					} else {
						showSuccessfulMsg();
						$('#quickPayProductsPopUp').dialog("close");
					}

				},
				error : function() {
				}
			});
}

function showSuccessfulMsg() {
	var refNo = $('#qpRecordRefNo').val();
	$('#successMsgPopupRefNo').dialog({
				autoOpen : true,
				height : 150,
				width : 350,
				modal : true,
				buttons : {
					"OK" : function() {
						$(this).dialog('close');
					}
				}
			});
	$('#successMsgPopupRefNo').dialog('open');
}

function showErrorQuickPay(errorValueList) {
	var errDiv = document.getElementById('errorDivQuickPayEntry');
	if (errDiv.childNodes[0] != null) {
		errDiv.removeChild(errDiv.childNodes[0]);
	}

	var newdiv = document.createElement('div');
	var newHtml = "<div id='messageArea' class='errors'><span>Error</span><ul>";
	for (var i = 0; i < errorValueList.length; i++) {
		newHtml = newHtml + "<li>" + errorValueList[i] + "</li>";
	}
	newHtml = newHtml + "</ul></div><br/>";
	newdiv.innerHTML = newHtml;
	errDiv.appendChild(newdiv);
}

function clearQuickPay() {
	$('#qpFromACMCurr').val('');
	$('#qpTxnCurrency').val('');
	$('#qpAmount').val('');
	$('#qpAccountNo').val('');
	$('#drawerCodeQuickPay').val('');
	$('#qpRecordRefNo').val('');
	$('#qpContractRefNo').val('');
	$('#qpValueDate').val('');
	$('#qpBankProduct').val('');
	$('#contractFXRateValueLabel').addClass("hidden");
	$('#qpAvailBalLabel').addClass("hidden");
	resetRateTypeInitialConditions();
}

function getChangePayAmntInfoQuickPay() {
	var strRepData = {};
	strRepData['strAccCurrency'] = $('#qpFromACMCurr').val();
	strRepData['strTxnCurrency'] = $('#qpTxnCurrency').val();
	strRepData['bdAmount'] = $('#qpAmount').val();

	strRepData['strRateType'] = $('#qpRateType').val();
	strRepData['strContractRefNo'] = $('#qpContractRefNo').val();

	strRepData['bdFxRate'] = $('#bdFxRate').val();

	strRepData[csrfTokenName] = csrfTokenValue;
	$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
	$.ajax({
				type : 'POST',
				data : strRepData,
				url : "getAmountForFxRate.rest",
				async : false,
				success : function(data) {
				},
				error : function() {
				}
			});
}

function addParameterValues(mypProduct) {
	document.getElementById('qpClnt').value = 'Q';
	document.getElementById('qpEntity').value = 'C';
	if ($('#qpDrCrFlag').val() == 'C') {
		document.getElementById('qpDrCrFlag').value = 'C';
	} else {
		document.getElementById('qpDrCrFlag').value = 'D';
	}

}

function doGetChangeTxnCCYInfo(mypProduct) {
	var strData = {};
	var strDrCrFlag = $('#qpDrCrFlag').val();
	var strTxnCurrency = $('#qpTxnCurrency').val();

	if ($('#qpFromACMCurr').val() == strTxnCurrency) {
		$('#qpRateType').attr('disabled', 'disabled');
		$("#rateTypeLabel").removeClass("required");
	} else {
		$('#qpRateType').removeAttr('disabled');
	}

}

jQuery.fn.showHideFXRate = function(action) {
	var mask = this.find('.loadFXRate');

	// Create the required mask

	if (!mask.length) {
		this.css({
					position : 'relative'
				});
		mask = $('<span class="loadFXRate"><a class="loadingImage" name="btnRefresh" id="btnRefresh" href="#"></a></span>');
		mask.css({
					position : 'absolute',
					top : '0px',
					left : '0px',
					opacity : '10%',
					background : 'transparent'
				}).appendTo(this);
	}

	if (!action || action === 'show') {
		mask.show();
	} else if (action === 'hideForSomeTime') {
		mask.hide();
	}

	return this;
};

function getDataForFXRate() {
	var strData = {};
	strData['strAccCurrency'] = $('#qpFromACMCurr').val();
	strData['strTxnCurrency'] = $('#qpTxnCurrency').val();
	strData['strAmount'] = $('#qpAmount').val();
	strData['bdFxRate'] = $('#qpFXRate').val();
	strData['strRateType'] = $('#qpRateType').val();
	strData['strContractRefNo'] = $('#qpContractRefNo').val();

	if ($('#qpRateType').val() == "0") {
		$('#btnRefreshDiv').showHideFXRate('show');
		$('#contractFXRateValueLabel').addClass("hidden");

		$.ajax({
					type : 'POST',
					data : strData,
					url : "getFxRateForQuickPay.rest",
					async : false,
					success : function(data) {
						$('#btnRefreshDiv').showHideFXRate('hideForSomeTime');
						$('#contractFXRateValueLabel').removeClass("hidden");
						var contractLabel = document
								.getElementById('contractFXRateValueLabel');
						contractLabel.innerHTML = data.accountCurrency + "/"
								+ data.txnCurrency + " " + data.fxInfo.fxRate;

					},
					error : function() {
					}
				});
	} else {
		var contractLabel = document.getElementById('contractFXRateValueLabel');
		contractLabel.innerHTML = $('#qpFromACMCurr').val() + "/"
				+ $('#qpTxnCurrency').val() + " " + $('#qpFXRate').val();
	}

}

function populateCurrencyList(currencyList, txnCurrency, mypProduct) {

	if (currencyList != undefined && currencyList != null) {
		$("#qpTxnCurrency option").each(function() {
					$(this).remove();
				});
		$("#qpTxnCurrency").append(new Option("select", ""));
		for (var cntr = 0; cntr < currencyList.length; cntr++) {
			$("#qpTxnCurrency").append(new Option(currencyList[cntr],
					currencyList[cntr]));
		}
		$("#qpTxnCurrency").bind("change", function() {
					doGetChangeTxnCCYInfo(mypProduct);
					resetRateTypeInitialConditions();
					enabledisableRateType();
				});

	}
	$('#qpTxnCurrency').val(txnCurrency);

}

function addNewBankProductsSeek(seekId) {
	var newDiv = document.getElementById('qpBankProductSeekLinkDiv');
	var selectHTML = "";
	selectHTML = '<a class ="linkbox seeklink" id="qpBankProductSeekLink" onclick="javascript:getHelpQuickSeek(\'qpBankProduct\',\''
			+ seekId
			+ '\',\'qpBankProduct_seek_first.seek\',\'product:qpProduct|currency:qpTxnCurrency\',\''
			+ callerIdQuickPay + '\',\'qpBankProduct\',\'3\');" href="#"></a>';
	newDiv.innerHTML = selectHTML;
}

function changeFields(cntrl) {
	var radioVal = cntrl.value;
	if (radioVal == 'D') {
		$('#sendAcc').addClass("hidden");
		$('#debitAcc').removeClass("hidden");

		$('#qpDrawer').addClass("hidden");
		$('#qpReciever').removeClass("hidden");

		document.getElementById('qpDrCrFlag').value = 'D';

		var mypProduct = $('#qpProduct').val();
		doGetChangeTxnCCYInfo(mypProduct);

		addNewBankProductsSeek(qpBankPrDebitSeekIDQuickPay);

	} else {
		$('#sendAcc').removeClass("hidden");
		$('#debitAcc').addClass("hidden");

		$('#qpDrawer').removeClass("hidden");
		$('#qpReciever').addClass("hidden");

		document.getElementById('qpDrCrFlag').value = 'C';

		var mypProduct = $('#qpProduct').val();
		doGetChangeTxnCCYInfo(mypProduct);

		addNewBankProductsSeek(qpBankPrCreditSeekIDQuickPay);
	}

}

function gotoQuickPayTemplatesPopUpView(mypProduct, mypDescription,
		quickPayTemplatesViewState, linkCountTemp) {
	var buttonsActionListPopUpOpts = {};
	var strurl = "saveQuickPayTemplates.rest";
	buttonsActionListPopUpOpts[btnsActionListPopUpArray['cancelPopUpBtn']] = function() {
		$(this).dialog("close");
	};
	buttonsActionListPopUpOpts[btnsActionListPopUpArray['submitPopUpBtn']] = function() {
		saveQuickPay(mypProduct, mypDescription, strurl);
	};
	$('#quickPayProductsPopUp').dialog({
				autoOpen : false,
				title : mypDescription,
				height : 425,
				width : 785,
				modal : true,
				buttons : buttonsActionListPopUpOpts,
				resizable : false,
				close : function() {
					$('#qpFXRate').val('');
					$('#qpClnt').val('');
					clearQuickPay();
				}

			});

	document.getElementById('qpProduct').value = mypProduct;
	removeErrorBoxForAction('qpAmount');

	var strRepData = {};
	strRepData['mypProduct'] = mypProduct;
	strRepData['mypDescription'] = mypDescription;
	strRepData['quickPayTemplatesViewState'] = quickPayTemplatesViewState;
	strRepData['linkCountTemp'] = linkCountTemp;
	strRepData[csrfTokenName] = csrfTokenValue;
	$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
	$.ajax({
		type : 'POST',
		data : strRepData,
		url : "showPopUpForQuickPayTemplates.rest",
		async : false,
		success : function(data) {
			populateCurrencyList(data.VALIDCURRENCIES, data.txnCurrency,
					data.mypProduct);
			addParameterValues(mypProduct);
			setValuesForTemplate(data);
			enabledisableRateType();
			addNewBenefeciarySeek(data.receiver);
			document.getElementById('qpDetailRecordKey').value = data.strDetailRecordKey;
			document.getElementById('qpParentRecordKey').value = data.strParentRecordKey;
			document.getElementById('qpMypBankBeneFlag').value = data.mypBankBeneFlag;
			document.getElementById('qpRestrictedBene').value = data.restrictedBene;

			$('#quickPayProductsPopUp').dialog("open");
		},
		error : function() {
		}
	});

};

function setValuesForTemplate(data) {
	$('#qpFromACMCurr').val(data.accountCurrency);
	$('#qpTxnCurrency').val(data.txnCurrency);
	$('#qpAmount').val(data.amount);
	$('#qpDrCrFlag').val(data.crDrFlag);
	$('#qpAccountNo').val(data.debitAccount);
	$('#drawerCodeQuickPay').val(data.receiver);
	$('#qpRecordRefNo').val(data.templreference);
	$('#qpRateType').val(data.ratetype);
	$('#qpContractRefNo').val(data.contractReference);
	$('#qpValueDate').val(data.valueDate);
	$('#qpBankProduct').val(data.bankProduct);
}

function gotoActionView(strUrl) {
	var frm = document.forms['actionlistform'];
	var subNavItem = $('.ft-sub-nav').find('a[href="' + strUrl + '"]').text();
	if(null==subNavItem || ""==subNavItem)
	{
		subNavItem = strUrl;
	}	
	var mainNavItem = Ext.isEmpty($('.ft-sub-nav').find("a:contains("
			+ subNavItem + ")").closest("ul").attr('data-subnavid'))
			? 'Home'
			: $('.ft-sub-nav').find("a:contains(" + subNavItem + ")")
					.closest("ul").attr('data-subnavid').substr(8);
	$.cookie('nav-addr', mainNavItem + "^" + subNavItem);
	frm.method = "POST";
	frm.action = strUrl;
	frm.submit();
};

function gotoActionViewExternal(url, name) {
	var myWindow;
	var strAttr;
	var intTop = (screen.availHeight - 300) / 2;
	var intLeft = (screen.availWidth - 600) / 2;
	strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=700,height=300";
	myWindow = window.open(url, name, strAttr);
};

function reportViewPopup(reportCode, reportName, callerIdRepParam) {

	document.getElementById('reportCode').value = reportCode;
	var strRepData = {};
	strRepData['reportCode'] = reportCode;
	strRepData[csrfTokenName] = csrfTokenValue;
	$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
	$.ajax({
				type : 'POST',
				data : strRepData,
				url : "showReportParameters.rest",
				success : function(data) {
					if (data != null) {
						getReportPopup(reportCode, data, callerIdRepParam,
								reportName);
					}
				}
			});
};

function reportView(reportCode, reportName, clientId, reportType,
		callerIdRepParam) {
	var me = this;
	form = document.createElement('FORM');
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';
	strUrl = "showGenerateReportParam.srvc";
	form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'reportCode',
			reportCode));
	form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'reportFileName',
			reportName));
	form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'clientCode',
			clientId));
	form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'srcType',
			reportType));
	if (clientId != null && clientId !='') 
	{
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 
			'channelName', 'CLIENT'));
	}
	form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName,
			csrfTokenValue));
	form.action = strUrl;
	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);
}

function getReportPopup(reportCode, data, callerIdRepParam, reportName) {
	var newerrdiv = document.createElement('div')
	newerrdiv.innerHTML = "<div id='errorbox'></div>";
	document.getElementById("favReportParameters").appendChild(newerrdiv);

	var buttonsRepOpts = {};
	buttonsRepOpts[btnsReportsArray['genRepBtn']] = function() {
		$(this).parent().hide();
		$.blockUI({
					message : 'Generating report...'
				});

		var list = document.getElementById("errorbox");
		if (list.childNodes[0] != null) {
			list.removeChild(list.childNodes[0]);
		}

		var errorresult = generateReport(data, reportCode);

		if (errorresult != '') {
			$(this).parent().show();
		}

		$.unblockUI();

		if (errorresult == '') {
			$(this).dialog("close");
			while (this.hasChildNodes()) {
				this.removeChild(this.lastChild);
			}
		} else {
			var newdiv = document.createElement('div')
			newdiv.innerHTML = "<div id='messageArea' class='errors'><span>"
					+ RepError + " </span>" + "<ul><li>" + errorresult
					+ "</li></ul></div><br/>";
			document.getElementById("errorbox").appendChild(newdiv);

			$(this).dialog("open");
		}
	};
	buttonsRepOpts[btnsReportsArray['cancelRepBtn']] = function() {
		$(this).dialog("close");
		while (this.hasChildNodes()) {
			this.removeChild(this.lastChild);
		}
	};

	$("#favReportParameters").dialog({
				title : "Generate Report [" + reportName + "]",
				autoOpen : false,
				height : 450,
				width : 473,
				modal : true,
				buttons : buttonsRepOpts,
				close : function() {
					while (this.hasChildNodes()) {
						this.removeChild(this.lastChild);
					}
				}
			});
	addReportFields(data, "favReportParameters", reportCode, callerIdRepParam);
	$("#favReportParameters").dialog("open");
}

function addReportFields(data, divName, reportCode, callerIdRepParam) {
	var record;
	var options = [["PDF", "1"], ["XLS", "8"], ["CSV", "32"]];

	for (var index = 0; index < data.reportParameter.length; index++) {
		var newdiv = document.createElement('div');
		record = data.reportParameter[index];
		if (record.value == null)
			record.value = '';
		switch (record.displayType) {
			case 0 :
				if (record.editable)
					newdiv.innerHTML = "<label class='frmLabel'>"
							+ record.description
							+ "</label><input type='text' id='" + record.code
							+ "' class='rounded  w8'  value=" + record.value
							+ "> <br>";
				else
					newdiv.innerHTML = "<label class='frmLabel'>"
							+ record.description
							+ "</label><input type='text' id='"
							+ record.code
							+ "' class='rounded  w8'  readonly='readonly' value="
							+ record.value + "> <br>";
				document.getElementById(divName).appendChild(newdiv);

				break;
			case 1 :
				if (record.editable)
					newdiv.innerHTML = "<label class='frmLabel'>"
							+ record.description + "</label><textArea id='"
							+ record.code
							+ "'  class='w8 amountBox rounded'  value="
							+ record.value + "> <br>";
				else
					newdiv.innerHTML = "<label class='frmLabel'>"
							+ record.description
							+ "</label><textArea id='"
							+ record.code
							+ "'  class='w8 amountBox rounded'  readonly='readonly' value="
							+ record.value + "> <br>";
				document.getElementById(divName).appendChild(newdiv);

				break;
			case 2 :
				if (record.editable)
					newdiv.innerHTML = "<label class='frmLabel'>"
							+ record.description
							+ "</label><input type='text' id='" + record.code
							+ "'  class='w8 amountBox rounded'  value="
							+ record.value + "> <br>";
				else
					newdiv.innerHTML = "<label class='frmLabel'>"
							+ record.description
							+ "</label><input type='text' id='"
							+ record.code
							+ "'  class='w8 amountBox rounded'  readonly='readonly' value="
							+ record.value + "> <br>";
				document.getElementById(divName).appendChild(newdiv);

				break;
			case 3 :
				if (record.editable)
					newdiv.innerHTML = "<label class='frmLabel'>"
							+ record.description
							+ "</label><input type='text' id='" + record.code
							+ "'  class='numberBox rounded  w8'  value="
							+ record.value + "> <br>";
				else
					newdiv.innerHTML = "<label class='frmLabel'>"
							+ record.description
							+ "</label><input type='text' id='"
							+ record.code
							+ "'  class='numberBox rounded  w8'  readonly='readonly' value="
							+ record.value + "> <br>";
				document.getElementById(divName).appendChild(newdiv);

				break;
			case 4 :
				var newDiv = document.createElement('div');
				var selectHTML = "";
				selectHTML = "<label class='frmLabel'>" + record.description
						+ "</label><select id='" + record.code
						+ "' class='comboBox w10 rounded'>";
				var keyvalpair = record.options;
				var optionsselect = keyvalpair[0];
				for (i = 0; i < optionsselect.length; i = i + 1) {
					selectHTML += "<option value='" + optionsselect[i].value
							+ "'>" + optionsselect[i].key + "</option>";
				}

				selectHTML += "</select>";
				newDiv.innerHTML = selectHTML;
				document.getElementById(divName).appendChild(newDiv);
				break;

			case 5 :
				var newDiv = document.createElement('div');
				var selectHTML = "";
				selectHTML = "<label class='frmLabel'>" + record.description
						+ "</label><select id='" + record.code
						+ "' class='comboBox w10 rounded'>";
				var keyvalpair = record.options;
				var optionsselect = keyvalpair[0];
				for (i = 0; i < optionsselect.length; i = i + 1) {
					selectHTML += "<option value='" + optionsselect[i].value
							+ "'>" + optionsselect[i].key + "</option>";
				}

				selectHTML += "</select>";
				newDiv.innerHTML = selectHTML;
				document.getElementById(divName).appendChild(newDiv);
				break;
			case 6 :
				if (record.editable) {
					newdiv.innerHTML = "<label class='frmLabel'>"
							+ record.description
							+ "</label><input type='text' id='"
							+ record.code
							+ "'  name='myDate' readonly='readonly' class='dateBox rounded  w8' value="
							+ record.value + "><br>";
				} else {
					newdiv.innerHTML = "<input type='hidden' id='"
							+ record.code
							+ "'  name='myDate' class='dateBox rounded  w8' value="
							+ record.value + ">";
					newdiv.visible = 'false';

				}
				document.getElementById(divName).appendChild(newdiv);
				$("#" + record.code).datepicker({
							dateFormat : datePickDateFormat,
							appendText : dateFormatText
						});
				break;
			case 7 :
				if (record.editable)
					newdiv.innerHTML = "<label class='frmLabel'>"
							+ record.description
							+ "</label><input type='text' id='" + record.code
							+ "'  class='timeBox rounded  w8'  value="
							+ record.value + "> <br>";
				else
					newdiv.innerHTML = "<label class='frmLabel'>"
							+ record.description
							+ "</label><input type='text' id='"
							+ record.code
							+ "'  class='timeBox rounded  w8'  readonly='readonly' value="
							+ record.value + "> <br>";
				document.getElementById(divName).appendChild(newdiv);

				break;
			case 8 :
				if (record.editable) {
					newdiv.innerHTML = "<label class='frmLabel'>"
							+ record.description
							+ "</label><input type='text' readonly='readonly' id='"
							+ record.code
							+ "'  class='rounded  w8' value="
							+ record.value
							+ ">&nbsp"
							+ '<a class ="linkbox seeklink" onclick="javascript:getHelpSeek(\''
							+ record.code
							+ '\',null,\'report_seek_first.seek\',\'rprepreport:'
							+ reportCode
							+ '\|rpparameter:'
							+ record.code
							+ '\',\''
							+ callerIdRepParam
							+ '\',\'report\',null,null,\'favReportList\');" href="#"></a>'
							+ "<br>";
				} else {
					newdiv.innerHTML = "<input type='hidden' id='"
							+ record.code + "'  class='rounded  w8'>";
					newdiv.visible = 'false';
				}

				document.getElementById(divName).appendChild(newdiv);

				break;
		}
	}
	var newDiv = document.createElement('div');
	var selectHTML = "";
	selectHTML = "<label class='frmLabel'>Report Format Type</label><select id='reportFormat' class='comboBox w10 rounded'>";
	for (i = 0; i < options.length; i = i + 1) {
		selectHTML += "<option value='" + options[i][1] + "'>" + options[i][0]
				+ "</option>";
	}
	selectHTML += "</select>";
	newDiv.innerHTML = selectHTML;
	document.getElementById(divName).appendChild(newDiv);
}

function generateReport(data, reportCode) {

	var strParamData = {};
	strParamData['reportCode'] = document.getElementById('reportCode').value;
	strParamData['reportFormat'] = document.getElementById('reportFormat').value;
	strParamData[csrfTokenName] = csrfTokenValue;
	for (var index = 0; index < data.reportParameter.length; index++) {
		record = data.reportParameter[index];
		var codeOfRec = data.reportParameter[index].code;
		var valueforcode = $("#" + record.code).val();
		strParamData[codeOfRec] = valueforcode;
	}
	var result = '';
	$.download('generateReport2.form', strParamData);
	return result;
}

function gotoQuickPayLink(mypProduct, mypbnkproduct, cntr, quickPayViewState,
		layout) {
	var subNavItem = $('.ft-sub-nav').find('a[href="paymentSummary.form"]')
			.text();
	var mainNavItem = Ext.isEmpty($('.ft-sub-nav').find("a:contains("
			+ subNavItem + ")").closest("ul").attr('data-subnavid'))
			? 'Home'
			: $('.ft-sub-nav').find("a:contains(" + subNavItem + ")")
					.closest("ul").attr('data-subnavid').substr(8);
	$.cookie('nav-addr', mainNavItem + "^" + subNavItem);
	document.getElementById("qpmyProduct").value = mypProduct;
	document.getElementById("txtLayout").value = layout;
	document.getElementById("txtCode").value = mypProduct;
	$("#txtMyProduct").val(mypProduct);
	if (mypbnkproduct.charAt(0) == "B") {
		document.getElementById("qpisBatch").value = '1';
		strUrl = "multiPaymentEntry.form";
	} else if (mypbnkproduct.charAt(0) == "Q" || mypbnkproduct.charAt(0) == "M") {
		document.getElementById("qpisBatch").value = '2';
		strUrl = "singlePaymentEntry.form";
	}

	document.getElementById("qppirMode").value = "LP";
	if (cntr != undefined)
		document.getElementById("qptxtCurrent").value = cntr;

	var quickPay_frm = document.forms["quickpaylistform"];
	var input_requesturl = document.createElement("input");
	input_requesturl.setAttribute("type", "hidden");
	input_requesturl.setAttribute("id", "qlinkTemp");
	input_requesturl.setAttribute("name", "qlinkTemp");
	input_requesturl.setAttribute("value", "true");

	var input_requesturl2 = document.createElement("input");
	input_requesturl2.setAttribute("type", "hidden");
	input_requesturl2.setAttribute("id", "qpviewState");
	input_requesturl2.setAttribute("name", "viewState");
	input_requesturl2.setAttribute("value", quickPayViewState);

	quickPay_frm.appendChild(input_requesturl);
	quickPay_frm.appendChild(input_requesturl2);

	quickPay_frm.action = strUrl;
	quickPay_frm.target = "";
	quickPay_frm.method = "POST";
	quickPay_frm.submit();
}

function updateManageCombo(favQuickPaylist) {
	var selLinks = document.getElementById('selectedLinks');
	var selectedParent = selLinks.parentNode;
	selectedParent.removeChild(selLinks);
	var newSelected = document.createElement('select');
	newSelected.options.length = 0;
	if (favQuickPaylist != undefined && favQuickPaylist.length != 0) {
		for (var cntr = 0; cntr < favQuickPaylist.length; cntr++) {
			var qpoption = document.createElement("option");
			qpoption.text = favQuickPaylist[cntr].mypDescription;
			qpoption.value = favQuickPaylist[cntr].mypProduct;
			newSelected.options.add(qpoption);
		}
	}
	newSelected.setAttribute('id', 'selectedLinks');
	newSelected.setAttribute('class', 'roundedCombo  w14 quickpaylist');
	newSelected.setAttribute('size', '10');
	selectedParent.appendChild(newSelected);
}

function updateManageComboForTemplates(prefferedQuickPayTemplatesList) {

	var selectLinks = document.getElementById('selectedQuickPayTemplates');
	var selectParent = selectLinks.parentNode;
	selectParent.removeChild(selectLinks);
	var newSelected = document.createElement('select');
	if (prefferedQuickPayTemplatesList != undefined
			&& prefferedQuickPayTemplatesList.length != 0) {
		for (var index = 0; index < prefferedQuickPayTemplatesList.length; index++) {
			var opt = document.createElement("option");
			opt.text = prefferedQuickPayTemplatesList[index].referenceNo;
			opt.value = prefferedQuickPayTemplatesList[index].internalRefNo;
			newSelected.options.add(opt);
		}
	}
	newSelected.setAttribute('id', 'selectedQuickPayTemplates');
	newSelected.setAttribute('class', 'roundedCombo  w14 quickpaylist');
	newSelected.setAttribute('size', '10');
	selectParent.appendChild(newSelected);
}

function cloneRecordTemplates(strUrl, cntr, quickPayTemplatesViewState,
		strRecordKeyNo, layout, mypUseFor,myProduct) {
	var frmTempl = document.forms["quickpaylistform"];
	var subNavItem = $('.ft-sub-nav').find('a[href="templateSummary.form"]')
			.text();
	var mainNavItem = Ext.isEmpty($('.ft-sub-nav').find("a:contains("
			+ subNavItem + ")").closest("ul").attr('data-subnavid'))
			? 'Home'
			: $('.ft-sub-nav').find("a:contains(" + subNavItem + ")")
					.closest("ul").attr('data-subnavid').substr(8);
	$.cookie('nav-addr', mainNavItem + "^" + subNavItem);
	document.getElementById("txtLayout").value = layout;
	document.getElementById("txtIdentifier").value = quickPayTemplatesViewState;
	document.getElementById("txtMyProduct").value = myProduct;
	if (cntr != undefined)
		document.getElementById("qptxtIndex").value = cntr;
	if ('B' == mypUseFor)
		strUrl = 'multiPaymentTemplateEntry.form';
	else if ('Q' == mypUseFor)
		strUrl = 'singlePaymentTemplateEntry.form';

	$('#quickpaylistform').find("#txtkey").val(strRecordKeyNo);

	var input_requesturl1 = document.createElement("input");
	input_requesturl1.setAttribute("type", "hidden");
	input_requesturl1.setAttribute("id", "txtEntryType");
	input_requesturl1.setAttribute("name", "txtEntryType");
	input_requesturl1.setAttribute("value", "PAYMENT");

	var input_requesturl = document.createElement("input");
	input_requesturl.setAttribute("type", "hidden");
	input_requesturl.setAttribute("id", "txtIdentifier");
	input_requesturl.setAttribute("name", "txtIdentifier");
	input_requesturl.setAttribute("value", quickPayTemplatesViewState);
	
	frmTempl.appendChild(input_requesturl);
	frmTempl.appendChild(input_requesturl1);

	frmTempl.action = strUrl;
	frmTempl.method = "POST";
	frmTempl.target = "";
	frmTempl.submit();
}

/*Side panel Quick Pay popup:start*/
function manageQuickPayPopup(strUrl, frmId) {
	$('#manageQuickPay').dialog({
				autoOpen : false,
				maxHeight : 550,
				minHeight : 156,
				width : 735,
				resizable : false,
				draggable : false,
				modal : true,
				dialogClass : 'ft-tab-bar',
				open : function(event, ui) {
					templateDataLoaded = false;
					$('#tabsQuickPay').tabs("option", "selected", 0);
					paintQuickPaySidePanelPopup("product");
				},
				close : function() {
					quickPayCancel();
					templateDataLoaded = false;
				}
			});
	$('#manageQuickPay').dialog("open");
}

function cancelQuickPaySidePanelPopup() {
	$('#manageQuickPay').dialog("close");
}

function saveQuickPayInSidePanel(strUrl) {
	var result = '';
	var strData = {};
	strData['selectedLinks'] = JSON.stringify(selectedProductsFromService);
	strData['selectedLinksForTemplates'] = JSON
			.stringify(selectedTemplatesFromService);
	strData[csrfTokenName] = csrfTokenValue;
	$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
	$.ajax({
		type : 'POST',
		async : false,
		data : strData,
		url : strUrl,
		success : function(data) {
			favQuickPaylist = data.PREFERRED_QUICKPAY_LIST;
			prefferedQuickPayTemplatesList = data.PREFERRED_QUICKPAYTEMPLATES_LIST;

			qpviewst = data.quickPayViewState;
			qpviewstTempl = data.quickPayTemplatesViewState;
			result = "success";

		},
		error : function() {
			var newdiv = document.createElement('div')
			newdiv.innerHTML = "<div id='messageArea' class='errors'><span>"
					+ quickPayError + " </span>" + "<ul><li>" + qperrorFail
					+ "</li></ul></div><br/>";

			var errDivProduct = document
					.getElementById('errDivManageQuickPayProduct');
			if (null != errDivProduct && errDivProduct.childNodes[0] != null) {
				errDivProduct.removeChild(errDivProduct.childNodes[0]);
				errDivProduct.appendChild(newdiv);
			}
			var errDivTemplate = document
					.getElementById('errDivManageQuickPayTemplate');
			if (null != errDivTemplate && errDivTemplate.childNodes[0] != null) {
				errDivTemplate.removeChild(errDivTemplate.childNodes[0]);
				errDivTemplate.appendChild(newdiv);
			}
		}
	});
	if (result == "success") {
		$("#manageQuickPay").dialog("close");
	}
}

function getQuickPaymentData() {
	var strData = {};
	strData['selectedLinks'] = JSON.stringify(selectedProductsFromService);
	strData['selectedLinksForTemplates'] = JSON
			.stringify(selectedTemplatesFromService);

	return strData;
}

function paintQuickPayQuickLinksSettingPopupTab(tabSelected) {
	var methodScreenUrl = 'services/paymentMethod.json';
	$.ajax({
		url : methodScreenUrl,
		success : function(data) {
			if (tabSelected == "product") {
				selectedProductsFromService.length = 0;
				tempSelectedProductInSidePanel.length = 0;
				selectedProductsFromService = selectedProductInSidePanel.slice();
				populateQuickPayCategoryHeaders(data, "#products", tabSelected);
				populateQuickPayCategoryBadges(data,
						"#productsQuickLinkBadges", tabSelected);
			} else if (tabSelected == "template") {
				selectedTemplatesFromService.length = 0;
				tempSelectedTemplateInSidePanel.length = 0;
				selectedTemplatesFromService = selectedTemplateInSidePanel.slice();
				populateQuickPayCategoryHeaders(data, "#templates", tabSelected);
				populateQuickPayCategoryBadges(data,
						"#templatesQuickLinkBadges", tabSelected);
			}
		}
	});
	setTimeout(function() { autoFocusOnFirstElement(null, 'products', true); }, 60);
}

function populateQuickPayCategoryHeaders(data, mainDiv, tabSelected) {
	if (!jQuery.isEmptyObject(data.d)
			&& !jQuery.isEmptyObject(data.d.instrumentType)) {
		var length = data.d.instrumentType.length;
		var list = $(mainDiv);
		list.empty();
		var horizontalDiv = document.createElement("div");
		horizontalDiv.setAttribute('style',
				'display:inline-flex; display:-ms-flexbox');
		list.append(horizontalDiv);

		for (var i = 0; i < length; i++) {
			var headerData = data.d.instrumentType[i];
			var description = headerData.instTypeDescription;
			var code = headerData.instTypeCode;

			var verticalDiv = document.createElement("div");
			if (i == 0)
				verticalDiv.setAttribute('class',
						'col-sm-4 quicklinks-column no-left-border');
			else
				verticalDiv.setAttribute('class', 'col-sm-4 quicklinks-column');
			//verticalDiv.setAttribute('style','min-width:150px');
			var h4 = document.createElement("h4");
			h4.textContent = description;
			verticalDiv.appendChild(h4);
			horizontalDiv.appendChild(verticalDiv);
			populateQuickPayCheckBoxes(verticalDiv, code, tabSelected);
		}

		if (tabSelected == 'product') {
			selectedProductsFromService.length = 0;
			selectedProductsFromService = tempSelectedProductInSidePanel.slice();
		} else if (tabSelected == 'template') {
			selectedTemplatesFromService.length = 0;;
			selectedTemplatesFromService = tempSelectedTemplateInSidePanel
					.slice();
		}

	} else {
		/*if (jQuery.isEmptyObject(data.d.beneCategories)
				&& !isEmpty($('#clientDescAutoCompleter').val())) {
			$(mainDiv).empty();
			$(pmtTypeDiv).empty();
			var errorMsg = getLabel('noClientDataError',
					'No Data Available for the moment.');
			paintErrorInSidePanelPopup('#quickProductSidePanelErrorDiv',
					'#quickProductSidePanelErrorMsg', errorMsg);
			paintErrorInSidePanelPopup('#quickTemplateInSidePanelErrorDiv',
					'#quickTemplateInSidePanelErrorMsg', errorMsg);
		}*/
	}
}

function populateQuickPayCategoryBadges(data, badgeDiv, tabSelected) {

	if (!jQuery.isEmptyObject(data.d)
			&& !jQuery.isEmptyObject(data.d.instrumentType)) {
		var length = data.d.instrumentType.length;
		var badgeList = $(badgeDiv);
		badgeList.empty();
		var ul = document.createElement("ul");
		ul.setAttribute('class', 'js-badge-container pull-left list-unstyled');

		for (var i = 0; i < length; i++) {
			var headerData = data.d.instrumentType[i];
			var description = headerData.instTypeDescription;
			var code = headerData.instTypeCode;
			createQuickPayCategoryBadgeList(code, ul, tabSelected);

		}
		badgeList.append(ul);

		var numOfBadges;
		if (tabSelected == 'product')
			numOfBadges = selectedProductsFromService.length;
		else if (tabSelected == 'template')
			numOfBadges = selectedTemplatesFromService.length;

		createQuickPayGhostBadges(numOfBadges, badgeList);
		var button = document.createElement("button");
		button.setAttribute('class',
				'clear-all-links');
		button.setAttribute('type', 'button');
		button.setAttribute('tabindex', '1');
		button.setAttribute('name', 'button');
		button.setAttribute("onClick", "clearAllQuickPayLinks('" + tabSelected
						+ "')");
		button.innerHTML += "Clear All Links";
		badgeList.append(button);
	} else {
		/*if (jQuery.isEmptyObject(data.d.beneCategories)
				&& !isEmpty($('#clientDescAutoCompleter').val())) {
			$(mainDiv).empty();
			$(pmtTypeDiv).empty();
			var errorMsg = getLabel('noClientDataError',
					'No Data Available for the moment.');
			paintErrorInSidePanelPopup('#quickProductSidePanelErrorDiv',
					'#quickProductSidePanelErrorMsg', errorMsg);
			paintErrorInSidePanelPopup('#quickTemplateInSidePanelErrorDiv',
					'#quickTemplateInSidePanelErrorMsg', errorMsg);
		}*/
	}
}

function clearAllQuickPayLinks(tabSelected) {
	var badgeList;
	var checkboxDiv;

	if (tabSelected == 'template') {
		badgeList = $('#templatesQuickLinkBadges');
		checkboxDiv = $('#templates');
	} else {
		badgeList = $('#productsQuickLinkBadges');
		checkboxDiv = $('#products');
	}

	var selectedCheckBoxes = checkboxDiv.find('input[type=checkbox]:checked')
			.each(function() {
						this.click();
					});

	badgeList.empty();
	createQuickPayGhostBadges(0, badgeList);
	var button = document.createElement("button");
	button.setAttribute('class', 'clear-all-links');
	button.setAttribute('type', 'button');
	button.setAttribute('name', 'button');
	button.setAttribute('tabindex', '1');
	button.setAttribute('onClick', "clearAllQuickPayLinks('" + tabSelected
					+ "')");
	button.innerHTML += "Clear All Links";
	badgeList.append(button);
}

function createQuickPayCategoryBadgeList(code, ul, tabSelected) {
	var filter;

	if (tabSelected == 'template') {
		if(code === 'ACH'){ 
			filter = "(PRODUCTTYPE eq 'ACH' or PRODUCTTYPE eq 'ACHM' or PRODUCTTYPE eq 'ACHD' or PRODUCTTYPE eq 'ACHC')"
		}
		else{
			filter = Ext.String.format("PRODUCTTYPE eq '{0}'", code);
		}
		populateQuickPayCategoryBadgeInList(code, ul, filter, tabSelected);
	} else {
		if(code === 'ACH'){ 
			filter = "(PRODUCTTYPE eq 'ACH' or PRODUCTTYPE eq 'ACHM' or PRODUCTTYPE eq 'ACHD' or PRODUCTTYPE eq 'ACHC')"
		}
		else{
			filter = Ext.String.format("PRODUCTTYPE eq '{0}'", code);
		}
		populateQuickPayCategoryBadgeInList(code, ul, filter, tabSelected);
	}
}

function populateQuickPayCategoryBadgeInList(code, ul, filter, tabSelected) {
	var data = fetchPaymentProductForSidePanel(filter, tabSelected);
	var selectedQuickPayArray;
	if (tabSelected == 'product')
		selectedQuickPayArray = selectedProductsFromService;
	else if (tabSelected == 'template')
		selectedQuickPayArray = selectedTemplatesFromService;
	var dataArray;
	var showEmptyMessageFlag = true;

	if (!Ext.isEmpty(data) && !Ext.isEmpty(data.d)) {
		dataArray = data.d.myproductsandtemplates;

		for (var i = 0; i < dataArray.length; i++) {
			isQuickPayTypePresent = ($.inArray(dataArray[i].myProduct,
					selectedQuickPayArray) != -1 ? true : false);
			if (isQuickPayTypePresent) {
				var li = document.createElement("li");
				var a = document.createElement("a");
				a.setAttribute('href', '#');
				a.setAttribute('class',
						'badges truncate-text');
				a.setAttribute('role', 'button');
				a.setAttribute('tabindex', '1');
				a.setAttribute('onClick', "quickPayBadgeClicked($(this),'"
								+ tabSelected + "',false)");
				a.setAttribute('value', dataArray[i].myProduct);
				// li.appendChild(a);
				var iEl = document.createElement("i");
				iEl.setAttribute('class', 'fa fa-times-circle');
				// li.appendChild(iEl);
				a.appendChild(iEl);
				var span = document.createElement("span");
				span.setAttribute('class', 't-filter-text');
				span.setAttribute('title', dataArray[i].myProductDescription);
				span.innerHTML += dataArray[i].myProductDescription;
				// iEl.appendChild(span);
				a.appendChild(span);
				li.appendChild(a);
				ul.appendChild(li);
			}
		}
		showEmptyMessageFlag = false;
	}
	/*if (showEmptyMessageFlag) {
		centreDiv.addClass("ft-content-font");
		centreDiv.append(Ext.String.format(
				"No Profiles created for the selected {0} Type.",
				tabSelected == 'template' ? 'Template' : 'Payment'));
	}*/

}

function populateQuickPayCheckBoxes(verticalDiv, code, tabSelected) {
	var filter;

	if (tabSelected == 'template') {
		if(code === 'ACH'){ 
			filter = "(PRODUCTTYPE eq 'ACH' or PRODUCTTYPE eq 'ACHM' or PRODUCTTYPE eq 'ACHD' or PRODUCTTYPE eq 'ACHC')"
		}
		else{
			filter = Ext.String.format("PRODUCTTYPE eq '{0}'", code);
		}
		quickPmtTypeCheckboxes(verticalDiv, code, filter, tabSelected);
	} else {
		if(code === 'ACH'){ 
			filter = "(PRODUCTTYPE eq 'ACH' or PRODUCTTYPE eq 'ACHM' or PRODUCTTYPE eq 'ACHD' or PRODUCTTYPE eq 'ACHC')"
		}
		else{
			filter = Ext.String.format("PRODUCTTYPE eq '{0}'", code);
		}
		quickPmtTypeCheckboxes(verticalDiv, code, filter, tabSelected);
	}
}

function quickPmtTypeCheckboxes(verticalDiv, instType, filter, tabSelected) {
	var data = fetchPaymentProductForSidePanel(filter, tabSelected);
	var selectedQuickPayArray;
	var tempSelectedQuickPayArray;

	if (tabSelected == 'product') {
		selectedQuickPayArray = selectedProductsFromService;
		tempSelectedQuickPayArray = tempSelectedProductInSidePanel;
	} else if (tabSelected == 'template') {
		selectedQuickPayArray = selectedTemplatesFromService;
		tempSelectedQuickPayArray = tempSelectedTemplateInSidePanel;
	}
	var dataArray;
	var showEmptyMessageFlag = true;
	if (!Ext.isEmpty(data) && !Ext.isEmpty(data.d)) {
		dataArray = data.d.myproductsandtemplates;
		var ul = document.createElement('ul');
		ul.setAttribute('class', 'list-unstyled');
		verticalDiv.appendChild(ul);
		var isQuickPayTypePresent = false;

		for (var i = 0; i < dataArray.length; i++) {
			isQuickPayTypePresent = ($.inArray(dataArray[i].myProduct,
					selectedQuickPayArray) != -1 ? true : false);
			var li = document.createElement("li");
			var checkBoxDiv = document.createElement("div");
			checkBoxDiv.setAttribute('class', 'checkbox');
			li.appendChild(checkBoxDiv);
			var label = document.createElement("label");
			if (dataArray[i].myProductDescription.length > 21) {
				label.setAttribute('class', 'truncate-text');
				label.setAttribute('title', dataArray[i].myProductDescription);
			}
			checkBoxDiv.appendChild(label);
			label.setAttribute('class', 'checkbox-inline');
			var input = document.createElement("input");
			input.setAttribute('type', 'checkbox');
			if (isQuickPayTypePresent) {
				input.setAttribute('checked', isQuickPayTypePresent);
				tempSelectedQuickPayArray.push(dataArray[i].myProduct);
			}
			input.setAttribute('tabindex', '1');
			input.setAttribute('code', dataArray[i].myProduct);
			input
					.setAttribute('description',
							dataArray[i].myProductDescription);
			input.setAttribute('onClick',
					"quickPmtTypeChildClickInSidePanel($(this),'" + tabSelected
							+ "')");
			label.appendChild(input);
			label.innerHTML += dataArray[i].myProductDescription;
			ul.appendChild(li);
			showEmptyMessageFlag = false;
		}
	}
	if (showEmptyMessageFlag) {
		/*centreDiv.addClass("ft-content-font");
		centreDiv.append(Ext.String.format(
			"No Profiles created for the selected {0} Type.",
			tabSelected == 'template' ? 'Template' : 'Payment'));*/
		verticalDiv.setAttribute('style','min-width:150px');
	}
}

function populateQuickPayCategoryInSidePanelPopup(data, mainDiv, pmtTypeDiv,
		tabId, tabSelected) {
	if (!jQuery.isEmptyObject(data)
			&& !jQuery.isEmptyObject(data.d)
			&& !jQuery.isEmptyObject(data.d.instrumentType)) {
		var length = data.d.instrumentType.length;
		var list = $(mainDiv);
		var anchor;
		list.empty();
		var tabDiv = document.createElement("div");
		tabDiv.setAttribute('class', 'ui-vertical-tab');
		tabDiv.setAttribute('id', tabId);
		var ul = document.createElement('ul');
		tabDiv.appendChild(ul);
		list.append(tabDiv);
		for (var i = 0; i < length; i++) {
			var anchorData = data.d.instrumentType[i];
			var description = anchorData.instTypeDescription;
			var code = anchorData.instTypeCode;
			var li = document.createElement("li");
			anchor = document.createElement("a");
			anchor.innerHTML = anchor.innerHTML + description;
			anchor.setAttribute("onClick",
					"quickPmtCategoryInSidePanelClick(this,'" + tabSelected
							+ "')");
			anchor.code = code;
			li.appendChild(anchor);
			ul.appendChild(li);
			if (i == 0)
				anchor.click();
		}

		var tabPanel = $("#" + tabId).tabs();
	} else {
		/*if (jQuery.isEmptyObject(data.d.beneCategories)
				&& !isEmpty($('#clientDescAutoCompleter').val())) {
			$(mainDiv).empty();
			$(pmtTypeDiv).empty();
			var errorMsg = getLabel('noClientDataError',
					'No Data Available for the moment.');
			paintErrorInSidePanelPopup('#quickProductSidePanelErrorDiv',
					'#quickProductSidePanelErrorMsg', errorMsg);
			paintErrorInSidePanelPopup('#quickTemplateInSidePanelErrorDiv',
					'#quickTemplateInSidePanelErrorMsg', errorMsg);
		}*/
	}
}
function quickPmtCategoryInSidePanelClick(selectedAnchor, tabSelected) {
	var filter;
	var allChilds = selectedAnchor.parentElement.parentElement.childNodes;
	for (var i = 0; i < allChilds.length; i++) {
		allChilds[i].className = '';
		var css = '<style id="pseudo">li::after{display: none !important;}</style>';
		allChilds[i].insertAdjacentHTML('beforeEnd', css);
		var child = document.getElementById("pseudo");
		if (child) {
			child.parentNode.removeChild(child);
		}
	}
	selectedAnchor.parentElement.className = 'ui-vertical-tabs-selected';
	var instType = selectedAnchor.code;
	if (tabSelected == 'template') {
		filter = Ext.String.format(
				"PRODTEMPTYPE eq '{0}' and PRODUCTCATEGORY eq '{1}' ", "T",
				instType);
		quickPmtTypeInSidePanelClick('#chooseTmptTypeFromSidePanel', instType,
				filter, tabSelected);
	} else {
		filter = Ext.String.format(
				"PRODTEMPTYPE eq '{0}' and PRODUCTCATEGORY eq '{1}' ", "P",
				instType);
		quickPmtTypeInSidePanelClick('#choosePmtTypeFromSidePanel', instType,
				filter, tabSelected);
	}
}
function quickPmtTypeInSidePanelClick(divCls, instType, filter, tabSelected) {
	var data = fetchPaymentProductForSidePanel(filter);
	var centreDiv = $(divCls);
	centreDiv.empty();
	var selectedQuickPayArray;
	if (tabSelected == 'product')
		selectedQuickPayArray = selectedProductsFromService;
	else if (tabSelected == 'template')
		selectedQuickPayArray = selectedTemplatesFromService;

	var dataArray;
	var showEmptyMessageFlag = true;
	if (!Ext.isEmpty(data.d)) {
		dataArray = data.d.myproductsandtemplates;
		var rowDiv;
		var childCountPerRow = 0;
		var firstRowCheck = true;
		var isQuickPayTypePresent = false;
		for (var i = 0; i < dataArray.length; i++) {
			if (dataArray[i].paymentType === 'M'
					|| dataArray[i].paymentType === 'Q') {
				if (childCountPerRow % 3 == 0 && firstRowCheck) {
					rowDiv = document.createElement("div");
					rowDiv.setAttribute('class', 'row form-group');
					centreDiv.append(rowDiv);
					firstRowCheck = false;
				}
				isQuickPayTypePresent = ($.inArray(dataArray[i].myProduct,
						selectedQuickPayArray) != -1 ? true : false);
				var ctrl = $('<input/>').attr({
					type : 'checkbox',
					checked : isQuickPayTypePresent,
					code : dataArray[i].myProduct,
					onClick : "quickPmtTypeChildClickInSidePanel($(this),'"
							+ tabSelected + "')"
				});
				var colDiv = $('<div>').attr({
							'class' : 'col-sm-4'
						}).appendTo(rowDiv);
				if (dataArray[i].myProductDescription.length > 21) {
					$('<label>').attr({
								'title' : dataArray[i].myProductDescription,
								'class' : 'checkbox-inline truncate-text'
							}).append(ctrl)
							.append(dataArray[i].myProductDescription)
							.appendTo(colDiv);
				} else {
					$('<label>').attr({
								'class' : 'checkbox-inline'
							}).append(ctrl)
							.append(dataArray[i].myProductDescription)
							.appendTo(colDiv);
				}
				firstRowCheck = true;
				childCountPerRow++;
				showEmptyMessageFlag = false;
			}
		}
	}
	/*if (showEmptyMessageFlag) {
		centreDiv.addClass("ft-content-font");
		centreDiv.append(Ext.String.format(
				"No Profiles created for the selected {0} Type.",
				tabSelected == 'template' ? 'Template' : 'Payment'));
	}*/
}
function fetchPaymentProductForSidePanel(filter, tabSelected) {
	var strUrl = 'services/paymentmyproduct.json?&$filter=' + filter;
	if(tabSelected == "template"){
		strUrl = 'services/paymenttemplate.json?&$filter=' + filter;
	}
	strUrl+='&$usefor=P&$multitxn=N';
	var responseData = null;
	$.ajax({
				url : strUrl,
				async : false,
				success : function(data) {
					responseData = data;
				}
			});
	return responseData;
}
function quickPmtTypeChildClickInSidePanel(selectedElement, tabSelected) {

	var selectedQuickPayArray;
	if (tabSelected == 'product')
		selectedQuickPayArray = selectedProductsFromService;
	else if (tabSelected == 'template')
		selectedQuickPayArray = selectedTemplatesFromService;
	var isChecked = selectedElement.prop("checked");
	var selectedElementProductCode = selectedElement.attr("code");
	var isPresentSelectedMessageType = ($.inArray(selectedElementProductCode,
			selectedQuickPayArray) != -1 ? true : false)
	if (isChecked) {
		if (selectedQuickPayArray.length >= 5) {
			selectedElement.attr("checked", false)
		} else {
			selectedQuickPayArray.push(selectedElementProductCode);
			addBadgeInQuickPayBadges(selectedElement, tabSelected,
					selectedQuickPayArray);
		}
	} else {
		if (isPresentSelectedMessageType) {
			selectedQuickPayArray.splice($.inArray(selectedElementProductCode,
							selectedQuickPayArray), 1);
			removeBadgeFromQuickPayBadges(selectedElement, tabSelected);
		}
	}
}

function removeBadgeFromQuickPayBadges(element, tabSelected) {
	var myProduct = element.attr('code');
	var myProductDescription = element.attr('description');
	var elementAreadyExists = $("[title='" + myProductDescription + "']");

	if (elementAreadyExists.length != 0)
		quickPayBadgeClicked(elementAreadyExists.parent(), tabSelected, true);
}

function addBadgeInQuickPayBadges(element, tabSelected, dataArray) {
	var badgeList;
	var badgeListElements;
	var myProduct = element.attr('code');
	var myProductDescription = element.attr('description');
	var elementAreadyExists = $("[title='" + myProductDescription + "']");

	if (tabSelected == 'product') {
		badgeList = $('#productsQuickLinkBadges');
	} else if (tabSelected == 'template') {
		badgeList = $('#templatesQuickLinkBadges');
	}

	var hasUl = badgeList.has('ul').length ? "Yes" : "No";
	if (hasUl == "No") {
		badgeList.empty();
		var ul = document.createElement("ul");
		ul.setAttribute('class', 'js-badge-container pull-left list-unstyled');
		badgeList.append(ul);
	}

	if (tabSelected == 'product') {
		badgeListElements = $('#productsQuickLinkBadges ul');
	} else if (tabSelected == 'template') {
		badgeListElements = $('#templatesQuickLinkBadges ul');
	}

	var li = document.createElement("li");
	var a = document.createElement("a");
	a.setAttribute('href', '#');
	a.setAttribute('class', 'badges truncate-text');
	a.setAttribute('role', 'button');
	a.setAttribute('onClick', "quickPayBadgeClicked($(this),'" + tabSelected
					+ "', false)");
	a.setAttribute('value', myProduct);
	var iEl = document.createElement("i");
	iEl.setAttribute('class', 'fa fa-times-circle');
	a.appendChild(iEl);
	var span = document.createElement("span");
	span.setAttribute('class', 't-filter-text');
	span.setAttribute('title', myProductDescription);
	span.innerHTML += myProductDescription;
	a.appendChild(span);
	li.appendChild(a);

	badgeListElements.append(li);
	badgeListElements.nextAll().remove();

	var numOfBadges = dataArray.length;
	createQuickPayGhostBadges(numOfBadges, badgeList);
	var button = document.createElement("button");
	button.setAttribute('class', 'clear-all-links');
	button.setAttribute('type', 'button');
	button.setAttribute('tabindex', '1');
	button.setAttribute('name', 'button');
	button.setAttribute("onClick", "clearAllQuickPayLinks('" + tabSelected
					+ "')");
	button.innerHTML += "Clear All Links";
	badgeList.append(button);
}

function quickPayBadgeClicked(selectedElement, tabSelected, onCheckboxClick) {

	var badgeList, badgeListSpan;
	var selectedElementCode = selectedElement.attr('value');
	if (tabSelected == 'product')
		badgeList = $('#productsQuickLinkBadges');
	else if (tabSelected == 'template')
		badgeList = $('#templatesQuickLinkBadges');

	if (onCheckboxClick == false) {
		$("[code=" + selectedElementCode + "]").prop("checked", false)
				.triggerHandler('click');
	} else if (onCheckboxClick == true) {
		var el = badgeList.find(selectedElement);
		el.parent().remove();
		if (tabSelected == 'product') {
			badgeListSpan = $('#productsQuickLinkBadges > span');
		} else if (tabSelected == 'template') {
			badgeListSpan = $('#templatesQuickLinkBadges > span');
		}

		if (badgeListSpan.length == 0) {
			var span = document.createElement("span");
			span
					.setAttribute('class',
							'js-ghost-badges badges-ghost-container');
			var div = document.createElement("div");
			div.setAttribute('class', 'badges-ghost');
			span.appendChild(div);
			badgeList.append(span);
		} else {
			var div = document.createElement("div");
			div.setAttribute('class', 'badges-ghost');
			badgeListSpan.append(div);
		}

	}
}

function paintErrorInSidePanelPopup(errorDiv, errorMsgDiv, errorMsg) {
	if (!$(errorDiv).is(':visible')) {
		$(errorDiv).removeClass('hide');
	}
	$(errorMsgDiv).empty();
	$(errorMsgDiv).text(errorMsg);
}
/*Side panel Quick Pay popup:End*/
function createNewPopUpLists(actionListNewSelected, actionListNewUnselected) {
	var errDiv = document.getElementById('errorDivActionList');
	if (errDiv.childNodes[0] != null) {
		errDiv.removeChild(errDiv.childNodes[0]);
	}

	if (actionListNewSelected != undefined
			&& actionListNewUnselected != undefined) {
		var cboFrom = document.getElementById('selectedActions');
		cboFrom.options.length = 0;

		for (var key in actionListNewSelected) {
			var opt1 = document.createElement("option");
			cboFrom.options.add(opt1);
			opt1.text = actionListNewSelected[key];
			opt1.value = key;
		}

		var cboTo = document.getElementById('availableActions');
		cboTo.options.length = 0;

		for (var key1 in actionListNewUnselected) {
			var opt2 = document.createElement("option");
			document.getElementById("availableActions").options.add(opt2);
			opt2.text = actionListNewUnselected[key1];
			opt2.value = key1;
		}
	} else if (actionListNewSelected == undefined
			&& actionListNewUnselected != undefined) {
		var cboFrom = document.getElementById('selectedActions');
		cboFrom.options.length = 0;

		var cboTo = document.getElementById('availableActions');
		cboTo.options.length = 0;

		for (var key1 in actionListNewUnselected) {
			var opt2 = document.createElement("option");
			document.getElementById("availableActions").options.add(opt2);
			opt2.text = actionListNewUnselected[key1];
			opt2.value = key1;
		}
	} else {
		userPreferenceCancelForActionList();
	}
}

function addSelectedOptions(cboFromID, cboToID) {
	removeErrorBoxForAction(cboFromID);
	var selectedListItems = $('select#' + cboToID + ' option');
	var availableSelectedListItems = checkSelectedCount(cboFromID);
	var total = selectedListItems.length + availableSelectedListItems;

	if (total > 5) {
		var msg = "Selection for more than 5 is not allowed!";
		showErrorforActionList(msg, cboFromID);
		return;
	}
	var cboFrom, cboTo;
	cboFrom = document.getElementById(cboFromID);
	cboTo = document.getElementById(cboToID);
	addRemoveOptions(cboFrom, cboTo);
}

function removeSelectedOptions(cboFromID, cboToID) {
	removeErrorBoxForAction(cboFromID);
	var cboFrom, cboTo;
	cboFrom = document.getElementById(cboFromID);
	cboTo = document.getElementById(cboToID);
	addRemoveOptions(cboTo, cboFrom);
}

function addRemoveOptions(cboFrom, cboTo) {
	var opt, optNew;
	// Add selected element to cboTo
	for (var i = 0; i < cboFrom.length; i++) {
		opt = cboFrom.options[i];
		if (opt.selected) {
			optNew = document.createElement('option');
			optNew.text = opt.text;
			optNew.value = opt.value;
			optNew.selected = true;
			cboTo.add(optNew, null);
		}
	}

	// Delete the selected element from cboFrom
	for (var i = cboFrom.length - 1; i >= 0; i--) {
		opt = cboFrom.options[i];
		if (opt.selected)
			cboFrom.remove(i);
	}
}

function addAllSelectedOptions(cboFromID, cboToID) {
	removeErrorBoxForAction(cboFromID);
	var selectedListItems = $('select#' + cboToID + ' option');
	var availableListItems = $('select#' + cboFromID + ' option');

	var total = availableListItems.length + selectedListItems.length;
	if (total > 5) {
		var msg = "Selection for more than 5 is not allowed!";
		showErrorforActionList(msg, cboFromID);
		return;
	}
	var cboFrom, cboTo;
	cboFrom = document.getElementById(cboFromID);
	cboTo = document.getElementById(cboToID);
	addRemoveAllOptions(cboFrom, cboTo);
}

function removeAllSelectedOptions(cboFromID, cboToID) {
	removeErrorBoxForAction(cboFromID);
	var cboFrom, cboTo;
	cboFrom = document.getElementById(cboFromID);
	cboTo = document.getElementById(cboToID);
	addRemoveAllOptions(cboTo, cboFrom);
}

function addRemoveAllOptions(cboFrom, cboTo) {
	var opt, optNew;
	// Add all element to cboTo
	for (var i = 0; i < cboFrom.length; i++) {
		opt = cboFrom.options[i];
		optNew = document.createElement('option');
		optNew.text = opt.text;
		optNew.value = opt.value;
		optNew.selected = true;
		cboTo.add(optNew, null);
	}
	// Delete the all element from cboFrom
	for (var i = cboFrom.length - 1; i >= 0; i--) {
		opt = cboFrom.options[i];
		cboFrom.remove(i);
	}
}

function moveSelectedOptions(direction, cboFromID) {
	removeErrorBoxForAction(cboFromID);
	var cboFrom = document.getElementById(cboFromID);
	var selectedIndex = cboFrom.selectedIndex;

	if (checkMultipleSelectionOptions(cboFromID)) {
		var msg = popUpErrorMsg;
		var divname = "divPopUpTable";
		showErrorforActionList(msg, cboFromID);
		return;
	}
	if (-1 == selectedIndex) {
		return;
	}

	var increment = -1;
	if (direction == 'up')
		increment = -1;
	else
		increment = 1;

	if ((selectedIndex + increment) < 0
			|| (selectedIndex + increment) > (cboFrom.options.length - 1)) {
		return;
	}
	var selValue = cboFrom.options[selectedIndex].value;
	var selText = cboFrom.options[selectedIndex].text;
	cboFrom.options[selectedIndex].value = cboFrom.options[selectedIndex
			+ increment].value;
	cboFrom.options[selectedIndex].text = cboFrom.options[selectedIndex
			+ increment].text;
	cboFrom.options[selectedIndex + increment].value = selValue;
	cboFrom.options[selectedIndex + increment].text = selText;
	cboFrom.selectedIndex = selectedIndex + increment;
}

function showErrorforActionList(msg, cboFromID) {
	var manageForm = document.getElementById(cboFromID).form;
	var newdiv = document.createElement('div');
	newdiv.innerHTML = "<div id='messageArea' class='errors'><span>" + Error
			+ "</span>" + "<ul><li>" + msg + "</li></ul></div><br/>";
	var formDivs = manageForm.getElementsByTagName("div");
	var errDiv;
	for (var index = 0; index < formDivs.length; index++) {
		if (formDivs[index].getAttribute('name') == 'errorboxAction') {
			errDiv = formDivs[index];
			break;
		}
	}
	errDiv.appendChild(newdiv);
}

function removeErrorBoxForAction(cboFromID) {
	var manageForm = document.getElementById(cboFromID).form;
	var formDivs = manageForm.getElementsByTagName("div");
	var errDiv;
	for (var index = 0; index < formDivs.length; index++) {
		if (formDivs[index].getAttribute('name') == 'errorboxAction') {
			errDiv = formDivs[index];
			break;
		}
	}
	if (errDiv.childNodes[0] != null) {
		errDiv.removeChild(errDiv.childNodes[0]);
	}
}
function handlePopUpErrors(errDivId, errMsg) {
	$("#" + errDivId).html("");
	$("#" + errDivId)
			.html("<div id='messageArea' class='errors'><span>" + Error
					+ "</span>" + "<ul><li>" + errMsg + "</li></ul></div><br/>");
}
function clearErrorDiv(errDivId) {
	if ($("#" + errDivId))
		$("#" + errDivId).html("");
}

function checkSelectedCount(cboFromID) {
	var cboFrom = document.getElementById(cboFromID);
	var cnt = 0;

	for (var i = 0, j = cboFrom.options.length; i < j; i++) {
		if (cboFrom.options[i].selected) {
			cnt++;
		}
	}
	return cnt;
}

function checkMultipleSelectionOptions(cboFromID) {
	var cboFrom = document.getElementById(cboFromID);
	var cnt = 0;
	for (var i = 0, j = cboFrom.options.length; i < j; i++) {
		if (cboFrom.options[i].selected) {
			cnt++;
		}
		if (cnt > 1) {
			return true;
		}
	}
	return false;
}

function moveTopBottomOptions(direction, cboFromID) {
	removeErrorBoxForAction(cboFromID);
	var cboFrom = document.getElementById(cboFromID);
	var selectedIndex = cboFrom.selectedIndex;

	if (checkMultipleSelectionOptions(cboFromID)) {
		var msg2 = popUpErrorMsg;
		showErrorforActionList(msg2, cboFromID);
		return;
	}

	if (-1 == selectedIndex) {
		return;
	}

	var increment = -1;
	if (direction == 'top')
		increment = 0;
	else
		increment = cboFrom.options.length - 1;

	var selValue = cboFrom.options[selectedIndex].value;
	var selText = cboFrom.options[selectedIndex].text;

	if (direction == 'top') {
		for (var i = selectedIndex; i >= 1; i--) {
			cboFrom.options[i].value = cboFrom.options[i - 1].value;
			cboFrom.options[i].text = cboFrom.options[i - 1].text;
		}
	} else {
		for (var i = selectedIndex; i < cboFrom.options.length - 1; i++) {
			cboFrom.options[i].value = cboFrom.options[i + 1].value;
			cboFrom.options[i].text = cboFrom.options[i + 1].text;
		}
	}

	cboFrom.options[increment].value = selValue;
	cboFrom.options[increment].text = selText;

	cboFrom.selectedIndex = increment;

}

function getReportsRecord(json, elementId, inputElementParameter) {
	var myJSONObject = JSON.parse(json);
	var inputIdArray = elementId.split("|");
	var parentInputId = document.getElementById("parentInputId");
	var tempValue = '';
	var isElementPresent;
	var isCommaPresent;
	var existElement;
	for (i = 0; i < inputIdArray.length; i++) {
		if (document.getElementById(inputIdArray[i])) {
			var type = document.getElementById(inputIdArray[i]).type;
			if (type == 'text') {
				document.getElementById(inputIdArray[i]).value = JSON
						.parse(myJSONObject).columns[0].value;
			} else {
				document.getElementById(inputIdArray[i]).innerHTML = JSON
						.parse(myJSONObject).columns[0].value;
			}
		}
	}
	if (parentInputId != null && parentInputId != undefined) {
		tempValue = inputElementParameter + ':'
				+ JSON.parse(myJSONObject).columns[0].value;
		var parentInputStr = parentInputId.value;
		isElementPresent = parentInputStr.search(inputElementParameter);
		if (isElementPresent != -1) {
			isCommaPresent = parentInputStr.indexOf(",");
			existElement = parentInputStr.substring(isElementPresent,
					isCommaPresent + 1);
			parentInputStr = parentInputStr.replace(existElement, '');
		}
		parentInputId.value = parentInputStr + tempValue + ',';
	}
}

function getQuickPayRecord(json, elementId) {
	var myJSONObject = JSON.parse(json);
	var inputIdArray = elementId.split("|");

	for (i = 0; i < inputIdArray.length; i++) {
		if (document.getElementById(inputIdArray[i])) {
			var type = document.getElementById(inputIdArray[i]).type;
			if (type == 'text' || type == 'hidden') {
				document.getElementById(inputIdArray[i]).value = JSON
						.parse(myJSONObject).columns[i].value;
			} else {
				document.getElementById(inputIdArray[i]).innerHTML = JSON
						.parse(myJSONObject).columns[i].value;
			}
		}
	}

	if (inputIdArray[0] == "qpAccountNo") {
		resetRateTypeInitialConditions();
		enabledisableRateType();
		$('#qpAvailBalLabel').removeClass("hidden");
		var availBalLabel = document.getElementById('qpAvailBalLabel');
		availBalLabel.innerHTML = "Available Balance:" + ""
				+ $('#qpAccountBalance').val();
	} else if (inputIdArray[0] == "qpBankProduct") {
		addNewBenefeciarySeek(inputIdArray[0].value);
	} else if (inputIdArray[0] == "qpContractRefNo") {
		var contractLabel = document.getElementById('contractFXRateValueLabel');
		contractLabel.innerHTML = $('#qpFromACMCurr').val() + "/"
				+ $('#qpTxnCurrency').val() + " " + $('#qpFXRate').val();
		$('#contractFXRateValueLabel').removeClass("hidden");
	}
}

function addNewBenefeciarySeek(bankProductValue) {
	var newDiv = document.getElementById('qpBeneficiarySeekLinkDiv');
	var selectHTML = "";

	var seekId = beneficiarySeekIdQuickPay;
	var qpMypBankBeneFlag = $('#qpMypBankBeneFlag').val();
	var qpRestrictedBene = $('#qpRestrictedBene').val();
	var qpProduct = $('#qpProduct').val();
	var qpBankProduct = $('#qpBankProduct').val();

	if (qpMypBankBeneFlag == 'Y') {
		seekId = systemBeneficiarySeekIdQuickPay;
	} else if (qpProduct != null && qpProduct != '' && qpRestrictedBene == 'Y') {
		seekId = myProductBeneficiarySeekIdQuickPay;
	} else if (qpBankProduct != null && qpBankProduct != ''
			&& qpBankProduct != undefined) {
		seekId = productBeneficiarySeekIdQuickPay;
	} else {
		seekId = beneficiarySeekIdQuickPay;
	}

	selectHTML = '<a class ="linkbox seeklink" id="qpBeneficiarySeek" onclick="javascript:getHelpQuickSeek(\'drawerCodeQuickPay\',\''
			+ seekId
			+ '\',\'qpbeneficiary_seek_first.seek\',\'bankProduct:qpBankProduct|product:qpProduct\',\''
			+ callerIdQuickPay + '\',\'qpbeneficiary\',\'2\');" href="#"></a>';
	newDiv.innerHTML = selectHTML;
}

function resetRateTypeInitialConditions() {
	$('#cntrctRef').attr("disabled", true);
	$('#rateTypeLabel').addClass("required");
	$('#qpRateType').val('0');
	$('#qpContractRefNo').val('');
	$('#qpContractRefNo').attr("disabled", true);
	$('#qpcontractratesSeekLink').hide();
	$('#cntrctRefLabel').removeClass("required");
}

function contractRateEnableDisable(cntrl) {
	var selectVal = cntrl.value;
	if (selectVal == "1") {
		$('#cntrctRef').removeAttr("disabled");
		$('#qpContractRefNo').removeAttr("disabled");
		$('#cntrctRefLabel').addClass("required");
		$('#qpcontractratesSeekLink').show();
		$('#contractFXRateValueLabel').addClass("hidden");
	} else {
		$('#cntrctRef').attr("disabled", true);
		$('#qpContractRefNo').attr("disabled", true);
		$('#cntrctRefLabel').removeClass("required");
		$('#qpcontractratesSeekLink').hide();
		getDataForFXRate();
		$('#qpContractRefNo').val('');
	}
}

function enabledisableRateType() {
	var strTxnCurrency = $('#qpTxnCurrency').val();
	if ($('#qpFromACMCurr').val() == strTxnCurrency) {
		$('#qpRateType').attr('disabled', 'disabled');
		$("#rateTypeLabel").removeClass("required");
		$("#contractFXRateValueLabel").addClass("hidden");
	} else {
		$('#qpRateType').removeAttr('disabled');
		getDataForFXRate();
		$("#contractFXRateValueLabel").removeClass("hidden");
	}
}

function quickSwitchClient(strUrl, index) {
	var frm = document.forms["frmQuickClient"];
	frm.elements["txtClientIndex"].value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function changedOnBehalf(strUrl, index) {
	var frm = document.forms["frmSwitchUser"];
	frm.elements["txtClientIndex"].value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function enableButton() {
	if (!isEmpty($('#clientID').val()) && !isEmpty($('#userID').val())) {
		$("#btnSubmit").attr('disabled', false);
	}
}
function quickSwitchUser(strUrl) {
	var frm = document.forms["frmSwitchUser"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function userEmulationOff(strUrl) {
	var frm = document.forms["frmSwitchUser"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function getRightMenuRecord(json, elementId, fnCallBack) {
	var myJSONObject = JSON.parse(json);
	var inputIdArray = elementId.split("|");
	var isValueExist = false;
	var optText = '', optValue = '';

	for (i = 0; i < inputIdArray.length; i++) {
		var field = inputIdArray[i];
		isValueExist = false;
		if (document.getElementById(inputIdArray[i])) {
			var type = document.getElementById(inputIdArray[i]).type;
			if (type == 'text') {
				document.getElementById(inputIdArray[i]).value = JSON
						.parse(myJSONObject).columns[0].value;
			} else {
				var opt = document.createElement("option");
				if ('selectedLinks' == inputIdArray[i]) {
					optText = JSON.parse(myJSONObject).columns[1].value;
					optValue = JSON.parse(myJSONObject).columns[0].value;
				} else {
					optText = JSON.parse(myJSONObject).columns[0].value;
					optValue = JSON.parse(myJSONObject).columns[1].value;
				}
				$('#' + inputIdArray[i] + ' option').each(function() {
							if (this.value == optValue) {
								isValueExist = true;
								return false;
							}
						});
				if (isValueExist) {
					if (fnCallBack && window[fnCallBack])
						window[fnCallBack](isValueExist);
					break;
				}
				opt.text = optText;
				opt.value = optValue;
				document.getElementById(inputIdArray[i]).options.add(opt);
			}
		}
	}
}
function preSwitchMode() {
	$.ajax({
				type : 'POST',
				url : "services/switchfromemulation.json",
				async : false,
				success : function(data) {

				},
				error : function() {
				}
			});
}

function saveAllQuickLinks() {
	var strActionData = {};
	var actionListJSON = getActionListData();
	var quickPaymentJSON = {};
	if(payEditRights == 'true')
		quickPaymentJSON = getQuickPaymentData();
	var messageFormsJSON = {};
	if(msgEditRights == 'true')
		messageFormsJSON = getMessageFormData();
	var quickReceivableJSON = {};
	if(colEditRights == 'true')
		quickReceivableJSON = getQuickReceivableData();

	strActionData[csrfTokenName] = csrfTokenValue;
	strActionData["actionListData"] = actionListJSON;
	strActionData["quickPaymentData"] = quickPaymentJSON["selectedLinks"];
	strActionData["quickTemplateData"] = quickPaymentJSON["selectedLinksForTemplates"];
	strActionData["messageFormData"] = messageFormsJSON["selectedItems"];
	strActionData["quickReceivableData"] = quickReceivableJSON["selectedLinks"];
	
	$(document).ajaxStart($.blockUI({message: '<div style="z-index: 1, position: absolute"><h2><img src="static/styles/Themes/t7-main/resources/images/T7/loading1.gif" class="middleAlign"/>&nbsp;Loading...</h2></div>',
		css:{  width:'400px',height:'64px',padding:'20px 0 0 0'}})).ajaxStop($.unblockUI);
	
	$.ajax({
		type : 'POST',
		async : false,
		data : strActionData,
		url : 'saveQuickLinkPref.rest',
		success : function(data) {
			actionListNew = data.ACTION_LIST;
			actionListNewSelected = data.selectedActionListForPopUp;
			actionListNewUnselected = data.unselectedActionListForPopUp;

			favQuickPaylist = data.PREFERRED_QUICKPAY_LIST;
			prefferedQuickPayTemplatesList = data.PREFERRED_QUICKPAYTEMPLATES_LIST;
			qpviewst = data.quickPayViewState;
			qpviewstTempl = data.quickPayTemplatesViewState;

			messageFormListNew = data.MESSAGEFORMS_FAV_LIST;

			$('#editQuickLinksPopup').dialog("close");
			window.location.reload();
		},
		error : function() {
			result = "error";
		}
	});
}

function resetEditQuickLinksPopup(){
	$('#actionListBadges').empty();
	$('#actionListContentDiv').empty();
	$('#productsQuickLinkBadges').empty();
	$('#templatesQuickLinkBadges').empty();
	$('#templates').empty();
	$('#products').empty();
	$('#messageFormBadges').empty();
	$('#chooseMsgCategoryFromSidePanel').empty();
	$('#quickReceivablesBadges').empty();
	$('#chooseReceivableCategoryFromSidePanel').empty();
	
	// Logic to by default open Action List
	if( $('#action-list').length > 0 && $('#action-list').find('i')[0].getAttribute('class') === 'fa fa-caret-down') {
		var element1 = $('#action-list').find('a')[0];
		$(element1).find("i").toggleClass('fa-caret-up fa-caret-down');
		var elementToExpandCollapse1 = element1.getAttribute('aria-controls');
		var areaToExpandCollapse1 = document.getElementById(elementToExpandCollapse1);
		$(areaToExpandCollapse1).slideToggle();
	}

	if( $('#quick-payment').length > 0 && $('#quick-payment').find('i')[0].getAttribute('class') === 'fa fa-caret-up') {
		var element2 = $('#quick-payment').find('a')[0];
		$(element2).find("i").toggleClass('fa-caret-up fa-caret-down');
		var elementToExpandCollapse2 = element2.getAttribute('aria-controls');
		var areaToExpandCollapse2 = document.getElementById(elementToExpandCollapse2);
		$(areaToExpandCollapse2).slideToggle();
	}

	if( $('#reports-list').length > 0 && $('#reports-list').find('i')[0].getAttribute('class') === 'fa fa-caret-up') {
		var element2 = $('#reports-list').find('a')[0];
		$(element2).find("i").toggleClass('fa-caret-up fa-caret-down');
		var elementToExpandCollapse2 = element2.getAttribute('aria-controls');
		var areaToExpandCollapse2 = document.getElementById(elementToExpandCollapse2);
		$(areaToExpandCollapse2).slideToggle();
	}	

	if( $('#message-forms').length > 0 && $('#message-forms').find('i')[0].getAttribute('class') === 'fa fa-caret-up') {
		var element3 = $('#message-forms').find('a')[0];
		$(element3).find("i").toggleClass('fa-caret-up fa-caret-down');
		var elementToExpandCollapse3 = element3.getAttribute('aria-controls');
		var areaToExpandCollapse3 = document.getElementById(elementToExpandCollapse3);
		//areaToExpandCollapse3.classList.toggle('collapse');
		$(areaToExpandCollapse3).slideToggle();
	}
	
	if( $('#quick-receivables').length > 0 && $('#quick-receivables').find('i')[0].getAttribute('class') === 'fa fa-caret-up') {
		var element4 = $('#quick-receivables').find('a')[0];
		$(element4).find("i").toggleClass('fa-caret-up fa-caret-down');
		var elementToExpandCollapse4 = element4.getAttribute('aria-controls');
		var areaToExpandCollapse4 = document.getElementById(elementToExpandCollapse4);
		$(areaToExpandCollapse4).slideToggle();
	}
	
	if(!$("#productsTabLeftPanel").hasClass('active')){
		$("#productsTabLeftPanel").toggleClass("active");
		$("#templatesTabLeftPanel").toggleClass("active");
		$('#templates').attr('style','display:none');
		$('#templatesQuickLinkBadges').attr('style','display:none');
		$('#products').attr('style','display:block');
		$('#productsQuickLinkBadges').attr('style','display:block');
	}
}

function getQuickReceivableData() {
	var strData = {};
	strData['selectedLinks'] = JSON.stringify(selectedRecProductsFromService);
	return strData;
}

function paintQuickReceivablesQuickLinksSettingPopupTab(){
	var strUrl = 'services/receivableMethod.json';
	    $.ajax({
	    	type : 'POST',
	        url: strUrl,
	        success: function(data) {
	        	selectedRecProductsFromService.length = 0;
				tempSelectedRecProductInSidePanel.length = 0;
				selectedRecProductsFromService = selectedRecProductInSidePanel.slice();
				populateQuickReceivablesCategoryInQuickLinksSettingPopup(data);
				populateQuickReceivablesBadges(data);
			
	        }
	    });	
	//var strUrl = "services/getMessageGroupsList.json?$client=" + strClient;
}

function populateQuickReceivablesCategoryInQuickLinksSettingPopup(response) {
	if (!jQuery.isEmptyObject(response)) {
		var data = response.d.instrumentType;
		data.sort(function(a, b) {
					if (a.instTypeDescription < b.instTypeDescription)
						return -1;
					if (a.instTypeDescription > b.instTypeDescription)
						return 1;
					return 0;
				});
		var length = data.length;
		var list = $("#chooseReceivableCategoryFromSidePanel");
		list.empty();
		var horizontalDiv = document.createElement("div");
		//horizontalDiv.setAttribute('class', 'row');
		horizontalDiv.setAttribute('style',
				'display:inline-flex; display:-ms-flexbox; overflow: hidden;');
		list.append(horizontalDiv);
		for (var i = 0; i < data.length; i++) {
			var headerData = data[i];
			var selectdFormGroup = headerData.instTypeCode;
			var verticalDiv = document.createElement("div");
			if (i == 0)
				verticalDiv.setAttribute('class',
						'col-sm-4 quicklinks-column no-left-border');
			else
				verticalDiv.setAttribute('class', 'col-sm-4 quicklinks-column');
			var h4 = document.createElement("h4");
			h4.textContent = headerData.instTypeDescription;
			verticalDiv.appendChild(h4);
			horizontalDiv.appendChild(verticalDiv);
			filterVal = Ext.String.format("PRODUCTCATEGORY eq '{0}' ",  selectdFormGroup);
			populateQuickReceivablesCheckBoxes(verticalDiv, filterVal);
		}
		selectedRecProductsFromService.length = 0;
		selectedRecProductsFromService = tempSelectedRecProductInSidePanel.slice();
	} /*else {
		if (jQuery.isEmptyObject(data)) {
			var errorMsg = getLabel('noClientDataError',
					'No Data Available for the moment.');
		}
	}*/
}

function populateQuickReceivablesBadges(response) {
	if (!jQuery.isEmptyObject(response)) {
		var data = response.d.instrumentType;
		data.sort(function(a, b) {
					if (a.filterValue < b.filterValue)
						return -1;
					if (a.filterValue > b.filterValue)
						return 1;
					return 0;
				});
		var badgeList = $("#quickReceivablesBadges");
		badgeList.empty();
		var ul = document.createElement("ul");
		ul.setAttribute('class', 'js-badge-container pull-left list-unstyled');
		for (var i = 0; i < data.length; i++) {
			var headerData = data[i];
			var selectdFormGroup = headerData.instTypeCode;
			filterVal = Ext.String.format("PRODUCTCATEGORY eq '{0}' ", selectdFormGroup);
			createQuickReceivablesBagesList(filterVal, ul);
		}
		badgeList.append(ul);

		var numOfBadges = selectedRecProductsFromService.length;
		createGhostBadges(numOfBadges, badgeList);
		var button = document.createElement("button");
		button.setAttribute('class',
				'clear-all-links');
		button.setAttribute('type', 'button');
		button.setAttribute('name', 'button');
		button.setAttribute('onClick', 'clearAllQuickReceivablesLinks()');
		button.innerHTML += "Clear All Links";
		badgeList.append(button);
	} /*else {
		if (jQuery.isEmptyObject(data)) {
			var errorMsg = getLabel('noClientDataError',
					'No Data Available for the moment.');
		}
	}*/
}

function populateQuickReceivablesCheckBoxes(verticalDiv, filterVal) {
	var data = fetchQuickReceivableTypeListSidePanel(filterVal);
	var tempSelectedQuickRecArray = tempSelectedRecProductInSidePanel;
	if (data && data.d && !jQuery.isEmptyObject(data.d.myproductsandtemplates)) {
		var dataArray = data.d.myproductsandtemplates;
		dataArray.sort(function(a, b) {
					if (a.myProductDescription < b.myProductDescription)
						return -1;
					if (a.myProductDescription > b.myProductDescription)
						return 1;
					return 0;
				});

		var isReceivableTypePresent = false;
		var ul = document.createElement('ul');
		ul.setAttribute('class', 'list-unstyled');
		verticalDiv.appendChild(ul);

		for (var i = 0; i < dataArray.length; i++) {
			isReceivableTypePresent = ($.inArray(dataArray[i].myProduct,
					selectedRecProductsFromService) != -1 ? true : false);
			var li = document.createElement("li");
			var checkBoxDiv = document.createElement("div");
			checkBoxDiv.setAttribute('class', 'checkbox');
			li.appendChild(checkBoxDiv);
			var label = document.createElement("label");
			checkBoxDiv.appendChild(label);
			var input = document.createElement("input");
			input.setAttribute('type', 'checkbox');
			input.setAttribute('name', dataArray[i].myProductDescription);
			if (isReceivableTypePresent) {
				input.setAttribute('checked', isReceivableTypePresent);
				tempSelectedQuickRecArray.push(dataArray[i].myProduct);
			}
			input.setAttribute('formRecordKey', dataArray[i].myProduct);
			input.setAttribute('formName', dataArray[i].myProductDescription);
			input.setAttribute('onClick',
					'quickReceivablesChildRadioClickSidePanel($(this))');
			label.appendChild(input);
			label.innerHTML += dataArray[i].myProductDescription;
			ul.appendChild(li);
		}
	}
}

function fetchQuickReceivableTypeListSidePanel(filter) {
	var strUrl = 'services/receivabletemplatesmyproduct.json'; 
    if(!isEmpty(filter))
   	 strUrl += '?$filter=' + filter;
   	 
	var strRegex = /[?&]([^=#]+)=([^&#]*)/g, objParam = {}, arrMatches, strGeneratedUrl;
		while (arrMatches = strRegex.exec(strUrl)) {
			objParam[arrMatches[1]] = arrMatches[2];
		}
		strGeneratedUrl = strUrl.substring(0, strUrl.indexOf('?'));
	strGeneratedUrl = !isEmpty(strGeneratedUrl)
			? strGeneratedUrl
			: strUrl;
	
    var responseData = null;
    $.ajax({
    	type : 'POST',
        url: strGeneratedUrl,
        data : objParam,
        async: false,
        success: function(data) {
            responseData = data;
        }
    });
    return responseData;
}

function createQuickReceivablesBagesList(filterVal, ul) {
	var data = fetchQuickReceivableTypeListSidePanel(filterVal);
	if (data && data.d && !jQuery.isEmptyObject(data.d.myproductsandtemplates)) {
		var dataArray = data.d.myproductsandtemplates;
		dataArray.sort(function(a, b) {
					if (a.myProductDescription < b.myProductDescription)
						return -1;
					if (a.myProductDescription > b.myProductDescription)
						return 1;
					return 0;
				});
		var isQuickReceivableTypePresent = false;

		for (var i = 0; i < dataArray.length; i++) {
			isQuickReceivableTypePresent = ($.inArray(dataArray[i].myProduct,
					selectedRecProductsFromService) != -1 ? true : false);
			if (isQuickReceivableTypePresent) {
				var li = document.createElement("li");
				var a = document.createElement("a");
				a.setAttribute('href', '#');
				a.setAttribute('class',
						'badges truncate-text');
				a.setAttribute('role', 'button');
				a.setAttribute('value', dataArray[i].myProduct);
				a.setAttribute('onClick',
						'quickReceivablesBadgeClicked($(this),false)');
				var iEl = document.createElement("i");
				iEl.setAttribute('class', 'fa fa-times-circle');
				a.appendChild(iEl);
				var span = document.createElement("span");
				span.setAttribute('class', 't-filter-text');
				span.setAttribute('title', dataArray[i].myProductDescription);
				span.innerHTML += dataArray[i].myProductDescription;
				a.appendChild(span);
				li.appendChild(a);
				ul.appendChild(li);
			}
		}
	}
}

function quickReceivablesBadgeClicked(element, onCheckboxClick) {
	var badgeList = $('#quickReceivablesBadges');
	var badgeListSpan = $('#quickReceivablesBadges > span');
	var selectedElementRecordNo = element.attr('value');
	if (onCheckboxClick == false) {
		$("[formrecordkey=" + selectedElementRecordNo + "]").prop('checked',
				false).triggerHandler('click');
	} else if (onCheckboxClick == true) {
		var el = badgeList.find(element);
		el.parent().remove();
		if (badgeListSpan.length == 0) {
			var span = document.createElement("span");
			span
					.setAttribute('class',
							'js-ghost-badges badges-ghost-container');
			var div = document.createElement("div");
			div.setAttribute('class', 'badges-ghost');
			span.appendChild(div);
			badgeList.append(span);
		} else {
			var div = document.createElement("div");
			div.setAttribute('class', 'badges-ghost');
			badgeListSpan.append(div);
		}
	}
}

function clearAllQuickReceivablesLinks() {
	var badgeList = $('#quickReceivablesBadges');
	var selectedCheckBoxes = $('#chooseReceivableCategoryFromSidePanel')
			.find('input[type=checkbox]:checked').each(function() {
						this.click();
					});

	badgeList.empty();
	createGhostBadges(0, badgeList);
	var button = document.createElement("button");
	button.setAttribute('class', 'clear-all-links');
	button.setAttribute('type', 'button');
	button.setAttribute('name', 'button');
	button.setAttribute('onClick', 'clearAllQuickReceivablesLinks()');
	button.innerHTML += "Clear All Links";
	badgeList.append(button);
}

function quickReceivablesChildRadioClickSidePanel(selectedElement) {
	var selectedQuickRecArray = selectedRecProductsFromService;
	var isChecked = selectedElement.prop("checked");
	var selectedElementProductCode = selectedElement.attr("formRecordKey");
	var isPresentSelectedMessageType = ($.inArray(selectedElementProductCode,
			selectedQuickRecArray) != -1 ? true : false)
	if (isChecked) {
		if (selectedQuickRecArray.length >= 5) {
			selectedElement.attr("checked", false)
		} else {
			selectedQuickRecArray.push(selectedElementProductCode);
			addBadgeInQuickReceivablesBadges(selectedElement,
					selectedQuickRecArray);
		}
	} else {
		if (isPresentSelectedMessageType) {
			selectedQuickRecArray.splice($.inArray(selectedElementProductCode,
					selectedQuickRecArray), 1);
			removeBadgeFromQuickReceivablesBadges(selectedElement);
		}
	}
}

function addBadgeInQuickReceivablesBadges(element, dataArray) {
	var badgeList = $('#quickReceivablesBadges');
	var formRecordKey = element.attr('formrecordkey');
	var formName = element.attr('formName');
	var elementAreadyExists = $("[title='" + formName + "']");
	var hasUl = badgeList.has('ul').length ? "Yes" : "No";
	if (hasUl == "No") {
		badgeList.empty();
		var ul = document.createElement("ul");
		ul.setAttribute('class', 'js-badge-container pull-left list-unstyled');
		badgeList.append(ul);
	}

	if (elementAreadyExists.length == 0) {
		var li = document.createElement("li");
		var a = document.createElement("a");
		a.setAttribute('href', '#');
		a.setAttribute('class', 'badges truncate-text');
		a.setAttribute('role', 'button');
		a.setAttribute('value', formRecordKey);
		a.setAttribute('onClick', 'quickReceivablesBadgeClicked($(this),false)');
		var iEl = document.createElement("i");
		iEl.setAttribute('class', 'fa fa-times-circle');
		a.appendChild(iEl);
		var span = document.createElement("span");
		span.setAttribute('class', 't-filter-text');
		span.setAttribute('title', formName);
		span.innerHTML += formName;
		a.appendChild(span);
		li.appendChild(a);
		$('#quickReceivablesBadges ul').append(li);
		$('#quickReceivablesBadges ul').nextAll().remove();
		var numOfBadges = dataArray.length;
		createGhostBadges(numOfBadges, badgeList);
		var button = document.createElement("button");
		button.setAttribute('class',
				'clear-all-links');
		button.setAttribute('type', 'button');
		button.setAttribute('name', 'button');
		button.setAttribute('onClick', 'clearAllQuickReceivablesLinks()');
		button.innerHTML += "Clear All Links";
		badgeList.append(button);
	}
}

function quickReceivablesBadgeClicked(element, onCheckboxClick) {
	var badgeList = $('#quickReceivablesBadges');
	var badgeListSpan = $('#quickReceivablesBadges > span');
	var selectedElementRecordNo = element.attr('value');
	if (onCheckboxClick == false) {
		$("[formrecordkey=" + selectedElementRecordNo + "]").prop('checked',
				false).triggerHandler('click');
	} else if (onCheckboxClick == true) {
		var el = badgeList.find(element);
		el.parent().remove();
		if (badgeListSpan.length == 0) {
			var span = document.createElement("span");
			span
					.setAttribute('class',
							'js-ghost-badges badges-ghost-container');
			var div = document.createElement("div");
			div.setAttribute('class', 'badges-ghost');
			span.appendChild(div);
			badgeList.append(span);
		} else {
			var div = document.createElement("div");
			div.setAttribute('class', 'badges-ghost');
			badgeListSpan.append(div);
		}
	}
}

function removeBadgeFromQuickReceivablesBadges(element) {
	var formRecordKey = element.attr('formrecordkey');
	var formName = element.attr('formName');
	var elementAreadyExists = $("[title='" + formName + "']");

	if (elementAreadyExists.length != 0)
		quickReceivablesBadgeClicked(elementAreadyExists.parent(), true);
}

function gotoQuickReceivablesLink(mypProduct, mypbnkproduct, cntr, quickPayViewState,
		layout){
	var form,inputField,strUrl = '',code = null,payUsing = 'P',productType = null,myProduct = null,layout = null,objRecePkgData,objReceCatData;
	code = mypProduct;
	payUsing = 'P';

	
	strUrl = 'batchReceivablesEntry.form';	
	
    form = document.createElement('FORM');
    form.name = 'frmMain';
    form.id = 'frmMain';
    form.method = 'POST';
   
    form.appendChild(createFormField('INPUT', 'HIDDEN',
        csrfTokenName, csrfTokenValue));
	if (!Ext.isEmpty(code)) {
        form.appendChild(createFormField('INPUT', 'HIDDEN', 'txtCode',
            code));
    }
    form.appendChild(createFormField('INPUT', 'HIDDEN', 'txtLayout',layout));
    form.appendChild(createFormField('INPUT', 'HIDDEN', 'txtPayUsing',
        payUsing));
    if (!Ext.isEmpty(productType)) {
        form.appendChild(createFormField('INPUT', 'HIDDEN',
            'txtPaymentMethod', productType));
    }
    form.appendChild(createFormField('INPUT', 'HIDDEN', 'txtEntryType',"RECEIVABLE"));
    form.action = strUrl;
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}

function getReportsRecordForDescription(json, elementId, inputElementParameter) {
	var myJSONObject = JSON.parse(json);
	var inputIdArray = elementId.split("|");
	var parentInputId = document.getElementById("parentInputId");
	var tempValue = '';
	var isElementPresent;
	var isCommaPresent;
	var existElement;
	for (i = 0; i < inputIdArray.length; i++) {
		if (document.getElementById(inputIdArray[i])) {
			var type = document.getElementById(inputIdArray[i]).type;
			if (type == 'hidden') {
				document.getElementById(inputIdArray[i]).value = JSON
						.parse(myJSONObject).columns[0].value;
				var strSplit = inputIdArray[0].split(".");
				var descId= strSplit[0]+".description";
				document.getElementById(descId).value = JSON
				.parse(myJSONObject).columns[1].value;
				
			} else {
				document.getElementById(inputIdArray[i]).innerHTML = JSON
						.parse(myJSONObject).columns[0].value;
			}
		}
	}
	if (parentInputId != null && parentInputId != undefined) {
		tempValue = inputElementParameter + ':'
				+ JSON.parse(myJSONObject).columns[0].value;
		var parentInputStr = parentInputId.value;
		isElementPresent = parentInputStr.search(inputElementParameter);
		if (isElementPresent != -1) {
			isCommaPresent = parentInputStr.indexOf(",");
			existElement = parentInputStr.substring(isElementPresent,
					isCommaPresent + 1);
			parentInputStr = parentInputStr.replace(existElement, '');
		}
		parentInputId.value = parentInputStr + tempValue + ',';
	}
}