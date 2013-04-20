#pragma strict
#pragma downcast

var width:int = 100;
var height:int = 20;
var playerSpeed:int = 30;
var player:Transform;
private var playerStrafe:double = 1;

// DEFAULTS
// Some can be overriden by the Inspector
function Awake () {
	height = 20;
	width = 100;
	playerSpeed = 30;
	playerStrafe = 1;
	player = transform;

}

function Update () {
	if( (Input.GetKey(KeyCode.LeftArrow)||Input.GetKey(KeyCode.A)))
		player.Translate(Vector3(-playerStrafe,0, 0)*Time.deltaTime*playerSpeed);
		
	if( (Input.GetKey(KeyCode.RightArrow)||Input.GetKey(KeyCode.D)))
		player.Translate(Vector3(playerStrafe,0, 0)*Time.deltaTime*playerSpeed);
	
	if( (Input.GetKey(KeyCode.DownArrow)||Input.GetKey(KeyCode.S)))
		player.Translate(Vector3(0,0, -playerStrafe)*Time.deltaTime*playerSpeed);
		
	if( (Input.GetKey(KeyCode.UpArrow)||Input.GetKey(KeyCode.W)))
		player.Translate(Vector3(0,0, playerStrafe)*Time.deltaTime*playerSpeed);

	if(Input.GetKey(KeyCode.Q))
		player.Translate(Vector3(0,-playerStrafe,0)*Time.deltaTime*playerSpeed);
	
	if(Input.GetKey(KeyCode.E))
		player.Translate(Vector3(0,playerStrafe,0)*Time.deltaTime*playerSpeed);
		
	
	if(Input.GetAxis("Mouse ScrollWheel") < 0)
		player.Translate(Vector3(0,-playerStrafe,0)*Time.deltaTime*playerSpeed);
		
	if(Input.GetAxis("Mouse ScrollWheel") > 0)
		player.Translate(Vector3(0,playerStrafe,0)*Time.deltaTime*playerSpeed);
	
	// Player boundary checks
	player.position.x = Mathf.Clamp(player.position.x, 0, width);
	player.position.z = Mathf.Clamp(player.position.z, 0, width);
	player.position.y = Mathf.Clamp(player.position.y, 0, height);
}

