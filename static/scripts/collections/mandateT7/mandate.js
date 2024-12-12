var USER_CATEGORY_GENERIC_COLUMN_MODEL = [{
							"colId" : "clientDesc",
							"colHeader" : getLabel('companyname', 'Company'),
						    "lockable" : false,
							"sortable" : false,
							"hideable" : false,
							"locked" : false,
						      width : 150
						}, {
							"colId" : "displMandateDescription",
							"colHeader" : getLabel('mandateName', 'Mandate Name'),
						    "lockable" : false,
							"sortable" : false,
							"locked" : false,
							hideable : false,
							width : 150
						}, {
							"colId" : "displDebtorReference",
							"colHeader" : getLabel('debtRefNo', 'Mandate Debtor Reference'),
							"lockable" : false,
							"sortable" : false,
							"hideable" : false,
							"locked" : false,
							width : 200
						},{
							"colId" : "mandateStatusDescription",
							"colHeader" : getLabel('mandateStatus', 'Mandate Status'),
							"lockable" : false,
							"hideable" : false,
							"locked" : false,
							"sortable":false,
							width : 200
						},{
							"colId" : "requestStateDesc",
							"colHeader" : getLabel('status', 'status'),
							"lockable" : false,
							"hideable" : false,
							"locked" : false,
							"sortable":false,
							width : 90
						},{
							"colId" : "displPayerName",
							"colHeader" : getLabel('payerName', 'Payer Name'),
							"lockable" : false,
							"sortable" : false,
							"hideable" : false,
							"locked" : false,
							width : 90
						},
						{
							"colId" : "displPayerBankId",
							"colHeader" : getLabel('bankId', 'Bank ID'),
							"lockable" : false,
							"sortable" : false,
							"hideable" : true,
							"locked" : false,
							"hidden" : true,
							width : 90
						},
						{
							"colId" : "displPayerAccountNmbr",
							"colHeader" : getLabel('acctNo', 'Account Number'),
							"lockable" : false,
							"sortable" : false,
							"hideable" : true,
							"locked" : false,
							"hidden" : true,
							width : 90
						},
						{
							"colId" : "displPayerAcctCcyCode",
							"colHeader" : getLabel('payerAccCcy', 'Account Currency'),
							"lockable" : false,
							"sortable" : false,
							"hideable" : true,
							"locked" : false,
							"hidden" : true,
							width : 90
						}
						];

var arrActionColumnStatus = [{"code":"P", "desc":getLabel("pendingverfothbank", "Pending Verification-Bank")},  
                             {"code":"O", "desc":getLabel("rejectbyothbank", "Rejected By Other bank")},
                             {"code":"A", "desc":getLabel("active", "Active")},   
                             {"code":"C", "desc":getLabel("cancelled", "Cancelled")},
                             {"code":"E", "desc":getLabel("expired", "Expired")}, 
                             {"code":"S", "desc":getLabel("suspended", "Suspended")}, 
                             {"code":"T^N", "desc":getLabel("tobeverified", "To be Verified")},
                             {"code":"V", "desc":getLabel("validated", "Validated")}]
