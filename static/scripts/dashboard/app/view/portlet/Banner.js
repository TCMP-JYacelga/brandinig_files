Ext.define('Cashweb.view.portlet.Banner', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.banner',
//	requires: ['Ext.ux.IFrame'],
	border : false,
	padding : '0 0 0 5',
	taskRunner: null,
	config : {
		height: 250,
		layout: 'fit'
	},
	width : '100%',
	hideHeaders : true,
	initComponent : function() {
		var thisClass = this; 
		if(Ext.isEmpty(this.record.get('defaultUrl'))) {
			this.items = [{
							width : '100%',
							//flex : 1,
							height : 200,
							layout: {
								type: 'vbox'
							},
							items : [ {
								//width : '100%',
								width : 870,
								height : 190,
								xtype : 'image',
								src : 'static/images/smartnav/ad.png'
						} ]
			}];
		} else {
		
				var iframe = Ext.create("Ext.ux.IFrame", {
					src: thisClass.record.get('defaultUrl'),
					width: 870,
				    height : 240
				});
				this.items = [{
				   width: '100%',
				   //flex : 1,
				   height : 250,
				   layout: {
						type: 'vbox'
				   },
				   items: [iframe]
			  }];
		}
		this.setTitle("");
		
		this.callParent(arguments);
	}
});