function paintGranularPopups() {
	//if (brServiceEnable == true)
	//	createBRGranularPopupData();
	if (payServiceEnable == true) {
		createGranularPopupData();
		createTemplateGranularPopupData();
		createReversalGranularPopupData();
		createSIGranularPopupData();
	}
//	if (loanServiceEnable == true)
//		createLoanGranularPopupData();
//	if (positivePayServiceEnable == true)
//		createPositivePayGranularPopupData();
//	if (checkServiceEnable == true)
//		createChecksGranularPopupData();
}

function createGranularPopupCell(strLabel, width) {
	var objTableHeaderCell = $('<td>').addClass('view-grid-header-text').attr(
			'style', 'min-width: 90px !important;max-width: 90px !important;')
			.text(strLabel);
	return objTableHeaderCell;
}
function createGranularSubSectionPopupCell(strLabel, width) {
	var objTableHeaderCell = $('<td>').addClass('view-grid-header-text').attr(
			'style', 'min-width: 120px !important;').text(strLabel);
	//var objTableHeaderCell = $('<td>').addClass('view-grid-header-text').text(strLabel);
	return objTableHeaderCell;
}
function createGranularPopupCheckbox(strValue) {
	strHtml = strValue === 'Y' ? '<i class="fa fa-check"></i>' : '';
	var objTableHeaderCell = $('<td>').addClass('view-grid-header-text').attr(
			'style', 'min-width: 90px !important;max-width: 90px !important;')
			.html(strHtml);
	return objTableHeaderCell;
}
// Temporary

function isHiddenElementNotNull(object) {
	if (typeof object !== undefined && object !== null && object.value) {
		return true;
	}
	return false;
}

function renderCommonGranularPrivilegesPopup(columnModel, data, renderToDiv, strSectionLabel) {

	var intColCount = 0;
	// Create Table Header
	var objTable = $("<table>").addClass('view-grid').attr('style',
			'width:100%');
			
	for (i in columnModel) {
		var objColumn = columnModel[i];
		if(!objColumn.hidden) intColCount++;
	}
	
	var objHeaderRow = $("<tr>").addClass('view-grid-section-header');
	var objHeaderCell = $("<td>").addClass('view-grid-section-header').attr('colspan',intColCount)
			.text(strSectionLabel);
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
				$(objHeaderCell).attr('colspan', '2');
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

	if('granularBrDiv'===renderToDiv){
		$('#granularBrDiv').attr('style','max-width:'+$('#brPrivilegesParentDiv').width()+' !important;overflow-x:auto; width: 100%;');
	}
	
	$(objTable).appendTo($('#' + renderToDiv));
	
	
		
}