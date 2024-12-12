/**
 * AgreementNotionalDtlGroupActionView contains different buttons which are different group
 * actions which user can perform on different records in the grid.These actions
 * are enabled/disabled depending on those mask(bit positions) which is present
 * in response to service.
 */

Ext.define( 'GCP.view.AgreementNotionalDtlGroupActionView',
{
	extend : 'Ext.toolbar.Toolbar',
	xtype : 'agreementNotionalDtlGroupActionViewType',
	enableOverflow : true,
	border : false,
	componentCls : 'xn-custom xn-btn-default-toolbar-small xn-custom-toolbar',
	initComponent : function()
	{
		var me = this;
		me.items =
		[
			{
				text : getLabel( 'addSubgroup', 'Add Subgroup' ),
				actionName : 'addSubgroup',
				itemId : 'addSubgroupBtnItemId',
				hidden : pageMode == 'VIEW' ? true : structureType == NotionalStructureType.Combination ? false : true,
				disabled : true,
				handler : function( btn, opts )
				{
					me.fireEvent( 'addSubgroupAction', btn, opts );
				}
			},
			{
				text : getLabel( 'addAccount', 'Add Account' ),
				actionName : 'addAccount',
				itemId : 'addAccountBtnItemId',
				hidden : pageMode == 'VIEW' ? true : false,
				disabled : true,
				handler : function( btn, opts )
				{
					me.fireEvent( 'addAccountAction', btn, opts );
				}
			},
			{
				text : getLabel( 'delete', 'Delete' ),
				actionName : 'delete',
				itemId : 'deleteBtnItemId',
				disabled : true,
				hidden : pageMode == 'VIEW' ? true : false,
				handler : function( btn, opts )
				{
					me.fireEvent( 'deleteAction', btn, opts );
				}
			},
			{				
				text : getLabel( 'edit', 'Edit' ),
				actionName : 'edit',
				itemId : 'editBtnItemId',
				disabled : true,
				hidden : pageMode == 'VIEW' ? true : false,
				handler : function( btn, opts )
				{
					me.fireEvent( 'editViewAction', btn, opts );
				}
			},
			{				
				text : getLabel( 'view', 'View' ),
				actionName : 'view',
				itemId : 'viewBtnItemId',
				hidden : pageMode == 'VIEW' ? false : true,
				handler : function( btn, opts )
				{
					me.fireEvent( 'editViewAction', btn, opts );
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
