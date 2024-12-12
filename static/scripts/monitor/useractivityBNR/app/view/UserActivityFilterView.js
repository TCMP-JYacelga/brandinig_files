Ext.define('GCP.view.UserActivityFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'userActivityFilterView',
	requires : [],
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		var me = this;
		prfUserActivity=me;
		
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
											'DESCR' : getLabel('allCompanies', 'All Companies')
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
		this.items = [
			 {
				 xtype: 'container',
				 width : '100%',
				 layout : 'hbox',
				 items: [{
				  xtype: 'container',
				  layout: 'vbox',
				  width: isClientUser() ? '25%' : '20%',
				  padding: '0 30 0 0',
				  hidden: ((clientStore.getCount() < 2) || !isClientUser()) ? true : false,//If count is one or admin then hide
				  items:[
				     {
				    	 xtype: 'label',
				    	 text : getLabel('lblcompany', 'Company Name')
				     },{
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
					 emptyText : getLabel('selectCompany', 'Select Company Name'),
					 store : clientStore,
					 listeners : {
					 	'select' : function(combo, record) {
						selectedFilterClientDesc = combo.getRawValue();
						selectedFilterClient = combo.getValue();
						$(document).trigger("handleClientChangeInQuickFilter", false);
									},
									boxready : function(combo, width, height, eOpts) {
										if (Ext.isEmpty(combo.getValue())) {										
											combo.setValue(combo.getStore().getAt(0));
										}
									}
								 }
					         }
					      ]
					  },
					  {
						  xtype: 'container',
						  layout: 'vbox',
						  //width: '100%',
						  padding: '0 30 0 0',
						  width: isClientUser() ? '25%' : '20%',
						  hidden: (isClientUser()) ? true : false,// If not admin then hide
								  items:[
								         {
								        	 xtype: 'label',
								        	 text : getLabel('lblcompany', 'Company Name')
								         },{
								        	 xtype : 'AutoCompleter',
								        	 width : '100%',
								        	 matchFieldWidth : true,
								        	 name : 'clientCombo',			            	        		
								        	 itemId : 'clientComboAuto',
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
								        			 $(document).trigger("handleClientChangeInQuickFilter",false);
								        		 },
								        		 'change' : function(combo, record) {
								        			 if (Ext.isEmpty(combo.getValue())) {
								        				 selectedFilterClientDesc = "";
								        				 selectedFilterClient = "";
								        				 $(document).trigger("handleClientChangeInQuickFilter",false);
								        			 }
								        		 }
								        	 }
								         }
								         ]
					  
					  }]},
					{
						xtype : 'container',
						itemId : 'filterParentContainer',
						width : '100%',
						layout : 'hbox',
						items : [{
							xtype : 'container',
							itemId : 'savedFiltersContainer',
							layout : 'vbox',
							width : isClientUser() ? '25%' : '20%',
							padding : '0 30 0 0',
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
									padding : '-4 0 0 0',
									triggerAction : 'all',
									width: '100%',
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
						layout : 'vbox',
						width : '25%',
						padding : '0 30 0 0',
						items : [{
							xtype : 'label',
							text : getLabel('userId', 'User ID')
						}, {
							xtype : 'AutoCompleter',
							fieldCls : 'xn-form-text w10 xn-suggestion-box',
							name : 'userCode',
							padding : '-4 0 0 0',
							itemId : 'userNameFltId',
							width : '100%',
							enableQueryParam : false,
							cfgUrl : entityType == '1' ? 'services/userActivityMstSeek/userNamesListSeek.json' : 'services/userActivityMstSeek/userANamesListSeek.json',
							cfgQueryParamName : 'qfilter',
							cfgRecordCount : -1,
							cfgSeekId : 'userNamesList',
							cfgKeyNode : 'value',
							cfgRootNode : 'filterList',
							cfgDataNode1 : 'value',
							cfgDataNode2 : 'name',
							cfgProxyMethodType : 'POST',
							emptyText:getLabel('autoCompleterEmptyText','Enter Keword or %'),
							listeners : {
								'change' : function(
										combo,
										record) {
									selectUserAdvUserNameCode = record;
								}
							},							
							cfgExtraParams : [{
										key : '$filterseller',
										value : sessionSellerCode
									}]
						}]
					},
					{
						xtype : 'container',
						width : '50%',
						layout : 'vbox',
						padding: '0 30 0 0',
						items :
						[{
								xtype : 'panel',
								layout : 'hbox',
								height : 23,
								flex : 1,
								items :
								[{
										xtype : 'label',
										itemId : 'loginDateLabel',
										text : getLabel('loginDate', 'Last Login Date')
								},{
										xtype : 'button',
										border : 0,
										filterParamName : 'loginDate',
										itemId : 'loginDate',
										cls : 'ui-caret-dropdown',
										listeners : {
										click:function(event){
												var menus = getDateDropDownItems("entryDateQuickFilter",this);
												var xy = event.getXY();
												menus.showAt(xy[0],xy[1]+16);
												event.menu = menus;
											}
										}
										
								}]
						 },
						 {
							xtype : 'container',
							itemId : 'entryDateToContainer',
							layout : 'hbox',
							width : '50%',
							items : [{
								xtype : 'component',
								width : '80%',
								itemId : 'userActivityEntryDataPicker',
								filterParamName : 'loginDate',
								html : '<input type="text"  id="entryDataPicker" class="ft-datepicker from-date-range ui-datepicker-range-alignment">'
							}, {
								xtype : 'component',
								cls : 'icon-calendar',
								margin : '1 0 0 0',
								html : '<span class=""><i class="fa fa-calendar"></i></span>'
							}]
						 }]
					},
		
					{
						xtype : 'container',
						itemId : 'bankusercontainer',
						layout : 'vbox',
						width : '8.5%',
						hidden : isClientUser(),
						items : [{
							xtype : 'label',
							text : getLabel('bankuser', 'Bank User'),
							width: '100%'
							},{
								xtype : 'checkbox',
								padding : '6 0 0 16',
								itemId:'bankUserCheckbox',
								handler:function(){
									me.fireEvent('handlebankuser');
								}
						}]
					}]
				}];
				this.callParent(arguments);
	},populateClientMenu : function(data) {
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
						text : getLabel('lastmonthonly', 'Last Month Only'),
						btnId : 'btnLastmonthonly',
						btnValue : '14',
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
						url : 'services/userfilterslist/userActivityFilter.srvc?',
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