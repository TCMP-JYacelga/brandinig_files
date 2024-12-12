var AGREEMENT_MST_COLUMNS = [ {
	"colId" : "agreementCode",
	"colDesc" : getLabel('agreementCode', 'Agreement Code'),
	"colHeader" : getLabel('agreementCode', 'Agreement Code'),
	"sortable" : true,
	"colSequence" : 1,
	"width" : 170,
	"locked" : false,
	"hidden" : false,
	"hideable" : false
}, {
	"colId" : "agreementName",
	"colDesc" : getLabel('agreementDesc', 'Agreement Name'),
	"colHeader" : getLabel('agreementDesc', 'Agreement Name'),
	"sortable" : true,
	"colSequence" : 2,
	"width" : 170,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "clientDescription",
	"colDesc" : getLabel('companyName', 'Company Name'),
	"colHeader" : getLabel('companyName', 'Company Name'),
	"sortable" : false,
	"colSequence" : 3,
	"width" : 170,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "structureTypeDesc",
	"colDesc" : getLabel('structureType', 'Structure Type'),
	"colHeader" : getLabel('structureType', 'Structure Type'),
	"sortable" : false,
	"colSequence" : 4,
	"width" : 170,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "startDate",
	"colDesc" : getLabel('startDate', 'Start Date'),
	"colHeader" : getLabel('startDate', 'Start Date'),
	"colType" : "date",
	"sortable" : true,
	"colSequence" : 5,
	"width" : 200,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "endDate",
	"colDesc" : getLabel('endDate', 'End Date'),
	"colHeader" : getLabel('endDate', 'End Date'),
	"colType" : "date",
	"sortable" : true,
	"colSequence" : 6,
	"width" : 200,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "requestStateDesc",
	"colDesc" : getLabel('status', 'Status'),
	"colHeader" : getLabel('status', 'Status'),
	"sortable" : true,
	"colSequence" : 7,
	"width" : 200,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
} ];

var arrStatus = [							
		{
		"code" : "0",
		"desc" : getLabel( 'lblNew', 'New' )
		},
		{
		"code" : "12",
		"desc" : getLabel( 'lblSubmitted', 'New Submitted' )
		},
		{
		"code" : "30",
		"desc" : getLabel( 'lblPendingSend', 'Pending Send' )
		} ,
		(entityType === '1')?{
		"code" : "31",
		"desc" : getLabel( 'lblSentToBank', 'Sent to bank' )
		}: {
			"code" : "34",
			"desc" : getLabel( 'lblPendingVerify', 'Pending Verify' )
			},
		{
		"code" : "32",
		"desc" : getLabel( 'lblActive', 'Active' )
		},
		{
		"code" : "33",
		"desc" : getLabel( 'lblVerifyRejected', 'Verify Rejected' )
		},
		
		{
		"code" : "7",
		"desc" : getLabel( 'lblNewRejected', 'New Rejected' )
		},
		{
		"code" : "1",
		"desc" : getLabel( 'lblModified', 'Modified' )
		},
		{
		"code" : "14",
		"desc" : getLabel( 'lblModifiedSubmitted', 'Modified Submitted' )
		},
		{
		"code" : "8",
		"desc" : getLabel( 'lblModifiedReject', 'Modified Rejected' )
		},
		{
		"code" : "5",
		"desc" : getLabel( 'lblSuspendRequest', 'Suspend Request' )
		},
		{
		"code" : "9",
		"desc" : getLabel( 'lblSuspendReqRejected', 'Suspend Request Rejected' )
		},
		{
		"code" : "11",
		"desc" : getLabel( 'lblDisabled', 'Suspended' )
		},
		{
		"code" : "4",
		"desc" : getLabel( 'lblEnableRequest', 'Enable Request' )
		},
		{
		"code" : "10",
		"desc" : getLabel( 'lblEnableReqRejected', 'Enable Request Rejected' )
		},
		{
		"code" : "6",
		"desc" : getLabel( 'lblExpired', 'Expired' )
		},
		{
		"code" : "13",
		"desc" : getLabel( 'lblPendingApproval', 'Pending My Approval' )
		}]
function showAgreementSweepTree(strUrl, record, rowIndex) {
	var strData = {};
	var viewState = record.get('viewState');
	strData['$viewState'] = viewState; // temporary
	strData[csrfTokenName] = csrfTokenValue;

	$.ajax({
		cache : false,
		data : strData,
		dataType : 'json',
		success : function(data) {
			if (null == data.AGREEMENT_SWEEP_ERROR_JSON){
				agreementCode = data.agreementCode;
				agreementName = data.agreementName;
				drawAgreementSweepTree(data.AGREEMENT_SWEEP_TREE_JSON, csrfTokenName, csrfTokenValue, viewState,
						data.TREEVIEW_TITLE);
			}
			else
				ajaxTreeError(data);
		},
		//error : ajaxError,
		url : strUrl,
		type : 'POST'
	});
}
function ajaxTreeError(data)
{
	var json = JSON.parse(data.AGREEMENT_SWEEP_ERROR_JSON);
	
	Ext.MessageBox.show(
	{
		title : getLabel( 'filterPopupTitle', 'Error' ),
		msg : json.error,
		buttons : Ext.MessageBox.OK,
		icon : Ext.MessageBox.ERROR
	} );
}

/* Removed 
 * drawAgreementSweepTree() and 
 * drawAgreementHybridTree() 
 * as they are present 
 * on agreementSweepTree.jspf */

function getAdvancedFilterPopup(strUrl, frmId) {
	$('#advancedFilterPopup').dialog({
		autoOpen : false,
		maxHeight : 620,
		minHeight : (screen.width) > 1024 ? 156 : 0,
		width : 840,
		dialogClass : 'ft-dialog',
		resizable : false,
		draggable : false,
		title : getLabel('advancefilter', 'Advanced Filter'),
		modal : true,
		open : function() {
			hideErrorPanel('#advancedFilterErrorDiv');
			$('#advancedFilterPopup').dialog('option', 'position', 'center');

		},
		focus : function() {

		},
		close : function() {
		}
	});
	$('#advancedFilterPopup').dialog("open");

}
var arrStructureType = [ {
	"key" : "all",
	"value" : getLabel('lblAll', 'ALL')
}, {
	"key" : "101",
	"value" : getLabel('lblSweep', 'Sweep')
}, {
	"key" : "201",
	"value" : getLabel('lblFlexible', 'Flexible')
}, {
	"key" : "501",
	"value" : getLabel('lblHybrid', 'Hybrid')
} ];
function populateAdvancedFilterFieldValue() {
	$(document).trigger("resetAllFieldsEvent");
	if (isClientUser() || (multipleSellersAvailable === false)) {
		$("#sellerAutocompleterDiv").hide();
	}
	else {
		sellerAutocompleter();
	}
	$("#dropdownCompany  option").remove();
	$("#dropdownAgreementName  option").remove();
	$("#dropdownStructureType option").remove();
	$("#dropdownChargeAccount option").remove();
	$("#dropdownAgreementCCY  option").remove();
	setCompanyMenuItems("#dropdownCompany");
	setAgreementNameMenuItems("#dropdownAgreementName");
	setParticipatingAccMenuItem("#dropDownParticipatingAcc");
	setStructureTypeMenuItems('#dropdownStructureType', arrStructureType);
	setChargeAccountMenuItems("#dropdownChargeAccount");
	setCCYMenuItems("#dropdownAgreementCCY");
	setDateDropDownMenu('entryDateDropDown');
	setDateDropDownMenu('originalDateDropDown');
	setDateDropDownMenu('startDateDropDown');
	setDateDropDownMenu('endDateDropDown');
	setSavedFilterComboItems('#msSavedFilter');
	$("#dropdownCompany").niceSelect();
	$("#dropdownStructureType").niceSelect();

}
function setSavedFilterComboItems(element) {
	$.ajax({
		url : 'services/userfilterslist/agreementMst.json',
		success : function(responseText) {
			if (responseText && responseText.d && responseText.d.filters) {
				$("#msSavedFilter option").remove();
				$(element).append('<option value=""> Select </option>');
				var responseData = responseText.d.filters;
				if (responseData.length > 0) {
					$.each(responseData, function(index, item) {
						$(element).append($('<option>', {
							value : responseData[index],
							text : responseData[index],
							selected : false
						}));
					});
				}
			}
			$(element).multiselect('refresh');
		}

	});
}
function sellerAutocompleter() {
	$('#sellerAutocomplete').autocomplete({
		minLength : 1,
		source : function(request, response) {
			$.ajax({
				url : 'services/userseek/sellerSeek.json',
				data : {
					$autofilter : request.term
				},
				success : function(responseText) {
					var responseData = responseText.d.preferences;
					response($.map(responseData, function(item) {
						return {
							value : item.CODE,
							label : item.DESCRIPTION
						}
					}));
				}
			});
		},
		select : function(event, ui) {
			strSellerDesc = ui.item.label;
			strSellerId = ui.item.value;
		},
		close : function(event, ui) {
			$("#sellerAutocomplete").val(strSellerDesc);
			resetValuesOnSellerChange();
		}
	});/*.val(strSellerId + ": " + strSellerDesc).data("autocomplete")._renderItem = function(ul, item) {
		var inner_html = '<a><ol class="t7-autocompleter">' + '<ul">' + item.label + '</ul></ol></a>';
		return $("<li></li>").data("item.autocomplete", item).append(inner_html).appendTo(ul);
	};*/
}
function resetValuesOnSellerChange() {
	if (!isEmpty(strSellerId)) var strUrl = Ext.String.format('services/swseller/{0}.json', strSellerId);
	$.ajax({
		url : strUrl,
		success : function(response) {
			setCompanyMenuItems("#dropdownCompany");
			$("#dropdownCompany").val($("#dropdownCompany option:first").val());
			$("#dropdownAgreementName").val("");
			setAgreementNameMenuItems("#dropdownAgreementName");
			$("#dropdownChargeAccount").val("");
			setChargeAccountMenuItems("#dropdownChargeAccount");
			$("#dropdownAgreementCCY").val("");
			setCCYMenuItems("#dropdownAgreementCCY");
			$("#dropDownParticipatingAcc").val("");
			setParticipatingAccMenuItem("#dropDownParticipatingAcc");
			

		}
	});
}
function setDateDropDownMenu(renderToElementId) {
	var DateText = "";
	if (renderToElementId === "entryDateDropDown")
		DateText = "Agreement Entry Date";
	else
		if (renderToElementId === "originalDateDropDown")
			DateText = "Original Start Date";
		else
			if (renderToElementId === "startDateDropDown")
				DateText = "Agreement Start Date";
			else
				if (renderToElementId === "endDateDropDown") DateText = "Agreement End Date";
	$('#' + renderToElementId).empty();
	var dropDownContainer = Ext.create('Ext.Container', {
		itemId : 'lbl' + renderToElementId,
		renderTo : renderToElementId,
		items : [ {
			xtype : 'label',
			forId : renderToElementId + "Label",
			text : getLabel(renderToElementId, DateText),
			listeners : {
				render : function(c) {
					Ext.create('Ext.tip.ToolTip', {
						target : c.getEl(),
						listeners : {
							beforeshow : function(tip) {
								if (renderToElementId === 'entryDateDropDown') {
									if (entry_date_opt === null) {
										tip.update(getLabel(renderToElementId, DateText));
									}
									else {
										tip.update(getLabel(renderToElementId, DateText) + entry_date_opt);
									}
								}
								else
									if (renderToElementId === 'originalDateDropDown') {
										if (original_date_opt === null) {
											tip.update(getLabel(renderToElementId, DateText));
										}
										else {
											tip.update(getLabel(renderToElementId, DateText) + original_date_opt);
										}
									}
									else
										if (renderToElementId === 'startDateDropDown') {
											if (start_date_opt === null) {
												tip.update(getLabel(renderToElementId, DateText));
											}
											else {
												tip.update(getLabel(renderToElementId, DateText) + start_date_opt);
											}
										}
										else
											if (renderToElementId === 'endDateDropDown') {
												if (end_date_opt === null) {
													tip.update(getLabel(renderToElementId, DateText));
												}
												else {
													tip.update(getLabel(renderToElementId, DateText) + end_date_opt);
												}
											}

							}
						}
					});
				}
			}
		}, {
			xtype : 'button',
			border : 0,
			itemId : 'agreementDateButton',
			cls : 'ui-caret-dropdown',
			listeners : {
				click : function(event) {
					var menus = '';
					if (renderToElementId === 'entryDateDropDown')
						menus = getDateDropDownItems("entryDate", this);
					else
						if (renderToElementId === 'originalDateDropDown')
							menus = getDateDropDownItems("originalDate", this);
						else
							if (renderToElementId === 'startDateDropDown')
								menus = getDateDropDownItems("startDate", this);
							else
								if (renderToElementId === 'endDateDropDown') menus = getDateDropDownItems("endDate", this);
					var xy = event.getXY();
					menus.showAt(xy[0], xy[1] + 16);
					event.menu = menus;
				}
			}
		} ]
	});
	return dropDownContainer;
}
function getDateDropDownItems(filterType, buttonIns) {
	var me = this;
	var intFilterDays = !Ext.isEmpty(filterDays) ? parseInt(filterDays,10) : '';

	var arrMenuItem = [];

	if (intFilterDays >= 1 || Ext.isEmpty(intFilterDays)) arrMenuItem.push({
		text : getLabel('today', 'Today'),
		btnId : 'btnToday',
		btnValue : '1',
		handler : function(btn, opts) {
			$(document).trigger("filterDateChange", [ filterType, btn, opts ]);
			updateToolTip(filterType, " (Today)");
		}
	});

	if (intFilterDays >= 2 || Ext.isEmpty(intFilterDays)) arrMenuItem.push({
		text : getLabel('yesterday', 'Yesterday'),
		btnId : 'btnYesterday',
		btnValue : '2',
		handler : function(btn, opts) {
			$(document).trigger("filterDateChange", [ filterType, btn, opts ]);
			updateToolTip(filterType, " (Yesterday)");
		}
	});

	if (intFilterDays >= 7 || Ext.isEmpty(intFilterDays)) arrMenuItem.push({
		text : getLabel('thisweek', 'This Week'),
		btnId : 'btnThisweek',
		btnValue : '3',
		handler : function(btn, opts) {
			$(document).trigger("filterDateChange", [ filterType, btn, opts ]);
			updateToolTip(filterType, " (This Week)");
		}
	});
	if (intFilterDays >= 14 || Ext.isEmpty(intFilterDays)) arrMenuItem.push({
		text : getLabel('lastweektodate', 'Last Week To Date'),
		btnId : 'btnLastweek',
		btnValue : '4',
		handler : function(btn, opts) {
			$(document).trigger("filterDateChange", [ filterType, btn, opts ]);
			updateToolTip(filterType, " (Last Week To Date)");
		}
	});
	if (intFilterDays >= 30 || Ext.isEmpty(intFilterDays)) arrMenuItem.push({
		text : getLabel('thismonth', 'This Month'),
		btnId : 'btnThismonth',
		btnValue : '5',
		handler : function(btn, opts) {
			$(document).trigger("filterDateChange", [ filterType, btn, opts ]);
			updateToolTip(filterType, " (This Month)");
		}
	});
	if (intFilterDays >= 60 || Ext.isEmpty(intFilterDays)) arrMenuItem.push({
		text : getLabel('lastMonthToDate', 'Last Month to date'),
		btnId : 'btnLastmonth',
		btnValue : '6',
		parent : me,
		handler : function(btn, opts) {
			//me.fireEvent('dateChange', btn, opts);
			$(document).trigger("filterDateChange", [ filterType, btn, opts ]);
			updateToolTip(filterType, " (Last Month to date)");
		}
	});
	if (Ext.isEmpty(intFilterDays)) arrMenuItem.push({
		text : getLabel('lastmonthonly', 'Last Month Only'),
		btnId : 'btnLastmonthonly',
		btnValue : '14',
		handler : function(btn, opts) {
			$(document).trigger("filterDateChange", [ filterType, btn, opts ]);
			updateToolTip(filterType, " (Last Month Only)");
		}
	});
	if (intFilterDays >= 90 || Ext.isEmpty(intFilterDays)) arrMenuItem.push({
		text : getLabel('thisquarter', 'This Quarter'),
		btnId : 'btnLastMonthToDate',
		btnValue : '8',
		handler : function(btn, opts) {
			$(document).trigger("filterDateChange", [ filterType, btn, opts ]);
			updateToolTip(filterType, " (This Quarter)");
		}
	});
	if (intFilterDays >= 180 || Ext.isEmpty(intFilterDays)) arrMenuItem.push({
		text : getLabel('lastQuarterToDate', 'Last Quarter To Date'),
		btnId : 'btnQuarterToDate',
		btnValue : '9',
		handler : function(btn, opts) {
			$(document).trigger("filterDateChange", [ filterType, btn, opts ]);
			updateToolTip(filterType, " (Last Quarter To Date)");
		}
	});
	if (intFilterDays >= 365 || Ext.isEmpty(intFilterDays)) arrMenuItem.push({
		text : getLabel('thisyear', 'This Year'),
		btnId : 'btnLastQuarterToDate',
		btnValue : '10',
		handler : function(btn, opts) {
			$(document).trigger("filterDateChange", [ filterType, btn, opts ]);
			updateToolTip(filterType, " (This Year)");
		}
	});
	if (intFilterDays >= 730 || Ext.isEmpty(intFilterDays)) arrMenuItem.push({
		text : getLabel('lastyeartodate', 'Last Year To Date'),
		btnId : 'btnYearToDate',
		btnValue : '11',
		handler : function(btn, opts) {
			$(document).trigger("filterDateChange", [ filterType, btn, opts ]);
			updateToolTip(filterType, " (Last Year To Date)");
		}
	});

	var dropdownMenu = Ext.create('Ext.menu.Menu', {
		itemId : 'DateMenu',
		cls : 'ext-dropdown-menu',
		items : arrMenuItem
	});

	return dropdownMenu;
}
function updateToolTip(filterType, date_option) {
	if (filterType === 'entryDate')
		entry_date_opt = date_option;
	else
		if (filterType === 'originalDate')
			original_date_opt = date_option;
		else
			if (filterType === 'startDate')
				start_date_opt = date_option;
			else
				if (filterType === 'endDate') end_date_opt = date_option;

}
function setCompanyMenuItems(elementId) {
	$.ajax({
		async : false,
		url : 'services/userseek/sweepClientCodeSeek.json?$filtercode1=' + strSellerId,
		success : function(responseText) {
			$("#dropdownCompany  option").remove();
			$("#dropdownCompany").niceSelect("destroy");
			var responseData = responseText.d.preferences;
			var defaultOpt = $('<option />', {
				value : "all",
				text : getLabel('allCompanies', 'All companies')
			});
			defaultOpt.appendTo(elementId);
			$.each(responseData, function(index, item) {
				$(elementId).append($('<option>', {
					value : responseData[index].CODE,
					text : responseData[index].DESCRIPTION
				}));
			});
			filterClientCount = $(elementId + " option").length;
			$(elementId).niceSelect();
		}

	});
}

function setParticipatingAccMenuItem(elementId){
	var strUrl = 'services/userseek/SweepMstParticipatedAccSeek.json';
	$(elementId).autocomplete(
			{
				minLength : 1,
				source : function(request, response) {
					$.ajax({
						url : strUrl,
						data : {
							$autofilter : request.term,
							$filtercode1 : (selectedFilterClient != 'all') ? selectedFilterClient : (entityType != 0) ? strClient : '%',
							$filtercode2: strSellerId
						},
						async : false,
						success : function(data) {
							if (isEmpty(data) || (isEmpty(data.d)) || data.d.preferences.length == 0) {
								var rec = [ {
									label : getLabel('suggestionBoxEmptyText', 'No match found..'),
									value : ""
								} ];
								response($.map(rec, function(item) {
									return {
										label : item.label,
										value : item.value
									}
								}));

							}
							else
								if (!isEmpty(data) && !(isEmpty(data.d))) {
									var rec1 = data.d.preferences;
									response($.map(rec1, function(item) {
										return {
											value : item.ACCT_NMBR,
											label : item.ACCT_NMBR
										}
									}));
								}
						}
					});
				}
			});/*.data("autocomplete")._renderItem = function(ul, item) {
		var inner_html = '<a><ol class="t7-autocompleter"><ul>' + item.label + '</ul></ol></a>';
		return $("<li></li>").data("item.autocomplete", item).append(inner_html).appendTo(ul);
	};*/
}

function setAgreementNameMenuItems(elementId) {
	var strUrl = ""
	if ((entityType === '0') && (Ext.isEmpty(selectedFilterClient) || selectedFilterClient === 'all')) {
		strUrl = 'services/userseek/sweepMstAgreementCodeSeekAll.json';
	}
	else {
		strUrl = 'services/userseek/sweepMstAgreementCodeSeek.json';
	}
	$(elementId).autocomplete(
			{
				minLength : 1,
				source : function(request, response) {
					$.ajax({
						url : strUrl,
						data : ((entityType === '0') && (Ext.isEmpty(selectedFilterClient) || selectedFilterClient === 'all')) ? {
							$autofilter : request.term,
							$filtercode1 : strSellerId
						} : {
							$autofilter : request.term,
							$filtercode1 : strSellerId,
							$filtercode2 : (Ext.isEmpty(selectedFilterClient) || selectedFilterClient === 'all') ? strClient
									: selectedFilterClient
						},
						async : false,
						success : function(data) {
							if (isEmpty(data) || (isEmpty(data.d)) || data.d.preferences.length == 0) {
								var rec = [ {
									label : getLabel('suggestionBoxEmptyText', 'No match found..'),
									value : ""
								} ];
								response($.map(rec, function(item) {
									return {
										label : item.label,
										value : item.value
									}
								}));

							}
							else
								if (!isEmpty(data) && !(isEmpty(data.d))) {
									var rec2 = data.d.preferences;
									response($.map(rec2, function(item) {
										return {
											value : item.DESCRIPTION,
											label : item.DESCRIPTION
										}
									}));
								}
						}
					});
				}
			});/*.data("autocomplete")._renderItem = function(ul, item) {
		var inner_html = '<a><ol class="t7-autocompleter"><ul>' + item.label + '</ul></ol></a>';
		return $("<li></li>").data("item.autocomplete", item).append(inner_html).appendTo(ul);
	};*/
}

function setCCYMenuItems(elementId) {
	$(elementId).autocomplete({
		minLength : 1,
		source : function(request, response) {
			$.ajax({
				url : 'services/userseek/sweepAgreementCurrencySeek.json',
				data : {
					$autofilter : request.term,
					$filtercode1 : (selectedFilterClient != 'all') ? selectedFilterClient : (entityType != 0) ? strClient : '%',
					$filtercode2: strSellerId
				},
				async : false,
				success : function(data) {
					if (isEmpty(data) || (isEmpty(data.d)) || data.d.preferences.length == 0) {
						var rec = [ {
							label : getLabel('suggestionBoxEmptyText', 'No match found..'),
							value : ""
						} ];
						response($.map(rec, function(item) {
							return {
								label : item.label,
								value : item.value
							}
						}));

					}
					else
						if (!isEmpty(data) && !(isEmpty(data.d))) {
							var recCCY = data.d.preferences;
							response($.map(recCCY, function(item) {
								return {
									value : item.CODE,
									label : item.CODE //+ ' : ' + item.DESCR
								}
							}));
						}
				}
			});
		}
	});/*.data("autocomplete")._renderItem = function(ul, item) {
		var inner_html = '<a><ol class="t7-autocompleter"><ul>' + item.label + '</ul></ol></a>';
		return $("<li></li>").data("item.autocomplete", item).append(inner_html).appendTo(ul);
	};*/
}
function setChargeAccountMenuItems(elementId) {
	$(elementId).autocomplete({
		minLength : 1,
		source : function(request, response) {
			$.ajax({
				url : 'services/userseek/sweepChargeAccountSeekFilter.json',
				data : {
					$autofilter : request.term,
					$filtercode1 : (selectedFilterClient != 'all') ? selectedFilterClient : (entityType != 0) ? strClient : '%',
					$filtercode2: strSellerId
				},
				async : false,
				success : function(data) {
					if (isEmpty(data) || (isEmpty(data.d)) || data.d.preferences.length == 0) {
						var recAcc = [ {
							label : getLabel('suggestionBoxEmptyText', 'No match found..'),
							value : ""
						} ];
						response($.map(recAcc, function(item) {
							return {
								label : item.label,
								value : item.value
							}
						}));

					}
					else
						if (!isEmpty(data) && !(isEmpty(data.d))) {
							var recChargeAcc = data.d.preferences;
							response($.map(recChargeAcc, function(item) {
								return {
									value : item.CODE,
									label : item.DISPLAYFIELD

								}
							}));
						}
				}
			});
		}
	});/*.data("autocomplete")._renderItem = function(ul, item) {
		var inner_html = '<a><ol class="t7-autocompleter"><ul>' + item.label + '</ul></ol></a>';
		return $("<li></li>").data("item.autocomplete", item).append(inner_html).appendTo(ul);
	};*/
}
function setStructureTypeMenuItems(elementId, arrStructureType) {
	for (var index = 0; index < arrStructureType.length; index++) {
		var opt = $('<option />', {
			value : arrStructureType[index].key,
			text : arrStructureType[index].value
		});
		opt.appendTo(elementId);
	}
	$("#dropdownStructureType").niceSelect();
}
function resetValuesOnClientChange() {
	selectedFilterClient = $("#dropdownCompany").val();
	if (!isEmpty(selectedFilterClient) && 'all' != selectedFilterClient)
		selectedFilterClientDesc = $("#dropdownCompany option:selected").text();
	else {
		selectedFilterClient = '';
		selectedFilterClientDesc = '';
	}
	setAgreementNameMenuItems("#dropdownAgreementName");

}

function getAdvancedFilterQueryJson() {
	var objJson = null;
	var jsonArray = [];

	//Client code
	var clientCodesData = $("select[id='dropdownCompany']").getMultiSelectValueString();
	var tempCodesData = clientCodesData;
	var selClientDesc = selectedFilterClientDesc;
	if (!Ext.isEmpty(tempCodesData)) {
		if (!Ext.isEmpty(filterClientCount)) {
			var clientCodeArray = clientCodesData.split(',');
			if (filterClientCount == clientCodeArray.length) tempCodesData = 'all';
		}
		if (tempCodesData != 'all' && selClientDesc != 'All companies') {
			jsonArray.push({
				field : 'clientCode',
				/* operator : 'in', */
				operator : tempCodesData.indexOf(',') === -1 ? 'eq' : 'in',
				value1 : tempCodesData,
				value2 : '',
				dataType : 0,
				/* displayType : 11,// 6, */
				displayType : tempCodesData.indexOf(',') === -1 ? 5 : 11,
				fieldLabel : getLabel('lblcompany', 'Company Name'),
				displayValue1 : selClientDesc
			});
		}
	}
	
	//Participating Account
	var participatingAcc = $("input[type='text'][id='dropDownParticipatingAcc']").val();
	if (!Ext.isEmpty(participatingAcc) && participatingAcc != '%') {
		jsonArray.push({
			field : 'participatingAccount',
			operator : 'lk',
			value1 : encodeURIComponent(participatingAcc.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
			value2 : '',
			dataType : 0,
			displayType : 8,// 4,
			fieldLabel : getLabel('participatingAcc', 'Participating Account'),
			displayValue1 : participatingAcc
		});
	}

	// Agreement Name
	var agreementName = $("input[type='text'][id='dropdownAgreementName']").val();
	if (!Ext.isEmpty(agreementName) && agreementName != '%') {
		jsonArray.push({
			field : 'agreementName',
			operator : 'lk',
			value1 : encodeURIComponent(agreementName.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
			value2 : '',
			dataType : 0,
			displayType : 8,// 4,
			fieldLabel : getLabel('agreementName', 'Agreement Name'),
			displayValue1 : agreementName
		});
	}

	//Structure type
	var dropdownStructureType = $("select[id='dropdownStructureType']").getMultiSelectValueString();
	var tempStructureType = dropdownStructureType;
	var selectedStructureType = null;
	if ($('#dropdownStructureType :selected')[0] != undefined)
		selectedStructureType = $('#dropdownStructureType :selected')[0].label;
	else
		selectedStructureType = $('#dropdownStructureType :selected');

	var filterStructureTypeCount = $("#dropdownStructureType option").length;
	if (!Ext.isEmpty(tempStructureType)) {
		if (!Ext.isEmpty(filterStructureTypeCount)) {
			var forecastTypeArray = dropdownStructureType.split(',');
			if (filterStructureTypeCount == forecastTypeArray.length) tempStructureType = 'all';
		}
		if (tempStructureType != 'all' && selectedStructureType != 'ALL') {
			jsonArray.push({
				field : 'structureType',
				/* operator : 'in', */
				operator : tempStructureType.indexOf(',') === -1 ? 'eq' : 'in',
				value1 : tempStructureType,
				value2 : '',
				dataType : 0,
				/* displayType : 11,// 6, */
				displayType : tempStructureType.indexOf(',') === -1 ? 5 : 11,
				fieldLabel : getLabel('lblStructureType', 'Structure Type'),
				displayValue1 : selectedStructureType
			});
		}
	}

	// Charge Account
	var dropdownChargeAccount = $("input[type='text'][id='dropdownChargeAccount']").val();
	if (!Ext.isEmpty(dropdownChargeAccount) && dropdownChargeAccount != '%') {
		jsonArray.push({
			field : 'chargeAccount',
			operator : 'lk',
			value1 : encodeURIComponent(dropdownChargeAccount.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
			value2 : '',
			dataType : 0,
			displayType : 8,// 4,
			fieldLabel : getLabel('lblChargeAccount', 'Charge Account'),
			displayValue1 : dropdownChargeAccount
		});
	}

	// Currency
	var dropdownAgreementCCY = $("input[type='text'][id='dropdownAgreementCCY']").val();
	if (!Ext.isEmpty(dropdownAgreementCCY) && dropdownAgreementCCY != '%') {
		jsonArray.push({
			field : 'agreementCurrency',
			operator : 'lk',
			value1 : encodeURIComponent(dropdownAgreementCCY.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
			value2 : '',
			dataType : 0,
			displayType : 8,// 4,
			fieldLabel : getLabel('lblCurrency', 'Agreement Currency'),
			displayValue1 : dropdownAgreementCCY
		});
	}

	// Entry Date	
	if (!jQuery.isEmptyObject(selectedEntryDate)) {
		var EntryVal1 = $.datepick.formatDate('yy-mm-dd', $.datepick
				.parseDate(strApplicationDateFormat, selectedEntryDate.fromDate));
		var EntryVal2 = '';
		if (!Ext.isEmpty(selectedEntryDate.toDate)) {
			EntryVal2 = $.datepick.formatDate('yy-mm-dd', $.datepick.parseDate(strApplicationDateFormat, selectedEntryDate.toDate));
		}
		jsonArray.push({
			field : 'entryDate',
			operator : selectedEntryDate.operator,
			value1 : EntryVal1,
			value2 : EntryVal2,
			dataType : 1,
			displayType : 6,// 5,
			fieldLabel : getLabel('lblAgreementDAte', 'Agreement Entry Date'),
			dropdownLabel : selectedEntryDate.dateLabel
		});
	}

	// Original Date	
	if (!jQuery.isEmptyObject(selectedOriginalDate)) {
		var originalVal1 = $.datepick.formatDate('yy-mm-dd', $.datepick.parseDate(strApplicationDateFormat, selectedOriginalDate.fromDate));
		var originalVal2 = '';
		if (!Ext.isEmpty(selectedOriginalDate.toDate)) {
			originalVal2 = $.datepick.formatDate('yy-mm-dd', $.datepick.parseDate(strApplicationDateFormat, selectedOriginalDate.toDate));
		}
		jsonArray.push({
			field : 'originalDate',
			operator : selectedOriginalDate.operator,
			value1 : originalVal1,
			value2 : originalVal2,
			dataType : 1,
			displayType : 6,// 5,
			fieldLabel : getLabel('lblAgreementDAte', 'Original Start Date'),
			dropdownLabel : selectedOriginalDate.dateLabel
		});
	}

	// Start Date	
	if (!jQuery.isEmptyObject(selectedStartDate)) {
		var startVal1 = $.datepick.formatDate('yy-mm-dd', $.datepick.parseDate(strApplicationDateFormat, selectedStartDate.fromDate));
		var startVal2 = '';
		if (!Ext.isEmpty(selectedStartDate.toDate)) {
			startVal2 = $.datepick.formatDate('yy-mm-dd', $.datepick.parseDate(strApplicationDateFormat, selectedStartDate.toDate));
		}
		jsonArray.push({
			field : 'startDate',
			operator : selectedStartDate.operator,
			value1 : startVal1,
			value2 : startVal2,
			dataType : 1,
			displayType : 6,// 5,
			fieldLabel : getLabel('lblAgreementDAte', 'Agreement Start Date'),
			dropdownLabel : selectedStartDate.dateLabel
		});
	}

	// End Date	
	if (!jQuery.isEmptyObject(selectedEndDate)) {
		var Val1 = $.datepick.formatDate('yy-mm-dd', $.datepick.parseDate(strApplicationDateFormat, selectedEndDate.fromDate));
		var Val2 = '';
		if (!Ext.isEmpty(selectedEndDate.toDate)) {
			Val2 = $.datepick.formatDate('yy-mm-dd', $.datepick.parseDate(strApplicationDateFormat, selectedEndDate.toDate));
		}
		jsonArray.push({
			field : 'endDate',
			operator : selectedEndDate.operator,
			value1 : Val1,
			value2 : Val2,
			dataType : 1,
			displayType : 6,// 5,
			fieldLabel : getLabel('lblAgreementDAte', 'Agreement End Date'),
			dropdownLabel : selectedEndDate.dateLabel
		});
	}
	objJson = jsonArray;
	return objJson;
}

function getAdvancedFilterValueJson(FilterCodeVal) {
	var objJson = null;
	var jsonArray = [];

	//Client code
	var clientCodesData = $("select[id='dropdownCompany']").getMultiSelectValueString();
	var tempCodesData = clientCodesData;
	var selClientDesc = selectedFilterClientDesc;
	if (!Ext.isEmpty(tempCodesData)) {
		if (!Ext.isEmpty(filterClientCount)) {
			var clientCodeArray = clientCodesData.split(',');
			if (filterClientCount == clientCodeArray.length) tempCodesData = 'all';
		}
		if (tempCodesData != 'all' && selClientDesc != 'All companies') {
			jsonArray.push({
				field : 'clientCode',
				/* operator : 'in', */
				operator : tempCodesData.indexOf(',') === -1 ? 'eq' : 'in',
				value1 : tempCodesData,
				value2 : '',
				dataType : 0,
				/* displayType : 11,// 6, */
				displayType : tempCodesData.indexOf(',') === -1 ? 5 : 11,
				fieldLabel : getLabel('lblcompany', 'Company Name'),
				displayValue1 : selClientDesc
			});
		}
	}
	
	//Participating Account
	var participatingAcc = $("input[type='text'][id='dropDownParticipatingAcc']").val();
	if (!Ext.isEmpty(participatingAcc) && participatingAcc != '%') {
		jsonArray.push({
			field : 'participatingAccount',
			operator : 'lk',
			value1 : encodeURIComponent(participatingAcc.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
			value2 : '',
			dataType : 0,
			displayType : 8,// 4,
			fieldLabel : getLabel('participatingAcc', 'Participating Account'),
			displayValue1 : participatingAcc
		});
	}

	// Agreement Name
	var agreementName = $("input[type='text'][id='dropdownAgreementName']").val();
	if (!Ext.isEmpty(agreementName) && agreementName != '%') {
		jsonArray.push({
			field : 'agreementName',
			operator : 'lk',
			value1 : encodeURIComponent(agreementName.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
			value2 : '',
			dataType : 0,
			displayType : 8,// 4,
			fieldLabel : getLabel('agreementName', 'Agreement Name'),
			displayValue1 : agreementName
		});
	}

	//Structure type
	var dropdownStructureType = $("select[id='dropdownStructureType']").getMultiSelectValueString();
	var tempStructureType = dropdownStructureType;
	var selectedStructureType = null;
	if ($('#dropdownStructureType :selected')[0] != undefined)
		selectedStructureType = $('#dropdownStructureType :selected')[0].label;
	else
		selectedStructureType = $('#dropdownStructureType :selected');

	var filterStructureTypeCount = $("#dropdownStructureType option").length;
	if (!Ext.isEmpty(tempStructureType)) {
		if (!Ext.isEmpty(filterStructureTypeCount)) {
			var forecastTypeArray = dropdownStructureType.split(',');
			if (filterStructureTypeCount == forecastTypeArray.length) tempStructureType = 'all';
		}
		if (tempStructureType != 'all' && selectedStructureType != 'ALL') {
			jsonArray.push({
				field : 'structureType',
				/* operator : 'in', */
				operator : tempStructureType.indexOf(',') === -1 ? 'eq' : 'in',
				value1 : tempStructureType,
				value2 : '',
				dataType : 0,
				/* displayType : 11,// 6, */
				displayType : tempStructureType.indexOf(',') === -1 ? 5 : 11,
				fieldLabel : getLabel('lblStructureType', 'Structure Type'),
				displayValue1 : selectedStructureType
			});
		}
	}

	// Charge Account
	var dropdownChargeAccount = $("input[type='text'][id='dropdownChargeAccount']").val();
	if (!Ext.isEmpty(dropdownChargeAccount) && dropdownChargeAccount != '%') {
		jsonArray.push({
			field : 'chargeAccount',
			operator : 'lk',
			value1 : encodeURIComponent(dropdownChargeAccount.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
			value2 : '',
			dataType : 0,
			displayType : 8,// 4,
			fieldLabel : getLabel('lblChargeAccount', 'Charge Account'),
			displayValue1 : dropdownChargeAccount
		});
	}

	// Currency
	var dropdownAgreementCCY = $("input[type='text'][id='dropdownAgreementCCY']").val();
	if (!Ext.isEmpty(dropdownAgreementCCY) && dropdownAgreementCCY != '%') {
		jsonArray.push({
			field : 'agreementCurrency',
			operator : 'lk',
			value1 : encodeURIComponent(dropdownAgreementCCY.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
			value2 : '',
			dataType : 0,
			displayType : 8,// 4,
			fieldLabel : getLabel('lblCurrency', 'Agreement Currency'),
			displayValue1 : dropdownAgreementCCY
		});
	}

	// Entry Date	
	if (!jQuery.isEmptyObject(selectedEntryDate)) {
		var EntryVal1 = $.datepick.formatDate('yy-mm-dd', $.datepick
				.parseDate(strApplicationDateFormat, selectedEntryDate.fromDate));
		var EntryVal2 = '';
		if (!Ext.isEmpty(selectedEntryDate.toDate)) {
			EntryVal2 = $.datepick.formatDate('yy-mm-dd', $.datepick.parseDate(strApplicationDateFormat, selectedEntryDate.toDate));
		}
		jsonArray.push({
			field : 'entryDate',
			operator : selectedEntryDate.operator,
			value1 : EntryVal1,
			value2 : EntryVal2,
			dataType : 1,
			displayType : 6,// 5,
			fieldLabel : getLabel('lblAgreementDAte', 'Agreement Entry Date'),
			dropdownLabel : selectedEntryDate.dateLabel
		});
	}

	// Original Date	
	if (!jQuery.isEmptyObject(selectedOriginalDate)) {
		var originalVal1 = $.datepick.formatDate('yy-mm-dd', $.datepick.parseDate(strApplicationDateFormat, selectedOriginalDate.fromDate));
		var originalVal2 = '';
		if (!Ext.isEmpty(selectedOriginalDate.toDate)) {
			originalVal2 = $.datepick.formatDate('yy-mm-dd', $.datepick.parseDate(strApplicationDateFormat, selectedOriginalDate.toDate));
		}
		jsonArray.push({
			field : 'originalDate',
			operator : selectedOriginalDate.operator,
			value1 : originalVal1,
			value2 : originalVal2,
			dataType : 1,
			displayType : 6,// 5,
			fieldLabel : getLabel('lblAgreementDAte', 'Original Start Date'),
			dropdownLabel : selectedOriginalDate.dateLabel
		});
	}

	// Start Date	
	if (!jQuery.isEmptyObject(selectedStartDate)) {
		var startVal1 = $.datepick.formatDate('yy-mm-dd', $.datepick.parseDate(strApplicationDateFormat, selectedStartDate.fromDate));
		var startVal2 = '';
		if (!Ext.isEmpty(selectedStartDate.toDate)) {
			startVal2 = $.datepick.formatDate('yy-mm-dd', $.datepick.parseDate(strApplicationDateFormat, selectedStartDate.toDate));
		}
		jsonArray.push({
			field : 'startDate',
			operator : selectedStartDate.operator,
			value1 : startVal1,
			value2 : startVal2,
			dataType : 1,
			displayType : 6,// 5,
			fieldLabel : getLabel('lblAgreementDAte', 'Agreement Start Date'),
			dropdownLabel : selectedStartDate.dateLabel
		});
	}

	// End Date	
	if (!jQuery.isEmptyObject(selectedEndDate)) {
		var Val1 = $.datepick.formatDate('yy-mm-dd', $.datepick.parseDate(strApplicationDateFormat, selectedEndDate.fromDate));
		var Val2 = '';
		if (!Ext.isEmpty(selectedEndDate.toDate)) {
			Val2 = $.datepick.formatDate('yy-mm-dd', $.datepick.parseDate(strApplicationDateFormat, selectedEndDate.toDate));
		}
		jsonArray.push({
			field : 'endDate',
			operator : selectedEndDate.operator,
			value1 : Val1,
			value2 : Val2,
			dataType : 1,
			displayType : 6,// 5,
			fieldLabel : getLabel('lblAgreementDAte', 'Agreement End Date'),
			dropdownLabel : selectedEndDate.dateLabel
		});
	}
	objJson = {};
	objJson.filterBy = jsonArray;
	if (FilterCodeVal && !Ext.isEmpty(FilterCodeVal)) objJson.filterCode = FilterCodeVal;

	return objJson;

}