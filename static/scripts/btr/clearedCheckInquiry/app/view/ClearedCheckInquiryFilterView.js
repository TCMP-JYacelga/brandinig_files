Ext.define( 'GCP.view.ClearedCheckInquiryFilterView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'clearedCheckInquiryFilterView',
	requires : [],
	width : '100%',
	layout :
	{
		type : 'vbox'
	},
	initComponent : function()
	{
		var me=this;
		var storeLength = 0;
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
									'CODE' : 'All',
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
			[{
				xtype : 'container',
				layout : 'vbox',
				hidden : ((corporationStore.getCount() < 2) || !isClientUser()) ? true : false,//If count is one or admin then hide
				width : '25%',
				padding : '0 30 0 0',
				items : [{
							xtype : 'label',
							itemId : 'clientFiltersLabel',
							text : getLabel('lblcompany', 'Company Name')
						}, {
							xtype : 'combo',
							displayField : 'DESCR',
							valueField : 'CODE',
							queryMode : 'local',
							editable : false,
							triggerAction : 'all',
							width : '100%',
							padding : '-4 0 0 0',
							itemId : 'clientComboItem',
							mode : 'local',
							emptyText : getLabel('selectCompany', 'Select Company'),
							store : corporationStore,
							listeners : {
								'select' : function(combo, record) {
									 //this.parent.fireEvent('handleClientChangeFilter',combo);
									 me.fireEvent("handleClientChangeFilter", combo );
								},
								boxready : function(combo, width, height, eOpts) {
									combo.setValue(combo.getStore().getAt(0));
								}					
							}
						}]
			},{
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
							text : getLabel('savedFilters', 'Saved Filters')
						}, {
							xtype : 'combo',
							valueField : 'filterName',
							displayField : 'filterName',
							queryMode : 'local',
							editable : false,
							triggerAction : 'all',
							width : '100%',
							padding : '-4 0 0 0',
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
						itemId : 'accountContainer',
						layout : 'vbox',
						width : '25%',
						padding : '0 30 0 0',
						items : [{
							xtype : 'label',
							itemId : 'accountFiltersLabel',
							cls :"required",
							text : getLabel( 'lblclcheckacc', 'Deposit Account' )
						}, {
							xtype : 'combo',
							valueField : 'clearedCheckAccount',
							displayField : 'clearedCheckAccountDescription',
							queryMode : 'local',
							width : '100%',
							editable : false,
							triggerAction : 'all',
							itemId : 'quickFilterAccountCombo',
							mode : 'local',
							padding : '-4 0 0 0',
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
				itemId : 'depositDateQuickContainer',
				layout : 'vbox',
				width : '50%',
				padding : '0 30 0 0',
				items : [{
							xtype : 'panel',
							itemId : 'depositDateQuickPanel',
							height : 23,
							width : '100%',
							layout : 'hbox',
							items : [{
										xtype : 'label',
										itemId : 'dateLabel',
										cls :"required",
										text : getLabel('PostingDateLabel','Posting Date')
										//margin : '0 0 0 6'
									}]
						}, {
							xtype : 'container',
							itemId : 'entryDateToContainer',
							layout : 'hbox',
							width : '50%',
							items : [{
								xtype : 'component',
								width : '84%',
								itemId : 'clearedCheckDatePickerQuick',
								//padding : '0 0 0 6',
								filterParamName : 'depositDate',
								html : '<input type="text"  id="clearedCheckDatePickerQuickText" class="ft-datepicker from-date-range ui-datepicker-range-alignment">'
							},{
								xtype : 'component',
								cls : 'icon-calendar',
								margin : '1 0 0 0',
								html : '<span class=""><i class="fa fa-calendar"></i></span>'
							}]
						}]
				}]
				}];
			
		this.callParent( arguments );
	},
	getAccountStore : function() {	
		var accountData = null;
		var objAccountStore = null;
		var strUrl = 'clearedCheckAccountList.srvc';			
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
									fields : ['clearedCheckAccount', 'clearedCheckAccountDescription'],
									data : accountData,
									reader : {
										type : 'json',
										root : 'd.txnlist'
									},
									autoLoad : true,
									listeners : {
										load : function() {
											this.insert(0, {
													clearedCheckAccount : 'all',
													clearedCheckAccountDescription : getLabel('selectclient', 'Select Account')
													});
										}
									}
								});
						objAccountStore.load();
					}
				}
			},
			failure : function(response) {
				// console.log('Error Occured');
			}
		});
		return objAccountStore;
	},
	getDateDropDownItems : function(buttonIns) {
		var me = this;		
		var intFilterDays = filterDays ? filterDays : '';
		var arrMenuItem = [];
		
		arrMenuItem.push({
					text : getLabel('latest', 'Latest'),
					btnId : 'btnLatest',
					btnValue : '12',
					parent : this,
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
					//buttonIns.addCls('ui-caret-dropdown');
					buttonIns.removeCls('action-down-hover');
				}
			},
			items : arrMenuItem
		});
		return dropdownMenu;
	},
	savedFilterStore : function() {	
		var strUrl = 'userfilterslist/clearedCheckInqFltr.srvc?';	
		var myStore = new Ext.data.ArrayStore({
					autoLoad : true,
					fields : ['filterName'],
					proxy : {
						type : 'ajax',
						url : strUrl,
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
	checkInfinity : function(intFilterDays)
	{
		if(intFilterDays == '0' || Ext.isEmpty(intFilterDays))
			{ 
				return true;
			}		
	}
} );
