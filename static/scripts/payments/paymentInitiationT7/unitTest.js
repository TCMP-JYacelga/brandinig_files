var dummyInstrumentJson = {
	"d" : {
		"paymentEntry" : {
			"enrichments" : {
				"clientMultiSet" : [{
					"dirtyRow" : false,
					"parameters" : [{
						"minLength" : 0,
						"parent" : false,
						"editable" : false,
						"enrichmentType" : "M",
						"enrichmentLength" : 0,
						"mandatory" : true,
						"displayType" : 4,
						"minValueExist" : false,
						"maxValueExist" : false,
						"validatable" : false,
						"includeInTotal" : "N",
						"lookupValues" : [{
									"value" : "22-Automated Deposit - Checking",
									"key" : "22"
								}, {
									"value" : "32-Automated Deposit - Saving",
									"key" : "32"
								}, {
									"value" : "27-Automated Payment - Checking",
									"key" : "27"
								}, {
									"value" : "37-Automated Payment - Saving",
									"key" : "37"
								}],
						"sequenceNmbr" : 1,
						"storageSerial" : 0,
						"parentEnrichReq" : false,
						"enrichmentSetName" : "Addenda",
						"value" : "22",
						"defaultValue" : "22",
						"string" : "22",
						"description" : "Transaction Code",
						"code" : "EENR01",
						"required" : true,
						"maxLength" : 20,
						"dataType" : 11,
						"maxFractionDigits" : 0
					}, {
						"minLength" : 8,
						"parent" : false,
						"editable" : false,
						"enrichmentType" : "M",
						"enrichmentLength" : 0,
						"mandatory" : true,
						"displayType" : 3,
						"minValueExist" : false,
						"maxValueExist" : false,
						"validatable" : false,
						"includeInTotal" : "N",
						"sequenceNmbr" : 2,
						"storageSerial" : 0,
						"parentEnrichReq" : false,
						"enrichmentSetName" : "Addenda",
						"value" : "564556688",
						"string" : "564556688",
						"description" : "Receiving DFI Identification Number",
						"code" : "EENR02",
						"required" : true,
						"maxLength" : 9,
						"dataType" : 11,
						"maxFractionDigits" : 0
					}, {
						"minLength" : 0,
						"parent" : false,
						"editable" : false,
						"enrichmentType" : "M",
						"enrichmentLength" : 0,
						"mandatory" : true,
						"displayType" : 0,
						"minValueExist" : false,
						"maxValueExist" : false,
						"validatable" : false,
						"includeInTotal" : "N",
						"sequenceNmbr" : 3,
						"storageSerial" : 0,
						"parentEnrichReq" : false,
						"enrichmentSetName" : "Addenda",
						"value" : "12345687",
						"string" : "12345687",
						"description" : "DFI Account",
						"code" : "EENR03",
						"required" : true,
						"maxLength" : 17,
						"dataType" : 11,
						"maxFractionDigits" : 0
					}, {
						"minLength" : 0,
						"parent" : false,
						"editable" : false,
						"enrichmentType" : "M",
						"enrichmentLength" : 0,
						"mandatory" : true,
						"displayType" : 3,
						"minValueExist" : false,
						"maxValueExist" : false,
						"validatable" : false,
						"includeInTotal" : "N",
						"sequenceNmbr" : 4,
						"storageSerial" : 0,
						"parentEnrichReq" : false,
						"enrichmentSetName" : "Addenda",
						"value" : "424243243",
						"string" : "424243243",
						"description" : "Individual Identification Number",
						"code" : "EENR04",
						"required" : true,
						"maxLength" : 9,
						"dataType" : 11,
						"maxFractionDigits" : 0
					}, {
						"minLength" : 0,
						"parent" : false,
						"editable" : false,
						"enrichmentType" : "M",
						"enrichmentLength" : 0,
						"mandatory" : true,
						"displayType" : 0,
						"minValueExist" : false,
						"maxValueExist" : false,
						"validatable" : false,
						"includeInTotal" : "N",
						"sequenceNmbr" : 5,
						"storageSerial" : 0,
						"parentEnrichReq" : false,
						"enrichmentSetName" : "Addenda",
						"value" : "KEDAI",
						"string" : "KEDAI",
						"description" : "Last Name",
						"code" : "EENR05",
						"required" : true,
						"maxLength" : 15,
						"dataType" : 11,
						"maxFractionDigits" : 0
					}, {
						"minLength" : 0,
						"parent" : false,
						"editable" : false,
						"enrichmentType" : "M",
						"enrichmentLength" : 0,
						"mandatory" : true,
						"displayType" : 0,
						"minValueExist" : false,
						"maxValueExist" : false,
						"validatable" : false,
						"includeInTotal" : "N",
						"sequenceNmbr" : 6,
						"storageSerial" : 0,
						"parentEnrichReq" : false,
						"enrichmentSetName" : "Addenda",
						"value" : "JOHN",
						"string" : "JOHN",
						"description" : "First Name",
						"code" : "EENR06",
						"required" : true,
						"maxLength" : 7,
						"dataType" : 11,
						"maxFractionDigits" : 0
					}, {
						"minLength" : 0,
						"parent" : false,
						"editable" : false,
						"enrichmentType" : "M",
						"enrichmentLength" : 0,
						"mandatory" : true,
						"displayType" : 4,
						"minValueExist" : false,
						"maxValueExist" : false,
						"validatable" : false,
						"includeInTotal" : "N",
						"lookupValues" : [{
									"value" : "0-No",
									"key" : "0"
								}, {
									"value" : "1-Yes",
									"key" : "1"
								}],
						"sequenceNmbr" : 7,
						"storageSerial" : 0,
						"parentEnrichReq" : false,
						"enrichmentSetName" : "Addenda",
						"value" : "1",
						"defaultValue" : "0",
						"string" : "1",
						"description" : "Payee",
						"code" : "EENR07",
						"required" : true,
						"maxLength" : 1,
						"dataType" : 11,
						"maxFractionDigits" : 0
					}],
					"serialNumber" : 1,
					"bankProduct" : "ENR",
					"profileId" : "ENR",
					"internalRefNo" : "1411170002KN",
					"labels" : ["Transaction Code",
							"Receiving DFI Identification Number",
							"DFI Account",
							"Individual Identification Number", "Last Name",
							"First Name", "Payee"],
					"dirtyRowFlag" : "N",
					"version" : 1
				}, {
					"dirtyRow" : false,
					"parameters" : [{
						"minLength" : 0,
						"parent" : false,
						"editable" : false,
						"enrichmentType" : "M",
						"enrichmentLength" : 0,
						"mandatory" : true,
						"displayType" : 4,
						"minValueExist" : false,
						"maxValueExist" : false,
						"validatable" : false,
						"includeInTotal" : "N",
						"lookupValues" : [{
									"value" : "22-Automated Deposit - Checking",
									"key" : "22"
								}, {
									"value" : "32-Automated Deposit - Saving",
									"key" : "32"
								}, {
									"value" : "27-Automated Payment - Checking",
									"key" : "27"
								}, {
									"value" : "37-Automated Payment - Saving",
									"key" : "37"
								}],
						"sequenceNmbr" : 1,
						"storageSerial" : 0,
						"parentEnrichReq" : false,
						"enrichmentSetName" : "Addenda",
						"value" : "32",
						"defaultValue" : "22",
						"string" : "32",
						"description" : "Transaction Code",
						"code" : "EENR01",
						"required" : true,
						"maxLength" : 20,
						"dataType" : 11,
						"maxFractionDigits" : 0
					}, {
						"minLength" : 8,
						"parent" : false,
						"editable" : false,
						"enrichmentType" : "M",
						"enrichmentLength" : 0,
						"mandatory" : true,
						"displayType" : 3,
						"minValueExist" : false,
						"maxValueExist" : false,
						"validatable" : false,
						"includeInTotal" : "N",
						"sequenceNmbr" : 2,
						"storageSerial" : 0,
						"parentEnrichReq" : false,
						"enrichmentSetName" : "Addenda",
						"value" : "24523543",
						"string" : "24523543",
						"description" : "Receiving DFI Identification Number",
						"code" : "EENR02",
						"required" : true,
						"maxLength" : 9,
						"dataType" : 11,
						"maxFractionDigits" : 0
					}, {
						"minLength" : 0,
						"parent" : false,
						"editable" : false,
						"enrichmentType" : "M",
						"enrichmentLength" : 0,
						"mandatory" : true,
						"displayType" : 0,
						"minValueExist" : false,
						"maxValueExist" : false,
						"validatable" : false,
						"includeInTotal" : "N",
						"sequenceNmbr" : 3,
						"storageSerial" : 0,
						"parentEnrichReq" : false,
						"enrichmentSetName" : "Addenda",
						"value" : "53543",
						"string" : "53543",
						"description" : "DFI Account",
						"code" : "EENR03",
						"required" : true,
						"maxLength" : 17,
						"dataType" : 11,
						"maxFractionDigits" : 0
					}, {
						"minLength" : 0,
						"parent" : false,
						"editable" : false,
						"enrichmentType" : "M",
						"enrichmentLength" : 0,
						"mandatory" : true,
						"displayType" : 3,
						"minValueExist" : false,
						"maxValueExist" : false,
						"validatable" : false,
						"includeInTotal" : "N",
						"sequenceNmbr" : 4,
						"storageSerial" : 0,
						"parentEnrichReq" : false,
						"enrichmentSetName" : "Addenda",
						"value" : "455435354",
						"string" : "455435354",
						"description" : "Individual Identification Number",
						"code" : "EENR04",
						"required" : true,
						"maxLength" : 9,
						"dataType" : 11,
						"maxFractionDigits" : 0
					}, {
						"minLength" : 0,
						"parent" : false,
						"editable" : false,
						"enrichmentType" : "M",
						"enrichmentLength" : 0,
						"mandatory" : true,
						"displayType" : 0,
						"minValueExist" : false,
						"maxValueExist" : false,
						"validatable" : false,
						"includeInTotal" : "N",
						"sequenceNmbr" : 5,
						"storageSerial" : 0,
						"parentEnrichReq" : false,
						"enrichmentSetName" : "Addenda",
						"value" : "OJAMSFD",
						"string" : "OJAMSFD",
						"description" : "Last Name",
						"code" : "EENR05",
						"required" : true,
						"maxLength" : 15,
						"dataType" : 11,
						"maxFractionDigits" : 0
					}, {
						"minLength" : 0,
						"parent" : false,
						"editable" : false,
						"enrichmentType" : "M",
						"enrichmentLength" : 0,
						"mandatory" : true,
						"displayType" : 0,
						"minValueExist" : false,
						"maxValueExist" : false,
						"validatable" : false,
						"includeInTotal" : "N",
						"sequenceNmbr" : 6,
						"storageSerial" : 0,
						"parentEnrichReq" : false,
						"enrichmentSetName" : "Addenda",
						"value" : "FDSGSFG",
						"string" : "FDSGSFG",
						"description" : "First Name",
						"code" : "EENR06",
						"required" : true,
						"maxLength" : 7,
						"dataType" : 11,
						"maxFractionDigits" : 0
					}, {
						"minLength" : 0,
						"parent" : false,
						"editable" : false,
						"enrichmentType" : "M",
						"enrichmentLength" : 0,
						"mandatory" : true,
						"displayType" : 4,
						"minValueExist" : false,
						"maxValueExist" : false,
						"validatable" : false,
						"includeInTotal" : "N",
						"lookupValues" : [{
									"value" : "0-No",
									"key" : "0"
								}, {
									"value" : "1-Yes",
									"key" : "1"
								}],
						"sequenceNmbr" : 7,
						"storageSerial" : 0,
						"parentEnrichReq" : false,
						"enrichmentSetName" : "Addenda",
						"value" : "0",
						"defaultValue" : "0",
						"string" : "0",
						"description" : "Payee",
						"code" : "EENR07",
						"required" : true,
						"maxLength" : 1,
						"dataType" : 11,
						"maxFractionDigits" : 0
					}],
					"serialNumber" : 2,
					"bankProduct" : "ENR",
					"profileId" : "ENR",
					"internalRefNo" : "1411170002KN",
					"labels" : ["Transaction Code",
							"Receiving DFI Identification Number",
							"DFI Account",
							"Individual Identification Number", "Last Name",
							"First Name", "Payee"],
					"dirtyRowFlag" : "N",
					"version" : 1
				}],
				"clientEnrichment" : {
					"dirtyRow" : false,
					"parameters" : [{
								"editable" : false,
								"parent" : false,
								"minLength" : 0,
								"enrichmentType" : "S",
								"enrichmentLength" : 0,
								"mandatory" : false,
								"displayType" : 0,
								"minValueExist" : false,
								"maxValueExist" : false,
								"validatable" : false,
								"includeInTotal" : "N",
								"sequenceNmbr" : 13,
								"storageSerial" : 0,
								"parentEnrichReq" : false,
								"enrichmentSetName" : "ADDITIONAL INFORMATION",
								"required" : false,
								"description" : "Additional Info 1",
								"dataType" : 11,
								"maxLength" : 35,
								"code" : "ADDLINFO1",
								"maxFractionDigits" : 0
							}, {
								"editable" : false,
								"parent" : false,
								"minLength" : 0,
								"enrichmentType" : "S",
								"enrichmentLength" : 0,
								"mandatory" : false,
								"displayType" : 0,
								"minValueExist" : false,
								"maxValueExist" : false,
								"validatable" : false,
								"includeInTotal" : "N",
								"sequenceNmbr" : 14,
								"storageSerial" : 0,
								"parentEnrichReq" : false,
								"enrichmentSetName" : "ADDITIONAL INFORMATION",
								"required" : false,
								"description" : "Additional Info 2",
								"dataType" : 11,
								"maxLength" : 35,
								"code" : "ADDLINFO2",
								"maxFractionDigits" : 0
							}, {
								"editable" : false,
								"parent" : false,
								"minLength" : 0,
								"enrichmentType" : "S",
								"enrichmentLength" : 0,
								"mandatory" : false,
								"displayType" : 0,
								"minValueExist" : false,
								"maxValueExist" : false,
								"validatable" : false,
								"includeInTotal" : "N",
								"sequenceNmbr" : 15,
								"storageSerial" : 0,
								"parentEnrichReq" : false,
								"enrichmentSetName" : "ADDITIONAL INFORMATION",
								"required" : false,
								"description" : "Additional Info 3",
								"dataType" : 11,
								"maxLength" : 35,
								"code" : "ADDLINFO3",
								"maxFractionDigits" : 0
							}, {
								"editable" : false,
								"parent" : false,
								"minLength" : 0,
								"enrichmentType" : "S",
								"enrichmentLength" : 0,
								"mandatory" : false,
								"displayType" : 0,
								"minValueExist" : false,
								"maxValueExist" : false,
								"validatable" : false,
								"includeInTotal" : "N",
								"sequenceNmbr" : 16,
								"storageSerial" : 0,
								"parentEnrichReq" : false,
								"enrichmentSetName" : "ADDITIONAL INFORMATION",
								"required" : false,
								"description" : "Additional Info 4",
								"dataType" : 11,
								"maxLength" : 35,
								"code" : "ADDLINFO4",
								"maxFractionDigits" : 0
							}, {
								"editable" : false,
								"parent" : false,
								"minLength" : 0,
								"enrichmentType" : "S",
								"enrichmentLength" : 0,
								"mandatory" : false,
								"displayType" : 4,
								"minValueExist" : false,
								"maxValueExist" : false,
								"validatable" : true,
								"includeInTotal" : "N",
								"lookupValues" : [{
									"value" : "ACC - Instructions following are for the account with Institution",
									"key" : "ACC"
								}, {
									"value" : "INS - The instructing institution which instructed the sender to execute the transaction",
									"key" : "INS"
								}, {
									"value" : "INT - Instructions following are for the intermediary",
									"key" : "INT"
								}, {
									"value" : "REC - Instructions following are for the receiver",
									"key" : "REC"
								}, {
									"value" : "Continue - For use of additional information which has to be continued on next line",
									"key" : "Continue"
								}],
								"sequenceNmbr" : 1,
								"storageSerial" : 0,
								"parentEnrichReq" : false,
								"enrichmentSetName" : "BANK TO BANK INFO",
								"required" : false,
								"description" : "Bank to Bank Information1",
								"dataType" : 11,
								"maxLength" : 40,
								"code" : "BTOBINFO7",
								"maxFractionDigits" : 0
							}, {
								"editable" : false,
								"parent" : false,
								"minLength" : 0,
								"enrichmentType" : "S",
								"enrichmentLength" : 0,
								"mandatory" : false,
								"displayType" : 0,
								"minValueExist" : false,
								"maxValueExist" : false,
								"validatable" : false,
								"includeInTotal" : "N",
								"sequenceNmbr" : 2,
								"storageSerial" : 0,
								"parentEnrichReq" : false,
								"enrichmentSetName" : "BANK TO BANK INFO",
								"required" : false,
								"description" : "Text",
								"dataType" : 11,
								"maxLength" : 15,
								"code" : "BTOBINFO1",
								"maxFractionDigits" : 0
							}, {
								"editable" : false,
								"parent" : false,
								"minLength" : 0,
								"enrichmentType" : "S",
								"enrichmentLength" : 0,
								"mandatory" : false,
								"displayType" : 4,
								"minValueExist" : false,
								"maxValueExist" : false,
								"validatable" : true,
								"includeInTotal" : "N",
								"lookupValues" : [{
									"value" : "ACC - Instructions following are for the account with Institution",
									"key" : "ACC"
								}, {
									"value" : "INS - The instructing institution which instructed the sender to execute the transaction",
									"key" : "INS"
								}, {
									"value" : "INT - Instructions following are for the intermediary",
									"key" : "INT"
								}, {
									"value" : "REC - Instructions following are for the receiver",
									"key" : "REC"
								}, {
									"value" : "Continue - For use of additional information which has to be continued on next line",
									"key" : "Continue"
								}],
								"sequenceNmbr" : 3,
								"storageSerial" : 0,
								"parentEnrichReq" : false,
								"enrichmentSetName" : "BANK TO BANK INFO",
								"required" : false,
								"description" : "Bank to Bank Information2",
								"dataType" : 11,
								"maxLength" : 40,
								"code" : "BTOBINFO8",
								"maxFractionDigits" : 0
							}, {
								"editable" : false,
								"parent" : false,
								"minLength" : 0,
								"enrichmentType" : "S",
								"enrichmentLength" : 0,
								"mandatory" : false,
								"displayType" : 0,
								"minValueExist" : false,
								"maxValueExist" : false,
								"validatable" : false,
								"includeInTotal" : "N",
								"sequenceNmbr" : 4,
								"storageSerial" : 0,
								"parentEnrichReq" : false,
								"enrichmentSetName" : "BANK TO BANK INFO",
								"required" : false,
								"description" : "Text",
								"dataType" : 11,
								"maxLength" : 15,
								"code" : "BTOBINFO2",
								"maxFractionDigits" : 0
							}, {
								"editable" : false,
								"parent" : false,
								"minLength" : 0,
								"enrichmentType" : "S",
								"enrichmentLength" : 0,
								"mandatory" : false,
								"displayType" : 4,
								"minValueExist" : false,
								"maxValueExist" : false,
								"validatable" : true,
								"includeInTotal" : "N",
								"lookupValues" : [{
									"value" : "ACC - Instructions following are for the account with Institution",
									"key" : "ACC"
								}, {
									"value" : "INS - The instructing institution which instructed the sender to execute the transaction",
									"key" : "INS"
								}, {
									"value" : "INT - Instructions following are for the intermediary",
									"key" : "INT"
								}, {
									"value" : "REC - Instructions following are for the receiver",
									"key" : "REC"
								}, {
									"value" : "Continue - For use of additional information which has to be continued on next line",
									"key" : "Continue"
								}],
								"sequenceNmbr" : 5,
								"storageSerial" : 0,
								"parentEnrichReq" : false,
								"enrichmentSetName" : "BANK TO BANK INFO",
								"required" : false,
								"description" : "Bank to Bank Information3",
								"dataType" : 11,
								"maxLength" : 40,
								"code" : "BTOBINFO9",
								"maxFractionDigits" : 0
							}, {
								"editable" : false,
								"parent" : false,
								"minLength" : 0,
								"enrichmentType" : "S",
								"enrichmentLength" : 0,
								"mandatory" : false,
								"displayType" : 0,
								"minValueExist" : false,
								"maxValueExist" : false,
								"validatable" : false,
								"includeInTotal" : "N",
								"sequenceNmbr" : 6,
								"storageSerial" : 0,
								"parentEnrichReq" : false,
								"enrichmentSetName" : "BANK TO BANK INFO",
								"required" : false,
								"description" : "Text",
								"dataType" : 11,
								"maxLength" : 15,
								"code" : "BTOBINFO3",
								"maxFractionDigits" : 0
							}, {
								"editable" : false,
								"parent" : false,
								"minLength" : 0,
								"enrichmentType" : "S",
								"enrichmentLength" : 0,
								"mandatory" : false,
								"displayType" : 4,
								"minValueExist" : false,
								"maxValueExist" : false,
								"validatable" : true,
								"includeInTotal" : "N",
								"lookupValues" : [{
									"value" : "ACC - Instructions following are for the account with Institution",
									"key" : "ACC"
								}, {
									"value" : "INS - The instructing institution which instructed the sender to execute the transaction",
									"key" : "INS"
								}, {
									"value" : "INT - Instructions following are for the intermediary",
									"key" : "INT"
								}, {
									"value" : "REC - Instructions following are for the receiver",
									"key" : "REC"
								}, {
									"value" : "Continue - For use of additional information which has to be continued on next line",
									"key" : "Continue"
								}],
								"sequenceNmbr" : 7,
								"storageSerial" : 0,
								"parentEnrichReq" : false,
								"enrichmentSetName" : "BANK TO BANK INFO",
								"required" : false,
								"description" : "Bank to Bank Information4",
								"dataType" : 11,
								"maxLength" : 40,
								"code" : "BTOBINFO10",
								"maxFractionDigits" : 0
							}, {
								"editable" : false,
								"parent" : false,
								"minLength" : 0,
								"enrichmentType" : "S",
								"enrichmentLength" : 0,
								"mandatory" : false,
								"displayType" : 0,
								"minValueExist" : false,
								"maxValueExist" : false,
								"validatable" : false,
								"includeInTotal" : "N",
								"sequenceNmbr" : 8,
								"storageSerial" : 0,
								"parentEnrichReq" : false,
								"enrichmentSetName" : "BANK TO BANK INFO",
								"required" : false,
								"description" : "Text",
								"dataType" : 11,
								"maxLength" : 15,
								"code" : "BTOBINFO4",
								"maxFractionDigits" : 0
							}, {
								"editable" : false,
								"parent" : false,
								"minLength" : 0,
								"enrichmentType" : "S",
								"enrichmentLength" : 0,
								"mandatory" : false,
								"displayType" : 4,
								"minValueExist" : false,
								"maxValueExist" : false,
								"validatable" : true,
								"includeInTotal" : "N",
								"lookupValues" : [{
									"value" : "ACC - Instructions following are for the account with Institution",
									"key" : "ACC"
								}, {
									"value" : "INS - The instructing institution which instructed the sender to execute the transaction",
									"key" : "INS"
								}, {
									"value" : "INT - Instructions following are for the intermediary",
									"key" : "INT"
								}, {
									"value" : "REC - Instructions following are for the receiver",
									"key" : "REC"
								}, {
									"value" : "Continue - For use of additional information which has to be continued on next line",
									"key" : "Continue"
								}],
								"sequenceNmbr" : 9,
								"storageSerial" : 0,
								"parentEnrichReq" : false,
								"enrichmentSetName" : "BANK TO BANK INFO",
								"required" : false,
								"description" : "Bank to Bank Information5",
								"dataType" : 11,
								"maxLength" : 40,
								"code" : "BTOBINFO11",
								"maxFractionDigits" : 0
							}, {
								"editable" : false,
								"parent" : false,
								"minLength" : 0,
								"enrichmentType" : "S",
								"enrichmentLength" : 0,
								"mandatory" : false,
								"displayType" : 0,
								"minValueExist" : false,
								"maxValueExist" : false,
								"validatable" : false,
								"includeInTotal" : "N",
								"sequenceNmbr" : 10,
								"storageSerial" : 0,
								"parentEnrichReq" : false,
								"enrichmentSetName" : "BANK TO BANK INFO",
								"required" : false,
								"description" : "Text",
								"dataType" : 11,
								"maxLength" : 15,
								"code" : "BTOBINFO5",
								"maxFractionDigits" : 0
							}, {
								"editable" : false,
								"parent" : false,
								"minLength" : 0,
								"enrichmentType" : "S",
								"enrichmentLength" : 0,
								"mandatory" : false,
								"displayType" : 4,
								"minValueExist" : false,
								"maxValueExist" : false,
								"validatable" : true,
								"includeInTotal" : "N",
								"lookupValues" : [{
									"value" : "ACC - Instructions following are for the account with Institution",
									"key" : "ACC"
								}, {
									"value" : "INS - The instructing institution which instructed the sender to execute the transaction",
									"key" : "INS"
								}, {
									"value" : "INT - Instructions following are for the intermediary",
									"key" : "INT"
								}, {
									"value" : "REC - Instructions following are for the receiver",
									"key" : "REC"
								}, {
									"value" : "Continue - For use of additional information which has to be continued on next line",
									"key" : "Continue"
								}],
								"sequenceNmbr" : 11,
								"storageSerial" : 0,
								"parentEnrichReq" : false,
								"enrichmentSetName" : "BANK TO BANK INFO",
								"required" : false,
								"description" : "Bank to Bank Information6",
								"dataType" : 11,
								"maxLength" : 40,
								"code" : "BTOBINFO12",
								"maxFractionDigits" : 0
							}, {
								"editable" : false,
								"parent" : false,
								"minLength" : 0,
								"enrichmentType" : "S",
								"enrichmentLength" : 0,
								"mandatory" : false,
								"displayType" : 0,
								"minValueExist" : false,
								"maxValueExist" : false,
								"validatable" : false,
								"includeInTotal" : "N",
								"sequenceNmbr" : 12,
								"storageSerial" : 0,
								"parentEnrichReq" : false,
								"enrichmentSetName" : "BANK TO BANK INFO",
								"required" : false,
								"description" : "Text",
								"dataType" : 11,
								"maxLength" : 15,
								"code" : "BTOBINFO6",
								"maxFractionDigits" : 0
							}, {
								"editable" : false,
								"parent" : false,
								"minLength" : 0,
								"enrichmentType" : "S",
								"enrichmentLength" : 0,
								"mandatory" : false,
								"displayType" : 4,
								"minValueExist" : false,
								"maxValueExist" : false,
								"validatable" : true,
								"includeInTotal" : "N",
								"lookupValues" : [{
									"value" : "PHON - Please advise account with institution by phone",
									"key" : "PHON"
								}, {
									"value" : "TELE - Please advise account with institution by the most efficient means of telecommunication.",
									"key" : "TELE"
								}, {
									"value" : "PHOI - Please advise the intermediary institution by phone",
									"key" : "PHOI"
								}, {
									"value" : "TELI - Please advise the intermediary institution by the most efficient means of telecommunication.",
									"key" : "TELI"
								}, {
									"value" : "SDVA - Payment must be executed with same day value to the beneficiary",
									"key" : "SDVA"
								}, {
									"value" : "INTC - The payment is an intra-company payment, i.e. a payment between two companies belonging to the same group.",
									"key" : "INTC"
								}, {
									"value" : "REPA - Payment has a related e-Payment reference.",
									"key" : "REPA"
								}, {
									"value" : "CORT - This transaction contains a payment that is made in settlement of a trade, e.g., foreign exchange deal, securities transaction",
									"key" : "CORT"
								}, {
									"value" : "BONL - Payment is to be made to the beneficiary customer only",
									"key" : "BONL"
								}, {
									"value" : "HOLD - Beneficiary customer/claimant will call; pay upon identification.",
									"key" : "HOLD"
								}, {
									"value" : "CHQB - Pay beneficiary customer only by check.",
									"key" : "CHQB"
								}, {
									"value" : "PHOB - Please advise/contact beneficiary-claimant by phone",
									"key" : "PHOB"
								}, {
									"value" : "TELB - Please advise/contact beneficiary-claimant the most efficient means of telecommunication.",
									"key" : "TELB"
								}],
								"sequenceNmbr" : 17,
								"storageSerial" : 0,
								"parentEnrichReq" : false,
								"enrichmentSetName" : "INSTRUCTION CODE",
								"required" : false,
								"description" : "Instruction Code 1",
								"dataType" : 11,
								"maxLength" : 80,
								"code" : "INSTCODE1",
								"maxFractionDigits" : 0
							}, {
								"editable" : false,
								"parent" : false,
								"minLength" : 0,
								"enrichmentType" : "S",
								"enrichmentLength" : 0,
								"mandatory" : false,
								"displayType" : 0,
								"minValueExist" : false,
								"maxValueExist" : false,
								"validatable" : false,
								"includeInTotal" : "N",
								"sequenceNmbr" : 18,
								"storageSerial" : 0,
								"parentEnrichReq" : false,
								"enrichmentSetName" : "INSTRUCTION CODE",
								"required" : false,
								"description" : "Text",
								"dataType" : 11,
								"maxLength" : 40,
								"code" : "INSTCODE7",
								"maxFractionDigits" : 0
							}, {
								"editable" : false,
								"parent" : false,
								"minLength" : 0,
								"enrichmentType" : "S",
								"enrichmentLength" : 0,
								"mandatory" : false,
								"displayType" : 4,
								"minValueExist" : false,
								"maxValueExist" : false,
								"validatable" : true,
								"includeInTotal" : "N",
								"lookupValues" : [{
									"value" : "PHON - Please advise account with institution by phone",
									"key" : "PHON"
								}, {
									"value" : "TELE - Please advise account with institution by the most efficient means of telecommunication.",
									"key" : "TELE"
								}, {
									"value" : "PHOI - Please advise the intermediary institution by phone",
									"key" : "PHOI"
								}, {
									"value" : "TELI - Please advise the intermediary institution by the most efficient means of telecommunication.",
									"key" : "TELI"
								}, {
									"value" : "SDVA - Payment must be executed with same day value to the beneficiary",
									"key" : "SDVA"
								}, {
									"value" : "INTC - The payment is an intra-company payment, i.e. a payment between two companies belonging to the same group.",
									"key" : "INTC"
								}, {
									"value" : "REPA - Payment has a related e-Payment reference.",
									"key" : "REPA"
								}, {
									"value" : "CORT - This transaction contains a payment that is made in settlement of a trade, e.g., foreign exchange deal, securities transaction",
									"key" : "CORT"
								}, {
									"value" : "BONL - Payment is to be made to the beneficiary customer only",
									"key" : "BONL"
								}, {
									"value" : "HOLD - Beneficiary customer/claimant will call; pay upon identification.",
									"key" : "HOLD"
								}, {
									"value" : "CHQB - Pay beneficiary customer only by check.",
									"key" : "CHQB"
								}, {
									"value" : "PHOB - Please advise/contact beneficiary-claimant by phone",
									"key" : "PHOB"
								}, {
									"value" : "TELB - Please advise/contact beneficiary-claimant the most efficient means of telecommunication.",
									"key" : "TELB"
								}],
								"sequenceNmbr" : 19,
								"storageSerial" : 0,
								"parentEnrichReq" : false,
								"enrichmentSetName" : "INSTRUCTION CODE",
								"required" : false,
								"description" : "Instruction Code 2",
								"dataType" : 11,
								"maxLength" : 80,
								"code" : "INSTCODE2",
								"maxFractionDigits" : 0
							}, {
								"editable" : false,
								"parent" : false,
								"minLength" : 0,
								"enrichmentType" : "S",
								"enrichmentLength" : 0,
								"mandatory" : false,
								"displayType" : 0,
								"minValueExist" : false,
								"maxValueExist" : false,
								"validatable" : false,
								"includeInTotal" : "N",
								"sequenceNmbr" : 20,
								"storageSerial" : 0,
								"parentEnrichReq" : false,
								"enrichmentSetName" : "INSTRUCTION CODE",
								"required" : false,
								"description" : "Text",
								"dataType" : 11,
								"maxLength" : 40,
								"code" : "INSTCODE8",
								"maxFractionDigits" : 0
							}, {
								"editable" : false,
								"parent" : false,
								"minLength" : 0,
								"enrichmentType" : "S",
								"enrichmentLength" : 0,
								"mandatory" : false,
								"displayType" : 4,
								"minValueExist" : false,
								"maxValueExist" : false,
								"validatable" : true,
								"includeInTotal" : "N",
								"lookupValues" : [{
									"value" : "PHON - Please advise account with institution by phone",
									"key" : "PHON"
								}, {
									"value" : "TELE - Please advise account with institution by the most efficient means of telecommunication.",
									"key" : "TELE"
								}, {
									"value" : "PHOI - Please advise the intermediary institution by phone",
									"key" : "PHOI"
								}, {
									"value" : "TELI - Please advise the intermediary institution by the most efficient means of telecommunication.",
									"key" : "TELI"
								}, {
									"value" : "SDVA - Payment must be executed with same day value to the beneficiary",
									"key" : "SDVA"
								}, {
									"value" : "INTC - The payment is an intra-company payment, i.e. a payment between two companies belonging to the same group.",
									"key" : "INTC"
								}, {
									"value" : "REPA - Payment has a related e-Payment reference.",
									"key" : "REPA"
								}, {
									"value" : "CORT - This transaction contains a payment that is made in settlement of a trade, e.g., foreign exchange deal, securities transaction",
									"key" : "CORT"
								}, {
									"value" : "BONL - Payment is to be made to the beneficiary customer only",
									"key" : "BONL"
								}, {
									"value" : "HOLD - Beneficiary customer/claimant will call; pay upon identification.",
									"key" : "HOLD"
								}, {
									"value" : "CHQB - Pay beneficiary customer only by check.",
									"key" : "CHQB"
								}, {
									"value" : "PHOB - Please advise/contact beneficiary-claimant by phone",
									"key" : "PHOB"
								}, {
									"value" : "TELB - Please advise/contact beneficiary-claimant the most efficient means of telecommunication.",
									"key" : "TELB"
								}],
								"sequenceNmbr" : 21,
								"storageSerial" : 0,
								"parentEnrichReq" : false,
								"enrichmentSetName" : "INSTRUCTION CODE",
								"required" : false,
								"description" : "Instruction Code 3",
								"dataType" : 11,
								"maxLength" : 80,
								"code" : "INSTCODE3",
								"maxFractionDigits" : 0
							}, {
								"editable" : false,
								"parent" : false,
								"minLength" : 0,
								"enrichmentType" : "S",
								"enrichmentLength" : 0,
								"mandatory" : false,
								"displayType" : 0,
								"minValueExist" : false,
								"maxValueExist" : false,
								"validatable" : false,
								"includeInTotal" : "N",
								"sequenceNmbr" : 22,
								"storageSerial" : 0,
								"parentEnrichReq" : false,
								"enrichmentSetName" : "INSTRUCTION CODE",
								"required" : false,
								"description" : "Text",
								"dataType" : 11,
								"maxLength" : 40,
								"code" : "INSTCODE9",
								"maxFractionDigits" : 0
							}, {
								"editable" : false,
								"parent" : false,
								"minLength" : 0,
								"enrichmentType" : "S",
								"enrichmentLength" : 0,
								"mandatory" : false,
								"displayType" : 4,
								"minValueExist" : false,
								"maxValueExist" : false,
								"validatable" : true,
								"includeInTotal" : "N",
								"lookupValues" : [{
									"value" : "PHON - Please advise account with institution by phone",
									"key" : "PHON"
								}, {
									"value" : "TELE - Please advise account with institution by the most efficient means of telecommunication.",
									"key" : "TELE"
								}, {
									"value" : "PHOI - Please advise the intermediary institution by phone",
									"key" : "PHOI"
								}, {
									"value" : "TELI - Please advise the intermediary institution by the most efficient means of telecommunication.",
									"key" : "TELI"
								}, {
									"value" : "SDVA - Payment must be executed with same day value to the beneficiary",
									"key" : "SDVA"
								}, {
									"value" : "INTC - The payment is an intra-company payment, i.e. a payment between two companies belonging to the same group.",
									"key" : "INTC"
								}, {
									"value" : "REPA - Payment has a related e-Payment reference.",
									"key" : "REPA"
								}, {
									"value" : "CORT - This transaction contains a payment that is made in settlement of a trade, e.g., foreign exchange deal, securities transaction",
									"key" : "CORT"
								}, {
									"value" : "BONL - Payment is to be made to the beneficiary customer only",
									"key" : "BONL"
								}, {
									"value" : "HOLD - Beneficiary customer/claimant will call; pay upon identification.",
									"key" : "HOLD"
								}, {
									"value" : "CHQB - Pay beneficiary customer only by check.",
									"key" : "CHQB"
								}, {
									"value" : "PHOB - Please advise/contact beneficiary-claimant by phone",
									"key" : "PHOB"
								}, {
									"value" : "TELB - Please advise/contact beneficiary-claimant the most efficient means of telecommunication.",
									"key" : "TELB"
								}],
								"sequenceNmbr" : 23,
								"storageSerial" : 0,
								"parentEnrichReq" : false,
								"enrichmentSetName" : "INSTRUCTION CODE",
								"required" : false,
								"description" : "Instruction Code 4",
								"dataType" : 11,
								"maxLength" : 80,
								"code" : "INSTCODE4",
								"maxFractionDigits" : 0
							}, {
								"editable" : false,
								"parent" : false,
								"minLength" : 0,
								"enrichmentType" : "S",
								"enrichmentLength" : 0,
								"mandatory" : false,
								"displayType" : 0,
								"minValueExist" : false,
								"maxValueExist" : false,
								"validatable" : false,
								"includeInTotal" : "N",
								"sequenceNmbr" : 24,
								"storageSerial" : 0,
								"parentEnrichReq" : false,
								"enrichmentSetName" : "INSTRUCTION CODE",
								"required" : false,
								"description" : "Text",
								"dataType" : 11,
								"maxLength" : 40,
								"code" : "INSTCODE10",
								"maxFractionDigits" : 0
							}, {
								"editable" : false,
								"parent" : false,
								"minLength" : 0,
								"enrichmentType" : "S",
								"enrichmentLength" : 0,
								"mandatory" : false,
								"displayType" : 4,
								"minValueExist" : false,
								"maxValueExist" : false,
								"validatable" : true,
								"includeInTotal" : "N",
								"lookupValues" : [{
									"value" : "PHON - Please advise account with institution by phone",
									"key" : "PHON"
								}, {
									"value" : "TELE - Please advise account with institution by the most efficient means of telecommunication.",
									"key" : "TELE"
								}, {
									"value" : "PHOI - Please advise the intermediary institution by phone",
									"key" : "PHOI"
								}, {
									"value" : "TELI - Please advise the intermediary institution by the most efficient means of telecommunication.",
									"key" : "TELI"
								}, {
									"value" : "SDVA - Payment must be executed with same day value to the beneficiary",
									"key" : "SDVA"
								}, {
									"value" : "INTC - The payment is an intra-company payment, i.e. a payment between two companies belonging to the same group.",
									"key" : "INTC"
								}, {
									"value" : "REPA - Payment has a related e-Payment reference.",
									"key" : "REPA"
								}, {
									"value" : "CORT - This transaction contains a payment that is made in settlement of a trade, e.g., foreign exchange deal, securities transaction",
									"key" : "CORT"
								}, {
									"value" : "BONL - Payment is to be made to the beneficiary customer only",
									"key" : "BONL"
								}, {
									"value" : "HOLD - Beneficiary customer/claimant will call; pay upon identification.",
									"key" : "HOLD"
								}, {
									"value" : "CHQB - Pay beneficiary customer only by check.",
									"key" : "CHQB"
								}, {
									"value" : "PHOB - Please advise/contact beneficiary-claimant by phone",
									"key" : "PHOB"
								}, {
									"value" : "TELB - Please advise/contact beneficiary-claimant the most efficient means of telecommunication.",
									"key" : "TELB"
								}],
								"sequenceNmbr" : 25,
								"storageSerial" : 0,
								"parentEnrichReq" : false,
								"enrichmentSetName" : "INSTRUCTION CODE",
								"required" : false,
								"description" : "Instruction Code 5",
								"dataType" : 11,
								"maxLength" : 80,
								"code" : "INSTCODE5",
								"maxFractionDigits" : 0
							}, {
								"editable" : false,
								"parent" : false,
								"minLength" : 0,
								"enrichmentType" : "S",
								"enrichmentLength" : 0,
								"mandatory" : false,
								"displayType" : 0,
								"minValueExist" : false,
								"maxValueExist" : false,
								"validatable" : false,
								"includeInTotal" : "N",
								"sequenceNmbr" : 26,
								"storageSerial" : 0,
								"parentEnrichReq" : false,
								"enrichmentSetName" : "INSTRUCTION CODE",
								"required" : false,
								"description" : "Text",
								"dataType" : 11,
								"maxLength" : 40,
								"code" : "INSTCODE11",
								"maxFractionDigits" : 0
							}, {
								"editable" : false,
								"parent" : false,
								"minLength" : 0,
								"enrichmentType" : "S",
								"enrichmentLength" : 0,
								"mandatory" : false,
								"displayType" : 4,
								"minValueExist" : false,
								"maxValueExist" : false,
								"validatable" : true,
								"includeInTotal" : "N",
								"lookupValues" : [{
									"value" : "PHON - Please advise account with institution by phone",
									"key" : "PHON"
								}, {
									"value" : "TELE - Please advise account with institution by the most efficient means of telecommunication.",
									"key" : "TELE"
								}, {
									"value" : "PHOI - Please advise the intermediary institution by phone",
									"key" : "PHOI"
								}, {
									"value" : "TELI - Please advise the intermediary institution by the most efficient means of telecommunication.",
									"key" : "TELI"
								}, {
									"value" : "SDVA - Payment must be executed with same day value to the beneficiary",
									"key" : "SDVA"
								}, {
									"value" : "INTC - The payment is an intra-company payment, i.e. a payment between two companies belonging to the same group.",
									"key" : "INTC"
								}, {
									"value" : "REPA - Payment has a related e-Payment reference.",
									"key" : "REPA"
								}, {
									"value" : "CORT - This transaction contains a payment that is made in settlement of a trade, e.g., foreign exchange deal, securities transaction",
									"key" : "CORT"
								}, {
									"value" : "BONL - Payment is to be made to the beneficiary customer only",
									"key" : "BONL"
								}, {
									"value" : "HOLD - Beneficiary customer/claimant will call; pay upon identification.",
									"key" : "HOLD"
								}, {
									"value" : "CHQB - Pay beneficiary customer only by check.",
									"key" : "CHQB"
								}, {
									"value" : "PHOB - Please advise/contact beneficiary-claimant by phone",
									"key" : "PHOB"
								}, {
									"value" : "TELB - Please advise/contact beneficiary-claimant the most efficient means of telecommunication.",
									"key" : "TELB"
								}],
								"sequenceNmbr" : 27,
								"storageSerial" : 0,
								"parentEnrichReq" : false,
								"enrichmentSetName" : "INSTRUCTION CODE",
								"required" : false,
								"description" : "Instruction Code 6",
								"dataType" : 11,
								"maxLength" : 80,
								"code" : "INSTCODE6",
								"maxFractionDigits" : 0
							}, {
								"editable" : false,
								"parent" : false,
								"minLength" : 0,
								"enrichmentType" : "S",
								"enrichmentLength" : 0,
								"mandatory" : false,
								"displayType" : 0,
								"minValueExist" : false,
								"maxValueExist" : false,
								"validatable" : false,
								"includeInTotal" : "N",
								"sequenceNmbr" : 28,
								"storageSerial" : 0,
								"parentEnrichReq" : false,
								"enrichmentSetName" : "INSTRUCTION CODE",
								"required" : false,
								"description" : "Text",
								"dataType" : 11,
								"maxLength" : 40,
								"code" : "INSTCODE12",
								"maxFractionDigits" : 0
							}],
					"labels" : ["Additional Info 1", "Additional Info 2",
							"Additional Info 3", "Additional Info 4",
							"Bank to Bank Information1", "Text",
							"Bank to Bank Information2", "Text",
							"Bank to Bank Information3", "Text",
							"Bank to Bank Information4", "Text",
							"Bank to Bank Information5", "Text",
							"Bank to Bank Information6", "Text",
							"Instruction Code 1", "Text", "Instruction Code 2",
							"Text", "Instruction Code 3", "Text",
							"Instruction Code 4", "Text", "Instruction Code 5",
							"Text", "Instruction Code 6", "Text"],
					"bankProduct" : "FEDWIRE",
					"profileId" : "BTOBINFO",
					"dirtyRowFlag" : "N",
					"version" : 1
				}
			},
			"beneficiary" : {
				"adhocBene" : [{
							"readOnly" : "false",
							"fieldName" : "beneTeleNmbr",
							"label" : "Telephone Number",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "corrBankIDType",
							"label" : "Bank Id Type",
							"dataType" : "select",
							"availableValues" : [{
										"description" : "BIC",
										"code" : "BIC"
									}, {
										"description" : "CHIPS UID",
										"code" : "CHIPS"
									}, {
										"description" : "FED ABA",
										"code" : "FED"
									}, {
										"description" : "NCC",
										"code" : "NCC"
									}, {
										"description" : "SORT CODE",
										"code" : "SORT"
									}],
							"displayMode" : "2",
							"seekId" : "BeneficiaryBankIDType"
						}, {
							"readOnly" : "false",
							"fieldName" : "companyName",
							"label" : "Company name",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "beneficiaryCountry",
							"label" : "Country",
							"dataType" : "seek",
							"displayMode" : "2",
							"seekId" : "country"
						}, {
							"readOnly" : "false",
							"fieldName" : "corrBankDetails4",
							"label" : "Nostro Account",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "corrBankDetails2",
							"label" : "Address",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "beneficiaryBankIDType",
							"label" : "Bank Id Type",
							"dataType" : "select",
							"availableValues" : [{
										"description" : "BIC",
										"code" : "BIC"
									}, {
										"description" : "CHIPS UID",
										"code" : "CHIPS"
									}, {
										"description" : "FED ABA",
										"code" : "FED"
									}, {
										"description" : "NCC",
										"code" : "NCC"
									}, {
										"description" : "SORT CODE",
										"code" : "SORT"
									}],
							"displayMode" : "2",
							"seekId" : "BeneficiaryBankIDType"
						}, {
							"readOnly" : "false",
							"fieldName" : "drawerFax",
							"label" : "Fax No",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "ivrCode",
							"label" : "IVR Code",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "corrBankNostroAcc",
							"label" : "Country Code",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "beneAccountType",
							"label" : "Type",
							"dataType" : "select",
							"availableValues" : [{
										"description" : "Checking Account",
										"code" : "1"
									}, {
										"description" : "General Ledger Account",
										"code" : "2"
									}, {
										"description" : "Loan Account",
										"code" : "3"
									}, {
										"description" : "Savings Account",
										"code" : "4"
									}],
							"displayMode" : "2",
							"seekId" : "accountType"
						}, {
							"readOnly" : "false",
							"fieldName" : "swift59aline1",
							"label" : "Line 1",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "drawerCode",
							"label" : "Receiver ID",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "swift59aline4",
							"label" : "Line 4",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "swift59aline2",
							"label" : "Line 2",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "swift59aline3",
							"label" : "Line 3",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "intBankNostroAcc",
							"label" : "Nostro Account",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "drawerAddress",
							"label" : "Address",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "beneficiaryCity",
							"label" : "City",
							"dataType" : "seek",
							"displayMode" : "2",
							"seekId" : "state"
						}, {
							"readOnly" : "false",
							"fieldName" : "drawerDesc",
							"label" : "Receiver Name",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "beneResidentFlag",
							"label" : "Resident FLag",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "drawerBankCode",
							"label" : "Receiver Bank",
							"dataType" : "text",
							"displayMode" : "3"
						}, {
							"readOnly" : "false",
							"fieldName" : "drawerAccountNo",
							"label" : "Account",
							"dataType" : "text",
							"displayMode" : "3"
						}, {
							"readOnly" : "false",
							"fieldName" : "receiverBankBankIDType",
							"label" : "Bank Id Type",
							"dataType" : "select",
							"availableValues" : [{
										"description" : "BIC",
										"code" : "BIC"
									}, {
										"description" : "CHIPS UID",
										"code" : "CHIPS"
									}, {
										"description" : "FED ABA",
										"code" : "FED"
									}, {
										"description" : "NCC",
										"code" : "NCC"
									}, {
										"description" : "SORT CODE",
										"code" : "SORT"
									}],
							"displayMode" : "2",
							"seekId" : "BeneficiaryBankIDType"
						}, {
							"readOnly" : "false",
							"fieldName" : "beneficiaryState",
							"label" : "State",
							"dataType" : "seek",
							"displayMode" : "2",
							"seekId" : "state"
						}, {
							"readOnly" : "false",
							"fieldName" : "drawerZipCode",
							"label" : "Zip Code",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "drawerDescription",
							"label" : "Receiver Name",
							"dataType" : "text",
							"displayMode" : "3"
						}, {
							"readOnly" : "false",
							"fieldName" : "drawerBranchCode",
							"label" : "Receiver Branch",
							"dataType" : "text",
							"displayMode" : "3"
						}, {
							"readOnly" : "false",
							"fieldName" : "saveBeneFlag",
							"label" : "Save Receiver in Directory ",
							"dataType" : "checkBox",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "beneficiaryBankIDCode",
							"label" : "Bank Id #",
							"dataType" : "seek",
							"displayMode" : "2",
							"seekId" : "BeneficiaryBankCode"
						}, {
							"readOnly" : "false",
							"fieldName" : "beneficiaryIDType",
							"label" : "Receiver ID Type",
							"dataType" : "select",
							"availableValues" : [{
										"description" : "CHIPS ABA",
										"code" : "CHIPS ABA"
									}, {
										"description" : "CHIPS UID",
										"code" : "CHIPS UID"
									}, {
										"description" : "FED ABA",
										"code" : "FED ABA"
									}, {
										"description" : "Sort Code",
										"code" : "Sort Code"
									}],
							"displayMode" : "2",
							"seekId" : "BenificiaryIdType"
						}, {
							"readOnly" : "false",
							"fieldName" : "intBankDetails1",
							"label" : "Bank Name",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "intBankDetails2",
							"label" : "Address",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "intBankIDType",
							"label" : "Bank Id Type",
							"dataType" : "select",
							"availableValues" : [{
										"description" : "BIC",
										"code" : "BIC"
									}, {
										"description" : "CHIPS UID",
										"code" : "CHIPS"
									}, {
										"description" : "FED ABA",
										"code" : "FED"
									}, {
										"description" : "NCC",
										"code" : "NCC"
									}, {
										"description" : "SORT CODE",
										"code" : "SORT"
									}],
							"displayMode" : "2",
							"seekId" : "BeneficiaryBankIDType"
						}, {
							"readOnly" : "false",
							"fieldName" : "intBankDetails3",
							"label" : "Branch Name",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "intBankDetails4",
							"label" : "Country Code",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "corrBankIDCode",
							"label" : "Bank Id #",
							"dataType" : "seek",
							"displayMode" : "2",
							"seekId" : "BeneficiaryBankCode"
						}, {
							"readOnly" : "false",
							"fieldName" : "swift57aline4",
							"label" : "Line 4",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "swift57aline1",
							"label" : "Line 1",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "drawerCellNo",
							"label" : "Mobile No",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "swift57aline3",
							"label" : "Line 3",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "swift57aline2",
							"label" : "Line 2",
							"dataType" : "text",
							"displayMode" : "2"
						}],
				"registeredBene" : [{
							"readOnly" : "false",
							"fieldName" : "beneTeleNmbr",
							"label" : "Telephone Number",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "corrBankIDType",
							"label" : "Bank Id Type",
							"dataType" : "select",
							"availableValues" : [{
										"description" : "BIC",
										"code" : "BIC"
									}, {
										"description" : "CHIPS UID",
										"code" : "CHIPS"
									}, {
										"description" : "FED ABA",
										"code" : "FED"
									}, {
										"description" : "NCC",
										"code" : "NCC"
									}, {
										"description" : "SORT CODE",
										"code" : "SORT"
									}],
							"displayMode" : "2",
							"seekId" : "BeneficiaryBankIDType"
						}, {
							"readOnly" : "false",
							"fieldName" : "companyName",
							"label" : "Company name",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "beneficiaryCountry",
							"label" : "Country",
							"dataType" : "seek",
							"displayMode" : "2",
							"seekId" : "country"
						}, {
							"readOnly" : "false",
							"fieldName" : "corrBankDetails4",
							"label" : "Nostro Account",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "corrBankDetails2",
							"label" : "Address",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "beneficiaryBankIDType",
							"label" : "Bank Id Type",
							"dataType" : "select",
							"availableValues" : [{
										"description" : "BIC",
										"code" : "BIC"
									}, {
										"description" : "CHIPS UID",
										"code" : "CHIPS"
									}, {
										"description" : "FED ABA",
										"code" : "FED"
									}, {
										"description" : "NCC",
										"code" : "NCC"
									}, {
										"description" : "SORT CODE",
										"code" : "SORT"
									}],
							"displayMode" : "2",
							"seekId" : "BeneficiaryBankIDType"
						}, {
							"readOnly" : "false",
							"fieldName" : "drawerFax",
							"label" : "Fax No",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "ivrCode",
							"label" : "IVR Code",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "corrBankNostroAcc",
							"label" : "Country Code",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "beneAccountType",
							"label" : "Type",
							"dataType" : "select",
							"availableValues" : [{
										"description" : "Checking Account",
										"code" : "1"
									}, {
										"description" : "General Ledger Account",
										"code" : "2"
									}, {
										"description" : "Loan Account",
										"code" : "3"
									}, {
										"description" : "Savings Account",
										"code" : "4"
									}],
							"displayMode" : "2",
							"seekId" : "accountType"
						}, {
							"readOnly" : "false",
							"fieldName" : "drawerCode",
							"label" : "Receiver ID",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "intBankNostroAcc",
							"label" : "Nostro Account",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "drawerAddress",
							"label" : "Address",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "beneficiaryCity",
							"label" : "City",
							"dataType" : "seek",
							"displayMode" : "2",
							"seekId" : "state"
						}, {
							"readOnly" : "false",
							"fieldName" : "drawerDesc",
							"label" : "Receiver Name",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "beneResidentFlag",
							"label" : "Resident FLag",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "drawerBankCode",
							"label" : "Receiver Bank",
							"dataType" : "text",
							"displayMode" : "3"
						}, {
							"readOnly" : "false",
							"fieldName" : "drawerAccountNo",
							"label" : "Account",
							"dataType" : "text",
							"displayMode" : "3"
						}, {
							"readOnly" : "false",
							"fieldName" : "receiverBankBankIDType",
							"label" : "Bank Id Type",
							"dataType" : "select",
							"availableValues" : [{
										"description" : "BIC",
										"code" : "BIC"
									}, {
										"description" : "CHIPS UID",
										"code" : "CHIPS"
									}, {
										"description" : "FED ABA",
										"code" : "FED"
									}, {
										"description" : "NCC",
										"code" : "NCC"
									}, {
										"description" : "SORT CODE",
										"code" : "SORT"
									}],
							"displayMode" : "2",
							"seekId" : "BeneficiaryBankIDType"
						}, {
							"readOnly" : "false",
							"fieldName" : "beneficiaryState",
							"label" : "State",
							"dataType" : "seek",
							"displayMode" : "2",
							"seekId" : "state"
						}, {
							"readOnly" : "false",
							"fieldName" : "drawerZipCode",
							"label" : "Zip Code",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "drawerDescription",
							"label" : "Receiver Name",
							"dataType" : "text",
							"displayMode" : "3"
						}, {
							"readOnly" : "false",
							"fieldName" : "drawerBranchCode",
							"label" : "Receiver Branch",
							"dataType" : "text",
							"displayMode" : "3"
						}, {
							"readOnly" : "false",
							"fieldName" : "beneficiaryBankIDCode",
							"label" : "Bank Id #",
							"dataType" : "seek",
							"displayMode" : "2",
							"seekId" : "BeneficiaryBankCode"
						}, {
							"readOnly" : "false",
							"fieldName" : "beneficiaryIDType",
							"label" : "Receiver ID Type",
							"dataType" : "select",
							"availableValues" : [{
										"description" : "CHIPS ABA",
										"code" : "CHIPS ABA"
									}, {
										"description" : "CHIPS UID",
										"code" : "CHIPS UID"
									}, {
										"description" : "FED ABA",
										"code" : "FED ABA"
									}, {
										"description" : "Sort Code",
										"code" : "Sort Code"
									}],
							"displayMode" : "2",
							"seekId" : "BenificiaryIdType"
						}, {
							"readOnly" : "false",
							"fieldName" : "intBankDetails1",
							"label" : "Bank Name",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "intBankDetails2",
							"label" : "Address",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "intBankIDType",
							"label" : "Bank Id Type",
							"dataType" : "select",
							"availableValues" : [{
										"description" : "BIC",
										"code" : "BIC"
									}, {
										"description" : "CHIPS UID",
										"code" : "CHIPS"
									}, {
										"description" : "FED ABA",
										"code" : "FED"
									}, {
										"description" : "NCC",
										"code" : "NCC"
									}, {
										"description" : "SORT CODE",
										"code" : "SORT"
									}],
							"displayMode" : "2",
							"seekId" : "BeneficiaryBankIDType"
						}, {
							"readOnly" : "false",
							"fieldName" : "intBankDetails3",
							"label" : "Branch Name",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "intBankDetails4",
							"label" : "Country Code",
							"dataType" : "text",
							"displayMode" : "2"
						}, {
							"readOnly" : "false",
							"fieldName" : "corrBankIDCode",
							"label" : "Bank Id #",
							"dataType" : "seek",
							"displayMode" : "2",
							"seekId" : "BeneficiaryBankCode"
						}, {
							"readOnly" : "false",
							"fieldName" : "drawerCellNo",
							"label" : "Mobile No",
							"dataType" : "text",
							"displayMode" : "2"
						}]
			},
			"additionalInfo" : {
				"orderingParty" : {
					"adhocOrderingParty" : [{
								"readOnly" : "false",
								"fieldName" : "line4",
								"label" : "Line4",
								"dataType" : "text",
								"displayMode" : "2"
							}, {
								"readOnly" : "false",
								"fieldName" : "ivrCode",
								"label" : "IVR Code",
								"dataType" : "text",
								"displayMode" : "2"
							}, {
								"readOnly" : "false",
								"fieldName" : "telNmbr",
								"label" : "Tel Number",
								"dataType" : "text",
								"displayMode" : "2"
							}, {
								"readOnly" : "false",
								"fieldName" : "benCity",
								"label" : "City",
								"dataType" : "seek",
								"displayMode" : "2",
								"seekId" : "city"
							}, {
								"readOnly" : "false",
								"fieldName" : "saveOrderingParty",
								"label" : "Save Adhoc Ordering Party",
								"dataType" : "checkBox",
								"displayMode" : "2"
							}, {
								"readOnly" : "false",
								"fieldName" : "line1",
								"label" : "Line1",
								"dataType" : "text",
								"displayMode" : "2"
							}, {
								"readOnly" : "false",
								"fieldName" : "line3",
								"label" : "Line3",
								"dataType" : "text",
								"displayMode" : "2"
							}, {
								"readOnly" : "false",
								"fieldName" : "line2",
								"label" : "Line2",
								"dataType" : "text",
								"displayMode" : "2"
							}, {
								"readOnly" : "false",
								"fieldName" : "documentType",
								"label" : "Document Type",
								"dataType" : "text",
								"displayMode" : "2"
							}, {
								"readOnly" : "false",
								"fieldName" : "orderingPartyDescription",
								"label" : "Ordering Party Description",
								"dataType" : "text",
								"displayMode" : "2"
							}, {
								"readOnly" : "false",
								"fieldName" : "emailIdNmbr",
								"label" : "Email",
								"dataType" : "text",
								"displayMode" : "2"
							}, {
								"readOnly" : "false",
								"fieldName" : "benPostCode",
								"label" : "Postal Code",
								"dataType" : "text",
								"displayMode" : "2"
							}, {
								"readOnly" : "false",
								"fieldName" : "mobileNmbr",
								"label" : "Mobile",
								"dataType" : "text",
								"displayMode" : "2"
							}, {
								"readOnly" : "false",
								"fieldName" : "faxNmbr",
								"label" : "Fax Number",
								"dataType" : "text",
								"displayMode" : "2"
							}, {
								"readOnly" : "false",
								"fieldName" : "benState",
								"label" : "State",
								"dataType" : "seek",
								"displayMode" : "2",
								"seekId" : "state"
							}, {
								"readOnly" : "false",
								"fieldName" : "addr1",
								"label" : "Address",
								"dataType" : "text",
								"displayMode" : "2"
							}, {
								"readOnly" : "false",
								"fieldName" : "benCountry",
								"label" : "Country",
								"dataType" : "seek",
								"displayMode" : "2",
								"seekId" : "country"
							}, {
								"readOnly" : "false",
								"fieldName" : "orderingParty",
								"label" : "Ordering Party",
								"dataType" : "seek",
								"displayMode" : "2",
								"seekId" : "orderingparty"
							}, {
								"readOnly" : "false",
								"fieldName" : "documentId",
								"label" : "Document",
								"dataType" : "text",
								"displayMode" : "2"
							}],
					"registeredOrderingParty" : [{
								"readOnly" : "false",
								"fieldName" : "orderingPartyDescription",
								"label" : "Ordering Party Description",
								"dataType" : "text",
								"displayMode" : "2"
							}, {
								"readOnly" : "false",
								"fieldName" : "orderingParty",
								"label" : "Ordering Party",
								"dataType" : "seek",
								"displayMode" : "2",
								"seekId" : "orderingparty"
							}]
				}
			},
			"paymentHeaderInfo" : {
				"authLevel" : "B",
				"applicationDate" : 1416508200000,
				"instrumentType" : [{
							"instTypeCode" : "03",
							"instTypeDescription" : "SWIFT",
							"instTypeCount" : "0",
							"instTypeText" : "SWIFT Transfer"
						}, {
							"instTypeCode" : "06",
							"instTypeDescription" : "WIRE",
							"instTypeCount" : "0",
							"instTypeText" : "WIRE"
						}, {
							"instTypeCode" : "34",
							"instTypeDescription" : "ACCOUNTTRF",
							"instTypeCount" : "0",
							"instTypeText" : "Account Transfer"
						}, {
							"instTypeCode" : "03",
							"instTypeDescription" : "INTPAY",
							"instTypeCount" : "0",
							"instTypeText" : "International Payments"
						}, {
							"instTypeCode" : "10",
							"instTypeDescription" : "MIXED",
							"instTypeCount" : "0",
							"instTypeText" : "Mixed"
						}, {
							"instTypeCode" : "62",
							"instTypeDescription" : "ACH",
							"instTypeCount" : "0",
							"instTypeText" : "ACH"
						}, {
							"instTypeCode" : "04",
							"instTypeDescription" : "BOOK",
							"instTypeCount" : "0",
							"instTypeText" : "Book Transfer"
						}, {
							"instTypeCode" : "01",
							"instTypeDescription" : "CHECKS",
							"instTypeCount" : "0",
							"instTypeText" : "Physical Product-CK"
						}, {
							"instTypeCode" : "01",
							"instTypeDescription" : "POSITIVEPAY",
							"instTypeCount" : "0",
							"instTypeText" : "Positive Pay"
						}],
				"pirMode" : "LP",
				"offsetDateExceedCount" : 0,
				"instCutoffExceedCount" : 0,
				"hdrEnteredAmount" : "0",
				"hdrActionsMask" : "00000000",
				"hdrMyProduct" : "14101600NX",
				"hdrEnteredNo" : "0",
				"hdrProductCategory" : "WIRE",
				"hdrCurrency" : "USD",
				"hdrPrenote" : 0,
				"hdrHoldZeroDollar" : 0,
				"hdrImportFileName" : "",
				"hdrCutOffTime" : "00:01:00",
				"hdrProcessDate" : "11/21/2014",
				"hdrTemplateMaxUsage" : 0,
				"hdrTemplateNoOfExec" : 0,
				"hdrMyProductDescription" : "Local Wires",
				"singleOrBatch" : "Q",
				"fxLevel" : "B",
				"templateStartDateHdr" : "11/21/2014",
				"hdrOffsetDays" : 0,
				"fileUploadProgressFlag" : 0,
				"hdrPendingMyAuth" : 0,
				"hdrPendingSend" : 0,
				"hdrPendingRelease" : 0,
				"hdrSentToBank" : 0,
				"hdrPendingVerify" : 0,
				"hdrRepairInst" : 0,
				"hdrDraftInst" : 0,
				"hdrDebitCount" : 0,
				"hdrCreditCount" : 0,
				"hdrPendingAuth" : 0,
				"hdrRejectedInst" : 0,
				"hdrOnHold" : 0
			},
			"standardField" : [{
						"value" : "C",
						"readOnly" : "false",
						"fieldName" : "drCrFlag",
						"label" : "Debit Credit Flag",
						"dataType" : "radio",
						"availableValues" : [{
									"description" : "D",
									"code" : "D"
								}, {
									"description" : "C",
									"code" : "C"
								}],
						"displayMode" : "2"
					}, {
						"readOnly" : "false",
						"fieldName" : "siNextExecutionDate",
						"label" : "Next Date",
						"dataType" : "date",
						"displayMode" : "2"
					}, {
						"readOnly" : "false",
						"fieldName" : "amount",
						"label" : "Amount",
						"dataType" : "amount",
						"availableValues" : [{
									"description" : "US Dollar",
									"code" : "USD"
								}],
						"txnCurrency" : "USD",
						"displayMode" : "3"
					}, {
						"value" : "FEDWIRE",
						"readOnly" : "false",
						"fieldName" : "bankProduct",
						"label" : "Payment Product",
						"dataType" : "select",
						"availableValues" : [{
									"description" : "FEDWIRE (USD)",
									"code" : "FEDWIRE"
								}],
						"displayMode" : "2"
					}, {
						"value" : 0,
						"readOnly" : "false",
						"fieldName" : "siExecutionDate",
						"label" : "Type Of Execution",
						"dataType" : "select",
						"availableValues" : [{
									"description" : "SI Execution Date",
									"code" : "0"
								}, {
									"description" : "Effective Date",
									"code" : "1"
								}],
						"displayMode" : "2"
					}, {
						"value" : 0,
						"readOnly" : "false",
						"fieldName" : "charges",
						"label" : "Charge Type",
						"dataType" : "select",
						"availableValues" : [{
									"description" : "Our",
									"code" : "0"
								}, {
									"description" : "Receiver",
									"code" : "1"
								}],
						"displayMode" : "3"
					}, {
						"readOnly" : "false",
						"fieldName" : "accountNo",
						"label" : "Sending Account",
						"dataType" : "select",
						"availableValues" : [{
									"description" : "DDA - 6580000450 (USD)",
									"code" : "6580000450"
								}, {
									"description" : "DDA - 6580000451 (USD)",
									"code" : "6580000451"
								}, {
									"description" : "CAD Accoun - 5679987988998 (CAD)",
									"code" : "5679987988998"
								}, {
									"description" : "GBP Accoun - 886787667679 (GBP)",
									"code" : "886787667679"
								}, {
									"description" : "Euro Accou - 129898090 (EUR)",
									"code" : "129898090"
								}, {
									"description" : "DDA Accoun - 785000230 (USD)",
									"code" : "785000230"
								}],
						"displayMode" : "3"
					}, {
						"readOnly" : "false",
						"fieldName" : "period",
						"label" : "Period",
						"dataType" : "select",
						"displayMode" : "3"
					}, {
						"readOnly" : "false",
						"fieldName" : "drawerAccountNo",
						"label" : "Credit/Debit Account",
						"dataType" : "seek",
						"displayMode" : "3",
						"seekId" : "clientAccountSeek"
					}, {
						"readOnly" : "false",
						"fieldName" : "siTerminationDate",
						"label" : "End Date",
						"dataType" : "date",
						"displayMode" : "3"
					}, {
						"readOnly" : "false",
						"fieldName" : "coAuthPersonIC",
						"label" : "Approve Person Id :",
						"dataType" : "text",
						"displayMode" : "2"
					}, {
						"value" : "11/21/2014",
						"readOnly" : "false",
						"fieldName" : "txnDate",
						"label" : "Processing Date",
						"dataType" : "date",
						"displayMode" : "3"
					}, {
						"readOnly" : "false",
						"fieldName" : "refDay",
						"label" : "Reference Day",
						"dataType" : "select",
						"displayMode" : "2"
					}, {
						"readOnly" : "false",
						"fieldName" : "confidentialFlag",
						"label" : "Confidential",
						"dataType" : "checkBox",
						"displayMode" : "2"
					}, {
						"readOnly" : "false",
						"fieldName" : "drawerCode",
						"label" : "Receiver ID",
						"dataType" : "text",
						"displayMode" : "2"
					}, {
						"readOnly" : "false",
						"fieldName" : "coAuthPersonName",
						"label" : "Approve Person Name :",
						"dataType" : "text",
						"displayMode" : "2"
					}, {
						"readOnly" : "false",
						"fieldName" : "siFrequencyCode",
						"label" : "Frequency",
						"dataType" : "select",
						"availableValues" : [{
									"description" : "Daily",
									"code" : "DAILY"
								}, {
									"description" : "Weekly",
									"code" : "WEEKLY"
								}, {
									"description" : "Monthly",
									"code" : "MONTHLY"
								}],
						"displayMode" : "3"
					}, {
						"readOnly" : "false",
						"fieldName" : "valueDate",
						"label" : "Value Date",
						"dataType" : "date",
						"displayMode" : "2"
					}, {
						"value" : "11/22/2014",
						"readOnly" : "false",
						"fieldName" : "siEffectiveDate",
						"label" : "Start Date",
						"dataType" : "date",
						"displayMode" : "3"
					}, {
						"value" : "R",
						"readOnly" : "false",
						"fieldName" : "drawerRegisteredFlag",
						"label" : "Registered Receiver",
						"dataType" : "checkBox",
						"displayMode" : "2"
					}, {
						"readOnly" : "false",
						"fieldName" : "paymentSaveWithSI",
						"label" : "Save as SI",
						"dataType" : "checkBox",
						"displayMode" : "2"
					}, {
						"value" : 0,
						"readOnly" : "false",
						"fieldName" : "holidayAction",
						"label" : "Holiday Action",
						"dataType" : "select",
						"availableValues" : [{
									"description" : "Next Business Day ",
									"code" : "0"
								}, {
									"description" : "Prev Business Day",
									"code" : "1"
								}, {
									"description" : "Skip",
									"code" : "2"
								}],
						"displayMode" : "2"
					}, {
						"readOnly" : "false",
						"fieldName" : "referenceNo",
						"label" : "Reference",
						"dataType" : "text",
						"displayMode" : "2"
					}, {
						"value" : "0",
						"readOnly" : "false",
						"fieldName" : "rateType",
						"label" : "Rate Type",
						"dataType" : "radio",
						"availableValues" : [{
									"description" : "Counter Rate",
									"code" : "0"
								}, {
									"description" : "Contract Rate",
									"code" : "1"
								}],
						"displayMode" : "1"
					}, {
						"readOnly" : "false",
						"fieldName" : "contractRefNo",
						"label" : "Contract Ref No",
						"dataType" : "text",
						"displayMode" : "1"
					}],
			"paymentCompanyInfo" : {
				"company" : "Ford Motors US",
				"companyAddress" : "NYC, NYC, USNJ, US, 1234325"
			},
			"paymentFIInfo" : {
				"client" : "Ford Motors US",
				"corporation" : "Ford Motors US",
				"fi" : "USCASH"
			},
			"paymentGridColomn" : "drawerCode,amount,charges,referenceNo"
		},
		"__metadata" : {
			"_applDate" : "11/21/2014",
			"_dateFormat" : "MM/dd/yyyy",
			"_jqueryDateFormat" : "mm/dd/yy",
			"_extDateFormat" : "m/d/Y",
			"_myproduct" : "14101600NX",
			"_userLocale" : "en_US",
			"_cutoffTime" : "00:01:00",
			"_productCategory" : "WIRE",
			"_myproductDescription" : "Local Wires",
			"_buttonMask" : "000000000",
			"_pirMode" : "LP",
			"_gridEntryEnabled" : "N",
			"_systemBeneFlag" : "N",
			"type" : "GCP.PaymentEntry"
		}
	}
};
var dummyHeaderJson = {
	"d" : {
		"paymentEntry" : {
			"paymentHeaderInfo" : {
				"authLevel" : "B",
				"applicationDate" : 1413311400000,
				"instrumentType" : [{
							"instTypeCode" : "06",
							"instTypeDescription" : "WIRE",
							"instTypeCount" : "0",
							"instTypeText" : "WIRE"
						}, {
							"instTypeCode" : "03",
							"instTypeDescription" : "SWIFT",
							"instTypeCount" : "0",
							"instTypeText" : "SWIFT Transfer"
						}, {
							"instTypeCode" : "34",
							"instTypeDescription" : "ACCOUNTTRF",
							"instTypeCount" : "0",
							"instTypeText" : "Account Transfer"
						}, {
							"instTypeCode" : "03",
							"instTypeDescription" : "INTPAY",
							"instTypeCount" : "0",
							"instTypeText" : "International Payments"
						}, {
							"instTypeCode" : "10",
							"instTypeDescription" : "MIXED",
							"instTypeCount" : "0",
							"instTypeText" : "Mixed"
						}, {
							"instTypeCode" : "62",
							"instTypeDescription" : "ACH",
							"instTypeCount" : "0",
							"instTypeText" : "ACH"
						}, {
							"instTypeCode" : "04",
							"instTypeDescription" : "BOOK",
							"instTypeCount" : "0",
							"instTypeText" : "Book Transfer"
						}, {
							"instTypeCode" : "01",
							"instTypeDescription" : "POSITIVEPAY",
							"instTypeCount" : "0",
							"instTypeText" : "Positive Pay"
						}, {
							"instTypeCode" : "01",
							"instTypeDescription" : "CHECKS",
							"instTypeCount" : "0",
							"instTypeText" : "Physical Product-CK"
						}],
				"pirMode" : "TP",
				"totalAmount" : "0",
				"offsetDateExceedCount" : 0,
				"instCutoffExceedCount" : 0,
				"hdrEnteredAmount" : "0",
				"hdrActionsMask" : "00000000",
				"hdrMyProduct" : "PPDPLUS",
				"hdrBankProduct" : "PPDPLUS",
				"hdrDrCrFlag" : "C",
				"hdrEnteredNo" : "0",
				"hdrProductCategory" : "ACH",
				"hdrCurrency" : "USD",
				"hdrPrenote" : 0,
				"hdrHoldZeroDollar" : 0,
				"hdrImportFileName" : "",
				"hdrCutOffTime" : "23:59:59",
				"hdrCreateDate" : "10/15/2014",
				"hdrProcessDate" : "10/15/2014",
				"hdrTemplateMaxUsage" : 0,
				"hdrTemplateNoOfExec" : 0,
				"hdrMyProductDescription" : "PPDPLUS",
				"singleOrBatch" : "B",
				"fxLevel" : "B",
				"templateStartDateHdr" : "11/24/2014",
				"hdrOffsetDays" : 0,
				"fileUploadProgressFlag" : 0,
				"hdrPendingMyAuth" : 0,
				"hdrPendingSend" : 0,
				"hdrPendingRelease" : 0,
				"hdrSentToBank" : 0,
				"hdrPendingVerify" : 0,
				"hdrRepairInst" : 0,
				"hdrDraftInst" : 0,
				"hdrDebitCount" : 0,
				"hdrCreditCount" : 0,
				"hdrPendingAuth" : 0,
				"hdrRejectedInst" : 0,
				"hdrOnHold" : 0
			},
			"standardField" : [{
						"value" : "C",
						"readOnly" : "false",
						"fieldName" : "drCrFlag",
						"dataType" : "radio",
						"availableValues" : [{
									"description" : "D",
									"code" : "D"
								}, {
									"description" : "C",
									"code" : "C"
								}],
						"label" : "Debit Credit Flag",
						"displayMode" : "2"
					}, {
						"readOnly" : "false",
						"fieldName" : "controlTotal",
						"dataType" : "checkBox",
						"label" : "Control Total",
						"displayMode" : "2"
					}, {
						"value" : 0,
						"readOnly" : "false",
						"fieldName" : "templateWarningDays",
						"dataType" : "text",
						"label" : "Warning Days",
						"displayMode" : "2"
					}, {
						"value" : "10/15/2014",
						"readOnly" : "false",
						"fieldName" : "txnDate",
						"dataType" : "date",
						"label" : "Activation Date",
						"displayMode" : "3"
					}, {
						"value" : 0,
						"readOnly" : "false",
						"fieldName" : "amount",
						"dataType" : "amount",
						"availableValues" : [{
									"description" : "US Dollar",
									"code" : "USD"
								}],
						"label" : "Amount",
						"displayMode" : "2"
					}, {
						"readOnly" : "false",
						"fieldName" : "holdUntil",
						"dataType" : "date",
						"label" : "Hold Until Date",
						"displayMode" : "2"
					}, {
						"value" : "1",
						"readOnly" : "false",
						"fieldName" : "templateType",
						"dataType" : "radio",
						"availableValues" : [{
									"description" : "Non-Rep",
									"code" : "1"
								}],
						"label" : "Template Type",
						"displayMode" : "2"
					}, {
						"readOnly" : "false",
						"fieldName" : "templateEndDate",
						"dataType" : "date",
						"label" : "Template End Date",
						"displayMode" : "2"
					}, {
						"value" : "PPDPLUS",
						"readOnly" : "false",
						"fieldName" : "bankProduct",
						"dataType" : "select",
						"availableValues" : [{
									"description" : "PPD Plus Entry (USD)",
									"code" : "PPDPLUS"
								}],
						"label" : "Bank Product",
						"displayMode" : "2"
					}, {
						"readOnly" : "false",
						"fieldName" : "totalNo",
						"dataType" : "text",
						"label" : "Count",
						"displayMode" : "2"
					}, {
						"value" : 0,
						"readOnly" : "false",
						"fieldName" : "enteredNo",
						"dataType" : "text",
						"label" : "Entered Instrument",
						"displayMode" : "2"
					}, {
						"value" : "11/24/2014",
						"readOnly" : "false",
						"fieldName" : "templateStartDate",
						"dataType" : "date",
						"label" : "Template Start Date",
						"displayMode" : "2"
					}, {
						"readOnly" : "false",
						"fieldName" : "discretionaryData",
						"dataType" : "text",
						"label" : "Discritionary Data",
						"displayMode" : "2"
					}, {
						"value" : "N",
						"readOnly" : "false",
						"fieldName" : "prenote",
						"dataType" : "checkBox",
						"label" : "Prenote",
						"displayMode" : "2"
					}, {
						"value" : 0,
						"readOnly" : "false",
						"fieldName" : "templateMaxUsage",
						"dataType" : "text",
						"label" : "Max No of Usage",
						"displayMode" : "2"
					}, {
						"readOnly" : "true",
						"fieldName" : "accountNo",
						"dataType" : "select",
						"availableValues" : [{
									"description" : "DDA - 6580000450 (USD)",
									"code" : "6580000450"
								}, {
									"description" : "DDA - 6580000451 (USD)",
									"code" : "6580000451"
								}, {
									"description" : "DDA Accoun - 785000230 (USD)",
									"code" : "785000230"
								}],
						"label" : "Sending Account",
						"displayMode" : "3"
					}, {
						"readOnly" : "false",
						"fieldName" : "prenoteUntil",
						"dataType" : "date",
						"label" : "Prenote Until",
						"displayMode" : "2"
					}, {
						"value" : 0,
						"readOnly" : "false",
						"fieldName" : "templateNoOfExec",
						"dataType" : "text",
						"label" : "No of execution",
						"displayMode" : "2"
					}, {
						"value" : "00000000000000000000",
						"readOnly" : "false",
						"fieldName" : "lockFieldsMask",
						"dataType" : "mask",
						"availableValues" : [{
									"description" : "Company ID",
									"seq" : "1",
									"code" : "companyId"
								}, {
									"description" : "Sending Account",
									"seq" : "2",
									"code" : "accountNo"
								}, {
									"description" : "Company Entry Description",
									"seq" : "3",
									"code" : "referenceNo"
								}, {
									"description" : "Company Discriptionary Data",
									"seq" : "4",
									"code" : "discretionaryData"
								}, {
									"description" : "Control Total Required",
									"seq" : "5",
									"code" : "controlTotal"
								}, {
									"description" : "Total Count",
									"seq" : "6",
									"code" : "totalNo"
								}, {
									"description" : "Total Amount",
									"seq" : "7",
									"code" : "amount"
								}, {
									"description" : "Reciever Detail",
									"seq" : "8",
									"code" : "drawerCode"
								}, {
									"description" : "Discriptionary Data",
									"seq" : "16",
									"code" : "discretionaryData"
								}, {
									"description" : "Transaction Reference",
									"seq" : "18",
									"code" : "referenceNo"
								}, {
									"description" : "Amount",
									"seq" : "20",
									"code" : "amount"
								}],
						"label" : "Lock Instruction",
						"displayMode" : "2"
					}, {
						"readOnly" : "false",
						"fieldName" : "companyId",
						"dataType" : "select",
						"availableValues" : [{
									"description" : "1244667 - Tax ID",
									"code" : "1244667"
								}],
						"label" : "Sending Company",
						"displayMode" : "3"
					}, {
						"readOnly" : "false",
						"fieldName" : "referenceNo",
						"dataType" : "text",
						"label" : "Payment Reference",
						"displayMode" : "2"
					}, {
						"readOnly" : "false",
						"fieldName" : "templateName",
						"dataType" : "text",
						"label" : "Template Name",
						"displayMode" : "3"
					}, {
						"readOnly" : "false",
						"fieldName" : "rateType",
						"dataType" : "select",
						"availableValues" : [{
									"description" : "Counter Rate",
									"code" : "0"
								}, {
									"description" : "Contract Rate",
									"code" : "1"
								}],
						"label" : "Rate Type",
						"displayMode" : "1"
					}, {
						"readOnly" : "false",
						"fieldName" : "contractRefNo",
						"dataType" : "text",
						"label" : "Contract Ref No",
						"displayMode" : "1"
					}],
			"paymentCompanyInfo" : {
				"company" : "Ford Motors US",
				"companyAddress" : "NYC, NYC, USNJ, US, 1234325"
			},
			"paymentFIInfo" : {
				"client" : "Ford Motors US",
				"corporation" : "Ford Motors US",
				"fi" : "USCASH"
			},
			"enrichments" : {
				"udeEnrichment" : {
					"dirtyRow" : false,
					"parameters" : [{
								"editable" : false,
								"parent" : false,
								"minLength" : 0,
								"enrichmentType" : "S",
								"enrichmentLength" : 0,
								"mandatory" : false,
								"displayType" : 0,
								"minValueExist" : false,
								"maxValueExist" : false,
								"validatable" : false,
								"includeInTotal" : "N",
								"sequenceNmbr" : 13,
								"storageSerial" : 0,
								"parentEnrichReq" : false,
								"enrichmentSetName" : "ADDITIONAL INFORMATION",
								"required" : false,
								"description" : "Additional Info 1",
								"dataType" : 11,
								"maxLength" : 35,
								"code" : "ADDLINFO1",
								"maxFractionDigits" : 0
							}, {
								"editable" : false,
								"parent" : false,
								"minLength" : 0,
								"enrichmentType" : "S",
								"enrichmentLength" : 0,
								"mandatory" : false,
								"displayType" : 0,
								"minValueExist" : false,
								"maxValueExist" : false,
								"validatable" : false,
								"includeInTotal" : "N",
								"sequenceNmbr" : 14,
								"storageSerial" : 0,
								"parentEnrichReq" : false,
								"enrichmentSetName" : "ADDITIONAL INFORMATION",
								"required" : false,
								"description" : "Additional Info 2",
								"dataType" : 11,
								"maxLength" : 35,
								"code" : "ADDLINFO2",
								"maxFractionDigits" : 0
							}, {
								"editable" : false,
								"parent" : false,
								"minLength" : 0,
								"enrichmentType" : "S",
								"enrichmentLength" : 0,
								"mandatory" : false,
								"displayType" : 0,
								"minValueExist" : false,
								"maxValueExist" : false,
								"validatable" : false,
								"includeInTotal" : "N",
								"sequenceNmbr" : 15,
								"storageSerial" : 0,
								"parentEnrichReq" : false,
								"enrichmentSetName" : "ADDITIONAL INFORMATION",
								"required" : false,
								"description" : "Additional Info 3",
								"dataType" : 11,
								"maxLength" : 35,
								"code" : "ADDLINFO3",
								"maxFractionDigits" : 0
							}, {
								"editable" : false,
								"parent" : false,
								"minLength" : 0,
								"enrichmentType" : "S",
								"enrichmentLength" : 0,
								"mandatory" : false,
								"displayType" : 0,
								"minValueExist" : false,
								"maxValueExist" : false,
								"validatable" : false,
								"includeInTotal" : "N",
								"sequenceNmbr" : 16,
								"storageSerial" : 0,
								"parentEnrichReq" : false,
								"enrichmentSetName" : "ADDITIONAL INFORMATION",
								"required" : false,
								"description" : "Additional Info 4",
								"dataType" : 11,
								"maxLength" : 35,
								"code" : "ADDLINFO4",
								"maxFractionDigits" : 0
							}],
					"labels" : ["Additional Info 1", "Additional Info 2",
							"Additional Info 3", "Additional Info 4",
							"Bank to Bank Information1", "Text",
							"Bank to Bank Information2", "Text",
							"Bank to Bank Information3", "Text",
							"Bank to Bank Information4", "Text",
							"Bank to Bank Information5", "Text",
							"Bank to Bank Information6", "Text",
							"Instruction Code 1", "Text", "Instruction Code 2",
							"Text", "Instruction Code 3", "Text",
							"Instruction Code 4", "Text", "Instruction Code 5",
							"Text", "Instruction Code 6", "Text"],
					"bankProduct" : "FEDWIRE",
					"profileId" : "BTOBINFO",
					"dirtyRowFlag" : "N",
					"version" : 1
				}
			}
		},
		"__metadata" : {
			"_applDate" : "10/15/2014",
			"_dateFormat" : "MM/dd/yyyy",
			"_jqueryDateFormat" : "mm/dd/yy",
			"_extDateFormat" : "m/d/Y",
			"_myproduct" : "PPDPLUS",
			"_serial" : 0,
			"_userLocale" : "en_US",
			"_cutoffTime" : "23:59:59",
			"_productCategory" : "ACH",
			"_myproductDescription" : "PPDPLUS",
			"_buttonMask" : "000000000",
			"_pirMode" : "TP",
			"_gridEntryEnabled" : "Y",
			"type" : "GCP.PaymentEntry"
		}
	}
};

var dummayAdditionalInfoJson = {
			"d" : {
				"hostMessage" : "hostMessage",
				"hostRefrence" : "hostRefrence",
				"authReversalApplicable" : "No",
				"importedFilesCount" : "5",
				"history" : [{
							"zone" : "GMT-05:00\u0000",
							"version" : 1,
							"userCode" : "Ford1 ",
							"phdClient" : "141016003L",
							"logNumber" : "15021700001LZ1",
							"logDate" : "02/16/2015",
							"pirNumber" : "150217000ARF",
							"pirSerial" : 0,
							"avmLevel" : 0,
							"recordKeyNo" : "150217000XB1",
							"requestState" : 0,
							"remarks" : "Rejected due to "
						},{
							"zone" : "GMT-05:00\u0000",
							"version" : 1,
							"userCode" : "Ford1 ",
							"phdClient" : "141016003L",
							"logNumber" : "15021700001LZ1",
							"logDate" : "02/16/2015",
							"pirNumber" : "150217000ARF",
							"pirSerial" : 0,
							"avmLevel" : 0,
							"recordKeyNo" : "150217000XB1",
							"requestState" : 0,
							"remarks" : "Rejected due to "
						}],
				"limitProfile" : "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
				"daysToScrap" : "34",
				"pendingApprovals" : "3",
				"fxProfile" : "Fx Profile",
				"approvalName" : "Approval Matrix",
				"enrichmentProfile" : "Enrichment Prof",
				"metadata" : {},
				"cutoffProfile" : "CutOff Profile 1"
			}
		};
		
var dummyApprovalInfoJson = {
			"d" : {
				"approvers" : 1,
				"matrixType" : "S",
				"rule" : "(USER1,USER2,USER3)",
				"name" : "SVMRULE1",
				"slabs" : [{
							"TYPE" : "1",
							"level" : 1,
							"checkers" : 5,
							"users" : "USER1, USER2, USER3"
						}],
				"metadata" : {}
			}
		};
var dummyImportedTxnDetailsJson = [{
				"fileName" : "aaaaxyz",
				"createdOn" : "11/25/2014",
				"totalinstruments" : "30",
				"totalAmount" : "3111,22,456",
				"totalrejected" : "2",
				"remarks" : "Completed"
			}, {
				"fileName" : "bbbpqr",
				"createdOn" : "07/03/2015",
				"totalinstruments" : "50",
				"totalAmount" : "265000",
				"totalrejected" : "-",
				"remarks" : "Aborted"
			}];	
			
var dummyLimitsPopupData = {	
  "d": {	
    "clientLimits": {	
	      "sectionLabel": "Ford Motors",
	      "categoryLimits": {
	
	        "code": "ACH",
	        "label": "ACH",
	        "transaction": {
	          "credit": "$11,111",
	          "debit": "$12,221"
	        },
	        "cumulative": {
	          "header": "Daily 04-Mar-2015",
	          "transferCreditLimit": "$11,111",
	          "transferCreditOS": "$11,111",
	          "warningCreditLimit": "$11,111",
	          "markWarningCreditLimit": "Y",
	          "warningCreditOS": "$11,111",
	          "markWarningCreditOS": "",
	          "transferDebitLimit": "$11,111",
	          "transferDebitOS": "$11,111",
	          "warningDebitLimit": "$11,111",
	          "markWarningDebitLimit": "Y",
	          "warningDebitOS": "$11,111",
	          "markWarningDebitOS": "N",
	          "transferCountLimit": "$11,111",
	          "transferCountOS": "$11,111"
	        }
	      },
	      "secCodeLimits": {
	        "code": "PPD",
	        "label": "PPD",
	        "transaction": {
	          "credit": "$11,111",
	          "debit": "$12,221"
	        },
	        "cumulative": {
	          "header": "Daily 04-Mar-2015",
	          "transferCreditLimit": "$11,111",
	          "transferCreditOS": "$11,111",
	          "warningCreditLimit": "$11,111",
	          "warningCreditOS": "$11,111",
	          "transferDebitLimit": "$11,111",
	          "transferDebitOS": "$11,111",
	          "warningDebitLimit": "$11,111",
	          "warningDebitOS": "$11,111",
	          "transferCountLimit": "$11,111",
	          "transferCountOS": "$11,111"
	        }
	      }      
	    },
  	
	
  "metadata": {	
    "date": "",	
    "refreshurl": ""	
  }	
}};			

var objFxRateJson = {
	"d" : {
		"fxRate" : "1.80",
		"debitAmount" : "414.00",
		"currencyPair" : "GBP-USD",
		"changedFxRate" : "1.82",
		"changedPaymentAmount" : "227.47", // either changedPaymentAmount or changedDebitAmount will be received
		"changedDebitAmount" : "333.44",
		"metadata" : {}
	}
};
