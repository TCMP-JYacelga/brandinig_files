/**
 * Sample Column Model, User should have to structured the column model in this
 * way
 */
var actionsForWidget = ['Submit','Discard','Enable','Disable'];
var BANK_INTERFACE_GENERIC_COLUMN_MODEL = [
      
	    {
			"colId" : "clientDesc",
			"colHeader" : "Client",
			"hidden" : false
		},
		{
			"colId" : "interfaceName",
			"colHeader" : "Interface Name",
			"hidden" : false
		},  {
			"colId" : "interfaceType",
			"colHeader" : "Interface Category",
			"hidden" : false
		}, {
			"colId" : "interfaceFlavor",
			"colHeader" : "Interface Type",
			"hidden" : false
			
		}, {
			"colId" : "parentInterfaceName",
			"colHeader" : "Parent Interface",
			"hidden" : false
			
		},{
			"colId" : "interfaceMedium",
			"colHeader" : "Medium",
			"hidden" : false
		},{
			"colId" : "interfaceCateory",
			"colHeader" : "Category",
			"hidden" : false
		},{
			"colId" : "interfaceModule",
			"colHeader" : "Module Name",
			"hidden" : false
		},
		{
			"colId" : "requestStateDesc",
			"colHeader" : "Status",
			"hidden" : false
		}];

var CLIENT_INTERFACE_GENERIC_COLUMN_MODEL = [
      
	    {
			"colId" : "interfaceName",
			"colHeader" : "Interface Name",
			"hidden" : false
		},  {
			"colId" : "interfaceType",
			"colHeader" : "Interface Category",
			"hidden" : false
		}, {
			"colId" : "interfaceFlavor",
			"colHeader" : "Interface Type",
			"hidden" : false
			
		}, {
			"colId" : "parentInterfaceName",
			"colHeader" : "Parent Interface",
			"hidden" : false
			
		},{
			"colId" : "securityProfileId",
			"colHeader" : "Security Profile",
			"hidden" : false
		},{
			"colId" : "interfaceCateory",
			"colHeader" : "Category",
			"hidden" : false
		},{
			"colId" : "interfaceModule",
			"colHeader" : "Module Name",
			"hidden" : false
		},
		{
			"colId" : "requestStateDesc",
			"colHeader" : "Status",
			"hidden" : false
		}];		
		

var objBankInterfaceGridWidthMap =
		{
			"clientDesc" :150,
			"interfaceName" : 160,
			"interfaceType" : 100,
			"interfaceFlavor" : 90,
			"parentInterfaceName" : 160,
			//"securityProfileId" : 70,
			"interfaceMedium" : 70,
			"interfaceModule" : 140,
			"interfaceCateory" : 100,
			"requestStateDesc" : 100
		};		

var objClientInterfaceGridWidthMap =
		{
			"interfaceName" : 160,
			"interfaceType" : 100,
			"interfaceFlavor" : 90,
			"parentInterfaceName" : 160,
		 	"securityProfileId" : 180,
			"interfaceCateory" : 100,
			"interfaceModule" : 140,
			"requestStateDesc" : 100
		};
		
var arrActionColumnStatus = [['0', 'Draft'], ['1', 'Pending Submit'],
		['2', 'Pending My Approval'], ['3', 'Pending Approval'],
		['4', 'Pending Send'], ['5', 'Rejected'], ['6', 'On Hold'],
		['7', 'Sent To Bank'], ['8', 'Deleted'], ['9', 'Pending Repair'],
		['13', 'Debit Failed'], ['14', 'Debited'], ['15', 'Processed'],
		['18', 'Stopped'], ['19', 'For Stop Auth'], ['28', 'Debited'],
		['43', 'WareHoused'], ['75', 'Reversal Pending Auth'],
		['76', 'Reversal Aproved'], ['77', 'Reversal Rejected'],
		['78', 'Reversal Pending My Auth']];