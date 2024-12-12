Ext.define('Cashweb.view.portlet.ReportPortlet', {
					extend : 'Ext.grid.Panel',
					alias : 'widget.reports',
					requires : [ 'Cashweb.store.ReportStore' ],
					border : false,
					padding : '5 10 10 10',
					emptyText : null,
					taskRunner: null,
					minHeight: 50,
					config : {
						viewConfig : {
							stripeRows : false
						}
					},
					initComponent : function() {
						var thisClass = this;
						thisClass.emptyText = label_map.noDataFound;
						this.store = new Cashweb.store.ReportStore();
						this.columns = [
								{
									header : label_map.reportdate,
									dataIndex : 'artifactDate',
									sortable : false,
									hideable : false,
									flex : 1,
									renderer : function(value, meta, record,
											row, column, store) {
										var newDate = Ext.util.Format.date(
												value, serverdateFormat)
										return newDate;
									}
								},
								{
									header : label_map.reportname,
									dataIndex : 'title',
									sortable : false,
									hideable : false,
									flex : 2
								}, {
									xtype : 'actioncolumn',
									align : 'right',
									sortable : false,
									hideable : false,
									width : 50,
									getClass : function(value, metaData,
											record, rowIndex, colIndex, store,
											view) {
										if (!Ext.isEmpty(record.data.docPath))
											return "grid-row-action-icon downloadrep";
									},
									handler : function(grid, rowIndex,
											columnIndex, item, event, record) {
										downloadReportsAttachment(
												'downloadReportsForm',
												'downloadReport.form',
												rowIndex,
												grid.getStore().config.dashboardReportsViewState);
									}
								} ];

						this.callParent();
					}
				});