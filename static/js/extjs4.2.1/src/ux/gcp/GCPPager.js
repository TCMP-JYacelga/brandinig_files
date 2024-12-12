/**
 * @classExt.ux.gcp.SmartGridPager
 * @extends Ext.toolbar.Paging
 * @author Vinay Thube
 */
Ext.define('Ext.ux.gcp.GCPPager', {
	extend : 'Ext.toolbar.Paging',
	xtype : 'gcpPager',
		togglePagerVisibility : function() {
		var me = this, intCount = 0, intPgSize = 0, blnShowPager = true, pageData = me
				.getPageData();
		intCount = pageData.total;
		if (!Ext.isEmpty(me.minPgSize))
			intPgSize = me.minPgSize;
		else
			intPgSize = store.pageSize;
			
		if (!Ext.isEmpty(me.showPagerForced))
			blnShowPager = me.showPagerForced;
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
		var arrPgItems = ['->',{
					xtype : 'button',
					text : getLabel('lblPgFirst', 'First'),
					itemId : 'first',
					tooltip : getLabel('lblPgFirst', 'First'),
					overflowText : me.firstText,
					iconCls : Ext.baseCSSPrefix + 'tbar-page-prev',
					disabled : true,
					handler : me.moveFirst,
					scope : me
				}, {
					itemId : 'prev',
					text : getLabel('lblPgPrevious', 'Previous'),
					tooltip : getLabel('lblPgPrevious', 'Previous'),
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
					tooltip : getLabel('lblPgNext', 'Next'),
					text : getLabel('lblPgNext', 'Next'),
					overflowText : me.nextText,
					//iconCls : Ext.baseCSSPrefix + 'tbar-page-next',
					disabled : true,
					handler : me.moveNext,
					scope : me
				}, {
					itemId : 'last',
					text : getLabel('lblPgLast', 'Last'),
					tooltip : getLabel('lblPgLast', 'Last'),
					iconAlign : 'right',
					overflowText : me.lastText,
					iconCls : Ext.baseCSSPrefix + 'tbar-page-next',
					disabled : true,
					handler : me.moveLast,
					scope : me
				}];

		return arrPgItems;
	}
});