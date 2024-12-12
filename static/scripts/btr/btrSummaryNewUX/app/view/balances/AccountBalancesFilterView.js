/**
 * @class GCP.view.balances.AccountBalancesFilterView
 * @extends Ext.panel.Panel
 * @author Shraddha Chauhan
 */
Ext.define('GCP.view.balances.AccountBalancesFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'accountBalancesFilterView',
	layout:'hbox',	
	initComponent : function() {
		var me = this;
		var strAppDate = dtSellerDate;
		var dtFormat = strExtApplicationDateFormat;
		var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
		var isThisWeekHidden = false;

		if (date.getDay() === 1)
			isThisWeekHidden = true;

		me.items = [/*{
						xtype : 'container',					
						layout : 'vbox',						
						flex : 1,
						items : [{
									xtype : 'label',								
									text : getLabel('information', 'Information'),
									padding : '0 0 0 15'
									}, {
										xtype : 'toolbar',
										itemId : 'activityFilterInfoToolBar',	
										padding : '15 0 0 10',																			
										items : [{
											xtype:'label',											
											text : getLabel('all', 'All'),
											padding : '0 5 0 5',											
											itemId : 'infoAllBtn',
											cls: 'create-advanced-filter-label ui-datepicker-header', // TODO: cls name needs to change
											listeners : {
												render : function(c) {
													c.getEl().on('click', function(){ this.fireEvent('click', c); }, c);
												}
											}											
										}, {
											xtype : 'label',												
											itemId : 'infoNewBtn',
											text : getLabel('infoNew', 'New(Since Last Login)'),
											cls: 'create-advanced-filter-label',
											padding : '0 5 0 5',
											listeners : {
												render : function(c) {
													c.getEl().on('click', function(){ this.fireEvent('click', c); }, c);
												}
											}
										}]
									}]	
				},*/							
				{
					xtype : 'container',					
					layout : 'vbox',
					flex : 1,
					items : [{
								xtype : 'panel',								
								layout : 'hbox',
								items : [{
											xtype : 'label',											
											text : getLabel('date', 'Date(This Month)'),
											itemId : 'dateLabel',
											padding : '0 0 12 30'	
										}, {
											xtype : 'button',
											border : 0,											
											itemId : 'balanceDateBtn',											
											cls : 'ui-caret-dropdown',
											listeners : {
												click:function(event){
														var menus = me.getDateDropDownItems("dateQuickFilter", this, isThisWeekHidden);
														var xy = event.getXY();
														menus.showAt(xy[0],xy[1]+16);
														event.menu=menus;													
												}
											}
										}]
							}, {
								xtype : 'panel',								
								layout : 'hbox',
								width : 280,
								items : [{
								xtype : 'component',								
								width:'80%',
								flex : 1,
								itemId : 'postingDate',								
								padding : '0 0 0 30',
								html :'<input type="text" id="postingDataPicker" class="ft-datepicker ui-datepicker-range-alignment">'
							}, {
								xtype : 'component',
								cls : 'icon-calendar',
								margin : '1 0 0 0',
								html : '<span class=""><i class="fa fa-calendar"></i></span>'
							}]
						}]
				}];
		this.callParent(arguments);
	},	
	getDateDropDownItems : function(filterType, buttonIns, isThisWeekHidden){
		var me = this;
		var intFilterDays = objClientParameters
				&& !Ext.isEmpty(objClientParameters['filterDays'])
				&& objClientParameters['filterDays'] !== 0
				? parseInt(objClientParameters['filterDays'],10)
				: '';
		var arrMenuItem = [{
					text : getLabel('latest', 'Latest'),
					btnId : 'latest',					
					btnValue : '12',
					handler : function(btn, opts) {
						$(document).trigger("dateChangeBal",
								[filterType, btn, opts]);
					}
				}];
		
		if (intFilterDays >= 2 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
						text : getLabel('yesterday', 'Yesterday'),
						btnId : 'btnYesterday',
						btnValue : '2',						
						handler : function(btn, opts) {							
							$(document).trigger("dateChangeBal",
									[filterType, btn, opts]);
						}
					});
		if (intFilterDays >= 7 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
						text : getLabel('thisweek', 'This Week'),
						btnId : 'btnThisweek',
						btnValue : '3',						
						handler : function(btn, opts) {							
							$(document).trigger("dateChangeBal",
									[filterType, btn, opts]);
						}
					});
		if (intFilterDays >= 14 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastweektodate', 'Last Week To Date'),
						btnId : 'btnLastweek',						
						btnValue : '4',
						handler : function(btn, opts) {							
							$(document).trigger("dateChangeBal",
									[filterType, btn, opts]);
						}
					});
		if (intFilterDays >= 30 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
						text : getLabel('thismonth', 'This Month'),
						btnId : 'btnThismonth',						
						btnValue : '5',
						handler : function(btn, opts) {							
							$(document).trigger("dateChangeBal",
									[filterType, btn, opts]);
						}
					});
		if (intFilterDays >= 60 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastMonthToDate', 'Last Month To Date'),
						btnId : 'btnLastmonth',
						btnValue : '6',						
						handler : function(btn, opts) {							
							$(document).trigger("dateChangeBal",
									[filterType, btn, opts]);
						}
					});
		if (lastMonthOnlyFilter===true || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastmonthonly', 'Last Month Only'),
						btnId : 'btnLastmonthOnly',
						btnValue : '14',						
						handler : function(btn, opts) {							
							$(document).trigger("dateChangeBal",
									[filterType, btn, opts]);
						}
					});
		if (intFilterDays >= 90 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
						text : getLabel('thisquarter', 'This Quarter'),
						btnId : 'btnLastMonthToDate',
						btnValue : '8',						
						handler : function(btn, opts) {							
							$(document).trigger("dateChangeBal",
									[filterType, btn, opts]);
						}
					});
		if (intFilterDays >= 180 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastQuarterToDate',
								'Last Quarter To Date'),
						btnId : 'btnQuarterToDate',
						btnValue : '9',						
						handler : function(btn, opts) {							
							$(document).trigger("dateChangeBal",
									[filterType, btn, opts]);
						}
					});
		if (intFilterDays >= 365 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
						text : getLabel('thisyear', 'This Year'),
						btnId : 'btnLastQuarterToDate',
						btnValue : '10',						
						handler : function(btn, opts) {							
							$(document).trigger("dateChangeBal",
									[filterType, btn, opts]);
						}
					});
		if (intFilterDays >= 730 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastyeartodate', 'Last Year To Date'),
						btnId : 'btnYearToDate',						
						btnValue : '11',
						handler : function(btn, opts) {							
							$(document).trigger("dateChangeBal",
									[filterType, btn, opts]);
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
			items : arrMenuItem
		});
		return dropdownMenu;
	}
});