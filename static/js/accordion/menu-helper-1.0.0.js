/**
 * Function to navigate to the menu url preserving it's state. ie. Upon refresh the menu will show the exact same
 * panel expanded from whcih the menu item was last clicked.
 * @param mnuId - The id of the menu element being clicked.
 * @return Nothing
 */
function navigateTo(mnuId)
{
	createCookie("menuinfo", mnuId, 1);
	return true;
}

/**
 * Funcion to read the last selectd menu from cookie.
 * @return the last clicked menu item.
 */
function getLastMenu()
{
	var cookie = readCookie("menuinfo");
	if (null == cookie) return null;
	return cookie;
}