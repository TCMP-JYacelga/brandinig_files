Ext.define( 'GCP.view.AgreementHybridDtlGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
	 	'GCP.view.AgreementHybridDtlGroupActionView', 'Ext.ux.gcp.SmartGrid','Ext.util.Point'
	],
	xtype : 'agreementHybridDtlGridViewType',
	cls : 'xn-panel',
	bodyPadding : '2 4 2 2',
	autoHeight : true,
	width : '100%',
	parent : null,
	initComponent : function()
	{
		var me = this;
		Ext.create( 'GCP.view.AgreementHybridDtlGroupActionView',
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
				//collapsible : true,
				//width : '100%',
				//cls : 'xn-panel',
				//title : getLabel( 'instructionSummary', 'Instruction Summary' ),
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
