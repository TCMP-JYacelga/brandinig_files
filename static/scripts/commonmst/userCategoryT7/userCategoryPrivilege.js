function privilegeGrid() {
	if (adminServiceEnable == true)
		sendRequestTo('previlige.json', '03', userCategory,
				'adminPrivilegesParentDiv');

	if (brServiceEnable == true) {
		sendRequestTo('previlige.json', '01', userCategory,
				'brPrivilegesParentDiv');
		sendRequestTo('accounts.json', '01', userCategory, 'tempBRAccounts');
	}
	if (payServiceEnable == true) {
		sendRequestTo('previlige.json', '02', userCategory,
				'paymentPrivilegesParentDiv');
		sendRequestTo('accounts.json', '02', userCategory,
				'tempPaymentAccounts');
	}
	if (depositServiceEnable == true) {
		sendRequestTo('previlige.json', '16', userCategory,
				'depositPrivilegesParentDiv');
		sendRequestTo('accounts.json', '16', userCategory,
				'tempDepositAccounts');
	}
	if (loanServiceEnable == true) {
		sendRequestTo('previlige.json', '07', userCategory,
				'loanPrivilegesParentDiv');
		sendRequestTo('accounts.json', '07', userCategory, 'tempLoansAccounts');
	}
	if (positivePayServiceEnable == true) {
		sendRequestTo('previlige.json', '13', userCategory,
				'positivePayPrivilegesParentDiv');
		sendRequestTo('accounts.json', '13', userCategory,
				'tempPositiveAccounts');
	}
	if (checkServiceEnable == true) {
		sendRequestTo('previlige.json', '14', userCategory,
				'checkMgmtPrivilegesParentDiv');
		sendRequestTo('accounts.json', '14', userCategory,
				'tempCheckManagementAccounts');
	}

}
function sendRequestTo(service, paramModule, paramCategoryId, appendGridToDiv) {
	$.ajax({
				url : "services/userCategory/" + service,
				type : "POST",
				dataType : "json",
				data : {
					module : paramModule,
					categoryId : paramCategoryId
				},
				success : function(response) {
					if (service === 'previlige.json') {
						var objData = response;
						paintPrivilegesTable(objData, appendGridToDiv);
					}
					if (service === 'accounts.json') {
						var objData = response.d.details;
						paintAccountsTable(objData, appendGridToDiv);
					}
				}
			});

}

function paintPrivilegesTable(objDataPrivilege, appendToDivId) {
	var blnVisible = false;
	for (var i in objDataPrivilege) {
		var val = objDataPrivilege[i];
		if ('Y' === val['canView'] || 'Y' === val['canEdit']
				|| 'Y' === val['canAuth']) {
			blnVisible = true;
			break;
		}
	}

	if (blnVisible) {
		$('#' + appendToDivId).empty();
		var divTable = $("<table>");
		$(divTable).addClass('view-grid').attr('style', 'width:100%');

		// title
		var objHeaderRow = $("<tr>");

		var objHeaderContent = $("<td>").attr('colspan', 4)
				.addClass('view-grid-section-header');
		$(objHeaderContent).text('Privileges');

		$(objHeaderContent).appendTo($(objHeaderRow));
		$(objHeaderRow).appendTo($(divTable));

		// header columns
		objHeaderRow = $("<tr>");
		$(objHeaderRow).addClass('view-grid-header');
		objHeaderContent = $("<td>");
		$(objHeaderContent).addClass('view-grid-header-text').text(getLabel(
				'type', 'Type'));
		$(objHeaderContent).appendTo($(objHeaderRow));
		objHeaderContent = $("<td>");
		if ("brPrivilegesParentDiv" == appendToDivId) {
			$(objHeaderContent).addClass('view-grid-header-text').attr('style',
			'width:60%;').text(getLabel('view', 'View'));
		}
		else{
			$(objHeaderContent).addClass('view-grid-header-text').attr('style',
				'width:20%;').text(getLabel('view', 'View'));
		}
		$(objHeaderContent).appendTo($(objHeaderRow));
		if ("brPrivilegesParentDiv" !== appendToDivId) {
			objHeaderContent = $("<td>");
			$(objHeaderContent).addClass('view-grid-header-text').attr('style',
					'width:20%;').text(getLabel('edit', 'Edit'));
			$(objHeaderContent).appendTo($(objHeaderRow));
			objHeaderContent = $("<td>");
			$(objHeaderContent).addClass('view-grid-header-text').attr('style',
					'width:20%;').text(getLabel('approval', 'Approval'));
			$(objHeaderContent).appendTo($(objHeaderRow));
		}
		$(objHeaderRow).appendTo($(divTable));

		// data columns
		for (var i in objDataPrivilege) {

			var val = objDataPrivilege[i];
			var strFeatureName = val['featureName'];
			var strCanView = val['canView'];
			var strCanEdit = val['canEdit'];
			var strCanAuth = val['canAuth'];
			if ('Y' === strCanView || 'Y' === strCanEdit || 'Y' === strCanAuth) {
				var objGridColumnDataRow = $("<div>");
				$(objGridColumnDataRow).addClass('row view-grid-body');
				objHeaderRow = $("<tr>");
				$(objHeaderRow).addClass('view-grid-body');

				objHeaderContent = $("<td>");
				$(objHeaderContent).addClass('view-grid-body-content')
						.text(strFeatureName);
				$(objHeaderContent).appendTo($(objHeaderRow));

				objHeaderContent = $("<td>");
				$(objHeaderContent).addClass('view-grid-body-content').attr(
						'style', 'width:15%;').html(strCanView === "Y"
						? '<i class="fa fa-check"></i>'
						: '');
				$(objHeaderContent).appendTo($(objHeaderRow));
				if ("brPrivilegesParentDiv" !== appendToDivId) {
					objHeaderContent = $("<td>");
					$(objHeaderContent).addClass('view-grid-body-content')
							.attr('style', 'width:15%;')
							.html(strCanEdit === "Y"
									? '<i class="fa fa-check"></i>'
									: '');
					$(objHeaderContent).appendTo($(objHeaderRow));
					objHeaderContent = $("<td>");
					$(objHeaderContent).addClass('view-grid-body-content')
							.attr('style', 'width:15%;')
							.html(strCanAuth === "Y"
									? '<i class="fa fa-check"></i>'
									: '');
					$(objHeaderContent).appendTo($(objHeaderRow));
				}
				$(objHeaderRow).appendTo($(divTable));
			}
		}

		$(divTable).appendTo($('#' + appendToDivId));
	} else {
		$('#' + appendToDivId).remove();
	}
}
function createColumnHeader(cssClass, text, appendToDiv) {
	var objGridHeaderCol = $("<div>");
	$(objGridHeaderCol).addClass(cssClass).text(text);
	$(objGridHeaderCol).appendTo(appendToDiv);
}

function AddCheckBox(appendToDiv) {
	var objGridDataCol = $("<div>");
	var objCheckIcon = $("<i>");
	$(objCheckIcon).addClass('fa fa-check');
	$(objCheckIcon).appendTo(objGridDataCol);
	$(objGridDataCol).addClass('col-sm-2 view-grid-body-content');
	$(objGridDataCol).appendTo(appendToDiv);
}
function AddEmptyDiv(objGridColumnDataRow) {
	var objGridDataCol = $("<div>");
	$(objGridDataCol).addClass('col-sm-2 view-grid-body-content');
	$(objGridDataCol).appendTo(objGridColumnDataRow);
}
function toggleSection(cursorId, panelId) {
	$("#" + cursorId).click(function() {
				$('#' + cursorId).toggleClass("fa-caret-up fa-caret-down");
				$('#' + panelId).toggle();
				return false;
			});
}
function paintAccountsTable(objDataAccounts, appendToDivId) {
	var NoRec = 1;
	for (var i in objDataAccounts) {
		var val = objDataAccounts[i];
		if (val['assigned'] === "true") {
			NoRec = 0;
			break;
		}
	}
	if (NoRec === 0) {
		var divTable = $("<table>");
		$(divTable).addClass('view-grid').attr('style', 'width:100%');

		// title
		var objHeaderRow = $("<tr>");
		var objHeaderContent = $("<td>").attr('colspan', 4)
				.addClass('view-grid-section-header').text('Accounts');
		$(objHeaderContent).appendTo($(objHeaderRow));
		$(objHeaderRow).appendTo($(divTable));

		// header columns
		objHeaderRow = $("<tr>");
		$(objHeaderRow).addClass('view-grid-header');
		objHeaderContent = $("<td>");
		$(objHeaderContent).addClass('view-grid-header-text').text(getLabel(
				'accountNo', 'Account No'));
		$(objHeaderContent).appendTo($(objHeaderRow));
		objHeaderContent = $("<td>");
		$(objHeaderContent).addClass('view-grid-header-text').attr('style',
				'width:33%;').text(getLabel('accountName', 'Account Name'));
		$(objHeaderContent).appendTo($(objHeaderRow));
		objHeaderContent = $("<td>");
		$(objHeaderContent).addClass('view-grid-header-text').attr('style',
				'width:33%;').text(getLabel('clientDescription',
				'Client Description'));
		$(objHeaderContent).appendTo($(objHeaderRow));
		$(objHeaderRow).appendTo($(divTable));

		// data columns
		for (var i in objDataAccounts) {

			var val = objDataAccounts[i];
			var strAssignmentStatus = val['assigned'];
			var strAccountNumber = val['accountNumber'];
			var strAccountName = val['accountName'];
			var strClientDescription = val['clientDescription'];

			if (strAssignmentStatus === "true") {
				var objGridColumnDataRow = $("<tr>");
				$(objGridColumnDataRow).addClass('view-grid-body');
				var objGridDataCol = $("<td>");
				$(objGridDataCol).addClass('view-grid-body-content')
						.text(strAccountNumber);
				$(objGridDataCol).appendTo(objGridColumnDataRow);

				var objGridDataCol = $("<td>");
				$(objGridDataCol).addClass('view-grid-body-content')
						.text(strAccountName);
				$(objGridDataCol).appendTo(objGridColumnDataRow);

				var objGridDataCol = $("<td>");
				$(objGridDataCol).addClass('view-grid-body-content')
						.text(strClientDescription);
				$(objGridDataCol).appendTo(objGridColumnDataRow);
			}

			$(objGridColumnDataRow).appendTo($(divTable));
		}

		$(divTable).appendTo($('#' + appendToDivId));
	} else {
		$('#' + appendToDivId).remove();
	}
}
function paintInterfaceTable(objDataInterfacePrivilege, appendToDivId) {
	var blnVisible = false;
	for (var i in objDataInterfacePrivilege) {
		var val = objDataInterfacePrivilege[i];
		if ('Y' === val['editFlag'] || 'Y' === val['executeFlag']) {
			blnVisible = true;
			break;
		}
	}

	if (blnVisible) {
		$('#' + appendToDivId).empty();
		var divTable = $("<table>");
		$(divTable).addClass('view-grid').attr('style', 'width:100%');

		// title
		var objHeaderRow = $("<tr>");

		var objHeaderContent = $("<td>").attr('colspan', 4)
				.addClass('view-grid-section-header');
		$(objHeaderContent).text('Interface Privileges');

		$(objHeaderContent).appendTo($(objHeaderRow));
		$(objHeaderRow).appendTo($(divTable));

		// header columns
		objHeaderRow = $("<tr>");
		$(objHeaderRow).addClass('view-grid-header');
		objHeaderContent = $("<td>");
		$(objHeaderContent).addClass('view-grid-header-text')
				.text('Interface Name');
		$(objHeaderContent).appendTo($(objHeaderRow));
		objHeaderContent = $("<td>");
		$(objHeaderContent).addClass('view-grid-header-text').attr('style',
				'width:33%;').text('Edit');
		$(objHeaderContent).appendTo($(objHeaderRow));
		objHeaderContent = $("<td>");
		$(objHeaderContent).addClass('view-grid-header-text').attr('style',
				'width:33%;').text('Execute');
		$(objHeaderContent).appendTo($(objHeaderRow));

		$(objHeaderRow).appendTo($(divTable));

		// data columns
		for (var i in objDataInterfacePrivilege) {

			var val = objDataInterfacePrivilege[i];
			var strInterfaceDesc = val['interfaceDesc'];
			var strEditFlag = val['editFlag'];
			var strExecuteFlag = val['executeFlag'];

			if ('Y' === strEditFlag || 'Y' === strExecuteFlag) {
				var objGridColumnDataRow = $("<div>");
				$(objGridColumnDataRow).addClass('row view-grid-body');
				objHeaderRow = $("<tr>");
				$(objHeaderRow).addClass('view-grid-body');

				objHeaderContent = $("<td>");
				$(objHeaderContent).addClass('view-grid-body-content')
						.text(strInterfaceDesc);
				$(objHeaderContent).appendTo($(objHeaderRow));
				objHeaderContent = $("<td>");
				$(objHeaderContent).addClass('view-grid-body-content').attr(
						'style', 'width:33%;').html(strEditFlag === "Y"
						? '<i class="fa fa-check"></i>'
						: '');
				$(objHeaderContent).appendTo($(objHeaderRow));
				objHeaderContent = $("<td>");
				$(objHeaderContent).addClass('view-grid-body-content').attr(
						'style', 'width:33%;').html(strExecuteFlag === "Y"
						? '<i class="fa fa-check"></i>'
						: '');
				$(objHeaderContent).appendTo($(objHeaderRow));

				$(objHeaderRow).appendTo($(divTable));
			}
		}

		$(divTable).appendTo($('#' + appendToDivId));
	} else {
		$('#' + appendToDivId).remove();
	}
}
function fetchBankReportsData(paramModule, paramCategoryId, strDivId) {
	$.ajax({
				url : "services/userCategory/bankReportsFields",
				type : "POST",
				dataType : "json",
				async : false,
				data : {
					module : paramModule,
					categoryId : paramCategoryId
				},
				complete : function(response) {
					var strResText = response && response.responseText
							? response.responseText
							: '';
					// if (isEmpty(jsondataNodeName[paramModule]))
					// jsondataNodeName[paramModule] = {};
					strResText = JSON.parse(strResText.unquoted());
					strResText = strResText && strResText.d
							&& strResText.d.details
							? strResText.d.details
							: '[]';
					// jsondataNodeName[paramModule]['bankReports'] =
					// strResText;
					paintBankReportsTable(strResText, strDivId);
				}
			});

}

function paintBankReportsTable(objDataBankReports, appendToDivId) {
	appendToDivId = "tabs-bankReports";
	var blnVisible = false;
	for (var i in objDataBankReports) {
		var val = objDataBankReports[i];
		if ('Assigned' === val['assignmentStatus']) {
			blnVisible = true;
			break;
		}
	}

	if (blnVisible) {
		$('#' + appendToDivId).empty();
		var divTable = $("<table>");
		$(divTable).addClass('view-grid').attr('style', 'width:100%');

		// title
		var objHeaderRow = $("<tr>");

		var objHeaderContent = $("<td>").attr('colspan', 4)
				.addClass('view-grid-section-header');
		$(objHeaderContent).text('Bank Reports');

		$(objHeaderContent).appendTo($(objHeaderRow));
		$(objHeaderRow).appendTo($(divTable));

		// header columns
		objHeaderRow = $("<tr>");
		$(objHeaderRow).addClass('view-grid-header');
		objHeaderContent = $("<td>");
		$(objHeaderContent).addClass('view-grid-header-text').text(getLabel(
				"distributionId", "Distribution Id"));
		$(objHeaderContent).appendTo($(objHeaderRow));
		objHeaderContent = $("<td>");
		$(objHeaderContent).addClass('view-grid-header-text').attr('style',
				'width:33%;').text(getLabel("reportName", "Report Name"));
		$(objHeaderContent).appendTo($(objHeaderRow));
		objHeaderContent = $("<td>");
		$(objHeaderContent).addClass('view-grid-header-text').attr('style',
				'width:33%;').text(getLabel("lbl.type", "Type"));
		$(objHeaderContent).appendTo($(objHeaderRow));

		$(objHeaderRow).appendTo($(divTable));

		// data columns
		for (var i in objDataBankReports) {

			var val = objDataBankReports[i];
			var strBankReportDesc = val['bankReportDesc'];
			var strDistributionId = val['distributionId'];
			var strAssignmentStatus = val['assignmentStatus'];
			var strType = val['distributionType'];

			if (strType == 'G')
				strType = 'Group';
			else if (strType == 'F')
				strType = 'Field';
			if (strType == 'A')
				strType = 'Account';

			// if ('Y' === strEditFlag || 'Y' === strExecuteFlag ) {
			var objGridColumnDataRow = $("<div>");
			$(objGridColumnDataRow).addClass('row view-grid-body');
			objHeaderRow = $("<tr>");
			$(objHeaderRow).addClass('view-grid-body');

			objHeaderContent = $("<td>");
			$(objHeaderContent).addClass('view-grid-body-content')
					.text(strDistributionId);
			$(objHeaderContent).appendTo($(objHeaderRow));

			objHeaderContent = $("<td>");
			$(objHeaderContent).addClass('view-grid-body-content').attr(
					'style', 'width:33%;').html(strBankReportDesc);
			$(objHeaderContent).appendTo($(objHeaderRow));

			objHeaderContent = $("<td>");
			$(objHeaderContent).addClass('view-grid-body-content').attr(
					'style', 'width:33%;').html(strType);
			$(objHeaderContent).appendTo($(objHeaderRow));

			$(objHeaderRow).appendTo($(divTable));
			// }
		}
		$(divTable).appendTo($('#' + appendToDivId));
	} else {
		$('#divBankReports').addClass('hidden');
		$('#' + appendToDivId).remove();
	}
}

function toggleContainerVisibility() {
	/*
	 * $((strTargetDivId ? '#' + strTargetDivId + ' ' : '') + '.canParentHide')
	 * .each(function() { if ($(this).find('.canHide').length === $(this)
	 * .find('.canHide.hidden').length) { $(this).addClass('hidden'); } else
	 * $(this).removeClass('hidden'); });
	 */
	$('.canContainerHide').each(function() {
		if ($(this).find('.canHide').length === $(this).find('.canHide.hidden').length) {
			$(this).addClass('hidden');
		} else
			$(this).removeClass('hidden');
	});
}