Ext.define('Cashweb.view.settings.DateField', { 
	requires : ['Ext.menu.Menu', 'Ext.button.Button'],
	createDatePanel : function () {
		var dateMenuPanel = Ext.create('Ext.panel.Panel', {
			layout : 'vbox',
			flex : 0.33,
			items : [{
				xtype : 'label',
				itemId : 'dateLabel',
				text : getLabel('dateLatest', 'Date (Latest)'),
				cls : 'f13 ux_payment-type'
					// padding : '6 0 0 5'
				}, {
				xtype : 'button',
				border : 0,
				filterParamName : 'EntryDate',
				itemId : 'entryDate',
				// cls : 'xn-custom-arrow-button cursor_pointer w1',
				cls : 'menu-disable xn-custom-arrow-button cursor_pointer ux_margint',
				glyph : 'xf0d7@fontawesome',
				padding : '6 0 0 3',
				menu : this.createDateFilterMenu()				
			}],
		createDateFilterMenu : function() {
				var me = this;
				var menu = null;
							
				var arrMenuItem = [
						];
				
				arrMenuItem.push({
							text : getLabel('latest', 'Latest'),
							btnId : 'btnLatest',
							parent : this,
							btnValue : '12',
							handler : function(btn, opts) {
								this.parent.fireEvent('dateChange', btn, opts);
							}
						});

				//if (intFilterDays >= 1 || me.checkInfinity(intFilterDays))
					arrMenuItem.push({
								text : getLabel('today', 'Today'),
								btnId : 'btnToday',
								btnValue : '1',
								parent : this,
								handler : function(btn, opts) {
									this.parent.fireEvent('dateChange', btn, opts);
								}
							});
				//if (intFilterDays >= 2 || me.checkInfinity(intFilterDays))
					arrMenuItem.push({
								text : getLabel('yesterday', 'Yesterday'),
								btnId : 'btnYesterday',
								btnValue : '2',
								parent : this,
								handler : function(btn, opts) {
									this.parent.fireEvent('dateChange', btn, opts);
								}
							});
			//	if (intFilterDays >= 7 || me.checkInfinity(intFilterDays))
					arrMenuItem.push({
								text : getLabel('thisweek', 'This Week'),
								btnId : 'btnThisweek',
								btnValue : '3',
								parent : this,
								handler : function(btn, opts) {
									this.parent.fireEvent('dateChange', btn, opts);
								}
							});
				//if (intFilterDays >= 14 || me.checkInfinity(intFilterDays))
					arrMenuItem.push({
								text : getLabel('lastweektodate', 'Last Week To Date'),
								btnId : 'btnLastweek',
								parent : this,
								btnValue : '4',
								handler : function(btn, opts) {
									this.parent.fireEvent('dateChange', btn, opts);
								}
							});
			//	if (intFilterDays >= 30 || me.checkInfinity(intFilterDays))
					arrMenuItem.push({
								text : getLabel('thismonth', 'This Month'),
								btnId : 'btnThismonth',
								parent : this,
								btnValue : '5',
								handler : function(btn, opts) {
									this.parent.fireEvent('dateChange', btn, opts);
								}
							});
			//	if (intFilterDays >= 60 || me.checkInfinity(intFilterDays))
					arrMenuItem.push({
								text : getLabel('lastMonthToDate', 'Last Month To Date'),
								btnId : 'btnLastmonth',
								btnValue : '6',
								parent : this,
								handler : function(btn, opts) {
									this.parent.fireEvent('dateChange', btn, opts);
								}
							});
			//	if (intFilterDays >= 90 || me.checkInfinity(intFilterDays))
					arrMenuItem.push({
								text : getLabel('thisquarter', 'This Quarter'),
								btnId : 'btnLastMonthToDate',
								btnValue : '8',
								parent : this,
								handler : function(btn, opts) {
									this.parent.fireEvent('dateChange', btn, opts);
								}
							});
			//	if (intFilterDays >= 180 || me.checkInfinity(intFilterDays))
					arrMenuItem.push({
								text : getLabel('lastQuarterToDate',
										'Last Quarter To Date'),
								btnId : 'btnQuarterToDate',
								btnValue : '9',
								parent : this,
								handler : function(btn, opts) {
									this.parent.fireEvent('dateChange', btn, opts);
								}
							});
			//	if (intFilterDays >= 365 || me.checkInfinity(intFilterDays))
					arrMenuItem.push({
								text : getLabel('thisyear', 'This Year'),
								btnId : 'btnLastQuarterToDate',
								btnValue : '10',
								parent : this,
								handler : function(btn, opts) {
									this.parent.fireEvent('dateChange', btn, opts);
								}
							});
			//	if (intFilterDays >= 730 || me.checkInfinity(intFilterDays))
					arrMenuItem.push({
								text : getLabel('lastyeartodate', 'Last Year To Date'),
								btnId : 'btnYearToDate',
								parent : this,
								btnValue : '11',
								handler : function(btn, opts) {
									this.parent.fireEvent('dateChange', btn, opts);
								}
							});
				arrMenuItem.push({
							text : getLabel('daterange', 'Date Range'),
							btnId : 'btnDateRange',
							parent : this,
							btnValue : '7',
							handler : function(btn, opts) {		
								var field = me.down('datefield[itemId="fromDate"]');	
								if (field)
									field.setValue('');
								field = me.down('datefield[itemId="toDate"]');
								if (field)
									field.setValue('');
								this.parent.fireEvent('dateChange', btn, opts);

							}
						});

				menu = Ext.create('Ext.menu.Menu', {
							items : arrMenuItem
						});
				return menu;
			}	
		});		
		return dateMenuPanel;
	}
});