/**
 * @class GCP.view.BandInfoView
 * @extends Ext.panel.Panel
 * @author Archana Shirude
 */
Ext.define('GCP.view.BandInfoView', {
	extend : 'Ext.panel.Panel',
	xtype : 'bandInfoView',
	requires : ['GCP.view.BandInfoGridView'],
	width : '100%',
	autoHeight : true,
	//minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [
				{
					xtype : 'panel',
					layout :
					{
						type : 'hbox'
					},
					items :
					[
						{
							xtype : 'label',
							itemId : 'addBandLbl'
							//margin : '7 0 3 0'
							//text : getLabel( 'createNew', 'Create : ' )
						},
						{
					 		xtype : 'button',
							itemId : 'addBandbtn',
							name : 'Band',
							margin : '7 0 5 0',
							text : '<span class=" button_underline thePointer">' + getLabel( 'bandLbl1', 'Add Band' )
								+ '</span>',
							cls : 'xn-account-filter-btnmenu'
						}
					]
				},
				{
					xtype : 'bandInfoGridView',
					width : '100%',
					parent : me
				}];
		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});