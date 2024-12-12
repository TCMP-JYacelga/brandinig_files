Ext.define( 'GCP.view.BankProcessingQueueGroupActionBarView',
{
	extend : 'Ext.toolbar.Toolbar',
	xtype : 'bankProcessingQueueGroupActionBarView',
	enableOverflow : true,
	border : false,
	componentCls : 'xn-custom xn-btn-default-toolbar-small',
	initComponent : function()
	{
		var me = this;
		me.items =
		[
			{
				text : getLabel( 'refresh1', 'List' ),
				//text : 'List' ,
				disabled : false,
				actionName : 'refreshListAction',
				maskPosition : 0,
				handler : function( btn, opts )
				{
					me.fireEvent( 'refreshMigrationData', btn, opts );
				}
			},	
			{
				text : getLabel( 'refresh1', 'Refresh All' ),
				disabled : false,
				actionName : 'refreshAllAction',
				maskPosition : 0,
				handler : function( btn, opts )
				{
					me.fireEvent( 'refreshMigrationData', btn, opts );
				}
			},	
			{
				text : getLabel( 'refresh1', 'Refresh' ),
				disabled : true,
				actionName : 'refreshAction',
				maskPosition : 3,
				handler : function( btn, opts )
				{
					me.fireEvent( 'refreshMigrationData', btn, opts );
				}
			},	
			{
				text : getLabel( 'refresh1', 'Create Client' ),
				disabled : true,
				actionName : 'createClient',
				maskPosition : 3,
				handler : function( btn, opts )
				{
					me.fireEvent( 'createMigClient', btn, opts );
				}
			},	
			{
				text : getLabel( 'refresh1', 'Align Services' ),
				disabled : true,
				actionName : 'alignClient',
				maskPosition : 3,
				handler : function( btn, opts )
				{
					me.fireEvent( 'alignClient', btn, opts );
				}
			},			
			{
				text : getLabel( 'cancle1', 'OK to Migrate' ),
				disabled : true,
				actionName : 'verifycancle',
				maskPosition : 3,
				handler : function( btn, opts )
				{
					me.parent.fireEvent( 'performGroupAction', btn, me.parent, opts );
					me.fireEvent( 'performGroupAction', btn, opts );
				}
			},
			{
				text : getLabel( 'verify1', 'Promote' ),
				disabled : true,
				actionName : 'verify',
				maskPosition : 4,
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
