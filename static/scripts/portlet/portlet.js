function genHex()
{
	colors = new Array(14);
	colors[0] = "0";
	colors[1] = "1";
	colors[2] = "2";
	colors[3] = "3";
	colors[4] = "4";
	colors[5] = "5";
	colors[5] = "6";
	colors[6] = "7";
	colors[7] = "8";
	colors[8] = "9";
	colors[9] = "a";
	colors[10] = "b";
	colors[11] = "c";
	colors[12] = "d";
	colors[13] = "e";
	colors[14] = "f";

	digit = new Array(5);
	color = "";
	for (i = 0; i < 6; i++)
	{
		digit[i] = colors[Math.round(Math.random() * 14)];
		color = color + digit[i];
	}
	return color;
}