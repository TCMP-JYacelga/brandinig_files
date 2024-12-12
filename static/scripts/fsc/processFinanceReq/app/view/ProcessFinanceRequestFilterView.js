/**
 * @class GCP.view.ProcessFinanceRequestFilterView
 * @extends Ext.panel.Panel
 * @author Preeti Kapade
 */
Ext.define('GCP.view.ProcessFinanceRequestFilterView',
{
	extend : 'Ext.panel.Panel',	
	xtype  : 'processFinanceRequestFilterView',
requires : ['Ext.menu.Menu', 'Ext.container.Container',
			'Ext.toolbar.Toolbar', 'Ext.button.Button', 'Ext.panel.Panel',
			'Ext.ux.gcp.AutoCompleter','Ext.menu.DatePicker','Ext.form.field.Date','Ext.form.field.VTypes'],
	width : '100%',
	componentCls : 'gradiant_back',
	collapsible : true,
	collapsed : true,
	cls : 'xn-ribbon',
	layout :
	{
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function()
	{
		var me=this;
		var storeData = null;
		var finReqDateFlex = 0.05;
		var finReqStatusFlex = 0.04;
		var searchBtnFlex = 0.01;
		var multipleSellersAvailable = false;
		var statusStore = Ext.create('Ext.data.Store', {
			fields : ["name", "value"],
			data : [{
				"name" : "All",
				"value" : "All"
			},{
				"name" : "0",
				"value" : "New"
			},{
				"name" : "1",
				"value" : "For RM Action"
			},{
				"name" : "2",
				"value" : "For Approval"
			}]
			
		});
		
		if(entity_type === '0')
		{
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
		}
		
		var objStore = Ext.create('Ext.data.Store', {
					fields : ['CODE', 'DESCR'],
					data : storeData,
					reader : {
						type : 'json',
						root : 'preferences'
					}
				});
		if(objStore.getCount() > 1){
			multipleSellersAvailable = true;
			finReqDateFlex = 0.05;
			finReqStatusFlex = 0.05;
			searchBtnFlex = 0.05;
		    }
		
		this.items=[{
			xtype : 'panel',
			itemId : 'mainContainer',
			layout : 'hbox',
			cls: 'ux_border-top ux_largepadding',
			items :[//Panel 1
					{
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						itemId : 'financialInsttitutionPanel',
						hidden : !multipleSellersAvailable,
						flex : 0.05,
						layout :
						{
							type : 'vbox'
						},
						items :
						[
							{
								xtype : 'label',
								text : getLabel( 'financialInsttitution', 'Financial Institution' ),
								cls : 'frmLabel required'
							},
							{
								xtype : 'combo',
								displayField : 'DESCR',
								fieldCls : 'xn-form-field inline_block',
								triggerBaseCls : 'xn-form-trigger',
								filterParamName : 'sellerId',
								itemId : 'sellerFltId',
								valueField : 'CODE',
								name : 'sellerCombo',
								editable : false,
								value :strSellerId,
								store : objStore,
								listeners : {
									'render' : function(combo, record) {
										combo.store.load();
									},
									'select' : function(combo, strNewValue, strOldValue) {
										setAdminSeller(combo.getValue());
										//me.fireEvent('handleChangeFilter', combo, strNewValue, strOldValue);
									}
								}
							}
						]
					},
					//Panel 2
					{
			    	xtype : 'panel',
					cls : 'xn-filter-toolbar',
					flex : 0.05,
					layout : 'vbox',
					//columnWidth : 0.22,
					items :[
					    {
							xtype : 'label',
							text : getLabel('anchorClient', 'Anchor Client'),
							cls : 'frmLabel'
							//flex : 0.20
						},{
							xtype : 'AutoCompleter',
							matchFieldWidth : true,
							fieldCls : 'xn-form-text w14 xn-suggestion-box',
							labelSeparator : '',
							name : 'anchorClientDesc',
							itemId : 'anchorClient',
							cfgUrl : 'services/userseek/anchorClientSeek.json',
							cfgQueryParamName : '$autofilter',
							cfgRecordCount : -1,
							cfgSeekId : 'anchorClientSeek',
							cfgRootNode : 'd.preferences',
							cfgDataNode1 : 'DESCR',
							//cfgDataNode2 : 'CODE',
							cfgKeyNode : 'CODE',
							enableQueryParam:false,
							cfgStoreFields :['CODE','DESCR'],
							listeners : {
							'select' : function(combo, record) {
								strClientId = combo.getValue();
								strClientDesc = combo.getRawValue();
							}
							}
						}]
			    },
				//Panel 3
				{
			    	xtype : 'panel',
					cls : 'xn-filter-toolbar',
					flex : 0.05,
					layout : 'vbox',
					//columnWidth : 0.22,
					items :[
					    {
							xtype : 'label',
							text : getLabel('fscProduct', 'Package'),
							cls : 'frmLabel'
							//flex : 0.20
						},{
							xtype : 'AutoCompleter',
							matchFieldWidth : true,
							fieldCls : 'xn-form-text w14 xn-suggestion-box',
							labelSeparator : '',
							name : 'fscProductDesc',
							itemId : 'fscProduct',
							cfgUrl : 'services/userseek/fscProductSeek.json',
							cfgQueryParamName : '$autofilter',
							cfgRecordCount : -1,
							cfgSeekId : 'fscProductSeek',
							cfgRootNode : 'd.preferences',
							cfgDataNode1 : 'DESCR',
							//cfgDataNode2 : 'DESCR',	
							cfgKeyNode : 'CODE',
							enableQueryParam:false,
							cfgStoreFields :['CODE','DESCR'],
							listeners : {
								'select' : function(combo, record) {
									strProduct = combo.getValue();
								}
							}
						}]
			    },
				//Panel 4
				{
					xtype : 'panel',
					cls : 'xn-filter-toolbar',
					flex : 0.05,
					layout : 'vbox',
					//columnWidth : 0.22,
					items :
					[{
						xtype : 'label',
						text : getLabel('counterParty', 'Counterparty'),
						cls : 'frmLabel'
						//flex : 0.20
					},{
						xtype : 'AutoCompleter',
						matchFieldWidth : true,
						fieldCls : 'xn-form-text w14 xn-suggestion-box',
						labelSeparator : '',
						name : 'counterPartyDesc',
						itemId : 'counterParty',
						cfgUrl : 'services/userseek/counterPartySeek.json',
						cfgQueryParamName : '$autofilter',
						cfgRecordCount : -1,
						cfgSeekId : 'counterPartySeek',
						cfgRootNode : 'd.preferences',
						cfgDataNode1 : 'DESCR',
						//cfgDataNode2 : 'DESCR',
						cfgKeyNode : 'CODE',
						enableQueryParam:false,
						cfgStoreFields :['CODE','DESCR'],
						listeners : {
							'select' : function(combo, record) {
								strCounterParty = combo.getValue();
							}
						}
					}]
				}]
		},
		{
			xtype : 'panel',
			layout : 'hbox',
			cls: 'ux_largepadding',
			items :
			[
			//Panel 1
			{
				xtype : 'panel',
				cls : 'xn-filter-toolbar',
				flex : finReqDateFlex,
				layout : 'vbox',
				//columnWidth : 0.22,
				items :
				[
				{
					xtype : 'panel',
					//flex : 0.25,
					layout : 'hbox',
					items :
					[{
						xtype : 'label',
						itemId : 'dateLabel',
						text : getLabel('finReqDate', 'Finance Request Date'),
						cls : 'frmLabel'
						//flex : 0.25,
						//padding : '0 00 0 0',
					},{
						xtype : 'button',
						border : 0,
						filterParamName : 'FinReqDate',
						itemId : 'finReqDate',
						cls : 'menu-disable xn-custom-arrow-button cursor_pointer',
						glyph : 'xf0d7@fontawesome',
						padding : '0 0 0 0',
						menu : me.createDateFilterMenu()
					}]
				},
				me.addDateContainerPanel()
				]
			
			},
			//Panel 2
			{
				xtype : 'panel',
				cls : 'xn-filter-toolbar',
				flex : 0.05,
				layout : 'vbox',
				//columnWidth : 0.22,
				items :
				[{
					xtype : 'label',
					text : getLabel('finReqRefNo', 'Finance Request Ref. No.'),
					cls : 'frmLabel'
					//flex : 0.20
				},{
					xtype : 'AutoCompleter',
					matchFieldWidth : true,
					fieldCls : 'xn-form-text w14 xn-suggestion-box',
					labelSeparator : '',
					name : 'finReqRefNoDesc',
					itemId : 'finReqRefNo',
					cfgUrl : 'services/userseek/finReqRefNoSeek.json',
					cfgQueryParamName : '$autofilter',
					cfgRecordCount : -1,
					cfgSeekId : 'finReqRefNoSeek',
					cfgRootNode : 'd.preferences',
					cfgDataNode1 : 'CODE',
					cfgKeyNode : 'CODE',
					enableQueryParam:false,
					cfgStoreFields :['CODE','DESCR'],
					listeners : {
						'change' : function(combo, strNewValue, strOldValue) {
							//me.fireEvent('handleChangeFilter', combo, strNewValue, strOldValue);
						}
					}
				}]
			},
			//Panel 3
				{
					xtype : 'panel',
					cls : 'xn-filter-toolbar',
					flex : finReqStatusFlex,
					layout :
					{
						type : 'vbox'
					},
					items :
					[
						{
							xtype : 'label',
							text : getLabel( 'status', 'Status' ),
							cls : 'frmLabel'
						},
						{
							xtype : 'combobox',
							fieldCls : 'xn-form-field inline_block',
							triggerBaseCls : 'xn-form-trigger',
							matchFieldWidth : true,
							itemId : 'statusCombo',
							store : statusStore,
							valueField : 'name',
							displayField : 'value',
							editable : false,
							value : getLabel( 'all', 'ALL' ),
							parent : this
						}
					]
				},//Panel 4
				{
					xtype : 'panel',
					cls : 'xn-filter-toolbar',
					layout : 'vbox',
					flex : searchBtnFlex,
					columnWidth : 0.15,
					items :
					[
						{
							xtype : 'panel',
							layout : 'hbox',
							padding : '23 0 1 0',
							items :
							[
								{
									xtype : 'button',
									itemId : 'btnFilter',
									text : getLabel( 'search', 'Search' ),
									cls : 'ux_button-padding ux_button-background ux_button-background-color',
									height : 22
								}
							]
						}
					]
				}
			]
		}];
		this.callParent( arguments );
	},
	createDateFilterMenu : function() {
		var me = this;
		var menu = null;
						
		var arrMenuItem = [
				];
		
		arrMenuItem.push({
					text : getLabel('latest', 'Latest'),
					btnId : 'btnLatest',
					parent : this,
					btnValue : '12',
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
		
			arrMenuItem.push({
						text : getLabel('yesterday', 'Yesterday'),
						btnId : 'btnYesterday',
						btnValue : '2',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		
			arrMenuItem.push({
						text : getLabel('thisweek', 'This Week'),
						btnId : 'btnThisweek',
						btnValue : '3',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		
			arrMenuItem.push({
						text : getLabel('lastweektodate', 'Last Week To Date'),
						btnId : 'btnLastweek',
						parent : this,
						btnValue : '4',
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		
			arrMenuItem.push({
						text : getLabel('thismonth', 'This Month'),
						btnId : 'btnThismonth',
						parent : this,
						btnValue : '5',
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		
			arrMenuItem.push({
						text : getLabel('lastMonthToDate', 'Last Month To Date'),
						btnId : 'btnLastmonth',
						btnValue : '6',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		
			arrMenuItem.push({
						text : getLabel('thisquarter', 'This Quarter'),
						btnId : 'btnLastMonthToDate',
						btnValue : '8',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		
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
		
			arrMenuItem.push({
						text : getLabel('thisyear', 'This Year'),
						btnId : 'btnLastQuarterToDate',
						btnValue : '10',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		
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
						var field = me.down('datefield[itemId="fromDate"]');	
						if (field)
							field.setValue('');
						field = me.down('datefield[itemId="toDate"]');
						if (field)
							field.setValue('');
						this.parent.fireEvent('dateChange', btn, opts);

					}
				});

		menu = Ext.create('Ext.menu.Menu', {
					items : arrMenuItem
				});
		return menu;
	},
	addDateContainerPanel : function() {
		var me = this;
		var dateContainerPanel = Ext.create('Ext.panel.Panel', {
					layout : 'hbox',
					padding : '0 0 0 8',
					items : [{
						xtype : 'container',
						itemId : 'dateRangeComponent',
						layout : 'hbox',
						hidden : true,
						items : [{
							xtype : 'datefield',
							itemId : 'fromDate',  
							hideTrigger : true,
							width : 80,
							fieldCls : 'h2',
							cls : 'date-range-font-size',
							//padding : '0 3 0 0',
							editable : false,
							parent : me,
							vtype : 'daterange',
							endDateField : 'toDate',
							format : !Ext.isEmpty(strExtApplicationDateFormat)
									? strExtApplicationDateFormat
									: 'm/d/Y',							
							listeners : {
								'change' : function(field, newValue, oldValue) {
									if (!Ext.isEmpty(newValue)) {
										Ext.form.field.VTypes.daterange(
												newValue, field);
									}
								}
							}
						}, {
							xtype : 'datefield',
							itemId : 'toDate',
							hideTrigger : true,
							padding : '0 3 0 0',
							editable : false,
							width : 80,
							fieldCls : 'h2',
							cls : 'date-range-font-size',
							parent : me,
							vtype : 'daterange',
							startDateField : 'fromDate',
							format : !Ext.isEmpty(strExtApplicationDateFormat)
									? strExtApplicationDateFormat
									: 'm/d/Y',
							listeners : {
								'change' : function(field, newValue, oldValue) {
									if (!Ext.isEmpty(newValue)) {
										Ext.form.field.VTypes.daterange(
												newValue, field);
									}
								}
							}
						}]
					}, {
						xtype : 'toolbar',
						itemId : 'dateToolBar',
						cls : 'xn-toolbar-small',
						//padding : '2 0 0 1',
						items : [{
									xtype : 'label',
									itemId : 'dateFilterFrom'
									//text : dtApplicationDate
								}, {
									xtype : 'label',
									itemId : 'dateFilterTo'
								}]
					}]
				});
		return dateContainerPanel;
	}
});