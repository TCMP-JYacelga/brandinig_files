Ext.define( 'GCP.view.InstrumentInquiryFilterView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'instrumentInquiryFilterView',
	requires : [],
	width : '100%',
	layout :
	{
		type : 'vbox'
	},
	initComponent : function()
	{
		var me=this;
		
		var corporationStore = Ext.create('Ext.data.Store', {
			fields : ['CODE', 'DESCR']
		});
		Ext.Ajax.request({
					url : 'services/userseek/userclients.json',
					method : 'POST',
					async : false,
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var data = responseData.d.preferences;
						if (corporationStore) {
							corporationStore.removeAll();
							var count = data.length;
							if (count > 1) {
								corporationStore.add({
											'CODE' : 'all',
											'DESCR' : 'All Companies'
										});
							}
							for (var index = 0; index < count; index++) {
								var record = {
									'CODE' : data[index].CODE,
									'DESCR' : data[index].DESCR
								}
								corporationStore.add(record);
							}
						}
					},
					failure : function() {
					}
				});		
		
		if( corporationStore && corporationStore.data && corporationStore.data.items )
		{
			storeLength = corporationStore.data.items.length;
		}		
		
		this.items =
		[
		 {
				xtype : 'container',
				itemId : 'clientFiltersContainer',
				layout : 'vbox',
				width : '100%',
				hidden : storeLength > 1 ? false : true,
				flex : 1,
				items : [{
							xtype : 'label',
							itemId : 'clientFiltersLabel',
							text : 'Company Name',
							margin : '0 0 0 6'
						}, {
							xtype : 'combo',
							valueField : 'CODE',
							displayField : 'DESCR',
							queryMode : 'local',
							width : '25%',
							padding : '0 30 0 6',
							editable : false,
							triggerAction : 'all',
							itemId : 'clientFiltersCombo',
							mode : 'local',
							emptyText : getLabel('selectCompany', 'Select Company'),
							store : corporationStore,
							listeners : {
								'select' : function(combo, record) {
									me.fireEvent("handleClientChangeFilter", combo);
								},
								'boxready' : function(combo, width, height, eOpts) {
									combo.setValue(combo.getStore().getAt(0));
								}
							}
						}]
			},
			{
				xtype : 'container',
				itemId : 'savedFiltersContainer',
				layout : 'hbox',
				flex : 1,
				width : '100%',
				items : [
							 {
									xtype : 'container',
									itemId : 'savedFiltersContainer',
									layout : 'vbox',
									width : '25%',
									padding : '0 30 0 0',
									flex : 1,
									items : [{
												xtype : 'label',
												itemId : 'savedFiltersLabel',
												text : 'Saved Filters',
												margin : '0 0 0 6'
											}, {
												xtype : 'combo',
												valueField : 'filterName',
												displayField : 'filterName',
												queryMode : 'local',
												width : '100%',
												padding : '0 0 0 6',
												editable : false,
												triggerAction : 'all',
												itemId : 'savedFiltersCombo',
												mode : 'local',
												emptyText : getLabel('selectfilter', 'Select Filter'),
												store : me.savedFilterStore(),
												listeners : {
													'select' : function(combo, record) {
														me.fireEvent("handleSavedFilterItemClick",
																combo.getValue(), combo.getRawValue());
													}
												}
											}]
								},{
									xtype : 'container',
									itemId : 'instAccountContainer',
									layout : 'vbox',
									width : '25%',
									padding : '0 30 0 0',
									flex : 1,
									items : [{
												xtype : 'label',
												itemId : 'accountFiltersLabel',
												cls :"required",
												text : getLabel( 'lbldepacc', 'Deposit Account' )
											}, {
												xtype : 'combo',
												valueField : 'depositAccount',
												displayField : 'accountDescription',
												queryMode : 'local',
												width : '100%',
												editable : false,
												triggerAction : 'all',
												itemId : 'quickFilterAccountCombo',
												mode : 'local',
												emptyText : getLabel('selectclient', 'Select Account'),
												store : me.getAccountStore(),
												listeners : {
													'select' : function(combo, record) {
														me.fireEvent("handleAccountChangeInQuickFilter",
																combo);
													}
												}
											}]
								},{
									xtype : 'container',
									itemId : 'depositItemDateQuickContainer',
									layout : 'vbox',
								//	flex : 1,
									width : '50%',
									padding : '0 30 0 0',									
									items : [{
												xtype : 'panel',
												itemId : 'depositItemDateQuickPanel',
												layout : 'hbox',
												height : 23,
												width: '100%',
												items : [{
															xtype : 'label',
															itemId : 'dateLabel',
															text : 'Posting Date',
															//padding : '0 0 12 6',
															cls :"required"
														}/*, {
															xtype : 'button',
															border : 0,
															filterParamName : 'instrumentDate',
															itemId : 'instrumentDateItemId',
															cls : 'ui-caret-dropdown',
															listeners : {
																click : function(event) {
																	var menus = me.getDateDropDownItems(this);
																	var xy = event.getXY();
																	menus.showAt(xy[0], xy[1] + 16);
																	event.menu = menus;
																}
															}
														}*/]
											}, 
											{
												xtype : 'container',
												itemId : 'entryDateToContainer',
												layout : 'hbox',
												width : '50%',
												items : [{
													xtype : 'component',
													width : '84%',
													itemId : 'itemDatePickerQuick',
													filterParamName : 'depositDate',
													padding : '3 0 0 0',
													html : '<input type="text"  id="itemDatePickerQuickText" class="ft-datepicker from-date-range ui-datepicker-range-alignment">'
												},
												{
													xtype : 'component',
													cls : 'icon-calendar',
													margin : '4 0 0 0',
													html : '<span class=""><i class="fa fa-calendar"></i></span>'
												}]
											}											
											
											
											
											]
								}]
			}
		];
		this.callParent( arguments );
	},
	getAccountStore : function() {	
		var accountData = null;
		var objAccountStore = null;
		var strUrl = 'depositItemAccountList.srvc';			
		Ext.Ajax.request({
			url : strUrl + '?' + csrfTokenName + '=' + csrfTokenValue,
			async : false,
			method : "POST",
			success : function(response) {
				if (!Ext.isEmpty(response.responseText)) {
					var data = Ext.decode(response.responseText);
					if (data && data.d) {
						accountData = data.d.txnlist;						
						objAccountStore = Ext.create('Ext.data.Store', {
									fields : ['depositAccount', 'accountDescription'],
									data : accountData,
									reader : {
										type : 'json',
										root : 'd.txnlist'
									},
									autoLoad : true,
									listeners : {
										load : function() {
											this.insert(0, {
														accountId : 'all',
														depositAccount : getLabel('selectclient', 'Select Account')
													});
										}
									}
								});
						objAccountStore.load();
						setTimeout(function() {
							makeNiceSelect('depositAccount',true);
							$("#depositAccount").niceSelect('update');
						},50);
					}
				}
			},
			failure : function(response) {
			}
		});
		return objAccountStore;
	},
	getDateDropDownItems : function(buttonIns) {		
		var me = this;		
		var intFilterDays = filterDays ? filterDays : '';
		var arrMenuItem = [];
		
		/*arrMenuItem.push({
					text : getLabel('latest', 'Latest'),
					btnId : 'btnLatest',
					btnValue : '12',
					parent : this,
					handler : function(btn, opts) {
						this.parent.fireEvent('dateChange', btn, opts);
					}
				});*/
		arrMenuItem.push({
					text : getLabel('today', 'Today'),
					btnId : 'btnToday',
					btnValue : '1',
					parent : this,
					handler : function(btn, opts) {
						this.parent.fireEvent('dateChange', btn, opts);
					}
				});
		if (intFilterDays >= 2 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('yesterday', 'Yesterday'),
						btnId : 'btnYesterday',
						btnValue : '2',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		if (intFilterDays >= 7 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('thisweek', 'This Week'),
						btnId : 'btnThisweek',
						btnValue : '3',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		if (intFilterDays >= 14 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastweektodate', 'Last Week To Date'),
						btnId : 'btnLastweek',
						parent : this,
						btnValue : '4',
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		if (intFilterDays >= 30 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('thismonth', 'This Month'),
						btnId : 'btnThismonth',
						parent : this,
						btnValue : '5',
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		if (intFilterDays >= 60 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastMonthToDate', 'Last Month To Date'),
						btnId : 'btnLastmonth',
						btnValue : '6',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		if (intFilterDays >= 90 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('thisquarter', 'This Quarter'),
						btnId : 'btnLastMonthToDate',
						btnValue : '8',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
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
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		if (intFilterDays >= 365 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('thisyear', 'This Year'),
						btnId : 'btnLastQuarterToDate',
						btnValue : '10',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		if (intFilterDays >= 730 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastyeartodate', 'Last Year To Date'),
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
						this.parent.fireEvent('dateChange', btn, opts);

					}
				});
				
		
		var dropdownMenu = Ext.create('Ext.menu.Menu', {
			itemId : 'DateMenu',
			cls : 'ext-dropdown-menu',
			listeners : {
				hide : function(event) {
					buttonIns.addCls('ui-caret-dropdown');
					buttonIns.removeCls('action-down-hover');
				}
			},
			items : arrMenuItem
		});
		return dropdownMenu;
	},
	checkInfinity : function(intFilterDays)
	{
		if(intFilterDays == '0' || Ext.isEmpty(intFilterDays))
			{ 
				return true;
			}		
	},savedFilterStore : function() {	
		var strUrl = 'userfilterslist/instrumentInqFilter.srvc';	
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
	}
} );
