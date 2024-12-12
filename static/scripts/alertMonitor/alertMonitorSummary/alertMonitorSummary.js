var ALERT_MONITOR_COLUMN_MODEL = [
		 	{
				"colId" : "alertDate",
				"colHeader" : getLabel('lbl.alertMonitor.grid.alertDate', 'Alert Date & Time'),
				 width : 100	
			},
			{
				"colId" : "alertName",
				"colHeader" : getLabel('lbl.alertMonitor.grid.alertName', 'Alert Name'),
				 width : 150	
			},
            {
				"colId" : "alertSubject",
				"colHeader" : getLabel('lbl.alertMonitor.grid.alertSubject', 'Subject'),
				 width : 250	
			},
            {
				"colId" : "alertMode",
				"colHeader" : getLabel('lbl.alertMonitor.grid.alertMode', 'Mode of Delivery'),
				 width : 100	
			},
            {
				"colId" : "alertStatus",
				"colHeader" : getLabel('lbl.alertMonitor.grid.alertStatus', 'Status'),
				 width : 100	
			},
			{
				"colId" : "alertReason",
				"colHeader" : getLabel('lbl.alertMonitor.grid.alertReason', 'Reason'),
				 width : 150	
			},
			{
				"colId" : "alertTrackingId",
				"colHeader" : getLabel('lbl.alertMonitor.grid.alertTrackingId', 'Tracking ID'),
				 width : 150	
			},
			{
				"colId" : "executionDate",
				"colHeader" : getLabel('lbl.alertMonitor.grid.executionDate', 'Retrigger Date & Time'),
				 width : 100	
			},
];

var arrActionColumnStatus = [['0', 'Draft'], ['1', 'Pending Submit'],
	['2', 'Pending My Approval'], ['3', 'Pending Approval'],
	['4', 'Pending Send'], ['5', 'Rejected'], ['6', 'On Hold'],
	['7', 'Sent To Bank'], ['8', 'Deleted'], ['9', 'Pending Repair'],
	['13', 'Debit Failed'], ['14', 'Debited'], ['15', 'Processed'],
	['18', 'Stopped'], ['19', 'For Stop Auth'], ['28', 'Debited'],
	['43', 'WareHoused'], ['75', 'Reversal Pending Auth'],
	['76', 'Reversal Aproved'], ['77', 'Reversal Rejected'],
	['78', 'Reversal Pending My Auth']];

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
}