/**
 * @class GCP.controller.BankAdminCategoryPrivilegeController
 * @extends Ext.app.Controller
 * @author Nilesh Shinde
 */

Ext
	.define(
		'GCP.controller.BankAdminPrivilegeViewController',
		{
			extend : 'Ext.app.Controller',
			requires : [],
			views :
			[
				'GCP.view.BankAdminPrivilegeView'
			],
			refs :
			[
				{
					ref : 'lmsHeaderViewIcon',
					selector : 'bankAdminPrivilegeViewPopupType container panel panel[id="lmsHeader"] button[itemId="lmsHeader_viewIcon"]'
				}
			],//refs

			init : function()
			{
				var me = this;
				me
					.control(
					{
						'bankAdminPrivilegeViewPopupType container panel panel[id="masterHeader"] button[itemId="masterHeader_viewIcon"]' :
						{
							click : me.toggleCheckUncheck
						}
					} );
			},//init

			changeIcon : function( btn )
			{
				if( btn.icon.match( 'icon_uncheckmulti.gif' ) )
				{
					btn.setIcon( "./static/images/icons/icon_checkmulti.gif" );
					return true;
				}
				else
				{
					btn.setIcon( "./static/images/icons/icon_uncheckmulti.gif" );
					return false;
				}
			},

			setcheckboxValues : function( selectValue, items, mode )
			{
				for( var i = 0 ; i < items.length ; i++ )
				{
					var checkbox = items[ i ];
					if( checkbox.itemId != '601_VIEW' )
					{
						if( checkbox.mode === mode )
							checkbox.setValue( selectValue );
					}
				}
			},

			toggleCheckUncheck : function( btn, e, eOpts )
			{
				var me = this;
				var btnId = btn.itemId;
				switch( btnId )
				{
					case 'masterHeader_viewIcon':
						var selectValue = me.changeIcon( btn );
						var mode = 'VIEW';
						var items = me.getMasterHeaderPanel().query( 'checkbox' );
						me.setcheckboxValues( selectValue, items, mode );
						break;
					case 'masterHeader_editIcon':
						var selectValue = me.changeIcon( btn );
						var mode = 'EDIT';
						var items = me.getMasterHeaderPanel().query( 'checkbox' );
						me.setcheckboxValues( selectValue, items, mode );
						break;
				}
			}//toggleCheckUncheck
		} );//Ext.define
