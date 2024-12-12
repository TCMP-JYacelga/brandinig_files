Ext.define('GCP.view.PaymentInstQueryFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'paymentInstQueryFilterView',
	requires : [ 'Ext.panel.Panel', 'Ext.ux.gcp.AutoCompleter', 'Ext.data.Store', 'Ext.form.Label', 'Ext.form.field.ComboBox',
			'Ext.layout.container.VBox', 'Ext.layout.container.HBox', 'Ext.toolbar.Toolbar', 'Ext.button.Button' ],	
	width : '100%',
	margin : '0 0 10 0',
	componentCls : 'gradiant_back',
	collapsible : true,
	collapsed : true,
	cls : 'xn-ribbon ux_border-bottom',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	title : getLabel('filterBy', 'Filter By: ') + '<img id=\'imgFilterInfoStdView\' class=\'largepadding icon-information\'/>',
	statusCode : null,
	statusDesc : null,
	tools : [ {
		xtype : 'container',
		padding : '0 9 0 0',
		layout : 'hbox',
		items : [ ]
	} ],
	initComponent : function() {
		var me = this;
		var arrItems = [], panel = null;
		panel = me.createFilterUpperPanel();
		arrItems.push(panel);
		panel = me.createFilterLowerPanel();
		arrItems.push(panel);
		me.items = arrItems;
		me.callParent(arguments);
	},
	createFilterUpperPanel : function() {
		var me = this;
		var fieldFI = me.createFICombo();
		var fieldClient = me.createClientAutocompleter();
		var requestDateFilter = me.createDateFilterPanel();
		var createInstrumenNumber =me.createInstrumenNumber();
		var parentPanel = Ext.create('Ext.panel.Panel', {
			layout : 'hbox',
			itemId : 'filterUpperPanel',
			cls : 'ux_normalpadding-top',
			margin : '0 0 0 30',
			items : [ fieldFI, fieldClient, requestDateFilter,createInstrumenNumber]
		});
		return parentPanel;
	},
	
	createFilterLowerPanel : function() {
		var me = this;
		var btnAdvFilter = me.createAdvanceFilter();
		var btnSearch = me.createSearchBtn();
		var parentPanel = Ext.create('Ext.panel.Panel', {
					layout : 'hbox',
					itemId : 'filterLowerPanel',
					cls : 'ux_normalpaddingtb',
					width : '100%',
					items : [btnAdvFilter,btnSearch]
				});
		return parentPanel;
	},
	createFICombo : function() {
		var me = this;
		var storeData = null;
		var isMultipleSellerAvailable = false;
		Ext.Ajax.request({
			url : 'services/userseek/adminSellersListCommon.json',
			method : 'POST',
			async : false,
			success : function(response) {
				var data = Ext.decode(response.responseText);
				var sellerData = data.d.preferences;
				if (!Ext.isEmpty(data)) {
					storeData = sellerData;
				}
			},
			failure : function(response) {
			}
		});
		var objStore = Ext.create('Ext.data.Store', {
			fields : [ 'CODE', 'DESCR' ],
			data : storeData,
			reader : {
				type : 'json',
				root : 'd.preferences'
			}
		});
		if (objStore.getCount() > 1) {
			isMultipleSellerAvailable = true;
		}
		var fiComboPanel = Ext.create('Ext.panel.Panel', {
			cls : 'xn-filter-toolbar',
			width : '25%',
			layout : {
				type : 'vbox'
			},
			hidden : !isMultipleSellerAvailable,
			items : [ {
				xtype : 'label',
				text : getLabel('lblfinancialinstitution', 'Financial Institution'),
				cls : 'ux_payment-type',
				flex : 1,
				padding : '6 0 0 8'
			}, {
				xtype : 'combobox',
				padding : '5 10 0 0',
				margin : '0 0 0 10',
				width : 160,
				fieldCls : 'xn-form-field inline_block x-trigger-noedit',
				triggerBaseCls : 'xn-form-trigger',
				filterParamName : 'seller',
				editable : false,
				name : 'sellerCombo',
				itemId : 'paymentInstQuerySellerId',
				displayField : 'DESCR',
				valueField : 'CODE',
				queryMode : 'local',
				store : objStore,
				value : strSeller,
				listeners : {
					'change' : function(combo, strNewValue, strOldValue) {
						setAdminSeller(combo.getValue());
						me.setSellerToClientAutoCompleterUrl();
					}
				}
			} ]
		});
		var fiCombo = fiComboPanel.down('combobox[itemId=\'paymentInstQuerySellerId\']');
		if (Ext.isEmpty(strSeller)) {
			fiCombo.suspendEvents();
			fiCombo.select(fiCombo.getStore().getAt(0));
			fiCombo.resumeEvents();
		}
		return fiComboPanel;
	},
	createClientAutocompleter : function() {
		var me = this;
		var clientPanel = Ext.create('Ext.panel.Panel', {
			cls : 'xn-filter-toolbar',
			width : '25%',
			layout : {
				type : 'vbox'
			},
			items : [ {
				xtype : 'label',
				text : getLabel('companyName', 'Company Name'),
				cls : 'f13 ux_font-size14',
				padding : '3.5 0 0 11'
			}, {
				xtype : 'AutoCompleter',
				padding : '6 0 0 2',
				margin : '4 0 0 10',
				matchFieldWidth : true,
				cls : 'autoCmplete-field',
				fieldCls : 'w14 xn-form-text xn-suggestion-box',
				labelSeparator : '',
				name : 'client',
				itemId : 'bankProcessingQueueClientId',
				cfgUrl : 'services/userseek/BankProcessingQueueClient.json',
				cfgQueryParamName : '$autofilter',
				cfgRecordCount : -1,
				cfgSeekId : 'clientSeek',
				cfgRootNode : 'd.preferences',
				value : strClientDesc,
				cfgKeyNode : 'DESCR',
				cfgDataNode1 : 'DESCR',
				listeners : {
					'render' : function(combo, eOpts) {
						if (!Ext.isEmpty(strClient) && !Ext.isEmpty(strClientDesc)) {
							combo.store.loadRawData({
								'd' : {
									'preferences' : [ {
										'CODE' : strClient,
										'DESCR' : strClientDesc
									} ]
								}
							});
							combo.suspendEvents();
							combo.setValue(strClient);
							combo.resumeEvents();
						}
						me.setSellerToClientAutoCompleterUrl();
					}
				}
			} ]
		});
		return clientPanel;
	},
	createSearchBtn : function() {
		var me = this;
		var searchBtnPanel = Ext.create('Ext.toolbar.Toolbar', {
			cls : 'xn-filter-toolbar',
			//margin : '15 0 0 0',
			flex : 0.04,
			items : [{
				xtype : 'button',
				itemId : 'filterBtnId',
				text : getLabel('search', 'Search'),
				cls : 'xn-btn ux-button-s',
				listeners : {
					'click' : function(btn, e, eOpts) {
						me.handleQuickFilterChange();
					}
				}
			}]
		});
		return searchBtnPanel;
	},
	createAdvanceFilter : function() {
	    var me = this;
		var advanceFilterPanel = Ext.create('Ext.panel.Panel', {
			itemId : 'advFilterPanel',
			cls : 'xn-filter-toolbar',			
			flex : 0.23,
			margin : '0 0 20 750',
			layout : {
				type : 'vbox'
			},
			items : [
					{
						xtype : 'panel',
						cls : 'ux_paddingtl',
						layout : {
							type : 'hbox'
						},
						items : [
								{
									xtype : 'label',
									text : getLabel('advFilters', 'Advanced Filters'),
									cls : 'f13 ux_font-size14'
								},
								{
									xtype : 'image',
									src : 'static/images/icons/icon_spacer.gif',
									height : 18,
									padding : '5 0 0 9',
									cls : 'ux_hide-image'
								},
								{
									xtype : 'button',
									itemId : 'newFilter',
									text : '<span class=\'button_underline thePointer\'>'
											+ getLabel('createNewFilter', 'Create New Filter') + '</span>',
									cls : 'xn-account-filter-btnmenu xn-small-button',
									margin : '0 0 0 10'
								},{
                                    xtype : 'image',
                                    src : 'static/images/icons/icon_spacer.gif',
                                    height : 18
                                }, {
                                    xtype : 'button',
                                    itemId : 'btnClearAdvFilter',
                                    text : getLabel('clearAdvFilter','Clear Filter'),
                                    cls : 'xn-account-filter-btnmenu xn-small-button',
                                    disabled : true,
                                    listeners : {
                                        'click' : function(btn, e, eOpts) {
                                            me.handleClearAdvFilter();
                                        }
                                    }
                                }]
					}, {
						xtype : 'toolbar',
						itemId : 'advFilterActionToolBar',
						cls : 'xn-toolbar-small',
						padding : '5 0 0 1',
						width : '100%',
						enableOverflow : true,
						border : false,
						items : []

					} ]
		});
		return advanceFilterPanel;
	},
	getQuickFilterJSON : function(selectedQueue) {
		var me = this;
		var filterJson = {};
		var field = null, strValue = null;
		field = me.down('combobox[itemId=\'paymentInstQuerySellerId\']');
		strValue = field ? field.getValue() : '';
		filterJson['sellerCode'] = strValue;
		field = me.down('combobox[itemId=\'bankProcessingQueueClientId\']');
		strValue = field ? field.getValue() : '';
		filterJson['clientCode'] = strValue;
		strValue = field ? field.getRawValue() : '';
		filterJson['clientDesc'] = strValue;
		filterJson['creationDate'] = selectedEntryDate ? selectedEntryDate : '' ;
		filterJson['queueType'] = selectedQueue;
		field = me.down('textfield[itemId="cwInstNmbrFilterItemId"]');
		strValue = field ? field.getValue() : '';
		filterJson['cwInstNmbr'] = strValue;
		return filterJson;
	},
	handleQuickFilterChange : function() {
		var me = this;
		me.fireEvent('quickFilterChange', me.getQuickFilterJSON());
	},
	setSellerToClientAutoCompleterUrl : function() {
		var me = this;
		var sellerCombo = me.down('combobox[itemId=\'paymentInstQuerySellerId\']');
		var seller = sellerCombo.getValue();
		var clientautoComplter = me.down('combobox[itemId=\'bankProcessingQueueClientId\']');
		clientautoComplter.reset();
		clientautoComplter.cfgExtraParams = [ {
			key : '$filtercode1',
			value : seller
		} ];
	},
	addAllSavedFilterCodeToView : function(arrFilters) {
		var me = this;
		var objToolbar = me.down('toolbar[itemId=\'advFilterActionToolBar\']');
		var arrTBarItems = [], item = null;
		if (objToolbar) {
			if (objToolbar.items && objToolbar.items.length > 0) {
				objToolbar.removeAll();
			}
			if (arrFilters && arrFilters.length > 0) {
				for (var i = 0; i < 5; i++) {
					if (arrFilters[i]) {
						item = Ext.create('Ext.Button', {
							cls : 'cursor_pointer xn-account-filter-btnmenu',
							text : Ext.util.Format.ellipsis(arrFilters[i], 11),
							itemId : arrFilters[i],
							tooltip : arrFilters[i],
							handler : function(btn, opts) {
								var objToolbar = me.down('toolbar[itemId=\'advFilterActionToolBar\']');
								objToolbar.items.each(function(item) {
									item.removeCls('xn-custom-heighlight');
								});
								btn.addCls('xn-custom-heighlight');
								me.fireEvent('handleSavedFilterItemClick', btn.itemId, btn, true);
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
					padding : '2 0 0 0',
					handler : function(btn, opts) {
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
		var objToolbar = me.down('toolbar[itemId=\'advFilterActionToolBar\']');
		if (objToolbar) {
			objToolbar.items.each(function(item) {
				item.removeCls('xn-custom-heighlight');
				if (item.itemId === strFilterCode) {
					item.addCls('xn-custom-heighlight');
				}
			});
		}
	}, handleClearAdvFilter : function() {
        var me = this;
        me.fireEvent('clearAdvFilter', me.getQuickFilterJSON());

    }, createDateFilterPanel : function() {
        var me = this;
        var dateMenuPanel = Ext.create('Ext.container.Container', {
            padding : '5px 0 0 0px',
            itemId : 'creationDateFilterContainer',
            layout : 'vbox',
            width : '25%',
            items : [
                {
                xtype : 'panel',
                itemId : 'creationDatePanel',
                layout : 'hbox',
                items : [
                    {
                    xtype : 'label',
                    itemId : 'creationDateFilterLabel',
                    cls : 'f13 ux_font-size14',
                    text : getLabel('creationDateFilter', 'Creation Date')
                    }, {
                    xtype : 'button',
                    border : 0,
                    filterParamName : 'creationDate',
                    itemId : 'requestDateBtn',
                    cls : 'menu-disable xn-custom-arrow-button cursor_pointer',
                    glyph : 'xf0d7@fontawesome',
                    listeners : {
                        click : function(event) {
                            var menus=me.getDateDropDownItems("creationDateFilter",this);
                            var xy = event.getXY();
                            menus.showAt(xy[0], xy[1] + 16);
                            event.menu = menus;
                            // event.removeCls('ui-caret-dropdown'),
                            // event.addCls('action-down-hover');
                        }
                    }
                }]
            },
            me.addDateContainerPanel()
            ]
        });
        return dateMenuPanel;
    }, addDateContainerPanel : function() {
        var me = this;
        var dateContainerPanel = Ext.create('Ext.container.Container', {
            layout : 'hbox',
            itemId : 'creationDateFilterContainer',
            width : '80%',
            items : [{
                xtype : 'component',
                width : '70%',
                itemId : 'paymentRequestDataPicker',
                filterParamName : 'EntryDate',
                html : '<input type="text"  id="creationDateFilterPicker" class="ft-datepicker from-date-range ui-datepicker-range-alignment">'
                }, {
                    xtype : 'component',
                    cls : 'icon-calendar',
                    margin : '0 0 0 0',
                    html : '<span class=""><i class="fa fa-calendar"></i></span>'
                }]
        });
       return dateContainerPanel;
    },
    getDateDropDownItems : function(filterType,buttonIns)
    {
        var me = this;
        var arrMenuItem = [];
        arrMenuItem.push({
            btnId : 'latest',
            btnValue : '12',
            text : getDateIndexLabel('12'),
            handler : function(btn, opts) {
                $(document).trigger("filterDateChange",[filterType,btn,opts]);
            }
        });
        arrMenuItem.push({
            btnId : 'btnToday',
            btnValue : '1',
            text : getDateIndexLabel('1'),
            handler : function(btn, opts) {
                $(document).trigger("filterDateChange",[filterType,btn,opts]);
            }
        });
        arrMenuItem.push({
            btnId : 'btnYesterday',
            btnValue : '2',
            text : getDateIndexLabel('2'),
            handler : function(btn, opts) {
                $(document).trigger("filterDateChange",[filterType,btn,opts]);
            }
        });
        arrMenuItem.push({
            btnId : 'btnThisweek',
            btnValue : '3',
            text : getDateIndexLabel('3'),
            handler : function(btn, opts) {
                $(document).trigger("filterDateChange",[filterType,btn,opts]);
            }
        });
        arrMenuItem.push({
            btnId : 'btnLastweek',
            btnValue : '4',
            text : getDateIndexLabel('4'),
            handler : function(btn, opts) {
                $(document).trigger("filterDateChange",[filterType,btn,opts]);
            }
        });
        arrMenuItem.push({
            btnId : 'btnThismonth',
            btnValue : '5',
            text : getDateIndexLabel('5'),
            handler : function(btn, opts) {
                $(document).trigger("filterDateChange",[filterType,btn,opts]);
            }
        });
        arrMenuItem.push({
            btnId : 'btnLastmonth',
            btnValue : '6',
            text : getDateIndexLabel('6'),
            handler : function(btn, opts) {
                $(document).trigger("filterDateChange",[filterType,btn,opts]);
            }
        });
        arrMenuItem.push({
            btnId : 'btnLastMonthToDate',
            btnValue : '8',
            text : getDateIndexLabel('8'),
            handler : function(btn, opts) {
                $(document).trigger("filterDateChange",[filterType,btn,opts]);
            }
        });
        arrMenuItem.push({
            btnId : 'btnQuarterToDate',
            btnValue : '9',
            text : getDateIndexLabel('9'),
            handler : function(btn, opts) {
                $(document).trigger("filterDateChange",[filterType,btn,opts]);
            }
        });
        arrMenuItem.push( {
            btnId : 'btnLastQuarterToDate',
            btnValue : '10',
            text : getDateIndexLabel('10'),
            handler : function(btn, opts) {
                $(document).trigger("filterDateChange",[filterType,btn,opts]);
            }
        });
        arrMenuItem.push({
            btnId : 'btnYearToDate',
            btnValue : '11',
            text : getDateIndexLabel('11'),
            handler : function(btn, opts) {
                $(document).trigger("filterDateChange",[filterType,btn,opts]);
            }
        });
        var dropdownMenu = Ext.create('Ext.menu.Menu', {
            itemId : 'DateMenu',
            cls : 'ext-dropdown-menu',
            items : arrMenuItem
        });
        return dropdownMenu;
    },
    createInstrumenNumber :function(){
        var createInstrumenNumber = Ext.create('Ext.panel.Panel', {
            cls : 'xn-filter-toolbar',
            width : '25%',
            layout : {
                type : 'vbox'
            },
            items :[{
                xtype : 'label',
                text : getLabel('instnmbr', 'Instrument Number'),
                cls : 'f13 ux_font-size14',
            },{
                xtype : 'textfield',
                itemId : 'cwInstNmbrFilterItemId',
                width : 200,
                margin : '4 0 0 0',
                fieldCls : 'xn-valign-middle xn-form-text w10_5',
                labelCls : 'frmLabel',
                layout : 'hbox',  
                labelSeparator : ''
            }]
         });
        return createInstrumenNumber;
     }
});
