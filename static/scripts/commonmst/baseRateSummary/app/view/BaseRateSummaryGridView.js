Ext
		.define(
				'GCP.view.BaseRateSummaryGridView',
				{
					extend : 'Ext.panel.Panel',
					requires : [ 'Ext.ux.gcp.SmartGrid',
							'GCP.view.BaseRateSummaryActionBarView',
							'Ext.panel.Panel' ],
					xtype : 'baseRateSummaryGridView',
					width : '100%',
					cls: 'ux_panel-transparent-background ux_largepadding',
					initComponent : function() {
						var me = this;
						var actionBar = Ext.create(
								'GCP.view.BaseRateSummaryActionBarView', {
									itemId : 'groupActionBarView',
									height : 21,
									width : '100%',
									margin : '1 0 0 0',
									parent : me
								});

						this.items = [
								{
									xtype : 'container',
									layout : 'hbox',
									flex : 1,
									items : [ {
										xtype : 'container',
										layout : 'hbox',
										cls : 'rightfloating ux_panel-background',
										items : [ {
											xtype : 'container',
											layout : {
												type : 'hbox'
											},
											items : [ {
												xtype : 'toolbar',
												cls : ' ux_panel-background',
												flex : 1,
												items : [ {
													xtype : 'button',
													border : 0,
													itemId : 'btnCreateBaseRatesMst',
													cls : 'cursor_pointer ux_button-background ux_button-padding ux_button-background-color ux_button-s',
													parent : this,
													glyph : 'xf055@fontawesome',
													hidden : !canEdit,
													text : getLabel(
															'createNewBaseRate',
															'Create Base Rate'),
													handler : function() {
														this
																.fireEvent('addNewBaseRateTypeEvent');
													}
												} ]

											} ]
										} ]

									} ]

								},
								{
									xtype : 'panel',
									width : '100%',
									cls : 'xn-ribbon ux_panel-transparent-background ux_extralargemargin-top ux_borderb',
									bodyCls : 'x-portlet ux_no-padding',
									autoHeight : true,
									collapsible: true,
									title: getLabel('baseRateSummary','Base Rates'),
									itemId : 'baseRateDetailView',
									items : [ {
										xtype : 'container',
										layout : 'hbox',
										cls: 'ux_border-top',
										items : [
												{
													xtype : 'label',
													text : getLabel('actions',
															'Actions')
															+ ':',
													cls : 'ux_font-size14',
													padding : '5 0 0 10'
												}, actionBar, {
													xtype : 'label',
													text : '',
													flex : 1
												} ]

									} ]
								} ];

						this.callParent(arguments);
					}

				});
