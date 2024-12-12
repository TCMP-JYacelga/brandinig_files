Ext.define('GCP.view.ClientBroadcastMessageFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'clientBroadcastMessageFilterView',
	requires : [ 'Ext.ux.gcp.AutoCompleter' ],
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		var me = this;
		broadcastView = this;
		var clientStore = Ext.create('Ext.data.Store', {
					fields : ['CODE', 'DESCR']
				});
		/*me.on('afterrender', function(panel) {
			Ext.Ajax.request({
						url : 'services/userseek/userclients.json',
						method : "GET",
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
					});*/
		/*me.on('afterrender', function(panel) {
			Ext.Ajax.request({
						url : 'services/userseek/userclients.json',
						method : "POST",
						async : false,
						success : function(response) {
							if (response && response.responseText)
								me.populateClientMenu(Ext
										.decode(response.responseText));
						},
						failure : function(response) {
							// console.log('Error Occured');
						}
					});
		});
		me.on('afterrender', function(panel) {
					var clientBtn = me.down('combo[itemId="clientAutoCompleter"]');
					if (clientBtn)
						clientBtn.setRawValue(getLabel('allCompanies', 'All companies'));							
				});*/
		var broadcastStore = Ext.create('Ext.data.Store', {
			fields : ['CODE', 'DESCR']
		});
			Ext.Ajax.request({
						url : 'services/userseek/userclients.json',
						method : 'POST',
						async : false,
						success : function(response) {
							var responseData = Ext.decode(response.responseText);
							var data = responseData.d.preferences;
							if (broadcastStore) {
								broadcastStore.removeAll();
								var count = data.length;
								if (count > 1) {
									broadcastStore.add({
												'CODE' : 'All Companies',
												'DESCR' : getLabel('allCompanies', 'All Companies')
											});
								}
								for (var index = 0; index < count; index++) {
									var record = {
										'CODE' : data[index].CODE,
										'DESCR' : data[index].DESCR
									}
									broadcastStore.add(record);
								}
							}
						},
						failure : function() {
						}
					});

					
		
		this.items = [
						{
							xtype : 'container',
							itemId : 'filterCorporationContainer',	
							layout : 'vbox',
							hidden : (broadcastStore.getCount() > 1) ? false : true,//If count is one
							width : '25%',
							padding : '0 30 0 0',
							items : [{
										xtype : 'label',
										text : getLabel('company', 'Company Name')
									}, {
										xtype : 'combo',
										displayField : 'DESCR',
										valueField : 'CODE',
										queryMode : 'local',
										editable : false,
										triggerAction : 'all',
										width: 240,
										padding : '-4 0 0 0',
										itemId : 'clientAutoCompleter',
										mode : 'local',
										emptyText : getLabel('allCompanies', 'All Companies'),
										store : broadcastStore,
										listeners : {
											'change' : function(combo, newValue, oldValue, eOpts)
											{
												
													if (Ext.isEmpty(newValue)) {
													broadcastView.fireEvent('handleClientChange');
												}
												
											},				
											'select' : function(combo, record) {
												strClient = combo.getValue();
												strClientDescr = combo.getRawValue();					
												broadcastView.fireEvent('handleClientChange',
																		strClient, strClientDescr);
											/*},
											'blur' : function(combo, record) {
												broadcastView.fireEvent('handleClientChange');*/
											}
										}
									}]
						},
						{
						xtype : 'panel',
						layout : 'hbox',
						width : '100%',
						cls : 'ux_largepadding',
						items : [{
		            	        	  xtype: 'container',
		            	        	  //flex : 0.32,
		            	        	  //width: corp_cond ? '25%' : '32%',
	        	        			  padding: '0 30 0 0',
		            	        	  layout : 'vbox',
		            	        	  itemId : 'specificFilter',
		            	        	  items:[
	            	        	         {
	            	        	        	 xtype: 'label',
	            	        	        	 text : getLabel('lblSubject', 'Subject'),
	            	        	        	 //padding: '0 30 0 0',
	        	 							 cls : 'ux_font-size14  ux_normalpadding-bottom ux_largepadding-left'
	            	        	         },{
	            	 						xtype : 'AutoCompleter',
	            							fieldCls : 'xn-form-text xn-suggestion-box w10_3',
	            							flex:1,
	            							width: 240,
	            							matchFieldWidth : true,
	            							name : 'messageCompleter',
	            							itemId : 'messageCompleter',
	            							cfgUrl : 'services/userseek/brodcastMessageSeek.json',
	            							cfgQueryParamName : '$autofilter',
	            							cfgRecordCount : -1,
	            							padding : '-4 0 0 0',
	            							cfgKeyNode : 'DESCR',
	            							cfgRootNode : 'd.preferences',
	            							cfgDataNode1 : 'DESCR',
	            							emptyText:getLabel('autoCompleterEmptyText','Enter Keyword or %'),
	            							enableQueryParam:false,
	            							cfgProxyMethodType : 'POST',
	            							listeners : {
												/*	'change' : function(combo,record)
													{
														if (record == null) {
														subjectfilter = combo.getValue();
														subjectfilterDesc = combo.getRawValue();
														broadcastView.fireEvent('handleSubjectChange',subjectfilter,subjectfilterDesc);
														}
													},*/
													'change' : function(combo, newValue, oldValue, eOpts) {
														if (Ext.isEmpty(newValue)) {
															broadcastView.fireEvent('handleClientChange');
														}
													},
													'select' : function(combo, record) {
														subjectfilter = combo.getValue();
														subjectfilterDesc = combo.getRawValue();
														broadcastView.fireEvent('handleSubjectChange',subjectfilter,subjectfilterDesc);
													},
													'blur' : function(combo, record) {
														subjectfilter = combo.getValue();
														subjectfilterDesc = combo.getRawValue();
														broadcastView.fireEvent('handleSubjectChange',subjectfilter,subjectfilterDesc);
													}														
												}
	        	        	         	 }
	        	        	          ]
								}, {
												xtype : 'container',
												layout : 'vbox',
												width : '50%',
												items : [{
													xtype : 'panel',
													height : 23,
													flex : 1,													
													layout : 'hbox',
													items : [{
																xtype : 'label',
																itemId : 'dateLabel',
																text : getLabel('lblMessageDate','Message Date') + ' (Latest)'
																
															}, {
																xtype : 'button',
																border : 0,															
																filterParamName : 'brodDate',
																itemId : 'brodDate',
																cls : 'menu-disable xn-custom-arrow-button cursor_pointer ui-caret',
																menu : Ext.create('Ext.menu.Menu', {
																	itemId : 'DateMenu',
																	cls : 'ext-dropdown-menu',
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
																	},  {
																		text : getLabel('lastmonthonly',
																				'Last Month Only'),
																		btnId : 'btnLastmonthToOnly',
																		btnValue : '14',
																		parent : this,
																		handler : function(btn, opts) {
																			this.parent.fireEvent(
																					'dateChange', btn,
																					opts);
																		}
																	},{
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
																	}
																	/*, 
																	{
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
																	}*/
																	]
																}
																)

															}]
												},
												{
													xtype : 'container',
													itemId : 'entryDateToContainer',
													layout : 'hbox',
													width : '50%',
													items : [{
														xtype : 'component',
														width : '80%',
														itemId : 'broadcastMsgEntryDatePicker',
														filterParamName : 'EntryDate',
														html : '<input type="text"  id="entryDataPicker" placeholder="'
																+ strApplicationDateFormat
																+ '" class="ft-datepicker from-date-range ui-datepicker-range-alignment">'
													}, {
														xtype : 'component',
														cls : 'icon-calendar',
														margin : '1 0 0 0',
														html : '<span class=""><i class="fa fa-calendar"></i></span>'
													}
																								
												/*{
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
												}*/
												]}
												]
											}						         
						 ]
					  }

	];
		this.callParent(arguments);
	}

/*	tools : [
	{
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
			html : '<img id="imgFilterInfo" class="icon-company"/>'
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
				'change' : function(combo, newValue, oldValue, eOpts)
				{
					if (record == null) {
						if (Ext.isEmpty(newValue)) {
						broadcastView.fireEvent('handleClientChange');
					}
					}
				},				
				'select' : function(combo, record) {
					strClient = combo.getValue();
					strClientDescr = combo.getRawValue();					
					broadcastView.fireEvent('handleClientChange',
											strClient, strClientDescr);
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
	]*/
});





