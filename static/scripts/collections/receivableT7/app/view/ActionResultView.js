/**
 * @class GCP.view.ActionResultView
 * @extends Ext.panel.Panel
 * @author Vinay Thube
 */
Ext.define('GCP.view.ActionResultView', {
			extend : 'Ext.panel.Panel',
			requires : ['Ext.grid.column.Action', 'Ext.button.Button',
					'Ext.grid.Panel', 'Ext.data.Store'],
			xtype : 'actionResultView',
			config : {
				store : null
			},
			header : true,
			border : false,
			width : '100%',
			collapsible : true,
			collapsed : false,
			componentCls : 'xn-panel-noborder xn-panel',
			title : getLabel('instrumentsActionResultTitle',
					'Recent Action Result'),
			initComponent : function() {
				var me = this;
				me.tools = [{
							xtype : 'button',
							itemId : 'closeBtn',
							icon : 'static/images/icons/icon_close.png',
							textAlign : 'right',
							cls : 'xn-account-filter-btnmenu',
							handler : function() {
								me.fireEvent('resultpanelclose');
								me.hide();
							}
						}];
				me.config.store = Ext.create('Ext.data.Store', {
							fields : ['success', 'actualSerailNo',
									'actionMessage', 'actionTaken',
									'isProductCutOff', 'lastActionUrl',
									'reference'],
							autoLoad : false,
							pageSize : 1
						});
				me.items = [{
					xtype : 'grid',
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
					columns : [{
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
							return getLabel('instrumentsColumnClientReference',
									'Client Reference')
									+ ' : '
									+ '<b>'
									+ record.get('reference')
									+ '<b/>' + '<br/>' + value;
						}
					}, {
						xtype : 'actioncolumn',
						hideable : false,
						sortable : false,
						align : 'left',
						tdCls : 'xn-grid-cell-padding xn-no-border xn-valign-middle',
						width : 50,
						items : [{
							scope : this,
							tooltip : getLabel('yesToolTip', 'Yes'),
							btnId : 'btnYes',
							handler : function(grid, rowIndex, columnIndex,
									item, event, record) {
								/**
								 * @event handleProductCutoff fires when button
								 *        is clicked, On click of this button
								 *        the current request which had an
								 *        warning is again sent to server for
								 *        processing.
								 * @param {Ext.grid.Panel}
								 *            grid reference to current grid
								 * @param {number}
								 *            rowIndex index of current row
								 * @param {number}
								 *            columnIndex index of current
								 *            column
								 * @param {number}
								 *            item reference current button
								 * @param {number}
								 *            event current event
								 * @param {Ext.data.Model}
								 *            record current error record
								 */
								me.fireEvent("handleProductCutoff", grid,
										rowIndex, columnIndex, item, event,
										record, 'Y');
							},
							getClass : function(value, metaData, record,
									rowIndex, colIndex, store, view) {
								if (record.get('isProductCutOff') === 'Y')
									return 'icon_yes x_margin_r_5 cursor_pointer';
							}
						}, {
							scope : this,
							tooltip : getLabel('noToolTip', 'No'),
							btnId : 'btnNo',
							handler : function(grid, rowIndex, columnIndex,
									item, event, record) {
								/**
								 * @event handleProductCutoff fires when button
								 *        is clicked, On click of this button
								 *        the current request which had an
								 *        warning is again sent to server for
								 *        processing.
								 * @param {Ext.grid.Panel}
								 *            grid reference to current grid
								 * @param {number}
								 *            rowIndex index of current row
								 * @param {number}
								 *            columnIndex index of current
								 *            column
								 * @param {number}
								 *            item reference current button
								 * @param {number}
								 *            event current event
								 * @param {Ext.data.Model}
								 *            record current error record
								 */
								me.fireEvent("handleProductCutoff", grid,
										rowIndex, columnIndex, item, event,
										record, 'N');
							},
							getClass : function(value, metaData, record,
									rowIndex, colIndex, store, view) {
								if (record.get('isProductCutOff') === 'Y')
									return 'icon_no cursor_pointer';
							}
						}]
					}]
				}];
				this.callParent();
			},
			loadResultData : function(data) {
				var me = this;
				if (!Ext.isEmpty(data)) {
					var errorGrid = me.down('grid');
					var store = errorGrid ? errorGrid.store : null;;
					if (!Ext.isEmpty(store)) {
						store.removeAll();
						store.loadData(data);
					}
				}
			}

		});