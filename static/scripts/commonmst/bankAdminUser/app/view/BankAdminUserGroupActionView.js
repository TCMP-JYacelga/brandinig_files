/**
 * BankAdminUserGroupActionView contains different buttons which are
 * different group actions which user can perform on different records in the
 * grid.These actions are approve/reject depending on those mask(bit positions)
 * which is present in response to service.
 */

Ext.define( 'GCP.view.BankAdminUserGroupActionView',
{
	extend : 'Ext.toolbar.Toolbar',
	xtype : 'bankAdminUserGroupActionViewType',
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
				//src : 'static/images/icons/icon_spacer.gif',
				height : 17,
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
				//src : 'static/images/icons/icon_spacer.gif',
				height : 17,
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
				//src : 'static/images/icons/icon_spacer.gif',
				height : 17,
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
				//src : 'static/images/icons/icon_spacer.gif',
				height : 17,
				hidden : ADMINSSO == 'Y' ? true : false,
				padding : '5 0 0 0'
			},
			{
				text : getLabel( 'actionDisable', 'Suspend' ),
				disabled : true,
				actionName : 'disable',
				maskPosition : 6,
				hidden : ADMINSSO == 'Y' ? true : false,
				handler : function( btn, opts )
				{
					me.fireEvent( 'performGroupAction', btn, opts );
				}
			},
			{
				xtype : 'image',
				//src : 'static/images/icons/icon_spacer.gif',
				height : 17,
				hidden : ADMINSSO == 'Y' ? true : false,
				padding : '5 0 0 0'
			},
			{
				text : getLabel( 'actionEnable', 'Enable' ),
				disabled : true,
				actionName : 'enable',
				maskPosition : 5,
				hidden : ADMINSSO == 'Y' ? true : false,
				handler : function( btn, opts )
				{
					me.fireEvent( 'performGroupAction', btn, opts );
				}
			},			
			{
				xtype : 'image',
				//src : 'static/images/icons/icon_spacer.gif',
				height : 17,
				hidden : ADMINSSO == 'Y' ? true : false,
				padding : '5 0 0 0'
			},
			{
				text : getLabel( 'actionClearUser', 'Unlock' ),
				disabled : true,
				actionName : 'clearUser',
				maskPosition : 10,
				hidden : (ADMINSSO == 'Y' && showClearUser == 'N') ? true : false,
				handler : function( btn, opts )
				{
					me.fireEvent( 'performGroupAction', btn, opts );
				}
			},
			{
				xtype : 'image',
				//src : 'static/images/icons/icon_spacer.gif',
				height : 17,
				hidden : (ADMINSSO == 'Y' && showClearUser == 'N') ? true : false,
				padding : '5 0 0 0'
			},
			{
				text : getLabel( 'actionResetUser', 'Reset User' ),
				disabled : true,
				actionName : 'resetUser',
				maskPosition : 11,
				hidden : ADMINSSO == 'Y' ? true : false,
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
