Ext.define( 'GCP.view.AgreementFrequencyGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'Ext.ux.gcp.SmartGrid', 'GCP.view.AgreementFrequencyActionBarView', 'Ext.util.Point','Ext.panel.Panel'
	],
	xtype : 'agreementFrequencyGridView',
	width : '100%',
	initComponent : function()
	{
		var me = this;
		var actionBar = Ext.create( 'GCP.view.AgreementFrequencyActionBarView',
		{
			itemId : 'clientGroupActionBarView_clientDtl',
			height : 21,
			width : '100%',
			margin : '1 0 0 0',
			parent : me
		} );
		this.items =
		[{
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
								itemId : 'btnCreateNewToolBar',
								cls : '',
								flex : 1,
								items :
								[
									{
										xtype : 'button',
										border : 0,
										itemId : 'btnCreateAgreementFrequency',
										cls : 'cursor_pointer ux_button-background ux_button-padding ux_button-background-color ux_button-s',
										parent : this,
										//margin : '7 0 5 0',
										glyph : 'xf055@fontawesome',
										text : getLabel( 'lbl.createSchedule', 'Create New Schedule' )
										
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
				bodyCls : 'x-portlet ux_no-padding',
				collapsible :true,
				title : getLabel('lbl.createSchedule.title','SWEEP AGREEMENT SCHEDULING SUMMARY'),
				autoHeight : true,
				margin : '12 0 0 0',
				itemId : 'agreementFrequencySetupDtlView',
				items :
				[
					{
						xtype : 'container',
						layout : 'hbox',
						cls : 'ux_border-top ux_panel-transparent-background',
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
