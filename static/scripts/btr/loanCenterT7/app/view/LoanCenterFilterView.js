Ext.define( 'GCP.view.LoanCenterFilterView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'loanCenterFilterViewType',
	requires :  ['Ext.panel.Panel', 'Ext.form.Label', 'Ext.menu.Menu',
			'Ext.form.field.Date', 'Ext.picker.Date',
			'Ext.container.Container', 'Ext.toolbar.Toolbar',
			'Ext.button.Button'],	
	layout :'vbox',
	initComponent : function()
	{
		var me = this;
		var strAppDate = dtApplicationDate;
		var dtFormat = strExtApplicationDateFormat;
		var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
		
		loanCenterView = this;
		
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
		
		this.items =
		[
					{
						xtype : 'container',
						itemId : 'filterClientMenuContainer',
						width : '25%',
						padding : '0 30 0 0',
						layout : {
							type : 'vbox'
						},
						hidden : ((clientStore.getCount() < 2) || !isClientUser()) ? true : false,
						items : [{
							xtype : 'label',
							text : getLabel('lblcompany', 'Company Name')
						}, {
							xtype : 'combo',
							valueField : 'CODE',
							displayField : 'DESCR',
							queryMode : 'local',
							editable : false,
							itemId : 'clientBtn',							
							width : '100%',
							padding : '-4 0 0 0',
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
						}]
					
					},
				{
					xtype : 'container',
					itemId : 'filterContainer',
					layout : 'hbox',
					width:'100%',
					items : [
								{
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
												triggerBaseCls : 'xn-form-trigger',
												width : '100%',
												padding : '-4 0 0 0',
												queryMode : 'local',
												editable : false,
												triggerAction : 'all',
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
								
								},					         
								{
									xtype : 'container',
									itemId : 'filterClientAutoCmplterCnt',
									layout :  'vbox',
									width:'25%',						
									padding : '0 30 0 0',
									hidden :(isClientUser()) ? true : false,
									items : [{
										xtype : 'label',
										text : getLabel("Client", "Client"),
										margin : '0 0 0 6'
									}, {
										xtype : 'AutoCompleter',
										padding : '-4 0 0 0',
										width : '100%',
										triggerBaseCls : 'xn-form-trigger',
										itemId : 'clientAutoCompleter',
										cfgTplCls : 'xn-autocompleter-t7',
										name : 'clientAutoCompleter',
										cfgUrl : 'services/userseek/userclients.json',
										cfgRecordCount : -1,
										cfgRootNode : 'd.preferences',
										cfgDataNode1 : 'DESCR',
										enableQueryParam:false,
										cfgKeyNode : 'CODE',
										//value : strClient,
										cfgQueryParamName : '$autofilter',
										listeners : {
											'select' : function(combo, record) {
												strClient = combo.getValue();
												strClientDescr = combo.getRawValue();
												me.fireEvent('handleClientChange',
																		strClient, strClientDescr);
											},
											'change' : function(combo, newValue, oldValue, eOpts) {
												if (Ext.isEmpty(newValue)) {
													me.fireEvent('handleClientChange');
												}
											},
											'render':function(combo){
												combo.listConfig.width = 200;
											}
										}
									}]
								},
								{
									xtype : 'container',
									layout : 'vbox',
									width : '40%',
									padding : '0 0 0 0',
									items :
									[{
											xtype : 'panel',
											layout : 'hbox',
											height: 23,
											items :
											[{
													xtype : 'label',
													itemId : 'requestDateLabelItemId',
													text : 'Request Date (Date Range)',													
													padding : '0 0 12 6'
											},{
													xtype : 'button',
													border : 0,
													filterParamName : 'requestDate',
													itemId : 'requestDateItemId',// Required
													cls : 'ui-caret-dropdown',
													listeners : {
													click:function(event){
															var menus = me.createDateFilterMenu("entryDateQuickFilter",this);
															var xy = event.getXY();
															menus.showAt(xy[0],xy[1]+16);
															event.menu = menus;
														}
													}
													
											}]
									 },
									 {
											xtype : 'container',
											layout : 'hbox',
											width : '90%',
											items :[
													 {
															xtype : 'component',															
															itemId : 'loanCenterEntryDataPicker',
															//height : 40,
															filterParamName : 'EntryDate',
															html :'<input type="text"  id="entryDataPicker" class="ft-datepicker from-date-range ui-datepicker-range-alignment">'
													 },
													 {
															xtype : 'component',
															cls : 'icon-calendar',
															margin : '1 0 0 0',
															html : '<span class=""><i class="fa fa-calendar"></i></span>'
													 }]									 
									 }]
						}]
				}];		
		me.on('afterrender', function(panel) {
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
					var clientBtn = me.down('combo[itemId="clientBtn"]');
					if (clientBtn)
						clientBtn.setRawValue(getLabel('allCompanies', 'All companies'));
					if(!Ext.isEmpty(strClientDescr))		
						clientBtn.setRawValue(strClientDescr);
				});
		this.callParent( arguments );
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
	checkInfinity : function(intFilterDays)
	{
		if( Ext.isEmpty(intFilterDays))
			{ 
				return true;
			}		
	},
	createDateFilterMenu : function(filterType,buttonIns) {
		var me = this;
		var menu = null;
		var arrMenuItem = [];

		arrMenuItem.push({
			text : getLabel('latest', 'Latest'),
			btnId : 'btnLatest',
			btnValue : '12',
			parent : this,
			handler : function(btn, opts) {
				me.doResetInformatinFilter();
				$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
			}
		});
		if (intFilterDays >= 1 || me.checkInfinity(intFilterDays))
		{
			arrMenuItem.push({
						text : getLabel('today', 'Today'),
						btnId : 'btnToday',
						btnValue : '1',
						parent : this,
						handler : function(btn, opts) {
							me.doResetInformatinFilter();
							$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
						}
					});
		}
		if (intFilterDays >= 2 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('yesterday', 'Yesterday'),
						btnId : 'btnYesterday',
						btnValue : '2',
						parent : this,
						handler : function(btn, opts) {
							me.doResetInformatinFilter();
							$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
						}
					});
		if (intFilterDays >= 7 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('thisweek', 'This Week'),
						btnId : 'btnThisweek',
						btnValue : '3',
						parent : this,
						handler : function(btn, opts) {
							me.doResetInformatinFilter();
							$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
						}
					});
		if (intFilterDays >= 14 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastweektodate', 'Last Week To Date'),
						btnId : 'btnLastweek',
						parent : this,
						btnValue : '4',
						handler : function(btn, opts) {
							me.doResetInformatinFilter();
							$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
						}
					});
		if (intFilterDays >= 30 || me.checkInfinity(intFilterDays))
		{
			arrMenuItem.push({
						text : getLabel('thismonth', 'This Month'),
						btnId : 'btnThismonth',
						parent : this,
						btnValue : '5',
						handler : function(btn, opts) {
							me.doResetInformatinFilter();
							$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
						}
					});
		}
		if (intFilterDays >= 60 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastMonthToDate', 'Last Month To Date'),
						btnId : 'btnLastmonth',
						btnValue : '6',
						parent : this,
						handler : function(btn, opts) {
							me.doResetInformatinFilter();
							$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
						}
					});
		if (lastMonthOnlyFilter=== true || me.checkInfinity(intFilterDays))
		{
			arrMenuItem.push({
						text : getLabel('lastmonthonly', 'Last Month Only'),
						btnId : 'btnLastmonthonly',
						parent : this,
						btnValue : '14',
						handler : function(btn, opts) {
							me.doResetInformatinFilter();
							$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
						}
					});
		}
		if (intFilterDays >= 90 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('thisquarter', 'This Quarter'),
						btnId : 'btnLastMonthToDate',
						btnValue : '8',
						parent : this,
						handler : function(btn, opts) {
							me.doResetInformatinFilter();
							$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
						}
					});
		if (intFilterDays >= 180 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastQuarterToDate',
								'Last Quarter To Date'),
						btnId : 'btnQuarterToDate',
						btnValue : '9',
						parent : this,
						handler : function(btn, opts) {
							me.doResetInformatinFilter();
							$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
						}
					});
		if (intFilterDays >= 365 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('thisyear', 'This Year'),
						btnId : 'btnLastQuarterToDate',
						btnValue : '10',
						parent : this,
						handler : function(btn, opts) {
							me.doResetInformatinFilter();
							$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
						}
					});
		if (intFilterDays >= 730 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastyeartodate', 'Last Year To Date'),
						btnId : 'btnYearToDate',
						parent : this,
						btnValue : '11',
						handler : function(btn, opts) {
							me.doResetInformatinFilter();
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
		var strUrl = isSiTabSelected == 'Y' ? 'userfilterslist/loanCenterSiAdvFltr.srvc?'
					: 'userfilterslist/loanCenterTxnAdvFltr.srvc?';		
		var myStore = new Ext.data.ArrayStore({
					autoLoad : true,
					fields : ['filterName'],
					proxy : {
						type : 'ajax',
						url : strUrl,
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
	},
	populateClientMenu : function(data) {
		var me = this;
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
						me.clientCode = btn.code;
						me.fireEvent('handleClientChange', btn.code,
								btn.btnDesc,'');
					}
				});

		Ext.each(clientArray, function(client) {
					if(client.CODE === strClientCode && 'undefined' != client.CODE)
						strClientDesc = client.DESCR;
					clientMenu.push({
								text : client.DESCR,
								CODE : client.CODE,
								DESCR : client.DESCR,
								handler : function(btn, opts) {
									clientBtn.setText(btn.text);
									me.clientCode = btn.CODE;
									me.fireEvent('handleClientChange',
											btn.CODE, btn.DESCR,'');
								}
							});
				});
		if (null != clientArray && clientArray.length <= 1) {
			filterClientMenuContainer.hide();
		}
		else{
		clientBtn.getStore().loadData(clientMenu);
		}

	}

} );
