Ext.define('Cashweb.controller.ReportsForYouController', {
			extend : 'Ext.app.Controller',
			xtype : 'reportsForYouController',
			views : ['Cashweb.view.portlet.ReportsForYou'],
			stores : ['ReportsForYouStore'],
			models : ['ReportsForYouModel'],
			mask : null,
			refs : [{
						ref : 'reportPortlet',
						selector : 'reportsforyou'
					}, {
						ref : 'reportRefreshTool',
						selector : 'portlet2 tool[itemId=reports_refresh]'
					}],

			init : function() {
				this.control({
							'reportsforyou' : {
								navigateToReports : this.navigateToReports
							}
						});
			},

			navigateToReports : function(strFilter, filterJson) {
				var me = this;
				var strUrl = 'preGeneratedReport.srvc';
				var frm = document.createElement('FORM');
				if(filterJson == ''){
					filterJson=[];	
				}
				if (!Ext.isEmpty(strFilter)) {
					frm.appendChild(me.createFormField('INPUT', 'HIDDEN',
							'filterUrl', strFilter));
					frm.appendChild(me.createFormField('INPUT', 'HIDDEN',
							'filterJson', JSON.stringify(filterJson)));
					frm.appendChild(me.createFormField('INPUT', 'HIDDEN',
							csrfTokenName, tokVal));
				}
				frm.action = strUrl;
				frm.name = 'frmMain';
				frm.id = 'frmMain';
				frm.method = "POST";
				document.body.appendChild(frm);
				frm.submit();
				document.body.removeChild(frm);
			},

			createFormField : function(element, type, name, value) {
				var inputField;
				inputField = document.createElement(element);
				inputField.type = type;
				inputField.name = name;
				inputField.value = value;
				return inputField;
			},

			portletRefresh : function() {
				if (this.mask != null) {
					this.mask.hide();
					Ext.destroy(this.mask);
				}
				this.getReportPortlet().getTargetEl().mask(label_map.loading);
				this.ajaxRequest();
			},
			handleReportAutoRefresh : function(record) {
				var portlet = this;
				var taskRunner = new Ext.util.TaskRunner();
				var task = taskRunner.newTask({
							run : portlet.portletRefresh,
							interval : record.get('refreshInterval') * 1000,
							scope : portlet
						});
				task.start();
				this.getReportPortlet().taskRunner = taskRunner;
			}
		});