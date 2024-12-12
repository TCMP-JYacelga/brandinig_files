Ext.define( 'GCP.view.CodeMapGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'GCP.view.CodeMapGroupActionBarView', 'Ext.ux.gcp.SmartGrid'
	],
	xtype : 'codeMapGridViewType',
	width : '100%',
	cls: 'ux_extralargemargin-top',
	initComponent : function()
	{
		var me = this;
		var actionBar = Ext.create( 'GCP.view.CodeMapGroupActionBarView',
		{
			itemId : 'codeMapGroupActionBarViewItemId',
			height : 21,
			width : '100%',
			margin : '1 0 0 0',
			parent : me,
			cls : 'xn-ribbon ux_header-width ux_panel-transparent-background',
		} );
		this.items =
		[
			{
				xtype : 'container',
				layout : 'hbox',
				cls: 'ux_panel-background ux_extralargepadding-bottom',
				flex : 1,
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
								itemId : 'codeMapNewRequestItemId',
								parent : this,
								hidden: canEditFlag === 'Y' ? false : true,
								text :  getLabel( 'lbl.codeMap.createNew', 'Create Code Map' ),
								cls : 'cursor_pointer ux_button-background ux_button-padding ux_button-background-color ux_button-s',
								glyph: 'xf055@fontawesome',
								handler : function()
								{
									this.fireEvent( 'addCodeMapEvent', this );
								}
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
				title : getLabel( 'lblCodeMapGrid', 'Code Map' ),
				itemId : 'codeMapDtlViewItemId',
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
