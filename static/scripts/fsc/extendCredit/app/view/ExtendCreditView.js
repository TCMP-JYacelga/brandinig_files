/**
 * @class GCP.view.ExtendCreditView
 * @extends Ext.panel.Panel
 * @author Preeti Kapade
 */
Ext.define('GCP.view.ExtendCreditView', {
	extend : 'Ext.panel.Panel',
	xtype : 'extendCreditView',
	requires : ['GCP.view.ExtendCreditTitleView',
			'GCP.view.ExtendCreditGridView', 'GCP.view.ExtendCreditFilterView'],
	autoHeight : true,
	cls : 'ux_panel-background',
	width : '100%',
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'extendCreditTitleView',
					width : '100%'
				}, {
					xtype : 'extendCreditFilterView',
					itemId : 'extendCreditFilterView',
					width : '100%',
					margin : '0 0 12 0',
					title : getLabel( 'filterBy', 'Filter By: ' )
					+ '&nbsp;<img id="imgFilterInfoGridView" class="largepadding icon-information"/>'
				}, {
					xtype : 'extendCreditGridView',
					itemId : 'extendCreditGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});