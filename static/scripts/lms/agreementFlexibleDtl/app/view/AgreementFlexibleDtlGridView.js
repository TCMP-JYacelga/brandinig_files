Ext.define( 'GCP.view.AgreementFlexibleDtlGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
	 	'GCP.view.AgreementFlexibleDtlGroupActionView', 'Ext.ux.gcp.SmartGrid','Ext.util.Point'
	],
	xtype : 'agreementFlexibleDtlGridViewType',
	cls : 'xn-panel',
	bodyPadding : '2 4 2 2',
	autoHeight : true,
	width : '100%',
	parent : null,
	initComponent : function()
	{
		var me = this;
		Ext.create( 'GCP.view.AgreementFlexibleDtlGroupActionView',
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
				/*collapsible : true,
				width : '100%',
				cls : 'xn-panel',
				title : getLabel( 'instructionSummary', 'Flexible Agreement Summary' ),
				*/itemId : 'agreementDtlViewItemId',
				items :
				[
					{
						xtype : 'container',
						layout : 'hbox'
						//items :
						/*[
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
						]*/

					}
				]
			}
		];
		this.callParent( arguments );
	}
} );
