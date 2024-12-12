Ext.define('Cashweb.controller.BalancesGridController', {
			extend : 'Ext.app.Controller',
			views : ['portlet.BalancesGrid'],
			stores : ['BalancesGridStore'],
			models : ['BalancesGridModel'],
			mask : null,
			refs : [],
			init : function() {
				var me = this;
				this.control({
							'balancesgrid' : {
								// afterrender :
								// this.afterAccountSummaryRender,
								//boxready : this.onBoxReady,
								seeMoreBalanceRecords : this.seeMoreBalanceRecords
								// clientChange : this.setSelectedClient
							}
						});
			},
			seeMoreBalanceRecords : function(strFilter, filterJson) {
				var me = this;
				var strUrl='';
				for (var i = 0; i < filterJson.length; i++) {
					if (filterJson[i].field === 'tranType') {
						if(filterJson[i].value1 === 'intraday')
						{
							strUrl = 'btrSummaryIntraday.form';
						}
						else if(filterJson[i].value1 === 'previousday')
						{
							strUrl = 'btrSummaryPreviousday.form';
						}
					}
				}
				var frm = document.createElement('FORM');
				if (!Ext.isEmpty(strFilter)) 
				{
					if(typeof accTypeCasa != 'undefined')
					{
					    var accTypeArray = accTypeCasa.split(',');
					    if (accTypeArray.length == 1) 
					    {
					        strFilter += '&$filterOn=FACILITY&$filterValue='+accTypeArray[0];        
					    }
					}
										
					frm.appendChild(me.createFormField('INPUT', 'HIDDEN',
							'filterUrl', strFilter));
					frm.appendChild(me.createFormField('INPUT', 'HIDDEN', 'filterJson',
							JSON.stringify(filterJson)));
				 }
						frm.appendChild(me.createFormField('INPUT', 'HIDDEN',
						csrfTokenName, tokVal));
						frm.appendChild(me.createFormField('INPUT', 'HIDDEN',
								'gridOrSummary', "widget"));

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
			},
			afterAccountSummaryRender : function() {
				if (this.getSummaryRefreshTool().record.get('refreshType') == "A") {
					this
							.handleSummaryAutoRefresh(this
									.getSummaryRefreshTool().record);
				}
			}
		});