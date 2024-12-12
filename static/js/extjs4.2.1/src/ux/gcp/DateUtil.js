/**
 * @class Ext.ux.gcp.DateUtil
 * @author Vinay Thube
 */
/**
 * This utility contains the methods to calculate the date for various date
 * options(month start,month end,yesterday,current week,last week,current
 * month,last month). This date calculation is done with respect to application
 * date. Methods in this controller returns required dates in JSON format which
 * are then used to form queries to get required data.
 */
Ext.define('Ext.ux.gcp.DateUtil', {
			requires : ['Ext.Date'],
			/**
			 * This function calculate the yesterday date according to
			 * application Date and return it.
			 * 
			 * @param {Ext.Date}
			 *            [dtToday] The application date use to calculate the
			 *            yesterday date.
			 * 
			 * @return {Ext.Date} Return the yesterday date.
			 */
			getYesterdayDate : function(dtToday) {
				var dtDate = dtToday;
				return Ext.Date.add(dtDate, Ext.Date.DAY, -1);
			},
			/**
			 * This function calculate the Last month Start date and current
			 * application Date which is pass as a parameter to the function.
			 * And return the Array which contains Last month Start to Current
			 * date.
			 * 
			 * @param {Ext.Date}
			 *            [dtToday] The application date use to calculate the
			 *            Last month Date.
			 * 
			 * @return {Array} Return the array which contains the Last month
			 *         From i.e Start Date and To i.e Current Date.
			 */
			getLastMonthToDate : function(dtToday) {
				var dtDate = dtToday;
				var dtFrom = null;
				var dtJson = {};

				if (dtToday.getMonth() == 0) {
					dtFrom = new Date(dtDate.getFullYear() - 1, 11, 1);
				} else {
					dtFrom = new Date(dtDate.getFullYear(), dtDate.getMonth()
									- 1, 1);
				}

				dtJson = {
					fromDate : dtFrom,
					toDate : dtToday
				};
				return dtJson;
			},
			/**
			 * This function calculate the Last Quarter start date and current
			 * application Date which is pass as a parameter to the function.
			 * And return the Array which contains Last Quarter Start to Current
			 * date.
			 * 
			 * @param {Ext.Date}
			 *            [dtToday] The application date use to calculate the
			 *            Last quarter to till Date.
			 * 
			 * @return {Array} Return the array which contains the Last Quarter
			 *         From i.e Start Date and To i.e Current Date.
			 */
			getLastQuarterToDate : function(dtToday) {
				var dtDate = dtToday;
				var dtFrom = null;
				var dtJson = {};

				if (dtToday.getMonth() <= 2) {
					// first quarter Jan-march
					dtFrom = new Date(dtDate.getFullYear() - 1, 9, 1);
				} else if (dtToday.getMonth() > 2 && dtToday.getMonth() <= 5) {
					// second quarter April-June
					dtFrom = new Date(dtDate.getFullYear(), 0, 1);
				} else if (dtToday.getMonth() > 5 && dtToday.getMonth() <= 8) {
					// third quarter July-Sep
					dtFrom = new Date(dtDate.getFullYear(), 3, 1);
				} else if (dtToday.getMonth() > 8 && dtToday.getMonth() <= 11) {
					// fourth quarter Oct-Dec
					dtFrom = new Date(dtDate.getFullYear(), 6, 1);
				}

				dtJson = {
					fromDate : dtFrom,
					toDate : dtToday
				};
				return dtJson;
			},
			/**
			 * This function calculate the current quarter first day and current
			 * application date which is pass as a parameter to the function.
			 * And return the Array which contains current quarter Start and
			 * till date.
			 * 
			 * @param {Ext.Date}
			 *            [dtToday] The application date use to calculate the
			 *            Current quarter to till Date.
			 * 
			 * @return {Array} Return the array which contains the Current
			 *         quarter From i.e Start Date and To i.e Current Date.
			 */
			getQuarterToDate : function(dtToday) {
				var dtDate = dtToday;
				var dtFrom = null;
				var dtJson = {};

				if (dtToday.getMonth() <= 2) {
					// first quarter Jan-march
					dtFrom = new Date(dtDate.getFullYear(), 0, 1);
				} else if (dtToday.getMonth() > 2 && dtToday.getMonth() <= 5) {
					// second quarter April-June
					dtFrom = new Date(dtDate.getFullYear(), 3, 1);
				} else if (dtToday.getMonth() > 5 && dtToday.getMonth() <= 8) {
					// third quarter July-Sep
					dtFrom = new Date(dtDate.getFullYear(), 6, 1);
				} else if (dtToday.getMonth() > 8 && dtToday.getMonth() <= 11) {
					// fourth quarter Oct-Dec
					dtFrom = new Date(dtDate.getFullYear(), 9, 1);
				}

				dtJson = {
					fromDate : dtFrom,
					toDate : dtToday
				};
				return dtJson;
			},
			/**
			 * This function calculate the Last Quarter start date and its End
			 * Date which is pass as a parameter to the function. And return the
			 * Array which contains Last Quarter Start and End date.
			 * 
			 * @param {Ext.Date}
			 *            [dtToday] The application date use to calculate the
			 *            Last Quarter Dates.
			 * 
			 * @return {Array} Return the array which contains the Last Quarter
			 *         From i.e Start Date and To i.e End Date.
			 */
			getLastQuarter : function(dtToday) {
				var dtDate = dtToday;
				var dtFrom = null, dtToStartDate = null, dtTo = null;
				var dtJson = {};

				if (dtToday.getMonth() <= 2) {
					// first quarter Jan-march
					dtFrom = new Date(dtDate.getFullYear() - 1, 9, 1);
					dtToStartDate = new Date(dtDate.getFullYear() - 1, 11, 1);
				} else if (dtToday.getMonth() > 2 && dtToday.getMonth() <= 5) {
					// second quarter April-June
					dtFrom = new Date(dtDate.getFullYear(), 0, 1);
					dtToStartDate = new Date(dtDate.getFullYear(), 2, 1);
				} else if (dtToday.getMonth() > 5 && dtToday.getMonth() <= 8) {
					// third quarter July-Sep
					dtFrom = new Date(dtDate.getFullYear(), 3, 1);
					dtToStartDate = new Date(dtDate.getFullYear(), 5, 1);
				} else if (dtToday.getMonth() > 8 && dtToday.getMonth() <= 11) {
					// fourth quarter Oct-Dec
					dtFrom = new Date(dtDate.getFullYear(), 6, 1);
					dtToStartDate = new Date(dtDate.getFullYear(), 8, 1);
				}

				dtTo = Ext.Date.getLastDateOfMonth(dtToStartDate);

				dtJson = {
					fromDate : dtFrom,
					toDate : dtTo
				};
				return dtJson;
			},
			/**
			 * This function calculate the Last year Start date and end date
			 * which is pass as a parameter to the function. And return the
			 * Array which contains Last year Start and End date.
			 * 
			 * @param {Ext.Date}
			 *            [dtToday] The application date use to calculate the
			 *            Last year Date.
			 * 
			 * @return {Array} Return the array which contains the Last year
			 *         From i.e Start Date and To i.e End Date.
			 */
			getLastYear : function(dtToday) {
				var dtDate = dtToday;
				var dtFrom = null, dtFrom = null, dtTo = null, dtToStartDate = null;
				var dtJson = {};

				dtFrom = new Date(dtDate.getFullYear() - 1, 0, 1);
				dtToStartDate = new Date(dtDate.getFullYear() - 1, 11, 1);
				dtTo = Ext.Date.getLastDateOfMonth(dtToStartDate);

				dtJson = {
					fromDate : dtFrom,
					toDate : dtTo
				};
				return dtJson;
			},
			/**
			 * This function calculate the Last year Start date current
			 * Application Date which is pass as a parameter to the function.
			 * And return the Array which contains Last year Start and current
			 * date.
			 * 
			 * @param {Ext.Date}
			 *            [dtToday] The application date use to calculate the
			 *            Last year Date.
			 * 
			 * @return {Array} Return the array which contains the Last year
			 *         From i.e Start Date and To i.e Current Date.
			 */
			getLastYearToDate : function(dtToday) {
				var dtDate = dtToday;
				var dtFrom = null, dtFrom = null;
				var dtJson = {};
				dtFrom = new Date(dtDate.getFullYear() - 1, 0, 1);
				dtJson = {
					fromDate : dtFrom,
					toDate : dtToday
				};
				return dtJson;
			},
			/**
			 * This function calculate the current year first day and current
			 * application Date which is pass as a parameter to the function.
			 * And return the Array which contains Current year Start and Till
			 * date.
			 * 
			 * @param {Ext.Date}
			 *            [dtToday] The application date use to calculate the
			 *            Current Year To Date.
			 * 
			 * @return {Array} Return the array which contains the Current Year
			 *         From i.e Start Date and To i.e Current Date.
			 */
			getYearToDate : function(dtToday) {
				var dtDate = dtToday;
				var dtFrom = null;
				var dtJson = {};

				dtFrom = new Date(dtDate.getFullYear(), 0, 1);

				dtJson = {
					fromDate : dtFrom,
					toDate : dtToday
				};
				return dtJson;
			},
			/**
			 * This function calculate the From date and To date of currently
			 * running month according to Application Date which is pass as a
			 * parameter to the function. And return the Array which contains
			 * current month First Date and Last Date.
			 * 
			 * @param {Ext.Date}
			 *            [dtToday] The application date use to calculate the
			 *            month first and last Date.
			 * 
			 * @return {Array} Return the array which contains the First and
			 *         Last date of month.
			 */
			getThisMonthStartAndEndDate : function(dtToday) {
				var dtDate = dtToday;
				var dtJson = {};
				dtJson = {
					fromDate : Ext.Date.getFirstDateOfMonth(dtDate),
					toDate : Ext.Date.getLastDateOfMonth(dtDate)
				};
				return dtJson;
			},
			/**
			 * This function calculate the From date of current month and
			 * current Application Date which is pass as a parameter to the
			 * function. And return the Array which contains month First Date
			 * and current date.
			 * 
			 * @param {Ext.Date}
			 *            [dtToday] The application date use to calculate the
			 *            month first and current date.
			 * 
			 * @return {Array} Return the array which contains the First and
			 *         Current date of month.
			 */
			getThisMonthToDate : function(dtToday) {
				var dtDate = dtToday;
				var dtJson = {};
				dtJson = {
					fromDate : Ext.Date.getFirstDateOfMonth(dtDate),
					toDate : dtToday
				};
				return dtJson;
			},
			/**
			 * This function calculate the Start date and End date of Last month
			 * according to Application Date which is pass as a parameter to the
			 * function. And return the Array which contains Last month Start
			 * and End date.
			 * 
			 * @param {Ext.Date}
			 *            [dtToday] The application date use to calculate the
			 *            Last month Date.
			 * 
			 * @return {Array} Return the array which contains the Last month
			 *         From i.e Start Date and To i.e End Date.
			 */
			getLastMonthStartAndEndDate : function(dtToday) {
				var dtDate = dtToday;
				var dtFrom = null, dtTo = null;
				var dtJson = {};

				if (dtToday.getMonth() == 0) {
					dtFrom = new Date(dtDate.getFullYear() - 1, 11, 1);
				} else {
					dtFrom = new Date(dtDate.getFullYear(), dtDate.getMonth()
									- 1, 1);
				}

				dtTo = Ext.Date.getLastDateOfMonth(dtFrom);
				dtJson = {
					fromDate : dtFrom,
					toDate : dtTo
				};
				return dtJson;
			},
			/**
			 * This function calculate the Start date and End date of currently
			 * running Week according to Application Date which is pass as a
			 * parameter to the function. And return the Array which contains
			 * this Week Start and End date.
			 * 
			 * @param {Ext.Date}
			 *            [dtToday] The application date use to calculate the
			 *            currently running week Date.
			 * 
			 * @return {Array} Return the array which contains the this Week
			 *         From i.e Start Date and To i.e End Date.
			 */
			getThisWeekStartAndEndDate : function(dtToday) {
				var dtDate = dtToday;
				var dtJson = {};
				var startDay = 1; // 0=sunday, 1=monday etc.
				// get the current day
				var day = dtDate.getDay();
				// rewind to start day
				var weekStart = new Date(dtDate.valueOf()
						- (day <= 0 ? 7 - startDay : day - startDay) * 86400000);
				// add 6 days to get last day
				var weekEnd = new Date(weekStart.valueOf() + 6 * 86400000);

				dtJson = {
					fromDate : new Date(weekStart),
					toDate : new Date(weekEnd)
				};
				return dtJson;
			},
			/**
			 * This function calculate the Start date currently running Week and
			 * current Application Date which is pass as a parameter to the
			 * function. And return the Array which contains this Week Start and
			 * Current date.
			 * 
			 * @param {Ext.Date}
			 *            [dtToday] The application date use to calculate the
			 *            currently running week Date.
			 * 
			 * @return {Array} Return the array which contains the this Week
			 *         From i.e Start Date and To i.e Current Date.
			 */
			getThisWeekToDate : function(dtToday) {
				var dtDate = dtToday;
				var dtJson = {};
				var startDay = 1; // 0=sunday, 1=monday etc.
				// get the current day
				var day = dtDate.getDay();
				// rewind to start day
				var weekStart = new Date(dtDate.valueOf()
						- (day <= 0 ? 7 - startDay : day - startDay) * 86400000);

				dtJson = {
					fromDate : new Date(weekStart),
					toDate : dtToday
				};
				return dtJson;
			},
			/**
			 * This function calculate the Start date and End date of Last Week
			 * according to Application Date which is pass as a parameter to the
			 * function.. And return the Array which contains Last Week Start
			 * and End date.
			 * 
			 * @param {Ext.Date}
			 *            [dtToday] The application date use to calculate the
			 *            Last Week Date.
			 * 
			 * @return {Array} Return the array which contains the Last Week
			 *         From i.e Start Date and To i.e End Date.
			 */
			getLastWeekStartAndEndDate : function(dtToday) {
				var dtDate = dtToday;
				var dtJson = {};
				var lastWeekEnd = dtDate.setTime(dtDate.getTime()
						- (dtDate.getDay() ? dtDate.getDay() : 7) * 86400000);
				var lastWeekStart = dtDate.setTime(dtDate.getTime() - 6
						* 86400000);
				dtJson = {
					fromDate : new Date(lastWeekStart),
					toDate : new Date(lastWeekEnd)
				};
				return dtJson;

			},
			/**
			 * This function calculate the Start date of Last Week start date
			 * and current Application Date which is pass as a parameter to the
			 * function.. And return the Array which contains Last Week Start
			 * and current date.
			 * 
			 * @param {Ext.Date}
			 *            [dtToday] The application date use to calculate the
			 *            Last Week Date.
			 * 
			 * @return {Array} Return the array which contains the Last Week
			 *         From i.e Start Date and To i.e Current Date.
			 */
			getLastWeekToDate : function(dtToday) {
				var dtDate = dtToday;
				var dtJson = {};
				var startDay = 1; // 0=sunday, 1=monday etc.
				var day = dtDate.getDay();

				// current week start day
				var currentWeekStartDay = new Date(dtDate.valueOf()
						- (day <= 0 ? 7 - startDay : day - startDay) * 86400000);
				var lastWeekStart = currentWeekStartDay
						.setTime(currentWeekStartDay.getTime() - 7 * 86400000);
				dtJson = {
					fromDate : new Date(lastWeekStart),
					toDate : dtToday
				};
				return dtJson;

			},
			/**
			 * This function calculates the date which was N days before current Application Date
			 * which is passed as a parameter to the
			 * function.. And returns calculated date.
			 * 
			 * @param {Ext.Date}
			 *            [dtToday] The application date use to calculate the
			 *            Before Date.
			 * @param{int}
			 *          [days] The number of days 
			 *           
			 * @return {Ext.Date} Return the date n days before current Date.
			 */
			getDateBeforeDays :function(dtToday,days) {
				var dtDate = dtToday;
				var beforeDate = dtToday;
				beforeDate.setDate(dtDate.getDate()-days);
				return beforeDate;
			}
		});