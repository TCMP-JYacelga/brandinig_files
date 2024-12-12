Ext.define( 'GCP.view.DepositInquiryFilterView',
{
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	xtype : 'depositInquiryFilterView',
	//width : '100%',
	layout : {
		type : 'vbox'
	},  
	initComponent : function()
	{
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
		[{
			xtype : 'container',
			layout : 'vbox',
			hidden : ((clientStore.getCount() < 2) || !isClientUser()) ? true : false,//If count is one or admin then hide
			width : '25%',
			padding : '0 30 0 0',
			items : [{
						xtype : 'label',
						itemId : 'savedFiltersLabel',
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
						itemId : 'clientCombo',
						mode : 'local',
						emptyText : getLabel('selectCompany', 'Select Company'),
						store : clientStore
						/*listeners : {
							'select' : function(combo, record) {
								selectedFilterClientDesc = combo.getRawValue();
								selectedFilterClient = combo.getValue();
								selectedClientDesc = combo.getRawValue();
								$('#msClient').val(selectedFilterClient);
								changeClientAndRefreshGrid(combo.getValue(), combo.getRawValue());
							},
							boxready : function(combo, width, height, eOpts) {
								combo.setValue(combo.getStore().getAt(0));
							}
						}*/
					}]
		},{
			xtype : 'container',
			layout : 'vbox',
			hidden : (isClientUser()) ? true : false,//If not admin then hide
			width : '25%',
			padding : '0 25 0 0',
			items : [{
						xtype : 'label',
						itemId : 'savedFiltersLabel',
						text : getLabel('lblcompany', 'Company Name')
					}, {
							xtype : 'AutoCompleter',
							width : 255,
							matchFieldWidth : true,
							name : 'clientCombo',
							itemId : 'clientAuto',
							cfgUrl : "services/userseek/userclients.json",
							padding : '-4 0 0 0',
							cfgQueryParamName : '$autofilter',
							cfgRecordCount : -1,
							cfgSeekId : 'userclients',
							cfgKeyNode : 'CODE',
							cfgRootNode : 'd.preferences',
							cfgDataNode1 : 'DESCR',
							emptyText : getLabel('searchByCompany', 'Enter Keyword or %'),
							enableQueryParam:false,
							cfgProxyMethodType : 'POST',
							listeners : {
								'select' : function(combo, record) {
									selectedFilterClientDesc = combo.getRawValue();
									selectedFilterClient = combo.getValue();
									selectedClientDesc = combo.getRawValue();
									$(document).trigger("handleClientChangeInQuickFilter",
											false);
								},
								'change' : function(combo, record) {
									if(Ext.isEmpty(combo.getValue())){
									selectedFilterClientDesc = "";
									selectedFilterClient = "";
									selectedClientDesc = "";
									$(document).trigger("handleClientChangeInQuickFilter",
											false);
									}
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
						padding : '-4 0 0 0',
						emptyText : getLabel('selectclient', 'Select Account'),
						store : me.getAccountStore(),
						listeners :
						{
							'select' : function(combo, record)
							{
								me.fireEvent("handleAccountChangeInQuickFilter",
										combo);
							},
							'focus' : function(combo, record)
							{
								combo.inputEl.removeCls('requiredField');
							},
							'blur' : function(combo, record)
							{
								if(combo.value === '' || combo.value === 'all' || combo.value === 'All')
									combo.inputEl.addCls('requiredField');
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
									itemId : 'depositDateLabel',
									cls :"required",
									text : getLabel('postingDate','Posting Date')
									//margin : '0 0 0 6'
								} ,{
									xtype : 'button',
									border : 0,
									filterParamName : 'depositDate',
									itemId : 'depositDateCaretBtn',
									cls : 'ui-caret-dropdown',
									listeners : {
										click : function(event) {
											var menus = me.getDateDropDownItems(this);
											var xy = event.getXY();
											menus.showAt(xy[0], xy[1] + 16);
											event.menu = menus;
										}
									}
								}]
					}, {
						xtype : 'container',
						itemId : 'entryDateToContainer',
						layout : 'hbox',
						width : '50%',
						items : [{
							xtype : 'component',
							width : '84%',
							itemId : 'depositDatePickerQuick',
							//padding : '0 0 0 6',
							filterParamName : 'depositDate',
							html : '<input type="text"  id="depositDatePickerQuickText" class="ft-datepicker from-date-range ui-datepicker-range-alignment">'
						},{
							xtype : 'component',
							cls : 'icon-calendar',
							margin : '1 0 0 0',
							html : '<span class=""><i class="fa fa-calendar"></i></span>'
						}]
					}]
			}]
			}];
		this.callParent(arguments);
	},
	getAccountStore : function() {	
		var accountData = null;
		var objAccountStore = null;
		var strUrl = 'depositAccountList.srvc';			
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
						},50);
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
		/*arrMenuItem.push({
					text : getLabel('daterange', 'Date Range'),
					btnId : 'btnDateRange',
					parent : this,
					btnValue : '7',
					handler : function(btn, opts) {
						this.parent.fireEvent('dateChange', btn, opts);

					}
				});*/
				
		
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
	savedFilterStore : function() {	
		var strUrl = 'userfilterslist/depositInqFilter.srvc';	
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
							$("#depositAmountOperator").niceSelect('update');
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
