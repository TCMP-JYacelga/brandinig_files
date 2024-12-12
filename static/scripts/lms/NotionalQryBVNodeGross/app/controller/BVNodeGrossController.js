Ext.define( 'GCP.controller.BVNodeGrossController',
{
	extend : 'Ext.app.Controller',
	views :
	[
		'GCP.view.BVNodeGrossView', 'GCP.view.BVNodeGrossAccruedGridView', 'GCP.view.BVNodeGrossSettledGridView',
		'GCP.view.BVNodeGrossApportionmentGridView','GCP.view.BVNodeGrossAccruedAccountGridView', 'GCP.view.BVNodeGrossSettledAccountGridView'
		
	],
	refs : [],
	config : {},
	init : function()
	{
		var me = this;

		me.control(
		{
			'bVNodeGrossAccruedGridViewType' :
			{
				render : function( panel )
				{
				}
			},
			'bVNodeGrossSettledGridViewType' :
			{
				render : function( panel )
				{
				}
			},
			'bVNodeGrossApportionmentGridViewType' :
			{
				render : function( panel )
				{
				}
			},
			'bVNodeGrossAccruedAccountGridViewType' :
			{
				render : function( panel )
				{
				}
			},
			'bVNodeGrossSettledAccountGridViewType' :
			{
				render : function( panel )
				{
				}
			}
		} );
	}
} );
