Ext.define( 'GCP.view.MessageSentFilterView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'messageSentFilterView',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	width : '100%',
	//componentCls : 'gradiant_back',
	//cls : 'xn-ribbon ux_border-bottom',
	layout :
	{
		type : 'vbox',
		align : 'stretch'
		
	},
	initComponent : function()
	{
		var me = this;
		var clientStore = Ext.create('Ext.data.Store', {
					fields : ['CODE', 'DESCR']
				});
		if(entity_type === '0')
		{
			var clientSeekUrl = 'services/userseek/adminMsgCentrClientSeek.json';
			var padding = '0 0 0 60';
			var searchFlex = 0.0;
		}
		else
		{
			var clientSeekUrl = 'services/userseek/custMsgCentrClientSeek.json';
			var padding = '0 0 0 6';
			var searchFlex = 1.9;
		}
		 var objSellerStore = Ext.create('Ext.data.Store', {
             fields: ['sellerCode', 'description'],
             proxy: {
                 type: 'ajax',
                 autoLoad: true,
                 actionMethods:{read:'POST'},
                 noCache:false,
                 url: 'services/sellerListFltr.json'
             }
         });
		 var objClientStore = Ext.create('Ext.data.Store', {
			   fields: ['clientId', 'clientDescription'],
			   proxy: {
				   type: 'ajax',
				   noCache:false,
				   actionMethods:{read:'POST'},
				   autoLoad: true,
				   url: 'services/clientList.json'
			   }
		   });
		this.items =
		[
			{	  
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
				//flex : 0.8,
				flex : 0.9,
				items : [{
							xtype : 'label',
							text : getLabel('seller','Financial Institution'),
							cls : 'frmLabel'
						}, 	{
										xtype : 'combo',
										width : 196,
										//cls:'ux_normalmargin-top ux_largepadding-left',
										displayField : 'description',
										fieldCls : 'xn-form-field inline_block',
										triggerBaseCls : 'xn-form-trigger ux_width17',
										filterParamName : 'seller',
										itemId : 'sellerCodeID',
										valueField : 'sellerCode',
										name : 'sellerCombo',
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
						itemId : 'clientLoginMenuBar',
						cls : 'xn-filter-toolbar',
						layout : 'vbox',
						align : 'stretch',
						flex : 0.8,
						items : [{
									xtype : 'label',
									text : getLabel('client', 'Company Name'),
									cls : 'frmLabel'
								}, {
											xtype : 'combo',
											width : 194,
											displayField : 'clientDescription',
											fieldCls : 'xn-form-field inline_block',
											triggerBaseCls : 'xn-form-trigger ux_width17',
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
					    }
					    /*{
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						layout : 'vbox',
						//align : 'stretch',
						flex : searchFlex,
						padding : '20 80 10 0',
						items : [{
									xtype : 'button',
									padding : '0 0 0 0',
									itemId : 'filterBtnId',
									cls : 'ux_button-background-color ux_button-padding',
									text : 'Search'
									//height : 20
							}]
			    }*/]
	   },
	   
	   {
			xtype : 'container',
			itemId : 'filterClientMenuContainer',
			hidden :  entity_type == 0 ? true : false,
			layout : 'vbox',
			items : [{
				xtype : 'label',
				text : getLabel('company', 'Company Name')
			}, {
			
							xtype : 'combo',
							valueField : 'CODE',
							displayField : 'DESCR',
							queryMode : 'local',
							editable : false,
							itemId : 'clientBtn',
							width : 240,							
							padding : '-4 0 0 0',
							text : getLabel('allCompanies', 'All Companies'),
							menuAlign : 'b',
							store : clientStore,
							triggerAction : 'all',
							triggerBaseCls : 'xn-form-trigger',
							listeners : {
								'select' : function(combo, record) {
									var code = combo.getValue();
									me.clientCode = code;
									me.fireEvent("handleClientChange", code, combo
													.getRawValue(), '');
								}
							}
			
												/*	menuAlign : 'b',
								menu : {
									xtype : 'menu',
									maxHeight : 180,
									width : 50,
									cls : 'ext-dropdown-menu xn-menu-noicon',
									itemId : 'clientMenu',
									items : []
								}*/
			}]
		},
		/*{
			xtype : 'container',
			itemId : 'filterClientAutoCmplterCnt',
			flex : 1,
			hidden :  entity_type == 1 ? true : false,
			layout : 'vbox',
			items : [{
				xtype : 'label',
				text : "Client"
			}, 
			{
				xtype : 'AutoCompleter',
				fieldCls : 'xn-form-text w12 xn-suggestion-box',
				matchFieldWidth : true,
				width : "40%",
				labelSeparator : '',
				name : 'clientCode',
				itemId : 'clientCodeId',
				cfgTplCls : 'xn-autocompleter-t7',
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
		},*/
	   
	   {
					xtype : 'panel',
					itemId : 'clientMenuBar',
				//	cls : 'xn-filter-toolbar',
					hidden :  entity_type == 1 ? true : false,
					layout : 'vbox',
					align : 'stretch',
					flex : 1,
					items : [{
								xtype : 'label',
								text : getLabel('client', 'Company Name'),
								cls : 'frmLabel'
							}, {
								xtype : 'AutoCompleter',
								matchFieldWidth : true,
								fieldCls : 'xn-form-text w12 xn-suggestion-box',
								width : "40%",
								labelSeparator : '',
								name : 'clientCode',
								cfgTplCls : 'xn-autocompleter-t7',
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
					},
	   
	   
	   {
				xtype : 'panel',
				cls : 'ux_largepadding',
				layout : 'hbox',	
				flex : 1,				
				items :
				[
					{

						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						flex : 0.8,
						hidden:true,
						layout :
						{
							type : 'vbox'
						},
						items :
						[
							{
								xtype : 'label',
								text : getLabel( 'status', 'Status' ),
								itemId : 'statusLabel',
								cls : 'frmLabel',
								flex : 1
							},
							{
								xtype : 'toolbar',
								itemId : 'messageSentStatusToolBar',
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
										text : getLabel( 'replied', 'Replied' ),
										btnId : 'repliedStatus',
										btnValue : '2',
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
										text : getLabel( 'notReplied', 'Not Replied' ),
										btnId : 'notRepliedStatus',
										btnValue : '1',
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
						layout : 'vbox',
						//cls : 'ux_largepadding-bottom ux_largepadding-left ux_largepadding-right',
						//cls : 'ux_largepadding',
						width : '50%',
					
						items :
						[
							{
								xtype : 'panel',
								layout : 'hbox',
								height :23,
								flex : 1,
								items :
								[
									{
										xtype : 'label',
										itemId : 'dateLabel',
										text : getLabel('msgDate', 'Message Date')
										//padding : '0 0 6 4',
										//cls : 'ux_font-size14 ux_padding0060'
									},
									{
										xtype : 'button',
										border : 0,
										filterParamName : 'MessageDate',
										
										itemId : 'messageDate',// Required
										cls : 'ui-caret-dropdown',
										//cls : 'menu-disable xn-custom-arrow-button cursor_pointer ui-caret',
													listeners : {
														click:function(event){
																var menus=me.createDateFilterMenu(this)
																var xy=event.getXY();
																menus.showAt(xy[0],xy[1]+16);
																event.menu=menus;
														}
													}
										}
								]
							},
							{
										xtype : 'container',
										itemId : 'messageDatePicker',
										layout : 'hbox',
										width : 240,
										items : [{
											xtype : 'component',
											width : '86%',
											itemId : 'messageDatePicker',
											filterParamName : 'dueDate',
											html : '<input type="text"  id="entryDataPicker" placeholder="'
													+ strApplicationDateFormat
													+ '" class="ft-datepicker from-date-range ui-datepicker-range-alignment">'
										}, {
											xtype : 'component',
											cls : 'icon-calendar',
											margin : '1 0 0 0',
											html : '<span class=""><i class="fa fa-calendar"></i></span>'
										}]
							}
										/*{
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
												width : 75,
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
												width : 75,
												fieldCls : 'h2',
												value : new Date( Ext.Date.parse( dtApplicationDate,
													strExtApplicationDateFormat ) )
											},
											{
												xtype : 'button',
												cls : 'ux_button-background-color ux_button-padding',
												text : getLabel( 'goBtnText', 'Go' ),
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
							}*/
						]
					}
					/*{
						xtype : 'panel',
						//itemId : 'formGroupFilterPanelItemId',
						cls : 'xn-filter-toolbar',
						flex : 0.33,
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
										text : getLabel( 'lbl.messageForm.formGroup', 'Form Group' ),
										cls : 'frmLabel'
									}
								]
							},
							{
								xtype : 'toolbar',
								itemId : 'formGroupFilterActionToolBarItemId',
								cls : 'xn-toolbar-small ux_no-padding',
								width : '100%',
								enableOverflow : true,
								border : false,
								items :
								[
									{
										text : getLabel( 'lbl.messageForm.all', 'All' ),
										code : 'all',
										btnId : 'allGroups',
										btnValue : 'all',
										parent : this,
										cls : 'f13 xn-custom-heighlight ux_no-padding',
										handler : function( btn, opts )
										{
											this.parent.fireEvent( 'filterFormGroup', btn, opts );
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
										filterParamName : 'formGroup',
										itemId : 'moreFormGroupItemId',// Required
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
					/*{
						xtype : 'panel',
						cls : 'xn-filter-toolbar ui-helper-hidden',
						layout : 'vbox',
						//align : 'stretch',
						//flex : searchFlex,
						flex : 0.33,
						//padding : '20 80 10 0',
						items : [{
									xtype : 'button',
									padding : '0 0 0 0',
									itemId : 'filterBtnId',
									cls : 'ux_button-background-color ux_button-padding',
									text : 'Search'
									//height : 20
							}]
			    }*/
				]
			}

		];
		this.callParent( arguments );
		me.on('afterrender', function(panel) {
			Ext.Ajax.request({
				url : 'services/userseek/userclients.json',
				method : "POST",
				params:{$sellerCode:sessionSellerCode},
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
			var clientBtn = me.down('combo[itemId="clientBtn"]');
		/*
		 * if (clientBtn) clientBtn.setText(me.clientCode);
		 */
		// Set Default Text When Page Loads
			clientBtn.setRawValue(getLabel('allCompanies', 'All companies'));
			//if(prefClientDesc)
				//clientBtn.setText(prefClientDesc);		
			});
	},
	populateClientMenu : function(data) {
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
						me.clientCode = btn.code;
						me.fireEvent('handleClientChange', btn.code,
								btn.btnDesc,'');
					}
				});

		Ext.each(clientArray, function(client) {
					//if(client.CODE === prefClientCode)	
						//prefClientDesc = client.DESCR;
					clientMenu.push({
								text : client.DESCR,
								CODE : client.CODE,
								DESCR : client.DESCR,
								handler : function(btn, opts) {
									clientBtn.setText(btn.text);
									me.clientCode = btn.CODE;
									me.fireEvent('handleClientChange',
											btn.CODE, btn.DESCR,'');
								}
							});
				});
		if (null != clientArray && clientArray.length <= 1) {
			filterClientMenuContainer.hide();
		}
		else
		{
		clientBtn.getStore().loadData(clientMenu);
		}

	},
	 createDateFilterMenu : function(buttonIns){
		
	var dropdownMenu = Ext.create( 'Ext.menu.Menu',
										{
											cls : 'ext-dropdown-menu',
											listeners : {
											hide:function(event) {
											//	buttonIns.addCls('ui-caret-dropdown');
												buttonIns.removeCls('action-down-hover');
												}
											},		
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
													text : getLabel('lastmonthonly', 'Last Month Only'),
					                            	btnId : 'btnLastmonthonly',
													parent : this,
													btnValue : '14',
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
												}
											/*	{
													text : getLabel( 'daterange', 'Date Range' ),
													btnId : 'btnDateRange',
													parent : this,
													btnValue : '7',
													handler : function( btn, opts )
													{
														this.parent.fireEvent( 'dateChange', btn, opts );
													}
												}*/
											]
										}
										);
										return dropdownMenu;
		
	 
	 
	 }
	
/*	tools :
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
			disabled : false,
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
	]*/
} );
