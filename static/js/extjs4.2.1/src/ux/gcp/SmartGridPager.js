/**
 * @classExt.ux.gcp.SmartGridPager
 * @extends Ext.toolbar.Paging
 * @author Vinay Thube
 */
Ext.define('Ext.ux.gcp.SmartGridPager', {
	extend : 'Ext.toolbar.Paging',
	xtype : 'smartGridPager',
	showPagerRefreshLink : true,
	showPagerForced : false,
	config : {
		listeners : {
			errorOnFailure : function(oldPageNum, errMsg) {
				this.store.currentPage = oldPageNum;
			}
		}
	},

	/**
	 * Move to the first page, has the same effect as clicking the 'first'
	 * button.
	 */
	moveFirst : function() {
		var me = this;
		var oldPageNum = me.store.currentPage;
		me.store.currentPage = 1;
		this.grid.fireEvent('pagechange', this, 1, oldPageNum);
		/*
		 * if (this.fireEvent('beforechange', this, 1) !== false){
		 * this.store.loadPage(1); }
		 */
	},

	/**
	 * Move to the previous page, has the same effect as clicking the 'previous'
	 * button.
	 */
	movePrevious : function() {
		var me = this;

		prev = me.store.currentPage - 1;

		if (prev > 0) {
			me.store.currentPage = prev;
			var oldPageNum = me.store.currentPage;
			this.grid.fireEvent('pagechange', this, prev, oldPageNum);
			/*
			 * if (me.fireEvent('beforechange', me, prev) !== false) {
			 * me.store.previousPage(); }
			 */
		}
	},

	/**
	 * Move to the next page, has the same effect as clicking the 'next' button.
	 */
	moveNext : function() {
		var me = this, total = me.getPageData().pageCount, next = me.store.currentPage
				+ 1;
		var oldPageNum = me.store.currentPage;
		if (next <= total) {
			me.store.currentPage = next;
			this.grid.fireEvent('pagechange', this, next, oldPageNum);
			/*
			 * if (me.fireEvent('beforechange', me, next) !== false) {
			 * me.store.nextPage(); }
			 */
		}
	},

	/**
	 * Move to the last page, has the same effect as clicking the 'last' button.
	 */
	moveLast : function() {
		var me = this;
		var oldPageNum = me.store.currentPage;
		last = me.getPageData().pageCount;

		me.store.currentPage = last;
		this.grid.fireEvent('pagechange', this, last, oldPageNum);
		/*
		 * if (me.fireEvent('beforechange', me, last) !== false) {
		 * me.store.loadPage(last); }
		 */
	},

	/**
	 * Refresh the current page, has the same effect as clicking the 'refresh'
	 * button.
	 */
	doRefresh : function() {
		var me = this;
		var oldPageNum = me.store.currentPage;
		current = me.store.currentPage;
		me.store.currentPage = current;
		this.grid.fireEvent('pagechange', this, current, oldPageNum);
		/*
		 * if (me.fireEvent('beforechange', me, current) !== false) {
		 * me.store.loadPage(current); }
		 */
	},
	doHandlePageSizeChange : function(combo, newPgSize, oldPgSize) {
		var me = this;
		var oldPageNum = me.store.currentPage;
		current = me.store.currentPage;
		me.store.currentPage = current;
		this.grid.fireEvent('pagesizechange', this, newPgSize, oldPgSize,
				current, oldPageNum);
	},
	onPagingKeyDown : function(field, e) {
		var me = this, k = e.getKey(), pageData = me.getPageData(), increment = e.shiftKey
				? 10
				: 1, pageNum;
		var oldPageNum = me.store.currentPage;

		if (k == e.RETURN) {
			e.stopEvent();
			pageNum = me.readPageFromInput(pageData);
			if (pageNum !== false) {
				pageNum = Math.min(Math.max(1, pageNum), pageData.pageCount);
				me.store.currentPage = pageNum;
				this.grid.fireEvent('pagechange', this, pageNum, oldPageNum);
				/*
				 * if(me.fireEvent('beforechange', me, pageNum) !== false){
				 * me.store.loadPage(pageNum); }
				 */
			}
		} else if (k == e.HOME || k == e.END) {
			e.stopEvent();
			pageNum = k == e.HOME ? 1 : pageData.pageCount;
			field.setValue(pageNum);
		} else if (k == e.UP || k == e.PAGE_UP || k == e.DOWN
				|| k == e.PAGE_DOWN) {
			e.stopEvent();
			pageNum = me.readPageFromInput(pageData);
			if (pageNum) {
				if (k == e.DOWN || k == e.PAGE_DOWN) {
					increment *= -1;
				}
				pageNum += increment;
				if (pageNum >= 1 && pageNum <= pageData.pageCount) {
					field.setValue(pageNum);
				}
			}
		}
	},
	updateInfo : function() {
		var me = this, displayItem = me.child('#displayItem'), store = me.store, pageData = me
				.getPageData(), count, msg;
		if (displayItem) {
			count = store.getCount();
			if (count === 0 || me.store.currentPage === 0) {
				msg = me.emptyMsg;
			} else {
				msg = Ext.String.format(me.displayMsg, pageData.fromRecord,
						pageData.toRecord, pageData.total);
			}
			displayItem.setText(msg);
		}
	},
	// overridden
	onLoad : function() {
		var me = this, pageData, currPage, pageCount, afterText, count, isEmpty;
		count = me.store.getCount();
		isEmpty = count === 0;
		if (!isEmpty) {
			pageData = me.getPageData();
			currPage = pageData.currentPage;
			pageCount = pageData.pageCount;
			afterText = Ext.String.format(me.afterPageText, isNaN(pageCount)
							? 1
							: pageCount);
		} else {
			currPage = 0;
			pageCount = 0;
			afterText = Ext.String.format(me.afterPageText, 0);
		}

		Ext.suspendLayouts();
		me.child('#afterTextItem').setText(afterText);
		me.child('#inputItem').setDisabled(isEmpty).setValue(currPage);
		me.child('#first').setDisabled((currPage === 0 || currPage === 1)
				|| isEmpty);
		me.child('#prev').setDisabled((currPage === 0 || currPage === 1)
				|| isEmpty);
		me.child('#next').setDisabled(currPage === pageCount || isEmpty);
		me.child('#last').setDisabled(currPage === pageCount || isEmpty);
		if (me.child('#refresh'))
			me.child('#refresh').enable();
		me.updateInfo();
		Ext.resumeLayouts(true);
		me.togglePagerVisibility();
		if (me.rendered) {
			me.fireEvent('change', me, pageData);
		}
	},
	togglePagerVisibility : function() {
		var me = this, intCount = 0, intPgSize = 0, blnShowPager = true, pageData = me
				.getPageData();
		intCount = pageData.total;
		if (!Ext.isEmpty(me.minPgSize))
			intPgSize = me.minPgSize;
		else
			intPgSize = me.store.pageSize;
			
		if (!Ext.isEmpty(me.showPagerForced))
		{
			blnShowPager = me.showPagerForced === true ? (intCount > 0
					? true
					: false) : false;
		}
		else
			blnShowPager = me.showPager === true ? (intCount <= intPgSize
					? false
					: true) : false;
		me.setVisible(blnShowPager);
	},
	/**
	 * Gets the standard paging items in the toolbar
	 * 
	 * Overridden
	 */
	getPagingItems : function() {
		var me = this;
		var blnShowRefresh = me.showPagerRefreshLink;
		var arrPgItems = ['->',{
					xtype : 'button',
					text : getLabel('lblPgFirst', 'First'),
					itemId : 'first',
					tooltip : me.firstText,
					overflowText : me.firstText,
					iconCls : Ext.baseCSSPrefix + 'tbar-page-prev',
					disabled : true,
					handler : me.moveFirst,
					scope : me
				}, {
					itemId : 'prev',
					text : getLabel('lblPgPrevious', 'Previous'),
					tooltip : me.prevText,
					overflowText : me.prevText,
					//iconCls : Ext.baseCSSPrefix + 'tbar-page-prev',
					disabled : true,
					handler : me.movePrevious,
					scope : me
				}, me.beforePageText, {
					xtype : 'numberfield',
					itemId : 'inputItem',
					name : 'inputItem',
					cls : Ext.baseCSSPrefix + 'tbar-page-number',
					allowDecimals : false,
					minValue : 1,
					hideTrigger : true,
					enableKeyEvents : true,
					keyNavEnabled : false,
					selectOnFocus : true,
					submitValue : false,
					mouseWheelEnabled : false,
					// mark it as not a field so the form will not catch it when
					// getting fields
					isFormField : false,
					width : me.inputItemWidth,
					margins : '-1 2 3 2',
					listeners : {
						scope : me,
						keydown : me.onPagingKeyDown,
						blur : me.onPagingBlur
					}
				}, {
					xtype : 'tbtext',
					itemId : 'afterTextItem',
					text : Ext.String.format(me.afterPageText, 1)
				},{
					itemId : 'next',
					tooltip : me.nextText,
					text : getLabel('lblPgNext', 'Next'),
					overflowText : me.nextText,
					//iconCls : Ext.baseCSSPrefix + 'tbar-page-next',
					disabled : true,
					handler : me.moveNext,
					scope : me
				}, {
					itemId : 'last',
					text : getLabel('lblPgLast', 'Last'),
					tooltip : me.lastText,
					iconAlign : 'right',
					overflowText : me.lastText,
					iconCls : Ext.baseCSSPrefix + 'tbar-page-next',
					disabled : true,
					handler : me.moveLast,
					scope : me
				}];
		/*if (blnShowRefresh === true) {
			arrPgItems.push('-');
			arrPgItems.push({
						itemId : 'refresh',
						tooltip : me.refreshText,
						overflowText : me.refreshText,
						iconCls : Ext.baseCSSPrefix + 'tbar-loading',
						handler : me.doRefresh,
						scope : me
					});
		}*/
		return arrPgItems;
	}
});