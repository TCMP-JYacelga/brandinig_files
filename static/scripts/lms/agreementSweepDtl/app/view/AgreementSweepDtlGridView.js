Ext.define( 'GCP.view.AgreementSweepDtlGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
	 	'GCP.view.AgreementSweepDtlGroupActionView', 'Ext.ux.gcp.SmartGrid','Ext.util.Point'
	],
	xtype : 'agreementSweepDtlGridViewType',
	cls : 'xn-panel',
	//bodyPadding : '2 4 2 2',
	autoHeight : true,
	width : '100%',
	parent : null,
	initComponent : function()
	{
		var me = this;
		Ext.create( 'GCP.view.AgreementSweepDtlGroupActionView',
				{
					itemId : 'groupActionBarItemId',
					height : 'auto',
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
				//cls : 'xn-ribbon',				
				//title : getLabel( 'instructionSummary', 'Instruction Summary' ),
				itemId : 'agreementDtlViewItemId',
				items :
				[
					{
						xtype : 'container',
						//cls : 'ux_panel-transparent-background ux_border-top',
						layout : 'hbox',
						items :
						[
						//actionBar,
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
