/**
 * @class GCP.view.PaymentQueueActionResult
 * @extends Ext.panel.Panel
 * @author Shraddha Chauhan
 * @author Vinay Thube
 */
Ext.define('GCP.view.PaymentQueueActionResult', {
			extend : 'Ext.panel.Panel',
			xtype : 'paymentQueueActionResult',
			requires : ['Ext.data.Store', 'Ext.grid.Panel',
					'Ext.grid.column.Action', 'Ext.grid.column.Date',
					'Ext.grid.column.RowNumberer', 'Ext.button.Button'],
			config : {
				store : null
			},
			header : true,
			border : false,
			width : '100%',
			collapsible : true,
			collapsed : false,
			componentCls : 'gradiant_back',
			cls : 'xn-ribbon ux_border-bottom',
			title : getLabel('instrumentsActionResultTitle',
					'Recent Action Result'),
			initComponent : function() {
				var me = this;
				me.config.store = Ext.create('Ext.data.Store', {
							fields : ['success', 'actualSerailNo',
									'actionMessage', 'actionTaken',
									'isProductCutOff', 'lastActionUrl',
									'reference'],
							autoLoad : false,
							pageSize : 1
						});
				me.tools = [{
							xtype : 'button',
							itemId : 'closeBtn',
							icon : 'static/images/icons/icon_close.png',
							textAlign : 'right',
							cls : 'xn-account-filter-btnmenu',
							handler : function() {
								me.hide();
							}
						}];
				me.items = [{
					xtype : 'grid',
					itemId : 'errorGrid',
					hideHeaders : true,
					overflowY : 'auto',
					overflowX : 'hidden',
					width : '100%',
					height : 'auto',
					maxHeight : 130,
					viewConfig : {
						stripeRows : false
					},
					store : this.config.store,
					columns : [

					{
						xtype : 'actioncolumn',
						hideable : false,
						sortable : false,
						align : 'center',
						width : '5%',
						tdCls : 'xn-grid-cell-padding xn-no-border xn-valign-middle',
						items : [{
							scope : this,
							getClass : function(value, metaData, record,
									rowIndex, colIndex, store, view) {
								if (record.get('success') === 'Y')
									return 'icon_success';
								else if (record.get('success') === 'N'
										&& record.get('isProductCutOff') === 'Y')
									return 'icon_warn';
								else if (record.get('success') === 'N')
									return 'icon_error';
							}
						}]
					}, {
						dataIndex : 'actionMessage',
						sortable : false,
						hideable : false,
						flex : 1,
						tdCls : 'xn-grid-cell-padding xn-no-border xn-valign-middle',
						renderer : function(value, metaData, record) {
							return getLabel('paymentqueue.reference',
									'Reference')
									+ ' : '
									+ '<b>'
									+ record.get('reference')
									+ '<b/>' + '<b style="padding-left: 250px;"></b>' + value;
						}
					}]
				}];
				this.callParent();
			},
			addRecords : function(arrData) {
				var me = this;
				var grid = me.down('grid[itemId="errorGrid"]');
				if (grid) {
					grid.store.removeAll();
					grid.store.loadData(arrData)

				}
			}

		});