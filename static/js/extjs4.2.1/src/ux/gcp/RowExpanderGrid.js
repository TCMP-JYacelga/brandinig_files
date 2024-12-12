Ext.define('Ext.ux.gcp.RowExpanderGrid', {
	extend : 'Ext.grid.plugin.RowExpander',
	requires : ['Ext.grid.feature.RowBody', 'Ext.grid.plugin.RowExpander',
			'Ext.grid.Panel'],
    selectRowOnExpand : false,
	alias : 'plugin.rowexpandergrid',
	gridConfig : null,
	expandOnEnter : false,
	expandOnDblClick : false,
	setCmp : function(outerGrid) {
		var me = this;
		this.rowBodyTpl = new Ext.XTemplate('<div class="detailData"></div>');
		me.callParent(arguments);
		if (!me.gridConfig) {
			Ext.Error
					.raise("The 'gridConfig' config is required and is not defined.");
		}
		me.rowBodyTpl = Ext.XTemplate.getTpl(me, 'rowBodyTpl');
        rowBodyTpl = this.rowBodyTpl;
        features = [{
            ftype: 'rowbody',
            lockableScope: 'normal',
            recordsExpanded: me.recordsExpanded,
            rowBodyHiddenCls: me.rowBodyHiddenCls,
            rowCollapsedCls: me.rowCollapsedCls,
            setupRowData: me.getRowBodyFeatureData,
            setup: me.setup,
            getRowBodyContents: function(record) {
                return rowBodyTpl.applyTemplate(record.getData());
            }
        },{
            ftype: 'rowwrap',
            lockableScope: 'normal'
        }];
 
        if (outerGrid.features) {
        	outerGrid.features = Ext.Array.push(features, outerGrid.features);
        } else {
        	outerGrid.features = features;
        }
        // NOTE: features have to be added before init (before Table.initComponent)
	},
	init : function(outerGrid) {
		var me = this;
		outerGrid.getView().on('expandbody', me.addInnerGridOnExpand, me);
		this.callParent(arguments);
	},
	addInnerGridOnExpand : function(rowNode, record, expandRow, eOpts, outerGrid, rowIndex) {
		var me = this;
		if (Ext.fly(rowNode).down('.x-grid-view')) {
			return;
		}
		me.recordsExpanded[record.internalId] = false;
		var detailData = Ext.DomQuery.select("div.detailData", expandRow);
		if(detailData[0].childNodes.length == 0){
			var innerGrid = Ext.create('Ext.ux.gcp.SmartGrid', me.gridConfig);
			innerGrid.render(detailData[0]);
			var normalView = outerGrid.getView().normalView;
			outerGrid.fireEvent('expandedrow', record, outerGrid, innerGrid, me.gridConfig.storeModel, rowIndex);
		}
	},
	beforeReconfigure: function(grid, store, columns, oldStore, oldColumns) {
        var expander = this.getHeaderConfig();
        expander.locked = false;
        columns.unshift(expander);
    },
    getHeaderConfig: function() {
        var me = this;
        return {
            width: 50,
            colType : 'actioncontent',
            locked: false,
            lockable: false,
            sortable: false,
            resizable: false,
            draggable: false,
            hideable: false,
            menuDisabled: true,
            tdCls: Ext.baseCSSPrefix + 'grid-cell-special',
            innerCls: Ext.baseCSSPrefix + 'grid-cell-inner-row-expander',
            renderer: function(value, metadata) {
            	if(!Ext.isEmpty(metadata.record.data.reconciliationInvoiceHeaderBean))
            		return '<div class="' + Ext.baseCSSPrefix + 'grid-row-expander"></div>';
				else if(!Ext.isEmpty(metadata.record.data.receiptHeaderBean))
            		return '<div class="' + Ext.baseCSSPrefix + 'grid-row-expander"></div>';
            	else
            		return "";	
            },
            processEvent: function(type, view, cell, rowIndex, cellIndex, e, record) {
                if (type == "mousedown" && e.getTarget('.x-grid-row-expander')) {
                	view.up('smartgrid').fireEvent('expanderClicked',  view, cell, rowIndex, cellIndex, e, record);
                    me.toggleRow(rowIndex, record);
                    return me.selectRowOnExpand;
                }
            }
        };
    }
});