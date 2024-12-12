Ext.define('Cashweb.controller.PaymentsPipeController', {
			extend : 'Ext.app.Controller',
			views : ['portlet.PaymentsPipe'],
			stores : ['PaymentsPipeStore'],
			models : ['PaymentsPipeModel'],
			mask : null,
			refs : [{
						ref : 'summaryPortlet',
						selector : 'paymentspipe'
					}],
			init : function() {
				var me = this;
				this.control({
							'paymentspipe' : {
								boxready : this.onBoxReady
							}
						});
				$(document).on('pipelineClicked', function(event, statusDesc) {
							me.seeMorePaymentRecords(statusDesc);
						});
			},
			seeMorePaymentRecords : function(statusDesc) {
				var me = this;
				var commaSeparetedStatus = '';
				var statusUrl = '';
				switch(statusDesc) {
					case 'Repair' :	 commaSeparetedStatus = '9';
						break;
					case 'Submit' : commaSeparetedStatus = '101';
						break;
					case 'Authorize' : commaSeparetedStatus = '1,40,2'
						break;
					case 'Rejected' : commaSeparetedStatus = '4';
						break; 
					case 'Send' : commaSeparetedStatus = '3';
						break; 
					case 'Under Process' : commaSeparetedStatus = '14,19,29,7';
						break; 
					case 'History' : commaSeparetedStatus = '15,41,93,22';
						break; 
					case 'Failed' : commaSeparetedStatus = '8,18,13';
						break;
					default :  break;
						
				}
				
				var reg = new RegExp(/[\(\)]/g);
				var objValue = commaSeparetedStatus;
				objValue = objValue.replace(reg, '');
				var objArray = objValue.split(',');
				if (objArray.length > 0) {
						isFilterApplied = true;
						statusUrl = statusUrl + '(';
						for (var i = 0; i < objArray.length; i++) {
							statusUrl = statusUrl
									+ 'ActionStatus' + ' eq ';
							statusUrl = statusUrl + '\''
									+ objArray[i] + '\'';
							if (i != objArray.length - 1)
								statusUrl = statusUrl
										+ ' or ';
						}
						statusUrl = statusUrl + ')';
				}
							
				var strUrl = 'paymentSummary.form';
				var frm = document.createElement('FORM');
				var strFilter = me.getSummaryPortlet().strFilter;
				var fliterJson = me.getSummaryPortlet().filterJson;
				if(Ext.isEmpty(fliterJson))
					fliterJson = [];
				fliterJson.push({
					field : getLabel('ActionStatus', 'ActionStatus'),
					paramValue1 : commaSeparetedStatus,
					operatorValue : 'in',
					dataType : 'S',
					paramFieldLable : getLabel('lblStatus', 'Status'),
					displayType : 5,
					displayValue1 : statusDesc,
					blnIsSingleValuePerStatus : true
				});
				(!Ext.isEmpty(strFilter)) ? (strFilter = strFilter + ' and ' + statusUrl) : (strFilter = statusUrl);
					
				if (!Ext.isEmpty(strFilter)) {
					frm.appendChild(me.createFormField('INPUT', 'HIDDEN',
							'filterUrl', strFilter));
					
					if (!Ext.isEmpty(fliterJson)) {
						frm.appendChild(me.createFormField('INPUT', 'HIDDEN',
								'filterJson', JSON.stringify(fliterJson)));
					}else{
						frm.appendChild(me.createFormField('INPUT', 'HIDDEN',
								'filterJson', JSON.stringify([])));
					}
					
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
			onBoxReady : function(portlet) {
				portlet.getTargetEl().mask(label_map.loading);
			}
		});