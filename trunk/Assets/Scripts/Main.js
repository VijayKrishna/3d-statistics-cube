#pragma strict
var replicationObject:GameObject;
var sizeX:int;
var sizeY:int;

function Start () {
	var positionX:int = 0;
	var positionY:int = 0;
	var positionZ:int = 20;
	for(var a:int = 0; a < sizeX; a++){
		for(var i:int = 0; i < sizeX; i++){
			for(var j:int = 0; j < sizeY; j++){
				var cube:GameObject = 
					Instantiate(replicationObject);
				cube.transform.position = new Vector3(positionX, positionY, positionZ);
				positionY+=5;
			}
			positionX+=5;
			positionY=0;
		
		}
		positionX=0;
		positionY=0;
		positionZ+=5;
	}
}

function Update () {

}