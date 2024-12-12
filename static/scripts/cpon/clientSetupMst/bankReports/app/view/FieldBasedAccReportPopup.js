Ext.define('CPON.view.FieldBasedAccReportPopup', {
	extend : 'Ext.window.Window',
	xtype : 'fieldBasedAccReportPopup',
	requires : [ 'CPON.view.CreateFieldTab', 'CPON.view.ViewFieldDetailsGrid',
			'Ext.tab.Panel', 'Ext.button.Button' ],
	modal : true,
	config : {
		bankReportCode : null
	},
	title : getLabel("fieldPopupTitle","Add Field Description"),
	closeAction : 'destroy',
	//height : 355,
	width : 450,
	maxWidth : 735,
	minHeight : 156,
	maxHeight : 550,
	draggable : false,
	resizable : false,
	cls : 'non-xn-popup',
	// layout : 'fit',
	initComponent : function() {
		var me = this;
		var accountSetTabView = null;
		accountSetTabView = Ext.create('Ext.tab.Panel', {
			//height : 300,
			parent : this,
			itemId : 'reportTabPanel',
			items : [
					{
						title : getLabel('viewField', 'View Field'),
						items : [
								{
									xtype : 'viewFieldDetailsGrid'
									//bankReportCode : me.bankReportCode
								}]
					}, {
						title : getLabel('addField', 'Add Field'),
						items : {
							xtype : 'createFieldTab'
						}
					} ]
		});
		accountSetTabView.on('tabchange', function( tabPanel, newCard, oldCard, eOpts ){
			if(tabPanel.items.indexOf(newCard) == 0){
				me.down('button[itemId="savebtn"]').hide();
				me.down('tbfill[itemId="tbseparator2"]').hide();
				me.down('tbfill[itemId="tbseparator1"]').show();
			} else {
				me.down('button[itemId="savebtn"]').show();
				me.down('tbfill[itemId="tbseparator2"]').show();
				me.down('tbfill[itemId="tbseparator1"]').hide();
			}
		});
		this.items = [ accountSetTabView ];
		this.bbar = [{ 
			xtype: 'tbfill',
			itemId : 'tbseparator1' 
		}, {
			text : getLabel('close', 'Close'),
			//cls : 'ux_button-background-color footer-btns-inner report-privilege-cancelbtn-left',
			//glyph : 'xf056@fontawesome',
			itemId : 'closebtn',
			handler : function() {
				me.close();
			}
		}, { 
			xtype: 'tbfill',
			itemId : 'tbseparator2',
			hidden : true 
		},{
			text : getLabel('save', 'Save'),
			clickedFrom : null,
			//cls : 'ux_button-background-color footer-btns-inner submit-xbtn-left',
			//glyph : 'xf0c7@fontawesome',
			itemId : 'savebtn',
			hidden : true,
			handler : function(btn, opts) {
				me.fireEvent('addField',btn, opts);
			}
		}];
		this.callParent(arguments);
	}
});
