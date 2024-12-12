/**
 * AgreementSweepDtlGroupActionView contains different buttons which are different group
 * actions which user can perform on different records in the grid.These actions
 * are enabled/disabled depending on those mask(bit positions) which is present
 * in response to service.
 */

Ext.define( 'GCP.view.AgreementSweepDtlGroupActionView',
{
	extend : 'Ext.toolbar.Toolbar',
	xtype : 'agreementSweepDtlGroupActionViewType',
	enableOverflow : true,
	border : true,
	//componentCls : 'xn-custom xn-btn-default-toolbar-small xn-custom-toolbar',
	initComponent : function()
	{
		var me = this;
		var hideAddButton = false;
		if((docmode === 'ADD' || docmode === 'EDIT') && requestState == '0')
			hideAddButton = false;
		else if (docmode === 'EDIT' && requestState != '0' && interAccountPosFlag == 'Y')
			hideAddButton = true;	
		else if(docmode === 'VIEW')
			hideAddButton = true;
		else if(requestState != '0' && interAccountPosFlag == 'N' )
			hideAddButton = false;
		/*me.items =
		[{
			
					xtype : 'button',
					border : 0,
					itemId : 'createNewItemId',
					//cls : 'cursor_pointer ux_button-background ux_button-padding ux_button-background-color ux_button-s',
					cls : 'ft-button ft-button-dark canDisable',
					parent : this,
					hidden : hideAddButton,
					actionName : 'add',
					//margin : '7 0 5 0',
					glyph : 'xf055@fontawesome',
					text : getLabel( 'addInstruction', 'Add Instruction' ),
					handler : function( btn, opts )
					{
						me.fireEvent( 'addInstruction', btn, opts );
					}
				
		}
		];*/

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
