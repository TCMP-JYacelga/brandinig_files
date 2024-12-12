Ext.define("GCP.view.PaymentSummaryFilterView",{
	extend:'Ext.panel.Panel',
	xtype : 'paymentSummaryFilterView',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	//width : '100%',		
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		var me=this;
		
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
		
		me.items = [{
			xtype : 'container',
			layout : 'vbox',
			hidden : ((clientStore.getCount() < 2) || !isClientUser()) ? true : false,//If count is one or admin then hide
			//width : '25%',
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
				width : '23%',
				padding : '-4 0 0 0',
				itemId : 'clientCombo',
				mode : 'local',
				emptyText : getLabel('selectCompany', 'Select Company Name'),
				store : clientStore
			}]
		},{
			xtype : 'container',
			layout : 'vbox',
			hidden : (isClientUser()) ? true : false,//If not admin then hide
			//width : '25%',
			padding : '0 25 0 0',
			items : [{
				xtype : 'label',
				itemId : 'savedFiltersLabel',
				text : getLabel('lblcompany', 'Company Name')
			},{
				xtype : 'AutoCompleter',
				width : '23%',
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
				emptyText :getLabel('autoCompleterEmptyText',
												'Enter Keyword or %'),
				enableQueryParam:false,
				cfgProxyMethodType : 'POST'
				/*listeners : {
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
				}*/
			}]
		},{			
			xtype : 'container',
			itemId : 'filterParentContainer',
			width : '100%',
			layout : 'hbox',
			items: [
		        {
		        	xtype: 'container',
		        	layout: 'vbox',
		        	padding: '0 30 0 0',
		        	width : '25%',
		        	hidden : isHidden('AdvanceFilter'),
		        	items:[
	        	       {
	        	    	   xtype: 'label',
	        	    	   text : getLabel('savedFilters', 'Saved Filters')
	        	       },{
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
							tabIndex:'1',
							emptyText : getLabel('selectfilter',
									'Select Filter'),
							store : me.savedFilterStore(),
							listeners : {
								'select' : function(combo, record) {
									me.fireEvent("handleSavedFilterItemClick",
											combo.getValue(), combo
													.getRawValue());
								}
							}
						}
        	        ]
		        },{
					xtype : 'container',
					itemId : 'statusContainer',
					layout : 'vbox',
					width : '25%',
					padding : '0 30 0 0',
					items : [{
								xtype : 'label',
								text : getLabel('lblStatus', 'Status')
							}, Ext.create('Ext.ux.gcp.CheckCombo', {
										valueField : 'code',
										displayField : 'desc',
										editable : false,
										addAllSelector : true,
										emptyText : 'All',
										multiSelect : true,
										width : '100%',
										tabIndex:'1',
										padding : '-4 0 0 0',
										itemId : 'statusCombo',
										isQuickStatusFieldChange : false,
										store : me.getStatusStore(),
										listeners : {
										}
									})]
				},{
					xtype : 'container',
					itemId : 'entryDateContainer',
					layout : 'vbox',
					width : '50%',
					padding : '0 30 0 0',
					items : [{
						xtype : 'panel',
						itemId : 'entryDatePanel',
						height : 23,
						flex : 1,
						layout : 'hbox',
						items : [{
									xtype : 'label',
									itemId : 'entryDateLabel',
									text : getLabel('date', 'Entry Date')
								}, {
									xtype : 'button',
									border : 0,
									filterParamName : 'EntryDate',
									itemId : 'entryDateBtn',
									cls : 'ui-caret-dropdown',
									listeners : {
										click : function(event) {
											var menus = me
													.getEntryDateDropDownMenu()
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
							width : '85%',
							itemId : 'paymentEntryDataPicker',
							filterParamName : 'EntryDate',
							tabIndex:'1',
							html : '<input tabindex="1" type="text"  id="entryDataPicker" class="ft-datepicker from-date-range ui-datepicker-range-alignment">'
						}, {
							xtype : 'component',
							cls : 'icon-calendar',
							margin : '1 0 0 0',
							html : '<span class=""><i class="fa fa-calendar"></i></span>'
						}]
					}]
				}
	        ]
		}];
		this.callParent(arguments);	
	},
	getPaymentTypeStore : function() {
		var dataPaymentTypes = null;
		var objPaymentTypesStore = null;
		Ext.Ajax.request({
			url : 'services/instrumentType.json',
			async : false,
			method : "GET",
			success : function(response) {
				if (!Ext.isEmpty(response.responseText)) {
					var data = Ext.decode(response.responseText);
					if (data && data.d) {
						dataPaymentTypes = data.d.instrumentType;
						objPaymentTypesStore = Ext.create('Ext.data.Store', {
									fields : ['instTypeDescription',
											'instTypeCode'],
									data : dataPaymentTypes,
									reader : {
										type : 'json',
										root : 'd.instrumentType'
									},
									autoLoad : true,
									listeners : {
										load : function() {
											/*this.insert(0, {
														instTypeDescription : 'All',
														instTypeCode : 'all'
													});*/
										}
									}
								});
						objPaymentTypesStore.load();
					}
				}
			},
			failure : function(response) {
				// console.log('Error Occured');
			}
		});
		return objPaymentTypesStore;
	},
	getStatusStore : function(){
		var objPayStatusStore = null;
		if (!Ext.isEmpty(arrPaymentStatus)) {
			objPayStatusStore = Ext.create('Ext.data.Store', {
						fields : ['code','desc'],
						data : arrPaymentStatus,
						autoLoad : true,
						listeners : {
							load : function() {
							}
						}
					});
			objPayStatusStore.load();
		}
		return objPayStatusStore;
	},
	getClientStore:function(){
		var clientData=null;
		var objClientStore=null;
		Ext.Ajax.request({
			url : 'services/userseek/userclients.json&$sellerCode='+ strSeller,
			async : false,
			method : "POST",
			success : function(response) {
				if (!Ext.isEmpty(response.responseText)) {
					var data = Ext.decode(response.responseText);
					if (data && data.d) {
						clientData = data.d.preferences;
						objClientStore = Ext.create('Ext.data.Store', {
									fields : ['CODE',
											'DESCR'],
									data : clientData,
									reader : {
										type : 'json',
										root : 'd.preferences'
									},
									autoLoad : true,
									listeners : {
										load : function() {
											this.insert(0, {
														CODE : 'all',
														DESCR : getLabel('allCompanies', 'All companies')
													});
										}
									}
								});
						objClientStore.load();
					}
				}
			},
			failure : function(response) {
				// console.log('Error Occured');
			}
		});
		return objClientStore;
	},
	savedFilterStore : function() {
		var myStore = new Ext.data.ArrayStore({
					autoLoad : true,
					fields : ['filterName'],
					proxy : {
						type : 'ajax',
						url : 'services/userfilterslist/siGroupViewFilter.json',
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
	getEntryDateDropDownMenu : function() {
		 var intFilterDays = !Ext.isEmpty(filterDays)
		   ? parseInt(filterDays,10)
		    : '';
		   var arrMenuItem = [{
					text : getLabel('latest', 'Latest'),
					btnId : 'latest',
					btnValue : '12'
					}
				];		   
		   
		if (intFilterDays >= 1 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push( {
										text : getLabel('today', 'Today'),
										btnId : 'btnToday',
										btnValue : '1'
										
									});	
			if (intFilterDays >= 2 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
										text : getLabel('yesterday',
												'Yesterday'),
										btnId : 'btnYesterday',
										btnValue : '2'
										
									});
		
		if (intFilterDays >= 7 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
					text : getLabel('thisweek', 'This Week'),
										btnId : 'btnThisweek',
										btnValue : '3'
										
				});
		if (intFilterDays >= 14 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
										text : getLabel('lastweektodate',
												'Last Week To Date'),
										btnId : 'btnLastweek',
										btnValue : '4'
									});
		if (intFilterDays >= 30 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
										text : getLabel('thismonth',
												'This Month'),
										btnId : 'btnThismonth',
										btnValue : '5'
									});
		if (intFilterDays >= 60 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
										text : getLabel('lastMonthToDate',
												'Last Month To Date'),
										btnId : 'btnLastmonth',
										btnValue : '6'
									});
		 if (lastMonthOnlyFilter===true || Ext.isEmpty(intFilterDays))
		   arrMenuItem.push({
										text : getLabel('lastmonthonly',
												'Last Month Only'),
										btnId : 'btnLastmonthonly',
										btnValue : '14'
									});
		if (intFilterDays >= 90 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
										text : getLabel('thisquarter',
												'This Quarter'),
										btnId : 'btnLastMonthToDate',
										btnValue : '8'
									});
		if (intFilterDays >= 180 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
										text : getLabel('lastQuarterToDate',
												'Last Quarter To Date'),
										btnId : 'btnQuarterToDate',
										btnValue : '9'
									});
		if (intFilterDays >= 365 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
										text : getLabel('thisyear', 'This Year'),
										btnId : 'btnLastQuarterToDate',
										btnValue : '10'
										});
		if (intFilterDays >= 730 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push( {
										text : getLabel('lastyeartodate',
												'Last Year To Date'),
										btnId : 'btnYearToDate',
										btnValue : '11'
										});
		var dropdownMenu = Ext.create('Ext.menu.Menu', {
			cls : 'ext-dropdown-menu',
			itemId : 'entryDateMenu',
			items : arrMenuItem
		})
		return dropdownMenu;
	}
});