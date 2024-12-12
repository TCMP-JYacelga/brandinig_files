/*-----------------------------------------------------------------------------------------------------------------
 * FILE     : pagination.js
 * AUTHOR   : Prasad P. Khandekar
 * CREATED  : October 16, 2009 6:45 PM
 * COPYRIGHT: Copyright (c) 2009, Fundtech INDIA Ltd.
 * ----------------------------------------------------------------------------------------------------------------
 * ASSUMPTIONS:
 * 
 * 	1. Following global variables must be set in the referencing html page
 * 		a. _intCurPage - The current page number.
 * 		b. _intTotPages - The total number of pages.
 * 		c. _strErrFirst - The string containing localized error message to be displayed if user can not navigate to 
 * 						  the previous page.
 * 		d. _strErrLast - The string containing localized error message to be displayed if user can not navigate to
 * 						 the next page.
 *      e. _strErrNoFrm - The error message to be displayed if there is no suitable form available for posting
 * 	2. The name & id of the field used to post the current page number must be "txtCurrent"
 *---------------------------------------------------------------------------------------------------------------*/
/**
 * The function firstPage navigates to the very first page of the list.
 * @author Prasad P. Khandekar
 * @param strUrl The URL to navigate, can be null.
 * @param frmId the name of the input form to be posted.
 */
function firstPage(strUrl, frmId)
{
	var frm = null;
	var url = stripExtension(strUrl);

	// If form id is not passed then we default to frmMain 
	if (arguments.length >= 2)
		frm = document.getElementById(arguments[1]);
	else
		frm = document.getElementById('frmMain');

	if (null == frm)
	{
		alert(_strErrNoFrm);
		return;
	}
	
	if (_intCurPage > 1)
	{
		frm.action = url + "_first.form";
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}
	else
		alert(_strErrFirst);
}

/**
 * The function prevPage navigates to the previous page of the list.
 * @author Prasad P. Khandekar
 * @param strUrl The URL to navigate, can be null.
 * @param frmId the name of the input form to be posted.
 */
function prevPage(strUrl, frmId)
{
	var frm = null;
	var url = stripExtension(strUrl);

	// If form id is not passed then we default to frmMain 
	if (arguments.length >= 2)
		frm = document.getElementById(arguments[1]);
	else
		frm = document.getElementById('frmMain');
	if (null == frm)
	{
		alert(_strErrNoFrm);
		return;
	}

	if (_intCurPage > 1)
	{
		frm.action = url + "_previous.form";
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}
	else
		alert(_strErrFirst);
}

/**
 * The function nextPage navigates to the next page of the list.
 * @author Prasad P. Khandekar
 * @param strUrl The URL to navigate, can be null.
 * @param frmId the name of the input form to be posted.
 */
function nextPage(strUrl, frmId)
{
	var frm = null;
	var url = stripExtension(strUrl);

	// If form id is not passed then we default to frmMain 
	if (arguments.length >= 2)
		frm = document.getElementById(arguments[1]);
	else
		frm = document.getElementById('frmMain');
	if (null == frm)
	{
		alert(_strErrNoFrm);
		return;
	}

	if (_intCurPage < _intTotPages)
	{
		frm.action = url + "_next.form";
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}
	else
		alert(_strErrLast);
}

/**
 * The function lastPage navigates to the last page of the list.
 * @author Prasad P. Khandekar
 * @param strUrl The URL to navigate, can be null.
 * @param frmId the name of the input form to be posted.
 */
function lastPage(strUrl, frmId)
{
	var frm = null;
	var url = stripExtension(strUrl);

	// If form id is not passed then we default to frmMain 
	if (arguments.length >= 2)
		frm = document.getElementById(arguments[1]);
	else
		frm = document.getElementById('frmMain');
	if (null == frm)
	{
		alert(_strErrNoFrm);
		return;
	}

	if (_intCurPage < _intTotPages)
	{
		frm.action = url + "_last.form";
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}
	else
		alert(_strErrLast);
}

/**
 * The function lastPage navigates to the last page of the list.
 * @author Prasad P. Khandekar
 * @param ctrl The input box 
 * @param strUrl The URL to navigate, can be null.
 * @param frmId the name of the input form to be posted.
 */
function goToPage(ctrl, strUrl, frmId)
{
	var frm = null;
	var pgNmbr = ctrl.value;	
	if (isNaN(pgNmbr) || (pgNmbr > _intTotPages) || pgNmbr <= 0)
	{
		alert(_strInvalidPage);
		return;
	}
	// If form id is not passed then we default to frmMain 
	if (arguments.length >= 3)
		frm = document.getElementById(arguments[2]);
	else
		frm = document.getElementById('frmMain');
	if (null == frm)
	{
		alert(_strErrNoFrm);
		return;
	}

	var url = stripExtension(strUrl);
	frm.action = url + "_goto.form";
	frm.target = "";		
	frm.method = "POST";
	frm.submit();
}
