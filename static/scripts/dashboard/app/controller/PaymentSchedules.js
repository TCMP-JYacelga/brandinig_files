Ext.define('Cashweb.controller.PaymentSchedules',{
	extend : 'Ext.app.Controller',
	requires : ['Cashweb.view.portlet.PaymentSchedules'],
	refs : [{
			ref : 'paymentSchedules',
			selector :'pay_schedule'
	},{
		ref : 'paymentSchedulesTool',
		selector :'portlet tool[itemId=pay_schedule_refresh]'
	}],
	payCalendar: null,
	currentDate: null,
	currentMonth: 0,
	mask: null,
	init : function(application){
		this.control({
				'pay_schedule' : {
					render : this.createCalender,
					afterrender : function(portlet){
						this.getPaymentSchedulesTool().on('click', this.refreshWidget, this);
						if(portlet.record.get('refreshType') == "A") {
							this.handlePSAutoRefresh(portlet.record);
						}
					}
			}
		});	
	},
	createCalender : function(portlet) {
        var currentDate = "";
        this.currentDate = currentDate; 
		this.fireAjax(portlet, currentDate);
	},
	refreshWidget: function() {
		if(this.mask != null) {
			this.mask.hide();
			Ext.destroy(this.mask);
		}
		this.fireAjax(this.getPaymentSchedules(), this.currentDate);
	},
	fireAjax: function(portlet, currentDate) {
		var thisClass = this;
		thisClass.getPaymentSchedules().ownerCt.setLoading({msg : label_map.loading});
		Ext.Ajax.request({
			url: './getPaymentSchedule.rest',
			params : {
				currentDate: currentDate
			},
			success: function(response) {
				var obj = Ext.decode(response.responseText);
				var applicationDate = new Date(obj.applicationDate);
				if(Ext.isEmpty(thisClass.currentDate)) {
					thisClass.currentMonth = applicationDate.getMonth();
					thisClass.currentDate = applicationDate;
					thisClass.renderCal(portlet, applicationDate, obj.paymentSchedule);
				} else {
					thisClass.renderCal(portlet, thisClass.currentDate, obj.paymentSchedule);
				}
			},
			 failure : function(response) {
				 	var portlet = thisClass.getPaymentSchedules();
					if(null != portlet) {
						portlet.ownerCt.setLoading(false);
					}
					thisClass.mask = new Ext.LoadMask(portlet ,{msgCls:'error-msg'});	
					if (response.timedout) {
						thisClass.mask.msg=label_map.timeoutmsg;
					} else if (response.aborted) {
						thisClass.mask.msg=label_map.abortmsg;
					} else {
						if(response.status === 0)
							thisClass.mask.msg=label_map.serverStopmsg;
						else
						thisClass.mask.msg=response.statusText; 
					}
					thisClass.mask.show();
				}
		});
	},
	
	renderCal: function(portlet, currentDate, calData) {
		var datesArray = [];
		var thisClass = this;
		datesArray = this.parseDateValues(calData.dates); 
		if(Ext.isEmpty(this.payCalendar)) {
			this.payCalendar = new Ext.ux.Calendar({
				// Sample data
				dates : {
					'20090615' : 'Test'
				},
				calData: calData,
				//width: 750,
				layout:'fit',
				margin: '0 0 0 25',
				value: currentDate,
				calMonth: currentDate.getMonth(), //application date month
				calYear: currentDate.getFullYear(), //application date year
				datesArray: datesArray,
				getData : function(o) {
					return this.dates[Ext.Date.format(o.date, "Ymd")];
				},
				 moveMonths: function(months) {
				        var dateVal = this.value = Ext.Date.add(this.value, Ext.Date.MONTH, months);
					 	thisClass.currentMonth = thisClass.currentMonth + (months);
			        	thisClass.currentDate = dateVal;
			        	thisClass.fireAjax(thisClass.getPaymentSchedules(), dateVal);
			    }
			});
			portlet.add(this.payCalendar);
		} else {
				this.payCalendar.value = this.currentDate;
				this.payCalendar.datesArray = datesArray;
				this.payCalendar.calData = calData;
				this.payCalendar.update();
		}
		thisClass.getPaymentSchedules().ownerCt.setLoading(false);
	},
	parseDateValues: function(dates) {
		var formattedDates = [];
		Ext.Array.each(dates, function(item, index, allItems) {
			formattedDates[index] = Ext.Date.parse(item, 'd/m/Y');
      });
      return formattedDates;
	},
	handlePSAutoRefresh : function(record){
		var me = this;
		var taskRunner = new Ext.util.TaskRunner();
		var task = taskRunner.newTask({
			run: function() {
				me.refreshWidget();
			},
			interval: record.get('refreshInterval') * 1000
		});
		task.start();
		
	}
});
