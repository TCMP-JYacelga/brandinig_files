var SWEEP_QRY_RESULT_DEFAULT_COL_MODEL = [{
	"colId" : "MOVEMENT_REF_NMBR",
	"colDesc" : "Movement Reference #",
	"colHeader" : getLabel("movementref","Movement Reference #"),
	"sortable" : true,
	"colSequence" : 1,
	"width" : 170,
	"locked" : false,
	"hidden" : true,
	"hideable" : true
}, {
	"colId" : "DEBIT_ACCOUNT",
	"colDesc" : "Participating A/c (CCY)",
	"colHeader" : getLabel("participatingAcc","Participating A/c (CCY)"),
	"sortable" : true,
	"colSequence" : 2,
	"width" : 170,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "DEBIT_BANK",
	"colDesc" : "Participating A/c Bank",
	"colHeader" :getLabel("participatingAccBank","Participating A/c Bank"),
	"sortable" : true,
	"colSequence" : 3,
	"width" : 170,
	"locked" : false,
	"hidden" : false,
	"hideable" : false
}, {
	"colId" : "CREDIT_ACCOUNT",
	"colDesc" : "Contra A/c (CCY)",
	"colHeader" : getLabel("contraAccCcy","Contra A/c (CCY)"),
	"sortable" : true,
	"colSequence" : 4,
	"width" : 170,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "CREDIT_BANK",
	"colDesc" : "Contra A/c Bank",
	"colHeader" :getLabel("contraAccBank","Contra A/c Bank"),
	"sortable" : true,
	"colSequence" : 5,
	"width" : 170,
	"locked" : false,
	"hidden" : false,
	"hideable" : false
}, {
	"colId" : "AMNT_TRANSF",
	"colDesc" : "Movement Amount",
	"colType":"number",
	"colHeader" : getLabel("movementAmount","Movement Amount"),
	"sortable" : true,
	"colSequence" : 6,
	"width" : 170,
	"locked" : false,
	"hidden" : false,
	"hideable" : false
}, {
	"colId" : "MOVEMENT_STATUS",
	"colDesc" : "Movement Status",
	"colHeader" : getLabel("movementStatus","Movement Status"),
	"sortable" : true,
	"colSequence" : 7,
	"width" : 170,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "CLEARING_STATUS",
	"colDesc" : "Clearing Status",
	"colHeader" :getLabel("clearingStatus","Clearing Status"),
	"sortable" : true,
	"colSequence" : 8,
	"width" : 170,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "REASON_FOR_NON_EXEC",
	"colDesc" : "Remarks",
	"colHeader" : getLabel("remarks","Remarks") ,
	"sortable" : true,
	"colSequence" : 9,
	"width" : 170,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "AGREEMENT_CODE",
	"colDesc" : "Agreement Code",
	"colHeader" : getLabel("agreementCode","Agreement Code") ,
	"sortable" : true,
	"colSequence" : 10,
	"width" : 170,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}];