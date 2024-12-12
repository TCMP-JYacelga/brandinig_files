Ext.define('Cashweb.controller.LoansAccountsController', {
			extend : 'Ext.app.Controller',
			views : ['portlet.LoansAccounts'],
			stores : ['LoansAccountsStore'],
			models : ['LoansAccountsModel'],
			mask : null,
			refs : [],
			init : function() {
				var me = this;
				this.control({
							'loansaccounts' : {
								navigateToAccountSummary : this.navigateToAccountSummary,
								seeMoreBalanceRecords : this.seeMoreBalanceRecords
							}
						});
			},
			seeMoreBalanceRecords : function(strFilter, filterJson, dtJson) {
				var me = this;
				var strUrl='';
				if(strFilter.indexOf('$summaryType=previousday')!=-1)
				strUrl = 'btrSummaryPreviousday.form';
				else
					strUrl = 'btrSummaryIntraday.form';
				if(!Ext.isEmpty(dtJson))
				{
					filterJson.push(dtJson[0]);
					strFilter = "&$summaryFromDate="+dtJson[0].value1+"&$summaryToDate="+dtJson[0].value1+strFilter;//Default date Yesterday
				}
				var frm = document.createElement('FORM');
				if (!Ext.isEmpty(strFilter)) {
					if(typeof accTypeLoan != 'undefined')
					{
					    var loanTypeArray = accTypeLoan.split(',');
					    if (loanTypeArray.length == 1) 
					    {
					        strFilter += '&$filterOn=FACILITY&$filterValue='+loanTypeArray[0];        
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
			
			navigateToAccountSummary: function(record, strFilter){
				var me = this;
				var strUrl = 'btrSummaryPreviousday.form';
				var me = this;
				var form = null;
				form = document.createElement('FORM');
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				form.appendChild(me.createFormField('INPUT', 'HIDDEN',
						csrfTokenName, tokVal));
				if (!Ext.isEmpty(strFilter)) {
					form.appendChild(me.createFormField('INPUT', 'HIDDEN',
							'filterUrl', strFilter));
					form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'filterJson',
							JSON.stringify(record)));
				}
				form.action = strUrl;
				document.body.appendChild(form);
				form.submit();
				document.body.removeChild(form);
			}
			
		});