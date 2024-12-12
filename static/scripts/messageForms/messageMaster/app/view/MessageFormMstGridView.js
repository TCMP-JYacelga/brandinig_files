/**
 * @class GCP.view.MessageFormMstGridView
 * @extends Ext.panel.Panel
 * @author Nilesh Shinde
 */
Ext.define( 'GCP.view.MessageFormMstGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'GCP.view.MessageFormMstGroupActionBarView', 'Ext.ux.gcp.SmartGrid'
	],
	xtype : 'messageFormMstGridViewType',
	componentCls : 'gradiant_back',
	padding : '12 0 0 0',
	autoHeight : true,
	width : '100%',
	parent : null,
	initComponent : function()
	{
		var me = this;
		var actionBar = Ext.create( 'GCP.view.MessageFormMstGroupActionBarView',
		{
			itemId : 'groupActionBarItemId',
			height : 21,
			width : '100%',
			margin : '1 0 0 0',
			parent : me
		} );
		this.items =
		[
			{
				xtype : 'container',
				cls : 'ux_hide-image',
				layout : 'hbox',
				width : '100%',
				items :
				[
					{
						xtype : 'container',
						layout : 'hbox',
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
										itemId : 'btnSearchOnPageItemId',
										text : getLabel( 'searchOnPage', 'Search on Page' ),
										cls : 'xn-custom-button cursor_pointer',
										padding : '0 0 0 3',
										menu : Ext.create( 'Ext.menu.Menu',
										{
											itemId : 'menuItemId',
											items :
											[
												{
													xtype : 'radiogroup',
													itemId : 'matchCriteriaItemId',
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
										itemId : 'searchTxnTextFieldItemId',
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
				bodyCls : 'x-portlet ux_no-padding',
				title : getLabel( 'lbl.messageForm.messages', 'Messages' ),
				itemId : 'gridViewPanelItemId',
				items :
				[
					{
						xtype : 'container',
						layout : 'hbox',
						items :
						[
							{
								xtype : 'label',
								text : getLabel( 'actions', 'Actions' ) + ':',
								cls : 'ux_font-size14',
								padding : '5 0 0 10'
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
