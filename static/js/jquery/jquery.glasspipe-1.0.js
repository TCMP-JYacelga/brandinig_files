﻿/*
 * jQuery glasspipe plugin v1.0
 * Creates a glasspipe required for displaying various counts in a form of glass pipe. This not really a very generic type of
 * plugin and makes lot's of assumptions regarding the data being rendered.
 * 
 * Copyright (c) 2010 Prasad P. Khandekar
 * Licensed under MIT (http://www.opensource.org/licenses/mit-license.php)
 *
 * Author: Prasad P. Khandekar (kprasadkhan@hotmail.com)
 * Requires: jQuery 1.2.6+
 */
(function ($) {
	$.fn.glasspipe = function(options) {
		return this.each(function() {
			var $wrappingElement = $(this);
			var $table = $('<table border="0" cellspacing="0" cellpadding="0" class="glasspipe" width="100%"></table>');

			var col, total, zeroCnt, actPerc, perc, cntr;
			var data = options.pipeData;
			var labels = options.pipeLabels;
			var headers = options.headerData;
			var $lblRow = $('<tr></tr>');

			$col = $('<td colspan="6" class="right_border"><strong>' + headers[0] + '</strong></td>');
			$col.appendTo($lblRow);
			$col = $('<td colspan="4" class="right_border"><strong>' + headers[1] + '</strong></td>');
			$col.appendTo($lblRow);
			$col = $('<td colspan="2"><strong>' + headers[2] + '</strong></td>');
			$col.appendTo($lblRow);
			$lblRow.appendTo($table);

			zeroCnt = 0;
			total = 0;

			$descRow = $('<tr></tr>');
			$dataRow = $('<tr></tr>');
			cntr = 0;
			for (cntr = 0; cntr < data.length; cntr++)
			{
				var val = data[cntr];
				if (val == 0) zeroCnt++;
				total += val;

				var $colDesc = $('<td>' + labels[cntr] + '</td>');
				var $colVal = $('<td>' + val + '</td>');
				switch(cntr)
				{
					case 0:
					case 1:
					case 2:
					case 3:
					case 4:
						$colDesc.addClass('blue_text');
						$colVal.addClass('blue_text font_bold');
						break;
					case 5:
						$colDesc.addClass('blue_text right_border');
						$colVal.addClass('blue_text font_bold right_border');
						break;
					case 6:
					case 7:
					case 8:
						$colDesc.addClass('green_text');
						$colVal.addClass('green_text font_bold');
						break;
					case 9:
						$colDesc.addClass('green_text right_border');
						$colVal.addClass('green_text font_bold right_border');
						break;
					default:
						$colDesc.addClass('red_text');
						$colVal.addClass('red_text font_bold');
						break;
				}
				$colDesc.appendTo($descRow);
				$colVal.appendTo($dataRow);
			}

			actPerc = 100 - (zeroCnt * 4);
			var $pRow = $('<tr class="pipe_row"></tr>');
			for (cntr = 0; cntr < data.length; cntr++)
			{
				var val = data[cntr];
				if (val == 0)
					perc = 4;
				else
					perc = Math.abs((val * actPerc)/total);

				var $col = $('<td width="' + perc + '%">&nbsp;</td>');
				switch (cntr)
				{
					case 0:
						$col.addClass('blue_glass first_pipe');
						break;
					case 1:
					case 2:
					case 3:
					case 4:
					case 5:
						$col.addClass('blue_glass');
						break;
					case 6:
					case 7:
					case 8:
					case 9:
						$col.addClass('green_glass');
						break;
					case 10:
						$col.addClass('red_glass');
						break;
					case 11:
						$col.addClass('red_glass last_pipe');
						break;
				}
				$col.appendTo($pRow);
			}
			$pRow.appendTo($table);
			$descRow.appendTo($table);
			$dataRow.appendTo($table);
			$table.appendTo($wrappingElement);
		});
	}
})(jQuery);