/**
 * @class GCP.view.summary.FileUploadTitleView
 * @extends Ext.panel.Panel
 * @author Anil Pahane
 */
Ext.define('GCP.view.FileUploadTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'fileUploadTitleView',
	requires : ['Ext.form.Label', 'Ext.Img', 'Ext.button.Button',
			'Ext.toolbar.Toolbar'],
	width : '100%',
	baseCls : 'page-heading-bottom-border',
	defaults : {
		style : {
			padding : '0 0 0 4px'
		}
	},
	layout : {
		type : 'hbox'
	},
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'label',
					text : getLabel('fileUploadCenter', 'File Upload Center'),
					itemId : 'pageTitle',
					cls : 'page-heading',
					padding : '0 0 0 10'
				}]
		me.callParent(arguments);		
	}

});