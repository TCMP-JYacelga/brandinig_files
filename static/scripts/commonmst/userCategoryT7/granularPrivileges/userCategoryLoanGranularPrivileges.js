var featureLoanMap = [];
function getLoanPrivilegesData(strUrl, dataPrivilegeJson, dataJson, strModule) {
	var objData = null;
	$.ajax({
				url : strUrl,
				type : 'POST',
				data : dataPrivilegeJson,
				async : false,
				success : function(data) {
					var filteredPrivData = data;
					$.each(filteredPrivData, function(index, feature) {
								// using key as below due to multiple weights
								// for same
								// feature id
								var key = feature.featureId + "_"
										+ feature.featureWeight;

								var rightValue;
								var rmserial = feature.rmSerial;

								featureLoanMap[key] = feature;

							});

					getLoansGranularPrivilegesData(
							'services/userCategory/getAllGranularPrivileges.json',
							dataJson, strModule)
				}

			});

}
function getLoansGranularPrivilegesData(strUrl, dataJson, strModule) {
	var objData = null;
	$.ajax({
				url : strUrl,
				type : 'POST',
				data : dataJson,
				async : false,
				success : function(data) {
					paintLoansGranularPrivilegesPopup(strModule, data);
				}
			});

}
function createLoanGranularPopupData() {
	if (loanServiceEnable == true) {
		var strModule = '07'
		var dataPrivilegeJson = {
			module : strModule,
			categoryId : userCategory
		};

		var dataJson = {
			module : strModule,
			categoryId : userCategory,
			serviceType : 'LN'
		};
		getLoanPrivilegesData('services/userCategory/previlige.json',
				dataPrivilegeJson, dataJson, strModule);
	}
}
function paintLoansGranularPrivilegesPopup(strModule, granularData) {
	if ('07' === strModule) {

		var columnModel = [{
					"feature_code" : "none",
					"colId" : "type",
					"colName" : getLabel('lbl.type', "Type"),
					"colType" : "MainSectionHeader",
					"hidden" : false
				}, {
					"colName" : getLabel('obligorID', 'Obligor ID'),
					"colId" : "accountNo",
					"colType" : "SubSectionHeader",
					"hidden" : false
				}, {
					"colName" : getLabel('ObligationID', 'Obligation ID'),
					"colId" : "obligationId",
					"colType" : "SubSectionHeader",
					"hidden" : false
				}, {
					"colName" : getLabel('accountName', 'Account Name'),
					"colId" : "accountName",
					"colType" : "SubSectionHeader",
					"hidden" : false
				}, {

					"colId" : "viewScheduleTransferFlag",
					"colName" : getLabel('viewScheduleTransfer',
							"View Schedule Transfer"),
					"colType" : "SectionHeader",
					"hidden" : featureLoanMap["AST"] != undefined
							&& featureLoanMap["AST"].canView === 'Y'
							? false
							: true
				}, {

					"colId" : "viewInvoicesFlag",
					"colName" : getLabel("viewInvoices", "View Invoices"),
					"colType" : "SectionHeader",
					"hidden" : featureLoanMap["LNI"] != undefined
							&& featureLoanMap["LNI"].canView === 'Y'
							? false
							: true
				}, {
					"colId" : "editInvoicesFlag",
					"colName" : getLabel("payInvoices", "Pay Invoices"),
					"colType" : "SectionHeader",
					"hidden" : featureLoanMap["LNI"] != undefined
							&& featureLoanMap["LNI"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "approveInvoicesFlag",
					"colName" : getLabel("approveInvoices", "Approve Invoices"),
					"colType" : "SectionHeader",
					"hidden" : featureLoanMap["LNI"] != undefined
							&& featureLoanMap["LNI"].canAuth == 'Y'
							? false
							: true
				}, {
					"colId" : "advanceFlag",
					"colName" : getLabel("viewAdvance", "View Advance"),
					"colType" : "SectionHeader",
					"hidden" : featureLoanMap["LDO"] != undefined
							&& featureLoanMap["LDO"].canView == 'Y'
							? false
							: true
				}, {
					"colId" : "createAdvanceFlag",
					"colName" : getLabel("createAdvance", "Create Advance"),
					"colType" : "SectionHeader",
					"hidden" : featureLoanMap["LDO"] != undefined
							&& featureLoanMap["LDO"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "approveAdvanceFlag",
					"colName" : getLabel("approveAdvance", "Approve Advance"),
					"colType" : "SectionHeader",
					"hidden" : featureLoanMap["LDO"] != undefined
							&& featureLoanMap["LDO"].canAuth == 'Y'
							? false
							: true
				}, {
					"colId" : "paydownFlag",
					"colName" : getLabel("viewFullPaydown", "View Full PayDown"),
					"colType" : "SectionHeader",
					"hidden" : featureLoanMap["RPY"] != undefined
							&& featureLoanMap["RPY"].canView == 'Y'
							? false
							: true
				}, {
					"colId" : "createPaydownFlag",
					"colName" : getLabel("createFullPaydown",
							"Create Full PayDown"),
					"colType" : "SectionHeader",
					"hidden" : featureLoanMap["RPY"] != undefined
							&& featureLoanMap["RPY"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "approvePaydownFlag",
					"colName" : getLabel("approveFullPaydown",
							"Approve Full PayDown"),
					"colType" : "SectionHeader",
					"hidden" : featureLoanMap["RPY"] != undefined
							&& featureLoanMap["RPY"].canAuth == 'Y'
							? false
							: true
				}, {
					"colId" : "partialPaydownFlag",
					"colName" : getLabel("viewPartialPaydown",
							"View Partial PayDown"),
					"colType" : "SectionHeader",
					"hidden" : featureLoanMap["FLON_000001"] != undefined
							&& featureLoanMap["FLON_000001"].canView == 'Y'
							? false
							: true
				}, {
					"colId" : "createPartialPaydownFlag",
					"colName" : getLabel("createPartialPaydown",
							"Create Partial PayDown"),
					"colType" : "SectionHeader",
					"hidden" : featureLoanMap["FLON_000001"] != undefined
							&& featureLoanMap["FLON_000001"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "approvePartialPaydownFlag",
					"colName" : getLabel("approvePartialPaydown",
							"Approve Partial PayDown"),
					"colType" : "SectionHeader",
					"hidden" : featureLoanMap["FLON_000001"] != undefined
							&& featureLoanMap["FLON_000001"].canAuth == 'Y'
							? false
							: true
				}, {
					"colId" : "loanRepaymentFlag",
					"colName" : getLabel("loanRepayment",
							"Use for Loan Repayment"),
					"colType" : "SectionHeader",
					"hidden" : featureLoanMap["LOANS_390"] != undefined
							&& featureLoanMap["LOANS_390"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "advancePaydownFlag",
					"colName" : getLabel("advanceDeposite",
							"Use for Advance Deposite"),
					"colType" : "SectionHeader",
					"hidden" : featureLoanMap["LOANS_391"] != undefined
							&& featureLoanMap["LOANS_391"].canEdit == 'Y'
							? false
							: true
				}];
		if (granularData && granularData.length > 0)
			renderLoansGranularPrivilegesPopup(columnModel, granularData,
					'granularLoansDiv', getLabel('loanGranularPrivilege',
							'Loan Granular Privileges'));
	}

}
function renderLoansGranularPrivilegesPopup(columnModel, data, renderToDiv,
		strHeaderLabel) {
	var intColCount = 0;
	// Create Table Header
	var objTable = $("<table>").addClass('view-grid').attr('style',
			'width:100%');

	for (i in columnModel) {
		var objColumn = columnModel[i];
		if (!objColumn.hidden)
			intColCount++;
	}

	var objHeaderRow = $("<tr>").addClass('view-grid-section-header');
	var objHeaderCell = $("<td>").addClass('view-grid-section-header').attr(
			'colspan', intColCount).text(strHeaderLabel);
	$(objHeaderCell).appendTo($(objHeaderRow));
	$(objHeaderRow).appendTo($(objTable));

	// Create Table Header
	var objTableHeaderRow = $("<tr>").addClass('view-grid-header');
	for (i in columnModel) {
		var objColumn = columnModel[i];
		if (("SectionHeader" === objColumn.colType && !objColumn.hidden)
				|| "MainSectionHeader" === objColumn.colType) {
			var objHeaderCell = createGranularPopupCell(objColumn.colName);
			if (objColumn.colId === 'type') {
				$(objHeaderCell).attr('colspan', '3');
			}
			$(objHeaderCell).appendTo($(objTableHeaderRow));
		}
	}
	$(objTableHeaderRow).appendTo($(objTable));

	// Create Internal Headers
	objTableHeaderRow = $("<tr>").addClass('view-grid-header');

	for (i = 0; i < columnModel.length; i++) {
		var objColumn = columnModel[i];
		if ("SubSectionHeader" === objColumn.colType) {
			var objHeaderCell = createGranularPopupCell(objColumn.colName);
			$(objHeaderCell).appendTo($(objTableHeaderRow));
		} else if ("SectionHeader" === objColumn.colType && !objColumn.hidden) {
			var objHeaderCell = createGranularPopupCell("");
			$(objHeaderCell).appendTo($(objTableHeaderRow));
		}
	}
	$(objTableHeaderRow).appendTo($(objTable));

	// Create Data Rows
	if (data && data.length > 0) {

		$.each(data, function(index, cfg) {
					var objTableDataRow = $("<tr>").addClass('view-grid-body');
					for (i in columnModel) {
						var objColumn = columnModel[i];
						var objDataCell = null;
						if ("SubSectionHeader" === objColumn.colType
								|| "SectionHeader" === objColumn.colType) {
							var strFieldName = objColumn.colId;
							var objData = cfg[strFieldName];
							if ("SectionHeader" === objColumn.colType
									&& !objColumn.hidden)
								objDataCell = createGranularPopupCheckbox(objData);
							else if ("SubSectionHeader" === objColumn.colType)
								objDataCell = createGranularPopupCell(objData
										|| '');
							$(objDataCell).addClass('view-grid-body-content');
							$(objDataCell).appendTo($(objTableDataRow));
							// $(objHeaderCell).appendTo($(objTableHeaderRow));
						}
					}
					$(objTableDataRow).appendTo($(objTable));
				});

	}
	$('#' + renderToDiv).attr(
			'style',
			'max-width:' + $('#tempLoansPrivileges').width()
					+ ' !important;overflow-x:auto; width: 100%;');
	$(objTable).appendTo($('#' + renderToDiv));
}

function paintLoansGranularPrivilegesPopupTable(granularData, privilegeData) {
	if (privilegeData) {
		populateLoanFeatureMap(privilegeData)
		var columnModel = [{
					"feature_code" : "none",
					"colId" : "type",
					"colName" : getLabel('lbl.type', "Type"),
					"colType" : "MainSectionHeader",
					"hidden" : false
				}, {
					"colName" : getLabel('obligorID', 'Obligor ID'),
					"colId" : "accountNo",
					"colType" : "SubSectionHeader",
					"hidden" : false
				}, {
					"colName" : getLabel('ObligationID', 'Obligation ID'),
					"colId" : "obligationId",
					"colType" : "SubSectionHeader",
					"hidden" : false
				}, {
					"colName" : getLabel('accountName', 'Account Name'),
					"colId" : "accountName",
					"colType" : "SubSectionHeader",
					"hidden" : false
				}, {

					"colId" : "viewScheduleTransferFlag",
					"colName" : getLabel('viewScheduleTransfer',
							"View Schedule Transfer"),
					"colType" : "SectionHeader",
					"hidden" : featureLoanMap["AST"] != undefined
							&& featureLoanMap["AST"].canView === 'Y'
							? false
							: true
				}, {

					"colId" : "viewInvoicesFlag",
					"colName" : getLabel("viewInvoices", "View Invoices"),
					"colType" : "SectionHeader",
					"hidden" : featureLoanMap["LNI"] != undefined
							&& featureLoanMap["LNI"].canView === 'Y'
							? false
							: true
				}, {
					"colId" : "editInvoicesFlag",
					"colName" : getLabel("payInvoices", "Pay Invoices"),
					"colType" : "SectionHeader",
					"hidden" : featureLoanMap["LNI"] != undefined
							&& featureLoanMap["LNI"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "approveInvoicesFlag",
					"colName" : getLabel("approveInvoices", "Approve Invoices"),
					"colType" : "SectionHeader",
					"hidden" : featureLoanMap["LNI"] != undefined
							&& featureLoanMap["LNI"].canAuth == 'Y'
							? false
							: true
				}, {
					"colId" : "advanceFlag",
					"colName" : getLabel("viewAdvance", "View Advance"),
					"colType" : "SectionHeader",
					"hidden" : featureLoanMap["LDO"] != undefined
							&& featureLoanMap["LDO"].canView == 'Y'
							? false
							: true
				}, {
					"colId" : "createAdvanceFlag",
					"colName" : getLabel("createAdvance", "Create Advance"),
					"colType" : "SectionHeader",
					"hidden" : featureLoanMap["LDO"] != undefined
							&& featureLoanMap["LDO"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "approveAdvanceFlag",
					"colName" : getLabel("approveAdvance", "Approve Advance"),
					"colType" : "SectionHeader",
					"hidden" : featureLoanMap["LDO"] != undefined
							&& featureLoanMap["LDO"].canAuth == 'Y'
							? false
							: true
				}, {
					"colId" : "paydownFlag",
					"colName" : getLabel("viewFullPaydown", "View Full PayDown"),
					"colType" : "SectionHeader",
					"hidden" : featureLoanMap["RPY"] != undefined
							&& featureLoanMap["RPY"].canView == 'Y'
							? false
							: true
				}, {
					"colId" : "createPaydownFlag",
					"colName" : getLabel("createFullPaydown",
							"Create Full PayDown"),
					"colType" : "SectionHeader",
					"hidden" : featureLoanMap["RPY"] != undefined
							&& featureLoanMap["RPY"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "approvePaydownFlag",
					"colName" : getLabel("approveFullPaydown",
							"Approve Full PayDown"),
					"colType" : "SectionHeader",
					"hidden" : featureLoanMap["RPY"] != undefined
							&& featureLoanMap["RPY"].canAuth == 'Y'
							? false
							: true
				}, {
					"colId" : "partialPaydownFlag",
					"colName" : getLabel("viewPartialPaydown",
							"View Partial PayDown"),
					"colType" : "SectionHeader",
					"hidden" : featureLoanMap["FLON_000001"] != undefined
							&& featureLoanMap["FLON_000001"].canView == 'Y'
							? false
							: true
				}, {
					"colId" : "createPartialPaydownFlag",
					"colName" : getLabel("createPartialPaydown",
							"Create Partial PayDown"),
					"colType" : "SectionHeader",
					"hidden" : featureLoanMap["FLON_000001"] != undefined
							&& featureLoanMap["FLON_000001"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "approvePartialPaydownFlag",
					"colName" : getLabel("approvePartialPaydown",
							"Approve Partial PayDown"),
					"colType" : "SectionHeader",
					"hidden" : featureLoanMap["FLON_000001"] != undefined
							&& featureLoanMap["FLON_000001"].canAuth == 'Y'
							? false
							: true
				}, {
					"colId" : "loanRepaymentFlag",
					"colName" : getLabel("loanRepayment",
							"Use for Loan Repayment"),
					"colType" : "SectionHeader",
					"hidden" : featureLoanMap["LOANS_390"] != undefined
							&& featureLoanMap["LOANS_390"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "advancePaydownFlag",
					"colName" : getLabel("advanceDeposite",
							"Use for Advance Deposite"),
					"colType" : "SectionHeader",
					"hidden" : featureLoanMap["LOANS_391"] != undefined
							&& featureLoanMap["LOANS_391"].canEdit == 'Y'
							? false
							: true
				}];
		if (granularData && granularData.length > 0)
			renderLoansGranularPrivilegesPopup(columnModel, granularData,
					'granularLoansDiv', getLabel('loanGranularPrivilege',
							'Loan Granular Privileges'));
	}
}
function populateLoanFeatureMap(privilegeData) {
	if (privilegeData)
		$.each(privilegeData, function(index, feature) {
					var key = feature.featureId + "_" + feature.featureWeight;
					var rightValue;
					var rmserial = feature.rmSerial;
					featureLoanMap[key] = feature;

				});
}