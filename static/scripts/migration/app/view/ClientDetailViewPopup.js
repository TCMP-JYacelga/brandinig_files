/**
 * @class ClientDetailViewPopup
 * @extends Ext.window.Window
 * @author CHPL
 */

Ext.define('GCP.view.ClientDetailViewPopup', {
	extend : 'Ext.window.Window',
	xtype : 'clientDetailViewPopup',
	requires : ['GCP.view.ClientDetailGridView'],
	parent : null,
	modal : true,
	closeAction : 'hide',
	initComponent : function() {
		var me = this;
		this.title = getLabel('advancedFilter1', 'Client Details');
		me.items = [
					{
						xtype : 'clientDetailGridView',
						callerParent : me.parent
					}];

		this.callParent(arguments);
	}
});