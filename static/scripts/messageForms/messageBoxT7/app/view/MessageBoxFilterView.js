Ext.define('GCP.view.MessageBoxFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'messageBoxFilterView',
	requires : [],

	layout : {
		type : 'hbox'
		// align : 'stretch'
	},
	initComponent : function() {
		var me = this;
		var clientStore = Ext.create('Ext.data.Store', {
					fields : ['CODE', 'DESCR']
				});
		var objSellerStore = Ext.create('Ext.data.Store', {
					fields : ['sellerCode', 'description'],
					proxy : {
						type : 'ajax',
						autoLoad : true,
						noCache : false,
						actionMethods : {
							read : 'POST'
						},
						url : 'services/sellerListFltr.json'
					}
				});
		var objClientStore = Ext.create('Ext.data.Store', {
					fields : ['clientId', 'clientDescription'],
					proxy : {
						type : 'ajax',
						autoLoad : true,
						noCache : false,
						actionMethods : {
							read : 'POST'
						},
						url : 'services/clientList.json'
					}
				});
		if (entity_type === '0') {
			var clientSeekUrl = 'services/userseek/adminMsgCentrClientSeek.json';
			var padding = '0 0 0 10';
			var searchFlex = 1.1;
		} else {
			var clientSeekUrl = 'services/userseek/custMsgCentrClientSeek.json';
			var padding = '0 0 0 6';
			var searchFlex = 1.5;
		}
		this.items = [

		{
			xtype : 'panel',
			cls : 'xn-filter-toolbar ux_largepadding',
			layout : 'hbox',
			itemId : 'sellerClientMenuBar',
			items : [{
						xtype : 'panel',
						itemId : 'sellerMenuBar',
						cls : 'xn-filter-toolbar',
						layout : 'vbox',
						align : 'stretch',
						flex : 1,
						items : [{
									xtype : 'label',
									text : getLabel('seller',
											'Financial Institution'),
									cls : 'frmLabel'
								}, {
									xtype : 'combo',
									width : 196,
									displayField : 'description',
									fieldCls : 'xn-form-field inline_block',
									triggerBaseCls : 'xn-form-trigger ux_width17',
									filterParamName : 'sellerCode',
									itemId : 'sellerCodeID',
									valueField : 'sellerCode',
									name : 'sellerCode',
									editable : false,
									store : objSellerStore,
									listeners : {
										'render' : function(combo, record) {
											combo.setValue(sessionSellerCode);
											combo.store.load();
										},
										'select' : function(combo, strNewValue, strOldValue) {
											setAdminSeller(combo.getValue());
										}
									}
								}]
					}, {
						xtype : 'container',
						itemId : 'filterClientAutoCmplterCnt',
						flex : 1,
						padding : '0 0 0 5',
						hidden : entity_type == 1 ? true : false,
						layout : {
							type : 'vbox'
						},
						items : [{
									xtype : 'label',
									text : getLabel('companyName', 'Company Name')
								}, {
									xtype : 'AutoCompleter',
									fieldCls : 'xn-form-text w12 xn-suggestion-box',
									matchFieldWidth : true,
									cls : 'autoCmplete-field',
									labelSeparator : '',
									name : 'clientCode',
									itemId : 'clientCodeId1',
									// cfgUrl : clientSeekUrl,
									cfgUrl : entity_type == 0
											? 'services/userseek/adminMsgCentrClientSeek.json'
											: 'services/userseek/custMsgCentrClientSeek.json',
									cfgQueryParamName : '$autofilter',
									cfgRecordCount : -1,
									cfgSeekId : 'clientCodeSeek',
									cfgRootNode : 'd.preferences',
									cfgKeyNode : 'CODE',
									cfgDataNode1 : 'DESCR',
									cfgStoreFields : ['CODE', 'DESCR'],
									cfgProxyMethodType : 'POST',
									listeners : {
										'select' : function(combo, record) {
											strClient = combo.getValue();
											strClientDescr = combo
													.getRawValue();
											me.fireEvent('handleClientChange',
													strClient, strClientDescr);
										},
										'change' : function(combo, newValue,
												oldValue, eOpts) {
											if (Ext.isEmpty(newValue)) {
												me
														.fireEvent('handleClientChange');
											}
										},
										'render' : function(combo) {
											combo.listConfig.width = 200;
										}
									}
								}

						]
					}, {
						xtype : 'panel',
						layout : 'hbox',
						// cls : 'ux_largepadding-bottom ux_largepadding-left
						// ux_largepadding-right',
						cls : 'ux_largepadding',
						padding : '0 0 0 7',
						flex : 1,
						items : [{
							xtype : 'panel',
							cls : 'xn-filter-toolbar',
							layout : 'vbox',
							// flex : 0.8,
							flex : 1,
							items : [{
								xtype : 'panel',
								layout : 'hbox',
								items : [{
											xtype : 'label',
											itemId : 'dateLabel',
											text : getLabel('msgDate',
													'Message Date'),
											// padding : '0 0 6 4',
											cls : 'ux_font-size14 ux_padding0060'
										}, {
											xtype : 'button',
											border : 0,
											filterParamName : 'MessageDate',
											itemId : 'messageDate',// Required
											cls : 'menu-disable xn-custom-arrow-button cursor_pointer ui-caret',
											listeners : {
												click : function(event) {
													var menus = me
															.createDateFilterMenu(this)
													var xy = event.getXY();
													menus.showAt(xy[0], xy[1]
																	+ 16);
													event.menu = menus;
												}
											}
										}]
							}, {
								xtype : 'component',
								width : '200px',
								itemId : 'messageDatePicker',
								filterParamName : 'dueDate',
								html : '<input type="text"  id="entryDataPicker" class="ft-datepicker ui-datepicker-range-alignment">'
							}

							]
						}]
					}]
		}];
		this.callParent(arguments);
				
	},
	highlightSavedStatus : function(strFilterCode) {
		var me = this;
		var objToolbar = me.down('toolbar[itemId="messageInboxStatusToolBar"]');
		if (objToolbar) {
			objToolbar.items.each(function(item) {
						item.removeCls('xn-custom-heighlight');
						if (item.btnValue === strFilterCode)
							item.addCls('xn-custom-heighlight');
					});
		}
	},
	
	createDateFilterMenu : function(buttonIns) {
		var dropdownMenu = Ext.create('Ext.menu.Menu', {
			cls : 'ext-dropdown-menu',
			listeners : {
				hide : function(event) {
					buttonIns.addCls('ui-caret-dropdown');
					buttonIns.removeCls('action-down-hover');
				}
			},
			items : [{
						text : getLabel('latest', 'Latest'),
						btnId : 'btnLatest',
						btnValue : '12',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					}, {
						text : getLabel('today', 'Today'),
						btnId : 'btnToday',
						btnValue : '1',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					}, {
						text : getLabel('yesterday', 'Yesterday'),
						btnId : 'btnYesterday',
						btnValue : '2',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					}, {
						text : getLabel('thisweek', 'This Week'),
						btnId : 'btnThisweek',
						btnValue : '3',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					}, {
						text : getLabel('lastweektodate', 'Last Week To Date'),
						btnId : 'btnLastweek',
						parent : this,
						btnValue : '4',
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					}, {
						text : getLabel('thismonth', 'This Month'),
						btnId : 'btnThismonth',
						parent : this,
						btnValue : '5',
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					}, {
						text : getLabel('lastMonthToDate', 'Last Month To Date'),
						btnId : 'btnLastmonth',
						btnValue : '6',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					}, {
						text : getLabel('thisquarter', 'This Quarter'),
						btnId : 'btnLastMonthToDate',
						btnValue : '8',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					}, {
						text : getLabel('lastQuarterToDate',
								'Last Quarter To Date'),
						btnId : 'btnQuarterToDate',
						btnValue : '9',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					}, {
						text : getLabel('thisyear', 'This Year'),
						btnId : 'btnLastQuarterToDate',
						btnValue : '10',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					}, {
						text : getLabel('lastyeartodate', 'Last Year To Date'),
						btnId : 'btnYearToDate',
						parent : this,
						btnValue : '11',
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					}]
		});
		return dropdownMenu;
	}
});
