/**
 * @class GCP.view.CustomReportCenterFilterView
 * @extends Ext.panel.Panel
 * @author Nilesh Shinde
 */
Ext.define( 'GCP.view.CustomReportCenterFilterView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'customReportCenterFilterViewType',
	requires :
	[
		'Ext.menu.Menu', 'Ext.menu.DatePicker', 'Ext.container.Container', 'Ext.toolbar.Toolbar', 'Ext.button.Button',
		'Ext.panel.Panel', 'Ext.ux.gcp.AutoCompleter'
	],
	width : '100%',
	accountSetPopup : null,
	componentCls : 'gradiant_back',
	collapsible : true,
	collapseFirst : true,
	title : getLabel( 'filterBy', 'Filter By :' ) + '<i href="#" id="imgFilterInfoStdView" class="icon-company"></i>',
	cls : 'xn-ribbon ux_border-bottom',
	layout :
	{
		type : 'vbox',
		align : 'stretch'
	},
	statusCode : null,
	statusCodeDesc : null,
	repOrDwnld : null,
	repOrDwnldDesc : null,
	reportType : null,
	reportTypeDesc : null,
	seller : strSeller,
	clientCode : strClient,
	clientDesc : strClientDesc,
	tools :
	[
		{
			xtype : 'container',
			itemId : 'filterClientMenuContainer',
			cls : 'paymentqueuespacer',
			padding : '0 0 0 5',
			left : 150,
			hidden : !isClientUser,
			items :
			[
				{
					xtype : 'label',
					html : '<img id="imgFilterInfo" class="largepadding icon-company"/>'
				},
				{
					xtype : 'button',
					border : 0,
					itemId : 'clientBtn',
					//text : getLabel('allCompanies', 'All Companies'),
					cls : 'font_bold xn-custom-more-btn cursor_pointer x-zero-padding ux-custom-more-btn',
					menuAlign : 'b',
					menu :
					{
						xtype : 'menu',
						maxHeight : 180,
						width : 50,
						cls : 'ext-dropdown-menu xn-menu-noicon',
						itemId : 'clientMenu',
						items : []
					}
				}
			]
		},
		{
			xtype : 'container',
			itemId : 'filterClientAutoCmplterCnt',
			cls : 'paymentqueuespacer',
			padding : '0 0 0 5',
			layout :
			{
				type : 'hbox'
			},
			hidden : isClientUser,
			items :
			[
				{
					xtype : 'label',
					html : '<img id="imgFilterInfo" class="largepadding icon-company"/>'
				},
				{
					xtype : 'AutoCompleter',
					margin : '0 0 0 5',
					fieldCls : 'xn-form-text w12 xn-suggestion-box',
					itemId : 'reportCenterClientId',
					name : 'client',
					cfgUrl : 'services/userseek/userclients.json',
					cfgRecordCount : -1,
					cfgRootNode : 'd.preferences',
					cfgDataNode1 : 'DESCR',
					cfgDataNode2 : 'SELLER_CODE',
					cfgKeyNode : 'CODE',
					value : strClient,
					cfgQueryParamName : '$autofilter',
					listeners :
					{
						'select' : function( combo, record )
						{
							strClient = combo.getValue();
							strClientDesc = combo.getRawValue();
							reportSummaryView.seller = record[ 0 ].data.SELLER_CODE;
							reportSummaryView.fireEvent( 'refreshGroupByTabs', strClient );
							reportSummaryView.handleQuickFilterChange();
						},
						'change' : function( combo, newValue, oldValue, eOpts )
						{
							if( Ext.isEmpty( newValue ) )
							{
								reportSummaryView.fireEvent( 'handleClientChange' );
							}
						},
						'render' : function( combo )
						{
							combo.store.loadRawData(
							{
								"d" :
								{
									"preferences" :
									[
										{
											"CODE" : strClient,
											"DESCR" : strClientDesc
										}
									]
								}
							} );
							combo.listConfig.width = 200;
							combo.suspendEvents();
							combo.setValue( strClient );
							combo.resumeEvents();
						}
					}
				}
			]
		},
		{
			xtype : 'container',
			padding : '0 9 0 0',
			layout : 'hbox',
			items :
			[
				{
					xtype : 'label',
					text : getLabel( 'preferences', 'Preferences : ' ),
					cls : 'xn-account-filter-btnmenu',
					padding : '2 0 0 0'
				},
				{
					xtype : 'button',
					itemId : 'btnClearPreferences',
					disabled : true,
					text : getLabel( 'clearFilter', 'Clear' ),
					cls : 'xn-account-filter-btnmenu',
					textAlign : 'right',
					width : 40
				},
				{
					xtype : 'image',
					src : 'static/images/icons/icon_spacer.gif',
					height : 18
				},
				{
					xtype : 'button',
					itemId : 'btnSavePreferences',
					disabled : true,
					text : getLabel( 'saveFilter', 'Save' ),
					cls : 'xn-account-filter-btnmenu',
					textAlign : 'right',
					width : 30
				}
			]
		}
	],
	initComponent : function()
	{
		var me = this;
		reportSummaryView = this;
		var arrItems = [], panel = null;
		//panel = me.createFilterUpperPanel();
		//arrItems.push(panel);

		me.on( 'afterrender', function( panel )
		{
			Ext.Ajax.request(
			{
				url : 'services/userseek/userclients.json&$sellerCode=' + strSeller,
				method : "POST",
				async : false,
				success : function( response )
				{
					if( response && response.responseText )
						me.populateClientMenu( Ext.decode( response.responseText ) );
				},
				failure : function( response )
				{
					// console.log('Error Occured');
				}
			} );
		} );
		me.on( 'afterrender', function( panel )
		{
			var clientBtn = me.down( 'button[itemId="clientBtn"]' );
			/*
			 * if (clientBtn) clientBtn.setText(me.clientCode);
			 */
			// Set Default Text When Page Loads
			if( !Ext.isEmpty( me.clientDesc ) )
			{
				clientBtn.setText( me.clientDesc );
			}
			else
			{
				clientBtn.setText( strClientDesc );
			}
		} );

		panel = me.createFilterLowerPanel();
		arrItems.push( panel );
		me.items = arrItems;
		me.callParent( arguments );
	},
	populateClientMenu : function( data )
	{
		var me = this;
		var clientMenu = me.down( 'menu[itemId="clientMenu"]' );
		var clientBtn = me.down( 'button[itemId="clientBtn"]' );
		var filterClientMenuContainer = me.down( 'container[itemId="filterClientMenuContainer"]' );
		var clientArray = data.d.preferences || [];

		/*clientMenu.add({
					text : getLabel('allCompanies', 'All companies'),
					btnDesc : getLabel('allCompanies', 'All companies'),
					code : 'all',
					handler : function(btn, opts) {
						clientBtn.setText(btn.text);
						reportSummaryView.clientCode = btn.code;
						reportSummaryView.handleQuickFilterChange();
						}
				});
		*/

		Ext.each( clientArray, function( client )
		{

			clientMenu.add(
			{
				text : client.DESCR,
				code : client.CODE,
				btnDesc : client.DESCR,
				handler : function( btn, opts )
				{
					clientBtn.setText( btn.text );
					reportSummaryView.clientCode = btn.code;
					reportSummaryView.clientDesc = btn.btnDesc;
					reportSummaryView.handleQuickFilterChange();
				}
			} );
		} );
		if( null != clientArray && clientArray.length <= 1 )
		{
			filterClientMenuContainer.hide();
		}

	},
	createFilterUpperPanel : function()
	{
		var me = this;
		var flex = 0;
		var fieldFI = null, fieldClient = null, btnSearch = null, intCnt = 0;
		fieldFI = me.createFICombo();
		if( entity_type == 0 )
			fieldClient = me.createClientAutocompleter();
		else
			fieldClient = me.createClientDropDown();

		btnSearch = me.createSearchBtn();
		intCnt += fieldFI.hidden === true ? 0 : 1;
		intCnt += fieldClient.hidden === true ? 0 : 1;
		intCnt += btnSearch.hidden === true ? 0 : 1;

		flex = parseFloat( ( 1 / intCnt ).toFixed( 2 ) );

		fieldFI.flex = fieldFI.hidden === true ? 0 : flex;
		fieldClient.flex = fieldClient.hidden === true ? 0 : flex;
		btnSearch.flex = btnSearch.hidden === true ? 0 : flex;

		var parentPanel = Ext.create( 'Ext.panel.Panel',
		{
			layout : 'hbox',
			itemId : 'filterUpperPanel',
			cls : 'ux_largepadding',
			items :
			[
				btnSearch
			]
		} );
		return parentPanel;
	},
	createFilterLowerPanel : function()
	{
		var me = this;
		var parentPanel = Ext.create( 'Ext.panel.Panel',
		{
			layout : 'hbox',
			itemId : 'filterLowerPanel',
			cls : 'ux_largepaddinglr ux_largepadding-bottom',
			width : '100%',
			items :
			[
				me.createStatusFilter()
			]
		} );
		return parentPanel;
	},

	setSellerToClientAutoCompleterUrl : function()
	{
		var me = this;
		var sellerCombo = me.down( 'combobox[itemId="reportCenterSellerId"]' );
		var seller = sellerCombo.getValue();
		var clientautoComplter = me.down( 'combobox[itemId="reportCenterClientId"]' );
		//clientautoComplter.reset();
		clientautoComplter.cfgExtraParams =
		[
			{
				key : '$filtercode1',
				value : seller
			}
		];
	},
	createSearchBtn : function()
	{
		var me = this;
		var searchBtnPanel = Ext.create( 'Ext.toolbar.Toolbar',
		{
			cls : 'xn-filter-toolbar',
			margin : '15 0 0 0',
			items :
			[
				'->',
				{
					xtype : 'button',
					itemId : 'filterBtnId',
					text : getLabel( 'searchBtn', 'Search' ),
					cls : 'xn-btn ux-button-s',
					listeners :
					{
						'click' : function( btn, e, eOpts )
						{
							me.handleQuickFilterChange();
						}
					}
				}, ''
			]
		} );
		return searchBtnPanel;
	},

	createStatusFilter : function()
	{
		var me = this;
		var statusFilterPanel = Ext.create( 'Ext.panel.Panel',
		{
			itemId : 'statusFilterPanel',
			cls : 'xn-filter-toolbar',
			flex : 0.25,
			layout :
			{
				type : 'vbox'
			},
			items :
			[
				{
					xtype : 'label',
					text : getLabel( 'reportStatus', 'Status' ),
					cls : 'ux_font-size14',
					flex : 1
				},
				{
					xtype : 'toolbar',
					itemId : 'reportStatusToolBar',
					cls : 'xn-toolbar-small ux_no-padding ux_smallpadding-top',
					filterParamName : 'reportStatus',
					width : '100%',
					enableOverflow : true,
					border : false,
					componentCls : 'xn-btn-default-toolbar-small xn-custom-more-toolbar',
					items :
					[
						{
							text : getLabel( 'all', 'All' ),
							code : 'All',
							btnDesc : 'All',
							btnId : 'allReportStatus',
							parent : this,
							cls : 'f13 xn-custom-heighlight',
							handler : function( btn, opts )
							{
								me.statusCode = btn.code;
								me.statusCodeDesc = btn.btnDesc;
								me.changeCls( btn, 'reportStatusToolBar' );
								me.handleQuickFilterChange();
							}
						},
						{
							text : getLabel( 'active', 'Active' ),
							code : 'ACTIVE',
							btnDesc : 'Active',
							btnId : 'Active',
							parent : this,
							handler : function( btn, opts )
							{
								me.statusCode = btn.code;
								me.statusCodeDesc = btn.btnDesc;
								me.changeCls( btn, 'reportStatusToolBar' );
								me.handleQuickFilterChange();
							}
						},
						{
							text : getLabel( 'draft', 'Draft' ),
							code : 'DRAFT',
							btnDesc : 'Draft',
							btnId : 'Draft',
							parent : this,
							handler : function( btn, opts )
							{
								me.statusCode = btn.code;
								me.statusCodeDesc = btn.btnDesc;
								me.changeCls( btn, 'reportStatusToolBar' );
								me.handleQuickFilterChange();
							}
						}
					]
				}
			]
		} );
		return statusFilterPanel;
	},
	getQuickFilterJSON : function()
	{
		var me = this;
		var filterJson = {};
		var field = null, strValue = null;

		strValue = strSeller;
		filterJson[ 'sellerCode' ] = strValue;
		if( !isClientUser )
		{
			field = me.down( 'combobox[itemId="reportCenterClientId"]' );
			strValue = field ? field.getValue() : '';
			filterJson[ 'clientCode' ] = strValue;
			strValue = field ? field.getRawValue() : '';
			filterJson[ 'clientDesc' ] = strValue;
		}
		else
		{
			if( !Ext.isEmpty( me.clientCode ) && me.clientCode != 'all' )
				filterJson[ 'clientCode' ] = me.clientCode;
			filterJson[ 'clientDesc' ] = me.clientDesc;
		}
		filterJson[ 'statusCode' ] = ( me.statusCode != 'All' ) ? me.statusCode : null;
		filterJson[ 'statusCodeDesc' ] = me.statusCodeDesc;
		// only reports
		filterJson[ 'repOrDwnld' ] = 'R';
		filterJson[ 'repOrDwnldDesc' ] = me.repOrDwnldDesc;
		// only custom reports
		filterJson[ 'reportType' ] = 'C';
		filterJson[ 'reportTypeDesc' ] = me.reportTypeDesc;
		return filterJson;
	},
	changeCls : function( btn, itemId )
	{
		var me = this;
		me.down( 'toolbar[itemId=' + itemId + ']' ).items.each( function( item )
		{
			item.removeCls( 'xn-custom-heighlight' );
		} );
		btn.addCls( 'xn-custom-heighlight' );
	},
	handleQuickFilterChange : function()
	{
		var me = this;
		me.fireEvent( 'quickFilterChange', me.getQuickFilterJSON() );
	}
} );
