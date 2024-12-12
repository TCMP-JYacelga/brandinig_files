Ext.define( 'GCP.view.CodeMapDtlGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
	 	'GCP.view.CodeMapDtlGroupActionBarView','Ext.ux.gcp.SmartGrid'
	],
	xtype : 'codeMapDtlGridViewType',
	cls: 'ux_extralargemargin-top',
	bodyPadding : '2 4 2 2',
	autoHeight : true,
	width : '100%',
	parent : null,
	initComponent : function()
	{
		var me = this;
		var actionBar = Ext.create( 'GCP.view.CodeMapDtlGroupActionBarView',
			{
				itemId : 'codeMapDtlGroupActionBarViewItemId',
				height : 21,
				width : '100%',
				margin : '1 0 0 0',
				parent : me,
				cls: 'xn-ribbon ux_header-width ux_panel-transparent-background',
			} );
		
		this.items =
		[
			{
				xtype : 'container',
				layout : 'hbox',
				width : '100%',
				cls: 'ux_panel-background ux_extralargepadding-bottom',
				items :
				[
					{
						xtype : 'toolbar',
						cls : ' ux_panel-background',
						flex : 1,
						items : 
						[
							{
								xtype : 'button',
								itemId : 'codeMapDtlRequestItemId',
								parent : this,
								hidden : pageMode == 'EDIT' ?  false : true,
								//margin : '7 0 5 15',
								text : getLabel( 'lbl.codeMapDtl.AddNew', 'Add Record' ),
								cls : 'cursor_pointer ux_button-background ux_button-padding ux_button-background-color ux_button-s',
								glyph: 'xf055@fontawesome',
							}
					    ]
					},
                    {
						xtype : 'container',
						layout : 'hbox',
						cls : 'rightfloating ux_hide-image',
						items :
						[
								{
									xtype : 'button',
									border : 0,
									itemId : 'btnSearchOnPage',
									text : getLabel( 'searchOnPage', 'Search on Page' ),
									cls : 'ux_button-background-color ux_button-padding',
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
			},
			{
				xtype : 'panel',
				collapsible : true,
				width : '100%',
				cls : 'xn-ribbon ux_panel-transparent-background',
				title : getLabel( 'lbl.codeMapDtlsummary.Codes', 'Codes' ),
				itemId : 'gridViewDetailPanelItemId',
				items :
					[
						{
							xtype : 'container',
							layout : 'hbox',
							cls: 'ux_largepaddinglr ux_no-padding ux_no-margin x-portlet ux_border-top ux_panel-transparent-background',
							items :
							[
								{
									xtype : 'label',
									text : getLabel( 'actions', 'Actions' ) + ':',
									cls : 'font_bold ux-ActionLabel ux_font-size14',									
									padding : '5 0 0 3'
								}, actionBar,
								{
									xtype : 'label',
									text : '',
									flex : 1
								}
							]

						}
					]	
					
			}
		];
		this.callParent( arguments );
	}
} );
