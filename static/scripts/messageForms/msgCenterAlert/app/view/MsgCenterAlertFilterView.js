Ext.define('GCP.view.MsgCenterAlertFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'msgCenterAlertFilterView',
	requires : [],
	width : '100%',
	padding : '0 0 12 0',
	componentCls : 'gradiant_back',
	cls : 'xn-ribbon ux_border-bottom',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		this.items = [{
			xtype : 'panel',
			cls : 'ux_largepadding',
			layout : 'hbox',
			items : [{
				xtype : 'panel',
				cls : 'xn-filter-toolbar',
				flex : 0.8,
				layout : {
					type : 'vbox'
				},
				items : [{
							xtype : 'label',
							text : 'Status',
							cls : 'ux_font-size14',
							flex : 1,
							padding : '0 0 6 0'
						}, {
							xtype : 'toolbar',
							itemId : 'msgCenterAlertTypeToolBar',
							cls : 'xn-toolbar-small ux_no-padding',
							filterParamName : 'type',
							width : '100%',
							//enableOverflow : true,
							border : false,
							componentCls : 'xn-btn-default-toolbar-small xn-custom-more-toolbar',
							items : [{
								text : getLabel('select', 'All'),
								code : 'all',
								btnId : 'allType',
								parent : this,
								cls : 'f13 xn-custom-heighlight ux_no-padding',
								handler : function(btn, opts) {
									this.parent.fireEvent('filterType',btn, opts);
								}
							},{
								text : getLabel('read', 'Read'),
								btnId : 'read',
								code : 'read',
								parent : this,
								handler : function(btn, opts) {
									this.parent.fireEvent('filterType',btn, opts);
								}
							},{
								text : getLabel('unread', 'Unread'),
								btnId : 'unread',
								code : 'unread',
								parent : this,
								handler : function(btn, opts) {
									this.parent.fireEvent('filterType',btn, opts);
								}
							}
							]
						}]
			
			},{
				xtype : 'panel',
				cls : 'xn-filter-toolbar',
				layout : 'vbox',
				flex : 0.8,
				items : [{
					xtype : 'panel',
					layout : 'hbox',
					items : [{
								xtype : 'label',
								itemId : 'dateLabel',
								text : getLabel('alertDate', 'Alert Date'),
								cls : 'ux_font-size14',
								padding : '0 0 6 0'
							}, {
								xtype : 'button',
								border : 0,
								filterParamName : 'AlertDate',
								itemId : 'alertDate',// Required
								cls : 'menu-disable xn-custom-arrow-button cursor_pointer',
								glyph : 'xf0d7@fontawesome',
								menu : Ext.create('Ext.menu.Menu', {
									items : [{
										text : getLabel('latest', 'Latest'),
										btnId : 'btnLatest',
										btnValue : '12',
										parent : this,
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									},{
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
										text : getLabel('lastweek', 'Last Week To Date'),
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
										text : getLabel('lastmonth',
												'Last Month To Date'),
										btnId : 'btnLastmonth',
										btnValue : '6',
										parent : this,
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									},{
										text : getLabel('thisquarter','This Quarter'),
										btnId : 'btnLastMonthToDate',
										btnValue : '8',
										parent : this,
										handler : function(btn,opts) {
											this.parent.fireEvent('dateChange',btn,opts);
										}
									},{
										text :  getLabel('lastQuarterToDate', 'Last Quarter To Date'),
										btnId : 'btnQuarterToDate',
										btnValue : '9',
										parent : this,
										handler : function(btn,opts) {
											this.parent.fireEvent('dateChange',btn,opts);
										}
									},{
										text : getLabel('thisyear','This Year'),
										btnId : 'btnLastQuarterToDate',
										btnValue : '10',
										parent : this,
										handler : function(btn,opts) {
											this.parent.fireEvent('dateChange',btn,opts);
										}
									},{
										text : getLabel('lastyeartodate','Last Year To Date'),
										btnId : 'btnYearToDate',
										parent : this,
										btnValue : '11',
										handler : function(btn,opts) {
											this.parent.fireEvent('dateChange',btn,opts);
										}
									},{
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
					items : [{
								xtype : 'container',
								itemId : 'dateRangeComponent',
								layout : 'hbox',
								hidden : true,
								items : [{
											xtype : 'datefield',
											itemId : 'fromDate',
											hideTrigger : true,
											width : 75,
											fieldCls : 'h2',
											padding : '0 3 0 0',
											editable : false,
											value : new Date(Ext.Date.parse(dtApplicationDate, strExtApplicationDateFormat))
										}, {
											xtype : 'datefield',
											itemId : 'toDate',
											hideTrigger : true,
											padding : '0 3 0 0',
											editable : false,
											width : 75,
											fieldCls : 'h2',
											value : new Date(Ext.Date.parse(dtApplicationDate, strExtApplicationDateFormat))
										}, {
											xtype : 'button',
											cls : 'ux_button-background-color ux_button-padding',
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
											itemId : 'dateFilterFrom',
											text : dtApplicationDate
										}, {
											xtype : 'label',
											itemId : 'dateFilterTo'
										}]
							}]
				}]
			},
			{
				xtype : 'panel',
				cls : 'xn-filter-toolbar',
				layout : 'vbox',
				flex : 0.8,
				items : [{
					xtype  : 'panel',
					layout : 'hbox',
					itemId : 'msgEventPanel',
					items  : []
				}, {
					xtype : 'panel',
					layout : 'hbox',
					items :
					[
						{
							xtype : 'toolbar',
							itemId : 'msgToolBar',
							cls : 'xn-toolbar-small ux_no-padding',
							items :
							[
								{
									xtype : 'label',
									itemId : 'strMsgValue',
									text : 'All'
								}
							]
						}
					]
				}]
			}]
		}];
		this.callParent(arguments);
	},
	highlightSavedStatus : function(strFilterCode) {
		var me = this;
		var objToolbar = me.down('toolbar[itemId="msgCenterAlertTypeToolBar"]');
		if (objToolbar) {
			objToolbar.items.each(function(item) {
						item.removeCls('xn-custom-heighlight');
						if (item.btnId === strFilterCode)
							item.addCls('xn-custom-heighlight');
					});
		}
	},
	tools : [/*{
				xtype : 'button',
				itemId : 'btnSavePreferences',
				icon : 'static/images/icons/save.gif',
				disabled : true,
				text : getLabel('saveFilter', 'Save Preferences'),
				cls : 'xn-account-filter-btnmenu',
				textAlign : 'right',
				width : 120
			}*/{
				xtype : 'label',
				text  : getLabel('preferences','Preferences : '),
				cls : 'xn-account-filter-btnmenu'
			},{
				xtype : 'button',
				itemId : 'btnClearPreferences',
				disabled : false,
				text : getLabel('clearFilter', 'Clear'),
				cls : 'xn-account-filter-btnmenu',
				textAlign : 'right',
				width : 40
			},{
				xtype : 'image',
				src : 'static/images/icons/icon_spacer.gif',
				height : 18
			},{
				xtype : 'button',
				itemId : 'btnSavePreferences',
				disabled : true,
				text : getLabel( 'saveFilter', 'Save' ),
				cls : 'xn-account-filter-btnmenu',
				textAlign : 'right',
				width : 30
			}]
});