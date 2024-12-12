function showExecutionSnapshot(record)
{
	var strTitle = getLabel('sweepSnapshot', 'Sweep Snapshot');
	$('#executionSnapShotView').dialog({
		autoOpen : false,
		maxHeight: 550,
		minHeight:156,
		width : 735,
		modal : true,
		resizable: false,
		draggable: false,
		open: function() {
				$( "#executionSnapShotView" ).dialog({ title: strTitle });
				setPopupFieldData(record);
				responseGrid = createResponseGrid(record);
		 }
	});
	$('#executionSnapShotView').dialog("open");
}

function setPopupFieldData(record)
{
	
	$("#agreementCode").text(record.get('REF_CODE'));
	$("#agreementCode").prop('title', record.get('REF_CODE'));
	
	$("#agreementName").text(record.get('AGREEMENT_NAME'));
	$("#agreementName").prop('title', record.get('AGREEMENT_NAME'));
	
	$("#executionMode").text(record.get('EXECUTION_MODE'));
	$("#executionMode").prop('title', record.get('EXECUTION_MODE'));
	
	$("#executionDate").text(record.get('EXECUTION_DATE') );
	$("#executionDate").prop('title', record.get('EXECUTION_DATE') );
	
}

function createResponseGrid(record)
{
	$(document).trigger('loadResponseSmartGrid',[record]);
}

var SWEEP_QUERY_DEFAULT_COLUMN_MODEL = [{
	"colId" : "CLIENT_NAME",
	"colHeader" : getLabel('cName','Company Name'),
	"sortable" : true,
	"colDesc" : "Company Name",
	"colSequence" : 1,
	"width" : 210,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "REF_CODE",
	"colHeader" : getLabel( 'agreementCode1', 'Agreement Code' ),
	"sortable" : true,
	"colDesc" : "Agreement Code",
	"colSequence" : 2,
	"width" : 148,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
},{
	"colId" : "NO_POST_STRUCTURE",
	"colHeader" : getLabel( 'noPostStructure', 'Live / Non Live' ),
	"sortable" : true,
	"colDesc" : "Live / Non Live",
	"colSequence" : 3,
	"width" : 148,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
},{
	"colId" : "EXECUTION_MODE",
	"colHeader" : getLabel('execMode','Execution Mode'),
	"sortable" : true,
	"colDesc" : "Execution Mode",
	"colSequence" : 4,
	"width" : 145,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "MOVEMENT_TYPE",
	"colHeader" : getLabel('freqType','Frequency Type'),
	"sortable" : true,
	"colDesc" : "Sweep Type",
	"colSequence" : 6,
	"width" : 200,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "EXECUTION_DATE",
	"colHeader" : getLabel('execD&T','Execution Date Time'),
	"sortable" : true,
	"colDesc" : "Execution Date Time",
	"colSequence" : 7,
	"width" : 200,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "EXECUTION_STATUS",
	"colHeader" : getLabel('execStatus','Execution Status'),
	"sortable" : true,
	"colDesc" : "Execution Status",
	"colSequence" : 8,
	"width" : 150,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "FAILURE_REASON",
	"colHeader" : getLabel('remarks','Remarks'),
	"sortable" : false,
	"colDesc" : "Remarks",
	"colSequence" : 9,
	"width" : 260,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}];

