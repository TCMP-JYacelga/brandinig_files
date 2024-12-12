Ext.define('Cashweb.view.portlet.PaymentSchedules',{
	extend : 'Ext.panel.Panel',
	alias : 'widget.pay_schedule',
	requires: ['Ext.util.ClickRepeater'],
	border : false,
	padding : '0 0 0 5',
//	html : '<div class="centerAlign" id="myCal"></div>',
	taskRunner: null,
	record : null,
	config : {
	title: '',
		viewConfig : {
			stripeRows : false,
			loadMask: false
		},
		forceFit : true,
		store : null
	},
	initComponent : function(){
		this.update('<div class="centerAlign" id="myCal"></div>');
		this.callParent(arguments);
	},
	setPortletTitle: function(title) {
		this.setTitle(label_map.calendarMonth + title);
	}
});