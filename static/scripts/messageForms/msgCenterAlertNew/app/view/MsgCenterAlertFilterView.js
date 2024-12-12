Ext.define('GCP.view.MsgCenterAlertFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'msgCenterAlertFilterView',
	requires : [],	
	//padding : '0 30 0 0',	
	layout : 'hbox',
	initComponent : function() {
		var me = this;		
		this.items = [];
		this.createPanels();
		this.callParent(arguments);
	},
	createPanels : function() {
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
	
		me.items = [ {
			xtype  : 'container',
			itemId : 'eventDateQuickContainer',					
			layout : 'vbox',
			width  : '25%',
			padding : '0 30 0 0',
			
			items : [{
						xtype : 'panel',
						itemId : 'eventDateQuickPanel',
						//width  : '100%',
						layout : 'hbox',
						height : 23,
						flex : 1,
						items : [{
									xtype : 'label',
									itemId : 'eventDateLabel',
									
									text : getLabel('alertDate', 'Alert Date'),
									//padding : '-4 0 0 0'
								}, {
									xtype : 'button',
									border : 0,
									filterParamName : 'EventDate',
									itemId : 'eventDateCaretBtn',
									cls : 'ui-caret',
									listeners : {
										click : function(event) {
											var menus = me
													.getDateDropDownItems(this);
											var xy = event.getXY();
											menus.showAt(xy[0], xy[1] + 16);
											event.menu = menus;
										}
									}
								}]
					
				

			}, {/*
						xtype : 'component',
						width : '70%',
						itemId : 'eventDatePickerQuick',						
						filterParamName : 'issuanceDate',
						html : '<input type="text"  id="eventDatePickerQuickText" class="ft-datepicker ui-datepicker-range-alignment">'
					*/

				xtype : 'container',
				itemId : 'eventDatePickerQuick',
				layout : 'hbox',
				width : '100%',
				items : [{
					xtype : 'component',
					width : '85%',
					itemId : 'paymentEntryDataPicker',
					filterParamName : 'EntryDate',
					html : '<input type="text"  id="eventDatePickerQuickText" class="ft-datepicker from-date-range ui-datepicker-range-alignment">'
				}, {
					xtype : 'component',
					cls : 'icon-calendar',
					margin : '1 0 0 0',
					html : '<span class=""><i class="fa fa-calendar"></i></span>'
				}]
			}]
		}, {
				xtype : 'container',
				//itemId : 'clientContainer',
				layout : 'vbox',
				width : '25%',
				hidden : (clientStore.getCount() < 2) ? true : false,
				padding : '0 30 0 0',
				items : [{
							xtype : 'label',
							text : getLabel("lblcompany", "Company Name")
							
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
						emptyText : getLabel('allCompanies', 'All Companies'),
						store : clientStore,
						listeners : {
							'select' : function(combo, record) {
								selectedFilterClientDesc = combo.getRawValue();
								selectedFilterClient = combo.getValue();
								selectedClientDesc = combo.getRawValue();
								$('#msClient').val(selectedFilterClient);
								changeClientAndRefreshGrid(combo.getValue(), combo.getRawValue());
							}
						}
					}]
			},{
			xtype : 'container',
			itemId : 'eventFiltersContainer',
			layout : 'vbox',
			//flex : 1,
			width : '52%',
			padding : '0 30 0 0',
			items : [{
						xtype : 'label',
						itemId : 'eventFiltersLabel',
						text :  getLabel('alertEvent', 'Alert Event')
					}, {
						xtype : 'combo',
						valueField : 'eventDesc',
						displayField : 'eventDesc',
						queryMode : 'local',
						padding : '-4 0 0 0',
						editable : false,
						width : '45%',
						triggerAction : 'all',
						itemId : 'eventFiltersCombo',
						mode : 'local',
						//emptyText : getLabel('selectevent', 'Select'),
						value : getLabel('select', 'Select'),
						store : me.eventFilterStore(),
						listeners : {
							'select' : function(combo, record) {
								me.fireEvent("handleSavedEventItemClick", combo);
							}
						}
					}]
		}];
	},
	getDateDropDownItems : function(buttonIns) {
		var dropdownMenu = Ext.create('Ext.menu.Menu', {
			itemId : 'DateMenu',
			cls : 'ext-dropdown-menu',
			listeners : {
				hide : function(event) {
				//	buttonIns.addCls('ui-caret-dropdown');
					buttonIns.removeCls('action-down-hover');
				}
			},
			items : [{
						text : getLabel('latest', 'Latest'),
						btnId : 'btnLatest',
						btnValue : '12',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					}, {
						text : getLabel('today', 'Today'),
						btnId : 'btnToday',
						btnValue : '1',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					}, {
						text : getLabel('yesterday', 'Yesterday'),
						btnId : 'btnYesterday',
						btnValue : '2',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					}, {
						text : getLabel('thisweek', 'This Week'),
						btnId : 'btnThisweek',
						btnValue : '3',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					}, {
						text : getLabel('lastweektodate', 'Last Week To Date'),
						btnId : 'btnLastweek',
						btnValue : '4',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					}, {
						text : getLabel('thismonth', 'This Month'),
						btnId : 'btnThismonth',
						btnValue : '5',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					}, {
						text : getLabel('lastMonthToDate', 'Last Month To Date'),
						btnId : 'btnLastmonth',
						btnValue : '6',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					}, {
						text : getLabel('thisquarter', 'This Quarter'),
						btnId : 'btnLastMonthToDate',
						btnValue : '8',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					}, {
						text : getLabel('lastQuarterToDate',
								'Last Quarter To Date'),
						btnId : 'btnQuarterToDate',
						btnValue : '9',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					}, {
						text : getLabel('thisyear', 'This Year'),
						btnId : 'btnLastQuarterToDate',
						btnValue : '10',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					}, {
						text : getLabel('lastyeartodate', 'Last Year To Date'),
						btnId : 'btnYearToDate',
						btnValue : '11',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					}]
		});
		return dropdownMenu;
	},
	eventFilterStore : function() {	
		var eventData = null;
		var objEventStore = null;
		var strUrl = 'eventCodes.srvc';			
		Ext.Ajax.request({
			url : strUrl + '?' + csrfTokenName + '=' + csrfTokenValue,
			async : false,
			method : "POST",
			success : function(response) {
				if (!Ext.isEmpty(response.responseText)) {
					var data = Ext.decode(response.responseText);
					if (data && data.d) {
						eventData = data.d.msgCenterAlert;						
						objEventStore = Ext.create('Ext.data.Store', {
									fields : ['eventDesc', 'eventDesc'],
									data : eventData,
									reader : {
										type : 'json',
										root : 'd.msgCenterAlert'
									},
									autoLoad : true,
									listeners : {
										load : function() {
											this.insert(0, {
														eventDesc : getLabel('select', 'Select')
													});
										}
									}
								});
						objEventStore.load();
					}
				}
			},
			failure : function(response) {
				// console.log('Error Occured');
			}
		});
		return objEventStore;
	}
});