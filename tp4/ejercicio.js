// <============================================ EJERCICIOS ============================================>
// a) Implementar la función:
//
//      GetModelViewProjection( projectionMatrix, translationX, translationY, translationZ, rotationX, rotationY )
//
//    Si la implementación es correcta, podrán hacer rotar la caja correctamente (como en el video). IMPORTANTE: No
//    es recomendable avanzar con los ejercicios b) y c) si este no funciona correctamente. 
//
// b) Implementar los métodos:
//
//      setMesh( vertPos, texCoords )
//      swapYZ( swap )
//      draw( trans )
//
//    Si la implementación es correcta, podrán visualizar el objeto 3D que hayan cargado, asi como también intercambiar 
//    sus coordenadas yz. Para reenderizar cada fragmento, en vez de un color fijo, pueden retornar: 
//
//      gl_FragColor = vec4(1,0,gl_FragCoord.z*gl_FragCoord.z,1);
//
//    que pintará cada fragmento con un color proporcional a la distancia entre la cámara y el fragmento (como en el video).
//    IMPORTANTE: No es recomendable avanzar con el ejercicio c) si este no funciona correctamente. 
//
// c) Implementar los métodos:
//
//      setTexture( img )
//      showTexture( show )
//
//    Si la implementación es correcta, podrán visualizar el objeto 3D que hayan cargado y su textura.
//
// Notar que los shaders deberán ser modificados entre el ejercicio b) y el c) para incorporar las texturas.  
// <=====================================================================================================>



// Esta función recibe la matriz de proyección (ya calculada), una traslación y dos ángulos de rotación
// (en radianes). Cada una de las rotaciones se aplican sobre el eje x e y, respectivamente. La función
// debe retornar la combinación de las transformaciones 3D (rotación, traslación y proyección) en una matriz
// de 4x4, representada por un arreglo en formato column-major. El parámetro projectionMatrix también es 
// una matriz de 4x4 alamcenada como un arreglo en orden column-major. En el archivo project4.html ya está
// implementada la función MatrixMult, pueden reutilizarla. 

function GetModelViewProjection( projectionMatrix, translationX, translationY, translationZ, rotationX, rotationY )
{
	// [COMPLETAR] Modificar el código para formar la matriz de transformación.

	// Convertimos de radianes a grados
	let x = rotationX // * (Math.PI/180);
	let y = rotationY // * (Math.PI/180);

	// Matriz de traslación + rotacion
	var trans = [
		 Math.cos(y)            , 0           , -Math.sin(y)           , 0,
		 Math.sin(x)*Math.sin(y), Math.cos(x) , Math.sin(x)*Math.cos(y), 0,
		 Math.cos(x)*Math.sin(y), -Math.sin(x), Math.cos(x)*Math.cos(y), 0,
		 translationX           , translationY, translationZ           , 1
	];

	var mvp = MatrixMult( projectionMatrix, trans );
	return mvp;
}

// [COMPLETAR] Completar la implementación de esta clase.
class MeshDrawer
{
	// El constructor es donde nos encargamos de realizar las inicializaciones necesarias. 
	constructor()
	{
		// [COMPLETAR] inicializaciones

		// 1. Compilamos el programa de shaders
		this.prog  = InitShaderProgram( meshVS, meshFS );
		
		// 2. Obtenemos los IDs de las variables uniformes en los shaders
		this.pos = gl.getAttribLocation( this.prog, 'pos' );
		
		this.mvp = gl.getUniformLocation( this.prog, 'mvp' );

		this.swapVar = gl.getUniformLocation( this.prog, 'swapVar' );

		this.swapTexture = gl.getUniformLocation( this.prog, 'swapTexture' );
		// hack para que matchee con el estado inicial del front
		this.showTexture(true);

		this.textureCoordVS = gl.getAttribLocation( this.prog, 'textureCoordVS' );

		this.numTriangles = 0;
		
		this.buffer = gl.createBuffer();

		this.textureCoordBuffer = gl.createBuffer();

		// 3. Obtenemos los IDs de los atributos de los vértices en los shaders

		// 4. Obtenemos los IDs de los atributos de los vértices en los shaders

		// ...
	}
	
	// Esta función se llama cada vez que el usuario carga un nuevo archivo OBJ.
	// En los argumentos de esta función llegan un areglo con las posiciones 3D de los vértices
	// y un arreglo 2D con las coordenadas de textura. Todos los items en estos arreglos son del tipo float. 
	// Los vértices se componen de a tres elementos consecutivos en el arreglo vertexPos [x0,y0,z0,x1,y1,z1,..,xn,yn,zn]
	// De manera similar, las cooredenadas de textura se componen de a 2 elementos consecutivos y se 
	// asocian a cada vértice en orden. 
	setMesh( vertPos, texCoords )
	{
		// [COMPLETAR] Actualizar el contenido del buffer de vértices
		
		this.numTriangles = vertPos.length / 3 / 3;

		// coordenadas de vertices
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertPos), gl.STATIC_DRAW);
		
		// coordenadas de texturas
		gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
	}
	
	// Esta función se llama cada vez que el usuario cambia el estado del checkbox 'Intercambiar Y-Z'
	// El argumento es un boleano que indica si el checkbox está tildado
	swapYZ( swap )
	{
		// [COMPLETAR] Setear variables uniformes en el vertex shader
		gl.useProgram( this.prog );
		gl.uniform1i(this.swapVar, swap);
	}
	
	// Esta función se llama para dibujar la malla de triángulos
	// El argumento es la matriz de transformación, la misma matriz que retorna GetModelViewProjection
	draw( trans )
	{
		// [COMPLETAR] Completar con lo necesario para dibujar la colección de triángulos en WebGL
		// 1. Seleccionamos el shader
		gl.useProgram( this.prog );
	
		// 2. Setear matriz de transformacion
		gl.uniformMatrix4fv( this.mvp, false, trans );
		
	    // 3.Binding de los buffers
		// vertices
		gl.bindBuffer( gl.ARRAY_BUFFER, this.buffer );
		gl.vertexAttribPointer( this.pos, 3, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( this.pos );

		// texturas
		gl.bindBuffer( gl.ARRAY_BUFFER, this.textureCoordBuffer );
		gl.vertexAttribPointer( this.textureCoordVS, 2, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( this.textureCoordVS );
		
		// ...
		// Dibujamos
		gl.clear( gl.COLOR_BUFFER_BIT );
		gl.drawArrays( gl.TRIANGLES, 0, this.numTriangles * 3 );
	}
	
	// Esta función se llama para setear una textura sobre la malla
	// El argumento es un componente <img> de html que contiene la textura. 
	setTexture( img )
	{
		// [COMPLETAR] Binding de la textura
		gl.useProgram( this.prog );
		const textura = gl.createTexture();
		gl.bindTexture( gl.TEXTURE_2D, textura);
		gl.texImage2D(  gl.TEXTURE_2D, // Textura 2D
						0, // Mipmap nivel 0
						gl.RGB, // formato (en GPU)
						gl.RGB, // formato del input
						gl.UNSIGNED_BYTE, // tipo
						img // arreglo o <img>
		);
		gl.generateMipmap( gl.TEXTURE_2D );


		gl.activeTexture( gl.TEXTURE0 ); // digo que voy a usar la Texture Unit 0
		gl.bindTexture( gl.TEXTURE_2D, textura);


		this.sampler = gl.getUniformLocation(this.prog, 'texGPU' );
		gl.useProgram(this.prog);
		gl.uniform1i(this.sampler, 0 ); // Unidad 0
	}
	
	// Esta función se llama cada vez que el usuario cambia el estado del checkbox 'Mostrar textura'
	// El argumento es un boleano que indica si el checkbox está tildado
	showTexture( show )
	{
		// [COMPLETAR] Setear variables uniformes en el fragment shader
		gl.useProgram( this.prog );
		gl.uniform1i(this.swapTexture, show);
	}
}

// Vertex Shader
// Si declaras las variables pero no las usas es como que no las declaraste y va a tirar error. Siempre va punto y coma al finalizar la sentencia. 
// Las constantes en punto flotante necesitan ser expresadas como x.y, incluso si son enteros: ejemplo, para 4 escribimos 4.0
var meshVS = `
	attribute vec3 pos;
	uniform mat4 mvp;
	uniform bool swapVar;
	attribute vec2 textureCoordVS;
	varying vec2 textCoordFS;
	void main()
	{ 
		if(swapVar){
			vec3 swapPos;
			swapPos[0] = pos[1];
			swapPos[1] = pos[0];
			swapPos[2] = pos[2];
			gl_Position = mvp * vec4(swapPos,1);
		} else{
			gl_Position = mvp * vec4(pos,1);
		}
		textCoordFS = textureCoordVS;
	}
`;

// Fragment Shader
var meshFS = `
	precision mediump float;
	uniform sampler2D texGPU;
	varying vec2 textCoordFS;
	uniform bool swapTexture;
	void main()
	{	
		if(swapTexture){
			gl_FragColor = texture2D(texGPU, textCoordFS);	
		} else {
			gl_FragColor = vec4(1,0,gl_FragCoord.z*gl_FragCoord.z,1);
		}
	}
`;
