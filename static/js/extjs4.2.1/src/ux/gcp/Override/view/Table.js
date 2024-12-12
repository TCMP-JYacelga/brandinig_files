/**
 * @class Ext.ux.gcp.Override.view.Table
 * @override Ext.view.Table
 * @author Bhakti Waghmare
 */
 
 Ext.define('Ext.ux.gcp.Override.view.Table', {
	override : 'Ext.view.Table',
	getMaxContentWidth : function(header) {
		var me = this, cells = me.el.query(header.getCellInnerSelector()), originalWidth = header
				.getWidth(), i = 0, ln = cells.length, hasPaddingBug = Ext.supports.ScrollWidthInlinePaddingBug, columnSizer = me.body
				.select(me.getColumnSizerSelector(header)), max = Math.max, paddingAdjust, maxWidth;

		if (hasPaddingBug && ln > 0) {
			paddingAdjust = me.getCellPaddingAfter(cells[0]);
		}

		// Set column width to 1px so we can detect the content width by measuring scrollWidth
		columnSizer.setWidth(1);

		// Allow for padding round text of header
		maxWidth = header.textEl.dom.offsetWidth
				+ header.titleEl.getPadding('lr');
		for (; i < ln; i++) {
			maxWidth = max(maxWidth, cells[i].scrollWidth);
		}
		if (hasPaddingBug) {
			// in some browsers, the "after" padding is not accounted for in the scrollWidth
			maxWidth += paddingAdjust;
		}

		// 40 is the minimum column width.  TODO: should this be configurable?
		maxWidth = max(maxWidth, 40);

		// Set column width back to original width
		columnSizer.setWidth(originalWidth);

		return (maxWidth + 15);
	},
	checkThatContextIsParentGridView: function(e){
        var target = Ext.get(e.target);
        var parentGridView = target.up('.x-grid-view');
       	if(this.el!=null && parentGridView!=null ) {
       		if (this.el.id!= parentGridView.el.id) {
	            return false;
	        } else {
	            return true;
	        }
       	} else if(parentGridView === null) {
       		return true;
       	}
       	
    },
    processItemEvent: function(record, row, rowIndex, e) {
        if (e.target && !this.checkThatContextIsParentGridView(e)) {
            return false;
        } else {
            return this.callParent([record, row, rowIndex, e]);
        }
    }
});