Ext.define('Cashweb.view.portlet.BroadcastDetailsPopup', {
	extend: 'Ext.window.Window',
	requires : ['Ext.tip.ToolTip'],
	//title: 'Message Body',
	autoHeight: true,
	height:478,
	width: 535,
	modal: true,
	layout: 'fit',
	titleTooltip: "",
	cls:'settings-popup xn-popup',
	recordDtl: null,
	//recordSub : null,
	record : null,
	initComponent: function() {
		var thisClass = this;
		thisClass.on('boxready', function() {
			if (thisClass.titleTooltip.length > 33) {
				var toolTip = Ext.create('Ext.tip.ToolTip', {
							target : thisClass.getHeader().getId(),
							html : thisClass.titleTooltip
						});
			}
		});
		
		this.bbar = {
				items : [
							{
								xtype : 'button',
								text : getLabel('btnClose', 'Close'),
								cls : 'ft-button ft-button-light',
								id : 'okButton',
								tabIndex : '1',
								handler : function() {
									thisClass.close();
								}
							}, '->'
						]
				   };
		var recordDtl = getDecodedValue(this.recordDtl).replace(/\\/g, "");
		if(!Ext.isEmpty(recordDtl)) {
				this.items =  [{
					layout: 'vbox',
					items : [ {
								xtype : 'textarea',
								disabled: true,
								grow: true,								
								labelCls : 'font_bold',
								fieldCls: 'details-cls ux_font-size14-normal disabled form-control',
								value : recordDtl,
								padding: 6,
								width: 458,
								height: 315
						}]
				}];
		}
		this.callParent(arguments);
	},
	getSettingsPanel : function() {
		var settingsPanel = Ext.create('Ext.panel.Panel',{
			getSettings : function () {	
				var me = this;
				var jsonArray = [];
				return jsonArray;
			}	
		});
		return settingsPanel;
	},
	getDataPanel : function () {
		return this;
	}
});
function getDecodedValue(str)
{
	var parser = new DOMParser;
	var dom = parser.parseFromString(
	    '<!doctype html><body>' + str,
	    'text/html');
	var decodedString = dom.body.textContent;
	return decodedString ;
}