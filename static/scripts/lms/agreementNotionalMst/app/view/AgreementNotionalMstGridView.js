Ext.define( 'GCP.view.AgreementNotionalMstGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
	 	'GCP.view.AgreementNotionalMstGroupActionView', 'Ext.ux.gcp.SmartGrid','Ext.util.Point', 'Ext.panel.Panel'
	],
	xtype : 'agreementNotionalGridViewType',
	//cls : 'xn-panel',
	//bodyPadding : '2 4 2 2',
	//autoHeight : true,
	width : '100%',
	parent : null,
	initComponent : function()
	{
		var me = this;
		var actionBar = Ext.create( 'GCP.view.AgreementNotionalMstGroupActionView',
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
				xtype : 'panel',
				collapsible : true,
				width : '100%',
				//cls : 'xn-panel',
				bodyCls: 'x-portlet ux_no-padding',
				cls : 'xn-ribbon ux_panel-transparent-background',
				title : getLabel( 'notionalAgreementSummary', 'Notional Agreement Summary' ),
				itemId : 'agreementNotionalDtlViewItemId',
				items :
				[
					{
						xtype : 'container',
						layout : 'hbox',
						cls : 'ux_panel-transparent-background ux_border-top',
						items :
						[
							{
								xtype : 'label',
								text : getLabel( 'actions', 'Actions' ) + ':',
								cls : 'ux_font-size14',
								padding : '5 0 5 10'
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
