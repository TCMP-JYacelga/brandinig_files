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
	
	//title :'<span id="imgFilterInfoGridView">'+getLabel('filterBy', 'Filter By: ')+'</span>',
	//cls : 'xn-ribbon',
	config : {
		advFlex : 1,
		dateFlex : 1,
		txnFlex : 1
	},
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	/*tools : [{
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
			}],*/
	initComponent : function() {
		var me = this;
		me.items = [];
		me.createPanels();
		me.callParent(arguments);
	},
	createPanels : function() {
		var me = this;
		var parentPanel = Ext.create('Ext.panel.Panel', {
					itemId : 'filterParentPanel',
					layout : 'hbox'
				});

		me.addAdvanceFilterPanel(parentPanel);
		me.addTypeCodePanel(parentPanel);
		me.addDatePanel(parentPanel);
		me.addManageTypeCode(parentPanel);
		me.items = parentPanel;
	},
	addTypeCodePanel : function(parentPanel) {
		var me = this;
		var typeCodePanel = Ext.create('Ext.container.Container', {
			itemId : 'txnCatToolBarContainer',		
			layout : 'vbox',
			//flex : 1.2,
			padding : '0 30 0 0',
			width: '25%',
			//flex : me.txnFlex,
			items : [
					{
						xtype : 'label',
						text : getLabel('typecodeset', 'Type Code Set'),
						flex : 1
					}, 
					{
						xtype : 'container',
						layout : 'hbox',
						width : '100%',
						//padding : '0 80 0 0',
						items : [						
						/*{
							xtype : 'toolbar',
							itemId : 'accountsFilterToobar',
							cls : 'xn-toolbar-small',
							padding : '8 0 0 0',
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
						}*/
						
						
						{
						xtype : 'combo',
						width : '100%',
						valueField : 'typeCodes',
						displayField : 'txnCategory',
						filterParamName : 'typeCode',
						queryMode : 'local',
						editable : false,
						triggerAction : 'all',
						itemId : 'allCat',
						mode : 'local',
						//multiSelect : true,
						emptyText : getLabel('selectfilter','Select Filter'),
						store : me.getTypeCodeSetStore(),
						deleteIcon : true,
						padding : '-4 0 0 0',
				      	listeners:{
							'select':function(combo, opts){
								me.doHandleTransactionCategoryFilterClick(combo);
									me.fireEvent('handleTransactionCategoryFilterClick',combo);
								//me.fireEvent("handleTransactionCategoryFilterClick",combo, combo.getValue(),combo.getRawValue());
								}
						},
						listConfig:{
							itemTpl: '<div class="ux_text-elipsis" data-qtip="{txnCategory}">{txnCategory}</div>'
						}
					}
						
						/*,
												
						{
							xtype : 'toolbar',
							//text : getLabel('addtypecodeset', 'Add Type Code Set'),
							cls : 'cursor_pointer xn-account-filter-btnmenu button_underline xn-toolbar-small',
							itemId : 'transactionCategoriesToolBar',
							//itemId : 'transactionCategoriesTypeCode',
							padding : '6 0 0 0',
							filterParamName : 'typeCode',
							items : []
						}*/
						]
					}]

		});
		parentPanel.add(typeCodePanel);
	},
	addDatePanel : function(parentPanel) {
		var me = this;
		var datePanel = Ext.create('Ext.container.Container', {
            itemId : 'dateFilterToolbar',
            layout : 'vbox',
            width : 290,
            padding : '0 30 0 0',
            items: [ {
                xtype : 'panel',
                itemId : 'PostingDatePanel',
                layout : 'hbox',
                height : 23,
                flex : 1,
                items : [ {
                    xtype : 'label',
                    itemId : 'PostingDateLabel',
                    text : getLabel('postingDate', 'Posting Date'),
                    padding : '0 0 12 6'
                }, {
                    xtype : 'button',
                    border : 0,
                    filterParamName : 'entryDate',
                    itemId : 'entryDate',
                    cls : 'ui-caret-dropdown',
                    listeners : {
                        click : function(event) {
                            var menus = me.createDateFilterMenu(this)
                            var xy = event.getXY();
                            menus.showAt(xy[0], xy[1] + 16);
                            event.menu = menus;
                        }
                    }
                } ]
            }, {
                xtype : 'container',
                itemId : 'transDatePicker',
                layout : 'hbox',
				width : '100%',
                items : [ {
                    xtype : 'component',
                    width : '80%',
                    itemId : 'transDatePicker',
                    filterParamName : 'EntryDate',
                    html : '<input type="text"  id="entryDataPicker" class="ft-datepicker from-date-range ui-datepicker-range-alignment">'
                }, {
                    xtype : 'component',
                    cls : 'icon-calendar',
                    margin : '1 0 0 0',
                    html : '<span class=""><i class="fa fa-calendar"></i></span>'
                } ]
            } ]
		});
		parentPanel.add(datePanel);
	},
	addAdvanceFilterPanel : function(parentPanel) {
		var me = this;
		var advPanel =  Ext.create('Ext.container.Container', {
			itemId : 'txnAdvfilterContainer',		
			layout : 'vbox',
			//flex : 1,
			padding : '0 30 0 0',
			//flex : me.txnFlex,
			width: '25%',
			items : [{
						xtype : 'label',
						itemId : 'savedFiltersLabel',
						text : getLabel('savedFilters', 'Saved Filters')
			         }, {
						xtype : 'combo',
						width : '100%',
						valueField : 'filterName',
						displayField : 'filterName',
						queryMode : 'local',
						editable : false,
						triggerAction : 'all',
						itemId : 'savedFiltersCombo',
						mode : 'local',
						emptyText : getLabel('selectfilter','Select Filter'),
						store : me.savedFilterStore(),
						padding : '-4 0 0 0',
						listeners:{
							'select':function(combo,record){
								me.fireEvent("handleSavedFilterItemClick",combo.getValue(),combo.getRawValue());
								}
						},
						listConfig:{
							itemTpl: '<div class="ux_text-elipsis" data-qtip="{filterName}">{filterName}</div>'
						}
					}]

		});
		parentPanel.add(advPanel);
	},
	
	addManageTypeCode : function(parentPanel){
		var me = this;
		var a = Ext.create('Ext.container.Container', {
			height: '100%',
			flex : 1,
			itemid : 'ManagetypeCode',
			padding : '27 0 0 70',
			layout : 'vbox',
			items : [{
				xtype : 'label',
				itemId : 'createAdvanceFilterLabel',
				cls : 'create-advanced-filter-label truncate-text',
				text : getLabel('manageTypeCode', 'Manage Type Code Set'),
				margin : '0 0 4 0',
				autoEl: {
	                tag: 'label',
	                'data-qtip': 'Manage Type Code Set'
	            },
				width : screen.width > 1024 ? '155px' : '100px',
				listeners : {
					render : function(c) {
						c.getEl().on('click', function() {
									me.fireEvent('handleTransCategoryTypeCodeClick',c);
								}, c);
					}
				}
				/*handler : function(btn, opts) {
					//	me.createTransactionCategoryPopup(0);    // handled in transactionSearch.js
						//me.fireEvent('moreTransactionCategoryClick',btn);
						me.fireEvent('handleTransCategoryTypeCodeClick',btn);
					}*/
			}]
		});
		parentPanel.add(a);
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
	createDateFilterMenu : function(buttonIns) {
		var me = this;
		var menu = null;
		var intFilterDays = objClientParameters
				&& !Ext.isEmpty(objClientParameters['filterDays'])
				? parseInt(objClientParameters['filterDays'],10)
				: '';
		var arrMenuItem = [];
		/*var arrMenuItem = [{
					text : getLabel('latestLogin', 'Latest since last login'),
					btnId : 'latestSinceLogin',
					parent : this,
					btnValue : 'latestSinceLogin',
					handler : function(btn, opts) {
						me.fireEvent('informationFilterClick', 'latestlastLogin');
					}
				}];*/

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

	/*	if (intFilterDays >= 1 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
						text : getLabel('today', 'Today'),
						btnId : 'btnToday',
						btnValue : '1',
						parent : this,
						handler : function(btn, opts) {
							me.doResetInformatinFilter();
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});*/
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
						text : getLabel('lastweektodate', 'Last Week To Yesterday'),
						btnId : 'btnLastweek',
						parent : this,
						btnValue : '4',
						handler : function(btn, opts) {
							me.doResetInformatinFilter();
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		if (intFilterDays >= 30 || Ext.isEmpty(intFilterDays))
		{
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
		}
		if (intFilterDays >= 60 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastMonthToDate', 'Last Month To Yesterday'),
						btnId : 'btnLastmonth',
						btnValue : '6',
						parent : this,
						handler : function(btn, opts) {
							me.doResetInformatinFilter();
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		if (lastMonthOnlyFilter===true || Ext.isEmpty(intFilterDays))
		{
			arrMenuItem.push({
						text : getLabel('lastmonthonly', 'Last Month Only'),
						btnId : 'btnLastmonthonly',
						parent : this,
						btnValue : '14',
						handler : function(btn, opts) {
							me.doResetInformatinFilter();
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		}
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
								'Last Quarter To Yesterday'),
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
						text : getLabel('lastyeartodate', 'Last Year To Yesterday'),
						btnId : 'btnYearToDate',
						parent : this,
						btnValue : '11',
						handler : function(btn, opts) {
							me.doResetInformatinFilter();
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		/*arrMenuItem.push({
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
				});*/

		menu = Ext.create('Ext.menu.Menu', {
					
					cls : 'ext-dropdown-menu',
											listeners : {
											hide:function(event) {
												//buttonIns.addCls('ui-caret-dropdown');
												buttonIns.removeCls('action-down-hover');
												}
											},	
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
				//me.createTransactionCategoryPopup(1);
				//me.fireEvent('addTransactionCategoryClick', btn);
				me.fireEvent('handleTransCategoryTypeCodeClick',btn);
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
				/*tbar.add({
							text : getLabel('moreText', 'more') + '&nbsp;>>',
							cls : 'cursor_pointer xn-account-filter-btnmenu',
							btnId : 'moreTransactionCategory',
							itemId : 'moreTransactionCategory',
							handler : function(btn, opts) {
							//	me.createTransactionCategoryPopup(0);    // handled in transactionSearch.js
								//me.fireEvent('moreTransactionCategoryClick',btn);
								me.fireEvent('handleTransCategoryTypeCodeClick',btn);
							}
						}	);*/
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
		/*tbar.items.each(function(item) {
					item.removeCls('xn-custom-heighlight');
				});
		btn.addCls('xn-custom-heighlight');*/
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
					cls : 'cursor_pointer xn-account-filter-btnmenu  button_underline',
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
	},
	savedFilterStore : function() {
		var myStore = new Ext.data.ArrayStore({
					autoLoad : true,
					fields : ['filterName'],
					proxy : {
						type : 'ajax',
						url : 'services/userfilterslist/tranSearchSummary.json?',	
                        async : false,
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
	getTypeCodeSetStore : function() {
		var storeData = null;
		Ext.Ajax.request({
			url : 'services/userpreferences/tranSearchSummaryCategories/transactionCategories.json',
			method : 'GET',
			async : false,
			success : function(response) {
				if (!Ext.isEmpty(response.responseText)){
				var data = Ext.decode(response.responseText);				
				if (!Ext.isEmpty(data) && !Ext.isEmpty(data.preference)) {
					storeData = JSON.parse(data.preference);
				}
				}
			},			
			failure : function(response) {
				// console.log("Ajax Get data Call Failed");
			}

		});
		
		var myStore = Ext.create('Ext.data.Store', {
			fields : ['txnCategory','typeCodes'],
			data : storeData,
			reader : {
				type : 'json',
				root : 'preference'
			}
		});
		
		return myStore;
	}

});