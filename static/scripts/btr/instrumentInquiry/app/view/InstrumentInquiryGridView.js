Ext.define( 'GCP.view.InstrumentInquiryGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'Ext.ux.gcp.SmartGrid'
	],
	xtype : 'instrumentInquiryGridView',	
	padding : '12 0 0 0',
	componentCls : 'gradiant_back',
	autoHeight : true,
	width : '100%',
	parent : null,
	initComponent : function()
	{
		var me = this;
		this.items =
		[
			{
				xtype : 'container',
				layout : 'hbox',
				width : '100%',
				items :
				[/*{
										xtype : 'label',
										margin : '7 0 3 0',
										text : getLabel('createNew',
																'Create New')
									}, {
										xtype : 'button',
										itemId : 'addNewCmsStopPayId',
										name: 'stopCheckReq',
										margin : '7 0 5 0',
										text : '<span class="button_underline thePoniter ux_font-size14-normal underlined">'
												+ getLabel('lblstopchkreq',
														'Stop Check Request') + '</span>',
										cls : 'xn-account-filter-btnmenu',
										handler : function() {
											me.parent.fireEvent('addNonCMSStopPay',this);
										}
									}, 
									{
										xtype : 'label',
										margin : '7 0 3 0',
										text : getLabel('separator',
																' | ')
									}, 
									{
										xtype : 'button',
										itemId : 'addNewCmsInqId',
										name: 'cmsInqReq',
										margin : '7 0 5 0',
										text : '<span class="button_underline thePoniter ux_font-size14-normal underlined">'
												+ getLabel('lblchkinquiry',
														'Check Inquiry Request') + '</span>',
										cls : 'xn-account-filter-btnmenu',
										handler : function() {
											me.parent.fireEvent('addNonCMSStopPay',this);
										}
									},*/
					{
						xtype : 'container',
						cls : 'ux_hide-image',
						layout : 'hbox',
						//margin : '6 0 3 0',
						flex : 1,
						items :
						[
							{
								xtype : 'label',
								text : '',
								flex : 1
							},
							{
								xtype : 'container',
								layout : 'hbox',
								cls : 'rightfloating',
								items :
								[
									{
										xtype : 'button',
										border : 0,
										itemId : 'btnSearchOnPage',
										text : getLabel( 'searchOnPage', 'Search on Page' ),
										cls : 'xn-custom-button cursor_pointer',
										padding : '0 0 0 3',
										menu : Ext.create( 'Ext.menu.Menu',
										{
											itemId : 'menu',
											items :
											[
												{
													xtype : 'radiogroup',
													itemId : 'matchCriteria',
													vertical : true,
													columns : 1,
													items :
													[
														{
															boxLabel : getLabel( 'exactMatch', 'Exact Match' ),
															name : 'searchOnPage',
															inputValue : 'exactMatch'
														},
														{
															boxLabel : getLabel( 'anyMatch', 'Any Match' ),
															name : 'searchOnPage',
															inputValue : 'anyMatch',
															checked : true
														}
													]

												}
											]
										} )
									},
									{
										xtype : 'textfield',
										itemId : 'searchTxnTextField',
										cls : 'w10',
										padding : '0 0 0 5'
									}
								]
							}
						]
					}
				]
			},
			{
				xtype : 'panel',
				collapsible : true,
				width : '100%',
				cls : 'xn-ribbon ux_border-bottom',
				title : getLabel( 'lblinstrumentinquiryN', 'Deposit Ticket View - Item Details' ),
				itemId : 'instrumentInqDtlView'
			}
		];
		this.callParent( arguments );
	}

} );
