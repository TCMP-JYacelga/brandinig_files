/**
 * Sample Column Model, User should have to structured the column model in this
 * way
 */
var actionsForWidget = ['Submit','Discard','Enable','Disable'];
var BANK_INTERFACE_GENERIC_COLUMN_MODEL = [
      
	    /*{
			"colId" : "clientDesc",
			"colHeader" : "Client",
			"hidden" : false
		},
		*/{
			"colId" : "interfaceName",
			"colHeader" : getLabel('interfaceName','Interface Code'),
			"hidden" : false
		},  {
			"colId" : "interfaceType",
			"colHeader" : getLabel('type','Interface Type'),
			"hidden" : false
		}, {
			"colId" : "interfaceFlavor",
			"colHeader" : getLabel('flavor','Flavor'),
			"hidden" : false
			
		}, {
			"colId" : "parentInterfaceName",
			"colHeader" : getLabel('parentInterface','Parent Interface'),
			"hidden" : false
			
		},{
			"colId" : "bankSecurityProfileId",
			"colHeader" : getLabel('securityProfile','Security Profile'),
			"hidden" : false
		},{
			"colId" : "interfaceMedium",
			"colHeader" : getLabel('dataStore','Medium'),
			"hidden" : false
		},{
			"colId" : "interfaceCateory",
			"colHeader" : getLabel('category','Category'),
			"hidden" : false
		},{
			"colId" : "interfaceModule",
			"colHeader" : getLabel('moduleName','Module Name'),
			"hidden" : false
		},
		{
			"colId" : "requestStateDesc",
			"colHeader" : getLabel('status','Status'),
			"hidden" : false
		}];

var CLIENT_INTERFACE_GENERIC_COLUMN_MODEL = [
      
	    {
			"colId" : "interfaceName",
			"colHeader" : getLabel('interfaceName','Interface Name'),
			"hidden" : false
		},  {
			"colId" : "interfaceType",
			"colHeader" :  getLabel('type','Interface Type'),
			"hidden" : false
		}, {
			"colId" : "interfaceFlavor",
			"colHeader" : getLabel('flavor','Flavor'),
			"hidden" : false
			
		}, {
			"colId" : "parentInterfaceName",
			"colHeader" : getLabel('parentInterface','Parent Interface'),
			"hidden" : false
			
		},{
			"colId" : "securityProfileId",
			"colHeader" : getLabel('securityProfile','Security Profile'),
			"hidden" : false
		},{
			"colId" : "interfaceCateory",
			"colHeader" : getLabel('category','Category'),
			"hidden" : false
		},{
			"colId" : "interfaceModule",
			"colHeader" :  getLabel('moduleName','Module Name'),
			"hidden" : false
		},
		{
			"colId" : "requestStateDesc",
			"colHeader" : getLabel('status','Status'),
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
		
function generateUserFilterArray(arrFilter) {
	var parsedArray = [], objJson = null, value1 = '',  operator = '';
	arrFilter = arrFilter || [];
	$.each(arrFilter, function(index, cfgFilter) {
		       if(cfgFilter.paramName != 'user')
			   {
				objJson = {
					"fieldId" : cfgFilter.field || cfgFilter.paramName,
					"fieldLabel" : cfgFilter.fieldLabel || cfgFilter.paramFieldLable,
					"fieldObjData" : cfgFilter
				};
				operator = cfgFilter.operatorValue || cfgFilter.operator;
				value1 = cfgFilter.value1 || cfgFilter.paramValue1;
				value2 = cfgFilter.value2 || cfgFilter.paramValue2;
				if(cfgFilter.paramName != 'isSubmitted' && cfgFilter.paramName != 'validFlag' ){
					
				switch (operator) {
				   case 'in' :
						objJson["fieldValue"] = value1;
						objJson["fieldTipValue"] = value1;
					break;
					case 'eq' :
					    if(value1 === 'U')
							value1 = "Uploads";
						else if(value1 === 'D')
							value1 = "Downloads";
						objJson["fieldValue"] = value1;
						objJson["fieldTipValue"] = value1;
					break;
					}
				
				parsedArray.push(objJson);
				}
			   }
			});
	return parsedArray;
}