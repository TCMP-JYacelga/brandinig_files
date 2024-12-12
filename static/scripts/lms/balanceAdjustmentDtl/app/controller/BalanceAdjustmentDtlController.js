Ext.define( 'GCP.controller.BalanceAdjustmentDtlController',
{
	extend : 'Ext.app.Controller',
	requires : [],
	views :
	[
		'GCP.view.BalanceAdjustmentDtlView', 'GCP.view.BalanceAdjustmentDtlGridView'
	],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs :
	[
		{
			ref : 'balanceAdjustmentDtlViewRef',
			selector : 'balanceAdjustmentDtlViewType'
		},
		{
			ref : 'balanceAdjustmentDetailGridView',
			selector : 'balanceAdjustmentDetailGridViewType'
		},
		{
			ref : 'addbtn',
			selector : 'balanceAdjustmentDtlViewType button[itemId="addbtn"]'
		},
		{
			ref : 'deletebtn',
			selector : 'balanceAdjustmentDtlViewType button[itemId="deletebtn"]'
		}
	],
	config : {

	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function()
	{
		var me = this;
		me.control(
		{
			'balanceAdjustmentDtlViewType' :
			{
				render : function( panel )
				{
				},
				beforerender : function( panel, opts )
				{
					if(pageMode == 'EDIT' )
					{
						me.getAddbtn().show();
						me.getDeletebtn().show();
					}
					else
					{
						me.getAddbtn().hide();
						me.getDeletebtn().hide();
					}
				}
			},
			'balanceAdjustmentDetailGridViewType' :
			{
				render : function( panel )
				{
					
				},
				disableAddSlabButon : function( panel )
				{
				}
			},
			'balanceAdjustmentDtlViewType button[itemId="addbtn"]' :
			{
				click : function( btn, opts )
				{
					me.addNewRow();
				}
			},
			'balanceAdjustmentDtlViewType button[itemId="deletebtn"]' :
			{
				click : function( btn, opts )
				{
					me.deleteRow();
				}
			}
		} );
	},
	addNewRow : function()
	{
		var me = this;
		var detailGrid = me.getBalanceAdjustmentDetailGridView();
		var detailRecords = detailGrid.store.data.items;
		rowPageMode = 'ADD';
		var r = Ext.ModelManager.create(
		{
			accountName : null,
			accountId : null,
			fromDate : document.getElementsByName("effectiveFromDate")[0].value,
			toDate : document.getElementsByName("effectiveToDate")[0].value,
			currency : null,
			balanceDelta : 0.00
		}, detailGrid.store.model.getName() );
		detailGrid.store.insert( detailRecords.length, r );
	},
	deleteRow : function()
	{
		var me = this ;
		var detailGrid = me.getBalanceAdjustmentDetailGridView();
		var isDeleted = false;
		var detailRecords = detailGrid.store.data.items; 
		for( var index = 0 ; index < detailRecords.length ; index++ )
		{
			isDeleted = detailRecords[ index ].data.isDeleted;
			if( isDeleted )
			{
				detailGrid.store.removeAt(index);
				detailRecords = detailGrid.store.data.items;
				index--;
				//break;
			}
			
		}
	}
} );
