/**
 * PmtGroupActionBarView contains different buttons which are different group
 * actions which user can perform on different records in the grid.These actions
 * are enabled/disabled depending on those mask(bit positions) which is present
 * in response to service.
 */

Ext.define( 'GCP.view.LoanCenterGroupActionBarView',
{
	extend : 'Ext.toolbar.Toolbar',
	xtype : 'loanCenterGroupActionBarViewType',
	enableOverflow : true,
	border : false,
	componentCls : 'xn-custom xn-btn-default-toolbar-small xn-custom-toolbar',
	initComponent : function()
	{
		var me = this;
		var showBtn = false;
		var hideDiscardBtn = false;
		var editFlag = isHidden('isSiEditEnabled');
		var viewFlag = isHidden('isSiViewEnabled');
		if(!viewFlag)
		{
			if(editFlag)
				showBtn = false;
			else
				showBtn = true;
		}
		if(isSiTabSelected == 'N')
			hideDiscardBtn = false;
		else 
			hideDiscardBtn = (isSiTabSelected == 'Y' && showBtn) ? false : true;
		
		me.items =
		[
			{
				text : getLabel( 'prfMstActionApprove', 'Approve' ),
				disabled : true,
				actionName : 'accept',
				maskPosition : 1,
				hidden : isHidden( 'approvalRequired' ),
				handler : function( btn, opts )
				{
					me.parent.fireEvent( 'performGroupAction', btn, me.parent, opts );
					me.fireEvent( 'performGroupAction', btn, opts );
				}
			},
			{
				text : getLabel( 'prfMstActionReject', 'Reject' ),
				disabled : true,
				actionName : 'reject',
				maskPosition : 2,
				hidden : isHidden( 'approvalRequired' ),
				handler : function( btn, opts )
				{
					me.parent.fireEvent( 'performGroupAction', btn, me.parent, opts );
					me.fireEvent( 'performGroupAction', btn, opts );
				}
			},
			{
				text : getLabel( 'prfMstActionDiscard', 'Discard' ),
				disabled : true,
				actionName : 'discard',
				maskPosition : 3,
				hidden : hideDiscardBtn,
				handler : function( btn, opts )
				{
					me.parent.fireEvent( 'performGroupAction', btn, me.parent, opts );
					me.fireEvent( 'performGroupAction', btn, opts );
				}
			},
			{
				text : getLabel( 'prfMstActionEnable', 'Enable' ),
				disabled : true,
				actionName : 'enable',
				maskPosition : 6,
				hidden : (isSiTabSelected == 'Y' && showBtn) ? false : true,
				handler : function( btn, opts )
				{
					me.parent.fireEvent( 'performGroupAction', btn, me.parent, opts );
					me.fireEvent( 'performGroupAction', btn, opts );
				}
			},
			{
				text : getLabel( 'prfMstActionEnable', 'Disable' ),
				disabled : true,
				actionName : 'disable',
				maskPosition : 7,
				hidden : (isSiTabSelected == 'Y' && showBtn) ? false : true,
				handler : function( btn, opts )
				{
					me.parent.fireEvent( 'performGroupAction', btn, me.parent, opts );
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
				button.setHTML( getLabel( 'instrumentsMoreMenuTitle', 'more' ) );
				button.addCls( 'xn-trigger-cls' );
			}
		}
	}
} );
