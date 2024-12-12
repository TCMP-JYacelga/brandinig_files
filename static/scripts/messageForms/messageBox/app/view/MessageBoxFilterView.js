Ext.define( 'GCP.view.MessageBoxFilterView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'messageBoxFilterView',
	requires : [],
	width : '100%',
	//padding : '0 0 12 0',
	componentCls : 'gradiant_back',
	cls : 'xn-ribbon ux_border-bottom',
	layout :
	{
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function()
	{
		var me = this;
	 var objSellerStore = Ext.create('Ext.data.Store', {
             fields: ['sellerCode', 'description'],
             proxy: {
                 type: 'ajax',
                 autoLoad: true,
                 url: 'services/sellerListFltr.json'
             }
         });
		 var objClientStore = Ext.create('Ext.data.Store', {
		   fields: ['clientId', 'clientDescription'],
		   proxy: {
			   type: 'ajax',
			   autoLoad: true,
			   url: 'services/clientList.json'
		   }
	   });
		if(entity_type === '0')
		{
			var clientSeekUrl = 'services/userseek/adminMsgCentrClientSeek.json';
			var padding = '0 0 0 10';
			var searchFlex =  1.1;
		}
		else
		{
			var clientSeekUrl = 'services/userseek/custMsgCentrClientSeek.json';
			var padding = '0 0 0 6';
			var searchFlex =  1.5;
		}
		this.items =
		[{	  
		    xtype  : 'panel',
		    hidden : true,
		    cls : 'xn-filter-toolbar ux_largepadding',
		    layout : 'hbox',
			itemId : 'sellerClientMenuBar',
			items  : [{
				xtype : 'panel',
				itemId : 'sellerMenuBar',
				cls : 'xn-filter-toolbar',
				layout : 'vbox',
				align : 'stretch',
				flex : 0.9,
				items : [{
							xtype : 'label',
							text : getLabel('seller','Financial Institution'),
							cls : 'frmLabel'
						}, {
								xtype : 'combo',
								width : 196,
								displayField : 'description',
								fieldCls : 'xn-form-field inline_block',
								triggerBaseCls : 'xn-form-trigger ux_width17',
								filterParamName : 'sellerCode',
								itemId : 'sellerCodeID',
								valueField : 'sellerCode',
									name : 'sellerCode',
									editable : false,
									store : objSellerStore,
									listeners : {
										'render' : function(combo, record) {
														combo.setValue(sessionSellerCode);     
														combo.store.load();
										}
									}
							}]
			    },{
					xtype : 'panel',
					itemId : 'clientMenuBar',
					cls : 'xn-filter-toolbar',
					layout : 'vbox',
					align : 'stretch',
					flex : 0.7,
					items : [{
								xtype : 'label',
								text : getLabel('client', 'Client'),
								cls : 'frmLabel'
							}, {
								xtype : 'AutoCompleter',
								fieldCls : 'w14',
								matchFieldWidth : true,
								cls : 'autoCmplete-field',
								labelSeparator : '',
								name : 'clientCode',
								itemId : 'clientCodeId',
								cfgUrl : clientSeekUrl,
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'clientCodeSeek',
								cfgRootNode : 'd.preferences',
								cfgKeyNode : 'CODE',
								cfgDataNode1 : 'DESCR',
								cfgStoreFields:['CODE','DESCR'],
								cfgProxyMethodType : 'POST'
							}]
					},{
					xtype : 'panel',
				itemId : 'clientLoginMenuBar',
				cls : 'xn-filter-toolbar',
				layout : 'vbox',
				align : 'stretch',
				flex : 0.9,
				items : [{
							xtype : 'label',
							text : getLabel('client', 'Client'),
							cls : 'frmLabel',
							padding : '0 0 0 6'
						}, {
									xtype : 'combo',
									width : 250,
									displayField : 'clientDescription',
									fieldCls : 'xn-form-field inline_block',
									triggerBaseCls : 'xn-form-trigger',
									itemId : 'clientCodeComboId',
									filterParamName : 'clientId',
									valueField : 'clientId',
									name : 'clientId',
									editable : false,
									store : objClientStore
									/*listeners : {
										'render' : function(combo, record) {
														combo.setValue(sessionClientCode);     
														combo.store.load();
										}
									}*/
						}]
			    }/*,{
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						layout : 'vbox',
						align : 'stretch',
						flex : searchFlex,
						padding : '20 120 10 100',
						items : [{
									xtype : 'button',
									padding : '0 0 0 0',
									itemId : 'filterBtnId',
									cls : 'ux_button-background-color ux_button-padding',
									text : 'Search'
							}]
			    }*/]
	   },
			{
				xtype : 'panel',
				layout : 'hbox',
				//cls : 'ux_largepadding-bottom ux_largepadding-left ux_largepadding-right',
				cls : 'ux_largepadding',
				items :
				[
					/*{

						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						//flex : 0.8,
						flex : 0.2,
						layout :
						{
							type : 'vbox'
						},
						items :
						[
							{
								xtype : 'label',
								text : getLabel( 'status', 'Status' ),
								cls : 'ux_font-size14 ux_padding0060',
								flex : 1
							},
							{
								xtype : 'toolbar',
								itemId : 'messageInboxStatusToolBar',
								filterParamName : 'messageStatus',
								cls : 'xn-toolbar-small ux_no-padding',
								border : false,
								componentCls : 'xn-btn-default-toolbar-small xn-custom-more-toolbar',
								items :
								[
									{
										text : getLabel( 'all', 'All' ),
										code : 'All',
										btnId : 'allstatus',
										btnValue : 'All',
										parent : this,
										cls : 'f13 xn-custom-heighlight ux_no-padding',
										handler : function( btn, opts )
										{
											this.parent.fireEvent( 'filterMessageStatus', btn, opts );
										}
									},
									{
										border : 0,
										text : getLabel( 'read', 'Read' ),
										btnId : 'readMessage',
										btnValue : 'Y',
										parent : this,
										cls : 'xn-account-filter-btnmenu cursor_pointer',
										padding : '4 0 0 5',
										handler : function( btn, opts )
										{
											this.parent.fireEvent( 'filterMessageStatus', btn, opts );
										}
									},
									{
										border : 0,
										text : getLabel( 'unread', 'Unread' ),
										btnId : 'unreadMessage',
										btnValue : 'N',
										parent : this,
										cls : 'xn-account-filter-btnmenu cursor_pointer',
										padding : '4 0 0 5',
										handler : function( btn, opts )
										{
											this.parent.fireEvent( 'filterMessageStatus', btn, opts );
										}
									}
								]
							}
						]
					},
					{
						xtype : 'panel',
						itemId : 'formDestinationFilterPanelItemId',
						cls : 'xn-filter-toolbar',
						hidden : entity_type == 1 ? true : false,
						//flex : 0.8,
						flex : 0.25,
						layout :
						{
							type : 'vbox'
						},
						items :
						[
							{
								xtype : 'panel',
								layout :
								{
									type : 'hbox'
								},
								items :
								[
									{
										xtype : 'label',
										text : getLabel( 'lbl.messageForm.formDestination', 'Form Destination' ),
										cls : 'frmLabel'
									}
								]
							},
							{
								xtype : 'toolbar',
								itemId : 'formDestinationFilterActionToolBarItemId',
								cls : 'xn-toolbar-small ux_no-padding',
								width : '100%',
								enableOverflow : true,
								border : false,
								items :
								[
									{
										text : getLabel( 'lbl.messageForm.all', 'All' ),
										code : 'all',
										btnId : 'allDestinations',
										btnValue : 'all',
										parent : this,
										cls : 'f13 xn-custom-heighlight ux_no-padding',
										handler : function( btn, opts )
										{
											this.parent.fireEvent( 'filterFormDestination', btn, opts );
										}
									},
									{
										xtype : 'label',
										height : 15,
										width : 2
									},
									{
										xtype : 'button',
										border : 0,
										filterParamName : 'formDestination',
										itemId : 'moreFormDestinationItemId',// Required
										text : getLabel( 'moreText', 'more' ) + '<span class="extrapadding">' + '>>'
											+ '</span>',
										//cls : 'xn-custom-arrow-button cursor_pointer w1',
										cls : 'x-btn-default1-toolbar-small .x-btn-arrow',
										padding : '0 0 0 0',
										menu : Ext.create( 'Ext.menu.Menu',
										{
											items : []
										} )
									}
								]
							}
						]
					},*/
					{
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						layout : 'vbox',
						//flex : 0.8,
						flex : 0.2,
						items :
						[
							{
								xtype : 'panel',
								layout : 'hbox',
								items :
								[
									{
										xtype : 'label',
										itemId : 'dateLabel',
										text : 'Message Date',
										//padding : '0 0 6 4',
										cls : 'ux_font-size14 ux_padding0060'
									},
									{
										xtype : 'button',
										border : 0,
										filterParamName : 'MessageDate',
										itemId : 'messageDate',// Required
										cls : 'menu-disable xn-custom-arrow-button cursor_pointer',
										glyph : 'xf0d7@fontawesome',
										menu : Ext.create( 'Ext.menu.Menu',
										{
											items :
											[
												{
													text : getLabel('latest', 'Latest'),
													btnId : 'btnLatest',
													btnValue : '12',
													parent : this,
													handler : function(btn, opts) {
														this.parent.fireEvent('dateChange',
																btn, opts);
													}
												},
												{
													text : getLabel( 'today', 'Today' ),
													btnId : 'btnToday',
													btnValue : '1',
													parent : this,
													handler : function( btn, opts )
													{
														this.parent.fireEvent( 'dateChange', btn, opts );
													}
												},
												{
													text : getLabel( 'yesterday', 'Yesterday' ),
													btnId : 'btnYesterday',
													btnValue : '2',
													parent : this,
													handler : function( btn, opts )
													{
														this.parent.fireEvent( 'dateChange', btn, opts );
													}
												},
												{
													text : getLabel( 'thisweek', 'This Week' ),
													btnId : 'btnThisweek',
													btnValue : '3',
													parent : this,
													handler : function( btn, opts )
													{
														this.parent.fireEvent( 'dateChange', btn, opts );
													}
												},
												{
													text : getLabel( 'lastweektodate', 'Last Week To Date' ),
													btnId : 'btnLastweek',
													parent : this,
													btnValue : '4',
													handler : function( btn, opts )
													{
														this.parent.fireEvent( 'dateChange', btn, opts );
													}
												},
												{
													text : getLabel( 'thismonth', 'This Month' ),
													btnId : 'btnThismonth',
													parent : this,
													btnValue : '5',
													handler : function( btn, opts )
													{
														this.parent.fireEvent( 'dateChange', btn, opts );
													}
												},
												{
													text : getLabel( 'lastMonthToDate', 'Last Month To Date' ),
													btnId : 'btnLastmonth',
													btnValue : '6',
													parent : this,
													handler : function( btn, opts )
													{
														this.parent.fireEvent( 'dateChange', btn, opts );
													}
												},
												{
													text : getLabel( 'thisquarter', 'This Quarter' ),
													btnId : 'btnLastMonthToDate',
													btnValue : '8',
													parent : this,
													handler : function( btn, opts )
													{
														this.parent.fireEvent( 'dateChange', btn, opts );
													}
												},
												{
													text : getLabel( 'lastQuarterToDate', 'Last Quarter To Date' ),
													btnId : 'btnQuarterToDate',
													btnValue : '9',
													parent : this,
													handler : function( btn, opts )
													{
														this.parent.fireEvent( 'dateChange', btn, opts );
													}
												},
												{
													text : getLabel( 'thisyear', 'This Year' ),
													btnId : 'btnLastQuarterToDate',
													btnValue : '10',
													parent : this,
													handler : function( btn, opts )
													{
														this.parent.fireEvent( 'dateChange', btn, opts );
													}
												},
												{
													text : getLabel( 'lastyeartodate', 'Last Year To Date' ),
													btnId : 'btnYearToDate',
													parent : this,
													btnValue : '11',
													handler : function( btn, opts )
													{
														this.parent.fireEvent( 'dateChange', btn, opts );
													}
												},
												{
													text : getLabel( 'daterange', 'Date Range' ),
													btnId : 'btnDateRange',
													parent : this,
													btnValue : '7',
													handler : function( btn, opts )
													{
														this.parent.fireEvent( 'dateChange', btn, opts );
													}
												}
											]
										} )

									}
								]
							},
							{
								xtype : 'panel',
								layout : 'hbox',
								items :
								[
									{
										xtype : 'container',
										itemId : 'dateRangeComponent',
										layout : 'hbox',
										hidden : true,
										items :
										[
											{
												xtype : 'datefield',
												itemId : 'fromDate',
												hideTrigger : true,
												width : 80,
												fieldCls : 'h2',
												padding : '0 3 0 0',
												editable : false,
												value : new Date( Ext.Date.parse( dtApplicationDate,
													strExtApplicationDateFormat ) )
											},
											{
												xtype : 'datefield',
												itemId : 'toDate',
												hideTrigger : true,
												padding : '0 3 0 0',
												editable : false,
												width : 80,
												fieldCls : 'h2',
												value : new Date( Ext.Date.parse( dtApplicationDate,
													strExtApplicationDateFormat ) )
											},
											{
												xtype : 'button',
												text : getLabel( 'goBtnText', 'Go' ),
												cls : 'ux_button-background-color ux_button-padding',
												itemId : 'goBtn',
												height : 22
											}
										]
									},
									{
										xtype : 'toolbar',
										itemId : 'dateToolBar',
										cls : 'xn-toolbar-small',
										padding : '2 0 0 1',
										items :
										[
											{
												xtype : 'label',
												itemId : 'dateFilterFrom',
												text : dtApplicationDate
											},
											{
												xtype : 'label',
												itemId : 'dateFilterTo'
											}
										]
									}
								]
							}
						]
					},{
						xtype : 'panel',
						cls : 'xn-filter-toolbar ux_hide-image',
						layout : 'vbox',
						align : 'stretch',
						//flex : searchFlex,
						flex : 0.2,
						//padding : '20 120 10 100',
						items : [{
									xtype : 'button',
									padding : '0 0 0 0',
									itemId : 'filterBtnId',
									cls : 'ux_button-background-color ux_button-padding',
									text : 'Search'
							}]
			    	}
				]
			}

		];
		this.callParent( arguments );
		me.on('afterrender', function(panel) {
			Ext.Ajax.request({
				url : 'services/userseek/userclients.json&$sellerCode='
						+ sessionSellerCode,
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
			var clientBtn = me.down('button[itemId="clientBtn"]');
			// Set Default Text When Page Loads
			/*if (clientBtn && clientDesc) 
				clientBtn.setText(clientDesc);
			if(clientBtn && prefClientDesc)
				clientBtn.setText(prefClientDesc);	
			else if(clientBtn && !prefClientDesc && !clientDesc)
				clientBtn.setText(getLabel('allCompanies', 'All companies'));*/
				if(clientBtn)
				clientBtn.setText(getLabel('allCompanies', 'All companies'));
				
			});
	},
	highlightSavedStatus : function(strFilterCode) {
		var me = this;
		var objToolbar = me.down('toolbar[itemId="messageInboxStatusToolBar"]');
		if (objToolbar) {
			objToolbar.items.each(function(item) {
						item.removeCls('xn-custom-heighlight');
						if (item.btnValue === strFilterCode)
							item.addCls('xn-custom-heighlight');
					});
		}
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
	tools :
	[
		{
			xtype : 'container',
			itemId : 'filterClientMenuContainer',
			cls : 'paymentqueuespacer',
			padding : '0 0 0 5',
			hidden :  entity_type == 0 ? true : false,
			layout : {
				type : 'hbox'
			},
			items : [{
				xtype : 'label',
				margin : '4 0 0 0',
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
			hidden :  entity_type == 1 ? true : false,
			layout : {
				type : 'hbox'
			},
			items : [{
				xtype : 'label',
				margin : '4 0 0 0',
				html : '<i href="#" id="imgFilterInfo" class="icon-company largepadding"></i>'			
			}, 
			{
				xtype : 'AutoCompleter',
				fieldCls : 'xn-form-text w12 xn-suggestion-box',
				matchFieldWidth : true,
				cls : 'autoCmplete-field',
				labelSeparator : '',
				name : 'clientCode',
				itemId : 'clientCodeId',
				//cfgUrl : clientSeekUrl,
				cfgUrl : entity_type == 0 ? 'services/userseek/adminMsgCentrClientSeek.json' : 'services/userseek/custMsgCentrClientSeek.json',
				cfgQueryParamName : '$autofilter',
				cfgRecordCount : -1,
				cfgSeekId : 'clientCodeSeek',
				cfgRootNode : 'd.preferences',
				cfgKeyNode : 'CODE',
				cfgDataNode1 : 'DESCR',
				cfgStoreFields:['CODE','DESCR'],
				cfgProxyMethodType : 'POST'
			}]
		},
		{
			xtype : 'label',
			text  : getLabel('preferences','Preferences : '),
			cls : 'xn-account-filter-btnmenu'
		},{
			xtype : 'button',
			itemId : 'btnClearPreferences',
			disabled : true,
			text : getLabel('clearFilter', 'Clear'),
			cls : 'xn-account-filter-btnmenu',
			textAlign : 'right',
			width : 40
		},{
			xtype : 'image',
			src : 'static/images/icons/icon_spacer.gif',
			height : 18
		},{
			xtype : 'button',
			itemId : 'btnSavePreferences',
			disabled : true,
			text : getLabel( 'saveFilter', 'Save' ),
			cls : 'xn-account-filter-btnmenu',
			textAlign : 'right',
			width : 30
		}
	]
} );
