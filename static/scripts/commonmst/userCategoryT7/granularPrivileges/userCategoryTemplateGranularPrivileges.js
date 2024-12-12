var featurePayMap = [];
function getTemplatePrivilegesData(strUrl, dataPrivilegeJson, dataJson,
		strModule) {
	var objData = null;
	$.ajax({
				url : strUrl,
				type : 'POST',
				data : dataPrivilegeJson,
				async : false,
				success : function(data) {
					var filteredPrivData = data;
					$.each(filteredPrivData, function(index, feature) {
								var key = feature.featureId + "_"
										+ feature.featureWeight;
								var rightValue;
								var rmserial = feature.rmSerial;
								featurePayMap[key] = feature;

							});

					getTemplateGranularPrivilegesData(
							'services/userCategory/getAllGranularPrivileges.json',
							dataJson, strModule)
				}

			});
}
function getTemplateGranularPrivilegesData(strUrl, dataJson, strModule) {
	var objData = null;
	$.ajax({
				url : strUrl,
				type : 'POST',
				data : dataJson,
				async : false,
				success : function(data) {
					paintTemplateGranularPrivilegesPopup(strModule, data);
				}
			});

}
function createTemplateGranularPopupData() {
	if (payServiceEnable == true) {
		var strModule = '02'
		var dataPrivilegeJson = {
			module : strModule,
			categoryId : userCategory
		};

		var dataJson = {
			module : strModule,
			categoryId : userCategory,
			serviceType : 'TEMP'
		};
		getTemplatePrivilegesData('services/userCategory/previlige.json',
				dataPrivilegeJson, dataJson, strModule);
		// paintPaymentGranularPrivilegesPopup();
	}
}
function paintTemplateGranularPrivilegesPopup(strModule, granularData) {
	if ('02' === strModule) {
		var chrRepetitive = $('#repetitiveFlag').val();
		var chrSemiRepetitive = $('#semiRepetitiveFlag').val();
		var chrNonRepetitive = $('#nonRepetitiveFlag').val();
		var columnModel = [{
					"feature_code" : "none",
					"colId" : "type",
					"colName" : "Type",
					"colType" : "MainSectionHeader",
					"hidden" : false
				}, {
					"feature_code" : "REP",
					"colId" : "subtype",
					"colName" : "Repetitive",
					"colType" : "MainSectionHeader",
					"hidden" : chrRepetitive === 'Y' ? false : true
				}, {
					"feature_code" : "SREP",
					"colId" : "subtype",
					"colName" : "SemiRepetitive",
					"colType" : "MainSectionHeader",
					"hidden" : chrSemiRepetitive === 'Y' ? false : true
				}, {
					"feature_code" : "NREP",
					"colId" : "subtype",
					"colName" : "Non-Repetitive",
					"colType" : "MainSectionHeader",
					"hidden" : chrNonRepetitive === 'Y' ? false : true
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
					"parentColType" : "repetitive",
					"hidden" : chrRepetitive === 'Y'
							&& featurePayMap["TPL_976"] != undefined
							&& featurePayMap["TPL_976"].canView === 'Y'
							? false
							: true
				}, {

					"colId" : "editFlag",
					"colName" : getLabel("edit", "Edit"),
					"colType" : "SectionHeader",
					"parentColType" : "repetitive",
					"hidden" : chrRepetitive === 'Y'
							&& featurePayMap["TPL_976"] != undefined
							&& featurePayMap["TPL_976"].canEdit === 'Y'
							&& featurePayMap["TPL_382"] != undefined
							&& featurePayMap["TPL_382"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "deleteFlag",
					"colName" : getLabel("delete", "Delete"),
					"colType" : "SectionHeader",
					"parentColType" : "repetitive",
					"hidden" : chrRepetitive === 'Y'
							&& featurePayMap["TPL_382"] != undefined
							&& featurePayMap["TPL_382"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "approveFlag",
					"colName" : getLabel("approve", "Approve"),
					"colType" : "SectionHeader",
					"parentColType" : "repetitive",
					"hidden" : chrRepetitive === 'Y'
							&& featurePayMap["TPL_976"] != undefined
							&& featurePayMap["TPL_976"].canAuth == 'Y'
							? false
							: true
				}, {
					"colId" : "quickApproveFlag",
					"colName" : getLabel("detailApprove", "Detail Approve"),
					"colType" : "SectionHeader",
					"parentColType" : "repetitive",
					"hidden" : chrRepetitive === 'Y'
							&& featurePayMap["TPL_384"] != undefined
							&& featurePayMap["TPL_384"].canAuth == 'Y'
							? false
							: true
				}, {
					"colId" : "importFlag",
					"colName" : getLabel("import", "Import"),
					"colType" : "SectionHeader",
					"parentColType" : "repetitive",
					"hidden" : chrRepetitive === 'Y'
							&& featurePayMap["PYB_380"] != undefined
							&& featurePayMap["PYB_380"].canEdit == 'Y'
							? false
							: true
				}, {

					"colId" : "srViewFlag",
					"colName" : getLabel("view", "View"),
					"colType" : "SectionHeader",
					"parentColType" : "semirepetitive",
					"hidden" : chrSemiRepetitive === 'Y'
							&& featurePayMap["TPL_976"] != undefined
							&& featurePayMap["TPL_976"].canView === 'Y'
							? false
							: true
				}, {

					"colId" : "srEditFlag",
					"colName" : getLabel("edit", "Edit"),
					"colType" : "SectionHeader",
					"parentColType" : "semirepetitive",
					"hidden" : chrSemiRepetitive === 'Y'
							&& featurePayMap["TPL_976"] != undefined
							&& featurePayMap["TPL_976"].canEdit === 'Y'
							&& featurePayMap["TPL_382"] != undefined
							&& featurePayMap["TPL_382"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "srDeleteFlag",
					"colName" : getLabel("delete", "Delete"),
					"colType" : "SectionHeader",
					"parentColType" : "semirepetitive",
					"hidden" : chrSemiRepetitive === 'Y'
							&& featurePayMap["TPL_382"] != undefined
							&& featurePayMap["TPL_382"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "srApproveFlag",
					"colName" : getLabel("approve", "Approve"),
					"colType" : "SectionHeader",
					"parentColType" : "semirepetitive",
					"hidden" : chrSemiRepetitive === 'Y'
							&& featurePayMap["TPL_976"] != undefined
							&& featurePayMap["TPL_976"].canAuth == 'Y'
							? false
							: true
				}, {
					"colId" : "srQuickApproveFlag",
					"colName" : getLabel("detailApprove", "Detail Approve"),
					"colType" : "SectionHeader",
					"parentColType" : "semirepetitive",
					"hidden" : chrSemiRepetitive === 'Y'
							&& featurePayMap["TPL_384"] != undefined
							&& featurePayMap["TPL_384"].canAuth == 'Y'
							? false
							: true
				}, {
					"colId" : "srimportFlag",
					"colName" : getLabel("import", "Import"),
					"colType" : "SectionHeader",
					"parentColType" : "semirepetitive",
					"hidden" : chrSemiRepetitive === 'Y'
							&& featurePayMap["PYB_380"] != undefined
							&& featurePayMap["PYB_380"].canEdit == 'Y'
							? false
							: true
				}, {

					"colId" : "nrViewFlag",
					"colName" : getLabel("view", "View"),
					"colType" : "SectionHeader",
					"parentColType" : "nonrepetitive",
					"hidden" : chrNonRepetitive === 'Y'
							&& featurePayMap["TPL_976"] != undefined
							&& featurePayMap["TPL_976"].canView === 'Y'
							? false
							: true
				}, {

					"colId" : "nrEditFlag",
					"colName" : getLabel("edit", "Edit"),
					"colType" : "SectionHeader",
					"parentColType" : "nonrepetitive",
					"hidden" : chrNonRepetitive === 'Y'
							&& featurePayMap["TPL_976"] != undefined
							&& featurePayMap["TPL_976"].canEdit === 'Y'
							&& featurePayMap["TPL_382"] != undefined
							&& featurePayMap["TPL_382"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "nrDeleteFlag",
					"colName" : getLabel("delete", "Delete"),
					"colType" : "SectionHeader",
					"parentColType" : "nonrepetitive",
					"hidden" : chrNonRepetitive === 'Y'
							&& featurePayMap["TPL_382"] != undefined
							&& featurePayMap["TPL_382"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "nrApproveFlag",
					"colName" : getLabel("approve", "Approve"),
					"colType" : "SectionHeader",
					"parentColType" : "nonrepetitive",
					"hidden" : chrNonRepetitive === 'Y'
							&& featurePayMap["TPL_976"] != undefined
							&& featurePayMap["TPL_976"].canAuth == 'Y'
							? false
							: true
				}, {
					"colId" : "nrQuickApproveFlag",
					"colName" : getLabel("detailApprove", "Detail Approve"),
					"colType" : "SectionHeader",
					"parentColType" : "nonrepetitive",
					"hidden" : chrNonRepetitive === 'Y'
							&& featurePayMap["TPL_384"] != undefined
							&& featurePayMap["TPL_384"].canAuth == 'Y'
							? false
							: true
				}, {
					"colId" : "nrimportFlag",
					"colName" : getLabel("import", "Import"),
					"colType" : "SectionHeader",
					"parentColType" : "nonrepetitive",
					"hidden" : chrNonRepetitive === 'Y'
							&& featurePayMap["PYB_380"] != undefined
							&& featurePayMap["PYB_380"].canEdit == 'Y'
							? false
							: true
				}];
		if (granularData && granularData.length > 0)
			renderTemplateGranularPrivilegesPopup(columnModel, granularData,
					'granularTemplateDiv', getLabel(
							'templateGranularPrivilege',
							'Templates Granular Privileges'));
	}

}
function renderTemplateGranularPrivilegesPopup(columnModel, data, renderToDiv,
		strLabel) {

	// Set column/section visibility
	var intRepColSpanCount = 0, intSRepColSpanCount = 0, intNRepColSpanCount = 0;
	for (i in columnModel) {
		var objColumn = columnModel[i];
		if ("repetitive" === objColumn.parentColType && !objColumn.hidden) {
			intRepColSpanCount++;
		} else if ("semirepetitive" === objColumn.parentColType
				&& !objColumn.hidden) {
			intSRepColSpanCount++;
		} else if ("nonrepetitive" === objColumn.parentColType
				&& !objColumn.hidden) {
			intNRepColSpanCount++;
		}
	}
	// Create Table Header

	var objTable = $("<table>").addClass('view-grid').attr('style',
			'width:100%');
	var objHeaderRow = $("<tr>");
	var objHeaderCell = $("<td>").addClass('view-grid-section-header')
			.text(strLabel).attr('colspan', columnModel.length);;
	$(objHeaderCell).appendTo($(objHeaderRow));
	$(objHeaderRow).appendTo($(objTable));

	var objTableHeaderRow = $("<tr>").addClass('view-grid-header');
	for (i in columnModel) {
		var objColumn = columnModel[i];
		if (/*
			 * ("SectionHeader" === objColumn.colType && !objColumn.hidden) ||
			 */"MainSectionHeader" === objColumn.colType && !objColumn.hidden) {
			var objHeaderCell = createGranularPopupCell(objColumn.colName);
			if (objColumn.colId === 'type') {
				$(objHeaderCell).attr('colspan', '3');
			}
			if (objColumn.colId === 'subtype'
					&& objColumn.feature_code === 'REP') {
				$(objHeaderCell).attr('colspan', intRepColSpanCount);
			}
			if (objColumn.colId === 'subtype'
					&& objColumn.feature_code === 'SREP') {
				$(objHeaderCell).attr('colspan', intSRepColSpanCount);
			}
			if (objColumn.colId === 'subtype'
					&& objColumn.feature_code === 'NREP') {
				$(objHeaderCell).attr('colspan', intNRepColSpanCount);
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
			var objHeaderCell = createGranularPopupCell(objColumn.colName);
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
	$('#granularTemplateDiv').attr(
			'style',
			'max-width:' + $('#paymentPrivilegesParentDiv').width()
					+ ' !important;overflow-x:auto; width: 100%;');
	$('#granularTemplateDiv').addClass('hidden');
	$(objTable).appendTo($('#' + renderToDiv));
	$('#granularTemplateDiv').removeClass('hidden');

}
function paintTemplateGranularPrivilegesPopupTable(granularData, privilegeData) {
	if (privilegeData) {
		populateTemplateFeatureFeatureMap(privilegeData);
		var chrRepetitive = $('#repetitiveFlag').val();
		var chrSemiRepetitive = $('#semiRepetitiveFlag').val();
		var chrNonRepetitive = $('#nonRepetitiveFlag').val();
		var columnModel = [{
					"feature_code" : "none",
					"colId" : "type",
					"colName" : "Type",
					"colType" : "MainSectionHeader",
					"hidden" : false
				}, {
					"feature_code" : "REP",
					"colId" : "subtype",
					"colName" : "Repetitive",
					"colType" : "MainSectionHeader",
					"hidden" : chrRepetitive === 'Y' ? false : true
				}, {
					"feature_code" : "SREP",
					"colId" : "subtype",
					"colName" : "SemiRepetitive",
					"colType" : "MainSectionHeader",
					"hidden" : chrSemiRepetitive === 'Y' ? false : true
				}, {
					"feature_code" : "NREP",
					"colId" : "subtype",
					"colName" : "Non-Repetitive",
					"colType" : "MainSectionHeader",
					"hidden" : chrNonRepetitive === 'Y' ? false : true
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
					"parentColType" : "repetitive",
					"hidden" : chrRepetitive === 'Y'
							&& featurePayMap["TPL_976"] != undefined
							&& featurePayMap["TPL_976"].canView === 'Y'
							? false
							: true
				}, {

					"colId" : "editFlag",
					"colName" : getLabel("edit", "Edit"),
					"colType" : "SectionHeader",
					"parentColType" : "repetitive",
					"hidden" : chrRepetitive === 'Y'
							&& featurePayMap["TPL_976"] != undefined
							&& featurePayMap["TPL_976"].canEdit === 'Y'
							&& featurePayMap["TPL_382"] != undefined
							&& featurePayMap["TPL_382"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "deleteFlag",
					"colName" : getLabel("delete", "Delete"),
					"colType" : "SectionHeader",
					"parentColType" : "repetitive",
					"hidden" : chrRepetitive === 'Y'
							&& featurePayMap["TPL_382"] != undefined
							&& featurePayMap["TPL_382"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "approveFlag",
					"colName" : getLabel("approve", "Approve"),
					"colType" : "SectionHeader",
					"parentColType" : "repetitive",
					"hidden" : chrRepetitive === 'Y'
							&& featurePayMap["TPL_976"] != undefined
							&& featurePayMap["TPL_976"].canAuth == 'Y'
							? false
							: true
				}, {
					"colId" : "quickApproveFlag",
					"colName" : getLabel("detailApprove", "Detail Approve"),
					"colType" : "SectionHeader",
					"parentColType" : "repetitive",
					"hidden" : chrRepetitive === 'Y'
							&& featurePayMap["TPL_384"] != undefined
							&& featurePayMap["TPL_384"].canAuth == 'Y'
							? false
							: true
				}, {
					"colId" : "importFlag",
					"colName" : getLabel("import", "Import"),
					"colType" : "SectionHeader",
					"parentColType" : "repetitive",
					"hidden" : chrRepetitive === 'Y'
							&& featurePayMap["PYB_380"] != undefined
							&& featurePayMap["PYB_380"].canEdit == 'Y'
							? false
							: true
				}, {

					"colId" : "srViewFlag",
					"colName" : getLabel("view", "View"),
					"colType" : "SectionHeader",
					"parentColType" : "semirepetitive",
					"hidden" : chrSemiRepetitive === 'Y'
							&& featurePayMap["TPL_976"] != undefined
							&& featurePayMap["TPL_976"].canView === 'Y'
							? false
							: true
				}, {

					"colId" : "srEditFlag",
					"colName" : getLabel("edit", "Edit"),
					"colType" : "SectionHeader",
					"parentColType" : "semirepetitive",
					"hidden" : chrSemiRepetitive === 'Y'
							&& featurePayMap["TPL_976"] != undefined
							&& featurePayMap["TPL_976"].canEdit === 'Y'
							&& featurePayMap["TPL_382"] != undefined
							&& featurePayMap["TPL_382"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "srDeleteFlag",
					"colName" : getLabel("delete", "Delete"),
					"colType" : "SectionHeader",
					"parentColType" : "semirepetitive",
					"hidden" : chrSemiRepetitive === 'Y'
							&& featurePayMap["TPL_382"] != undefined
							&& featurePayMap["TPL_382"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "srApproveFlag",
					"colName" : getLabel("approve", "Approve"),
					"colType" : "SectionHeader",
					"parentColType" : "semirepetitive",
					"hidden" : chrSemiRepetitive === 'Y'
							&& featurePayMap["TPL_976"] != undefined
							&& featurePayMap["TPL_976"].canAuth == 'Y'
							? false
							: true
				}, {
					"colId" : "srQuickApproveFlag",
					"colName" : getLabel("detailApprove", "Detail Approve"),
					"colType" : "SectionHeader",
					"parentColType" : "semirepetitive",
					"hidden" : chrSemiRepetitive === 'Y'
							&& featurePayMap["TPL_384"] != undefined
							&& featurePayMap["TPL_384"].canAuth == 'Y'
							? false
							: true
				}, {
					"colId" : "srimportFlag",
					"colName" : getLabel("import", "Import"),
					"colType" : "SectionHeader",
					"parentColType" : "semirepetitive",
					"hidden" : chrSemiRepetitive === 'Y'
							&& featurePayMap["PYB_380"] != undefined
							&& featurePayMap["PYB_380"].canEdit == 'Y'
							? false
							: true
				}, {

					"colId" : "nrViewFlag",
					"colName" : getLabel("view", "View"),
					"colType" : "SectionHeader",
					"parentColType" : "nonrepetitive",
					"hidden" : chrNonRepetitive === 'Y'
							&& featurePayMap["TPL_976"] != undefined
							&& featurePayMap["TPL_976"].canView === 'Y'
							? false
							: true
				}, {

					"colId" : "nrEditFlag",
					"colName" : getLabel("edit", "Edit"),
					"colType" : "SectionHeader",
					"parentColType" : "nonrepetitive",
					"hidden" : chrNonRepetitive === 'Y'
							&& featurePayMap["TPL_976"] != undefined
							&& featurePayMap["TPL_976"].canEdit === 'Y'
							&& featurePayMap["TPL_382"] != undefined
							&& featurePayMap["TPL_382"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "nrDeleteFlag",
					"colName" : getLabel("delete", "Delete"),
					"colType" : "SectionHeader",
					"parentColType" : "nonrepetitive",
					"hidden" : chrNonRepetitive === 'Y'
							&& featurePayMap["TPL_382"] != undefined
							&& featurePayMap["TPL_382"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "nrApproveFlag",
					"colName" : getLabel("approve", "Approve"),
					"colType" : "SectionHeader",
					"parentColType" : "nonrepetitive",
					"hidden" : chrNonRepetitive === 'Y'
							&& featurePayMap["TPL_976"] != undefined
							&& featurePayMap["TPL_976"].canAuth == 'Y'
							? false
							: true
				}, {
					"colId" : "nrQuickApproveFlag",
					"colName" : getLabel("detailApprove", "Detail Approve"),
					"colType" : "SectionHeader",
					"parentColType" : "nonrepetitive",
					"hidden" : chrNonRepetitive === 'Y'
							&& featurePayMap["TPL_384"] != undefined
							&& featurePayMap["TPL_384"].canAuth == 'Y'
							? false
							: true
				}, {
					"colId" : "nrimportFlag",
					"colName" : getLabel("import", "Import"),
					"colType" : "SectionHeader",
					"parentColType" : "nonrepetitive",
					"hidden" : chrNonRepetitive === 'Y'
							&& featurePayMap["PYB_380"] != undefined
							&& featurePayMap["PYB_380"].canEdit == 'Y'
							? false
							: true
				}];
		if (granularData && granularData.length > 0)
			renderTemplateGranularPrivilegesPopup(columnModel, granularData,
					'granularTemplateDiv', getLabel(
							'templateGranularPrivilege',
							'Templates Granular Privileges'));
	}
}
function populateTemplateFeatureFeatureMap(privilegeData) {
	if (privilegeData) {
		$.each(privilegeData, function(index, feature) {
					var key = feature.featureId + "_" + feature.featureWeight;
					var rightValue;
					var rmserial = feature.rmSerial;
					featurePayMap[key] = feature;
				});
	}
}