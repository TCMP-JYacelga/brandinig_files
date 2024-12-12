/**
 * Sample Column Model, User should have to structured the column model in this
 * way
 */
var actionsForWidget = ['Submit','Discard','Enable','Disable'];
var BANK_GENERIC_COLUMN_MODEL = [
		{
			"colId" : "jobId",
			"colHeader" : getLabel( 'lbl.jobMonitoring.jobId', 'Job Id' ),
			"hidden" : false
		},
		{
			"colId" : "mediaDetails",
			"colHeader" : getLabel( 'lbl.jobMonitoring.fileName', 'File Name' ),
			"hidden" : false
		},		
		{
			"colId" : "parentExecutionId",
			"colHeader" : getLabel( 'lbl.jobMonitoring.parentExecutionId', 'Parent Execution Id' ),
			"hidden" : false
		},
		{
			"colId" : "jobType",
			"colHeader" : getLabel( 'lbl.jobMonitoring.jobType', 'Job Type' ),
			"hidden" : false
		},
		/*{
			"colId" : "scheduleRef",
			"colHeader" : getLabel( 'lbl.jobMonitoring.schRef', 'Schedule Reference' ),
			"hidden" : false
		},
		*/
		{
			"colId" : "jobSrcType",
			"colHeader" : getLabel( 'lbl.jobMonitoring.type', 'Type' ),
			"hidden" : false
		}, 
		{
			"colId" : "jobSrcName",
			"colHeader" :  getLabel( 'lbl.jobMonitoring.jobSrcName', 'Source Name' ),
			"hidden" : false
		},
		{
			"colId" : "jobSrcDescription",
			"colHeader" : getLabel( 'lbl.jobMonitoring.description', 'Description' ),
			"hidden" : false
		},
		{
			"colId" : "medium",
			"colHeader" : getLabel( 'lbl.jobMonitoring.medium', 'Medium' ),
			"hidden" : false
		},		
		{
			"colId" : "format",
			"colHeader" : getLabel( 'lbl.jobMonitoring.format', 'Format' ),
			"hidden" : false
		}, 
		{
			"colId" : "jobModuleName",
			"colHeader" :  getLabel( 'lbl.jobMonitoring.module', 'Module' ),
			"hidden" : false
		},
		{
			"colId" : "executionDate",
			"colHeader" : getLabel( 'lbl.jobMonitoring.executionDate', 'Execution Date' ),
			"hidden" : false
		},
		{
			"colId" : "createdDate",
			"colHeader" : getLabel( 'lbl.jobMonitoring.createdTime', 'Created Time' ),
			"hidden" : false
		},
		{
			"colId" : "completedDate",
			"colHeader" : getLabel( 'lbl.jobMonitoring.completedTime', 'Completed Time' ),
			"hidden" : false
		},
		{
			"colId" : "jobStatus",
			"colHeader" :getLabel( 'lbl.jobMonitoring.status', 'Status' ),
			"hidden" : false
		},
		{
			"colId" : "entityDesc",
			"colHeader" : getLabel( 'lbl.jobMonitoring.client', 'Client' ),
			"hidden" : true
		}
];

if(enableStatusRetry== 'Y')
{
	BANK_GENERIC_COLUMN_MODEL.push({
			"colId" : "txnAmount",
			"colHeader" : getLabel( 'lbl.jobMonitoring.txnAmount', 'Transaction Amount' ),
			"hidden" : true
		});
}
var objGridWidthMap =
		{
			//"entityDesc" : 150,
			"jobType" : 90,
			"jobId" : 110,
			"mediaDetails" : 200,
			"parentExecutionId" : 125,
			"scheduleRef" : 125,
			"jobSrcName" : 125,
			"jobSrcType" : 90,
			"medium" :120,
			"format" : 100,
			"module" : 100,
			"executionDate" : 150,
			"createdDate" : 150,
			"completedDate" : 150,
			"status" : 100,
			"entityDesc" : 100,
			"txnAmount" : 150,
			"jobSrcDescription":200
		};		

function ajaxError()
{
	alert( "AJAX error, please contact admin!" );
}