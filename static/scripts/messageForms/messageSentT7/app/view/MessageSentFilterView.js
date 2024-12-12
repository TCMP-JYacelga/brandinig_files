Ext.define( 'GCP.view.MessageSentFilterView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'messageSentFilterView',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	width : '100%',
	componentCls : 'gradiant_back',
	cls : 'xn-ribbon ux_border-bottom',
	layout :
	{
		type : 'hbox'
		
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
		    cls : 'xn-filter-toolbar ux_largepadding',
		    layout : 'hbox',
			itemId : 'sellerClientMenuBar',
			items  : [{
				xtype : 'panel',
				itemId : 'sellerMenuBar',
				cls : 'xn-filter-toolbar',
				layout : 'vbox',
				align : 'stretch',
				flex : 1,
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
										},
										'select' : function(combo, strNewValue, strOldValue) {
											setAdminSeller(combo.getValue());
										}
									}
						 }]
			    }]
	   },
						
		{
					xtype : 'container',
					itemId : 'clientMenuBar',
					cls : 'xn-filter-toolbar',
					flex : 0.33,
					padding : '0 0 0 5',
					hidden : entity_type == 1 ? true : false,
					layout : {
						type : 'vbox',
						align : 'stretch'
					},
					items : [{
									xtype : 'label',
									text : getLabel('grid.column.company', 'Company Name')
								}, {
									xtype : 'AutoCompleter',
									fieldCls : 'xn-form-text w12 xn-suggestion-box',
									matchFieldWidth : true,
									cls : 'autoCmplete-field',
									labelSeparator : '',
									name : 'clientCode',
									itemId : 'clientCodeId',
									// cfgUrl : clientSeekUrl,
									cfgUrl : clientSeekUrl,
									cfgQueryParamName : '$autofilter',
									cfgRecordCount : -1,
									cfgSeekId : 'clientCodeSeek',
									cfgRootNode : 'd.preferences',
									cfgKeyNode : 'CODE',
									cfgDataNode1 : 'DESCR',
									cfgStoreFields:['CODE','DESCR'],
									cfgProxyMethodType : 'POST'
								}

						]
					},
	   
	   
	   {
				xtype : 'panel',
				layout : 'hbox',
				// cls : 'ux_largepadding-bottom ux_largepadding-left
				// ux_largepadding-right',
				cls : 'ux_largepadding',
				padding : '0 0 0 7',
				flex : 1,	
				items :
				[
					{
						xtype : 'panel',
						layout : 'vbox',
						
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
										cls : 'ux_font-size14 ux_padding0060'
									},
									{
										xtype : 'button',
										border : 0,
										filterParamName : 'MessageDate',
										itemId : 'messageDate',// Required
										cls : 'ui-caret',
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
										xtype : 'component',
										width:'200px',
										itemId : 'messageDatePicker',
										filterParamName : 'dueDate',
										html :'<input type="text"  id="entryDataPicker" class="ft-datepicker ui-datepicker-range-alignment">'
							}
							
						]
					}
					
				]
			}

		];
		this.callParent( arguments );

	},
	 createDateFilterMenu : function(buttonIns){
		
	var dropdownMenu = Ext.create( 'Ext.menu.Menu',
										{
											cls : 'ext-dropdown-menu',
											listeners : {
											hide:function(event) {
												buttonIns.addCls('ui-caret-dropdown');
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
											]
										}
										);
										return dropdownMenu;
		
	 
	 
	 }
} );
