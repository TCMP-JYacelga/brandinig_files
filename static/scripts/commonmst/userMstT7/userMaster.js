var USER_GENERIC_COLUMN_MODEL =[];
if (entity_type === '0')
{	
	if (autousrcode != 'PRODUCT')		//Changes for SBSA-TPFA
	{
	 	USER_GENERIC_COLUMN_MODEL = [{
					"colId" : "corporationDesc",
					"colHeader" :  getLabel('corporationDesc','Company Name'),
					"colDesc"	: getLabel('corporationDesc','Company Name'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":1,
					"width" : 200
				}, {
					"colId" : "usrDescription",
					"colHeader" :  getLabel('userName','User Name'),
					"width" : 200,
					"colDesc"	: getLabel('userName','User Name'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":2
				}, {
					"colId" : (autousrcode != 'PRODUCT') ?  "ssoLoginId" : "usrCode",
					"colHeader" :  (autousrcode != 'PRODUCT') ? getLabel( 'ssoUserId', 'SSO User ID' ) : getLabel( 'loginId', 'Login ID' ),
					"width" : 200,
					"colDesc"	: getLabel('loginId','Login ID'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":3
				}, {
					"colId" : "usrCategory",
					"colHeader" :  getLabel('category','Role'),
					"width" : 200,
					"colDesc"	: getLabel('category','Role'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":4
				},{
					"colId" : "requestStateDesc",
					"colHeader" :  getLabel('status','Status'),
					"width" : 150,
					"sortable" : false,
					"colDesc"	: getLabel('status','Status'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":5
				},
				{
					"colId" : "usrLoggedOn",
					"colHeader" :  getLabel('loginStatus','Login/Locked Status'),
					"width" : 150,
					"colDesc"	: getLabel('loginStatus','Login Status'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":6
				},{
					"colId" : "userDisableFlag",
					"colHeader" :  getLabel('lblUserStatus','User Status'),
					"width" : 150,
					"colDesc"	: getLabel('lblUserStatus','User Status'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":7
				},/*,{
					"colId" : "makerId",
					"colHeader" :  getLabel('createdBy','Created By'),
					"colDesc"	: getLabel('createdBy','Created By'),
					"locked"	: false,
					"hidden"	: (autousrcode != 'PRODUCT') ? true : false ,
					"hideable"	: true,
					"colSequence":7
				},*/{
					"colId" : "makerStamp",
					"colHeader" :  getLabel('dateCreated','Date Created'),
					"width" : 150,
					"colDesc"	: getLabel('dateCreated','Date Created'),
					"locked"	: false,
					"hidden"	: true,
					"hideable"	: true,
					"colSequence":8
				}/*,{
					"colId" : "checkerId",
					"colHeader" :  getLabel('approvedBy','Approved By'),
					"colDesc"	: getLabel('approvedBy','Approved By'),
					"locked"	: false,
					"hidden"	: (autousrcode != 'PRODUCT') ? true : false ,
					"hideable"	: true,
					"colSequence":9
				}*/,{
					"colId" : "usrFirstName",
					"colHeader" :  getLabel('usrFirstName','User First Name'),
					"width" : 150,
					"colDesc"	: getLabel('usrFirstName','User First Name'),
					"locked"	: false,
					"hidden"	: true,
					"hideable"	: true,
					"colSequence":10
				},{
					"colId" : "usrLastName",
					"colHeader" :  getLabel('usrLastName','User Last Name'),
					"width" : 150,
					"colDesc"	: getLabel('usrLastName','User Last Name'),
					"locked"	: false,
					"hidden"	: true,
					"hideable"	: true,
					"colSequence":11
				},{
					"colId" : "department",
					"colHeader" :  getLabel('department','Department'),
					"width" : 150,
					"colDesc"	: getLabel('department','Department'),
					"locked"	: false,
					"hidden"	: true,
					"hideable"	: true,
					"colSequence":12
				},{
					"colId" : "usrLastLogon",
					"colHeader" : getLabel('lastAccess','Last Access Date/Time'), 
					"width" : 150,
					"colDesc"	: getLabel('lastAccess','Last Access Date/Time'),
					"locked"	: false,
					"hidden"	: true,
					"hideable"	: true,
					"colSequence":13
				},{
					"colId" : "isSelfAdmin",
					"colHeader" :  getLabel('adminIndicator','Admin Indicator'),
					"width" : 150,
					"colDesc"	: getLabel('adminIndicator','Admin Indicator'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":14
				},{
					"colId" : "authSyncStatus",
					"colHeader" : getLabel('authSyncStatus', 'Synchronization Status'),
					"width" : 200,
					"locked"	: false,
					"hidden" : false,
					"hideable"	: true,
					"sortable" : false,
					"colSequence":15
				}
				];
	}
	else {
	 	USER_GENERIC_COLUMN_MODEL = [{
					"colId" : "corporationDesc",
					"colHeader" :  getLabel('corporationDesc','Company Name'),
					"colDesc"	: getLabel('corporationDesc','Company Name'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":1,
					"width" : 200
				}, {
					"colId" : "usrDescription",
					"colHeader" :  getLabel('userName','User Name'),
					"width" : 200,
					"colDesc"	: getLabel('userName','User Name'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":2
				}, {
					"colId" : (autousrcode != 'PRODUCT') ?  "ssoLoginId" : "usrCode",
					"colHeader" :  (autousrcode != 'PRODUCT') ? getLabel( 'ssoUserId', 'SSO User ID' ) : getLabel( 'loginId', 'Login ID' ),
					"width" : 200,
					"colDesc"	: getLabel('loginId','Login ID'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":3
				}, {
					"colId" : "usrCategory",
					"colHeader" :  getLabel('category','Role'),
					"width" : 200,
					"colDesc"	: getLabel('category','Role'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":4
				},{
					"colId" : "requestStateDesc",
					"colHeader" :  getLabel('status','Status'),
					"width" : 150,
					"sortable" : false,
					"colDesc"	: getLabel('status','Status'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":5
				},{
					"colId" : "usrLoggedOn",
					"colHeader" :  getLabel('loginStatus','Login/Locked Status'),
					"width" : 150,
					"colDesc"	: getLabel('loginStatus','Login Status'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":6
				},{
					"colId" : "userDisableFlag",
					"colHeader" :  getLabel('lblUserStatus','User Status'),
					"width" : 150,
					"colDesc"	: getLabel('lblUserStatus','User Status'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":7
				},{
					"colId" : "makerId",
					"colHeader" :  getLabel('createdBy','Created By'),
					"colDesc"	: getLabel('createdBy','Created By'),
					"locked"	: false,
					"hidden"	: (autousrcode != 'PRODUCT') ? true : false ,
					"hideable"	: true,
					"colSequence":8
				},{
					"colId" : "makerStamp",
					"colHeader" :  getLabel('dateCreated','Date Created'),
					"width" : 150,
					"colDesc"	: getLabel('dateCreated','Date Created'),
					"locked"	: false,
					"hidden"	: true,
					"hideable"	: true,
					"colSequence":9
				},{
					"colId" : "checkerId",
					"colHeader" :  getLabel('approvedBy','Approved By'),
					"colDesc"	: getLabel('approvedBy','Approved By'),
					"locked"	: false,
					"hidden"	: (autousrcode != 'PRODUCT') ? true : false ,
					"hideable"	: true,
					"colSequence":10
				},{
					"colId" : "usrFirstName",
					"colHeader" :  getLabel('usrFirstName','User First Name'),
					"width" : 150,
					"colDesc"	: getLabel('usrFirstName','User First Name'),
					"locked"	: false,
					"hidden"	: true,
					"hideable"	: true,
					"colSequence":11
				},{
					"colId" : "usrLastName",
					"colHeader" :  getLabel('usrLastName','User Last Name'),
					"width" : 150,
					"colDesc"	: getLabel('usrLastName','User Last Name'),
					"locked"	: false,
					"hidden"	: true,
					"hideable"	: true,
					"colSequence":12
				},{
					"colId" : "department",
					"colHeader" :  getLabel('department','Department'),
					"width" : 150,
					"colDesc"	: getLabel('department','Department'),
					"locked"	: false,
					"hidden"	: true,
					"hideable"	: true,
					"colSequence":13
				},{
					"colId" : "usrLastLogon",
					"colHeader" : getLabel('lastAccess','Last Access Date/Time'), 
					"width" : 150,
					"colDesc"	: getLabel('lastAccess','Last Access Date/Time'),
					"locked"	: false,
					"hidden"	: true,
					"hideable"	: true,
					"colSequence":14
				},{
					"colId" : "isSelfAdmin",
					"colHeader" :  getLabel('adminIndicator','Admin Indicator'),
					"width" : 150,
					"colDesc"	: getLabel('adminIndicator','Admin Indicator'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":15
				},{
					"colId" : "authSyncStatus",
					"colHeader" : getLabel('authSyncStatus', 'Synchronization Status'),
					"width" : 200,
					"locked"	: false,
					"hidden" : false,
					"hideable"	: true,
					"sortable" : false,
					"colSequence":15
				}
				];
	}		//autousrcode === 'PRODUCT'
}				
else		 //(entity_type != '0')
{
	if (autousrcode != 'PRODUCT')		//Changes for SBSA-TPFA
	{	
			USER_GENERIC_COLUMN_MODEL = [{
						"colId" : "usrDescription",
						"colHeader" :  getLabel('userName','User Name'),
						"width" : 200,
						"colDesc"	: getLabel('userName','User Name'),
						"locked"	: false,
						"hidden"	: false,
						"hideable"	: true,
						"colSequence":1
					}, {
						"colId" : (autousrcode != 'PRODUCT') ?  "ssoLoginId" : "usrCode",
						"colHeader" :  (autousrcode != 'PRODUCT') ? getLabel( 'ssoUserId', 'SSO User ID' ) : getLabel('loginId','Login ID'),
						"width" : 200,
						"colDesc"	: getLabel('loginId','Login ID'),
						"locked"	: false,
						"hidden"	: false,
						"hideable"	: true,
						"colSequence":2
					}, {
						"colId" : "usrCategory",
						"colHeader" :  getLabel('category','Role'),
						"width" : 200,
						"colDesc"	: getLabel('category','Role'),
						"locked"	: false,
						"hidden"	: false,
						"hideable"	: true,
						"colSequence":3
					},{
						"colId" : "requestStateDesc",
						"colHeader" :  getLabel('status','Status'),
						"sortable" : false,
						"width" : 150,
						"colDesc"	: getLabel('status','Status'),
						"locked"	: false,
						"hidden"	: false,
						"hideable"	: true,
						"colSequence":4
					},{
						"colId" : "usrLoggedOn",
						"colHeader" :  getLabel('loginStatus','Login/Locked Status'),
						"width" : 70,
						"hidden" : false,
						"colDesc"	: getLabel('loginStatus','Login Status'),
						"locked"	: false,
						"hideable"	: true,
						"colSequence":5
					},{
						"colId" : "userDisableFlag",
						"colHeader" :  getLabel('lblUserStatus','User Status'),
						"width" : 150,
						"colDesc"	: getLabel('lblUserStatus','User Status'),
						"locked"	: false,
						"hidden"	: false,
						"hideable"	: true,
						"colSequence":6
					}/*,{
						"colId" : "makerId",
						"colHeader" :  getLabel('createdBy','Created By'),
						"colDesc"	: getLabel('createdBy','Created By'),
						"locked"	: false,
						"hidden" 	: (autousrcode != 'PRODUCT') ? true : false ,
						"hideable"	: true,
						"colSequence":6
					}*/,{
						"colId" : "makerStamp",
						"colHeader" :  getLabel('dateCreated','Date Created'),
						"hidden" : true,
						"colDesc"	: getLabel('dateCreated','Date Created'),
						"locked"	: false,
						"hideable"	: true,
						"colSequence":7
					}/*,{
						"colId" : "checkerId",
						"colHeader" :  getLabel('approvedBy','Approved By'),
						"colDesc"	: getLabel('approvedBy','Approved By'),
						"locked"	: false,
						"hidden" 	: (autousrcode != 'PRODUCT') ? true : false ,
						"hideable"	: true,
						"colSequence":8
					}*/,{
						"colId" : "usrFirstName",
						"colHeader" :  getLabel('usrFirstName','User First Name'),
						"width" : 150,
						"hidden" : true,
						"colDesc"	: getLabel('usrFirstName','User First Name'),
						"locked"	: false,
						"hideable"	: true,
						"colSequence":9
					},{
						"colId" : "usrLastName",
						"colHeader" :  getLabel('usrLastName','User Last Name'),
						"width" : 150,
						"hidden" : true,
						"colDesc"	: getLabel('usrLastName','User Last Name'),
						"locked"	: false,
						"hideable"	: true,
						"colSequence":10
					},{
						"colId" : "department",
						"colHeader" :  getLabel('department','Department'),
						"width" : 150,
						"hidden" : true,
						"colDesc"	: getLabel('department','Department'),
						"locked"	: false,
						"hideable"	: true,
						"colSequence":11
					},{
						"colId" : "usrLastLogon",
						"colHeader" :  getLabel('lastAccess','Last Access Date/Time'),
						"width" : 150,
						"hidden" : true,
						"colDesc"	: getLabel('lastAccess','Last Access Date/Time'),
						"locked"	: false,
						"hideable"	: true,
						"colSequence":12
					},{
						"colId" : "isSelfAdmin",
						"colHeader" :  getLabel('adminIndicator','Admin Indicator'),
						"width" : 150,
						"hidden" : false,
						sortable : false,
						"colDesc"	: getLabel('adminIndicator','Admin Indicator'),
						"locked"	: false,
						"hideable"	: true,
						"colSequence":13
				    },{
						"colId" : "authSyncStatus",
						"colHeader" : getLabel('authSyncStatus', 'Synchronization Status'),
						"width" : 200,
						"locked"	: false,
						"hidden" : false,
						"hideable"	: true,
						"sortable" : false,
						"colSequence":14
					}
				];
	}
	else {
			USER_GENERIC_COLUMN_MODEL = [{
					"colId" : "usrDescription",
					"colHeader" :  getLabel('userName','User Name'),
					"width" : 200,
					"colDesc"	: getLabel('userName','User Name'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":1
				}, {
					"colId" : (autousrcode != 'PRODUCT') ?  "ssoLoginId" : "usrCode",
					"colHeader" :  (autousrcode != 'PRODUCT') ? getLabel( 'ssoUserId', 'SSO User Id' ) : getLabel( 'loginId', 'Login ID' ),
					"width" : 200,
					"colDesc"	: getLabel('loginId','Login ID'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":2
				}, {
					"colId" : "usrCategory",
					"colHeader" :  getLabel('category','Role'),
					"width" : 200,
					"colDesc"	: getLabel('category','Role'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":3
				},{
					"colId" : "requestStateDesc",
					"colHeader" :  getLabel('status','Status'),
					"sortable" : false,
					"width" : 150,
					"colDesc"	: getLabel('status','Status'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":4
				},{
					"colId" : "usrLoggedOn",
					"colHeader" :  getLabel('loginStatus','Login/Locked Status'),
					"width" : 70,
					"hidden" : false,
					"colDesc"	: getLabel('loginStatus','Login Status'),
					"locked"	: false,
					"hideable"	: true,
					"colSequence":5
				},{
					"colId" : "userDisableFlag",
					"colHeader" :  getLabel('lblUserStatus','User Status'),
					"width" : 150,
					"colDesc"	: getLabel('lblUserStatus','User Status'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":6
				},{
					"colId" : "makerId",
					"colHeader" :  getLabel('createdBy','Created By'),
					"colDesc"	: getLabel('createdBy','Created By'),
					"locked"	: false,
					"hidden" 	: (autousrcode != 'PRODUCT') ? true : false ,
					"hideable"	: true,
					"colSequence":7
				},{
					"colId" : "makerStamp",
					"colHeader" :  getLabel('dateCreated','Date Created'),
					"hidden" : true,
					"colDesc"	: getLabel('dateCreated','Date Created'),
					"locked"	: false,
					"hideable"	: true,
					"colSequence":8
				},{
					"colId" : "checkerId",
					"colHeader" :  getLabel('approvedBy','Approved By'),
					"colDesc"	: getLabel('approvedBy','Approved By'),
					"locked"	: false,
					"hidden" 	: (autousrcode != 'PRODUCT') ? true : false ,
					"hideable"	: true,
					"colSequence":9
				},{
					"colId" : "usrFirstName",
					"colHeader" :  getLabel('usrFirstName','User First Name'),
					"width" : 150,
					"hidden" : true,
					"colDesc"	: getLabel('usrFirstName','User First Name'),
					"locked"	: false,
					"hideable"	: true,
					"colSequence":10
				},{
					"colId" : "usrLastName",
					"colHeader" :  getLabel('usrLastName','User Last Name'),
					"width" : 150,
					"hidden" : true,
					"colDesc"	: getLabel('usrLastName','User Last Name'),
					"locked"	: false,
					"hideable"	: true,
					"colSequence":11
				},{
					"colId" : "department",
					"colHeader" :  getLabel('department','Department'),
					"width" : 150,
					"hidden" : true,
					"colDesc"	: getLabel('department','Department'),
					"locked"	: false,
					"hideable"	: true,
					"colSequence":12
				},{
					"colId" : "usrLastLogon",
					"colHeader" :  getLabel('lastAccess','Last Access Date/Time'),
					"width" : 150,
					"hidden" : true,
					"colDesc"	: getLabel('lastAccess','Last Access Date/Time'),
					"locked"	: false,
					"hideable"	: true,
					"colSequence":13
				},{
					"colId" : "isSelfAdmin",
					"colHeader" :  getLabel('adminIndicator','Admin Indicator'),
					"width" : 150,
					"hidden" : false,
					sortable : false,
					"colDesc"	: getLabel('adminIndicator','Admin Indicator'),
					"locked"	: false,
					"hideable"	: true,
					"colSequence":14
			    },{
						"colId" : "authSyncStatus",
						"colHeader" : getLabel('authSyncStatus', 'Synchronization Status'),
						"width" : 200,
						"locked"	: false,
						"hidden" : false,
						"hideable"	: true,
						"sortable" : false,
						"colSequence":14
				}	
			];
	}
		
}

var arrSortByUserFields = [{
						"colId" : "usrDescription",
						"colHeader" :  getLabel('userName','User Name')
					}, {
						"colId" : (autousrcode != 'PRODUCT') ?  "ssoLoginId" : "usrCode",
						"colHeader" : (autousrcode != 'PRODUCT') ? getLabel( 'ssoUserId', 'SSO User ID' ) : getLabel( 'loginId', 'Login ID' )
					}, {
						"colId" : "usrCategory",
						"colHeader" : getLabel('status','Role')
					},{
						"colId" : "requestStateDesc",
						"colHeader" : getLabel('headUser','Status')
					}];

// Please do not modify below variable unless working on reports
var arrSortColumnReport	 = {
		'usrDescription' : 'usrDescription',
		'usrCode' : 'usrCode',
		'usrCategory' : 'usrCategory',
		'requestStateDesc' : 'requestStateDesc',
		'makerId' : 'makerId',
		'makerStamp' : 'makerStamp',
		'checkerId' : 'checkerId',
		'usrLoggedOn' : 'checkLoginStatus',
		'userDisableFlag':'userDisableFlag',
	    'usrFirstName' : 'usrFirstName',	
	    'usrLastName' :	'usrLastName',	
	    'department' : 'department',	
	    'usrLastLogon' : 'usrLastLogon'
}; 
var arrStatus = 	[
                          	  {
                          		"code": "0",
                          		"desc": "New"
                          	  },
                          	  {
                          		"code": "3",
                          		"desc": "Approved"
                          	  },
                          	  {
                          		"code": "1",
                          		"desc": "Modified"
                          	  },	  
                          	  {
                          		"code": "4",
                          		"desc": "Enable Request"
                          	  },
                          	  {
                          		"code": "5",
                          		"desc": "Suspend Request"
                          	  },
                          	  {
                          		"code": "11",
                          		"desc": "Suspended"
                          	  },
                          	  {
                          		"code": "7",
                          		"desc": "New Rejected"
                          	  },
                          	  {
                          		"code": "8",
                          		"desc": "Modified Rejected"
                          	  },	  
                          	  {
                          		"code": "9",
                          		"desc": "Suspend Request Rejected"
                          	  },
                          	  {
                          		"code": "10",
                          		"desc": "Enable Request Rejected"
                          	  },
                          	  {
                            	"code": "12",
                            	"desc": "Submitted"
                              }
                          	];
function generateUserFilterArray(arrFilter) {
	var parsedArray = [], objJson = null, value1 = '', value2 = '', displayValue1 = '', displayValue2 = '' , operator = '' , formattedDateVal1 = '',displayValueCount = '',
	formattedDateVal2 = '', dtFormat = '';
	arrFilter = arrFilter || [];
	dtFormat = strExtApplicationDateFormat ? strExtApplicationDateFormat : "m/d/Y";
	$.each(arrFilter, function(index, cfgFilter) {
				objJson = {
					"fieldId" : cfgFilter.field || cfgFilter.paramName,
					"fieldLabel" : cfgFilter.fieldLabel || cfgFilter.paramFieldLable,
					"fieldObjData" : cfgFilter
				};
				operator = cfgFilter.operatorValue || cfgFilter.operator;
				value1 = cfgFilter.value1 || cfgFilter.paramValue1;
				value2 = cfgFilter.value2 || cfgFilter.paramValue2;
				displayValue1 = cfgFilter.displayValue1;
				displayValue2 = cfgFilter.displayValue2;
				switch (operator) {
				    case 'le' : 
				    	if(cfgFilter.dataType === 1 || cfgFilter.dataType === 'D'){
				    		formattedDateVal1 = Ext.util.Format.date(Ext.Date
									.parse(value1, 'Y-m-d'),
									dtFormat);
				    		
							objJson["fieldValue"] = formattedDateVal1 ;
							objJson["fieldTipValue"] = formattedDateVal1 ;
				    	}
				    	break;
					case 'bt' :
						if (cfgFilter.dataType === 2) {
							objJson["fieldValue"] = value1 + ' - '
									+ value2;
							objJson["fieldTipValue"] = value1 + ' - ' + value2;
						} else if (cfgFilter.dataType === 1 || cfgFilter.dataType === 'D') {
							formattedDateVal1 = Ext.util.Format.date(Ext.Date
									.parse(value1, 'Y-m-d'),
									dtFormat);
							
							formattedDateVal2 = Ext.util.Format.date(Ext.Date
									.parse(value2, 'Y-m-d'),
									dtFormat);
							
							objJson["fieldValue"] = formattedDateVal1 + ' - '
									+ formattedDateVal2;
							objJson["fieldTipValue"] = formattedDateVal1 + ' - '
							+ formattedDateVal2;
						}
						break;
					case 'st' :
						// TODO : Sorting handling to be done
						break;
					case 'lk' :
					case 'eq' :
						if (cfgFilter.displayType === 5 ||cfgFilter.displayType === 8 || cfgFilter.displayType === 12 || cfgFilter.displayType === 13){
							objJson["fieldValue"] = displayValue1;
							objJson["fieldTipValue"] = displayValue1;
						}
						else if(cfgFilter.displayType === 2 || cfgFilter.dataType === 2){
							objJson["fieldValue"] = ' = ' + value1;
							objJson["fieldTipValue"] = ' = ' + value1;
						}
						else if (cfgFilter.dataType=='D'){
							formattedDateVal1 = Ext.util.Format.date(Ext.Date
									.parse(value1, 'Y-m-d'),
									dtFormat);
							objJson["fieldValue"] = formattedDateVal1 ;
							objJson["fieldTipValue"] = formattedDateVal1;
						}
						else{
							objJson["fieldValue"] = value1;
							objJson["fieldTipValue"] = value1;
						}
						break;
					case 'gt' :
						objJson["fieldValue"] = ' > ' + value1;
						objJson["fieldTipValue"] = ' > ' + value1;
						break;
					case 'gte' :
						objJson["fieldValue"] = ' >= ' + value1;
						objJson["fieldTipValue"] = ' >= ' + value1;
						break;
					case 'lt' :
						objJson["fieldValue"] = ' < ' + value1;
						objJson["fieldTipValue"] = ' < ' + value1;
						break;
					case 'lte' :
						objJson["fieldValue"] = ' <= ' + value1;
						objJson["fieldTipValue"] = ' <= ' + value1;
						break;
					case 'in' :
						displayValueCount = getValueDisplayCount(displayValue1);
						if(displayValueCount > 2){
							objJson["fieldValue"] = displayValueCount+' Selected';
							objJson["fieldTipValue"] = 'In ( ' + displayValue1 + ')';
							
						}
						else{
							objJson["fieldValue"] = 'In ( ' + displayValue1 + ')';
							objJson["fieldTipValue"] = 'In ( ' + displayValue1 + ')';
						}
						break;
					case 'statusFilterOp' :
						displayValueCount = getValueDisplayCount(displayValue1);
						if(displayValueCount > 2){
							objJson["fieldValue"] = displayValueCount+' '+getLabel('selected','Selected');
							objJson["fieldTipValue"] = getLabel('lblFltrIn','In')+' ( ' + displayValue1 + ')';
							
						}
						else{
							objJson["fieldValue"] = getLabel('lblFltrIn','In')+' ( ' + displayValue1 + ')';
							objJson["fieldTipValue"] = getLabel('lblFltrIn','In')+' ( ' + displayValue1 + ')';
						}
						break;
				}
				parsedArray.push(objJson);
			});
	return parsedArray;
}