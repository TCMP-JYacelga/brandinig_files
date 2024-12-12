Ext.define( 'GCP.view.HolidaySummaryGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'Ext.ux.gcp.SmartGrid', 'GCP.view.HolidaySummaryActionBarView', 'Ext.panel.Panel'
	],
	xtype : 'holidaySummaryGridView',
	width : '100%',
	cls: 'gradiant_back',
	initComponent : function()
	{
		var me = this;
		var actionBar = Ext.create( 'GCP.view.HolidaySummaryActionBarView',
		{
			itemId : 'groupActionBarView',
			height : 21,
			width : '100%',
			margin : '1 0 0 0',
			parent : me
		} );
		this.items =
		[
			{
				
					xtype : 'container',
					layout : 'hbox',
					flex : 1,
					cls: 'ux_panel-background',
					items :
					[						
						{
							xtype : 'container',
							layout : 'hbox',
							cls : 'rightfloating',
							items : [
										{
								xtype : 'container',
								layout :
								{
									type : 'hbox'
								},
								items :
								[
									{
										xtype : 'toolbar',
										cls : 'ux_panel-background ux_extralargemargin-bottom ux_no-padding',
										flex : 1,
										items :
										[
											{
												xtype : 'button',
												border : 0,
												itemId : 'btnCreateHolidaySummary',
												cls : 'cursor_pointer ux_button-background ux_button-padding ux_button-background-color ux_button-s',
												parent : this,
												//margin : '7 0 5 0',
												glyph : 'xf055@fontawesome',
												text : getLabel( 'holidaySummary', 'General Holidays' ),
												handler : function()
												{
													this.fireEvent( 'addNewAgreementEvent' );
												}
											}
										]

									}
								]
							}
							]

						}
					]
				
			},
			{
				xtype : 'panel',
				width : '100%',
				cls : 'xn-ribbon ux_panel-transparent-background',
				title:  getLabel( 'holidaySummary', 'General Holidays' ),
				collapsible: true,
				autoHeight : true,
				bodyCls: 'x-portlet ux_no-padding',
				itemId : 'holidaySummaryDtlView',
				items :
				[
					{
						xtype : 'container',
						layout : 'hbox',
						cls: 'ux_border-top',
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
