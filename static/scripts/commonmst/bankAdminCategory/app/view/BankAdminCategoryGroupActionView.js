/**
 * @class GCP.view.BankAdminCategoryHistoryView
 * @extends Ext.toolbar.Toolbar
 * @author Nilesh Shinde
 */

/**
 * BankAdminCategoryGroupActionView contains different buttons which are
 * different group actions which user can perform on different records in the
 * grid.These actions are approve/reject depending on those mask(bit positions)
 * which is present in response to service.
 */

Ext.define( 'GCP.view.BankAdminCategoryGroupActionView',
{
	extend : 'Ext.toolbar.Toolbar',
	xtype : 'bankAdminCategoryGroupActionViewType',
	enableOverflow : true,
	border : false,
	componentCls : 'xn-custom xn-btn-default-toolbar-small xn-custom-toolbar',

	initComponent : function()
	{
		var me = this;
		me.items =
		[
			{
				text : getLabel( 'actionSubmit', 'Submit' ),
				disabled : true,
				actionName : 'submit',
				maskPosition : 1,
				handler : function( btn, opts )
				{
					me.fireEvent( 'performGroupAction', btn, opts );
				}
			},
			{
				xtype : 'image',
				padding : '5 0 0 0'
			},
			{
				text : getLabel( 'actionDiscard', 'Discard' ),
				disabled : true,
				actionName : 'discard',
				maskPosition : 4,
				handler : function( btn, opts )
				{
					me.fireEvent( 'performGroupAction', btn, opts );
				}
			},
			{
				xtype : 'image',
				padding : '5 0 0 0'
			},
			{
				text : getLabel( 'actionApprove', 'Approve' ),
				disabled : true,
				actionName : 'accept',
				maskPosition : 2,
				handler : function( btn, opts )
				{
					me.fireEvent( 'performGroupAction', btn, opts );
				}
			},
			{
				xtype : 'image',
				padding : '5 0 0 0'
			},
			{
				text : getLabel( 'actionReject', 'Reject' ),
				disabled : true,
				actionName : 'reject',
				maskPosition : 3,
				handler : function( btn, opts )
				{
					me.fireEvent( 'performGroupAction', btn, opts );
				}
			},			
			{
				xtype : 'image',
				padding : '5 0 0 0'
			},
			{
				text : getLabel( 'actionDisable', 'Suspend' ),
				disabled : true,
				actionName : 'disable',
				maskPosition : 6,
				handler : function( btn, opts )
				{
					me.fireEvent( 'performGroupAction', btn, opts );
				}
			}
			,
			{
				xtype : 'image',
				padding : '5 0 0 0'
			},
			{
				text : getLabel( 'actionEnable', 'Enable' ),
				disabled : true,
				actionName : 'enable',
				maskPosition : 5,
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
