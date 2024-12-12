Ext
	.define( 'GCP.controller.BVNodeDRGrossController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[],
			views :
			[
			 	'GCP.view.BVNodeDRGrossView','GCP.view.BVNodeDRGrossAccruedGridView',
			 	'GCP.view.BVNodeDRGrossApportionmentGridView','GCP.view.BVNodeDRGrossSettledGridView',
			 	'GCP.view.BVNodeDRGrossAccruedAccountGridView','GCP.view.BVNodeDRGrossSettledAccountGridView'
			],
			refs :
			[],
			config :
			{},
			init : function()
			{
				var me = this;
				
				me.control(
					{
						'bVNodeDRGrossAccruedGridViewType' :
						{
							render : function( panel )
							{
							}
						},
						'bVNodeDRGrossApportionmentGridViewType' :
						{
							render : function( panel )
							{
							}
						},
						'bVNodeDRGrossSettledGridViewType' :
						{
							render : function( panel )
							{
							}
						},
						'bVNodeDRGrossAccruedAccountGridViewType' :
						{
							render : function( panel )
							{
							}
						},
						'bVNodeDRGrossSettledAccountGridViewType' :
						{
							render : function( panel )
							{
							}
						}
					} );
			}
		});