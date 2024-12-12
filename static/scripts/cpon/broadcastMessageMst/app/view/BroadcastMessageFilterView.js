Ext.define('GCP.view.BroadcastMessageFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'broadcastMessageFilterView',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	width : '100%',
	//padding : '0 0 12 0',
	componentCls : 'gradiant_back ux_extralargemargin-bottom',
	collapsible : true,
	collapsed : true,
	cls : 'xn-ribbon ux_border-bottom ux_no-margin',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		var filterContainerArr = new Array();

		var statusStore = Ext.create('Ext.data.Store', {
					fields : ['state', 'desc'],
					data : [{
								"state" : "",
								"desc" : getLabel('all', 'ALL')
							}, {
								"state" : "0",
								"desc" : getLabel('new', 'New')
							}, {
								"state" : "1",
								"desc" : getLabel('submitted', 'Submitted')
							}, {
								"state" : "1",
								"desc" : getLabel('modified', 'Modified')
							}, {
								"state" : "3",
								"desc" : getLabel('authorized', 'Authorized')
							}, {
								"state" : "4",
								"desc" : getLabel('enableRequest',
										'Enable Request')
							}, {
								"state" : "5",
								"desc" : getLabel('disableRequest',
										'Disable Request')
							}, {
								"state" : "7",
								"desc" : getLabel('newRejected', 'New Rejected')
							}, {
								"state" : "8",
								"desc" : getLabel('modifed Rejected',
										'Modifed Rejected')
							}, {
								"state" : "10",
								"desc" : getLabel('enableRequestReject',
										'Enable Request Reject')
							}, {
								"state" : "9",
								"desc" : getLabel('disableRequestReject',
										'Disable Request Reject')
							}, {
								"state" : "3",
								"desc" : getLabel('disabled', 'Disabled')
							}]
				});

		var sellerClientContainer = Ext.create('Ext.container.Container', {
					layout : 'hbox',
					itemId : 'sellerClientFilter',
					cls : 'xn-filter-toolbar',
					width : '100%',
					items : [{
								xtype : 'panel',
								layout : 'vbox',
								flex : 1,
								itemId : 'sellerFilter',
								items : []
							}]
				});

		// this.items = [
		var broadcastMessageContainer = Ext.create('Ext.container.Container', {
			xtype : 'panel',
			layout : 'hbox',
			width : '100%',
			cls : 'ux_largepadding',
			items : [{
						xtype : 'panel',
						layout : 'vbox',
						flex : 0.4,
						itemId : 'specificFilter',
						items : []
					}, {
						xtype : 'panel',
						cls : 'xn-filter-toolbar ',
						layout : 'vbox',
						margin : '0 0 0 0',
						flex : 0.4,
						items : [{
							xtype : 'panel',
							layout : 'hbox',
							items : [{
										xtype : 'label',
										itemId : 'dateLabel',
										text : 'Start Date(Latest)',
										cls : 'ux_font-size14',
										padding : '0 0 6 0'
									}, {
										xtype : 'button',
										border : 0,
										filterParamName : 'messageDate',
										itemId : 'messageDate',
										cls : 'menu-disable xn-custom-arrow-button cursor_pointer ux_no-padding',
										glyph : 'xf0d7@fontawesome',
										style : 'padding-top :2px !important;',
										menu : Ext.create('Ext.menu.Menu', {
											items : [{
												text : getLabel('Latest',
														'Latest'),
												btnId : 'btnLatest',
												btnValue : '12',
												parent : this,
												handler : function(btn, opts) {
													this.parent.fireEvent(
															'dateChange', btn,
															opts);
												}
											}, {
												text : getLabel('today',
														'Today'),
												btnId : 'btnToday',
												btnValue : '1',
												parent : this,
												handler : function(btn, opts) {
													this.parent.fireEvent(
															'dateChange', btn,
															opts);
												}
											}, {
												text : getLabel('yesterday',
														'Yesterday'),
												btnId : 'btnYesterday',
												btnValue : '2',
												parent : this,
												handler : function(btn, opts) {
													this.parent.fireEvent(
															'dateChange', btn,
															opts);
												}
											}, {
												text : getLabel('thisweek',
														'This Week'),
												btnId : 'btnThisweek',
												btnValue : '3',
												parent : this,
												handler : function(btn, opts) {
													this.parent.fireEvent(
															'dateChange', btn,
															opts);
												}
											}, {
												text : getLabel('lastweek',
														'Last Week To Date'),
												btnId : 'btnLastweekToDate',
												parent : this,
												btnValue : '4',
												handler : function(btn, opts) {
													this.parent.fireEvent(
															'dateChange', btn,
															opts);
												}
											}, {
												text : getLabel('thismonth',
														'This Month'),
												btnId : 'btnThismonth',
												parent : this,
												btnValue : '5',
												handler : function(btn, opts) {
													this.parent.fireEvent(
															'dateChange', btn,
															opts);
												}
											}, {
												text : getLabel('lastmonth',
														'Last Month To Date'),
												btnId : 'btnLastmonthToDate',
												btnValue : '6',
												parent : this,
												handler : function(btn, opts) {
													this.parent.fireEvent(
															'dateChange', btn,
															opts);
												}
											}, {
												text : getLabel('thisquarter',
														'This Quarter'),
												btnId : 'btnLastMonthToDate',
												btnValue : '8',
												parent : this,
												handler : function(btn, opts) {
													this.parent.fireEvent(
															'dateChange', btn,
															opts);
												}
											}, {
												text : getLabel(
														'lastQuarterToDate',
														'Last Quarter To Date'),
												btnId : 'btnQuarterToDate',
												btnValue : '9',
												parent : this,
												handler : function(btn, opts) {
													this.parent.fireEvent(
															'dateChange', btn,
															opts);
												}
											}, {
												text : getLabel('thisyear',
														'This Year'),
												btnId : 'btnLastQuarterToDate',
												btnValue : '10',
												parent : this,
												handler : function(btn, opts) {
													this.parent.fireEvent(
															'dateChange', btn,
															opts);
												}
											}, {
												text : getLabel(
														'lastyeartodate',
														'Last Year To Date'),
												btnId : 'btnYearToDate',
												parent : this,
												btnValue : '11',
												handler : function(btn, opts) {
													this.parent.fireEvent(
															'dateChange', btn,
															opts);
												}
											}, {
												text : getLabel('daterange',
														'Date Range'),
												btnId : 'btnDateRange',
												parent : this,
												btnValue : '7',
												handler : function(btn, opts) {
													this.parent.fireEvent(
															'dateChange', btn,
															opts);
												}
											}]
										})

									}]
						}, {
							xtype : 'panel',
							layout : 'hbox',
							items : [{
								xtype : 'container',
								itemId : 'dateRangeComponent',
								layout : 'hbox',
								hidden : true,
								items : [{
									xtype : 'datefield',
									itemId : 'fromDate',
									hideTrigger : true,
									width : 80,
									height : 25,
									fieldCls : 'h2',
									padding : '0 3 0 0',
									editable : false,
									value : new Date(Ext.Date.parse(
											dtApplicationDate,
											strExtApplicationDateFormat))
								}, {
									xtype : 'datefield',
									itemId : 'toDate',
									hideTrigger : true,
									padding : '0 3 0 0',
									editable : false,
									width : 80,
									height : 25,
									fieldCls : 'h2',
									value : new Date(Ext.Date.parse(
											dtApplicationDate,
											strExtApplicationDateFormat))
								}, {
									xtype : 'button',
									text : getLabel('goBtnText', 'Go'),
									itemId : 'goBtn',
									cls : 'ux_button-background-color ux_button-padding'
								}]
							}, {
								xtype : 'toolbar',
								itemId : 'dateToolBar',
								cls : 'xn-toolbar-small',
								padding : '2 0 0 1',
								items : [{
											xtype : 'label',
											itemId : 'dateFilterFrom',
											text : dtApplicationDate
										}, {
											xtype : 'label',
											itemId : 'dateFilterTo'
										}]
							}]
						}]
					}, 
					/*{
						xtype : 'panel',
						cls : 'xn-filter-toolbar  ',
						layout : 'vbox',
						flex : 0.3,
						items : [{
									xtype : 'label',
									margin : '0 0 0 4',
									text : getLabel('status', 'Status'),
									cls : 'frmLabel '
								}, {
									xtype : 'combobox',
									fieldCls : 'xn-form-field inline_block',
									labelCls : 'frmLabel',
									triggerBaseCls : 'xn-form-trigger',
									width : 163,
									padding : '1 5 1 5',
									itemId : 'statusFilter',
									filterParamName : 'requestState',
									store : statusStore,
									valueField : 'state',
									displayField : 'desc',
									editable : false,
									value : ''
								}]

					}, */{
						xtype : 'panel',
						cls : 'xn-filter-toolbar ',
						layout : 'vbox',
						flex : 0.2,
						items : [{
									xtype : 'panel',
									layout : 'hbox',
									padding : '23 0 1 5',
									items : [{
												xtype : 'button',
												itemId : 'btnFilter',
												text : getLabel('search',
														'Search'),
												cls : 'search_button ux_button-background-color ux_button-padding'
											}]
								}]
					}]
		});
		filterContainerArr.push(sellerClientContainer);
		filterContainerArr.push(broadcastMessageContainer);

		this.items = [{
					xtype : 'container',
					width : '100%',
					layout : 'vbox',
					items : filterContainerArr
				}];

		this.callParent(arguments);
	}
});