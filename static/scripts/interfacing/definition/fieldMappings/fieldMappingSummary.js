var objDefaultGridViewPref =
[
	{
		"pgSize" : 5,
		"gridCols" :
		[
			{
				"colId" : "checkMapping",
				"editor" : "false"
			},
			{
				"colId" : "interfaceField",
				"colDesc" : getLabel("destinationField","Destination Field"),
				"editor" : "false"
			},
			{
				"colId" : "dataType",
				"colDesc" : getLabel("dataType","Data Type"),
				"editor" : "false"
			},
			{
				"colId" : "length",
				"colDesc" : getLabel("maxSize","Max Size"),
				"editor" : "false",
				"colType" : "number"
			},
			{
				"colId" : "bandMappingDesc",
				"colDesc" : getLabel("mapping","Mapping"),
				"editor" : "false"
			},
			{
				"colId" : "mandatoryDesc",
				"colDesc" : getLabel("mandatory","Mandatory"),
				"editor" : "true",
				"colDataType" : "D"
			},
			{
				"colId" : "columnFormat",
				"colDesc" : getLabel("format","Format"),
				"editor" : "true",
				"colDataType" : "D"
			},
			{
				"colId" : "decimalValue",
				"colDesc" : getLabel("precision","Precision"),
				"editor" : "true",
				"colDataType" : "T",
				"colType" : "number"
			},
			{
				"colId" : "seqNmbr",
				"colDesc" : getLabel("sequence","Sequence"),
				"editor" : "true",
				"colDataType" : "T",
				"colType" : "number"
			},
			{
				"colId" : "size",
				"colDesc" : getLabel("sizeInFile","Size in File"),
				"editor" : "true",
				"colDataType" : "T",
				"colType" : "number"
			},
			{
				"colId" : "displayPath",
				"colDesc" : getLabel("path","Path"),
				"editor" : "false"
			}
		]
	}
];

var objDefaultZPGridViewPref =
[
	{
		"pgSize" : 5,
		"gridCols" :
		[
			{
				"colId" : "primeBand",
				"colDesc" : getLabel("primeBand","Prime Band")
			},
			{
				"colId" : "primeField",
				"colDesc" : getLabel("primeField","Prime Field")
			},
			{
				"colId" : "type",
				"colDesc" : getLabel("type","Type")
			},
			{
				"colId" : "sumBand",
				"colDesc" : getLabel("sourceBand","Source Band")
			},
			{
				"colId" : "sumField",
				"colDesc" : getLabel("sourceField","Source Field")
			}
		]
	}
];
