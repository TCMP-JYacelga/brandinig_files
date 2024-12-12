Ext.define('GCP.view.ClientBroadcastMessageFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'clientBroadcastMessageFilterView',
	requires : [ 'Ext.ux.gcp.AutoCompleter' ],
	width : '100%',
	componentCls : 'gradiant_back',
	cls : 'xn-ribbon ux_border-bottom ux_extralargemargin-bottom',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		var me = this;
		broadcastView = this;
		me.on('afterrender', function(panel) {
			Ext.Ajax.request({
						url : 'services/userseek/userclients.json',
						method : "POST",
						async : false,
						success : function(response) {
							if (response && response.responseText)
							{
								var data = Ext.decode(response.responseText);
								var clientArray = data.d.preferences || [];
								var filterClientMenuContainer = me
								.down('container[itemId="filterCorporationContainer"]');								
								if (null != clientArray && clientArray.length <= 1) {
									filterClientMenuContainer.hide();
								}								
							}								
						},
						failure : function(response) {
						}
					});
		});		
		
		this.items = [{
						xtype : 'panel',
						layout : 'hbox',
						width : '100%',
						cls : 'ux_largepadding',
						items : [
									{
										xtype : 'panel',
										layout : 'vbox',
										flex : 0.2,
										itemId : 'specificFilter',
										items : [{
													xtype : 'label',
													text : getLabel('lblSubject', 'Subject'),
													cls : 'frmLabel',
													padding : '4 0 0 20'
												}, {
													padding : '1 0 0 0',
													xtype : 'AutoCompleter',
													fieldCls : 'xn-form-text w165 xn-suggestion-box',
													itemId : 'messageCompleter',
													name : 'messageCompleter',
													cfgUrl : 'services/userseek/brodcastMessageSeek.json',
													cfgRecordCount : -1,
													cfgRootNode : 'd.preferences',
													cfgDataNode1 : 'DESCR',
													cfgKeyNode : 'DESCR',
													cfgQueryParamName : '$autofilter',
													listeners : {
														'change' : function(combo,record)
														{
															if (record == null) {
																broadcastView.fireEvent('handleSubjectChange');
															}
														},
														'select' : function(combo, record) {
															broadcastView.fireEvent('handleSubjectChange');
														},
														'blur' : function(combo, record) {
															broadcastView.fireEvent('handleSubjectChange');
														}														
													}
												}]
											}, {
												xtype : 'panel',
												cls : 'xn-filter-toolbar ',
												layout : 'vbox',
												margin : '0 0 0 0',
												flex : 0.2,
												items : [{
													xtype : 'panel',
													layout : 'hbox',
													items : [{
																xtype : 'label',
																itemId : 'dateLabel',
																text : getLabel('lblMessageDate','Message Date') + ' (Latest)',
																cls : 'ux_font-size14',
																padding : '0 0 6 0'
															}, {
																xtype : 'button',
																border : 0,
																filterParamName : 'brodDate',
																itemId : 'brodDate',
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
											}						         
						 ]
					  }

	];
		this.callParent(arguments);
	},
	tools : [{
		xtype : 'container',
		itemId : 'filterCorporationContainer',
		cls : 'paymentqueuespacer',
		padding : '0 0 0 5',
		width : '30%',
		layout : {
			type : 'hbox'
		},
		items : [{
			xtype : 'label',
			margin : '3 0 0 0',
			html : '<i href="#" id="imgFilterInfo" class="icon-company largepadding"></i>'
		},{
			xtype : 'AutoCompleter',
			margin : '0 0 0 5',
			fieldCls : 'xn-form-text xn-suggestion-box',
			itemId : 'clientAutoCompleter',
			name : 'clientAutoCompleter',
			cfgUrl : 'services/userseek/userclients.json',
			cfgRecordCount : -1,
			cfgRootNode : 'd.preferences',
			cfgDataNode1 : 'DESCR',
			cfgKeyNode : 'DESCR',
			cfgQueryParamName : '$autofilter',
			listeners : {
				'change' : function(combo,record)
				{
					if (record == null) {
						broadcastView.fireEvent('handleClientChange');
					}
				},				
				'select' : function(combo, record) {
					broadcastView.fireEvent('handleClientChange');
				},
				'blur' : function(combo, record) {
					broadcastView.fireEvent('handleClientChange');
				}				
			}
		}]
	},
	  { xtype : 'container', 
		padding : '0 9 0 0',
		layout : 'hbox',
		items : [{
				 xtype : 'label',
				 text : getLabel('preferences', 'Preferences : '),
				 padding : '2 0 0 0' 
		  }, 
		  {
			  xtype : 'button',
			  itemId : 'btnClearPreferences',
			  disabled : true,
			  text : getLabel('clearFilter', 'Clear'),
			  cls :'xn-account-filter-btnmenu', 
			  textAlign : 'right',
			  width : 40 
		 },
		 {
			  xtype : 'image',
			  src : 'static/images/icons/icon_spacer.gif',
			  height : 18
		}, 
		{ 
			xtype : 'button',
			itemId : 'btnSavePreferences',
			disabled : true,
			text : getLabel('saveFilter', 'Save'),
			cls : 'xn-account-filter-btnmenu',
			textAlign : 'right',
			width : 30
		}]
	  }
	]
});
