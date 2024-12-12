Ext.define('GCP.view.ReceivableSummaryFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'receivableSummaryFilterView',
	requires : ['Ext.panel.Panel', 'Ext.form.Label',
			'Ext.layout.container.VBox', 'Ext.layout.container.HBox',
			'Ext.form.Label', 'Ext.toolbar.Toolbar', 'Ext.button.Button',
			'Ext.menu.Menu', 'Ext.container.Container', 'Ext.form.field.Date'],
	width : '100%',
	componentCls : 'gradiant_back',
	collapsible : true,
	cls : 'xn-ribbon',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		this.items = [];
		this.createPanels();
		this.callParent(arguments);
	},
	tools : [{
		xtype : 'container',
		padding : '0 9 0 0',
		layout : 'hbox',
		items : [
			{
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
			}     
		]
	}
     ],
	createPanels : function() {
		var me = this;
		var me = this;
		var parentPanel = Ext.create('Ext.panel.Panel', {
					layout : 'hbox',
					cls : 'ux_paddingtb'
				});

		me.addPaymentTypePanel(parentPanel);
		me.addDatePanel(parentPanel);
		me.addStatusPanel(parentPanel);
		me.addAdvanceFilterPanel(parentPanel);
		me.items = parentPanel;
	},
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
							cls : 'f13 ux_font-size14',
							hidden : isHidden('AdvanceFilter')
						}, /*{
							xtype : 'image',
							src : 'static/images/icons/icon_spacer.gif',
							height : 18,
							hidden : isHidden('AdvanceFilter'),
							padding : '5 0 0 9'

						},*/ {
							xtype : 'button',
							itemId : 'newFilter',
							text : '<span class="linkblue">'
									+ getLabel('createNewFilter',
											'Create New Filter') + '</span>',
							cls : 'xn-account-filter-btnmenu xn-small-button',
							margin : '0 0 0 10',
							hidden : isHidden('AdvanceFilter'),
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
	addStatusPanel : function(parentPanel) {
		var statusPanel = Ext.create('Ext.panel.Panel', {
			itemId : 'actionFilterPanel',
			cls : 'xn-filter-toolbar',
			hidden : true,
			flex : 0.8,
			layout : {
				type : 'vbox'
			},
			items : [{
						xtype : 'label',
						text : getLabel('status', 'Status'),
						cls : 'f13 ux_font-size14',
						flex : 1,
						padding : '6 0 0 5'
					}, {
						xtype : 'toolbar',
						itemId : 'paymentActionToolBar',
						cls : 'xn-toolbar-small',
						filterParamName : 'RequestState',
						padding : '6 0 0 5',
						width : '100%',
						border : false,
						componentCls : 'xn-btn-default-toolbar-small xn-custom-more-toolbar',
						items : [{
							text : getLabel('all', 'All'),
							code : 'all',
							btnId : 'allPaymentAction',
							cls : 'f13 xn-custom-heighlight',
							parent : this,
							handler : function(btn, opts) {
								this.parent.fireEvent('filterPaymentAction',
										btn, opts);
							}
						}]
					}]
		});
		parentPanel.add(statusPanel);
	},
	addDateMenuPanel : function(dateParentPanel) {
		var me = this;
		var dateMenuPanel = Ext.create('Ext.panel.Panel', {
			layout : 'hbox',
			items : [{
						xtype : 'label',
						itemId : 'dateLabel',
						text : getLabel('dateLatest', 'Date (Latest)'),
						cls : 'f13 ux_font-size14 ux_paddingtl'
					}, {
						xtype : 'button',
						border : 0,
						filterParamName : 'EntryDate',
						itemId : 'entryDate',
						cls: 'menu-disable xn-custom-arrow-button cursor_pointer ux_margint',
						glyph:'xf0d7@fontawesome',
						padding : '6 0 0 3',
						menu : Ext.create('Ext.menu.Menu', {
									items : [{
										text : getLabel('latest', 'Latest'),
										btnId : 'latest',
										parent : this,
										btnValue : '12',
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									}, {
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
		});
		dateParentPanel.add(dateMenuPanel);
	},
	addDateContainerPanel : function(dateParentPanel) {
		var me = this;
		var dateContainerPanel = Ext.create('Ext.panel.Panel', {
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
							width : 70,
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
						padding : '0 0 0 1',
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
	addPaymentTypePanel: function(parentPanel) {
	    var me = this;
	    var paymentTypePanel = Ext.create('Ext.panel.Panel', {
	        cls: 'xn-filter-toolbar',
	        flex: 0.6,
	        layout: {
	            type: 'vbox'
	        },
	        items: [{
	            xtype: 'label',
	            text: getLabel('paymentType', 'Payment Types'),
	            cls: 'f13 ux_payment-type',
	            flex: 1
	        }, {
	            xtype: 'toolbar',
	            padding: '6 0 0 10',
	            itemId: 'paymentTypeToolBar',
	            cls: 'xn-toolbar-small',
	            filterParamName: getLabel('instrumentType',
	                'InstrumentType'),
	            width: '100%',
	            border: false,
	            componentCls: 'xn-btn-default-toolbar-small xn-custom-more-toolbar',
	            items: [{
	                text: getLabel('all', 'All'),
	                code: 'all',
	                btnId: 'allPaymentType',
	                btnDesc: 'All',
	                parent: this,
	                cls: 'f13 xn-custom-heighlight',
	                listeners: {
	                    'change': function(combo, newValue, oldValue, eOpts) {
	                        me.fireEvent('handlePaymentTypeClick', combo,
	                        		eOpts);
	                    }
	                }


	            }]
	        }]
	    });
	    parentPanel.add(paymentTypePanel);
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
					text : getLabel('moreText', 'more')
							+ '&nbsp;>>',
					itemId : 'AdvMoreBtn',
					width : 48,
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
	loadPaymentTypes : function(arrInstrumentType, strSelectedType) {
		var me = this;
		var arrPaymentTypes = (arrInstrumentType || []);
		var objTbar = me.down('toolbar[itemId="paymentTypeToolBar"]'), btnAll = null, objType = null, strCls = '';
		var moreMenu = me
				.down('toolbar[itemId="paymentTypeToolBar"] button[itemId="moreMenuBtn"]');
		var arrItem;
		if (!Ext.isEmpty(objTbar)) {
			var tbarItems = (objTbar.items || []);
			// remove the items
			if (tbarItems.length > 0)
				tbarItems.each(function(item, index, length) {
							if (index > 0)
								objTbar.remove(item);
						});
			var countlength = 0;
			if (arrPaymentTypes.length > 2)
				countlength = 2;
			else
				countlength = arrPaymentTypes.length;
			for (var i = 0; i < countlength; i++) {
				strCls = '';
				objType = arrPaymentTypes[i];
				btnAll = objTbar.down('button[btnId="allPaymentType"]');
				if (strSelectedType !== 'all'
						&& strSelectedType === objType.instTypeCode) {
					if (btnAll)
						btnAll.removeCls('xn-custom-heighlight');
					strCls = 'xn-custom-heighlight';
				} else {
					if (btnAll)
						btnAll.addCls('xn-account-filter-btnmenu');
					strCls = 'xn-account-filter-btnmenu';
				}
				objTbar.add({
							text : Ext.util.Format.ellipsis(
									objType.instTypeDescription, 6),
							btnId : objType.instTypeDescription,
							code : objType.instTypeCode,
							btnDesc : objType.instTypeDescription,
							tooltip : objType.instTypeDescription,
							cls : strCls,
							handler : function(btn, opts) {
								me.dohandlePaymentTypeClick(btn);
								me.fireEvent('handlePaymentTypeClick', btn);
							}
						});
			}
			if (arrPaymentTypes.length > 2) {
				arrItem = new Array();
				for (var i = 2; i < arrPaymentTypes.length; i++) {
					objType = arrPaymentTypes[i];
					arrItem.push({
								text : objType.instTypeDescription,
								btnId : objType.instTypeDescription,
								code : objType.instTypeCode,
								btnDesc : objType.instTypeDescription,
								handler : function(btn, opts) {
									me.dohandlePaymentTypeClick(btn);
									me.fireEvent('handlePaymentTypeClick', btn);
								}
							});
				}
				var imgItem = Ext.create('Ext.Img', {
							src : 'static/images/icons/icon_spacer.gif',
							height : 16,
							padding : '0 3 0 3',
							cls : 'ux_hide-image'
						});
				var item = Ext.create('Ext.Button', {
					itemId : 'moreMenuBtn',
					cls : 'cursor_pointer xn-account-filter-btnmenu xn-btnmenu-no-icon',
					padding : '0 0 3 0',
					menuAlign : 'tr-br',
					textAlign : 'right',
					text : getLabel('moreText', 'more')
							+ '&nbsp;>>',
					menu : Ext.create('Ext.menu.Menu', {
								items : arrItem
							})
				});
				objTbar.insert(4, imgItem);
				objTbar.insert(5, item);
			}
		}
	},
	dohandlePaymentTypeClick : function(btn) {
		var me = this;
		var objTbar = me.down('toolbar[itemId="paymentTypeToolBar"]');
		var moreMenu = me
				.down('toolbar[itemId="paymentTypeToolBar"] button[itemId="moreMenuBtn"]');
		if (objTbar)
			objTbar.items.each(function(item) {
						item.removeCls('xn-custom-heighlight');
						item.addCls('xn-account-filter-btnmenu');
					});

		if (!Ext.isEmpty(moreMenu)) {
			moreMenu.menu.items.each(function(item) {
						item.removeCls('xn-custom-heighlight');
						item.addCls('xn-account-filter-btnmenu');
					});
		}
		btn.addCls('xn-custom-heighlight xn-account-filter-btnmenu');

		var objToolbar = me.down('toolbar[itemId="advFilterActionToolBar"]');
		objToolbar.items.each(function(item) {
					item.removeCls('xn-custom-heighlight');
				});
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
							.down('recAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] recCreateNewAdvFilter[itemId=stdViewAdvFilter]');
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
			case '12' :
				// Latest
				fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
				fieldValue2 = fieldValue1;
				operator = 'lt';
				break;
		}
		retObj.fieldValue1 = fieldValue1;
		retObj.fieldValue2 = fieldValue2;
		retObj.operator = operator;
		return retObj;
	}
});