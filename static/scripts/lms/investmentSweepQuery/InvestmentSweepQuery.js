var INVESTMENT_SWEEP_QUERY_COLUMN_MODEL = [ {
	"colId" : "positionDate",
	"colHeader" : getLabel('lblDate', 'Date'),
	"colDesc" : getLabel('lblDate', 'Date'),
	"locked" : false,
	"hidden" : false,
	"hideable" : true,
	"colSequence" : 1,
	width : 140
}, {
	"colId" : "cumulativeInvestmentAmount",
	"colDesc" : getLabel('lblInvestmentAmount', 'Investment Amount'),
	"colType" : "number",
	"colHeader" : getLabel('lblInvestmentAmount', 'Investment Amount'),
	"locked" : false,
	"hidden" : false,
	"hideable" : true,
	"colSequence" : 2,
	width : 300
}, {
	"colId" : "totalReturnedAmount",
	"colDesc" : getLabel('lblInvestmentRealized', 'Investment Realized'),
	"colType" : "number",
	"colHeader" : getLabel('lblInvestmentRealized', 'Investment Realized'),
	"locked" : false,
	"hidden" : false,
	"hideable" : true,
	"colSequence" : 3,
	width : 300
}, {
	"colId" : "investmentScheme",
	"colDesc" : getLabel('lblSchemeName', 'Scheme Name'),
	"colHeader" : getLabel('lblSchemeName', 'Scheme Name'),
	"locked" : false,
	"hidden" : false,
	"hideable" : true,
	"colSequence" : 4,
	width : 300
}];

function showExecutionSnapshot(record)
{
	var strTitle = 'Detail View';
	$('#executionSnapShotView').dialog({
		autoOpen : false,
		maxHeight : 550,
		minHeight : 156,
		width : 735,
		modal : true,
		resizable : false,
		draggable : false,
		open : function()
		{
			$("#executionSnapShotView").dialog({
				title : strTitle
			});
			setPopupFieldData(record);
			responseGrid = createResponseGrid(record);
		}
	});
	$('#executionSnapShotView').dialog("open");
}

function setPopupFieldData(record)
{
	$("#positionDate").text(record.get('positionDate'));
	$("#positionDate").prop('title', record.get('positionDate'));

	$("#openingPosition").text(record.get('openingPosition'));
	$("#openingPosition").prop('title', record.get('openingPosition'));
}

function createResponseGrid(record)
{
	$(document).trigger('loadResponseSmartGrid', [ record ]);
}
