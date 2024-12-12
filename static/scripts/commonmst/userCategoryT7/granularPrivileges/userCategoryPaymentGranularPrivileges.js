var featurePayMap = [];
function getPrivilegesData(strUrl, dataPrivilegeJson, dataJson, strModule) {
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

								featurePayMap[key] = feature;

							});

					getGranularPrivilegesData(
							'services/userCategory/getAllGranularPrivileges.json',
							dataJson, strModule)
				}

			});

}
function getGranularPrivilegesData(strUrl, dataJson, strModule) {
	var objData = null;
	$.ajax({
				url : strUrl,
				type : 'POST',
				data : dataJson,
				async : false,
				success : function(data) {
					paintGranularPrivilegesPopup(strModule, data);
				}
			});

}
function createGranularPopupData() {
	if (payServiceEnable == true) {
		var strModule = '02'
		var dataPrivilegeJson = {
			module : strModule,
			categoryId : userCategory
		};

		var dataJson = {
			module : strModule,
			categoryId : userCategory,
			serviceType : 'PAY'
		};

		getPrivilegesData('services/userCategory/previlige.json',
				dataPrivilegeJson, dataJson, strModule);
		// paintPaymentGranularPrivilegesPopup();
	}
}
function paintGranularPrivilegesPopup(strModule, granularData) {
	if ('02' === strModule) {

		var columnModel = [{
					"feature_code" : "none",
					"colId" : "type",
					"colName" : "Type",
					"colType" : "MainSectionHeader",
					"hidden" : false
				}, {
					"colName" : "Account",
					"colId" : "accountNo",
					"colType" : "SubSectionHeader",
					"hidden" : false
				}, {
					"colName" : "Account Name",
					"colId" : "accountName",
					"colType" : "SubSectionHeader",
					"hidden" : false
				}, {
					"colName" : "Payment Package",
					"colId" : "packageName",
					"colType" : "SubSectionHeader",
					"hidden" : false
				}, {

					"colId" : "viewFlag",
					"colName" : getLabel("view", "View"),
					"colType" : "SectionHeader",
					"hidden" : featurePayMap["PYB_41"] != undefined
							&& featurePayMap["PYB_41"].canView === 'Y'
							? false
							: true
				}, {

					"colId" : "editFlag",
					"colName" : getLabel("edit", "Edit"),
					"colType" : "SectionHeader",
					"hidden" : featurePayMap["PYB_41"] != undefined
							&& featurePayMap["PYB_41"].canEdit === 'Y'
							? false
							: true
				}, {
					"colId" : "deleteFlag",
					"colName" : getLabel("delete", "Delete"),
					"colType" : "SectionHeader",
					"hidden" : featurePayMap["PYB_381"] != undefined
							&& featurePayMap["PYB_381"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "recallFlag",
					"colName" : getLabel("lblmodify", "Modify"),
					"colType" : "SectionHeader",
					"hidden" : featurePayMap["PYB_364"] != undefined
							&& featurePayMap["PYB_364"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "approveFlag",
					"colName" : getLabel("approve", "Approve"),
					"colType" : "SectionHeader",
					"hidden" : featurePayMap["PYB_41"] != undefined
							&& featurePayMap["PYB_41"].canAuth == 'Y'
							? false
							: true
				}, {
					"colId" : "quickApproveFlag",
					"colName" : getLabel("detailApprove", "Detail Approve"),
					"colType" : "SectionHeader",
					"hidden" : featurePayMap["PYB_363"] != undefined
							&& featurePayMap["PYB_363"].canAuth == 'Y'
							? false
							: true
				}, {
					"colId" : "importFlag",
					"colName" : getLabel("import", "Import"),
					"colType" : "SectionHeader",
					"hidden" : featurePayMap["PYB_380"] != undefined
							&& featurePayMap["PYB_380"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "cancelFlag",
					"colName" : getLabel("canel", "Cancel"),
					"colType" : "SectionHeader",
					"hidden" : featurePayMap["STPP_46"] != undefined
							&& featurePayMap["STPP_46"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "cancelApproveFlag",
					"colName" : getLabel("cancelApprove", "Cancel Approve"),
					"colType" : "SectionHeader",
					"hidden" : featurePayMap["STPP_46"] != undefined
							&& featurePayMap["STPP_46"].canAuth == 'Y'
							? false
							: true
				}];
		if (granularData && granularData.length > 0)
			renderGranularPrivilegesPopup(columnModel, granularData,
					'granularPaymentDiv', getLabel('paymentGranularPrivilege',
							'Payment Granular Privileges'));
	}

}
function renderGranularPrivilegesPopup(columnModel, data, renderToDiv,
		strSectionHeader) {

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
			'colspan', intColCount).text(strSectionHeader);
	$(objHeaderCell).appendTo($(objHeaderRow));
	$(objHeaderRow).appendTo($(objTable));

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
			var objHeaderCell = createGranularSubSectionPopupCell(objColumn.colName);
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
								objDataCell = createGranularSubSectionPopupCell(objData
										|| '');
							$(objDataCell).addClass('view-grid-body-content');
							$(objDataCell).appendTo($(objTableDataRow));
							// $(objHeaderCell).appendTo($(objTableHeaderRow));
						}
					}
					$(objTableDataRow).appendTo($(objTable));
				});

	}

	if ('granularPaymentDiv' === renderToDiv || 'granularSIDiv' === renderToDiv
			|| 'granularReversalDiv' === renderToDiv) {
		$('#' + renderToDiv).attr(
				'style',
				'max-width:' + $('#paymentPrivilegesParentDiv').width()
						+ ' !important;overflow-x:auto; width: 100%;');
	}

	$(objTable).appendTo($('#' + renderToDiv));
}
function paintPaymentGranularPrivilegesPopupTable(granularData, privilegeData) {
	if (privilegeData) {
		populatePaymentFeatureFeatureMap(privilegeData);
		var columnModel = [{
					"feature_code" : "none",
					"colId" : "type",
					"colName" : "Type",
					"colType" : "MainSectionHeader",
					"hidden" : false
				}, {
					"colName" : "Account",
					"colId" : "accountNo",
					"colType" : "SubSectionHeader",
					"hidden" : false
				}, {
					"colName" : "Account Name",
					"colId" : "accountName",
					"colType" : "SubSectionHeader",
					"hidden" : false
				}, {
					"colName" : "Payment Package",
					"colId" : "packageName",
					"colType" : "SubSectionHeader",
					"hidden" : false
				}, {

					"colId" : "viewFlag",
					"colName" : getLabel("view", "View"),
					"colType" : "SectionHeader",
					"hidden" : featurePayMap["PYB_41"] != undefined
							&& featurePayMap["PYB_41"].canView === 'Y'
							? false
							: true
				}, {

					"colId" : "editFlag",
					"colName" : getLabel("edit", "Edit"),
					"colType" : "SectionHeader",
					"hidden" : featurePayMap["PYB_41"] != undefined
							&& featurePayMap["PYB_41"].canEdit === 'Y'
							? false
							: true
				}, {
					"colId" : "deleteFlag",
					"colName" : getLabel("delete", "Delete"),
					"colType" : "SectionHeader",
					"hidden" : featurePayMap["PYB_381"] != undefined
							&& featurePayMap["PYB_381"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "recallFlag",
					"colName" : getLabel("lblmodify", "Modify"),
					"colType" : "SectionHeader",
					"hidden" : featurePayMap["PYB_364"] != undefined
							&& featurePayMap["PYB_364"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "approveFlag",
					"colName" : getLabel("approve", "Approve"),
					"colType" : "SectionHeader",
					"hidden" : featurePayMap["PYB_41"] != undefined
							&& featurePayMap["PYB_41"].canAuth == 'Y'
							? false
							: true
				}, {
					"colId" : "quickApproveFlag",
					"colName" : getLabel("detailApprove", "Detail Approve"),
					"colType" : "SectionHeader",
					"hidden" : featurePayMap["PYB_363"] != undefined
							&& featurePayMap["PYB_363"].canAuth == 'Y'
							? false
							: true
				}, {
					"colId" : "importFlag",
					"colName" : getLabel("import", "Import"),
					"colType" : "SectionHeader",
					"hidden" : featurePayMap["PYB_380"] != undefined
							&& featurePayMap["PYB_380"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "cancelFlag",
					"colName" : getLabel("canel", "Cancel"),
					"colType" : "SectionHeader",
					"hidden" : featurePayMap["STPP_46"] != undefined
							&& featurePayMap["STPP_46"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "cancelApproveFlag",
					"colName" : getLabel("cancelApprove", "Cancel Approve"),
					"colType" : "SectionHeader",
					"hidden" : featurePayMap["STPP_46"] != undefined
							&& featurePayMap["STPP_46"].canAuth == 'Y'
							? false
							: true
				}];
		if (granularData && granularData.length > 0)
			renderGranularPrivilegesPopup(columnModel, granularData,
					'granularPaymentDiv', getLabel('paymentGranularPrivilege',
							'Payment Granular Privileges'));
	}
}
function populatePaymentFeatureFeatureMap(privilegeData) {
	if (privilegeData) {
		$.each(privilegeData, function(index, feature) {
					var key = feature.featureId + "_" + feature.featureWeight;
					var rightValue;
					var rmserial = feature.rmSerial;
					featurePayMap[key] = feature;
				});
	}
}
