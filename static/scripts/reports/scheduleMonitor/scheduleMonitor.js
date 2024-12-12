/**
 * Sample Column Model, User should have to structured the column model in this
 * way
 */
var actionsForWidget = ['Submit','Discard','Enable','Disable'];
var BANK_GENERIC_COLUMN_MODEL = [
		{
			"colId" : "entityDesc",
			"colHeader" : getLabel( 'lbl.scheduleMonitoring.client', 'Company Name' ),
			"hidden" : true
		},
		 {
			"colId" : "schModuleName",
			"colHeader" : getLabel( 'lbl.scheduleMonitoring.module', 'Module' ),
			"hidden" : false
		},
		{
			"colId" : "scheduleName",
			"colHeader" : getLabel( 'lbl.scheduleMonitoring.scheduleName', 'Schedule Name' ),
			"hidden" : false
		},
		{
			"colId" : "schSrcName",
			"colHeader" : getLabel( 'lbl.scheduleMonitoring.schSrcName', 'Source Name' ),
			"hidden" : false
		},
		{
			"colId" : "schSrcDescription",
			"colHeader" : getLabel( 'lbl.scheduleMonitoring.schDesc', 'Description' ),
			"hidden" : false
		},
		{
			"colId" : "schSrcType",
			"colHeader" : getLabel( 'lbl.scheduleMonitoring.schSrcType', 'Type' ),
			"hidden" : false
		}, 
		/*{
			"colId" : "schMode",
			"colHeader" : "Mode",
			"hidden" : false
		},
		*/		
		{
			"colId" : "formatSchNextGenDate",
			"colHeader" : getLabel( 'lbl.scheduleMonitoring.formatSchNextGenDate', 'Next Execution Time' ),
			"hidden" : false
		}, 
		{
			"colId" : "maxThreadCount",
			"colHeader" : getLabel( 'lbl.scheduleMonitoring.maxThreadCount', '# Threads' ),
			"hidden" : false
		},
		{
			"colId" : "schDelOutput",
			"colHeader" : getLabel( 'lbl.scheduleMonitoring.schDelOutput', 'Protocol' ),
			"hidden" : false
		},
		{
			"colId" : "scheduleStatus",
			"colHeader" : getLabel( 'lbl.scheduleMonitoring.scheduleStatus', 'Status' ),
			"hidden" : false
		}
];
var objGridWidthMap =
		{
			//"entityDesc" : 150,
			"reportName" : 250,
			"reportDesc" : 260,
			"reportTypeDesc" : 200,
			"scheduleCount" : 100,
			//"securityProfile" : 120,
			//"pregen" : 100,
			"schModuleName" : 120,
			"itemsInQueue" :120,
			"maxThreadCount" : 90,
			"schDelOutput" : 120,
			"schSrcType" : 100,
			"schMode" : 100,
			"scheduleStatus" : 100,
			"schId" : 125,
			"schSrcDescription":200,
			"schSrcName":125
		};		

function ajaxError()
{
	alert( "AJAX error, please contact admin!" );
}