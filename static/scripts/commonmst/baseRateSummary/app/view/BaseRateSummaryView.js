Ext
		.define(
				'GCP.view.BaseRateSummaryView',
				{
					extend : 'Ext.container.Container',
					xtype : 'baseRateSummaryView',
					requires : [ 'Ext.container.Container',
							'GCP.view.BaseRateSummaryTitleView',
							'GCP.view.BaseRateSummaryFilterView',
							'GCP.view.BaseRateSummaryGridView' ],
					width : '100%',
					autoHeight : true,
					minHeight : 600,
					initComponent : function() {
						var me = this;
						me.items = [
								{
									xtype : 'baseRateSummaryTitleView',
									width : '100%',
									margin : '0 0 5 0'
								},
								{
									xtype : 'baseRateSummaryFilterView',
									width : '100%',
									margin : '0 0 12 0',
									cls: 'xn-ribbon ux_borderb',
									title : getLabel('filterBy', 'Filter By: ')
											+ '<img id="imgFilterInfo" class="largepadding icon-information"/>'
								}, {
									xtype : 'baseRateSummaryGridView',
									width : '100%',
									cls: 'ux_panel-background'
								} ];

						me.on('resize', function() {
							me.doLayout();
						});
						me.callParent(arguments);
					}
				});