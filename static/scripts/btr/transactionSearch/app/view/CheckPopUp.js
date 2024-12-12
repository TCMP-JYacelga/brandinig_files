/**
 * @class GCP.view.CheckPopUp
 * @extends Ext.window.Window
 * @author Vinay Thube
 */
Ext.define('GCP.view.CheckPopUp', {
	extend : 'Ext.window.Window',
	requires : ['Ext.panel.Panel', 'Ext.button.Button', 'Ext.form.Label',
			'Ext.form.field.TextArea', 'Ext.form.field.Text', 'Ext.Img'],
	xtype : 'checkPopUp',
	title : getLabel('checktxn', 'Check Transaction'),
	width : 650,
	height : 480,
	closeAction : 'hide',
	modal : true,
	layout : 'fit',
	record : null,
	initComponent : function() {
		var me = this;
		var parentPanelView = Ext.create('Ext.panel.Panel', {
			width : 550,
			height : 460,
			autoScroll : true,
			defaults : {
				bodyStyle : 'padding:18px'
			},
			items : [{
						xtype : 'image',
						itemId : 'checkImage'
					}],
			bbar : ['->', {
						xtype : 'button',
						text : getLabel('ok', 'Ok'),
						glyph:'xf058@fontawesome',
						cls : 'xn-button ux_button-background-color ux_button-padding',
						handler : function() {
							me.close();
						}
					}]
		});
		me.items = [parentPanelView];
		me.on('beforeshow', function() {
					me.showCheckImage(me.record);
				});
		me.callParent(arguments);
	},
	showCheckImage : function(record) {
		var me = this;
		var checkImage = me.down('image[itemId="checkImage"]');
		var custRef = record.get('customerRefNo');
		Ext.Ajax.request({
					url : 'services/activities/showChequeImage.json?checkDepositeNo='
							+ custRef,
					method : 'GET',
					async : false,
					success : function(response) {
						var data = Ext.decode(response.responseText);
						if (!Ext.isEmpty(record.get('customerRefNo'))) {
							checkImage.setSrc(data.imagePath);
						}
					},
					failure : function(response) {
						// console.log("Error Occured - while fetching account
						// activity check image");
					}

				});
	}
});
