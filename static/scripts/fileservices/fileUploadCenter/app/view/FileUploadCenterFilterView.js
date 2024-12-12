Ext.define('GCP.view.FileUploadCenterFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'fileUploadCenterFilterView',
	requires : [],
	width : '100%',
	componentCls : 'gradiant_back',
	collapsible : true,
	collapsed : true,
	cls : 'xn-ribbon ux_border-bottom',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		var me = this;
		fileUploadView = this;
		this.items = [{	  
		    xtype  : 'panel',
		    cls : 'xn-filter-toolbar',
		    layout : 'hbox',
			itemId : 'sellerClientMenuBar',
			items  : []
	   },{
			xtype : 'panel',
			layout : 'hbox',
			items : [{
				xtype : 'panel',
				cls : 'xn-filter-toolbar',
				layout : 'vbox',
				flex : 0.7,
				items : [{
					xtype : 'panel',
					layout : 'hbox',
					items : [{
								xtype : 'label',
								itemId : 'dateLabel',
								text : getLabel('uploadDate', 'Upload Date'),
								cls : 'f13 ux_font-size14 ux_paddingtl'
							}, {
								xtype : 'button',
								border : 0,
								filterParamName : 'uploadDateFilter',
								itemId : 'uploadDate',// Required
								cls: 'menu-disable xn-custom-arrow-button cursor_pointer ux_margint',
								glyph:'xf0d7@fontawesome',
								menu : Ext.create('Ext.menu.Menu', {
									items : [{
										text : getLabel( 'latest', 'Latest' ),
										btnId : 'btnLatest',
										btnValue : '12',
										parent : this,
										handler : function( btn, opts )
										{
											this.parent.fireEvent( 'dateChange', btn, opts );
										}
									},{
										text : getLabel('today', 'Today'),
										btnId : 'btnToday',
										btnValue : '1',
										parent : this,
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									}, {
										text : getLabel('yesterday',
												'Yesterday'),
										btnId : 'btnYesterday',
										btnValue : '2',
										parent : this,
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									}, {
										text : getLabel('thisweek', 'This Week'),
										btnId : 'btnThisweek',
										btnValue : '3',
										parent : this,
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									}, {
										text : getLabel('lastweek', 'Last Week To Date'),
										btnId : 'btnLastweek',
										parent : this,
										btnValue : '4',
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									}, {
										text : getLabel('thismonth',
												'This Month'),
										btnId : 'btnThismonth',
										parent : this,
										btnValue : '5',
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									}, {
										text : getLabel('lastmonth',
												'Last Month To Date'),
										btnId : 'btnLastmonth',
										btnValue : '6',
										parent : this,
										handler : function(btn, opts) {
											this.parent.fireEvent('dateChange',
													btn, opts);
										}
									},{
										text : getLabel('thisquarter','This Quarter'),
										btnId : 'btnLastMonthToDate',
										btnValue : '8',
										parent : this,
										handler : function(btn,opts) {
											this.parent.fireEvent('dateChange',btn,opts);
										}
									},
									{
										text :  getLabel('lastQuarterToDate', 'Last Quarter To Date'),
										btnId : 'btnQuarterToDate',
										btnValue : '9',
										parent : this,
										handler : function(btn,opts) {
											this.parent.fireEvent('dateChange',btn,opts);
										}
									},
									{
										text : getLabel('thisyear','This Year'),
										btnId : 'btnLastQuarterToDate',
										btnValue : '10',
										parent : this,
										handler : function(btn,opts) {
											this.parent.fireEvent('dateChange',btn,opts);
										}
									},{
										text : getLabel('lastyeartodate','Last Year To Date'),
										btnId : 'btnYearToDate',
										parent : this,
										btnValue : '11',
										handler : function(btn,opts) {
											this.parent.fireEvent('dateChange',btn,opts);
										}
									}, {
										text : getLabel('daterange',
												'Date Range'),
										btnId : 'btnDateRange',
										parent : this,
										btnValue : '7',
										handler : function(btn, opts) {
											//this.parent.fireEvent('dateChange',
											//		btn, opts);
											var field = me.down('datefield[itemId="fromDate"]');	
											if (field)
												field.setValue('');
											field = me.down('datefield[itemId="toDate"]');
											if (field)
												field.setValue('');
											this.parent.fireEvent('dateChange', btn, opts);
										}
									}]
								})

							}]
				}, {
					xtype : 'panel',
					layout : 'hbox',
					padding : '6 0 0 10',
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
											padding : '0 3 0 0',
											editable : false,
											//value : new Date(Ext.Date.parse(dtApplicationDate, strExtApplicationDateFormat))
											parent : me,
											//vtype : 'daterange',
											endDateField : 'toDate',
											format : !Ext.isEmpty(strExtApplicationDateFormat)
													? strExtApplicationDateFormat
													: 'm/d/Y'
										}, {
											xtype : 'datefield',
											itemId : 'toDate',
											hideTrigger : true,
											padding : '0 3 0 0',
											editable : false,
											width : 80,
											fieldCls : 'h2',
											//value : new Date(Ext.Date.parse(dtApplicationDate, strExtApplicationDateFormat))
											parent : me,
											//vtype : 'daterange',
											startDateField : 'fromDate',
											format : !Ext.isEmpty(strExtApplicationDateFormat)
													? strExtApplicationDateFormat
													: 'm/d/Y'
										}, {
											xtype : 'button',
											text : getLabel('goBtnText', 'Go'),
											cls : 'ux_button-background-color ux_button-padding',
											itemId : 'goBtn',
											height : 22
										}]
							}, {
								xtype : 'toolbar',
								itemId : 'dateToolBar',
								cls : 'xn-toolbar-small',
								padding : '2 0 0 1',
								items : [{
											xtype : 'label',
											itemId : 'dateFilterFrom',
											text : dtApplicationDate
										}, {
											xtype : 'label',
											itemId : 'dateFilterTo'
										}]
							}]
				}]
			},{
				xtype : 'panel',
				itemId : 'advFilterPanel',
				cls : 'xn-filter-toolbar',
				flex : 0.9,
				layout : {
					type : 'vbox'
				},
				items : [{
					xtype : 'panel',
					cls : 'ux_paddingtl',
					layout : {
						type : 'hbox'					
					},
					items : [{
								xtype : 'label',
								text : getLabel('advFilters',
										'Advance Filters'),
								cls : 'f13 ux_font-size14'
							},{
								xtype : 'button',
								itemId : 'newFilter',
								text : '<span class="button_underline thePointer">'
										+ getLabel('createNewFilter',
												'Create New Filter')
										+ '</span>',
								cls : 'xn-account-filter-btnmenu xn-small-button',
								margin : '0 0 0 10'
							}
							]
				}, {
					xtype : 'toolbar',
					itemId : 'advFilterActionToolBar',
					cls : 'xn-toolbar-small',
					padding : '7 0 12 1',
					width : '100%',
					enableOverflow : true,
					border : false,
					items : []
				}]
			}]
			
		}];
		this.callParent(arguments);
		me.on('afterrender', function(panel) {
			Ext.Ajax.request({
				url : 'services/userseek/userclients.json',
				method : 'POST',
				async : false,
				success : function(response) {
					if (response && response.responseText)
					{
						var data = Ext.decode(response.responseText);
						me.populateClientMenu(data);
					}
				},
				failure : function(response) {
					// console.log('Error Occured');
				}
			});
		});
		me.on('afterrender', function(panel) {
			var clientBtn = me.down('button[itemId="clientBtn"]');
		// Set Default Text When Page Loads
			if(clientBtn && prefClientDesc)
				clientBtn.setText(prefClientDesc);
			else
				clientBtn.setText(getLabel('allCompanies', 'All companies'));
			});	
	},
	populateClientMenu : function(data) {
		var me = this;
		var clientMenu = me.down('menu[itemId="clientMenu"]');
		var clientBtn = me.down('button[itemId="clientBtn"]');
		var filterClientMenuContainer = me
				.down('container[itemId="filterClientMenuContainer"]');
		var clientArray = data.d.preferences || [];
		clientMenu.add({
					text : getLabel('allCompanies', 'All companies'),
					btnDesc : getLabel('allCompanies', 'All companies'),
					code : 'all',
					handler : function(btn, opts) {
						clientBtn.setText(btn.text);
						me.clientCode = btn.code;
						me.fireEvent('handleClientChange', btn.code,
								btn.btnDesc);
					}
				});

		Ext.each(clientArray, function(client) {
					if(client.CODE === prefClientCode)	
						prefClientDesc = client.DESCR;
					clientMenu.add({
								text : client.DESCR,
								code : client.CODE,
								btnDesc : client.DESCR,
								handler : function(btn, opts) {
									clientBtn.setText(btn.text);
									me.clientCode = btn.code;
									me.fireEvent('handleClientChange',
											btn.code, btn.btnDesc);
								}
							});
				});
		if (null != clientArray && clientArray.length <= 1) {
			filterClientMenuContainer.hide();
		}

	},
	tools : [
		{
			xtype : 'container',
			itemId : 'filterClientMenuContainer',
			cls : 'paymentqueuespacer',
			padding : '0 0 0 5',
			hidden : entityType == 0 ? true : false,
			layout : {
				type : 'hbox'
			},
			items : [{
				xtype : 'label',
				margin : '3 0 0 0',
				html : '<i href="#" id="imgFilterInfo" class="icon-company largepadding"></i>'
			}, {
				xtype : 'button',
				border : 0,
				itemId : 'clientBtn',
				text : getLabel('allCompanies', 'All Companies'),
				cls : 'font_bold xn-custom-more-btn cursor_pointer x-zero-padding ux-custom-more-btn',
				menuAlign : 'b',
				menu : {
					xtype : 'menu',
					maxHeight : 180,
					width : 50,
					cls : 'ext-dropdown-menu xn-menu-noicon',
					itemId : 'clientMenu',
					items : []
				}
			}]
		},
		{
			xtype : 'container',
			itemId : 'filterClientAutoCmplterCnt',
			cls : 'paymentqueuespacer',
			padding : '0 0 0 5',
			hidden :  entityType == 1 ? true : false,
			layout : {
				type : 'hbox'
			},
			items : [{
				xtype : 'label',
				margin : '3 0 0 0',
				html : '<i href="#" id="imgFilterInfo" class="icon-company largepadding"></i>'
			}, 
			{
				xtype : 'AutoCompleter',
				fieldCls : 'xn-form-text w12 xn-suggestion-box',
				name : 'clientCode',
				itemId : 'clientCodeId',
				cfgUrl : 'services/userseek/userclients.json',
				cfgQueryParamName : '$autofilter',
				cfgRecordCount : -1,
				cfgSeekId : 'clientCodeSeek',
				cfgRootNode : 'd.preferences',
				cfgDataNode1 : 'DESCR',
				cfgKeyNode : 'CODE',
				cfgProxyMethodType : 'POST',
				listeners : {
				'select' : function(combo, record) {
					strClient = combo.getValue();
					strClientDesc = combo.getRawValue();
					/*
					 * me.fireEvent('clientComboSelect', combo, record);
					 */
					fileUploadView.fireEvent('handleClientCodeChange', strClient,
							strClientDesc);
				},
				'change' : function(combo, newValue, oldValue, eOpts) {
					if (Ext.isEmpty(newValue)) {
						fileUploadView.fireEvent('resetClientChange');
					}
				}				
			}
			}]
		},
		{
			xtype : 'container',
			padding : '0 9 0 0',
			layout : 'hbox',
			items : [
			{
				xtype : 'label',
				text : getLabel('preferences', 'Preferences : '),
				cls : 'xn-account-filter-btnmenu',
				padding : '2 0 0 0'
			}, {
				xtype : 'button',
				itemId : 'btnClearPreferences',
				disabled : true,
				text : getLabel('clearFilter', 'Clear'),
				cls : 'xn-account-filter-btnmenu',
				textAlign : 'right',
				width : 40
			}, {
				xtype : 'image',
				src : 'static/images/icons/icon_spacer.gif',
				height : 18
			}, {
				xtype : 'button',
				itemId : 'btnSavePreferences',
				disabled : true,
				text : getLabel('saveFilter', 'Save'),
				cls : 'xn-account-filter-btnmenu',
				textAlign : 'right',
				width : 30
			}     
		]
	}
     ]
});