Ext.define("Ext.ux.Calendar", {
	extend: "Ext.panel.Panel", 
	requires: ['Ext.util.ClickRepeater', 'Ext.Date'],
	xtype: "ux-cal",
	config: {
		listeners : {
					// Sample for click handling
					click : function(o) {
						return false;
					},
					// Sample for mouse over handling to show tool-tip
					mouseover : function(o, event) {
						this.tooltip.hide();
						if (!o.date) {
							this.tooltip.hide();
						} else {
								var calJson = this.calData.data_outflow;
								var formattedDate = Ext.Date.format(o.date, 'd/m/Y');
								var outflowArray = calJson[formattedDate];
								if(!Ext.isEmpty(outflowArray) || undefined != outflowArray) {
									var labels = this.calData.labels_outflow;
									var hasDate = checkDate(this.datesArray, o.date);
									var tooltipText = "<div class='ux-tip-text-header'>Outflows: <br></div> <div class='ux-cal-font'>";
									tooltipText += "<div class='ux-tip'>"+labels[0] + "&nbsp;<span class='ux-tip-text'>" + outflowArray[0] + "</span></div>";  
									tooltipText += "<div class='ux-tip'>"+labels[1] + "&nbsp;<span class='ux-tip-text'>" + outflowArray[1] + "</span></div></div>";
									  if(hasDate) {
										if (this.tooltip.rendered) {
											this.tooltip.body.dom.innerHTML = tooltipText;
										} else {
											this.tooltip.html = tooltipText;
										}
										this.tooltip.showAt(event.getXY());
									 } else 
										this.tooltip.hide();
							}
						}
					},
					// Adding tool-tip to the calendar
					render : function() {
						this.tooltip = new Ext.tip.ToolTip({
							showDelay : 20,
							width: 150,
							height: 50,
							hidden: true,
							trackMouse : true
						});
					},
					destroy : function() {
						this.tooltip.destroy();
					}
				} 
	},
	initComponent: function() {
		this.callParent(arguments);
	},
    calData: null,
    datesArray: null,
    daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    value: null,
    calMonth: null,
    calYear: null,
    onRender: function(container, position) {
		this.callParent(arguments);
        this.createInitialLayout();
        this.update();
    },
    showPrevMonth: function() {
        this.moveMonths(-1);
    },
    showNextMonth: function() {
        this.moveMonths(1);
    },
    showNavigation: true,

    createInitialLayout: function() {
        var htmlData = [];
        var headerData = "<th colspan='5' class='ux-cal-monthTitle'>&nbsp;</th>";
        htmlData.push("<table class=\"ux-cal\" width='100%' height='100%' cellspacing='0'>");

        htmlData.push("<thead>");
        htmlData.push("<tr class='ux-cal-header'>");
        htmlData.push("<th><div id='leftNav' class='x-date-left'><a href='#'>&nbsp;</a></th>")
        htmlData.push(headerData);
        htmlData.push("<th><div class='x-date-right'><a href='#'>&nbsp;</a></div></th>")
        htmlData.push('</th></tr>');
        htmlData.push('</thead>');
        htmlData.push('<tbody>');

        htmlData.push("<tr class='ux-cal-weekday'>");
        var daysOfWeek = this.daysOfWeek;
        for (var i = 0; i < 7; i++) {
            var width = i == 0 || i == 6 ? 15 : 14;
            htmlData.push('<td width="' + width + '%">' + daysOfWeek[i] + '</td>');
        }
        htmlData.push('</tr>');

        for (var i = 0; i < 42; i++) {
            if (i % 7 == 0) { // First day of week
                htmlData.push("<tr class='ux-cal-row'>");
            }
            htmlData.push("<td>&nbsp;</td>");
            if (i % 7 == 6) { // Last day of week
                htmlData.push("</tr>");
            }
        }
        htmlData.push('</tbody>');
        htmlData.push("</table>");
        this.body.update(htmlData.join(""));
        
		//set navigation on months
        var leftSelector = Ext.dom.Query.select("div.x-date-left a")[0];
        var rightSelector = Ext.dom.Query.select("div.x-date-right a")[0];
         var leftNav = Ext.get(leftSelector);
        var rightNav = Ext.get(rightSelector);
        
        this.leftClickRpt = new Ext.util.ClickRepeater(leftNav, { handler: this.showPrevMonth, scope: this, preventDefault: true, stopDefault: true });
        this.rightClickRpt = new Ext.util.ClickRepeater(rightNav, { handler: this.showNextMonth, scope: this, preventDefault: true, stopDefault: true });

        var showNavigation = this.showNavigation;
        leftNav.setDisplayed(showNavigation);
        rightNav.setDisplayed(showNavigation);
//        this.calendarHeaderEl = this.body.child('th.ux-cal-monthTitle');
        var dom = Ext.dom.Query.select('th.ux-cal-monthTitle');
        this.calendarHeaderEl = dom[0];

        var table = this.body.select('table');
        table.on({
            mouseover: this.onMouseOver,
            mouseout: this.onMouseOut,
            click: this.onClick,
            scope: this
        });

        this.cells = this.body.select('tbody td');
    },

    beforeDestroy: function() {
        this.leftClickRpt.destroy();
        this.rightClickRpt.destroy();
        this.cells.destroy();
        Ext.ux.Calendar.superclass.beforeDestroy.apply(this, arguments);
    },

    onMouseOver: function(e) {
        this.processEvent('mouseover', e);
    },

    onMouseOut: function(e) {
        this.fireEvent('mouseout', e, this);
    },

    onClick: function(e) {
        this.processEvent('click', e);
    },

    processEvent: function(eventName, e) {
        var t = e.getTarget();
        var o = {};
        if (t.tagName == 'TD') {
            var cell = t;
            var row = t.parentNode;
            var rowIndex = row.rowIndex - 2; // Ignore header rows
            o = { cellIndex: cell.cellIndex, rowIndex: rowIndex, row: row, cell: cell };
            if (rowIndex >= 0) {
                o.date = Ext.Date.add(this.startOfCalendar, Ext.Date.DAY, ((o.rowIndex) * 7) + o.cellIndex);
            }
        }
        this.fireEvent(eventName, o, e);
    },

    update: function() {
    	var value = Ext.Date.clearTime(this.value);
    	var currentMonth =  value.getMonth();
    	var currentYear =  value.getFullYear();
    	var leftNavEl = Ext.get('leftNav');
    	if(currentMonth == this.calMonth && currentYear == this.calYear)
    		leftNavEl.hide();
    	else
    		leftNavEl.show();
    	
    	var startOfCalendar = Ext.Date.getFirstDateOfMonth(value);
        var endOfCalendar = Ext.Date.getLastDateOfMonth(startOfCalendar);

        var startWeekDay = Ext.Date.format(startOfCalendar, "N");
        if (startWeekDay > 0) {
        	startOfCalendar = Ext.Date.add(startOfCalendar, Ext.Date.DAY, -startWeekDay);
        }

        var endWeekDay = Ext.Date.format(endOfCalendar, "N");
        if (endWeekDay < 6) {
        	 endOfCalendar = Ext.Date.add(endOfCalendar, Ext.Date.DAY, 6 - endWeekDay);
        }

        var duration = endOfCalendar - startOfCalendar;
        var oneDay = 1000 * 60 * 60 * 24;
        duration = duration / oneDay + 1;

        endOfCalendar = Ext.Date.add(endOfCalendar, Ext.Date.DAY, 42 - duration);

        var htmlData = [];

        var calendarTitle = Ext.Date.format(value, "F, Y");
        this.calendarHeaderEl.innerHTML = calendarTitle;

        var currentMonth = Ext.Date.format(value, "m");
        var o = { today: Ext.Date.clearTime(new Date()), date: startOfCalendar };
        var cells = this.cells.elements;
        this.startOfCalendar = startOfCalendar;
        var datesArray = this.datesArray;
        for (var i = 0; i < 42; i++) {

            o.css = Ext.Date.format(o.date, "m") == currentMonth ? "sameMonth" : "otherMonth";
            o.css += " x-unselectable";
            o.caption = Ext.Date.format(o.date, "d");
            o.cell = cells[i + 7];
            this.formatDay(o);
            
            o.cell.width=15;
            o.cell.height=40;

            o.cell.className = o.css;
			var calDate = Ext.Date.parse(Ext.Date.format(o.date, 'd/m/Y'), 'd/m/Y');
            o.date = Ext.Date.add(o.date, Ext.Date.DAY, 1);
            var hasDate = checkDate(datesArray, calDate);
            if(hasDate)
            	o.cell.innerHTML = '<div class="ux-cal-schedule"> </div>' +'<div>'+ o.caption+'</div>'; 
            else 
            	o.cell.innerHTML = '<div>'+ o.caption+'</div>';
        }
    },
    beforeDestroy: function() {
        if (this.rendered) {
            Ext.destroy(
                this.leftClickRpt,
                this.rightClickRpt
            );
        }
        Ext.ux.Calendar.superclass.beforeDestroy.apply(this, arguments);
    },
    // Custom formatting based on date
			formatDay : function(o) {
				var data = this.getData(o);
				if (data) {
					o.css += " ux-cal-highlight";
					o.caption += "*";
				}
			}
});
//compares the data array with calendar dates
checkDate = function(datesArray, calDate) {
	var hasDate = null;
	Ext.Array.each(datesArray, function(item, index, allItems) {
            	if(Ext.Date.isEqual(calDate, item)) {
            			hasDate = item;
            	} 
      });
	return hasDate;
}