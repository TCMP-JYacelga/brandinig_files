Ext.define('GCP.view.UserActivityFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'userActivityFilterView',
	requires : [],
	width : '100%',
	margin : '0 0 10 0',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	padding: 10,
	initComponent : function() {
		var me = this;
		prfUserActivity=me;
		var storeData;
		
		var clientStore = Ext.create('Ext.data.Store', {
					fields : ['CODE', 'DESCR']
				});
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
				// console.log("Ajax Get data Call Failed");
			}
		});
		var comboSellerStore = Ext.create('Ext.data.Store', {
			fields : ['CODE', 'DESCR'],
			data : storeData,
			reader : {
				type : 'json',
				root : 'preferences'
			}
		});		
				
		me.on('afterrender', function(panel) {
			Ext.Ajax.request({
						url : 'services/userseek/userclients.json',
						method : "POST",
						params:{$sellerCode:strSellerId},
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
        	
			var clientBtn = me.down('combo[itemId="clientBtn"]');
			// Set Default Text When Page Loads
			
			if (clientBtn)
					clientBtn.setRawValue(getLabel('allCompanies', 'All companies'));
			if(!Ext.isEmpty(strClientDesc))		
					clientBtn.setRawValue(strClientDesc);
		});
		this.items = [{
			xtype : 'panel',			
			layout : 'hbox',
			items : [
			{
				xtype : 'container',
				layout : 'vbox',
				width : '20%',
				itemId : 'filterClientContainerWrapper',
				//columnWidth : 0.25,
				padding : '0 15 0 0',
				items : [
				         
				         {xtype : 'container',
								itemId : 'filterSellerContainer',
								layout : 'vbox',
								items : [
								{
									xtype : 'label',
									text : getLabel('lblSeller', 'Financial Institute'),
									cls : 'f13 ux_font-size14' 
								},
								{
									xtype : 'combo',
									fieldCls : 'xn-form-field inline_block ux_font-size14-normal ',
									valueField : 'CODE',
									displayField : 'DESCR',
									width: 175,
									editable : false,
									itemId : 'sellerCode_id',
									store : comboSellerStore,
									triggerAction : 'all',
									triggerBaseCls : 'xn-form-trigger',
									filterParamName : 'sellerCode',
									value : strSellerId,
									listeners : {
										'select' : function(combo, record) {
											var code = combo.getValue();
											setAdminSeller(code);
											me.fireEvent("handleSellerChange", code);
										}
									}
								}
								]
						},
						{xtype : 'container',
						itemId : 'filterClientMenuContainer',
						layout : 'vbox',
						hidden : !isClientUser(),
						items : [
						{
							xtype : 'label',
							text : getLabel('client', 'Company Name'),
							cls : 'f13 ux_font-size14' 
						},
						{
							xtype : 'combo',
							valueField : 'CODE',
							displayField : 'DESCR',
							hidden : !isClientUser(),
							queryMode : 'local',
							width: 175,
							editable : false,
							itemId : 'clientBtn',							
							text : getLabel('allCompanies', 'All Companies'),
							menuAlign : 'b',
							store : clientStore,
							triggerAction : 'all',
							triggerBaseCls : 'xn-form-trigger',
							listeners : {
								'select' : function(combo, record) {
									var code = combo.getValue();
									me.clientCode = code;
									me.fireEvent("handleClientChange", code, combo
													.getRawValue(), '');
								}
							}
						}
						]
				},
				{		xtype : 'container',						
						itemId : 'filterClientAutoContainer',
						layout : 'vbox',
						width: '100%',
						hidden : isClientUser(),
						items : [
						{
							xtype : 'label',
							text : getLabel('client', 'Company Name'),
							cls : 'f13 ux_font-size14' 
						},
						{
					xtype : 'AutoCompleter',
					fieldCls : 'xn-form-text w10 xn-suggestion-box',
					width : '175',
					itemId : 'clientAutoCompleter',
					name : 'clientAutoCompleter',
					hidden : isClientUser(),
					cfgUrl : 'services/userseek/userclients.json',
					enableQueryParam : false,
					cfgRecordCount : -1,
					cfgRootNode : 'd.preferences',
					cfgDataNode1 : 'DESCR',
					cfgKeyNode : 'CODE',
					cfgProxyMethodType : 'POST',
					//value : strClientId,
					cfgQueryParamName : '$autofilter',
					listeners : {
						'select' : function(combo, record) {
							strClientId = combo.getValue();
							strClientDesc = combo.getRawValue();
						},
						'change' : function(combo, newValue, oldValue, eOpts) {
							if(Ext.isEmpty(combo.getValue())){
								if (Ext.isEmpty(newValue)) {
										me.fireEvent('handleClientChange');
									}
							}
						},
						'render' : function(combo) {
							combo.store.loadRawData({
										"d" : {
											"preferences" : [{
														"CODE" : strClientId,
														"DESCR" : strClientDesc
													}]
										}
									});
							combo.listConfig.width = 200;
							combo.suspendEvents();
							combo.resumeEvents();
						}
					}
					}]
				}]
			},
			{
						xtype : 'panel',
						width : '20%',
						layout : 'vbox',
						padding: '0 15 0 0',
						items :
						[{
								xtype : 'panel',
								layout : 'hbox',
								height : 23,
								items :
								[{
										xtype : 'label',
										itemId : 'dateLabel',
										text : 'Date ',
										cls : 'f13 ux_payment-type'
								},{
										xtype : 'button',
										border : 0,
										filterParamName : 'loginDate',
										itemId : 'loginDate',
										cls : 'ui-caret',
										listeners : {
										click:function(event){
												var menus = me.createDateFilterMenu("entryDateQuickFilter",this);
												var xy = event.getXY();
												menus.showAt(xy[0],xy[1]+16);
												event.menu = menus;
											}
										}
										
								}]
						 },{
								xtype : 'component',
								//width: /*entityType != 0 ? '10em' : '14em'*/180,
								//padding : '6 0 0 0',
								itemId : 'userActivityEntryDataPicker',
								filterParamName : 'EntryDate',
								height: 24,
								width: 195,
								html :'<input type="text" style="width: 100%;" id="entryDataPicker" class="ft-datepicker ui-datepicker-range-alignment" style="padding-top: 0px !important;">'
						 }]
			},

			{
				xtype : 'container',
				layout : 'vbox',
				width : '20%',
				padding : '0 15 0 0',
				items : [{
					xtype : 'label',
					text : getLabel('userId', 'User Id'),
					cls : 'f13 ux_font-size14'
				}, {
					xtype : 'AutoCompleter',
					fieldCls : 'xn-form-text xn-suggestion-box',
					name : 'userDescription',
					itemId : 'userNameFltId',
					width : 175,
					enableQueryParam : false,
					cfgUrl : entityType == '1' ? 'services/userActivityMstSeek/userNamesListSeek.json' : 'services/userActivityMstSeek/userANamesListSeek.json',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgSeekId : 'userNamesList',
					cfgKeyNode : 'value',
					cfgRootNode : 'filterList',
					cfgDataNode1 : 'value',
					cfgDataNode2 : 'name',
					emptyText:getLabel('autoCompleterEmptyText', 'Enter Keyword or %'),
					cfgProxyMethodType : 'POST'
				}]
			},{
				xtype : 'container',
				itemId : 'bankusercontainer',
				layout : 'vbox',
				width : '10%',
				hidden : isClientUser(),
				items : [{
					xtype : 'label',
					text : getLabel('bankuser', 'Bank User'),
					width: '100%'
					},{
						xtype : 'checkbox',
						padding : '0 0 0 16',
						itemId:'bankUserCheckbox',
						checked:isBankUserChecked,
						handler:function(){
							me.fireEvent('handlebankuser');
						}
				}]
			},{
				xtype : 'container',
				itemId : 'savedFiltersContainer',
				layout : 'vbox',
				width : isClientUser() ? '25%' : '20%',
				items : [{
							xtype : 'label',
							itemId : 'savedFiltersLabel',
							text : getLabel('lblsavedFilters', 'Saved Filters')
						}, {
							xtype : 'combo',
							valueField : 'filterName',
							displayField : 'filterName',
							queryMode : 'local',
							editable : false,
							triggerAction : 'all',
							width: 175,
							itemId : 'savedFiltersCombo',
							mode : 'local',
							emptyText : getLabel('selectfilter','Select Filter'),
							store : me.savedFilterStore(),
							listeners:{
								'select':function(combo,record){
									me.fireEvent("handleSavedFilterItemClick",combo.getValue(),combo.getRawValue());
									}
							}
				 }]
			}]
		}

		];
		this.callParent(arguments);
	},populateClientMenu : function(data) {
		var me = this;
		//var clientMenu = me.down('menu[itemId="clientMenu"]');
		var clientMenu = [];
		var clientBtn = me.down('combo[itemId="clientBtn"]');
		var filterClientMenuContainer = me
				.down('container[itemId="filterClientMenuContainer"]');
		
		var clientArray = data.d.preferences || [];
		clientMenu.push({
					text : getLabel('allCompanies', 'All companies'),
					DESCR : getLabel('allCompanies', 'All companies'),
					CODE : 'all',
					handler : function(btn, opts) {
						clientBtn.setText(btn.text);
						me.clientCode = btn.CODE;
						me.fireEvent('handleClientChange', btn.CODE,
								btn.DESCR);
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
									me.fireEvent('handleClientChange',
											btn.CODE, btn.DESCR);
								}
							});
				});
		if (null != clientArray && clientArray.length <= 1) {
			filterClientMenuContainer.up('container[itemId="filterClientContainerWrapper"]').hide();
		}
		else{
		clientBtn.getStore().loadData(clientMenu);
		}

	},
		createDateFilterMenu : function(filterType,buttonIns) {
		var me = this;
		var menu = null;
		var arrMenuItem = [
				];

			arrMenuItem.push({
						text : getLabel('today', 'Today'),
						btnId : 'btnToday',
						btnValue : '1',
						parent : this,
						handler : function(btn, opts) {
							$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
						}
					});
		
			arrMenuItem.push({
						text : getLabel('yesterday', 'Yesterday'),
						btnId : 'btnYesterday',
						btnValue : '2',
						parent : this,
						handler : function(btn, opts) {
							$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
						}
					});
	
			arrMenuItem.push({
						text : getLabel('thisweek', 'This Week'),
						btnId : 'btnThisweek',
						btnValue : '3',
						parent : this,
						handler : function(btn, opts) {
							$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
						}
					});
	
			arrMenuItem.push({
						text : getLabel('lastweektodate', 'Last Week To Date'),
						btnId : 'btnLastweek',
						parent : this,
						btnValue : '4',
						handler : function(btn, opts) {
						$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
						}
					});
	
			arrMenuItem.push({
						text : getLabel('thismonth', 'This Month'),
						btnId : 'btnThismonth',
						parent : this,
						btnValue : '5',
						handler : function(btn, opts) {
							$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
						}
					});
	
			arrMenuItem.push({
						text : getLabel('lastMonthToDate', 'Last Month To Date'),
						btnId : 'btnLastmonth',
						btnValue : '6',
						parent : this,
						handler : function(btn, opts) {
							$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
						}
					});
	
			arrMenuItem.push({
						text : getLabel('thisquarter', 'This Quarter'),
						btnId : 'btnLastMonthToDate',
						btnValue : '8',
						parent : this,
						handler : function(btn, opts) {
							$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
						}
					});
	
			arrMenuItem.push({
						text : getLabel('lastQuarterToDate',
								'Last Quarter To Date'),
						btnId : 'btnQuarterToDate',
						btnValue : '9',
						parent : this,
						handler : function(btn, opts) {
							$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
						}
					});

			arrMenuItem.push({
						text : getLabel('thisyear', 'This Year'),
						btnId : 'btnLastQuarterToDate',
						btnValue : '10',
						parent : this,
						handler : function(btn, opts) {
							$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
						}
					});
	
			arrMenuItem.push({
						text : getLabel('lastyeartodate', 'Last Year To Date'),
						btnId : 'btnYearToDate',
						parent : this,
						btnValue : '11',
						handler : function(btn, opts) {
							$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
						}
					});
			var dropdownMenu = Ext.create('Ext.menu.Menu', {
				itemId : 'DateMenu',
				cls : 'ext-dropdown-menu',
				items : arrMenuItem,
				listeners : {
						hide:function(event) {
							this.addCls('ui-caret-dropdown');
							this.removeCls('action-down-hover');
						}
					}
			});
		
		return dropdownMenu;
		
	},
	savedFilterStore : function() {
		var myStore = new Ext.data.ArrayStore({
					autoLoad : true,
					fields : ['filterName'],
					proxy : {
						type : 'ajax',
						url : 'services/userfilterslist/userActivityFilter.srvc',
						headers: objHdrCsrfParams,
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
	}
	
});