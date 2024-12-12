/**
 * @class GCP.view.summary.ReportCenterTitleView
 * @extends Ext.panel.Panel
 * @author Anil Pahane
 */
Ext.define('GCP.view.ReportCenterTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'reportCenterTitleView',
	requires : ['Ext.form.Label', 'Ext.Img', 'Ext.button.Button',
			'Ext.toolbar.Toolbar'],
	width : '100%',
	baseCls : 'page-heading-bottom-border',
	defaults : {
		style : {
			padding : '0 0 0 4px'
		}
	},
	
	initComponent : function() {
		var me = this;
		var isClientUser = (entity_type == 1);
		var createLink = {};
		if(isClientUser && customReportFeatureFlag){
			createLink = {
							//xtype : 'panel',//Commented as Button text was being overlapped.
							xtype : 'toolbar',
							itemId : 'uploadId',
							margin : '12 0 0 0',
							layout :
							{
								type : 'hbox'
							},
							items :
							[
								{
									xtype : 'button',
									itemId : 'btnCreateReport',
									name : 'createReport',
									//margin : '12 0 0 0',
									//text : '<span class="button_underline thePoniter ux_font-size14-normal underlined">' + getLabel( 'uploadFile', 'Import File' ) + '</span>',
									//cls : 'xn-account-filter-btnmenu'
									border : 0,
									text : getLabel( 'createrep', 'Create Report' ),
									glyph : 'xf055@fontawesome',
									cls : 'ux_toolbar xn-btn ux-button-s'
								}
							]
						};
		}
		
		me.items = [
				{
					xtype : 'panel',
					width : '100%',
					baseCls : 'page-heading-bottom-border',
					//padding : '10 0 10 10',
					cls : 'ux_no-border ux_panel-background',
					
					layout :
					{
						type : 'hbox'
					},
						items : [
						{
								xtype : 'label',
								text : getLabel('reportsAndDownloadCenter', 'REPORTS AND DOWNLOAD CENTER'),
								itemId : 'pageTitle',
								cls : 'page-heading',
								padding : '0 0 0 10'
								//
						}]
				},
				
				{
					xtype : 'panel',
					cls : 'ux_panel-background',
					//width : '100%',
					items :[
						createLink
					]
				}]
		me.callParent(arguments);		
	}

});