/**
 * @class GCP.view.summary.AccountSummaryFilterView
 * @extends Ext.panel.Panel
 * @author Vinay Thube
 */
Ext.define('GCP.view.summary.AccountSummaryFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'accountSummaryFilterView',
	layout:'hbox',	
	initComponent : function() {
		var me = this;				
		var isInfoHidden = false;	
		var	datePickerDisable = /*"disabled"*/ '';
		var isThisWeekHidden = false;		
		var strAppDate = dtApplicationDate;
		var dtFormat = strExtApplicationDateFormat;
		var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
		
		if (date.getDay() === 1)
			isThisWeekHidden = true;
		
		if(objClientParameters && objClientParameters.enableRealtime && objClientParameters.enableRealtime == true){
			if (summaryType === 'previousday' || summaryType === 'intraday'){
					isInfoHidden = true;
					datePickerDisable = "";
				}
			}else{
				isInfoHidden = true;
			}
		
var me=this, strUrl='';
		
		var clientStore = Ext.create('Ext.data.Store', {
					fields : ['CODE', 'DESCRIPTION']
				});
		Ext.Ajax.request({
					url : 'services/userseek/btrSummaryCorpSeek.json',
					method : 'POST',
					async : false,
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var data = responseData.d.preferences;
						if (clientStore) {
							clientStore.removeAll();
							var count = data.length;
							if (count > 1) {
								clientStore.add({
											'CODE' : '',
											'DESCRIPTION' : 'Select'
										});
							}
							for (var index = 0; index < count; index++) {
								var record = {
									'CODE' : data[index].CODE,
									'DESCRIPTION' : data[index].DESCRIPTION
								}
								clientStore.add(record);
							}
						}
					},
					failure : function() {
					}
				});
		
		
		me.items = [{
			xtype : 'container',
			layout : 'vbox',
			hidden : entityType === '0' ? false : true,//If count is one or admin then hide
			width : '25%',
			padding : '0 30 0 0',
			items : [{
						xtype : 'label',
						itemId : 'savedFiltersLabel',
						text : getLabel('lblcompany', 'Company Name')
					}, {
						xtype : 'combo',
						displayField : 'DESCRIPTION',
						valueField : 'CODE',
						queryMode : 'local',
						editable : false,
						triggerAction : 'all',
						width : '100%',
						padding : '-4 0 0 0',
						itemId : 'clientCombo',
						mode : 'local',
						emptyText : getLabel('selectCompany', 'Select Company'),
						store : clientStore,
						listeners : {
							'select' : function(combo, record) {
								handleResetSummaryClientFilter(combo.getValue(), combo.getRawValue());
							},
							boxready : function(combo, width, height, eOpts) {
								//combo.setValue(combo.getStore().getAt(0));
							}
						}
					}]
		},{
						xtype : 'container',					
						layout : 'vbox',
						hidden : isInfoHidden,
						width : 250,
						padding : '0 0 2 0',
						items : [{
									xtype : 'label',								
									text : getLabel('information', 'information'),
									padding : '0 0 0 0',
									margin : '0 0 4 0',
									emptyText : getLabel('information', 'information'),
									width : 250
									}, {
										xtype : 'toolbar',
										itemId : 'ViewInfoToolBar',											
										items : [{
											xtype:'label',		
											margin : '6 10 0 0',									
											text : getLabel('lastRecieved', 'Last Received'),
											padding : '6 12 6 12',
											emptyText : getLabel('lastRecieved', 'Last Received'),
											itemId : 'latestBtn',
											cls: 'create-advanced-filter-label ', // TODO: cls name needs to change
											listeners : {
												render : function(c) {
													c.getEl().on('click', function(){ this.fireEvent('click', c); }, c);
												}
											}											
										}, {
											xtype : 'label',		
											margin : '6 0 0 0',										
											itemId : 'realTimeBtn',
											text : getLabel('latest', 'Latest'),
											cls: 'create-advanced-filter-label ui-datepicker-header',
											padding : '6 12 6 12',
											emptyText : getLabel('latest', 'Latest'),
											listeners : {
												render : function(c) {
													c.getEl().on('click', function(){ this.fireEvent('click', c); }, c);
												}
											}
										}]
									}]	
				},							
				{
					xtype : 'container',					
					layout : 'vbox',
					width : 290,
					padding : '0 30 0 0',
					items : [{
								xtype : 'panel',								
								layout : 'hbox',
								width : 250,
								height: 23,
								items : [{
											xtype : 'label',											
											text : getLabel('date', 'Date'),
											itemId : 'dateFilterTitle',
											padding : '0 0 0 0'	
										}, {
											xtype : 'button',
											border : 0,											
											itemId : 'summaryDateBtn',
											hidden : ( summaryType === 'intraday' && isInfoHidden ? true : false ),
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
							},
							{
								xtype : 'panel',								
								layout : 'hbox',
								width : 250,
								items : [{
									xtype : 'component',								
									width : '85%',
									itemId : 'displayDate',								
									padding : '0 0 0 0',
									hidden : ( summaryType === 'previousday' ? false : true ),
									html :'<input type="text" id="displayDataPicker" class="ft-datepicker ui-datepicker-range-alignment" '+datePickerDisable+'>'
								}, {
									xtype : 'component',
									cls : 'icon-calendar',
									margin : '1 0 0 0',
									hidden : ( summaryType === 'previousday' ? false : true ),
									html : '<span class=""><i class="fa fa-calendar"></i></span>'
								}, {
									xtype : 'label',											
									text : Ext.Date.format(new Date(Ext.Date.parse(dtApplicationDate, strExtApplicationDateFormat)) , serverdateFormat),
									itemId : 'todaysDate',
									hidden : ( summaryType === 'previousday' ? true : false ),
									padding : '8 0 0 0'	
								}]
							}
					]
				},
				{
					xtype : 'container',
					layout : 'vbox',
					padding : '0 30 0 0',
					width : '34%',
					hidden : entityType == '0' ? true : false,
					items : [{
								xtype : 'label',
								text : getLabel('lblsavedaccountset',
										'Account Set'),
								flex : 1,
								padding : '0 0 0 0'
							}, {
								xtype : 'combo',
								valueField : 'btn',
								displayField : 'text',
								queryMode : 'local',
								name : 'accountSet',
								editable : false,
								itemId : 'viewAccountCombo',
								mode : 'local',
								filterParamName : 'accountId',
								padding : '0 0 0 0',
								emptyText : getLabel('lblsavedaccountset', 'Account Set'),
								width : 250,
								store : Ext.create(
										'Ext.data.JsonStore', {
											fields : ['text', 'btn'],
											data : []
										})

							}]
				}];
		this.callParent(arguments);
	},
	getDateDropDownItems : function(filterType, buttonIns, isThisWeekHidden){
		var me = this;
		var intFilterDays = objClientParameters
				&& !Ext.isEmpty(objClientParameters['filterDays'])
				? parseInt(objClientParameters['filterDays'],10)
				: '';
		
		var arrMenuItem = [{
					text : getLabel('latest', 'Latest'),
					btnId : 'latest',					
					btnValue : '12',
					handler : function(btn, opts) {
						me.fireEvent('dateChange', btn, opts);
					}
				}];

		if (intFilterDays >= 2 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
						text : getLabel('accsummary.yesterday', 'Yesterday'),
						btnId : 'btnYesterday',
						btnValue : '2',
						parent : me,
						handler : function(btn, opts) {
							me.fireEvent('dateChange', btn, opts);
						}
					});

		if (intFilterDays >= 7 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
						text : getLabel('accsummary.thisweek', 'This Week'),
						btnId : 'btnThisweek',
						btnValue : '3',
						parent : me,
						hidden : isThisWeekHidden,
						handler : function(btn, opts) {
							me.fireEvent('dateChange', btn, opts);
						}
					});
		if (intFilterDays >= 14 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastweektodate',
								'Last Week to Yesterday'),
						btnId : 'btnLastweek',
						parent : me,
						btnValue : '4',
						handler : function(btn, opts) {
							me.fireEvent('dateChange', btn, opts);
						}
					});
		if (intFilterDays >= 30 || Ext.isEmpty(intFilterDays))
		{
			arrMenuItem.push({
						text : getLabel('accsummary.thismonth', 'This Month'),
						btnId : 'btnThismonth',
						parent : me,
						btnValue : '5',
						handler : function(btn, opts) {
							me.fireEvent('dateChange', btn, opts);
						}
					});
		}
		if (intFilterDays >= 60 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastMonthToDate',
								'Last Month to Yesterday'),
						btnId : 'btnLastmonth',
						btnValue : '6',
						parent : me,
						handler : function(btn, opts) {
							me.fireEvent('dateChange', btn, opts);
						}
					});
		if (lastMonthOnlyFilter===true || Ext.isEmpty(intFilterDays))
		{
			arrMenuItem.push({
						text : getLabel('lastmonthonly', 'Last Month Only'),
						btnId : 'btnLastmonthonly',
						parent : me,
						btnValue : '14',
						handler : function(btn, opts) {
							me.fireEvent('dateChange', btn, opts);
						}
					  });
		}
		if (intFilterDays >= 90 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
						text : getLabel('accsummary.thisquarter',
								'This Quarter'),
						btnId : 'btnLastMonthToDate',
						btnValue : '8',
						parent : me,
						handler : function(btn, opts) {
							me.fireEvent('dateChange', btn, opts);
						}
					});
		if (intFilterDays >= 180 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
				text : getLabel('lastQuarterToDate', 'Last Quarter to Yesterday'),
				btnId : 'btnQuarterToDate',
				btnValue : '9',
				parent : me,
				handler : function(btn, opts) {
					me.fireEvent('dateChange', btn, opts);
				}
			});
		if (intFilterDays >= 365 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
						text : getLabel('accsummary.thisyear', 'This Year'),
						btnId : 'btnLastQuarterToDate',
						btnValue : '10',
						parent : me,
						handler : function(btn, opts) {
							me.fireEvent('dateChange', btn, opts);
						}
					});
		if (intFilterDays >= 730 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastyeartodate',
								'Last Year to Yesterday'),
						btnId : 'btnYearToDate',
						parent : me,
						btnValue : '11',
						handler : function(btn, opts) {
							me.fireEvent('dateChange', btn, opts);
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