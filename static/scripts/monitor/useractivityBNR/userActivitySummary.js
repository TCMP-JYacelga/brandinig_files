var objDefaultGridViewPref =
[
	{
		"pgSize" : 50,
		"gridCols" :
		[
			{
				"colId" : "userCode",
				"colDesc" : getLabel('lbl.userActivity.grid.userCode', 'User ID')
			},
			{
				"colId" : "userName",
				"colDesc" : getLabel('lbl.userActivity.grid.userName', 'User Name')
			},
			{
				"colId" : "userCategory",
				"colDesc" : getLabel('lbl.userActivity.grid.userCategory', 'User Category')
			},
			{
				"colId" : "companyName",
				"colDesc" : getLabel('lbl.userActivity.grid.client', 'Company Name')
			},
			{
				"colId" : "loginTime",
				"colDesc" : getLabel('lbl.userActivity.grid.lastLoginTime', 'Last Login Time')
			},
			{
				"colId" : "logoutTime",
				"colDesc" : getLabel('lbl.userActivity.grid.lastLogoutTime', 'Last Logout Time')
			},
			{
				"colId" : "userType",
				"colHeader" : getLabel('lbl.userActivity.grid.ussrType', 'User Type')
			}]
	}
];

var USER_ACTIVITY_GENERIC_COLUMN_MODEL = [
            {
				"colId" : "userCode",
				"colHeader" : (clientSso == 'Y' && autousrcode != 'PRODUCT') ? getLabel('lbl.userActivity.grid.userCodeSso', 'SSO User ID') : getLabel('lbl.userActivity.grid.userCode', 'Login ID')
			},
			{
				"colId" : "userName",
				"colHeader" : getLabel('lbl.userActivity.grid.userName', 'User Name')
			},
			{
				"colId" : "userCategory",
				"colHeader" : getLabel('lbl.userActivity.grid.userCategory', 'User Category')
			},
			{
				"colId" : "companyName",
				"colHeader" : getLabel('lbl.userActivity.grid.client', 'Company Name')
			},
			{
				"colId" : "loginTime",
				"colHeader" : getLabel('lbl.userActivity.grid.lastLoginTime', 'Last Login Time')
			},
			{
				"colId" : "logoutTime",
				"colHeader" : getLabel('lbl.userActivity.grid.lastLogoutTime', 'Last Login Time')
			},
			{
				"colId" : "userType",
				"colHeader" : getLabel('lbl.userActivity.grid.ussrType', 'User Type')
			}
			];

var EVENTLOG_GENERIC_COLUMN_MODEL = [{
	"colId" : "eventTime",
	"colHeader" : getLabel('lbl.useractivity.lbl.eventLog.grid.dateTime', 'Date Time'),
	width : 150,
	"hidden" : false,
	"colType" : 'action',
	"locked" : true,
	"fnColumnRenderer": function(value, meta, record, rowIndex, colIndex, store,
			view, colId){
		return record.data.eventTime;
	} 
}, {
	"colId" : "userCode",
	"colHeader" :(clientSso == 'Y' && autousrcode != 'PRODUCT') ?  getLabel('lbl.eventLog.grid.UserIdSso', 'SSO User IDD') : getLabel('lbl.eventLog.grid.UserId', 'Login IDD') ,
	"hidden" : false
}, {
	"colId" : "userName",
	"colHeader" : getLabel('lbl.userActivity.grid.userName', 'User Name'),
	"hidden" : false
},{
	"colId" : "channel",
	"colHeader" : getLabel('lbl.eventLog.grid.Channel', 'Channel')
}, {
	"colId" : "userMessage",
	"colHeader" : getLabel('lbl.eventLog.grid.userMessage', 'User Message'),
	 width : 250,
	"hidden" : false
}, {
	"colId" : "module",
	"colHeader" : getLabel('lbl.eventLog.grid.module', 'Module'),
	"hidden" : false,
	width : 150
}, {
	"colId" : "actionTaken",
	"colHeader" : getLabel('lbl.eventLog.grid.action', 'Action'),
	"hidden" : false,
	"sortable" : false
}, {
	"colId" : "page",
	"colHeader" : getLabel('lbl.eventLog.grid.page', 'Page'),
	"hidden" : false,
	width : 150
}, {
	"colId" : "clientId",
	"colHeader" : getLabel('lbl.eventLog.grid.company', 'Company Name'),
	"hidden" : true
}, {
	"colId" : "userCategory",
	"colHeader" : getLabel('lbl.eventLog.grid.Role', 'Role'),
	"hidden" : true
}, {
	"colId" : "ipAdress",
	"colHeader" : getLabel('lbl.eventLog.grid.ipAdress', 'IP Address'),
	"hidden" : true
}, {
	"colId" : "isAdmin",
	"colHeader" : getLabel('lbl.eventLog.grid.isAdmin', 'User Type'),
	"hidden" : true
}, {
	"colId" : "trackingNumber",
	"colHeader" : getLabel('lbl.eventLog.grid.trackingNumber', 'Tracking Number'),
	"hidden" : true
}];

if (!isClientUser()) {
	EVENTLOG_GENERIC_COLUMN_MODEL.push({
		"colId" : "emulatingUserId",
		"colHeader" : getLabel('lbl.eventLog.grid.emulatingUserId', 'Emulating User ID'),
		"hidden" : true
	}, {
		"colId" : "department",
		"colHeader" : getLabel('lbl.eventLog.grid.Department', 'Department'),
		"hidden" : true
	});
}


var arrActionColumnStatus = [['0', 'Draft'], ['1', 'Pending Submit'],
                     		['2', 'Pending My Approval'], ['3', 'Pending Approval'],
                     		['4', 'Pending Send'], ['5', 'Rejected'], ['6', 'On Hold'],
                     		['7', 'Sent To Bank'], ['8', 'Deleted'], ['9', 'Pending Repair'],
                     		['13', 'Debit Failed'], ['14', 'Debited'], ['15', 'Processed'],
                     		['18', 'Stopped'], ['19', 'For Stop Auth'],
                     		['43', 'WareHoused'], ['75', 'Reversal Pending Auth'],
                     		['76', 'Reversal Aproved'], ['77', 'Reversal Rejected'],
                     		['78', 'Reversal Pending My Auth']];


function checkInfinity(intFilterDays){
	if(intFilterDays == '0' || Ext.isEmpty(intFilterDays)) { 
		return true; }
}

function geteventLogDateDropDownItems(filterType,buttonIns){
	var arrDropdownItem = [
		];
	if (intFilterDays >= 1 || checkInfinity(intFilterDays))
		arrDropdownItem.push({
					text : getLabel('today', 'Today'),
					btnId : 'btnToday',
					btnValue : '1',
					handler : function(btn, opts) {
						$(document).trigger("dateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (Today)");
					}
		});	
	if (intFilterDays >= 2 || checkInfinity(intFilterDays))
		arrDropdownItem.push({
					text : getLabel('yesterday', 'Yesterday'),
					btnId : 'btnYesterday',
					btnValue : '2',
					handler : function(btn, opts) {
						$(document).trigger("dateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (Yesterday)");
					}
		});	
	if (intFilterDays >= 7 || checkInfinity(intFilterDays))
		arrDropdownItem.push({
					text : getLabel('thisweek', 'This Week'),
					btnId : 'btnThisweek',
					btnValue : '3',
					handler : function(btn, opts) {
						$(document).trigger("dateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (This Week)");
					}
		});	
	if (intFilterDays >= 14 || checkInfinity(intFilterDays))
		arrDropdownItem.push({
					text : getLabel('lastweektodate', 'Last Week To Date'),
					btnId : 'btnLastweek',
					btnValue : '4',
					handler : function(btn, opts) {
						$(document).trigger("dateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (Last Week To Date)");
					}
		});	
	if (intFilterDays >= 30 || checkInfinity(intFilterDays))
		arrDropdownItem.push({
					text : getLabel('thismonth', 'This Month'),
					btnId : 'btnThismonth',
					btnValue : '5',
					handler : function(btn, opts) {
						$(document).trigger("dateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (This Month)");
					}
		});	
	if (intFilterDays >= 60 || checkInfinity(intFilterDays))
		arrDropdownItem.push({
					text : getLabel('lastMonthToDate', 'Last Month To Date'),
					btnId : 'btnLastmonth',
					btnValue : '6',
					handler : function(btn, opts) {
						$(document).trigger("dateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (Last Month To Date)");
					}
		});	
	if (intFilterDays >= 90 || checkInfinity(intFilterDays))
		arrDropdownItem.push({
					text : getLabel('lastmonthonly', 'Last Month Only'),
					btnId : 'btnLastmonthonly',
					btnValue : '14',
					handler : function(btn, opts) {
						$(document).trigger("dateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (Last Month Only)");
					}
		});	
	if (intFilterDays >= 180 || checkInfinity(intFilterDays))
		arrDropdownItem.push({
					text : getLabel('thisquarter', 'This Quarter'),
					btnId : 'btnLastMonthToDate',
					btnValue : '8',
					handler : function(btn, opts) {
						$(document).trigger("dateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (This Quarter)");
					}
		});	
	if (intFilterDays >= 365 || checkInfinity(intFilterDays))
		arrDropdownItem.push({
					text : getLabel('lastQuarterToDate',
							'Last Quarter To Date'),
					btnId : 'btnQuarterToDate',
					btnValue : '9',
					handler : function(btn, opts) {
						$(document).trigger("dateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (Last Quarter To Date)");
					}
		});	
	if (intFilterDays >= 730 || checkInfinity(intFilterDays))
		arrDropdownItem.push({
					text : getLabel('thisyear', 'This Year'),
					btnId : 'btnLastQuarterToDate',
					btnValue : '10',
					handler : function(btn, opts) {
						$(document).trigger("dateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (This Year)");
					}
		});	

	var dropdownMenu = Ext.create('Ext.menu.Menu', {
		itemId : 'DateMenu',
		cls : 'ext-dropdown-menu',
		listeners : {
				hide:function(event) {
					buttonIns.addCls('ui-caret-dropdown');
					buttonIns.removeCls('action-down-hover');
					}
			},	
		items : arrDropdownItem});
	return dropdownMenu;
}

function getDateDropDownItems(filterType,buttonIns){
	var me = this;
	var dropdownMenu = Ext.create('Ext.menu.Menu', {
		itemId : 'DateMenu',
		cls : 'ext-dropdown-menu',
		items : [
	         	{
					text : getLabel('latest', 'Latest'),
					btnId : 'latest',
					btnValue : '12',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (Latest)");
					}
				} ,  
				{
					text : getLabel('today', 'Today'),
					btnId : 'btnToday',
					btnValue : '1',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (Today)");
					}
				}, {
					text : getLabel('yesterday', 'Yesterday'),
					btnId : 'btnYesterday',
					btnValue : '2',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (Yesterday)");
					}
				}, {
					text : getLabel('thisweek', 'This Week'),
					btnId : 'btnThisweek',
					btnValue : '3',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (This Week)");
					}
				}, {
					text : getLabel('lastweektodate', 'Last Week To Date'),
					btnId : 'btnLastweek',
					btnValue : '4',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (Last Week To Date)");
					}
				}, {
					text : getLabel('thismonth', 'This Month'),
					btnId : 'btnThismonth',
					btnValue : '5',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (This Month)");
					}
				}, {
					text : getLabel('lastMonthToDate', 'Last Month To Date'),
					btnId : 'btnLastmonth',
					btnValue : '6',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (Last Month To Date)");
					}
				},{
					text : getLabel('lastmonthonly', 'Last Month Only'),
					btnId : 'btnLastmonthonly',
					btnValue : '14',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (Last Month Only)");
					}
				}, {
					text : getLabel('thisquarter', 'This Quarter'),
					btnId : 'btnLastMonthToDate',
					btnValue : '8',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (This Quarter)");
					}
				}, {
					text : getLabel('lastQuarterToDate',
							'Last Quarter To Date'),
					btnId : 'btnQuarterToDate',
					btnValue : '9',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (Last Quarter To Date)");
					}
				}, {
					text : getLabel('thisyear', 'This Year'),
					btnId : 'btnLastQuarterToDate',
					btnValue : '10',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (This Year)");
					}
				}, {
					text : getLabel('lastyeartodate', 'Last Year To Date'),
					btnId : 'btnYearToDate',
					btnValue : '11',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (Last Year To Date)");
					}
				}]
	});
	return dropdownMenu;
}

function updateToolTip(filterType,date_option){
	if(filterType === 'creationDate')
		creation_date_opt = date_option;
	else if(filterType === 'logintime')
		login_date_opt = date_option;
	else if(filterType === 'logouttime')
		logout_date_opt = date_option;
}