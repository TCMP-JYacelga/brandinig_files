/* Summary : Client/Seller Dropdown functions are definition starts */
/* Global Variables Declaration */
var selectedFilterClientDesc = null;
var selectedFilterClient = null;
function initialSetupForSummaryScreenFilterPanel() {
	if (isClientUser()) {
		setSummaryClientDropDown();
	} else {
		$('#summaryClientFilter').autocomplete({
			minLength : 1,
			source : function(request, response) {
				$.ajax({
							url : 'services/userseek/userclients.json',
							data : {
								$autofilter : request.term
							},
							success : function(responseText) {
								var responseData = responseText.d.preferences;
								response($.map(responseData, function(item) {
											return {
												value : item.CODE,
												label : item.DESCR
											}
										}));
							}
						});
			},
			select : function(event, ui) {
				selectedFilterClientDesc = ui.item.label;
				selectedFilterClient = ui.item.value;
				// resetValuesOnClientChange();
			},
			close : function(event, ui) {
				$("#summaryClientFilter").val(selectedFilterClientDesc);
				// switchClient();
				changeSummaryClientDropDown();
			},
			change : function(event, ui) {
				if (ui && isEmpty(ui.item)) {
					selectedFilterClient = '';
					selectedFilterClientDesc = '';
					$(document).trigger("handleClientChangeInQuickFilter",
							false);
					// if ('undefined' != objSummaryView
					// && !isEmpty(objSummaryView))
					// objSummaryView.down("groupView").refreshData();
				}
			}
		});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="t7-autocompleter"><ul>'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/

		$('#summaryClientFilter').val(selectedFilterClientDesc);
		setSummarySellerDropDown();
	}
}
function handleResetSummaryClientFilter() {
	var strClientFilterVal = $("#summaryClientFilter").val();
	if (isEmpty(strClientFilterVal)) {
		resetClient();
		selectedFilterClient = '';
		selectedFilterClientDesc = '';
	}
	resetClient();
}
function updateFiltersText() {
	// $('#clientDescAutoCompleter').val(selectedClientDesc);
	$('#msClient').val(selectedClient);

}
function getSellerData() {
	var responseData = null;
	$.ajax({
				url : 'services/userseek/sellerSeek.json',
				async : false,
				success : function(responseText) {
					responseData = responseText.d.preferences;
				}
			});
	return responseData;
}
function getClientData() {
	var responseData = null;
	$.ajax({
				url : 'services/userseek/userclients.json&$sellerCode='
						+ strSeller,
				async : false,
				success : function(responseText) {
					responseData = responseText.d.preferences;
				}
			});
	return responseData;
}
function setSummarySellerDropDown() {
	var el = $("#summarySellerFilter");
	var data = getSellerData();
	var list = null, anchor = null;
	$("#summarySellerFilterSpan").text(strSeller);
	if (data) {
		$.each(data, function(index, item) {
					if (item && item.CODE && item.DESCRIPTION) {
						if (strSeller === item.CODE) {
							$("#summarySellerFilterSpan")
									.text(item.DESCRIPTION);
						}

						list = $("<li>");
						anchor = $("<a>").attr({
							"data-downloadExt" : item.CODE,
							href : "javascript:changeSellerAndRefreshGrid('"
									+ item.CODE + "','" + item.DESCRIPTION
									+ "')"
						}).text(item.DESCRIPTION).appendTo(list);
						list.appendTo(el);
					}

				});
		if (data.length < 2) {
			$("#summarySellerFilterSpan").text(strSeller);
			$("#summarySellerFilterDropdown .ft-dropdown-toggle").remove();
			$("#summarySellerFilterDropdown .ft-dropdown-menu").remove();
		}
	} else {

	}
}
function setSummaryClientDropDown() {
	var el = $("#summaryClientFilter");
	var data = getClientData();
	var list = null, anchor = null;
	if (data) {
		$.each(data, function(index, item) {
					if (item && item.CODE && item.DESCR) {
						if (strClient === item.CODE && isEmpty(strClientDesc)) {
							strClientDesc = item.DESCR;
						}

						list = $("<li>");
						anchor = $("<a>").attr({
							"data-downloadExt" : item.CODE,
							href : "javascript:changeClientAndRefreshGrid('"
									+ item.CODE + "','" + item.DESCR + "')"
						}).text(item.DESCR).appendTo(list);
						list.appendTo(el);
					}

				});

		if (data.length && data.length === 1) {
			$("#summaryClientFilterSpan").text(strClientDesc);
			$("#summaryClientFilterDropdown .ft-dropdown-toggle").remove();
			$("#summaryClientFilterDropdown .ft-dropdown-menu").remove();
			$('#clientDescAutoCompleter').attr('disabled', true);
		}
		// else
		// $("#summaryClientFilterMoreItems").removeClass("hidden");
	}
}
function changeSellerAndRefreshGrid(selectedSeller, selectedSellerDesc) {
	// sets global variable
	strSeller = selectedSeller;
	$("#summarySellerFilterSpan").text(selectedSellerDesc);
	changeSummaryClientDropDown(true);
}
function changeClientAndRefreshGrid(selectedClientCode,
		selectedClientDescription) {
	// sets global variable
	selectedFilterClient = selectedClientCode;
	selectedFilterClientDesc = selectedClientDescription;
	$("#summaryClientFilterSpan").text(selectedClientDescription);
	switchClient(selectedFilterClient);
	initPaymentSummaryScreen();
	$(document).trigger("handleClientChangeInQuickFilter", false);
	if (!isHidden('PIPELINE') && !isEmpty(strEntryType) && strEntryType==='PAYMENT') {
		$('#pipeLineDiv').show();
		generatePaymentPipeline();
		//mergeButtonBarToPipeLine(true);
	}
}
function changeSummaryClientDropDown(sellerChange) {
	var data = null;
	data = getClientData();
	if (data) {
		if (sellerChange) {
			selectedFilterClient = data[0].CODE;
			selectedFilterClientDesc = data[0].DESCR;
		}
		$("#summaryClientFilter").val(selectedFilterClientDesc);
		// switchClient();
		$(document).trigger("handleClientChangeInQuickFilter", false);
		// if ('undefined' != objSummaryView && !isEmpty(objSummaryView))
		// objSummaryView.down("groupView").refreshData();
	}
}
function resetClient() {
	$.ajax({
				url : 'services/swclient/_RESET.json',
				success : function(response) {

				}
			});
}
function switchClient(strClientId) {
	$.ajax({
				url : 'services/swclient/' + strClientId + '.json',
				success : function(response) {

				}
			});
}
function resetSessionClient() {

	var strPaymentInitiationClient = $('#clientDescAutoCompleter').val();
	if (isEmpty(strPaymentInitiationClient)) {
		resetClient();
		clearPaymentProducts();
		paintChoosePaymentMethodPopup(paymentType);
		paymentSelectionPageDisplay("method");
		$('#paymentMethodCheckbox').attr("checked", true);
		$('#clientDescAutoCompleter').val('');
	}
	// else
	// $("#clientDescAutoCompleter").val(selectedClientDesc);

}

/* Payment Summary : Client/Seller Dropdown functions are definition end here */