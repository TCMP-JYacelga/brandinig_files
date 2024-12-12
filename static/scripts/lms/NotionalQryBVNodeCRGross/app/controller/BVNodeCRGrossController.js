Ext.define( 'GCP.controller.BVNodeCRGrossController',
{
	extend : 'Ext.app.Controller',
	views :
	[
		'GCP.view.BVNodeCRGrossView', 'GCP.view.BVNodeCRGrossAccruedGridView', 'GCP.view.BVNodeCRGrossSettledGridView',
		'GCP.view.BVNodeCRGrossApportionGridView', 'GCP.view.BVNodeCRGrossAccruedAccountGridView', 'GCP.view.BVNodeCRGrossSettledAccountGridView'
	],
	refs : [],
	config : {},
	init : function()
	{
		var me = this;

		me.control(
		{
			'bVNodeCRGrossAccruedGridViewType' :
			{
				render : function( panel )
				{
				}
			},
			'bVNodeCRGrossSettledGridViewType' :
			{
				render : function( panel )
				{
				}
			},
			'bVNodeCRGrossApportionGridViewType' :
			{
				render : function( panel )
				{
				}
			},
			'bVNodeCRGrossAccruedAccountGridViewType' :
			{
				render : function( panel )
				{
				}
			},
			'bVNodeCRGrossSettledAccountGridViewType' :
			{
				render : function( panel )
				{
				}
			}

		} );
	}
} );
