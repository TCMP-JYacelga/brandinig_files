/**
 * @class EntityListPopup
 * @extends Ext.window.Window
 * @author CHPL
 */

Ext.define('GCP.view.EntityListPopup', {
	extend : 'Ext.window.Window',
	xtype : 'entityListPopup',
	itemId : 'entityListPopupId',
	id : 'entityListPopupId',
	requires : ['GCP.view.MigEntityGridView'],
	parent : null,
	modal : true,
	strFilter : null,
	strFilterId : null,
	//closeAction : 'destroy',
	initComponent : function() {
		var me = this;
		this.title = getLabel('advancedFilter1', 'Service Package List for '+me.strFilter);
		this.callParent(arguments);
	}
});