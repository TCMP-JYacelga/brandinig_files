Ext
	.define( 'GCP.controller.BVNodeNetController',
		{
			extend : 'Ext.app.Controller',
			views :
			[
			 	'GCP.view.BVNodeNetView','GCP.view.BVNodeNetAccruedGridView','GCP.view.BVNodeNetApportionmentGridView',
			 	'GCP.view.BVNodeNetSettledGridView','GCP.view.BVNodeNetSettledAccountGridView','GCP.view.BVNodeNetAccruedAccountGridView'
			],
			refs :
			[
			],
			config :
			{

			},
			init : function()
			{
				var me = this;
				
				me.control(
					{
						'bVNodeNetAccruedGridViewType' :
						{
							render : function( panel )
							{
							}
						},
						'bVNodeNetSettledGridViewType' :
						{
							render : function( panel )
							{
							}
						},
						'bVNodeNetApportionmentGridViewType' :
						{
							render : function( panel )
							{
								
							}
						},
						'bVNodeNetAccruedAccountGridViewType' :
						{
							render : function( panel )
							{
							}
						},
						'bVNodeNetSettledAccountGridViewType' :
						{
							render : function( panel )
							{
							}
						}
					} );
			}
		});