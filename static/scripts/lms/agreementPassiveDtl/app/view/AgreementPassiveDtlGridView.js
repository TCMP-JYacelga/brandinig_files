Ext.define( 'GCP.view.AgreementPassiveDtlGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
	 	'GCP.view.AgreementPassiveDtlGroupActionView', 'Ext.ux.gcp.SmartGrid','Ext.util.Point'
	],
	xtype : 'agreementPassiveDtlGridViewType',
	cls : 'xn-panel',
	bodyPadding : '2 4 2 2',
	autoHeight : true,
	width : '100%',
	parent : null,
	initComponent : function()
	{
		var me = this;
		var actionBar = Ext.create( 'GCP.view.AgreementPassiveDtlGroupActionView',
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
				cls : 'xn-panel',
				title : getLabel( 'instructionSummary', 'Passive Agreement Summary' ),
				itemId : 'agreementDtlViewItemId',
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
								cls : 'font_bold',
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
