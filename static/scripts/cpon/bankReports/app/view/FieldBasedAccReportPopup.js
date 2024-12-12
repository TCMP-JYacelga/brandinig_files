Ext.define('GCP.view.FieldBasedAccReportPopup', {
	extend : 'Ext.window.Window',
	xtype : 'fieldBasedAccReportPopup',
	requires : [ 'GCP.view.CreateFieldTab', 'GCP.view.ViewFieldDetailsGrid',
			'Ext.tab.Panel', 'Ext.button.Button' ],
	modal : true,
	config : {
		bankReportCode : null
	},
	title : getLabel("fieldPopupTitle","Add Field Description"),
	closeAction : 'destroy',
	height : 355,
	width : 350,
	// layout : 'fit',
	initComponent : function() {
		var me = this;
		var accountSetTabView = null;
		accountSetTabView = Ext.create('Ext.tab.Panel', {
			height : 300,
			parent : this,
			itemId : 'reportTabPanel',
			items : [
					{
						title : getLabel('viewField', 'View Field'),
						items : [
								{
									xtype : 'viewFieldDetailsGrid',
									bankReportCode : me.bankReportCode
								}]
					}, {
						title : getLabel('addField', 'Add Field'),
						items : {
							xtype : 'createFieldTab'
						}
					} ]
		});
		this.items = [ {
			xtype : 'panel',
			layout : 'hbox',
			padding : '3 3 3 0',
			items : [

			{
				xtype : 'panel',
				//width : 175,
				flex: 1,
				layout : {type : 'hbox', pack : 'start'},
				items : [ {
					xtype : 'label',
					cls : 'ui-section-header font_bold',
					text : 'Report Name : ',
					padding : '3 3 3 0'
				},{
					xtype : 'label',
					cls : 'ui-section-header font_bold',
					padding : '3 3 3 0',
					text : '',
					itemId : 'fReportName'
				} ]

			}, {
				xtype : 'panel',
				//width : 175,
				flex: 1,
				layout : {type : 'hbox', pack : 'end'},
				items : [ {
					xtype : 'label',
					cls : 'ui-section-header font_bold',
					text : 'Type : Field',
					padding : '3 3 3 0'
				}]

			} ]
		}, accountSetTabView ];
		this.buttons = [ {
			text : getLabel('save', 'Save'),
			clickedFrom : null,
			cls : 'xn-button',
			itemId : 'savebtn',
			handler : function() {
				me.fireEvent('addField');
			}
		}, {
			text : getLabel('close', 'Close'),
			cls : 'xn-button',
			itemId : 'closebtn',
			margin : '6 0 0 0',
			handler : function() {
				me.close();
			}
		} ];
		this.callParent(arguments);
	}
});
