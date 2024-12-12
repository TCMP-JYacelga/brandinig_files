var messageFormMstLabelsMap =
{
	"alert" :
	[
		[
			{
				"showLabel" : "true",
"lblDeleted":"Disabled",
"tsvBtnText":"TSV",
"csvBtnText":"CSV",
"xlsBtnText":"XLS",
"lbl.loanCenter.export":"Export",
"lbl.loanCenter.report":"Report",
"daterange":"Date Range",
"prfMstHistoryPopUpdateRemark":"Remark",
"prfMstHistoryPopUpdateAction":"Action",
"prfMstHistoryPopUpdateDate":"Date Time",
"instrumentsMoreMenuTitle":"more",
"saveFilter":"Save Filters",
"formDestination":"Form Destination",
"formGroup":"Form Group",
"lblEnableRequest":"Enable Request",
"lblAll":"All",
				"label" : "profileName",
				"componentType" : "AutoCompleter",
				"name" : "profileName",
				"cfgUrl" : "services/cponseek/{0}.json",
				"itemId" : "profileNameFltId",
				"cfgSeekId" : "alertprofilenameseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "true",
				"label" : "status",
				"componentType" : "ComboBox",
				"itemId" : "profileStatusFltId",
				"fltParamName" : "requestState",
				"valueField" : "name",
				"displayField" : "value",
				"value" : "all",
				"url" : "services/statusList.json",
				"cfgRootNode" : "d.filter"
			},
			{
				"showLabel" : "true",
				"label" : "module",
				"componentType" : "ComboBox",
				"itemId" : "profileModuleFltId",
				"fltParamName" : "module",
				"valueField" : "name",
				"displayField" : "value",
				"value" : "all",
				"url" : "services/moduleList.json",
				"cfgRootNode" : "d.filter"
			}
		],
		[
			{
				"showLabel" : "true",
				"label" : "category1",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "categoryCode",
				"itemId" : "profileCategoryFltId",
				"cfgSeekId" : "alertcatcodeseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "true",
				"label" : "category2",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "subCategoryCode",
				"itemId" : "profileSubCatFltId",
				"cfgSeekId" : "alertsubcatcodeseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "false",
				"label" : "search",
				"componentType" : "button"
			}
		]
	],
	"report" :
	[
		[
			{
				"showLabel" : "true",
				"label" : "profileName",
				"componentType" : "AutoCompleter",
				"name" : "profileName",
				"cfgUrl" : "services/cponseek/{0}.json",
				"itemId" : "profileNameFltId",
				"cfgSeekId" : "reportprofilenameseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "true",
				"label" : "status",
				"componentType" : "ComboBox",
				"itemId" : "profileStatusFltId",
				"fltParamName" : "requestState",
				"valueField" : "name",
				"displayField" : "value",
				"value" : "all",
				"url" : "services/statusList.json",
				"cfgRootNode" : "d.filter"
			},
			{
				"showLabel" : "true",
				"label" : "module",
				"componentType" : "ComboBox",
				"itemId" : "profileModuleFltId",
				"fltParamName" : "module",
				"valueField" : "name",
				"displayField" : "value",
				"value" : "all",
				"url" : "services/moduleList.json",
				"cfgRootNode" : "d.filter"
			}
		],
		[
			{
				"showLabel" : "true",
				"label" : "category1",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "categoryCode",
				"itemId" : "profileCategoryFltId",
				"cfgSeekId" : "reportcatcodeseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "true",
				"label" : "category2",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "subCategoryCode",
				"itemId" : "profileSubCatFltId",
				"cfgSeekId" : "reportsubcatcodeseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "false",
				"label" : "search",
				"componentType" : "button"
			}
		]
	],
	"interface" :
	[
		[
			{
				"showLabel" : "true",
				"label" : "profileName",
				"componentType" : "AutoCompleter",
				"name" : "profileName",
				"cfgUrl" : "services/cponseek/{0}.json",
				"itemId" : "profileNameFltId",
				"cfgSeekId" : "interfaceprofilenameseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "true",
				"label" : "status",
				"componentType" : "ComboBox",
				"itemId" : "profileStatusFltId",
				"fltParamName" : "requestState",
				"valueField" : "name",
				"displayField" : "value",
				"value" : "all",
				"url" : "services/statusList.json",
				"cfgRootNode" : "d.filter"
			},
			{
				"showLabel" : "true",
				"label" : "module",
				"componentType" : "ComboBox",
				"itemId" : "profileModuleFltId",
				"fltParamName" : "module",
				"valueField" : "name",
				"displayField" : "value",
				"value" : "all",
				"url" : "services/moduleList.json",
				"cfgRootNode" : "d.filter"
			}
		],
		[
			{
				"showLabel" : "true",
				"label" : "category1",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "categoryCode",
				"itemId" : "profileCategoryFltId",
				"cfgSeekId" : "interfacecatcodeseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "true",
				"label" : "category2",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "subCategoryCode",
				"itemId" : "profileSubCatFltId",
				"cfgSeekId" : "interfacesubcatcodeseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "false",
				"label" : "search",
				"componentType" : "button"
			}
		]
	],
	"billing" :
	[
		[
			{
				"showLabel" : "true",
				"label" : "profileName",
				"componentType" : "AutoCompleter",
				"name" : "profileName",
				"cfgUrl" : "services/cponseek/{0}.json",
				"itemId" : "profileNameFltId",
				"cfgSeekId" : "billingprofilenameseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "true",
				"label" : "status",
				"componentType" : "ComboBox",
				"itemId" : "profileStatusFltId",
				"fltParamName" : "requestState",
				"valueField" : "name",
				"displayField" : "value",
				"value" : "all",
				"url" : "services/statusList.json",
				"cfgRootNode" : "d.filter"
			},
			{
				"showLabel" : "true",
				"label" : "module",
				"componentType" : "ComboBox",
				"itemId" : "profileModuleFltId",
				"fltParamName" : "module",
				"valueField" : "name",
				"displayField" : "value",
				"value" : "all",
				"url" : "services/moduleList.json",
				"cfgRootNode" : "d.filter"
			}
		],
		[
			{
				"showLabel" : "true",
				"label" : "category1",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "categoryCode",
				"itemId" : "profileCategoryFltId",
				"cfgSeekId" : "billingcatcodeseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "true",
				"label" : "category2",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "subCategoryCode",
				"itemId" : "profileSubCatFltId",
				"cfgSeekId" : "billingsubcatcodeseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "false",
				"label" : "search",
				"componentType" : "button"
			}
		]
	],
	"limit" :
	[
		[
			{
				"showLabel" : "true",
				"label" : "profileName",
				"componentType" : "AutoCompleter",
				"name" : "profileName",
				"cfgUrl" : "services/cponseek/{0}.json",
				"itemId" : "profileNameFltId",
				"cfgSeekId" : "limitprofilenameseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "true",
				"label" : "status",
				"componentType" : "ComboBox",
				"itemId" : "profileStatusFltId",
				"fltParamName" : "requestState",
				"valueField" : "name",
				"displayField" : "value",
				"value" : "all",
				"url" : "services/statusList.json",
				"cfgRootNode" : "d.filter"
			},
			{
				"showLabel" : "true",
				"label" : "module",
				"componentType" : "ComboBox",
				"itemId" : "profileModuleFltId",
				"fltParamName" : "module",
				"valueField" : "name",
				"displayField" : "value",
				"value" : "all",
				"url" : "services/moduleList.json",
				"cfgRootNode" : "d.filter"
			}
		],
		[
			{
				"showLabel" : "true",
				"label" : "category1",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "categoryCode",
				"itemId" : "profileCategoryFltId",
				"cfgSeekId" : "limitcatcodeseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "true",
				"label" : "category2",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "subCategoryCode",
				"itemId" : "profileSubCatFltId",
				"cfgSeekId" : "limitsubcatcodeseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "false",
				"label" : "search",
				"componentType" : "button"
			}
		]
	],
	"cutoff" :
	[
		[
			{
				"showLabel" : "true",
				"label" : "profileName",
				"componentType" : "AutoCompleter",
				"name" : "profileName",
				"cfgUrl" : "services/cponseek/{0}.json",
				"itemId" : "profileNameFltId",
				"cfgSeekId" : "cutoffprofilenameseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "true",
				"label" : "status",
				"componentType" : "ComboBox",
				"itemId" : "profileStatusFltId",
				"fltParamName" : "requestState",
				"valueField" : "name",
				"displayField" : "value",
				"value" : "all",
				"url" : "services/statusList.json",
				"cfgRootNode" : "d.filter"
			},
			{
				"showLabel" : "true",
				"label" : "module",
				"componentType" : "ComboBox",
				"itemId" : "profileModuleFltId",
				"fltParamName" : "module",
				"valueField" : "name",
				"displayField" : "value",
				"value" : "all",
				"url" : "services/moduleList.json",
				"cfgRootNode" : "d.filter"
			}
		],
		[
			{
				"showLabel" : "true",
				"label" : "category1",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "categoryCode",
				"itemId" : "profileCategoryFltId",
				"cfgSeekId" : "cutoffcatcodeseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "true",
				"label" : "category2",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "subCategoryCode",
				"itemId" : "profileSubCatFltId",
				"cfgSeekId" : "cutoffsubcatcodeseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "false",
				"label" : "search",
				"componentType" : "button"
			}
		]
	],
	"adminfeature" :
	[
		[
			{
				"showLabel" : "true",
				"label" : "profileName",
				"componentType" : "AutoCompleter",
				"name" : "profileName",
				"cfgUrl" : "services/cponseek/{0}.json",
				"itemId" : "profileNameFltId",
				"cfgSeekId" : "adminprofilenameseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "true",
				"label" : "status",
				"componentType" : "ComboBox",
				"itemId" : "profileStatusFltId",
				"fltParamName" : "requestState",
				"valueField" : "name",
				"displayField" : "value",
				"value" : "all",
				"url" : "services/statusList.json",
				"cfgRootNode" : "d.filter"
			},
			{
				"showLabel" : "false",
				"label" : "search",
				"componentType" : "button"
			}
		]
	],
	"typecode" :
	[
		[
			{
				"showLabel" : "true",
				"label" : "profileName",
				"componentType" : "AutoCompleter",
				"name" : "profileName",
				"cfgUrl" : "services/cponseek/{0}.json",
				"itemId" : "profileNameFltId",
				"cfgSeekId" : "typecodeprofilenameseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "true",
				"label" : "status",
				"componentType" : "ComboBox",
				"itemId" : "profileStatusFltId",
				"fltParamName" : "requestState",
				"valueField" : "name",
				"displayField" : "value",
				"value" : "all",
				"url" : "services/statusList.json",
				"cfgRootNode" : "d.filter"
			}
		],
		[
			{
				"showLabel" : "true",
				"label" : "category1",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "categoryCode",
				"itemId" : "profileCategoryFltId",
				"cfgSeekId" : "typecodecatcodeseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "true",
				"label" : "category2",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "subCategoryCode",
				"itemId" : "profileSubCatFltId",
				"cfgSeekId" : "typecodesubcatcodeseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "false",
				"label" : "search",
				"componentType" : "button"
			}
		]
	],
	"brfeature" :
	[
		[
			{
				"showLabel" : "true",
				"label" : "profileName",
				"componentType" : "AutoCompleter",
				"name" : "profileName",
				"cfgUrl" : "services/cponseek/{0}.json",
				"itemId" : "profileNameFltId",
				"cfgSeekId" : "brfeatureprofilenameseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "true",
				"label" : "status",
				"componentType" : "ComboBox",
				"itemId" : "profileStatusFltId",
				"fltParamName" : "requestState",
				"valueField" : "name",
				"displayField" : "value",
				"value" : "all",
				"url" : "services/statusList.json",
				"cfgRootNode" : "d.filter"
			},
			{
				"showLabel" : "false",
				"label" : "search",
				"componentType" : "button"
			}
		]
	],
	"paymentWorkflow" :
	[
		[
			{
				"showLabel" : "true",
				"label" : "profileName",
				"componentType" : "AutoCompleter",
				"name" : "profileName",
				"cfgUrl" : "services/cponseek/{0}.json",
				"itemId" : "profileNameFltId",
				"cfgSeekId" : "paymentWorkflowProfileNameSeek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "true",
				"label" : "status",
				"componentType" : "ComboBox",
				"itemId" : "profileStatusFltId",
				"fltParamName" : "requestState",
				"valueField" : "name",
				"displayField" : "value",
				"value" : "all",
				"url" : "services/statusList.json",
				"cfgRootNode" : "d.filter"
			}
		],
		[
			{
				"showLabel" : "true",
				"label" : "category1",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "categoryCode",
				"itemId" : "profileCategoryFltId",
				"cfgSeekId" : "paymentWorkflowCatCodeSeek",
				"cfgRootNode" : "d.filter",
				"cfgKeyNode" : "name",
				"cfgDataNode1" : "value"
			},
			{
				"showLabel" : "true",
				"label" : "category2",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "subCategoryCode",
				"itemId" : "profileSubCatFltId",
				"cfgSeekId" : "paymentWorkflowSubCatCodeSeek",
				"cfgRootNode" : "d.filter",
				"cfgKeyNode" : "name",
				"cfgDataNode1" : "value"
			},
			{
				"showLabel" : "false",
				"label" : "search",
				"componentType" : "button"
			}
		]
	],
	"systemBene" :
	[
		[
			{
				"showLabel" : "true",
				"label" : "profileName",
				"componentType" : "AutoCompleter",
				"name" : "profileName",
				"cfgUrl" : "services/cponseek/{0}.json",
				"itemId" : "profileNameFltId",
				"cfgSeekId" : "systemBeneProfileNameSeek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "true",
				"label" : "status",
				"componentType" : "ComboBox",
				"itemId" : "profileStatusFltId",
				"fltParamName" : "requestState",
				"valueField" : "name",
				"displayField" : "value",
				"value" : "all",
				"url" : "services/statusList.json",
				"cfgRootNode" : "d.filter"
			}
		],
		[
			{
				"showLabel" : "true",
				"label" : "category1",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "categoryCode",
				"itemId" : "profileCategoryFltId",
				"cfgSeekId" : "systemBeneCatCodeSeek",
				"cfgRootNode" : "d.filter",
				"cfgKeyNode" : "name",
				"cfgDataNode1" : "value"
			},
			{
				"showLabel" : "true",
				"label" : "category2",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "subCategoryCode",
				"itemId" : "profileSubCatFltId",
				"cfgSeekId" : "systemBeneSubCatCodeSeek",
				"cfgRootNode" : "d.filter",
				"cfgKeyNode" : "name",
				"cfgDataNode1" : "value"
			},
			{
				"showLabel" : "false",
				"label" : "search",
				"componentType" : "button"
			}
		]
	],
	"fxSpread" :
	[
		[
			{
				"showLabel" : "true",
				"label" : "profileName",
				"componentType" : "AutoCompleter",
				"name" : "profileName",
				"cfgUrl" : "services/cponseek/{0}.json",
				"itemId" : "profileNameFltId",
				"cfgSeekId" : "fxSpreadProfileNameSeek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "true",
				"label" : "status",
				"componentType" : "ComboBox",
				"itemId" : "profileStatusFltId",
				"fltParamName" : "requestState",
				"valueField" : "name",
				"displayField" : "value",
				"value" : "all",
				"url" : "services/statusList.json",
				"cfgRootNode" : "d.filter"
			}
		],
		[
			{
				"showLabel" : "true",
				"label" : "category1",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "categoryCode",
				"itemId" : "profileCategoryFltId",
				"cfgSeekId" : "fxSpreadCatCodeSeek",
				"cfgRootNode" : "d.filter",
				"cfgKeyNode" : "name",
				"cfgDataNode1" : "value"
			},
			{
				"showLabel" : "true",
				"label" : "category2",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "subCategoryCode",
				"itemId" : "profileSubCatFltId",
				"cfgSeekId" : "fxSpreadSubCatCodeSeek",
				"cfgRootNode" : "d.filter",
				"cfgKeyNode" : "name",
				"cfgDataNode1" : "value"
			},
			{
				"showLabel" : "false",
				"label" : "search",
				"componentType" : "button"
			}
		]
	],
	"paymentFeature" :
	[
		[
			{
				"showLabel" : "true",
				"label" : "profileName",
				"componentType" : "AutoCompleter",
				"name" : "profileName",
				"cfgUrl" : "services/cponseek/{0}.json",
				"itemId" : "profileNameFltId",
				"cfgSeekId" : "paymentFeatureProfileNameSeek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "true",
				"label" : "status",
				"componentType" : "ComboBox",
				"itemId" : "profileStatusFltId",
				"fltParamName" : "requestState",
				"valueField" : "name",
				"displayField" : "value",
				"value" : "all",
				"url" : "services/statusList.json",
				"cfgRootNode" : "d.filter"
			},
			{
				"showLabel" : "false",
				"label" : "search",
				"componentType" : "button"
			}
		]
	],
	"paymentPackage" :
	[
		[
			{
				"showLabel" : "true",
				"label" : "profileName",
				"componentType" : "AutoCompleter",
				"name" : "profileName",
				"cfgUrl" : "services/cponseek/{0}.json",
				"itemId" : "profileNameFltId",
				"cfgSeekId" : "paymentPackageProfileNameSeek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "true",
				"label" : "status",
				"componentType" : "ComboBox",
				"itemId" : "profileStatusFltId",
				"fltParamName" : "requestState",
				"valueField" : "name",
				"displayField" : "value",
				"value" : "all",
				"url" : "services/statusList.json",
				"cfgRootNode" : "d.filter"
			}
		],
		[
			{
				"showLabel" : "true",
				"label" : "type",
				"componentType" : "ComboBox",
				"itemId" : "profileModuleFltId",
				"fltParamName" : "type",
				"valueField" : "name",
				"displayField" : "value",
				"value" : "all",
				"url" : "services/statusList.json",
				"cfgRootNode" : "d.filter"
			},
			{
				"showLabel" : "false",
				"label" : "search",
				"componentType" : "button"
			}
		]
	],
	
	"lbl.messageForm.formMessages" : "Message Form",
	"lbl.formMessages" : "Form Messages",
	
	"lblerror" : "Error",
	"lblnourl" : "Sorry no URl provided for History",
	"instrumentsHistoryColumnUserId" : "User ID",
	"instrumentsHistoryColumnDateTime" : "Date Time",
	"instrumentsHistoryColumnRejectRemark" : "Reject Remark",
	"prfRejectRemarkPopUpTitle" : "Please Enter Reject Remark",
	"instrumentsHistoryColumnStatus" : "Status",
	"btnOk" : "Ok",
	"btnDone" : "Done",
	"btnClose" : "Close",
	"lblerrordata" : "Error while fetching data..!",
	"lbl.messageForm.create" : "Create New :",
	"lbl.messageForm.newForm" : "Message Form",
	"filterBy" : "Filter By:",
	"lbl.messageForm.formGroup" : "Form Group",
	"lbl.messageForm.all" : "All",
	"moreText" : "more",
	"lbl.messageForm.formDestination" : "Form Destination",
	"lbl.formname" : "Form Name",
	"lbl.formgrp" : "Form Group",
	"lbl.screentype" : "Screen Type",
	"lbl.corrtype" : "Correspondence Type",
	"lbl.qlname" : "Quick Link Name",
	"lbl.messageForm.status" : "Status",
	"summinformation" : "Summary Information",
	"latest" : "Latest",
	"today" : "Today",
	"yesterday" : "Yesterday",
	"thisweek" : "This Week",
	"lastweektodate" : "Last Week To Date",
	"thismonth" : "This Month",
	"lastMonthToDate" : "Last Month To Date",
	"thisquarter" : "This Quarter",
	"lastQuarterToDate" : "Last Quarter To Date",
	"thisyear" : "This Year",
	"lastyeartodate" : "Last Year To Date",	
	"goBtnText" : "Go",
	"mostUsedFrms" : "Most Used Forms",
	"lbl.leastUsedForms" : "Least Used Forms",
	"prfMstActionSubmit" : "Submit",
	"prfMstActionApprove" : "Approve",
	"prfMstActionReject" : "Reject",
	"prfMstActionEnable" : "Enable",
	"prfMstActionDisable" : "Suspend",
	"prfMstActionDiscard" : "Discard",	
	"searchOnPage" : "Search on Page",
	"exactMatch" : "Exact Match",
	"anyMatch" : "Any Match",
	"lbl.messageForm.messages" : "Messages",
	"actions" : "Actions", 
	"lblNew" : "New",
	"lblSubmitted" : "New Submitted",
	"lblModifiedSubmitted" : "Modified Submitted",
	"lblAuthorized" : "Approved",
	"lblNewRejected" : "New Rejected",
	"lblModified" : "Modified",
	"lblModifiedReject" : "Modified Rejected",
	"lblDisableRequest" : "Suspend Request",
	"lblDisableReqRejected" : "Suspend Request Rejected",
	"lblDisabled" : "Suspended",
	"lblenableReq" : "Enable Request",
	"lblEnableReqRejected" : "Enable Request Rejected",
	"SaveFilterPopupTitle" : "Message",
	"filterPopupTitle" : "Error",
	"filterPopupMsg" : "Error while fetching data..!",
	"prefSavedMsg" : "Preferences Saved Successfully",
	"instrumentErrorPopUpTitle" : "Error",
	"lblsubtotal" : "Sub Total",
	"viewToolTip" : "View Record",
	"editToolTip" : "Modify Record",
	"historyToolTip" : "View History",
	"seller" : "Financial Institution",
	"search" : "Search",
	"desc" : "Description",
	"maker" : "Maker",
	"checker" : "Checker",
	"action" : "Action",
	"remark" : "Remark",
	"loading" :"Loading...",
	"lblPendingMyApproval":"Pending My Approval"
}