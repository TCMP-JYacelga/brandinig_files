/**
 * @class GCP.view.activity.AccountActivityFilterView
 * @extends Ext.panel.Panel
 * @author Vinay Thube
 */
Ext.define('GCP.view.activity.AccountActivityFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'accountActivityFilterView',
	layout:'vbox',	
	initComponent : function() {
		var filterLabel = getDateDropDownLabesl(defaultFilterVal);
		posting_date_opt = filterLabel;
		var me = this;
		var isInfoHidden = false;    
		var padBtr ;
		var	datePickerDisable = "disabled";
		if (summaryType === 'previousday'){
			padBtr = '35 30 0 0';
		}
		else
		{
			padBtr = '25 30 0 0';
		}
		if (summaryType === 'previousday'){
			isInfoHidden = true;
			datePickerDisable = "";
			posting_date_opt = filterLabel;
		}
		else
		{
			posting_date_opt = null;
		}
		accountStore = me.getAccountStore();
		me.items = [{
	xtype : 'container',
	itemId : 'savedFiltersContainerH',
	layout : 'hbox',
	items : [
		{
			xtype : 'container',
			itemId : 'savedFiltersContainer',
			layout : 'vbox',
			width : 310,
			padding : '0 30 0 0',
			items : [{
						xtype : 'label',
						itemId : 'savedFiltersLabel',
						text : getLabel('savedfilters','Saved Filters'),
						padding : '0 0 0 0'
					}, {
						xtype : 'combo',
						valueField : 'filterName',
						displayField : 'filterName',
						queryMode : 'local',
						editable : false,
						width : '100%',
						triggerAction : 'all',
						padding : '0 0 0 0',
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
		},{
			xtype : 'container',
			itemId : 'savedTypeCodeContainer',
			layout : 'vbox',
			width : 255,
			padding : '0 30 0 0',
			items : [{
						xtype : 'label',
						itemId : 'savedTypeCodeLabel',
						text : getLabel('savedtypecodeset', 'Saved Type Code Set'),
						padding : '0 0 0 10'
					}, {
						xtype : 'combo',
						valueField : 'btn',
						displayField : 'text',
						queryMode : 'local',
						editable : false,
						width : 250,
						triggerAction : 'all',
						typeCodeArray : 'all',
						padding : '0 0 0 10',
						itemId : 'savedTypeCodeCombo',
						mode : 'local',
						emptyText : getLabel('all', 'All'),
						store : Ext.create(
								'Ext.data.JsonStore', {
									fields : ['text', 'btn'],
									data : []
								})
			 }]	
	},{
		xtype : 'container',
		itemId : 'accountsContainer',
		layout : 'vbox',
		width : 300,
		padding : '0 30 0 18',
		items : [{
					xtype : 'label',
					itemId : 'actAccountIdSpan',
					width: '100%',
					text : getLabel('accounts','Account'),
					padding : '0 0 0 0'
				}, {
					xtype : 'combo',
					displayField : '{accountName} | {accountNumber}',
					valueField : 'accountId',
					queryMode : 'local',
		            editable: false,
		            enableKeyEvents :false,
		            disableKeyFilter: false,
					width : 250,
					triggerAction : 'all',
					padding : '0 0 0 0',
					itemId : 'savedAccountsCombo',
					mode : 'local',
					//emptyText : getLabel('accounts','Account'),
					store : accountStore
		 }]
	}]
		},
		
		{
			xtype : 'container',
			itemId : 'savedFiltersContainerH2',
			layout : 'hbox',
			items: [{
				xtype : 'container',
				itemId : 'entryDateContainer',
				layout : 'vbox',
				width : 290,
				padding : '5 30 0 0',
				items : [{
							xtype : 'panel',
							itemId : 'datePanel',
							layout : 'hbox',
							items : [{
										xtype : 'label',
										itemId : 'dateLabel',
										width: '255',
										text : getLabel('postingDate', 'Posting Date'),
										padding : '0 0 0 0',
										listeners: {
										       render: function(c) {
										    	   			var tip = Ext.create('Ext.tip.ToolTip', {
										    	   							xtype : 'tooltip',
														            	    target: c.getEl(),
														            	    listeners:{
														            	    	beforeshow:function(tip){
														            	    		if(posting_date_opt === null)
															            	    		tip.update('Posting Date');
															            	    	else
															            	    		tip.update('Posting Date (' + posting_date_opt + ')');

														            	    	}
														            	    }
										        			});
										       	}	
										}
									}, {
										xtype : 'button',
										border : 0,
										filterParamName : 'postingDate',
										itemId : 'postingDateBtn',
										cls : 'ui-caret-dropdown',
										hidden : !(isInfoHidden),
										listeners : {
											click:function(event){
													var menus = me.getDateDropDownItems("dateQuickFilter", this);
													var xy = event.getXY();
													menus.showAt(xy[0],xy[1]+16);
													event.menu=menus;													
											}
										}
									}]
						}, {
							xtype : 'panel',								
							layout : 'hbox',
							width : 290,
							items : [{
								xtype : 'component',	
								width: '85%',
								itemId : 'btrActivityDataPicker',
								filterParamName : 'EntryDate',								
								html :'<input type="text"  id="activityDataPicker" class="ft-datepicker ui-datepicker-range-alignment" '+datePickerDisable+'>'
							}, {
								xtype : 'component',
								cls : 'icon-calendar',
								margin : '1 0 0 0',
								hidden : !(isInfoHidden),
								html : '<span class=""><i class="fa fa-calendar"></i></span>'
							}]
						}]
			},{
				xtype : 'container',
				layout : 'hbox',
				width : 580
			},{
				xtype : 'container',
				itemId : 'createTypeCodeContainer',
				layout : 'vbox',
				height: '100%',
				hidden : enableTypeCode == 'Y' ? true : false ,
				flex : 1,
				//width : 450,
				padding : padBtr,
				items : [{
							xtype:'label',
							itemId: 'createTypeCodeLabel',
							cls: 'create-advanced-filter-label',
							text : getLabel('manageTypeCode','Manage Type Code Set'),
							//style:'color:white !important;',
//							padding : '0 0 0 0',
							margin : '0 0 4 0',
							emptyText : getLabel('manageTypeCode', 'Manage Type Code Set'),
							width : 155,
							listeners : {
								render : function(c) {
									c.getEl().on('click', function(){ this.fireEvent('click', c); }, c);
								}
							}
						}/*,
						{
							xtype:'label',
							width : 12
						},
						{
							xtype:'label',
							itemId: 'createAdvFilterLabel',
							cls: 'create-advanced-filter-label',
							text : getLabel('moreFilter','More Filters'),
							//style:'color:white !important;',
							padding : '-4 12 0 0',
							emptyText : getLabel('moreFilters', 'More Filters'),
							width : 90,
							listeners : {
								render : function(c) {
									c.getEl().on('click', function(){ this.fireEvent('click', c); }, c);
								}
							}
						}*/]	
			}
			
			        ]
		}
	
		]
		this.callParent(arguments);	
	},
	getDateDropDownItems : function(filterType, buttonIns){
		var me = this;
		var intFilterDays = objClientParameters
				&& !Ext.isEmpty(objClientParameters['filterDays'])
				&& objClientParameters['filterDays'] !== 0
				? parseInt(objClientParameters['filterDays'],10)
				: '';
		var arrMenuItem = [];
		if(summaryType === 'previousday'){
			arrMenuItem.push({
						text : getLabel('selectedRecordDate', 'Selected Record Date'),
						btnId : 'latest',
						btnValue : '16',
						handler : function(btn, opts) {
							me.fireEvent('dateChange', btn, opts);
							posting_date_opt = "Selected Record Date";
							updateToolTip('dateChange',posting_date_opt);
						}
					});
			if (intFilterDays >= 2 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
							text : getLabel('yesterday', 'Yesterday'),
							btnId : 'btnYesterday',
							btnValue : '2',
							handler : function(btn, opts) {
								me.fireEvent('dateChange', btn, opts);
								posting_date_opt = "Yesterday";
								updateToolTip('dateChange',posting_date_opt);
							}
						});
			if (intFilterDays >= 7 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
							text : getLabel('thisweek', 'This Week'),
							btnId : 'btnThisweek',
							btnValue : '3',
							handler : function(btn, opts) {
								me.fireEvent('dateChange', btn, opts);
								posting_date_opt = "This Week";
								updateToolTip('dateChange',posting_date_opt);
							}
						});
			if (intFilterDays >= 14 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
							text : getLabel('pdayLastweektodate', 'Last Week To Yesterday'),
							btnId : 'btnLastweek',
							btnValue : '4',
							handler : function(btn, opts) {
								me.fireEvent('dateChange', btn, opts);
								posting_date_opt = "Last Week To Yesterday";
								updateToolTip('dateChange',posting_date_opt);
							}
						});
			if (intFilterDays >= 30 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
							text : getLabel('thismonth', 'This Month'),
							btnId : 'btnThismonth',
							btnValue : '5',
							handler : function(btn, opts) {
								me.fireEvent('dateChange', btn, opts);
								posting_date_opt ="This Month";
								updateToolTip('dateChange',posting_date_opt);
							}
						});
			if (intFilterDays >= 60 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
							text : getLabel('pdayLastMonthToDate', 'Last Month To Yesterday'),
							btnId : 'btnLastmonth',
							btnValue : '6',
							handler : function(btn, opts) {
								me.fireEvent('dateChange', btn, opts);
								posting_date_opt = "Last Month To Yesterday";
								updateToolTip('dateChange',posting_date_opt);
							}
						});
			if (lastMonthOnlyFilter===true || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
							text : getLabel('lastmonthonly', 'Last Month Only'),
							btnId : 'btnLastmonth',
							btnValue : '17',
							handler : function(btn, opts) {
								me.fireEvent('dateChange', btn, opts);
								posting_date_opt = "Last Month Only";
								updateToolTip('dateChange',posting_date_opt);								
							}
						});
			if (intFilterDays >= 90 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
							text : getLabel('thisquarter', 'This Quarter'),
							btnId : 'btnLastMonthToDate',
							btnValue : '8',
							handler : function(btn, opts) {
								me.fireEvent('dateChange', btn, opts);
								posting_date_opt = "This Quarter";
								updateToolTip('dateChange',posting_date_opt);
							}
						});
			if (intFilterDays >= 180 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
							text : getLabel('pdayLastQuarterToDate','Last Quarter To Yesterday'),
							btnId : 'btnQuarterToDate',
							btnValue : '9',
							handler : function(btn, opts) {
								me.fireEvent('dateChange', btn, opts);
								posting_date_opt = "Last Quarter To Yesterday";
								updateToolTip('dateChange',posting_date_opt);
							}
						});
			if (intFilterDays >= 365 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
							text : getLabel('thisyear', 'This Year'),
							btnId : 'btnLastQuarterToDate',
							btnValue : '10',
							handler : function(btn, opts) {
								me.fireEvent('dateChange', btn, opts);
								posting_date_opt = "This Year";
								updateToolTip('dateChange',posting_date_opt);
							}
						});
			if (intFilterDays >= 730 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
							text : getLabel('pdayLastyeartodate', 'Last Year To Yesterday'),
							btnId : 'btnYearToDate',
							btnValue : '11',
							handler : function(btn, opts) {
								me.fireEvent('dateChange', btn, opts);
								posting_date_opt = "Last Year To Yesterday";
								updateToolTip('dateChange',posting_date_opt);
							}
						});
			if(!Ext.isEmpty(xDaysVal))
				arrMenuItem.push({
							text : Ext.String.format(getLabel('lastXDays', 'Last {0} Days'), xDaysVal),
							btnId : 'btnLastQuarterToDate',
							btnValue : '14',
							handler : function(btn, opts) {
								me.fireEvent('dateChange', btn, opts);
								posting_date_opt = Ext.String.format(getLabel('lastXDays', 'Last {0} Days'), xDaysVal);
								updateToolTip('dateChange',posting_date_opt);
							}
						});
		}
		else{
			arrMenuItem = [{
						text : getLabel('latestLogin', 'Latest since last login'),
						btnId : 'latestSinceLogin',					
						btnValue : 'latestSinceLogin',
						handler : function(btn, opts) {
							me.fireEvent('informationFilterClick', 'latest');
							posting_date_opt = "Latest since last login";
							updateToolTip('dateChange',posting_date_opt);
						}
					}];
	
			arrMenuItem.push({
						text : getLabel('latest', 'Latest'),
						btnId : 'latest',					
						btnValue : '12',
						handler : function(btn, opts) {
							me.fireEvent('dateChange', btn, opts);
							posting_date_opt = "Latest";
							updateToolTip('dateChange',posting_date_opt);
						}
					});
			
			if ((intFilterDays >= 1 || Ext.isEmpty(intFilterDays)) && summaryType != 'previousday')
				arrMenuItem.push({
							text : getLabel('today', 'Today'),
							btnId : 'btnToday',
							btnValue : '1',						
							handler : function(btn, opts) {
								me.fireEvent('dateChange', btn, opts);
								posting_date_opt = "Today";
								updateToolTip('dateChange',posting_date_opt);
							}
						});
			if (intFilterDays >= 2 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
							text : getLabel('yesterday', 'Yesterday'),
							btnId : 'btnYesterday',
							btnValue : '2',						
							handler : function(btn, opts) {
								me.fireEvent('dateChange', btn, opts);
								posting_date_opt = "Yesterday";
								updateToolTip('dateChange',posting_date_opt);
							}
						});
			if (intFilterDays >= 7 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
							text : getLabel('thisweek', 'This Week'),
							btnId : 'btnThisweek',
							btnValue : '3',						
							handler : function(btn, opts) {
								me.fireEvent('dateChange', btn, opts);
								posting_date_opt = "This Week";
								updateToolTip('dateChange',posting_date_opt);
							}
						});
			if (intFilterDays >= 14 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
							text : getLabel('lastweektodate', 'Last Week To Date'),
							btnId : 'btnLastweek',						
							btnValue : '4',
							handler : function(btn, opts) {
								me.fireEvent('dateChange', btn, opts);
								posting_date_opt = "Last Week To Date";
								updateToolTip('dateChange',posting_date_opt);
							}
						});
			if (intFilterDays >= 30 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
							text : getLabel('thismonth', 'This Month'),
							btnId : 'btnThismonth',						
							btnValue : '5',
							handler : function(btn, opts) {
								me.fireEvent('dateChange', btn, opts);
								posting_date_opt = "This Month";
								updateToolTip('dateChange',posting_date_opt);
							}
						});
			if (intFilterDays >= 60 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
							text : getLabel('lastMonthToDate', 'Last Month To Date'),
							btnId : 'btnLastmonth',
							btnValue : '6',						
							handler : function(btn, opts) {
								me.fireEvent('dateChange', btn, opts);
								posting_date_opt = "Last Month To Date";
								updateToolTip('dateChange',posting_date_opt);
							}
						});
			if (lastMonthOnlyFilter===true || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
							text : getLabel('lastmonthonly', 'Last Month Only'),
							btnId : 'btnLastmonth',
							btnValue : '17',
							handler : function(btn, opts) {
								me.fireEvent('dateChange', btn, opts);
								posting_date_opt = "Last Month Only";
								updateToolTip('dateChange',posting_date_opt);
							}
						});
			if (intFilterDays >= 90 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
							text : getLabel('thisquarter', 'This Quarter'),
							btnId : 'btnLastMonthToDate',
							btnValue : '8',						
							handler : function(btn, opts) {
								me.fireEvent('dateChange', btn, opts);
								posting_date_opt = "This Quarter";
								updateToolTip('dateChange',posting_date_opt);
							}
						});
			if (intFilterDays >= 180 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
							text : getLabel('lastQuarterToDate',
									'Last Quarter To Date'),
							btnId : 'btnQuarterToDate',
							btnValue : '9',						
							handler : function(btn, opts) {
								me.fireEvent('dateChange', btn, opts);
								posting_date_opt = "Last Quarter To Date";
								updateToolTip('dateChange',posting_date_opt);
							}
						});
			if (intFilterDays >= 365 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
							text : getLabel('thisyear', 'This Year'),
							btnId : 'btnLastQuarterToDate',
							btnValue : '10',						
							handler : function(btn, opts) {
								me.fireEvent('dateChange', btn, opts);
								posting_date_opt = "This Year";
								updateToolTip('dateChange',posting_date_opt);
							}
						});
			if (intFilterDays >= 730 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
							text : getLabel('lastyeartodate', 'Last Year To Date'),
							btnId : 'btnYearToDate',						
							btnValue : '11',
							handler : function(btn, opts) {
								me.fireEvent('dateChange', btn, opts);
								posting_date_opt = "Last Year To Date";
								updateToolTip('dateChange',posting_date_opt);
							}
						});
		}			
		var dropdownMenu = Ext.create('Ext.menu.Menu', {
			itemId : 'DateMenu',
			cls : 'ext-dropdown-menu',
			listeners : {
					hide:function(event) {
						buttonIns.addCls('ui-caret-dropdown');
						buttonIns.removeCls('action-down-hover');
					}
				},	
			items : arrMenuItem
		});
		return dropdownMenu;
	},
	savedFilterStore : function() {
		var myStore = new Ext.data.ArrayStore({
					autoLoad : true,
					fields : ['filterName'],
					proxy : {
						type : 'ajax',
						url : 'services/userfilterslist/'+strActivityPageName+'.json',
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
	filterAccounts : function(account)
	{
		if (summaryType === 'previousday'){
			if(account.previousDayActivityGranularFlag == 'N')
				return false;
			return true;
		}
		else
		{
			if(account.intraDayActivityGranularFlag == 'N')
				return false;
			return true;
		}
	},
	getAccountStore:function(){
		var me = this;
		var accountData=null;
		var objAccountStore=null;
		Ext.Ajax.request({
			url : 'services/balancesummary/'+summaryType+'/btruseraccounts.json',
			async : false,
			method : "GET",
			success : function(response) {
				if (!Ext.isEmpty(response.responseText)) {
					var data = Ext.decode(response.responseText);
					if (data && data.d) {
						accountData = data.d.btruseraccount;
						var filteredAccountData = accountData;
						if( isGranularPermissionForClient == 'Y' )
						{
							filteredAccountData = accountData.filter(me.filterAccounts);
						}
						objAccountStore = Ext.create('Ext.data.Store', {
									fields : ['accountNumber',
											'accountName','accountId','accountCcy','accountCcySymbol','accountCalDate','facilityDesc'],
									data : filteredAccountData,
									reader : {
										type : 'json',
										root : 'd.btruseraccount'
									},
									autoLoad : true,
									listeners : {}
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
	}
});