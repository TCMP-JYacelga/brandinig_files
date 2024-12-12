var INTERACCOUNT_LEDGER_COLUMN_MODEL=[				
                             				{
                             					"colId" : "POSITION_DATE",
                        						"colDesc" : getLabel( 'lblPositionDate', 'Date' ),
                            					"colHeader" : getLabel( 'lblPositionDate', 'Date' ),
                            					"locked"	: false,
                            					"hidden"	: false,
                            					"hideable"	: true,
                            					"colSequence":2,
                            					width : 140
                            				},		
                            				/*{
                            					"colId" : "OPENING_POSITION",
                        						"colDesc" : getLabel( 'lblDescription', 'Description' ),
                        						"colType" :"number",
                            					"colHeader" : getLabel( 'lblOpeningPosition', 'Opening Position' ),
                            					"locked"	: false,
                            					"hidden"	: false,
                            					"hideable"	: true,
                            					"colSequence":3,               					
                            					width : 100
                            				},*/
                            				{
                            					"colId" : "DR_CR",
                        						"colDesc" : getLabel( 'lblDebitCredit', 'Debit/Credit' ),
                        						"colType" :"number",
                            					"colHeader" : getLabel( 'lblMovementType', 'Movement Type' ),
                            					"locked"	: false,
                            					"hidden"	: false,
                            					"hideable"	: true,
                            					"colSequence":3,                            					
                            					width : 150
                            				},
                            				{
                            					"colId" : "AMOUNT",
                        						"colDesc" : getLabel( 'lblAmount', 'Amount' ),
                        						"colType" :"number",
                        						"colHeader" : getLabel( 'lblMovementAmount', 'Movement Amount' ),
                            					"locked"	: false,
                            					"hidden"	: false,
                            					"hideable"	: true,
                            					"colSequence":3,                            					
                            					width : 150
                            				}
                            				]