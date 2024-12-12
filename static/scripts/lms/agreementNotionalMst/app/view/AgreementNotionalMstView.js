/**
 * @class GCP.view.AgreementNotionalMstView
 * @extends Ext.panel.Panel
 * @author Archana Shirude
 */
Ext.define( 'GCP.view.AgreementNotionalMstView',
{
	extend : 'Ext.container.Container',
	xtype : 'agreementNotionalViewType',
	requires :
	[
		'GCP.view.AgreementNotionalMstGridView','GCP.view.AgreementNotionalMstFilterView'
	],
	width : '100%',
	//autoHeight : true,
	//minHeight : 600,
	initComponent : function()
	{
		var me = this;
		me.items =
		[
			{
				xtype : 'panel',
				width : '100%',
				baseCls : 'page-heading ux_extralargepadding-bottom',
				defaults :
				{
					style :
					{
						padding : '0 0 0 4px'
					}
				},
				layout :
				{
					type : 'hbox'
				},
				items :
				[
					{
						xtype : 'label',
						text : getLabel( 'lbl.lms.agreementNotional', 'Notional Setup' ),
						cls : 'page-heading'
					},
					{
						xtype : 'label',
						flex : 19
					},{
						xtype : 'button',
						itemId : 'downloadPdf',
						cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
						glyph : 'xf1c1@fontawesome',
						border : 0,
						text : getLabel('lbl.lms.report', 'Report'),
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('performReportAction', btn, opts);
						}
					},{
						xtype : 'button',
						border : 0,
						text : getLabel('lbl.lms.export', 'Export'),
						cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
						glyph : 'xf019@fontawesome',
						margin : '0 0 0 0',
						width: 75,
						menu : Ext.create('Ext.menu.Menu', {
							items : [{
								text : getLabel('xlsBtnText', 'XLS'),
								glyph : 'xf1c3@fontawesome',
								itemId : 'downloadXls',
								parent : this,
								handler : function(btn, opts) {
									this.parent.fireEvent('performReportAction',
											btn, opts);
								}
							}, {
								text : getLabel('csvBtnText', 'CSV'),
								glyph : 'xf0f6@fontawesome',
								itemId : 'downloadCsv',
								parent : this,
								handler : function(btn, opts) {
									this.parent.fireEvent('performReportAction',
											btn, opts);
								}
							}, {
								text : getLabel('tsvBtnText', 'TSV'),
								glyph : 'xf1c9@fontawesome',
								itemId : 'downloadTsv',
								parent : this,
								handler : function(btn, opts) {
									this.parent.fireEvent('performReportAction',
											btn, opts);
								}
							}, {
								text : getLabel('withHeaderBtnText', 'With Header'),
								xtype : 'menucheckitem',
								itemId : 'withHeaderId',
								checked : 'true'
							}]
						})
					}
				]
			},
			{
				xtype : 'agreementNotionalFilterViewType',
				width : '100%',
				margin : '0 0 12 0',
				title : getLabel( 'filterBy', 'Filter By: ' )
					+ '&nbsp;<img id="imgFilterInfoGridView" class="largepadding icon-information"/>'

			},
			{
				xtype : 'panel',
				margin : '0 0 12 0',
				layout :
				{
					type : 'hbox'
				},
				items :
				[					
					{
										xtype : 'toolbar',
										cls : ' ux_panel-background',
										flex : 1,
										items :
										[
											{
												xtype : 'button',
												border : 0,
												itemId : 'createNewItemId',
												cls : 'cursor_pointer ux_button-background ux_button-padding ux_button-background-color ux_button-s',
												parent : this,
												//margin : '7 0 5 0',
												hidden : canEdit == 'false' ? true : false,
												glyph : 'xf055@fontawesome',
												text : getLabel( 'lms.notionalMst.newNotionalAgreement', 'Create New Notional Agreement' ),
												handler : function()
												{
													this.fireEvent( 'addNewAgreementEvent' );
												}
											}
										]

									}
				]
			},
			{
				xtype : 'agreementNotionalGridViewType',
				width : '100%'
			}
		];
		me.on( 'resize', function()
		{
			me.doLayout();
		} );
		me.callParent( arguments );
	}
} );
