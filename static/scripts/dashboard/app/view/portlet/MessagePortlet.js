Ext.define('Cashweb.view.portlet.MessagePortlet', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.alerts',
	requires : [ 'Cashweb.store.MessageStore', 'Ext.Ajax' ],
	border : false,
	//padding : '0 0 0 5',
	padding : '5 10 10 10',
	emptyText : null,
	mask : null,
	taskRunner: null,
	cls : 't7-grid',
	config : {
		viewConfig : {
			stripeRows : false
		}
	},
	initComponent : function() {
		var messagePortlet = this;
		messagePortlet.emptyText = label_map.noDataFound;
		this.tools = [];
		this.store = new Cashweb.store.MessageStore();
		this.columns = [ {
			header : label_map.dateLabel,
			dataIndex : 'eventTime',
			align : 'left',
			flex : 1,
			sortable : false,
			renderer:function(value,metaData,record){
				var dateFormat = serverdateFormat+ " H:i:s";
				var newDate = Ext.Date.parse(value, dateFormat);
				var msgDate = Ext.Date.format(newDate, serverdateFormat);
				
				if(record.data.msgStatus != 'R') {
					var cls = 'dashboard-msgs';
					var formattedDate =  msgDate;
					return formattedDate;
				} else
					return msgDate;
			}
		}, {
			header : label_map.subjectLabel,
			dataIndex : 'subject',
			align : 'left',
			flex : 4,
			sortable : false,
			renderer: function(value, metadata, record) {
				var appendedString = value;
				if(record.data.msgStatus != 'R') {
					var cls = 'dashboard-msgs';
					var formattedValue = appendedString;
					return formattedValue;
				} else
					return appendedString;
			}
			
		},
		{
			header : '<a href="inboxAlertCenter.srvc" class="x-column-header-text" title="View all">' + label_map.newsFeedView + '</a>&nbsp;',
			align : 'right',
			xtype:'actioncolumn',
			iconCls:'grid-link-icon viewlink cursor_pointer',
			sortable : false,
            handler:function(view,rowIndex,colIndex,item,e,record)
				{
            		showViewAlertPopup(record, messagePortlet, rowIndex);
            		
				}
		}];

		this.callParent(arguments);
		
		function showViewAlertPopup(record, messagePortlet, rowIndex)
		{
			var buttonsOpts = {};
			buttonsOpts[btnsArray['okBtn']] = function() {		
				$(this).dialog("close");
			};	
			var date=record.data.eventTime;
			$('#viewAlertPopup').dialog({
				autoOpen : false,
				height : 500,
				width : 580,
				modal : true,
				buttons : buttonsOpts,
				close: function() {
					
				}
			});
			$('#viewAlertPopup').addClass("ux_panel-transparent-background ux_font-size14-normal");
			$('#subject').text(record.data.subject);
			$('#sent').text(date.toString());
			$('#from').text(record.data.senderMail);
			$('#messageText').addClass("ux_font-size14-normal");
			$('#messageText').html(record.data.messageText.replace(/\n/g, '<br />'));
			$('#viewAlertPopup').dialog("open");
		}
	}, 
	fireMarkAsRead: function(rowIndex, messagePortlet) {
		var dashboardMessageViewstate = this.getStore().config.dashboardMessageViewState;
		Ext.Ajax.request({
			 url : './markAsRead.rest',
			 method : "POST",
			 params: {
				 indexId: rowIndex,
				 viewState: dashboardMessageViewstate
			 },
			 success : function(response) {
				if(response.status == 200 && response.statusText == "OK") {
					var record = messagePortlet.getStore().getAt(rowIndex);
					record.set('msgStatus', 'R');
				}
			 },
			 failure : function(response) {
				 messagePortlet.ownerCt.setLoading(false);
				 this.mask = new Ext.LoadMask(messagePortlet ,{msgCls:'error-msg'});	
					if (response.timedout) {
						this.mask.msg=label_map.timeoutmsg;
					} else if (response.aborted) {
						this.mask.msg=label_map.abortmsg;
					} else {
						 if(response.status === 0)
							{
								thisClass.mask.msg=label_map.serverStopmsg;
							}
						else
						 this.mask.msg=response.statusText;
					}
					this.mask.show();
			}
		});
	}
});