Ext
	.define(
		'GCP.view.LmsNotionalPoolViewGridView',
		{
			extend : 'Ext.panel.Panel',
			requires :
			[
				'Ext.data.*', 'Ext.grid.*', 'Ext.util.*', 'Ext.tree.*', 'Ext.ux.CheckColumn'
			],
			xtype : 'lmsNotionalPoolViewGridViewType',
			autoHeight : true,
			title: getLabel( 'lbl.lmsNotionalPoolView.title', 'Pool View' ),
			minHeight : 140,
			maxHeight : 500,
			parent : null,
			//title : getLabel( 'lbl.lmsNotionalPoolView.title', 'Pool View' ) + '' + 'Download xls',
			initComponent : function()
			{
				var me = this;
				this.items =
				[
					/*{
						xtype : 'container',
						layout : 'hbox',
						width : '100%',
						items :
						[
							{
								xtype : 'container',
								layout : 'hbox',
								//cls : 'ux_hide-image',
								flex : 1,
								items :
								[
									{
										xtype : 'label',
										text : '',
										flex : 1
									},
									{
										xtype : 'container',
										layout : 'hbox',
										cls : 'rightfloating',
										padding : '0 25 0 0',
										items :
										[
											{
												xtype : 'button',
												itemId : 'doanloadXlsItemId',
												parent : this,
												cls: 'ux_panel-transparent-background',
												text : '<span class="imagelink black inline_block button-icon icon-button-download font_bold">'
													+ getLabel( 'lbl.lmsNotionalPoolView.download', 'Download' )
													+ '</span>',
												//cls : 'imagelink black inline_block button-icon icon-button-download font_bold',
												handler : function()
												{
													this.parent.fireEvent( 'callToDownloadXlsPoolView' );
												}
											}
										]
									}
								]
							}
						]
					}*/
				];
				this.callParent( arguments );
			}
		} );

function downloadXlsPoolView( sessionId, agreementRecKey )
{
	var strUrl = "downloadXlsPoolViewData.srvc?" + csrfTokenName + '=' + csrfTokenValue;
	strUrl = strUrl + '&' + "$sessionId=" + sessionId + '&' + "$agreementRecKey=" + agreementRecKey;
	var frm = document.getElementById( "frmMain" );
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
