/*
 * jQuery calendar plugin v1.0
 * Creates a calendar required for displaying daywise data. 
 * This not really a very generic type of plugin and makes lot's of assumptions 
 * regarding the data being rendered. This function expects following data structure
 * 
 * {
 *		inflow_desc: "",
 *		outflow_desc: "",
 *		labels_inflow: ["", "", ...],
 *		labels_outflow: ["", "", ...],
 *		yyyyMMdd: {data_inflow:[9, 9 ...], data_outflow: [9, 9, ...]},
 *		...
 * }
 * 
 * Copyright (c) 2010 Prasad P. Khandekar
 * Licensed under MIT (http://www.opensource.org/licenses/mit-license.php)
 *
 * Author: Prasad P. Khandekar (kprasadkhan@hotmail.com)
 * Requires: jQuery 1.2.6+
 */
(function ($) {
	var WEEK_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var DATE_REGEX = /(0[1-9]|[12][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/(\d{4})/i;

	$.fn.bscalendar = function(options) {
		return this.each(function() {
			var $wrappingElement = $(this);
			var $table = $('<table border="0" cellspacing="0" cellpadding="0" class="calendar" width="100%"></table>');
			renderHeader($table);
			appendBody($table, options.applDate, options.calData);
			$table.appendTo($wrappingElement);
		});

		 function renderHeader($parent) {
			var cntr, strTmp, col;
			var $head = $('<thead></thead>');
			var $thRow = $('<tr class="h2"></tr>');
			for (cntr  = 0; cntr < 7; cntr++)
			{
				strTmp = WEEK_DAYS[cntr];
				$('<th>' + strTmp.substr(0, 3) + '</th>').appendTo($thRow);
			}
			$thRow.appendTo($head);
			$head.appendTo($parent);
		};

		function appendBody($parent, pDate, pData) {
			var dayCntr, cntr, intDay, intMonth, appMonth, strTmp, arrIf, col, endRow, dtStart;
			var bd = $('<tbody></tbody>');

			if (pDate instanceof Date)
				dtStart = new Date(pDate.getFullYear(), pDate.getMonth(), 1);
			else {
				var dtparts = pDate.match(DATE_REGEX);
				dtStart = new Date(parseInt(dtparts[3],10), 
									parseInt(dtparts[2], 10) - 1, 1);
			}
			intDay = dtStart.getDay();
			appMonth = dtStart.getMonth();
			if (intDay != 0)
				dtStart.setDate(dtStart.getDate() - intDay);

			endRow = (intDay < 5 ? 5 : 6);
			for (dayCntr = 0; dayCntr < endRow; dayCntr++) {
				var $row = $('<tr></tr>');
				for (cntr = 0; cntr < 7; cntr++) {
					intMonth = dtStart.getMonth();

					if (intMonth != appMonth)
						$col = $('<td class="offday">&nbsp;</td>');
					else {
						strTmp = toISOStringDate(dtStart);
						$col = $('<td id="cal_' + strTmp + '" title="ToDo">' + dtStart.getDate() + '</td>');
						arrIf = pData[strTmp];
						if (arrIf != undefined) {
							$col.addClass("thePointer");
							$('<span class="grdlnk-notify-icon icon-gln-alert"></span>').appendTo($col);
						}
					}
					$col.appendTo($row);
					dtStart.setDate(dtStart.getDate() + 1);
				}
				$row.appendTo($parent);
			}
		};

		function toISTStringDate(dtIn) {
			var strDay = ("" + (100 + dtIn.getDate())).substr(1, 2);
			var strMonth = ("" + (101 + dtIn.getMonth())).substr(1, 2);
			return (strDay + "/" +  strMonth + dtIn.getFullYear());
		};

		function toISOStringDate(dtIn) {
			var strDay = ("" + (100 + dtIn.getDate())).substr(1, 2);
			var strMonth = ("" + (101 + dtIn.getMonth())).substr(1, 2);
			return (dtIn.getFullYear() + strMonth + strDay);
		};
	}
})(jQuery);
