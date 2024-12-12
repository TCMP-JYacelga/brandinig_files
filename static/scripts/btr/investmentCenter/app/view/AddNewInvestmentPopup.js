/**
 * @class AddNewInvestmentPopup
 * @extends Ext.window.Window
 * @author Vaidehi
 */

Ext.define( 'GCP.view.AddNewInvestmentPopup',
{
	extend : 'Ext.window.Window',
	requires : 'GCP.view.NewInvestment',
	xtype : 'addNewInvestmentPopup',
	width : 500,
	height : 300,
	parent : null,
	modal : true,
	closeAction : 'hide',
	initComponent : function()
	{
		var me = this;
		this.title = getLabel( 'AddInvestment', 'Add Investment' );

		me.items =
		[
			{
				xtype : 'newInvestment',
				itemId : 'newInvestmentId',
				callerParent : me.parent
			}
		];
		this.callParent( arguments );
	}
} );
