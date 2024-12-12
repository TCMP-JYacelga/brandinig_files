
Ext.define( 'GCP.view.BankScheduleDtlGroupActionBarView',
{
	extend : 'Ext.toolbar.Toolbar',
	xtype : 'bankScheduleDtlGroupActionBarView',
	enableOverflow : true,
	border : false,
	componentCls : 'xn-custom xn-btn-default-toolbar-small xn-custom-toolbar',
	initComponent : function()
	{
		var me = this;
		me.items =
		[
			{
				text : getLabel('bankScheduleScheduleActionSubmit', 'Submit'),
				disabled : true,
				actionName : 'submit',
				maskPosition : 1,
				handler : function(btn, opts) {
					me.parent.fireEvent( 'performGroupScheduleAction', btn, me.parent, opts );
					me.fireEvent( 'performGroupScheduleAction', btn, opts );
				}
			},
			{
				xtype : 'image',
				height : 17,
				hidden : false,
				padding : '5 0 0 0'
			},
			{
				text : getLabel( 'bankScheduleScheduleActionApprove', 'Approve' ),
				disabled : true,
				actionName : 'accept',
				maskPosition : 2,
				handler : function( btn, opts )
				{
					me.parent.fireEvent( 'performGroupScheduleAction', btn, me.parent, opts );
					me.fireEvent( 'performGroupScheduleAction', btn, opts );
				}
			},
			{
				xtype : 'image',
				height : 17,
				hidden : false,
				padding : '5 0 0 0'
			},
			{
				text : getLabel( 'bankScheduleScheduleActionReject', 'Reject' ),
				disabled : true,
				actionName : 'reject',
				maskPosition : 3,
				handler : function( btn, opts )
				{
					me.parent.fireEvent( 'performGroupScheduleAction', btn, me.parent, opts );
					me.fireEvent( 'performGroupScheduleAction', btn, opts );
				}
			},
			{
				xtype : 'image',
				height : 17,
				hidden : false,
				padding : '5 0 0 0'
			},
			{
				text : getLabel( 'bankScheduleActionEnable', 'Enable' ),
				disabled : true,
				actionName : 'enable',
				maskPosition : 4,
				handler : function( btn, opts )
				{
					me.parent.fireEvent( 'performGroupScheduleAction', btn, me.parent, opts );
					me.fireEvent( 'performGroupScheduleAction', btn, opts );
				}
			},
			{
				xtype : 'image',
				height : 17,
				hidden : false,
				padding : '5 0 0 0'
			},
			{
				text : getLabel( 'bankScheduleScheduleActionSuspend', 'Suspend' ),
				disabled : true,
				actionName : 'disable',
				maskPosition : 5,
				handler : function( btn, opts )
				{
					me.parent.fireEvent( 'performGroupScheduleAction', btn, me.parent, opts );
					me.fireEvent( 'performGroupScheduleAction', btn, opts );
				}
			},
			{
				xtype : 'image',
				height : 17,
				hidden : false,
				padding : '5 0 0 0'
			},
			{
				text : getLabel('bankScheduleScheduleActionDiscard', 'Discard'),
				disabled : true,
				actionName : 'discard',
				maskPosition : 6,
				handler : function(btn, opts) {
					me.parent.fireEvent( 'performGroupScheduleAction', btn, me.parent, opts );
					me.fireEvent( 'performGroupScheduleAction', btn, opts );
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