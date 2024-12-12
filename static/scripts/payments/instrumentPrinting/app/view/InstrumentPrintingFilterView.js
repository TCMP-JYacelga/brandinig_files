Ext
		.define(
				'GCP.view.InstrumentPrintingFilterView',
				{
					extend : 'Ext.panel.Panel',
					requires : [ 'Ext.ux.gcp.AutoCompleter' ],
					xtype : 'instrumentPrintingFilterView',
					layout : 'vbox',
					initComponent : function() {
						var me = this;

						var clientStore = Ext.create('Ext.data.Store', {
							fields : [ 'CODE', 'DESCR' ]
						});
						var assignToBankStore = null;
						assignToBankStore = Ext.create('Ext.data.Store', {
							fields : [ "name", "value" ],
							data : [ {
								"name" : getLabel('all','All'),
								"value" : "All"
							}, {
								"name" : getLabel('yes', 'Yes'),
								"value" : "Y"
							}, {
								"name" : getLabel('no', 'No'),
								"value" : "N"
							} ],
							autoload : true
						});
						Ext.Ajax
								.request({
									url : 'services/userseek/userclients.json',
									method : 'POST',
									async : false,
									success : function(response) {
										var responseData = Ext
												.decode(response.responseText);
										var data = responseData.d.preferences;
										if (clientStore) {
											clientStore.removeAll();
											var count = data.length;
											if (count > 1) {
												clientStore.add({
													'CODE' : 'all',
													'DESCR' : getLabel('allCompanies','All Companies')
												});
											}
											for (var index = 0; index < count; index++) {
												var record = {
													'CODE' : data[index].CODE,
													'DESCR' : data[index].DESCR
												};
												clientStore.add(record);
											}
											clientCount = count;
										}
									},
									failure : function() {
									}
								});
						me.items = [
								{
									xtype : 'container',
									layout : 'vbox',
									// If count is one
									hidden : ((clientStore.getCount() < 2) || !isClientUser()) ? true
											: false,
									// or admin then
									// hide
									width : '25%',
									padding : '0 30 0 0',
									items : [
											{
												xtype : 'label',
												itemId : 'lblcompanyname',
												text : getLabel('lblcompanyname','Company Name')
											},
											{
												xtype : 'combo',
												displayField : 'DESCR',
												valueField : 'CODE',
												queryMode : 'local',
												editable : false,
												triggerAction : 'all',
												width : '100%',
												padding : '-4 0 0 0',
												itemId : 'clientCombo',
												mode : 'local',
												emptyText : getLabel('allCompanies','All Companies'),
												store : clientStore
											} ]
								},
								{
									xtype : 'container',
									layout : 'vbox',
									// If not admin then hide
									hidden : (isClientUser()) ? true : false,
									width : '25%',
									padding : '0 30 0 0',
									items : [
											{
												xtype : 'label',
												itemId : 'lblcompanyname',
												text : getLabel('lblcompanyname','Company Name')
											},
											{
												xtype : 'AutoCompleter',
												width : '100%',
												matchFieldWidth : true,
												name : 'clientCombo',
												itemId : 'clientAuto',
												cfgUrl : 'services/userseek/userclients.json',
												padding : '-4 0 0 0',
												cfgQueryParamName : '$autofilter',
												cfgRecordCount : -1,
												cfgSeekId : 'userclients',
												cfgKeyNode : 'CODE',
												cfgRootNode : 'd.preferences',
												cfgDataNode1 : 'DESCR',
												emptyText : getLabel('autoCompleterEmptyText','Enter Keyword or %'),
												enableQueryParam : false,
												cfgProxyMethodType : 'POST'
											} ]

								},
								{
									xtype : 'container',
									itemId : 'parentContainer',
									width : '100%',
									layout : 'hbox',
									items : [
											/*{

												xtype : 'container',
												itemId : 'row1Container1',
												layout : 'vbox',
												width : '25%',
												padding : '0 30 0 0',
												items : [
														{
															xtype : 'label',
															text : getLabel(
																	'pdfFileName',
																	'PDF File Name')
														},
														{
															xtype : 'textfield',
															valueField : 'CODE',
															queryMode : 'local',
															triggerAction : 'all',
															width : '100%',
															padding : '-4 0 0 0',
															itemId : 'pdfFileNameText',
															mode : 'local',
															fieldCls : 'form-control'
														} ]
											},*/{

												xtype : 'container',
												itemId : 'row1Container2',
												layout : 'vbox',
												width : '25%',
												padding : '0 30 0 0',
												items : [
														{
															xtype : 'label',
															text : getLabel('payRef','Payment Reference')
														},
														{
															xtype : 'textfield',
															valueField : 'CODE',
															queryMode : 'local',
															triggerAction : 'all',
															width : '100%',
															padding : '-4 0 0 0',
															itemId : 'payRefText',
															mode : 'local',
															fieldCls : 'form-control'
														} ]
											},{

												xtype : 'container',
												itemId : 'row1Container3',
												layout : 'vbox',
												width : '25%',
												padding : '0 30 0 0',
												items : [
														{
															xtype : 'label',
															text : getLabel('beneName','Receiver Name')
														},
														{
															xtype : 'AutoCompleter',
															width : '100%',
															name : 'beneAutocompleter',
															itemId : 'beneAutocompleter',
															cfgUrl : 'services/userseek/instrPrintReceiver.json',
															cfgQueryParamName : '$autofilter',
															cfgRecordCount : -1,
															cfgSeekId : 'instrPrintReceiver',
															cfgKeyNode : 'CODE',
															padding : '-4 0 0 0',
															matchFieldWidth : true,
															emptyText : getLabel('autoCompleterEmptyText', 'Enter Keyword or %'),
															cfgRootNode : 'd.preferences',
															cfgDataNode1 : 'DESCRIPTION',
															enableQueryParam:false,
															cfgProxyMethodType : 'POST'
														}]
											},
											{

												xtype : 'container',
												itemId : 'row1Container4',
												layout : 'vbox',
												width : '25%',
												padding : '0 30 0 0',
												items : [
														{
															xtype : 'label',
															text : getLabel('debitAccount','Debit Account')
														},
														{
															xtype : 'AutoCompleter',
															width : '100%',
															name : 'debitAccountAutocompleter',
															itemId : 'debitAccountAutocompleter',
															cfgUrl : 'services/userseek/instrPrintDebitAccount.json',
															cfgQueryParamName : '$autofilter',
															cfgRecordCount : -1,
															cfgSeekId : 'instrPrintDebitAccount',
															cfgKeyNode : 'CODE',
															padding : '-4 0 0 0',
															matchFieldWidth : true,
															emptyText :  getLabel('autoCompleterEmptyText', 'Enter Keyword or %'),
 															cfgRootNode : 'd.preferences',
															cfgDataNode1 : 'DESCRIPTION',
															enableQueryParam:false,
															cfgProxyMethodType : 'POST'
														}]
											}]
								},{
									xtype : 'container',
									itemId : 'parentContainer1',
									width : '100%',
									layout : 'hbox',									
									items : [
											{
												xtype : 'container',
												itemId : 'entryDateContainer',
												layout : 'vbox',
												width : '25%',
												padding : '0 30 0 0',
												items : [
														{
															xtype : 'panel',
															itemId : 'entryDatePanel',
															height : 23,
															flex : 1,
															layout : 'hbox',
															items : [
																	{
																		xtype : 'label',
																		itemId : 'entryDateLabel',
																		text : getLabel('entryDate','Entry Date')
																	},
																	{
																		xtype : 'button',
																		border : 0,
																		filterParamName : 'entryDateBtn',
																		itemId : 'entryDateBtn',
																		cls : 'ui-caret-dropdown',
																		listeners : {
																			click : function(
																					event) {
																				var menus = me
																						.getDateDropDownItems(this);
																				var xy = event
																						.getXY();
																				menus
																						.showAt(
																								xy[0],
																								xy[1] + 16);
																				event.menu = menus;
																			}
																		}
																	} ]
														},
														{
															xtype : 'container',
															itemId : 'entryDateToContainer',
															layout : 'hbox',
															width : '100%',
															items : [
																	{
																		xtype : 'component',
																		width : '85%',
																		itemId : 'entryDatePicker',
																		filterParamName : 'entryDate',
																		html : '<input type="text" readonly="readonly"  id="entryDatePicker" class="ft-datepicker from-date-range ui-datepicker-range-alignment">'
																	},
																	{
																		xtype : 'component',
																		cls : 'icon-calendar',
																		margin : '1 0 0 0',
																		html : '<span class=""><i class="fa fa-calendar"></i></span>'
																	} ]
														} ]
											},
											{
												xtype : 'container',
												layout : 'vbox',
												width : '25%',
												padding : '0 30 0 0',
												items : [
														{
															xtype : 'label',
															text : getLabel('status','Status')
														},
														Ext
																.create(
																		'Ext.ux.gcp.CheckCombo',
																		{
																			valueField : 'code',
																			displayField : 'desc',
																			editable : false,
																			addAllSelector : true,
																			emptyText : getLabel('all','All'),
																			multiSelect : true,
																			width : '100%',
																			padding : '-4 0 0 0',
																			itemId : 'statusCombo',
																			isQuickStatusFieldChange : false,
																			store : me
																					.getStatusStore(),
																			listeners : {
																				'focus' : function() {
																				}
																			}
																		}) ]

											},
											{
												xtype : 'container',
												layout : 'vbox',
												width : '25%',
												padding : '0 30 0 0',
												items : [
														{
															xtype : 'label',
															text : getLabel('assignBank','Assign To Bank')
														},
														{
															xtype : 'combo',
															displayField : 'name',
															valueField : 'value',
															queryMode : 'local',
															editable : false,
															triggerAction : 'all',
															width : '100%',
															padding : '-4 0 0 0',
															itemId : 'assignToBankCombo',
															mode : 'local',
															emptyText : getLabel('all','All'),
															store : assignToBankStore
														} ]
											}  ]
								}];

						this.callParent(arguments);
					},
					getStatusStore : function() {
						var objStatusStore = null;
						if (!Ext.isEmpty(arrStatus)) {
							objStatusStore = Ext.create('Ext.data.Store', {
								fields : [ 'code', 'desc' ],
								data : arrStatus,
								autoLoad : true,
								listeners : {
									load : function() {
									}
								}
							});
							objStatusStore.load();
						}
						return objStatusStore;
					},
					getDateDropDownItems : function(buttonIns) {
						var me = this;
						var arrMenuItem = [ {
							text : getLabel('latest', 'Latest'),
							btnId : 'latest',
							parent : this,
							btnValue : '12',
							handler : function(btn, opts) {
								this.parent.fireEvent('dateChange', btn, opts);
							}
						} ];
						arrMenuItem.push({
							text : getLabel('today', 'Today'),
							btnId : 'btnToday',
							btnValue : '1',
							parent : this,
							handler : function(btn, opts) {
								this.parent.fireEvent('dateChange', btn, opts);
							}
						});
						arrMenuItem.push({
							text : getLabel('yesterday', 'Yesterday'),
							btnId : 'btnYesterday',
							btnValue : '2',
							parent : this,
							handler : function(btn, opts) {
								this.parent.fireEvent('dateChange', btn, opts);
							}
						});
						arrMenuItem.push({
							text : getLabel('thisweek', 'This Week'),
							btnId : 'btnThisweek',
							btnValue : '3',
							parent : this,
							handler : function(btn, opts) {
								this.parent.fireEvent('dateChange', btn, opts);
							}
						});
						arrMenuItem.push({
							text : getLabel('lastweektodate',
									'Last Week To Date'),
							btnId : 'btnLastweek',
							parent : this,
							btnValue : '4',
							handler : function(btn, opts) {
								this.parent.fireEvent('dateChange', btn, opts);
							}
						});
						arrMenuItem.push({
							text : getLabel('thismonth', 'This Month'),
							btnId : 'btnThismonth',
							parent : this,
							btnValue : '5',
							handler : function(btn, opts) {
								this.parent.fireEvent('dateChange', btn, opts);
							}
						});
						arrMenuItem.push({
							text : getLabel('lastMonthToDate','Last Month To Date'),
							btnId : 'btnLastmonth',
							btnValue : '6',
							parent : this,
							handler : function(btn, opts) {
								this.parent.fireEvent('dateChange', btn, opts);
							}
						});
						arrMenuItem
								.push({
									text : getLabel('lastmonthonly','Last Month Only'),
									btnId : 'btnLastmonthonly',
									btnValue : '14',
									parent : this,
									handler : function(btn, opts) {
										this.parent.fireEvent('dateChange',
												btn, opts);
									}
								});
						arrMenuItem.push({
							text : getLabel('thisquarter', 'This Quarter'),
							btnId : 'btnLastMonthToDate',
							btnValue : '8',
							parent : this,
							handler : function(btn, opts) {
								this.parent.fireEvent('dateChange', btn, opts);
							}
						});
						arrMenuItem.push({
							text : getLabel('lastQuarterToDate','Last Quarter To Date'),
							btnId : 'btnQuarterToDate',
							btnValue : '9',
							parent : this,
							handler : function(btn, opts) {
								this.parent.fireEvent('dateChange', btn, opts);
							}
						});
						arrMenuItem.push({
							text : getLabel('thisyear', 'This Year'),
							btnId : 'btnLastQuarterToDate',
							btnValue : '10',
							parent : this,
							handler : function(btn, opts) {
								this.parent.fireEvent('dateChange', btn, opts);
							}
						});
						arrMenuItem.push({
							text : getLabel('lastyeartodate','Last Year To Date'),
							btnId : 'btnYearToDate',
							parent : this,
							btnValue : '11',
							handler : function(btn, opts) {
								this.parent.fireEvent('dateChange', btn, opts);
							}
						});
						var dropdownMenu = Ext.create('Ext.menu.Menu', {
							itemId : 'DateMenu',
							cls : 'ext-dropdown-menu',
							listeners : {
								hide : function(event) {
									// buttonIns.addCls('ui-caret-dropdown');
									buttonIns.removeCls('action-down-hover');
								}
							},
							items : arrMenuItem
						});
						return dropdownMenu;
					}
				});
