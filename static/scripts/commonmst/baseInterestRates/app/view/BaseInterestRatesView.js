Ext
		.define(
				'GCP.view.BaseInterestRatesView',
				{
					extend : 'Ext.container.Container',
					xtype : 'baseInterestRatesView',
					requires : [ 'Ext.container.Container',
							'GCP.view.BaseInterestRatesTitleView',
							'GCP.view.BaseInterestRatesFilterView',
							'GCP.view.BaseInterestRatesActionView',
							'GCP.view.BaseInterestRatesGridView' ],
					width : '100%',
					autoHeight : true,
					//minHeight : 600,
					initComponent : function() {
						var me = this;
						var actionBar = Ext.create( 'GCP.view.BaseInterestRatesActionView',
							{
								itemId : 'groupActionBarView',
								height : 21,
								width : '100%',
								margin : '1 0 0 0',
								parent : me
							} );
						
						me.items = [
								{
									xtype : 'baseInterestRatesTitleView',
									width : '100%',
									margin : '0 0 5 0'
								},
								{
									xtype : 'baseInterestRatesFilterView',
									width : '100%',
									margin : '0 0 5 0',
									title : getLabel('filterBy', 'Filter By: ')
											+ '<img id="imgFilterInfo" class="largepadding icon-information"/>'
								}, 
								{
									xtype : 'panel',
									layout : 'vbox',
									collapsible: true,
									cls: 'xn-ribbon ux_extralargemargin-top ux_panel-transparent-background',
									title: getLabel('baseInterestRates','Base Interest Rates'),
									bodyCls: 'x-portlet ux_no-padding',
									items :
									[{
										xtype: 'container',
										cls: 'ux_border-top',
										width: '100%',
										layout: 'hbox',
										items: [
										{
											xtype : 'label',
											text : getLabel( 'actions', 'Actions' ) + ':',
											cls : 'ux_font-size14',
											padding : '5 0 0 10'
										}, 
										actionBar,
										{
											xtype : 'label',
											text : '',
											flex : 1
										}]
									}
									, {
									xtype : 'baseInterestRatesGridView',
									width : '100%'
								} 
									]
								}
								
								];

						me.on('resize', function() {
							me.doLayout();
						});
						me.callParent(arguments);
					}
				});