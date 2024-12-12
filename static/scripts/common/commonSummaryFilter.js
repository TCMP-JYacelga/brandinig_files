/* Summary : Client/Seller Dropdown functions are definition starts */
/* Global Variables Declaration */
var selectedFilterClientDesc = null;
var selectedFilterClient = null;
var _availableClients = null;
var strUrl =  null;
var strCommonUrl =  'services/userseek/userclients.json';
function initialSetupForSummaryScreenFilterPanel(isCorpFlag) {
	if(isCorpFlag)
	{
		strCommonUrl = 'services/userseek/customerRolesCorporation.json';
	}
	else
	{
		strCommonUrl = 'services/userseek/userclients.json';
	}
	if (isClientUser()) {
		setSummaryClientDropDown();
	} else {
		$('#summaryClientFilter').autocomplete({
			minLength : 1,
			source : function(request, response) {
				$.ajax({
							url : strCommonUrl,
							type:'POST',
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
				$(document).trigger("handleClientChangeInQuickFilter",
						false);
			},
			close : function(event, ui) {
				$("#summaryClientFilter").val(selectedFilterClientDesc);
				changeSummaryClientDropDown();
				selectedFilterClientDesc = "";

			},
			change : function(event, ui) {
				if (ui && isEmpty(ui.item)) {
					selectedFilterClient = '';
					selectedFilterClientDesc = '';
					$(document).trigger("handleClientChangeInQuickFilter",
							false);
				}
			},
			blur : function(event, ui) {
				if (ui && isEmpty(ui.item)) {
					selectedFilterClient = '';
					selectedFilterClientDesc = '';
				}
			}
		});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="t7-autocompleter"><ul>'
					+ item.label + '</ul></ol></a>';
			ul.addClass('summary_client_autocompleter');
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/

		$('#summaryClientFilter').val(selectedFilterClientDesc);
		//setSummarySellerDropDown();
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
function getClientData() {
	var responseData = null;
	$.ajax({
				//url : 'services/userseek/userclients.json',
				url : strCommonUrl,
				type:'POST',
				data:{
					$sellerCode:strSeller
				},
				async : false,
				success : function(responseText) {
					responseData = responseText.d.preferences;
				}
			});
	return responseData;
}
function setSummaryClientDropDown() {
	var el = $("#summaryClientFilter");
	var data = getClientData();
	_availableClients = data.length;
	var list = null, anchor = null;
	if (data) {
		$.each(data, function(index, item) {
					if (item && item.CODE && item.DESCR) {
						/*if (strClient === item.CODE && isEmpty(strClientDesc)) {
							strClientDesc = item.DESCR;
						}*/

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
			if (!isEmpty(data[0])) {
				var strClient = data[0].CODE;
				var strClientDesc = data[0].DESCR;
			}
			$("#summaryClientFilterSpan").text(strClientDesc);
			$("#summaryClientFilterSpan").val(strClient);
			$("#summaryClientFilterDropdown .ft-dropdown-toggle").remove();
			$("#summaryClientFilterDropdown .ft-dropdown-menu").remove();
			$("#summaryClientFilterDropdown").removeClass("ft-dropdown");
			$("#summaryClientFilterDropdown").css("display","inline-block");
			$('#clientDescAutoCompleter').attr('disabled', true);
		}
	}
}
function changeClientAndRefreshGrid(selectedClientCode,
		selectedClientDescription) {
	// sets global variable
	selectedFilterClient = selectedClientCode;
	selectedFilterClientDesc = selectedClientDescription;
	$("#summaryClientFilterSpan").text(selectedClientDescription);
	$(document).trigger("handleClientChangeInQuickFilter", false);
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
		$(document).trigger("handleClientChangeInQuickFilter", false);
	}
}
function resetClient() {
	$.ajax({
				url : 'services/swclient/_RESET.json',
				success : function(response) {

				}
			});
}
function switchClient(strClient) {
	$.ajax({
				url : 'services/swclient/'+strClient+'.json',
				success : function(response) {

				}
			});
}
/* Summary : Client/Seller Dropdown functions are definition end here */