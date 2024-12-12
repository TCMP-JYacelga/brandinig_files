/**
 * @class GCP.controller.BtrCommonController
 * @extends Ext.app.Controller
 * @author Nilesh Shinde
 */
/**
 * This controller is prime controller in Account Summary T7 Controller which
 * handles all measure events fired from GroupView. This controller has
 * important functionality like on any change on grid status or quick filter
 * change, it forms required URL and gets data which is then shown on Summary
 * Grid.
 */
Ext.define('GCP.controller.BtrCommonController',
{
	extend : 'Ext.app.Controller',
	init : function()
	{
		var me = this;
		me.control(
		{
			'filterView' :
			{
				appliedFilterDelete : function(btn)
				{
					var strController = 'AccountSummaryController';
					if(isActivityOn)
					{
						strController = 'AccountActivityController';
					}
					else if(isBalanceOn)
					{
						strController = 'AccountBalancesController';
					}
					me.getController(strController).handleAppliedFilterDelete(btn);
				}
			}
		});
	},
});
