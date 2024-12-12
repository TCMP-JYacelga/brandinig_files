Ext.define( 'GCP.view.TaxRateMstGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'Ext.ux.gcp.SmartGrid', 'GCP.view.TaxRateMstActionBarView', 'Ext.panel.Panel'
	],
	xtype : 'taxRateMstGridView',
	width : '100%',
	initComponent : function()
	{
		var me = this;
		var actionBar = Ext.create( 'GCP.view.TaxRateMstActionBarView',
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
										cls : '',
										flex : 1,
										items :
										[
											{
												xtype : 'button',
												border : 0,
												itemId : 'btnCreateTaxRateSummary',
												cls : 'cursor_pointer ux_button-background ux_button-padding ux_button-background-color ux_button-s',
												parent : this,
												//margin : '7 0 5 0',
												glyph : 'xf055@fontawesome',
												text : getLabel( 'lms.taxRateMSt.createNewTaxRate', 'Create New Tax Rate' ),
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
				cls : 'xn-panel',
				autoHeight : true,
				margin : '5 0 0 0',
				itemId : 'taxRateMstSummaryDtlView',
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
								cls : 'action_label',
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
