/**
 * @class AddNewRedemptionPopup
 * @extends Ext.window.Window
 * @author Vaidehi
 */

Ext.define( 'GCP.view.AddNewRedemptionPopup',
{
	extend : 'Ext.window.Window',
	requires : 'GCP.view.NewRedemption',
	xtype : 'addNewRedemptionPopup',
	width : 450,
	height : 300,
	parent : null,
	modal : true,
	closeAction : 'hide',
	initComponent : function()
	{
		var me = this;
		this.title = getLabel( 'AddRedemption', 'Add Redemption' );
		
		
		me.items =
			[
				{
					xtype : 'newRedemption',
					itemId : 'newRedemptionId',
					callerParent : me.parent
				}
			];
		this.callParent( arguments );
	}
} );
