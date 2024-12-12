Ext.define('GCP.view.SearchTransactionFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'searchTransactionFilterView',
	requires : [],
	width : '100%',
	margin : '0 0 10 0',
	componentCls : 'gradiant_back',
	title : getLabel('filterBy', 'Filter By :')
			+ '<img id="imgTemplateInfo" class="largepadding icon-information"/>',
	collapsible : true,
	cls : 'xn-ribbon',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		this.items = [{
			xtype : 'panel',
			layout : 'hbox',
			items : [{
				xtype : 'panel',
				cls : 'xn-filter-toolbar',
				layout : 'vbox',
				flex : 0.7,
				items : [{
					xtype : 'panel',
					layout : 'hbox',
					items : [{
								xtype : 'label',
								itemId : 'dateLabel',
								text : getLabel('dateToday', 'Date (Today)'),
								cls : 'f13',
								padding : '6 0 0 5'
							}, {
								xtype : 'button',
								border : 0,
								filterParamName : 'PostingDate',
								itemId : 'postingDate',
								cls : 'xn-custom-arrow-button cursor_pointer w1',
								padding : '6 0 0 3',
								menu : Ext.create('Ext.menu.Menu', {
									items : [{
										text : getLabel('today', 'Today'),
										btnId : 'btnToday',
										btnValue : '1',
										parent : this,
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									}, {
										text : getLabel('yesterday',
												'Yesterday'),
										btnId : 'btnYesterday',
										btnValue : '2',
										parent : this,
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									}, {
										text : getLabel('thisweek', 'This Week'),
										btnId : 'btnThisweek',
										btnValue : '3',
										parent : this,
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									}, {
										text : getLabel('lastweektodate',
												'Last Week To Date'),
										btnId : 'btnLastweek',
										parent : this,
										btnValue : '4',
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									}, {
										text : getLabel('thismonth',
												'This Month'),
										btnId : 'btnThismonth',
										parent : this,
										btnValue : '5',
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									}, {
										text : getLabel('lastMonthToDate',
												'Last Month To Date'),
										btnId : 'btnLastmonth',
										btnValue : '6',
										parent : this,
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									}, {
										text : getLabel('thisquarter',
												'This Quarter'),
										btnId : 'btnLastMonthToDate',
										btnValue : '8',
										parent : this,
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									}, {
										text : getLabel('lastQuarterToDate',
												'Last Quarter To Date'),
										btnId : 'btnQuarterToDate',
										btnValue : '9',
										parent : this,
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									}, {
										text : getLabel('thisyear', 'This Year'),
										btnId : 'btnLastQuarterToDate',
										btnValue : '10',
										parent : this,
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									}, {
										text : getLabel('lastyeartodate',
												'Last Year To Date'),
										btnId : 'btnYearToDate',
										parent : this,
										btnValue : '11',
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									}, {
										text : getLabel('daterange',
												'Date Range'),
										btnId : 'btnDateRange',
										parent : this,
										btnValue : '7',
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									}]
								})

							}]
				}, {
					xtype : 'panel',
					layout : 'hbox',
					padding : '6 0 0 5',
					items : [{
						xtype : 'container',
						itemId : 'dateRangeComponent',
						layout : 'hbox',
						hidden : true,
						items : [{
							xtype : 'datefield',
							itemId : 'fromDate',
							hideTrigger : true,
							width : 70,
							fieldCls : 'h2',
							cls : 'date-range-font-size',
							padding : '0 3 0 0',
							editable : false,
							value : new Date(Ext.Date.parse(dtApplicationDate,
									strExtApplicationDateFormat))
						}, {
							xtype : 'datefield',
							itemId : 'toDate',
							hideTrigger : true,
							padding : '0 3 0 0',
							editable : false,
							width : 70,
							fieldCls : 'h2',
							cls : 'date-range-font-size',
							value : new Date(Ext.Date.parse(dtApplicationDate,
									strExtApplicationDateFormat))
						}, {
							xtype : 'button',
							text : getLabel('goBtnText', 'Go'),
							itemId : 'goBtn',
							height : 22
						}]
					}, {
						xtype : 'toolbar',
						itemId : 'dateToolBar',
						cls : 'xn-toolbar-small',
						padding : '2 0 0 1',
						items : [{
									xtype : 'label',
									itemId : 'fromDateLabel',
									text : dtApplicationDate
								}, {
									xtype : 'label',
									itemId : 'toDateLabel'
								}]
					}]
				}]
			}, {
				xtype : 'panel',
				layout : 'vbox',
				flex : 0.7,
				items : [{
							xtype : 'label',
							text : getLabel('txncategory',
									'Transaction Category'),
							cls : 'f13',
							padding : '6 0 0 5'
						}, {
							xtype : 'toolbar',
							itemId : 'txncatFilterPanel',
							cls : 'xn-toolbar-small',
							layout : 'hbox',
							items : [{
										xtype : 'label',
										itemId : 'txnCategoryLabel',
										text : getLabel('all', 'All'),
										padding : '6 0 0 5'
									}, {
										xtype : 'button',
										border : 0,
										itemId : 'btnTxnCategoryMenu',
										padding : '3 0 0 0',
										cls : 'xn-custom-more-btn cursor_pointer x-zero-padding',
										menu : Ext.create('Ext.menu.Menu', {
													itemId : 'txnCatMenu',
													items : []
												})

									}]
						}]
			}, {
				xtype : 'panel',
				itemId : 'templatePanel',
				cls : 'xn-filter-toolbar',
				flex : 0.9,
				layout : {
					type : 'vbox'
				},
				items : [{
					xtype : 'panel',
					layout : {
						type : 'hbox'
					},
					items : [{
								xtype : 'label',
								text : getLabel('templates', 'Templates'),
								cls : 'f13',
								padding : '6 0 0 6'
							}, {
								xtype : 'image',
								src : 'static/images/icons/icon_spacer.gif',
								height : 18,
								padding : '5 0 0 9'

							}, {
								xtype : 'button',
								itemId : 'newFilter',
								text : '<span class="button_underline thePoniter ux_font-size14-normal">'
										+ getLabel('createNewTemplate',
												'Create New Template')
										+ '</span>',
								cls : 'xn-account-filter-btnmenu xn-small-button',
								width : 110,
								margin : '7 0 0 0',
								handler : function(btn, opts) {
									btn.fireEvent('newFilterClick', btn, opts);
								}
							}]
				}, {
					xtype : 'toolbar',
					itemId : 'templateActionToolBar',
					cls : 'xn-toolbar-small',
					padding : '5 0 0 1',
					width : '100%',
					enableOverflow : true,
					border : false,
					items : []
				}]
			}]
		}

		];
		this.callParent(arguments);
	},
	tools : [{
				xtype : 'button',
				itemId : 'btnSavePreferences',
				icon : 'static/images/icons/save.gif',
				disabled : true,
				text : getLabel('saveFilter', 'Save Preferences'),
				cls : 'xn-account-filter-btnmenu',
				textAlign : 'right',
				width : 110
			}]
});