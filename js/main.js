;(function(){
	const CAMERA_POSITION = 500;


	var Game = function() {
		var self 			= this,
				click			= false,
				mouseY 		= 0,
				mouseX 		= 0,
				pause			= false,
				sceneSize = {w: window.innerWidth, h: window.innerHeight},
				scene 		= new THREE.Scene(),
				camera 		= new THREE.PerspectiveCamera( 75, sceneSize.w / sceneSize.h, 1, 10000 ),
				renderer 	= new THREE.WebGLRenderer({antialias: true}),
				controls;

		var init = function () {
			


			controls = new THREE.OrbitControls( camera );
			controls.damping = 0.1;
			controls.addEventListener( 'change', render );


			renderer.setSize( sceneSize.w, sceneSize.h );

			// renderer.shadowMap.enabled = true;
			// renderer.shadowMap.type = THREE.BasicShadowMap;

			document.body.appendChild( renderer.domElement );

			// Events
			document.addEventListener('mousemove', function (event) {
				mouseY = parseInt(event.offsetY);
				mouseX = parseInt(event.offsetX);
			});

			document.addEventListener('keyup', function (event) {
				console.log(event.keyCode);
				// spacebar
				if (event.keyCode == 32)
				{
					if (pause) pause = false;
					else pause = true;
					// pause = pause || true;
				}
			});

			/*document.addEventListener('mousedown', function(event) {
				click = true;
			});

			document.addEventListener('mouseup', function() {
				click = false;
			});*/
		}
		
		var sun = planet(50, 80, 80, 'img/texture_sun.jpg');
		var mercury = planet(3, 80, 80, 'img/mercurymap.jpg');
		var venus = planet(5, 80, 80, 'img/venusmap.jpg');
		var earth = planet(6, 80, 80, 'img/earthmap1k.jpg');
		var mars = planet(4, 80, 80, 'img/mars_1k_color.jpg');
		var jupiter = planet(20, 80, 80, 'img/jupitermap.jpg');
		var saturn = planet(15, 80, 80, 'img/saturnmap.jpg');
		var uranus = planet(10, 80, 80, 'img/uranusmap.jpg');
		var neptune = planet(8, 80, 80, 'img/neptunemap.jpg');


		var mercuryOrbit = new Orbit(65);
		mercuryOrbit.draw(scene);

		var venusOrbit = new Orbit(80);
		venusOrbit.draw(scene);

		var earthOrbit = new Orbit(120);
		earthOrbit.draw(scene);

		var marsOrbit = new Orbit(140);
		marsOrbit.draw(scene);

		var jupiterOrbit = new Orbit(200);
		jupiterOrbit.draw(scene);

		var saturnOrbit = new Orbit(280);
		saturnOrbit.draw(scene);

		var uranusOrbit = new Orbit(340);
		uranusOrbit.draw(scene);

		var neptuneOrbit = new Orbit(370);
		neptuneOrbit.draw(scene);

		sun.material.emissive.set(0xCAAA33); // read doc
		sun.material.emissiveMap = sun.material.map; // read doc

		light = new THREE.PointLight(0xfcd440, 2, 8000);
		light.castShadow = true;
		light.shadowCameraNear = 1;
		light.shadowCameraFar = 30;
		light.shadowCameraVisible = true;
		light.shadowMapWidth = 2048;
		light.shadowMapHeight = 1024;
		light.shadowBias = 0.01;
		light.shadowDarkness = 0.5;


    sun.add(light);

		scene.add(sun);
		scene.add(mercury);
		scene.add(venus);
		scene.add(earth);
		scene.add(mars);
		scene.add(jupiter);
		scene.add(saturn);
		scene.add(uranus);
		scene.add(neptune);


				


		// var light = new THREE.PointLight( 0xffffbb, 1.5, 10000, 1 );
		// light.position.set( 0, 0, 0 );
		// light.castShadow = true;


		var ambient = new THREE.AmbientLight(0x404040);
    scene.add(ambient);

		camera.position.z = CAMERA_POSITION;
		camera.position.y = CAMERA_POSITION / 2;

		var t = 0;

		var update = function() {


			sun.rotation.y += 0.001;
				mercury.rotation.y += 0.01;
				venus.rotation.y += 0.02;
				earth.rotation.y += 0.015;
				mars.rotation.y += 0.01;
				jupiter.rotation.y += 0.01;
				saturn.rotation.y += 0.01;
				uranus.rotation.y += 0.01;
				neptune.rotation.y += 0.01;
			
			if (!pause)
			{
				

				mercury.position.x = Math.sin(t*0.25)*65;
				mercury.position.z = Math.cos(t*0.25)*65;

				venus.position.x = Math.sin(t*0.2)*80;
				venus.position.z = Math.cos(t*0.2)*80;

				earth.position.x = Math.sin(t*0.3)*120;
				earth.position.z = Math.cos(t*0.3)*120;

				mars.position.x = Math.sin(t*0.2)*140;
				mars.position.z = Math.cos(t*0.2)*140;

				jupiter.position.x = Math.sin(t*0.15)*200;
				jupiter.position.z = Math.cos(t*0.15)*200;

				saturn.position.x = Math.sin(t*0.12)*280;
				saturn.position.z = Math.cos(t*0.12)*280;

				uranus.position.x = Math.sin(t*0.05)*340;
				uranus.position.z = Math.cos(t*0.05)*340;

				neptune.position.x = Math.sin(t*0.02)*370;
				neptune.position.z = Math.cos(t*0.02)*370;
				
				//camera.lookAt(scene.position);

				t += Math.PI / 180 * 2;
			}
		}

		var loop = function() {
			update();
			render();
			
			requestAnimationFrame(loop);
		}

		var render = function() {
			renderer.render( scene, camera );
		}

		init();
		loop();
		
	}	/*-- end Game --*/


	function planet (radius, wSeg,hSeg, textureUrl) {
		var planet, geometry, material, texture;

		var loader = new THREE.TextureLoader();

		texture = loader.load(textureUrl);
		texture.anisotropy = 100;

		geometry 	= new THREE.SphereGeometry(radius, wSeg, hSeg);
		material 	= new THREE.MeshPhongMaterial( {map: texture} );
		planet 		= new THREE.Mesh(geometry, material);

		planet.castShadow = true;
		// planet.receiveShadow = true;

		return planet;
	}


	// переписать, добавив к планетам
	var Orbit = function (radius) {
		this.radius = radius;

		this.draw = function (scene) {
			var geometry = new THREE.Geometry();
			var material = new THREE.PointsMaterial({
				color: 0xbbbbbb,
				size: 1,
				sizeAttenuation: false
			});

			for (var i = 0; i < 500; i++) {
				var vertex = new THREE.Vector3();

				vertex.x = Math.sin(Math.PI / 180 * i) * this.radius;
				vertex.z = Math.cos(Math.PI / 180 * i) * this.radius;

				geometry.vertices.push(vertex);
			}
			var orbita = new THREE.Points(geometry, material);
			scene.add(orbita);
		}

	}

	
	window.onload = function() {
		new Game();
	}

})();