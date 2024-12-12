/**
 * SweepTxnGroupActionView contains different buttons which are different group
 * actions which user can perform on different records in the grid.These actions
 * are enabled/disabled depending on those mask(bit positions) which is present
 * in response to service.
 */

Ext.define( 'GCP.view.SweepTxnGroupActionView',
{
	extend : 'Ext.toolbar.Toolbar',
	xtype : 'sweepTxnGroupActionViewType',
	enableOverflow : true,
	border : false,
	componentCls : 'xn-custom xn-btn-default-toolbar-small ',
	initComponent : function()
	{
		var me = this;
		me.items =
		[
			{
				text : getLabel( 'lblAuth', 'Approve' ),
				disabled : true,
				actionName : 'approve',
				maskPosition : 7,
				handler : function( btn, opts )
				{
					me.fireEvent( 'performGroupAction', btn, opts );
				}
			},
			{
				xtype : 'image',
				height : 3
			},
			{
				text : getLabel( 'lblReject', 'Reject' ),
				disabled : true,
				actionName : 'reject',
				maskPosition : 8,
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
