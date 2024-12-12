Ext.define('GCP.view.PositivePayIssuanceFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'positivePayIssuanceFilterView',
	requires : ['Ext.panel.Panel', 'Ext.form.Label',
			'Ext.layout.container.VBox', 'Ext.layout.container.HBox',
			'Ext.form.Label', 'Ext.toolbar.Toolbar', 'Ext.button.Button',
			'Ext.menu.Menu', 'Ext.container.Container', 'Ext.form.field.Date'],
	width : '100%',
	margin : '0 0 10 0',
	layout : 'vbox',
	initComponent : function() {
		var me = this;
		pmtSummaryView = this;
		var clientCount;
		this.items = [];
		this.createPanels();
	/*	me.on('afterrender', function(panel) {
					Ext.Ajax.request({
								url : 'services/userseek/userclients.json',
								method : 'POST',
								async : false,
								success : function(response) {
									if (response && response.responseText) {
										var data = Ext
												.decode(response.responseText);
										me.addDataToClientCombo(data);
									}
								},
								failure : function(response) {
									// console.log('Error Occured');
								}
							});
				});
		me.on('afterrender', function(panel) {
					var clientCombo = me.down('combo[itemId="clientCombo"]');
					// Set Default Text When Page Loads
					clientCombo.setRawValue(getLabel('allCompanies',
							'All companies'));
				});*/
		this.callParent(arguments);
	},
	populateClientMenu : function(data) {
		var me = this;
		var clientMenu = me.down('menu[itemId="clientMenu"]');
		var clientBtn = me.down('button[itemId="clientBtn"]');
		var filterClientMenuContainer = me
				.down('container[itemId="filterClientMenuContainer"]');
		var clientArray = data.d.preferences || [];
		clientMenu.add({
					text : getLabel('allCompanies', 'All companies'),
					btnDesc : getLabel('allCompanies', 'All companies'),
					code : 'all',
					handler : function(btn, opts) {
						clientBtn.setText(btn.text);
						me.clientCode = btn.code;
						me.fireEvent('handleClientChange', btn.code,
								btn.btnDesc);
					}
				});

		Ext.each(clientArray, function(client) {
					if (client.CODE === strClientId)
						strClientDescr = client.DESCR;
					clientMenu.add({
								text : client.DESCR,
								CODE : client.CODE,
								DESCR : client.DESCR,
								handler : function(btn, opts) {
									clientBtn.setText(btn.text);
									me.clientCode = btn.code;
									me.fireEvent('handleClientChange',
											btn.code, btn.btnDesc);
								}
							});
				});
		if (null != clientArray && clientArray.length <= 1) {
			filterClientMenuContainer.hide();
		}

	},
	createPanels : function() {
		var me = this;
		var clientStore = Ext.create('Ext.data.Store', {
					fields : ['CODE', 'DESCR']
				});
		Ext.Ajax.request({
					url : 'services/userseek/userclients.json',
					method : 'POST',
					async : false,
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var data = responseData.d.preferences;
						if (clientStore) {
							clientStore.removeAll();
							var count = data.length;
							clientCount= count;
							if (count > 1) {
								clientStore.add({
											'CODE' : 'all',
											'DESCR' : 'All Companies'
										});
							}
							for (var index = 0; index < count; index++) {
								var record = {
									'CODE' : data[index].CODE,
									'DESCR' : data[index].DESCR
								}
								clientStore.add(record);
							}
						}
					},
					failure : function() {
					}
				});
		me.items = [/*{
			xtype : 'container',
			flex : 0.8,
			layout : 'vbox',
			hidden : strEntityType == 1 ? false : true,
			itemId : 'filterClientMenuContainer',
			items : [{
						xtype : 'label',
						text : getLabel("Client", "Client"),
						margin : '0 0 0 6'
					}, {
						xtype : 'combo',
						padding : '10 0 0 6',
						valueField : 'CODE',
						displayField : 'DESCR',
						queryMode : 'local',
						editable : false,
						width : '70%',
						itemId : 'clientCombo',
						triggerAction : 'all',
						triggerBaseCls : 'xn-form-trigger',
						editable : false,
						store : clientStore,
						listeners : {
							'select' : function(combo, record) {
								var code = combo.getValue();
								me.clientCode = code;
								me.fireEvent("handleClientChange", code, combo
												.getRawValue(), '');
							}
						}
					}]
		}, {
			xtype : 'container',
			flex : 1,
			itemId : 'filterClientAutoCmplterCnt',
			hidden : strEntityType == 0 ? false : true,
			layout : 'vbox',
			items : [{
						xtype : 'label',
						text : getLabel("Client", "Client"),
						margin : '0 0 0 6'
					}, {

						xtype : 'AutoCompleter',
						fieldCls : 'xn-form-text w12 xn-suggestion-box',
						name : 'clientCode',
						itemId : 'clientCodesFltId',
						cfgUrl : 'services/userseek/userclients.json',
						cfgQueryParamName : 'qfilter',
						cfgRecordCount : -1,
						padding : '8 0 0 6',
						cfgSeekId : 'approvalAdminClientList',
						cfgKeyNode : 'CODE',
						cfgRootNode : 'd.preferences',
						cfgDataNode1 : 'DESCR',
						cfgProxyMethodType : 'POST',
						cfgQueryParamName : '$autofilter',

						listeners : {
							'select' : function(combo, record) {
								strClient = combo.getValue();
								strClientDesc = combo.getRawValue();

								pmtSummaryView.fireEvent('handleClientChange',
										strClient, strClientDesc);
							},
							'change' : function(combo, newValue, oldValue,
									eOpts) {
								if (Ext.isEmpty(newValue)) {
									pmtSummaryView.fireEvent(
											'handleClientChange', '', '', '');
								}
							},
							'render' : function(combo) {
							}
						}

					}]
		}*/, 
			/*{
			xtype : 'container',
			itemId : 'clientContainer',
			layout : 'vbox',
			width : '25%',
			hidden : clientCount > 1 ? false : true,
			padding : '0 30 0 0',
			items : [{
						xtype : 'label',
						text : getLabel("company", "Company Name"),
						flex : 1
						
					}, {
						xtype : 'combo',
						valueField : 'CODE',
						displayField : 'DESCR',
						queryMode : 'local',
						width : '100%',
						editable : false,
						triggerAction : 'all',
						itemId : 'clientCombo',
						mode : 'local',
						padding : '-4 0 0 0',
						emptyText : getLabel('selectcompany', 'Select Company'),
						store : clientStore,
						 listeners : {
							 	'select' : function(combo, record) {
										selectedFilterClientDesc = combo.getRawValue();
										selectedFilterClient = combo.getValue();
										selectedClientDesc = combo.getRawValue();
										$('#clientSelect').val(selectedFilterClient);
										$(document).trigger("handleClientChangeInQuickFilter", false);
									},
									boxready : function(combo, width, height, eOpts) {
										if (Ext.isEmpty(combo.getValue())) {										
											combo.setValue(combo.getStore().getAt(0));
										}
									}
								 }
					}]
			},*/{
			xtype : 'container',
			itemId : 'filterParentContainer',
			width : '100%',
			layout : 'hbox',
			items : [{
						xtype : 'container',
						itemId : 'savedFiltersContainer',
						layout : 'vbox',
						width : '25%',
						padding : '0 30 0 0',
						items : [{
									xtype : 'label',
									itemId : 'savedFiltersLabel',
									text : getLabel('savedFilter','Saved Filters')
								}, {
									xtype : 'combo',
									valueField : 'filterName',
									displayField : 'filterName',
									queryMode : 'local',
									editable : false,
									width : '100%',
									triggerAction : 'all',
									itemId : 'savedFiltersCombo',
									mode : 'local',
									padding : '-4 0 0 0',
									emptyText : getLabel('selectfilter', 'Select Filter'),
									store : me.savedFilterStore(),
									listeners : {
										'select' : function(combo, record) {
											me.fireEvent("handleSavedFilterItemClick",
													combo.getValue(), combo.getRawValue());
										}
									}
								}]
					}, 
						{
						xtype : 'container',
						itemId : 'issueDateQuickContainer',
						layout : 'vbox',
						width : '50%',
						padding : '0 30 0 0',
						items : [{
									xtype : 'panel',
									itemId : 'issueDateQuickPanel',
									layout : 'hbox',
									height : 23,
									flex : 1,
									items : [{
												xtype : 'label',
												itemId : 'issueDateLabel',
												text : getLabel('dateLatest', 'Issuance Date')
												//margin : '0 0 0 6'
											}, {
												xtype : 'button',
												border : 0,
												filterParamName : 'issuanceDate',
												padding : '-4 0 0 0',
												itemId : 'issueDateCaretBtn',
												cls : 'ui-caret',
												listeners : {
													click : function(event) {
														var menus = me
																.getDateDropDownItems(this);
														var xy = event.getXY();
														menus.showAt(xy[0], xy[1] + 16);
														event.menu = menus;
													}
												}
											}]
								}, /*{
									xtype : 'component',
									width : '70%',
									itemId : 'issueDatePickerQuick',
									 padding : '10 0 0 6', 
									filterParamName : 'issuanceDate',
									html : '<input type="text"  id="issueDatePickerQuickText" class="ft-datepicker ui-datepicker-range-alignment">'
								}*/
								{
					xtype : 'container',
					itemId : 'entryDateToContainer',
					layout : 'hbox',
					width : '50%',
					items : [{
						xtype : 'component',
						width : '82%',
						itemId : 'issueDatePickerQuick',
						filterParamName : 'issuanceDate',
						html : '<input type="text"  id="issueDatePickerQuickText" class="ft-datepicker from-date-range ui-datepicker-range-alignment">'
					}, {
						xtype : 'component',
						cls : 'icon-calendar',
						margin : '1 0 0 0',
						html : '<span class=""><i class="fa fa-calendar"></i></span>'
					}]
				}]
					}]
		}];
	},
/*	addDataToClientCombo : function(data) {
		var me = this;
		var clientMenu = [];
		var clientCombobox = me.down('combo[itemId="clientCombo"]');
		var filterClientMenuContainer = me
				.down('container[itemId="filterClientMenuContainer"]');
		var clientArray = data.d.preferences || [];
		clientMenu.push({
					text : getLabel('allCompanies', 'All companies'),
					DESCR : getLabel('allCompanies', 'All companies'),
					CODE : 'all',
					handler : function(btn, opts) {
						clientCombobox.setText(btn.text);
						me.clientCode = btn.CODE;
					}
				});

		Ext.each(clientArray, function(client) {
			clientMenu.push({
				text : client.DESCR,
				CODE : client.CODE,
				DESCR : client.DESCR,
				handler : function(btn, opts) {
					clientBtn.setText(btn.text);
					me.clientCode = btn.CODE;
					me.fireEvent('handleClientChange', btn.CODE, btn.DESCR, '');
				}
			});
		});
		if (null != clientArray && clientArray.length <= 1) {
			filterClientMenuContainer.hide();
		} else {
			clientCombobox.getStore().loadData(clientMenu);
		}
	},*/
	addAdvanceFilterPanel : function(parentPanel) {
		var me = this;
		var advPanel = Ext.create('Ext.panel.Panel', {
					itemId : 'advFilterPanel',
					cls : 'xn-filter-toolbar',
					flex : 0.9,
					layout : {
						type : 'vbox'
					},
					items : [{
						xtype : 'panel',
						cls : 'ux_paddingtl',
						layout : {
							type : 'hbox'
						},
						items : [{
							xtype : 'label',
							text : getLabel('advFilters', 'Advanced Filters'),
							cls : 'f13 ux_font-size14'
								// hidden : isHidden('AdvanceFilter')
								// padding : '6 0 0 6'
							}, {
							xtype : 'image',
							src : 'static/images/icons/icon_spacer.gif',
							height : 18,
							// hidden : isHidden('AdvanceFilter'),
							padding : '5 0 0 9',
							cls : 'ux_hide-image'

						}, {
							xtype : 'button',
							itemId : 'newFilter',
							text : '<span class="button_underline thePointer">'
									+ getLabel('createNewFilter',
											'Create New Filter') + '</span>',
							cls : 'xn-account-filter-btnmenu xn-small-button',
							margin : '0 0 0 10',
							// hidden : isHidden('AdvanceFilter'),
							handler : function(btn, opts) {
								me.fireEvent('createNewFilterClick', btn, opts);
							}
						}]
					}, {
						xtype : 'toolbar',
						itemId : 'advFilterActionToolBar',
						cls : 'xn-toolbar-small',
						padding : '6 0 0 4',
						width : '100%',
						enableOverflow : true,
						border : false,
						items : []

					}]
				});
		parentPanel.add(advPanel);
	},
	addDateMenuPanel : function(dateParentPanel) {
		var me = this;
	    var intFilterDays = !Ext.isEmpty(filterDays)
		? parseInt(filterDays,10)
		: '';
		var arrMenuItem = [{
										text : getLabel('latest', 'Latest'),
										btnId : 'latest',
										parent : this,
										btnValue : '12',
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									}];
		if (intFilterDays >= 1 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
										text : getLabel('today', 'Today'),
										btnId : 'btnToday',
										btnValue : '1',
										parent : this,
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									});	
			if (intFilterDays >= 2 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
				text : getLabel('yesterday',
												'Yesterday'),
										btnId : 'btnYesterday',
										btnValue : '2',
										parent : this,
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
				}
			});
		
		if (intFilterDays >= 7 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
					text : getLabel('thisweek', 'This Week'),
										btnId : 'btnThisweek',
										btnValue : '3',
										parent : this,
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
					}
				});
		if (intFilterDays >= 14 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
										text : getLabel('lastweektodate',
												'Last Week To Date'),
										btnId : 'btnLastweek',
										parent : this,
										btnValue : '4',
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									});
		if (intFilterDays >= 30 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
										text : getLabel('thismonth',
												'This Month'),
										btnId : 'btnThismonth',
										parent : this,
										btnValue : '5',
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									});
		if (intFilterDays >= 60 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
										text : getLabel('lastMonthToDate',
												'Last Month To Date'),
										btnId : 'btnLastmonth',
										btnValue : '6',
										parent : this,
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									});
		 if (lastMonthOnlyFilter===true || Ext.isEmpty(intFilterDays))
		   arrMenuItem.push({
										text : getLabel('lastmonthonly',
												'Last Month Only'),
										btnId : 'btnLastmonthonly',
										btnValue : '14',
										parent : this,
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									});
		if (intFilterDays >= 90 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
										text : getLabel('thisquarter',
												'This Quarter'),
										btnId : 'btnLastMonthToDate',
										btnValue : '8',
										parent : this,
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									});
		if (intFilterDays >= 180 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
										text : getLabel('lastQuarterToDate',
												'Last Quarter To Date'),
										btnId : 'btnQuarterToDate',
										btnValue : '9',
										parent : this,
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									});
		if (intFilterDays >= 365 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
										text : getLabel('thisyear', 'This Year'),
										btnId : 'btnLastQuarterToDate',
										btnValue : '10',
										parent : this,
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									});
		if (intFilterDays >= 730 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push( {
										text : getLabel('lastyeartodate',
												'Last Year To Date'),
										btnId : 'btnYearToDate',
										parent : this,
										btnValue : '11',
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									});
		var dateMenuPanel = Ext.create('Ext.panel.Panel', {
			layout : 'hbox',
			items : [{
						xtype : 'label',
						itemId : 'dateLabel',
						text : getLabel('dateLatest', 'Date (Latest)'),
						cls : 'f13 ux_payment-type'
					}, {
						xtype : 'button',
						border : 0,
						filterParamName : 'issuanceDate',
						itemId : 'issueDate',
						cls : 'menu-disable xn-custom-arrow-button cursor_pointer ux_margint',
						glyph : 'xf0d7@fontawesome',
						padding : '6 0 0 3',
						menu : Ext.create('Ext.menu.Menu', {
									items : arrMenuItem
								})

					}]
		});
		dateParentPanel.add(dateMenuPanel);
	},
	addDateContainerPanel : function(dateParentPanel) {
		var me = this;
		var dateContainerPanel = Ext.create('Ext.panel.Panel', {
					layout : 'hbox',
					padding : '6 0 0 8',
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
							fieldCls : 'h2',
							cls : 'date-range-font-size',
							padding : '0 3 0 0',
							editable : false,
							parent : me,
							vtype : 'daterange',
							endDateField : 'toDate',
							format : !Ext.isEmpty(strExtApplicationDateFormat)
									? strExtApplicationDateFormat
									: 'm/d/Y',
							listeners : {
								'change' : function(field, newValue, oldValue) {
									if (!Ext.isEmpty(newValue)) {
										Ext.form.field.VTypes.daterange(
												newValue, field);
									}
								}
							}
						}, {
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
							format : !Ext.isEmpty(strExtApplicationDateFormat)
									? strExtApplicationDateFormat
									: 'm/d/Y',
							listeners : {
								'change' : function(field, newValue, oldValue) {
									if (!Ext.isEmpty(newValue)) {
										Ext.form.field.VTypes.daterange(
												newValue, field);
									}
								}
							}
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
									itemId : 'dateFilterFrom',
									text : dtApplicationDate
								}, {
									xtype : 'label',
									itemId : 'dateFilterTo'
								}]
					}]
				});
		dateParentPanel.add(dateContainerPanel);
	},
	addDatePanel : function(parentPanel) {
		var me = this;
		var dateParentPanel = Ext.create('Ext.panel.Panel', {
					cls : 'xn-filter-toolbar',
					layout : 'vbox',
					flex : 0.7,
					items : []
				});
		me.addDateMenuPanel(dateParentPanel);
		me.addDateContainerPanel(dateParentPanel);
		parentPanel.add(dateParentPanel);
	},
	addAllSavedFilterCodeToView : function(arrFilters) {
		var me = this;
		var objToolbar = me.down('toolbar[itemId="advFilterActionToolBar"]');
		var arrTBarItems = [], item = null;
		if (objToolbar) {
			if (objToolbar.items && objToolbar.items.length > 0)
				objToolbar.removeAll();
			if (arrFilters && arrFilters.length > 0) {
				for (var i = 0; i < 2; i++) {
					if (arrFilters[i]) {
						item = Ext.create('Ext.Button', {
							cls : 'cursor_pointer xn-account-filter-btnmenu',
							text : Ext.util.Format.ellipsis(arrFilters[i], 11),
							itemId : arrFilters[i],
							tooltip : arrFilters[i],
							handler : function(btn, opts) {
								var objToolbar = me
										.down('toolbar[itemId="advFilterActionToolBar"]');
								objToolbar.items.each(function(item) {
											item
													.removeCls('xn-custom-heighlight');
										});
								btn.addCls('xn-custom-heighlight');
								me.fireEvent('handleSavedFilterItemClick',
										btn.itemId, btn, true);
							}
						});
						arrTBarItems.push(item);
					}
				}
				var imgItem = Ext.create('Ext.Img', {
							src : 'static/images/icons/icon_spacer.gif',
							height : 16,
							padding : '0 3 0 3',
							cls : 'ux_hide-image'
						});
				item = Ext.create('Ext.Button', {
					cls : 'cursor_pointer xn-account-filter-btnmenu xn-button-transparent',
					menuAlign : 'tr-br',
					text : getLabel('moreText', 'more') + '&nbsp;>>',
					itemId : 'AdvMoreBtn',
					// width : 48,
					padding : '2 0 0 0',
					handler : function(btn, opts) {
						// TODO: To be handled
						me.fireEvent('moreAdvancedFilterClick', btn);
					}
				});
				arrTBarItems.push(imgItem);
				arrTBarItems.push(item);
				objToolbar.removeAll();
				objToolbar.add(arrTBarItems);
			}
		}
	},
	highlightSavedFilter : function(strFilterCode) {
		var me = this;
		var objToolbar = me.down('toolbar[itemId="advFilterActionToolBar"]');
		if (objToolbar) {
			objToolbar.items.each(function(item) {
						// item.removeCls('xn-custom-heighlight');
						if (item.itemId === strFilterCode)
							item.addCls('xn-custom-heighlight');
					});
		}
	},
	removeHighlight : function() {
		var me = this;
		var objToolbar = me.down('toolbar[itemId="advFilterActionToolBar"]');
		if (objToolbar) {
			objToolbar.items.each(function(item) {
						item.removeCls('xn-custom-heighlight');
					});
		}
	},
	savedFilterStore : function() {
		var myStore = new Ext.data.ArrayStore({
					autoLoad : true,
					fields : ['filterName'],
					proxy : {
						type : 'ajax',
						url : 'services/userfilterslist/positivePayIssuance.json',
						reader : {
							type : 'json',
							root : 'd.filters'
						}
					},
					listeners : {
						load : function(store, records, success, opts) {
							store.each(function(record) {
										record.set('filterName', record.raw);
									});
						}
					}
				})
		return myStore;
	},
	getDateDropDownItems : function(buttonIns) {
		var me = this;
	    var intFilterDays = !Ext.isEmpty(filterDays)
		? parseInt(filterDays,10)
		: '';
		var arrMenuItem = [{
										text : getLabel('latest', 'Latest'),
										btnId : 'latest',
										parent : this,
										btnValue : '12',
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									}];
		if (intFilterDays >= 1 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
										text : getLabel('today', 'Today'),
										btnId : 'btnToday',
										btnValue : '1',
										parent : this,
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									});	
			if (intFilterDays >= 2 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
				text : getLabel('yesterday',
												'Yesterday'),
										btnId : 'btnYesterday',
										btnValue : '2',
										parent : this,
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
				}
			});
		
		if (intFilterDays >= 7 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
					text : getLabel('thisweek', 'This Week'),
										btnId : 'btnThisweek',
										btnValue : '3',
										parent : this,
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
					}
				});
		if (intFilterDays >= 14 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
										text : getLabel('lastweektodate',
												'Last Week To Date'),
										btnId : 'btnLastweek',
										parent : this,
										btnValue : '4',
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									});
		if (intFilterDays >= 30 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
										text : getLabel('thismonth',
												'This Month'),
										btnId : 'btnThismonth',
										parent : this,
										btnValue : '5',
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									});
		if (intFilterDays >= 60 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
										text : getLabel('lastMonthToDate',
												'Last Month To Date'),
										btnId : 'btnLastmonth',
										btnValue : '6',
										parent : this,
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									});
		 if (lastMonthOnlyFilter===true || Ext.isEmpty(intFilterDays))
		   arrMenuItem.push({
										text : getLabel('lastmonthonly',
												'Last Month Only'),
										btnId : 'btnLastmonthonly',
										btnValue : '14',
										parent : this,
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									});
		if (intFilterDays >= 90 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
										text : getLabel('thisquarter',
												'This Quarter'),
										btnId : 'btnLastMonthToDate',
										btnValue : '8',
										parent : this,
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									});
		if (intFilterDays >= 180 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
										text : getLabel('lastQuarterToDate',
												'Last Quarter To Date'),
										btnId : 'btnQuarterToDate',
										btnValue : '9',
										parent : this,
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									});
		if (intFilterDays >= 365 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
										text : getLabel('thisyear', 'This Year'),
										btnId : 'btnLastQuarterToDate',
										btnValue : '10',
										parent : this,
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									});
		if (intFilterDays >= 730 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push( {
										text : getLabel('lastyeartodate',
												'Last Year To Date'),
										btnId : 'btnYearToDate',
										parent : this,
										btnValue : '11',
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									});
		var dropdownMenu = Ext.create('Ext.menu.Menu', {
			itemId : 'DateMenu',
			cls : 'ext-dropdown-menu',
			listeners : {
				hide : function(event) {
					//buttonIns.addCls('ui-caret-dropdown');
					buttonIns.removeCls('action-down-hover');
				}
			},
			items : arrMenuItem
		});
		return dropdownMenu;
	},
	getDateParam : function(index, dateType, dateHandler) {
		var me = this;
		var objDateHandler = dateHandler;
		var strAppDate = dtApplicationDate;
		var dtFormat = strExtApplicationDateFormat;
		var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
		var strSqlDateFormat = 'Y-m-d';
		var fieldValue1 = '', fieldValue2 = '', operator = '';
		var retObj = {};
		var dtJson = {};
		switch (index) {
			case '1' :
				// Today
				fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
				fieldValue2 = fieldValue1;
				operator = 'eq';
				break;
			case '2' :
				// Yesterday
				fieldValue1 = Ext.Date.format(objDateHandler
								.getYesterdayDate(date), strSqlDateFormat);
				fieldValue2 = fieldValue1;
				operator = 'eq';
				break;
			case '3' :
				// This Week
				dtJson = objDateHandler.getThisWeekToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '4' :
				// Last Week To Date
				dtJson = objDateHandler.getLastWeekToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '5' :
				// This Month
				dtJson = objDateHandler.getThisMonthToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '6' :
				// Last Month To Date
				dtJson = objDateHandler.getLastMonthToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '7' :
				// Date Range
				if (!Ext.isEmpty(dateType)) {
					var objCreateNewFilterPanel = me
							.down('pmtAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] pmtCreateNewAdvFilter[itemId=stdViewAdvFilter]');
					if (dateType == "process") {
						var frmDate = objCreateNewFilterPanel
								.down('datefield[itemId=processFromDate]')
								.getValue();
						var toDate = objCreateNewFilterPanel
								.down('datefield[itemId=processToDate]')
								.getValue();
					} else if (dateType == "effective") {
						var frmDate = objCreateNewFilterPanel
								.down('datefield[itemId=effectiveFromDate]')
								.getValue();
						var toDate = objCreateNewFilterPanel
								.down('datefield[itemId=effectiveToDate]')
								.getValue();
					} else if (dateType == "creation") {
						var frmDate = objCreateNewFilterPanel
								.down('datefield[itemId=creationFromDate]')
								.getValue();
						var toDate = objCreateNewFilterPanel
								.down('datefield[itemId=creationToDate]')
								.getValue();
					}

				} else {
					var frmDate = me.down('datefield[itemId="fromDate"]')
							.getValue();
					var toDate = me.down('datefield[itemId="toDate"]')
							.getValue();
				}

				fieldValue1 = Ext.Date.format(frmDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '8' :
				// This Quarter
				dtJson = objDateHandler.getQuarterToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '9' :
				// Last Quarter To Date
				dtJson = objDateHandler.getLastQuarterToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '10' :
				// This Year
				dtJson = objDateHandler.getYearToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '11' :
				// Last Year To Date
				dtJson = objDateHandler.getLastYearToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '14' :
			    //last month only
				dtJson = objDateHandler.getLastMonthStartAndEndDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '12' :
				fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
				fieldValue2 = fieldValue1;
				operator = 'le';
				break;
		}
		retObj.fieldValue1 = fieldValue1;
		retObj.fieldValue2 = fieldValue2;
		retObj.operator = operator;
		return retObj;
	}
});