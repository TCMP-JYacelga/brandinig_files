/**
 * SweepTxnAgreementGroupActionView contains different buttons which are different group
 * actions which user can perform on different records in the grid.These actions
 * are enabled/disabled depending on those mask(bit positions) which is present
 * in response to service.
 */

Ext.define( 'GCP.view.SweepTxnAgreementGroupActionView',
{
	extend : 'Ext.toolbar.Toolbar',
	xtype : 'sweepTxnAgreementGroupActionViewType',
	enableOverflow : true,
	border : false,
	componentCls : 'xn-custom xn-btn-default-toolbar-small xn-custom-toolbar',
	initComponent : function()
	{
		var me = this;
		me.items =
		[
			{
				text : getLabel( 'adjustment', 'Adjustment' ),
				disabled : true,
				actionName : 'btnAdjustment',
				maskPosition : 2,
				handler : function( btn, opts )
				{
					me.fireEvent( 'performGroupAction', btn, opts );
				}
			},
			{
				xtype : 'image',
				height : 5
			},
			{
				text : getLabel( 'transfer', 'Transfer' ),
				disabled : true,
				actionName : 'btnTransfer',
				maskPosition : 3,
				handler : function( btn, opts )
				{
					me.fireEvent( 'performGroupAction', btn, opts );
				}
			},
			{
				xtype : 'image',
				height : 5
			},
			{
				text : getLabel( 'execute', 'Execute' ),
				disabled : true,
				actionName : 'btnExecute',
				maskPosition : 4,
				handler : function( btn, opts )
				{
					me.fireEvent( 'performGroupAction', btn, opts );
				}
			},
			{
				xtype : 'image',
				height : 5
			},
			{
				text : getLabel( 'simulate', 'Simulate' ),
				disabled : true,
				actionName : 'btnSimulate',
				maskPosition : 5,
				handler : function( btn, opts )
				{
					me.fireEvent( 'performGroupAction', btn, opts );
				}
			},
			{
				xtype : 'image',
				height : 5
			},
			{
				text : getLabel( 'cancelSchedule', 'Cancel Schedule' ),
				disabled : true,
				actionName : 'btnCancelSchedule',
				maskPosition : 6,
				handler : function( btn, opts )
				{
					me.fireEvent( 'performGroupAction', btn, opts );
				}
			}
		];

		me.callParent();
	},
	listeners :
	{
		resize : function( toolbar, width, height, oldWidth, oldHeight, eOpts )
		{
			// This Code is used to change toolbar's menu trigger button i.e >>
			// to |more
			var tbarId = toolbar.id;
			var button = Ext.select( 'a[id="' + tbarId + '-menu-trigger-btnEl"]' );
			var imgSpan = Ext.select( 'span[id="' + tbarId + '-menu-trigger-btnIconEl"]' );
			var txtSpan = Ext.select( 'span[id="' + tbarId + '-menu-trigger-btnInnerEl"]' );
			if( button )
			{
				if( imgSpan )
					imgSpan.remove();
				if( txtSpan )
					txtSpan.remove();
				button.setHTML( getLabel( 'moreMenuTitle', 'more' ) );
				button.addCls( 'xn-trigger-cls' );
			}

		}
	}
} );
