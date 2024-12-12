Ext
		.define(
				'GCP.view.WHTRefundFilterView',
				{
					extend : 'Ext.panel.Panel',
					xtype : 'WHTRefundFilterView',
					requires : [ 'Ext.ux.gcp.AutoCompleter',
							'Ext.menu.DatePicker', 'Ext.form.field.Date',
							'Ext.form.field.VTypes' ],
					width : '100%',
					componentCls : 'gradiant_back',
					collapsible : true,
					collapsed : true,
					cls : 'xn-ribbon ux_border-bottom',
					layout : {
						type : 'vbox',
						align : 'stretch'
					},
					title : getLabel('filterBy', 'Filter By: ')
							+ '<img id="imgFilterInfoStdView" class="largepadding icon-information"/>',
					initComponent : function() {
						var me = this;
						Ext.Ajax.request({
							url : 'services/sellerListFltr.json' + "?"
									+ csrfTokenName + "=" + csrfTokenValue,
							method : 'POST',
							async : false,
							success : function(response) {
								var data = Ext.decode(response.responseText);
								if (!Ext.isEmpty(data)) {
									storeData = data;
								}
							},
							failure : function(response) {
							}

						});
						var objStore = Ext.create('Ext.data.Store', {
							fields : [ 'sellerCode', 'description' ],
							data : storeData,
							reader : {
								type : 'json',
								root : 'filterList'
							}
						});
						if (objStore.getCount() > 1) {
							multipleSellersAvailable = true;
						}

						this.items = [
								{
									xtype : 'panel',
									layout : 'hbox',
									cls : 'ux_largepadding',
									items : [
											// Panel 1
											{
												xtype : 'panel',
												cls : 'xn-filter-toolbar',
												hidden : multipleSellersAvailable == true ? false
														: true,
												width : '25%',
												layout : {
													type : 'vbox'
												},
												items : [
														{
															xtype : 'panel',
															layout : {
																type : 'hbox'
															},
															width : 150,
															items : [ {
																xtype : 'label',
																text : getLabel(
																		'lbl.payments.seller',
																		'Financial Institution'),
																cls : 'frmLabel'
															} ]
														},
														{
															xtype : 'combo',
															displayField : 'description',
															cls : 'w15',
															fieldCls : 'xn-form-field inline_block',
															triggerBaseCls : 'xn-form-trigger',
															filterParamName : 'sellerCode',
															itemId : 'entitledSellerIdItemId',
															valueField : 'sellerCode',
															name : 'sellerCombo',
															editable : false,
															value : strSellerId,
															store : objStore,
															listeners : {
																'select' : function(
																		combo,
																		strNewValue,
																		strOldValue) {
																	setAdminSeller(combo
																			.getValue());
																}
															}
														} ]
											},
											{
												xtype : 'panel',
												cls : 'xn-filter-toolbar',
												width : '25%',
												layout : {
													type : 'vbox'
												},
												items : [
														{
															xtype : 'panel',
															layout : {
																type : 'hbox'
															},
															width : 115,
															items : [ {
																xtype : 'label',
																text : getLabel(
																		'lbl.WHT.companyname',
																		'Company Name'),
																cls : 'frmLabel'
															} ]
														},
														{
															xtype : 'AutoCompleter',
															matchFieldWidth : true,
															width : '100%',
															fieldCls : 'xn-form-text w165 xn-suggestion-box ux_font-size14-normal',
															cls : 'ux_font-size14-normal',
															name : 'clientName',
															itemId : 'clientFilter',
															cfgUrl : 'services/userseek/WHTRefundCompanySeek.json',
															cfgProxyMethodType : 'POST',
															cfgQueryParamName : '$autofilter',
															cfgRecordCount : -1,
															cfgSeekId : 'WHTRefundCompanySeek',
															enableQueryParam : false,
															cfgRootNode : 'd.preferences',
															cfgKeyNode : 'CODE',
															cfgDataNode1 : 'DESCRIPTION',
															cfgExtraParams : [ {
																key : '$filtercode1',
																value : strSellerId
															} ]
														} ]
											},
											{
												xtype : 'panel',
												cls : 'xn-filter-toolbar',
												width : '25%',
												layout : {
													type : 'vbox'
												},
												items : [
														{
															xtype : 'panel',
															layout : {
																type : 'hbox'
															},
															width : 200,
															items : [ {
																xtype : 'label',
																text : getLabel(
																		'lbl.WHT.product',
																		'Product Description'),
																cls : 'frmLabel'
															} ]
														},
														{
															xtype : 'AutoCompleter',
															matchFieldWidth : true,
															width : '100%',
															fieldCls : 'xn-form-text w165 xn-suggestion-box ux_font-size14-normal',
															cls : 'ux_font-size14-normal',
															name : 'productCode',
															itemId : 'productCode',
															cfgUrl : 'services/userseek/WHTRefundProduct.json',
															cfgProxyMethodType : 'POST',
															cfgQueryParamName : '$autofilter',
															cfgRecordCount : -1,
															cfgSeekId : 'WHTRefundProduct',
															enableQueryParam : false,
															cfgRootNode : 'd.preferences',
															cfgKeyNode : 'CODE',
															cfgDataNode1 : 'DESCR',
															cfgDataNode2 : 'CODE',
															cfgExtraParams : [ {
																key : '$filtercode1',
																value : strSellerId
															} ]
														} ]
											},
											{
												xtype : 'panel',
												cls : 'xn-filter-toolbar',
												width : '25%',
												layout : {
													type : 'vbox'
												},
												items : [
														{
															xtype : 'panel',
															layout : {
																type : 'hbox'
															},
															// width : 115,
															items : [ {
																xtype : 'label',
																text : getLabel(
																		'lbl.WHT.sendingAccNo',
																		'Sending Account'),
																cls : 'frmLabel'
															} ]
														},
														{
															xtype : 'AutoCompleter',
															matchFieldWidth : true,
															width : '92%',
															fieldCls : 'xn-form-text xn-suggestion-box ux_font-size14-normal',
															cls : 'ux_font-size14-normal',
															name : 'sendingAccNo',
															itemId : 'sendingAccNo',
															cfgUrl : 'services/userseek/WHTRefundSendingAcc',
															cfgProxyMethodType : 'POST',
															cfgQueryParamName : '$autofilter',
															cfgRecordCount : -1,
															cfgSeekId : 'WHTRefundSendingAcc',
															enableQueryParam : false,
															cfgRootNode : 'd.preferences',
															cfgKeyNode : 'CODE',
															cfgDataNode1 : 'CODE',
															cfgDataNode2 : 'DESCR',
															cfgExtraParams : [ {
																key : '$filtercode1',
																value : strSellerId
															} ]
														} ]
											}
											
											]
								},
								{
									xtype : 'panel',
									layout : 'hbox',
									cls : 'ux_largepadding',
									items : [
											{
												xtype : 'panel',
												cls : 'xn-filter-toolbar',
												width : '25%',
												layout : 'vbox',
												items : [
														{
															xtype : 'panel',
															layout : 'hbox',
															items : [
																	{
																		xtype : 'label',
																		itemId : 'dateLabel',
																		text : getLabel(
																				'lblChargePostingDate',
																				'Charge Posting Date'),
																		cls : 'frmLabel'
																	},
																	{
																		xtype : 'button',
																		border : 0,
																		filterParamName : 'chargePostingDate',
																		itemId : 'chargePostingDate',
																		cls : 'menu-disable xn-custom-arrow-button cursor_pointer',
																		glyph : 'xf0d7@fontawesome',
																		padding : '0 0 0 0',
																		menu : me
																				.createDateFilterMenu()
																	} ]
														},
														me
																.addDateContainerPanel() ]
											 },										
											{
												xtype : 'panel',
												cls : 'xn-filter-toolbar',
												width : '25%',
												layout : {
													type : 'vbox'
												},
												items : [
														{
															xtype : 'panel',
															layout : {
																type : 'hbox'
															},
															width : 115,
															items : [ {
																xtype : 'label',
																text : getLabel(
																		'lbl.WHT.chargeReceiptNo',
																		'Charge Receipt No.  '),
																cls : 'frmLabel'
															} ]
														},
														{
															xtype : 'textfield',
															itemId : 'chargeReceiptNo',
															//fieldLabel : getLabel( 'chargeReceiptNo', ' Charge Receipt No.' ),
															maxLength : 20,
															fieldCls : 'xn-form-text w165 ux_font-size14-normal',
															cls : 'ux_font-size14-normal',
															labelCls : 'frmLabel',
															labelSeparator : '',
															enforceMaxLength : true,
															enableKeyEvents : true,
															listeners : {
																'keypress' : function(
																		text) {
																	//if( text.value.length === 20 )
																	//	me.showErrorMsg();
																}
															}
														} ]
											},
											{
												xtype : 'panel',
												cls : 'xn-filter-toolbar',
												layout : 'vbox',
												weight : '25%',
												items : [ {
													xtype : 'panel',
													layout : 'hbox',
													padding : '23 0 1 0',
													items : [ {
														xtype : 'button',
														itemId : 'btnFilter',
														text : getLabel(
																'search',
																'Search'),
														cls : 'ux_button-padding ux_button-background ux_button-background-color',
														height : 22
													} ]
												} ]
											}

									]
								} ];
						this.callParent(arguments);
					},
					createDateFilterMenu : function() {
						var me = this;
						var menu = null;
						var arrMenuItem = [];

						arrMenuItem.push({
							text : getLabel('latest', 'Latest'),
							btnId : 'btnLatest',
							parent : this,
							btnValue : '12',
							handler : function(btn, opts) {
								this.parent.fireEvent('dateChange', btn, opts);
							}
						});

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
							text : getLabel('lastMonthToDate',
									'Last Month To Date'),
							btnId : 'btnLastmonth',
							btnValue : '6',
							parent : this,
							handler : function(btn, opts) {
								this.parent.fireEvent('dateChange', btn, opts);
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
							text : getLabel('lastQuarterToDate',
									'Last Quarter To Date'),
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
							text : getLabel('lastyeartodate',
									'Last Year To Date'),
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
								var field = me
										.down('datefield[itemId="fromDate"]');
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
					},
					addDateContainerPanel : function() {
						var me = this;
						var dateContainerPanel = Ext
								.create(
										'Ext.panel.Panel',
										{
											layout : 'hbox',
											padding : '0 0 0 8',
											items : [
													{
														xtype : 'container',
														itemId : 'dateRangeComponent',
														layout : 'hbox',
														hidden : true,
														items : [
																{
																	xtype : 'datefield',
																	itemId : 'fromDate',
																	hideTrigger : true,
																	width : 80,
																	fieldCls : 'h2',
																	cls : 'date-range-font-size',
																	editable : false,
																	parent : me,
																	vtype : 'daterange',
																	endDateField : 'toDate',
																	format : !Ext
																			.isEmpty(strExtApplicationDateFormat) ? strExtApplicationDateFormat
																			: 'm/d/Y',
																	listeners : {
																		'change' : function(
																				field,
																				newValue,
																				oldValue) {
																			if (!Ext
																					.isEmpty(newValue)) {
																				Ext.form.field.VTypes
																						.daterange(
																								newValue,
																								field);
																			}
																		}
																	}
																},
																{
																	xtype : 'datefield',
																	itemId : 'toDate',
																	hideTrigger : true,
																	padding : '0 3 0 0',
																	editable : false,
																	width : 80,
																	fieldCls : 'h2',
																	cls : 'date-range-font-size',
																	parent : me,
																	vtype : 'daterange',
																	startDateField : 'fromDate',
																	format : !Ext
																			.isEmpty(strExtApplicationDateFormat) ? strExtApplicationDateFormat
																			: 'm/d/Y',
																	listeners : {
																		'change' : function(
																				field,
																				newValue,
																				oldValue) {
																			if (!Ext
																					.isEmpty(newValue)) {
																				Ext.form.field.VTypes
																						.daterange(
																								newValue,
																								field);
																			}
																		}
																	}
																} ]
													},
													{
														xtype : 'toolbar',
														itemId : 'dateToolBar',
														cls : 'xn-toolbar-small',
														items : [
																{
																	xtype : 'label',
																	itemId : 'dateFilterFrom'
																},
																{
																	xtype : 'label',
																	itemId : 'dateFilterTo'
																} ]
													} ]
										});
						return dateContainerPanel;
					},
					tools : [ {
						xtype : 'container',
						padding : '0 9 0 0',
						layout : 'hbox',
						items : [ {
							xtype : 'label',
							text : getLabel('preferences', 'Preferences : '),
							cls : 'xn-account-filter-btnmenu',
							padding : '2 0 0 0'
						}, {
							xtype : 'button',
							itemId : 'btnClearPreferences',
							disabled : true,
							text : getLabel('clearFilter', 'Clear'),
							cls : 'xn-account-filter-btnmenu',
							textAlign : 'right',
							width : 40
						}, {
							xtype : 'image',
							src : 'static/images/icons/icon_spacer.gif',
							height : 18
						}, {
							xtype : 'button',
							itemId : 'btnSavePreferences',
							disabled : true,
							text : getLabel('saveFilter', 'Save'),
							cls : 'xn-account-filter-btnmenu',
							textAlign : 'right',
							width : 30
						} ]
					} ]
				});
