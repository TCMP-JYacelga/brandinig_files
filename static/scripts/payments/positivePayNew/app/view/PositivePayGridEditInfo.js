Ext.define( 'GCP.view.PositivePayGridEditInfo',
{
	extend : 'Ext.window.Window',
	requires : 'GCP.view.EditPositivePayInfoPopUp',
	xtype : 'positivePayGridEditInfo',
	width : 500,
	//height : 500,
	parent : null,
	modal : true,
	closeAction : 'hide',
	initComponent : function()
	{
		var me = this;
		this.title = getLabel( 'editPositivePay', 'Positive Pay Decision' );

		me.items =
		[
			{
				xtype : 'editPositivePayInfoPopUp',
				itemId : 'editPositivePayId',
				callerParent : me.parent
			}
		];
		this.callParent( arguments );
	}
} );
