var filterFieldModel ={
		"modelItems" : [{
			"filterParameter" : {
				"qryPhdReference" : {
					"conditionType" : 0,
					"displayType" : 0,
					"dataType" : 0,
					"queryParamName" : "ClientReference",
					"fieldLabel" : getLabel('batchAdvFltBatchRefNo',
						'Payment Reference'),
					"defaultValue" : "",
					"options" : [

					],
					"maxLength" : "20",
					"readOnly" : false,
					"urlDetails" : {
						"seekId" : "",
						"rootNode" : "",
						"col1Node" : "",
						"col2Node" : "",
						"col3Node" : "",
						"col4Node" : ""
					}
				},
				"clientId" : {
					"conditionType" : 0,
					"displayType" : 6,
					"dataType" : 0,
					"queryParamName" : "Client",
					"fieldLabel" : getLabel('instrumentAdvFltTxnClient', 'Client'),
					"defaultValue" : "",
					"options" : [

					],
					"maxLength" : "20",
					"readOnly" : true,
					"urlDetails" : {
						"seekId" : "userclients",
						"rootNode" : "d.preferences",
						"col1Node" : "CODE",
						"col2Node" : "DESCR",
						"col3Node" : "",
						"col4Node" : ""
					}
				},
				"productType" : {
					"conditionType" : 0,
					"displayType" : 6,
					"dataType" : 0,
					"queryParamName" : "ProductType",
					"fieldLabel" : getLabel('instrumentAdvFltProductType',
						'Product Type'),
					"defaultValue" : "",
					"options" : [

					],
					"maxLength" : "20",
					"readOnly" : true,
					"urlDetails" : {
						"seekId" : "usermyproducts",
						"rootNode" : "d.preferences",
						"col1Node" : "CODE",
						"col2Node" : "DESCR",
						"col3Node" : "",
						"col4Node" : ""
					}
				},
				"paymentMethod" : {
					"conditionType" : 0,
					"displayType" : 4,
					"dataType" : 0,
					"queryParamName" : "PaymentMethod",
					"fieldLabel" : getLabel('instrumentAdvFltPaymentMethod',
						'Payment Package'),
					"defaultValue" : "",
					"options" : [{"key":"","value":"(ALL)"},{"key":"(30,31)","value":"Cash Withdrawal"},{"key":"(04,32,33,34)","value":"Book Transfer"},{"key":"(05,35,48,54)","value":"ACH"},{"key":"(06,49)","value":"Domestic Wire"},{"key":"(03)","value":"Telegraphic Transfer"},{"key":"(02)","value":"Demand Drafts"},{"key":"(07)","value":"Manager Cheque"},{"key":"(01)","value":"Customer Cheque"}],
					"maxLength" : "20",
					"readOnly" : false,
					"urlDetails" : {
						"seekId" : "",
						"rootNode" : "",
						"col1Node" : "",
						"col2Node" : "",
						"col3Node" : "",
						"col4Node" : ""
					}
				},
				"bankProduct" : {
					"conditionType" : 0,
					"displayType" : 6,
					"dataType" : 0,
					"queryParamName" : "BankProduct",
					"fieldLabel" : getLabel('instrumentAdvFltBankProduct',
						'Bank Product'),
					"defaultValue" : "",
					"options" : [

					],
					"maxLength" : "20",
					"readOnly" : true,
					"urlDetails" : {
						"seekId" : "bankproducts",
						"rootNode" : "d.preferences",
						"col1Node" : "CODE",
						"col2Node" : "DESCR",
						"col3Node" : "",
						"col4Node" : ""
					}
				},
				"amount" : {
					"conditionType" : 1,
					"displayType" : 2,
					"dataType" : 2,
					"queryParamName" : "Amount",
					"fieldLabel" : getLabel('batchColumnAmount',
						'Amount'),
					"defaultValue" : "",
					"options" : [

					],
					"maxLength" : "20",
					"readOnly" : false,
					"urlDetails" : {
						"seekId" : "paymentccy",
						"rootNode" : "d.preferences",
						"col1Node" : "CODE",
						"col2Node" : "CODE",
						"col3Node" : "",
						"col4Node" : ""
					}
				},
				"txnDate" : {
					"conditionType" : 1,
					"displayType" : 5,
					"dataType" : 1,
					"queryParamName" : "EntryDate",
					"fieldLabel" : getLabel('batchColumnEntryDate',
						'Entry Date'),
					"defaultValue" : "",
					"options" : [

					],
					"maxLength" : "20",
					"readOnly" : true,
					"urlDetails" : {
						"seekId" : "",
						"rootNode" : "",
						"col1Node" : "",
						"col2Node" : "",
						"col3Node" : "",
						"col4Node" : ""
					}
				},
				"totalNo" : {
					"conditionType" : 1,
					"displayType" : 0,
					"dataType" : 0,
					"queryParamName" : "Count",
					"fieldLabel" : getLabel('batchTxnCount',
						'Transaction'),
					"defaultValue" : "",
					"options" : [

					],
					"maxLength" : "20",
					"readOnly" : false,
					"urlDetails" : {
						"seekId" : "",
						"rootNode" : "",
						"col1Node" : "",
						"col2Node" : "",
						"col3Node" : "",
						"col4Node" : ""
					}
				},
				"reqState" : {
					"conditionType" : 0,
					"displayType" : 4,
					"dataType" : 0,
					"queryParamName" : "RequestState",
					"fieldLabel" : getLabel('instrumentAdvFltTxnStatus',
						'Transaction Status'),
					"defaultValue" : "99",
					"options" : [{"key":"99","value":"Show All"},{"key":"0","value":"Draft"},{"key":"1","value":"Pending Submit"},{"key":"2","value":"Pending My Authorization"},{"key":"3","value":"Pending Authorization"},{"key":"4","value":"Pending Release"},{"key":"5","value":"Rejected"},{"key":"6","value":"On Hold"},{"key":"7","value":"Sent To Bank"},{"key":"8","value":"Deleted"},{"key":"9","value":"Pending Repair"},{"key":"24","value":"Submitted"},{"key":"30","value":"Pending My Verification"},{"key":"31","value":"Pending Verification"},{"key":"32","value":"Verifier Rejected"}],
					"maxLength" : "20",
					"readOnly" : false,
					"urlDetails" : {
						"seekId" : "",
						"rootNode" : "",
						"col1Node" : "",
						"col2Node" : "",
						"col3Node" : "",
						"col4Node" : ""
					}
				},
				"fileName" : {
					"conditionType" : 0,
					"displayType" : 0,
					"dataType" : 0,
					"queryParamName" : "FileName",
					"fieldLabel" : getLabel('instrumentAdvFltFileName', 'File Name'),
					"defaultValue" : "",
					"options" : [

					],
					"maxLength" : "20",
					"readOnly" : false,
					"urlDetails" : {
						"seekId" : "",
						"rootNode" : "",
						"col1Node" : "",
						"col2Node" : "",
						"col3Node" : "",
						"col4Node" : ""
					}
				},
				"channelCode" : {
					"conditionType" : 0,
					"displayType" : 6,
					"dataType" : 0,
					"queryParamName" : "ChannelCode",
					"fieldLabel" : getLabel('instrumentAdvFltChannel', 'Channel'),
					"defaultValue" : "",
					"options" : [

					],
					"maxLength" : "20",
					"readOnly" : true,
					"urlDetails" : {
						"seekId" : "channelcodes",
						"rootNode" : "d.preferences",
						"col1Node" : "CODE",
						"col2Node" : "DESCR",
						"col3Node" : "",
						"col4Node" : ""
					}
				}
			}
		}]
	};
