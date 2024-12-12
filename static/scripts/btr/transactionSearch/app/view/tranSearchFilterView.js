/**
 * @class GCP.view.tranSearchFilterView
 * @extends Ext.panel.Panel
 * @author Shraddha Chauhan
 */
Ext.define('GCP.view.tranSearchFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'tranSearchFilterView',
	requires : ['Ext.panel.Panel', 'Ext.form.Label', 'Ext.menu.Menu',
			'Ext.form.field.Date', 'Ext.picker.Date',
			'Ext.container.Container', 'Ext.toolbar.Toolbar',
			'Ext.button.Button','GCP.view.tranCategoryPopUpView'],
	width : '100%',
	componentCls : 'gradiant_back',
	collapsible : true,
	title :'<span id="imgFilterInfoGridView">'+getLabel('filterBy', 'Filter By: ')+'</span>',
	cls : 'xn-ribbon',
	config : {
		advFlex : 1,
		dateFlex : 1,
		txnFlex : 1
	},
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	tools : [{
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
			}],
	initComponent : function() {
		var me = this;
		me.items = [];
		me.createPanels();
		me.callParent(arguments);
	},
	createPanels : function() {
		var me = this;
		var me = this;
		var parentPanel = Ext.create('Ext.panel.Panel', {
					itemId : 'filterParentPanel',
					cls : 'ux_paddingtb',
					layout : 'hbox'
				});

		me.addDatePanel(parentPanel);
		me.addTypeCodePanel(parentPanel);
		me.addAdvanceFilterPanel(parentPanel);
		me.items = parentPanel;
	},
	addTypeCodePanel : function(parentPanel) {
		var me = this;
		var typeCodePanel = Ext.create('Ext.container.Container', {
			itemId : 'txnCatToolBarContainer',
			cls : 'xn-filter-toolbar',
			layout : 'vbox',
			width: '30%',
			//flex : me.txnFlex,
			items : [{
						xtype : 'label',
						text : getLabel('typecodeset', 'Type Code Set'),
						cls : 'f13 ux_payment-type',
						flex : 1
					}, {
						xtype : 'container',
						layout : 'hbox',
						padding : '0 0 0 0',
						items : [{
							xtype : 'toolbar',
							itemId : 'accountsFilterToobar',
							cls : 'xn-toolbar-small',
							padding : '6 0 0 6',
							filterParamName : 'typeCode',
							items : [{
								text : getLabel('all', 'All'),
								cls : 'cursor_pointer xn-account-filter-btnmenu',
								itemId : 'allCat',
								btnId : getLabel('all', 'All'),
								parent : me,
								typeCodeArray : 'all',
								handler : function(btn, opts) {
									me
											.doHandleTransactionCategoryFilterClick(btn);
									me
											.fireEvent(
													'handleTransactionCategoryFilterClick',
													btn);
								}
							}]
						}, {
							xtype : 'toolbar',
							itemId : 'transactionCategoriesToolBar',
							cls : 'xn-toolbar-small',
							padding : '6 0 0 0',
							filterParamName : 'typeCode',
							items : []
						}]
					}]

		});
		parentPanel.add(typeCodePanel);
	},
	addDatePanel : function(parentPanel) {
		var me = this;
		var datePanel = Ext.create('Ext.panel.Panel', {
			itemId : 'dateFilterToolbar',
			layout : 'vbox',
			width: '35%',
			//flex : me.dateFlex,
			items : [{
						xtype : 'label',
						itemId : 'dateLabel',
						text : getLabel('date', 'Date'),
						cls : 'f13 ux_payment-type',
						flex : 1
					}, {
						xtype : 'panel',
						layout : 'hbox',
						width: '100%',
						padding : '6 0 0 9',
						items : [{
							xtype : 'container',
							itemId : 'dateRangeComponent',
							layout : 'hbox',
							hidden : true,
							items : [{
								xtype : 'datefield',
								itemId : 'fromDate',
								width : 80,
								padding : '0 6 0 0',
								editable : false,
								hideTrigger : true,
								fieldCls : 'h2',
								format : !Ext
										.isEmpty(strExtApplicationDateFormat)
										? strExtApplicationDateFormat
										: 'm/d/Y',
								parent : me,
								vtype : 'daterange',
								endDateField : 'toDate',
								listeners : {
									'change' : function(field, newValue,
											oldValue) {
										if (!Ext.isEmpty(newValue)) {
											Ext.form.field.VTypes.daterange(
													newValue, field,
													field.parent);
										}

									}
								}
							}, {
								xtype : 'datefield',
								itemId : 'toDate',
								padding : '0 3 0 0',
								editable : false,
								width : 80,
								hideTrigger : true,
								fieldCls : 'h2',

								format : !Ext
										.isEmpty(strExtApplicationDateFormat)
										? strExtApplicationDateFormat
										: 'm/d/Y',
								parent : me,
								vtype : 'daterange',
								startDateField : 'fromDate',
								listeners : {
									'change' : function(field, newValue,
											oldValue) {
										if (!Ext.isEmpty(newValue)) {
											Ext.form.field.VTypes.daterange(
													newValue, field);
										}
									}
								}
							}, {
								xtype : 'button',
								text : getLabel('goBtn', 'Go'),
								cls : 'ux_button-background-color ux_button-padding',
								itemId : 'goBtn',
								margin : '0 4 0 0',
								handler : function(btn) {
									me.doResetInformatinFilter();
									var fieldFromDate = me
											.down('datefield[itemId="fromDate"]');
									var fieldToDate = me
											.down('datefield[itemId="toDate"]');
									if (fieldFromDate && fieldToDate
											&& fieldFromDate.getValue()
											&& fieldToDate.getValue())
										me.fireEvent('dateRangeChange', btn);
								}
							}]

						}, {
							xtype : 'toolbar',
							itemId : 'dateToolBar',
							cls : 'xn-toolbar-small',
							padding : '0 0 5 1',
							items : [{
										xtype : 'label',
										itemId : 'dateFilterFrom',
										// The below text will get set in
										// controller
										text : ''
									}, {
										xtype : 'label',
										itemId : 'dateFilterTo'
									}, {
										xtype : 'button',
										margin : '0 0 5 0',
										border : 0,
										filterParamName : 'postingDate',
										itemId : 'postingDate',
										cls : 'menu-disable cursor_pointer ux_margint',
										glyph : 'xf0d7@fontawesome',
										arrowAlign : 'right',
										menu : me.createDateFilterMenu()
									}]
						}]
					}]

		});
		parentPanel.add(datePanel);
	},
	addAdvanceFilterPanel : function(parentPanel) {
		var me = this;
		var advPanel = Ext.create('Ext.panel.Panel', {
					itemId : 'advFilterPanel',
					cls : 'xn-filter-toolbar',
					width: '33.33%',
					//flex : me.advFlex,
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
							text : '<span class="button_underline">'
									+ getLabel('createNewFilter',
											'Create New Filter') + '</span>',
							cls : 'xn-account-filter-btnmenu xn-small-button',
							// width : 100,
							// margin : '7 0 0 0',
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
						// padding : '5 0 0 1',
						padding : '6 0 0 4',
						width : '100%',
						enableOverflow : true,
						border : false,
						items : []

					}]
				});
		parentPanel.add(advPanel);
	},
	doResetInformatinFilter : function() {
		var me = this;
		var btn = me.down('button[itemId="infoAllBtn"]');
		if (btn)
			btn.addCls('xn-custom-heighlight');
		btn = me.down('button[itemId="infoNewBtn"]');
		if (btn)
			btn.removeCls('xn-custom-heighlight');
	},
	createDateFilterMenu : function() {
		var me = this;
		var menu = null;
		var intFilterDays = objClientParameters
				&& !Ext.isEmpty(objClientParameters['filterDays'])
				&& objClientParameters['filterDays'] !== 0
				? parseInt(objClientParameters['filterDays'],10)
				: '';
		var arrMenuItem = [{
					text : getLabel('latestLogin', 'Latest since last login'),
					btnId : 'latestSinceLogin',
					parent : this,
					btnValue : 'latestSinceLogin',
					handler : function(btn, opts) {
						me.fireEvent('informationFilterClick', 'latestlastLogin');
					}
				}];

		arrMenuItem.push({
					text : getLabel('latest', 'Latest'),
					btnId : 'latest',
					parent : this,
					btnValue : '12',
					handler : function(btn, opts) {
						me.doResetInformatinFilter();
						this.parent.fireEvent('dateChange', btn, opts);
					}
				});

		if (intFilterDays >= 1 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
						text : getLabel('today', 'Today'),
						btnId : 'btnToday',
						btnValue : '1',
						parent : this,
						handler : function(btn, opts) {
							me.doResetInformatinFilter();
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		if (intFilterDays >= 2 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
						text : getLabel('yesterday', 'Yesterday'),
						btnId : 'btnYesterday',
						btnValue : '2',
						parent : this,
						handler : function(btn, opts) {
							me.doResetInformatinFilter();
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		if (intFilterDays >= 7 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
						text : getLabel('thisweek', 'This Week'),
						btnId : 'btnThisweek',
						btnValue : '3',
						parent : this,
						handler : function(btn, opts) {
							me.doResetInformatinFilter();
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		if (intFilterDays >= 14 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastweektodate', 'Last Week To Date'),
						btnId : 'btnLastweek',
						parent : this,
						btnValue : '4',
						handler : function(btn, opts) {
							me.doResetInformatinFilter();
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		if (intFilterDays >= 30 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
						text : getLabel('thismonth', 'This Month'),
						btnId : 'btnThismonth',
						parent : this,
						btnValue : '5',
						handler : function(btn, opts) {
							me.doResetInformatinFilter();
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		if (intFilterDays >= 60 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastMonthToDate', 'Last Month To Date'),
						btnId : 'btnLastmonth',
						btnValue : '6',
						parent : this,
						handler : function(btn, opts) {
							me.doResetInformatinFilter();
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		if (intFilterDays >= 90 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
						text : getLabel('thisquarter', 'This Quarter'),
						btnId : 'btnLastMonthToDate',
						btnValue : '8',
						parent : this,
						handler : function(btn, opts) {
							me.doResetInformatinFilter();
							this.parent.fireEvent('dateChange', btn, opts);
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
							me.doResetInformatinFilter();
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		if (intFilterDays >= 365 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
						text : getLabel('thisyear', 'This Year'),
						btnId : 'btnLastQuarterToDate',
						btnValue : '10',
						parent : this,
						handler : function(btn, opts) {
							me.doResetInformatinFilter();
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		if (intFilterDays >= 730 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastyeartodate', 'Last Year To Date'),
						btnId : 'btnYearToDate',
						parent : this,
						btnValue : '11',
						handler : function(btn, opts) {
							me.doResetInformatinFilter();
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		arrMenuItem.push({
					text : getLabel('daterange', 'Date Range'),
					btnId : 'btnDateRange',
					parent : this,
					btnValue : '7',
					handler : function(btn, opts) {
						var field = me.down('datefield[itemId="fromDate"]');
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
	createTransactionCategoryPopup : function(intActiveTabIndex) {
		var me = this;
		if (Ext.isEmpty(me.transactionCategoryPopup)) {
			me.transactionCategoryPopup = Ext.create(
					'GCP.view.tranCategoryPopUpView', {
						itemId : 'transactionCategoryPopUpView',
						activeTab : intActiveTabIndex
					});
			me.transactionCategoryPopup.on('beforeshow', function() {
						me.refreshTransactionCategories();
					});
		}
		me.transactionCategoryPopup.show();
	},
	refreshTransactionCategories : function() {
		var me = this;
		var grid = me.transactionCategoryPopup ? me.transactionCategoryPopup
				.down('grid[itemId="transactionCategoryGridView"]') : null;
		Ext.Ajax.request({
			url : 'services/userpreferences/tranSearchSummaryCategories/transactionCategories.json',
			method : "GET",
			async : false,
			success : function(response) {
				if (!Ext.isEmpty(response.responseText)) {
					var data = Ext.decode(response.responseText);
					pref = Ext.decode(data.preference);
					if (grid) {
						grid.store.removeAll(true);
						grid.loadRawData(pref);
					}
				}
			}
		});

	},
	getTransactionCategoryPopup : function() {
		var me = this;
		return me.transactionCategoryPopup;
	},
	addTransactionCategories : function(arrData, strTxnCatFilter) {
		var me = this;
		var intCount = 0;
		var tbar = me.down('toolbar[itemId="transactionCategoriesToolBar"]');
		var allBtn = null;
		var objBtn = {
			text : getLabel('addtypecodeset', 'Add Type Code Set'),
			cls : 'cursor_pointer xn-account-filter-btnmenu button_underline',
			itemId : 'addTransactionCategoryPopupButton',
			handler : function(btn, opts) {
				me.createTransactionCategoryPopup(1);
				me.fireEvent('addTransactionCategoryClick', btn);
			}
		};
		var strTxnCatName = null, intAccountsCnt = 0, arrTypeCodes = null, strCls = null, imgItem = null, isFilterMatch = false;
		if (tbar) {
			tbar.removeAll(true);
			if (arrData === null || arrData.length == 0)
				tbar.add(objBtn);
			else {
				intCount = arrData.length > 2 ? 2 : arrData.length;
				for (var i = 0; i < intCount; i++) {
					strTxnCatName = arrData[i].txnCategory;
					intAccountsCnt = arrData[i].typeCodes.length;
					arrTypeCodes = arrData[i].typeCodes;

					if (strTxnCatFilter === strTxnCatName) {
						strcls = 'xn-custom-heighlight';
						isFilterMatch : true;
					} else
						strcls = 'cursor_pointer xn-account-filter-btnmenu';

					tbar.add({
						text : strTxnCatName + "<span class='count-color'>("
								+ intAccountsCnt + ")</span>",
						btnId : strTxnCatName,
						itemIdId : strTxnCatName,
						typeCodeArray : arrTypeCodes,
						cls : strcls,
						handler : function(btn, opts) {
							me.doHandleTransactionCategoryFilterClick(btn);
							me
									.fireEvent(
											'handleTransactionCategoryFilterClick',
											btn);
						}
					});

				}
				imgItem = Ext.create('Ext.Img', {
							src : 'static/images/icons/icon_spacer.gif',
							height : 10
						});
				tbar.add(imgItem);
				tbar.add({
							text : getLabel('moreText', 'more') + '&nbsp;>>',
							cls : 'cursor_pointer xn-account-filter-btnmenu',
							btnId : 'moreTransactionCategory',
							itemId : 'moreTransactionCategory',
							handler : function(btn, opts) {
								me.createTransactionCategoryPopup(0);
								me.fireEvent('moreTransactionCategoryClick',
										btn);
							}
						});
			}
		}
		if (!isFilterMatch) {
			allBtn = me.down('button[itemId="allCat"]');
			if (allBtn)
				allBtn.addCls('xn-custom-heighlight');
		}
	},
	doHandleTransactionCategoryFilterClick : function(btn) {
		var me = this;
		var allBtn = me.down('button[itemId="allCat"]');
		if (allBtn)
			allBtn.removeCls('xn-custom-heighlight');
		var tbar = me.down('toolbar[itemId="transactionCategoriesToolBar"]');
		tbar.items.each(function(item) {
					item.removeCls('xn-custom-heighlight');
				});
		btn.addCls('xn-custom-heighlight');
	},
	doResetTransactionCategoryFilter : function() {
		var me = this;
		var allBtn = me.down('button[itemId="allCat"]');
		if (allBtn)
			allBtn.addCls('xn-custom-heighlight');
		var tbar = me.down('toolbar[itemId="transactionCategoriesToolBar"]');
		tbar.items.each(function(item) {
					item.removeCls('xn-custom-heighlight');
				});
	},
	handleInfoToolTip : function() {
		var me = this;
		var infotip = Ext.create('Ext.tip.ToolTip', {
					target : 'imgFilterInfoGridView',
					itemId : 'tranSearchInfoToolTip',
					html : ''
				});
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
						item.removeCls('xn-custom-heighlight');
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
	}

});